class Rigidbody {
    erbtype = ["dynamic", "static"];
    eforcemode = ["force", "impusle"];
    forcevector;
    acceleration;
    collider;
    constructor(go, angularvelocity, mass) {
        this.position = go.graphics.transform.position;
        this.angle = 0;
        this.velocity = go.velocity;
        this.angularvelocity = angularvelocity;
        this.mass = 10// mass || 1;
        this.cm = new Vector2(go.graphics.getBounds().width, go.graphics.getBounds().height);
        this.inertia = this.mass * this.velocity;
        this.drag = 1;
        this.angulardrag = 0.5;
        this.isCollising = false;
        this.rbtype = this.erbtype[0];
        this.go = go;
        this.dtangle = 0;
        this.speed = 0;
        this.go.observer.subscribe(data => {
            this.delete();
        })
    }
    addforce(vector, mass) {
        (mass == "undefined" || mass == 0) ? 1 : mass;
        if (!this.forcevector) {
            let vx = (mass * vector.x + this.mass * this.speed) / (mass + this.mass);
            let vy = (mass * vector.y + this.mass * this.speed) / (mass + this.mass);
            let forcespeed = new Vector2(vx, vy);
            this.forcevector = Vector2.addict(this.position, forcespeed);
            this.go.graphics.transform.position.x = this.forcevector.x //Vector2.lerpunclamped(this.position, this.forcevector, SceneManager.dt * this.go.velocityX).x;
            this.go.graphics.transform.position.x = Vector2.lerpunclamped(this.go.graphics.transform.position, this.forcevector, SceneManager.dt * this.go.velocityX).x;
            this.go.graphics.transform.position.y = Vector2.lerpunclamped(this.go.graphics.transform.position, this.forcevector, SceneManager.dt * this.go.velocityY).y;
        }
        else {
            if (Vector2.sub(this.forcevector, this.position).lenght <= 10) {
                this.forcevector = null;
                return false;
            }
            else {
                this.go.graphics.transform.position.x = Vector2.lerpunclamped(this.go.graphics.transform.position, this.forcevector, SceneManager.dt * this.go.velocityX).x;
                this.go.graphics.transform.position.y = Vector2.lerpunclamped(this.go.graphics.transform.position, this.forcevector, SceneManager.dt * this.go.velocityY).y;
                return true;
            }
        }
    }
    getstats() {
        let rvec = Vector2.sub(this.go.graphics.transform.position, this.position).floor;
        this.speed = rvec.lenght / SceneManager.dt * speedscale;
        rvec = Vector2.sub(this.go.graphics.transform.position, this.position);
        let speed0 = rvec.lenght / SceneManager.dt * speedscale;
        this.acceleration = this.speed - speed0 / SceneManager.dt;
    }
    update() {
        // this.getstats();
        if (this.collider)
            this.collider.update();
    }
    delete() {
        if (this.collider)
            this.collider.delete();
    }

}
class Collider {
    static colliders = [];
    shapetype = ["box", "circle", "ellipse", "triangle", "line"];
    constructor(rb, colliderinfo) {
        if (rb) {
            this.position = rb.position;
            //console.log("r",rb.position)
            //console.log("t",this.position)
            this.width = rb.go.graphics.getBounds().width / 2;
            this.height = rb.go.graphics.getBounds().height;
            this.bounds = rb.go.graphics.getBounds();
            this.shapetype = "box";
            this.rb = rb;
            this.contacts = [];
        }
        else {
            this.positon = colliderinfo.position;
            this.width = colliderinfo.width;
            this.height = colliderinfo.height;
            this.shapetype = colliderinfo.type;
        }
        Collider.colliders.push(this);
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
            this.shape.drawRect(this.position.x, this.position.y, this.width, this.height);
            this.shape.endFill();
            this.shape.pivot.set(this.position.x + this.width / 2, this.position.y + this.height / 2);
           //  SceneManager.currentScene.addChild(this.shape);
        }
        return this.shape;
    }
    colliderinfo() {
        let colliderinfo = new ColliderInfo(this.width, this.height, this.shapetype)
        return colliderinfo;
    }
    update() {
        this.position = this.rb.position;
        this.bounds = this.rb.go.graphics.getBounds();
        this.shape.position.x = this.position.x;
        this.shape.position.y = this.position.y;
        this.shape.angle = this.rb.go.graphics.angle - startunitangle;
        this.oncollisonenter();
        this.oncollisonexit();
        this.oncollisonstay();
    }
    delete() {

    }
    oncollisonenter() {
        Collider.colliders.forEach((col) => {
            if (Collider.collisionAABB(this, col) && this != col) {
                col.rb.addforce(new Vector2(10, 0), 100);
                this.rb.addforce(new Vector2(-20, 0), 100);
                if (!this.contacts.includes(col)) {
                    this.contacts.push(col)
                }
            }
        });
    }
    oncollisonstay() {
        if (this.getcontactscount != 0) {
            this.contacts.forEach((con, item) => {
                Collider.colliders.forEach((col, item) => {
                    if (Collider.collisionAABB(con, col) && con != col) {
                        //  console.log("collisionstay");

                    }
                });
            });
        }
    }
    oncollisonexit() {
        if (this.getcontactscount != 0) {
            this.contacts.forEach((con, item) => {

                if (!Collider.collisionAABB(this, con) && this != con) {
                    this.contacts.splice(con, 1);

                }
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
        this.position = new Vector2(width / 2, height / 2);
        this.width = width;
        this.height = height;
        this.shapetype = shapetype;
    }
}

function collisionResponse(object1, object2) {
    if (!object1 || !object2) {
        return new Vector2();
    }
    const vCollision = Vector2.sub(object2.position, object1.position);
    const distance = Vector2.distance(object2.position, object1.position);
    const vCollisionNorm = new Vector2(
        vCollision.x / distance,
        vCollision.y / distance,
    );
    const vRelativeVelocity = new Vector2(
        object1.rb.acceleration - object2.rb.acceleration,
        object1.rb.acceleration - object2.rb.acceleration
    );
    const speed = vRelativeVelocity.x * vCollisionNorm.x
        + vRelativeVelocity.y * vCollisionNorm.y;

    const impulse = 2 * speed / (object1.mass + object2.mass);
    console.log("vc", vCollision);
    console.log("vcn", vCollisionNorm);
    console.log("vrc", vRelativeVelocity);
    //console.log(impulse + "|" + object1.mass + "|" + speed);
    return new Vector2(
        impulse * vCollisionNorm.x,
        impulse * vCollisionNorm.y,
    );
}