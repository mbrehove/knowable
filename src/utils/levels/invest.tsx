import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const investAdvice = {
  quote:
    'Someone is sitting in the shade today because someone planted a tree a long time ago.',
  author: 'Warren Buffett'
}

export const createInvestConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const investKey = Math.random() > 0.5 ? 'ArrowRight' : 'ArrowLeft'
  const pointsKey = investKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight'
  if (maxSteps % 2 !== 0) {
    throw new Error('maxSteps must be even for invest level')
  }
  const optimalScore = (maxSteps / 2) * (maxSteps / 2 - 1)
  const maxScore = (maxSteps / 2) * (maxSteps / 2)
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
      const investCount = keyTypes.filter(key => key === investKey).length

      if (eventKey === investKey) {
        return lastY + noise[currentPoints.length - 1]
      } else if (eventKey === pointsKey) {
        return lastY + investCount + noise[currentPoints.length - 1]
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
            In this level, the {investKey} key didn&apos;t give you any points
            but the {pointsKey} key gave you a point for each time you pressed
            the {investKey}. The optimal play would be to press the {investKey}{' '}
            {maxSteps / 2} times and then cashing in by pressing {pointsKey} the
            rest of the way to yeld a score of <b>{optimalScore}</b>.
            <b>{scorePercent.toFixed(2)}% </b> of optimal. You scored better
            than <b>{percentile.toFixed(1)}%</b> of players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {investAdvice.quote}
            <br />
          </i>
          -{investAdvice.author}
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
