import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { AdminUsersComponent } from './features/admin/admin-users.component';
import { ConnectionsComponent } from './features/connections/connections.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/auth/login.component';
import { MessagesComponent } from './features/messages/messages.component';
import { NotificationsComponent } from './features/notifications/notifications.component';
import { RegisterComponent } from './features/auth/register.component';
import { HomeComponent } from './features/public/home.component';
import { MyTrainingsComponent } from './features/trainings/my-trainings.component';
import { TrainingCreateComponent } from './features/trainings/training-create.component';
import { TrainingDetailComponent } from './features/trainings/training-detail.component';
import { TrainingsListComponent } from './features/trainings/trainings-list.component';
import { AppShellComponent } from './layouts/app-shell.component';
import { AuthShellComponent } from './layouts/auth-shell.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'auth',
    component: AuthShellComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', pathMatch: 'full', redirectTo: 'login' }
    ]
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'trainings/created', component: MyTrainingsComponent, data: { mode: 'created' } },
      { path: 'trainings/enrolled', component: MyTrainingsComponent, data: { mode: 'enrolled' } },
      { path: 'trainings/create', component: TrainingCreateComponent },
      { path: 'trainings/:id', component: TrainingDetailComponent },
      { path: 'trainings', component: TrainingsListComponent, pathMatch: 'full' },
      { path: 'connections', component: ConnectionsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'admin/users', component: AdminUsersComponent, canActivate: [adminGuard] },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'auth/login' }
];
