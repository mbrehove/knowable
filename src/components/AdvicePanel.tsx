// AdvicePanel.tsx
import React, { useState } from 'react'
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
  const adviceList = adviceIndices.map(index => levelAdvice[index])

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className={styles.menuButton}
        onClick={() => setIsOpen(true)}
        aria-label='Open advice'
      >
        📝
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
