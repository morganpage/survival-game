import items from "./Items.js";
import UIBaseScene from "./UIBaseScene.js";

export default class InventoryScene extends UIBaseScene {
  constructor(){
    super("InventoryScene");
    this.rows = 1;
    this.gridSpacing = 4;
    this.inventorySlots = [];
  }
  init(data) {
    let { mainScene } = data;
    this.mainScene = mainScene;
    this.inventory = mainScene.player.inventory;
    this.maxColumns = this.inventory.maxColumns;
    this.maxRows = this.inventory.maxRows;
    this.inventory.subscribe(() => this.refresh());
  }

  destroyInventorySlot(inventorySlot) {
    if (inventorySlot.item) inventorySlot.item.destroy();
    if (inventorySlot.quantityText) inventorySlot.quantityText.destroy();
    inventorySlot.destroy();
  }

  refresh() {
    this.inventorySlots.forEach((s) => this.destroyInventorySlot(s));
    this.inventorySlots = [];
    for (let index = 0; index < this.maxColumns * this.rows; index++) {
      let x = this.margin + this.tileSize / 2 + (index % this.maxColumns) * (this.tileSize + this.gridSpacing);
      let y = this.margin + this.tileSize / 2 + Math.floor(index/this.maxColumns) * (this.tileSize + this.gridSpacing);      
      let inventorySlot = this.add.sprite(x,y,"items",11);
      inventorySlot.setScale(this.uiScale);
      inventorySlot.depth = -1;
      inventorySlot.setInteractive();
      inventorySlot.on("pointerover", (pointer) => {
        //console.log(`po:${index}`);
        this.hoverIndex = index;
        //this.hoverIndex = this.dragging ? index : -1;
        //console.log(this.hoverIndex);
      });


      let item = this.inventory.getItem(index);
      if(item){
        inventorySlot.item = this.add.sprite(inventorySlot.x,inventorySlot.y - this.tileSize/12,"items",this.inventory.getItemFrame(item));
        inventorySlot.quantityText = this.add.text(inventorySlot.x,inventorySlot.y + this.tileSize/6,item.quantity,{
          font: "11px Courier",
          fill: "#111"
        }).setOrigin(0.5,0);     
      
        //DRAGGING
        inventorySlot.item.setInteractive();
        this.input.setDraggable(inventorySlot.item);
      
      
      }
      this.inventorySlots.push(inventorySlot);
    }
    this.updateSelected();
  }


  updateSelected() {
    //console.log(this.inventorySlots);
    for (let index = 0; index < this.maxColumns; index++) {
      this.inventorySlots[index].tint = this.inventory.selected == index ? 0xffff00 : 0xffffff;
    }
  }

  create() {
    //Instructions
    let instructions = "Move - A W S D\nAction - Mouse Left Click\nInventory Toggle - I\nCraft Menu Toggle - C\nCraft - E";
    this.add.text(10,this.game.config.height-10,instructions,{
      font: "12px Courier",
      fill: "#FFF"
    }).setOrigin(0,1);     



    //SELECTION
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if(this.scene.isActive("CraftingScene")) return;
      this.inventory.selected = Math.max(0, this.inventory.selected + (deltaY > 0 ? 1 : -1)) % this.maxColumns;
      this.updateSelected();
    });



    this.input.keyboard.on("keydown-I", () => {
      //this.input.keyboard.resetKeys(); //Stops sticky keys
      this.rows = this.rows == 1 ? this.maxRows : 1;
      this.refresh();
    });

    //DRAGGING
    this.input.setTopOnly(false);
    this.input.on("dragstart",()=>{
      console.log("sgfdg");
      this.startIndex = this.hoverIndex
      this.inventorySlots[this.startIndex].quantityText.destroy();
    });

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      //if (!this.draggable) return;
      console.log("drag:" + this.hoverIndex);
      //this.hoverIndex = -1;
      this.dragging = true;
      //gameObject.removeInteractive();
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    this.input.on("dragend", (pointer, gameObject) => {
      console.log("Do some");
      //gameObject.ondragend(pointer, gameObject);
      this.dragging = false;
      this.inventory.moveItem(this.startIndex, this.hoverIndex);
      this.refresh();
    });



    this.refresh();
  }
  render() {
    myGame.debug.text(myGame.time.fps, 5, 14, '#00ff00');
  }
}