//Aliases
var resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

var renderer = PIXI.autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// load spine data
PIXI.loader
    .add('images/Circus.jpg')
    .load(onAssetsLoaded);

var postition = 0,
    background,
    background2,
    foreground,
    foreground2,
    imgPath = "./images/",
    scfImg,
    state;

stage.interactive = true;

function onAssetsLoaded(loader,res)
{
    //Create the `cat` sprite
    scfImg = new Sprite(resources[imgPath + "Circus.jpg"]);
    scfImg.x = 700;
    scfImg.vx = 0;
    scfImg.vy = 0;
    stage.addChild(scfImg);

    background = PIXI.Sprite.fromImage('required/assets/spine/iP4_BGtile.jpg');
    background2 = PIXI.Sprite.fromImage('required/assets/spine/iP4_BGtile.jpg');
    // stage.addChild(background);
    // stage.addChild(background2);

    foreground = PIXI.Sprite.fromImage('required/assets/spine/iP4_ground.png');
    foreground2 = PIXI.Sprite.fromImage('required/assets/spine/iP4_ground.png');
    // stage.addChild(foreground);
    // stage.addChild(foreground2);
    foreground.position.y = foreground2.position.y = 640 - foreground2.height;


    var scale = 0.3;


    stage.on('mousedown', onTouchStart);
    stage.on('touchstart', onTouchStart);

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

    function onTouchStart()
    {

    }
    state = play;
    animate();
}

function animate()
{
    postition += 10;

    background.position.x = -(postition * 0.6);
    background.position.x %= 1286 * 2;
    if(background.position.x < 0)
    {
        background.position.x += 1286 * 2;
    }
    background.position.x -= 1286;

    background2.position.x = -(postition * 0.6) + 1286;
    background2.position.x %= 1286 * 2;
    if(background2.position.x < 0)
    {
        background2.position.x += 1286 * 2;
    }
    background2.position.x -= 1286;

    foreground.position.x = -postition;
    foreground.position.x %= 1286 * 2;
    if(foreground.position.x < 0)
    {
        foreground.position.x += 1286 * 2;
    }
    foreground.position.x -= 1286;

    foreground2.position.x = -postition + 1286;
    foreground2.position.x %= 1286 * 2;
    if(foreground2.position.x < 0)
    {
        foreground2.position.x += 1286 * 2;
    }
    foreground2.position.x -= 1286;

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
