import { Logger } from './logger.js';

export async function onCreate(scene, data)
{
  let actor = game.actors.get(data.actorId);

  if(data.actorLink || !actor)
  {
    return data;
  }
    
  //figure out resizing later

  if(game.settings.get('advanced-combat-options','TH-SETTING'))
  {
    let formula = actor.data.data.attributes.hp.formula;
    if(formula)
    {
      let hp_roll = new Roll(formula).roll();

      Logger.debug("Formula Available | value rolled.");

      setProperty(data, "actorData.data.attributes.hp.value", hp_roll.total);
      setProperty(data, "actorData.data.attributes.hp.max", hp_roll.total);
    }else{
      Logger.debug("No formula Available | setting max.");
      setProperty(data, "actorData.data.attributes.hp.value", actor.data.data.attributes.hp.value);
      setProperty(data, "actorData.data.attributes.hp.max", actor.data.data.attributes.hp.max);
    }
  }else{
    Logger.debug("Setting Unset | setting max.");
    setProperty(data, "actorData.data.attributes.hp.value", actor.data.data.attributes.hp.value);
    setProperty(data, "actorData.data.attributes.hp.max", actor.data.data.attributes.hp.max);
  }

  Logger.debug("Ending Data | ", data);
  return data; 
}