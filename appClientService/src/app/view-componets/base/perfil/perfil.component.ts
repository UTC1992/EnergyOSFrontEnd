import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { PerfilService } from '../../../services/perfil.service';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/usuario';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  
  form_password_edicion: FormGroup;
  form_email_edicion: FormGroup;

  nombre_usuario:string;
  empresa:string;
  email:string;
  constructor(
          private perfilService:PerfilService,
          private loginServie:LoginService,
          private formBuilder: FormBuilder,
          private router: Router
  ) { 
    this.nombre_usuario=localStorage.getItem("nombre");
    this.empresa=localStorage.getItem("empresa");
    this.email=localStorage.getItem("email");
    this.createForms();
  }

  ngOnInit() {
  }

  createForms(){
    let usuario = this.loginServie.usuario;
    this.empresa = usuario.empresa;
    this.nombre_usuario = usuario.name;
    this.email = usuario.username;

    this.form_email_edicion = this.formBuilder.group({
      email: [this.email, Validators.required],
    });
    this.form_password_edicion = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
 
  // editar email
  onSubmitEditEmail(){
    let email=this.form_email_edicion.get('email').value;
    if(this.form_email_edicion.valid){
      let input = new FormData();
    input.append('email', email);
    this.perfilService.editarEmail(input)
    .subscribe(
      res=>{
        if(res){
          this.loginServie.getUserDataAutenticate().subscribe(
            res_us=>{
              if(res_us){
                this.showAlert("Éxito!","Email editado con éxito.","success");
                this.loginServie.logout();
                this.router.navigate(['/login']);
              }
            }
          );
        }
      }
    );
    }else{
      this.showAlert("Alerta!","Ingrese un email.","warning");
      return;
    }

    
  }
  
  //editar pass
  onSubmitEditPassword(){
    let pass=this.form_password_edicion.value;
    //console.log(pass);
    if(this.form_password_edicion.valid){
      this.perfilService.editarPassword(this.form_password_edicion.value)
      .subscribe(
        res=>{
          //console.log(res);
          if(res){
            this.showAlert("Éxito!","Contraseña editada con éxito.","success");
            this.loginServie.logout();
            this.router.navigate(['/login']);
          }
        }
      );
    }else{
      this.showAlert("Alerta!","Ingrese una contraseña con mínimo de 6 caracteres.","warning");
      return;
    }
   
  }

  confirmarEditarEmail(){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Al confirmar la edición se cerrará la sesión y deberá ingresar con el nuevo email.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, editar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.onSubmitEditEmail();
      }
    });
  }

  confirmarEditarPass(){
    Swal.fire({
      title: '¿Está seguro?',
      text: "Al confirmar la edición se cerrará la sesión y deberá ingresar con la nueva contraseña.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, editar!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.onSubmitEditPassword();
      }
    });
  }

  showAlert(title, text, type){
    Swal.fire({
      title: title,
      text: text,
      type: type,
      allowOutsideClick: false
    });
  }


}
