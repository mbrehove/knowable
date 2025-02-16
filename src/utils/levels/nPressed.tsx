import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from '../types'
import { getNoise } from '../utils'
import { globalMaxSteps } from '../levelManager'

export const nPressedAdvice = {
  quote:
    'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.',
  author: 'Bruce Lee',
  rule: 'Each key adds points equal to the number of times the key was pressed',
  image: '/advice_images/transparent/Bruce_Lee.svg'
}

export const createNPressedConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const optimalScore = ((maxSteps + 1) * maxSteps) / 2
  const maxScore = optimalScore
  const noise = getNoise(noiseLevel, maxSteps)

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
      _scores: { x: number; y: number }[],
      _keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level, the score you got from a button equals the number of
            times the button was pressed. The optimal play would press the same
            button each turn and yield a score of {optimalScore}. Your score is{' '}
            {percentile.toFixed(2)}% of optimal.
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
      let leftCount = 0
      let rightCount = 0
      const accuracyArray = []
      for (let i = 0; i < keyHistory.length; i++) {
        if (keyHistory[i].key === 'ArrowLeft') {
          leftCount++
        } else if (keyHistory[i].key === 'ArrowRight') {
          rightCount++
        }
        if (leftCount == rightCount) {
          accuracyArray.push(true)
        } else {
          accuracyArray.push(
            leftCount < rightCount
              ? keyHistory[i].key === 'ArrowRight'
              : keyHistory[i].key === 'ArrowLeft'
          )
        }
      }
      return accuracyArray
    },
    advice: nPressedAdvice
  }
}
