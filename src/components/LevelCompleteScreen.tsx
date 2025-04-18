// LevelCompleteScreen.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
// import Image from 'next/image'
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
  const [isMobile, setIsMobile] = useState(false)
  const hasSubmittedRef = useRef(false)
  const screenRef = useRef<HTMLDivElement>(null)
  const currentScore = points[points.length - 1]?.y || 0
  const percentScore = (currentScore / config.maxScore) * 100

  // Calculate accuracy array using the config's accuracy function
  const accuracyArray = config.accuracy(points, keyHistory)
  const totalCorrect = accuracyArray.filter(Boolean).length
  const accuracy = totalCorrect / accuracyArray.length

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle key press for keyboard navigation
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onNextLevel()
      }
    },
    [onNextLevel]
  )

  // Add the keypress listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Handle tap/click for navigation on mobile
  const handleTap = useCallback(
    (event: React.MouseEvent) => {
      // Don't trigger next level if clicking on a button
      if (
        isMobile &&
        !(event.target as HTMLElement).closest('.button-container') &&
        !(event.target as HTMLElement).closest('button')
      ) {
        onNextLevel()
      }
    },
    [isMobile, onNextLevel]
  )

  useEffect(() => {
    const fetchAndSubmitScore = async () => {
      if (hasSubmittedRef.current) return
      try {
        hasSubmittedRef.current = true
        const scores = await fetchScores(level_ind, version)
        const calculatedPercentile = calculatePercentile(currentScore, scores)
        setPercentile(calculatedPercentile)

        const user_id = getUserId()
        console.log('Attempting to submit score:', {
          level_ind,
          level,
          score: currentScore,
          version,
          user_id,
          percentScore,
          accuracy,
          phase: config.phase,
          timestamp: new Date().toISOString()
        })
        await submitScore({
          level_ind,
          level,
          score: currentScore,
          version,
          user_id,
          percentScore,
          accuracy,
          phase: config.phase
        })
      } catch (error) {
        console.error('Error handling scores:', error)
        setPercentile(100)
      }
    }

    fetchAndSubmitScore()
  }, []) // ✅ Empty dependency array means run once when mounted

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
    <div className='game-layout fade-in' ref={screenRef}>
      <div className='game-content'>
        {/* // commeting out to keep the advice layout the same between mobile and desktop */}
        {/* {config.advice.image && !isMobile && (
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
        )} */}

        {config.phase > 1 && (
          <AdvicePanel
            adviceIndices={config.adviceIndices}
            animate={false}
            showRule={true}
          />
        )}

        <div
          className='main-content'
          onClick={isMobile ? handleTap : undefined}
        >
          <h2 className='title'>Level {level} Complete</h2>

          {config.advice.image && (
            <div className='mobile-advice-text'>
              <i>"{config.advice.quote}"</i>
              <div className='mobile-author'>- {config.advice.author}</div>
            </div>
          )}

          <div className='score-text'>
            <table>
              <tbody>
                <tr>
                  <td>Score:</td>
                  <td>
                    {currentScore.toFixed(0)}/{config.maxScore}
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
                    <strong>{(accuracy * 100).toFixed(0)}%</strong>
                  </td>
                </tr>
                {/* <tr>
                  <td>Percentile:</td>
                  <td></td>
                  <td>
                    <strong>{percentile?.toFixed(0)}%</strong>
                  </td>
                </tr> */}
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
              image={
                config.advice.image
                  ? config.advice.image
                  : undefined
              }
              authorName={undefined}
              authorQuote={undefined}
            />
          </div>

          <div className='button-container'>
            {config.phase === 1 && onReplayLevel && (
              <button onClick={onReplayLevel}>Replay</button>
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
