'use client'

import React from 'react';
import ScorePlot from './ScorePlot'

interface GameScreenProps {
  level: number
  onLevelComplete: (data: any) => void
  config: {
    scoringLogic: Function
    description: React.ReactNode
    randomValues: object
    maxSteps: number
  }
}

const GameScreen: React.FC<GameScreenProps> = ({
  level,
  onLevelComplete,
  config
}) => {
  const { description, maxSteps } = config

  // Simplify or implement game logic here
  const completeLevel = () => {
    const levelData = { level_ind: level, points: [{ x: 0, y: 10 }] } // Mock data
    onLevelComplete(levelData)
  }

  return (
    <div>
      <h1>Level {level}</h1>
      <ScorePlot points={[]} keyHistory={[]} xDomain={[0, maxSteps]} />
      <p>{description}</p>
      <button onClick={completeLevel}>Finish Level</button>
    </div>
  )
}

export default GameScreen
