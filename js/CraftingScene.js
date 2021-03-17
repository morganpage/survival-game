import UIBaseScene from "./UIBaseScene.js";

export default class CraftingScene extends UIBaseScene {
    constructor() {
      super("CraftingScene");
      this.craftingSlots = [];
      this.uiScale = 1.0;
    }
  
    init(data) {
      let { mainscene } = data;
      this.mainscene = mainscene;
      this.player = mainscene.player;
      this.crafting = mainscene.crafting;
      this.crafting.inventory.subscribe(() => this.updateCraftableSlots());
    }
  
    create() {
      this.updateCraftableSlots();
      this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        this.crafting.selected = Math.max(0, this.crafting.selected + (deltaY > 0 ? 1 : -1)) % this.crafting.items.length;
        this.updateSelected();
      });
      this.input.keyboard.on("keydown-E", () => {
        this.crafting.craft();
      });
    }
  
    updateSelected() {
      for (let index = 0; index < this.crafting.items.length; index++) {
        this.craftingSlots[index].tint = this.crafting.selected == index ? 0xffff00 : 0xffffff;
      }
    }
  
    updateCraftableSlots() {
      this.crafting.updateItems();
      for (let index = 0; index < this.crafting.items.length; index++) {
        if (this.craftingSlots[index]) {
          this.craftingSlots[index].matItems.forEach((m) => m.destroy());
          this.craftingSlots[index].item.destroy();
          this.craftingSlots[index].destroy();
        }
  
        const item = this.crafting.items[index];
        let x = this.tileSize / 2 + this.margin;
        let y = index * this.tileSize + this.game.config.height / 2;
        this.craftingSlots[index] = this.add.sprite(x, y, "items", 11); //Add the slot background square
        this.craftingSlots[index].item = this.add.sprite(x, y, "items", item.frame); //Add the slot background square
        this.craftingSlots[index].item.tint = item.canCraft ? 0xffffff : 0x555555;
        this.craftingSlots[index].matItems = [];
        for (let matIndex = 0; matIndex < item.matDetails.length; matIndex++) {
          //Add the mats needed to craft the item
          let scale = 0.75;
          const matItem = item.matDetails[matIndex];
          let matItemSlot = this.add.sprite(x + 32 + matIndex * 32 * scale, y, "items", matItem.frame);
          matItemSlot.tint = matItem.available ? 0xffffff : 0x555555;
          matItemSlot.setScale(scale);
          this.craftingSlots[index].matItems.push(matItemSlot);
        }
      }
      this.updateSelected();
    }
  }
  