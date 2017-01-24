//Aliases
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
import {hitTestRectangle, keyboard, keyboardMoves, setHealthBar, carStartPos} from './modules/util';

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
    endScene,
    requestID,
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
gameScene.visible = false;
endScene.visible = false;

stage.addChild(openScene, gameScene, endScene);

// load spine data
PIXI.loader
    .add('images/car.jpeg')
    .add('images/red.car.png')
    .add('images/iP4_BGtile.jpg')
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
    getStopButton();
    userCar = u.sprite('images/car.jpeg', stage.height - 400, 200);

    redCar = PIXI.Sprite.fromImage('images/red.car.png');
    background = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    background2 = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    openScene.addChild(background, background2, redCar, userCar, startButtonWrapper, stopButtonWrapper);

    roadObjects();
    carStartPos(userCar);
    keyboardMoves(userCar);
    setHealthBar(stage, u);
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
    if (hitTestRectangle(userCar, redCar)) {
        redCar.visible = false;
        u.shake(userCar, 0.05, true);

    } else {
        // let message = u.text("Hello!", "Futura", "32px", "white", 400, 20);
        // stage.addChild(message);
        // state = end;
    }
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

function onclick() {
    console.log('dddd');
}