import { Component, inject, signal } from '@angular/core';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';

import { MessageService } from '../../core/services/message.service';
import { Message } from '../../core/types/models';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    DatePipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzPageHeaderModule
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  private readonly messageService = inject(MessageService);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);

  protected readonly conversation$ = signal<Message[]>([]);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    userId: [null as number | null, [Validators.required]],
    content: ['', [Validators.required, Validators.minLength(1)]]
  });

  loadConversation(): void {
    const userId = this.form.getRawValue().userId;
    if (!userId) {
      this.message.warning('Enter a user ID to load the conversation.');
      return;
    }

    this.loading.set(true);
    this.messageService.getConversation(userId).subscribe({
      next: (messages) => {
        this.conversation$.set(messages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.error('Unable to load conversation.');
      }
    });
  }

  sendMessage(): void {
    const { userId, content } = this.form.getRawValue();
    if (!userId || !content) {
      this.message.warning('Choose a user and add a message.');
      return;
    }

    this.messageService.sendMessage(userId, content).subscribe({
      next: () => {
        this.form.patchValue({ content: '' });
        this.loadConversation();
      },
      error: (err) => {
        this.message.error(err?.error?.message ?? 'Unable to send message.');
      }
    });
  }

  trackMessage(_: number, message: Message): number {
    return message.id;
  }
}
