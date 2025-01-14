
import { userTeamCls, computerTeamCls } from './Characters/Units';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  }
  if (index / boardSize < 1 && index !== boardSize - 1) {
    return 'top';
  }
  if (index === boardSize - 1) {
    return 'top-right';
  }
  if (index % boardSize === 0 && index !== boardSize * boardSize - boardSize) {
    return 'left';
  }
  if ((index + 1) % boardSize === 0 && index + 1 !== boardSize * boardSize) {
    return 'right';
  }
  if (index === boardSize * boardSize - boardSize) {
    return 'bottom-left';
  }
  if (index > boardSize * boardSize - boardSize && boardSize * boardSize !== index + 1) {
    return 'bottom';
  }
  if (boardSize * boardSize === index + 1) {
    return 'bottom-right';
  }
  return 'center';
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

// возможные позиции игрока и компьютера при старте игры
export const mainGrid = 8; // игровая сетка NxN

export const positionUnitsGamer = getBeginPosition(mainGrid, 'user');
export const positionUnitsComputer = getBeginPosition(mainGrid, 'comp');

export const userPositionTeam = []; // позиции юнитов игрока на карте
export const computerPositionTeam = []; // позиции юнитов компьютера на карте
export const characterUser = ['bowman', 'swordsman', 'magician']; // строковые названия юнитов игрока
export const characterComp = ['daemon', 'undead', 'vampire']; // строковые названия юнитов компьютера
export const userTeam = generateTeam(userTeamCls, 1, 2); // команда игрока
export const computerTeam = generateTeam(computerTeamCls, 1, 2); // команда компьютера

// Функция, считающая начальные позиции юнитов игрока и компьютера
function getBeginPosition(grid, player) {
  const arr = [];
  if (player === 'user') {
    for (let i = 0; i < grid; i += 1) {
      arr.push(i * grid);
      arr.push(i * grid + 1);
    }
  }

  if (player === 'comp') {
    for (let i = 1; i <= grid; i += 1) {
      arr.push(grid * i - 2);
      arr.push(grid * i - 1);
    }
  }
  return arr;
}

// Функция, определяющая границы карты
export function getBorderMap(grid) {
  const borderMap = {};
  let arr = [];

  for (let i = 0; i < grid; i += 1) {
    arr.push(i);
  }
  borderMap.top = arr;
  arr = [];

  for (let i = 0; i < grid; i += 1) {
    arr.push(i * grid);
  }
  borderMap.left = arr;
  arr = [];

  for (let i = 1; i <= grid; i += 1) {
    arr.push(i * grid - 1);
  }
  borderMap.right = arr;
  arr = [];

  for (let i = grid; i > 0; i -= 1) {
    arr.push(grid * grid - i);
  }
  borderMap.bottom = arr;
  arr = [];

  return borderMap;
}

// Функция, возвращающая позицию юнита на карте при старте игры
export function getPosition(PlayerPosArr) {
  const random = Math.floor(Math.random() * PlayerPosArr.length);
  return PlayerPosArr[random];
}

// Функция, добавляющая в массив позиции юнитов
export function getPositionArrUnits(teamArr, positionUnitsArr, positionTeamsArr) {
  // копия массива с позициями игроков при старте игры
  const positionUnitsArrCopy = [];
  positionUnitsArr.forEach((a) => positionUnitsArrCopy.push(a));

  for (let i = 0; i < teamArr.length; i += 1) {
    const positionUnitOnMap = getPosition(positionUnitsArrCopy);
    positionTeamsArr.push(positionUnitOnMap);

    // Удаляем использованный индекс на карте
    positionUnitsArrCopy.splice(positionUnitsArrCopy.findIndex((a) => a === positionUnitOnMap), 1);
  }
}

// Функция, определяющая координаты юнита на карте
export function getPositionUnitOnMap(character, position) {
  return new PositionedCharacter(character, position);
}

// Функция, объединяющая массивы
export function getUnionArr(arr1, arr2) {
  return arr1.concat(arr2);
}

// Функция, создающая объекты PositionedCharacter
export function getUnitsOnMap(team, position) {
  const arr = [];
  for (let i = 0; i < team.length; i += 1) {
    arr.push(getPositionUnitOnMap(team[i], position[i]));
  }
  return arr;
}

// Функция, добавляющая занятые ячейки на карте
export function getLockCell(unitsPositionOnMap) {
  const arr = [];
  unitsPositionOnMap.forEach((a, i) => {
    arr.push(unitsPositionOnMap[i].position);
  });
  return arr;
}

// Функция, добавляющая занятые ячейки юнитами игрока или компьютера на карте
export function getLockCellPlayer(unitsPositionOnMap, player) {
  const arr = [];
  unitsPositionOnMap.forEach((a, i) => {
    const character = unitsPositionOnMap[i].character.type;
    const userUnit = characterUser.find((a) => a === character);
    const userComp = characterComp.find((a) => a === character);
    if (player === 'user' && userUnit) arr.push(unitsPositionOnMap[i].position);
    if (player === 'comp' && userComp) arr.push(unitsPositionOnMap[i].position);
  });
  return arr;
}

// Функция, определяющая как будет ходить выбранный юнит
export function getMoveUnit(unitType, position, zoneMapObj) {
  // все секции, по которым можно ходить юниту
  const move = [];
  const leftZoneMap = zoneMapObj.left; // левая граница карты
  const rightZoneMap = zoneMapObj.right; // правая граница карты
  const topZoneMap = zoneMapObj.top; // верхняя граница карты
  const bottomZoneMap = zoneMapObj.bottom; // нижняя граница карты

  // начальное значение отклонения юнита по оси Х
  let x = 1;

  function getSteps(steps) {
    function getMoveXorY(zoneMap, xy, m = 1) {
      let step = 0;
      for (let i = m; i <= steps * m; i += m) {
        const beginPosition = zoneMap.find((a) => a === position);
        if (beginPosition || beginPosition === 0) break;
        if (xy === '+x' || xy === '-y') step = position + i;
        if (xy === '-x' || xy === '+y') step = position - i;
        const findZoneMap = zoneMap.find((a) => a === step);
        if (findZoneMap || findZoneMap === 0) {
          move.push(step);
          break;
        }
        move.push(step);
      }
    }

    function getMoveXorYDiagonal(zoneMapX, zoneMapY, xy, m = 8) {
      let step = 0;
      for (let y = m; y <= steps * m; y += m) {
        const beginPositionX = zoneMapX.find((a) => a === position);
        const beginPositionY = zoneMapY.find((a) => a === position);
        if (beginPositionX || beginPositionX === 0 || beginPositionY || beginPositionY === 0) break;
        if (xy === '+x+y') step = position - y + x; // Движение вправо-вверх
        if (xy === '+x-y') step = position + y + x; // Движение вправо-вниз
        if (xy === '-x+y') step = position - y - x; // Движение влево-вверх
        if (xy === '-x-y') step = position + y - x; // Движение влево-вниз
        x += 1;
        const findZoneMapX = zoneMapX.find((a) => a === step);
        const findZoneMapY = zoneMapY.find((a) => a === step);
        if (findZoneMapX || findZoneMapX === 0 || findZoneMapY || findZoneMapY === 0) {
          move.push(step);
          x = 1;
          break;
        }
        move.push(step);
        if (y === steps * m) {
          x = 1;
        }
      }
    }

    getMoveXorY(rightZoneMap, '+x'); // Движение вправо
    getMoveXorY(leftZoneMap, '-x'); // Движение влево
    getMoveXorY(topZoneMap, '+y', 8); // Движение вверх
    getMoveXorY(bottomZoneMap, '-y', 8); // Движение вниз
    getMoveXorYDiagonal(rightZoneMap, topZoneMap, '+x+y'); // Движение вправо-вверх
    getMoveXorYDiagonal(rightZoneMap, bottomZoneMap, '+x-y'); // Движение вправо-вниз
    getMoveXorYDiagonal(leftZoneMap, topZoneMap, '-x+y'); // Движение влево-вверх
    getMoveXorYDiagonal(leftZoneMap, bottomZoneMap, '-x-y'); // Движение влево-вниз

    return move;
  }

  if (unitType === 'swordsman' || unitType === 'undead') {
    const stepsUnits = 4;
    return getSteps(stepsUnits);
  }

  if (unitType === 'bowman' || unitType === 'vampire') {
    const stepsUnits = 2;
    return getSteps(stepsUnits);
  }

  if (unitType === 'magician' || unitType === 'daemon') {
    const stepsUnits = 1;
    return getSteps(stepsUnits);
  }
}

// Функция, определяющая как будет атаковать выбранный юнит
export function getAttackUnit(unitType, position, zoneMapObj) {
  // все секции, по которым можно атаковать юниту
  const attack = [];
  const attackObj = new Set();
  const leftZoneMap = zoneMapObj.left; // левая граница карты
  const rightZoneMap = zoneMapObj.right; // правая граница карты
  const topZoneMap = zoneMapObj.top; // верхняя граница карты
  const bottomZoneMap = zoneMapObj.bottom; // нижняя граница карты

  function getTarget(purposes, m = 8) {
    function getAttackCell(zoneMapX, zoneMapY, xy) {
      for (let y = 0; y <= purposes; y += 1) {
        const beginPositionY = zoneMapY.find((a) => a === position);
        const beginPositionX = zoneMapX.find((a) => a === position);

        if ((beginPositionY || beginPositionY === 0) && (beginPositionX || beginPositionX === 0)) break;
        let purpose;
        for (let x = 0; x <= purposes; x += 1) {
          if (x === 0 && y === 0) {
            continue;
          }
          if (beginPositionX || beginPositionX === 0) {
            if (y === 0) {
              break;
            }

            if (xy === '+x+y' || xy === '-x+y') purpose = position - y * m;
            if (xy === '+x-y' || xy === '-x-y') purpose = position + y * m;
            attackObj.add(purpose);
            break;
          }

          if (xy === '+x+y') purpose = position - y * m + x;
          if (xy === '+x-y') purpose = position + y * m + x;
          if (xy === '-x+y') purpose = position - y * m - x;
          if (xy === '-x-y') purpose = position + y * m - x;

          const findZoneMapX = zoneMapX.find((a) => a === purpose);
          if (findZoneMapX || findZoneMapX === 0) {
            attackObj.add(purpose);
            break;
          }
          attackObj.add(purpose);
        }
        const findZoneMapY = zoneMapY.find((a) => a === purpose);
        if (findZoneMapY || findZoneMapY === 0) {
          break;
        }
      }
    }

    getAttackCell(rightZoneMap, topZoneMap, '+x+y'); // Движение вверх и вправо
    getAttackCell(rightZoneMap, bottomZoneMap, '+x-y'); // Движение вниз и вправо
    getAttackCell(leftZoneMap, topZoneMap, '-x+y'); // Движение вверх и влево
    getAttackCell(leftZoneMap, bottomZoneMap, '-x-y'); // Движение вниз и влево

    for (const attackCell of attackObj) {
      attack.push(attackCell);
    }

    return attack;
  }

  if (unitType === 'swordsman' || unitType === 'undead') {
    const purposesUnits = 1;
    return getTarget(purposesUnits);
  }

  if (unitType === 'bowman' || unitType === 'vampire') {
    const purposesUnits = 2;
    return getTarget(purposesUnits);
  }

  if (unitType === 'magician' || unitType === 'daemon') {
    const purposesUnits = 4;
    return getTarget(purposesUnits);
  }
}

// Функция, удаляющая юнита после его смерти из общего массива данных
export function getRemoveUnit(units, userPositionTeamLockCell, computerPositionTeamLockCell, gamePlay, selectedUnitPos) {
  units.forEach((a, i) => {
    // проверяем юнитов игрока
    if (a.character.health <= 0 && (a.character.type === 'swordsman' || a.character.type === 'bowman'
    || a.character.type === 'magician')) {
      units.splice(i, 1);
      const userPosition = userPositionTeamLockCell.find((arg) => arg === a.position);
      const index = userPositionTeamLockCell.findIndex((arg) => arg === a.position);
      userPositionTeamLockCell.splice(index, 1);
      if (index !== -1 && userPosition === selectedUnitPos) gamePlay.deselectCell(selectedUnitPos);
    }

    // проверяем юнитов компьютера
    if (a.character.health <= 0 && (a.character.type === 'undead' || a.character.type === 'vampire'
    || a.character.type === 'daemon')) {
      units.splice(i, 1);
      const index = computerPositionTeamLockCell.findIndex((arg) => arg === a.position);
      computerPositionTeamLockCell.splice(index, 1);
    }
  });
}

// Функция, реализующая стратегию атаки и перемещения компьютера
export function getAttackStrategyComp(unitsPositionOnMapArr, lockCellUser, lockCellComp,
  character, gamePlay, selectedUnitPos, level, score) {
  const unitsPositionOnMap = unitsPositionOnMapArr;
  const userTeam = []; // команда игрока
  const compTeam = []; // команда компьютера
  let indexAttackUnit; // найденный юнит игрока для атаки
  let damage = 0; // урон, который получает юнит игрока

  unitsPositionOnMap.forEach((a, i) => {
    if (characterUser.find((arg) => arg === a.character.type)) {
      userTeam.push({ character: a.character, position: a.position });
    }
    if (characterComp.find((arg) => arg === a.character.type)) {
      compTeam.push({ character: a.character, position: a.position });
    }
  });

  if (userTeam.length === 0 || compTeam.length === 0) {
    return false;
  }

  // ищем юнита игрока для атаки
  for (let i = 0; i < compTeam.length; i += 1) {
    const attackUnit = getAttackUnit(compTeam[i].character.type, compTeam[i].position, getBorderMap(mainGrid));

    attackUnit.find((a) => lockCellUser.forEach((arg) => {
      if (arg === a) {
        indexAttackUnit = a;
      }
    }));

    if (indexAttackUnit || indexAttackUnit === 0) {
      const findUnitUser = userTeam.find((a) => a.position === indexAttackUnit);
      damage = character.damage(compTeam[i].character.attack, findUnitUser.character.defence);
      findUnitUser.character.health -= damage;
      gamePlay.showDamage(indexAttackUnit, damage)
        .then(() => {
          getRemoveUnit(unitsPositionOnMap, lockCellUser, lockCellComp, gamePlay, selectedUnitPos);
          getWinner(lockCellUser, lockCellComp, level, score);
          gamePlay.redrawPositions(unitsPositionOnMap);
        });
      break;
    }
  }

  // ищем юнита компьютера для движения
  if (!indexAttackUnit && indexAttackUnit !== 0) {
    const unitIndex = Math.floor(Math.random() * compTeam.length);
    const moveUnit = getMoveUnit(compTeam[unitIndex].character.type, compTeam[unitIndex].position, getBorderMap(mainGrid));
    let indexMoveUnit = Math.floor(Math.random() * moveUnit.length); // выбранный индекс юнита
    let findIndexMoveUnit = moveUnit[indexMoveUnit]; // найденный индекс юнита
    const matchingIndex = unitsPositionOnMap.filter((a) => a.position === findIndexMoveUnit);

    if (matchingIndex.length > 0) {
      moveUnit.forEach((a, i) => {
        for (let b = 0; b < matchingIndex.length; b += 1) {
          if (a === matchingIndex[b].position) {
            moveUnit.splice(i, 1);
          }
        }
      });

      indexMoveUnit = Math.floor(Math.random() * moveUnit.length);
      findIndexMoveUnit = moveUnit[indexMoveUnit];
    }

    const findIndexUnit = unitsPositionOnMap.findIndex((a) => a.position === compTeam[unitIndex].position);
    unitsPositionOnMap[findIndexUnit].position = findIndexMoveUnit;
    gamePlay.redrawPositions(unitsPositionOnMap);
  }
  return damage;
}

// Функция, которая проверяет победителя
export function getWinner(lockCellUser, lockCellComp, level, score, scoreTotal) {
  if (lockCellUser.length === 0) {
    alert('Game over');
  }

  if (lockCellComp.length === 0 && level !== 4) {
    const congratulationText = function (level, score, total) {
      return `Поздравляем! Вы прошли ${level} уровень и набрали ${score} очков! Всего набрано ${total} очков`;
    };
    if (scoreTotal === 0) {
      alert(congratulationText(level, score, score));
    } else {
      alert(congratulationText(level, score, score + scoreTotal));
    }
    return { winner: true, score };
  } if (lockCellComp.length === 0 && level === 4) {
    alert(`Поздравляем! Вы прошли игру и набрали ${score} очков за последнюю битву! Всего набрано очков ${score + scoreTotal}`);
  }
}

// Функция, которая вычисляет позиции юнитов на новом уровне
export function getNewUnitsPositionOnMap(generateTeam, userTeamCls, maxLevelUser, characterCount,
  getUnionArr, oldUserTeam,
  computerTeamCls, maxLevelComp) {
  const newUnitsUser = generateTeam(userTeamCls, maxLevelUser, characterCount);
  const newUserTeam = getUnionArr(oldUserTeam, newUnitsUser); // новая команда игрока
  const newComputerTeam = generateTeam(computerTeamCls, maxLevelComp, newUserTeam.length); // новая команда компьютера

  const newUserPositionTeam = [];
  const newComputerPositionTeam = [];

  getPositionArrUnits(newUserTeam, positionUnitsGamer, newUserPositionTeam); // Вычисляем координаты юнитов игрока
  getPositionArrUnits(newComputerTeam, positionUnitsComputer, newComputerPositionTeam); // Вычисляем координаты юнитов компьютера


  // // Объединяем массивы всех юнитов и их позиций
  const newUnionTeam = getUnionArr(newUserTeam, newComputerTeam); // общая команда
  const unionPositionTeam = getUnionArr(newUserPositionTeam, newComputerPositionTeam); // общие позиции

  return getUnitsOnMap(newUnionTeam, unionPositionTeam); // Объекты PositionedCharacter
}
