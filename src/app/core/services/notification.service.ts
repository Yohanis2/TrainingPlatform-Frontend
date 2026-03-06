import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { Notification } from '../types/models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly http = inject(HttpClient);

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${API_BASE_URL}/api/notifications`);
  }

  markRead(notificationId: number): Observable<Notification> {
    return this.http.patch<Notification>(`${API_BASE_URL}/api/notifications/${notificationId}/read`, {});
  }
}
