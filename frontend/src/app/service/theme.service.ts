import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private key = 'theme';

  get theme(): 'light' | 'dark' {
    if (typeof localStorage === 'undefined') return 'light';
    return (localStorage.getItem(this.key) as 'light' | 'dark') || 'light';
  }

  set theme(value: 'light' | 'dark') {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', value === 'dark');
      document.body.classList.toggle('dark', value === 'dark');
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem(this.key, value);
  }

  init() {
    this.theme = this.theme; // apply stored
  }
}
