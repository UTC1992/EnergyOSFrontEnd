import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";
import { LecturasService } from '../../../services-lecturas/lecturas.service';
import { ValidacionService } from '../../../services-lecturas/validacion.service';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import Swal from 'sweetalert2';
//tabla
//tablas
import {MatTableDataSource, MatPaginator} from '@angular/material';

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
  selector: 'app-loadfile',
  templateUrl: './loadfile.component.html',
  styleUrls: ['./loadfile.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class LoadfileComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('fileInputRespaldo') fileInputRespaldo: ElementRef;

  formload: FormGroup;
  formloadRespaldo: FormGroup;

  //meses
  mesElegido: any = null;
  meses: any[] = [];

  //fecha borrado
  fechaBorrado: string = null;
  dateBorrado = new FormControl(
    'date', [
      Validators.required
    ]
  );

  //tabla sectores y procesos
  //tabla
  displayedColumns: string[] = ['index', 'agencia', 'validar_lecturas', 'calcular_consumos', 
                                'validar_consumos','lecturas_cero'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //agencias
  agenciasList: any[] = [];
  constructor(
    private formbuilder: FormBuilder,
    private lecturaService: LecturasService,
    private dateAdapter: DateAdapter<Date>,
    private validacionService: ValidacionService

  ) {
    this.dateAdapter.setLocale('es'); 
    this.createForm();
    this.createFormRespaldo();
  }

  ngOnInit() {
    this.llenarMeses();
    this.llenarAgencias();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  llenarMeses(){
    let mesesVector = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    for (let i = 0; i < 12; i++) {
      this.meses.push({
        numero: (i+1),
        nombre:mesesVector[i]
      });
    }
    //console.log(this.meses);
  }

  llenarAgencias(){
    this.agenciasList = [];
    let agencias = ['01','02','03','04','05','06','07','95'];
    let ciudades = ['Latacunga','Salcedo','Pujilí','Saquisilí','Sigchos','La Mana','Pangua','CENEL'];
    for (let i = 0; i < agencias.length; i++) {
      this.agenciasList.push({
        numero: agencias[i],
        agencia: ciudades[i]
      });
    }
    this.dataSource = new MatTableDataSource(this.agenciasList);
    this.dataSource.paginator = this.paginator;
  }

  getFechaBorrar(pickerInput: string): void {
    this.fechaBorrado = pickerInput;
    ////console.log(this.fechaBuscar);
  }

  createForm() {
    //formulario para rutas
    this.formload = this.formbuilder.group({
      archivo: [null],
      mes:[null]
    });
  }

  createFormRespaldo() {
    //formulario para respaldo
    this.formloadRespaldo = this.formbuilder.group({
      respaldo: [null]
    });
  }

  /**
   * Subir respaldo
   */
  onSubmit(){
    //console.log(this.formload.value);
    if(this.formload.get('archivo').value==null || this.formload.get('archivo').value==""){
      this.showAlert('Alerta!',"Seleccione un archivo",'warning');
      return;
    }
    if(this.formload.get('mes').value==null || this.formload.get('mes').value==""){
      this.showAlert('Alerta!',"Seleccione un mes",'warning');
      return;
    }
    this.showCargando();
    const formModel = this.prepareSave();
    this.lecturaService.uploadFile(formModel).subscribe(result=>{
        //console.log(result);
        this.showAlert('Éxito','Datos subidos exitosamente','success');
        this.clearFile();
      }, error => {
        //console.log(error);
    });
    
  }

  /**
   * Subir respaldo
   */
  onSubmitRespaldo(){
    //console.log(this.formloadRespaldo.value);
    if(this.formloadRespaldo.get('respaldo').value==null || this.formloadRespaldo.get('respaldo').value==""){
      this.showAlert('Alerta!',"Seleccione un archivo de respaldo",'warning');
      return;
    }
    this.showCargando();
    const formModel = this.prepareSaveRespaldo();
    this.lecturaService.uploadFileRespaldo(formModel).subscribe(result=>{
        //console.log(result);
        this.showAlert('Éxito','Respaldo subido exitosamente','success');
        this.clearFileRespaldo();
      }, error => {
        //console.log(error);
    });
    
  }

  /**
   * asignar archivos para envio
   */
  prepareSave(): any {
    let input = new FormData();
    input.append('file', this.formload.get('archivo').value);
    input.append('mes', this.formload.get('mes').value);
    return input;
  }

  /**
   * asignar archivos para envio RESPALDO
   */
  prepareSaveRespaldo(): any {
    let input = new FormData();
    input.append('file', this.formloadRespaldo.get('respaldo').value);
    return input;
  }

  /**
   * limpiar datos de form ruta 
   */
  clearFile() {
    this.formload.get('archivo').setValue(null);
    this.formload.get('mes').setValue(null);
    this.fileInput.nativeElement.value = '';
  }

  /**
   * limpiar datos de form respaldo
   */
  clearFileRespaldo() {
    this.formloadRespaldo.get('respaldo').setValue(null);
    this.fileInputRespaldo.nativeElement.value = '';
  }

  /**
   * 
   * @param event 
   */
  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formload.get('archivo').setValue(file);
    }
  }

  /**
   * 
   * @param event 
   */
  onFileChangeRespaldo(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.formloadRespaldo.get('respaldo').setValue(file);
    }
  }

  enviarDatosATemporal(){
    this.showCargando();
    this.lecturaService.procesarDatosSubidos().subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Los datos se procesaron exitosamente","success");
    }, error => {
      this.showAlert("Error !","Error al procesar los datos","error");
      //console.log(error);
    });
  }

  calcularConsumos(agencia){
    this.showCargando();
    this.validacionService.calcularConsumos(agencia).subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Los consumos se han calculado exitosamente","success");
    }, error => {
      this.showAlert("Error !","Error al calcular consumos","error");
      //console.log(error);
    });
  }

  validarConsumos(agencia){
    this.showCargando();
    this.validacionService.validarConsumos(agencia).subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Los consumos se han validado exitosamente","success");
    }, error => {
      this.showAlert("Error !","Error al validar los consumos","error");
      //console.log(error);
    });
  }

  validarLecturasCero(agencia){
    this.showCargando();
    this.validacionService.validarLecturasCero(agencia).subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Las lecturas en cero validadas exitosamente","success");
    }, error => {
      this.showAlert("Error !","Error al validar las lecturas en cero","error");
      //console.log(error);
    });
  }

  validarLecturasMenor(agencia){
    this.showCargando();
    this.validacionService.validarLecturasMenores(agencia).subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Las lecturas menores se validaron","success");
    }, error => {
      this.showAlert("Error !","Error al validar las lecturas menores","error");
      //console.log(error);
    });
  }

  generarTemporalNuevoMes(){
    this.lecturaService.generarDataNuevoMes().subscribe(response => {
      //console.log(response);
    }, error => {

    });
  }

  eliminarRutaSubida(){
    this.lecturaService.truncateTableDeCobo().subscribe(response =>{
      //console.log(response);
      if(response){
        this.showAlert("Éxito !","Los datos se eliminarion éxitosamente","success");
      } else {
        this.showAlert("Alerta !","No se puedo eliminar los datos subidos","warning");
      }
      
    }, error => {
      //console.log("Error al eliminar la datos subidos");
    });
  }

  procesarCatastros(){
    this.showCargando();
    this.validacionService.procesarCatastros().subscribe(response => {
      //console.log(response);
      this.showAlert("Éxito !","Los catastros se procesaron","success");
    }, error => {
      this.showAlert("Error !","Error al procesar catastros","error");
      //console.log(error);
    });
  }

  confirmarEliminarRuta(){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se eliminará el archivo subido",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.eliminarRutaSubida();
      }
    });
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
