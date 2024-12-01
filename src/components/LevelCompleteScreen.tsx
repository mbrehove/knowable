'use client'

import React from 'react'

interface LevelCompleteScreenProps {
  level: number
  onNextLevel: () => void
  levelData: any
  config: { description: React.ReactNode }
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  level,
  onNextLevel,
  levelData,
  config
}) => {
  return (
    <div>
      <h2>Level {level} Complete!</h2>
      <p>{config.description}</p>
      <p>
        Your Score: {levelData.points?.[levelData.points.length - 1]?.y || 0}
      </p>
      <button onClick={onNextLevel}>Next Level</button>
    </div>
  )
}

export default LevelCompleteScreen
