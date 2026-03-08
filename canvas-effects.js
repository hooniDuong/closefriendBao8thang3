const canvas = document.getElementById('canvas-overlay');
const ctx = canvas.getContext('2d', { alpha: true });

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let particles = [];
let animationFrameId;

// Fireworks Logic (Lock Screen)
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.05;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
    }
    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

window.TriggerFireworks = function () {
    const colors = ['#ff4f87', '#ffddee', '#ffffff', '#ffb6c1'];
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const x = canvas.width / 2 + (Math.random() - 0.5) * 200;
            const y = canvas.height / 2 + (Math.random() - 0.5) * 200;
            const color = colors[Math.floor(Math.random() * colors.length)];
            createBurst(x, y, color);
        }, i * 300);
    }

    if (!animationFrameId) render();
};

function createBurst(x, y, color) {
    for (let i = 0; i < 60; i++) {
        particles.push(new FireworkParticle(x, y, color));
    }
}

// Surprise Section Logic (Celestial Rain & Blooming)
class CelestialParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 1;
        this.opacity = Math.random();
        this.color = Math.random() > 0.5 ? '#ffffff' : '#ffddee';
    }
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
    }
}

class BloomFlower {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height - (Math.random() * 80);
        this.maxRadius = Math.random() * 8 + 4;
        this.radius = 0;
        this.color = `hsl(${Math.random() * 60 + 300}, 80%, 60%)`; // Pinks/Purples
        this.growthRate = Math.random() * 0.05 + 0.02;
        this.bloomed = false;
        this.delay = Math.random() * 100; // frames to wait before growing
        this.currentDelay = 0;
    }
    update() {
        if (this.currentDelay < this.delay) {
            this.currentDelay++;
            return;
        }
        if (this.radius < this.maxRadius) {
            this.radius += this.growthRate;
        } else {
            this.bloomed = true;
        }
    }
    draw() {
        if (this.radius <= 0) return;
        ctx.save();
        ctx.beginPath();

        ctx.moveTo(this.x + this.radius, this.y);
        for (let i = 1; i <= 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const px = this.x + Math.cos(angle) * this.radius;
            const py = this.y + Math.sin(angle) * this.radius;
            ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Center
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius / 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffeebb';
        ctx.fill();
        ctx.restore();
    }
}

class GrassBlade {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.height = Math.random() * 40 + 20;
        this.swaySpeed = Math.random() * 0.001 + 0.0005; // Much slower sway
        this.swayOffset = Math.random() * Math.PI * 2;
        this.currentHeight = 0;
        this.color = `hsl(${Math.random() * 40 + 100}, 60%, 30%)`;
        this.delay = Math.random() * 100;
        this.currentDelay = 0;
    }
    update() {
        if (this.currentDelay < this.delay) {
            this.currentDelay++;
            return;
        }
        if (this.currentHeight < this.height) {
            this.currentHeight += 1;
        }
    }
    draw() {
        if (this.currentHeight <= 0) return;
        const sway = Math.sin(Date.now() * this.swaySpeed + this.swayOffset) * 10 * (this.currentHeight / this.height);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.quadraticCurveTo(this.x + sway / 2, this.y - this.currentHeight / 2, this.x + sway, this.y - this.currentHeight);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.restore();
    }
}

let surpriseActive = false;
let celestialParticles = [];
let flowers = [];
let grass = [];

window.StartSurpriseEffects = function () {
    surpriseActive = true;
    particles = []; // clear fireworks
    celestialParticles = [];
    flowers = [];
    grass = [];

    for (let i = 0; i < 150; i++) {
        celestialParticles.push(new CelestialParticle());
    }

    for (let i = 0; i < 200; i++) {
        grass.push(new GrassBlade());
    }

    for (let i = 0; i < 300; i++) {
        flowers.push(new BloomFlower());
    }

    if (!animationFrameId) render();
};

window.StopSurpriseEffects = function () {
    surpriseActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};

// Main Render Loop
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Lock screen fireworks
    if (particles.length > 0 && !surpriseActive) {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    // Surprise effects
    if (surpriseActive) {
        celestialParticles.forEach(p => {
            p.update();
            p.draw();
        });

        grass.forEach(g => {
            g.update();
            g.draw();
        });

        flowers.forEach(f => {
            f.update();
            f.draw();
        });
    }

    if (particles.length > 0 || surpriseActive) {
        animationFrameId = requestAnimationFrame(render);
    } else {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}
