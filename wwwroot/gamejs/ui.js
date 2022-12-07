class UIManager {
    static setGrid(step) {
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
        SceneManager.currentScene.addChild(grid);
    }
    static destroyGrid() {
        if (SceneManager.currentScene.getChildByName("grid"))
            SceneManager.currentScene.getChildByName("grid").destroy();
    }
    static debugBox(text) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xA3EE97);
        graphics.drawRect(0, 0, 200, 100);
        graphics.endFill();
        graphics.name = "dbox";
        const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        graphics.addChild(debugtext);
        SceneManager.currentScene.addChild(graphics);
    }
    static infoBox(text) {
        const graphics = new PIXI.Graphics();
        graphics.beginFill(0x1E9ED6);
        graphics.drawRect(0, 0, 150,50);
        graphics.endFill();
        graphics.name = "ibox";
        const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        graphics.addChild(debugtext);
        SceneManager.currentScene.addChild(graphics);
    }
    static landingPanel() {
        let landingfield = new PIXI.Container(0, SceneManager.currentScene._height - 250);
        let landingarea = new GameObject(0, SceneManager.currentScene._height - 250);
        landingfield.name = "landing";
        landingarea.draw(drawSqAllocField);
        landingarea.create(landingfield);
        SceneManager.currentScene.addChild(landingfield);
    }
    static controlPanel() {
        let controlpanel = new PIXI.Container(0, SceneManager.currentScene._height - 250);
        let controlarea = new GameObject(0, SceneManager.currentScene._height - 250);
        controlpanel.name = "controlpanel";
        controlarea.draw(drawControlPanel);
        controlarea.create(controlpanel);
        SceneManager.currentScene.addChild(controlpanel);
    }
   
}