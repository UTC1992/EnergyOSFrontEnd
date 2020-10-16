import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TecnicoService } from '../../../services/tecnico.service';
import { Tecnico } from '../../../models/tecnico';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Observable } from 'rxjs';
import {BsModalRef, BsModalService,  } from 'ngx-bootstrap/modal';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';
import { PermisosService } from '../../../services/permisos.service';

@Component({
  selector: 'app-lecturas',
  templateUrl: './lecturas.component.html',
  styleUrls: ['./lecturas.component.css']
})
export class LecturasComponent implements OnInit {
  form_tecnico_edicion: FormGroup;
  loading: boolean = false;
  tecn:any;
  tecnicos:Observable<Tecnico[]>;

  displayedColumns: string[] = ['id_tecn', 'nombres', 'permiso_borrado', 'cedula', 'telefono', 
  'email','actividad',  'acciones'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  tituloModal: String;
  tipoAccion: String;

  formData: FormGroup;

  tecnicoEdit:any;

  //validar numero de tecnicos
  tecnicosPermitidosCortes: number;
  tecnicosPermitidosLecturas: number;

  constructor(
    private tecnicoService:TecnicoService,
    private formBuilder: FormBuilder,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
    private permisoService: PermisosService
  ) { 

  }

  ngOnInit() {
    this.mostrarTecnicos();
    this.iniciarFormulario();
  }

  mostrarTecnicos(){
    this.tecnicoService.getAllTecnicos().subscribe(res =>{
      ////console.log(res.length);
      this.tecnicosPermitidosCortes = 0;
      let contador = 0;
      let teccortes = [];
      for (let i = 0; i < res.length; i++) {
        if(res[i]['actividad'] == 'lecturas'){
          teccortes.push(res[i]);
          contador++;
        }
      }
      this.tecnicosPermitidosCortes = contador;
      //console.log(this.tecnicosPermitidosCortes);
      this.dataSource = new MatTableDataSource(teccortes);
      this.dataSource.paginator = this.paginator;
    });
    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteTecnico(id){
    this.tecnicoService.deleteTecnico(id)
    .subscribe(
      resp=>{
        if(resp){
          //console.log(resp);
          this.showAlert(
            'Eliminado!',
            'El técnico a sido eliminado.',
            'success'
          )
          this.mostrarTecnicos();   
        } else {
          //console.log(resp);
          this.showAlert(
            'Alerta!',
            'El técnico No a sido eliminado.',
            'warning'
          )
          this.mostrarTecnicos(); 
        }
      });
  }
  
  updateTecnico(id){
    alert(id);
  }

  openModalEdit(id, template: TemplateRef<any>) {
    this.tituloModal = "Editar datos del técnico";
    this.tipoAccion = "edit";
    this.tecn=this.tecnicoService.getTecnicoById(id).subscribe(
      response=>{
        //this.tecn= this.createformEdit(res);
        if(response != null){
          //console.log(response);
          this.tecnicoEdit = this.iniciarFormularioEdit(response);
          //this.iniciarFormularioEdit();
          this.modalRef = this.modalService.show(template);
        }
      }
    );
  }

  openModalCreate(template: TemplateRef<any>) {
    this.permisoService.getPlan().subscribe(response =>{
      console.log(response);
      let datos = response.find(x=>x.id_modulo == 'energy_lec');
      ////console.log(datos['num_tecnicos']);
      if(datos == null){
        this.showAlert('Alerta!', 'No estas suscrito al módulo de lecturas.', 'warning');        
      } else {
        if(this.tecnicosPermitidosCortes < datos['num_tecnicos']){
          this.iniciarFormulario();
          this.tipoAccion = "create";
          this.tituloModal = "Crear un nuevo técnico";
          this.modalRef = this.modalService.show(template);
        } else {
          this.showAlert('Alerta!', 'Ya no puedes crear más técnicos, comunicate con soporte técnico por favor.', 'warning');
        }
      }
      

    });
  }

  iniciarFormularioEdit(object){
    this.formData = this.formBuilder.group({
      id_tecn:[object.id_tecn, Validators.required],
      nombres: [object.nombres, Validators.required],
      apellidos: [object.apellidos, Validators.required],
      cedula: [object.cedula, Validators.required],
      telefono: [object.telefono, Validators.required],
      email: [object.email, Validators.required],
      actividad:[object.actividad,Validators.required],
      estado:['1', Validators.required],
      permiso_borrado:[parseInt(object.permiso_borrado), Validators.required],
      password:[object.password,Validators.required]
    });
  }

  iniciarFormulario(){
    this.formData = this.formBuilder.group({
      nombres: ["", Validators.required],
      apellidos: ["", Validators.required],
      cedula: ["", Validators.required],
      telefono: ["", Validators.required],
      email: ["", Validators.required],
      actividad:["lecturas",Validators.required],
      estado:['1', Validators.required],
      permiso_borrado:["", Validators.required],
      password:["",Validators.required]
    });
  }

  private prepareSave(): any {
    console.log("PERMISOS ==> "+this.formData.get('permiso_borrado').value);
    let input = new FormData();
    input.append('id_tecn', this.formData.get('id_tecn').value);
    input.append('nombres', this.formData.get('nombres').value);
    input.append('apellidos', this.formData.get('apellidos').value);
    input.append('cedula', this.formData.get('cedula').value);
    input.append('telefono', this.formData.get('telefono').value);
    input.append('email', this.formData.get('email').value);
    input.append('actividad', this.formData.get('actividad').value);
    input.append('estado', this.formData.get('estado').value);
    input.append('permiso_borrado', this.formData.get('permiso_borrado').value);
    return input;
  }


  cerrarModal(){
    this.modalRef.hide();
  }

  enviarDatos(){
    //console.log(this.formData.value);
    //console.log("Tipo de accion ==> "+this.tipoAccion);
    if(this.tipoAccion == "create"){
      this.tecnicoService.insertTecnico(this.formData.value).subscribe(response => {
        //console.log(response);
        if(response){
          //console.log('Tecnico guardado');
          this.mostrarTecnicos();
          this.cerrarModal();
          this.showAlert('Éxito', 'Técnico creado con exito!', 'success');
        } else {
          //console.log('Tecnico no guardado');
          this.showAlert('Alerta!', 'La cédula ya existe!', 'warning');
        }
      });
    }
    if(this.tipoAccion == "edit"){
      //const formModel = this.prepareSave();
      //console.log(this.formData.value);
      this.tecnicoService.updateTecnico(this.formData.value).subscribe( response =>{
        //console.log(response);
        if(response){
          //console.log('Tecnico editado');
          this.mostrarTecnicos();
          this.cerrarModal();
          this.showAlert('Éxito', 'Técnico editado con exito!', 'success');
        } else {
          //console.log('Tecnico error al guardar');
          this.showAlert('Alerta!', 'Técnico no editado', 'warning');
        }
      },error=>{
        //console.log(<any>error)
      });
    }
  }

  confirmarEliminar(id){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se eliminará al técnico",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.deleteTecnico(id);
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

