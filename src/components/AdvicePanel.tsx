// AdvicePanel.tsx
import React from 'react'
import styles from './AdvicePanel.module.css'
import { levelAdvice } from '../utils/levels/levelManager'

interface Advice {
  quote: string
  author: string
  rule: string
}

const AdvicePanel: React.FC<{
  level: number
  animate?: boolean
  showRule?: boolean
}> = ({ level, animate = false, showRule = true }) => {
  const adviceList = levelAdvice.slice(0, level) //.reverse()

  return (
    <div className={styles.advicePanel}>
      <h3>Advice</h3>
      <div className={styles.scrollContainer}>
        <ul>
          {adviceList.map((advice: Advice, index: number) => (
            <li
              key={index}
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
      <div className={styles.scrollIndicator}></div>
    </div>
  )
}

export default AdvicePanel
