export default class Character {
  constructor(level, type = 'generic') {
    this.level = level;
    this.type = type;
    this.health = 100;
        
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать этот экземпляр');
    }
  }

  static levelUp() {
    this.level += 1;
    this.attack = Math.max(this.attack, this.attack * (1.8 - this.health) / 100);
    this.defence = Math.max(this.defence, this.defence * (1.8 - this.health) / 100);
    if (this.health > 0 && this.health < 20) {
      this.health = this.health + 80;
    } else {
      this.health = 100;
    }
  }

  static damage(attackerAttack, targetDefence) {
    return Math.max(attackerAttack - targetDefence, attackerAttack * 0.1);
  }
}
