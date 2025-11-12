import { eventEmitter } from "./utils/eventEmitter";

export interface LevelType {
  name: string;
  isDone: boolean;
  image: string;
  map: string | null;
  score: number;
  loadedMap: HTMLImageElement | null;
}

const levels: LevelType[] = [
  {
    name: "Tutorial",
    isDone: false,
    image: "level1.png",
    map: "/maps/map1.png",
    loadedMap: null,
    score: 0,
  },
  {
    name: "Level 1",
    isDone: false,
    image: "level2.png",
    map: "/maps/map2.png",
    loadedMap: null,
    score: 0,
  },
  {
    name: "Level 2",
    isDone: false,
    image: "level3.png",
    map: null,
    loadedMap: null,
    score: 0,
  },
  {
    name: "Level 3",
    isDone: false,
    image: "level3.png",
    map: null,
    loadedMap: null,
    score: 0,
  },
  {
    name: "Level 4",
    isDone: false,
    image: "level3.png",
    map: null,
    loadedMap: null,
    score: 0,
  },
];

export default levels;

const loadLevels = () => {
  for (let i = 0; i < levels.length; i++) {
    const imagePath = levels[i].map;
    if (!imagePath) continue;
    const image = new Image();
    image.src = imagePath;
    image.onload = () => {
      levels[i].loadedMap = image;
    };
  }
  eventEmitter.trigger("load-levels-map-images");
};

loadLevels();
