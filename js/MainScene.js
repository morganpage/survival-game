import Player from "./Player.js";
import Resource from "./Resource.js";
import Enemy from "./Enemy.js";
import Crafting from "./Crafting.js"

export default class MainScene extends Phaser.Scene {
  constructor(){
    super("MainScene");
    this.enemies = [];
  }

  preload() {
    Player.preload(this);
    Enemy.preload(this);
    Resource.preload(this);
    this.load.image('tiles','assets/images/RPGNatureTilesetExtruded.png');
    this.load.tilemapTiledJSON('map','assets/images/map.json');
  }

  create(){
    this.input.setDefaultCursor('url(assets/images/cursor.png), pointer')
    const map = this.make.tilemap({key: 'map'});
    this.map = map;
    const tileset = map.addTilesetImage('RPG Nature Tileset','tiles',32,32,1,2);
    const layer1 = map.createStaticLayer('Tile Layer 1',tileset,0,0);
    const layer2 = map.createStaticLayer('Tile Layer 2',tileset,0,0);
    layer1.setCollisionByProperty({collides:true});
    this.matter.world.convertTilemapLayer(layer1);
    this.map.getObjectLayer('Resources').objects.forEach(resource =>new Resource({scene:this,resource}));
    this.map.getObjectLayer('Enemies').objects.forEach(enemy => this.enemies.push(new Enemy({scene:this,enemy})));
    this.player = new Player({scene:this,x:200,y:220,texture:'female',frame:'townsfolk_f_idle_1'});
    this.player.inputKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    })
    let camera = this.cameras.main;
    camera.zoom = 2;
    camera.startFollow(this.player);
    camera.setLerp(0.1,0.1);
    camera.setBounds(0,0,this.game.config.width,this.game.config.height);
    this.scene.launch('InventoryScene',{mainScene:this});



    this.crafting = new Crafting({mainscene:this});
    this.craftingOpen = false;

    this.input.keyboard.on('keydown-C', () => {
      this.input.keyboard.resetKeys(); //Stops sticky keys
      if(this.craftingOpen){
        //this.scene.resume("MainScene");
        this.scene.stop('CraftingScene');
        this.craftingOpen = false;
      }else{
        //this.scene.resume("MainScene");
        this.scene.launch('CraftingScene',{mainscene:this});
        this.craftingOpen = true;
        //this.scene.stop();
      }

      
      //this.scene.pause();
    });


  }

  update(time,delta){
    this.enemies.forEach(enemy => enemy.update(delta));
    this.player.update(delta);
  }
}