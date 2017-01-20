//Aliases
import {hitTestRectangle, keyboard, keyboardMoves, setHealthBar, carStartPos} from './modules/util';

var resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);
let u = new SpriteUtilities(PIXI, renderer);

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
    userCar,
    redCar,
    healthBar,
    message,
    startButtonWrapper,
    state;

stage.interactive = true;

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
    startButtonWrapper.position.set(240, 480);
}
function onAssetsLoaded(loader, res) {
    getStartButton();
    userCar = u.sprite('images/car.jpeg', stage.height - 400, 200);
    redCar = PIXI.Sprite.fromImage('images/red.car.png');
    background = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    background2 = PIXI.Sprite.fromImage('images/iP4_BGtile.jpg');
    stage.addChild(background, background2, redCar, userCar, startButtonWrapper);

    roadObjects();
    carStartPos(userCar);
    keyboardMoves(userCar);
    setHealthBar(stage, u);

    state = play;
    animate();
}

function animate() {

    bgAnim(background, background2, redCar)


    if (hitTestRectangle(userCar, redCar)) {
        let message = u.text("Life Meter", "", "16px", "white", 120, 25);

    } else {
    }
    requestAnimationFrame(animate);

    state();
    renderer.render(stage);
}


function play() {
    userCar.x += userCar.vx;
    userCar.y += userCar.vy;
}

function bgAnim(sprite, background2, redCar) {
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

    redCar.position.x = -(postition * 0.6) + 1286;
    redCar.position.x %= 1286 * 2;
    if (redCar.position.x < 0) {
        redCar.position.x += 1286 * 2;
    }
    redCar.position.x -= 1286;
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
