import * as settings from './settings.js';
import * as LI_module from './lingering-injuries.js';
import * as MD_module from './massive-damage.js';

let debug = true;
let log = (...args) => console.log("Advanced Combat Options | ", ...args);

Hooks.on('init', ()=>{
  settings.registerSettings();
});

Hooks.on('ready', () => {
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

Hooks.on('preUpdateActor', (actor, updateData, difference, id)=>{
  
  if(debug) log(actor,updateData,difference,id);

  //Lingering Injuries
  if(game.settings.get('advanced-combat-options','LI-SETTING'))
  {
    LI_module.onChange(actor,updateData);
  }
  if(game.settings.get('advanced-combat-options','MD-SETTING'))
  {
    MD_module.onChange(actor,updateData);
  }
});