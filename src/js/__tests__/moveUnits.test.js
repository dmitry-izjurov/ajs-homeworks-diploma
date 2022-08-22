import { getMoveUnit, getBorderMap, mainGrid } from '../utils';

test('Юнит Swordsman должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitSwordsman = getMoveUnit(typeCharacter[0], 17, getBorderMap(mainGrid));

  expect(moveUnitSwordsman).toEqual([18, 19, 20, 21, 16, 9, 1, 25, 33, 41, 49, 10, 3, 26,
    35, 44, 53, 8, 24]);
});

test('Юнит Undead должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitUndead = getMoveUnit(typeCharacter[1], 30, getBorderMap(mainGrid));

  expect(moveUnitUndead).toEqual([31, 29, 28, 27, 26, 22, 14, 6, 38, 46, 54, 62, 23, 39, 21,
    12, 3, 37, 44, 51, 58]);
});

test('Юнит Bowman должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitBowman = getMoveUnit(typeCharacter[2], 1, getBorderMap(mainGrid));

  expect(moveUnitBowman).toEqual([2, 3, 0, 9, 17, 10, 19, 8]);
});

test('Юнит Vampire должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitVampire = getMoveUnit(typeCharacter[3], 54, getBorderMap(mainGrid));

  expect(moveUnitVampire).toEqual([55, 53, 52, 46, 38, 62, 47, 63, 45, 36, 61]);
});

test('Юнит Magician должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitMagician = getMoveUnit(typeCharacter[4], 56, getBorderMap(mainGrid));

  expect(moveUnitMagician).toEqual([57, 48, 49]);
});

test('Юнит Daemon должен уметь ходить по заданным клеткам', () => {
  const typeCharacter = ['swordsman', 'undead', 'bowman', 'vampire', 'magician', 'daemon'];
  const moveUnitDaemon = getMoveUnit(typeCharacter[5], 53, getBorderMap(mainGrid));

  expect(moveUnitDaemon).toEqual([54, 52, 45, 61, 46, 62, 44, 60]);
});
