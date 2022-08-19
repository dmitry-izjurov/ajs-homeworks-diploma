import Character from './Character';
import GamePlay from './GamePlay';
import themes from './themes';
import cursors from './cursors';
import {generateTeam} from './generators';
import {unitsCls, userTeamCls, computerTeamCls} from './Characters/Units';
import {mainGrid, positionUnitsGamer, positionUnitsComputer, getBorderMap, userPositionTeam, 
  computerPositionTeam, characterUser, characterComp, userTeam, 
  computerTeam, getPosition, getPositionArrUnits, getPositionUnitOnMap, 
  getUnionArr, getUnitsOnMap, getMoveUnit, getAttackUnit, getLockCell,
  getLockCellPlayer, getRemoveUnit, getAttackStrategyComp, getWinner, getNewUnitsPositionOnMap} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.grid;                                                                         // размер поля боя NxN
    this.zoneMapBorder;                                                                // границы карты
    this.turn = 'user';                                                                // очередь ходить
    this.selectedUnit = new Object();                                                  // выбран юнит
    this.selectedUnitPos = new Number();                                               // выбран юнит по позиции на карте
    this.unitsPositionOnMap = new Array();                                             // все юниты на карте
    this.moveUnit = new Array();                                                       // Массив с клетками, по которым может ходить выбранный юнит
    this.attackUnit = new Array();                                                     // Массив с клетками, по которым может атаковать выбранный юнит
    this.level = 1;                                                                    // текущий уровень
    this.lockCell;                                                                     // Ячейки на карте, занятые юнитами
    this.lockCellUser;                                                                 // Ячейки на карте, занятые юнитами игрока
    this.lockCellComp;                                                                 // Ячейки на карте, занятые юнитами компьютера
    this.lockCellCurrent;                                                              // Текущая заблокированная ячейка
    this.targetDetected = false;                                                       // Цель для атаки обнаружена
    this.attackedUnit;                                                                 // Атакуемый юнит
    this.score = 0;                                                                    // количество набранных очков
    this.scoreTotal = 0;                                                               // количество набранных очков за игру
    this.lock = false;                                                                 // игра остановлена
    this.grid = mainGrid;                                                              // Определяем размер карты
    this.zoneMapBorder = getBorderMap(this.grid);                                      // Определяем границы карты
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));                   // Ставим обработчик на вход в ячейку
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));                   // Ставим обработчик на клик по ячейке
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));                   // Ставим обработчик на выход из ячейки
    this.lockCellUpdate = function() {                                                 // Функция, которая обновляет данные по занятым ячейкам
      this.lockCell = getLockCell(this.unitsPositionOnMap);                            // Добавляем занятые ячейки
      this.lockCellUser = getLockCellPlayer(this.unitsPositionOnMap, 'user');          // Добавляем занятые ячейки юнитами игрока
      this.lockCellComp = getLockCellPlayer(this.unitsPositionOnMap, 'comp');          // Добавляем занятые ячейки юнитами компьютера
    }
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    
    this.gamePlay.drawUi(themes.prairie);                                              // Задаем тему в начале игры

    getPositionArrUnits(userTeam, positionUnitsGamer, userPositionTeam);               // Вычисляем координаты юнитов игрока
    getPositionArrUnits(computerTeam, positionUnitsComputer, computerPositionTeam);    // Вычисляем координаты юнитов компьютера
    
    // Объединяем массивы всех юнитов и их позиций
    const unionTeam = getUnionArr(userTeam, computerTeam);                             // общая команда
    const unionPositionTeam = getUnionArr(userPositionTeam, computerPositionTeam);     // общие позиции
    
    this.unitsPositionOnMap = getUnitsOnMap(unionTeam, unionPositionTeam);             // Объекты PositionedCharacter
    
    this.lockCellUpdate();                                                             // Обновляем данные
    this.gamePlay.redrawPositions(this.unitsPositionOnMap);                            // Рисуем юнитов на карте
  }

  onCellClick(index) {
    if (!this.lock) {
      
    // TODO: react to click
    if (this.turn === 'comp') {
      this.turn = 'user';
      return alert('Компьютер не успевает за Вами!');
    };
    
    this.lockCellUpdate();
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

      this.moveUnit = getMoveUnit(this.selectedUnit.type, this.selectedUnitPos, this.zoneMapBorder);
      this.attackUnit = getAttackUnit(this.selectedUnit.type, this.selectedUnitPos, this.zoneMapBorder);
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
          this.moveUnit = getMoveUnit(unit.type, this.selectedUnitPos, this.zoneMapBorder);
          this.attackUnit = getAttackUnit(unit.type, this.selectedUnitPos, this.zoneMapBorder);

          const infoUnit = `\uD83C\uDF96${unit.level}\u2694${unit.attack}\uD83D\uDEE1${unit.defence}\u2764${unit.health}`;
          this.gamePlay.showCellTooltip(infoUnit, index);
          this.lockCellUpdate();
          
          // ходит компьютер
          this.gamePlay.redrawPositions(this.unitsPositionOnMap);
          this.turn = 'comp';
          
          this.score -= getAttackStrategyComp(this.unitsPositionOnMap, this.lockCellUser, this.lockCellComp, 
            Character, this.gamePlay, this.selectedUnitPos, this.level, this.score);
          
          
          setTimeout(() => {
            if (this.lockCellUser.length === 0) this.lock = true;
          }, 1000);

          if (this.selectedUnit.health <= 0) {
            this.selectedUnit = new Object();
            this.selectedUnitPos = new Number();
            this.moveUnit = new Array();
            this.attackUnit = new Array();
            this.gamePlay.deselectCell(index);
          }
          this.turn = 'user';
        }
      });
    }
    
    if (this.targetDetected && this.attackedUnit.health > 0 && this.selectedUnit.health > 0) {
      // Проверяем здоровье юнитов
      this.turn = 'comp'
      const damage = Character.damage(this.selectedUnit.attack, this.attackedUnit.defence);
      this.attackedUnit.health -= damage;
      this.gamePlay.showDamage(index, damage)
      .then(() => {
        getRemoveUnit(this.unitsPositionOnMap, this.lockCellUser, this.lockCellComp, this.gamePlay, this.selectedUnitPos);
        this.gamePlay.redrawPositions(this.unitsPositionOnMap);
        this.score += damage;
        this.score -= getAttackStrategyComp(this.unitsPositionOnMap, this.lockCellUser, this.lockCellComp, 
          Character, this.gamePlay, this.selectedUnitPos, this.level, this.score);
        
        // Ячейка, которая будет очищена, если компьютер сменит позицию
        let clearCeil;                                                                
        this.unitsPositionOnMap.forEach((a, i) => {
          if (a.position === index) clearCeil = this.unitsPositionOnMap[i].position;      
        });
        if (!clearCeil) {
          this.gamePlay.deselectCell(index);
          this.gamePlay.hideCellTooltip(index);
        }
        if (this.selectedUnit.health <= 0) {
          this.selectedUnit = new Object();
          this.selectedUnitPos = new Number();
          this.moveUnit = new Array();
          this.attackUnit = new Array();
          if (index) {
            this.gamePlay.deselectCell(index);
          }
        }
        this.turn = 'user';
        
        // Повышаем уровень
        let levelNew = getWinner(this.lockCellUser, this.lockCellComp, this.level, this.score, this.scoreTotal);
        if (typeof levelNew === 'object') {
          if (levelNew.winner) {
            this.selectedUnit = new Object();
            this.selectedUnitPos = new Number();
            this.moveUnit = new Array();
            this.attackUnit = new Array();
            this.gamePlay.deselectCell(index);
            this.scoreTotal += levelNew.score;
            let oldUserTeam = [];                                                                  // уцелевшие юниты игрока
            this.unitsPositionOnMap.forEach((a,i) => {
              a.character.levelUp();
              oldUserTeam.push(a.character);
            });
            this.level += 1;

            if (this.level === 2) {
              this.gamePlay.drawUi(themes.desert);
              this.unitsPositionOnMap = getNewUnitsPositionOnMap(generateTeam, userTeamCls, 2, 1,
                getUnionArr, oldUserTeam, computerTeamCls, 2);
              this.lockCellUpdate();
              this.gamePlay.redrawPositions(this.unitsPositionOnMap);
            }

            if (this.level === 3) {
              this.gamePlay.drawUi(themes.arctic);
              this.unitsPositionOnMap = getNewUnitsPositionOnMap(generateTeam, userTeamCls, 2, 2,
                getUnionArr, oldUserTeam, computerTeamCls, 3);
              this.lockCellUpdate();
              this.gamePlay.redrawPositions(this.unitsPositionOnMap);
            }

            if (this.level === 4) {
              this.gamePlay.drawUi(themes.mountain);
              this.unitsPositionOnMap = getNewUnitsPositionOnMap(generateTeam, userTeamCls, 3, 2,
                getUnionArr, oldUserTeam, computerTeamCls, 4);
              this.lockCellUpdate();
              this.gamePlay.redrawPositions(this.unitsPositionOnMap);
            }
          }
        }

        if (this.level === 4 && this.lockCellComp.length === 0) {
            this.lock = true;
            this.gamePlay.deselectCell(index);
            this.gamePlay.deselectCell(this.selectedUnitPos);
            this.gamePlay.setCursor(cursors.auto);
            this.selectedUnit = new Object();
            this.selectedUnitPos = new Number();
            this.moveUnit = new Array();
            this.attackUnit = new Array();
        }
      });
    }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (!this.lock) {
      // Ищем позицию юнита в общей команде
    this.targetDetected = false;                                                       // Сброс значения обнаруженной цели
    let unit;                                                                          // Найденный юнит
    this.lockCellUpdate();
    
    let findPositionUnit;
    this.unitsPositionOnMap.forEach((a, i) => {
      if (a.position === index) findPositionUnit = this.unitsPositionOnMap[i].position;
    })

    this.gamePlay.setCursor(cursors.auto);                                             // выбираем обычный курсор
    if (findPositionUnit || findPositionUnit === 0) {
      this.gamePlay.setCursor(cursors.pointer);                                        // выбираем курсор pointer
      this.unitsPositionOnMap.forEach((a, i) => {
        if (a.position === index) unit = this.unitsPositionOnMap[i].character;         
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
      } else if (indexAttackUnit === this.lockCellComp.find(a => a === index) && (indexAttackUnit || indexAttackUnit === 0)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(indexAttackUnit, 'red');
        this.targetDetected = true;
        this.attackedUnit = unit;
      } else if (findPositionUnitUser || findPositionUnitUser === 0) {
        this.gamePlay.setCursor(cursors.pointer);
      } else {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (!this.lock) {
      this.attackedUnit = undefined;                                                     // Сброс значения атакуемого юнита
      const indexMoveUnit = this.moveUnit.find(a => a === index);
      const indexAttackUnit = this.attackUnit.find(a => a === index);
      this.gamePlay.hideCellTooltip(index);                                              // Удаляем подсказку
    
      if (index !== this.selectedUnitPos && typeof this.selectedUnitPos !== 'object' && (indexMoveUnit || indexMoveUnit === 0)) {
        this.gamePlay.deselectCell(indexMoveUnit);
      }

      if (index !== this.selectedUnitPos && typeof this.selectedUnitPos !== 'object' && (indexAttackUnit || indexAttackUnit === 0)) {
        this.gamePlay.deselectCell(indexAttackUnit);
      }
    }
  }
}
