import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Filtro } from "../modelos-lec/filtro";
import { Router } from '@angular/router';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class LecturasService {
  url: Url = new Url();
  baseUrl= this.url.base;
  
  constructor(
    private http:HttpClient,
    private route: Router,
    ) {
    
   }

   uploadFile(file:object):Observable<any>{
    return this.http.post(this.baseUrl+"/upload",file)
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

   uploadFileRespaldo(file:object):Observable<any>{
    return this.http.post(this.baseUrl+"/lecturas/update",file)
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

   /** 
    * obtiene campos filtro de distribucion
    */
   getFilterFields():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/rutas")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
   }

   /**
    * Obtener filtros de primer orden
    */
   getFirstFilterFields():Observable<Filtro[]>{
    return this.http.get<Filtro[]>(this.baseUrl+"/data-first")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
   }

   /**
    * obtiene parametros de filtro + 1
    */
   getDataFilter(data:object):Observable<Filtro[]>{
    return this.http.post(this.baseUrl+"/data",data)
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

   /** 
    * otiene id lecturas para distribuir
    */
    getDataDistribution(data:object):Observable<Filtro[]>{
      return this.http.post(this.baseUrl+"/data-distribution",data)
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

    /** 
     * distribuir rutas
     */
    distribuirRutasTecnico(data:object):Observable<any>{
      return this.http.post(this.baseUrl+"/distribution",data)
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

  getRutasAll(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/rutas")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  procesarDatosSubidos(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/procesos/orden-temp")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  /**
   * generar tabla temporal para el nuevo mes
   */
  generarDataNuevoMes(): Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/procesos/orden-trabajo")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  /**
    * eliminar datos tabla decobo 
    */
   truncateTableDeCobo():Observable<Filtro[]>{
    return this.http.get<Filtro[]>(this.baseUrl+"/decobo/truncate")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
   }
  
}
