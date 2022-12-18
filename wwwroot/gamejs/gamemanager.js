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
        texttostart.on('pointerdown', this.startGame);
        this.Gapp.stage.addChild(texttostart);
        this.Gapp.ticker = PIXI.Ticker.shared;
        this.Gapp.ticker.speed = 1;
        // this.Gapp.ticker.update((deltaMS) => this.update(deltaMS));

        this.Gapp.ticker.autoStart = false;
        this.Gapp.ticker.stop();
        const animate = ((deltaTime) => {
            this.update(deltaTime);
            this.Gapp.render(this.currentScene);
            requestAnimationFrame(animate);
        });
        animate(performance.now());
        this.Gapp.ticker.isStart = true;
        this.Gapp.ticker.start();
        this.dt = this.Gapp.ticker.deltaTime;

    }
    static changeScene(scene) {
        this.clearScene();
        this.currentScene = scene;
        this.Gapp.stage.addChild(scene);
    }
    static update(deltaTime) {
        //console.log("TimeElapsed", deltaTime/999,6);
        if (this.currentScene) {
            try {
                switch (this.game.gamestate) {
                    case this.game.gamestates[1]: {
                        this.game.playerManager.onUnitsLocate();
                        break;
                    }
                    case this.game.gamestates[3]: {
                        this.game.onProcessWar();
                        break;
                    }
                }
            }
            catch (e) { console.log(e) }
        }
    }
    static clearScene() {
        this.Gapp.stage.children.forEach((element) => this.Gapp.stage.removeChild(element));
    }
    static startGame() {
        this.game = new Game();
        this.game.startGame();
   

       // console.log(SceneManager.currentScene);
    }
    static waitForLoading(scene, x) {
        if (!scene.isLoaded) {
            setTimeout(() => { SceneManager.waitForLoading(scene, x += x); }, x);
        }
        else {
            this.game.switchState(1);
            //this.update();
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
        this.sortableChildren = false;
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
    update(func) {
        if (typeof func == 'function')
            func();
    }
}
class Game {
    gamestates = ["loading", "unitlocate", "startbattle", "warprocess", "gameover"];
    constructor() {
        this.gamestate = this.gamestates[0];
        this.i = 0;
        this.playerManager = new PlayerManager();
        // console.log(this.playerManager);
    }
    startGame() {
        const scene = new Scene(window.screen.width - 19, window.screen.height - 150, 'Assets/spriteinfo.json');
        scene.preloadScene().then(() => SceneManager.changeScene(scene));
        let x = 100;
        SceneManager.waitForLoading(scene, x);
        SceneManager.game = this;
        window.appx.games.push(this);
       
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
                this.onProcessWar();
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
        UIManager.infoBox(SceneManager.Gapp.ticker.FPS);
        UIManager.infoBox2(SceneManager.Gapp.ticker.count);
        SceneManager.game.switchState(2);
    }
    battleStart() {
      //  console.log(this.playerManager.players[0].units[0]);
   
       // console.log(x);
        this.playerManager.players[0].switchState(2);
        SceneManager.game.switchState(3);
        SceneManager.currentScene.getChildByName("landing").destroy();
        UIManager.controlPanel();
    }
    onProcessWar() {
        SceneManager.currentScene.getChildByName("ibox").children[0].text = "FPS:" + Math.floor(SceneManager.Gapp.ticker.FPS);
        SceneManager.currentScene.getChildByName("ibox").children[1].text = "Tickers:" + SceneManager.Gapp.ticker.count;
        // console.log(SceneManager.Gapp.ticker.FPS);

        //  console.log(this.playerManager.players[0]);
        try {
            this.playerManager.players[0].units.forEach((el) => {
                //console.log(el.rb);
                //console.log(el.rb.collider);
                // console.log(el.currentPosVec);

            })
            //  this.playerManager.players[0].units.forEach((el) => el.move());
            //   this.playerManager.players[0].units[0].rb.getstats();
            //  this.playerManager.players[0].units[0].rb.addforce(new Vector2(250,0),10);
            // this.playerManager.players[0].units.forEach((el) => el.getcollising());
        }
        catch (e) {
            console.log(e);
        }
    }
    checkUnitPositions() {
        this.playerManager.onUnitsLocate();
    }
    playerSetup() {
        this.playerManager.unitsSetup(this.x, this.y);
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



