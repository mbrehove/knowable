import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const nSecondsAdvice = {
  quote: 'Patience is bitter, but its fruit is sweet.',
  author: 'Aristotle',
  rule: 'Each key adds points equal to the number of seconds since the last key press with a maximum of 5'
}

export const createNSecondsConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number,
  phase: 1 | 2 | 3
): LevelConfig => {
  const maxPointsPerKey = 5
  const optimalScore = maxPointsPerKey * maxSteps
  const maxScore = optimalScore
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
        Math.min(maxPointsPerKey, Math.floor(timeInterval)) +
        noise[currentPoints.length - 1]
      )
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
            In this level your score for each key is determined by the number of{' '}
            seconds between keypresses with a maximum of {maxPointsPerKey}{' '}
            points per turn.
          </p>
          <i>
            {nSecondsAdvice.quote}
            <br />
          </i>
          -{nSecondsAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore,
    maxScore,
    phase
  }
}
