class Player {
    states = ["created", "unitsplaced", "warprocess", "gameover"];

    constructor(units) {
        this.units = units;
        this.name = name;
        //this.currentunit = null;
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
        }
    }
    fieldClick(event) {
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
    unitClick(event) {
        currentunit = Object.assign({}, event.data);
    }
    onUnitLocate() {
        this.units.forEach((element) => {
            element.graphics.interactive = true;
            element.graphics.buttonMode = true;
            element.cursor = 'grab';
            element.graphics
                .on('mousedown', this.onDragStart)
                .on('touchstart', this.onDragStart)
                .on('mouseup', this.onDragEnd)
                .on('mouseupoutside', this.onDragEnd)
                .on('touchend', this.onDragEnd)
                .on('touchendoutside', this.onDragEnd)
                .on('mousemove', this.onDragMove)
                .on('touchmove', this.onDragMove)
                .on('pointerdown', this.unitClick)
            element.create();
        });
        SceneManager.currentScene.getChildByName("battleField").on('pointerdown', this.fieldClick);
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
        if (this.data)
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
}
var currentunit = null;



