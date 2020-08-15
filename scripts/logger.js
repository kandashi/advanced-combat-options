export class Logger {
  static info(...args) {
      console.log("Advanced Combat Options | ", ...args)
  }

  static debug(...args) {
      if (game.settings.get('advanced-combat-options', 'debug'))
          Logger.info("DEBUG | ", ...args);
  }
}