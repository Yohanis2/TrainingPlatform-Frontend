import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { ConnectionRequest } from '../types/models';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly http = inject(HttpClient);

  sendRequest(receiverId: number): Observable<ConnectionRequest> {
    return this.http.post<ConnectionRequest>(`${API_BASE_URL}/api/connections/request`, {
      receiverId
    });
  }

  respond(requestId: number, accept: boolean): Observable<ConnectionRequest> {
    return this.http.post<ConnectionRequest>(`${API_BASE_URL}/api/connections/${requestId}/respond`, {
      accept
    });
  }

  getConnections(): Observable<ConnectionRequest[]> {
    return this.http.get<ConnectionRequest[]>(`${API_BASE_URL}/api/connections`);
  }

  getPending(): Observable<ConnectionRequest[]> {
    return this.http.get<ConnectionRequest[]>(`${API_BASE_URL}/api/connections/pending`);
  }
}
