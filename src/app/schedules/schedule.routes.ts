import { Routes, RouterModule } from '@angular/router';

import { ScheduleListComponent } from './schedule-list.component';
import { ScheduleEditComponent } from './schedule-edit.component';

export const ScheduleRoutes: Routes = [
  { path: 'schedules', component: ScheduleListComponent },
  { path: 'schedules/:id/edit', component: ScheduleEditComponent }
];
