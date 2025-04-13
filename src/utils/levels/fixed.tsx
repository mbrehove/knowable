import React from 'react'
import { LevelConfig } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'
import { CreateLevelConfigParams } from '../types'

export const fixedAdvice = {
  quote:
    'Insanity is doing the same thing over and over again and expecting different results.',
  author: 'Rita Mae Brown',
  rule: 'One key adds 2 and the other subtracts 1',
  image: '/advice_images/square/Rita_Mae_Brown.svg'
}

export const createFixedConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const optimalScore =
    Math.max(leftValue, rightValue) * (maxSteps - 1) +
    Math.min(leftValue, rightValue)
  const maxScore = Math.max(leftValue, rightValue) * maxSteps
  const noise = getNoise(noiseLevel, maxSteps)

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
        (eventKey === 'ArrowRight' ? rightValue : leftValue) +
        noise[currentPoints.length - 1]
      )
    },
    randomValues: { leftValue, rightValue },
    description: (
      _scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      _percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue}. The optimal strategy is to press
            the higher-scoring button. This would yield a score of{' '}
            {optimalScore}.
          </p>
        </div>
      )
    },
    maxSteps,
    level_ind: levelInd,
    version: 0,
    optimalScore,
    maxScore,
    phase,
    adviceIndices,
    accuracy: (
      _points: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[]
    ) => {
      const bestKey = rightValue > leftValue ? 'ArrowRight' : 'ArrowLeft'
      return keyHistory.map(e => e.key == bestKey)
    },
    advice: fixedAdvice
  }
}
