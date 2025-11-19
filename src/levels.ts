export interface LevelType {
  name: string;
  isDone: boolean;
  image: string;
  map: string | null;
  best: { score: number; time: number };
  color: number[];
}

const levels: LevelType[] = [
  {
    name: "Tutorial",
    image: "tuto.png",
    map: "/mapData/tuto.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 1, 0.5],
  },
  {
    name: "Level 1",
    image: "map1.png",
    map: "/mapData/map1.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 1, 1],
  },
  {
    name: "Level 2",
    image: "map2.png",
    map: "/mapData/map2.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 0.5, 1],
  },
  {
    name: "Level 3",
    image: "map3.png",
    map: "/mapData/map3.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 1, 0.5],
  },
  {
    name: "Level 4",
    image: "map4.png",
    map: "/mapData/map4.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0.5, 1],
  },
  {
    name: "Level 5",
    image: "map5.png",
    map: "/mapData/map5.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 1, 1],
  },
  {
    name: "Level 6",
    image: "map6.png",
    map: "/mapData/map6.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 0.5, 0.5],
  },
  {
    name: "Level 10",
    image: "map10.png",
    map: "/mapData/map10.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0.1, 0.1],
  },
];

export default levels;
