export interface MapDataType {
  walls: PositionType[];
  optimizedWalls: PositionType[];
  player: PositionType;
  goal: PositionType;
}

export interface PositionType {
  position: { x: number; y: number };
  scale?: { x: number; y: number };
}
