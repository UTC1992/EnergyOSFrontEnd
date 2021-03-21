import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Observacion } from '../../../models/observacion';
import { ObservacionService } from '../../../services-lecturas/observacion.service';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService,  } from 'ngx-bootstrap/modal';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-observaciones',
  templateUrl: './observaciones.component.html',
  styleUrls: ['./observaciones.component.css']
})
export class ObservacionesComponent implements OnInit {

  displayedColumns: string[] = ['index', 'codigo', 'descripcion', 
                                'tipo', 'permitirlec', 'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  observacionesList: Observacion[] = [];

  //formulario
  formData: FormGroup;
  tipoAccion: any;
  tituloModal: any;
  observacionEdit: any;

  constructor(
    private observacionService:ObservacionService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
  ) { }

  ngOnInit() {
    this.getObservaciones();
    this.iniciarFormulario();
  }

  getObservaciones(){
    this.observacionService.getObservacionAll().subscribe(response => {
      ////console.log(response);
      this.observacionesList = [];
      for (let i = 0; i < response.length; i++) {
        if(response[i].tipo == 'lecturas'){
          this.observacionesList.push(response[i]);
        }
      }
      //console.log(this.observacionesList);
      this.dataSource = new MatTableDataSource(this.observacionesList);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  iniciarFormulario(){
    this.formData = this.formBuilder.group({
      codigo: ["", Validators.required],
      descripcion: ["", Validators.required],
      tipo: ["lecturas"],
      permite_lec: ["", Validators.required]
    });
  }

  iniciarFormularioEdit(){
    this.formData = this.formBuilder.group({
      id_obs:[this.observacionEdit.id_obs, Validators.required],
      codigo: [this.observacionEdit.codigo, Validators.required],
      descripcion: [this.observacionEdit.descripcion, Validators.required],
      tipo: ["lecturas"],
      permite_lec: [parseInt(this.observacionEdit.permite_lec), Validators.required]
    });
  }

  cerrarModal(){
    this.modalRef.hide();
  }

  openCreateObservaciones(template: TemplateRef<any>) {
    this.iniciarFormulario();
    this.tipoAccion = "create";
    this.tituloModal = "Crear una observación";
    this.modalRef = this.modalService.show(template);
  }

  openModalEdit(id, template: TemplateRef<any>) {
    this.tituloModal = "Editar datos de la observación";
    this.tipoAccion = "edit";
    this.observacionService.getObservacionById(id).subscribe(response=>{
        //console.log(response);
        if(response != null){
          this.observacionEdit = response;
          this.iniciarFormularioEdit();
          this.modalRef = this.modalService.show(template);
        }
      }
    );
  }

  enviarDatos(){
    ////console.log(this.formData.value);
    ////console.log("Tipo de accion ==> "+this.tipoAccion);
    if(this.tipoAccion == "create"){
      this.observacionService.insertObservacion(this.formData.value).subscribe(response => {
        ////console.log(response);
        if(response){
          ////console.log('Tecnico guardado');
          this.getObservaciones();
          this.cerrarModal();
          this.showAlert('Éxito', 'Observación creada con éxito!', 'success');
        } else {
          ////console.log('Tecnico no guardado');
          this.showAlert('Alerta!', 'No se pudo crear la obserbación!', 'warning');
        }
      }, error => {
        //console.log(error);
      });
    }

    if(this.tipoAccion == "edit"){
      //console.log(this.formData.value);
      this.observacionService.updateObservacion(this.formData.value).subscribe(response => {
        //console.log(response);
        if(response){
          ////console.log('Tecnico guardado');
          this.getObservaciones();
          this.cerrarModal();
          this.showAlert('Éxito', 'Observación actualizada con éxito!', 'success');
        } else {
          ////console.log('Tecnico no guardado');
          this.showAlert('Alerta!', 'No se pudo actualizar la observación!', 'warning');
        }
      }, error => {
        //console.log(error);
      });
    }
  }

  deleteObservacion(id: number){
    this.observacionService.deleteObservacion(id).subscribe(resp=>{
        if(resp){
          ////console.log(resp);
          this.showAlert(
            'Éxito!',
            'La observación ha sido eliminada.',
            'success'
          )
          this.getObservaciones();   
        } else {
          ////console.log(resp);
          this.showAlert(
            'Alerta!',
            'No se pudo eliminar la observación.',
            'warning'
          )
          this.getObservaciones(); 
        }
      });
  }

  confirmarEliminar(id){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se eliminará la observación",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.deleteObservacion(id);
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

}
