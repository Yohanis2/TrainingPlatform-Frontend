import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { Page, Training, TrainingLevel, TrainingStatus } from '../types/models';

export interface TrainingCreatePayload {
  title: string;
  description: string;
  categoryId: number;
  level: TrainingLevel;
  price: number;
  capacity: number;
  startDate?: string | null;
  endDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private readonly http = inject(HttpClient);

  getTrainings(params: {
    page?: number;
    size?: number;
    title?: string;
    categoryId?: number | null;
    level?: TrainingLevel | null;
    status?: TrainingStatus | null;
  }): Observable<Page<Training>> {
    let httpParams = new HttpParams()
      .set('page', String(params.page ?? 0))
      .set('size', String(params.size ?? 10));

    if (params.title) {
      httpParams = httpParams.set('title', params.title);
    }
    if (params.categoryId) {
      httpParams = httpParams.set('categoryId', String(params.categoryId));
    }
    if (params.level) {
      httpParams = httpParams.set('level', params.level);
    }
    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<Page<Training>>(`${API_BASE_URL}/api/trainings`, {
      params: httpParams
    });
  }

  getTraining(id: number): Observable<Training> {
    return this.http.get<Training>(`${API_BASE_URL}/api/trainings/${id}`);
  }

  getCreatedTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${API_BASE_URL}/api/trainings/created`);
  }

  getEnrolledTrainings(): Observable<Training[]> {
    return this.http.get<Training[]>(`${API_BASE_URL}/api/trainings/enrolled`);
  }

  createTraining(payload: TrainingCreatePayload): Observable<Training> {
    return this.http.post<Training>(`${API_BASE_URL}/api/trainings`, payload);
  }

  enroll(trainingId: number): Observable<Training> {
    return this.http.post<Training>(`${API_BASE_URL}/api/trainings/${trainingId}/enroll`, {});
  }

  unenroll(trainingId: number): Observable<Training> {
    return this.http.post<Training>(`${API_BASE_URL}/api/trainings/${trainingId}/unenroll`, {});
  }

  deleteTraining(trainingId: number): Observable<void> {
    return this.http.delete<void>(`${API_BASE_URL}/api/trainings/${trainingId}`);
  }
}
