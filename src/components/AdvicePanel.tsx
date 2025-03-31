// AdvicePanel.tsx
import React, { useState, useEffect } from 'react'
import styles from './AdvicePanel.module.css'
import { levelAdvice } from '../utils/levelManager'

interface Advice {
  quote: string
  author: string
  rule: string
}

const AdvicePanel: React.FC<{
  adviceIndices: number[]
  animate?: boolean
  showRule?: boolean
}> = ({ adviceIndices, animate = false, showRule = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const adviceList = adviceIndices.map(index => levelAdvice[index])

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close panel when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const panel = document.querySelector(`.${styles.advicePanel}`)
        const menuButton = document.querySelector(`.${styles.menuButton}`)

        if (
          panel &&
          !panel.contains(event.target as Node) &&
          menuButton &&
          !menuButton.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, isOpen])

  // Close panel when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscKey)
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.menuButton}
        onClick={() => setIsOpen(true)}
        aria-label='Open advice'
      >
        📝 Advice
      </button>

      {/* Panel Content */}
      <div className={`${styles.advicePanel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3>Advice</h3>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label='Close advice'
          >
            ✕
          </button>
        </div>
        <div className={styles.scrollContainer}>
          <ul>
            {adviceList.map((advice: Advice, index: number) => (
              <li
                key={advice.quote}
                className={`${styles.adviceItem} ${
                  animate ? styles.animated : ''
                }`}
                style={{
                  animationDelay: animate ? `${index * 0.15}s` : undefined
                }}
              >
                <div className={styles.quoteColumn}>
                  <i>{advice.quote}</i>
                  <span className={styles.author}>- {advice.author}</span>
                </div>
                {showRule && (
                  <div className={styles.ruleColumn}>{advice.rule}</div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Overlay for mobile */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  )
}

export default AdvicePanel
