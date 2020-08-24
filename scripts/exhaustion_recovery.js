import { Logger } from './logger.js';

export async function onChange_Actor(actor)
{
  //actor.data.data.attributes.exhaustion (int)

  if(actor.data.data.attributes.exhaustion > 0)
  {
    setTimeout(async ()=>{
      actor.update({"data.attributes.exhaustion" : (actor.data.data.attributes.exhaustion - 1)})  
      //look for last chatMessage and append "removed 1 level of exhaustion"
    }, 100); 
  }
}