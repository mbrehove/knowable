// LevelCompleteScreen.tsx
import React, { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import ScorePlot from './ScorePlot' // Import the new ScorePlot component
import AdvicePanel from './AdvicePanel' // Add this import
import { LevelData } from './GameScreen'
import { LevelConfig } from '../utils/types'
import { calculatePercentile, fetchScores, submitScore } from '../utils/utils'

interface LevelCompleteScreenProps {
  level: number
  onNextLevel: () => void
  onReplayLevel?: () => void
  levelData: LevelData
  config: LevelConfig
  animate?: boolean
}

const LevelCompleteScreen: React.FC<LevelCompleteScreenProps> = ({
  level,
  onNextLevel,
  onReplayLevel,
  levelData,
  config
}) => {
  const { points, keyHistory, description, level_ind, version } = levelData
  const [percentile, setPercentile] = useState<number | null>(null)
  const currentScore = points[points.length - 1]?.y || 0
  const percentScore = (currentScore / config.maxScore) * 100

  // Calculate accuracy array using the config's accuracy function
  const accuracyArray = config.accuracy(points, keyHistory)
  const totalCorrect = accuracyArray.filter(Boolean).length

  useEffect(() => {
    const fetchAndSubmitScore = async () => {
      try {
        const currentScore = points[points.length - 1]?.y || 0
        const scores = await fetchScores(level_ind, version)
        const calculatedPercentile = calculatePercentile(currentScore, scores)
        setPercentile(calculatedPercentile)

        const user_id = getUserId()
        await submitScore({
          level_ind,
          level,
          score: currentScore,
          version,
          user_id,
          percentScore
        })
      } catch (error) {
        console.error('Error handling scores:', error)
        setPercentile(100)
      }
    }

    fetchAndSubmitScore()
  }, [level, points, level_ind, version, percentScore])

  // Add background color effect
  useEffect(() => {
    const root = document.documentElement
    if (config.phase <= 1) {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-0)'
      )
    } else if (config.phase <= 3) {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-2)'
      )
    } else {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-4)'
      )
    }
  }, [config.phase])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className='game-layout fade-in'>
      <div className='game-content'>
        {config.advice.image && (
          <div className='author-image-container'>
            <Image
              src={config.advice.image}
              alt={config.advice.author}
              className='author-image'
              width={350}
              height={300}
            />
            <i>
              {config.advice.quote}
              <br />
            </i>
            -{config.advice.author}
          </div>
        )}
        {config.phase > 1 && (
          <AdvicePanel
            adviceIndices={config.adviceIndices}
            animate={false}
            showRule={true}
          />
        )}

        <div className='main-content'>
          <h2 className='title'>Level {level} Complete</h2>

          <div className='score-text'>
            <table>
              <tbody>
                <tr>
                  <td>Score:</td>
                  <td>
                    {currentScore}/{config.maxScore}
                  </td>
                  <td>
                    <strong>{percentScore.toFixed(0)}%</strong>
                  </td>
                </tr>
                <tr>
                  <td>Accuracy:</td>
                  <td>
                    {totalCorrect}/{accuracyArray.length}
                  </td>
                  <td>
                    <strong>
                      {((totalCorrect / accuracyArray.length) * 100).toFixed(0)}
                      %
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td>Percentile:</td>
                  <td></td>
                  <td colSpan={2}>
                    <strong>{percentile?.toFixed(0)}%</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='level-description'>
            {description(points, keyHistory, percentile ?? 100)}
          </div>

          <div className='plot-section'>
            <ScorePlot
              points={points}
              keyHistory={keyHistory}
              xDomain={[0, config.maxSteps]}
              accuracy={accuracyArray}
            />
          </div>

          <div className='button-container'>
            {config.phase === 1 && onReplayLevel && (
              <button onClick={onReplayLevel}>Replay Level</button>
            )}
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

export default LevelCompleteScreen
