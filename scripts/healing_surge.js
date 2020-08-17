import { Logger } from './logger.js';

export async function onChange_Actor(actor, rest, previousHD = 0)
{
  Logger.debug(`On Change Actor | Variable Information | `, actor, rest);

  if(!actor) return ui.notifications.error(`Actor error`);
  if(!rest) return ui.notifiactions.error(`Rest Error`);

  let updated_actor = game.actors.get(actor.id);

  let usedHD = 0;

  updated_actor.items.filter(i=>i.data.type === "class").reduce((item)=>{
    usedHD += item.data.data.hitDiceUsed; //amount of hitdie that are missing
  });

  usedHD -= previousHD;

  switch(rest)
  {
    case "longrest":
      await longRest(actor);
      break;
    case "shortrest":
      await shortRest(actor);
      break;
    default:
      ui.notifications.error(`Healing Surge | on Change Actor | Error.`);
      break;
  }

  return previousHD;
}

async function longRest(actor)
{
  const updateItems = actor.items.filter(i=>i.data.type === "class").reduce((updates,item) =>{
    const data = item.data.data;
    if(data.hitDiceUsed !== 0)
    {
      updates.push({_id: item.id, "data.hitDiceUsed" : 0});
    }
    return updates;
  }, []);

  if(updateItems.length) await actor.updateEmbeddedEntity("OwnedItem", updateItems);
}

async function shortRest(actor)
{
  let recoverHD = Math.max(Math.floor(actor.data.data.details.level/4),1); //change Math.floor to Math.ceil if you want to ROUND UP
  let dhd = 0; 

  const updateItems = actor.items.filter(item => item.data.type === "class").sort((a, b) => {
    let da = parseInt(a.data.data.hitDice.slice(1)) || 0;
    let db = parseInt(b.data.data.hitDice.slice(1)) || 0;
    return db - da;
  }).reduce((updates, item) => {
    const d = item.data.data;
    if ( (recoverHD > 0) && (d.hitDiceUsed > 0) ) {
      let delta = Math.min(d.hitDiceUsed || 0, recoverHD);
      recoverHD -= delta;
      dhd += delta;
      updates.push({_id: item.id, "data.hitDiceUsed": d.hitDiceUsed - delta});
    }
    return updates;
  }, []);

  if(updateItems.length) await actor.updateEmbeddedEntity("OwnedItem", updateItems);
}