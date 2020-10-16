import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { MatTableModule, MatToolbarModule, 
  MatButtonModule, MatSidenavModule, MatIconModule, 
  MatListModule, MatGridListModule, MatCardModule, 
  MatMenuModule, MatDatepickerModule, MatNativeDateModule, 
  MatTableDataSource, MatSelectModule, MatInputModule, MatRadioModule } from '@angular/material';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { Routes,RouterModule } from '@angular/router';
import { WelcomeComponent } from './view-componets/welcome/welcome.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter'; //importing the module
import { Ng2OrderModule } from 'ng2-order-pipe';
import {NgxPaginationModule} from 'ngx-pagination';

import {MatDialogModule, MatFormFieldModule} from "@angular/material";
import { AppRoutingModule } from './app-routing.module';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';

import {
  SharedModule,
  LayoutComponent
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';

import { LoginComponent } from './view-componets/login/login.component';

//INTERCEPTORS
import { HttpClient, HttpHeaders, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';

//datapiker
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';

//graficos ng2-charts
import { ChartsModule } from 'ng2-charts';

//firebase
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { MessagingService } from './shared/messaging.service';
import { environment } from '../environments/environment.prod';
import { AsyncPipe } from '../../node_modules/@angular/common';

//notificaciones
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    WelcomeComponent,
    LoginComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    rootRouting,
    ModalModule.forRoot(),
    LayoutModule,
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
    SharedModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    ChartsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    ScrollDispatchModule,
    MatRadioModule,

    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireMessagingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),

    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule,
    BsModalRef,
    HttpClient,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    MessagingService, 
    AsyncPipe,
  ],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ]
  
})
export class AppModule { }
