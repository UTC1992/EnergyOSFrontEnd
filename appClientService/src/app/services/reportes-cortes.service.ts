import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class ReportesCortes {

  url: Url = new Url();
  baseUrl: string;
  constructor(
    private http:HttpClient,
    ) {
      this.baseUrl = this.url.baseReportes;
   }

   //metodo edita y actualiza el técnico
  getCortesDiarios(data:Object){
    return this.http.post(this.baseUrl+"/reportes/cortes-diario",data)
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

  getEnviosTecnicos(fecha: string): Observable<any>{
    return this.http.get<any>(this.baseUrl+"/reportes/productividad-tecnico/"+fecha)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

}
