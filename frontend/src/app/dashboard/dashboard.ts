import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { RouterModule } from '@angular/router';
import { NavbarHorizontalComponent } from '../shared/navbar-horizontal.component';
import { NavbarVerticalComponent } from '../shared/navbar-vertical.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [RouterModule, NavbarHorizontalComponent, NavbarVerticalComponent]
})
export class Dashboard {
  selectedFile: File | null = null;
  pdfLinks: { name: string, url: SafeUrl }[] = [];

  constructor(
    private router: Router,
  private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  logout(): void {
  this.authService.logout();
    this.router.navigate(['/login']);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadPdf(): void {
    if (this.selectedFile) {
      const url = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.selectedFile));
      this.pdfLinks.push({ name: this.selectedFile.name, url });
      this.selectedFile = null;
    }
  }
}