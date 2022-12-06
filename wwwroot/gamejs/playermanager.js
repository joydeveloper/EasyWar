class PlayerManager {
    static units = ["general.png", "support.png", "sniper.png", "trooper.png", "mortar.png", "moto.png", "tank.png"];
    static players = [];
    static playerSetup(playerunits) {
        this.players.push(new Player(playerunits));
    }
    static unitsSetup(x, y) {
        let units = [];
        this.units.forEach((element) => {
            let go = new GameObject(x, y, 0.5);
            go.spriteFromCashe(element);
            go.graphics.scale.set(0.5);
            units.push(go);
            x += go.graphics.getBounds().width + 25;
        })
        this.playerSetup(units);
        this.players[0].changeState(1);
    }
}


