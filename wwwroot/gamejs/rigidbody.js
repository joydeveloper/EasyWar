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
        this.mass = 10;
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
        if (!this.forcevector) {
            let vx = (mass * vector.x + this.mass * this.speed) / (mass + this.mass);
            let vy = (mass * vector.y + this.mass * this.speed) / (mass + this.mass);
            let forcespeed = new Vector2(vx, vy);
            this.forcevector = Vector2.addict(this.position, forcespeed);
        } 
        else {
            this.go.graphics.transform.position.x = Vector2.lerpunclamped(this.position, this.forcevector, SceneManager.dt * this.go.velocityX).x;
            this.go.graphics.transform.position.y = Vector2.lerpunclamped(this.position, this.forcevector, SceneManager.dt * this.go.velocityY).y;
            if (Vector2.sub(this.forcevector, this.position).lenght <= 1)  {
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
        console.log("rbdeleted");
        SceneManager.Gapp.ticker.remove(this.update, this, PIXI.UPDATE_PRIORITY.NORMAL);
       
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
