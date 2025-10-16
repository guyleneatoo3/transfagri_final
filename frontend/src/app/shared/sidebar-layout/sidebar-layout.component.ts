import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-layout.component.html',
  styleUrls: ['./sidebar-layout.component.css']
})
export class SidebarLayoutComponent {
  sidebarOpen = false;
  role: string | null = null;
  profileOpen = false;

  constructor(private auth: AuthService, private router: Router) {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('role') : null;
    this.role = raw ? raw.replace(/^ROLE_/i, '').toUpperCase() : null;
  }

  toggle() { this.sidebarOpen = !this.sidebarOpen; }
  closeOnNav() { this.sidebarOpen = false; }
  toggleProfile() { this.profileOpen = !this.profileOpen; }
  logout() {
    this.auth.logout();
    this.profileOpen = false;
    this.router.navigate(['/login']);
  }
}
