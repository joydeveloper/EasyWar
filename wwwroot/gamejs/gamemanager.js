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
    static waitForLoading(scene, x) {
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
        //console.log(currentunit);
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
    grid.interactive = true;
    grid.on('pointerdown', gridClick);
    grid.cacheAsBitmap = !grid.cacheAsBitmap;
    SceneManager.Gapp.stage.addChildAt(grid, 0);
 
}
function destroyGrid() {
    SceneManager.Gapp.stage.getChildByName("grid").destroy();

}
function unitsAllocated() {
    setGrid(10);
    let x = SceneManager.currentScene._width / 2 - 200;
    let y = SceneManager.currentScene._height - 250;
    let greenfield = new GameObject(0, 550);
    greenfield.draw(drawSqAllocField);
    greenfield.create();
    PlayerManager.units.forEach((element) => {
        let go = new GameObject(x, y, 0.5);
        go.spriteFromCashe(element);
        go.graphics.scale.set(0.5);
        go.graphics.interactive = true;
        go.graphics.buttonMode = true;
        go.cursor = 'grab';
        go.graphics
            .on('mousedown', onDragStart)
            .on('touchstart', onDragStart)
            .on('mouseup', onDragEnd)
            .on('mouseupoutside', onDragEnd)
            .on('touchend', onDragEnd)
            .on('touchendoutside', onDragEnd)
            .on('mousemove', onDragMove)
            .on('touchmove', onDragMove)
            .on('pointerdown', unitClick);
        go.create();
        x += go.graphics.getBounds().width + 25;
    })
}
function debugbox(text) {
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xA3EE97);
    graphics.drawRect(0, 0, 200, 100);
    graphics.endFill();
    graphics.name = "dbox";
    const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
    graphics.addChild(debugtext);
    SceneManager.currentScene.addChild(graphics);
}
 var currentunit = null;
function unitClick(event) {
   currentunit= Object.assign({} , event.data);
}
function gridClick(event) { 
    if (currentunit) {
        currentunit.target.transform.position.x = event.global.x;
        currentunit.target.transform.position.y = event.global.y;
        if (currentunit.target.transform.position.y < 495 + currentunit.target.getBounds().height) {
            currentunit.target.transform.scale.set(0.5);
            currentunit.target.transform.rotation = -55;
        }
        else {
            currentunit.target.transform.rotation = 0;
        }
    }
    currentunit = null;
}
function onDragStart(event) {
    this.data = event.data;
    if (this.data.currentTarget.getBounds().width < 60 || this.data.currentTarget.getBounds().height < 60) {
        this.data.currentTarget.transform.scale.set(1);
    }
    this.alpha = 0.6;
    this.dragging = true;
}

function onDragMove(event) {
    if (this.dragging && event.global.x > this.data.currentTarget.getBounds().width / 2 && event.global.x < SceneManager.currentScene._width - this.data.currentTarget.getBounds().width / 2 && event.global.y > this.data.currentTarget.getBounds().height / 2 && event.global.y < SceneManager.currentScene._height) {
        this.data.target.transform.position.x = event.global.x;
        this.data.target.transform.position.y = event.global.y;
    }
}
function onDragEnd() {
   if(this.data)
    if (this.data.target.transform.position.y < 495 + this.data.currentTarget.getBounds().height) {
        this.transform.scale.set(0.5);
        this.transform.rotation = -55;
    }
    else {
        this.transform.scale.set(0.5);
        this.transform.rotation = 0;
    }

    this.alpha = 1;
    this.dragging = false;
    this.data = null;
}
function check() {
    console.log("check");
}
function moveTest(scene) {
    scene.children.forEach((element) => {
        element.position.x += (Math.random() * 0.02)
        element.position.y += (Math.random() * 0.02)
        element.rotation += 0.1;
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
        let childcount = 0;
        SceneManager.Gapp.stage.children.forEach((element) =>
            element.children.forEach((el) => childcount++)
        );
        consolelog("Stats:", childcount)
    }
}

