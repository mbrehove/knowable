// App.js
import React, { useState, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import GameScreen from './GameScreen';
import LevelCompleteScreen from './LevelCompleteScreen';
import getLevelConfig from './levelConfig.js';

const App = () => {
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'playing', 'levelComplete'
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameData, setGameData] = useState({}); // Stores data from each level
  const [levelConfig, setLevelConfig] = useState(null);

  useEffect(() => {
    if (gameState === 'playing') {
      const config = getLevelConfig(currentLevel);
      const { scoringLogic, randomValues, description } = config.createScoringLogic();
      setLevelConfig({
        maxSteps: config.maxSteps,
        scoringLogic,
        randomValues,
        description,
      });
    }
  }, [gameState, currentLevel]);

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
      {gameState === 'playing' && levelConfig && (
        <GameScreen
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          config={levelConfig}
        />
      )}
      {gameState === 'levelComplete' && (
        <LevelCompleteScreen
          level={currentLevel}
          onNextLevel={proceedToNextLevel}
          levelData={gameData[currentLevel]}
          config={levelConfig}
        />
      )}
    </div>
  );
};

export default App;
