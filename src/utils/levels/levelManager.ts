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

let phase2Order: number[] | null = null
let phase3Order: number[] | null = null

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
export const noiseLevel = 1

export const numberOfLevels = levelConfigs.length

export const totalOptimalScore = levelConfigs.reduce((sum, levelConfigFn) => {
  const config = levelConfigFn(0, globalMaxSteps) // Call with default params
  return sum + config.maxScore
}, 0)

export const getLevelConfig = (level: number): LevelConfig => {
  // Phase 1: Levels 1-8 in order
  if (level <= levelConfigs.length) {
    return levelConfigs[level - 1](0, globalMaxSteps)
  }

  // Phase 2: Levels in random order
  if (level <= levelConfigs.length * 2) {
    // Generate random order for phase 2 if not already generated
    if (!phase2Order) {
      phase2Order = [...Array(levelConfigs.length).keys()]
      for (let i = phase2Order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[phase2Order[i], phase2Order[j]] = [phase2Order[j], phase2Order[i]]
      }
    }
    const phase2Index = (level - levelConfigs.length - 1) % levelConfigs.length
    return levelConfigs[phase2Order[phase2Index]](0, globalMaxSteps)
  }

  // Phase 3: Different random order with noise
  if (!phase3Order) {
    phase3Order = [...Array(levelConfigs.length).keys()]
    for (let i = phase3Order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[phase3Order[i], phase3Order[j]] = [phase3Order[j], phase3Order[i]]
    }
  }
  const phase3Index =
    (level - 2 * levelConfigs.length - 1) % levelConfigs.length
  return levelConfigs[phase3Order[phase3Index]](noiseLevel, globalMaxSteps)
}

export default getLevelConfig
