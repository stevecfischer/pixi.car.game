//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    imgPath = "./images/";


//Create a Pixi stage and renderer
var stage = new Container(),
    renderer = autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

//Load an image and the run the `setup` function
loader
    .add(imgPath + "Stones.jpg")
    .load(setup);

//Define any variables that are used in more than one function
var scfImg, state;

function setup() {

    //Create the `cat` sprite
    scfImg = new Sprite(resources[imgPath + "Stones.jpg"].texture);
    scfImg.x = 700;
    scfImg.vx = 0;
    scfImg.vy = 0;
    stage.addChild(scfImg);

/**
* Add Text Block
*/
    var message = new Text(
        "Lets Drive!", {
            fontFamily: "Arial",
            fontSize: 32,
            fill: "white"
        }
    );
    message.position.set(350, 700);
    stage.addChild(message);

    /**
    * Add Background
    */

    var background = new Sprite.fromImage(imgPath + 'Circus.jpg');
    stage.addChild(background);

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
        if (!up.isDown && scfImg.vx === 0) {
            scfImg.vy = 0;
        }
    };


    //Set the game state
    state = play;

    //Start the game loop
    gameLoop();
}

function gameLoop() {

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    //Update the current game state:
    state();

    //Render the stage
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
