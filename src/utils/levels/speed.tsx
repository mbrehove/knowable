import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const speedAdvice = {
  quote: 'Move fast and break things.',
  author: 'Mark Zuckerberg'
}

export const createSpeedConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const maxPointsPerKey = 5
  const optimalScore = maxPointsPerKey * maxSteps
  const noise = getNoise(noise_level, maxSteps)

  return {
    scoringLogic: (
      currentPoints: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      eventKey: string,
      timeInterval: number
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return (
        lastY +
        Math.min(maxPointsPerKey, Math.floor(1 / timeInterval)) +
        noise[currentPoints.length - 1]
      )
    },
    randomValues: {},
    description: (
      _scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level your score for each key is determined by the speed at{' '}
            which you pressed the keys. Each keypress added 1/t points where t
            is the time in seconds, with a maximum of {maxPointsPerKey} points
            per keypress.
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            {speedAdvice.quote}
            <br />
          </i>
          -{speedAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore
  }
}
