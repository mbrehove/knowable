import React from 'react'
import { LevelConfig } from './types'
import { levelAdvice } from './advice'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const createUpDownConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const upValue = Math.random() > 0.5 ? 10 : 5
  const downValue = upValue > 5 ? 5 : 10
  const optimalScore = Math.max(upValue, downValue) * (maxSteps - 1)
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
      let newY: number | null = null

      switch (eventKey) {
        case 'ArrowRight':
          newY = lastY + rightValue
          break
        case 'ArrowLeft':
          newY = lastY + leftValue
          break
        case 'ArrowUp':
          newY = lastY + upValue
          break
        case 'ArrowDown':
          newY = lastY + downValue
          break
        default:
          return null
      }
      return newY + noise[currentPoints.length - 1]
    },
    randomValues: { leftValue, rightValue, upValue, downValue },
    description: (
      _scores: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      let additionalSentence = ''
      const keyNames = keyHistory.map(entry => entry.key)
      if (keyNames.includes('ArrowUp') || keyNames.includes('ArrowDown')) {
        additionalSentence =
          'You went outside the instructions and were rewarded for it. Good Job.'
      } else {
        additionalSentence =
          "The instructions never said anything about using the up or down arrows, but life doesn't always come with good instructions."
      }
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue} while pressing the up or down
            arrows gives {upValue} and {downValue}. {additionalSentence} You
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
