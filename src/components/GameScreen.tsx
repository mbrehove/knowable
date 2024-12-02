import React, { useState, useEffect } from 'react'
import { LevelConfig, Description } from '../utils/levelConfig' // Assuming levelConfig is in the same directory
import ScorePlot from './ScorePlot' // Assuming ScorePlot is a React component

interface GameScreenProps {
  level: number
  config: LevelConfig
  onLevelComplete: (data: {
    points: { x: number; y: number }[]
    keyHistory: { key: string; time: number }[]
    randomValues: Record<string, number>
    description: Description
    level_ind: number
  }) => void
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

  const handleKeyPress = (event: KeyboardEvent) => {
    if (
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) &&
      stepsTaken <= config.maxSteps
    ) {
      processKeyPress(event.key)
    }
  }

  const processKeyPress = (key: string) => {
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
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [stepsTaken, keyHistory, lastKeyPressTime, config, points, xDomain])

  useEffect(() => {
    // Check if the level is complete
    if (stepsTaken >= config.maxSteps) {
      const levelData = {
        points,
        keyHistory,
        randomValues: config.randomValues,
        description: config.description,
        level_ind: config.level_ind
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
      <div className='button-container'>
        <div className='arrow-buttons'>
          <button className='up' onClick={() => processKeyPress('ArrowUp')}>
            ^
          </button>
        </div>
        <div className='arrow-buttons'>
          <button className='left' onClick={() => processKeyPress('ArrowLeft')}>
            &lt;
          </button>
          <button className='down' onClick={() => processKeyPress('ArrowDown')}>
            v
          </button>
          <button
            className='right'
            onClick={() => processKeyPress('ArrowRight')}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
