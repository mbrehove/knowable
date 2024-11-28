// LevelCompleteScreen.js
import React from 'react';
import ScorePlot from './ScorePlot'; // Import the new ScorePlot component
import './style.css';

const LevelCompleteScreen = ({ level, onNextLevel, levelData, config }) => {
  const { points, keyHistory, randomValues, description } = levelData;

  return (
    <div className="level-complete-screen">
      <h1>Leve {level} Complete</h1>
      {description(points, keyHistory)}
      <ScorePlot points={points} keyHistory={keyHistory} xDomain={[0, config.maxSteps]} />
      <button onClick={onNextLevel} autoFocus>
        Press Enter to Continue
      </button>
    </div>
  );
};

export default LevelCompleteScreen;
