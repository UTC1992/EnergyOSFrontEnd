import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { OrdenService } from '../../../services/orden.service';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { Observable } from 'rxjs';

import { TableClientComponent } from '../table-client/table-client.component';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { PermisosService } from '../../../services/permisos.service';
import {formatDate } from '@angular/common';

import Swal from 'sweetalert2';

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
  selector: 'app-add-csv',
  templateUrl: './add-csv.component.html',
  styleUrls: ['./add-csv.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AddCsvComponent implements OnInit {
  //subida de excel
  error: string;
  uploadResponse = { status: '', message: '', filePath: '' };
  progresoMostrar: boolean = false;
  
  @ViewChild(TableClientComponent) tablaCliente: TableClientComponent;

  today:Date;
  form: FormGroup;
  loading2: boolean = false;
  public loading:boolean;
  loadingRecManual: boolean = false;
  resultValida:Observable<any>;
  public validaReconexiones:boolean;

  //fecha borrado
  fechaBorrado: string = null;
  dateBorrado = new FormControl(
    'date', [
      Validators.required
    ]
  );
  serializedDate = new FormControl((new Date()).toUTCString());

  @ViewChild('fileInput') fileInput: ElementRef;
  constructor(
      private ordenService:OrdenService,
      private fb: FormBuilder,
      private dateAdapter: DateAdapter<Date>,
      private permisoPlan: PermisosService,
  ) {
    this.dateAdapter.setLocale('es'); 
    this.createForm();
    this.loading=false;
    this.validaReconexiones=false;
    this.today =new Date();
   }

  ngOnInit() {
    this.reloadTableClient();

    this.form = this.fb.group({
      archivo: ['']
    });
  }

  getFechaBorrar(pickerInput: string): void {
    this.fechaBorrado = pickerInput;
    ////console.log(this.fechaBuscar);
  }

  //metodo envia file al servidor    
  onSubmit(){
    this.showCargando();
    this.permisoPlan.getPlan().subscribe(response =>{
      ////console.log(response);
      let datos = response.find(x=>x.id_modulo == 'energy_cr');
      console.log(datos['fecha_fin']);
      let fecha = new Date();
      console.log(formatDate(fecha, "yyyy-MM-dd",'en'));
      let fechaActual = formatDate(fecha, "yyyy-MM-dd",'en');
      //obtener datos anio mes dia separados 
      let vectorActual = fechaActual.split('-');
      let vectorSuscripcion = datos['fecha_fin'].split('-');

      let fechaActualFormato = vectorActual[2]+"-"+vectorActual[1]+"-"+vectorActual[0];
      let fechaSuscripcionFormato = vectorSuscripcion[2]+"-"+vectorSuscripcion[1]+"-"+vectorSuscripcion[0];
      if(this.validate_fechaSuscripcion(fechaActualFormato,fechaSuscripcionFormato))
      {
        //console.log(this.validate_fechaSuscripcion(fechaActualFormato,fechaSuscripcionFormato));
        console.log("La fecha actual "+fechaActualFormato+" es superior a la fecha de suscripción "+fechaSuscripcionFormato);
        this.showAlert('Suscripción finalizada',"El periodo de suscripción a finalizado, "
        +"pongase en contacto con soporte técnico por favor.",'info'); 
        return
      }else{
        console.log("La fecha actual "+fechaActualFormato+" NO es superior a la fecha de suscripcion "+fechaSuscripcionFormato);
        if(this.form.get('archivo').value==null || this.form.get('archivo').value==""){
          this.showAlert('Alerta!',"Debe seleccionar un archivo para subirlo",'warning');
          return;
        }
        
        let input = new FormData();
        input.append('archivo', this.form.get('archivo').value);
    
        this.progresoMostrar = false;
    
        this.ordenService.addCsvFiles(input).subscribe( response=>{
          //console.log(response);
          this.showAlert('Éxito!',"Archivo subido correctamente",'success');
          this.clearFile();
          this.reloadTableClient();
        },
        error=>{
          //console.log(<any>error);
          this.showAlert('Alerta!',"Error, No se pudo subir el archivo", 'warning');
        });
      }

    });
    
  }

  validate_fechaSuscripcion(fechaActual,fechaSuscripcion) {
      let valuesActual = fechaActual.split("-");
      let valuesSuscripcion = fechaSuscripcion.split("-");

      // Verificamos que la fecha no sea posterior a la actual
      let dateActual = new Date(valuesActual[2],(valuesActual[1]-1),valuesActual[0]);
      //console.log(dateActual)
      let dateSuscripcion = new Date(valuesSuscripcion[2],(valuesSuscripcion[1]-1),valuesSuscripcion[0]);
      //console.log(dateSuscripcion)
      if(dateActual > dateSuscripcion)
      {
          return true;
      }
      return false;
  }

  reloadTableClient(){
    this.tablaCliente.cargarDatos();
  }

  createForm() {
    this.form = this.fb.group({
      archivo: null
    });
  }

  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('archivo').setValue(file);
    }
  }

  prepareSave(): any {
    let input = new FormData();
    input.append('archivo', this.form.get('archivo').value);
    return input;
  }

  //subir archivo al servidor 
  /*onSubmit1() {
    if(this.form.get('archivo').value==null || this.form.get('archivo').value==""){
      alert("Seleccione un archivo");
      return;
    }
    //this.loading = true;
    
    const formModel = this.prepareSave();
    //this.loading2 = true;
    this.ordenService.addCsvFiles(formModel)
    .subscribe(
      msj=>{
        if(msj){
          //this.loading = false;
          
          alert("Archivo subido correctamente");
          this.clearFile();
          this.reloadTableClient();
        }else{
          
          alert("Ocurrio un error");
        }
      }
    );
  }
  */

  clearFile() {
    this.form.get('archivo').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  validarRecManuales(){
    //this.loadingRecManual = true;
    
    this.resultValida=this.ordenService.validarReconexionesManuales();
    this.resultValida.subscribe(
      msj=>{
        if(msj){
          //this.loadingRecManual = false;
          
          this.showAlert('Éxito!',"Proceso realizado correctamente", 'success');
          this.reloadTableClient();
        }else{
          
          alert(msj);
        }
      });
  }

  confirmarEliminar(){
    if(this.fechaBorrado != null){
      Swal.fire({
        title: 'Alerta de ¡Borrado!',
        html: '<p>¿ Deseas borrar las actividades subidas en la fecha seleccionada ? <br>'
              +'Se eliminarán las asignaciones realizadas a los técnicos.<br>'
              +'Se eliminarán los envios realizados por los técnicos.<br>'
              +'NO se borraran las actividades que ya fueron consolidadas.<br>'
              +'Recuerda que el borrado es permanente.</p>',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¿Deseas borrar de todas formas?',
        allowOutsideClick: false
      }).then((result) => {
        if (result.value) {
          this.eliminarActividades();
        }
      });
    } else {
      this.showAlert("Info","Elija la fecha en que subio los datos.","warning");
    }
    
  }

  // eliminar actividades
  eliminarActividades(){
   
    if(this.fechaBorrado != null){
      var date = this.fechaBorrado;
      var vector = date.split("-");
      var fecha=vector[2]+"-"+vector[1]+"-"+vector[0];
      let data={
        'fecha':fecha
      }
      this.ordenService.deleteActivities(data).subscribe(
        result=>{
          //console.log(result);
          if(result){
            this.showAlert("Éxito!",'Actividades borradas correctamente',"success");
            this.reloadTableClient();
            //console.log(result);
            /*if(result == 'yaconsolidado'){
              //console.log(result);
              this.showAlert("Alerta!",'No se puede eliminar la ruta porque ya ha sido consolidada.',"warning");
              this.reloadTableClient();
            } else {
              //console.log(result);
              this.showAlert("Éxito!",'Actividades borradas correctamente',"success");
              this.reloadTableClient();
            }*/
            
          }else{
            this.showAlert("Alerta!",'No existen resgistros en esa fecha para borrarlos.',"warning");
            this.reloadTableClient();
          }
        }
      );
    }
    
  }

  showAlert(title, text, type){
    Swal.fire({
      title: title,
      text: text,
      type: type,
      allowOutsideClick: false
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
