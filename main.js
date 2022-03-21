const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

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
        c.fill()
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

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) * 4;
        console.log(radius)
        let enemyX, enemyY;
        if (Math.random() < .5) {
            enemyX = Math.random() < .5 ? 0 - radius : Math.random() * canvas.width + radius;
            enemyY = Math.random() * canvas.height;
        } else {
            enemyX = Math.random() * canvas.width;
            enemyY = Math.random() < .5 ? 0 - radius : Math.random() * canvas.height + radius;
        }
        const color = "#" + ((Math.random() * 0x404040 + 0xaaaaaa) | 0).toString(16);
        const angle = Math.atan2(+y - enemyY, +x - enemyX);
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        enemies.push(new Enemy(enemyX, enemyY, radius, color, velocity));
    }, 1000);
}

spawnEnemies();

const x = canvas.width / 2;
const y = canvas.height / 2;

const player = new Player(x, y, 50, "#fff");
player.draw();

const projectiles = [];
const enemies = [];

function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    projectiles.forEach((projectile) => {
        projectile.update();
    });

    enemies.forEach(enemy => {
        enemy.update();
    });

}

addEventListener('click', addProjectile);

function addProjectile(e) {
    const angle = Math.atan2(e.clientY - +y, e.clientX - +x)
    projectiles.push(
        new Projectile(x, y, 5, "#f00", { x: Math.cos(angle), y: Math.sin(angle) })
    );
}

animate()