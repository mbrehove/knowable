import React from 'react'
import { LevelConfig } from './types'
import { getNoise } from './utils'
import { globalMaxSteps } from './levelManager'

export const randomAdvice = {
  quote:
    "Don't seek to have events happen as you wish, but wish them to happen as they do happen, and all will be well with you.",
  author: 'Epictetus'
}

export const createRandomConfig = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps,
  level_ind: number
): LevelConfig => {
  const value = 2
  const primaryNoise = getNoise(2, maxSteps)

  const optimalScore = maxSteps * value
  const noise = getNoise(noise_level, maxSteps)

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
            In this level your score was {maxSteps * value}. Even though there
            was some random noise it all added up to zero. The decisions you
            made didn&apos;t matter at all. Everyone scores exactly{' '}
            {maxSteps * value} on this level. Hopefully you didn&apos;t worry
            too much about figuring out the strategy. If you did, I&apos;m
            sorry, but that&apos;s how life is sometimes. Maybe you need to
            learn how relax and enjoy things more.
          </p>
          <p>Advice:</p>
          <i>
            {randomAdvice.quote}
            <br />
          </i>
          -{randomAdvice.author}
        </div>
      )
    },
    maxSteps,
    level_ind,
    version: 0,
    optimalScore
  }
}
