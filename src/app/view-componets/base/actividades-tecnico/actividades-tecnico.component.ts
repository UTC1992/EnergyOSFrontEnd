import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { TecnicoService } from '../../../services/tecnico.service';
import { OrdenService } from '../../../services/orden.service';
import { Tecnico } from '../../../models/tecnico';
import { Orden } from '../../../models/orden';
import { TecnicoDistribucion } from '../../../models/tecnico-distribucion';
import { Observable, empty } from 'rxjs';
import { Type } from '@angular/compiler';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";

import { Sector } from 'src/app/models/sector';
import { SectorList } from 'src/app/models/sector-list';

import {BsModalRef, BsModalService,  } from 'ngx-bootstrap/modal';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';
import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-actividades-tecnico',
  templateUrl: './actividades-tecnico.component.html',
  styleUrls: ['./actividades-tecnico.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ActividadesTecnicoComponent implements OnInit {
  optionsModel: number[];
  myOptions: any[] = [];
  countryForm: FormGroup;
  tecnicos:Tecnico[] = [];

  public loading: boolean;
  res: Observable<any>;
  actividades:any[] = [];
  public view_table:boolean;
  actividades_tecncio:Observable<any>;
  key: string = 'name'; //set default
  reverse: boolean = false;
  p: number = 1;
  cantones: Observable<Orden[]>;
  sectores:Observable<any[]>;
  cantones_exists:boolean;
  num_cantones:number=0;
  sectores_exists:boolean;
  num_sectores:number=0;
  num_actividades:number=0;
  cantidad_exists:boolean;
  cantidad:Observable<Orden[]>;
  Ordenes:Number;
  distribucion:Observable<any>;
  distribucionDelete:Observable<any>;

  objTecnicoDistribucion:TecnicoDistribucion;

  tecnicoSeleccionado: string;
  listTecnicosSeleccionados: any[];

  //asignar select con material
  actividadSelect: String = null;
  cantonSelect: String = null;
  sectorSelect: number = 0;
  formSectores = new FormControl();
  formCanton: FormGroup;

  displayedColumns: string[] = ['index', 'tecnico'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumnsModal: string[] = ['index', 'fecha'];
  dataSourceModal = new MatTableDataSource();
  @ViewChild(MatPaginator) paginatorModal: MatPaginator;

  //variable para seleccionar el tipo de actividades
  actividad: any;

  @ViewChild('inputRef') inputRef: ElementRef;
  constructor(private tecnicoService:TecnicoService, 
              private ordenServices:OrdenService,
              private fb: FormBuilder,
              private modalService: BsModalService,
              public modalRef: BsModalRef,
              ) {
    this.loading=false;
    this.view_table=false;
    this.cantones_exists=false;
    this.sectores_exists=false;
    this.cantidad_exists=false;
    this.createForm();
    this.createFormCantones();
    
   }

   

  onSelection(e, list){
    this.tecnicoSeleccionado = e.option.value;
    this.listTecnicosSeleccionados = list;
    ////console.log(list);
    if(list.length > 0){
      //console.log(list[0].value);
    }
    
  }

  ngOnInit() {
    this.mostrarTecnicos();
    this.mostrarDistribucion();
    this.countActivities();
    //this.mostrarDistribucion();
  }

  actualizarVista(){
    this.mostrarTecnicos();
    this.mostrarDistribucion();
    this.countActivities();
  }

  mostrarDistribucion(){
    this.tecnicoService.showDistribucion().subscribe(response =>{
      this.actividades = response;
      //console.log(response);
      this.agruparDistribucion();
    });
  }

  agruparDistribucion(){
    var dataAux: any[] = [];
    var index = 1;
    for (let i = 0; i < this.actividades.length; i++) {
      var valor = dataAux.find(x=>x.id_tecn == this.actividades[i].id_tecn);
      if(!valor){
        dataAux.push({
          index:index,
          id_tecn:this.actividades[i].id_tecn,
          tecnico:this.actividades[i].nombres+" "+this.actividades[i].apellidos,
          data: null
        });
        index++;
      }
    }
    var dataTecnicos : any[] = [];
    for (let i = 0; i < dataAux.length; i++) {
      dataTecnicos = [];
      for (let j = 0; j < this.actividades.length; j++) {
        if(dataAux[i].id_tecn == this.actividades[j].id_tecn){
          dataTecnicos.push({
            datos:this.actividades[j]
          });
        }
      }
      dataAux[i].data = dataTecnicos;
    }
    this.dataSource = new MatTableDataSource(dataAux);
    this.dataSource.paginator = this.paginator;
    //console.log(dataAux);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  mostrarTecnicos(){
    this.tecnicoService.getTecnicosSinActividades().subscribe(res =>{
      ////console.log(res);
      this.tecnicos = res;
    });
  }

  //contar total cantidades por asignar
  countActivities(){
    this.ordenServices.getOrdenes().subscribe(
      resul=>{
        this.Ordenes=resul.length;
      }
    );
  }
  
  createForm() {
    this.countryForm = this.fb.group({
      actividad: null
    });
  }

  createFormCantones(){
    this.formCanton = this.fb.group({
      canton: null
    });
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  // recargar componentes
  reloadComponent(){
    this.mostrarTecnicos();
    this.mostrarDistribucion();
    this.countActivities();
  }

  openModalDetalle(id,tipo,sector, template: TemplateRef<any>) {
    this.verDetalleActividades(id,tipo,sector);
    this.modalRef = this.modalService.show(template);
  }

  cerrarModal(){
    this.modalRef.hide();
  }
 
  //ver detalle en modal 
  verDetalleActividades(id,tipo,sector) {
    this.actividades_tecncio=null;
    this.p = 1;
    switch (tipo) {
      case "Notificaciones":
        this.actividades_tecncio=this.tecnicoService.getActivitiesByTecnico(id, '010',sector);
        //console.log(this.actividades_tecncio);
        this.view_table=true;
        break;
      case "Corte":
        this.actividades_tecncio=this.tecnicoService.getActivitiesByTecnico(id, '030',sector);
        //console.log(this.actividades_tecncio);
        this.view_table=true;
        break;
      case "Reconexiones":
        this.actividades_tecncio=this.tecnicoService.getActivitiesByTecnico(id, '040',sector);
        //console.log(this.actividades_tecncio);
        this.view_table=true;
        break;
      case "Retiro de medidor":
        this.actividades_tecncio=this.tecnicoService.getActivitiesByTecnico(id, '050',sector);
        //console.log(this.actividades_tecncio);
        this.view_table=true;
      default:
        // code...
        break;
    }
    

  }

  AsignarActividades(id){
    this.tecnicoService.changeStateTecnico(id).subscribe(
      msj=>{
        if(msj){
          this.showAlert(
            'Éxito!',
            'El técnico ha sido habilitado.',
            'success'
          )
          this.reloadComponent();
        }
      }
    );
  }

  limpiezaSelects(){
    this.cantones_exists=false;
    this.sectores_exists=false;
    this.cantidad_exists=false;
    this.formSectores = new FormControl();
    this.cantonSelect = "empty";
  }

  getTypeActivities(value){
    this.limpiezaSelects();
    this.createFormCantones();
    let valor=value;
    this.actividadSelect = value;
    this.cantones=this.ordenServices.getCantones(valor);
    if(valor=="empty"){
      this.cantones_exists=false;
      this.sectores_exists=false;
      this.cantidad_exists=false;
    }else{
      this.cantones.subscribe(
        result=>{
          this.cantones_exists=true;
          this.num_cantones=result.length;
          ////console.log(result);
        }
      );
    }  
  }

  // obtiene sectores desde el servicio
  getSectors(value){
    this.cantidad_exists=false;
    this.formSectores = new FormControl();
    let valor=value;
    this.cantonSelect = value;
    var actividad= this.actividadSelect;
    this.sectores=this.ordenServices.getSectoresService(actividad,valor);
    if(valor=="empty"){
      this.sectores_exists=false;
    }else{
      this.sectores.subscribe(
        result=>{
          this.optionsModel=[];
          this.myOptions=[];
          this.sectores_exists=true;
          this.num_sectores=result.length;
          result.forEach(element => {
            var sector=new Sector();
            sector.id=element.sector;
            sector.name=element.sector;
            this.myOptions.push(sector);
            ////console.log(this.myOptions);
          });
          //console.log(result);
        }
      );
    }
  }
  // camptura sectores
  onChange() {
    ////console.log(this.formSectores.value);
    var actividad=this.actividadSelect;
    //alert(actividad);
    var canton=this.cantonSelect;
    //alert(canton);
    
    let data={
      'actividad':actividad,
      'canton':canton,
      'sector':this.formSectores.value,
    };
    this.cantidad=this.ordenServices.getActivitiesCountSec(data);
    ////console.log(this.formSectores.value.length);
    if(this.formSectores.value.length <=0){
      //this.cantidad_exists=false;
      this.num_actividades=0;
    }else{
      this.cantidad.subscribe(
        resultado=>{
          ////console.log(resultado.length);
          this.cantidad_exists=true;
          this.num_actividades=resultado.length;
          
        }
      );
      
      ////console.log("actividades: "+this.cantidad);
    }
    
  }

    //distribuir actividades tecnico
    buildTask(){
      this.showCargando();
      ////console.log("DISTRIBUIR ACTIVIDADES");
      
      this.ordenServices.getRecManualesSinProcesar().subscribe(
        resultado=>{
          if(resultado>0){
            this.showAlert(
              'Alerta!',
              'Debes procesar las reconexiones manuales.',
              'warning'
            )
            
            return;
          }else{
            var actividad=this.actividadSelect;
            
            if(cont_tecnicos<=0){
              //alert("Seleccione almenos un tecnico");
              this.showAlert(
                'Alerta!',
                'Debes seleccionar almenos un tecnico.',
                'warning'
              )
              
              return;
            }

            if(this.actividadSelect == "empty" || this.actividadSelect == null){
              //alert("Seleccione una actividad");
              this.showAlert(
                'Alerta!',
                'Debes seleccionar una actividad.',
                'warning'
              )
              
              return;
            } else {
                var actividad1=this.cantonSelect;

                if(actividad1+"" == 'empty'){
                  //alert("Seleccione un cantón");
                  this.showAlert(
                    'Alerta!',
                    'Debes seleccionar un cantón.',
                    'warning'
                  )
                  
                  return;
                } else {
                  
                  if(this.formSectores.value == null){
                    //alert("Seleccione un sector");
                    this.showAlert(
                      'Alerta!',
                      'Debes seleccionar un sector.',
                      'warning'
                    )
                    
                    return;
                  } else {
                    var re3= document.getElementsByName("cantidad_actividades");
                    var actividad3=<HTMLInputElement>re3[0]["value"];
                    
                    if(Number(actividad3) == 0){
                      //alert("NO ha seccionado el número actividades");
                      this.showAlert(
                        'Alerta!',
                        'Debes seleccionar un número de actividades mayor a cero 0.',
                        'warning'
                      )
                      
                      return;
                    }
                  }
                }
            }
            
            var cant=document.getElementsByName("cantidad_actividades");
            var cantidad_actividades=<HTMLInputElement>cant[0]["value"];
            
            this.cantidad.subscribe(
              msj=>{
                //alert(msj.length);
                if(msj.length<=0){
                  //alert("seleccione actividades a distribuir");
                  this.showAlert(
                    'Alerta!',
                    'Debes seleccionar una actividad para distribuir',
                    'warning'
                  )
                  
                  return;
                }
              //this.loading=true;
              //
               msj.forEach(element => {
                 array_actividades[cont]=element["id_act"];
                 ////console.log(array_actividades);
                 cont++;
               });

               let dataBuild={
                  'array_actividades':array_actividades,
                  'array_tecnicos':array_tecnicos,
                  'actividad':actividad,
                  'cantidad_actividades':cantidad_actividades
                }
                
               this.tecnicoService.buildTecnicoByTask(dataBuild).subscribe(
                 result=>{
                    if(result){
                      this.loading=false;
                      this.reloadComponent();
                      this.cantones_exists=false;
                      this.sectores_exists=false;
                      this.cantidad_exists=false;
                      this.createForm();
                      this.formSectores = new FormControl();
                      this.listTecnicosSeleccionados = [];
                      this.countActivities();
                      
                      this.showAlert(
                        'Éxito!',
                        'La asignación fue exitosa.',
                        'success'
                      )
                    }else if(result==1){
                      //alert("El  número de actividades no puede ser igual o menor a cero  ");
                      this.showAlert(
                        'Alerta!',
                        'Debes seleccionar un número de actividades mayor a cero 0.',
                        'warning'
                      )
                      
                    }else{
                      //alert("No se asigno las actividades  ");
                      this.showAlert(
                        'Alerta!',
                        'No se asignaron las actividades.',
                        'warning'
                      )
                      
                    }
                    
                 }
               );
              }
            );
          }    
        }
      );
      
      var cont_array_tecn=0;
      var array_tecnicos:String[]=[];
      var array_actividades:String[]=[];
      var cont=0;
      var cont_tecnicos=0;
      if(this.listTecnicosSeleccionados != null){
        for(var i=0; i < this.listTecnicosSeleccionados.length; i++){ 
            array_tecnicos[cont_array_tecn]=this.listTecnicosSeleccionados[i].value;
            cont_tecnicos++;
            cont_array_tecn++;
        }
      }
      
      
    }

  mostrarDistribucionAux(){
    //console.log("MOSTRAR LA DISTRIBUCION ===================");
    this.distribucion = this.tecnicoService.showDistribucion();
    this.distribucion.subscribe(res =>{
      //console.log(res);
    });
  }



  eliminarAsignacion(id_tecn, sector, cantidad, tipoAct){
    this.showCargando();
    ////console.log("ELIMINAR LA DISTRIBUCION ===================");
    this.distribucionDelete = this.tecnicoService.deleteDistribucion(id_tecn, sector, cantidad, tipoAct);
    this.distribucionDelete.subscribe(res =>{
      ////console.log(res);
      if(res == true){
        //alert("Asignación eliminada correctamente");
        this.reloadComponent();
        this.showAlert('Eliminado!',
        'La asignación a sido eliminada.',
        'success');
        //location.reload(true);
      } else {
        this.showAlert('Alerta!',
        'La asignación No a sido eliminada.',
        'warning');
        this.reloadComponent();
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

  confirmarEliminar(id_tecn, sector, cantidad, tipoAct){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Se eliminará la asignación",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.eliminarAsignacion(id_tecn, sector, cantidad, tipoAct);
      }
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
