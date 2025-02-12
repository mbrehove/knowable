import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const upDownAdvice = {
  quote: "Rules are made for people who aren't willing to make their own.",
  author: 'Chuck Yeager',
  rule: 'Left and right keys give either 2 or -1 points. Up and down give either 3 or 4 points.',
  image: '/advice_images/transparent/Chuck_Yeager.svg'
}

export const createUpDownConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const leftValue = Math.random() > 0.5 ? 2 : -1
  const rightValue = leftValue > 0 ? -1 : 2
  const upValue = Math.random() > 0.5 ? 3 : 4
  const downValue = upValue > 3 ? 3 : 4
  const optimalScore =
    Math.max(upValue, downValue) * (maxSteps - 1) + Math.min(upValue, downValue)
  const maxScore = Math.max(upValue, downValue) * maxSteps
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
      let newY: number | null = null

      switch (eventKey) {
        case 'ArrowRight':
          newY = lastY + rightValue + noise[currentPoints.length - 1]
          break
        case 'ArrowLeft':
          newY = lastY + leftValue + noise[currentPoints.length - 1]
          break
        case 'ArrowUp':
          newY = lastY + upValue + noise[currentPoints.length - 1]
          break
        case 'ArrowDown':
          newY = lastY + downValue + noise[currentPoints.length - 1]
          break
        default:
          return null
      }
      return newY + noise[currentPoints.length - 1]
    },
    randomValues: { leftValue, rightValue, upValue, downValue },
    description: (
      scores: { x: number; y: number }[],
      keyHistory: { key: string; time: number }[],
      percentile: number
    ) => {
      const score = scores.at(-1)?.y ?? 0
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
            scored a total of <b>{score}</b> points out of a possible{' '}
            {optimalScore}. You scored better than{' '}
            <b>{percentile.toFixed(1)}%</b> of players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {upDownAdvice.quote}
            <br />
          </i>
          -{upDownAdvice.author}
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
      const bestKey = upValue > downValue ? 'ArrowUp' : 'ArrowDown'
      return keyHistory.map(entry => entry.key === bestKey)
    },
    advice: upDownAdvice
  }
}
