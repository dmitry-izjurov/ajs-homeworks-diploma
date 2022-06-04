import {getAttackUnit} from '../utils';

test('Юнит Swordsman должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitSwordsman = getAttackUnit(typeCharacter[0], 0);

  expect(attackUnitSwordsman).toEqual([1, 8, 9]);
});

test('Юнит Undead должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitUndead = getAttackUnit(typeCharacter[1], 15);

  expect(attackUnitUndead).toEqual([7, 23, 14, 6, 22]);
});

test('Юнит Bowman должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitBowman = getAttackUnit(typeCharacter[2], 17);

  expect(attackUnitBowman).toEqual([18, 19, 9, 10, 11, 1, 2, 3, 25, 26, 27, 33, 34, 35, 16, 8, 0, 24, 32]);
});

test('Юнит Vampire должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitVampire = getAttackUnit(typeCharacter[3], 36);

  expect(attackUnitVampire).toEqual([37, 38, 28, 29, 30, 20, 21, 22, 44, 45, 46, 52, 53, 54, 35, 34, 27, 26, 19, 18, 43, 42, 51, 50]);
});

test('Юнит Magician должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitMagician = getAttackUnit(typeCharacter[4], 10);

  expect(attackUnitMagician).toEqual([11, 12, 13, 14, 2, 3, 4, 5, 6, 18, 19, 20, 21, 22, 26, 27, 28, 29, 30, 34, 35, 36, 37, 38, 42, 43, 44, 45, 46, 9, 8, 1, 0, 17, 16, 25, 24, 33, 32, 41, 40]);
});

test('Юнит Daemon должен уметь атаковать по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire' , 'magician', 'daemon'];
  const attackUnitDaemon = getAttackUnit(typeCharacter[5], 29);

  expect(attackUnitDaemon).toEqual([30, 31, 21, 22, 23, 13, 14, 15, 5, 6, 7, 37, 38, 39, 45, 46, 47, 53, 54, 55, 61, 62, 63, 28, 27, 26, 25, 20, 19, 18, 17, 12, 11, 10, 9, 4, 3, 2, 1, 36, 35, 34, 33, 44, 43, 42, 41, 52, 51, 50, 49, 60, 59, 58, 57]);
});
