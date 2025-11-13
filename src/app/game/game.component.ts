import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

type Enemy = {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  critical: boolean;
  blink: boolean;
};

type Bullet = { x: number; y: number; vy: number; w: number; h: number };

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // game state
  score = 0;
  wave = 1;
  running = false;

  // player
  px = 0;
  py = 0;
  pW = 48;
  pH = 12;
  moveLeft = false;
  moveRight = false;

  // gameplay
  enemies: Enemy[] = [];
  bullets: Bullet[] = [];
  lastShot = 0;
  shotCooldown = 300; // ms

  // loop
  raf = 0 as any;
  lastTime = 0;

  // konfidenzband
  bandCenter = 240;
  bandThickness = 80;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.clientWidth || 800;
    canvas.height = 480;
    this.reset();

    // keyboard
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  ngOnDestroy(): void {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    cancelAnimationFrame(this.raf);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.score = 0;
    this.wave = 1;
    this.spawnWave();
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.loop);
  }

  reset() {
    this.running = false;
    this.enemies = [];
    this.bullets = [];
    this.score = 0;
    this.wave = 1;
    const canvas = this.canvasRef?.nativeElement;
    if (canvas) {
      this.px = canvas.width / 2;
      this.py = canvas.height - 40;
    }
    cancelAnimationFrame(this.raf);
  }

  private spawnWave() {
    this.enemies = [];
    const canvas = this.canvasRef.nativeElement;
    const count = 5 + this.wave; // increase enemies
    for (let i = 0; i < count; i++) {
      const e: Enemy = {
        x: 40 + Math.random() * (canvas.width - 80),
        y: -Math.random() * 200 - i * 30,
        w: 28,
        h: 20,
        speed: 40 + this.wave * 8 + Math.random() * 30,
        critical: false,
        blink: false
      };
      this.enemies.push(e);
    }
  }

  private loop = (time: number) => {
    const dt = (time - this.lastTime) / 1000;
    this.update(dt);
    this.render();
    this.lastTime = time;
    if (this.running) this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number) {
    const canvas = this.canvasRef.nativeElement;
    // update konfidenzband (sinus)
    const t = performance.now() / 1000;
    this.bandCenter = canvas.height / 2 + Math.sin(t * 0.8) * 40;
    this.bandThickness = 60 + Math.sin(t * 1.3) * 30;

    // player movement
    const speed = 260;
    if (this.moveLeft) this.px -= speed * dt;
    if (this.moveRight) this.px += speed * dt;
    this.px = Math.max(this.pW / 2, Math.min(canvas.width - this.pW / 2, this.px));

    // bullets
    for (const b of this.bullets) {
      b.y += b.vy * dt;
    }
    this.bullets = this.bullets.filter(b => b.y + b.h > 0 && b.y < canvas.height + 20);

    // enemies
    for (const e of this.enemies) {
      e.y += e.speed * dt;
      // critical check
      const bandTop = this.bandCenter - this.bandThickness / 2;
      const bandBottom = this.bandCenter + this.bandThickness / 2;
      if (e.y + e.h > bandTop && e.y < bandBottom) {
        e.critical = true;
        e.blink = Math.floor(performance.now() / 200) % 2 === 0;
      } else {
        e.critical = false;
        e.blink = false;
      }
    }

    // collisions bullets vs enemies
    for (const b of this.bullets) {
      for (const e of this.enemies) {
        if (this.rectIntersect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, e.x - e.w / 2, e.y - e.h / 2, e.w, e.h)) {
          // kill enemy and bullet
          e.y = -9999; // mark offscreen
          b.y = -9999;
          this.score++;
        }
      }
    }
    this.enemies = this.enemies.filter(e => e.y < canvas.height + 50);

    // check if any enemy reached bottom -> game over (stop)
    const reached = this.enemies.some(e => e.y + e.h / 2 >= canvas.height - 10);
    if (reached) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      // keep current frame rendered; player can reset or start
    }

    // if no enemies left, next wave
    if (this.enemies.length === 0 && this.running) {
      this.wave++;
      this.spawnWave();
    }
  }

  private rectIntersect(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) {
    return !(x1 + w1 < x2 || x1 > x2 + w2 || y1 + h1 < y2 || y1 > y2 + h2);
  }

  private render() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    // clear
    ctx.fillStyle = '#07101a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw konfidenzband
    ctx.fillStyle = 'rgba(200,200,200,0.14)';
    ctx.fillRect(0, this.bandCenter - this.bandThickness / 2, canvas.width, this.bandThickness);

    // draw enemies
    for (const e of this.enemies) {
      ctx.save();
      if (e.critical) ctx.fillStyle = e.blink ? '#ff6b6b' : '#ff9b9b';
      else ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.ellipse(e.x, e.y, e.w / 2, e.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // draw bullets
    ctx.fillStyle = '#60a5fa';
    for (const b of this.bullets) {
      ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
    }

    // draw player
    ctx.fillStyle = '#10b981';
    ctx.fillRect(this.px - this.pW / 2, this.py - this.pH / 2, this.pW, this.pH);

    // HUD overlay
    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.fillText(`Score: ${this.score}`, 12, 18);
    ctx.fillText(`Wave: ${this.wave}`, 110, 18);
    if (!this.running) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.fillText('Paused - press Start', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'start';
    }
  }

  // input handlers
  private onKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') this.moveLeft = true;
    if (e.code === 'ArrowRight') this.moveRight = true;
    if (e.code === 'Space') {
      const now = performance.now();
      if (now - this.lastShot > this.shotCooldown) {
        this.fire();
        this.lastShot = now;
      }
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'ArrowLeft') this.moveLeft = false;
    if (e.code === 'ArrowRight') this.moveRight = false;
  };

  private fire() {
    const canvas = this.canvasRef.nativeElement;
    this.bullets.push({ x: this.px, y: this.py - this.pH, vy: -420, w: 6, h: 12 });
  }
}
