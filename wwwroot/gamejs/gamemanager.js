class SceneManager {

    constructor() { }
    static Gapp;
    static currentScene;
    static _width;
    static _height;
    static game;
  
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
        this.dt = this.Gapp.ticker.deltaTime;
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
        this.game = new Game();
        this.game.startGame();
    }
    static waitForLoading(scene, x) {
        if (!scene.isLoaded) {
            setTimeout(() => { SceneManager.waitForLoading(scene, x += x); }, x);
        }
        else {

            this.game.switchState(1);
            scene.setUpdateFunction(PlayerManager.onUnitsLocate);
            this.update();
        }
    }
    static fpsTest() {
        let FPS = SceneManager.Gapp.ticker.FPS;
        if (FPS > 50) {
            for (let x = 0; x < 10; x++) {
                let go = new GameObject((Math.random() * SceneManager.currentScene.width), (Math.random() * SceneManager.currentScene.height), 0.5);
                go.spriteFromCashe('trooper.png');
                go.create();
            }
            SceneManager.currentScene.children.forEach((element) => {
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
}
class Scene extends PIXI.Container {
    func;
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
    setUpdateFunction(func) {
        this.func = func;
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
        if (typeof this.func == 'function')
            this.func();
    }
}
class Game {
    gamestates = ["loading", "unitlocate", "startbattle", "warprocess", "gameover"];
    constructor() {
        this.gamestate = this.gamestates[0];
        this.i = 0;
    }
    startGame() {
        const scene = new Scene(window.screen.width - 19, window.screen.height - 150, 'Assets/spriteinfo.json');
        scene.preloadScene().then(() => SceneManager.changeScene(scene));
        let x = 100;
        SceneManager.waitForLoading(scene, x);
        SceneManager.game = this;
    }
    checkState() {
        switch (this.gamestate) {
            case this.gamestates[1]: {
                this.onUnitsLocate();
                break;
            }
            case this.gamestates[2]: {
                this.battleStart();
                break;
            }
            case this.gamestates[3]: {
                this.processWar();
                break;
            }
        }
    }
    switchState(state) {
        this.gamestate = this.gamestates[state];
        this.checkState();
    }
    onUnitsLocate() {
        this.x = 200;
        this.y = SceneManager.currentScene._height - 200;
        this.battlFieldSetup();
        this.uiSetup();
        this.unitLandingSetup();
        this.playerSetup();
       
    }
    onBattleStart() {
        UIManager.infoBox("War in process");
        SceneManager.game.switchState(2);

    }
    battleStart() {
        PlayerManager.players[0].changeState(2);
        SceneManager.game.switchState(3);
        SceneManager.currentScene.getChildByName("landing").destroy();
        UIManager.controlPanel();
        // console.log(PlayerManager.players[0].units);

    }
    onProcessWar() {
       // console.log(SceneManager.Gapp.ticker.FPS);
        try {
            if (currentunit) {
               currentunit.move(currentunit.curdest);
            }
        }
        catch (e) {

        }
    }
    processWar() {
        SceneManager.currentScene.setUpdateFunction(this.onProcessWar);
  
    }
    playerSetup() {
        PlayerManager.unitsSetup(this.x, this.y);
    }
    uiSetup() {
        UIManager.setGrid(10);
    }
    battlFieldSetup() {
        let battlefield = new GameObject(0, 0);
        battlefield.draw(drawBattleField);
        battlefield.graphics.name = "battleField";
        battlefield.create(SceneManager.currentScene);
    }
    unitLandingSetup() {
        UIManager.landingPanel();
    }
}



