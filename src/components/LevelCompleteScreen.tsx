// LevelCompleteScreen.tsx
import React, { useState, useEffect } from 'react'
import ScorePlot from './ScorePlot' // Import the new ScorePlot component
import { LevelConfig } from '../utils/levelConfig'

interface LevelCompleteScreenProps {
  level: number
  onNextLevel: () => void
  levelData: {
    points: { x: number; y: number }[]
    keyHistory: { key: string; time: number }[]
    randomValues: Record<string, number>
    description: LevelConfig['description']
    level_ind: number
  }
  config: {
    maxSteps: number
  }
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  level,
  onNextLevel,
  levelData,
  config
}) => {
  const { points, keyHistory, description, level_ind } = levelData
  const [percentile, setPercentile] = useState<number | null>(null)

  useEffect(() => {
    fetch(`http://localhost:3001/api/scores/${level_ind}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((scores: number[]) => {
        const currentScore = points[points.length - 1]?.y || 0
        if (scores.length === 0) {
          setPercentile(100)
        } else {
          const sortedScores = scores.sort((a, b) => a - b)
          const rank =
            sortedScores.findIndex(score => score >= currentScore) + 1
          const percentile = (rank / sortedScores.length) * 100
          setPercentile(percentile)
        }
      })
      .catch(error => {
        console.error('Error fetching scores:', error)
        setPercentile(100)
      })
  }, [level, points, level_ind])

  return (
    <div className='level-complete-screen'>
      <h2>Level {level} Complete</h2>
      {description(points, keyHistory, percentile ?? 100)}
      <ScorePlot
        points={points}
        keyHistory={keyHistory}
        xDomain={[0, config.maxSteps]}
      />
      <button onClick={onNextLevel} autoFocus>
        Press Enter to Continue
      </button>
      <div className='button-container'>
        <button onClick={onNextLevel}>Next Level</button>
      </div>
    </div>
  )
}

export default LevelCompleteScreen
