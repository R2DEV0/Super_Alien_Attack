document.addEventListener('DOMContentLoaded', function() {
    var GameStarted = document.getElementById('sbutton');
    var GameRestarted = document.getElementById('button');
    var restartB = document.getElementById('restart');
    var menuMusic = new sound('./Sounds/Venus.wav');
    
    $( document.body ).click(function() {
        menuMusic.play();
    });
    
    GameStarted.addEventListener('click', function() {
        startGame();
        menuMusic.stop();
        restart = 'gameStarted';
    });
    GameRestarted.addEventListener('click', function(){
        startGame();
        menuMusic.stop();
        restart = 'gameRestarted';
    })
    restartB.addEventListener('click', function(){
        window.location.reload();
    })
});

// all global variables
var score = 0;
var lives = 3;
var hero ={x:(window.innerWidth * 0.5),y:(window.innerHeight - 250)}
var enemies = [{x: 50, y: 35 },{x: 250, y: 500},{x: 450, y: 1100},{x:100, y:2500},{x:520, y:20}, {x:800, y:10}];
var bosses = {x: 550, y: -500, health: 200};
var bossAttack = false;
var bullets = [];
var enemyBullets = [];
var bossBullets = [];
var explosions = [];
var interval = null;
var explosionSound;
var playerShoot;
var enemyShoot;
var bossShoot;
var backgroundMusic;
var gameOver;

// play sounds
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    if (src == './Sounds/Venus.wav' || src == './Sounds/Mars.wav'){
        this.sound.setAttribute("loop", "loop");
    }
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

// create hero plane for player
function displayHero(){
    document.getElementById('hero').style['top']= hero.y + "px";
    document.getElementById('hero').style['left']= hero.x + "px";

    if(bossAttack == true && score != 1000){
        document.getElementById("container").className = "container-boss";
    }
    else{
        document.getElementById("container").className = "container";
    }
}

// create enemies at random
function displayEnemies(){
    var output='';
    for(var i = 0; i < enemies.length; i++){
        output += "<div class='enemy1' style='top:" + enemies[i].y + "px; left:" + enemies[i].x + "px;'></div>";
    }
    document.getElementById('enemies').innerHTML = output;
}

// Create boss on call
function displayBoss(){
    var output='';
    if(bossAttack == true){
        output = "<div class='boss' style='top:" + bosses.y + "px; left:" + bosses.x + "px;'></div>";
    }
    document.getElementById('bosses').innerHTML = output;
}

// move player, enemy, & boss bullets
function moveBullets(){
    for(let i = 0; i < enemyBullets.length; i++){
        enemyBullets[i].y += 8;
        if(enemyBullets[i].y > (window.innerHeight - 50)){
            enemyBullets[i] = enemyBullets[enemyBullets.length-1];
            enemyBullets.pop();
        }
    }
    for(let j = 0; j < bossBullets.length; j++){
        bossBullets[j].y += 9;
        if(bossBullets[j].y > (window.innerHeight - 50)){
            bossBullets[j] = bossBullets[bossBullets.length-1];
            bossBullets.pop();
        }
    }
    for(let k = 0; k < bullets.length; k++){
        bullets[k].y -= 5;
        if(bullets[k].y < 0){
            bullets[k] = bullets[bullets.length-1];
            bullets.pop();
        }
    }
}

// create player, enemy, & boss bullets
function displayBullets(){
    output = '';
    output2 = '';
    output3 = '';
    for(let i = 0; i < enemyBullets.length; i++){
        output += "<div class='enemyBullet' style='top:" + enemyBullets[i].y + "px; left:" + enemyBullets[i].x + "px;'></div>"
        if(enemyBullets.length == enemyBullets.length + 1){
        }
    }
    for(let j = 0; j < bossBullets.length; j++){
        output += "<div class='bossBullet' style='top:" + bossBullets[j].y + "px; left:" + bossBullets[j].x + "px;'></div>"
    }
    for(let k = 0; k < bullets.length; k++){
        output += "<div class='bullet' style='top:" + bullets[k].y + "px; left:" + bullets[k].x + "px;'></div>"
    }
    document.getElementById('enemyBullets').innerHTML = output;
    document.getElementById('bossBullets').innerHTML = output2;
    document.getElementById('bullets').innerHTML = output3;
}

// Show explosions
function displayExplosions(){
    output = '';
    explosionSound = new sound("./Sounds/explosion.wav");
    for(let i = 0; i < explosions.length; i++){
        explosionSound.play();
        output += "<div class='explosion' style='top:" + explosions[i].y + "px; left:" + explosions[i].x + "px;'></div>"
        setTimeout(() => {
            explosions.shift();
        }, 1000);
    }
    document.getElementById('explosions').innerHTML = output;
}

// end explosions on call
function endExplosions(){
    setTimeout(() => {
        explosions.shift();
    }, 1000);
}

// Moving enemies down map
function moveEnemies(){
    for(let i = 0; i < enemies.length; i++){
        enemies[i].y += 5;
        if(enemies[i].y > (window.innerHeight - 150)){
            enemies[i].y = 0;
            enemies[i].x = Math.random() * (window.innerWidth - 100);
        }
        if(enemies[i].y %150 == 0){
            enemyBullets.push({x: enemies[i].x + 45, y: enemies[i].y + 30});
            enemyShoot = new sound('./Sounds/laser.wav');
            enemyShoot.play();
        }
    }
}

// Moving bosses down map
function moveBoss(){
    if(bossAttack == true){
        bossShoot = new sound('./Sounds/bossLaser.wav');
        bosses.y += 3;
        if(bosses.y > (window.innerHeight - 150)){
            gameOver = new sound('./Sounds/GameOver.wav');
            setTimeout(() =>{
                endGame();
                gameOver.play();
        }, 500);
        }
        if(bosses.y %20 == 0){
            bossBullets.push({x: bosses.x + 115, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 650, y: bosses.y + 300});
            bossShoot.play();
        }
        if(bosses.y %50 == 0){
            bossBullets.push({x: bosses.x + 115, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 650, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 350, y: bosses.y + 300});
            bossShoot.play();
        }
        if(bosses.y %100 == 0){
            bossBullets.push({x: bosses.x + 115, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 650, y: bosses.y + 300});
            bossShoot.play();
        }
        if(bosses.y %200 == 0 ){
            bossBullets.push({x: bosses.x + 115, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 650, y: bosses.y + 300});
            bossBullets.push({x: bosses.x + 350, y: bosses.y + 300});
            bossShoot.play();
        }
    }
    else{
        bosses.x = 550 
        bosses.y = -500;
    }
}

// player controls
document.onkeydown = function(a){
    if(a.keyCode == 37 && hero.x > 10){   //Left
        hero.x -= 10;
    }
    else if(a.keyCode ==39 && hero.x < (window.innerWidth - 100)){   //Right
        hero.x += 10;
    }
    else if(a.keyCode == 38 && hero.y > 100){     //Up
        hero.y -= 10;
    }
    else if(a.keyCode == 40 && hero.y < window.innerHeight - 100){     //Down
        hero.y += 10;
    }
    else if(a.keyCode == 32){
        bullets.push({x: hero.x + 29, y: hero.y - 10});
        playerShoot = new sound('./Sounds/playerShoot.wav');
        playerShoot.play();
        displayBullets();
    }
}

// Main gameLoop
function gameLoop(){
    displayHero();
    moveEnemies();
    displayEnemies();
    moveBoss();
    displayBoss();
    moveBullets();
    displayBullets();
    detectCollision();
    detectEnemyHit();
    displayExplosions();
    detectCrash();
    displayLives();
    detectBossHit();
    detectBossCrash();
}

// start gameloop
function startGame(){
    interval = setInterval(gameLoop, 70);
    document.getElementById('button').style.visibility = "hidden";
    document.getElementById('restart').style.visibility = 'hidden';
    document.getElementById('titleScreen').style.visibility = 'hidden';
    document.getElementById('youDied').style.visibility = "hidden";
    backgroundMusic = new sound('./Sounds/Mars.wav');
    backgroundMusic.play();
    if(restart == 'gameStarted'){
        score = 0;
    }
    else if(restart == 'gameRestarted'){
        score = score;
    }
    lives = 3;
    displayLives();
    document.getElementById('score').innerHTML = score;
}

// end gameloop 
function endGame(){
    clearInterval(interval);
    backgroundMusic.stop();
    document.getElementById('button').innerHTML = "Continue?"
    document.getElementById('youDied').style.visibility = "visible";
    document.getElementById('button').style.visibility = "";
    document.getElementById('restart').style.visibility = "";
}

// detect enemy hit to player
function detectEnemyHit(){
    for(let i = 0; i < enemyBullets.length; i++){
        if(Math.abs(enemyBullets[i].x - hero.x - 40) < 60 && Math.abs(enemyBullets[i].y - hero.y) < 10){
            enemyBullets[i] = enemyBullets[enemyBullets.length-1];
            explosions.push({x: hero.x - 20 , y: hero.y - 20});
            explosions.push({x: hero.x + 15 , y: hero.y + 15});
            explosions.push({x: hero.x - 10 , y: hero.y - 10});
            explosions.push({x: hero.x + 25 , y: hero.y - 25});
            explosions.push({x: hero.x - 25, y: hero.y + 25});
            displayExplosions();
            enemyBullets.pop();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            lives = lives - 1;
        }
    }
}
// detect Boss Hit to player
function detectBossHit(){
    for(let j = 0; j < bossBullets.length; j++){
        if(Math.abs(bossBullets[j].x - hero.x - 40) < 60 && Math.abs(bossBullets[j].y - hero.y) < 10){
            bossBullets[j] = bossBullets[bossBullets.length - 1];
            explosions.push({x: hero.x - 20 , y: hero.y - 20});
            explosions.push({x: hero.x + 15 , y: hero.y + 15});
            explosions.push({x: hero.x - 10 , y: hero.y - 10});
            explosions.push({x: hero.x + 25 , y: hero.y - 25});
            explosions.push({x: hero.x - 25, y: hero.y + 25});
            displayExplosions();
            bossBullets.pop();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            lives = lives - 1;
        }
    }
}

// detect if player bullets hit enemies and bosses
function detectCollision(){
    for(let i = 0; i < bullets.length; i++){
        if(Math.abs(bullets[i].x - bosses.x) < 1000 && Math.abs(bullets[i].y - bosses.y) < 450 && bossAttack == true){
            explosionBoss = [bullets[i].x , bullets[i].y];
            bullets[i] = bullets[bullets.length-1];
            explosions.push({x: explosionBoss[0] , y: explosionBoss[1]});
            displayExplosions();
            endExplosions();
            bullets.pop();
            bosses.health = bosses.health - 3;
            if(bosses.health <= 0){
                bossAttack = false;
                explosions.push({x: bosses.x, y: bosses.y + 100});
                explosions.push({x: bosses.x + 200, y: bosses.y + 100});
                explosions.push({x: bosses.x, y: bosses.y + 100});
                explosions.push({x: bosses.x + 300, y: bosses.y + 50});
                explosions.push({x: bosses.x + 500, y: bosses.y + 600});
                explosions.push({x: bosses.x + 600, y: bosses.y});
                explosions.push({x: bosses.x + 400, y: bosses.y + 300});
                explosions.push({x: bosses.x + 350, y: bosses.y + 500});
                explosions.push({x: bosses.x + 400, y: bosses.y + 500});
                explosions.push({x: bosses.x + 300, y: bosses.y + 300});
                explosions.push({x: bosses.x + 200, y: bosses.y + 400});
                explosions.push({x: bosses.x + 100, y: bosses.y + 200});
                explosions.push({x: bosses.x + 800, y: bosses.y + 300});
                explosions.push({x: bosses.x + 400, y: bosses.y});
                explosions.push({x: bosses.x + 600, y: bosses.y + 500});
                explosions.push({x: bosses.x + 900, y: bosses.y + 400});
                explosions.push({x: bosses.x + 500, y: bosses.y + 350});
                explosions.push({x: bosses.x + 500, y: bosses.y + 400});
                explosions.push({x: bosses.x + 400, y: bosses.y + 400});
                explosions.push({x: bosses.x + 400, y: bosses.y + 200});
                explosions.push({x: bosses.x + 200, y: bosses.y + 100});
                explosions.push({x: bosses.x + 300, y: bosses.y + 50});
                explosions.push({x: bosses.x + 500, y: bosses.y + 600});
                explosions.push({x: bosses.x, y: bosses.y + 100});
                explosions.push({x: bosses.x + 400, y: bosses.y + 300});
                explosions.push({x: bosses.x + 350, y: bosses.y + 500});
                explosions.push({x: bosses.x + 500, y: bosses.y + 400});
                explosions.push({x: bosses.x + 400, y: bosses.y + 400});
                explosions.push({x: bosses.x, y: bosses.y + 300});
                explosions.push({x: bosses.x + 400, y: bosses.y + 200});
                explosions.push({x: bosses.x + 200, y: bosses.y + 100});
                explosions.push({x: bosses.x + 300, y: bosses.y + 50});
                explosions.push({x: bosses.x, y: bosses.y + 600})
                explosions.push({x: bosses.x + 500, y: bosses.y + 600});
                explosions.push({x: bosses.x + 400, y: bosses.y + 300});
                explosions.push({x: bosses.x + 350, y: bosses.y + 500});
                explosions.push({x: bosses.x, y: bosses.y});
                explosions.push({x: bosses.x + 10, y: bosses.y + 400});
                explosions.push({x: bosses.x + 100, y: bosses.y});
                explosions.push({x: bosses.x, y: bosses.y + 10});
                displayExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                setTimeout(() => {
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                },400);
                setTimeout(() => {
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                endExplosions();
                },600)
            }
        }
        for(let j = 0; j < enemies.length; j++){
            if(Math.abs(enemies[j].x - bosses.x) < 300 && Math.abs(enemies[j].y - bosses.y) < 300 && bossAttack == true){
                explosionEnemy = [enemies[j].x , enemies[j].y];
                enemies[j] = enemies[enemies.length-1];
                explosions.push({x: explosionEnemy[0] , y: explosionEnemy[1]})
                displayExplosions();
                endExplosions();
                enemies.pop();
                enemies.push({x: Math.random() * 800, y: 0});
            }
            if(Math.abs(bullets[i].x - enemies[j].x) < 60 && Math.abs(bullets[i].y - enemies[j].y) < 60){
                explosionSpot = [enemies[j].x , enemies[j].y]
                displayScore();
                bullets[i] = bullets[bullets.length-1];
                enemies[j] = enemies[enemies.length-1];
                explosions.push({x: explosionSpot[0] , y: explosionSpot[1]})
                displayExplosions();
                endExplosions();
                enemies.pop();
                bullets.pop();
                enemies.push({x: Math.random() * 800, y: 0});
            }
        }
    }
    
}

// detect player crash into bosses or enemies 
function detectCrash(){
    for(let i = 0; i < enemies.length; i++){
        if(Math.abs(hero.x - enemies[i].x) < 70 && Math.abs(hero.y - enemies[i].y) < 70){
            explosions.push({x: hero.x - 20 , y: hero.y - 20});
            explosions.push({x: hero.x + 15 , y: hero.y + 15});
            explosions.push({x: hero.x - 10 , y: hero.y - 10});
            explosions.push({x: hero.x + 25 , y: hero.y - 25});
            explosions.push({x: hero.x - 25, y: hero.y + 25});
            enemies[i] = enemies[enemies.length-1];
            enemies.pop();
            displayExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            endExplosions();
            lives = lives - 1;
        }
    }
}

function detectBossCrash(){
    if(Math.abs(hero.x - bosses.x) < 700 && Math.abs(hero.y - bosses.y) < 400){
        explosions.push({x: hero.x - 20 , y: hero.y - 20});
        explosions.push({x: hero.x + 15 , y: hero.y + 15});
        explosions.push({x: hero.x - 10 , y: hero.y - 10});
        explosions.push({x: hero.x + 25 , y: hero.y - 25});
        explosions.push({x: hero.x - 25, y: hero.y + 25});
        displayExplosions();
        endExplosions();
        endExplosions();
        endExplosions();
        endExplosions();
        endExplosions();
        lives = 0;
        gameOver = new sound('./Sounds/GameOver.wav');
        setTimeout(() =>{
            endGame();
            gameOver.play();
        }, 1000);
    }
}

// Display player score and set boss based on score
function displayScore(){
    document.getElementById('score').innerHTML = score += 10;
    if (score == 100 || score == 300 || score == 500 || score == 600 || score == 700 || score == 800 || score == 900 || score == 1000 ){
        bossAttack = true;
        bosses.x = 550;
        bosses.y = -500;
        bosses.health = 200;
        enemies.push({x: Math.random() * 800, y: 0});
    }
    if(score >= 1000){
        background = document.getElementById('container');
        background.style.background = "url('./Images/space.jpg')";
        background.style.backgroundRepeat = "no-repeat";
        background.style.backgroundSize = "cover";
    }
}

// show player lives and end game is = 0 
function displayLives(){
    if(lives === 3){
        output = "<img class='life' src='./Images/heart.png' alt='life'/> <img class='life' src='./Images/heart.png' alt='life'/> <img class='life' src='./Images/heart.png' alt='life'/>"
        document.getElementById('lives').innerHTML = output;
    }
    if(lives === 2){
        output = "<img class='life' src='./Images/heart.png' alt='life'/> <img class='life' src='./Images/heart.png' alt='life'/>"
        document.getElementById('lives').innerHTML = output;
    }
    if(lives === 1){
        output = "<img class='life' src='./Images/heart.png' alt='life'/>"
        document.getElementById('lives').innerHTML = output;
    }
    if(lives === 0){
        output = '';
        gameOver = new sound('./Sounds/GameOver.wav');
        setTimeout(() =>{
            endGame();
            gameOver.play();
        }, 1000);
        document.getElementById('lives').innerHTML = output;
    }
}
