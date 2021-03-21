import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//guard
import {LoginGuard} from '../../login.guard';
import { PanelComponent } from './panel/panel.component';

//componentes

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tecnico'
    },
    children: [
      {
        path: '',
        redirectTo: 'inicio'
      },
      {
        path: 'inicio',
        component: PanelComponent,
        data: {
          title: 'Inicio'
        },
        canActivate:[LoginGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class TecnicoRoutingModule {}
