"use strict";
var aspnet_user_list_component_1 = require('./aspnet-user-list.component');
var aspnet_user_edit_component_1 = require('./aspnet-user-edit.component');
exports.AspNetUsersRoutes = [
    { path: 'aspnetusers', component: aspnet_user_list_component_1.AspNetUserListComponent },
    { path: 'aspnetusers/:id/edit', component: aspnet_user_edit_component_1.AspNetUserEditComponent }
];
//# sourceMappingURL=aspnet-users.routes.js.map