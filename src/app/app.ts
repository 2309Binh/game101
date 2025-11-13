import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <main class="main">
      <div class="container">
        <h1>Anomalie-Jäger</h1>
        <nav>
          <a routerLink="/game">Play</a>
          <button class="start-btn" routerLink="/game">Start Game</button>
        </nav>
      </div>
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.css']
})
export class App {}