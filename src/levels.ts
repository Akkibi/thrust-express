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
    image: "map1.png",
    map: "/mapData/map1.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 1, 0.5],
  },
  {
    name: "Level 1",
    image: "map2.png",
    map: "/mapData/map2.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 1, 1],
  },
  {
    name: "Level 1 bis",
    image: "mapt.png",
    map: "/mapData/mapt.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.8, 1, 0.1],
  },
  {
    name: "Level 2",
    image: "map3.png",
    map: "/mapData/map3.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.5, 0.5, 1],
  },
  {
    name: "Level 3",
    image: "map4.png",
    map: "/mapData/map4.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 1, 0.5],
  },
  {
    name: "Level 3 bis",
    image: "map3bis.png",
    map: "/mapData/map3bis.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [0.2, 0.2, 1],
  },
  {
    name: "Level 4",
    image: "map5.png",
    map: "/mapData/map5.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 0.5, 1],
  },
  {
    name: "Level 5",
    image: "map6.png",
    map: "/mapData/map6.json",
    isDone: false,
    best: { score: 0, time: 0 },
    color: [1, 1, 1],
  },
  {
    name: "Level 6",
    image: "map7.png",
    map: "/mapData/map7.json",
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
