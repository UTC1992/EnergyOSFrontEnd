import { Injectable } from '@angular/core';
import { Orden } from '../models/orden';
import { HttpClient,HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  
  url: Url = new Url();
  //baseUrl='http://pruebas.tiendanaturalecuador.online/api/angular';
  //baseUrl='http://gestiondcyk.tecnosolutionscorp.com/api/angular';
  baseUrl: string;
  //baseUrl='http://pruebascortes.tecnosolutionscorp.com/api/angular';
  constructor(
    private http:HttpClient,
    ) {
    this.baseUrl = this.url.base;
   }

  getOrdenes():Observable<Orden[]>{
    return this.http.get<Orden[]>(this.baseUrl+"/ordenes")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  addCsvFiles(file){
      return this.http.post<any>(this.baseUrl+"/ordenes",file)
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

  getActivitiesToDay(fecha,tecnico,actividad,estado):Observable<Orden[]>{
    return this.http.get<Orden[]>(this.baseUrl+"/actividades-fecha/"+fecha+"/"+tecnico+"/"+actividad+"/"+estado)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  getCantones(tipo):Observable<Orden[]>{
    return this.http.get<Orden[]>(this.baseUrl+"/cantones/"+tipo)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  // obtiene sectores desde servicio .. parametro canton type: get
  getSectoresService(tipo,canton):Observable<Orden[]>{
    return this.http.get<Orden[]>(this.baseUrl+"/sectores/"+tipo+"/"+canton)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //obtiene cantidad de actividades 
  getActivitiesCountSec(datos:object):Observable<Orden[]>{
    return this.http.post(this.baseUrl+"/cantidad-post",datos)
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
  // actualizar reconexiones manuales
  validarReconexionesManuales():Observable<any>{
    return this.http.get(this.baseUrl+"/validar-rec")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //obtener rec manuales pendientes
  getRecManualesSinProcesar():Observable<any>{
    return this.http.get(this.baseUrl+"/cont-rec")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //consolidar actividades diarias
  consolidarActividades(date):Observable<any>{
    return this.http.get(this.baseUrl+"/consolidar-actividades/"+date)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //obtner actividades consolidadas por fecha: paremeter date
  obtenerCosolidadosDelDia(date):Observable<Orden[]>{
    return this.http.get<Orden[]>(this.baseUrl+"/actividades-consolidadas/"+date)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  // borrar actividades del dia
  deleteActivities(fecha:object):Observable<any>{
    return this.http.post(this.baseUrl+"/delete-activities",fecha)
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
    
  getRecManual(datos:object):Observable<any[]>{
    return this.http.post(this.baseUrl+"/get-rec-manual",datos)
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