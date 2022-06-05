import GamePlay from './GamePlay';
import themes from './themes';
import cursors from './cursors';
import {mainGrid, positionUnitsGamer, positionUnitsComputer, getBorderMap, userPositionTeam, 
  computerPositionTeam, characterUser, characterComp, userTeam, 
  computerTeam, getPosition, getPositionArrUnits, getPositionUnitOnMap, 
  getUnionArr, getUnitsOnMap, getMoveUnit, getAttackUnit, getLockCell,
  getLockCellPlayer} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.turn = 'user';                                                               // очередь ходить
    this.selectedUnit = new Object();                                                 // выбран юнит
    this.selectedUnitPos = new Number();                                              // выбран юнит по позиции на карте
    this.unitsPositionOnMap = new Array();                                            // все юниты на карте
    this.moveUnit = new Array();                                                      // Массив с клетками, по которым может ходить выбранный юнит
    this.attackUnit = new Array();                                                    // Массив с клетками, по которым может атаковать выбранный юнит
    this.level = 1;                                                                   // текущий уровень
    this.unitsUser = 2;                                                               // осталось живых юнитов игрока
    this.unitsComp = 2;                                                               // осталось живых юнитов компьютера
    this.lockCell;                                                                    // Ячейки на карте, занятые юнитами
    this.lockCellUser;                                                                // Ячейки на карте, занятые юнитами игрока
    this.lockCellComp;                                                                // Ячейки на карте, занятые юнитами компьютера
    this.lockCellCurrent;                                                             // Текущая заблокированная ячейка
    this.lock = false;                                                                // игра остановлена
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);                                             // Задаем тему в начале игры

    getPositionArrUnits(userTeam, positionUnitsGamer, userPositionTeam);              // Вычисляем координаты юнитов игрока
    getPositionArrUnits(computerTeam, positionUnitsComputer, computerPositionTeam);   // Вычисляем координаты юнитов компьютера
    
    // Объединяем массивы всех юнитов и их позиций
    const unionTeam = getUnionArr(userTeam, computerTeam);                            // общая команда
    const unionPositionTeam = getUnionArr(userPositionTeam, computerPositionTeam);    // общие позиции
    
    this.unitsPositionOnMap = getUnitsOnMap(unionTeam, unionPositionTeam);            // Объекты PositionedCharacter
    
    this.lockCell = getLockCell(this.unitsPositionOnMap);                              // Добавляем занятые ячейки
    this.lockCellUser = getLockCellPlayer(this.unitsPositionOnMap, 'user');            // Добавляем занятые ячейки юнитами игрока
    this.lockCellComp = getLockCellPlayer(this.unitsPositionOnMap, 'comp');            // Добавляем занятые ячейки юнитами компьютера
    this.gamePlay.redrawPositions(this.unitsPositionOnMap);                            // Рисуем юнитов на карте
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
  }

  onCellClick(index) {
    // TODO: react to click
    this.lockCell = getLockCell(this.unitsPositionOnMap);                              // Добавляем занятые ячейки
    this.lockCellUser = getLockCellPlayer(this.unitsPositionOnMap, 'user');            // Добавляем занятые ячейки юнитами игрока
    this.lockCellComp = getLockCellPlayer(this.unitsPositionOnMap, 'comp');            // Добавляем занятые ячейки юнитами компьютера
    let findPositionUnitUser;                                                          // Позиция юнита игрока
    let findPositionUnitComp;                                                          // Позиция юнита компьютера
    
    this.unitsPositionOnMap.forEach((a, i) => {
      if (a.position === index && characterUser.find(arg => arg === a.character.type)) {
        findPositionUnitUser = this.unitsPositionOnMap[i].position;
      }
    });

    this.unitsPositionOnMap.forEach((a, i) => {
      if (a.position === index && characterComp.find(arg => arg === a.character.type)) {
        findPositionUnitComp = this.unitsPositionOnMap[i].position;
      }
    });
  
    if (findPositionUnitUser || findPositionUnitUser === 0) {
      this.gamePlay.deselectCell(this.selectedUnitPos);                                // Удаляем предыдущее выделение юнита
      this.gamePlay.selectCell(index);                                                 // Выделяем юнит
      this.selectedUnitPos = index;    
      this.unitsPositionOnMap.forEach((a, i) => {
        if (a.position === this.selectedUnitPos) this.selectedUnit = this.unitsPositionOnMap[i].character;
      });

      this.moveUnit = getMoveUnit(this.selectedUnit.type, this.selectedUnitPos, getBorderMap, mainGrid);
      this.attackUnit = getAttackUnit(this.selectedUnit.type, this.selectedUnitPos, getBorderMap, mainGrid);
    } else if (findPositionUnitComp && typeof this.selectedUnitPos === 'object') {
      GamePlay.showError('Этот персонаж неиграбельный');
    }

    if (this.selectedUnitPos !== index) {
      const newPositionUnit = this.moveUnit.find(a => a === index);

      this.unitsPositionOnMap.forEach((a, i) => {
        if (a.position === this.selectedUnitPos && (newPositionUnit || newPositionUnit === 0) && !this.lockCellCurrent) {
          let unit = this.unitsPositionOnMap[i].character;
          this.unitsPositionOnMap[i].position = newPositionUnit;
          
          this.gamePlay.deselectCell(this.selectedUnitPos);
          this.gamePlay.selectCell(newPositionUnit);
          this.selectedUnitPos = newPositionUnit;
          this.moveUnit = getMoveUnit(unit.type, this.selectedUnitPos, getBorderMap, mainGrid);
          this.attackUnit = getAttackUnit(unit.type, this.selectedUnitPos, getBorderMap, mainGrid);

          const infoUnit = `\uD83C\uDF96${unit.level}\u2694${unit.attack}\uD83D\uDEE1${unit.defence}\u2764${unit.health}`;
          this.gamePlay.showCellTooltip(infoUnit, index);
        }
      });
    }
    this.gamePlay.redrawPositions(this.unitsPositionOnMap);
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    // Ищем позицию юнита в общей команде
    this.lockCell = getLockCell(this.unitsPositionOnMap);                              // Добавляем занятые ячейки
    this.lockCellUser = getLockCellPlayer(this.unitsPositionOnMap, 'user');            // Добавляем занятые ячейки юнитами игрока
    this.lockCellComp = getLockCellPlayer(this.unitsPositionOnMap, 'comp');            // Добавляем занятые ячейки юнитами компьютера
    let findPositionUnit;
    this.unitsPositionOnMap.forEach((a, i) => {
      if (a.position === index) findPositionUnit = this.unitsPositionOnMap[i].position;
    })

    this.gamePlay.setCursor(cursors.auto);                                             // выбираем обычный курсор
    if (findPositionUnit || findPositionUnit === 0) {
      this.gamePlay.setCursor(cursors.pointer);                                        // выбираем курсор pointer
      let unit;
      this.unitsPositionOnMap.forEach((a, i) => {
        if (a.position === index) unit = this.unitsPositionOnMap[i].character;        // Найденный юнит
      });

      // Информация о юните
      const infoUnit = `\uD83C\uDF96${unit.level}\u2694${unit.attack}\uD83D\uDEE1${unit.defence}\u2764${unit.health}`;
      this.gamePlay.showCellTooltip(infoUnit, index);
    }

    let indexMoveUnit = this.moveUnit.find(a => a === index);
    this.lockCellCurrent = this.lockCell.find(a => a === indexMoveUnit);
    if (this.lockCellCurrent || this.lockCellCurrent === 0) {
      indexMoveUnit = undefined;
    }
    
    const indexAttackUnit = this.attackUnit.find(a => a === index);
    const findPositionUnitUser = this.lockCellUser.find(a => a === index);

    if (index !== this.selectedUnitPos && typeof this.selectedUnitPos !== 'object') {
      if ((indexMoveUnit || indexMoveUnit === 0)) {
        this.gamePlay.selectCell(indexMoveUnit, 'green');
        this.gamePlay.setCursor(cursors.pointer);
      } else if (indexAttackUnit === computerPositionTeam.find(a => a === index) && (indexAttackUnit || indexAttackUnit === 0)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(indexAttackUnit, 'red');
      } else if (findPositionUnitUser || findPositionUnitUser === 0) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    const indexMoveUnit = this.moveUnit.find(a => a === index);
    const indexAttackUnit = this.attackUnit.find(a => a === index);
    this.gamePlay.hideCellTooltip(this.selectedUnitPos);                               // Удаляем подсказку
    if (index !== this.selectedUnitPos && typeof this.selectedUnitPos !== 'object' && (indexMoveUnit || indexMoveUnit === 0)) {
      this.gamePlay.deselectCell(indexMoveUnit);
    }

    if (index !== this.selectedUnitPos && typeof this.selectedUnitPos !== 'object' && (indexAttackUnit || indexAttackUnit === 0)) {
      this.gamePlay.deselectCell(indexAttackUnit);
    }
  }
}
