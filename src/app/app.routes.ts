import { Routes, RouterModule } from '@angular/router';
import { Home } from './home';
import { About } from './about';
import { NoContent } from './no-content';
import { Users } from './users';
import { DataResolver } from './app.resolver';
import {ScheduleListComponent} from './schedules'

import { ScheduleRoutes } from './schedules/schedule.routes';

export const ROUTES: Routes = [
  ...ScheduleRoutes,
  { path: '',      component: Home },
  { path: 'home',  component: Home },
  { path: 'about', component: About },
  { path: 'users', component: Users },
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
  },
  { path: '**',    component: NoContent },
];
