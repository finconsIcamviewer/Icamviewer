import APP_CONFIG from '../../app.config';

export class Node implements d3.SimulationNodeDatum {
  // optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;

  id: string;
  linkCount: number;
  name: string;
  short:string;
  size: number;
  group: number;

  constructor(id, name, size, group) {
    this.id = id;
    this.size = size;
    this.name= name;
    this.short  = this.name.slice(0,10);
    this.group = group;
    this.linkCount = 0;
  }
  normal = () => {
    return Math.sqrt(this.linkCount / APP_CONFIG.N);
  }

  get r() {
    return 50 * this.normal() + 10;
  }
  get rx() {
    return 200 * this.normal() + 10;
  }
  get ry() {
    return 50 * this.normal() + 10;
  }

  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }

  get color() {
    let index = Math.floor(APP_CONFIG.SPECTRUM.length * this.normal());
    return APP_CONFIG.SPECTRUM[index];
  }

  get width(){
    return this.name.length * 6;
  }
}
