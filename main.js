const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const x = canvas.width / 2;
const y = canvas.height / 2;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y
        this.radius = radius;
        this.color = color;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

let friction = 0.99;
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    draw() {
        c.save();
        c.globalAlpha = this.alpha
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= .01;
    }
}


let player = new Player(x, y, 15, "#fff");
player.draw();
let projectiles = [];
let enemies = [];
let particles = [];

function init() {
    player = new Player(x, y, 15, "#fff");
    player.draw();
    projectiles = [];
    enemies = [];
    particles = [];
    score = 0;
    scoreEl.textContent = 0;
}

function spawnEnemies() {
    setInterval(() => {
        let radius = Math.random() * (30 - 4) * 4;
        if (radius < 6) {
            radius += 10;
        }
        let enemyX, enemyY;
        if (Math.random() < .5) {
            enemyX = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            enemyY = Math.random() * canvas.height;
        } else {
            enemyX = Math.random() * canvas.width;
            enemyY = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`
        const angle = Math.atan2(+y - enemyY, +x - enemyX);
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        enemies.push(new Enemy(enemyX, enemyY, radius, color, velocity));
    }, 800);
}

spawnEnemies();

let animationId;

let score = 0;
let scoreEl = document.getElementById("score");
let endGame = document.getElementById('end-game');
let endGameScore = document.getElementById('end-game-score');
let endGameBtn = document.getElementById('start-game-btn');

endGameBtn.addEventListener("click", function() {
    init();
    animate();
    spawnEnemies();
    endGame.classList.remove("active");
});

function animate() {
    animationId = requestAnimationFrame(animate);

    c.fillStyle = 'rgba(0,0,0,.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    particles.forEach((particle, particleIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(particleIndex);
        } else {
            particle.update();
        }
    });

    projectiles.forEach((projectile, index) => {
        projectile.update();
        if (
            projectile.x - projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y - projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    enemies.forEach((enemy, enemyIndex) => {
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        if (dist - enemy.radius - player.radius < 1) {
            endGame.classList.add('active');
            endGameScore.textContent = score;
            cancelAnimationFrame(animationId);
        }

        projectiles.forEach((projectile, porjectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            if (dist - enemy.radius - projectile.radius <= 0) {
                if (enemy.radius - 10 > 8) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                } else {
                    setTimeout(() => {
                        enemies.splice(enemyIndex, 1);
                        projectiles.splice(porjectileIndex, 1);
                        score += 100;
                        scoreEl.textContent = score;
                    }, 0);
                }
                for (let i = 0; i < 5; i++) {
                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 2,
                            enemy.color, {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6),
                            }
                        )
                    );
                }
            }
        });
        enemy.update();
    });

}

addEventListener('click', addProjectile);

function addProjectile(e) {
    const angle = Math.atan2(e.clientY - +y, e.clientX - +x)
    projectiles.push(
        new Projectile(x, y, 5, "#fff", {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5,
        })
    );
}

animate()