// AdvicePanel.tsx
import React from 'react'
import DOMPurify from 'dompurify'
import { levelAdvice } from '../utils/levelConfig'

interface Advice {
  quote: string
  author: string
}

const AdvicePanel: React.FC<{ level: number }> = ({ level }) => {
  // Get all advice up to and including current level
  const adviceList = levelAdvice.slice(0, level)
  console.log('level:', level)
  console.log('adviceList length:', adviceList.length)
  return (
    <div className='advice-panel'>
      <h3>Advice</h3>
      <div className='advice-scroll-container'>
        <ul style={{ textAlign: 'left' }}>
          {adviceList.map((advice: Advice, index: number) => (
            <li key={index} style={{ textAlign: 'left' }}>
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
