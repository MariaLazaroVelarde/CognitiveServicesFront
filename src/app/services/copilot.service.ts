import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Copilot } from '../models/copilot.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CopichatService {

  private apiUrl = '';

  constructor(private http: HttpClient) {}

  crear(pregunta: string): Observable<Copilot> {
    return this.http.post<Copilot>(`${this.apiUrl}/crear`, pregunta, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  editar(id: number, nuevaPregunta: string): Observable<Copilot> {
    return this.http.put<Copilot>(`${this.apiUrl}/editar/${id}`, nuevaPregunta, {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${id}`);
  }

  eliminate(id: number): Observable<Copilot> {
    return this.http.put<Copilot>(`${this.apiUrl}/eliminate/${id}`, {});
  }

  restaurar(id: number): Observable<Copilot> {
    return this.http.put<Copilot>(`${this.apiUrl}/restaurar/${id}`, {});
  }

  listar(): Observable<Copilot[]> {
    return this.http.get<Copilot[]>(`${this.apiUrl}/listar`);
  }

  listarActivos(): Observable<Copilot[]> {
    return this.http.get<Copilot[]>(`${this.apiUrl}/listarA`);
  }

  listarInactivos(): Observable<Copilot[]> {
    return this.http.get<Copilot[]>(`${this.apiUrl}/listarI`);
  }

}
