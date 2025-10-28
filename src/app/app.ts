import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="main">
      <div class="container">
        <h1>Guess the Number</h1>
        <p class="message">{{ message }}</p>

        <div class="controls">
          <input type="number" [(ngModel)]="guess" min="1" [max]="max" placeholder="Enter a number" />
          <button (click)="check()">Guess</button>
          <button (click)="reset()">Reset</button>
        </div>

        <p class="attempts">Attempts: {{ attempts }}</p>
        <p class="hint">(Secret number is between 1 and {{ max }})</p>
      </div>
    </main>
  `,
  styleUrls: ['./app.css']
})
export class App {
  max = 100;
  secret = this.random();
  guess = '';
  message = `Guess a number between 1 and ${this.max}`;
  attempts = 0;

  private random() {
    return Math.floor(Math.random() * this.max) + 1;
  }

  check() {
    const g = Number(this.guess);
    if (!g || g < 1 || g > this.max) {
      this.message = `Please enter a valid number between 1 and ${this.max}`;
      return;
    }

    this.attempts++;

    if (g === this.secret) {
      this.message = `Correct! The number was ${this.secret}. Attempts: ${this.attempts}. Click Reset to play again.`;
    } else if (g < this.secret) {
      this.message = 'Too low. Try a higher number.';
    } else {
      this.message = 'Too high. Try a lower number.';
    }
  }

  reset() {
    this.secret = this.random();
    this.guess = '';
    this.attempts = 0;
    this.message = `Guess a number between 1 and ${this.max}`;
  }
}