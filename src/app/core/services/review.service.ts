import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../types/api';
import { Review } from '../types/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly http = inject(HttpClient);

  getReviews(trainingId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${API_BASE_URL}/api/trainings/${trainingId}/reviews`);
  }

  submitReview(trainingId: number, rating: number, comment?: string | null): Observable<Review> {
    return this.http.post<Review>(`${API_BASE_URL}/api/trainings/${trainingId}/reviews`, {
      rating,
      comment
    });
  }
}
