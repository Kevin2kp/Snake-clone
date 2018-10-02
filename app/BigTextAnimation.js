export default class BigTextAnimation {
  constructor(string, duration) {
    this.string = string;
    this.timeElapsed = 0;
    this.duration = duration;
    this.fontSize = 72;

    this.callback = undefined;
  }

  draw(ctx) {
    let {timeElapsed, duration, fontSize, string} = this;
    let animationScaling = Math.min(timeElapsed / duration, 1);

    ctx.setTransform(animationScaling, 0, 0, animationScaling, 0, 0);

    ctx.font = ` ${fontSize}pt 'Arial Black'`;
    let textWidth = ctx.measureText(string).width * animationScaling;
    // noinspection JSSuspiciousNameCombination
    let textHeight = ctx.measureText('M').width * animationScaling;

    let x = (ctx.canvas.clientWidth - textWidth) / (2 * animationScaling);
    let y = (ctx.canvas.clientHeight - textHeight) / (2 * animationScaling);

    ctx.lineWidth = 2;
    ctx.fillStyle = '#A00';
    ctx.strokeStyle = '#000';
    ctx.fillText(string, x, y);
    ctx.strokeText(string, x, y);
  }

  update(dt) {
    this.timeElapsed += dt;
    if (this.done() && this.callback)
      this.callback();
  }

  done() {
    return this.timeElapsed >= this.duration;
  }

  doWhenFinished(callback) {
    this.callback = callback;
    return this;
  }
}