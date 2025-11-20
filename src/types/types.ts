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

export interface LevelScoreType {
  levelName: string;
  time: number;
  health: number;
}

export interface terrainBlocksType {
  straight: blockType;
  corners: blockType;
}

export type blockType = string[];
