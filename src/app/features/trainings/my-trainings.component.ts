import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { TrainingService } from '../../core/services/training.service';
import { Training } from '../../core/types/models';

@Component({
  selector: 'app-my-trainings',
  standalone: true,
  imports: [AsyncPipe, NgFor, NzCardModule, NzPageHeaderModule, NzTagModule],
  templateUrl: './my-trainings.component.html',
  styleUrl: './my-trainings.component.scss'
})
export class MyTrainingsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly trainingService = inject(TrainingService);

  protected readonly mode = this.route.snapshot.data['mode'] as 'created' | 'enrolled';
  protected readonly trainings$ =
    this.mode === 'created'
      ? this.trainingService.getCreatedTrainings()
      : this.trainingService.getEnrolledTrainings();

  trackTraining(_: number, training: Training): number {
    return training.id;
  }
}
