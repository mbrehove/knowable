import { LevelConfig, AdviceQuote } from './types'
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
import { createThreesConfig, threesAdvice } from './threes'
import { shuffleArray } from './utils'

let phase2Order: number[] | null = null
let phase3Order: number[] | null = null
let phase4Order: number[] | null = null

const levelConfigs = [
  createFixedConfig,
  createSwapConfig,
  createNPressedConfig,
  createNAlternateConfig,
  createInvestConfig,
  createNSecondsConfig,
  createSpeedConfig,
  createUpDownConfig,
  createNegateConfig,
  createThreesConfig,
  createRandomConfig
]

export const levelAdvice: AdviceQuote[] = [
  fixedAdvice,
  swapAdvice,
  nPressedAdvice,
  nAlternateAdvice,
  investAdvice,
  nSecondsAdvice,
  speedAdvice,
  upDownAdvice,
  negateAdvice,
  threesAdvice,
  randomAdvice
]

export const globalMaxSteps = 12
export const noiseLevel = 1
export const numConfigs = levelConfigs.length
export const nPhase2Levels = 4
export const phaseEnds = [
  numConfigs,
  numConfigs + nPhase2Levels,
  numConfigs * 2 + nPhase2Levels,
  numConfigs * 3 + nPhase2Levels
]
export const phaseNames = [
  'Welcome',
  'Innocence',
  'Training',
  'Experience',
  'Wisdom'
]

export const totalOptimalScore = levelConfigs.reduce((sum, levelConfigFn) => {
  const config = levelConfigFn({
    noiseLevel: 0,
    maxSteps: globalMaxSteps,
    levelInd: 0,
    phase: 1,
    adviceIndices: []
  })
  return sum + config.maxScore
}, 0)

export const getLevelConfig = (level: number): LevelConfig => {
  if (!phase2Order) {
    phase2Order = shuffleArray([...Array(nPhase2Levels).keys()])
  }
  if (!phase3Order) {
    phase3Order = shuffleArray([...Array(levelConfigs.length).keys()])
  }
  if (!phase4Order) {
    phase4Order = shuffleArray([...Array(levelConfigs.length).keys()])
  }

  // Phase 1:
  if (level <= phaseEnds[0]) {
    return levelConfigs[level - 1]({
      noiseLevel: 0,
      maxSteps: globalMaxSteps,
      levelInd: level - 1,
      phase: 1,
      adviceIndices: []
    })
  }

  // Phase 2: The first nPhase2Levels  in random order
  if (level <= phaseEnds[1]) {
    console.log('running phase 2')
    const phase2Index = level - phaseEnds[0] - 1
    return levelConfigs[phase2Order[phase2Index]]({
      noiseLevel: 0,
      maxSteps: globalMaxSteps,
      levelInd: phase2Order[phase2Index],
      phase: 2,
      adviceIndices: Array.from({ length: nPhase2Levels }, (_, i) => i)
    })
  }

  // Phase 3: Levels in random order
  if (level <= phaseEnds[2]) {
    console.log('running phase 3')
    const phase3Index = level - phaseEnds[1] - 1
    return levelConfigs[phase3Order[phase3Index]]({
      noiseLevel: 0,
      maxSteps: globalMaxSteps,
      levelInd: phase3Order[phase3Index],
      phase: 3,
      adviceIndices: Array.from({ length: numConfigs }, (_, i) => i)
    })
  }

  // Phase 4
  const phase4Index = level - phaseEnds[2] - 1
  console.log('running phase 4')
  return levelConfigs[phase4Order[phase4Index]]({
    noiseLevel,
    maxSteps: globalMaxSteps,
    levelInd: phase4Order[phase4Index],
    phase: 4,
    adviceIndices: Array.from({ length: numConfigs }, (_, i) => i)
  })
}

export default getLevelConfig
