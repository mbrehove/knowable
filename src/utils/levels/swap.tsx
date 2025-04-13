import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'

export const swapAdvice = {
  quote:
    'It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change.',
  author: 'Charels Darwin',
  rule: 'One key adds 2 and the other subtracts 1. The keys switch at two random times during play.',
  image: '/advice_images/square/Charles_Darwin.svg'
}

export const createSwapConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const swapAt = [
    Math.floor((Math.random() * maxSteps) / 4) + maxSteps / 4,
    Math.floor((Math.random() * maxSteps) / 4) + maxSteps / 2
  ]
  const optimalScore =
    Math.max(leftValue, rightValue) * (maxSteps - swapAt.length) +
    Math.min(leftValue, rightValue) * swapAt.length
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
      const swap = swapAt.filter(x => currentPoints.length <= x).length % 2 == 1
      return (
        lastY +
        (swap
          ? eventKey === 'ArrowRight'
            ? rightValue
            : leftValue
          : eventKey === 'ArrowRight'
          ? leftValue
          : rightValue) +
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
            In this level, pressing left gave a score of {leftValue} and
            pressing right gave {rightValue}. However, at turns {swapAt[0]} and{' '}
            {swapAt[1]} the scores flipped. If you checked the scores again
            after this happened and adapted quickly, you could have achieved a
            score of {optimalScore}.
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
      points: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[]
    ) => {
      return keyHistory.map((keyPress, index) => {
        const swap = swapAt.filter(x => index < x).length % 2 == 1
        const leftScore = swap ? leftValue : rightValue
        const rightScore = swap ? rightValue : leftValue

        // The optimal choice is the key that gives the higher score
        const optimalKey = leftScore > rightScore ? 'ArrowLeft' : 'ArrowRight'
        return keyPress.key === optimalKey
      })
    },
    advice: swapAdvice
  }
}
