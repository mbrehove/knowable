import React from 'react'
import { LevelConfig, CreateLevelConfigParams } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const nAlternateAdvice = {
  quote: 'To improve is to change; to be perfect is to change often.',
  author: 'Winston Churchill',
  rule: 'Each key adds points equal to the number of times the player has alternated keys.'
}

export const createNAlternateConfig = ({
  noiseLevel = 0,
  maxSteps = globalMaxSteps,
  levelInd,
  phase,
  adviceIndices
}: CreateLevelConfigParams): LevelConfig => {
  const optimalScore = (maxSteps * (maxSteps - 1)) / 2
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
      const filteredKeyTypes = keyTypes.filter(
        key => key === 'ArrowRight' || key === 'ArrowLeft'
      )
      const switches = filteredKeyTypes
        .slice(1)
        .map((key, index) => (key !== filteredKeyTypes[index] ? 1 : 0))
      const switchCount = switches.reduce<number>((acc, val) => acc + val, 0)

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return lastY + switchCount + noise[currentPoints.length - 1]
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
            In this level, both keys had a value equal to the number of times
            that you alternated keys. Optimal play would have averaged{' '}
            {optimalScore.toFixed(2)}.
          </p>
          <i>
            {nAlternateAdvice.quote}
            <br />
          </i>
          -{nAlternateAdvice.author}
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
