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

export function getRandomUnit(max) {
  return Math.floor(Math.random() * (max + 1));
}

// export function getRandomUnit(min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }