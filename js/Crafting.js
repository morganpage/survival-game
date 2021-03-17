import items from "./Items.js";
import DropItem from "./DropItem.js";

export default class Crafting {

  constructor(data){
    let {mainscene} = data;
    this.mainscene = mainscene;
    this.inventory = mainscene.player.inventory;
    this.player = mainscene.player;
    this.selected = 0;
    this.items = []; //All the items that can be crafted and their associated mats and availability
  }

  craft(){
    let item = this.items[this.selected];
    if (item.canCraft) {
      new DropItem({ name: item.name, scene: this.mainscene, x: this.player.x - 32, y: this.player.y, frame: item.frame });
      item.matDetails.forEach(matDetail => this.inventory.removeItem(matDetail.name));
    }
  }

  updateItems(){ //
    this.items = [];
    let craftables = Object.keys(items).filter(i => items[i].mats);//Only return items that can be crafted, ie have mats defined
    for (let index = 0; index < craftables.length; index++) {
      const itemName = craftables[index];
      const mats = items[itemName].mats;
      //Now check if we have enough mats
      let lastMat = "";
      let matDetails = [];
      let canCraft = true;
      let qty = 0;
      mats.forEach(mat => {
        qty = (lastMat === mat) ? qty-1 : this.inventory.getItemQuantity(mat);
        let available = (qty > 0);
        matDetails.push({name:mat,frame:items[mat].frame,available});
        lastMat = mat;
        if(!available) canCraft = false;
      });
      this.items.push({name:itemName,frame:items[itemName].frame, matDetails,canCraft});
    }
    //console.log(JSON.stringify(this.items));
  }

}