class Rigidbody {
    erbtype = ["dynamic", "static"];
    eforcemode = ["force", "impusle"];
    forcevector;
    acceleration;
    constructor(go, angularvelocity, mass) {
        this.position = new Vector2(go.graphics.transform.position);
        this.angle = 0;
        this.velocity = go.velocity;
        this.angularvelocity = angularvelocity;
        this.mass = mass || 1;
        this.cm = new Vector2(go.graphics.getBounds().width, go.graphics.getBounds().height);
        this.inertia = this.mass * this.velocity;
        this.drag = 1;
        this.angulardrag = 0.5;
        this.isCollising = false;
        this.rbtype = this.erbtype[0];
        this.go = go;
        this.dtangle = 0;
        this.speed = 0;
        SceneManager.Gapp.ticker.add(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
        this.go.observer.subscribe(data => {
            this.delete();
        })
    }
    addforce(vector, mass) {
        console.log("forced");
        (mass == "undefined" || mass == 0) ? 1 : mass;
        if (!this.forcevector) {
            let vx = (mass * vector.x + this.mass * this.speed) / (mass + this.mass);
            let vy = (mass * vector.y + this.mass * this.speed) / (mass + this.mass);
            let forcespeed = new Vector2(vx, vy);
            this.forcevector = Vector2.addict(this.position, forcespeed);
        }
        else {
            this.go.graphics.transform.position.x = Vector2.lerpunclamped(this.position, this.forcevector, SceneManager.dt * this.go.velocityX).x;
            this.go.graphics.transform.position.y = Vector2.lerpunclamped(this.position, this.forcevector, SceneManager.dt * this.go.velocityY).y;
            if (Vector2.sub(this.forcevector, this.position).lenght <= 10) {
                this.forcevector = null;
                return false;
            }
            else {
                return true;
            }
        }
    }
    getstats() {
        let rvec = Vector2.sub(this.go.graphics.transform.position, this.position);
        this.speed = rvec.lenght / SceneManager.dt * speedscale;
        this.position = new Vector2(this.go.graphics.transform.position);
        let speed0 = rvec.lenght / SceneManager.dt * speedscale;
        this.acceleration = this.speed - speed0 / SceneManager.dt;
    }
    update() {
        this.getstats();
    }
    delete() {
        SceneManager.Gapp.ticker.remove(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
    }

}
class Collider {
    static colliders = [];
    shapetype = ["box", "circle", "ellipse", "triangle", "line"];
    constructor(go, colliderinfo) {
        if (go) {
            this.x = go.graphics.transform.position.x;
            this.y = go.graphics.transform.position.y;
            this.width = go.graphics.getBounds().width/2;
            this.height = go.graphics.getBounds().height;
            this.bounds = go.graphics.getBounds();
            this.shapetype = "box";
            this.go = go;
            this.contacts = [];
        }
        else {
            this.x = colliderinfo.x;
            this.y = colliderinfo.y;
            this.width = colliderinfo.width;
            this.height = colliderinfo.height;
            this.shapetype = colliderinfo.type;
        }

        Collider.colliders.push(this);
        SceneManager.Gapp.ticker.add(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
    }
    get getcontactscount() { return this.contacts.length; }
    get getcontacts() { return this.contacts }
    shapecast(type) {
        switch (type) {
            case this.shape[0]: {

                break;
            }
            case this.shape[1]: {

                break;
            }
            case this.shape[2]: {

                break;
            }
            case this.shape[3]: {

                break;
            }
            case this.shape[4]: {

                break;
            }
        }
    }
    calculatebounds() {

    }
    drawcollider() {
        if (this.shape == null) {
            this.shape = new PIXI.Graphics();
            this.shape.beginFill(0xDC143C);
            console.log(this.shape.rotation);
            this.shape.drawRect(this.x, this.y, this.width , this.height);
            this.shape.endFill();
            this.shape.pivot.set(this.x + this.width/2, this.y+this.height/2);
            SceneManager.currentScene.addChild(this.shape);


        }
        return this.shape;
    }
    colliderinfo() {
        let colliderinfo = new ColliderInfo(this.width, this.height, this.shapetype)
        return colliderinfo;
    }
    update() {
        this.shape.position.x = this.go.graphics.transform.position.x;
        this.shape.position.y = this.go.graphics.transform.position.y ;
        this.shape.angle = this.go.graphics.angle - startunitangle;
        this.oncollisonenter();
        this.oncollisonexit();
        this.oncollisonstay();
    }
    oncollisonenter() {
        Collider.colliders.forEach((col) => {
            if (Collider.collisionAABB(this, col) && this != col) {
                if (!this.contacts.includes(col)) {
                    this.contacts.push(col)
                    console.log("collisionenter");
                }
            }
        });
    }
    oncollisonexit() {
        this.contacts.forEach((con) => {
            if (!Collider.collisionAABB(this, con) && this != con) {
                this.contacts.splice(con, 1);
                console.log("exit");
            }
        });
    }
    oncollisonstay() {
        if (this.getcontactscount != 0) {
            this.contacts.forEach((con) => {
                Collider.colliders.forEach((col) => {
                    if (Collider.collisionAABB(con, col) && con != col) {
                            console.log("collisionstay");
                    }
                });
            });
        }
    }
    static collisionAABB(col1, col2) {
        return col1.bounds.x < col2.bounds.x + col2.width
            && col1.bounds.x + col1.width > col2.bounds.x
            && col1.bounds.y < col2.bounds.y + col2.height
            && col1.bounds.y + col1.height > col2.bounds.y;
    }
}
class ColliderInfo {
    constructor(width, height, shapetype) {
        this.x = width / 2;
        this.y = height / 2;
        this.width = width;
        this.height = height;
        this.shapetype = shapetype;
    }
}
//function testForAABB(object1, object2) {
//    const bounds1 = object1.getBounds();
//    const bounds2 = object2.getBounds();
//    return bounds1.x < bounds2.x + bounds2.width
//        && bounds1.x + bounds1.width > bounds2.x
//        && bounds1.y < bounds2.y + bounds2.height
//        && bounds1.y + bounds1.height > bounds2.y;
//}
//function testForAABBRange(object1, object2, range) {
//    if (range === undefined)
//        range = 0;
//    const bounds1 = object1.getBounds();
//    const bounds2 = object2.getBounds();
//    return bounds1.x < bounds2.x + bounds2.width+range
//        && bounds1.x + bounds1.width+range > bounds2.x
//        && bounds1.y < bounds2.y + bounds2.height+range
//        && bounds1.y + bounds1.height+range > bounds2.y;
//}
