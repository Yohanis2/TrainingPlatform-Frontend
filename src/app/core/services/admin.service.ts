import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { Role, User } from '../types/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_BASE_URL}/api/admin/users`);
  }

  updateRole(userId: number, role: Role): Observable<User> {
    return this.http.patch<User>(`${API_BASE_URL}/api/admin/users/${userId}/role`, { role });
  }
}
