'use client'
import { useState, useEffect } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import GameScreen from '@/components/GameScreen'
import LevelCompleteScreen from '../components/LevelCompleteScreen'
import getLevelConfig, { LevelConfig } from '../utils/levelConfig'

export default function GamePage () {
  const [gameState, setGameState] = useState('welcome')
  const [currentLevel, setCurrentLevel] = useState(1)
  const [gameData, setGameData] = useState<{ [key: number]: any }>({})
  const [levelConfig, setLevelConfig] = useState<LevelConfig>({} as LevelConfig)

  useEffect(() => {
    if (gameState === 'playing') {
      const config = getLevelConfig(currentLevel)
      setLevelConfig(config)
    }
  }, [gameState, currentLevel])

  const startNewGame = () => {
    setCurrentLevel(1)
    setGameData({})
    setGameState('playing')
  }

  const proceedToNextLevel = () => {
    setCurrentLevel(prevLevel => prevLevel + 1)
    setGameState('playing')
  }

  interface LevelData {
    [key: number]: any
  }

  interface HandleLevelComplete {
    (levelData: any): void
  }

  const handleLevelComplete: HandleLevelComplete = levelData => {
    setGameData((prevData: LevelData) => ({
      ...prevData,
      [currentLevel]: levelData
    }))
    setGameState('levelComplete')
  }

  return (
    <div>
      {gameState === 'welcome' && <WelcomeScreen onStart={startNewGame} />}
      {gameState === 'playing' && levelConfig && (
        <GameScreen
          level={currentLevel}
          onLevelComplete={handleLevelComplete}
          config={levelConfig}
        />
      )}
      {gameState === 'levelComplete' && levelConfig && (
        <LevelCompleteScreen
          level={currentLevel}
          onNextLevel={proceedToNextLevel}
          levelData={gameData[currentLevel]}
          config={levelConfig}
        />
      )}
    </div>
  )
}

// import Image from 'next/image'

// export default function Home () {
//   return (
//     <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]'>
//       <main className='flex flex-col gap-8 row-start-2 items-center sm:items-start'>
//         <Image
//           className='dark:invert'
//           src='/next.svg'
//           alt='Next.js logo'
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className='list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]'>
//           <li className='mb-2'>
//             I successfully made a change to this{' '}
//             <code className='bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold'>
//               src/app/page.tsx
//             </code>
//             .
//           </li>
//           <li>Save and see your changes instantly.</li>
//         </ol>
//       </main>
//     </div>
//   )
// }
