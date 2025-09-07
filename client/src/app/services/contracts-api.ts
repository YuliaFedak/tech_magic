import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IContract} from '../info-system/contract.config';
import {catchError, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContractsApi {

  constructor(private http: HttpClient) {
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAllPerformanceByActorId (actorId: string) : Observable<IContract[]> {
    return this.http.get<IContract[]>(`http://localhost:3000/contracts/actor/${actorId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformanceByActorId:', err);
        return throwError(() => err)
      })
    )
  }

  createContract(contract: IContract) {
    return this.http.post<IContract>('http://localhost:3000/contracts', contract, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformanceByActorId:', err);
        return throwError(() => err)
      })
    )
  }

  updateContact(contractId: string, contract: IContract) {
    return this.http.patch<IContract>(`http://localhost:3000/contracts/${contractId}`, contract, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformanceByActorId:', err);
        return throwError(() => err)
      })
    )
  }

  deleteContract(contractId: string) {
    return this.http.delete(`http://localhost:3000/contracts/${contractId}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        console.error('Error API getAllPerformanceByActorId:', err);
        return throwError(() => err)
      })
    )
  }

}
