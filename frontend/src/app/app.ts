import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TestApiService } from './features/home/data-access/test-api.service';
import { AuthSessionService } from './features/auth/data-access/auth-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly testApiService = inject(TestApiService);
  private readonly authSession = inject(AuthSessionService);

  message = signal('');

  constructor() {
    this.authSession.refresh();
  }

  envoyerRequete() {
    this.testApiService.test().subscribe({
      next: (response) => {
        this.message.set(response.message);
      },
      error: (error) => {
        console.error(error);
        this.message.set('Erreur lors de la requête HTTP');
      },
    });
  }
}
