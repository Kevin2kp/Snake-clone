import {CanvasFactory} from "Tools";

export default class Fruit {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 1;
    this.height = 1;
    this.initModelBuffer();
  }

  initModelBuffer() {
    let sqSize = 30;
    let canvas = CanvasFactory.make(sqSize, sqSize);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#A33';
    ctx.strokeStyle = '#500';
    ctx.fillRect(0, 0, sqSize, sqSize);
    ctx.rect(0, 0, sqSize, sqSize);
    ctx.stroke();
    this.modelBuffer = canvas;
  }

  draw(ctx) {
    ctx.drawImage(this.modelBuffer, this.x, this.y, this.width, this.height);
  }

  static make(minX, minY, maxX, maxY, takenTiles) {
    return Fruit.reset(new Fruit(), minX, minY, maxX, maxY, takenTiles);
  }

  static reset(fruit, minX, minY, maxX, maxY, takenTiles) {
    let x, y;
    do {
      x = Math.round(Math.random() * maxX + minX);
      y = Math.round(Math.random() * maxY + minY);
    } while (takenTiles[x * 100 + y]);

    fruit.x = x;
    fruit.y = y;
    return fruit;
  }

  getPositionHash() {
    return this.x * 100 + this.y;
  }
}