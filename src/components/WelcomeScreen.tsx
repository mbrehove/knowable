'use client'

import React, { useEffect, useState } from 'react'
import { numberOfLevels, totalOptimalScore } from '../utils/levelConfig'

interface WelcomeScreenProps {
  onStart: () => void
  onSkip?: () => void
  level: number
}

interface PhaseScore {
  totalScore: number
  percentile: number | null
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onSkip,
  level
}) => {
  const [phaseScore, setPhaseScore] = useState<PhaseScore | null>(null)
  const phase = Math.floor((level - 1) / numberOfLevels)

  useEffect(() => {
    const fetchPhaseScores = async () => {
      if (phase === 0) return

      const user_id = localStorage.getItem('user_id')
      if (!user_id) return

      const previousPhase = phase - 1
      const startLevel = previousPhase * numberOfLevels + 1
      const endLevel = phase * numberOfLevels

      try {
        // First get the user's total score for this phase from the scores table
        const response = await fetch(
          `/api/scores?start_level=${startLevel}&end_level=${endLevel}&user_id=${user_id}`
        )
        if (!response.ok) throw new Error('Failed to fetch user scores')
        const { totalScore } = await response.json()

        // Submit this score to phase_scores
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase: previousPhase,
            score: totalScore,
            user_id,
            version: 0
          })
        })

        // Get all phase scores to calculate percentile
        const phaseResponse = await fetch(
          `/api/scores?phase=${previousPhase}&version=0`
        )
        if (!phaseResponse.ok) throw new Error('Failed to fetch phase scores')
        const scores: number[] = await phaseResponse.json()

        const rank = scores.filter(score => score < totalScore).length
        const percentile =
          scores.length > 1 ? (rank / scores.length) * 100 : null
        console.log('phaseScore', { totalScore, percentile, rank, scores })

        setPhaseScore({ totalScore, percentile })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchPhaseScores()
  }, [phase])

  const getPhaseMessage = (phase: number, score?: PhaseScore) => {
    if (phase === 0) {
      return {
        title: 'Knowable',
        content:
          'Life is confusing. Many people give advice that worked for them, but ' +
          "you're in a different situation with different choices. In this game, " +
          "like life, you'll make choices without knowing the rules and try to " +
          'figure it out as you go along.'
      }
    }

    if (!score) return { title: `Phase ${phase + 1}`, content: 'Loading...' }

    const { totalScore, percentile } = score
    const percentileText =
      percentile !== null
        ? `You scored better than ${Math.round(percentile)}% of players.`
        : ''

    if (phase === 1) {
      return {
        title: 'Phase 2',
        content: `You completed Phase 1 with a total score of ${totalScore} out of a possible ${totalOptimalScore}. ${percentileText} Now things will get more complex...`
      }
    }

    if (phase === 2) {
      return {
        title: 'Phase 3',
        content: `You mastered Phase 2 with a score of ${totalScore} out of a possible ${totalOptimalScore}. ${percentileText} The final phase begins. Can you master the system?`
      }
    }

    return {
      title: 'Complete',
      content: `Congratulations! You completed the final phase with a score of ${totalScore} out of a possible ${totalOptimalScore}. ${percentileText} Thank you for playing!`
    }
  }

  const currentMessage = getPhaseMessage(phase, phaseScore || undefined)

  return (
    <div className='welcome-screen'>
      <h1>{currentMessage.title}</h1>
      <p>{currentMessage.content}</p>
      <div className='button-container'>
        {phase < 3 && (
          <>
            <button onClick={onStart} autoFocus>
              Press Enter to Continue
            </button>
            {onSkip && phase < 2 && (
              <button onClick={onSkip}>Skip to Phase {phase + 2}</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default WelcomeScreen
