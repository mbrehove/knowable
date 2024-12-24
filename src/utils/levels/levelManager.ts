import { LevelConfig } from './types'
import { createFixedConfig } from './fixed'
import { createSwapConfig } from './swap'
import { createNAlternateConfig } from './nAlternate'
import { createUpDownConfig } from './upDown'
import { createNPressedConfig } from './nPressed'
import { createNSecondsConfig } from './nSeconds'

const levelConfigs = [
  (noise: number, maxSteps: number) => createFixedConfig(noise, maxSteps, 0),
  (noise: number, maxSteps: number) => createSwapConfig(noise, maxSteps, 1),
  (noise: number, maxSteps: number) =>
    createNAlternateConfig(noise, maxSteps, 2),
  (noise: number, maxSteps: number) => createUpDownConfig(noise, maxSteps, 3),
  (noise: number, maxSteps: number) => createNPressedConfig(noise, maxSteps, 4),
  (noise: number, maxSteps: number) => createNSecondsConfig(noise, maxSteps, 5)
]

export const globalMaxSteps = 12

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
