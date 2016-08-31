import { RouterConfig }          from '@angular/router';

import { AspNetUserListComponent } from './aspnet-user-list.component';
import { AspNetUserEditComponent } from './aspnet-user-edit.component';


export const AspNetUsersRoutes: RouterConfig = [
    { path: 'aspnetusers', component: AspNetUserListComponent }
    { path: 'aspnetusers/:id/edit', component: AspNetUserEditComponent }
];