import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'

export const nSecondsAdvice = {
  quote: 'Patience is bitter, but its fruit is sweet.',
  author: 'Aristotle',
  rule: 'Each key adds points equal to the number of seconds since the last key press with a maximum of 5',
  image: '/advice_images/square/Aristotle.svg'
}

export const createNSecondsConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const maxPointsPerKey = 5
  const optimalScore = maxPointsPerKey * maxSteps
  const maxScore = optimalScore
  const noise = getNoise(noiseLevel, maxSteps)

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
      _scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      _percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level your score for each key is determined by the number of{' '}
            seconds between keypresses with a maximum of {maxPointsPerKey}{' '}
            points per turn.
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
      return keyHistory.map(e => e.time > 5)
    },
    advice: nSecondsAdvice
  }
}
