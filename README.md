# canvas-game
(canvas && js && gsap)
# live demo https://hamzasorani83.github.io/canvas-game/

# to create canvas: 
  - canvas = document.querySelector('canvas');
  - c = canvas.getContext('2d');

# to draw circle: 
  - c.beginPath();
  - c.arc(x, y, radius, 0, Math.PI * 2, false);
  - c.fillStyle = color;
  - c.fill();

# we have : player && projectiles && enemies

# to get angle between enemy and player:
  - angle = Math.atan2( 
    (canvas.height \ 2) - enemyY,
    (canvas.width \ 2) - enemyX
  );
  - playerPosition: canvas.height && canvas.width
  - enemyPosition: enemyY && enemyX
  - Math.atan2: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2

# we are using velocity to change enemy position 
  - velocity = { x: Math.cos(angle), y: Math.sin(angle) }
  - enemy.x += enemy.velocity.x
  - enemy.y += enemy.velocity.y

# to get distance between enemy and player:
  - dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
  - if (dist - enemy.radius - player.radius < 1) then endGame
  - Math.hypot: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/hypot


# to get distance between enemy and projectile:
  - dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
  - if(dist - enemy.radius - projectile.radius <= 0) then removeProjectile && removeEnemy
    - but if(enemy.radius > 18) then 
      gsap.to(enemy, {
        radius: enemy.radius - 10
      });
    - else removeEnemy
  -  we are using particles to convert enemy to 5 particles

# to get random color:
  - color = `hsl(${Math.random() * 360}, 50%, 50%)`