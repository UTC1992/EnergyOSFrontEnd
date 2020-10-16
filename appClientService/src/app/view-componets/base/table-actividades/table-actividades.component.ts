import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { OrdenService } from '../../../services/orden.service';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";
import { ExcelServiceService } from '../../../services/excel-service.service';
import { Orden } from '../../../models/orden';

import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-actividades',
  templateUrl: './table-actividades.component.html',
  styleUrls: ['./table-actividades.component.css']
})
export class TableActividadesComponent implements OnInit {

  displayedColumns2: string[] = ['index', 'tecnico','actividad', 
  'cuenta', 'canton', 'sector', 'medidor', 'lectura',
  'usuario', 'latitud', 'longitud', 'hora', 'novedad',
  'estadoAct', 'estadoFinal'];
  dataSource2 = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator2: MatPaginator;

  ordenes:Observable<Orden[]>; 
  actividades:Observable<any[]>; 
	view_table: boolean;
  view_data_empty: boolean;
  
  fechaNombreExcel: string = "";

  constructor(
    private ordenService:OrdenService,
		private router:Router,
		private excelService:ExcelServiceService,
  ) { }

  ngOnInit() {
  }
  
  cargarDatos(data){
    //console.log(data[0]['fecha']);
    this.fechaNombreExcel = data[0]['fecha'];
    this.ordenes=this.ordenService.getActivitiesToDay(data[0]['fecha'],
                                                      data[0]['id_tecn'],
                                                      data[0]['actividad'],
                                                      data[0]['estado']);
      this.ordenes.subscribe(
        data=>{
          ////console.log(data);
          this.dataSource2 = new MatTableDataSource(data);
          this.dataSource2.paginator = this.paginator2;
          //setTimeout(() => this.dataSource2.paginator = this.paginator2)
          this.view_table=true;
          this.view_data_empty=false;
          if(data.length == 0){
            this.view_table=false;
            this.view_data_empty=true;
          }
        });
  }
  applyFilter(filterValue: string) {
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  mostrarActividades(){
		this.view_table = true;
	}

	ocultarActividades(){
		this.view_table = false;
	}

	ocultarEmptyActividades(){
		this.view_data_empty=false;
  }
  
  exportarExcel(fecha:any){
    let datos = Array();
      if(this.ordenes != null && this.view_table==true){
        let datos = Array();
        this.ordenes.subscribe(
          data=>{
            for (var i = 0; i < data.length; ++i) {
              datos.push({
                        TECNICO:      data[i]['nombres']+" "+data[i]['apellidos'],
                        ACTIVIDAD:    data[i]['n9cono'],
                        CUENTA:       data[i]['n9cocu'],
                        CANTON:       data[i]['n9coag'],
                        SECTOR:       data[i]['n9cose'],
                        MEDIDOR:      data[i]['n9meco'],
                        LECTURA:      data[i]['n9leco'],
                        CLIENTE:      data[i]['n9nomb'],
                        HORATAREA:    data[i]['hora'],
                        NOVEDADES:    data[i]['observacionFin'],
                        ESTADO:       data[i]['referencia'],
                        CUCOON:       data[i]['cucoon'],
                        CUCOOE:       data[i]['cucooe']
                      });
            }
            //console.log(data);
            this.excelService.exportAsExcelFile(datos,fecha+'_Actividades');
            
          });
      } else {
				this.showAlert("Alert!","No existen datos para descargar.","warning");
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
}
