import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrdenService } from '../../../services/orden.service';
import { Observable } from 'rxjs';
import {Router} from "@angular/router";
import { ExcelServiceService } from '../../../services/excel-service.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-recmanual',
  templateUrl: './table-recmanual.component.html',
  styleUrls: ['./table-recmanual.component.css']
})
export class TableRecmanualComponent implements OnInit {

	recmanuales:Observable<any[]>; 
	view_tableRecmanual: boolean;
	view_data_empty_recmanual: boolean;

	existenRecManual: Boolean;

	displayedColumns: string[] = ['index', 'tecnicos', 'medidor', 
	'lectura', 'observacion', 'foto'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private ordenService:OrdenService,
		private router:Router,
		private excelService:ExcelServiceService,
		) { 
			this.existenRecManual = false;
		}

	ngOnInit() {
	}

	cargarDatos(data){
	    this.recmanuales =this.ordenService.getRecManual(data);
	    this.ordenService.getRecManual(data).subscribe(
	    	data => {
					//console.log(data);
					if(!data){
						this.existenRecManual = false;
					}
	    		if(data.length>0){
		            this.mostrarRecManuales();
								this.view_data_empty_recmanual=false;
								this.dataSource = new MatTableDataSource(data);
      					this.dataSource.paginator = this.paginator;
		          }else{
		            this.ocultarRecManuales();
		            this.view_data_empty_recmanual=true;
		          }
	    	});
	    
	}

	applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

	mostrarRecManuales(){
		this.view_tableRecmanual = true;
	}

	ocultarRecManuales(){
		this.view_tableRecmanual = false;
	}

	ocultarEmptyRecManuales(){
		this.view_data_empty_recmanual=false;
	}

	exportarExcelRecManual(fecha:any){
			let datos = Array();
	    if(this.recmanuales != null && this.view_tableRecmanual==true){
				this.recmanuales.subscribe(
	        data=>{
						//console.log(data);
						for (var i = 0; i < data.length; ++i) {
	            datos.push({
												TECNICO:      data[i]['nombres']+" "+data[i]['apellidos'],
	                      MEDIDOR:      data[i]['medidor'],
	                      LECTURA:      data[i]['lectura'],
	                      NOVEDADES:    data[i]['observacion'],
	                      FOTO:       data[i]['foto']
	                    });
	          }

						this.excelService.exportAsExcelFile(datos,fecha+'_RecManuales');
						
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
