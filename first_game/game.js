var bg;
var character;
var platforms;
var clouds;
var walls;
var beam;
var salve;
var heart;
var invis_wall;
var stuff;
var damage;
var laser;
var cooldown = 0;
var max_life = 200;
var blinks;
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
const NUM_HEART = 1;
const CAMERA_SPEED = 5;



//audio
//var jump_sfx = [];
//const jump_files = ["assets/sfx/character/jump0.wav", "assets/sfx/character/jump1.wav", "assets/sfx/character/jump2.wav", "assets/sfx/character/jump3.wav"];

function preload() {
//    for ( let i = 0; i < jump_files.length; i++) {
//        const jump_sound = loadSound(jump_files[i]);
//        jump_sfx.push(jump_sound);
//    }
}

function setup() {
    createCanvas(640, 360);
    bg = loadImage("assets/background/background3.png");
    
    stuff = new Group();
    
    // character setup
    character = createSprite(100,320,32,32);
    character.setCollider("rectangle", 0, 0, 25, 33);
    const idle_anim = loadAnimation("assets/idle/idle0.png","assets/idle/idle2.png");
    const run_anim = loadAnimation("assets/am_run/run1.png","assets/am_run/run9.png")
    character.addAnimation("idle", idle_anim);
    character.addAnimation("run", run_anim);
    character.isJumping = true;
    character.debug = true;
    character.lives = 100;
    
    stuff.add(character);
    
    
    
    //platform setup
    platforms = new Group();
    
    for(let i = 0; i < NUM_PLATFORMS; i++){
        const platform = createSprite(i*platform_size, height-20, platform_size, platform_size);
        
        const platform_imgs = ["assets/platform/platform_tile.png"];
        
        for (let i = 0; i < NUM_PLATFORMS; i++) {
            const platform_img = loadImage(platform_imgs[floor(random(0,platform_imgs.length))]);
            platform.addImage(platform_img);
        }
        platforms.add(platform);
        platform.setCollider("rectangle", 0, 10, platform_size, 30);
        platform.debug = true;
    }
    
    
//    platform = loadImage("assets/platform/platform3.png");
    
//    const plat_img = loadImage("assets/platform/platform3.png");
//    plat.addImage(plat_img);
//    platform.add(plat);
//    
//    platform.debug = true;
    
    
    walls = new Group();
    for (let i = 0; i < NUM_WALLS; i++){
        const wall = createSprite(
        random(width + i*width/NUM_WALLS + 50, width + (i+1)*width/NUM_WALLS),
        height*5/6,
        40,
        height/3.5
        );
        console.log(width + i*width/NUM_WALLS + 50, width + (i+1)*width/NUM_WALLS)
        
        const wall_imgs = ["assets/walls/wall1.png"];
        
        for(let i = 0; i < NUM_WALLS; i++) {
            const wall_img = loadImage(wall_imgs[floor(random(0, wall_imgs.length))]);
            wall.addImage(wall_img);
        }
        walls.add(wall);
        wall.setCollider("rectangle", 0, 0, 90, 130);
        wall.debug = true;
        
    }
    
    
    invis_wall = new Group();
    const invis_walls1 = createSprite(-5,height/2,10, height);
    const invis_walls2 = createSprite(100,height/2,10, height);
    invis_wall.add(invis_walls1, invis_walls2);
    
    
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
    
    damage = new Group();
    
    beam = createSprite(0,height/2,100,height*2);
    beam.setCollider("rectangle", 0,0,80,height);
    const beam_anim = loadAnimation("assets/beam/beam1.png","assets/beam/beam5.png");
    beam.addAnimation("beaming", beam_anim);
    beam.debug = true;
    damage.add(beam);
    
    laser = createSprite(
        random(width*2.5,width*3),
        height/2,
        100,
        height*2
    );
    laser.setCollider("rectangle", 0,0,80,height);
    laser.debug = true;
    
    laser.addAnimation("lasering", beam_anim);
    damage.add(laser);
    
    
    salve = new Group();
    for (let i = 0; i < NUM_SALVE; i++){
        const life = createSprite (
        random(0, width),
        random(height/2, height-140),
        30,
        20
        );
        
        const salve_img = loadImage("assets/rewards/salve.png");
        life.addImage(salve_img);
        
        salve.add(life);
        salve.debug = true;
    }
    
    heart = new Group();
    for (let i = 0; i < NUM_HEART; i++){
        const hp = createSprite (
        random(0, width),
        random(height/2, height-140),
        30,
        20
        );
        
        const heart_img = loadImage("assets/rewards/heart.png");
        hp.addImage(heart_img);
        
        heart.add(hp);
        heart.debug = true;
    }
    
    blinks = new Group();
    
    const blinker = createSprite(100,60,50,50);
    const blink_symbol_img = loadImage("assets/blink_symbol/blink_symbol.png");
    blinker.addImage(blink_symbol_img);
    blinks.add(blinker);
    
}

function draw() {
    camera.off();
    background(bg);
    camera.on();
    
    
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
    
    if (character.collide(platforms) || character.collide(walls)) {
        character.velocity.y = 0;
        if(character.isJumping){
            character.isJumping = false;
        }
    } else {
        character.velocity.y += GRAVITY;
    }
    
//    if(character.position.x <= camera.position.x-width/2){
//        character.collide(walls) = false;
//    }
    
    console.log(character.isJumping);
    
    
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
//            jump_sfx[0].play();
        }
    }
    
    
    if (keyWentDown("w") && cooldown <= 0) {
        character.position.x += 200; 
        cooldown += 300;
        
//        while (character.overlap(walls)){
//            character.position.x +=1;
//        }
    }
    
    if (cooldown > 0) {
        cooldown -= 1;
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
        character.lives--;
    }
    
    if (character.overlap(laser)){
        character.lives--;
    }
    wrap(laser, random(width*2.5, width*3));
    
    
    for (let i = 0; i < salve.length; i++) {
        const life = salve[i];
        if (character.overlap(life)) {
            character.lives += 40;
            life.position.x += random(width*2, width*6);
        } else {
            wrap (life, random(width*2, width*6));
        }
    }
    
    for (let i = 0; i < heart.length; i++) {
        const hp = heart[i];
        if (character.overlap(hp)) {
            max_life += 20;
            hp.position.x += random(width*2, width*6);
        } else {
            wrap (hp, random(width*2, width*6));
        }
    }
    
    if (character.lives > max_life) {
        character.lives = max_life;
    }
    
    
    
    //overlapping push
    
//    while (character.overlap(walls)){
//        character.position.x +=1;
//    }
    
//    if(!character.collide(walls)){
//        while (character.overlap(walls)){
//            character.position.x +=1;
//        }
//    }
    
    
//    wrapping platforms and walls
    
    for(let i = 0; i < platforms.length; i++){
        const platform = platforms[i];
        wrap(platform, platform_size*NUM_PLATFORMS);
    }
    
    for(let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        wrap(wall, random(width + i*width/NUM_WALLS + 50, width + (i+1)*width/NUM_WALLS));
        
    }
    
    
//    camera and object constant movement
    camera.position.x += CAMERA_SPEED;
    beam.position.x += CAMERA_SPEED;
    character.position.x += CAMERA_SPEED;
    
    
    
    
    //drawSprites();
   
    drawSprites(platforms);
    drawSprites(salve);
    drawSprites(heart);
    drawSprites(walls);
    drawSprites(damage);
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
    text(character.lives+"/"+max_life, 180,20);
    text("Score: " + floor(character.position.x/100), 500, 20);
    textSize(30);
    strokeWeight(4);
    
    if(!cooldown == 0){
        text(ceil(cooldown/60), 92, 70);
    };
    textSize(12);
    strokeWeight(0);
    fill(0);
    
//    detect game ending
//    if(character.lives <= 0) {
//        gameState = 3;
//        character.velocity.y = 0;
//    }
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
