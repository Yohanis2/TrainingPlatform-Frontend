import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';

import { CategoryService } from '../../core/services/category.service';
import { TrainingService } from '../../core/services/training.service';
import { Category, TrainingLevel } from '../../core/types/models';

@Component({
  selector: 'app-training-create',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzPageHeaderModule,
    NzSelectModule
  ],
  templateUrl: './training-create.component.html',
  styleUrl: './training-create.component.scss'
})
export class TrainingCreateComponent {
  private readonly trainingService = inject(TrainingService);
  private readonly categoryService = inject(CategoryService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly loading = signal(false);
  protected readonly categories$ = this.categoryService.getCategories();
  protected readonly levels: TrainingLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];

  protected readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    categoryId: [null as number | null, [Validators.required]],
    level: ['BEGINNER' as TrainingLevel, [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    capacity: [10, [Validators.required, Validators.min(1)]],
    startDate: [null as Date | null],
    endDate: [null as Date | null]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    if (!value.categoryId) {
      this.message.warning('Select a category before publishing.');
      return;
    }

    this.loading.set(true);
    this.trainingService
      .createTraining({
        title: value.title,
        description: value.description,
        categoryId: value.categoryId,
        level: value.level,
        price: value.price,
        capacity: value.capacity,
        startDate: value.startDate ? value.startDate.toISOString() : null,
        endDate: value.endDate ? value.endDate.toISOString() : null
      })
      .subscribe({
        next: (training) => {
          this.loading.set(false);
          this.message.success('Training created.');
          this.router.navigate(['/trainings', training.id]);
        },
        error: (err) => {
          this.loading.set(false);
          this.message.error(err?.error?.message ?? 'Unable to create training.');
        }
      });
  }

  trackCategory(_: number, category: Category): number {
    return category.id;
  }
}
