// App.js
import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen.js';
import LevelCompleteScreen from './LevelCompleteScreen';
import getLevelConfig from './levelConfig.js'

const App = () => {
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'playing', 'levelComplete'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameData, setGameData] = useState({}); // Stores data from each level

  const startNewGame = () => {
    setCurrentLevel(1);
    setGameData({});
    setGameState('playing');
  };

  const proceedToNextLevel = () => {
    setCurrentLevel((prevLevel) => prevLevel + 1);
    setGameState('playing');
  };

  const handleLevelComplete = (levelData) => {
    setGameData((prevData) => ({
      ...prevData,
      [currentLevel]: levelData,
    }));
    setGameState('levelComplete');
  };

  return (
    <div>
      {gameState === 'welcome' && <WelcomeScreen onStart={startNewGame} />}
      {gameState === 'playing' && (
        <GameScreen
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          config={getLevelConfig(currentLevel)}
        />
      )}
      {gameState === 'levelComplete' && (
        <LevelCompleteScreen
          level={currentLevel}
          onNextLevel={proceedToNextLevel}
          config={getLevelConfig(currentLevel)}
        />
      )}
    </div>
  );
};

export default App;
