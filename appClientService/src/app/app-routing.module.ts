import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './shared/layout/layout.component';
import { LoginComponent } from './view-componets/login/login.component';

import {LoginGuard} from './login.guard';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full'
  },
  { 
    path: 'login',
    component:LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'base',
        loadChildren: './view-componets/base/base.module#BaseModule'
      },
    ],
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'lecturas',
        loadChildren: './view-componets/lectura/lectura.module#LecturaModule'
      },
    ],
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'tecnico',
        loadChildren: './view-componets/tecnico/tecnico.module#TecnicoModule'
      },
    ],
    canActivate: [LoginGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
