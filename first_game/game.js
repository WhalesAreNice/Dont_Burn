var character;
var platform;
var clouds;
var walls;
var beam;
var salve;
const SPEED = 4;
const GRAVITY = 1;
const JUMP_SPEED = SPEED*4;
const NUM_CLOUDS = 5;
const NUM_BUSHES = 8;
const NUM_WALLS = 3;
const NUM_SALVE = 40;


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
    platform.debug = true;
    
    
    walls = new Group();
    for (let i = 0; i < NUM_WALLS; i++){
        const wall = createSprite(
        random(32,width),
        height*4/5,
        40,
        height/3
        );
        walls.add(wall);
    }
    
    
    
    
    clouds = new Group();
    for (let i = 0; i < NUM_CLOUDS; i++) {
        const cloud = createSprite(
            random(width, width*2),
            random(height/2, 0),
            random(50,100),
            random(30,50)
        );
        cloud.velocity.x = -random(5,10);
        clouds.add(cloud);
    }
    
    beam = createSprite(
        0,
        0,
        100,
        height*2
    );
    
    salve = new Group();
    for (let i = 0; i < NUM_SALVE; i++){
        
    }
    
    
}

function draw() {
    background("lightblue");
    
    for (let i = 0; i < clouds.length; i++){
        const cloud = clouds[i];
        if (cloud.position.x+cloud.width/2 < 0){
            cloud.position.x = random(width, width*2);
            cloud.position.y = random(0, height/2);
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
    
    if (keyWentDown("x")){
        if (!character.isJumping){
            character.velocity.y -= JUMP_SPEED;
            character.isJumping = true;
        }
    }
    
    
    character.collide(walls);
    
    if (character.overlap(beam)){
        character.lives--;
    }
    
//    wrapping platform
    wrap(platform, width);
//    for(let i = 0: i < walls.length; i++) {
//        const wall = walls[i];
//        wrap(wall, random(width*2, width*4);)
//    }
    
    
//    camera and object constant movement
    camera.position.x += 2;
    beam.position.x += 2;
    character.position.x += 2;
    
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