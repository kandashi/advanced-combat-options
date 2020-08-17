import { Logger } from './logger.js';

export async function onChange_Actor(actor, updateData)
{
  let data = {
    id : actor._id,
    actorData : actor.data,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : 0),
    hpChange : (actor.data.data.attributes.hp.value - (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : actor.data.data.attributes.hp.value))
  };


  if(dropToZero(data))
  {
    Logger.debug(`on Change | Unconscious Exhaustion Detected on ${actor.name}!`);

    //game.socket.emit('module.advanced-combat-options', { name : "UE", data : data});
    //recieveData(data);
    //might not need to do what im doing here, just edit the actor that is sent.

    await setProperty(updateData, "data.attributes.exhaustion", parseInt(actor.data.data.attributes.exhaustion) + 1);
    //await actor.update({"data.attributes.exhaustion" : parseInt(actor.data.data.attributes.exhaustion) + 1});
  }else{
    Logger.debug(`on Change | Unconscious Exhaustion NOT Detected on ${actor.name}!`);
  }
  return updateData;
}

export function recieveData(data)
{
  Logger.debug("Recieved Data", data);

  let actor = canvas.tokens.get(data.id)?.actor ? canvas.tokens.get(data.id).actor : game.actors.get(data.id);

  if(game.user.isGM)
  {
    executeExhaustion(actor);
  }
}

function executeExhaustion(actor,updateData)
{
  let actor_attributes = actor.data.data.attributes;

  /*actor.update({"data.attributes.exhaustion" : parseInt(actor_attributes.exhaustion) + 1});*/

  setProperty(actor, "data.attributes.exhaustion", parseInt(actor_attributes.exhaustion) + 1);

  //display exhaustion increment.
}

function dropToZero(data = {})
{
  if(data.hpChange !== 0 && data.updateData.data?.attributes?.hp?.value === 0)
  {
    Logger.debug("Drop to Zero Function | Return True");
    return true;
  }
  Logger.debug("Drop to Zero Function | Return False"); 
  return false;
}