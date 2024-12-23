'use client'
import { useState, useEffect } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import GameScreen, { LevelData } from '@/components/GameScreen'
import LevelCompleteScreen from '../components/LevelCompleteScreen'
import getLevelConfig, {
  LevelConfig,
  numberOfLevels
} from '../utils/levelConfig'

export default function GamePage () {
  const [gameState, setGameState] = useState('welcome')
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameData, setGameData] = useState<{ [key: number]: LevelData }>({})
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null)

  useEffect(() => {
    if (gameState === 'playing') {
      const config = getLevelConfig(currentLevel, gameState)
      setLevelConfig(config as LevelConfig)
    }
  }, [gameState, currentLevel])

  const startNewGame = () => {
    setGameState('playing')
  }

  const skipToNextPhase = () => {
    const nextPhaseLevel =
      Math.ceil(currentLevel / numberOfLevels) * numberOfLevels + 1
    setCurrentLevel(nextPhaseLevel)
    setGameState('welcome')
  }

  const proceedToNextLevel = () => {
    const nextLevel = currentLevel + 1
    // Check if we're moving to a new phase
    if (nextLevel % numberOfLevels === 1) {
      setCurrentLevel(nextLevel)
      setGameState('welcome')
    } else {
      setCurrentLevel(nextLevel)
      setGameState('playing')
    }
  }

  const handleLevelComplete = (levelData: LevelData) => {
    setGameData(prevData => ({
      ...prevData,
      [currentLevel]: levelData
    }))
    setGameState('levelComplete')
  }

  return (
    <div>
      {gameState === 'welcome' && (
        <WelcomeScreen
          onStart={startNewGame}
          onSkip={skipToNextPhase}
          level={currentLevel}
        />
      )}
      {gameState === 'playing' && levelConfig && (
        <GameScreen
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          config={levelConfig}
        />
      )}
      {gameState === 'levelComplete' && levelConfig && (
        <LevelCompleteScreen
          level={currentLevel}
          onNextLevel={proceedToNextLevel}
          levelData={gameData[currentLevel]}
          config={levelConfig}
          animate={false}
        />
      )}
    </div>
  )
}
