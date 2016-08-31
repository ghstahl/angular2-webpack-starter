"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var ng2_slim_loading_bar_1 = require('ng2-slim-loading-bar/ng2-slim-loading-bar');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var ng2_bootstrap_1 = require('ng2-bootstrap');
var data_service_1 = require('../shared/services/data.service');
var items_service_1 = require('../shared/utils/items.service');
var notification_service_1 = require('../shared/utils/notification.service');
var config_service_1 = require('../shared/utils/config.service');
var date_format_pipe_1 = require('../shared/pipes/date-format.pipe');
var AspNetUserListComponent = (function () {
    function AspNetUserListComponent(slimLoader, dataService, itemsService, notificationService, configService) {
        this.slimLoader = slimLoader;
        this.dataService = dataService;
        this.itemsService = itemsService;
        this.notificationService = notificationService;
        this.configService = configService;
        this.itemsPerPage = 9;
        this.totalItems = 0;
        this.currentPage = 1;
        this.items = ['item1', 'item2', 'item3'];
        this.selectedAspNetUserLoaded = false;
        this.index = 0;
        this.backdropOptions = [true, false, 'static'];
        this.animation = true;
        this.keyboard = true;
        this.backdrop = true;
    }
    AspNetUserListComponent.prototype.ngOnInit = function () {
        this.apiHost = this.configService.getApiHost();
        this.loadAspNetUsers();
    };
    AspNetUserListComponent.prototype.loadAspNetUsers = function () {
        var _this = this;
        this.slimLoader.start();
        this.dataService.getAspNetUsers(this.currentPage, this.itemsPerPage)
            .subscribe(function (res) {
            _this.users = res.Users; // IAspNetUsers;
            _this.totalItems = res.PageSize;
            _this.slimLoader.complete();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to load IAspNetUsers. ' + error);
        });
    };
    AspNetUserListComponent.prototype.pageChanged = function (event) {
        this.currentPage = event.page;
        this.loadAspNetUsers();
        //console.log('Page changed to: ' + event.page);
        //console.log('Number items per page: ' + event.itemsPerPage);
    };
    ;
    AspNetUserListComponent.prototype.viewScheduleDetails = function (id) {
        this.selectedAspNetUserId = id;
        this.modal.open('lg');
        console.log('test');
    };
    AspNetUserListComponent.prototype.closed = function () {
        this.output = '(closed) ' + this.selected;
    };
    AspNetUserListComponent.prototype.dismissed = function () {
        this.output = '(dismissed)';
    };
    AspNetUserListComponent.prototype.opened = function () {
        var _this = this;
        this.slimLoader.start();
        this.dataService.getAspNetUserDetails(this.selectedAspNetUserId)
            .subscribe(function (res) {
            _this.aspNetUserDetails = _this.itemsService.getSerialized(res);
            _this.slimLoader.complete();
            _this.selectedAspNetUserLoaded = true;
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
        });
        this.output = '(opened)';
    };
    __decorate([
        core_1.ViewChild('modal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], AspNetUserListComponent.prototype, "modal", void 0);
    AspNetUserListComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-aspnet-users',
            templateUrl: 'aspnet-user-list.component.html',
            directives: [router_1.ROUTER_DIRECTIVES, ng2_bs3_modal_1.MODAL_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES],
            pipes: [date_format_pipe_1.DateFormatPipe],
            animations: [
                core_1.trigger('flyInOut', [
                    core_1.state('in', core_1.style({ opacity: 1, transform: 'translateX(0)' })),
                    core_1.transition('void => *', [
                        core_1.style({
                            opacity: 0,
                            transform: 'translateX(-100%)'
                        }),
                        core_1.animate('0.5s ease-in')
                    ]),
                    core_1.transition('* => void', [
                        core_1.animate('0.2s 10 ease-out', core_1.style({
                            opacity: 0,
                            transform: 'translateX(100%)'
                        }))
                    ])
                ])
            ]
        }), 
        __metadata('design:paramtypes', [ng2_slim_loading_bar_1.SlimLoadingBarService, data_service_1.DataService, items_service_1.ItemsService, notification_service_1.NotificationService, config_service_1.ConfigService])
    ], AspNetUserListComponent);
    return AspNetUserListComponent;
}());
exports.AspNetUserListComponent = AspNetUserListComponent;
//# sourceMappingURL=aspnet-user-list.component.js.map