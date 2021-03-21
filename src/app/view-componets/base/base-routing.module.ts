import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//guard
import {LoginGuard} from '../../login.guard';

//componentes
import { PanelLayoutComponent } from './panel-layout/panel-layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Base'
    },
    children: [
      {
        path: '',
        redirectTo: 'inicio'
      },
      {
        path: 'inicio',
        component: PanelLayoutComponent,
        data: {
          title: 'Inicio'
        },
        canActivate:[LoginGuard]
      },
      {
        path:'chat',
        component:ChatComponent,
        canActivate:[LoginGuard]
      },
      {
        path:'perfil',
        component:PerfilComponent,
        canActivate:[LoginGuard]
      },
      {
        path: 'not-found',
        component: NotFoundComponent
      },
      {
        path: '**',
        redirectTo: 'not-found'
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
export class BaseRoutingModule {}
