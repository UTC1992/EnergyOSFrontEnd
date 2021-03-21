import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrdenService } from '../../../services/orden.service';
import { Orden } from '../../../models/orden';

import {Router} from "@angular/router";
import {MatTableDataSource, MatPaginator} from '@angular/material';

@Component({
  selector: 'app-table-client',
  templateUrl: './table-client.component.html',
  styleUrls: ['./table-client.component.css']
})
export class TableClientComponent implements OnInit {
 
  p:number=1;
  total:number=0;
  ordenes:Orden[]; 

  displayedColumns: string[] = ['index', 'actividad', 
  'cuenta', 'sector', 'ruta', 'medidor','usuario', 'referencia', 'fechasubida'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ordenService:OrdenService,
    private router:Router 
    ) { }

  ngOnInit(){
    this.cargarDatos();
  }

  cargarDatos(){
    this.ordenService.getOrdenes().subscribe(
      result=>{
        //console.log(result);
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.paginator = this.paginator;
        this.total=result.length;
      });
  }
 
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
