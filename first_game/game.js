var character;
var platform;
var clouds;
var walls;
var beam;
var salve;
const SPEED = 4;
const GRAVITY = 1;
const JUMP_SPEED = SPEED*4;
const NUM_CLOUDS = 10;
const NUM_BUSHES = 8;
const NUM_WALLS = 3;
const NUM_SALVE = 1;
const CAMERA_SPEED = 5;


function setup() {
    createCanvas(640, 360);
    
    
    // character setup
    character = createSprite(100,20,32,32);
    const idle_anim = loadAnimation("assets/idle/idle0.png","assets/idle/idle2.png");
    const run_anim = loadAnimation("assets/am_run/run1.png","assets/am_run/run9.png")
    character.addAnimation("idle", idle_anim);
    character.addAnimation("run", run_anim);
    character.isJumping = true;
    character.debug = true;
    character.lives = 100;
    
    //platform setup
    platform = createSprite(width/2, height - 10, width*2, 20);
    
//    platform = loadImage("assets/platform/platform3.png");
    
//    const plat_img = loadImage("assets/platform/platform3.png");
//    plat.addImage(plat_img);
//    platform.add(plat);
//    
//    platform.debug = true;
    
    
    walls = new Group();
    for (let i = 0; i < NUM_WALLS; i++){
        const wall = createSprite(
        random(width,width*1.5),
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
    }
    walls.debug = true;
    
    
    
    
    
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
    
    beam = createSprite(0,0,100,height*2);
    
    
    salve = new Group();
    for (let i = 0; i < NUM_SALVE; i++){
        const life = createSprite (
        random(0, width),
        random(height/2, height),
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
    
    if (character.collide(platform) || character.collide(walls)) {
        character.velocity.y = 0;
        if(character.isJumping){
            character.isJumping = false;
        }
    } else {
        character.velocity.y += GRAVITY;
    }
    
    if (keyWentDown("SPACE")){
        if (!character.isJumping){
            character.velocity.y -= JUMP_SPEED;
            character.isJumping = true;
        }
    }
    
    if (keyWentDown("w")) {
        character.position.x += 200;
    }
    
    
    character.collide(walls);
    
    if (character.overlap(beam)){
        character.lives--;
    }
    
    for (let i = 0; i < salve.length; i++) {
        const life = salve[i];
        if (character.overlap(life)) {
            character.lives += 40;
            life.position.x += random(width*2, width*6);
        } else {
            wrap (life, random(width*2, width*6));
        }
    }
    
    
//    wrapping platform
    wrap(platform, width);
    for(let i = 0; i < walls.length; i++) {
        const wall = walls[i];
        wrap(wall, random(width*1.5, width*3));
    }
    
    
//    camera and object constant movement
    camera.position.x += CAMERA_SPEED;
    beam.position.x += CAMERA_SPEED;
    character.position.x += CAMERA_SPEED;
    
    drawSprites();
    drawSprites(walls);
    drawSprites(salve);
    
//    ui
    camera.off();
    drawSprites(clouds);
    fill(0);
    textAlign(LEFT);
    textSize(12);
    text("Life: " + character.lives, 10,20);
    
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
