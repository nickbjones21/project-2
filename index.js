//create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000; //make canvas w 1000
canvas.height = 1000; //make canvas h 1000
console.log(ctx);

document.body.appendChild(canvas);

//chessboard
let chessBoard = [
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
    ['x', 'x', 'x', 'x', 'x', 'x', 'x', 'x', 'x'],
]


//sound effects
var soundGameOver = new Audio("sounds/game-over-sound.wav"); //game over sound
var soundGameWin = new Audio("sounds/game-win-sound.wav"); //game win sound
var soundtargetCaught = new Audio("sounds/game-catch-sound.wav"); //target catch sound
//assign audio to sound FX
soundEfx = document.getElementById("soundEfx");


//load images ==============================================
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.jpg";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/boatsprite-down.png"; 

// target image
var targetReady = false;
var targetImage = new Image();
targetImage.onload = function () {
    targetReady = true;
};
targetImage.src = "images/spritesheets/kraken-spritesheet.png";

//border side image
var borderSideReady = false;
var borderSideImage = new Image();
borderSideImage.onload = function () {
    borderSideReady = true;
};
borderSideImage.src = "images/border-side.png";

//border bottom image
var borderBottomReady = false;
var borderBottomImage = new Image();
borderBottomImage.onload = function () {
    borderBottomReady = true;
};
borderBottomImage.src = "images/border-bottom.png";

//score counter bg image
var scorebgReady = false;
var scorebgImage = new Image();
scorebgImage.onload = function () {
    scorebgReady = true;
};
scorebgImage.src = "images/score-scroll.png";

//whirlpool image
var whirlpoolReady = false;
var whirlpoolImage = new Image();
whirlpoolImage.onload = function () {
    whirlpoolReady = true;
};
whirlpoolImage.src = "images/wp-1.png";

//rock (impassable obstacle)
var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
    rockReady = true;
};
rockImage.src = "images/rocks.png";

//game end screen
var gameendReady = false;
var gameendImage = new Image();
gameendImage.onload = function () {
    gameendReady = true;
};
gameendImage.src = "images/gameEndScreen.png";


//done with load images ==============================================


//define objects and variables we need =================================
// Game objects
var hero = {
    speed: 256, // movement in pixels per second
    x: 0, 
    y: 0  
};
var target = {

    

x: 512,
y: 330,
spriteX: 0,
spriteY: 0,
spriteWidth: 64,
spriteHeight: 64,
frameCount: 7,
currentFrame: 0,
frameSpeed: 1
};
//7 whirlpool enemies
var wp1 = {
    x: 100,
    y: 400
}
var wp2 = {
    x: 685,
    y: 500
}
var wp3 = {
    x: 60,
    y: 300
}
var wp4 = {
    x: 685,
    y: 400
}
var wp5 = {
    x: 60,
    y: 500
}
var wp6 = {
    x: 685,
    y: 500
}
var wp7 = {
    x: 60,
    y: 600
}


//5 rock obstacles - the boat cannot move through them
var rock = {
    x: 180,
    y: 630
}
var rock2 = {
    x: 250,
    y: 630
}
var rock3 = {
    x: 320,
    y: 630
}
var rock4 = {
    x: 400,
    y: 630
}
var rock5 = {
    x: 480,
    y: 630
}


var targetsCaught = 0;
var isGameOver = false;






//end define objects and variables we need =================================


//keyboard control ==================================================
// Handle keyboard controls
var keysDown = {}; //object were we properties when keys go down
                // and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
    //console.log(e.keyCode + " up")
    delete keysDown[e.keyCode];
}, false);

//end keyboard control ==================================================


//define functions ==============================================


// Update the sprite position based on the current frame
function updateSpritePosition() {
    if (target.frameSpeed > 0) {
      target.spriteX = target.currentFrame * target.spriteWidth + target.spriteWidth;
    } else {
      target.spriteX = target.currentFrame * target.spriteWidth;
    }
  }

  // for Drawing the current frame of the spritesheet
function drawSprite() {
    ctx.drawImage(
      targetImage,
      target.spriteX,
      target.spriteY,
      target.spriteWidth,
      target.spriteHeight,
      target.x,
      target.y,
      target.spriteWidth,
      target.spriteHeight
    );
  }

  // Update the animation frame
function updateAnimationFrame() {
    target.currentFrame += target.frameSpeed;
    if (target.currentFrame >= target.frameCount) {
      target.currentFrame = 0; //Resetss to the first frame when reaching  end
    }
    updateSpritePosition();
  }


// Draw everything in the main render function
var render = function () {
    if (isGameOver) {
        ctx.drawImage(gameendImage, 0, 0);
        return;
    }
    if(targetsCaught === 5) {
        ctx.drawImage(gameendImage, 0, 0);
        return;
    }
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (borderSideReady) {
        ctx.drawImage(borderSideImage, 965, 0);
        ctx.drawImage(borderSideImage, 0, 0);
    }
    if (borderBottomReady) {
        ctx.drawImage(borderBottomImage, 0, 958);
        ctx.drawImage(borderBottomImage, 0, 0);
    }
    if (whirlpoolReady) {
        ctx.drawImage(whirlpoolImage, wp1.x, wp1.y);
        ctx.drawImage(whirlpoolImage, wp2.x, wp2.y);
        ctx.drawImage(whirlpoolImage, wp3.x, wp3.y);
        ctx.drawImage(whirlpoolImage, wp4.x, wp4.y);
        ctx.drawImage(whirlpoolImage, wp5.x, wp5.y);
        ctx.drawImage(whirlpoolImage, wp6.x, wp6.y);
        ctx.drawImage(whirlpoolImage, wp7.x, wp7.y);
    }
 
    if (rockReady) {
        ctx.drawImage(rockImage, rock.x, rock.y);
        ctx.drawImage(rockImage, rock2.x, rock2.y);
        ctx.drawImage(rockImage, rock3.x, rock3.y);
        ctx.drawImage(rockImage, rock4.x, rock4.y);
        ctx.drawImage(rockImage, rock5.x, rock5.y);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (targetReady) {
        updateAnimationFrame(); // Update the ani frame
        drawSprite(); //Drawing the current frame of the spritesheet

        //ctx.drawImage(targetImage, target.x, target.y);
    }
    if (scorebgReady) {
        ctx.drawImage(scorebgImage, 0, 0);
    }

    

    // Score
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "18px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Sea targets Slain: " + targetsCaught, 100, 22);
}


// The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;
    update(delta / 1000);
    render();
    then = now;

    if (isGameOver || targetsCaught === 5) {
        ctx.drawImage(gameendImage, 0, 0);
        return;
    }
if(!isGameOver){
    requestAnimationFrame(main); 
}
};


// Reset the game when the player catches a target
var reset = function () {

    
    if (isGameOver == true) {
        soundGameOver.play();
        // soundEfx.src = soundGameOver;
        // soundEfx.play();
    }else if (targetsCaught === 5) {
        alert("Congratulations captain, you've won!");
        soundGameWin.play();
        return;
        //change sound effect and play it
        // soundEfx.src = soundGameWin;
        // soundEfx.play();

    }
    else if (isGameOver == false) {
        placeItem(hero);
        placeItem(target);
        placeItem(wp1);
        placeItem(wp2);
        placeItem(wp3);
        placeItem(wp4);
        placeItem(wp5);
        placeItem(wp6);
        placeItem(wp7);
        placeItem(rock);
        placeItem(rock2);
        placeItem(rock3);
        placeItem(rock4);
        placeItem(rock5);
  
    }
};

let placeItem = function (character) {
    let x = 5;
    let y = 6;
    let success = false;
    while(!success){
        x = Math.floor(Math.random() * 9); //width of our array, will return 0-8
        y = Math.floor(Math.random() * 9); //height of our array, will return 0-8
                if (chessBoard[x][y] === 'x'){
                    success = true;
                }
    }
    chessBoard[x][y] = 'o'; //marks a "square" within the array is taken
    character.x = (x*100) + 32; //allow space for border.
    character.y = (y*100) + 32; //allow space for border
}


//end of define functions ========================================



// Update game objects 
var update = function (modifier) {

    //adjust based on keys
    //check on keys
    if (38 in keysDown && hero.y > 32 + 0) { //  holding up key
        hero.y -= hero.speed * modifier;
        heroImage.src ="images/boatsprite-up-notflashing.png";
    }
    if (40 in keysDown && hero.y < canvas.height - (64 + 0)) { //  holding down key
        hero.y += hero.speed * modifier;
        heroImage.src ="images/boatsprite-down.png";
    }
    if (37 in keysDown && hero.x > (32 + 0)) { // holding left key
        hero.x -= hero.speed * modifier;
        heroImage.src ="images/boatsprite-left.png";
    }
    if (39 in keysDown && hero.x < canvas.width - (64 + 0)) { // holding right key
        hero.x += hero.speed * modifier;
        heroImage.src ="images/boatsprite-right.png";
    }
    


   // Are they touching?
   
   //check collision with targets

   //whirlpools
    if (
        hero.x <= (wp1.x + 30)
        && wp1.x <= (hero.x + 30)
        && hero.y <= (wp1.y + 30)
        && wp1.y <= (hero.y + 30)
        ||
        hero.x <= (wp2.x + 30)
        && wp2.x <= (hero.x + 30)
        && hero.y <= (wp2.y + 30)
        && wp2.y <= (hero.y + 30)
        ||
        hero.x <= (wp3.x + 30)
        && wp3.x <= (hero.x + 30)
        && hero.y <= (wp3.y + 30)
        && wp3.y <= (hero.y + 30)
        ||
        hero.x <= (wp4.x + 30)
        && wp4.x <= (hero.x + 30)
        && hero.y <= (wp4.y + 30)
        && wp4.y <= (hero.y + 30)
        ||
        hero.x <= (wp5.x + 30)
        && wp5.x <= (hero.x + 30)
        && hero.y <= (wp5.y + 30)
        && wp5.y <= (hero.y + 30)
        ||
        hero.x <= (wp6.x + 30)
        && wp6.x <= (hero.x + 30)
        && hero.y <= (wp6.y + 30)
        && wp6.y <= (hero.y + 30)
        ||
        hero.x <= (wp7.x + 30)
        && wp7.x <= (hero.x + 30)
        && hero.y <= (wp7.y + 30)
        && wp7.y <= (hero.y + 30)
    ){
        alert("Game over, avoid the whirlpools to prevent them from sinking your ship!");
        isGameOver = true;
    }


    //targets
    if (
        hero.x <= (target.x + 40)
        && target.x <= (hero.x + 60)
        && hero.y <= (target.y + 80)
        && target.y <= (hero.y + 60)
    ) {
        ++targetsCaught;       // keep track of our “score”
        soundtargetCaught.play();
        // soundEfx.src = soundtargetCaught;
        // soundEfx.play();
        reset();       // start a new cycle
    }



    //rock
    if (
        hero.x <= (rock.x + 40) &&
        rock.x <= (hero.x + 60) &&
        hero.y <= (rock.y + 30) &&
        rock.y <= (hero.y + 60)
        ||
        hero.x <= (rock2.x + 40) &&
        rock2.x <= (hero.x + 60) &&
        hero.y <= (rock2.y + 30) &&
        rock2.y <= (hero.y + 60)
        ||
        hero.x <= (rock3.x + 40) &&
        rock3.x <= (hero.x + 60) &&
        hero.y <= (rock3.y + 30) &&
        rock3.y <= (hero.y + 60)
        ||
        hero.x <= (rock4.x + 40) &&
        rock4.x <= (hero.x + 60) &&
        hero.y <= (rock4.y + 30) &&
        rock4.y <= (hero.y + 60)
        ||
        hero.x <= (rock5.x + 40) &&
        rock5.x <= (hero.x + 60) &&
        hero.y <= (rock5.y + 30) &&
        rock5.y <= (hero.y + 60)
    ) {
        // Collision with rock, prevent movement
        if (38 in keysDown && hero.y > 32 + 0) { // holding up key
            hero.y += hero.speed * modifier;
        }
        if (40 in keysDown && hero.y < canvas.height - (64 + 0)) { // holding down key
            hero.y -= hero.speed * modifier;
        }
        if (37 in keysDown && hero.x > (32 + 0)) { // holding left key
            hero.x += hero.speed * modifier;
        }
        if (39 in keysDown && hero.x < canvas.width - (64 + 0)) { // holding right key
            hero.x -= hero.speed * modifier;
        }
    }


};





// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.

