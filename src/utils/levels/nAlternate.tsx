import React from 'react'
import { LevelConfig } from './types'
import { levelAdvice } from './advice'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const createNAlternateConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const optimalScore = ((maxSteps - 1) * (maxSteps - 2)) / 2
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
      const filteredKeyTypes = keyTypes.filter(
        key => key === 'ArrowRight' || key === 'ArrowLeft'
      )
      const switches = filteredKeyTypes
        .slice(1)
        .map((key, index) => (key !== filteredKeyTypes[index] ? 1 : 0))
      const switchCount = switches.reduce<number>((acc, val) => acc + val, 0)

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return lastY + switchCount + noise[currentPoints.length - 1]
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
            In this level, both keys had a value equal to the number of times
            that you alternated keys.
            <br />
            Optimal play would have averaged {optimalScore.toFixed(2)}. <br />
            Your score is <b>{scorePercent.toFixed(2)}% </b> of optimal. You
            scored better than <b>{percentile.toFixed(1)}%</b> of players on
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
