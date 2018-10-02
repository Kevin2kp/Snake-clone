import {CanvasFactory} from 'Tools';

export default class Snake {

  constructor(x, y) {
    x = x | 0;
    y = y | 0;
    this.vx = 1;
    this.vy = 0;
    this.elapsed = 0;
    this.dt_threshold = 210;
    this.nodes = [{x, y}];
    this.grownSinceLastUpdate = 0;
    this.addNode(--x, y);
    this.addNode(--x, y);
    this.initModelBuffer();
  }

  initModelBuffer() {
    let {nodes} = this;
    let sqSize = 30;
    let canvas = CanvasFactory.make(sqSize, sqSize);
    let ctx = canvas.getContext('2d');

    ctx.fillStyle = '#AAA';
    ctx.strokeStyle = '#000';
    ctx.fillRect(0, 0, sqSize, sqSize);
    ctx.rect(0, 0, sqSize, sqSize);
    ctx.stroke();
    this.modelBuffer = canvas;
  }

  tick() {

    let tail;
    let head = this.nodes[0];

    if (this.grownSinceLastUpdate > 0) {
      this.grownSinceLastUpdate--;
      tail = {};
    }

    else {
      tail = this.nodes.pop();
    }

    tail.x = head.x;
    tail.y = head.y;

    this.updateNode(tail);
    this.nodes.splice(0, 0, tail);
  }

  update(dt) {
    let {dt_threshold} = this;
    this.elapsed += dt;
    if (this.elapsed >= dt_threshold) {
      this.tick();
      this.elapsed -= dt_threshold;
    }
  }

  updateNode(node) {
    node.x += this.vx;
    node.y += this.vy;
  }

  grow() {
    this.grownSinceLastUpdate++;
    if(this.dt_threshold > 30){
      this.dt_threshold -= 30;
    }
  }

  addNode(x, y) {
    this.nodes.push({x, y});
  }

  draw(ctx) {
    let {nodes} = this;
    for (let i = 0; i < nodes.length; i++) {
      let current = nodes[i];
      ctx.drawImage(this.modelBuffer, current.x, current.y, 1, 1);
    }
  }

  collidedWithSelf() {
    let tiles = {};
    let nodes = this.nodes;
    for (let i = 0; i < nodes.length; i++) {
      let currentNode = nodes[i];
      let hash = currentNode.x * 100 + currentNode.y;

      if (tiles[hash]) {
        return true;
      } else {
        tiles[hash] = true;
      }
    }
    return false;
  }

  wrap(minX, minY, maxX, maxY) {

    let nodes = this.nodes;
    for (let i = 0; i < nodes.length; i++) {

      let node = nodes[i];

      if (node.x > maxX) {
        node.x = minX;
      }

      if (node.y > maxY) {
        node.y = minY;
      }

      if (node.y < minY) {
        node.y = maxY;
      }

      if (node.x < minX) {
        node.x = maxX;
      }
    }
  }

  getPositionHashSet() {
    let tiles = {};
    let nodes = this.nodes;
    for (let i = 0; i < nodes.length; i++) {
      let current = nodes[i];
      tiles[current.x * 100 + current.y] = true;
    }

    return tiles;
  }

  getSecondNode() {
    return this.nodes[1];
  }

  getHead() {
    return this.nodes[0];
  }
}

export class SnakeController {
  constructor(snake) {
    this.snake = snake;
    this.eventType = 'keydown';
    document.addEventListener(this.eventType, this);
  }

  handleEvent(event) {
    switch (event.key) {
      case 'ArrowLeft':
        this.left();
        break;

      case  'ArrowUp':
        this.up();
        break;

      case 'ArrowRight':
        this.right();
        break;

      case 'ArrowDown':
        this.down();
        break;
    }
  }

  left() {
    if (this.snake.getSecondNode().x === this.snake.getHead().x) {
      this.snake.vx = -1;
      this.snake.vy = 0;
    }
  }

  right() {
    if (this.snake.getSecondNode().x === this.snake.getHead().x) {
      this.snake.vx = 1;
      this.snake.vy = 0;
    }
  }

  up() {
    if (this.snake.getSecondNode().y === this.snake.getHead().y) {
      this.snake.vy = -1;
      this.snake.vx = 0;
    }
  }

  down() {
    if (this.snake.getSecondNode().y === this.snake.getHead().y) {
      this.snake.vy = 1;
      this.snake.vx = 0;
    }
  }

  stop() {
    removeEventListener(this.eventType, this.handleEvent);
  }
}