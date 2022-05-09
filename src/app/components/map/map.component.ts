import { Component, OnInit } from '@angular/core';
import { Place } from 'src/app/interfaces/place.interface';
import { environment } from 'src/environments/environment';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;
  places: Place[] = [
    {
      id: '1',
      name: 'Fernando',
      lng: -75.75512993582937,
      lat: 45.349977429009954,
      color: '#dd8fee',
    },
    {
      id: '2',
      name: 'Amy',
      lng: -75.75195645527508,
      lat: 45.351584045823756,
      color: '#790af0',
    },
    {
      id: '3',
      name: 'Orlando',
      lng: -75.75900589557777,
      lat: 45.34794635758547,
      color: '#19884b',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.createMap();
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
  }
}
