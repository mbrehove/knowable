'use client'

import React, { useEffect, useState } from 'react'
import { totalOptimalScore, phaseEnds, phaseNames } from '../utils/levelManager'

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
        <h1>
          Knowable <br />
          Part 1: Innocence
        </h1>
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
        <h1>Knowable</h1>
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
        <h1>
          Knowable
          <br />
          Part 2: Training
        </h1>
        <div className='welcome-content'>
          <p>
            You completed the <strong>Part 1: Innocence</strong> with a total
            score of <strong>{totalScore}</strong> out of a possible{' '}
            <strong>{totalOptimalScore}</strong>.
          </p>
          {percentileElement}
          <p>
            You've played all the levels and heard all the advie. But in life
            it's not always clear which advice to follow. Even good advice in
            the wrong situation is bad advice. In this next phase you'll have to
            figure out which of the levels you're playing and what advice to
            use. Don't worry, we'll start you off with just{' '}
            {phaseEnds[1] - phaseEnds[0]} bits of advice to choose from. Good
            luck!
          </p>
        </div>
      </>
    )
  }
  if (phase === 2) {
    return (
      <>
        <h1>
          Knowable
          <br />
          Part 2: Experience
        </h1>
        <div className='welcome-content'>
          <p>
            You're starting to get how this works now. It takes some time to
            figure out what advice to use. We all need to figure out what works
            for us by sorting through the noise. But the training wheels are off
            now and you'll have all the levels to choose from. Good luck!
          </p>
        </div>
      </>
    )
  }
  if (phase === 3) {
    return (
      <>
        <h1>
          Knowable
          <br />
          Part 3: Wisdom
        </h1>
        <div className='welcome-content'>
          <p>
            You completed <strong>Part 2: Experience</strong> with a total score
            of <strong>{totalScore}</strong> out of a possible{' '}
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
      <h1>
        Knowable
        <br />
        The End
      </h1>
      <div className='welcome-content'>
        <p>
          Congratulations! You completed <strong>Part 3: Wisdom</strong> with a
          score of <strong>{totalScore}</strong> out of a possible{' '}
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
  const [isMobile, setIsMobile] = useState(false)
  const foundPhase = phaseEnds.findIndex(endLevel => level <= endLevel)
  const phase = foundPhase === -1 ? phaseEnds.length : foundPhase // phaseEnds.length is the game end

  const isGameEnd = phase === phaseEnds.length

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const fetchPhaseScores = async () => {
      if (phase === 0) return

      const user_id = localStorage.getItem('user_id')
      if (!user_id) {
        console.error('No user_id found in localStorage')
        return
      }

      const previousPhase = phase - 1

      try {
        // First get the user's total score for this phase from the scores table
        const response = await fetch(
          `/api/scores?type=user_phase_scores&phase=${phase}&user_id=${user_id}`
        )

        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData
          })
          throw new Error(`Failed to fetch user scores: ${response.statusText}`)
        }

        const data = await response.json()
        console.log('Received score data:', data)

        // Submit this score to phase_scores
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase: phase,
            score: data.totalScore,
            user_id,
            version: 0
          })
        })

        // Get all phase scores to calculate percentile
        const phaseResponse = await fetch(
          `/api/scores?type=phase_scores&phase=${previousPhase}&version=0`
        )
        if (!phaseResponse.ok) {
          console.error('Failed to fetch phase scores')
          setPhaseScore({ totalScore: data.totalScore, percentile: null })
          return
        }
        const scores: number[] = await phaseResponse.json()

        const rank = scores.filter(score => score < data.totalScore).length
        const percentile =
          scores.length > 1 ? (rank / scores.length) * 100 : null
        console.log('phaseScore', {
          totalScore: data.totalScore,
          percentile,
          rank,
          scores
        })

        setPhaseScore({ totalScore: data.totalScore, percentile })
      } catch (error) {
        console.error('Error:', error)
      }
    }

    fetchPhaseScores()
  }, [phase])

  // Add background color effect
  useEffect(() => {
    const root = document.documentElement
    if (phase == 0) {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-0)'
      )
    } else if (phase <= 2) {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-2)'
      )
    } else {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-4)'
      )
    }
  }, [phase])

  return (
    <div className='game-layout welcome-screen'>
      <div className='welcome-container'>
        <PhaseContent phase={phase} score={phaseScore || undefined} />
        <div className='button-container'>
          {!isGameEnd && (
            <>
              <button onClick={onStart} autoFocus>
                {isMobile ? 'Tap to start' : 'Press Enter to Continue'}
              </button>
              {onSkip && phase < phaseEnds.length - 1 && (
                <button onClick={onSkip}>
                  Skip to {phaseNames[phase + 2]}{' '}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
