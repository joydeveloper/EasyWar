class Unit extends GameObject {
    currentPosVec;
    destPosVec;
    name;
    constructor(x, y, anchor, damage, range, cooldown, velocity, armor, actions) {
        super(x, y, anchor);
        this.damage = damage;
        this.range = range;
        this.cooldown = cooldown;
        this.velocity = velocity / 10;
        this.velocityX = velocity / SceneManager._width;
        this.velocityY = velocity / SceneManager._height;
        this.armor = armor;
        this.actions = actions;
        this.rotationspeed = 0.1;
        this.mass = 10;
        this.acceleration = new Vector2();
        this.isMoving = false;
    }
    move() {
        try {
           
            let dir = Vector2.sub(this.destPosVec, this.currentPosVec);
            if (Math.floor(dir.x) != 0) {
                this.graphics.transform.position.x += SceneManager.dt * this.velocityX + this.velocity * Math.sign(dir.x);
            }
            if (Math.floor(dir.y) != 0) {
                this.graphics.transform.position.y += SceneManager.dt * this.velocityX + this.velocity * Math.sign(dir.y);
            }
            let angle = this.getangle();
            if (angle > 15)
                this.graphics.angle += angle;
            if (Math.floor(dir.lenght) < 2) {
                this.isMoving = false;
                //   console.log(this.name + " waiting");
            }
            else {
                this.isMoving = true;
                // console.log(this.name + " moving");
                console.log(dir.lenght);
            }
            this.currentPosVec = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y)
        }
        catch (e) { }
    }
    getforward() {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFFFFFF, 1);
        let c_x = this.currentPosVec.x;
        let c_y = this.currentPosVec.y;
        let r = Vector2.sub(this.destPosVec.floor, this.currentPosVec.floor).lenght;
        let x, y;
        x = r * Math.cos(0) + c_x;
        y = r * Math.sin(0) + c_y;
        graphics.moveTo(this.currentPosVec.x, this.currentPosVec.y);
        x = r * Math.cos(deg2rad * this.graphics.angle - 90) + c_x;
        y = r * Math.sin(deg2rad * this.graphics.angle - 90) + c_y;
        graphics.lineTo(x, y);
        graphics.endFill();
        //SceneManager.currentScene.addChild(graphics);
        return new Vector2(x, y);
    }
    getangle() {
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, 0xFF0000, 1);
        let dir = Vector2.sub(this.destPosVec.floor, this.currentPosVec.floor);
        let forward = this.getforward().forward(this.currentPosVec.floor);
        let angle = Vector2.angle(forward.floor.invert(), dir.floor);
        if (dir.x == 0 || dir.y == 0) {
            angle = 0;
        }
        if (Math.floor(dir.lenght) < 2)
            angle = 0;
        graphics.moveTo(this.currentPosVec.x, this.currentPosVec.y);
        graphics.lineTo(this.destPosVec.x, this.destPosVec.y);
        graphics.endFill();
        // SceneManager.currentScene.addChild(graphics);
        return Math.floor(angle);
    }
    getcollising() {
        if (this.isMoving) {
           
            this.acceleration.set(this.acceleration.x * 0.99, this.acceleration.y * 0.99);
            this.acceleration.set(Math.cos(this.getangle()) * this.velocity, Math.sin(this.getangle()) * this.velocity);
            SceneManager.game.playerManager.players[0].units.forEach((el) => {
                if (testForAABBRange(this.graphics, el.graphics) && this.graphics != el.graphics) {
                    this.isMoving = false;
                    const collisionPush = collisionResponse(el, this);
                    this.acceleration.set(
                        (collisionPush.x * el.mass),
                        (collisionPush.y * el.mass),
                    );
                    el.acceleration.set(
                        -(collisionPush.x * this.mass),
                        -(collisionPush.y * this.mass),
                    );
                    el.graphics.transform.position.x += el.acceleration.x * SceneManager.dt;
                    el.graphics.transform.position.y += el.acceleration.y * SceneManager.dt;
                    this.graphics.transform.position.x += this.acceleration.x * SceneManager.dt;
                    this.graphics.transform.position.y += this.acceleration.y * SceneManager.dt;
                }
            })
           
        }
    }
}
class UnitFactory {
    static unitid = 0;
    static upgradeGameObjToUnit(go, damage, range, cooldown, velocity, armor, actions) {
        let x = go.x;
        let y = go.y;
        let a = go.anchor;
        let gr = go.graphics;
        let unit = new Unit(x, y, a, damage, range, cooldown, velocity, armor, actions);
        unit.graphics = gr;
        unit.currentPosVec = new Vector2(x, y);
        unit.name = gr._texture['textureCacheIds'][0].replace('.png', '') + "_" + this.unitid;
        this.unitid++;
        Object.keys(go).forEach(key => {
            go[key] = null;
        });
        return unit;
    }
    static createUnit(unittype) {

    }
    

}
function collisionResponse(object1, object2) {
    if (!object1 || !object2) {
        return new Vector2();
    }
    const vCollision = Vector2.sub(object2.currentPosVec, object1.currentPosVec);
    const distance = Vector2.distance(object2.currentPosVec, object1.currentPosVec);
    const vCollisionNorm = new Vector2(
        vCollision.x / distance,
        vCollision.y / distance,
    );
    const vRelativeVelocity = new Vector2(
        object1.acceleration.x - object2.acceleration.x,
        object1.acceleration.y - object2.acceleration.y,
    );
    const speed = vRelativeVelocity.x * vCollisionNorm.x
        + vRelativeVelocity.y * vCollisionNorm.y;
    const impulse = 2* speed / (object1.mass + object2.mass);
    console.log(impulse + "|" + object1.mass + "|" + speed);
    return new Vector2(
        impulse * vCollisionNorm.x,
        impulse * vCollisionNorm.y,
    );
}
