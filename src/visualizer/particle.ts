import Main from "./main";

interface Position {
  x: number;
  y: number;
}

export default class Particle {
  main: Main;
  radius: number;
  position: Position;
  color: string;

  constructor(main: Main, x: number, y: number) {
    this.main = main;
    this.radius = 3;
    this.position = { x, y };
    this.color = "#6398B8";
  }

  getColor(data: number) {
    if (data <= 48) return "#6398B8";
    if (data <= 96) return "#69B8C2";
    if (data <= 144) return "#65AB9F";
    return "#69C29A";
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.shadowBlur = 30;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update(data: number): void {
    this.radius = data / 12;
    this.color = this.getColor(data);
  }
}
