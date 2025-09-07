import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {IActorId, ISignUp, IToken} from '../info-system/auth.config';
import {catchError, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {jwtDecode} from 'jwt-decode';
import {isPlatformBrowser} from '@angular/common';

class ILoginResponse {
}

@Injectable({
  providedIn: 'root'
})
export class AuthApi {
  private isBrowser: boolean

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId)
  }
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  signUp(user: ISignUp): Observable<any>{
    return this.http.post(`http://localhost:3000/auth/signup`, user).pipe(
      catchError(err => {
        console.error('Error API signUp:', err);
        return throwError(() => err)
      })
    )
  }

  logIn(email: string, password: string) : Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`http://localhost:3000/auth/login`, {email, password}).pipe(
      catchError(err => {
        console.error('Error API logIn:', err);
        return throwError(() => err)
      })
    )
  }

  saveToken(token: string) {
    if (!this.isBrowser) return null;
    return localStorage.setItem('token', token)
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token')
  }

  getRoleFromToken(): string | null {
    const token = this.getToken()
    if (!token) {
      return null
    }

    try {
      const decoded: IToken = jwtDecode(token)
      return decoded.role
    } catch (e) {
      console.log("Token decoded role error: ", e)
      return null
    }
  }

  isAdmin(): boolean {
    return this.getRoleFromToken() === 'admin';
  }

  isActor(): boolean {
    return this.getRoleFromToken() === 'actor';
  }

  getActorId(): Observable<IActorId> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('No token found'));
    }
    try {
      const decoded: IToken = jwtDecode(token);
      const id = decoded.id;
      console.log(id)
      return this.http.get<IActorId>(`http://localhost:3000/auth/me/${id}`, { headers: this.getAuthHeaders() }).pipe(
        catchError(err => {
          console.error('Error API getActorId:', err);
          return throwError(() => err);
        })
      );
    } catch (e) {
      return throwError(() => e);
    }
  }

}
