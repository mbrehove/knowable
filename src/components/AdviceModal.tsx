import React, { useEffect } from 'react'
import { levelAdvice } from '../utils/levelManager'
import styles from './AdviceModal.module.css'

interface AdviceModalProps {
  level: number
  onClose: () => void
}

const AdviceModal: React.FC<AdviceModalProps> = ({ level, onClose }) => {
  useEffect(() => {
    if (!levelAdvice[level - 1]) {
      onClose()
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [level, onClose])

  if (!levelAdvice[level - 1]) {
    return null
  }

  const currentAdvice = levelAdvice[level - 1]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Advice for Level {level}</h2>
        <div className={styles.advice}>
          <i>{currentAdvice.quote}</i>
          <br />- {currentAdvice.author}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.closeButton} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdviceModal
