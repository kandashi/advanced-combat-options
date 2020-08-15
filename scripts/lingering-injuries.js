let debug = true;
let log = (...args) => console.log("Advanced Combat Options | Lingering Injuries | ", ...args);

export async function onChange_Actor(actor, updateData)
{
  let data = {
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : 0),
    hpChange : (actor.data.data.attributes.hp.value - (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : actor.data.data.attributes.hp.value)),
    actorDS : actor.data.data.attributes.death.failure,
    updateDS : (hasProperty(updateData,"data.attributes.death.failure") ? updateData.data.attributes.death.failure : 0),
    dsChange : (actor.data.data.attributes.death.failure - (hasProperty(updateData,"data.attributes.death.failure") ? updateData.data.attributes.death.failure : actor.data.data.attributes.death.failure))
  };

  setTimeout( async ()=>{
    if(dropToZero(data) || await takeCritical(data) || await deathSave(data))
    {
      if(debug) log(`on Change | Lingering Injury Detected on ${actor.name}!`);
  
      game.socket.emit('module.advanced-combat-options', { name : "LI", data : data});
      recieveData(data);
    }
  }, 500);
}

export async function onChange_Token(token,updateData)
{
  let data = {
    actorData : canvas.tokens.get(token._id).actor.data,
    updateData : updateData,
    actorHP : token.actorData.data.attributes.hp.value,
    updateHP : updateData.actorData.data.attributes.hp.value,
    hpChange : (token.actorData.data.attributes.hp.value - updateData.actorData.data.attributes.hp.value)
  };

  setTimeout( async ()=>{
    if(await takeCritical(data))
    {
      if(debug) log(`on Change | Lingering Injury Detected on ${token.name}!`);

      recieveData(data);
    }
  }, 500);
}

export function recieveData(data)
{
  if(debug) log("Recieved Data", data);

  let actor = canvas.tokens.get(data.actorData.token._id) ? canvas.tokens.get(data.actorData.token._id) : game.actors.get(data.actorData._id);

  if(actor.data.permission[game.userId] === CONST.ENTITY_PERMISSIONS.OWNER && !game.user.isGM)
  {
    if(debug) log("Entered inside the logic statement --- con save should result");

    setTimeout(()=> {
      game.packs.find(p=>p.title === "ACO Tables").getContent().then((result) =>{
        if(!result) return;

        let table = result.find(r => r.name === "Lingering Injuries")

        table.draw();
      });
    }, 1000);

  }else if(game.user.isGM && !hasPlayerOwner(data.actorData))
  {
    if(debug) log("This isn't owned by any player --- default to GM");

    setTimeout(()=> {
      game.packs.find(p=>p.title === "ACO Tables").getContent().then((result) =>{
        if(!result) return;

        let table = result.find(r => r.name === "Lingering Injuries")

        table.draw();
      });
    }, 1000);

  }
}

function dropToZero(data = {})
{
  if(data.hpChange !== 0 && data.updateData.data?.attributes?.hp?.value === 0)
  {
    if(debug) log("Drop to Zero Function | Return True");
    return true;
  }
  if(debug) log("Drop to Zero Function | Return False"); 
  return false;
}

async function takeCritical(data = {})
{
  for(let message of game.messages)
  {
    let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-takeCritical') ? true : false;
    if(message.isRoll && !flag && message.data.flavor.includes("Attack Roll") && message._roll.parts[0].faces === 20 && critical(message._roll) && data.hpChange > 0)
    {
        if(debug) log("Take Critical Function | Return True");
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
    }
    if(!message.isRoll || !message.data.flavor.includes("Attack Roll"))
    {
      await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
    }
  }
  if(debug) log("Take Critical Function | Return False");
  return false;

  function critical(rollData)
  {
    let critical = rollData.parts[0].options.critical;
    for(let roll of rollData.parts[0].rolls)
    {
      if(critical <= roll.roll)
      {
        return true;
      }
    }
    return false;    
  }
}

async function deathSave(data = {})
{
  if(data.dsChange < 0 && data.updateDS !== 3) 
  {
    for(let message of game.messages)
    {
      let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-deathSave') ? true : false;
      if(message.isRoll && !flag && message.data.flavor.includes("Death Saving Throw") && message._roll._total <= 5)
      {
        if(debug) log("Death Save Function | Return True");
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
      }
      await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
    }    
  }
  if(debug) log("Death Save Function | Return False");
  return false;
}

function hasPlayerOwner(actorData)
{
  if ( actorData.permission["default"] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  for ( let u of game.users.entities ) {
    if ( u.isGM ) continue;
    if ( actorData.permission[u.id] >= CONST.ENTITY_PERMISSIONS.OWNER ) return true;
  }
  return false;
}