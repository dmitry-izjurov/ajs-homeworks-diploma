export default class GameState {
  static from(object) {
    // TODO: create object
    if (typeof object === 'object') {
      const newGames = [];
      if (object.type === 'new Game') {
        newGames.push(object);
        console.log(newGames);
      }
      return object;
    }
    return null;
  }
}
