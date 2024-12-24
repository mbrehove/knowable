import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const negateAdvice = {
  quote: 'Sometimes we need to lose the small battles in order to win the war.',
  author: 'Sun Tzu'
}

export const createNegateConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const negativeValue = -2
  const { negateKey, moveKey } =
    Math.random() > 0.5
      ? { negateKey: 'ArrowLeft', moveKey: 'ArrowRight' }
      : { negateKey: 'ArrowRight', moveKey: 'ArrowLeft' }
  const optimalScore = (maxSteps - 1) * negativeValue
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
      if (eventKey === negateKey) {
        if (lastY > 0) {
          return -lastY + noise[currentPoints.length - 1]
        } else {
          return lastY + noise[currentPoints.length - 1]
        }
      } else if (eventKey === moveKey) {
        return lastY + negativeValue
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
      const lastScore = scores.at(-1)
      const scorePercent = lastScore ? (lastScore.y / optimalScore) * 100 : 0
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing {moveKey} decreased your score by{' '}
            {-negativeValue} and pressing {negateKey} negated your score. The
            optimal play would press {moveKey} for the first {maxSteps - 1}{' '}
            turns and then {negateKey} once to yeild a score of {optimalScore}.
            Your score is <b>{scorePercent.toFixed(2)}% </b> of optimal. You
            scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            {negateAdvice.quote}
            <br />
          </i>
          -{negateAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore
  }
}
