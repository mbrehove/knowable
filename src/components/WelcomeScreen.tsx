'use client' // Required for client-side interactivity

import React from 'react'
import '@/styles/style.css'

interface WelcomeScreenProps {
  onStart: () => void
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className='welcome-screen'>
      <h1>Knowable</h1>
      <p>
        Life is confusing. Many people give advice that worked for them, but
        you’re in a different situation with different choices. In this game,
        like life, you’ll make choices without knowing the rules and try to
        figure it out as you go along.
      </p>
      <button onClick={onStart} autoFocus>
        Press Enter to Continue
      </button>
    </div>
  )
}

export default WelcomeScreen
