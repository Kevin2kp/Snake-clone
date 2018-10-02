import {CanvasFactory} from "Tools";

export default class Board {
  constructor(gridWidth, gridHeight, canvasWidth, canvasHeight) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.initModelBuffer();
  }

  initModelBuffer() {
    let {canvasWidth, canvasHeight, gridWidth, gridHeight} = this;
    let canvas = CanvasFactory.make(canvasWidth, canvasHeight);
    let ctx = canvas.getContext('2d');
    let scaleX = canvasWidth / gridWidth;
    let scaleY = canvasHeight / gridHeight;

    //Draw vertical lines
    for (let i = 0; i <= gridWidth; i++) {
      ctx.moveTo(i * scaleX, 0);
      ctx.lineTo(i * scaleX, canvasHeight);
    }

    //Draw horizontal lines
    for (let i = 0; i <= gridHeight; i++) {
      ctx.moveTo(0, i * scaleY);
      ctx.lineTo(canvasWidth, i * scaleY);
    }

    ctx.fillStyle = '#FFF';
    ctx.strokeStyle = '#BBB';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.stroke();

    this.modelBuffer = canvas;
  }

  draw(ctx) {
    let {modelBuffer, gridWidth, gridHeight} = this;
    ctx.drawImage(modelBuffer, 0, 0, gridWidth, gridHeight);
  }
}