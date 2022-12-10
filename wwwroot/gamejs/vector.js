class Vector2 {
    constructor(x, y) {
        this.x = x||0;
        this.y = y || 0;
        if (typeof (x) === "object") {
            this.x = x.x || 0;
            this.y = x.y || 0;
        }
    }

    get lenght() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    get right() { return new Vector2(this.y, -this.x); }
    get left() { return new Vector2(-this.y, this.x); }
    get back() { return new Vector2(-this.x, this.y); }
    get sqrLenght() { return this.x * this.x + this.y * this.y }
    get floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }
    get normalized() {
        let vec = new Vector2();
        const len = this.lenght;
        vec.x = this.x / len;
        vec.y = this.y / len;
        return vec;
    }
    invert() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    }
    forward(point) {
        return Vector2.sub(point, this);
    }
    equals(vector) {
        if (this.x == vector.x && this.y == vector.y)
            return true;
        else
            return false;
    }
 
    floorequals(vector) {
        if (Math.floor(this.x) == Math.floor(vector.x) && Math.floor(this.y) == Math.floor(vector.y))
            return true;
        else
            return false;
    }
    newSet(x, y) {
        this.x = x;
        this.y = y;
    }

    normalize() {
        const len = this.lenght;
        this.x = this.x / len;
        this.y = this.y / len;
        return this;
    }
    rotate(angle) {
        let x = this.x;
        let y = this.y;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y * Math.cos(angle);
        return this;
    }
    addict(vector) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
        return this;
    }
    sub(vector) {
        this.x = this.x - vector.x;
        this.y = this.y - vector.y;
        return this;
    }
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }
    distance(vector) {
       return new Vector2(this.x - vector.x, this.y - vector.y).lenght;
    }
    angle(vector) {
        let res= radTodeg(Math.acos(Vector2.dot(this.normalized, vector.normalized)));
        if (!isNaN(res))
            return res;
        else
            return 0;
    }
    static up() {
        return new Vector2(0, 1);
    }
    static down() {
        return new Vector2(0, -1);
    }
    static left() {
        return new Vector2(-1, 0);
    }
    static right() {
        return new Vector2(1, 0);
    }
    static zero() {
        return new Vector2(0, 0);
    }
    static dot(vectora, vectorb) {
        return vectora.x * vectorb.x + vectora.y * vectorb.y;
    }
    static sub(vectora, vectorb) {
        return new Vector2(vectora.x - vectorb.x, vectora.y - vectorb.y);
    }
    static addict(vectora, vectorb) {
        return new Vector2(vectora.x + vectorb.x, vectora.y + vectorb.y);
    }
    static distance(vectora, vectorb) {
        return new Vector2(vectora.x - vectorb.x, vectora.y - vectorb.y).lenght;
    }
    static angle(vectora, vectorb) {
        let res = radTodeg(Math.acos(Vector2.dot(vectora.normalized, vectorb.normalized)));
        if (!isNaN(res))
            return res;
        else
            return 0;
    }
    static rotate(point, angle) {
        let vec = new Vector2();
        vec.x = point.x * Math.cos(angle) - point.y * Math.sin(angle);
        vec.y = point.x * Math.sin(angle) + point.y * Math.cos(angle);
        return vec;
    }
    static lerp(vector1, vector2, t) { 
        let vec = new Vector2();
        vec.x = vector1.x + t * (vector2.x - vector1.x);
        vec.y = vector1.y + t * (vector2.y - vector1.y);
        return vec;

    }
    static lerpP(vector1, vector2, t) {
        let vec = new Vector2();
        vec.x = (1-t)*vector1.x + t * vector2.x;
        vec.y = (1 - t) * vector1.y + t * vector2.y;
        return vec;

    }
}
function radTodeg(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}
function rotateLerp(A, B, w) {
    let CS = (1 - w) * Math.cos(A) + w * Math.cos(B);
    let SN = (1 - w) * Math.sin(A) + w * Math.sin(B);
    console.log(Math.atan2(CS, SN));
    return Math.atan2(SN * deg2rad, CS * deg2rad);
}
function rotateLerpS(a, b, t) {
   
    a = a+ t * (b - a);
    b = b + t * (b - a);
    console.log(Math.atan2(a, b));
    return (a+b/2);

}
const deg2rad = (Math.PI * 2) / 360;


