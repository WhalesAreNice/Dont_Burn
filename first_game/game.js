var bg;
var character;
var ghost;
var blink_initial;
var blink_end;
var platforms;
var clouds;
var walls;
var beam;
var salve;
var blink_reward;
var heart;
var invis_wall;
var stuff;
var damage;
var laser;
var cooldown = 0;
var add_cooldown = 300;
var max_life = 200;
var blinks;
var current_damage;
var axes;
var axe;

const PLAY_BLINK_ANIM = 4;
const platform_size = 55;
const SPEED = 4;
const GRAVITY = 1;
const WIND = 0.1;
const JUMP_SPEED = SPEED*4;
const NUM_CLOUDS = 10;
const NUM_PLATFORMS = 30;
const NUM_BUSHES = 8;
const NUM_WALLS = 3;
const NUM_SALVE = 1;
const NUM_BLINK_REWARD = 1;
const NUM_HEART = 1;
const CAMERA_SPEED = 5;


/*
0 intro screen
1 instructions
2 rules
3 game
4 end
*/


var menus = [
    {
        titles:[
            "Don't Burn",
            "by Allan Ng"
        ],
        buttons:[
            {
                text:"Play Game",
                state: 3
            },
            {
                text:"Controls",
                state:1
            },
            {
                text:"Instructions",
                state:2
            }
        ] 
    },
    {
        titles:[
            "Controls",
            "Press Space to jump",
            "Arrow keys to move",
            "Press W to teleport" 
        ],
        buttons: [
            {
                text:"Play Game",
                state: 3
            },
            {
                text:"Home",
                state:0
            }
        ]
    },
    {
        titles:[
            "Instructions",
            "Avoid the pillars of Fire",
            "Hearts increase your maximum hp",
            "Potions heal your current hp"
        ],
        buttons:[
            {
                text:"Play Game",
                state:3
            },
            {
                text:"Home",
                state:0
            }
        ]
    },
    {
        titles:[
            "You Died",
            "Your score is : "
        ],
        buttons: [
            {
                text:"Try again",
                state:3
            },
            {
                text:"Home",
                state:0
            }
        ]
    }
    
]





var gameState = 0;



//audio
var jump_sfx = [];
const jump_files = ["assets/sfx/character/jump5.wav", "assets/sfx/character/jump6.wav", "assets/sfx/character/jump7.wav"];

var burn_sfx = [];
const burn_files = ["assets/sfx/character/burn4.wav", "assets/sfx/character/burn5.wav", "assets/sfx/character/burn6.wav"];

var blink_sfx = [];
const blink_files = ["assets/sfx/character/blink4.wav", "assets/sfx/character/blink5.wav", "assets/sfx/character/blink6.wav"];

var pickup_sfx = [];
const pickup_files = ["assets/sfx/character/pickup1.wav", "assets/sfx/character/pickup2.wav"];

var hit_sfx = [];
const hit_files = ["assets/sfx/character/hit1.wav", "assets/sfx/character/hit2.wav"];

var death_sfx = [];
const death_files = ["assets/sfx/character/death.wav"];

var ost = [];
const ost_files = ["assets/sfx/dont_burn_ost4.mp3"];

function preload() {
    for ( let i = 0; i < jump_files.length; i++) {
        const jump_sound = loadSound(jump_files[i]);
        jump_sfx.push(jump_sound);
    }
    
    for ( let i = 0; i < burn_files.length; i++) {
        const burn_sound = loadSound(burn_files[i]);
        burn_sfx.push(burn_sound);
    }
    
    for ( let i = 0; i < blink_files.length; i++) {
        const blink_sound = loadSound(blink_files[i]);
        blink_sfx.push(blink_sound);
    }
    
    for ( let i = 0; i < pickup_files.length; i++) {
        const pickup_sound = loadSound(pickup_files[i]);
        pickup_sfx.push(pickup_sound);
    }
    
    for ( let i = 0; i < death_files.length; i++) {
        const death_sound = loadSound(death_files[i]);
        death_sfx.push(death_sound);
    }
    
    for ( let i = 0; i < hit_files.length; i++) {
        const hit_sound = loadSound(hit_files[i]);
        hit_sfx.push(hit_sound);
    }
    
    
    ost.push(loadSound(ost_files));
    
}

function setup() {
    createCanvas(640, 360);
    bg = loadImage("assets/background/background3.png");
    
    
    
    stuff = new Group();
    
    // character setup
    character = createSprite(100,320,32,32);
    character.setCollider("rectangle", 0, 0, 25, 33);
    const run_anim = loadAnimation("assets/am_run/run1.png","assets/am_run/run9.png")
    character.addAnimation("run", run_anim);
    character.isJumping = true;
    character.lives = 100;
    
    stuff.add(character);
    
    //character ghost setup
    ghost = createSprite(300,320,32,32);
    const ghost_run_anim = loadAnimation("assets/am_run_ghost/ghost1.png", "assets/am_run_ghost/ghost9.png")
    ghost.addAnimation("run", ghost_run_anim);
    stuff.add(ghost);
    
    //blink animations
    blink_initial = createSprite(300,320,32,32);
    const blink_initial_anim = loadAnimation("assets/blink_initial/blink_initial0.png", "assets/blink_initial/blink_initial3.png");
    blink_initial.addAnimation("blink_initial", blink_initial_anim);
    stuff.add(blink_initial);
    
    blink_end = createSprite(300,320,32,32);
    const blink_end_anim = loadAnimation("assets/blink_end/blink_end0.png", "assets/blink_end/blink_end3.png");
    blink_end.addAnimation("blink_end", blink_end_anim);
    stuff.add(blink_end);
    
    
    clouds = new Group();
    for (let i = 0; i < NUM_CLOUDS; i++) {
        const cloud = createSprite(
            random(width, width*2),
            random(height/3, 0),
            random(50,100),
            random(30,50)
        );
        
        const cloud_imgs = ["assets/clouds/cloud1.png" , "assets/clouds/cloud2.png" , "assets/clouds/cloud3.png" , "assets/clouds/cloud4.png" , "assets/clouds/cloud5.png"];
        
        for(let i = 0; i < NUM_CLOUDS; i++) {
            const cloud_img = loadImage(cloud_imgs[floor(random(0, cloud_imgs.length))]);
            cloud.addImage(cloud_img);
        }
        
        cloud.velocity.x = -random(5,10);
        clouds.add(cloud);
    }
    platforms = new Group();
    walls = new Group();
    invis_wall = new Group();
    damage = new Group();
    salve = new Group();
    blink_reward = new Group();
    heart = new Group();
    blinks = new Group();
    axes = new Group();
    
    buildLevel();
    
    for (let i = 0; i < menus.length; i++){
        const menu = menus[i];
        menu.sprites = new Group();
        for (let j = 0; j < menu.buttons.length; j++){
            const b = menu.buttons[j];
            const button = createSprite(440, 100 + j * 90);
            button.addAnimation("idle", "assets/menu/button0.png");
            button.addAnimation("hover", "assets/menu/button1.png", "assets/menu/button2.png");
            button.addAnimation("click", "assets/menu/button3.png", "assets/menu/button4.png");
            button.clicked = false;
            button.mouseActive = true;
            button.text = b.text;
            button.state = b.state;
            menu.sprites.add(button);
        }
    }
}

function buildLevel(){
    
    
    for(let i = 0; i < NUM_PLATFORMS; i++){
        const platform = createSprite(i*platform_size, height-20, platform_size, platform_size);
        
        const platform_imgs = ["assets/platform/platform_tile.png"];
        
        for (let i = 0; i < NUM_PLATFORMS; i++) {
            const platform_img = loadImage(platform_imgs[floor(random(0,platform_imgs.length))]);
            platform.addImage(platform_img);
        }
        platforms.add(platform);
        platform.setCollider("rectangle", 0, 10, platform_size, 30);
    }
    
    for (let i = 0; i < NUM_WALLS; i++){
        const wall = createSprite(
        width + i*width/NUM_WALLS + 50,
        height*5/6,
        40,
        height/3.5
        );
        
        const wall_imgs = ["assets/walls/wall1.png"];
        
        for(let i = 0; i < NUM_WALLS; i++) {
            const wall_img = loadImage(wall_imgs[floor(random(0, wall_imgs.length))]);
            wall.addImage(wall_img);
        }
        walls.add(wall);
        wall.setCollider("rectangle", 0, 0, 90, 130);
    }
    
    const invis_walls1 = createSprite(-5,height/2,10, height);
    const invis_walls2 = createSprite(100,height/2,10, height);
    invis_wall.add(invis_walls1, invis_walls2);
    
    beam = createSprite(0,height/2,100,height*2);
    beam.setCollider("rectangle", 0,0,80,height);
    const beam_anim = loadAnimation("assets/beam/beam1.png","assets/beam/beam5.png");
    beam.addAnimation("beaming", beam_anim);
    damage.add(beam);
    
    laser = createSprite(
        random(width*2.5,width*3),
        height/2,
        100,
        height*2
    );
    laser.setCollider("rectangle", 0,0,80,height);
    
    laser.addAnimation("lasering", beam_anim);
    damage.add(laser);
    
    
    axe = createSprite(width*3,random(height*3.5/5, height*4.5/5),100,100);
    
    const axe_spinning_anim = loadAnimation("assets/axe/axes_spin0.png","assets/axe/axes_spin7.png");
    axe.addAnimation("spinning", axe_spinning_anim);
    const axe_ground_anim = loadAnimation("assets/axe/axes_ground0.png","assets/axe/axes_ground3.png");
    axe.addAnimation("ground", axe_ground_anim);
    axes.add(axe);
    
    
    
    for (let i = 0; i < NUM_SALVE; i++){
        const life = createSprite (
        random(width*2, width*6),
        random(height/2, height-140),
        30,
        20
        );
        
        const salve_img = loadImage("assets/rewards/salve.png");
        life.addImage(salve_img);
        
        salve.add(life);
    }
    
    for (let i = 0; i < NUM_BLINK_REWARD; i++){
        const blink_CD = createSprite (
        random(width*2, width*6),
        random(height/2, height-140),
        30,
        20
        );
        
        const blink_img = loadImage("assets/blink_symbol/blinks.png");
        blink_CD.addImage(blink_img);
        
        blink_reward.add(blink_CD);
    }
    
    
    for (let i = 0; i < NUM_HEART; i++){
        const hp = createSprite (
        random(width*2, width*6),
        random(height/2, height-140),
        30,
        20
        );
        
        const heart_img = loadImage("assets/rewards/heart.png");
        hp.addImage(heart_img);
        
        heart.add(hp);
    }
    
    const blinker = createSprite(100,60,50,50);
    const blink_symbol_img = loadImage("assets/blink_symbol/blink_symbol.png");
    blinker.addImage(blink_symbol_img);
    blinks.add(blinker);
    
}

function draw() {
    
    let play_sound = false;
        if(ost[0].isPlaying()){
            play_sound = true;
        }
        if(!play_sound){
            ost[0].play();
        }
    
    
    if(gameState == 0) {
        menu(0); //intro
    } else if (gameState == 1) {
        menu(1); //controls
    } else if (gameState == 2) {
        menu(2); //instructions
    } else if (gameState == 3) {
        game();
    } else if (gameState == 4) {
        end();
    }
}

function menu(index){
    camera.off();
    background(51);
    fill(255);
    textSize(24);
    textFont("sans-serif");
    textAlign(CENTER);
    for(let i = 0; i < menus[index].titles.length; i++){
        text(menus[index].titles[i], 40, 40 + i * 60, width/3, height);
    }
    
    if(gameState == 4){
        text("Your score is : " + floor(character.position.x/100), width/2, 150);
    }
    
    for (let i = 0; i < menus[index].sprites.length; i++) {
        const button = menus[index].sprites[i];
        button.display();
        textFont("Monaco");
        textAlign(CENTER);
        text(button.text, button.position.x, button.position.y+8);
        if (button.mouseIsPressed){
            button.changeAnimation("click");
            button.clicked = true;
        } else if (button.mouseIsOver){
            button.changeAnimation("hover");
            if(button.clicked){
                button.clicked = false;
                gameState = button.state;
                if (index == 3 || index == 4){
                    reset();
                    buildLevel();
                }
            }
        } else {
            button.changeAnimation("idle");
            button.clicked = false;
        }
    }
}

function intro(){
    camera.off();
    background(0);
    fill(255);
    textSize(24);
    textAlign(CENTER);
    text("Don't Burn", width/2, height/2);
    textSize(16);
    text("By Allan Ng", width/2, height/2 + 30);
    textSize(20);
    text("Press Enter to start", width/2, height - 50);
    
    if(keyWentDown("ENTER")){
        gameState = 1;
    }
}

function instructions(){
    textAlign(LEFT);
    textSize(24);
    background(0);
    text("Press Arrow Keys to move left and right", 100, 50);
    text("Press W to teleport to the right a short distance", 100, 100);
    text("Press Space to jump", 100, 150);
    text("Avoid the pillars of fire", 100, 200);
    text("Hearts increase your maximum hp", 100, 250);
    text("potions heals your current hp", 100, 300);
    text("Press Enter to Continue", 100, 350);
    if(keyWentDown("ENTER")){
        gameState = 3;
    }
    
}

function reset(){
    character.lives = 100;
    max_life = 200;
    character.position.x = 100;
    camera.position.x = width/2;
    
    walls.clear();
    salve.clear();
    blink_reward.clear();
    heart.clear();
    laser.clear();
    beam.clear();
    platforms.clear();
    damage.clear();
    axes.clear();
}

function end(){
    camera.off();
    background(0);
    textAlign(CENTER);
    textSize(30);
    fill(255);
    text("You have died", width/2, 100);
    textSize(24);
    text("Your score is : " + floor(character.position.x/100), width/2, 150);
    text("Press Enter to play again", width/2, 250);
    
    
    if(keyWentDown("ENTER")){
        gameState = 3;
        character.lives = 100;
        max_life = 200;
        character.position.x = 100;
        camera.position.x = width/2;
        beam.position.x = 0;
        add_cooldown = 300;
        laser.position.x = random(width*2.5,width*3);
        
        for(let i = 0; i < platforms.length; i++){
            platforms[i].position.x = platform_size*i;
        }
    
        for(let i = 0; i < walls.length; i++) {
            walls[i].position.x = random(width + i*width/NUM_WALLS + 50, width + (i+1)*width/NUM_WALLS);
        }
        
        for(let i = 0; i < salve.length; i++) {
            salve[i].position.x = random(width*2, width*6);
        }
        
        for(let i = 0; i < heart.length; i++) {
            heart[i].position.x = random(width*2, width*6);
        }
        
        for(let i = 0; i < blink_reward.length; i++) {
            blink_reward[i].position.x = random(width*2, width*6);
        }
        
        for(let i = 0; i < axes.length; i++) {
            axes[i].position.x = width*3;
            axes[i].position.y = random(height*3.5/5, height*4.5/5);
        }
        
        
    }
    
}

function game() {
    camera.off();
    background(bg);
    camera.on();
    
    //ghost positioning
    
    ghost.position.x = character.position.x + 200;
    ghost.position.y = character.position.y;
    
    
    
    for (let i = 0; i < clouds.length; i++){
        const cloud = clouds[i];
        if (cloud.position.x+cloud.width/2 < 0){
            cloud.position.x = random(width, width*2);
            cloud.position.y = random(0, height/3);
        }
    }
    
    constantMovement();
    
    if (keyIsPressed) {
        character.changeAnimation("run");
    } else{
        character.changeAnimation("run");
    }
    
    if (character.collide(platforms)) {
        character.velocity.y = 0;
        if(character.isJumping){
            character.isJumping = false;
        }
    } else {
        character.velocity.y += GRAVITY;
    }
    
    for (let i = 0; i < walls.length; i++) {
	   const wall = walls[i];
        if(character.position.x >= camera.position.x - width/2 + 20){
            if (character.collide(wall)) {
                if (character.position.y + character.height*1.6  < wall.position.y - wall.height/2) {
                    character.velocity.y = 0;
                    if (character.isJumping) {
                        character.isJumping = false;
                    }
                }
            }
        }
    }
    
    
    //wind force
    if(character.position.x >= camera.position.x+100){
        character.velocity.x -= WIND;
    } else{
        character.velocity.x = 0;
    }
    
    
    
//    jump event
    
    if (keyWentDown("SPACE")){
        if (!character.isJumping){
            character.velocity.y -= JUMP_SPEED;
            character.isJumping = true;
            jump_sfx[floor(random(0, jump_sfx.length))].play();
        }
    }
    
    
//    blink_initial.animation.stop();
//    blink_end.animation.stop();
    blink_initial.animation.looping = false;
    blink_end.animation.looping = false;
    blink_end.animation.frameDelay = 10;
    blink_initial.animation.frameDelay = 10;
    
    
    if (keyWentDown("w") && cooldown <= 0) {
        character.position.x += 200; 
        cooldown += 300;
        blink_sfx[floor(random(0, blink_sfx.length))].play();
        
        blink_initial.draw(character.position.x, character.position.y);
        blink_end.draw(character.position.x + 200, character.position.y);
        blink_initial.animation.rewind();
        blink_end.animation.rewind();
        blink_initial.animation.visible = true;
        blink_end.animation.visible = true;
        blink_initial.animation.play();
        blink_end.animation.play();
        
        
        
        
        blink_initial.position.x = character.position.x - 200;
        blink_end.position.x = character.position.x;

        blink_initial.position.y = character.position.y;
        blink_end.position.y = character.position.y;
    }
//        else if (!keyWentDown("w")) {
//        blink_initial.animation.visible = false;
//        blink_end.animation.visible = false;
//    }
    
    if(blink_initial.animation.getFrame() == blink_initial.animation.getLastFrame()){
        blink_initial.animation.visible = false;
    }
    if(blink_end.animation.getFrame() == blink_end.animation.getLastFrame()){
        blink_end.animation.visible = false;
    }
    
    console.log(blink_end.animation.playing);
    
    if (cooldown > 0) {
        cooldown -= 1;
    }
    
    if(!cooldown == 0){
        ghost.visible = false;
    } else {
        ghost.visible = true;
    }
    
    
    //character doesn't fall off the left
    if(character.position.x <= camera.position.x-width/2){
        character.position.x += 10;
        if(character.position.y >= 320){
            character.position.y = 320;
        };
    } 
    
    
    //damaging character
    if (character.overlap(beam)){
        character.lives -= 1 + frameCount/3000;
        
        
        
        
        
        
        let playing_sound = false;
        
        for(let i = 0; i < burn_sfx.length; i++) {
            if(burn_sfx[i].isPlaying()){
               playing_sound = true;
               }
        }
        if(!playing_sound){
            burn_sfx[floor(random(0, burn_sfx.length))].play();
        }
    }
    
    if (character.overlap(laser)){
        character.lives -= 1 + frameCount/3000;
        
        let playing_sound = false;
        
        for(let i = 0; i < burn_sfx.length; i++) {
            if(burn_sfx[i].isPlaying()){
               playing_sound = true;
               }
        }
        if(!playing_sound){
            burn_sfx[floor(random(0, burn_sfx.length))].play();
        }
    }
    
    wrap(laser, random(width*2.5, width*3));
    
    
    if(character.collide(axe)){
        axe.position.x += random(width*3, width*4);
        axe.position.y == random(height*3.5/5, height*4.5/5);
        character.position.x -= 60;
        character.lives -= 40;
        
        let playing_sound = false;
        
        for(let i = 0; i < hit_sfx.length; i++) {
            if(hit_sfx[i].isPlaying()){
               playing_sound = true;
               }
        }
        if(!playing_sound){
            hit_sfx[floor(random(0, hit_sfx.length))].play();
        }
        
        
    }
    
    axe_wrap(axe, random(width*3, width*4), random(height*3.5/5, height*4.5/5));
    
    
    
    for (let i = 0; i < salve.length; i++) {
        const life = salve[i];
        if (character.overlap(life)) {
            character.lives += 40;
            life.position.x += random(width*2, width*6);
            pickup_sfx[floor(random(0, pickup_sfx.length))].play();
        } else {
            wrap (life, random(width*2, width*6));
        }
    }
    
    for (let i = 0; i < blink_reward.length; i++) {
        const blink_CD = blink_reward[i];
        if (character.overlap(blink_CD)) {
            if(!add_cooldown <= 120){
                add_cooldown *= 0.95;
            } else {
                add_cooldown = 120;
            }
            blink_CD.position.x += random(width*2, width*6);
            pickup_sfx[floor(random(0, pickup_sfx.length))].play();
        } else {
            wrap (blink_CD, random(width*2, width*6));
        }
    }
    
    
    for (let i = 0; i < heart.length; i++) {
        const hp = heart[i];
        if (character.overlap(hp)) {
            max_life += 20;
            hp.position.x += random(width*2, width*6);
            pickup_sfx[floor(random(0, pickup_sfx.length))].play();
        } else {
            wrap (hp, random(width*2, width*6));
        }
    }
    
    if (character.lives > max_life) {
        character.lives = max_life;
    }
    
//    wrapping platforms and walls
    
    for(let i = 0; i < platforms.length; i++){
        const platform = platforms[i];
        wrap(platform, platform_size*NUM_PLATFORMS);
    }
    
    for(let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        wrap(wall, width + i*width/NUM_WALLS + 50);
        
    }
    
    
//    camera and object constant movement
    camera.position.x += CAMERA_SPEED;
    beam.position.x += CAMERA_SPEED;
    character.position.x += CAMERA_SPEED;
    axe.position.x += CAMERA_SPEED;
    axe.position.x -= 8;
    blink_initial.position.x += CAMERA_SPEED/2;
    blink_end.position.x += CAMERA_SPEED/2;
    
    
    
    
    //drawSprites();
   
    drawSprites(platforms);
    drawSprites(salve);
    drawSprites(blink_reward);
    drawSprites(heart);
    drawSprites(walls);
    drawSprites(damage);
    drawSprites(axes);
    drawSprites(stuff);
    
    
    
//    ui
    camera.off();
    drawSprites(clouds);
    drawSprites(invis_wall);
    drawSprites(blinks);
    
    fill(0);
    stroke(0);
    strokeWeight(2);
    rect(55,7,300,17);
    rect(495,7, 100, 17);
    fill("red");
    strokeWeight(0);
    rect(90,8,260*character.lives/max_life,15);
    
    fill(0,0,0,200);
    
    if(!cooldown == 0){
        arc(100,60,50,50,HALF_PI+PI-PI/300*cooldown*2,HALF_PI+PI, PIE);
    };
    
    fill(255);
    textAlign(LEFT);
    textSize(12);
    text("Life: ", 60,20); 
    text(floor(character.lives)+"/"+max_life, 180,20);
    text("Score: " + floor(character.position.x/100), 500, 20);
    textSize(30);
    strokeWeight(4);
    
    if(!cooldown == 0){
        text(ceil(cooldown/60), 92, 70);
    };
    textSize(12);
    strokeWeight(0);
    fill(0);
    
//  detect game ending
    if(character.lives <= 0) {
        gameState = 4;
        character.velocity.y = 0;
        camera.position.x += 0;
        beam.position.x += 0;
        character.position.x += 0;
    }
}

function constantMovement() {
    if (keyDown(RIGHT_ARROW)) {
        character.position.x += SPEED;
    }
    if (keyDown(LEFT_ARROW)) {
        character.position.x -= SPEED;
    }
}

function wrap(obj, reset) {
    if(camera.position.x - obj.position.x >= width/2){
        obj.position.x += reset;
    }
}

function axe_wrap(obj, reset_width, reset_height){
    if(camera.position.x - obj.position.x >= width/2){
        obj.position.x += reset_width;
    }
    obj.position.y = reset_height;
}

document.addEventListener("keydown", function(event) {
    if (event.which == 32) {
        event.preventDefault();
    }
});




