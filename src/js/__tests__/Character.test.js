import Character from '../Character';
import Bowman from '../Characters/Bowman';
import Daemon from '../Characters/Daemon';
import Magician from '../Characters/Magician';
import Swordsman from '../Characters/Swordsman';
import Undead from '../Characters/Undead';
import Vampire from '../Characters/Vampire';

test('Объект не должен создаваться', () => {
  expect(() => new Character()).toThrow();
});

test('Объект Bowman должен создаваться', () => {
  expect(new Bowman(1)).toEqual({
    level: 1, attack: 25, defence: 25, health: 100, type: 'bowman',
  });
});

test('Объект Daemon должен создаваться', () => {
  expect(new Daemon(1)).toEqual({
    level: 1, attack: 10, defence: 40, health: 100, type: 'daemon',
  });
});

test('Объект Magician должен создаваться', () => {
  expect(new Magician(1)).toEqual({
    level: 1, attack: 10, defence: 40, health: 100, type: 'magician',
  });
});

test('Объект Swordsman должен создаваться', () => {
  expect(new Swordsman(1)).toEqual({
    level: 1, attack: 40, defence: 10, health: 100, type: 'swordsman',
  });
});

test('Объект Undead должен создаваться', () => {
  expect(new Undead(1)).toEqual({
    level: 1, attack: 40, defence: 10, health: 100, type: 'undead',
  });
});

test('Объект Vampire должен создаваться', () => {
  expect(new Vampire(1)).toEqual({
    level: 1, attack: 25, defence: 25, health: 100, type: 'vampire',
  });
});
