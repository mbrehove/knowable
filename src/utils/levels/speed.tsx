import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const speedAdvice = {
  quote: 'Move fast and break things.',
  author: 'Mark Zuckerberg',
  rule: 'Each key adds points equal to 1/seconds since the last key was pressed for a maximum of 5.'
}

export const createSpeedConfig = ({
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
        Math.min(maxPointsPerKey, Math.floor(1 / timeInterval)) +
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
            which you pressed the keys. Each keypress added <i>1/t</i> points
            where <i>t</i>
            is the time in seconds, with a maximum of {maxPointsPerKey} points
            per keypress for a maximum possible score of {optimalScore}.
          </p>
          <p>Advice:</p>
          <i>
            {speedAdvice.quote}
            <br />
          </i>
          -{speedAdvice.author}
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
      return keyHistory.map(e => e.time < 0.2)
    },
    advice: speedAdvice
  }
}
