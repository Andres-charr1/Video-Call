import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {
  private apiUrl = 'https://ravishing-courtesy-production.up.railway.app/user/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, password }).pipe(
      tap((res: any) => {
        if (res?.token) {
          localStorage.setItem('external_api_token', res.token);
        }
      })
    );
  }
}
