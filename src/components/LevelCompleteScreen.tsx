// LevelCompleteScreen.tsx
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ScorePlot from './ScorePlot' // Import the new ScorePlot component
import AdvicePanel from './AdvicePanel' // Add this import
import { LevelData } from './GameScreen'
import { LevelConfig } from '../utils/levels/types'

interface LevelCompleteScreenProps {
  level: number
  onNextLevel: () => void
  levelData: LevelData
  config: LevelConfig
  animate?: boolean
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  level,
  onNextLevel,
  levelData,
  config
}) => {
  const { points, keyHistory, description, level_ind, version } = levelData
  const [percentile, setPercentile] = useState<number | null>(null)
  const currentScore = points[points.length - 1]?.y || 0
  const percentScore = (currentScore / config.maxScore) * 100

  useEffect(() => {
    fetch(`/api/scores?level_ind=${level_ind}&version=${version}`)
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
        const user_id = getUserId()
        submitScore(
          level_ind,
          level,
          currentScore,
          version,
          user_id,
          percentScore
        )
      })
      .catch(error => {
        console.error('Error fetching scores:', error)
        setPercentile(100)
      })
  }, [level, points, level_ind, version])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='game-layout fade-in'>
      <div className='game-content'>
        {config.phase > 1 && (
          <AdvicePanel
            adviceIndices={config.adviceIndices}
            animate={false}
            showRule={true}
          />
        )}

        <div className='main-content'>
          <h2 className='title'>Level {level} Complete</h2>

          <p className='score-text'>
            You scored {currentScore}/{config.maxScore} ={' '}
            <strong>{percentScore.toFixed(1)}% </strong> which was better than{' '}
            <strong>{percentile?.toFixed(1)}%</strong> of players.
          </p>
          <div className='level-description'>
            {description(points, keyHistory, percentile ?? 100)}
          </div>

          <div className='plot-section'>
            <ScorePlot
              points={points}
              keyHistory={keyHistory}
              xDomain={[0, config.maxSteps]}
            />
          </div>

          <div className='button-container'>
            <button onClick={onNextLevel} autoFocus>
              Next Level
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const getUserId = () => {
  let user_id = localStorage.getItem('user_id')
  if (!user_id) {
    user_id = uuidv4()
    localStorage.setItem('user_id', user_id)
  }
  return user_id
}

const submitScore = async (
  level_ind: number,
  level: number,
  score: number,
  version: number,
  user_id: string,
  percentScore: number
) => {
  try {
    console.log({ level_ind, level, score, version, user_id, percentScore })
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        level_ind,
        level,
        score,
        version,
        user_id,
        percentScore
      })
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    console.log('Score submitted successfully:', data)
  } catch (error) {
    console.error('Error submitting score:', error)
  }
}

export default LevelCompleteScreen
