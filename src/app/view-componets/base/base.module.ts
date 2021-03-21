// Angular
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//ngx
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import {NgxPaginationModule} from 'ngx-pagination';
import { MatTableModule, MatToolbarModule, MatButtonModule, 
  MatSidenavModule, MatIconModule, MatListModule, 
  MatGridListModule, MatCardModule, MatMenuModule, 
  MatTabsModule, MatDatepickerModule, MatNativeDateModule, 
  MatTableDataSource, MatSelectModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe';
import {MatDialogModule, MatFormFieldModule} from "@angular/material";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

// Components Routing
import { BaseRoutingModule } from './base-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

//componentes
import { PanelLayoutComponent } from './panel-layout/panel-layout.component';
import { TableClientComponent } from './table-client/table-client.component';
import { AddCsvComponent } from './add-csv/add-csv.component';
import { ActividadesTecnicoComponent } from './actividades-tecnico/actividades-tecnico.component';
import { FooterComponent } from './footer/footer.component'; 
import { NotFoundComponent } from './not-found/not-found.component';
import { PerfilComponent } from './perfil/perfil.component';
import { AlertaDeleteComponent } from './alerta-delete/alerta-delete.component';
import { TableRecmanualComponent } from './table-recmanual/table-recmanual.component';
import { ChatComponent } from './chat/chat.component';
import { TableActividadesComponent } from './table-actividades/table-actividades.component';

//graficos ng2-charts
import { ChartsModule } from 'ng2-charts';
import { EstadisticasCortesComponent } from './estadisticas-cortes/estadisticas-cortes.component';
import { TableEnviosComponent } from './table-envios/table-envios.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    BaseRoutingModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    MatDialogModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    ChartsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ScrollDispatchModule
  ],
  declarations: [
    PanelLayoutComponent,
    TableClientComponent,
    AddCsvComponent,
    ActividadesTecnicoComponent,
    FooterComponent,
    NotFoundComponent,
    PerfilComponent,
    AlertaDeleteComponent,
    TableRecmanualComponent,
    ChatComponent,
    TableActividadesComponent,
    EstadisticasCortesComponent,
    TableEnviosComponent,
    
  ],
  exports: [
  ],
  providers: [
  ],
  entryComponents: [
    AlertaDeleteComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA, 
    CUSTOM_ELEMENTS_SCHEMA
  ]
  
})
export class BaseModule { }
