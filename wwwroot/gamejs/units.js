class Unit extends GameObject {
    constructor(x, y, anchor, damage, range, cooldown, velocity, armor, actions) {
        super(x, y, anchor);
        this.damage = damage;
        this.range = range;
        this.cooldown = cooldown;
        this.velocity = velocity;
        this.armor = armor;
        this.actions = actions;
      
    }
   
}
class UnitFactory{
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
