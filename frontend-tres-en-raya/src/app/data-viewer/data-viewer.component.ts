import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Game, Player } from '../models/interfaces.model'

@Component({
  selector: 'app-data-viewer',
  templateUrl: './data-viewer.component.html',
  styleUrls: ['./data-viewer.component.css']
})
export class DataViewerComponent implements OnInit {

  private baseUrl = 'http://192.168.0.37:3000/'; // URL de tu backend para el recurso game

  games: Game[] = []; // Aquí almacenaremos la lista de juegos

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchAllGames();
    this.fetchGameById(1);
    this.fetchPlayerById(1);
  }

  fetchAllGames(): void {
    this.http.get<Game[]>(`${this.baseUrl}game`).subscribe(
      data => {
        console.log('Datos recibidos del backend:', data);
        this.games = data;
      },
      error => {
        console.error('Error al obtener datos:', error);
      }
    );
  }

  // Si necesitas obtener un juego específico por su ID:
  fetchGameById(id: number): void {
    this.http.get<Game>(`${this.baseUrl}game/${id}`).subscribe(
      data => {
        console.log(`Datos del juego con ID ${id}:`, data);
      },
      error => {
        console.error(`Error al obtener el juego con ID ${id}:`, error);
      }
    );
  }

  fetchPlayerById(id: number): void {
    this.http.get<Player>(`${this.baseUrl}player/${id}`).subscribe(
      data => {
        console.log(`Datos del juego con ID ${id}:`, data);
      },
      error => {
        console.error(`Error al obtener el juego con ID ${id}:`, error);
      }
    );
  }

  // ... Puedes agregar más métodos aquí si necesitas interactuar con otros endpoints (crear, actualizar, eliminar).

}

// Puedes definir una interfaz para el tipo Game si aún no la tienes en otro lugar
