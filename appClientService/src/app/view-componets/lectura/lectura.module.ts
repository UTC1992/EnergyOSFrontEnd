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
  MatTableDataSource, MatSelectModule, MatRadioModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe';
import {MatDialogModule, MatFormFieldModule} from "@angular/material";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

// Components Routing
import { LecturaRoutingModule } from './lectura-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';

//componentes
import { PanelComponent } from './panel/panel.component';

//graficos ng2-charts
import { ChartsModule } from 'ng2-charts';
import { LoadfileComponent } from './loadfile/loadfile.component';
import { DistribucionComponent } from './distribucion/distribucion.component';
import { ConsultasComponent } from './consultas/consultas.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    LecturaRoutingModule,
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
    MatRadioModule
  ],
  declarations: [
    PanelComponent,
    LoadfileComponent,
    DistribucionComponent,
    ConsultasComponent,
    ReporteComponent,
    ObservacionesComponent,
  ],
  exports: [
  ],
  providers: [
  ],
  entryComponents: [
    
  ],
  schemas: [
    NO_ERRORS_SCHEMA, 
    CUSTOM_ELEMENTS_SCHEMA
  ]
  
})
export class LecturaModule { }
