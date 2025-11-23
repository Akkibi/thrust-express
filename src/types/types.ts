export interface IMapData {
  size: { x: number; y: number };
  walls: IObjectMap[];
  optimizedWalls: IObjectMap[];
  player: IObjectMap;
  goal: IObjectMap;
}

export type Vec2 = { x: number; y: number };

export interface IObjectMap {
  position: { x: number; y: number };
  scale?: { x: number; y: number };
}

export interface ILevelScore {
  levelName: string;
  time: number;
  health: number;
}

export interface ITerrainBlocks {
  straight: Block;
  corners: Block;
}

export type Block = string[];
