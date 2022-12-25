//TODO posh
class Unit extends GameObject {
    currentPosVec;
    destPosVec;
    forwardvec;
    name;
    dtangle;
    dir;
    waypoints = [];
    constructor(x, y, anchor, damage, range, cooldown, velocity, armor, actions) {
        super(x, y, anchor);
        this.damage = damage;
        this.range = range;
        this.cooldown = cooldown;
        this.velocity = velocity / speedscale;
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
        SceneManager.Gapp.ticker.add(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
        this.observer = new EventObserver();
        this.sense = new UnitSense(this);
        this.wpcount = 0;
    }
    move() {
        //if (this.destPosVec) {
        //    try {
        //        this.dir = Vector2.sub(this.destPosVec, this.currentPosVec).floor;
        //        this.forwardvec = this.getforward();
        //        this.dtangle = this.getangle();
        //        if (this.dir.lenght > this.graphics.getBounds().width * 0.4 || this.dir.lenght > this.graphics.getBounds().height * 0.4) {
        //            this.isMoving = true;
        //            this.graphics.transform.position.x += Vector2.movetowards(this.destPosVec, this.currentPosVec, SceneManager.dt * this.velocity).x;
        //            this.graphics.transform.position.y += Vector2.movetowards(this.destPosVec, this.currentPosVec, SceneManager.dt * this.velocity).y;
        //            this.rotate();
        //        }
        //        else {
        //            this.isMoving = false;
        //        }
        //        this.currentPosVec = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y);
        //    }
        //    catch (e) { /* console.log(e)*/ }
        //}
        if (this.waypoints.length > 1) {
            this.dir = Vector2.sub(this.waypoints[0], this.currentPosVec).floor;
            this.destPosVec = this.waypoints[0];
            this.forwardvec = this.getforward();
            this.dtangle = this.getangle();
            // console.log(this.dir);
            //    if (this.dir.lenght > this.graphics.getBounds().width * 0.4 || this.dir.lenght > this.graphics.getBounds().height * 0.4) {
            this.isMoving = true;
            let x = Vector2.movetowards(this.waypoints[0], this.currentPosVec, SceneManager.dt * this.velocity).x;
            let y = Vector2.movetowards(this.waypoints[0], this.currentPosVec, SceneManager.dt * this.velocity).y;
          
            this.graphics.transform.position.x += x;
            this.graphics.transform.position.y += y;
            if (this.dir.lenght < 2) {
                this.waypoints.shift();
               // this.rotate();
            }
            this.currentPosVec = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y);
        }
        // this.currentPosVec = new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y);
    }
    rotate() {
        //const graphics = new PIXI.Graphics();
        //graphics.lineStyle(2, 0x00FF00, 1);
        //graphics.moveTo(this.forwardvec.x, this.forwardvec.y);
        //graphics.lineTo(this.destPosVec.x, this.destPosVec.y);
        //SceneManager.currentScene.addChild(graphics);
        if (Math.abs(this.dtangle) > this.minrotangle) {
            // console.log(this.dtangle);
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
        if (r > gabarite / 2) {
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
            // SceneManager.currentScene.addChild(graphics);
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
    getcleanforward() {
        let curangle = Math.floor(this.graphics.angle - startunitangle);
        let c_x = this.currentPosVec.x;
        let c_y = this.currentPosVec.y;
        let x, y;
        x = Math.cos(deg2rad * curangle) + c_x;
        y = Math.sin(deg2rad * curangle) + c_y;
        return new Vector2(x, y);
    }
    strafeleft() {

        let forward = this.getcleanforward();
        let fl = forward.left;
        let fc = this.currentPosVec.left;
        let res = Vector2.sub(fl, fc);
        res.normalize();
        this.graphics.transform.position.x += res.x * this.strafespeed;
        this.graphics.transform.position.y += res.y * this.strafespeed;
        // SceneManager.Gapp.ticker.stop();
        return fl;
    }
    straferight() {
        let forward = this.getcleanforward();
        let fl = forward.right;
        let fc = this.currentPosVec.right;
        let res = Vector2.sub(fl, fc);
        res.normalize();
        this.graphics.transform.position.x += res.x * this.strafespeed;
        this.graphics.transform.position.y += res.y * this.strafespeed;
        // SceneManager.Gapp.ticker.stop();
        return fl;
    }
    pushforward() {
        let vec = Vector2.movetowards(this.getforward(), this.currentPosVec, this.fjumpspeed);
        this.graphics.transform.position.x += vec.x;
        this.graphics.transform.position.y += vec.y;
        //  SceneManager.Gapp.ticker.stop();
    }
    stop() {
        this.destPosVec = null;
        this.isMoving = false;
    }
    update() {
        // console.log("unit", new Vector2(this.graphics.transform.position.x, this.graphics.transform.position.y).floor);
        this.move();
        if (this.rb)
            this.rb.update();
        if (this.rb.collider)
            this.rb.collider.update();
        //if (this.sense)
        //    this.sense.update();
    }
    delete() {
        super.delete();
        this.observer.broadcast({ someData: this })
        SceneManager.Gapp.ticker.remove(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
        console.log(SceneManager.Gapp.ticker.count);
        // console.log("removed");
    }
}
class UnitSense {
    constructor(unit) {
        //console.log(unit);
        this.unit = unit;
        this.path = [];
        this.isPathFinding = false;
    }
    findpath() {
        this.width = this.unit.graphics.getBounds().width;
        this.height = this.unit.graphics.getBounds().height;
        let startcell = new Cell(this.unit.currentPosVec.x, this.unit.currentPosVec.y, this.width, this.height);
        let cellpath = new CellPath(startcell, this.unit.destPosVec);
        cellpath.findpath();




    }
    overlook() {

    }
    update() {
        this.position = this.unit.graphics.transform.position;
        this.findpath();
    }
}
class Cell {
    constructor(x, y, width, height) {
        this.position = new Vector2(x, y);
        this.width = width;
        this.height = height;
    }
}
class CellPath {
    constructor(startcell, endpoint) {
        this.startcell = startcell;
        this.endpoint = endpoint;
        this.cells = [];
        //  this.position
    }
    getstartvalue(cell) {
        let res;
        Collider.colliders.forEach((col1) => {
            if (col1.bounds.x < cell.position.x + cell.width
                && col1.bounds.x + col1.width > cell.position.x
                && col1.bounds.y < cell.position.y + cell.height
                && col1.bounds.y + col1.height > cell.position.y)// && (col1.position.x != this.startcell.position.x && col1.position.y != this.startcell.position.y))
                res = NaN;
            else
                res = Vector2.distance(cell.position, this.startcell.position);
        });
        return res;
    }
    getpathvalue(cell) {
        return Vector2.distance(this.endpoint, cell.position);
    }
    getweightvalue(cell) {
        if (!isNaN(this.getstartvalue(cell)))
            return (this.getstartvalue(cell) + this.getpathvalue(cell));
    }
    findpath() {
        while (Vector2.distance(this.endpoint, this.startcell.position) > this.startcell.width) {
            let width = this.startcell.width;
            let height = this.startcell.height;
            let x = this.startcell.position.x;
            let y = this.startcell.position.y;
            let values = [];
            let rawcells = [
                new Cell(x - width, y - height, width, height),
                new Cell(x, y - height, width, height),
                new Cell(x + width, y - height, width, height),
                new Cell(x + width, y, width, height),
                new Cell(x + width, y + height, width, height),
                new Cell(x, y + height, width, height),
                new Cell(x - width, y + height, width, height),
                new Cell(x - width, y, width, height),
            ];
            rawcells.forEach((cell) => {
                if (!isNaN(this.getstartvalue(cell)))
                    values.push(this.getweightvalue(cell));
            })
            if (values.length != 0) {
                let idx = values.indexOf(Math.min(...values));
                this.startcell = rawcells[idx];
                if (this.cells.length == 0)
                    this.cells.push(this.startcell);
                else if ((this.cells[this.cells.length - 1].position.x != this.startcell.position.x && this.cells[this.cells.length - 1].position.y != this.startcell.position.y)) {// || (this.cells[this.cells.length - 1].position.x != this.startcell.position.x && this.cells[this.cells.length - 1].position.y == this.startcell.position.y)) {
                    this.cells.push(this.startcell);
                }
                // CellPath.drawcell(this.startcell);
            }
            else {
                break;
            }

        }
        return true;

    }


    drawpath() {
        if (this.shape == null) {
            this.shape = new PIXI.Graphics();
            this.shape.beginFill(0xFFFF00);
            this.shape.drawRect(this.startcell.position.x, this.startcell.position.y, this.startcell.width, this.startcell.height);
            this.shape.endFill();
            this.shape.pivot.set(this.startcell.position.x + this.startcell.width / 2, this.startcell.position.y + this.startcell.height / 2);
            this.shape.position.x = this.startcell.position.x;
            this.shape.position.y = this.startcell.position.y;
            SceneManager.currentScene.addChild(this.shape);
        }
        //  console.log(this.shape);
        return this.shape;
    }
    static drawcell(cell) {
        let g = new PIXI.Graphics();
        g.beginFill(0x00D678);
        g.drawRect(cell.position.x, cell.position.y, cell.width, cell.height);
        g.endFill();
        g.pivot.set(cell.position.x + cell.width / 2, cell.position.y + cell.height / 2);
        g.position.x = cell.position.x;
        g.position.y = cell.position.y;
        SceneManager.currentScene.addChild(g);
    }
}



class UnitPersonalSpace {

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
//function collisionResponse(object1, object2) {
//    if (!object1 || !object2) {
//        return new Vector2();
//    }
//    const vCollision = Vector2.sub(object2.currentPosVec, object1.currentPosVec);
//    const distance = Vector2.distance(object2.currentPosVec, object1.currentPosVec);
//    const vCollisionNorm = new Vector2(
//        vCollision.x / distance,
//        vCollision.y / distance,
//    );
//    const vRelativeVelocity = new Vector2(
//        object1.acceleration.x - object2.acceleration.x,
//        object1.acceleration.y - object2.acceleration.y,
//    );
//    const speed = vRelativeVelocity.x * vCollisionNorm.x
//        + vRelativeVelocity.y * vCollisionNorm.y;
//    const impulse = 2 * speed / (object1.mass + object2.mass);
//    //console.log(impulse + "|" + object1.mass + "|" + speed);
//    return new Vector2(
//        impulse * vCollisionNorm.x,
//        impulse * vCollisionNorm.y,
//    );
//}
var test = 0;
function wherepoint(vectora, vectorb, point) {
    s = (vectorb.x - vectora.x) * (point.y - vectora.y) - (vectorb.y - vectora.y) * (point.x - vectora.x)
    return s;

}