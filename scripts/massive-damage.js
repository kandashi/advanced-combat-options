let debug = true;
let log = (...args) => console.log("Advanced Combat Options | Massive Damage | ", ...args);

export function onChange_Actor(actor, updateData)
{
  let data = {
    actor : actor,
    actorData : actor.data,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    actorMax : actor.data.data.attributes.hp.max,
    updateHP : (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : 0),
    hpChange : (actor.data.data.attributes.hp.value - (hasProperty(updateData,"data.attributes.hp.value") ? updateData.data.attributes.hp.value : actor.data.data.attributes.hp.value))
  };

  if(data.hpChange >= Math.ceil(data.actorMax/2) && data.updateHP !== 0)
  {
    if(debug) log(`Massive Actor Damage Detected ${actor.name}`);

    game.socket.emit('module.advanced-combat-options', { name : "MD", data : data});
    recieveData(data);
  }else{
    if(debug) log(`No Massive Actor Damage Detected ${actor.name}`); 
  }  
}

export function onChange_Token(token, updateData)
{
  let data = {
    actor : game.actors.get(token.actorId),
    actorData : token.actorData,
    updateData : updateData,
    actorHP : token.actorData.data.attributes.hp.value,
    actorMax : token.actorData.data.attributes.hp.max,
    updateHP : updateData.actorData.data.attributes.hp.value,
    hpChange : (token.actorData.data.attributes.hp.value- updateData.actorData.data.attributes.hp.value)
  }

  if(data.hpChange >= Math.ceil(data.actorMax/2) && data.updateHP !== 0)
  {
    if(debug) log(`Massive Token Damage Detected ${token.name}`);

    game.socket.emit('module.advanced-combat-options', { name : "MD", data : data});
    recieveData(data);
  }else{
    if(debug) log(`No Massive Token Damage Detected ${token.name}`);
  } 
}

export function recieveData(data)
{
  if(debug) log("Recieved Data", data);

  //better logic based on users??

  if(!game.user.character && !game.user.isGM) return ui.notifications.error(`User does not have a linked character`);

  if(!game.user.isGM && game.user.character._id === data.actor._id)
  {
    if(debug) log("This is my actor! It hurts!");

    game.user.character.rollAbilitySave("con").then((results)  =>{
      if(!results) return;

      setTimeout(()=> {
        if(results.total < 15)
        {
          game.packs.find(p=>p.title === "ACO Tables").getContent().then((result) =>{
            if(!result) return;

            let table = result.find(r => r.name === "Massive Damage; System Shock")

            table.draw();
          });
        }
      }, 1000);
    });
  }
}