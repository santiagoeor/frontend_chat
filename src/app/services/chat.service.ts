import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private url = 'http://localhost:3001';

  private http = inject(HttpClient);

  enviarMensaje(mensaje: any): Observable<any> {
    return this.http.post(`${this.url}/mensaje_nuevo`, mensaje);
  }


}
