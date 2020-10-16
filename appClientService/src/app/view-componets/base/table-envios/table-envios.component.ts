import { Component, OnInit , ViewChild} from '@angular/core';
import { ReportesCortes } from '../../../services/reportes-cortes.service';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-table-envios',
  templateUrl: './table-envios.component.html',
  styleUrls: ['./table-envios.component.css']
})
export class TableEnviosComponent implements OnInit {

  displayedColumns: string[] = ['index', 'nombres', 'asignadas', 
  'enviadas', 'recibidas', 'realizadas', 'faltantes'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  view_data_empty: boolean;

  constructor(
    private reporteService: ReportesCortes
  ) { }

  ngOnInit() {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  cargarDatos(fecha: string){
    this.reporteService.getEnviosTecnicos(fecha).subscribe(response => {
      //console.log(response);
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
      
      this.view_data_empty=false;
      if(response.length == 0){
        this.view_data_empty=true;
      }
    });
  }

}
