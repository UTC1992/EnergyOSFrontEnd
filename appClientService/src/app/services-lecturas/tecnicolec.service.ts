import { Injectable } from '@angular/core';
import { Tecnico } from '../models/tecnico';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class TecnicolecService {

  url: Url = new Url();
  baseUrl: string;

  constructor(
    private http:HttpClient,
    ) {
      this.baseUrl = this.url.base;
   }


  /**
   * obtiene tecnicos de lecturas
   */
  getTecnicosLecturas():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos-lecturas")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  //metodo obtien tecnico por tarea 
  deleteDistribucion(id_tecn,sector, cantidad, tipo):Observable<any>{
    return this.http.get(this.baseUrl+"/delete-distribucion/"+id_tecn+"/"+sector+"/"+cantidad+"/"+tipo)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  /**
   * obtener técnicos de lecturas
   */
  getTecnicosLecturasSinAsignar():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos-sin-lecturas")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  /**
   * obtener tecnicos que ya estan asignados
   */
  getTecnicosLecturasConAsignacion():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos-con-lecturas")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  //cambiar estado de tecnico 
  changeStateTecnico(id){
    return this.http.get(this.baseUrl+"/cambiar-estado/"+id)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  

}
