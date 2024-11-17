// levelConfigs.js
const levelConfigs = [
    {
      maxSteps: 10,
      createScoringLogic: () => {
        // Generate random values for left and right buttons
        const leftValue = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
        const rightValue = Math.floor(Math.random() * 10) + 1;
  
        console.log(`Level 1 - Left Value: ${leftValue}, Right Value: ${rightValue}`);
  
        // Return the scoringLogic function with access to leftValue and rightValue
        return (currentPoints, keyHistory, eventKey) => {
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
      },
    },
    {
      maxSteps: 15,
      createScoringLogic: () => {
        const leftValue = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        const rightValue = Math.floor(Math.random() * 5) + 1;
  
        console.log(`Level 2 - Left Value: ${leftValue}, Right Value: ${rightValue}`);
  
        return (currentPoints, keyHistory, eventKey) => {
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
      },
    },
    // Add more levels as needed
];

const getLevelConfig = (level) => {
    level = level - 1 //Translate from 'starts at 1' for the user to 'starts at zero' for the list
    if (level > levelConfigs.length -1) {
        level = Math.floor(Math.random() * levelConfigs.length); 
    }
    console.log(level)
    return levelConfigs[level]
  };
export default getLevelConfig