import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { NgIcon } from '@ng-icons/core';

import { ConfigService } from '@src/app/services';

@Component({
  selector: 'app-header',
  imports: [
    NgIcon,
    NgClass,
    AsyncPipe
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  private config = inject(ConfigService);
  networkStatus$: Observable<boolean> = of(true);
  isConnected: boolean = true;
  enableDarkMode: boolean = false;

  ngOnInit(): void {
    this.networkStatus$ = this.config.networkStatus$.pipe(
      tap(status => this.isConnected = status)
    );

    this.handleThemeMode();
  };

  onThemeChange() {
    this.enableDarkMode = !this.enableDarkMode;
    const isDarkMode = document.documentElement.classList.toggle('dark');

    localStorage.setItem('color-theme', isDarkMode ? 'dark' : 'light');
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
