import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../service/theme.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  current: 'light' | 'dark' = 'light';
  constructor(private theme: ThemeService) {}
  ngOnInit(): void {
    this.theme.init();
    this.current = this.theme.theme;
  }
  set(mode: 'light' | 'dark') {
    this.theme.theme = mode;
    this.current = mode;
  }
}
