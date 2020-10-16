import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Url } from '../models/Url';
import { Observacion } from '../models/observacion';

@Injectable({
  providedIn: 'root'
})
export class ObservacionService {

  url: Url = new Url();
  baseUrl= this.url.base;

  constructor(
    private http:HttpClient,
    private route: Router,
  ) { 

  }

  getObservacionAll(): Observable<Observacion[]>{
    return this.http.get<Observacion[]>(this.baseUrl+"/observaciones")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  //metodo inserta nuevo tecnico en el servidor
  insertObservacion(form:Object):Observable<Observacion[]> {
    return this.http.post(this.baseUrl+"/observaciones",form)
    .pipe(
      map((response: any) => response),
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        if(e.error.mensaje){
          //console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

  deleteObservacion(id){
    return this.http.get(this.baseUrl+"/borrar-observacion/"+id)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  //
  getObservacionById(id):Observable<Observacion>{
    return this.http.get<Observacion>(this.baseUrl+"/get-observacion/"+id)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  updateObservacion(form:Observacion){
    return this.http.post(this.baseUrl+"/update-observacion",form)
    .pipe(
      map((response: any) => response),
      catchError(e => {

        if(e.status == 400){
          return throwError(e);
        }

        if(e.error.mensaje){
          //console.error(e.error.mensaje);
        }
        return throwError(e);
      })
    );
  }

}
