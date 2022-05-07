import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  public socketStatus = false;
  public usuario = null;

  constructor(private socket: Socket) {
    this.checkStatus();
  }

  /**
   * Método para comprobar nuestra conecciñon al socket.
   */

  checkStatus(): void {
    this.socket.on('connect', () => {
      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      this.socketStatus = false;
    });
  }

  /**
   * Método para emitir nuevos valores a nuestro socket.
   * @param evento
   * @param payload
   * @param callback
   */

  emit(evento: string, payload?: any, callback?: Function): void {
    this.socket.emit(evento, payload, callback);
  }

  /**
   * Método para escuchar cambios en nuestro socket.
   * @param evento
   * @returns Observable<any>
   */

  listen(evento: string): Observable<any> {
    return this.socket.fromEvent(evento);
  }
}
