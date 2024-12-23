'use client' // Required for client-side interactivity

import React from 'react'
import { numberOfLevels } from '../utils/levelConfig'

interface WelcomeScreenProps {
  onStart: () => void
  onSkip?: () => void
  level: number
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onSkip,
  level
}) => {
  // Calculate which phase we're in (0-based)
  const phase = Math.floor((level - 1) / numberOfLevels)

  const messages = [
    // Initial welcome message
    {
      title: 'Knowable',
      content:
        'Life is confusing. Many people give advice that worked for them, but ' +
        "you're in a different situation with different choices. In this game, " +
        "like life, you'll make choices without knowing the rules and try to " +
        'figure it out as you go along.'
    },
    // Add messages for subsequent phases here
    {
      title: 'Phase 2',
      content: "You've learned the basics. Now things will get more complex..."
    },
    {
      title: 'Phase 3',
      content: 'The final phase begins. Can you master the system?'
    }
    // Add more phases as needed
  ]

  const currentMessage = messages[phase] || messages[0]

  return (
    <div className='welcome-screen'>
      <h1>{currentMessage.title}</h1>
      <p>{currentMessage.content}</p>
      <div className='button-container'>
        <button onClick={onStart} autoFocus>
          Press Enter to Continue
        </button>
        {onSkip && <button onClick={onSkip}>Skip to Next Phase</button>}
      </div>
    </div>
  )
}

export default WelcomeScreen
