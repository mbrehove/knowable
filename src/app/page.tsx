'use client'
import { useState, useEffect } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import GameScreen, { LevelData } from '@/components/GameScreen'
import LevelCompleteScreen from '../components/LevelCompleteScreen'
import getLevelConfig from '../utils/levels/levelManager'
import { LevelConfig } from '../utils/levels/types'
import { numConfigs, phaseEnds } from '../utils/levels/levelManager'
import AboutOverlay from '@/components/AboutOverlay'

export default function GamePage () {
  const [gameState, setGameState] = useState<
    'welcome' | 'playing' | 'levelComplete' | 'about'
  >('welcome')
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameData, setGameData] = useState<{ [key: number]: LevelData }>({})
  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null)

  useEffect(() => {
    if (gameState === 'playing') {
      const config = getLevelConfig(currentLevel)
      setLevelConfig(config as LevelConfig)
    }
  }, [gameState, currentLevel])

  const startNewGame = () => {
    setGameState('playing')
  }

  const skipToNextPhase = () => {
    // Find the next phase end that's greater than current level
    const nextPhaseEnd =
      phaseEnds.find(end => end >= currentLevel) || phaseEnds[0]
    const nextPhaseLevel = nextPhaseEnd + 1
    setCurrentLevel(nextPhaseLevel)
    setGameState('welcome')
  }

  const proceedToNextLevel = () => {
    const nextLevel = currentLevel + 1
    // Check if we're moving to a new phase by seeing if current level is at a phase end
    if (phaseEnds.includes(nextLevel - 1)) {
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
    <div className='container'>
      {gameState === 'welcome' && (
        <div className='about-button-container'>
          <button
            onClick={() => setGameState('about')}
            className='about-button'
          >
            About
          </button>
        </div>
      )}

      {gameState === 'about' && (
        <AboutOverlay onClose={() => setGameState('welcome')} />
      )}

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
