// levelConfig.js
const levelConfigs = [
  {
    maxSteps: 10,
    createScoringLogic: () => {
      const leftValue = Math.floor(Math.random() * 10) + 1;
      const rightValue = Math.floor(Math.random() * 10) + 1;

      const scoringLogic = (currentPoints, keyHistory, eventKey) => {
        const lastPoint = currentPoints[currentPoints.length - 1];
        const lastY = lastPoint.y;
        let newY;

        if (eventKey === 'ArrowRight') {
          newY = lastY + rightValue;
        } else {
          newY = lastY + leftValue;
        }

        return newY;
      };

      const description = `In this level, pressing left adds ${leftValue}, and pressing right adds ${rightValue}.`;

      return {
        scoringLogic,
        randomValues: { leftValue, rightValue },
        description,
      };
    },
  },
  // Add more levels with potentially different variables
];

const getLevelConfig = (level) => {
  level = level - 1; // Adjust for zero-based index
  if (level > levelConfigs.length - 1) {
    level = Math.floor(Math.random() * levelConfigs.length);
  }
  return levelConfigs[level];
};

export default getLevelConfig;
