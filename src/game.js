//Aliases
(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());
import {hitTestRectangle, keyboard, keyboardMoves, setHealthBar, carStartPos, randomInt, contain} from './modules/util';

var resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var postition = 0,
    isRunning = false,
    background,
    background2,
    userCar,
    redCar,
    healthBar,
    pointer,
    startButtonWrapper,
    stopButtonWrapper,
    pause = false,
    openScene,
    gameScene,
    blobs,
    endScene,
    crashWrapper,
    requestID,
    lifemeter,
    state;

var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);
let u = new SpriteUtilities(PIXI, renderer);
let t = new Tink(PIXI, renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();
openScene = new PIXI.Container();
gameScene = new PIXI.Container();
endScene = new PIXI.Container();
openScene.visible = true;
gameScene.visible = true;
endScene.visible = false;

stage.addChild(openScene, gameScene, endScene);

// load spine data
PIXI.loader
    .add('images/car.jpeg')
    .add('images/red.car.png')
    .add('images/iP4_BGtile.jpg')
    .add('images/blob.png')
    .load(onAssetsLoaded);

// Event listener for the start button.
startBtn.addEventListener('click', function (e) {
    e.preventDefault();
    requestID = requestAnimationFrame(animate);
});

stopBtn.addEventListener('click', function (e) {
    e.preventDefault();
    cancelAnimationFrame(requestID);
});

function onAssetsLoaded(loader, res) {
    getStartButton();
    crashAlert();
    getStopButton();
    userCar = u.sprite('images/car.jpeg', stage.height - 400, 200);

    redCar = PIXI.Sprite.fromImage('images/red.car.png');
    background = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    background2 = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    openScene.addChild(background, background2, redCar, userCar, startButtonWrapper, stopButtonWrapper, crashWrapper);

    roadObjects();
    //Make the blobs
    var numberOfBlobs = 2,
        spacing = 48,
        xOffset = 150,
        speed = 1,
        direction = 1;
    //An array to store all the blob monsters
    blobs = [];
    //Make as many blobs as there are `numberOfBlobs`
    for (var i = 0; i < numberOfBlobs; i++) {
        var blob = new PIXI.Sprite.fromImage("images/explorer.png");
        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        //at which the first blob should be added
        var x = spacing * i + xOffset;
        //Give the blob a random y position
        var y = randomInt(0, stage.height - blob.height);
        //Set the blob's position
        blob.x = x;
        blob.y = y;
        //Set the blob's vertical velocity. `direction` will be either `1` or
        //`-1`. `1` means the enemy will move down and `-1` means the blob will
        //move up. Multiplying `direction` by `speed` determines the blob's
        //vertical direction
        blob.vy = speed * direction;
        //Reverse the direction for the next blob
        direction *= -1;
        //Push the blob into the `blobs` array
        blobs.push(blob);
        //Add the blob to the `gameScene`
        gameScene.addChild(blob);
    }
    carStartPos(userCar);
    keyboardMoves(userCar);
    lifemeter = setHealthBar(stage, u, lifemeter);
    t.makeInteractive(startButtonWrapper);
    t.makeInteractive(stopButtonWrapper);
    stopButtonWrapper.press = function () {
        console.log('start');
        cancelAnimationFrame(requestID);
    };
    startButtonWrapper.press = function () {
        console.log('stop');
        requestID = requestAnimationFrame(animate);
    }

    pointer = t.makePointer();

    state = play;
    animate();
}

function animate() {
    bgAnim(background, background2);
    u.shake(gameScene, 10, false);

    // if(pause) return;
    requestID = requestAnimationFrame(animate);


    t.update();
    state();
    renderer.render(stage);
}

function end() {
    gameScene.visible = false;
    endScene.visible = true;
    // gameOverScene.visible = true;
}

function play() {
    userCar.x += userCar.vx;
    userCar.y += userCar.vy;

    contain(userCar, {x: 1, y: 10, width: 700, height: 590});

    var userCarHit = false;
    //Loop through all the sprites in the `enemies` array
    blobs.forEach(function (blob) {
        //Move the blob
        blob.y += blob.vy;
        //Check the blob's screen boundaries
        var blobHitsWall = contain(blob, {x: 20, y: 20, width: 800, height: 300});
        //If the blob hits the top or bottom of the stage, reverse
        //its direction
        if (blobHitsWall === "top" || blobHitsWall === "bottom") {
            blob.vy *= -1;
        }
        //Test for a collision. If any of the enemies are touching
        //the userCar, set `userCarHit` to `true`
        if (hitTestRectangle(userCar, blob)) {
            userCarHit = true;
        }
    });
    if (userCarHit) {
        redCar.visible = false;
        console.log(lifemeter);
        lifemeter.bx -= 10;
        userCar.alpha = 0.5;
        console.log('HIT');
        cancelAnimationFrame(requestID);
        userCar.x = 0;
        userCar.y = 200;
        crashWrapper.visible = true;
        setTimeout(function () {
            crashWrapper.visible = false;
            requestID = requestAnimationFrame(animate);
        }, 2000);

    } else {
        userCar.alpha = 1;
    }

    //Does the userCar have enough health? If the width of the `innerBar`
    //is less than zero, end the game and display "You lost!"
    if (lifemeter.bx < 0) {
        state = end;
        console.log("You lost!");
    }
}

function bgAnim(sprite, background2) {
    postition += 3;
    sprite.position.x = -(postition * 0.6);
    sprite.position.x %= 1286 * 2;
    if (sprite.position.x < 0) {
        sprite.position.x += 1286 * 2;
    }
    sprite.position.x -= 1286;
    background2.position.x = -(postition * 0.6) + 1286;
    background2.position.x %= 1286 * 2;
    if (background2.position.x < 0) {
        background2.position.x += 1286 * 2;
    }
    background2.position.x -= 1286;
    //
    // redCar.position.x = -(postition * 0.6) + 1286;
    // redCar.position.x %= 1286 * 2;
    // if (redCar.position.x < 0) {
    //     redCar.position.x += 1286 * 2;
    // }
    // redCar.position.x -= 1286;
}

jQuery(function ($) {
    console.log($);
})

// function getPercent(axis, percent) {
//     let a;
//     if (axis == "w") {
//         a = renderer.width;
//     } else {
//         a = renderer.height;
//     }
//     const pos = (percent / 100) * a;
//     console.log(pos);
//     return pos;
// }
function roadObjects() {
    redCar.x = 600;
    redCar.y = 200;
    redCar.vx = 0;
    redCar.vy = 0;
    redCar.scale.x = 0.5;
    redCar.scale.y = 0.5;


}

function getStartButton() {
    let startButton = u.rectangle(200, 64, "seaGreen", "hotPink", 2);
    let message = u.text("Click to Start", "", "16px", "white", 50, 25);
    startButtonWrapper = u.group(startButton, message);
    startButtonWrapper.position.set(400, 480);
    startButtonWrapper.on("mousedown", onclick);
}

function getStopButton() {
    let stopButton = u.rectangle(200, 64, "seaGreen", "hotPink", 2);
    let message = u.text("Click to Stop", "", "16px", "white", 50, 25);
    stopButtonWrapper = u.group(stopButton, message);
    stopButtonWrapper.position.set(100, 480);
    stopButtonWrapper.on("mousedown", onclick);
}

function crashAlert() {
    let stopButton = u.rectangle(200, 100, "white", "black", 2);
    let message = u.text("Crash!!! Try Again.", "", "16px", "black", 50, 25);
    crashWrapper = u.group(stopButton, message);
    crashWrapper.position.set(275, 200);
    crashWrapper.visible = false;
}

function onclick() {
    console.log('dddd');
}