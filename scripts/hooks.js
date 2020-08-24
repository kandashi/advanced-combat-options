import { Logger } from './logger.js';

import * as settings from './settings.js';
import * as LI_module from './lingering-injuries.js';
import * as MD_module from './massive-damage.js';
import * as TH_module from './token_hp.js';
import * as UE_module from './unconscious_exhaustion.js';
import * as HS_module from './healing_surge.js';
import * as ER_module from './exhaustion_recovery.js';

Hooks.on('init', ()=>{
  Logger.info("Registering All Settings.");
  settings.registerSettings();
});

Hooks.on('ready', () => {
  Logger.info("Registering Sockets");
  game.socket.on('module.advanced-combat-options', async (data) => {
    if(data?.name === "LI" && game.settings.get('advanced-combat-options','LI-SETTING'))
    {
      LI_module.recieveData(data?.data);
    }
    if(data?.name === "MD" && game.settings.get('advanced-combat-options','LI-SETTING'))
    {
      MD_module.recieveData(data?.data);
    }
    if(data?.name === "UE" && game.settings.get('advanced-combat-options','UE-SETTING'))
    {
      UE_module.recieveData(data?.data);
    }
  });
});

Hooks.on('preCreateToken', (scene,token,options,id) => {
  Logger.info("Pre Create Token Capture");
  Logger.debug("Pre Create Token | ", scene,token,options,id);

  TH_module.onCreate(scene,token);
});

Hooks.on('preUpdateActor', (actor, updateData, diff, id)=>{
  Logger.info("Pre Update Actor Capture");
  Logger.debug("Pre Update Actor | ",actor,updateData,diff,id);

  //Lingering Injuries
  if(game.settings.get('advanced-combat-options','LI-SETTING'))
  {
    LI_module.onChange_Actor(actor,updateData);
  }

  //Massive Damage
  if(game.settings.get('advanced-combat-options','MD-SETTING') && hasProperty(updateData, "data.attributes.hp.value"))
  {
    MD_module.onChange_Actor(actor,updateData);
  }

  //Unconscious Exhaustion
  if(game.settings.get('advanced-combat-options','UE-SETTING') && hasProperty(updateData, "data.attributes.hp.value"))
  {
    UE_module.onChange_Actor(actor,updateData);
  }

  //Exhaustion Status (change some values maybe, mostly display and death id say.)
});

Hooks.on('preUpdateToken', (scene,token,updateData,diff, id)=>{
  Logger.info("Pre Update Token Capture");
  Logger.debug("Pre Update Token | ",scene,token,updateData,diff,id);

  //Lingering Injuries
  if(game.settings.get('advanced-combat-options','LI-SETTING') && hasProperty(updateData, "actorData.data.attributes.hp.value"))
  {
    LI_module.onChange_Token(token,updateData);
  }

  //Massive Damage
  if(game.settings.get('advanced-combat-options','MD-SETTING') && hasProperty(updateData, "actorData.data.attributes.hp.value"))
  {
    MD_module.onChange_Token(token,updateData);
  }
});

Hooks.on(`renderLongRestDialog`, (dialog, html)=> { 
  Logger.info(`Render Long Rest Dialog Capture`);
  Logger.debug(`Hooks | Render Long Rest Dialog | Variables | `, dialog,html);
  if(game.settings.get('advanced-combat-options','HS-SETTING'))
  {
    document.getElementById(`long-rest`)[1].addEventListener("click", async () => { 
      await HS_module.onChange_Actor(dialog.actor,"longrest");
    });
  }

  if(game.settings.get('advanced-combat-options','ER-SETTING'))
  {
    document.getElementById(`long-rest`)[1].addEventListener("click", async () => { 
      await ER_module.onChange_Actor(dialog.actor,"longrest");
    });
  }
});

Hooks.on(`renderShortRestDialog`, (dialog,html) => {
  Logger.info(`Render Short Rest Dialog Capture`);
  Logger.debug(`Hooks | Render Short Rest Dialog | Variables | `, dialog,html);
  if(game.settings.get('advanced-combat-options','HS-SETTING'))
  {
    /*
    let previousHD = 0, previousHP = 0, recoveredHD = 0, spentHD = 0, recoveredHP = 0;
    dialog.actor.items.filter(i=>i.data.type === "class").reduce((item)=>{
      previousHD += item.data.data.hitDiceUsed;
    });

    previousHP = dialog.actor.data.data.attributes.hp.value;*/

    document.getElementById(`short-rest-hd`)[3].addEventListener("click", async () => { 
      //spentHD = await HS_module.onChange_Actor(dialog.actor,"shortrest", previousHD);
      await HS_module.onChange_Actor(dialog.actor,"shortrest");
    });

    //hit die & chat message messing with
    /*let hookID = Hooks.on(`preCreateChatMessage`, (message,options,userId) =>{
      Logger.info(`Pre Create Chat message | `, message);
      if(message.content.includes(`takes a short rest spending`))
      {
        let updated_actor = game.actors.get(dialog.actor.id);

        updated_actor.items.filter(i=>i.data.type === "class").reduce((item)=>{
          recoveredHD += item.data.data.hitDiceUsed; //amount of hitdie that are missing
        });

        recoveredHD -= previousHD;
        
        recoveredHP = updated_actor.data.data.attributes.hp.value - previousHP;

        let newMessage = message.content.substr(0, message.content.indexOf('spending'));
        newMessage += `recovered ${recoveredHD} Hit Dice and spent ${spentHD} Hit Dice recovering ${recoveredHP} Hit Points.`;
  
        setProperty(message, "content", newMessage);
        previousHD = 0, previousHP = 0, recoveredHD = 0, spentHD = 0, recoveredHP = 0;
  
        Hooks.off(`preCreateChatMessage`, hookID);
      }
    });*/
  }
});