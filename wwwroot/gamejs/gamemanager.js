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
        const texttostart = new PIXI.Text('Click To Play', new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 50 }));
        texttostart.x = window.screen.width / 2 - 100;
        texttostart.y = window.screen.height / 2 - 200;
        texttostart.interactive = true;
        texttostart.on('pointerdown', this.startGame)
        this.Gapp.ticker.add((deltaTime) => this.update(deltaTime));
        this.Gapp.stage.addChild(texttostart);
    }
    static changeScene(scene) {
        this.clearScene();
        this.currentScene = scene;
        this.Gapp.stage.addChild(scene);
    }
    static update(framesPassed) {
        if (this.currentScene) {
            this.currentScene.update();
        }

    }
    static clearScene() {
        this.Gapp.stage.children.forEach((element) => this.Gapp.stage.removeChild(element));
    }
    static startGame() {
        const scene = new Scene(window.screen.width - 19, window.screen.height - 150, 'Assets/spriteinfo.json');
        scene.preloadScene().then(() => SceneManager.changeScene(scene));
        let x = 100;
        SceneManager.waitForLoading(scene, x);
       
    }
    static waitForLoading(scene,x) {
        if (!scene.isLoaded) {
            setTimeout(() => { SceneManager.waitForLoading(scene, x += x); }, x);
        }
        else {
            unitsAllocated();

        }
    }
}
class Scene extends PIXI.Container {
    
    constructor(width, height, path) {
        super();
        this.width = width;
        this.height = height;
        this.path = path;
        this.loaderbar = new PIXI.Graphics();
        this.loaderbar.lineStyle(2, 0xFEEB77, 1);
        this.loaderbar.beginFill(0x650A5A);
        this.loaderbar.drawRect(window.screen.width / 2 - 100, window.screen.height / 2 - 200, 100, 50);
        this.loaderbar.endFill();
        this.isLoaded = false;
        this.sortableChildren = true;
        this.zIndex = 1;
        SceneManager.Gapp.stage.addChild(this.loaderbar);
    }
    preloadScene() {
        return PIXI.Assets.load(this.path).then((gi) => this.onLoading(gi));
    }
    downloadProgress(x) {
        const progressRatio = x;
        this.loaderbar.scale.x = progressRatio;
    }
    sceneLoaded(gi) {
        this.spritesheet = gi;
        this.isLoaded = true;
        this.removeChild(this.loaderBar);
    }
    async onLoading(gi) {
        let x = 0;
        for (var i = 0; i < gi._frameKeys.length; i++) {
            x++;
            this.downloadProgress(x);
        }
        await this.sceneLoaded(gi);
    }
    update() {
        fpsTest(this);
    }
}
function setGrid(step) {
    let grid = new PIXI.Container(1000, 700);
    grid.name = "grid";
    
    for (let x = 0; x < SceneManager.currentScene._height; x += step) {
        let hl = new GameObject(0, x, 0);
        hl.draw(drawHLine);
        hl.create(grid);
    }
    for (let y = 10; y < SceneManager.currentScene._width; y += step) {
        let vl = new GameObject(y, 0, 0);
        vl.draw(drawVLine);
        vl.create(grid);
    }
    grid.cacheAsBitmap = !grid.cacheAsBitmap;
    SceneManager.Gapp.stage.addChildAt(grid,0);
}
function destroyGrid() {
     SceneManager.currentScene.getChildByName("grid").destroy();
}
function unitsAllocated() {
    setGrid(10);
    let x = 30;
    let y = 650;
    PlayerManager.units.forEach((element) => {
        let go = new GameObject(x,y, 0.5);
        go.spriteFromCashe(element);
        go.create();
        x += go.graphics.getBounds().width+5;
    })
}
function moveTest(scene) {
    scene.children.forEach((element) => {
        element.position.x += (Math.random() * 0.02)
        element.position.y += (Math.random() * 0.02)
        element.rotation +=0.1;
    });

}
function fpsTest(scene) {
    let FPS = SceneManager.Gapp.ticker.FPS;
    if (FPS > 50) {
        for (let x = 0; x < 10; x++) {
            let go = new GameObject((Math.random() * scene.width), (Math.random() * scene.height), 0.5);
            go.spriteFromCashe('trooper.png');
            go.create();
        }
        scene.children.forEach((element) => {
            element.position.x += (Math.random() * 2)
            element.position.y += (Math.random() * 2)
            element.rotation += Math.sin(Math.random() * 25);
        });
    }
    else {
        SceneManager.Gapp.ticker.stop();
        let childcount=0;
        SceneManager.Gapp.stage.children.forEach((element) => 
            element.children.forEach((el) => childcount++)
        );
        consolelog("Stats:", childcount)
    }
}






