class Unit extends GameObject {
    constructor(x, y, anchor, damage, range, cooldown, velocity, armor, actions) {
        super(x, y, anchor);
        this.damage = damage;
        this.range = range;
        this.cooldown = cooldown;
        this.velocity = velocity/10;
        this.velocityX = velocity / SceneManager._width;
        this.velocityY = velocity / SceneManager._height;
        this.armor = armor;
        this.actions = actions;
        this.rotationspeed = 0.1;
    }
    move(posvec) {
        let curpos = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y);
        let dir = Vector2.sub(posvec, curpos);
        if (Math.floor(dir.x) != 0)
        {
            this.graphics.transform.position.x += SceneManager.dt * this.velocityX + this.velocity * Math.sign(dir.x);
        }
        if (Math.floor(dir.y) != 0) {
            this.graphics.transform.position.y += SceneManager.dt * this.velocityX + this.velocity * Math.sign(dir.y);
        }
        let forward = this.getforward(curpos, posvec, this.graphics.angle - 90);
        let angle = this.getangle(curpos, posvec, forward);
        if (angle > 15)
            this.graphics.angle += angle;
        //console.log(angle);
        if (Math.floor(dir.lenght) == 0) {
          //  console.log("complete" );
           // console.log(currentunit);

        }
        else {
           // console.log("moving");
           // console.log(currentunit);
        }
    }
    getforward(cur, mpv, angle) {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFFFFFF, 1);
        let c_x = cur.x;
        let c_y = cur.y;
        let r =Vector2.sub(mpv.floor, cur.floor).lenght;
        let x, y;
        x = r * Math.cos(0) + c_x;
        y = r * Math.sin(0) + c_y;
        graphics.moveTo(cur.x, cur.y);
        x = r * Math.cos(deg2rad * angle) + c_x;
        y = r * Math.sin(deg2rad * angle) + c_y;
        graphics.lineTo(x, y);
        graphics.endFill();
        SceneManager.currentScene.addChild(graphics);
        return new Vector2(x, y);
    }
    getangle(cur, mpv, forward) {
       // setTimeout(() => alert("ничего не происходит"), 1000);
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF0000, 1);
        let dir = Vector2.sub(mpv.floor, cur.floor);
       // console.log(Math.floor(dir.lenght));
        forward = forward.forward(cur.floor);
       
        let angle = Vector2.angle(forward.floor.invert(), dir.floor);
        if (dir.x == 0 || dir.y == 0) {
            angle = 0;
        }
        if (Math.floor(dir.lenght) < 2)
            angle = 0;
        graphics.moveTo(cur.x, cur.y);
        graphics.lineTo(mpv.x, mpv.y);
        graphics.endFill();
        SceneManager.currentScene.addChild(graphics);

        return Math.floor(angle);
    }
   
}
class UnitFactory {
    static upgradeGameObjToUnit(go, damage, range, cooldown, velocity, armor, actions) {
        let x = go.x;
        let y = go.y;
        let a = go.anchor;
        let gr = go.graphics;
        let unit = new Unit(x, y, a, damage, range, cooldown, velocity, armor, actions);
        unit.graphics = gr;
        Object.keys(go).forEach(key => {
            go[key] = null;
        });
        return unit;
    }
    static createUnit(unittype) {

    }

}
