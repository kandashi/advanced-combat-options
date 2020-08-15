let debug = true;
let log = (...args) => console.log("Advanced Combat Options | Massive Damage | ", ...args);

export function onChange_Actor(actor, updateData)
{
  let data = {
    actor : actor,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : updateData?.data?.attributes?.hp?.value,
    hpChange : ()=> {return (this.actorHP - this.updateHP)}
  };

  if(actor.isPC && data.updateHP)
  {
    if(data.hpChange >= Math.ceil(actor.data.data.attributes.hp.max/2) && data.updateHP !== 0)
    {
      if(debug) log(`Massive Actor Damage Detected ${actor.name} | `, data);

      game.socket.emit('module.advanced-combat-options', { name : "MD", data : data});
      recieveData(data);
    }
  }
}

export function onChange_Token(actorData, updateData)
{
  let data = {
    actorData : actorData,
    updateData : updateData,
    actorHP : actorData.data.attributes.hp.value,
    actorMax : actorData.data.attributes.hp.max,
    updateHP : updateData?.actorData?.data?.attributes?.hp?.value,
    hpChange : () => { return (this.actorHP - this.updateHP)}
  }

  log(`on Change Token | `, data, data.hpChange >= Math.ceil(data.actorMax/2), data.updateHP !== 0);

  if(data.hpChange >= Math.ceil(data.actorMax/2) && data.updateHP !== 0)
  {
    if(debug) log(`Massive Token Damage Detected ${actorData.name} | `, data);

    game.socket.emit('module.advanced-combat-options', { name : "MD", data : data});
    recieveData(data);
  }


}

export function recieveData(data)
{
  if(debug) log("Recieved Data", data);

  //better logic based on users??

  if(!game.user.character && !game.user.isGM) return ui.notifications.error(`User does not have a linked character`);

  if(!game.user.isGM && game.user.character._id === data.actor._id)
  {
    if(debug) log("This is my actor! It hurts!", game.user, data.actor);

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