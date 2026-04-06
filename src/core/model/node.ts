export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface GraphNode {
  id: string;
  title: string;
  type: string;
  weight: number;
  position: Position;
  velocity?: Velocity;
  body?: string;
  tags?: string[];
  properties?: Record<string, unknown>;
}
