import { Component, OnDestroy, OnInit } from '@angular/core';
import { Place } from 'src/app/interfaces/place.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Marker } from 'src/app/interfaces/marker.interface';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map;
  places: Marker = {};
  mapboxMarker: { [id: string]: mapboxgl.Marker } = {};
  private addedSubscription: Subscription;
  private deletedSubscription: Subscription;
  private movedSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private wsSocektService: WebsocketService
  ) {}

  ngOnInit(): void {
    this.http
      .get<Marker>(`${environment.wsUrl}/mapa`)
      .subscribe((markers: Marker) => {
        this.places = markers;
        this.createMap();
      });

    this.listenSockets();
  }

  /**
   * Método para esuchar nuestros cambios en el sockets.
   */

  listenSockets(): void {
    // marcador nuevo.
    this.addedSubscription = this.wsSocektService
      .listen('marker-added')
      .subscribe((marker: Place) => this.addMarker(marker));

    // marcador eliminado.
    this.deletedSubscription = this.wsSocektService
      .listen('marker-deleted')
      .subscribe((id: string) => {
        this.mapboxMarker[id].remove();
        delete this.mapboxMarker[id];
      });

    // marcador relocalizado.
    this.movedSubscription = this.wsSocektService
      .listen('marker-moved')
      .subscribe((marker: Place) => {
        this.mapboxMarker[marker.id].setLngLat([marker.lng, marker.lat]);
      });
  }

  /**
   * Método para crear nuestro mapa en la vista.
   */

  createMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-75.75512993582937, 45.349977429009954], // starting position [lng, lat]
      zoom: 15.8, // starting zoom
      accessToken: environment.mapBoxToken,
    });

    /**
     * Creamos nuestros marcadores del servidor en la vista.
     * Desestructurando la respuesta de nuestros lugares.
     */
    for (const [id, marker] of Object.entries(this.places)) {
      this.addMarker(marker);
    }
  }

  /**
   * Método para agregar un marcador en el mapa.
   * @param {Place} marker
   */

  addMarker(marker: Place): void {
    const h2 = (document.createElement('h2').innerText = marker.name);
    const br = document.createElement('br');
    const buttonDelete = document.createElement('button');
    buttonDelete.innerText = 'Borrar';
    const div = document.createElement('div');
    div.append(h2, br, buttonDelete);

    const customPopup = new mapboxgl.Popup({
      offset: 25,
      closeOnClick: false,
    }).setDOMContent(div);

    const newMarker = new mapboxgl.Marker({
      draggable: true,
      color: marker.color,
    })
      .setLngLat([marker.lng, marker.lat])
      .setPopup(customPopup)
      .addTo(this.map);

    newMarker.on('drag', () => {
      const lngLat = newMarker.getLngLat();
      const markerMoved = {
        ...marker,
        lngLat,
      };

      this.wsSocektService.emit('move-marker', markerMoved);
    });

    buttonDelete.addEventListener('click', () => {
      newMarker.remove();
      this.wsSocektService.emit('delete-marker', marker.id);
    });

    this.mapboxMarker[marker.id] = marker as any;
  }

  /**
   * Método para crear un nuevo marcador.
   */

  createMarker(): void {
    const marker: Place = {
      id: new Date().toISOString(),
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      name: 'No name',
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    this.addMarker(marker);
    /**
     * Emitimos nuestro marcador por socket.
     */
    this.wsSocektService.emit('new-marker', marker);
  }

  ngOnDestroy(): void {
    this.addedSubscription?.unsubscribe();
    this.deletedSubscription?.unsubscribe();
    this.movedSubscription?.unsubscribe();
  }
}
