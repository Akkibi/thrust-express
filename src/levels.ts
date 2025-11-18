export interface LevelType {
  name: string;
  isDone: boolean;
  image: string;
  map: string | null;
  best: { score: number; time: number };
  color: number[];
}

export const lastLevel: { level: LevelType | null } = {
  level: null,
};

const levels: LevelType[] = [
  {
    name: "Tutorial",
    image: "level1.png",
    map: "/mapData/map1.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 1, 1],
  },
  {
    name: "Level 1",
    image: "level2.png",
    map: "/mapData/map2.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 0.9, 0.5],
  },
  {
    name: "Level 2",
    image: "level3.png",
    map: "/mapData/map2bis.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0, 0],
  },
  {
    name: "Level 3",
    image: "level3.png",
    map: "/mapData/map3.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0.25, 0.5],
  },
  {
    name: "Level 4",
    image: "level3.png",
    map: "/mapData/map4.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0.1, 0.1],
  },
];

export default levels;
