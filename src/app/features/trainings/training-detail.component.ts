import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TrainingService } from '../../core/services/training.service';
import { ReviewService } from '../../core/services/review.service';
import { Training } from '../../core/types/models';

@Component({
  selector: 'app-training-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzFormModule,
    NzInputModule,
    NzRateModule,
    NzTagModule
  ],
  templateUrl: './training-detail.component.html',
  styleUrl: './training-detail.component.scss'
})
export class TrainingDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly trainingService = inject(TrainingService);
  private readonly reviewService = inject(ReviewService);
  private readonly message = inject(NzMessageService);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected training$ = this.loadTraining();
  protected reviews$ = this.loadReviews();

  protected readonly reviewForm = this.fb.nonNullable.group({
    rating: [4, [Validators.required, Validators.min(1)]],
    comment: ['']
  });

  enroll(trainingId: number): void {
    this.loading.set(true);
    this.trainingService.enroll(trainingId).subscribe({
      next: () => {
        this.loading.set(false);
        this.training$ = this.loadTraining();
      },
      error: (err) => {
        this.loading.set(false);
        this.message.error(err?.error?.message ?? 'Unable to enroll.');
      }
    });
  }

  unenroll(trainingId: number): void {
    this.loading.set(true);
    this.trainingService.unenroll(trainingId).subscribe({
      next: () => {
        this.loading.set(false);
        this.training$ = this.loadTraining();
      },
      error: (err) => {
        this.loading.set(false);
        this.message.error(err?.error?.message ?? 'Unable to unenroll.');
      }
    });
  }

  submitReview(trainingId: number): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const { rating, comment } = this.reviewForm.getRawValue();
    this.reviewService.submitReview(trainingId, rating ?? 0, comment ?? '').subscribe({
      next: () => {
        this.reviews$ = this.loadReviews();
        this.message.success('Review submitted.');
      },
      error: (err) => {
        this.message.error(err?.error?.message ?? 'Unable to submit review.');
      }
    });
  }

  private loadTraining() {
    const trainingId = Number(this.route.snapshot.paramMap.get('id'));
    return this.trainingService.getTraining(trainingId);
  }

  private loadReviews() {
    const trainingId = Number(this.route.snapshot.paramMap.get('id'));
    return this.reviewService.getReviews(trainingId);
  }

  trackTraining(_: number, training: Training): number {
    return training.id;
  }
}
