import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

import { CategoryService } from '../../core/services/category.service';
import { TrainingService } from '../../core/services/training.service';
import { Category, Training, TrainingLevel, TrainingStatus } from '../../core/types/models';

@Component({
  selector: 'app-trainings-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    RouterModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzPageHeaderModule,
    NzSelectModule,
    NzTagModule,
    NzPaginationModule
  ],
  templateUrl: './trainings-list.component.html',
  styleUrl: './trainings-list.component.scss'
})
export class TrainingsListComponent {
  private readonly trainingService = inject(TrainingService);
  private readonly categoryService = inject(CategoryService);
  private readonly fb = inject(FormBuilder);

  protected readonly categories$ = this.categoryService.getCategories();
  protected readonly pageIndex = signal(1);
  protected readonly pageSize = signal(9);

  protected readonly form = this.fb.group({
    title: [''],
    categoryId: [null as number | null],
    level: [null as TrainingLevel | null],
    status: [null as TrainingStatus | null]
  });

  protected trainings$ = this.loadTrainings();

  readonly levels: TrainingLevel[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
  readonly statuses: TrainingStatus[] = ['OPEN', 'FULL', 'CANCELLED', 'ARCHIVED'];

  applyFilters(): void {
    this.pageIndex.set(1);
    this.trainings$ = this.loadTrainings();
  }

  resetFilters(): void {
    this.form.reset({ title: '', categoryId: null, level: null, status: null });
    this.pageIndex.set(1);
    this.trainings$ = this.loadTrainings();
  }

  changePage(index: number): void {
    this.pageIndex.set(index);
    this.trainings$ = this.loadTrainings();
  }

  private loadTrainings() {
    const { title, categoryId, level, status } = this.form.getRawValue();
    return this.trainingService.getTrainings({
      page: this.pageIndex() - 1,
      size: this.pageSize(),
      title: title ?? undefined,
      categoryId: categoryId ?? undefined,
      level: level ?? undefined,
      status: status ?? undefined
    });
  }

  trackTraining(_: number, training: Training): number {
    return training.id;
  }

  trackCategory(_: number, category: Category): number {
    return category.id;
  }
}
