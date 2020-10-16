import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { MessagingService } from "../../shared/messaging.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usuario: Usuario;

  constructor(
    private loginService:LoginService,
    private router:Router,
    private formBuilder: FormBuilder,
    private messagingService: MessagingService
    ) { 
      this.usuario = new Usuario();
    }

  ngOnInit() {
    if(this.loginService.isAuthenticated()){
      Swal.fire('Login', `Hola ${this.loginService.usuario.name} ya estas logueado!`, 'info');
      this.router.navigate(['/base']);
    }
    this.createForms();

  }

  createForms(){
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  login(){
    this.usuario = this.loginForm.value;
    //console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.password == null){
      Swal.fire('Alerta!', 'Email o password están vacios!', 'warning');
      return;
    }

    this.showCargando();
    this.loginService.login(this.usuario).subscribe(response =>{
      //console.log(response);

      //conversion a objeto para acceder a los datos del token
      //let datosToken = JSON.parse(atob(response.access_token.split(".")[1]));
      ////console.log(datosToken);

      
      this.loginService.guardarToken(response.access_token, response.token_type);
      

      this.loginService.getUserDataAutenticate().subscribe(
        res=>{
          if(res){
            //console.log(res);
            this.loginService.guardarUsuario(res);
            //obtenemos el usuario
            let usuario = this.loginService.usuario;

            //obtener token
            this.messagingService.requestPermission(res['idUser']);
            
            this.router.navigate(['/base']);
            //Swal.fire('Login', `Hola ${usuario.name}, has iniciado sesión con éxito`, 'success');
          }else{
            Swal.close();
            Swal.fire('Alerta!', 'Su cuenta se encuentra bloqueada, comuníquese con soporte técnico', 'warning');
            this.loginService.logout();
          }
        }
      );
    }, error =>{
      if(error.status == 400 || error.status == 401){
        Swal.fire('Error Login', 'Email o clave incorrectas!', 'error');
      }
    });
  }

  showCargando(){
    Swal.fire({
      title: 'Espere por favor...',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      onOpen: () => {
        Swal.showLoading();
      }
    });
  }

/*
    logear(){
      if(!this.username){
        alert("Ingrese un email");
        return;
      }
      if(!this.password){
        alert("Ingrese su contraseña");
        return;
      }
      let usuario=new Usuario();
      usuario.username=this.username;
      usuario.password=this.password;

      this.loginService.login(usuario).subscribe(
        result=>{
          if(result){
            localStorage.setItem("token",result.access_token);
            localStorage.setItem("token_type",result.token_type);
            this.loginService.getUserDataAutenticate().subscribe(
              res=>{
                if(res){
                  localStorage.setItem("nombre",res.name);
                  localStorage.setItem("empresa",res.empresa);
                  localStorage.setItem("email",res.username);
                  localStorage.setItem("id_emp",res.id_emp);
                  ////console.log("respuesta "+res.username);
                  this.router.navigate(['/base']);
                }else{
                  alert("Su cuenta se encuentra bloqueada, comuníquese con soporte técnico");
                  this.CerrarSesion();
                }
              }
            );
          }
        },  
        error=>{
          //console.log(error);
        }
      );
    }
    */
   /*
    CerrarSesion(){
      localStorage.removeItem("empresa");
      localStorage.removeItem("email");
      localStorage.removeItem("nombre");
      localStorage.removeItem("token");
      localStorage.removeItem("id_emp");
      localStorage.removeItem("token_type");
      location.reload();
      }
    */
}
