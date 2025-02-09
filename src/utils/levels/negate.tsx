import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const negateAdvice = {
  quote: 'Sometimes we need to lose the small battles in order to win the war.',
  author: 'Sun Tzu',
  rule: 'One key subtracts 1 and the other negates the score if it is negative.'
}

export const createNegateConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const negativeValue = -2
  const { negateKey, moveKey } =
    Math.random() > 0.5
      ? { negateKey: 'ArrowLeft', moveKey: 'ArrowRight' }
      : { negateKey: 'ArrowRight', moveKey: 'ArrowLeft' }
  const optimalScore = -(maxSteps - 2) * negativeValue
  const maxScore = (maxSteps - 1) * negativeValue
  const noise = getNoise(noiseLevel, maxSteps)

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
        if (lastY < 0) {
          return -lastY + noise[currentPoints.length - 1]
        } else {
          return lastY + noise[currentPoints.length - 1]
        }
      } else if (eventKey === moveKey) {
        return lastY + negativeValue + noise[currentPoints.length - 1]
      } else {
        return null
      }
    },
    randomValues: {},
    description: (
      scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      _percentile: number
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
            Your score is {scorePercent.toFixed(2)}% of optimal.
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
    level_ind: levelInd,
    version: 0,
    optimalScore,
    maxScore,
    phase,
    adviceIndices
  }
}
