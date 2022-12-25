class PlayerManager {
    cx;
    constructor() {
        this.players = [];
        this.rotate = this.rotate.bind(this);
        this.confun = this.confun.bind(this);
    }
    static units = ["general.png", "support.png"]//, "sniper.png", "trooper.png"]//, "mortar.png", "moto.png", "tank.png"];
    static scalefactor = 0.5;
    playerSetup(playerunits) {
        this.players.push(new Player(playerunits));
    }
    addplayer(player) {
        this.players.push(player);
    }
    unitsSetup(x, y) {
        let units = [];
        PlayerManager.units.forEach((element) => {
            let go = new GameObject(x, y, 0.5);
            go.spriteFromCashe(element);
            go.graphics.scale.set(PlayerManager.scalefactor);
            units.push(go);
            x += go.graphics.getBounds().width + 25;
        })
        this.playerSetup(units);
        this.players[0].switchState(1);
    }
    onUnitsLocate() {
      
        const texttostart = new PIXI.Text('Start battle', new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 50 }));
        texttostart.y = SceneManager.currentScene.getChildByName("landing").getBounds().y;
        if (this.players[0].checkLocations()) {
            if (SceneManager.currentScene.getChildByName("landing").children.length <= 1) {
                SceneManager.currentScene.getChildByName("landing").addChild(texttostart);
                texttostart.interactive = true;
                texttostart.on('pointerdown', SceneManager.game.onBattleStart);
            }
        }
        else {
            if (SceneManager.currentScene.getChildByName("landing").children.length == 2) {
                SceneManager.currentScene.getChildByName("landing").removeChildAt(1);
            }
        }

    }
    rotate(angle) {
        SceneManager.Gapp.ticker.start();
        this.players[0].units[0].graphics.angle += angle;
    }
    addforce(vector, mass) {
        this.cx = () => this.confun(vector, mass);
        SceneManager.Gapp.ticker.add(this.cx, this, PIXI.UPDATE_PRIORITY.NORMAL);
    }
    confun(vector, mass) {
       let x= this.players[0].units[0].rb.addforce(vector, mass);
        if (!x) {
            SceneManager.Gapp.ticker.remove(this.cx,this);
        }
    }
}



