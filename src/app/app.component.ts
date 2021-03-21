import { Component } from '@angular/core';
import { MessagingService } from "./shared/messaging.service";

import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Gestión Cortes';

  message;

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    //const userId = "UserID" + (Math.floor(Math.random() * 100) + 1);
    //this.messagingService.requestPermission(userId, false);
    this.messagingService.receiveMessage();
    //this.message = this.messagingService.currentMessage
    

  }

}
