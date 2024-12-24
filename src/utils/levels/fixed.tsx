import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const fixedAdvice = {
    quote:
      'Insanity is doing the same thing over and over again and expecting different results.',
    author: 'Rita Mae Brown'
  }

export const createFixedConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const optimalScore =
    Math.max(leftValue, rightValue) * (maxSteps - 1) +
    Math.min(leftValue, rightValue)
  const noise = getNoise(noise_level, maxSteps)

  return {
    scoringLogic: (
      currentPoints: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      eventKey: string,
      _timeInterval: number
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return (
        lastY +
        (eventKey === 'ArrowRight' ? rightValue : leftValue) +
        noise[currentPoints.length - 1]
      )
    },
    randomValues: { leftValue, rightValue },
    description: (
      scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      const scorePercent = (scores[scores.length - 1].y / optimalScore) * 100
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue}. The optimal strategy is to press
            the higher-scoring button. This would yield a score of{' '}
            {optimalScore}. Your score is <b>{scorePercent.toFixed(2)}%</b> of
            optimal. You scored better than <b>{percentile.toFixed(1)}%</b> of
            players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {fixedAdvice.quote}
            <br />
          </i>
          -{fixedAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore
  }
}
