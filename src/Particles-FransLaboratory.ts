const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(ctx);
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'magenta');
gradient.addColorStop(1, 'blue');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

// --- CONTROLES DE UI ---
const particleCountSelect = document.getElementById('particleCount') as HTMLSelectElement;
const particleSpeedSlider = document.getElementById('particleSpeed') as HTMLInputElement;

let globalSpeed = Number(particleSpeedSlider?.value) || 5;

particleSpeedSlider?.addEventListener('input', () => {
    globalSpeed = Number(particleSpeedSlider.value);
    // velocidad de todas las partículas activas
    effect?.particles.forEach(p => p.setSpeed(globalSpeed));
});

class Particle {
    effect: Effect;
    radius: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    maxSpeed: number;

    constructor(effect: Effect) {
        this.effect = effect;
        this.radius = Math.random() * 5 + 2;
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.maxSpeed = globalSpeed;
        this.vx = 0;
        this.vy = 0;
        this.setSpeed(globalSpeed);
    }

    setSpeed(speed: number) {
        this.maxSpeed = speed;
        const angle = Math.atan2(this.vy ?? 0, this.vx ?? 0);
        const v = Math.random() * speed;
        this.vx = Math.cos(angle) * v || (Math.random() * 2 - 1) * speed;
        this.vy = Math.sin(angle) * v || (Math.random() * 2 - 1) * speed;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        // Limitar velocidad máxima
        const v = Math.hypot(this.vx, this.vy);
        if (v > this.maxSpeed) {
            this.vx = (this.vx / v) * this.maxSpeed;
            this.vy = (this.vy / v) * this.maxSpeed;
        }
        // Rebote en bordes
        if (this.x > this.effect.width - this.radius) { this.x = this.effect.width - this.radius; this.vx *= -1; }
        if (this.x < this.radius) { this.x = this.radius; this.vx *= -1; }
        if (this.y > this.effect.height - this.radius) { this.y = this.effect.height - this.radius; this.vy *= -1; }
        if (this.y < this.radius) { this.y = this.radius; this.vy *= -1; }
    }
}

class Effect {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
    particles: Particle[];
    numberOfParticles: number;

    constructor(canvas: HTMLCanvasElement, numberOfParticles: number) {
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = numberOfParticles;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    handleParticles(context: CanvasRenderingContext2D) {
        this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }

    connectParticles(context: CanvasRenderingContext2D) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
}

    // INICIALIZACIÓN Y REINICIO
let effect = new Effect(canvas, Number(particleCountSelect?.value) || 600);

function restartEffect() {
    effect = new Effect(canvas, Number(particleCountSelect.value));
    effect.particles.forEach(p => p.setSpeed(globalSpeed));
}

particleCountSelect?.addEventListener('change', () => {
    restartEffect();
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    effect.width = canvas.width;
    effect.height = canvas.height;
    restartEffect();
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}

animate();
