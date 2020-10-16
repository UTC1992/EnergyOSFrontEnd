import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from "@angular/forms";

import { Filtro} from '../../../modelos-lec/filtro';
import { DataFilter } from "../../../models/data-filter";
import { Tecnico } from "../../../models/tecnico";

import { TecnicolecService } from "../../../services-lecturas/tecnicolec.service";
import { LecturasService } from '../../../services-lecturas/lecturas.service';
import { DistribucionService } from '../../../services-lecturas/distribucion.service';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import Swal from 'sweetalert2';
import {BsModalRef, BsModalService,  } from 'ngx-bootstrap/modal';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import {animate, state, style, transition, trigger} from '@angular/animations';

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
  selector: 'app-distribucion',
  templateUrl: './distribucion.component.html',
  styleUrls: ['./distribucion.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DistribucionComponent implements OnInit {

  primerFiltro:Filtro[]=[];
  segundoFiltro:Filtro[]=[];
  tercerFiltro:Filtro[]=[];

  dataFilter:DataFilter= new DataFilter();
  dataCount:boolean=false;

  cantidad_lecturas:number = 0;

  idsLecturas:Filtro[]=[];
  tecnicosLecturas:Tecnico[]=[];
  tecnicosConLecturas:Tecnico[]=[];

  tecnicoSeleccionado: string;
  listTecnicosSeleccionados: any[] = [];

  //validar seleccion
  agenciaValidar: any = null;
  sectorValidar: any = null;
  rutaValidar: any = null;
  
  //rutas
  rutasObtenidas: Filtro[] = null;
  agenciaElegida: string = null;
  sectorElegido: string = null;
  rutaElegida: string = null;
  rutasList: Filtro[] = [];
  formRutas = new FormControl();
  rutasAsignadas: any[] = [];

  //mostrar filtros
  mostrarFiltro2: boolean = false;
  mostrarFiltro3: boolean = false;
  mostrarCantidad: boolean = false;

  //creacion de tabla de lectores ya asignados
  displayedColumns: string[] = ['index', 'tecnico', 'accion'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private tecnicoService:TecnicolecService,
    private dateAdapter: DateAdapter<Date>,
    private distribucionService: DistribucionService,
    private modalService: BsModalService,
    public modalRef: BsModalRef,
  ) {
    this.dateAdapter.setLocale('es'); 
   }

  ngOnInit() {
    this.getTenicosLecturas();
    this.obtenerRutas();
    this.getTenicosConLecturas();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  obtenerRutas(){
    this.distribucionService.getRutasAll().subscribe(response1 => {
      //console.log(response1);
      this.rutasObtenidas = response1;
      
      this.distribucionService.getDistribuciones().subscribe(response => {
        //console.log(response);
        this.rutasAsignadas = response;
  
        for (let i = 0; i < this.rutasAsignadas.length; i++) {
          let vectorAux: any[] = [];
          for (let j = 0; j < this.rutasObtenidas.length; j++) {
  
            if(this.rutasObtenidas[j].agencia == this.rutasAsignadas[i].agencia
              && this.rutasObtenidas[j].sector == this.rutasAsignadas[i].sector
              && this.rutasObtenidas[j].ruta == this.rutasAsignadas[i].ruta){
                delete this.rutasObtenidas[j];
            } else {
              vectorAux.push(this.rutasObtenidas[j]);
            }
  
          }
          this.rutasObtenidas = vectorAux;
        }

        for (let i = 0; i < this.rutasObtenidas.length; i++) {
          var valor = this.primerFiltro.find(x => x.agencia == this.rutasObtenidas[i].agencia);
          if (!valor) {
            this.primerFiltro.push(this.rutasObtenidas[i]);
            ////console.log(this.primerFiltro);
          }
        }
        
        ////console.log(this.rutasObtenidas);
      }, error => {
        //console.log(error);
      });

    }, error => {
      //console.log(error);
    });
  }

  /**
   * obtiene tecnicos desde servicio técnicos
   */
  getTenicosLecturas(){
    this.tecnicoService.getTecnicosLecturasSinAsignar().subscribe(
      result=>{
        this.tecnicosLecturas=result;
        ////console.log("tecnicos"+this.tecnicosLecturas);
      }
    , error => {
      //console.log(error);
    });
  }

  /**
   * obtiene tecnicos que ya tienen rutas asignadas para lecturas
   */
  getTenicosConLecturas(){
    this.tecnicoService.getTecnicosLecturasConAsignacion().subscribe(
      result=>{
        this.tecnicosConLecturas=result;
        ////console.log("Tecnicos con asignaciones");
        ////console.log(this.tecnicosConLecturas);
        this.agruparDistribucion();
      }, error => {
        ////console.log(error);
      });
  }

  agruparDistribucion(){
    var dataAux: any[] = [];
    var index = 1;
    for (let i = 0; i < this.tecnicosConLecturas.length; i++) {
      var valor = dataAux.find(x=>x.id_tecn == this.tecnicosConLecturas[i].id_tecn);
      if(!valor){
        dataAux.push({
          index:index,
          id_tecn:this.tecnicosConLecturas[i].id_tecn,
          tecnico:this.tecnicosConLecturas[i].nombres+" "+this.tecnicosConLecturas[i].apellidos,
          data: null
        });
        index++;
      }
    }
    var dataTecnicos : any[] = [];
    for (let i = 0; i < dataAux.length; i++) {
      dataTecnicos = [];
      for (let j = 0; j < this.tecnicosConLecturas.length; j++) {
        if(dataAux[i].id_tecn == this.tecnicosConLecturas[j].id_tecn){
          dataTecnicos.push({
            datos:this.tecnicosConLecturas[j]
          });
        }
      }
      dataAux[i].data = dataTecnicos;
    }
    this.dataSource = new MatTableDataSource(dataAux);
    this.dataSource.paginator = this.paginator;
    //console.log(dataAux);
  }

  inicializarFiltros(){
    this.segundoFiltro = [];
    this.tercerFiltro = [];
    this.rutasList = [];
    this.agenciaElegida = null;
    this.sectorElegido = null;
    this.rutaElegida = null;
    this.cantidad_lecturas = 0;
    this.formRutas = new FormControl();
    this.mostrarFiltro2 = false;
    this.mostrarFiltro3 = false;
    this.mostrarCantidad = false;
  }


  //obtener sectores
  getSectores($event){
    this.inicializarFiltros();
    
    ////console.log($event.value);
    let agencia = $event.value;
    if(agencia == 'empty'){
      this.agenciaElegida = null;  
    } else {
      this.agenciaElegida = agencia;
    }
    for (let i = 0; i < this.rutasObtenidas.length; i++) {
      var valor = this.rutasObtenidas.find(x => x.agencia == agencia);
      if (valor) {
        let valor2 = this.segundoFiltro.find(x => x.sector == this.rutasObtenidas[i].sector);
        if(!valor2){
          this.segundoFiltro.push(this.rutasObtenidas[i]);
          ////console.log(this.segundoFiltro);
          this.mostrarFiltro2 = true;
        }
        
      }
    }

  }

  //obtener rutas
  getRutas($event){
    //inicializar los variables globales
    this.tercerFiltro = [];
    this.rutasList = [];
    this.rutaElegida = null;
    this.cantidad_lecturas = 0;
    this.mostrarFiltro3 = false;
    this.mostrarCantidad = false;
    this.formRutas = new FormControl();

    ////console.log($event.value);
    let sector = $event.value;
    this.sectorElegido = sector;
    for (let i = 0; i < this.rutasObtenidas.length; i++) {
      if (this.rutasObtenidas[i].sector == sector && this.rutasObtenidas[i].agencia == this.agenciaElegida) {
        let valor3 = this.tercerFiltro.find(x => x.ruta == this.rutasObtenidas[i].ruta);
        if(!valor3){
          this.tercerFiltro.push(this.rutasObtenidas[i]);
          ////console.log(this.tercerFiltro);
          this.mostrarFiltro3 = true;
        }
        
      }
    }

  }

  getCantidad(dato : any){
    this.mostrarCantidad = true;
    //console.log(dato);
    let ruta = dato;
    this.rutaElegida = ruta;
    //se obtiene el valor de cantidad
    let cantidad = this.tercerFiltro.find(x => x.ruta == ruta).cantidad;

    let valor3 = this.rutasList.find(x => x.ruta == ruta);
    if(valor3){
      let vectorAux: Filtro[] = [];
      for (let j = 0; j < this.rutasList.length; j++) {
        if(this.rutasList[j].ruta != valor3.ruta){
          vectorAux.push(this.rutasList[j]);
        } 
      }
      this.rutasList = [];
      this.rutasList = vectorAux;
      this.cantidad_lecturas -= parseInt(cantidad.toString());
      ////console.log(this.rutasList);
    } else {
      for (let i = 0; i < this.rutasObtenidas.length; i++) {
        if (this.rutasObtenidas[i].sector == this.sectorElegido 
          && this.rutasObtenidas[i].agencia == this.agenciaElegida
          && this.rutasObtenidas[i].ruta == ruta
          ) {
            
            this.rutasList.push(this.rutasObtenidas[i]);
            this.cantidad_lecturas += parseInt(this.rutasObtenidas[i].cantidad.toString());
            ////console.log(this.rutasList);
          
        }
      }
    }
  }

  /**
   * @param e 
   * @param list 
   */
  onSelection(e, list){
    this.tecnicoSeleccionado = e.option.value;
    this.listTecnicosSeleccionados = list;
    //console.log(this.listTecnicosSeleccionados);
  }

  /** 
   * asignar rura a técnico seleccinado
   */
  asignarRutaTecnico(){
    
    if(this.agenciaElegida == null){
      this.showAlert('Alerta!',"Seleccione una agencia",'warning');
      return 
    } else if(this.sectorElegido == null){
      this.showAlert('Alerta!',"Seleccione un sector",'warning');
      return 
    } else if(this.rutasList.length == 0){
      this.showAlert('Alerta!',"Seleccione una ruta",'warning');
      return 
    } else if(this.listTecnicosSeleccionados.length > 1){
      this.showAlert('Alerta!',"Seleccione un solo técnico",'warning');
      return 
    } else if(this.listTecnicosSeleccionados.length == 0){
      this.showAlert('Alerta!',"Seleccione un técnico por favor.",'warning');
      return 
    } 
    if(this.agenciaElegida != null && this.sectorElegido != null 
      && this.rutasList.length > 0 && this.listTecnicosSeleccionados.length == 1){
      this.showCargando();
      ////console.log(this.listTecnicosSeleccionados[0].value);

      let dataEnvio : any[] = [];
      let data: any[] = [];
      for (let i = 0; i < this.rutasList.length; i++) {
        
        data.push({
          idTecnico : parseInt(this.listTecnicosSeleccionados[0].value),
          agencia : this.rutasList[i].agencia,
          sector : this.rutasList[i].sector,
          ruta : this.rutasList[i].ruta,
        });
        
        dataEnvio.push({
          rutas:data
        });
      }
      //console.log(data);
      this.distribucionService.distribuirRutasTecnico(data).subscribe(
        result=>{
          //console.log(result);
          if(result){
            //this.getTenicosLecturas();
            this.showAlert('Éxito', 'Ruta asignada correctamente', 'success');
            this.inicializarFiltros();
            this.actualizarVista();
          } else {
            this.showAlert('Alerta!', 'No se pudo asignar la ruta', 'warning');
            this.inicializarFiltros();
            this.actualizarVista();
          }
        }, error => {
          //console.log(error);
          Swal.close();
        }
      );
    }
        
    ////console.log(this.idsLecturas);
  }

  actualizarVista(){
    this.getTenicosLecturas();
    this.obtenerRutas();
    this.getTenicosConLecturas();
    this.showAlert(
      'Éxito!',
      'Página actualizada exitosamente.',
      'success'
    );
  }

  reasignarRutaTecnico(id){
    this.tecnicoService.changeStateTecnico(id).subscribe(response => {
      //console.log(response);
      if(response){
        this.actualizarVista();
        this.showAlert(
          'Éxito!',
          'El lector ha sido habilitado.',
          'success'
        )
      } else {
        this.actualizarVista();
        this.showAlert(
          'Alerta !',
          'No se pudo habilitar al lector.',
          'warning'
        )
      }
      
    }, error => {
      //console.log(error);
      this.actualizarVista();
    });
  }

  eliminarAsignacion(id_tecn, agencia, sector, ruta){
    let data: any[] = [];
    data.push({
      idTecnico : id_tecn,
      agencia : agencia,
      sector : sector,
      ruta : ruta,
    });
    this.distribucionService.deleteRutasTecnico(data).subscribe(response =>{
      //console.log(response);
      if(response){
        this.actualizarVista();
        this.showAlert("Éxito !","La asignación se elimino éxitosamente","success");
      } else {
        this.actualizarVista();
        this.showAlert("Alerta !","No se puedo eliminar la asignación","warning");
      }
      
    }, error => {
      //console.log("Error al eliminar la asignacion");
      this.actualizarVista();
    });
  }

  actualizarDistribucionesTablaTemporal(){
    this.showCargando();
    this.distribucionService.updateDistribuciones().subscribe(response => {
      //console.log(response);
      if(response){
        this.actualizarVista();
        this.showAlert('Éxito!','Las distribuciones se actualizaron exitosamente','success');
      }else {
        this.actualizarVista();
        this.showAlert('Éxito!','No se pudo actualizar la distribución','warning');
      }
    }, error => {
      //console.log(error);
      this.actualizarVista();
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

  confirmarEliminar(id_tecn, agencia, sector, ruta){
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
        this.eliminarAsignacion(id_tecn, agencia, sector, ruta);
      }
    });
  }

}
