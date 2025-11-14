export interface LevelType {
  name: string;
  isDone: boolean;
  image: string;
  map: string | null;
  score: number;
}

export const lastLevel: { level: LevelType | null } = {
  level: null,
};

const levels: LevelType[] = [
  {
    name: "Tutorial",
    isDone: false,
    image: "level1.png",
    map: "/mapData/map1.json",
    score: 0,
  },
  {
    name: "Level 1",
    isDone: false,
    image: "level2.png",
    map: "/mapData/map2.json",
    score: 0,
  },
  {
    name: "Level 2",
    isDone: false,
    image: "level3.png",
    map: "/mapData/map3.json",
    score: 0,
  },
  {
    name: "Level 3",
    isDone: false,
    image: "level3.png",
    map: null,
    score: 0,
  },
  {
    name: "Level 4",
    isDone: false,
    image: "level3.png",
    map: null,
    score: 0,
  },
];

export default levels;
