import { Logger } from './logger.js';

import * as settings from './settings.js';
import * as LI_module from './lingering-injuries.js';
import * as MD_module from './massive-damage.js';
import * as TH_module from './token_hp.js';

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
  });
});

Hooks.on('preCreateToken', (scene,token,options,id) => {
  Logger.info("Pre Create Token Capture");
  Logger.debug("Pre Create Token | ", scene,token,options,id);

  TH_module.onCreate(scene,token);
});

Hooks.on('preUpdateActor', (actor, updateData, difference, id)=>{
  Logger.info("Pre Update Actor Capture");
  Logger.debug("Pre Update Actor | ",actor,updateData,difference,id);

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
});

Hooks.on('preUpdateToken', (scene,token,updateData,difference, id)=>{
  Logger.info("Pre Update Token Capture");
  Logger.debug("Pre Update Token | ",scene,token,updateData,difference,id);

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