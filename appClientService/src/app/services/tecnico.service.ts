import { Injectable } from '@angular/core';
import { Tecnico } from '../models/tecnico';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class TecnicoService {

  url: Url = new Url();
  //baseUrl='http://pruebas.tiendanaturalecuador.online/api/angular';
  //baseUrl="http://gestiondcyk.tecnosolutionscorp.com/api/angular";
  baseUrl: string;
  //baseUrl='http://pruebascortes.tecnosolutionscorp.com/api/angular';
  constructor(
    private http:HttpClient,
    ) {
      this.baseUrl = this.url.base;
   }

  //metodo obtiene todos los tecnicos del servidor
  getAllTecnicos():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  /**
   * obtiene tecnicos de cortes
   */
  getTecnicosCortes():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos-cortes")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
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

  //metodo tecnicos con actividades
  getTecnicosSinActividades():Observable<Tecnico[]>{
    return this.http.get<Tecnico[]>(this.baseUrl+"/tecnicos-sin-actividades")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //metodo obtien por id de tenico
  getTecnicoById(id):Observable<Tecnico>{
    return this.http.get<Tecnico>(this.baseUrl+"/get-tecnico/"+id)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  //metodo inserta nuevo tecnico en el servidor
  insertTecnico(form:Object):Observable<Tecnico[]> {
    return this.http.post(this.baseUrl+"/tecnicos",form)
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
  //metodo edita y actualiza el técnico
  updateTecnico(form){
    return this.http.post(this.baseUrl+"/update-tecnico",form)
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
  //metodo borra tecnico
  deleteTecnico(id){
    return this.http.get(this.baseUrl+"/delete-tecnico/"+id)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  //metodo obtien tecnico por tarea 
  buildTecnicoByTask(dataBuild:object):Observable<any>{
    return this.http.post(this.baseUrl+"/build-task",dataBuild)
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

  // obtener resumen todas las actividades asignadas por tecnico
  getAllActivitiesTecnicos():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/actividades-tecnicos")
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }
  // obtiene detalle de actidades por tecnico
  getActivitiesByTecnico(id,tipo,sector):Observable<any>{
    return this.http.get(this.baseUrl+"/actividades-tecnico/"+id+"/"+tipo+"/"+sector)
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
  }

  terminarProcesoAvtividades(id){
    return this.http.get(this.baseUrl+"/finalizar/"+id)
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

  //mostrar detalles de la asignacion de tareas
  showDistribucion():Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+"/mostrar-distribucion")
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
   * SECCION SERVICIOS DE LECTURAS
   */
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

}
