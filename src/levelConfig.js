// levelConfig.js
const levelConfigs = [
    () => {
      const maxSteps = 10
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

      const optimalScore = Math.max(leftValue, rightValue) * (maxSteps-1) + Math.min(leftValue, rightValue)
      const description = `
In this level, pressing left gives a score of ${leftValue} and pressing right gives ${rightValue}. 
The optimal strategy would have yielded a score of ${optimalScore}. 

Advice:
"The strategy is simple, really. You just try each of your options and go with the one that gives
you the most points. It's the scientific method. Doing the same thing again and again and 
expecting a different result is the definition of insanity"`.trim();

      return {
        scoringLogic,
        randomValues: { leftValue, rightValue },
        description,
        maxSteps,
      };
    },
    () => {
      const maxSteps = 15
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
        maxSteps
      };
    },
];

const getLevelConfig = (level) => {
  level = level - 1; // Adjust for zero-based index
  if (level > levelConfigs.length - 1) {
    level = Math.floor(Math.random() * levelConfigs.length);
  }
  return levelConfigs[level];
};

export default getLevelConfig;
