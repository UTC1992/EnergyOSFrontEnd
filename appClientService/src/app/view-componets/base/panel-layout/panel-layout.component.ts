import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { Orden } from '../../../models/orden';
import { InjectableAnimationEngine } from '@angular/platform-browser/animations/src/providers';
import { OrdenService } from '../../../services/orden.service';
import { TecnicoService } from '../../../services/tecnico.service';
import { ExcelServiceService } from '../../../services/excel-service.service';
import { Tecnico } from '../../../models/tecnico';
import { Observable } from 'rxjs';

import { LoginService } from '../../../services/login.service';

import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';

import { TableRecmanualComponent } from '../table-recmanual/table-recmanual.component';
import { TableActividadesComponent } from '../table-actividades/table-actividades.component';
import { TableEnviosComponent } from '../table-envios/table-envios.component';
import { AddCsvComponent } from '../add-csv/add-csv.component';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import Swal from 'sweetalert2';
import { Url } from '../../../models/Url';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD-MM-YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-panel-layout',
  templateUrl: './panel-layout.component.html',
  styleUrls: ['./panel-layout.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})

export class PanelLayoutComponent implements OnInit {
  url:Url= new Url();
  //url_export='http://pruebas.tiendanaturalecuador.online/api/export';
  //url_export='http://gestiondcyk.tecnosolutionscorp.com/api/export';
  url_export=this.url.baseDescargaExcel;
  //url_export='http://pruebascortes.tecnosolutionscorp.com/api/export';
  
  @ViewChild(TableRecmanualComponent) tablaRecManual: TableRecmanualComponent;
  @ViewChild(TableActividadesComponent) tablaActividades: TableActividadesComponent;
  @ViewChild(TableEnviosComponent) tablaEnvios: TableEnviosComponent;
  @ViewChild(AddCsvComponent) addArchivo: AddCsvComponent;

  recmanualesExcel: boolean;
  actividadesExcel: boolean;

  today:Date;
  fecha_consolidado='';
  loading:boolean;
  exportable:boolean;
  ordenes:Observable<Orden[]>; 
  public view_table:boolean;
  tecnicos:Observable<Tecnico[]>;
  public view_data_empty:boolean;
  id_emp='';
  fecha = new Date();

  //fecha de filtro
  fechaBuscar: string = null;
  tecnicoBuscar: string = 'empty';
  actividadBuscar: string = 'empty';
  estadoBuscar: string = 'empty';

  date = new FormControl(
    'date', [
      Validators.required
    ]
  );

  //consolidado
  fechaConsolidar: string = null;
  dateConsolidado = new FormControl(
    'date', [
      Validators.required
    ]
  );

  //consolidado
  fechaEnvio: string = null;
  dateEnvios = new FormControl(
    'date', [
      Validators.required
    ]
  );

  constructor(private ordenService:OrdenService, 
              private tecnicoService:TecnicoService,
              private excelService:ExcelServiceService,
              private adapter: DateAdapter<any>,
              private fb: FormBuilder,
              private loginService: LoginService
  ){
    this.view_table=false;
    this.view_data_empty=false;
   }

  ngOnInit() {
    Swal.close();
    this.tecnicos=this.tecnicoService.getTecnicosCortes();
    this.recmanualesExcel = false;
    this.actividadesExcel = false;
    this.french();
  }

  french() {
    this.adapter.setLocale('es');
  }

  getFecha(pickerInput: string): void {
    this.fechaBuscar = pickerInput;
    //console.log(this.fechaBuscar);
  }
  
  getFechaConsolidar(pickerInput: string): void {
    this.fechaConsolidar = pickerInput;
    //console.log(this.fechaConsolidar);
  }

  getFechaEnvios(pickerInput: string): void {
    this.fechaEnvio = pickerInput;
    //console.log(this.fechaEnvio);
  }

  getErrorMessage(pickerInput: string): string {
    if (!pickerInput || pickerInput === '' ) {
      return 'Please choose a date.';
    }
    return pickerInput;
  }

  exportarExcelActividades(){
    if(this.fechaBuscar != null){
      //console.log(this.fechaBuscar);
      var date = this.fechaBuscar;
      var vector = date.split("-");
      var fecha=vector[2]+"-"+vector[1]+"-"+vector[0];
      
      if(this.actividadesExcel==true){
        this.tablaActividades.exportarExcel(fecha);
      }else if(this.recmanualesExcel==true){
        this.tablaRecManual.exportarExcelRecManual(fecha);
      } else {
        this.showAlert("Información!", 
        "Debe mostrar los datos para descargarlos.", "info");
      }
    } else {
      this.showAlert("Alerta!", "Debe elegir una fecha y mostrar los datos para descargarlos.", "warning");
    }
    
      
  }


  //consolidar actividades diarias
  consolodarActividades(){
    ////console.log("fecha de consolidado ==> " + date);
    if(this.fechaConsolidar != null){
      this.showCargando();
      var date = this.fechaConsolidar;
      var vector = date.split("-");
      var fecha=vector[2]+"-"+vector[1]+"-"+vector[0];
      //this.loading=true;
      this.ordenService.consolidarActividades(fecha).subscribe(
        result=>{
          //console.log(result);
          if(result){
            this.fecha_consolidado=fecha;
            this.id_emp=this.loginService.usuario.id_emp;
            this.exportable=true;
            //this.loading = false;
            this.addArchivo.ngOnInit();
            this.showAlert("Éxito!","Actividades Consolidadas Correctamente", "success");
          }else{
            this.showAlert("Alert!",
            "Debe finalziar o eliminar todas las asignaciones pendientes para consolidar los datos.",
            "success");
            
          }
        }, error =>{
          Swal.close();
        }
      );
    }else{
      this.showAlert("Alerta!", "Debe elegir una fecha.", "warning");
    }
  }

  //exportar excel 
  /*exportarConsolidado(){
  //this.loading=true;
  this.spinner.show();
    var date = document.getElementsByName("fecha")[0]["value"]+"";
    var vector = date.split("-");
    var nombre_consolidado=vector[2]+"-"+vector[1]+"-"+vector[0]+"_Consolidado"
    ////console.log("fecha de consolidado ==> " + nombre_consolidado);
    this.ordenService.obtenerCosolidadosDelDia(date).subscribe(
      result=>{
        //this.loading = false;
        this.spinner.hide();
        this.excelService.exportAsExcelFile(result,nombre_consolidado);
        document.getElementsByName("fecha")[0]["value"] = "";
        this.exportable=false;
      });
  }
  */


  //exportar excel 
  exportarConsolidado(){
    this.showCargando();
    var id_emp=sessionStorage.getItem("id_emp");
    var date = this.fechaBuscar;
    if(date==""){
      this.showAlert("Alerta!", "Debe elegir una fecha.", "warning");
      return;
    }
    if(id_emp!=""){
      //alert('Ocurrio un error!');
      this.showAlert("Alerta!", "Ocurrio un error al exportar.", "warning");
      return;
    }

    this.url_export=this.url_export+'/'+date+'/'+id_emp;
  }

  verActividadesDiarias(){
    //ocultar las reconexiones manuales
    this.tablaRecManual.ocultarRecManuales();
    this.tablaRecManual.ocultarEmptyRecManuales();
    //bloquear descarga de recmanual
    this.recmanualesExcel = false;
    this.actividadesExcel = true;

    if(this.fechaBuscar != null){
      var vectorFecha = this.fechaBuscar.split('-');
      var fecha=vectorFecha[2]+"-"+vectorFecha[1]+"-"+vectorFecha[0];
      var tecnico = this.tecnicoBuscar;
      var actividad = this.actividadBuscar;
      var estado = this.estadoBuscar;
      //console.log(fecha);
      let dataActividades:any[] = [];
      dataActividades.push({
        'fecha':fecha,
        'id_tecn':tecnico,
        'actividad':actividad,
        'estado':estado
      });
      this.tablaActividades.cargarDatos(dataActividades);
      //console.log(dataActividades);
    }else{
      this.showAlert("Alerta!", "Debe elegir una fecha para mostrar los datos.", "warning");
    }
    
  }

  verRecManual(){
    if(this.fechaBuscar != null){
      var date = this.fechaBuscar;
      var vector = date.split("-");
      var fecha=vector[2]+"-"+vector[1]+"-"+vector[0];
      var tecnico = this.tecnicoBuscar;
      if(fecha){
        let dataRecManual={
            'fecha':fecha,
            'id_tecn':tecnico,
            }
            
        this.tablaActividades.ocultarActividades();
        this.tablaActividades.ocultarEmptyActividades();
        this.recmanualesExcel=true;
        this.actividadesExcel = false;
        this.tablaRecManual.cargarDatos(dataRecManual);
        //console.log(dataRecManual);
    }

    }else{
      this.showAlert("Alerta!", "Debe elegir una fecha para mostrar los datos.", "warning");
    }
    
  }

  mostrarEnvios(){
    if(this.fechaEnvio != null && this.dateEnvios.valid){
      var date = this.fechaEnvio;
      var vector = date.split("-");
      var fecha=vector[2]+"-"+vector[1]+"-"+vector[0];
      //console.log(fecha);
      if(fecha){
        this.tablaEnvios.cargarDatos(fecha);
      }
    }else{
      this.showAlert("Alerta!", "Debe elegir una fecha para mostrar los datos.", "warning");
    }
  }

  showAlert(title, text, type){
    let swal = Swal;
    swal.fire({
      title: title,
      text: text,
      type: type,
      allowOutsideClick: false,
      allowEscapeKey:false
    });
  }

  showCargando(){
    let swal = Swal;
    swal.fire({
      title: 'Espere por favor...',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey:false,
      onOpen: () => {
        Swal.showLoading();
      }
    });
  }

}
