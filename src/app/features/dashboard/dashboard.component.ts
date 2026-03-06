import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { TrainingService } from '../../core/services/training.service';
import { Training } from '../../core/types/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    RouterModule,
    NzCardModule,
    NzPageHeaderModule,
    NzTagModule,
    NzTypographyModule,
    NzButtonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private readonly trainingService = inject(TrainingService);

  protected readonly latestTrainings$ = this.trainingService.getTrainings({ page: 0, size: 4 });

  trackTraining(_: number, training: Training): number {
    return training.id;
  }
}
