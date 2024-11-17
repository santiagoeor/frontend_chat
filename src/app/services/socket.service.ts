import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { io, Socket } from "socket.io-client";


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private url = 'http://localhost:3001';

  constructor() {
    this.socket = io(this.url);
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string): Observable<any> {
    return new Observable(observer => {
      this.socket.on(event, (data) => {
        observer.next(data);
      });
    });
  }

}
