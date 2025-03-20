import { HttpClient } from '@angular/common/http';
import { Inject, inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { UserClaims, LoginResponse, LoginRequest } from '../interfaces/auth.interface';
import { API_BASE_URL } from '../../../app.config';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = inject(API_BASE_URL);
  private tokenKey = 'auth_token';

  private userSubject = new BehaviorSubject<UserClaims | null>(
    this.getUserFromToken()
  );
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, @Inject(API_BASE_URL) apiUrl: string) {
    this.apiUrl = `${apiUrl}/auth/login`;
  }
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials).pipe(
      tap((response) => this.setToken(response.token)),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(() => new Error('Error de autenticación'));
      })
    );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.userSubject.next(this.decodeToken(token));
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private decodeToken(token: string): UserClaims | null {
    try {
      return jwtDecode<UserClaims>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserFromToken(): UserClaims | null {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  getUserRole(): string | null {
    return this.userSubject.value?.role || null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }
}
