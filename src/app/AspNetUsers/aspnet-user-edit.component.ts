import { Component, OnInit,ChangeDetectorRef,ViewChild,Input, Output,
    trigger,
    state,
    style,
    animate,
    transition} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

import { IdentityService } from '../shared/services/identity.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { ConfigService } from '../shared/utils/config.service';
import { MappingService } from '../shared/utils/mapping.service';
import { IAspNetUserDetails } from '../shared/interfaces';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';

import {SlimLoadingBarService} from 'ng2-slim-loading-bar';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


@Component({
    moduleId: module.id,
    selector: 'app-schedule-edit',
    templateUrl: 'aspnet-user-edit.component.html',
    directives: [MODAL_DIRECTIVES],
    providers: [MappingService],
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
export class AspNetUserEditComponent implements OnInit {

    // Modal properties
    @ViewChild('modal')
    modal: ModalComponent;
    output: string;

    availableRole:string;
    availableRoles:string[];
    filteredAvailableRoles:string[];

    apiHost: string;
    id: string;
    aspNetUserDetails: IAspNetUserDetails;
    userLoaded: boolean = false;
    private sub: any;
    types: string[];

    backdropOptions = [true, false, 'static'];
    animation: boolean = true;
    keyboard: boolean = true;
    backdrop: string | boolean = true;
    areRolesAvailable:boolean = false;
    constructor(private route: ActivatedRoute,
                private ref: ChangeDetectorRef,
        private router: Router,
        private dataService: IdentityService,
        private itemsService: ItemsService,
        private notificationService: NotificationService,
        private configService: ConfigService,
        private mappingService: MappingService,
        private slimLoader: SlimLoadingBarService) { }

    ngOnInit() {
        this.availableRoles = ['Developer','Administrator'];
        // (+) converts string 'id' to a number
	    this.id = this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadUserDetails();
    }
    recalcFilteredRoles(){
        this.filteredAvailableRoles =  this.availableRoles.filter((item) => {
            var arraycontainsturtles = (this.aspNetUserDetails.Roles.indexOf(item) > -1);
            return !arraycontainsturtles;
        });
        this.areRolesAvailable = this.filteredAvailableRoles.length>0;
    }
    loadUserDetails() {
        this.slimLoader.start();
        this.dataService.getAspNetUserDetails(this.id)
            .subscribe((res: IAspNetUserDetails) => {
                    this.aspNetUserDetails = this.itemsService.getSerialized<IAspNetUserDetails>(res);
                    this.userLoaded = true;
                    this.slimLoader.complete();
                    this.recalcFilteredRoles();
                    this.ref.detectChanges();
                },
                error => {
                    this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
                });
    }
    updateAspNetUserRole(editAspNetUserRoleForm: NgForm) {
        this.modal.close();
        console.log(editAspNetUserRoleForm.value);
        this.slimLoader.start();
        this.dataService.addAspNetUserRole(
            this.aspNetUserDetails.User.Id,
            editAspNetUserRoleForm.value.availableRole)
            .subscribe(() => {
                    this.notificationService.printSuccessMessage('Role has been added');
                    this.aspNetUserDetails.Roles.push(editAspNetUserRoleForm.value.availableRole);
                    this.recalcFilteredRoles();
                    this.slimLoader.complete();
                },
                error => {
                    this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
                });

    }
    removeRole(role:string){

        this.dataService.removeAspNetUserRole(
            this.aspNetUserDetails.User.Id,
            role)
            .subscribe(() => {
                    this.notificationService.printSuccessMessage('Role has been removed');
                    var index = this.aspNetUserDetails.Roles.indexOf(role);    // <-- Not supported in <IE9
                    if (index !== -1) {
                        this.aspNetUserDetails.Roles.splice(index, 1);
                    }
                    this.recalcFilteredRoles();
                    this.slimLoader.complete();
                },
                error => {
                    this.slimLoader.complete();
                    this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
                });
    }

    addRoleModal() {
        this.availableRole = null;
        this.recalcFilteredRoles();
        if(this.areRolesAvailable){
            this.modal.open('lg');
        }
        console.log('test');
    }

    closed() {
        this.output = '(closed)' ;
    }

    dismissed() {
        this.output = '(dismissed)';
    }

    opened() {
        this.output = '(opened)';
    }
    back() {
        this.router.navigate(['/aspnetusers']);
    }

}
