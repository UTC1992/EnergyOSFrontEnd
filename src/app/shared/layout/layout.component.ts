import {Component, OnDestroy} from '@angular/core';

import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import {  Modulo } from "../../models/modulo";
import {PermisosService} from '../../services/permisos.service';

import { LoginService } from '../../services/login.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-dashboard',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {

  tituloModulo: string;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
  map(result => result.matches)
  );
  /** 
   * atributos de clase
   */
  usuario: any;
  modulo:Modulo;
  modulos:Modulo[]=[];
 // tecnicos:Observable<Tecnico[]>;
  //modulos:Observable<Modulo[]>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public loginService: LoginService,
    private router:Router,
    private permisosService:PermisosService
    ) {}

    ngOnInit(): void {
      //console.log(this.router.url)
      this.cambiodeModulo(this.router.url);
      this.usuario = this.loginService.usuario.name;
      this.permisosService.getModulos().subscribe(
        result=> {
          this.modulos=result;
        }
      );
      /*
      this.modulos=[
        {nombre:'Cortes',ruta:'/base/inicio'},
        {nombre:'Tecnicos',ruta:'/base/tecnicos'}
      ];*/
    }

    logout(): void{
      let username = this.loginService.usuario.name;
      this.loginService.logout();
      Swal.fire('Logout', `Hola ${username}, has cerrado sesión con éxito!`, 'success');
      this.router.navigate(['/login']);
    }

    cambiodeModulo(ruta): void{
      //console.log(ruta);
      if(ruta == "/base/inicio"){
        this.tituloModulo = "MÓDULO DE CORTES";
      }
      if(ruta == "/lecturas/inicio"){
        this.tituloModulo = "MÓDULO DE LECTURAS";
      }
      if(ruta == "/tecnico/inicio"){
        this.tituloModulo = "MÓDULO DE TÉCNICOS";
      }
      
    }

  /*
  constructor(
    public loginService: LoginService,
    private router:Router
  ){
    
  }

  
  logout(): void{
    let username = this.loginService.usuario.username;
    this.loginService.logout();
    swal('Logout', `Hola ${username}, has cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }
  */

}
