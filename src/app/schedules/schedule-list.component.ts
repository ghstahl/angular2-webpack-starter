import { Component, OnInit,ChangeDetectorRef, ViewChild, Input, Output,
  trigger,
  state,
  style,
  animate,
  transition} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {PAGINATION_DIRECTIVES, PaginationComponent } from 'ng2-bootstrap';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { ISchedule, IScheduleDetails, Pagination, PaginatedResult } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

import { ActivatedRoute } from '@angular/router';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`ScheduleListComponent` component loaded asynchronously');

@Component({
  selector: 'app-schedules',
  directives: [ROUTER_DIRECTIVES, MODAL_DIRECTIVES, PAGINATION_DIRECTIVES],
  styles: [`
  `],
  templateUrl: 'schedule-list.component.html',
  pipes: [DateFormatPipe],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1, transform: 'translateX(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)'
        }),
        animate('0.5s ease-in')
      ]),
      transition('* => void', [
        animate('0.2s 10 ease-out', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})
export class ScheduleListComponent implements OnInit {
  localState;
  schedules: ISchedule[];
  apiHost: string;

  public itemsPerPage: number = 2;
  public totalItems: number = 0;
  public currentPage: number = 1;

  // Modal properties
  @ViewChild('modal')
  modal: ModalComponent;
  items: string[] = ['item1', 'item2', 'item3'];
  selected: string;
  output: string;
  selectedScheduleId: number;
  scheduleDetails: IScheduleDetails;
  selectedScheduleLoaded: boolean = false;
  index: number = 0;
  backdropOptions = [true, false, 'static'];
  animation: boolean = true;
  keyboard: boolean = true;
  backdrop: string | boolean = true;

  constructor(public route: ActivatedRoute,
              private ref: ChangeDetectorRef,
              private slimLoader: SlimLoadingBarService,
              private dataService: DataService,
              private itemsService: ItemsService,
              private notificationService: NotificationService,
              private configService: ConfigService) {

  }

  ngOnInit() {
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });
    this.apiHost = this.configService.getApiHost();
    this.loadSchedules();
    console.log('hello `ScheduleListComponent` component');
    // static data that is bundled
    // var mockData = require('assets/mock-data/mock-data.json');
    // console.log('mockData', mockData);
    // if you're working with mock data you can also use http.get('assets/mock-data/mock-data.json')
    // this.asyncDataWithWebpack();
  }
  asyncDataWithWebpack() {
    // you can also async load mock data with 'es6-promise-loader'
    // you would do this if you don't want the mock-data bundled
    // remember that 'es6-promise-loader' is a promise
    // var asyncMockDataPromiseFactory = require('es6-promise!assets/mock-data/mock-data.json');
    // setTimeout(() => {
    //
    //   let asyncDataPromise = asyncMockDataPromiseFactory();
    //   asyncDataPromise.then(json => {
    //     console.log('async mockData', json);
    //   });
    //
    // });
  }
  loadSchedules() {
    this.slimLoader.start();

    this.dataService.getSchedules(this.currentPage, this.itemsPerPage)
      .subscribe((res: PaginatedResult<ISchedule[]>) => {
          this.schedules = res.result;// schedules;
          this.totalItems = res.pagination.TotalItems;
          this.slimLoader.complete();
          console.log(this.schedules);
          this.ref.detectChanges();
        },
        error => {
          this.slimLoader.complete();
          this.notificationService.printErrorMessage('Failed to load schedules. ' + error);
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.loadSchedules();
    //console.log('Page changed to: ' + event.page);
    //console.log('Number items per page: ' + event.itemsPerPage);
  };

  removeSchedule(schedule: ISchedule) {
    this.notificationService.openConfirmationDialog('Are you sure you want to delete this schedule?',
      () => {
        this.slimLoader.start();
        this.dataService.deleteSchedule(schedule.id)
          .subscribe(() => {
              this.itemsService.removeItemFromArray<ISchedule>(this.schedules, schedule);
              this.notificationService.printSuccessMessage(schedule.title + ' has been deleted.');
              this.slimLoader.complete();
            },
            error => {
              this.slimLoader.complete();
              this.notificationService.printErrorMessage('Failed to delete ' + schedule.title + ' ' + error);
            });
      });
  }

  viewScheduleDetails(id: number) {
    this.selectedScheduleId = id;
    this.modal.open('lg');
    console.log('test');
  }

  closed() {
    this.output = '(closed) ' + this.selected;
  }

  dismissed() {
    this.output = '(dismissed)';
  }

  opened() {
    this.slimLoader.start();
    this.dataService.getScheduleDetails(this.selectedScheduleId)
      .subscribe((schedule: IScheduleDetails) => {
          this.scheduleDetails = this.itemsService.getSerialized<IScheduleDetails>(schedule);
          // Convert date times to readable format
          this.scheduleDetails.timeStart = new DateFormatPipe().transform(schedule.timeStart, ['local']);
          this.scheduleDetails.timeEnd = new DateFormatPipe().transform(schedule.timeEnd, ['local']);
          this.slimLoader.complete();
          this.selectedScheduleLoaded = true;
        },
        error => {
          this.slimLoader.complete();
          this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
        });

    this.output = '(opened)';
  }
}
