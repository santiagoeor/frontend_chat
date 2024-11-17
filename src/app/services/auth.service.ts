import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: boolean = false;
  public baseUrl = 'http://localhost:3001/api/v1/auth/login';

  private http = inject(HttpClient);
  private router = inject(Router);

  login(credents: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, credents)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Ha ocurrido un error:', error.error.message);
    } else {
      console.error(`Código de error: ${error.status}, ` + `mensaje: ${error.message}`);
    }
    return throwError('Verifique sus credenciales.');
  }

}
