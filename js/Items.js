//import Ballista from "./Ballista.js";

let items = {
    pickaxe: {frame:162, mats:['wood','wood','stone']},
    shovel : {frame:163, mats:['wood','stone','stone']},
    wood : {frame:272},
    stone : {frame:273},
    berries : {frame:228},
    meat : {frame:241},
    fur : {frame: 280},
    health_potion: {frame: 144},
    wand_fire: {frame: 105},
    // ballista: {frame: 100, mats:['wood','wood','wood'], 
    //   createPlaceable : (data)=>{
    //     return new Ballista({...data,texture:'items',frame:100});
    //   }},
  }
;

export default items;
