/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  let current = 0;
  const last = allowedTypes.length - 1;

  while (current <= last) {
    const index = Math.floor(Math.random() * allowedTypes.length);
    const level = Math.floor(Math.random() * maxLevel) + 1;
    current += 1;
    yield new allowedTypes[index](level);
  }
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const unit = characterGenerator(allowedTypes, maxLevel);
  const team = [];

  for (let i = 0; i < characterCount; i += 1) {
    team.push(unit.next().value);
  }
  
  return team;
}
