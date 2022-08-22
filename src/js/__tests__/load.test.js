import GamePlay from '../GamePlay';
import GameController from '../GameController';
import GameStateService from '../GameStateService';

const gamePlay = new GamePlay();
const stateService = new GameStateService(localStorage);
const gameController = new GameController(gamePlay, stateService);

const mock = jest.fn(gameController.onLoadGame());

const status = {
  attackUnit: [26, 17, 18, 33, 34, 24, 16, 32],
  attackedUnit: undefined,
  level: 1,
  lockCell: [25, 40, 29],
  lockCellComp: [29],
  lockCellCurrent: undefined,
  lockCellUser: [25, 40],
  moveUnit: [26, 27, 28, 29, 24, 17, 9, 1, 33, 41, 49, 57, 18, 11, 4, 34, 43, 52, 61, 16, 32],
  score: 97,
  scoreTotal: 0,
  selectedUnit: {level: 1, type: 'swordsman', health: 100, attack: 40, defence: 10},
  selectedUnitPos: 25,
  targetDetected: false,
  theme: "prairie",
  turn: "user",
  unitsPositionOnMap: [{character: {level: 1, type: 'swordsman', health: 100, attack: 40, defence: 10}, position: 25}, 
  {character: {level: 1, type: 'magician', health: 80, attack: 10, defence: 40}, position: 40},
  {character: {level: 1, type: 'vampire', health: 93, attack: 25, defence: 25}, position: 29}]
};

beforeEach(() => {
  jest.resetAllMocks();
});

test('Игра должна загружаться', () => {
  mock.mockReturnValue(status);
  const result = {"attackUnit": [26, 17, 18, 33, 34, 24, 16, 32], "attackedUnit": undefined, "level": 1, 
    "lockCell": [25, 40, 29], "lockCellComp": [29], "lockCellCurrent": undefined, "lockCellUser": [25, 40], 
    "moveUnit": [26, 27, 28, 29, 24, 17, 9, 1, 33, 41, 49, 57, 18, 11, 4, 34, 43, 52, 61, 16, 32], "score": 97, 
    "scoreTotal": 0, "selectedUnit": {"attack": 40, "defence": 10, "health": 100, "level": 1, "type": "swordsman"}, 
    "selectedUnitPos": 25, "targetDetected": false, "theme": "prairie", "turn": "user", 
    "unitsPositionOnMap": [{"character": {"attack": 40, "defence": 10, "health": 100, "level": 1, "type": "swordsman"}, "position": 25}, 
    {"character": {"attack": 10, "defence": 40, "health": 80, "level": 1, "type": "magician"}, "position": 40}, 
    {"character": {"attack": 25, "defence": 25, "health": 93, "level": 1, "type": "vampire"}, "position": 29}]};
  
    expect(mock()).toEqual(result);
});

// test('Игра не должна загружаться', () => {
//   mock.mockReturnValue(new Error());
//   const result = {"attackUnit": [26, 17, 18, 33, 34, 24, 16, 32], "attackedUnit": undefined, "level": 1, 
//     "lockCell": [25, 40, 29], "lockCellComp": [29], "lockCellCurrent": undefined, "lockCellUser": [25, 40], 
//     "moveUnit": [26, 27, 28, 29, 24, 17, 9, 1, 33, 41, 49, 57, 18, 11, 4, 34, 43, 52, 61, 16, 32], "score": 97, 
//     "scoreTotal": 0, "selectedUnit": {"attack": 40, "defence": 10, "health": 100, "level": 1, "type": "swordsman"}, 
//     "selectedUnitPos": 25, "targetDetected": false, "theme": "prairie", "turn": "user", 
//     "unitsPositionOnMap": [{"character": {"attack": 40, "defence": 10, "health": 100, "level": 1, "type": "swordsman"}, "position": 25}, 
//     {"character": {"attack": 10, "defence": 40, "health": 80, "level": 1, "type": "magician"}, "position": 40}, 
//     {"character": {"attack": 25, "defence": 25, "health": 93, "level": 1, "type": "vampire"}, "position": 29}]};
  
//     // expect(mock()).toEqual(result);
//     expect(() => mock).toThrow();
// });