import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const investAdvice = {
  quote:
    'Someone is sitting in the shade today because someone planted a tree a long time ago.',
  author: 'Warren Buffett',
  rule: 'One key is the invest key and gives 0 points but the other key gives you a point for each time you pressed the invest key.'
}

export const createInvestConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const investKey = Math.random() > 0.5 ? 'ArrowRight' : 'ArrowLeft'
  const pointsKey = investKey === 'ArrowRight' ? 'ArrowLeft' : 'ArrowRight'
  if (maxSteps % 2 !== 0) {
    throw new Error('maxSteps must be even for invest level')
  }
  const optimalScore = (maxSteps / 2) * (maxSteps / 2 - 1)
  const maxScore = (maxSteps / 2) * (maxSteps / 2)
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
      const investCount = keyTypes.filter(key => key === investKey).length

      if (eventKey === investKey) {
        return lastY + noise[currentPoints.length - 1]
      } else if (eventKey === pointsKey) {
        return lastY + investCount + noise[currentPoints.length - 1]
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
            In this level, the {investKey.slice(5)} key didn&apos;t give you any
            points but the {pointsKey.slice(5)} key gave you a point for each
            time you pressed the {investKey.slice(5)}. The optimal play would be
            to press the {investKey.slice(5)} {maxSteps / 2} times and then
            cashing in by pressing {pointsKey.slice(5)} the rest of the way to
            yeld a score of <b>{optimalScore}</b>.
          </p>
          <i>
            {investAdvice.quote}
            <br />
          </i>
          -{investAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind: levelInd,
    version: 0,
    optimalScore,
    maxScore,
    phase,
    adviceIndices
  }
}
