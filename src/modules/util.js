
export function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function (event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    //The `upHandler`
    key.upHandler = function (event) {
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

export function keyboardMoves(sprite) {
        //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = function () {
        sprite.vx = -5;
        sprite.vy = 0;
    };

    left.release = function () {
        if (!right.isDown && sprite.vy === 0) {
            sprite.vx = 0;
        }
    };

    up.press = function () {
        sprite.vy = -5;
        sprite.vx = 0;
    };
    up.release = function () {
        if (!down.isDown && sprite.vx === 0) {
            sprite.vy = 0;
        }
    };

    right.press = function () {
        sprite.vx = 5;
        sprite.vy = 0;
    };
    right.release = function () {
        if (!left.isDown && sprite.vy === 0) {
            sprite.vx = 0;
        }
    };

    down.press = function () {
        sprite.vy = 5;
        sprite.vx = 0;
    };
    down.release = function () {
        if (!up.isDown && sprite.vx === 0) {
            sprite.vy = 0;
        }
    };
}

export function hitTestRectangle(r1, r2) {
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

export function setHealthBar(stage,u) {
    let healthbar = u.rectangle(200, 15, 'black', "black", 2, 50, 50);
    let lifemeter = u.rectangle(128, 15, 'red', "red", 2, 50, 50);
    let message = u.text("Life Meter", "", "16px", "white", 120, 25);

    let heathWrapper = u.group(healthbar,lifemeter,message);
    heathWrapper.position.set(4, 4);
    stage.addChild(heathWrapper);
};

export function setClock(){

}

export function carStartPos(userCar) {
        var scale = 0.3;

    userCar.x = 6;
    userCar.y = 200;
    userCar.vx = 0;
    userCar.vy = 0;
    userCar.scale.x = 0.5;
    userCar.scale.y = 0.5;
}