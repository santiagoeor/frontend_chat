import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private socketService = inject(SocketService);
  private chatService = inject(ChatService);

  public contenidoMensaje = '';

  ngOnInit(): void {

    this.socketService.on('nuevo_mensaje').subscribe((data) => {
      this.contenidoMensaje = data.mensaje;
    });

  }

  mensajeNuevo() {
    this.chatService.enviarMensaje({ mensaje: 'Hola Mundo socket' }).subscribe({
      next: (data) => {
        console.log(data);
      }
    })
  }


}
