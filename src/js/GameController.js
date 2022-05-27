import themes from './themes';
import {positionUnitsGamer, positionUnitsComputer, userPositionTeam, 
  computerPositionTeam, userUnitsStrings, computerUnitsStrings, userTeam, 
  computerTeam, getPosition, getPositionArrUnits, getPositionUnitOnMap, 
  getUnionArr, getUnitsOnMap} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 'user';                       // очередь ходить
    this.selected = '';                       // выбран юнит
    this.level = 1;                           // текущий уровень
    this.alive = 2;                           // осталось живых юнитов игрока
    this.lock = false;                        // игра остановлена
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);                                           // Задаем тему в начале игры
    
    getPositionArrUnits(userTeam, positionUnitsGamer, userPositionTeam);            // Вычисляем координаты юнитов игрока
    getPositionArrUnits(computerTeam, positionUnitsComputer, computerPositionTeam); // Вычисляем координаты юнитов компьютера
    
    // Объединяем массивы всех юнитов и их позиций
    const unionTeam = getUnionArr(userTeam, computerTeam);                          // общая команда
    const unionPositionTeam = getUnionArr(userPositionTeam, computerPositionTeam);  // общие позиции
    
    const unitsPositionOnMap = getUnitsOnMap(unionTeam, unionPositionTeam);         // Объекты PositionedCharacter  
    this.gamePlay.redrawPositions(unitsPositionOnMap);                              // Рисуем юнитов на карте 
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
    
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // ищем юнита на карте
    const unionPositionTeam = getUnionArr(userPositionTeam, computerPositionTeam);
    if (unionPositionTeam.find(a => a === index)) {
      const unionTeam = getUnionArr(userTeam, computerTeam);
      const unit = unionTeam[unionPositionTeam.findIndex(a => a === index)];        // Найденный юнит
      // Информация о юните
      const infoUnit = `\uD83C\uDF96${unit.level}\u2694${unit.attack}\uD83D\uDEE1${unit.defence}\u2764${unit.health}`;
      this.gamePlay.showCellTooltip(infoUnit, index);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
