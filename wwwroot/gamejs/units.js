class Unit extends GameObject {
    currentPosVec;
    destPosVec;
    forwardvec;
    name;
    dtangle;
    dir;
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
        this.minrotangle = 10;
        this.strafespeed = 33;
        this.fjumpspeed = 30;

    }
    move() {
        try {
            this.dir = Vector2.sub(this.destPosVec, this.currentPosVec).floor;
            this.forwardvec = this.getforward();
            this.dtangle = this.getangle();
            if (this.dir.lenght > this.graphics.getBounds().width*0.4 || this.dir.lenght > this.graphics.getBounds().height*0.4) {
                this.isMoving = true;
                this.graphics.transform.position.x += Vector2.movetowards(this.destPosVec, this.currentPosVec, SceneManager.dt * this.velocity).x;
                this.graphics.transform.position.y += Vector2.movetowards(this.destPosVec, this.currentPosVec, SceneManager.dt * this.velocity).y;
                this.rotate();
            }
            else {
                this.isMoving = false;
               // SceneManager.Gapp.ticker.stop();
            }

            this.currentPosVec = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y);
            // SceneManager.Gapp.ticker.stop();
        }
        catch (e) { console.log(e) }
    }
    rotate() {
        //const graphics = new PIXI.Graphics();
        //graphics.lineStyle(2, 0x00FF00, 1);
        //graphics.moveTo(this.forwardvec.x, this.forwardvec.y);
        //graphics.lineTo(this.destPosVec.x, this.destPosVec.y);
        //SceneManager.currentScene.addChild(graphics);
        if (Math.abs(this.dtangle) > this.minrotangle) {
            console.log(this.dtangle);
            let sign = Math.sign(wherepoint(this.currentPosVec, this.forwardvec, this.destPosVec));
            this.graphics.angle += Math.floor(this.dtangle * sign);
            if (this.graphics.angle >= 360 || this.graphics.angle <= -360) {
                this.graphics.angle = Math.floor(this.graphics.angle / 360);
            }
        }
    }
    getforward() {
        let r = Vector2.sub(this.destPosVec.floor, this.currentPosVec.floor).lenght;
        let curangle = Math.floor(this.graphics.angle - 90);
        //console.log("cur", curangle);
        //console.log("r", r);
        let gabarite = getCenter(this.graphics.getBounds().width, this.graphics.getBounds().height).lenght;
        if (r > gabarite/2) {
            const graphics = new PIXI.Graphics();
            graphics.lineStyle(2, 0xFFFFFF, 1);
            let c_x = this.currentPosVec.x;
            let c_y = this.currentPosVec.y;
            let x, y;
            graphics.moveTo(this.currentPosVec.x, this.currentPosVec.y);
            x = r * Math.cos(deg2rad * curangle) + c_x;
            y = r * Math.sin(deg2rad * curangle) + c_y;
            graphics.lineTo(x, y);
            graphics.endFill();
            //SceneManager.currentScene.addChild(graphics);
            //SceneManager.Gapp.ticker.stop();
            return new Vector2(x, y);
        }
        else {
            return new Vector2();
        }

    }
    getangle() {
        //const graphics = new PIXI.Graphics();
        //graphics.lineStyle(2, 0xFF0000, 1);
        let angle = Vector2.angle(this.forwardvec.forward(this.currentPosVec).floor, this.dir.floor);
        //graphics.moveTo(this.currentPosVec.x, this.currentPosVec.y);
        //graphics.lineTo(this.destPosVec.x, this.destPosVec.y);
        //graphics.endFill();
        // SceneManager.currentScene.addChild(graphics);
        return 180 - angle;
    }
    strafeleft() {
        let forward = this.getforward();
        let fl = forward.left;
        let fc = this.currentPosVec.left;
        let res = Vector2.sub(fl, fc);
        res.normalize();
        this.graphics.transform.position.x += res.x * this.strafespeed;
        this.graphics.transform.position.y += res.y * this.strafespeed;
        SceneManager.Gapp.ticker.stop();
        return fl;
    }
    straferight() {
        let forward = this.getforward();
        let fl = forward.right;
        let fc = this.currentPosVec.right;
        let res = Vector2.sub(fl, fc);
        res.normalize();
        this.graphics.transform.position.x += res.x * this.strafespeed;
        this.graphics.transform.position.y += res.y * this.strafespeed;
        SceneManager.Gapp.ticker.stop();
        return fl;
    }
    pushforward() {
        let vec = Vector2.movetowards(this.getforward(), this.currentPosVec, this.fjumpspeed);
        this.graphics.transform.position.x += vec.x;
        this.graphics.transform.position.y += vec.y;
        SceneManager.Gapp.ticker.stop();
    }
    stop() {
        this.destPosVec = null;
        this.isMoving = false;
    }

    getcollising() {
        if (this.isMoving) {
            this.acceleration.set(this.acceleration.x * 0.99, this.acceleration.y * 0.99);
            this.acceleration.set(Math.cos(this.dtangle) * this.velocity, Math.sin(this.dtangle) * this.velocity);
            SceneManager.game.playerManager.players[0].units.forEach((el) => {
                if (testForAABBRange(this.graphics, el.graphics) && this.graphics != el.graphics) {
                    this.isMoving = false;
                    this.strafeleft();
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
    const impulse = 2 * speed / (object1.mass + object2.mass);
    //console.log(impulse + "|" + object1.mass + "|" + speed);
    return new Vector2(
        impulse * vCollisionNorm.x,
        impulse * vCollisionNorm.y,
    );
}
var test = 0;
function wherepoint(vectora, vectorb, point) {
    s = (vectorb.x - vectora.x) * (point.y - vectora.y) - (vectorb.y - vectora.y) * (point.x - vectora.x)
    return s;

}