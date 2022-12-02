class SceneManager {
    constructor() {
    }
    static Gapp;
    static currentScene;
    static _width;
    static _height;
    static get width() {
        return this._width;
    }
    static get height() {
        return this._height;
    }
    static initialize(width, height, background) {
        this._width = width;
        this._height = height;
        this.Gapp = new PIXI.Application({
            view: document.getElementById("mainscene"),
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
            width: width,
            height: height
        });
        this.Gapp.ticker.add(this.update)
    }
    static changeScene(scene) {
        if (this.currentScene) {
            this.Gapp.stage.removeChild(this.currentScene);
            this.currentScene.destroy();
        }
        this.currentScene = scene;
        this.Gapp.stage.addChild(this.currentScene);
    }
    static update(framesPassed) {
        if (this.currentScene) {
            this.currentScene.update(framesPassed);
        }
    }
}