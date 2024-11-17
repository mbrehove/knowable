// LevelCompleteScreen.js
import React from 'react';
import ScorePlot from './ScorePlot'; // Import the new ScorePlot component
import './style.css';

const LevelCompleteScreen = ({ level, onNextLevel, levelData, config }) => {
  const { points, keyHistory, randomValues, description } = levelData;

  return (
    <div className="level-complete-screen">
      <h1>Congratulations!</h1>
      <p>You have completed Level {level}.</p>
      <p>{description}</p>
      <p>
        Random Values: Left Value = {randomValues.leftValue}, Right Value ={' '}
        {randomValues.rightValue}
      </p>
      <ScorePlot points={points} keyHistory={keyHistory} xDomain={[0, config.maxSteps]} />
      <button onClick={onNextLevel} autoFocus>
        Press Enter to Continue
      </button>
    </div>
  );
};

export default LevelCompleteScreen;
