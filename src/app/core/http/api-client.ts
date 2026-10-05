import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ENVIRONMENT } from '@app/core/config/environment';
import { ApiPage, ApiResponse } from './api-response';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly env = inject(ENVIRONMENT);

  get<T>(path: string, params?: HttpParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.url(path), { params })
      .pipe(map((response) => this.unwrap(response)));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(this.url(path), body)
      .pipe(map((response) => this.unwrap(response)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(this.url(path), body)
      .pipe(map((response) => this.unwrap(response)));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(this.url(path), body)
      .pipe(map((response) => this.unwrap(response)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(this.url(path))
      .pipe(map((response) => this.unwrap(response)));
  }

  page<T>(path: string, page = 1, limit = 20, search?: string): Observable<ApiPage<T>> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }
    return this.get<ApiPage<T>>(path, params);
  }

  private url(path: string): string {
    const base = this.env.apiBase.replace(/\/$/, '');
    const relative = path.replace(/^\//, '');
    return `${base}/${relative}`;
  }

  private unwrap<T>(response: ApiResponse<T>): T {
    if (!response?.success) {
      throw new Error(response?.message || 'Request failed');
    }
    return response.data;
  }
}
