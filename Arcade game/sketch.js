    /*

    - Copy your game project code into this file
    - for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
    - for finding cool sounds perhaps look here
    https://freesound.org/


    */

    var gameChar_x;
    var gameChar_y;
    var floorPos_y;
    var scrollPos;
    var gameChar_world_x;

    var isLeft; 
    var isRight;
    var isFalling;
    var isPlummeting;

    var trees_x;
    var canyons;
    var collectables;

    var game_score;
    var flagpole;
    var lives;

    var jumpSound;
    var coinsSound;
    var gameoverSound;
    var levelupSound;

    var platforms;
    var enemies;


    function preload()
    {
    soundFormats('mp3','wav');

    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    coinsSound = loadSound('assets/coins.wav');
    coinsSound.setVolume(0.5);
    gameoverSound = loadSound('assets/gameover.mp3');
    gameoverSound.setVolume(0.1);
    levelupSound = loadSound('assets/levelup.wav');
    //    levelupSoundSound.setVolume(0.5);
    }


    function setup()
    {
    createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    textSize(20);
    startGame();

    }


    function draw()
    {

    // fill the sky blue
    background(100, 155, 255); 

    // draw some green ground
    noStroke();
    fill(0,155,0);
    rect(0, floorPos_y, width, height/4); 

    push();
    translate(scrollPos, 0);
    drawClouds();
    drawMountains();
    drawTrees();

    for(var i =0; i < platforms.length; i++)
    {
    platforms[i].draw();
    }


    // Draw canyons.

    for(var i = 0; i < canyons.length; i++)
    {
    {
    drawCanyon(canyons[i]);
    checkCanyon(canyons[i]);
    }
    }



    // Draw collectable items.
    for(var i = 0; i < collectables.length; i++)
    {
    if(!collectables[i].isFound)
    {
    drawCollectable(collectables[i]);
    checkCollectable(collectables[i]);
    }


    }


    renderFlagpole();







    // Draw game character.

    pop();



    drawGameChar();
    fill (255);
    textSize(20);
    text("Score: " + game_score,20,60);


    if(lives == 0)
    {
    fill (255);
    textSize(20);
    text( "Game over! Press Space to Continue.", width/2 - 100, height/2);
    return;
    }

    if(flagpole.isReached)

    {

    text( "Level Complete. Press space to continue.", width/2 - 100, height/2);
    return;
    }



    // Logic to make the game character move or the background scroll.
    if(isLeft)
    {
    if(gameChar_x > width * 0.2)
    {
    gameChar_x -= 5;
    }
    else
    {
    scrollPos += 5;
    }
    }

    if(isRight)
    {
    if(gameChar_x < width * 0.8)
    {
    gameChar_x  += 5;
    }
    else
    {
    scrollPos -= 5; // negative for moving against the background
    }
    }

    // Logic to make the game character rise and fall.

    if (gameChar_y < floorPos_y)
    {
    var isContact = false;
    for(var i = 0; i < platforms.length; i++)
    {
    if(platforms[i].checkContact(gameChar_world_x,gameChar_y) == true)
    {
    isContact = true;
    break;
    }
    }
    if(isContact == false)
    {

    gameChar_y += 2 ;
    isFalling = true ;
    }

    }
    else 
    {    
    isFalling = false ;
    }

    if (isPlummeting == true)
    {
    gameChar_y = gameChar_y + 20 ;
    }


    if (flagpole.isReached == false)
    {
    checkFlagpole();
    }

    checkPlayerDie();

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
    }


    // ---------------------
    // Key control functions
    // ---------------------

    function keyPressed(){


    console.log("press" + keyCode);
    console.log("press" + key);
    if(keyCode == 37)
    {
    isLeft = true;
    }
    //moving right
    if(keyCode == 39)
    {
    isRight = true;
    }

    //jumping  
    if(keyCode == 32 && gameChar_y == floorPos_y)
    {
    isFalling=true;
    gameChar_y -=100;
    jumpSound.play();
    }

    }

    function keyReleased()
    {

    console.log("release" + keyCode);
    console.log("release" + key);
    if(keyCode == 37)
    {
    isLeft = false;
    }
    //moving right

    if(keyCode == 39)
    {
    isRight = false;
    }
    }


    // ------------------------------
    // Game character render function
    // ------------------------------

    // Function to draw the game character.

    function drawGameChar()
    {
    noStroke();

    if(isLeft && isFalling)
    {
    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x+1.5,gameChar_y-60,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-10,gameChar_y-50,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x-10,gameChar_y-15,8,5);
    //right feet
    rect(gameChar_x,gameChar_y-10,10,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-25,5,19);
    //left leg
    rect(gameChar_x-5,gameChar_y-25,5,15);
    //left hand
    rect(gameChar_x+12,gameChar_y-65,5,25);
    //right hand
    rect(gameChar_x-14,gameChar_y-65,5,25);

    }
    else if(isRight && isFalling)
    {
    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x+1.5,gameChar_y-60,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-10,gameChar_y-50,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x,gameChar_y-15,8,5);
    //right feet
    rect(gameChar_x+5,gameChar_y-10,10,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-25,5,19);
    //left leg
    rect(gameChar_x-5,gameChar_y-25,5,15);
    //left hand
    rect(gameChar_x+12,gameChar_y-65,5,25);
    //right hand
    rect(gameChar_x-14,gameChar_y-65,5,25);


    }
    else if(isLeft)
    {
    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x,gameChar_y-50,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-10,gameChar_y-40,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x-12,gameChar_y-5,8,5);
    //right feet
    rect(gameChar_x,gameChar_y-5,5,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-15,5,15);
    //left leg
    rect(gameChar_x-8,gameChar_y-15,5,15);
    //right hand
    rect(gameChar_x,gameChar_y-35,12,5);
    //left hand
    rect(gameChar_x-20,gameChar_y-35,12,5);
    }
    else if(isRight)
    {
    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x,gameChar_y-50,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-10,gameChar_y-40,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x-5,gameChar_y-5,5,5);
    //right feet
    rect(gameChar_x+10,gameChar_y-5,5,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-15,5,15);
    //left leg
    rect(gameChar_x-8,gameChar_y-15,5,15);
    //left hand
    rect(gameChar_x +10,gameChar_y-35,12,5);
    //right hand
    rect(gameChar_x-10,gameChar_y-35,12,5);

    }
    else if(isFalling || isPlummeting)
    {
    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x+1.5,gameChar_y-60,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-10,gameChar_y-50,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x-12,gameChar_y-10,10,5);
    //right feet
    rect(gameChar_x+5,gameChar_y-10,10,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-25,5,15);
    //right leg
    rect(gameChar_x-8,gameChar_y-25,5,15);
    //left hand
    rect(gameChar_x+12,gameChar_y-65,5,25);
    //right hand
    rect(gameChar_x-14,gameChar_y-65,5,25);

    }
    else
    {
    // add your standing front facing code

    fill(0);
    //ellipse(gameChar_x,gameChar_y,5,5);
    //head
    ellipse(gameChar_x,gameChar_y-50,20,20);
    //body
    fill(221,160,221);
    stroke(218,112,214);
    rect(gameChar_x-11,gameChar_y-40,21,25);
    fill (0)
    noStroke();
    //left feet
    rect(gameChar_x-15,gameChar_y-5,10,5);
    //right feet
    rect(gameChar_x+5,gameChar_y-5,10,5);
    //right leg
    rect(gameChar_x+5,gameChar_y-15,5,15);
    //right leg
    rect(gameChar_x-10,gameChar_y-15,5,15);
    //left hand
    rect(gameChar_x-22,gameChar_y-35,12,5);
    //right hand
    rect(gameChar_x+10,gameChar_y-35,12,5);


    }

    }

    // ---------------------------
    // Background render functions
    // ---------------------------

    // Function to draw cloud objects.

    function drawClouds()
    {
    for(var i = 0; i < clouds.length; i++)
    {

    fill(224,224,224);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width, clouds[i].height);
    ellipse(clouds[i].x_pos+85, clouds[i].y_pos, clouds[i].width, clouds[i].height);
    ellipse(clouds[i].x_pos+45, clouds[i].y_pos-12, clouds[i].width+32, clouds[i].height+24);
    rect(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width+24, clouds[i].height-20);

    fill(255,255,255);
    ellipse(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width, clouds[i].height);
    ellipse(clouds[i].x_pos+76, clouds[i].y_pos, clouds[i].width, clouds[i].height);
    ellipse(clouds[i].x_pos+36, clouds[i].y_pos-12, clouds[i].width+32, clouds[i].height+24);
    rect(clouds[i].x_pos, clouds[i].y_pos, clouds[i].width+24, clouds[i].height-20);

    }
    }

    // Function to draw mountains objects.

    function drawMountains()
    {
    for(var i = 0; i < mountains.length; i++)
    {


    fill(128,128,128);
    triangle(mountains[i].x_pos+151, mountains[i].y_pos, mountains[i].x_pos+150 , mountains[i].y_pos-182, mountains[i].x_pos+300 , mountains[i].y_pos);
    fill(192,192,192);
    triangle(mountains[i].x_pos, mountains[i].y_pos, mountains[i].x_pos+50, mountains[i].y_pos-116, mountains[i].x_pos+200, mountains[i].y_pos);
    triangle(mountains[i].x_pos+20, mountains[i].y_pos, mountains[i].x_pos+120, mountains[i].y_pos-245, mountains[i].x_pos+190, mountains[i].y_pos); 
    }
    }



    // Function to draw trees objects.

    function drawTrees()

    { for(let i=0; i < trees_x.length; i++)
    {
    fill(255);

    fill(102,51,0);
    stroke('#222222');
    rect(trees_x[i]+15, floorPos_y -150, 30, 150);
    //branches
    noStroke();

    fill(0,102,0);
    triangle(trees_x[i]-50,floorPos_y-155,trees_x[i] +30, floorPos_y -200, trees_x[i]+100, floorPos_y-155);
    triangle(trees_x[i]-50,floorPos_y-130, trees_x[i]+30, floorPos_y-180, trees_x[i]+120, floorPos_y-130);
    triangle(trees_x[i]-50, floorPos_y-100, trees_x[i]+30, floorPos_y-170 , trees_x[i]+120, floorPos_y -100);


    //tree
    fill(0,111,0);
    triangle(trees_x[i]-50,floorPos_y-155,trees_x[i] +30, floorPos_y -200, trees_x[i]+105, floorPos_y-155);
    triangle(trees_x[i]-50,floorPos_y-130, trees_x[i]+30, floorPos_y-180, trees_x[i]+115, floorPos_y-130);
    triangle(trees_x[i]-50, floorPos_y-100, trees_x[i]+30, floorPos_y-170 , trees_x[i]+105, floorPos_y-100 
    );

    }
    }



    // ---------------------------------
    // Canyon render and check functions
    // ---------------------------------

    // Function to draw canyon objects.
    function drawCanyon(t_canyon)


    {
    {
    fill(0,128,255);
    noStroke();
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.height,80);
    fill(244,164,96);
    rect(t_canyon.x_pos, t_canyon.y_pos, t_canyon.width, t_canyon.height -24);

    fill(210,105,30);
    rect(t_canyon.x_pos, t_canyon.y_pos-5, t_canyon.width-60, t_canyon.height+10, 70);

    fill(210,105,30);
    rect(t_canyon.x_pos+60, t_canyon.y_pos-5, t_canyon.width-60, t_canyon.height+10, 70);
    }

    }

    // Function to check character is over a canyon.

    function checkCanyon(t_canyon)
    {
    if(gameChar_world_x > t_canyon.x_pos && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y)
    {
    isPlummeting = true ;
    gameoverSound.play();
    }


    }
    // ----------------------------------
    // Collectable items render and check functions
    // ----------------------------------

    // Function to draw collectable objects.

    function drawCollectable(t_collectable)
    {
    // translate(scrollPos, 0);

    //        // bottom



    strokeWeight(1);
    stroke(200,0,0);
    fill(238,130,238);


    triangle(t_collectable.x_pos-5, 
    t_collectable.y_pos, 
    t_collectable.x_pos+40,
    t_collectable.y_pos,
    t_collectable.x_pos+17, 
    t_collectable.y_pos+15,
    t_collectable.size);

    triangle(t_collectable.x_pos+5, 
    t_collectable.y_pos, 
    t_collectable.x_pos+40,
    t_collectable.y_pos, 
    t_collectable.x_pos+17, 
    t_collectable.y_pos+15,
    t_collectable.size);

    triangle(t_collectable.x_pos+30, 
    t_collectable.y_pos, 
    t_collectable.x_pos+30, 
    t_collectable.y_pos, 
    t_collectable.x_pos+17, 
    t_collectable.y_pos+15,
    t_collectable.size);


    //top

    rect(t_collectable.x_pos+5,
    t_collectable.y_pos-10,
    25,
    10);

    triangle(t_collectable.x_pos+30, 
    t_collectable.y_pos-10,
    t_collectable.x_pos+40, 
    t_collectable.y_pos,
    t_collectable.x_pos+30, 
    t_collectable.y_pos,
    t_collectable.size);

    triangle(t_collectable.x_pos+5, 
    t_collectable.y_pos-10, 
    t_collectable.x_pos-5,
    t_collectable.y_pos, 
    t_collectable.x_pos+5, 
    t_collectable.y_pos,
    t_collectable.size);


    }


    // Function to check character has collected an item.

    function checkCollectable(t_collectable)

    {

    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 40)
    {
    t_collectable.isFound = true;
    game_score += 1;
    coinsSound.play();


    }
    }

    function renderFlagpole()
    {

    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos,floorPos_y,flagpole.x_pos,floorPos_y-200);
    fill(204,153,255)
    noStroke();

    if(flagpole.isReached)
    {
    rect(flagpole.x_pos,floorPos_y-200,70,50)
    }
    else
    {
    rect(flagpole.x_pos,floorPos_y-50,70,50)
    }

    for( var i =0; i< enemies.length; i++)
    {
    enemies[i].draw(); 
    var isContact = enemies[i].checkContact(gameChar_world_x,gameChar_y)

    if(isContact)
    {
    if(lives > 0) 
    {
    startGame();
    break;
    }

    }
    }

    pop();
    }



    function checkFlagpole()
    {
    var d = abs(gameChar_world_x - flagpole.x_pos);

    if ( d < 15)

    {
    flagpole.isReached = true;
    levelupSound.play();
    }
    }

    function Enemy(x,y,range) 
    {
    this.x = x; 
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1;

    this.update = function ()
    {
    this.currentX += this.inc;

    if(this.currentX >= this.x + this.range)
    {
    this.inc = -1;
    }
    else if(this.currentX <this.x)
    {
    this.inc=1;
    }
    }
    this.draw= function ()
    {
    this.update();
    //        stroke(0);
    //        strokeWeight(0.5);
    fill(139,69,19);
    rect(this.currentX-3,this.y-40,5,40,5);
    fill(255,0,0);

    rect(this.currentX-10,this.y-25,20,10);
    ellipse(this.currentX,this.y,40,40);
    stroke(0);
    strokeWeight(0.5);
    fill (255,248,220);
    rect(this.currentX-10,this.y+5,20,5,5);
    noStroke();
    rect(this.currentX-10,this.y+5,20,5,5);
    ellipse(this.currentX-10,this.y-5,10,10);
    ellipse(this.currentX+10,this.y-5,10,10);
    fill(0);
    ellipse(this.currentX-10,this.y-5,5 ,5);
    ellipse(this.currentX+10,this.y-5,5,5);

    }
    this.checkContact = function(gc_x,gc_y)
    {
    var d = dist(gc_x,gc_y,this.currentX,this.y)  
    if(d < 20)

    {
    return true;
    gameoverSound.play();
    }
    return false;


    }
    }

    function checkPlayerDie()
    {
    if(gameChar_y > height)
    {
    lives -= 1;
    if(lives > 0)
    {
    startGame();
    }
    else
    {
    lives = 0;
    text("No more lives remained" + lives, 20 , 20);
    }

    }

    fill(255,0,0);
    noStroke();


    for ( var i = 0 ; i < lives ; i++)
    {
    text("Lives remaining :" , 20 , 30);
    ellipse( 200  + i * 30 , 23, 20 , 20);


    }

    }


    function startGame()
    {


    gameChar_x = width/2;
    gameChar_y = floorPos_y;



    // Variable to control the background scrolling.
    scrollPos = 0;

    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;

    // Initialise arrays of scenery objects.

    trees_x = 
    [
    100,
    300,
    500,
    700,
    1000
    ];

    mountains = 
    [
    {x_pos: -50, y_pos: 432},
    {x_pos: 400, y_pos: 432},
    {x_pos: 1000, y_pos: 432},
    {x_pos: 2400, y_pos: 432},
    {x_pos: 3500, y_pos: 432}
    ];

    clouds = 
    [
    {x_pos: 160, y_pos: 150, width: 56, height: 40},
    {x_pos: 540, y_pos: 200, width: 56, height: 40},
    {x_pos: 800, y_pos: 150, width: 56, height: 40},
    {x_pos: 1000, y_pos: 150, width: 56, height: 40},
    {x_pos: 1300, y_pos: 150, width: 56, height: 40},
    {x_pos: 1800, y_pos: 150, width: 56, height: 40},
    {x_pos: 2100, y_pos: 150, width: 56, height: 40},
    {x_pos: 2400, y_pos: 150, width: 56, height: 40},
    ];

    collectables = 
    [
    {x_pos: 50, y_pos: floorPos_y-20, size: 40, isFound: false},
    {x_pos: 400, y_pos: floorPos_y-20, size: 40, isFound: false},
    {x_pos: 600, y_pos: floorPos_y-20, size: 40, isFound: false},
    {x_pos: 800, y_pos: floorPos_y-20, size: 40, isFound: false}

    ];

    canyons =
    [
    {x_pos: 200, y_pos: floorPos_y, width: 75, height: 150},
    {x_pos: 700, y_pos: floorPos_y, width: 75, height: 150},
    {x_pos: 900, y_pos: floorPos_y, width: 75, height: 150},
    {x_pos: 1200, y_pos: floorPos_y, width: 75,height: 150},
    {x_pos: 1600, y_pos: floorPos_y, width: 75,height: 150}
    ];

    platforms = [];
    platforms.push(createPlatforms(50,floorPos_y-100,100));
    platforms.push(createPlatforms(350,floorPos_y-70,100));
    platforms.push(createPlatforms(600,floorPos_y-100,100));
    platforms.push(createPlatforms(850,floorPos_y-50,100));
    platforms.push(createPlatforms(1300,floorPos_y-50,100));


    game_score = 0; 

    flagpole = {x_pos: 1500, isReached :false};
    enemies = [];
    enemies.push ( new Enemy( 100, floorPos_y-10,100));  
    enemies.push ( new Enemy( 590, floorPos_y-10,100)); 
    enemies.push ( new Enemy( 990, floorPos_y-10,100));





    }

    function createPlatforms(x,y,length)
    {
    var p = {
    x:x,
    y:y,
    length:length,
    draw: function (){
    stroke(0);
    strokeWeight(0.5);    
    fill(148,0,211);
    rect(this.x,this.y,this.length,20);

    },
    checkContact: function(gc_x,gc_y)
    {
    if(gc_x > this.x && gc_x < this.x + this.length)
    {
    var d = this.y - gc_y; 
    if(d>=0 && d < 5 )
    {
    return true;
    }

    return false;


    }
    }
    }

    return p;


    }





