let debug = false;
let log = (...args) => console.log("Advanced Combat Options | Massive Damage | ", ...args);

export function onChange(actor, updateData)
{
  let data = {
    actor : actor,
    updateData : updateData,
    actorHP : actor.data.data.attributes.hp.value,
    updateHP : updateData?.data?.attributes?.hp?.value
  };

  if(actor.isPC && data.updateHP)
  {
    let hpChange = data.actorHP - data.updateHP;

    if(hpChange >= Math.ceil(actor.data.data.attributes.hp.max/2) && data.updateHP !== 0)
    {
      if(debug) log("MASSIVE DAMAGE DETECTED");

      game.socket.emit('module.advanced-combat-options', { name : "MD", data : data});
      recieveData(data);
    }
  }
}

export function recieveData(data)
{
  if(debug) log("Recieved Data", data);

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