import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  
  url: Url = new Url();
  //baseUrl='http://pruebas.tiendanaturalecuador.online/api';
  baseUrl: string;
  //baseUrl='http://pruebascortes.tecnosolutionscorp.com/api';
  //baseUrl='http://gestiondcyk.tecnosolutionscorp.com/api';
  
  constructor(
    private http:HttpClient,
    ) {
      this.baseUrl = this.url.basePerfil;
   }
   // edit Company
   editarEmpresa(form:object){
    return this.http.post(this.baseUrl+"/editEmpresa",form)
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
   // edit name
   editarNombre(form:object){
    return this.http.post(this.baseUrl+"/editNombre",form)
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
   //editar email
   editarEmail(form:object){
    return this.http.post(this.baseUrl+"/editEmail",form)
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
   // editar password
   editarPassword(form:object){
    return this.http.post(this.baseUrl+"/editPassword",form)
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
