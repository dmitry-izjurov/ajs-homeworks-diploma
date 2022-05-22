import { getRandomUnit } from './utils';

export default class Character {
  constructor(level, type = 'generic') {
    this.level = getRandomUnit(1, level);
    this.attack = 0;
    this.defence = 0;
    this.health = 100;
    this.type = type;
    
    // TODO: throw error if user use "new Character()"
    if (new.target.name === 'Character') {
      throw new Error('Нельзя создать этот экземпляр');
    }
  }

  levelUp() {
    this.level += 1;

    this.attack = Math.max(this.attack, this.attack * (1.8 - (100 - this.health) / 100));
    this.defence = Math.max(this.defence, this.defence * (1.8 - (100 - this.health) / 100));

    if (this.health >= 20) {
      this.health = 100;
    } else {
      this.health += 80;
    }
  }
}
