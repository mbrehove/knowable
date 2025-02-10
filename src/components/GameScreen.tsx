import React, { useState, useEffect, useCallback } from 'react'
import AdvicePanel from './AdvicePanel'
import AdviceModal from './AdviceModal'
import { LevelConfig, Description } from '../utils/levels/types' // Assuming levelConfig is in the same directory
import ScorePlot from './ScorePlot' // Assuming ScorePlot is a React component
import Arrow from '../../public/arrow.svg'

export interface LevelData {
  points: { x: number; y: number }[] // The points to bee plotted. x=turn y=score
  keyHistory: { key: string; time: number }[] //Histoy of keys pressed
  randomValues: Record<string, number> // random values generated at the start of the level (ie, what keys are worth what)
  description: Description //Level description in jsx
  level_ind: number //What index in level config this level used. Different from level since level_index repeats as the user advances levels
  version: number //For distinguishing different level versions. (currently unused)
  // maxScore: number // The maximum score possible this level
}

interface GameScreenProps {
  level: number
  config: LevelConfig
  onLevelComplete: (data: LevelData) => void
}

const GameScreen: React.FC<GameScreenProps> = ({
  level,
  config,
  onLevelComplete
}) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 }
  ])
  const [xDomain, setXDomain] = useState<[number, number]>([0, config.maxSteps])
  const [stepsTaken, setStepsTaken] = useState(0)
  const [keyHistory, setKeyHistory] = useState<{ key: string; time: number }[]>(
    []
  )
  const [lastKeyPressTime, setLastKeyPressTime] = useState(Date.now())
  const [showAdviceModal, setShowAdviceModal] = useState(true)

  useEffect(() => {
    // Reset points and steps when the level changes
    setPoints([{ x: 0, y: 0 }])
    setStepsTaken(0)
    setKeyHistory([])
    setLastKeyPressTime(Date.now())
    setShowAdviceModal(config.phase == 1)
  }, [level, config])

  // Apply scoring logic, udpat scores.
  const processKeyPress = useCallback(
    (key: string) => {
      const currentTime = Date.now()
      const time = (currentTime - lastKeyPressTime) / 1000
      setLastKeyPressTime(currentTime)

      const newY = config.scoringLogic(points, keyHistory, key, time)

      if (newY !== null) {
        setPoints(currentPoints => {
          const newX = currentPoints.length
          const updatedPoints = [...currentPoints, { x: newX, y: newY }]

          if (newX > xDomain[1]) {
            setXDomain([xDomain[0] + 10, xDomain[1] + 10])
          }

          return updatedPoints
        })

        setStepsTaken(steps => steps + 1)
        setKeyHistory(currentKeyHistory => [
          ...currentKeyHistory,
          { key, time }
        ])
      }
    },
    [lastKeyPressTime, config, keyHistory, points, xDomain]
  )

  // Handle all key presses and pass arrow keys to processKeyPress
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
          event.key
        ) &&
        stepsTaken <= config.maxSteps
      ) {
        processKeyPress(event.key)
      }
    },
    [config.maxSteps, stepsTaken, processKeyPress]
  )

  // Add the keypress listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [
    stepsTaken,
    keyHistory,
    lastKeyPressTime,
    config,
    points,
    xDomain,
    handleKeyPress
  ])

  // Advance level if they're on the last step
  useEffect(() => {
    // Check if the level is complete
    if (stepsTaken >= config.maxSteps) {
      const levelData = {
        points,
        keyHistory,
        randomValues: config.randomValues,
        description: config.description,
        level_ind: config.level_ind,
        version: config.version
      }
      onLevelComplete(levelData)
    }
  }, [stepsTaken, config, onLevelComplete, points, keyHistory])

  return (
    <div className='game-layout fade-in'>
      <div className='game-content'>
        {config.phase > 1 ? (
          <AdvicePanel
            adviceIndices={config.adviceIndices}
            animate={false}
            showRule={true}
          />
        ) : (
          config.advice.image && (
            <div className='author-image-container'>
              <img
                src={config.advice.image}
                alt={config.advice.author}
                className='author-image'
              />
            </div>
          )
        )}

        <div className='main-content'>
          <h2 className='title'>Level {level}</h2>
          <p className='subtitle'>
            Press left or right arrow keys to add points ({stepsTaken}/
            {config.maxSteps})
          </p>
          <i>
            {config.advice.quote}
            <br />
          </i>
          -{config.advice.author}
          <div className='plot-section'>
            <ScorePlot
              points={points}
              keyHistory={keyHistory}
              xDomain={xDomain}
            />
          </div>
          <div className='mobile-only-controls'>
            <div className='arrow-buttons'>
              <button className='up' onClick={() => processKeyPress('ArrowUp')}>
                <Arrow className='up-arrow' />
              </button>
            </div>
            <div className='arrow-buttons'>
              <button
                className='left'
                onClick={() => processKeyPress('ArrowLeft')}
              >
                <Arrow className='left-arrow' />
              </button>
              <button
                className='down'
                onClick={() => processKeyPress('ArrowDown')}
              >
                <Arrow className='down-arrow' />
              </button>
              <button
                className='right'
                onClick={() => processKeyPress('ArrowRight')}
              >
                <Arrow className='right-arrow' />
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAdviceModal && (
        <AdviceModal level={level} onClose={() => setShowAdviceModal(false)} />
      )}
    </div>
  )
}

export default GameScreen
