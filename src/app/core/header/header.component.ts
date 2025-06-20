import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-header',
  imports: [
    NgIcon,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isConnected: boolean = true;
  enableDarkMode: boolean = false;

  ngOnInit(): void {
    this.handleThemeMode();
  };

  // TODO: Fix implementation
  onThemeChange() {
    this.enableDarkMode = !this.enableDarkMode;

    if (!this.enableDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      return;
    };

    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
  };

  handleThemeMode() {
    const theme = localStorage.getItem('color-theme')?.toLowerCase();
    //* Ignore if theme is null
    if (theme === null) return;

    this.enableDarkMode = theme === 'dark';

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      return;
    };

    document.documentElement.classList.remove('dark');
    localStorage.setItem('color-theme', 'light');
  };
};
