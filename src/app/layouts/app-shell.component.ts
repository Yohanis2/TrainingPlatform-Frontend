import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {NzDropdownDirective, NzDropdownMenuComponent, NzDropDownModule} from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTypographyModule } from 'ng-zorro-antd/typography';

import { AuthService } from '../core/services/auth.service';
import { NotificationService } from '../core/services/notification.service';
import { Notification } from '../core/types/models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    NzAvatarModule,
    NzBadgeModule,
    NzButtonModule,
    NzDropDownModule,
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzTypographyModule,
    NzDropdownDirective,
    NzDropdownMenuComponent
  ],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  protected readonly collapsed = signal(false);
  protected readonly isMobile = signal(false);
  protected readonly currentYear = new Date().getFullYear();
  protected readonly user$ = this.auth.user$;
  protected unreadCount = signal(0);

  constructor() {
    this.syncViewportState();

    this.notifications.getNotifications().subscribe({
      next: (items) => this.unreadCount.set(items.filter((item) => !item.read).length),
      error: () => this.unreadCount.set(0)
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.syncViewportState();
  }

  logout(): void {
    this.auth.logout();
  }

  toggleCollapsed(): void {
    if (this.collapsed()) {
      this.collapsed.set(false);
      return;
    }

    this.collapsed.set(true);
  }

  closeSidebar(): void {
    this.collapsed.set(true);
  }

  isAdmin(): boolean {
    return this.auth.hasRole('ROLE_ADMIN');
  }

  siderWidth(): number {
    if (this.isMobile()) {
      return this.collapsed() ? 0 : 260;
    }

    return this.collapsed() ? 80 : 260;
  }

  menuInlineCollapsed(): boolean {
    return !this.isMobile() && this.collapsed();
  }

  onMenuItemClick(): void {
    if (this.isMobile()) {
      this.collapsed.set(true);
    }
  }

  trackNotification(_: number, item: Notification): number {
    return item.id;
  }

  private syncViewportState(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const mobile = window.innerWidth < 992;
    const mobileChanged = mobile !== this.isMobile();

    this.isMobile.set(mobile);

    if (mobileChanged && mobile) {
      this.collapsed.set(mobile);
    }

    if (mobileChanged && !mobile) {
      this.collapsed.set(false);
    }
  }
}
