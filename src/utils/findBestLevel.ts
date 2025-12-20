import type { ILevelScore } from "../types/types";

export const findBestValues = (
  levelsDone: ILevelScore[],
  levelName: string,
): ILevelScore | null => {
  if (levelsDone.length <= 0) return null;
  const scores = levelsDone.filter(
    (currentLevel) => currentLevel.levelName === levelName,
  );

  if (scores.length <= 0) return null;
  const bestTime = scores.reduce((acc, current) => {
    if (current.time < acc.time) {
      return current;
    }
    return acc;
  });
  const bestScore = scores.reduce((acc, current) => {
    if (current.health > acc.health) {
      return current;
    }
    return acc;
  });

  return {
    levelName: levelName,
    health: bestScore.health,
    time: bestTime.time,
  };
};

export const orderBestValues = (
  levelsDone: ILevelScore[],
  levelName: string,
): ILevelScore[] => {
  if (levelsDone.length <= 0) return [];
  const scores = levelsDone.filter(
    (currentLevel) => currentLevel.levelName === levelName,
  );

  if (scores.length <= 0) return [];

  // order scores by less time
  return scores.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return b.health - a.health;
  });
};

export const getMostRecentValues = (
  levelsDone: ILevelScore[],
  levelName: string,
): ILevelScore | null => {
  if (levelsDone.length <= 0) return null;
  const scores = levelsDone.filter(
    (currentLevel) => currentLevel.levelName === levelName,
  );

  if (scores.length <= 0) return null;

  return scores[scores.length - 1];
};
