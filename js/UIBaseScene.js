export default class UIBaseScene extends Phaser.Scene {
    constructor(name){
        super(name);
        this.margin = 8;
        this.uiScale = 1.5;
        this._tileSize = 32;
    }

    get tileSize() {
        return this._tileSize * this.uiScale;
    }

}