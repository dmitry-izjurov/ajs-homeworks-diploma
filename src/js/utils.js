import {unitsCls, userTeamCls, computerTeamCls} from './Characters/Units';
import {generateTeam} from './generators';
import PositionedCharacter from './PositionedCharacter';

export function calcTileType(index, boardSize) {
  // TODO: write logic here
  if (index === 0) {
    return 'top-left';
  }
  else if (index / boardSize < 1 && index !== boardSize - 1) {
    return 'top';
  }
  else if (index === boardSize - 1) {
    return 'top-right';
  }
  else if (index % boardSize === 0 && index !== boardSize * boardSize - boardSize) {
    return 'left';
  }
  else if ((index + 1) % boardSize === 0 && index + 1 !== boardSize * boardSize) {
    return 'right';
  }
  else if (index === boardSize * boardSize - boardSize) {
    return 'bottom-left';
  }
  else if (index > boardSize * boardSize - boardSize && boardSize * boardSize !== index + 1) {
    return 'bottom';
  }
  else if (boardSize * boardSize === index + 1) {
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
export const positionUnitsGamer = [0,1,8,9,16,17,24,25,32,33,40,41,48,49,56,57];
export const positionUnitsComputer = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 62, 63];

export const userPositionTeam = [];                                   // позиции юнитов игрока на карте
export const computerPositionTeam = [];                               // позиции юнитов компьютера на карте
export const userUnitsStrings = ['bowman', 'swordsman', 'magician'];  // строковые названия юнитов игрока
export const computerUnitsStrings = ['daemon', 'undead', 'vampire'];  // строковые названия юнитов компьютера
export const userTeam = generateTeam(userTeamCls, 1, 2);              // команда игрока
export const computerTeam = generateTeam(computerTeamCls, 1, 2);      // команда компьютера

// Функция, возвращающая позицию юнита на карте при старте игры
export function getPosition(PlayerPosArr) {
  const random = Math.floor(Math.random() * PlayerPosArr.length);
  return PlayerPosArr[random];
}

// Функция, добавляющая в массив позиции юнитов
export function getPositionArrUnits(teamArr, positionUnitsArr, positionTeamsArr) {
  // копия массива с позициями игроков при старте игры
  const positionUnitsArrCopy = [];
  positionUnitsArr.forEach(a => positionUnitsArrCopy.push(a));
  
  for (let i = 0; i < teamArr.length; i += 1) {
    const positionUnitOnMap = getPosition(positionUnitsArrCopy);
    positionTeamsArr.push(positionUnitOnMap);
    
    // Удаляем использованный индекс на карте
    positionUnitsArrCopy.splice(positionUnitsArrCopy.findIndex(a => a === positionUnitOnMap), 1);
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
  let arr = []
  for (let i = 0; i < team.length; i += 1) {
    arr.push(getPositionUnitOnMap(team[i], position[i]));
  }
  return arr;
}