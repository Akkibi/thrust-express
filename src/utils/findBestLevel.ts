import { type LevelScoreType } from "../store/store";

export const findBestValues = (
  levelsDone: LevelScoreType[],
  levelName: string,
): LevelScoreType | null => {
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
