// LevelCompleteScreen.js
import React from 'react';

const LevelCompleteScreen = ({ level, onNextLevel, config }) => {
  return (
    <div className="level-complete-screen">
      <h1>Congratulations!</h1>
      <p>You have completed Level {level}.</p>
      {/* Add any additional explanations or summaries here */}
      <button onClick={onNextLevel} autoFocus>Next Level</button>
    </div>
  );
};

export default LevelCompleteScreen;
