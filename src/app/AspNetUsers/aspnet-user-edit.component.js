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
var data_service_1 = require('../shared/services/data.service');
var items_service_1 = require('../shared/utils/items.service');
var notification_service_1 = require('../shared/utils/notification.service');
var config_service_1 = require('../shared/utils/config.service');
var mapping_service_1 = require('../shared/utils/mapping.service');
var date_format_pipe_1 = require('../shared/pipes/date-format.pipe');
var ng2_slim_loading_bar_1 = require('ng2-slim-loading-bar/ng2-slim-loading-bar');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var ng2_datetime_1 = require('ng2-datetime/ng2-datetime');
var AspNetUserEditComponent = (function () {
    function AspNetUserEditComponent(route, router, dataService, itemsService, notificationService, configService, mappingService, slimLoader) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.itemsService = itemsService;
        this.notificationService = notificationService;
        this.configService = configService;
        this.mappingService = mappingService;
        this.slimLoader = slimLoader;
        this.userLoaded = false;
        this.backdropOptions = [true, false, 'static'];
        this.animation = true;
        this.keyboard = true;
        this.backdrop = true;
        this.areRolesAvailable = false;
    }
    AspNetUserEditComponent.prototype.ngOnInit = function () {
        this.availableRoles = ['Developer', 'Administrator'];
        // (+) converts string 'id' to a number
        this.id = this.route.snapshot.params['id'];
        this.apiHost = this.configService.getApiHost();
        this.loadUserDetails();
    };
    AspNetUserEditComponent.prototype.recalcFilteredRoles = function () {
        var _this = this;
        this.filteredAvailableRoles = this.availableRoles.filter(function (item) {
            var arraycontainsturtles = (_this.aspNetUserDetails.Roles.indexOf(item) > -1);
            return !arraycontainsturtles;
        });
        this.areRolesAvailable = this.filteredAvailableRoles.length > 0;
    };
    AspNetUserEditComponent.prototype.loadUserDetails = function () {
        var _this = this;
        this.slimLoader.start();
        this.dataService.getAspNetUserDetails(this.id)
            .subscribe(function (res) {
            _this.aspNetUserDetails = _this.itemsService.getSerialized(res);
            _this.userLoaded = true;
            _this.slimLoader.complete();
            _this.recalcFilteredRoles();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to load schedule. ' + error);
        });
    };
    AspNetUserEditComponent.prototype.updateAspNetUserRole = function (editAspNetUserRoleForm) {
        var _this = this;
        this.modal.close();
        console.log(editAspNetUserRoleForm.value);
        this.slimLoader.start();
        this.dataService.addAspNetUserRole(this.aspNetUserDetails.User.Id, editAspNetUserRoleForm.value.availableRole)
            .subscribe(function () {
            _this.notificationService.printSuccessMessage('Role has been added');
            _this.aspNetUserDetails.Roles.push(editAspNetUserRoleForm.value.availableRole);
            _this.recalcFilteredRoles();
            _this.slimLoader.complete();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
        });
    };
    AspNetUserEditComponent.prototype.removeRole = function (role) {
        var _this = this;
        this.dataService.removeAspNetUserRole(this.aspNetUserDetails.User.Id, role)
            .subscribe(function () {
            _this.notificationService.printSuccessMessage('Role has been removed');
            var index = _this.aspNetUserDetails.Roles.indexOf(role); // <-- Not supported in <IE9
            if (index !== -1) {
                _this.aspNetUserDetails.Roles.splice(index, 1);
            }
            _this.recalcFilteredRoles();
            _this.slimLoader.complete();
        }, function (error) {
            _this.slimLoader.complete();
            _this.notificationService.printErrorMessage('Failed to update schedule. ' + error);
        });
    };
    AspNetUserEditComponent.prototype.addRoleModal = function () {
        this.availableRole = null;
        this.recalcFilteredRoles();
        if (this.areRolesAvailable) {
            this.modal.open('lg');
        }
        console.log('test');
    };
    AspNetUserEditComponent.prototype.closed = function () {
        this.output = '(closed)';
    };
    AspNetUserEditComponent.prototype.dismissed = function () {
        this.output = '(dismissed)';
    };
    AspNetUserEditComponent.prototype.opened = function () {
        this.output = '(opened)';
    };
    AspNetUserEditComponent.prototype.back = function () {
        this.router.navigate(['/aspnetusers']);
    };
    __decorate([
        core_1.ViewChild('modal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], AspNetUserEditComponent.prototype, "modal", void 0);
    AspNetUserEditComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-schedule-edit',
            templateUrl: 'aspnet-user-edit.component.html',
            directives: [ng2_datetime_1.NKDatetime, ng2_bs3_modal_1.MODAL_DIRECTIVES],
            providers: [mapping_service_1.MappingService],
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
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, data_service_1.DataService, items_service_1.ItemsService, notification_service_1.NotificationService, config_service_1.ConfigService, mapping_service_1.MappingService, ng2_slim_loading_bar_1.SlimLoadingBarService])
    ], AspNetUserEditComponent);
    return AspNetUserEditComponent;
}());
exports.AspNetUserEditComponent = AspNetUserEditComponent;
//# sourceMappingURL=aspnet-user-edit.component.js.map