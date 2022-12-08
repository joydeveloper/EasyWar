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
    get normalized() {
        const len = this.lenght;
        this.x = this.x / len;
        this.y = this.y / len;
        return this;
    }
    invert() {
        this.x = -this.x;
        this.y = -this.y;
    }

    equals(vector) {
        if (this.x == vector.x && this.y == vector.y)
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
    }
    rotate(angle) {
        let x = this.x;
        let y = this.y;
        this.x = x * Math.cos(angle) - y * Math.sin(angle);
        this.y = x * Math.sin(angle) + y* Math.cos(angle);
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
    static dot(vectora, vectorb) {
        return vectora.x * vectorb.x + vectora.y * vectorb.y;
    }
    static sub(vectora, vectorb) {
        return new Vector2(vectora.x - vectorb.x, vectora.y - vectorb.y);
    }
    static distance(vectora, vectorb) {
        return new Vector2(vectora.x - vectorb.x, vectora.y - vectorb.y).lenght;
    }
    static angle(vectora, vectorb) {
        vectora.normalize();
        vectorb.normalize();
        return radTodeg(Math.acos(Vector2.dot(vectora, vectorb)));
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
 
}
function radTodeg(radians) {
    var pi = Math.PI;
    return radians * (180 / pi);
}


