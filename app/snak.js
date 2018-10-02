import {CanvasFactory} from "Tools";
import Snake, {SnakeController} from 'Snake';
import Board from 'Board';
import Fruit from "Fruit";
import BigTextAnimation from 'BigTextAnimation';



class Game {

  constructor(settings) {
    Object.assign(this, settings);
    this.initCanvas();

    //Init objects

    let {width, height, canvasWidth, canvasHeight} = settings;
    let board = new Board(width, height, canvasWidth, canvasHeight);
    let snake = new Snake(Math.floor(width / 2), Math.floor(height / 2));
    let fruit = Fruit.make(0, 0, width - 1, height - 1,
        snake.getPositionHashSet());

    //Index objects

    this.objects = {snake, fruit, board};
    this.updatables = [snake];
    this.drawables = [board, snake, fruit];

    //Init controllers

    let snakeController = new SnakeController(snake);
    this.controllers = {snakeController};
  }

  initCanvas() {
    let {width, height, canvasWidth, canvasHeight} = this;
    let canvas = CanvasFactory.make(canvasWidth, canvasHeight);
    const container = document.getElementById('canvasContainer');
    container.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    ctx.width = width;
    ctx.height = height;

    Object.assign(this, {canvas, ctx});
  }

  update() {
    let {updatables, running, tickPeriod, previous, collisionsEnabled} = this;

    let dt = Date.now() - previous;
    for (let i = 0; i < updatables.length; i++)
      updatables[i].update(dt);

    if(collisionsEnabled)
        this.detectCollisions();

    this.draw();

    this.previous = Date.now();
    if (running)
      setTimeout(this.update.bind(this), tickPeriod);
  }

  draw() {
    let {ctx, drawables, canvasWidth, canvasHeight, width, height} = this;
    let scaleX = canvasWidth / width;
    let scaleY = canvasHeight / height;


    ctx.fillStyle = "#FFF";
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    for (let i = 0; i < drawables.length; i++) {
      drawables[i].draw(ctx);
      ctx.setTransform(canvasWidth / width,0,0, canvasHeight / height,0,0);

    }
  }

  detectCollisions() {
    let {snake, fruit} = this.objects;
    let {width, height} = this;

    snake.wrap(0, 0, width - 1, height - 1);
    if (snake.collidedWithSelf()) {
      this.onPlayerSelfCollision();
      return;
    }

    let takenTiles = snake.getPositionHashSet();
    if (takenTiles[fruit.getPositionHash()]) {
      this.onPlayerFruitCollision();
    }
  }

  onPlayerSelfCollision() {

    let {updatables, drawables, textAnimationPeriod} = this;
    updatables.length = 0;
    this.collisionsEnabled = false;

    let textAnimation = new BigTextAnimation('YOU DIED', textAnimationPeriod);
    textAnimation.doWhenFinished(this.end.bind(this));
    updatables.push(textAnimation);
    drawables.push(textAnimation);
  }

  onPlayerFruitCollision() {
    let {width, height} = this;
    let {snake, fruit} = this.objects;

    snake.grow();
    Fruit.reset(fruit, 0, 0, width - 1, height - 1, snake.getPositionHashSet());
  }

  run() {
    this.running = true;
    this.collisionsEnabled = true;
    this.previous = Date.now();
    this.update();
  }

  end() {
    let {controllers} = this;
    this.running = false;
    for (let i = 0; i < controllers.length; i++) {
      let controller = controllers[i];
      controller.stop();
    }
  }
}

const game = new Game({
  canvasWidth: 16 * 50,
  canvasHeight: 16 * 50,
  width: 25,
  height: 25,
  tickPeriod: 60,
  textAnimationPeriod: 500
});

game.run();