import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {IActor} from '../info-system/actor.config';

@Injectable({
  providedIn: 'root'
})
export class ActorsApi {
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllActors(page: number = 1, limit: number = 10) :
    Observable<{
    page: number,
      limit: number,
      total: number,
      totalPage: number,
      actors: IActor[]}> {
    return this.http.get<{page: number, limit: number, total: number, totalPage: number, actors: IActor[]}>(`http://localhost:3000/actors?page=${page}&limit=${limit}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllActors:', err);
        return throwError(() => err)
      })
    )
  }

  getOneActor(id: string) : Observable<IActor> {
    return this.http.get<IActor>(`http://localhost:3000/actors/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getOneActors:', err);
        return throwError(() => err)
      })
    )
  }

  updateActor(id: string, actor: IActor) : Observable<IActor> {
    return this.http.patch<IActor>(`http://localhost:3000/actors/${id}`, actor, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API updateActors:', err);
        return throwError(() => err)
      })
    )
  }

  deleteActor(id: string | null | undefined) {
    return this.http.delete(`http://localhost:3000/actors/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API deleteActors:', err);
        return throwError(() => err)
      })
    )
  }
}
