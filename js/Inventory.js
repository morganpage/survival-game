import items from "./Items.js";

export default class Inventory {
  constructor(){
    this.maxColumns = 8;
    this.maxRows = 3;
    this.selected = 0;
    this.observers = [];

    this.items = {
      //0: {name: "pickaxe", quantity: 1},
      2: {name: "stone", quantity: 3}
    }
    this.addItem({name: "pickaxe", quantity: 2});
    this.addItem({name: "wood",quantity: 3});
  }

  subscribe(fn) {
    this.observers.push(fn);
  }
  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  broadcast(action, data) {
    this.observers.forEach((subscriber) => subscriber(action, data));
  }


  addItem(item){
    let existingKey = Object.keys(this.items).find(key => this.items[key].name === item.name);
    if(existingKey){
      this.items[existingKey].quantity += item.quantity;
    }else{
      for (let index = 0; index < this.maxColumns*this.maxRows; index++) {
        let existingItem = this.items[index];
        if(!existingItem){
          this.items[index] = item;
          break;
        }
      }
    }
    this.broadcast();
  }

  removeItem(itemName){
    let existingKey = Object.keys(this.items).find((key) => this.items[key].name == itemName);
    if (existingKey) {
      this.items[existingKey].quantity--;
      if (this.items[existingKey].quantity <= 0) delete this.items[existingKey];
    }
    this.broadcast();
  }

  getItem(index) {
    return this.items[index];
  }

  moveItem(start,end,item){
    console.log(`start:${start} end:${end}`)
    if(start === end || this.items[end]) return;
    this.items[end] = this.items[start];
    delete this.items[start];
  }

  get selectedItem() {
    return this.items[this.selected];
  }

  getItemFrame(item) {
    //console.log(item);
    return items[item.name].frame;
  }

  getItemInfo(itemName){
    return items[itemName];
  }

  // getItemByName(name) {
  //   let existingKey = Object.keys(this.items).find((key) => this.items[key].name == name);
  //   return this.items[existingKey];
  //   //return this.items.find((i) => i.name === name);
  // }

  getItemQuantity(itemName) {
    return Object.values(this.items).filter(i=>i.name===itemName).map(i => i.quantity).reduce((accumulator, currentValue) => accumulator + currentValue,0);
  }



}