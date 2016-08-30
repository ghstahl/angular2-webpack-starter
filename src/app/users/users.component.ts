import { Component ,OnInit,ChangeDetectorRef} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';
import { DataService } from '../shared/services/data.service';
import { ItemsService } from '../shared/utils/items.service';
import { NotificationService } from '../shared/utils/notification.service';
import { IUser } from '../shared/interfaces';
import { UserCardComponent } from './user-card.component';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Users` component loaded asynchronously');

@Component({
  selector: 'users',
  styles: [`
  `],
  templateUrl: 'users.component.html',
  directives: [UserCardComponent,SlimLoadingBarComponent]

})
export class Users implements OnInit {
  localState;

  public users: IUser[];
  addingUser: boolean = false;

  constructor(public route: ActivatedRoute,
              private ref: ChangeDetectorRef,
              private dataService: DataService,
              private itemsService: ItemsService,
              private notificationService: NotificationService,
              private slimLoader: SlimLoadingBarService) {

  }

  ngOnInit() {
    this.users = [];
    /*
    this.route
      .data
      .subscribe((data: any) => {
        // your resolved data from route
        this.localState = data.yourData;
      });
      */
    this.slimLoader.start();
    this.dataService.getUsers()
      .subscribe((res: IUser[]) => {
          this.users = res;
          this.slimLoader.complete();
          console.log(this.users);
          this.ref.detectChanges();
      },
        error => {
          this.slimLoader.complete();
          this.notificationService.printErrorMessage('Failed to load users. ' + error);
        });
    console.log('hello `Users` component');

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
  removeUser(user: any) {
    var _user: IUser = this.itemsService.getSerialized<IUser>(user.value);
    this.itemsService.removeItemFromArray<IUser>(this.users, _user);
    // inform user
    this.notificationService.printSuccessMessage(_user.name + ' has been removed');
  }

  userCreated(user: any) {
    var _user: IUser = this.itemsService.getSerialized<IUser>(user.value);
    this.addingUser = false;
    // inform user
    this.notificationService.printSuccessMessage(_user.name + ' has been created');
    console.log(_user.id);
    this.itemsService.setItem<IUser>(this.users, (u) => u.id == -1, _user);
    // todo fix user with id:-1
  }

  addUser() {
    this.addingUser = true;
    var newUser = { id: -1, name: '', avatar: 'avatar_05.png', profession: '', schedulesCreated: 0 };
    this.itemsService.addItemToStart<IUser>(this.users, newUser);
    //this.users.splice(0, 0, newUser);
  }

  cancelAddUser() {
    this.addingUser = false;
    this.itemsService.removeItems<IUser>(this.users, x => x.id < 0);
  }
}
