var bg;
var character;
var platforms;
var clouds;
var walls;
var beam;
var salve;
var invis_wall;
var stuff;
var damage;
var laser;
var cooldown = 0;
const platform_size = 55;
const SPEED = 4;
const GRAVITY = 1;
const WIND = 1;
const JUMP_SPEED = SPEED*4;
const NUM_CLOUDS = 10;
const NUM_PLATFORMS = 30;
const NUM_BUSHES = 8;
const NUM_WALLS = 3;
const NUM_SALVE = 1;
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
    character = createSprite(100,20,32,32);
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
    const invis_walls1 = createSprite(-1,height/2,2, height);
    const invis_walls2 = createSprite(width, height/2, 200, height);
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
    
    
}

function draw() {
    
    background("lightblue");
//    camera.on();
    
    
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
    }
    
    if (cooldown > 0) {
        cooldown -= 1;
    }
    
    character.collide(walls);
    
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
    
    //overlapping push
    
//    while (character.overlap(walls)){
//        character.position.x +=1;
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
    drawSprites(stuff);
    drawSprites(salve);
    drawSprites(walls);
    drawSprites(damage);
    
    
//    ui
    camera.off();
    drawSprites(clouds);
    drawSprites(invis_wall);
    fill(0);
    textAlign(LEFT);
    textSize(12);
    text("Life: " + character.lives, 60,20);
    text("Score: " + floor(character.position.x/100), 500, 20);
    text("Blink Cooldown: " + ceil  (cooldown/60), 60, 50);
    
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
