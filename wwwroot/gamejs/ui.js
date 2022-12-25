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
        graphics.drawRect(0, 0, 150,100);
        graphics.endFill();
        graphics.name = "ibox";
        const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        graphics.addChild(debugtext);
        SceneManager.currentScene.addChild(graphics);
    }
    static infoBox2(text) {
      
        const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        debugtext.y = 25;
        SceneManager.currentScene.getChildByName("ibox").addChild(debugtext);

    }
    static infoBox3(text) {

        const debugtext = new PIXI.Text(text, new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        debugtext.y = 45;
        SceneManager.currentScene.getChildByName("ibox").addChild(debugtext);

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
        const button1 = new PIXI.Text("AddForce", new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        button1.transform.position.x = 100;
        button1.transform.position.y = SceneManager.currentScene._height - 200;
        button1.interactive = true;
        button1.buttonMode = true;
        button1.on('pointerdown', function () { SceneManager.game.playerManager.addforce(new Vector2(100,0),100) });
        const button2 = new PIXI.Text("DeleteUnit", new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        button2.transform.position.x = 300;
        button2.transform.position.y = SceneManager.currentScene._height - 200;
        button2.interactive = true;
        button2.buttonMode = true;
        button2.on('pointerdown', function () { SceneManager.game.playerManager.players[0].units[0].stop() });
        const button3 = new PIXI.Text("StopGame", new PIXI.TextStyle({ fontFamily: 'fantasy', fontSize: 20 }));
        button3.transform.position.x = 500;
        button3.transform.position.y = SceneManager.currentScene._height - 200;
        button3.interactive = true;
        button3.buttonMode = true;
        button3.on('pointerdown', function () {
            if (SceneManager.Gapp.ticker.isStart) {
                SceneManager.Gapp.ticker.stop();
                SceneManager.Gapp.ticker.isStart =false;
            }
            else {
                SceneManager.Gapp.ticker.start();
                SceneManager.Gapp.ticker.isStart = true;
            }
        });
        controlarea.draw(drawControlPanel);
        controlarea.create(controlpanel);
        controlpanel.addChild(button1);
        controlpanel.addChild(button2);
        controlpanel.addChild(button3);
        SceneManager.currentScene.addChild(controlpanel);
    }
   
}