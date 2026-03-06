import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ConnectionService } from '../../core/services/connection.service';
import { ConnectionRequest } from '../../core/types/models';

@Component({
  selector: 'app-connections',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputNumberModule,
    NzPageHeaderModule,
    NzTabsModule,
    NzTagModule
  ],
  templateUrl: './connections.component.html',
  styleUrl: './connections.component.scss'
})
export class ConnectionsComponent {
  private readonly connectionService = inject(ConnectionService);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);

  protected pending$ = this.connectionService.getPending();
  protected history$ = this.connectionService.getConnections();
  protected readonly sending = signal(false);

  protected readonly form = this.fb.group({
    receiverId: [null as number | null, [Validators.required]]
  });

  sendRequest(): void {
    if (this.form.invalid || this.sending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    const receiverId = this.form.getRawValue().receiverId as number;
    this.connectionService.sendRequest(receiverId).subscribe({
      next: () => {
        this.sending.set(false);
        this.refresh();
        this.message.success('Connection request sent.');
      },
      error: (err) => {
        this.sending.set(false);
        this.message.error(err?.error?.message ?? 'Unable to send request.');
      }
    });
  }

  respond(requestId: number, accept: boolean): void {
    this.connectionService.respond(requestId, accept).subscribe({
      next: () => {
        this.refresh();
        this.message.success('Request updated.');
      },
      error: (err) => {
        this.message.error(err?.error?.message ?? 'Unable to update request.');
      }
    });
  }

  trackRequest(_: number, request: ConnectionRequest): number {
    return request.id;
  }

  private refresh(): void {
    this.pending$ = this.connectionService.getPending();
    this.history$ = this.connectionService.getConnections();
  }
}
