import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'

export const threesAdvice = {
  quote: 'If it comes in three let it be.',
  author: 'Boy Scout Handbook',
  rule: 'One key always adds 0. The other adds 2 unless the turn is divisible by 3 in which it subtracts 4.',
  image: '/advice_images/square/Boy_Scout_Handbook.svg'
}

export const createThreesConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const zeroKey = Math.random() > 0.5 ? 'ArrowRight' : 'ArrowLeft'
  const pointKey = zeroKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight'
  const optimalScore = (maxSteps / 3) * 2
  const maxScore = optimalScore
  const noise = getNoise(noiseLevel, maxSteps)
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
          return lastY - pointKeyValue * 2 + noise[currentPoints.length - 1]
        } else {
          return lastY + pointKeyValue + noise[currentPoints.length - 1]
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
            In this level, the {zeroKey.slice(5)} key always adds 0. The{' '}
            {pointKey.slice(5)} key adds 2 unless the turn is divisible by 3 in
            which it subtracts 4.
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
      return keyHistory.map((entry, index) => {
        const turn = index + 1
        // On turns divisible by 3, pointKey gives -4, so zeroKey (giving 0) is better
        if (turn % 3 === 0) {
          return entry.key === zeroKey
        }
        // On other turns, pointKey gives +2, which is better than zeroKey's 0
        return entry.key === pointKey
      })
    },
    advice: threesAdvice
  }
}
