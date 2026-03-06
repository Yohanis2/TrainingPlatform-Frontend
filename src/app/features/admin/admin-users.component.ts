import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../core/services/admin.service';
import { Role, User } from '../../core/types/models';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [AsyncPipe, NgFor, FormsModule, NzButtonModule, NzPageHeaderModule, NzSelectModule, NzTableModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent {
  private readonly adminService = inject(AdminService);
  private readonly message = inject(NzMessageService);

  protected users$ = this.adminService.getUsers();
  protected readonly updating = signal<number | null>(null);

  readonly roles: Role[] = ['ROLE_ADMIN', 'ROLE_TRAINER', 'ROLE_USER'];

  updateRole(user: User, role: Role): void {
    this.updating.set(user.id);
    this.adminService.updateRole(user.id, role).subscribe({
      next: () => {
        this.updating.set(null);
        this.users$ = this.adminService.getUsers();
        this.message.success('Role updated.');
      },
      error: (err) => {
        this.updating.set(null);
        this.message.error(err?.error?.message ?? 'Unable to update role.');
      }
    });
  }

  trackUser(_: number, user: User): number {
    return user.id;
  }
}
