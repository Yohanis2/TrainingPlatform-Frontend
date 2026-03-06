import { DOCUMENT, NgOptimizedImage } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

import { SiteFooterComponent } from '../../shared/site-footer.component';

type SectionId = 'home' | 'about' | 'service' | 'contact';

@Component({
  selector: 'app-public-home',
  standalone: true,
  imports: [
    RouterLink,
    NgOptimizedImage,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzDividerModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    SiteFooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private readonly document = inject(DOCUMENT);
  private readonly fb = inject(FormBuilder);
  private readonly message = inject(NzMessageService);

  protected isScrolled = false;
  protected isMenuOpen = false;
  protected activeSection: SectionId = 'home';

  protected readonly contactForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(5)]]
  });

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const top = window.scrollY;
    this.isScrolled = top > 16;
    this.updateActiveSection(top);
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateAndClose(section: SectionId, event?: Event): void {
    this.scrollTo(section, event);
    this.isMenuOpen = false;
  }

  scrollTo(section: SectionId, event?: Event): void {
    event?.preventDefault();
    const target = this.document.getElementById(section);
    if (!target) {
      return;
    }

    this.activeSection = section;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.message.success('Message sent successfully. We will contact you soon.');
    this.contactForm.reset({ name: '', email: '', message: '' });
  }

  private updateActiveSection(scrollTop: number): void {
    const sections: SectionId[] = ['home', 'about', 'service', 'contact'];
    let current: SectionId = 'home';

    for (const id of sections) {
      const element = this.document.getElementById(id);
      if (!element) {
        continue;
      }

      const offsetTop = element.getBoundingClientRect().top + scrollTop - 120;
      if (scrollTop >= offsetTop) {
        current = id;
      }
    }

    this.activeSection = current;
  }
}
