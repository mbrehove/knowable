// GameScreen.js
import React, { useState, useEffect } from 'react'
import ScorePlot from './ScorePlot' // Import the new ScorePlot component
import './style.css'

const GameScreen = ({ level, onLevelComplete, config }) => {
  const [points, setPoints] = useState([{ x: 0, y: 0 }])
  const [xDomain, setXDomain] = useState([0, config.maxSteps])
  const [stepsTaken, setStepsTaken] = useState(0)
  const [keyHistory, setKeyHistory] = useState([])
  const [lastKeyPressTime, setLastKeyPressTime] = useState(Date.now())

  useEffect(() => {
    // Reset points and steps when the level changes
    setPoints([{ x: 0, y: 0 }])
    setStepsTaken(0)
    setKeyHistory([])
    setLastKeyPressTime(Date.now())
  }, [level, config])

  useEffect(() => {
    const handleKeyPress = event => {
      if (
        (event.key === 'ArrowLeft' ||
          event.key === 'ArrowRight' ||
          event.key === 'ArrowUp' ||
          event.key === 'ArrowDown') &&
        stepsTaken <= config.maxSteps
      ) {
        const currentTime = Date.now()
        const timeInterval = (currentTime - lastKeyPressTime) / 1000
        setLastKeyPressTime(currentTime)

        const newY = config.scoringLogic(
          points,
          keyHistory,
          event.key,
          timeInterval
        )

        if (newY !== null) {
          setPoints(currentPoints => {
            const newX = currentPoints.length
            const updatedPoints = [...currentPoints, { x: newX, y: newY }]

            // Update domain if new point is out of bounds
            if (newX > xDomain[1]) {
              setXDomain([xDomain[0] + 10, xDomain[1] + 10])
            }

            return updatedPoints
          })

          setStepsTaken(steps => steps + 1)
        }

        setKeyHistory(currentKeyHistory => [
          ...currentKeyHistory,
          { key: event.key, timeInterval }
        ])
      }
    }

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
  }, [
    stepsTaken,
    config.maxSteps,
    onLevelComplete,
    points,
    keyHistory,
    config.randomValues,
    config.description
  ])

  return (
    <div className='container'>
      <h2 className='title'>Level {level}</h2>
      <p className='subtitle'>
        Press left or right arrow keys to add points ({stepsTaken}/
        {config.maxSteps})
      </p>
      <ScorePlot points={points} keyHistory={keyHistory} xDomain={xDomain} />
    </div>
  )
}

export default GameScreen
