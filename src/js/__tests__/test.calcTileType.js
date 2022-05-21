import {calcTileType} from '../utils';

test('Функция должна корректно отрисовывать поле: top-left', () => {
  const index = 0;
  const boardSize = 8;

  expect(calcTileType(index, boardSize)).toBe('top-left');
});

test('Функция должна корректно отрисовывать поле: top', () => {
  const index = [1,2,3,4,5,6];
  const boardSize = 8;
  const result = index.every(arg => calcTileType(arg, boardSize) === 'top');

  expect(result).toBe(true);
});

test('Функция должна корректно отрисовывать поле: top-right', () => {
  const index = 7;
  const boardSize = 8;
  
  expect(calcTileType(index, boardSize)).toBe('top-right');
});

test('Функция должна корректно отрисовывать поле: left', () => {
  const index = [8,16,24,32,40,48];
  const boardSize = 8;
  const result = index.every(arg => calcTileType(arg, boardSize) === 'left');

  expect(result).toBe(true);
});

test('Функция должна корректно отрисовывать поле: right', () => {
  const index = [15,23,31,39,47];
  const boardSize = 8;
  const result = index.every(arg => calcTileType(arg, boardSize) === 'right');

  expect(result).toBe(true);
});

test('Функция должна корректно отрисовывать поле: bottom-left', () => {
  const index = 56;
  const boardSize = 8;
  
  expect(calcTileType(index, boardSize)).toBe('bottom-left');
});

test('Функция должна корректно отрисовывать поле: bottom', () => {
  const index = [57,58,59,60,61,62];
  const boardSize = 8;
  const result = index.every(arg => calcTileType(arg, boardSize) === 'bottom');

  expect(result).toBe(true);
});

test('Функция должна корректно отрисовывать поле: center', () => {
  const index = [
    9,10,11,12,13,14,
    17,18,19,20,21,22,
    25,26,27,28,29,30,
    33,34,35,36,37,38,
    41,42,43,44,45,46,
    49,50,51,52,53,54
  ];
  const boardSize = 8;
  const result = index.every(arg => calcTileType(arg, boardSize) === 'center');

  expect(result).toBe(true);
});
