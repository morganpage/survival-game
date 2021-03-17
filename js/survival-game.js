import MainScene from "./MainScene.js";
import InventoryScene from "./InventoryScene.js";
import CraftingScene from "./CraftingScene.js";

const config = {
  width:512,
  height:512,
  backgroundColor: '#999999',
  type: Phaser.AUTO,
  parent: 'survival-game',
  scene:[MainScene,InventoryScene,CraftingScene],
  scale: {
    zoom:2,
  },
  physics: {
    default: 'matter',
    fps:10,
    matter: {
      debug:false,
      gravity:{y:0},
    }
  },
  plugins: {
    scene:[
      {
        plugin: PhaserMatterCollisionPlugin,
        key: 'matterCollision',
        mapping: 'matterCollision'
      }
    ]
  }
}

new Phaser.Game(config);