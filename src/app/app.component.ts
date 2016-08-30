/*
 * Angular 2 decorators and services
 */
import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import {SlimLoadingBarService, SlimLoadingBarComponent} from 'ng2-slim-loading-bar';


import { AppState } from './app.service';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  directives: [ROUTER_DIRECTIVES, SlimLoadingBarComponent],
  styleUrls: [
    './app.style.css'
  ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './app.component.html',

})
export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState,
    private slimLoader: SlimLoadingBarService
  ) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
