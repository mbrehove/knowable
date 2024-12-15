import React, { useState, useEffect, useCallback } from 'react'
import { LevelConfig, Description } from '../utils/levelConfig' // Assuming levelConfig is in the same directory
import ScorePlot from './ScorePlot' // Assuming ScorePlot is a React component
import Arrow from '../../public/arrow.svg'

export interface LevelData {
  points: { x: number; y: number }[] // The points to bee plotted. x=turn y=score
  keyHistory: { key: string; time: number }[] //Histoy of keys pressed
  randomValues: Record<string, number> // random values generated at the start of the level (ie, what keys are worth what)
  description: Description //Level description in jsx
  level_ind: number //What index in level config this level used. Different from level since level_index repeats as the user advances levels
  version: number //For distinguishing different level versions. (currently unused)
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

  useEffect(() => {
    // Reset points and steps when the level changes
    setPoints([{ x: 0, y: 0 }])
    setStepsTaken(0)
    setKeyHistory([])
    setLastKeyPressTime(Date.now())
  }, [level, config])

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
      }

      setKeyHistory(currentKeyHistory => [...currentKeyHistory, { key, time }])
    },
    [lastKeyPressTime, config, keyHistory, points, xDomain]
  )

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
    <div className='container'>
      <h2 className='title'>Level {level}</h2>
      <p className='subtitle'>
        Press left or right arrow keys to add points ({stepsTaken}/
        {config.maxSteps})
      </p>
      <ScorePlot points={points} keyHistory={keyHistory} xDomain={xDomain} />
      <div>
        <div className='arrow-buttons'>
          <button className='up' onClick={() => processKeyPress('ArrowUp')}>
            <Arrow className='up-arrow' />
          </button>
        </div>
        <div className='arrow-buttons'>
          <button className='left' onClick={() => processKeyPress('ArrowLeft')}>
            <Arrow className='left-arrow' />
          </button>
          <button className='down' onClick={() => processKeyPress('ArrowDown')}>
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
  )
}

export default GameScreen
