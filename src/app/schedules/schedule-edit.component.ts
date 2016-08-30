import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */
import { NgForm } from '@angular/forms';

import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { MappingService } from '../shared/utils/mapping.service';
import { ISchedule, IScheduleDetails, IUser } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';


console.log('`ScheduleEditComponent` component loaded asynchronously');

@Component({
  selector: 'app-schedule-edit',
  styles: [`
  `],
  template: `
    <h1>About</h1>
    <div>
      For hot module reloading run
      <pre>npm run start:hmr</pre>
    </div>
    <div>
      <h3>
        patrick@AngularClass.com
      </h3>
    </div>
    <pre>this.localState = {{ localState | json }}</pre>
  `,

  providers: [MappingService],
  pipes: [DateFormatPipe]
})
export class ScheduleEditComponent implements OnInit {
  localState;
  apiHost: string;
  id: number;
  schedule: IScheduleDetails;
  scheduleLoaded: boolean = false;
  statuses: string[];
  types: string[];
  private sub: any;

  constructor(public route: ActivatedRoute,
              private dataService: DataService,
              private itemsService: ItemsService,
              private notificationService: NotificationService,
              private configService: ConfigService,
              private mappingService: MappingService,
              private slimLoader: SlimLoadingBarService) {

  }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];
    this.apiHost = this.configService.getApiHost();
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });

    console.log('hello `ScheduleEditComponent` component');
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

}
