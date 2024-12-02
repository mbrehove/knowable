// LevelCompleteScreen.js
import React, { useState, useEffect } from 'react'
import ScorePlot from './ScorePlot' // Import the new ScorePlot component
import './style.css'

const LevelCompleteScreen = ({ level, onNextLevel, levelData, config }) => {
  const { points, keyHistory, randomValues, description, level_ind } = levelData
  const [percentile, setPercentile] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/api/scores/${level_ind}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(scores => {
        const currentScore = points[points.length - 1].y
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
