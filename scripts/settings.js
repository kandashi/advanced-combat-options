import { Logger } from './logger.js';

export function registerSettings()
{
  Logger_Settings();
  Lingering_Injuries_Settings();
  Massive_Damage_Settings();
  Token_Settings();
  Unconscious_Exhaustion_Settings();
  Healing_Surge_Settings();
  Exhaustion_Removal_Settings();
}

function Logger_Settings()
{
  Logger.info("Registering Logger Debugging");
  game.settings.register('advanced-combat-options','debug', {
    name : "",
    hint : "",
    scope :"world",
    config : false,
    default : true,
    type : Boolean
  });

}

function Lingering_Injuries_Settings()
{
  Logger.info("Registering Lingering Injuries");
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
  Logger.info("Registering Massive Damage");
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
  Logger.info("Registering Token Settings");
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

function Unconscious_Exhaustion_Settings()
{
  Logger.info("Registering Unconscious Exhaustion Settings");
  game.settings.register('advanced-combat-options','UE-SETTING', {
    name : i18n("aco.settings.UE-SETTING.title"),
    hint : i18n("aco.settings.UE-SETTING.hint"),
    scope :"world",
    config : true,
    default : false,
    type : Boolean,
    onChange : value => {
        window.location.reload();
    }
  });
}

function Healing_Surge_Settings()
{
  Logger.info("Registering Healing Surge Settings");
  game.settings.register('advanced-combat-options','HS-SETTING', {
    name : i18n("aco.settings.HS-SETTING.title"),
    hint : i18n("aco.settings.HS-SETTING.hint"),
    scope :"world",
    config : true,
    default : false,
    type : Boolean,
    onChange : value => {
        window.location.reload();
    }
  });
}

function Exhaustion_Removal_Settings()
{
  Logger.info("Registering Exhaustion Removal Settings");
  game.settings.register('advanced-combat-options','ER-SETTING', {
    name : i18n("aco.settings.ER-SETTING.title"),
    hint : i18n("aco.settings.ER-SETTING.hint"),
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