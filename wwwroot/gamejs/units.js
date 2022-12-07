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