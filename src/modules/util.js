
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

export function setHealthBar(stage,u,lifemeter) {
    let healthbar = u.line("white", 17, 50, 59, 250, 59);
    lifemeter = u.line("red", 17, 50, 59, 250, 59);
    let message = u.text("Life Meter", "", "16px", "white", 110, 25);
    let heathWrapper = u.group(healthbar,lifemeter,message);
    heathWrapper.position.set(4, 4);
    stage.addChild(heathWrapper);
    return lifemeter;
};

export function setClock(){

}

export function carStartPos(userCar) {
        var scale = 0.3;

    userCar.x = 0;
    userCar.y = 200;
    userCar.vx = 0;
    userCar.vy = 0;
    userCar.scale.x = 0.3;
    userCar.scale.y = 0.3;
}

//The `randomInt` helper function
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function contain(sprite, container) {
  var collision = undefined;
  //Left
  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }
  //Top
  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
  }
  //Right
  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
    collision = "right";
  }
  //Bottom
  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
    collision = "bottom";
  }
  //Return the `collision` value
  return collision;
}