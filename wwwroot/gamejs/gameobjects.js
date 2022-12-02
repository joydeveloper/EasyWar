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