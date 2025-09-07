import { Routes } from '@angular/router';
import {HomePage} from './info-system/home-page/home-page';
import {ActorsList} from './info-system/actors/actors-list/actors-list';
import {ActorUpdate} from './info-system/actors/actor-update/actor-update';
import {PerformancesPage} from './info-system/performances/performances-page/performances-page';
import {ContractsPage} from './info-system/contracts/contracts-page/contracts-page';
import {Auth} from './info-system/auth/auth';
import {authGuard} from './guard/auth-guard';
import {authWithoutRoleGuard} from './guard/auth-without-role-guard';




export const routes: Routes = [

  {path: '', component: HomePage},
  // auth route
  {path: 'auth/:mode', component:Auth},
  // admin routes
  {path: 'actors', component: ActorsList, canActivate : [authGuard(['admin'])]},
  {path: 'actors/edit/:id', component: ActorUpdate, canActivate : [authGuard(['admin'])]},

  // admin + actor routes
  {path: 'performances', component: PerformancesPage, canActivate: [authWithoutRoleGuard]},
  {path: 'actors/:id/contracts', component: ContractsPage, canActivate : [authWithoutRoleGuard]},

];
