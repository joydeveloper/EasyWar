class Player {
    states = ["created", "unitsplaced", "warprocess", "gameover"];

    constructor(units) {
        this.units = units;
        this.name = name;
        this.state = this.states[0];
    }
    changeState(state) {
        this.state = this.states[state];
        this.checkState();
    }
    checkState() {
        switch (this.state) {
            case this.states[1]: {
                this.onUnitLocate();
                break;
            }
            case this.states[2]: {
                this.onStartBattle();
                break;
            }
        }
    }
    fieldLocClick(event) {
        if (currentunit) {
            currentunit.target.transform.position.x = event.global.x;
            currentunit.target.transform.position.y = event.global.y;
            if (currentunit.target.transform.position.y < 495 + currentunit.target.getBounds().height) {
                currentunit.target.transform.scale.set(0.5);
                currentunit.target.transform.rotation =-55;
            }
            else {
                currentunit.target.transform.rotation = 0;
            }
        }
        SceneManager.currentScene.getChildByName("battleField").interactive = false;
    }
    unitClick(event) {
        currentunit = Object.assign({}, event.data);
        SceneManager.currentScene.getChildByName("battleField").interactive = true;
    }
    fieldBattleClick(event) {
        if (currentunit) {
            let cur = new PIXI.Point(currentunit.target.transform.position.x, currentunit.target.transform.position.y);
            let move = new PIXI.Point(event.global.x, event.global.y);
            console.log(cur);
            console.log(move);
        }
        console.log("blc");
    }

    unitBattleClick(event) {
        currentunit = Object.assign({}, event.data);
        ceneManager.currentScene.getChildByName("battleField").interactive = true;
        console.log("ubc");

    }
    onUnitLocate() {
        this.units.forEach((element) => {
            element.graphics.interactive = true;
            element.graphics.buttonMode = true;
            element.cursor = 'grab';
            this.addEventListnersOnLocate(element.graphics);
            element.create();
        });
        SceneManager.currentScene.getChildByName("battleField").on('pointerdown', this.fieldLocClick);
    }
    addEventListnersOnBattle(element) {
        this.element = element;
        this.element
            .on('pointerdown', this.unitBattleClick);
    }
    onStartBattle() {
        this.removeEventListnerOnLocate();
        SceneManager.currentScene.getChildByName("battleField").off('pointerdown', this.fieldLocClick);
        SceneManager.currentScene.getChildByName("battleField").on('pointerdown', this.fieldBattleClick);
        this.upgradeToBattleUnits();
        currentunit = null;
    }
    upgradeToBattleUnits() {
        const actions = ["Move", "Atack", "Hide", "Hold"];
        this.units.forEach((el) => {
            this.units.push(UnitFactory.upgradeGameObjToUnit(el, 1, 1, 1, 1, 1, actions));
            this.units.shift();
        })
        this.units.forEach((element) => {
            element.cursor = 'copy';
            this.addEventListnersOnBattle(element.graphics);
        })
    }
    addEventListnersOnLocate(element) {
        this.element = element;
        this.element
            .on('mousedown', this.onDragStart)
            .on('touchstart', this.onDragStart)
            .on('mouseup', this.onDragEnd)
            .on('mouseupoutside', this.onDragEnd)
            .on('touchend', this.onDragEnd)
            .on('touchendoutside', this.onDragEnd)
            .on('mousemove', this.onDragMove)
            .on('touchmove', this.onDragMove)
            .on('pointerdown', this.unitClick)
    }
    removeEventListnerOnLocate() {
        this.element
            .off('mousedown', this.onDragStart)
            .off('touchstart', this.onDragStart)
            .off('mouseup', this.onDragEnd)
            .off('mouseupoutside', this.onDragEnd)
            .off('touchend', this.onDragEnd)
            .off('touchendoutside', this.onDragEnd)
            .off('mousemove', this.onDragMove)
            .off('touchmove', this.onDragMove)
            .off('pointerdown', this.unitClick);
        currentunit = null;
    }
    onDragStart(event) {
        this.data = event.data;
        if (this.data.currentTarget.getBounds().width < 60 || this.data.currentTarget.getBounds().height < 60) {
            this.data.currentTarget.transform.scale.set(1);
        }
        this.alpha = 0.6;
        this.dragging = true;
    }
    onDragMove(event) {
        if (this.dragging && event.global.x > this.data.currentTarget.getBounds().width / 2 && event.global.x < SceneManager.currentScene._width - this.data.currentTarget.getBounds().width / 2 && event.global.y > this.data.currentTarget.getBounds().height / 2 && event.global.y < SceneManager.currentScene._height) {
            this.data.target.transform.position.x = event.global.x;
            this.data.target.transform.position.y = event.global.y;
        }
    }
    onDragEnd() {
        if (this.data) {
            try {
                if (this.data.target.transform.position.y < 500+ this.data.currentTarget.getBounds().height) {
                    this.transform.scale.set(0.5);
                    this.transform.rotation = -55;
                    PlayerManager.players[0].units.forEach((el) => {
                        if (testForAABB(this.data.target, el.graphics) && this.data.target != el.graphics) {
                            this.dragging = false;
                            this.data = null;
                        }
                    });
                } else {
                    this.transform.scale.set(0.5);
                    this.transform.rotation = 0;
               
                }
            } catch (err) { this.transform.scale.set(0.5);  }
        }
       
        this.alpha = 1;
        this.dragging = false;
        this.data = null;
    }
    checkLocations() {
        let x = 0;
        for (let i = 0; i < PlayerManager.players[0].units.length; i++) {
            if (PlayerManager.players[0].units[i].graphics.alpha == 1 && PlayerManager.players[0].units[i].graphics.transform.rotation == -55) {
                x++;
            }
        }
        if (x == PlayerManager.players[0].units.length)
            return true
        else
            return false;
    }
}
var currentunit = null;



