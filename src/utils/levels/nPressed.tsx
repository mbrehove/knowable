import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const nPressedAdvice = {
  quote:
    'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.',
  author: 'Bruce Lee'
}

export const createNPressedConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const optimalScore = ((maxSteps + 1) * maxSteps) / 2
  const maxScore = optimalScore
  const noise = getNoise(noise_level, maxSteps)

  return {
    scoringLogic: (
      currentPoints: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[],
      eventKey: string,
      _timeInterval: number
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y

      const keyTypes = [...keyHistory.map(entry => entry.key), eventKey]
      const arrowLeftCount = keyTypes.filter(key => key === 'ArrowLeft').length
      const arrowRightCount = keyTypes.filter(
        key => key === 'ArrowRight'
      ).length

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else if (eventKey === 'ArrowLeft') {
        return lastY + arrowLeftCount + noise[currentPoints.length - 1]
      } else if (eventKey === 'ArrowRight') {
        return lastY + arrowRightCount + noise[currentPoints.length - 1]
      } else {
        return null
      }
    },
    randomValues: {},
    description: (
      scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level, the score you got from a button equals the number of
            times the button was pressed. The optimal play would press the same
            button each turn and yield a score of {optimalScore}. Your score is{' '}
            scorePercent.toFixed(2)% of optimal. 
          </p>
          <i>
            {nPressedAdvice.quote}
            <br />
          </i>
          -{nPressedAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore,
    maxScore
  }
}
