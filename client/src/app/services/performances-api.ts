import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {IPerformance, IUpdatePerformance} from '../info-system/performance.config';
import {IActor} from '../info-system/actor.config';
import {AuthApi} from './auth-api';

@Injectable({
  providedIn: 'root'
})
export class PerformancesApi {
  constructor(private http: HttpClient, private authApi: AuthApi) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authApi.getToken()
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllPerformances(page: number = 1, limit: number = 10, year: number = 2025) :
    Observable<{
      page: number,
      limit: number,
      total: number,
      totalPage: number,
      performances: IPerformance[]
  }> {
    return this.http.get<{page: number, limit: number, total: number, totalPage: number, performances: IPerformance[]}>(`http://localhost:3000/performances?page=${page}&limit=${limit}&year=${year}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformances:', err);
        return throwError(() => err)
      })
    )
  }

  getAllActorsForPerformance() : Observable<{
    page: number,
    limit: number,
    total: number,
    totalPage: number,
    actors: IActor[]
  }> {
    return this.http.get<{page: number, limit: number, total: number, totalPage: number, actors: IActor[]}>(`http://localhost:3000/actors`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllActorsForPerformance:', err);
        return throwError(() => err)
      })
    )
  }

  getAllPerformanceNames() : Observable<IPerformance[]> {
    return this.http.get<IPerformance[]>(`http://localhost:3000/performances/names`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformanceNames:', err);
        return throwError(() => err)
      })
    )
  }

  createPerformance( performance: IPerformance) {
    return this.http.post<IPerformance>(`http://localhost:3000/performances`, performance).pipe(
      catchError(err => {
        console.error('Error creating performance API:', err);
        return throwError(() => err)
      })
    )
  }

  updatePerformance(id: string, performance: IUpdatePerformance) {
    return this.http.patch<IPerformance>(`http://localhost:3000/performances/${id}`, performance, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error updating performance API:', err);
        return throwError(() => err)
      })
    )
  }

  deletePerformance( id: string | null | undefined) {
    return this.http.delete(`http://localhost:3000/performances/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error deleting performance API:', err);
        return throwError(() => err)
      })
    )
  }
}
