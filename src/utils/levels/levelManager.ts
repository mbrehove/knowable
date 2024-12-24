import { LevelConfig } from './types'
import { createFixedConfig, fixedAdvice } from './fixed'
import { createSwapConfig, swapAdvice } from './swap'
import { createNAlternateConfig, nAlternateAdvice } from './nAlternate'
import { createUpDownConfig, upDownAdvice } from './upDown'
import { createNPressedConfig, nPressedAdvice } from './nPressed'
import { createNSecondsConfig, nSecondsAdvice } from './nSeconds'
import { createNegateConfig, negateAdvice } from './negate'
import { createSpeedConfig, speedAdvice } from './speed'
import { createInvestConfig, investAdvice } from './invest'
import { createRandomConfig, randomAdvice } from './random'

const levelConfigs = [
  (noise: number, maxSteps: number) => createFixedConfig(noise, maxSteps, 0),
  (noise: number, maxSteps: number) => createSwapConfig(noise, maxSteps, 1),
  (noise: number, maxSteps: number) => createNPressedConfig(noise, maxSteps, 2),
  (noise: number, maxSteps: number) =>
    createNAlternateConfig(noise, maxSteps, 3),
  (noise: number, maxSteps: number) => createInvestConfig(noise, maxSteps, 4),
  (noise: number, maxSteps: number) => createNSecondsConfig(noise, maxSteps, 5),
  (noise: number, maxSteps: number) => createSpeedConfig(noise, maxSteps, 6),
  (noise: number, maxSteps: number) => createUpDownConfig(noise, maxSteps, 7),
  (noise: number, maxSteps: number) => createNegateConfig(noise, maxSteps, 8),
  (noise: number, maxSteps: number) => createRandomConfig(noise, maxSteps, 9)
]

export const levelAdvice = [
  fixedAdvice,
  swapAdvice,
  nPressedAdvice,
  nAlternateAdvice,
  investAdvice,
  nSecondsAdvice,
  speedAdvice,
  upDownAdvice,
  negateAdvice,
  randomAdvice
]

export const globalMaxSteps = 12

export const numberOfLevels = levelConfigs.length

export const totalOptimalScore = levelConfigs.reduce((sum, levelConfigFn) => {
  const config = levelConfigFn(0, globalMaxSteps) // Call with default params
  return sum + config.optimalScore
}, 0)

export const getLevelConfig = (level: number): LevelConfig => {
  // Phase 1: Levels 1-8 in order
  if (level <= levelConfigs.length) {
    return levelConfigs[level - 1](0, globalMaxSteps)
  }

  // Phase 2: Random levels
  if (level <= levelConfigs.length * 2 + 1) {
    const randomIndex = Math.floor(Math.random() * levelConfigs.length)
    return levelConfigs[randomIndex](0, globalMaxSteps)
  }

  // Phase 3: Random levels with noise
  const randomIndex = Math.floor(Math.random() * levelConfigs.length)
  return levelConfigs[randomIndex](1, globalMaxSteps)
}

export default getLevelConfig
