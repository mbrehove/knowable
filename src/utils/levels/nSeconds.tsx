import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const nSecondsAdvice = {
  quote: 'Patience is bitter, but its fruit is sweet.',
  author: 'Aristotle'
}

export const createNSecondsConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
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
      const score = scores[scores.length - 1].y
      return (
        <div>
          <p className='level-description-text'>
            In this level your score for each key is determined by the number of{' '}
            seconds between keypresses with a maximum of {maxPointsPerKey}{' '}
            points per turn. You scored{' '}
            <b>
              {score}/{optimalScore}
            </b>{' '}
            points.
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
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
    maxScore
  }
}
