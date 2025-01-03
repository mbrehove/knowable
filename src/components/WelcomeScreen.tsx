'use client'

import React, { useEffect, useState } from 'react'
import { numberOfLevels, totalOptimalScore } from '../utils/levels/levelManager'

interface WelcomeScreenProps {
  onStart: () => void
  onSkip?: () => void
  level: number
}

interface PhaseScore {
  totalScore: number
  percentile: number | undefined | null
}

// New component for phase content
const PhaseContent: React.FC<{
  phase: number
  score?: PhaseScore
}> = ({ phase, score }) => {
  if (phase === 0) {
    return (
      <>
        <h1>Knowable</h1>
        <div className='welcome-content'>
          <p>
            Life is confusing. In this game, like life, you'll make choices
            without knowing the rules and try to figure it out as you go along.
            You'll get advice, but like life advice, it's not always clear how
            to apply it. But don't worry you'll be ok.
          </p>
        </div>
      </>
    )
  }

  if (!score && phase > 0) {
    return (
      <>
        <h1>Phase {phase + 1}</h1>
        <p>Loading...</p>
      </>
    )
  }

  const { totalScore, percentile } = score || {
    totalScore: 0,
    percentile: undefined
  }
  const percentileElement = percentile !== null && percentile !== undefined && (
    <p className='percentile'>
      You scored better than <strong>{Math.round(percentile)}%</strong> of
      players, but comparison is the theif of joy. You did your best and that's
      what counts.
    </p>
  )

  if (phase === 1) {
    return (
      <>
        <h1>Phase 2</h1>
        <div className='welcome-content'>
          <p>
            You completed Phase 1 with a total score of{' '}
            <strong>{totalScore}</strong> out of a possible{' '}
            <strong>{totalOptimalScore}</strong>.
          </p>
          {percentileElement}
          <p>
            You've played all the levels and heard all the advie. But in life
            it's not always clear which advice to follow. Even good advice in
            the wrong situation is bad advice. In this next phase you'll have to
            figure out which of the levels you're playing and what advice to
            use. Good luck!
          </p>
        </div>
      </>
    )
  }

  if (phase === 2) {
    return (
      <>
        <h1>Phase 3</h1>
        <div className='welcome-content'>
          <p>
            You completed Phase 2 with a total score of{' '}
            <strong>{totalScore}</strong> out of a possible{' '}
            <strong>{totalOptimalScore}</strong>.
          </p>
          {percentileElement}
          <p>
            So far you've been able to see the results of your choices pretty
            clearly. But life is messy, and it's hard to see how good the
            choices you've made really are. In this final phase you might get a
            point added or subtracted from your score every turn. Don't worry,
            it all evens out in the end. Good luck!
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <h1>The End</h1>
      <div className='welcome-content'>
        <p>
          Congratulations! You completed the final phase with a score of{' '}
          <strong>{totalScore}</strong> out of a possible{' '}
          <strong>{totalOptimalScore}</strong>.
        </p>
        {percentileElement}
        <p>I hope you enjoyed playing. Keep making good choices.</p>
      </div>
    </>
  )
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

  return (
    <div className='welcome-screen'>
      <PhaseContent phase={phase} score={phaseScore || undefined} />
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
