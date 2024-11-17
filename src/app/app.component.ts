import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { SocketService } from './services/socket.service';

interface Mensaje {
  mensaje: string;
  id: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  private socketService = inject(SocketService);
  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public contenidoMensaje!: Mensaje;
  public mostrarChat: boolean = false;
  public idUser: number = 0;
  public nombreUser: string = '';

  public mensajes: any = [];

  public myForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  public myFormMessage: FormGroup = this.fb.group({
    mensaje: ['', [Validators.required, Validators.minLength(3)]]
  });

  ngOnInit(): void {
    this.socketService.on('nuevo_mensaje').subscribe((data) => {
      this.contenidoMensaje = data;
      this.mensajes.push(data);
    });

    this.verifiLogin();

  }

  verifiLogin() {
    const dataLocalStorage = localStorage.getItem('token_chat');
    if (dataLocalStorage) {
      const data = JSON.parse(dataLocalStorage);

      this.contenidoMensaje = { mensaje: 'Hola Mundo socket', id: data.id };
      this.idUser = data.id;
      this.nombreUser = data.user;
      this.mostrarChat = true;
    }
  }

  mensajeNuevo() {
    if (this.myFormMessage.invalid) {
      alert('Debe escribir pa enviar el mensaje');
    } else {

      const data = {
        mensaje: this.myFormMessage.value.mensaje,
        id: this.idUser
      }

      this.chatService.enviarMensaje(data).subscribe({
        next: (data) => {
          console.log(data);
          this.myFormMessage.reset();
        }
      });
    }
  }

  verificarCredenciales() {
    if (this.myForm.invalid) {
      alert('debe llenar usuario y contraseña');
    } else {
      console.log(this.myForm.value);

      //    const data = {
      //   usuario: "pablo@gmail.com",
      //   password: "123456",
      // };
      this.authService.login(this.myForm.value).subscribe({
        next: (data) => {
          console.log(data);
          localStorage.removeItem('token_chat');
          localStorage.setItem('token_chat', JSON.stringify(data.user));
          this.contenidoMensaje = { mensaje: 'Hola Mundo socket', id: data.user.id };
          this.idUser = data.user.id;
          this.nombreUser = data.user.user;
          this.mostrarChat = true;
        },
        error: (err) => {
          console.log(err);
        }
      });
    }


  }


}
