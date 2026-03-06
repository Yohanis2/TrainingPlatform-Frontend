import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/types/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgFor, NzButtonModule, NzCardModule, NzPageHeaderModule, NzTagModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  private readonly notificationService = inject(NotificationService);
  private readonly message = inject(NzMessageService);

  protected notifications$ = this.notificationService.getNotifications();

  markRead(notificationId: number): void {
    this.notificationService.markRead(notificationId).subscribe({
      next: () => {
        this.notifications$ = this.notificationService.getNotifications();
      },
      error: (err) => {
        this.message.error(err?.error?.message ?? 'Unable to update notification.');
      }
    });
  }

  trackNotification(_: number, notification: Notification): number {
    return notification.id;
  }
}
