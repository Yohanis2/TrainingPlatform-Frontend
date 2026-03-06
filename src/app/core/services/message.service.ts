import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { Message } from '../types/models';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private readonly http = inject(HttpClient);

  sendMessage(recipientId: number, content: string): Observable<Message> {
    return this.http.post<Message>(`${API_BASE_URL}/api/messages`, {
      recipientId,
      content
    });
  }

  getConversation(userId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${API_BASE_URL}/api/messages/with/${userId}`);
  }
}
