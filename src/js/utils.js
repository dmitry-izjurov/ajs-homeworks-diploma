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
export const mainGrid = 8;                                            // игровая сетка NxN

export const positionUnitsGamer = getBeginPosition(mainGrid, 'user');
export const positionUnitsComputer = getBeginPosition(mainGrid, 'comp');

export const userPositionTeam = [];                                   // позиции юнитов игрока на карте
export const computerPositionTeam = [];                               // позиции юнитов компьютера на карте
export const characterUser = ['bowman', 'swordsman', 'magician'];     // строковые названия юнитов игрока
export const characterComp = ['daemon', 'undead', 'vampire'];         // строковые названия юнитов компьютера
export const userTeam = generateTeam(userTeamCls, 1, 2);              // команда игрока
export const computerTeam = generateTeam(computerTeamCls, 1, 2);      // команда компьютера

// Функция, считающая начальные позиции юнитов игрока и компьютера
function getBeginPosition(grid, player) {
  let arr = [];
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
  let borderMap = {};
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

// Функция, добавляющая занятые ячейки на карте
export function getLockCell(unitsPositionOnMap) {
  let arr = [];
  unitsPositionOnMap.forEach((a, i) => {
    arr.push(unitsPositionOnMap[i].position);
  });
  return arr;
}

// Функция, добавляющая занятые ячейки юнитами игрока или компьютера на карте
export function getLockCellPlayer(unitsPositionOnMap, player) {
  let arr = [];
  unitsPositionOnMap.forEach((a, i) => {
    let character = unitsPositionOnMap[i].character.type;
    let userUnit = characterUser.find(a => a === character);
    let userComp = characterComp.find(a => a === character);
    if (player === 'user' && userUnit) arr.push(unitsPositionOnMap[i].position);
    if (player === 'comp' && userComp) arr.push(unitsPositionOnMap[i].position);
  });
  return arr;
}

// Функция, определяющая как будет ходить выбранный юнит
export function getMoveUnit(unitType, position, callback, grid) {
  
  // все секции, по которым можно ходить юниту
  const move = [];
  const leftZoneMap = callback(grid).left;                 // левая граница карты
  const rightZoneMap = callback(grid).right;               // правая граница карты
  const topZoneMap = callback(grid).top;                   // верхняя граница карты
  const bottomZoneMap = callback(grid).bottom;             // нижняя граница карты
  
  // начальное значение отклонения юнита по оси Х
  let x = 1;

  function getSteps(steps) {
    function getMoveXorY(zoneMap, xy, m = 1) {
      let step = 0;
      for (let i = m; i <= steps * m; i += m) {
        const beginPosition = zoneMap.find(a => a === position);
        if (beginPosition || beginPosition === 0) break;
        if (xy === '+x' || xy === '-y') step = position + i;
        if (xy === '-x' || xy === '+y') step = position - i;
        let findZoneMap = zoneMap.find(a => a === step);
        if (findZoneMap || findZoneMap === 0) {
          move.push(step);
          break;
        };
        move.push(step);
      }
    }
    
    function getMoveXorYDiagonal(zoneMapX, zoneMapY, xy, m = 8) {
      let step = 0;
      for (let y = m; y <= steps * m; y += m) {
        const beginPositionX = zoneMapX.find(a => a === position);
        const beginPositionY = zoneMapY.find(a => a === position);
        if (beginPositionX || beginPositionX === 0 || beginPositionY || beginPositionY === 0) break;
        if (xy === '+x+y') step = position - y + x;           // Движение вправо-вверх
        if (xy === '+x-y') step = position + y + x;           // Движение вправо-вниз
        if (xy === '-x+y') step = position - y - x;           // Движение влево-вверх
        if (xy === '-x-y') step = position + y - x;           // Движение влево-вниз
        x += 1;
        let findZoneMapX = zoneMapX.find(a => a === step);
        let findZoneMapY = zoneMapY.find(a => a === step);
        if (findZoneMapX || findZoneMapX === 0 || findZoneMapY || findZoneMapY === 0) {
          move.push(step);
          x = 1;
          break;
        };
        move.push(step);
        if (y === steps * m) {
          x = 1;
        }
      }
    }

    getMoveXorY(rightZoneMap, '+x');                          // Движение вправо
    getMoveXorY(leftZoneMap, '-x');                           // Движение влево
    getMoveXorY(topZoneMap, '+y', 8);                         // Движение вверх
    getMoveXorY(bottomZoneMap, '-y', 8);                      // Движение вниз
    getMoveXorYDiagonal(rightZoneMap, topZoneMap, '+x+y');    // Движение вправо-вверх
    getMoveXorYDiagonal(rightZoneMap, bottomZoneMap, '+x-y'); // Движение вправо-вниз
    getMoveXorYDiagonal(leftZoneMap, topZoneMap, '-x+y');     // Движение влево-вверх
    getMoveXorYDiagonal(leftZoneMap, bottomZoneMap, '-x-y');  // Движение влево-вниз
    
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
export function getAttackUnit(unitType, position, callback, grid) {
  
  // все секции, по которым можно атаковать юниту
  const attack = [];
  const attackObj = new Set();
  const leftZoneMap = callback(grid).left;                 // левая граница карты
  const rightZoneMap = callback(grid).right;               // правая граница карты
  const topZoneMap = callback(grid).top;                   // верхняя граница карты
  const bottomZoneMap = callback(grid).bottom;             // нижняя граница карты

  function getTarget(purposes, m = 8) {
    function getAttackCell(zoneMapX, zoneMapY, xy) {
      for (let y = 0; y <= purposes; y += 1) {
        const beginPositionY = zoneMapY.find(a => a === position);
        const beginPositionX = zoneMapX.find(a => a === position);
            
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
        
          let findZoneMapX = zoneMapX.find(a => a === purpose);
          if (findZoneMapX || findZoneMapX === 0) {
            attackObj.add(purpose);
            break;
          };
          attackObj.add(purpose);
        }
        let findZoneMapY = zoneMapY.find(a => a === purpose);
        if (findZoneMapY || findZoneMapY === 0) {
          break;
        }
      } 
    }

    getAttackCell(rightZoneMap, topZoneMap, '+x+y');    // Движение вверх и вправо
    getAttackCell(rightZoneMap, bottomZoneMap, '+x-y'); // Движение вниз и вправо
    getAttackCell(leftZoneMap, topZoneMap, '-x+y');     // Движение вверх и влево
    getAttackCell(leftZoneMap, bottomZoneMap, '-x-y');  // Движение вниз и влево
    
    for (let attackCell of attackObj) {
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



// // Функция, определяющая как будет ходить выбранный юнит
// export function getMoveUnit(unitType, position) {
  
//   // все секции, по которым можно ходить юниту
//   const move = [];

//   const leftZoneMap = [0,8,16,24,32,40,48,56];             // левая граница карты
//   const rightZoneMap = [7,15,23,31,39,47,55,63];           // правая граница карты
//   const topZoneMap = [0,1,2,3,4,5,6,7];                    // верхняя граница карты
//   const bottomZoneMap = [56,57,58,59,60,61,62,63];         // нижняя граница карты

//   // начальное значение отклонения юнита по оси Х
//   let x = 1;

//   function getSteps(steps) {  
    // // Движение вправо
    // for (let i = 1; i <= steps; i += 1) {
    //   const beginPosition = rightZoneMap.find(a => a === position);
    //   if (beginPosition) break;
    //   let step = position + i;
    //   let findZoneMap = rightZoneMap.find(a => a === step);
    //   if (findZoneMap) {
    //     move.push(step);
    //     break;
    //   };
    //   move.push(step);
    // }

    // // Движение влево
    // for (let i = 1; i <= steps; i += 1) {
    //   const beginPosition = leftZoneMap.find(a => a === position);
    //   if (beginPosition || beginPosition === 0) break;
    //   let step = position - i;
    //   let findZoneMap = leftZoneMap.find(a => a === step)
    //   if (findZoneMap || findZoneMap === 0) {
    //     move.push(step);
    //     break;
    //   };
    //   move.push(step);
    // }

    // // Движение вверх
    // for (let i = 8; i <= steps * 8; i += 8) {
    //   const beginPosition = topZoneMap.find(a => a === position);
    //   if (beginPosition || beginPosition === 0) break;
    //   let step = position - i;
    //   let findZoneMap = topZoneMap.find(a => a === step);
    //   if (findZoneMap || findZoneMap === 0) {
    //     move.push(step);
    //     break;
    //   };
    //   move.push(step);
    // }

    // // Движение вниз
    // for (let i = 8; i <= steps * 8; i += 8) {
    //   const beginPosition = bottomZoneMap.find(a => a === position)
    //   if (beginPosition) break;
    //   let step = position + i;
    //   let findZoneMap = bottomZoneMap.find(a => a === step)
    //   if (findZoneMap) {
    //     move.push(step);
    //     break;
    //   };
    //   move.push(step);
    // }

    // // Движение вправо-вверх
    // for (let y = 8; y <= steps * 8; y += 8) {
    //   const beginPositionTop = topZoneMap.find(a => a === position) 
    //   const beginPositionRight = rightZoneMap.find(a => a === position);
    //   if (beginPositionTop || beginPositionTop === 0 || beginPositionRight) break;
    //   let step = position - y + x;
    //   x += 1;
    //   let findZoneMapTop = topZoneMap.find(a => a === step);
    //   let findZoneMapRight = rightZoneMap.find(a => a === step);
    //   if (findZoneMapTop || findZoneMapTop === 0 || findZoneMapRight) {
    //     move.push(step);
    //     x = 1;
    //     break;
    //   };
    //   move.push(step);
    //   if (y === steps * 8) {
    //     x = 1;
    //   }
    // }

    // // Движение вправо-вниз
    // for (let y = 8; y <= steps * 8; y += 8) {
    //   const beginPositionBottom = bottomZoneMap.find(a => a === position);
    //   const beginPositionRight = rightZoneMap.find(a => a === position);
    //   if (beginPositionBottom || beginPositionRight) break;
    //   let step = position + y + x;
    //   x += 1;
    //   let findZoneMapBottom = bottomZoneMap.find(a => a === step);
    //   let findZoneMapRight = rightZoneMap.find(a => a === step);
    //   if (findZoneMapBottom || findZoneMapRight) {
    //     move.push(step);
    //     x = 1;
    //     break;
    //   };
    //   move.push(step);
    //   if (y === steps * 8) {
    //     x = 1;
    //   }
    // }

    // // Движение влево-вверх
    // for (let y = 8; y <= steps * 8; y += 8) {
    //   const beginPositionTop = topZoneMap.find(a => a === position);
    //   const beginPositionLeft = leftZoneMap.find(a => a === position);
    //   if (beginPositionTop || beginPositionTop === 0 || beginPositionLeft || beginPositionLeft === 0) break;
    //   let step = position - y - x;
    //   x += 1;
    //   let findZoneMapTop = topZoneMap.find(a => a === step);
    //   let findZoneMapLeft = leftZoneMap.find(a => a === step);
    //   if (findZoneMapTop || findZoneMapTop === 0 || findZoneMapLeft || findZoneMapLeft === 0) {
    //     move.push(step);
    //     x = 1;
    //     break;
    //   };
    //   move.push(step);
    //   if (y === steps * 8) {
    //     x = 1;
    //   }
    // }

    // // Движение влево-вниз
    // for (let y = 8; y <= steps * 8; y += 8) {
    //   const beginPositionBottom = bottomZoneMap.find(a => a === position);
    //   const beginPositionLeft = leftZoneMap.find(a => a === position);
    //   if (beginPositionBottom || beginPositionLeft || beginPositionLeft === 0) break;
    //   let step = position + y - x;
    //   x += 1;
    //   let findZoneMapBottom = bottomZoneMap.find(a => a === step)
    //   let findZoneMapLeft = leftZoneMap.find(a => a === step);
    //   if (findZoneMapBottom || findZoneMapLeft || findZoneMapLeft === 0) {
    //     move.push(step);
    //     x = 1;
    //     break;
    //   };
    //   move.push(step);
    //   if (y === steps * 8) {
    //     x = 1;
    //   }
    // }

//     return move;
//   }
//   if (unitType === 'swordsman' || unitType === 'undead') {
//     const stepsUnits = 4;
//     return getSteps(stepsUnits);
//   }

//   if (unitType === 'bowman' || unitType === 'vampire') {
//     const stepsUnits = 2;
//     return getSteps(stepsUnits);
//   }

//   if (unitType === 'magician' || unitType === 'daemon') {
//     const stepsUnits = 1;
//     return getSteps(stepsUnits);
//   }
// }

// Функция, определяющая как будет атаковать выбранный юнит
// export function getAttackUnit(unitType, position) {
  
//   // все секции, по которым можно атаковать юниту
//   const attack = [];
//   const attackObj = new Set();
//   const leftZoneMap = [0,8,16,24,32,40,48,56];             // левая граница карты
//   const rightZoneMap = [7,15,23,31,39,47,55,63];           // правая граница карты
//   const topZoneMap = [0,1,2,3,4,5,6,7];                    // верхняя граница карты
//   const bottomZoneMap = [56,57,58,59,60,61,62,63];         // нижняя граница карты

//   function getTarget(purposes, m = 8) {
    // Движение вверх и вправо
    // for (let y = 0; y <= purposes; y += 1) {
    //   const beginPositionTop = topZoneMap.find(a => a === position);
    //   const beginPositionRight = rightZoneMap.find(a => a === position);
    //   if (beginPositionTop && beginPositionRight) break;
    //   let purpose;
    //   for (let x = 0; x <= purposes; x += 1) {
    //     if (x === 0 && y === 0) {
    //       continue;
    //     }
    //     if (beginPositionRight) {
    //       if (y === 0) {
    //         break;
    //       }
    //       purpose = position - y * m;
    //       attackObj.add(purpose);
    //       break;
    //     }
    //     purpose = position - y * m + x;
    //     let findZoneMapRight = rightZoneMap.find(a => a === purpose);
    //     if (findZoneMapRight) {
    //       attackObj.add(purpose);
    //       break;
    //     };
    //     attackObj.add(purpose);
    //   }
    //   let findZoneMapTop = topZoneMap.find(a => a === purpose);
    //   if (findZoneMapTop || findZoneMapTop === 0) {
    //     break;
    //   }
    // }
    
    // Движение вверх и влево
    // for (let y = 0; y <= purposes; y += 1) {
    //   const beginPositionTop = topZoneMap.find(a => a === position);
    //   const beginPositionLeft = leftZoneMap.find(a => a === position);
    //   if (beginPositionTop === 0 && beginPositionLeft === 0) break;
    //   let purpose;
    //   for (let x = 0; x <= purposes; x += 1) {
    //     if (x === 0 && y === 0) {
    //       continue;
    //     }
    //     if (beginPositionLeft || beginPositionLeft === 0) {
    //       if (y === 0) {
    //         break;
    //       }
    //       purpose = position - y * m;
    //       attackObj.add(purpose);
    //       break;
    //     }
    //     purpose = position - y * m - x;
    //     let findZoneMapLeft = leftZoneMap.find(a => a === purpose);
    //     if (findZoneMapLeft || findZoneMapLeft === 0) {
    //       attackObj.add(purpose);
    //       break;
    //     };
    //     attackObj.add(purpose);
    //   }
    //   let findZoneMapTop = topZoneMap.find(a => a === purpose);
    //   if (findZoneMapTop || findZoneMapTop === 0) {
    //     break;
    //   }
    // }


    // Движение вниз и вправо
    // for (let y = 0; y <= purposes; y += 1) {
    //   const beginPositionBottom = bottomZoneMap.find(a => a === position);
    //   const beginPositionRight = rightZoneMap.find(a => a === position);
    //   if (beginPositionBottom && beginPositionRight) break;
    //   let purpose;
    //   for (let x = 0; x <= purposes; x += 1) {
    //     if (x === 0 && y === 0) {
    //       continue;
    //     }
    //     if (beginPositionRight) {
    //       if (y === 0) {
    //         break;
    //       }
    //       purpose = position + y * m;
    //       attackObj.add(purpose);
    //       break;
    //     }
    //     purpose = position + y * m + x;
    //     let findZoneMapRight = rightZoneMap.find(a => a === purpose);
    //     if (findZoneMapRight) {
    //       attackObj.add(purpose);
    //       break;
    //     };
    //     attackObj.add(purpose);
    //   }
    //   let findZoneMapBottom = bottomZoneMap.find(a => a === purpose);
    //   if (findZoneMapBottom) {
    //     break;
    //   }
    // }

    // Движение вниз и влево
    // for (let y = 0; y <= purposes; y += 1) {
    //   const beginPositionBottom = bottomZoneMap.find(a => a === position);
    //   const beginPositionLeft = leftZoneMap.find(a => a === position);
    //   if (beginPositionBottom && beginPositionLeft) break;
    //   let purpose;
    //   for (let x = 0; x <= purposes; x += 1) {
    //     if (x === 0 && y === 0) {
    //       continue;
    //     }
    //     if (beginPositionLeft || beginPositionLeft === 0) {
    //       if (y === 0) {
    //         break;
    //       }
    //       purpose = position + y * m;
    //       attackObj.add(purpose);
    //       break;
    //     }
    //     purpose = position + y * m - x;
    //     let findZoneMapLeft = leftZoneMap.find(a => a === purpose);
    //     if (findZoneMapLeft || findZoneMapLeft === 0) {
    //       attackObj.add(purpose);
    //       break;
    //     };
    //     attackObj.add(purpose);
    //   }
    //   let findZoneMapBottom = bottomZoneMap.find(a => a === purpose);
    //   if (findZoneMapBottom) {
    //     break;
    //   }
    // }
    
//     for (let attackCell of attackObj) {
//       attack.push(attackCell);
//     }

//     return attack;
//   }

//   if (unitType === 'swordsman' || unitType === 'undead') {
//     const purposesUnits = 1;
//     return getTarget(purposesUnits);
//   }

//   if (unitType === 'bowman' || unitType === 'vampire') {
//     const purposesUnits = 2;
//     return getTarget(purposesUnits);
//   }

//   if (unitType === 'magician' || unitType === 'daemon') {
//     const purposesUnits = 4;
//     return getTarget(purposesUnits);
//   }
// }
