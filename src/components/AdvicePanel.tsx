// AdvicePanel.tsx
import React from 'react'
import styles from './AdvicePanel.module.css'
import { levelAdvice } from '../utils/levels/levelManager'

interface Advice {
  quote: string
  author: string
}

const AdvicePanel: React.FC<{
  level: number
  animate?: boolean
}> = ({ level, animate = false }) => {
  const adviceList = levelAdvice.slice(0, level).reverse()

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
              <i>{advice.quote}</i>
              <br />- {advice.author}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdvicePanel
