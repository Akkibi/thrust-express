import type { LevelScoreType } from "../types/types";

export const findBestValues = (
  levelsDone: LevelScoreType[],
  levelName: string,
): LevelScoreType | null => {
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
  levelsDone: LevelScoreType[],
  levelName: string,
): LevelScoreType[] => {
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
