import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'
import Swal from 'sweetalert2';

//notificationes
import { ToastrService } from 'ngx-toastr';

//login service
import { LoginService } from '../services/login.service';

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private toastr: ToastrService,
    private loginService: LoginService
    ) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  /**
   * update token in firebase database
   * 
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(userId, token) {
    console.log("Token a actualizar:");
    // we can change this function to request our backend service
    /*this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
    */
  }

  /**
   * request permission for notification from firebase cloud messaging
   * 
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        //console.log("Token obtenido :");
        //console.log(token);
        //this.updateToken(userId, token);
        let data: any[] = [];
        data.push({
          'id_user': userId,
          'token': token
        });
        this.loginService.updateUserTokenFCM(data).subscribe(res => {
          //console.log(res);
        });
      },
      (err) => {
        //console.error('Unable to get permission to notify.', err);
        return null;
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        //console.log("Nuevo mensaje recivido. ", payload);
        //this.currentMessage.next(payload);
        //console.log(payload['data']['cantidad']);
        /*
        this.showAlert("Éxito",
                      "success", 
                      payload['data']['cantidad'],
                      payload['data']['nombre'],
                      payload['data']['actividad'],
                      payload['data']['hora'] );
        */
        this.showInfo(payload['notification']['title'], payload['notification']['body'] );
      })
  }

  showAlert(title,type, cantidad, nombre, actividad, hora){
    Swal.fire({
      title: title,
      html: '<p>El técnico <strong>' + nombre + '</strong> a enviado sus tareas.<br>'
      +'Tipo de actividad: <b>' + actividad +'</b> .<br>'
      +'Una cantidad de: <b>' + cantidad +'</b> .<br>'
      +'Se envio a las: <b>' + hora +'</b> horas.<br>',
      type: type,
      allowOutsideClick: false
    });
  }

  showSuccess(title, text) {
    this.toastr.success(text, title, {
      timeOut: 0,
      closeButton: true,
      extendedTimeOut: 0,
      disableTimeOut: false,
      tapToDismiss: false
    });
  }

  showError(title, text) {
    this.toastr.error(text, title, {
      timeOut: 0,
      closeButton: true,
      extendedTimeOut: 0,
      disableTimeOut: false,
      tapToDismiss: false
    });
  }

  showInfo(title, text) {
    this.toastr.info(text, title, {
      timeOut: 0,
      closeButton: true,
      extendedTimeOut: 0,
      disableTimeOut: false,
      tapToDismiss: false
    });
  }

  showWarning(title, text) {
    this.toastr.warning(text, title, {
      timeOut: 0,
      closeButton: true,
      extendedTimeOut: 0,
      disableTimeOut: false,
      tapToDismiss: false
    });
  }
  
}