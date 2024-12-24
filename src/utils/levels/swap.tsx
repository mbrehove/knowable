import React from 'react'
import { LevelConfig } from './types'
import { levelAdvice } from './advice'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const createSwapConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const optimalScore =
    Math.max(leftValue, rightValue) * (maxSteps - 2) +
    Math.min(leftValue, rightValue) * 2
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
        (currentPoints.length < maxSteps / 2
          ? eventKey === 'ArrowRight'
            ? rightValue
            : leftValue
          : eventKey === 'ArrowRight'
          ? leftValue
          : rightValue) +
        noise[currentPoints.length - 1]
      )
    },
    randomValues: { leftValue, rightValue },
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
            In this level, pressing left gave a score of {leftValue} and
            pressing right gave {rightValue}. However, half way through the
            scores flipped. If you checked the scores again after this happened
            and adapted quickly, you could have achieved a score of{' '}
            {optimalScore}. Your score is <b>{scorePercent.toFixed(2)}% </b> of
            optimal. You scored better than <b>{percentile.toFixed(1)}%</b> of
            players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore
  }
}
