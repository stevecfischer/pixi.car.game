//Aliases
var resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// load spine data
PIXI.loader
    .add('images/car.jpeg')
    .add('images/red.car.png')
    .load(onAssetsLoaded);

var postition = 0,
    background,
    background2,
    foreground,
    foreground2,
    imgPath = "./images/",
    scfImg,
    redCar,
    healthBar,
    gameScene,
    state;

stage.interactive = true;

function carStartPos() {
    scfImg.x = 6;
    scfImg.y = stage.height - 200;
    scfImg.vx = 0;
    scfImg.vy = 0;
    scfImg.scale.x = 0.5;
    scfImg.scale.y = 0.5;

    redCar.x = 600;
    redCar.y = 200;
    redCar.vx = 0;
    redCar.vy = 0;
    redCar.scale.x = 0.5;
    redCar.scale.y = 0.5;
}

function onAssetsLoaded(loader, res) {
  //Make the game scene and add it to the stage
gameScene = new PIXI.Container();


    //Create the `cat` sprite
    scfImg = PIXI.Sprite.fromImage('images/car.jpeg');
    redCar = PIXI.Sprite.fromImage('images/red.car.png');
    background = PIXI.Sprite.fromImage('required/assets/spine/iP4_BGtile.jpg');
    background2 = PIXI.Sprite.fromImage('required/assets/spine/iP4_BGtile.jpg');
    stage.addChild(background);
    stage.addChild(background2);
    stage.addChild(redCar);
    stage.addChild(scfImg);
    stage.addChild(gameScene);
    carStartPos();


    var scale = 0.3;

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = function() {
        scfImg.vx = -5;
        scfImg.vy = 0;
    };

    left.release = function() {
        if (!right.isDown && scfImg.vy === 0) {
            scfImg.vx = 0;
        }
    };

    up.press = function() {
        scfImg.vy = -5;
        scfImg.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && scfImg.vx === 0) {
            scfImg.vy = 0;
        }
    };

    right.press = function() {
        scfImg.vx = 5;
        scfImg.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && scfImg.vy === 0) {
            scfImg.vx = 0;
        }
    };

    down.press = function() {
        scfImg.vy = 5;
        scfImg.vx = 0;
    };
    down.release = function() {
        console.log(this);
        if (!up.isDown && scfImg.vx === 0) {
            scfImg.vy = 0;
        }
    };

    //Create the health bar
  healthBar = new PIXI.Container();
  healthBar.position.set(stage.width - 470, 40);
  gameScene.addChild(healthBar);
  //Create the black background rectangle
  var innerBar = new PIXI.Graphics();
  innerBar.beginFill(0x000000);
  innerBar.drawRect(0, 0, 128, 8);
  innerBar.endFill();
  healthBar.addChild(innerBar);
  //Create the front red rectangle
  var outerBar = new PIXI.Graphics();
  outerBar.beginFill(0xFF3300);
  outerBar.drawRect(0, 0, 128, 8);
  outerBar.endFill();
  healthBar.addChild(outerBar);
  healthBar.outer = outerBar;

    //Create the text sprite
    message = new PIXI.Text(
        "Great Driving", {
            font: "18px sans-serif",
            fill: "white"
        }
    );
    message.position.set(stage.width - 470, 20);
    stage.addChild(message);

    state = play;
    animate();
}

function animate() {
    postition += 10;

    function bgAnim(sprite) {

        sprite.position.x = -(postition * 0.6);
        sprite.position.x %= 1286 * 2;
        if (sprite.position.x < 0) {
            sprite.position.x += 1286 * 2;
        }
        sprite.position.x -= 1286;
    }

    background2.position.x = -(postition * 0.6) + 1286;
    background2.position.x %= 1286 * 2;
    if (background2.position.x < 0) {
        background2.position.x += 1286 * 2;
    }
    background2.position.x -= 1286;

    redCar.position.x = -(postition * 0.6) + 1286;
    redCar.position.x %= 1286 * 2;
    if (redCar.position.x < 0) {
        redCar.position.x += 1286 * 2;
    }
    redCar.position.x -= 1286;

    //check for a collision between the cat and the box
    if (hitTestRectangle(scfImg, redCar)) {
      //if there's a collision, change the message text
      //and tint the box red
      message.text = "You Crashed!";

    } else {
      //if there's no collision, reset the message
      //text and the box's color
      message.text = "Try and do better this time...";

    }


    bgAnim(background);

    requestAnimationFrame(animate);

    state();

    renderer.render(stage);
}


function play() {

    //Move the cat 1 pixel to the right each frame
    //scfImg.vx = 1
    //scfImg.vy = 1
    scfImg.x += scfImg.vx;
    scfImg.y += scfImg.vy;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}

//The `hitTestRectangle` function
function hitTestRectangle(r1, r2) {
  //Define the variables we'll need to calculate
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  //hit will determine whether there's a collision
  hit = false;
  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;
  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;
  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {
    //A collision might be occuring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {
      //There's definitely a collision happening
      hit = true;
    } else {
      //There's no collision on the y axis
      hit = false;
    }
  } else {
    //There's no collision on the x axis
    hit = false;
  }
  //`hit` will be either `true` or `false`
  return hit;
};
//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };
  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };
  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}
