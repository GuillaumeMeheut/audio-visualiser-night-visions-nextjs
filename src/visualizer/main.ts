import Particle from "./particle";

function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export default class Main {
  width: number;
  height: number;
  analyserDataArray: Uint8Array;
  particles: Particle[];

  constructor(
    width: number,
    height: number,
    analyserDataArray: Uint8Array,
    bufferLength: number
  ) {
    this.width = width;
    this.height = height;
    this.analyserDataArray = analyserDataArray;
    this.particles = this.createParticles(bufferLength);
  }

  createParticles(bufferLength: number) {
    return Array.from(
      { length: bufferLength / 2 },
      () =>
        new Particle(this, getRandomInt(this.width), getRandomInt(this.height))
    );
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.width, this.height); // Clear canvas once per frame
    this.particles.forEach((particle) => particle.draw(ctx));
  }

  update(): void {
    this.particles.forEach((particle, index) =>
      particle.update(this.analyserDataArray[index])
    );
  }
}
