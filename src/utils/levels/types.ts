import { ReactNode } from 'react'

export type ScoringLogic = (
  currentPoints: { x: number; y: number }[],
  keyHistory: { key: string; time: number }[],
  eventKey: string,
  time: number
) => number | null

export type Description = (
  scores: { x: number; y: number }[],
  keyHistory: { key: string; time: number }[],
  percentile: number
) => ReactNode

export interface AdviceQuote {
  quote: string
  author: string
}

export interface LevelConfig {
  scoringLogic: ScoringLogic
  randomValues: Record<string, number>
  description: Description
  maxSteps: number
  level_ind: number
  version: number
  optimalScore: number
  maxScore: number
}
