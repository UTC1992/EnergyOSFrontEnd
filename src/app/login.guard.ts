import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router:Router,
    private loginService: LoginService
    ){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.loginService.isAuthenticated()){
        if(this.isTokenExpirado()){
          this.loginService.logout();
          this.router.navigate(['/login']);
          return false;    
        }
        return true;
      }
      this.router.navigate(['/login']);
      return false;
  }

  isTokenExpirado(): boolean{
    let token = this.loginService.token;
    let payload = this.loginService.obtenerDatosToken(token);
    let now = new Date().getTime() / 1000;
    if(payload.exp < now){
      return true;
    }
    return false;
  }

}



/*
 canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(localStorage.getItem('token')===null){
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      }else{
        return true;
      }
  }
*/
