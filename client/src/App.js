// App.js
import React, { useState, useEffect } from 'react'
import WelcomeScreen from './WelcomeScreen.js'
import GameScreen from './GameScreen.js'
import LevelCompleteScreen from './LevelCompleteScreen.js'
import getLevelConfig from './levelConfig.js'

const App = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const urlLevel = parseInt(urlParams.get('level'))
  const level = urlLevel || 1

  const [gameState, setGameState] = useState('welcome') // 'welcome', 'playing', 'levelComplete'
  const [currentLevel, setCurrentLevel] = useState(level)
  const [gameData, setGameData] = useState({}) // Stores data from each level
  const [levelConfig, setLevelConfig] = useState(null)

  useEffect(() => {
    if (gameState === 'playing') {
      const configGen = getLevelConfig(currentLevel)
      const { scoringLogic, randomValues, description, maxSteps } = configGen()
      setLevelConfig({
        scoringLogic,
        randomValues,
        description,
        maxSteps
      })
    }
  }, [gameState, currentLevel])

  const startNewGame = () => {
    setCurrentLevel(level)
    setGameData({})
    setGameState('playing')
  }

  const proceedToNextLevel = () => {
    setCurrentLevel(prevLevel => prevLevel + 1)
    setGameState('playing')
  }

  const handleLevelComplete = levelData => {
    setGameData(prevData => ({
      ...prevData,
      [currentLevel]: levelData
    }))
    fetch('http://localhost:3001/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        level: levelData.level_ind,
        score: levelData.points[levelData.points.length - 1].y
      })
    }).then(() => {
      setGameState('levelComplete')
    })
  }

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
  )
}

export default App
