import React from 'react'
import { LevelConfig } from './types'
import { levelAdvice } from './advice'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const createNPressedConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const optimalScore = ((maxSteps - 1) * maxSteps) / 2
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
      const arrowLeftCount = keyTypes.filter(key => key === 'ArrowLeft').length
      const arrowRightCount = keyTypes.filter(
        key => key === 'ArrowRight'
      ).length

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else if (eventKey === 'ArrowLeft') {
        return lastY + arrowLeftCount + noise[currentPoints.length - 1]
      } else if (eventKey === 'ArrowRight') {
        return lastY + arrowRightCount + noise[currentPoints.length - 1]
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
            In this level, the score you got from a button equals the number of
            times the <i>other</i> button was pressed. The optimal play would press one
            button for the first {maxSteps/2} turns and the other button for the last {maxSteps/2}
             turns and yield a score of {optimalScore}. Your score is{' '}
            <b>{scorePercent.toFixed(2)}% </b> of optimal. You scored better
            than <b>{percentile.toFixed(1)}%</b> of players on this level.
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
