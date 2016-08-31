import { Component, OnInit, ChangeDetectorRef,ViewChild, Input, Output,
    trigger,
    state,
    style,
    animate,
    transition } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {PAGINATION_DIRECTIVES, PaginationComponent } from 'ng2-bootstrap';

import { IdentityService } from '../shared/services/identity.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import {IAspNetUser, AspNetUsersPaginatedResult,IAspNetUserDetails,  IScheduleDetails, Pagination, PaginatedResult } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

@Component({
    moduleId: module.id,
    selector: 'app-aspnet-users',
    templateUrl: 'aspnet-user-list.component.html',
    directives: [ROUTER_DIRECTIVES, MODAL_DIRECTIVES, PAGINATION_DIRECTIVES],
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
export class AspNetUserListComponent implements OnInit {

    users: IAspNetUser[];
    apiHost: string;

    public itemsPerPage: number = 9;
    public totalItems: number = 0;
    public currentPage: number = 1;

    // Modal properties
    @ViewChild('modal')
    modal: ModalComponent;
    items: string[] = ['item1', 'item2', 'item3'];
    selected: string;
    output: string;
    selectedAspNetUserId: string;
    aspNetUserDetails: IAspNetUserDetails;
    selectedAspNetUserLoaded: boolean = false;
    index: number = 0;
    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;

    constructor(private slimLoader: SlimLoadingBarService,
                private ref: ChangeDetectorRef,
        private dataService: IdentityService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService) { }

    ngOnInit() {
        this.apiHost = this.configService.getApiHost();
        this.loadAspNetUsers();
    }

    loadAspNetUsers() {
        this.slimLoader.start();

        this.dataService.getAspNetUsers(this.currentPage, this.itemsPerPage)
            .subscribe((res: AspNetUsersPaginatedResult<IAspNetUser[]>) => {
                this.users = res.Users;// IAspNetUsers;
                this.totalItems = res.PageSize;
                this.slimLoader.complete();
                this.ref.detectChanges();
            },
            error => {
                this.slimLoader.complete();
                this.notificationService.printErrorMessage('Failed to load IAspNetUsers. ' + error);
            });
    }

    pageChanged(event: any): void {
        this.currentPage = event.page;
        this.loadAspNetUsers();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };


    viewScheduleDetails(id: string) {
        this.selectedAspNetUserId = id;
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
        this.dataService.getAspNetUserDetails(this.selectedAspNetUserId)
            .subscribe((res: IAspNetUserDetails) => {
                this.aspNetUserDetails = this.itemsService.getSerialized<IAspNetUserDetails>(res);
                this.slimLoader.complete();
                this.selectedAspNetUserLoaded = true;
            },
            error => {
                this.slimLoader.complete();
                this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
            });

        this.output = '(opened)';
    }
}
