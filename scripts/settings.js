let debug = false;
let log = (...args) => console.log("Advanced Combat Options | Settings | ", ...args);

export function registerSettings()
{
  Lingering_Injuries_Settings();
  Massive_Damage_Settings();
  Token_Settings();
}

function Lingering_Injuries_Settings()
{
  log("Registering Lingering Injuries");
  game.settings.register('advanced-combat-options','LI-SETTING', {
    name : i18n("aco.settings.LI-SETTING.title"),
    hint : i18n("aco.settings.LI-SETTING.hint"),
    scope :"world",
    config : true,
    default : false,
    type : Boolean,
    onChange : value => {
        window.location.reload();
    }
  });
}

function Massive_Damage_Settings()
{
  log("Registering Massive Damage");
  game.settings.register('advanced-combat-options','MD-SETTING', {
    name : i18n("aco.settings.MD-SETTING.title"),
    hint : i18n("aco.settings.MD-SETTING.hint"),
    scope :"world",
    config : true,
    default : false,
    type : Boolean,
    onChange : value => {
        window.location.reload();
    }
  });
}

function Token_Settings()
{
  log("Registering Token Settings");
  game.settings.register('advanced-combat-options','TH-SETTING', {
    name : i18n("aco.settings.TH-SETTING.title"),
    hint : i18n("aco.settings.TH-SETTING.hint"),
    scope :"world",
    config : true,
    default : false,
    type : Boolean,
    onChange : value => {
        window.location.reload();
    }
  });
}

function i18n(key)
{
    return game.i18n.localize(key);
}