class GameObject {
    graphics;
    constructor(x, y, anchor) {
        this.x = x || 0;;
        this.y = y || 0;;
        this.anchor = anchor || 0;
        this.isCollising = false;
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
function drawSqAllocField(x,y) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xA3EE97);
    graphics.drawRect(x, y, SceneManager.currentScene._width,170);
    graphics.endFill();
    return graphics;
}
function drawBattleField(x, y) {
    const graphics = new PIXI.Graphics();
    graphics.lineStyle(5, 0xFEEB77, 5);
    graphics.beginFill(0x650A5A);
    graphics.drawRect(x, y, SceneManager.currentScene._width, SceneManager.currentScene._height-250);
    graphics.endFill();
    return graphics;
}
function drawControlPanel(x, y) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xC9D4EF);
    graphics.drawRect(x, y, SceneManager.currentScene._width, 170);
    graphics.endFill();
    return graphics;
}
function testForAABB(object1, object2) {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();
    return bounds1.x < bounds2.x + bounds2.width
        && bounds1.x + bounds1.width > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height
        && bounds1.y + bounds1.height > bounds2.y;
}
function testForAABBRange(object1, object2, range) {
    if (range === undefined)
        range = 0;
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();
    return bounds1.x < bounds2.x + bounds2.width+range
        && bounds1.x + bounds1.width+range > bounds2.x
        && bounds1.y < bounds2.y + bounds2.height+range
        && bounds1.y + bounds1.height+range > bounds2.y;
}
function getCenter(width, height) {
    return new Vector2(width / 2, height / 2);
}