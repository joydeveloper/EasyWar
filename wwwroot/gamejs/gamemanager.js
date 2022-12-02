//TODO manager,loader
const gamestatus = ["Easy war", "В процессе", "Игра завершена"];
class ObjectValuesMap {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    SeedMap() {
        var x = [], i, j;
        for (i = 0; i < this.width; i++) {
            x[i] = new Array();
            for (j = 0; j < this.height; j++) {
                x[i][j] = getRandomArbitrary(0, 3);
            }
        }
        return x;
    }
};
class WorldLayer {
    constructor(width, height, map) {
        this.width = width;
        this.height = height;
        this.map = map;
        this.floor = new PIXI.Graphics();
    }
    Draw() {
        this.floor.lineStyle(10, 0xFFBD01, 1);
        this.floor.beginFill(0x00FFBA);
        this.floor.drawRect(0, 0, this.width, this.height);
        this.floor.endFill();
        app.stage.addChild(this.floor);
        this.DrawObjects();
    }
    DrawObjects() {
        let step =10
        let xmap = this.map.SeedMap();
        let x = step;
        let y = step;
        console.log(x);
        xmap.forEach((element) => {
            (x < this.floor.width-step) ? x += 100 : x = step;
            element.forEach((el) => {
               let go = new GameObject(x, y);
                go.Draw(DrawCircle);
                go.Create();
                (y < this.floor.height-step) ? y += 100 : y = step;
            })
        })
     }
};
class GameManager {
    constructor() {
        this.world = new WorldLayer(window.screen.width * 0.9, window.screen.height * 0.7, new ObjectValuesMap(window.screen.width /100, window.screen.height/100));
    }
    Setup() {
        statusChange(gamestatus[1]);
        document.getElementById('mainscene').appendChild(window.app.view);
        this.world.Draw();
        restartProc(this.Restart);
    }
    Start() {
        //this.world.Draw();
    }
    Restart() {
        statusChange(gamestatus[0]);
        document.getElementById('restartbut').remove();
        app.stage.removeChildAt(0);
    }
    GameOver() {
        statusChange(gamestatus[2]);
    }
    OnGameprocess = new Event('gameevent');

};
class GameObject {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    Create() {
        app.stage.addChild(this.graphics);
    }
    Delete() {
        app.stage.removeChild(this.graphics);
    }
    Draw(Function) {
        this.graphics = Function(this.x, this.y);
    }
    SpriteLoad(url, anchor) {
        this.graphics = PIXI.Sprite.from(url);
        this.graphics.anchor.set(anchor);
    }
};
class StaticObject extends GameObject {

};
function statusChange(text) {
    document.getElementById('status').innerHTML = text;
};
function restartProc(func) {
    if (!document.getElementById('restartbut')) {
        let button = BuildElement('button', 'mainscene', 'restartbut', 'button');
        button.innerHTML = "Еще раз";
        AddClickFunction(button, func);
    }
}
function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function DrawCircle(x,y) {
    let graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 0xFEEB77, 1);
    graphics.beginFill(0x650A5A, 1);
    graphics.drawCircle(x, y, 10);
    graphics.endFill();
    return graphics;
}
function DrawSquare(x,y) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0xDE3249);
    graphics.drawRect(x, y, 100, 100);
    graphics.endFill();
    return graphics;
}








