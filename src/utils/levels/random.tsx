import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'

export const randomAdvice = {
  quote:
    "Don't seek to have events happen as you wish, but wish them to happen as they do happen, and all will be well with you.",
  author: 'Epictetus',
  rule: 'Each key adds 2 points on average. +/- 2 points of noise is added each turn.',
  image: '/advice_images/square/Epictetus.svg'
}

export const createRandomConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const value = 2
  const primaryNoise = getNoise(3, maxSteps)
  const optimalScore = maxSteps * value
  const maxScore = optimalScore
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

      if (eventKey === 'ArrowRight' || eventKey === 'ArrowLeft') {
        return (
          lastY +
          value +
          primaryNoise[currentPoints.length - 1] +
          noise[currentPoints.length - 1]
        )
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
            In this level your score was {maxSteps * value}. Each keypress added
            2 points with some random noise added in. However, the noise added
            up to zero. The decisions you made didn&apos;t matter at all.
            Everyone scores exactly {maxSteps * value} on this level. Hopefully
            you didn&apos;t worry too much about figuring out the strategy. If
            you did, I&apos;m sorry, but that&apos;s how life is sometimes.
            Maybe you need to learn how relax and enjoy things more.
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
      return keyHistory.map(_ => true)
    },
    advice: randomAdvice
  }
}
