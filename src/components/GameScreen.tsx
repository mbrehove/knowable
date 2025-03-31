import React, { useState, useEffect, useCallback, useRef } from 'react'
import AdvicePanel from './AdvicePanel'
import AdviceModal from './AdviceModal'
import { LevelConfig, Description } from '../utils/types' // Assuming levelConfig is in the same directory
import ScorePlot from './ScorePlot' // Assuming ScorePlot is a React component
import Image from 'next/image'
import Arrow from '../../public/arrow.svg'

export interface LevelData {
  points: { x: number; y: number }[] // The points to bee plotted. x=turn y=score
  keyHistory: { key: string; time: number }[] //Histoy of keys pressed
  randomValues: Record<string, number> // random values generated at the start of the level (ie, what keys are worth what)
  description: Description //Level description in jsx
  level_ind: number //What index in level config this level used. Different from level since level_index repeats as the user advances levels
  version: number //For distinguishing different level versions. (currently unused)
  // maxScore: number // The maximum score possible this level
}

interface GameScreenProps {
  level: number
  config: LevelConfig
  onLevelComplete: (data: LevelData) => void
}

const GameScreen: React.FC<GameScreenProps> = ({
  level,
  config,
  onLevelComplete
}) => {
  const [points, setPoints] = useState<{ x: number; y: number }[]>([
    { x: 0, y: 0 }
  ])
  const [xDomain, setXDomain] = useState<[number, number]>([0, config.maxSteps])
  const [stepsTaken, setStepsTaken] = useState(0)
  const [keyHistory, setKeyHistory] = useState<{ key: string; time: number }[]>(
    []
  )
  const [lastKeyPressTime, setLastKeyPressTime] = useState(Date.now())
  const [isMobile, setIsMobile] = useState(false)

  // Refs for swipe handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const gameAreaRef = useRef<HTMLDivElement>(null)

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
    // Reset points and steps when the level changes
    setPoints([{ x: 0, y: 0 }])
    setStepsTaken(0)
    setKeyHistory([])
    setLastKeyPressTime(Date.now())
    // setShowAdviceModal(config.phase == 1)
  }, [level, config])

  // Add background color effect
  useEffect(() => {
    const root = document.documentElement
    if (config.phase <= 1) {
      root.style.setProperty(
        '--background-color',
        'var(--background-color-phase-0)'
      )
    } else if (config.phase <= 3) {
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
  }, [config.phase])

  // Apply scoring logic, udpat scores.
  const processKeyPress = useCallback(
    (key: string) => {
      const currentTime = Date.now()
      const time = (currentTime - lastKeyPressTime) / 1000
      setLastKeyPressTime(currentTime)

      const newY = config.scoringLogic(points, keyHistory, key, time)

      if (newY !== null) {
        setPoints(currentPoints => {
          const newX = currentPoints.length
          const updatedPoints = [...currentPoints, { x: newX, y: newY }]

          if (newX > xDomain[1]) {
            setXDomain([xDomain[0] + 10, xDomain[1] + 10])
          }

          return updatedPoints
        })

        setStepsTaken(steps => steps + 1)
        setKeyHistory(currentKeyHistory => [
          ...currentKeyHistory,
          { key, time }
        ])
      }
    },
    [lastKeyPressTime, config, keyHistory, points, xDomain]
  )

  // Handle all key presses and pass arrow keys to processKeyPress
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(
          event.key
        ) &&
        stepsTaken <= config.maxSteps
      ) {
        processKeyPress(event.key)
      }
    },
    [config.maxSteps, stepsTaken, processKeyPress]
  )

  // Handle touch start for swipe detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  // Handle touch end for swipe detection
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current || stepsTaken >= config.maxSteps) return

      const touch = e.changedTouches[0]
      const endX = touch.clientX
      const endY = touch.clientY

      const startX = touchStartRef.current.x
      const startY = touchStartRef.current.y

      const diffX = endX - startX
      const diffY = endY - startY

      // Minimum swipe distance (in pixels)
      const minSwipeDistance = 50

      // Determine swipe direction
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (Math.abs(diffX) > minSwipeDistance) {
          if (diffX > 0) {
            processKeyPress('ArrowRight')
          } else {
            processKeyPress('ArrowLeft')
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(diffY) > minSwipeDistance) {
          if (diffY > 0) {
            processKeyPress('ArrowDown')
          } else {
            processKeyPress('ArrowUp')
          }
        }
      }

      touchStartRef.current = null
    },
    [config.maxSteps, processKeyPress, stepsTaken]
  )

  // Add the keypress listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [
    stepsTaken,
    keyHistory,
    lastKeyPressTime,
    config,
    points,
    xDomain,
    handleKeyPress
  ])

  // Advance level if they're on the last step
  useEffect(() => {
    // Check if the level is complete
    if (stepsTaken >= config.maxSteps) {
      const levelData = {
        points,
        keyHistory,
        randomValues: config.randomValues,
        description: config.description,
        level_ind: config.level_ind,
        version: config.version
      }
      onLevelComplete(levelData)
    }
  }, [stepsTaken, config, onLevelComplete, points, keyHistory])

  return (
    <div
      className='game-layout fade-in'
      ref={gameAreaRef}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <div className='game-content'>
        {config.phase === 1 && config.advice.image && !isMobile && (
          <div className='author-image-container'>
            <Image
              src={config.advice.image}
              alt={config.advice.author}
              className='author-image'
              width={350}
              height={300}
            />
            <i>
              {config.advice.quote}
              <br />
            </i>
            -{config.advice.author}
          </div>
        )}

        {config.phase > 1 && (
          <AdvicePanel
            adviceIndices={config.adviceIndices}
            animate={false}
            showRule={true}
          />
        )}

        <div className='main-content'>
          <div style={{ minWidth: '500px' }}></div>
          <h2 className='title'>Level {level}</h2>

          {isMobile && config.phase === 1 && config.advice.image && (
            <div className='mobile-advice-text'>
              <i>"{config.advice.quote}"</i>
              <div className='mobile-author'>- {config.advice.author}</div>
            </div>
          )}

          <div className='score-text'>
            <p className='subtitle'>
              {isMobile
                ? 'Swipe in any direction to add points'
                : 'Press arrow keys to add points'}{' '}
              ({stepsTaken}/{config.maxSteps})
            </p>
          </div>

          <div className='plot-section'>
            <ScorePlot
              points={points}
              keyHistory={keyHistory}
              xDomain={xDomain}
              image={
                config.phase === 1 && isMobile ? config.advice.image : undefined
              }
              authorName={undefined}
              authorQuote={undefined}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameScreen
