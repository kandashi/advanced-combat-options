let debug = false;
let log = (...args) => console.log("Advanced Combat Options | Lingering Injuries | ", ...args);

export async function onChange(actor, updateData)
{
  let data = {
    actor : actor,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : (updateData.data?.attributes?.hp?.value ? updateData.data.attributes.hp.value : 0),
    hpChange : () => { return (this.actorHP - this.updateHP)},
    actorDS : actor.data.data.attributes.death.failure,
    updateDS : (updateData?.data?.attributes?.death?.failure ? updateData.data.attributes.death.failure : 0),
    dsChange : () => { return (this.actorDS - this.updateDS)}
  };

  setTimeout( async ()=>{
    if(( dropToZero(data) || await takeCritical(data) || await deathSave(data)) && actor.isPC)
    {
      if(debug) log("on Change | Lingering Injury Detected!");
  
      //emit to recieveData
    }
  }, 500);
}

export function recieveData(data)
{
   log("EMITTED DATA | ",data);
}

function dropToZero(data)
{
  if(data.hpChange !== 0 && data.updateData.data?.attributes?.hp?.value === 0)
  {
    if(debug) log("Drop to Zero Function | Return True",data);
    return true;
  }
  if(debug) log("Drop to Zero Function | Return False",data); 
  return false;
}

async function takeCritical(data)
{
  for(let message of game.messages)
  {
    let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-takeCritical') ? true : false;
    if(message.isRoll && !flag && message.data.flavor.includes("Attack Roll") && message._roll.parts[0].faces === 20 && critical(message._roll))
    {
        if(debug) log("Take Critical Function | I WAS CRIT! ",data);
        if(debug) log("Take Critical Function | Return True",data);
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
    }
    await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
  }
  if(debug) log("Take Critical Function | Return False",data);
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

async function deathSave(data)
{
  if(data.actorDS < data.updateDS && data.updateDS !== 3) 
  {
    if(debug) log("Death Save Function | outer if statement PENETRATED");
    for(let message of game.messages)
    {
      let flag = await message.getFlag('advanced-combat-options','Lingering-Injuries-deathSave') ? true : false;
      if(message.isRoll && !flag && message.data.flavor.includes("Death Saving Throw") && message._roll._total <= 5)
      {
        if(debug) log("Death Save Function | Return True", data);
        await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
        return true;
      }
      await message.setFlag('advanced-combat-options','Lingering-Injuries-takeCritical', true);
    }    
  }
  if(debug) log("Death Save Function | Return False", data);
  return false;
}