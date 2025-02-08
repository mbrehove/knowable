import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const threesAdvice = {
  quote: 'If it comes in three let it be.',
  author: 'Boy Scout Handbook',
  rule: 'One key always adds 0. The other adds 2 unless the turn is divisible by 3 in which it subtracts 4.'
}

export const createThreesConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number,
  phase: 1 | 2 | 3
): LevelConfig => {
  const zeroKey = Math.random() > 0.5 ? 'ArrowRight' : 'ArrowLeft'
  const pointKey = zeroKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight'
  const optimalScore = ((maxSteps - 1) * maxSteps) / 2
  const maxScore = optimalScore
  const noise = getNoise(noise_level, maxSteps)
  const pointKeyValue = 2

  return {
    scoringLogic: (
      currentPoints: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[],
      eventKey: string,
      _timeInterval: number
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      const turn = currentPoints.length

      if (eventKey === zeroKey) {
        return lastY
      } else if (eventKey === pointKey) {
        if (turn % 3 == 0) {
          return lastY - pointKeyValue * 2
        } else {
          return lastY + pointKeyValue
        }
      } else {
        return null
      }
    },
    randomValues: {},
    description: (
      _scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      _percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level, the score you got from a button equals the number of
            times the <i>other</i> button was pressed. The optimal play would
            press one button for the first {maxSteps / 2} turns and the other
            button for the last {maxSteps / 2}
            turns and yield a score of {optimalScore}.
          </p>
          <i>
            {threesAdvice.quote}
            <br />
          </i>
          -{threesAdvice.author}
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
