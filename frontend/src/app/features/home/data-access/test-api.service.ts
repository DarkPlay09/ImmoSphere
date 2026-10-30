import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environments';

@Injectable({
  providedIn: 'root',
})
export class TestApiService {
  private readonly http = inject(HttpClient);

  test() {
    return this.http.get<{ message: string }>(`${environment.apiUrl}/api/test`);
  }
}
