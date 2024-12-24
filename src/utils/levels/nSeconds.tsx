import React from 'react'
import { LevelConfig } from './types'
import { levelAdvice } from './advice'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const createNSecondsConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const optimalScore = 10 * (maxSteps - 1)
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
        Math.min(5, Math.floor(timeInterval)) +
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
            is the time in seconds, with a maximum of 5 points per keypress.
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
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
