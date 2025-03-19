import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import { UserClaims, LoginResponse } from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth/login';
  private tokenKey = 'auth_token';

  private userSubject = new BehaviorSubject<UserClaims | null>(
    this.getUserFromToken()
  );
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(this.apiUrl, { email, password })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
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
