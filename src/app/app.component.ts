import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { initFlowbite } from 'flowbite';

import { HeaderComponent } from './core';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'tranglo-frontend-assessment';

  private config = inject(ConfigService);

  ngOnInit(): void {
    this.config.listenNetworkStatus();

    initFlowbite();
  };
};
