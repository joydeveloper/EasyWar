class GameObject {
    constructor(x, y, anchor) {
        this.x = x;
        this.y = y;
        this.anchor = anchor
    }
    create(scene) {
        if (scene === undefined) {
            SceneManager.currentScene.addChild(this.graphics);
        }
        else {
            scene.addChild(this.graphics);
        }
    }
    delete(scene) {
        if (scene === undefined) {
            SceneManager.currentScene.removeChild(this.graphics);
        }
        else {
            scene.removeChild(this.graphics);
        }
    }
    draw(Function) {
        this.graphics = Function(this.x, this.y);
    }
    spriteFromLoad(url) {
        this.graphics = PIXI.Sprite.from(url);
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.anchor.set(this.anchor);
    }
    spriteFromCashe(spritename) {
        this.graphics = new PIXI.Sprite(PIXI.utils.TextureCache[spritename]);
        this.graphics.x = this.x;
        this.graphics.y = this.y;
        this.graphics.anchor.set(this.anchor);
    }
};
function drawSq(x, y) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xDE3249);
    graphics.drawRect(x, y, 100, 100);
    graphics.endFill();
    return graphics;
}
function drawVLine(x, y) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 'red', 1);
    graphics.moveTo(x, y);
    graphics.lineTo(x, SceneManager.currentScene._height);
    return graphics;
}
function drawHLine(x, y) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(2, 'red', 1);
    graphics.moveTo(x, y);
    graphics.lineTo(SceneManager.currentScene._width,y);
    return graphics;
}