import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { Token } from '../models/token';
import { map, filter, catchError, mergeMap } from 'rxjs/operators';
import { Url } from '../models/Url';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _usuario: Usuario;
  private _token: string;

  url: Url = new Url();
  baseUrl: string;
  baseUrlAngular: string;
  
  constructor(
    private http:HttpClient,
    ) {
      this.baseUrl = this.url.baseLogin;
      this.baseUrlAngular = this.url.base;
   }

  public get usuario(): Usuario{
    if(this._usuario != null){
      return this._usuario;
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string{
    if(this._token != null){
      return this._token;
    } else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null ;
  }

  //obtener token de acceso
  /*autenticarUsuario(usuario:Usuario):Observable<Token>{
    let datos={
      'grant_type':'password',
      'client_id':'2',
      'client_secret':'nYYr0wL8qCuj29M5mN2D3vanaF98dMRsS52KMcM3',
      'username':usuario.username,
      'password':usuario.password,
      'scope':'*'
    }
    return this.http.post(this.baseUrl+"oauth/token",datos).pipe(map((e:Response)=> e.json()));
  }
  */

  login(usuario: Usuario):Observable<any>{
    const urlEndPoint = this.baseUrl+"oauth/token";
    /*let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('client_id','2');
    params.set('client_secret','nYYr0wL8qCuj29M5mN2D3vanaF98dMRsS52KMcM3');
    params.set('scope','*');
    params.set('username',usuario.username);
    params.set('password',usuario.password);
    console.log(params.toString());
    */
    let datos={
      'grant_type':'password',
      'client_id':'2',
      'client_secret':'nYYr0wL8qCuj29M5mN2D3vanaF98dMRsS52KMcM3',
      'username':usuario.username,
      'password':usuario.password,
      'scope':'*'
    }

    return this.http.post(urlEndPoint, datos)
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

  //obtener datos usuario
  getUserDataAutenticate():Observable<Usuario>{
    
    return this.http.get<Usuario>(this.baseUrl +'api/usuarioAutenticado')
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
    //return this.http.get(this.baseUrl+"api/usuarioAutenticado",{headers:this.headers}).pipe(map((e:Response)=> e.json()));
  }

  // validar empresa 
  validarEmpresaActiva():Observable<Usuario>{

    return this.http.get<Usuario>(this.baseUrl +'api/empresaActiva')
    .pipe(catchError( e => {
      if(e.error.mensaje){
        //console.error(e.error.mensaje);
      }
      return throwError(e);
    })
    );
    //return this.http.post(this.baseUrl+"api/empresaActiva",{headers:httpHeaders}).pipe(map((e:Response)=> e.json()));
  }
  guardarUsuario(user: Usuario): void{
    this._usuario = new Usuario();
    this._usuario.name = user.name;
    this._usuario.id_emp = user.id_emp;
    this._usuario.username = user.username;
    this._usuario.empresa = user.empresa;
    this._usuario.idUser = user.idUser;

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string, typeToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
    sessionStorage.setItem("token_type",typeToken);
  }

  obtenerDatosToken(accessToken: string): any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    } else {
      return null;
    }
  }

  isAuthenticated(): boolean{
    let datosToken = this.obtenerDatosToken(this.token);
    if(datosToken != null){
      return true;
    }
    return false;
  }

  //actualizando token FCM para notificaciones push
  updateUserTokenFCM(data){
    const urlEndPoint = this.baseUrlAngular+"/update-token-admin";

    return this.http.post(urlEndPoint, data)
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


/*
logout(){
    localStorage.removeItem("empresa");
    localStorage.removeItem("email");
    localStorage.removeItem("nombre");
    localStorage.removeItem("token");
    localStorage.removeItem("id_emp");
    localStorage.removeItem("token_type");
    location.reload();
    }
  */
  logout(): void{
    let data: any[] = [];
    data.push({
      'id_user': this._usuario.idUser,
      'token': ''
    });
    this.updateUserTokenFCM(data).subscribe(res => {
        //console.log(res);
    });
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    
    //sessionStorage.removeItem('usuario');
    //sessionStorage.removeItem('token');
  }

}
