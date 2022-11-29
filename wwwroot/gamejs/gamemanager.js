const gamestatus = ["Easy war", "В процессе", "Игра завершена"];

class World {
    constructor(width, height, map) {
        this.width = width;
        this.height = height;
        this.map = map;
    }
    Draw() {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(10, 0xFFBD01, 1);
        graphics.beginFill(0x00FFBA);
        graphics.drawRect(window.screen.width *0.05, window.screen.height *0.05, this.width, this.height);
        graphics.endFill();
        app.stage.addChild(graphics);
    }
 
};
class GameManager {

    constructor() {
        this.world = new World(window.screen.width * 0.9, window.screen.height * 0.7, null);
    }
    Setup() {
        statusChange(gamestatus[1]);
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
class WorldMap {
   
};
class GameObject {


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









