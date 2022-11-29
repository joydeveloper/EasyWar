let app = new PIXI.Application({ resizeTo: window , background: "red" });
let sprite = PIXI.Sprite.from('Assets/test.png');
let sprite2 = PIXI.Sprite.from('Assets/test.png');
let elapsed = 0.0;
class GameManager {
    constructor(pixiapp) {
        this.pixiapp = pixiapp;
    }
    Start() {
        this.pixiapp.stage.addChild(sprite);
  
   
    }
    Setup() {
       
        ParentSet(document.createElement("div"), "mainscene");
    }
    Update() {
        app.ticker.add((delta) => {
            elapsed += delta;
            sprite.x = 100.0 + Math.cos(elapsed / 50.0) * 100.0;
            let spritex = PIXI.Sprite.from('Assets/test.png');
            spritex.interactive = true;
            spritex.cursor = 'pointer';
            spritex.on('pointerdown', onClick);
            this.pixiapp.stage.addChild(spritex);
           
        }); 
    }
}
const gameManager = new GameManager(app);
window.gameManager = gameManager;
function onStart() {
    document.body.appendChild(app.view);
    gameManager.Setup();
    gameManager.Start();
    gameManager.Update();
}
function onClick() {
    spritex.scale.x *= 1.25;
    spritex.scale.y *= 1.25;
}
function ParentSet(instance, eparent) {
    if (eparent != null || eparent != undefined)
        document.getElementById(eparent).appendChild(instance);
}


