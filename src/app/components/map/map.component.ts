import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  map: mapboxgl.Map;

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
