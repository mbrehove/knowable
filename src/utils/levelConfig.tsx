// levelConfig.ts
import { ReactNode } from 'react'

const globalMaxSteps: number = 12

export type ScoringLogic = (
  currentPoints: { x: number; y: number }[],
  keyHistory: { key: string; time: number }[],
  eventKey: string,
  time: number
) => number | null

export type Description = (
  scores: { x: number; y: number }[],
  keyHistory: { key: string; time: number }[],
  percentile: number
) => ReactNode

export interface AdviceQuote {
  quote: string
  author: string
}

export const levelAdvice: AdviceQuote[] = [
  {
    quote:
      'Insanity is doing the same thing over and over again and expecting different results.',
    author: 'Rita Mae Brown'
  },
  {
    quote:
      'It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change.',
    author: 'Charels Darwin'
  },

  {
    quote: 'To improve is to change; to be perfect is to change often.',
    author: 'Winston Churchill'
  },
  {
    quote: "Rules are made for people who aren't willing to make their own.",
    author: 'Chuck Yeager'
  },
  {
    quote:
      'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.',
    author: 'Bruce Lee'
  },

  {
    quote: 'Patience is bitter, but its fruit is sweet.',
    author: 'Aristotle'
  }
]

export const numberOfLevels = levelAdvice.length
// {
//   quote:
//     'When one admits that nothing is certain one must, I think, also add that some things are more nearly certain than others.',
//   author: 'Bertrand Russell'
// },

// {
//   quote:
//     "Don't seek to have events happen as you wish, but wish them to happen as they do happen and you will be well.",
//   author: 'Epictetus'
// },

export interface LevelConfig {
  scoringLogic: ScoringLogic
  randomValues: Record<string, number>
  description: Description
  maxSteps: number
  level_ind: number
  version: number
}

const getNoise = (
  noise_level: number = 0,
  maxSteps: number = globalMaxSteps
) => {
  const noise_range = Array.from(
    { length: 2 * noise_level + 1 },
    (_, i) => i - noise_level
  )
  const repeatedNoise = Array(Math.ceil(maxSteps / noise_range.length))
    .fill(noise_range)
    .flat()
    .slice(0, maxSteps)
  const noise = [...repeatedNoise].sort(() => Math.random() - 0.5)
  const sum = noise.reduce((a, b) => a + b, 0)
  if (sum !== 0) {
    throw new Error(`Noise sum should be 0 but is ${sum}`)
  }
  return repeatedNoise
}

const levelConfigs: ((
  noise_level?: number,
  maxSteps?: number
) => LevelConfig)[] = [
  // Level 1
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 0
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const optimalScore =
      Math.max(leftValue, rightValue) * (maxSteps - 1) +
      Math.min(leftValue, rightValue)
    const noise = getNoise(noise_level, maxSteps)

    const scoringLogic: ScoringLogic = (
      currentPoints,
      _keyHistory,
      eventKey,
      _timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        0
        return null
      }
      return (
        lastY +
        (eventKey === 'ArrowRight' ? rightValue : leftValue) +
        noise[currentPoints.length - 1]
      )
    }

    const description: Description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores[scores.length - 1].y / optimalScore) * 100
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue}. The optimal strategy is to press
            the higher-scoring button. This would yield a score of{' '}
            {optimalScore}. Your score is <b>{scorePercent.toFixed(2)}%</b> of
            optimal. You scored better than <b>{percentile.toFixed(1)}%</b> of
            players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue },
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  },

  // Level 2: switch random values at maxSteps/2.
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 1
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const optimalScore =
      Math.max(leftValue, rightValue) * (maxSteps - 2) +
      Math.min(leftValue, rightValue) * 2
    const noise = getNoise(noise_level, maxSteps)
    const scoringLogic: ScoringLogic = (
      currentPoints,
      _keyHistory,
      eventKey,
      _timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      const newY =
        lastY +
        (currentPoints.length < maxSteps / 2
          ? eventKey === 'ArrowRight'
            ? rightValue
            : leftValue
          : eventKey === 'ArrowRight'
          ? leftValue
          : rightValue) +
        noise[currentPoints.length - 1]
      return newY
    }

    const description: Description = (scores, _keyHistory, percentile) => {
      const lastScore = scores.at(-1)
      const scorePercent = lastScore ? (lastScore.y / optimalScore) * 100 : 0
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gave a score of {leftValue} and
            pressing right gave {rightValue}. However, half way through the
            scores flipped. If you checked the scores again after this happend
            and adapted quickly, you could have achieved a score of{' '}
            {optimalScore}. Your score is <b>{scorePercent.toFixed(2)}% </b> of
            optimal. You scored better than <b>{percentile.toFixed(1)}%</b> of
            players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue },
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  },

  // Level 3: Score of each button increased each time the user alternated buttons
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 2
    const optimalScore = ((maxSteps - 1) * (maxSteps - 2)) / 2
    const noise = getNoise(noise_level, maxSteps)

    const scoringLogic: ScoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      _timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      // get just the key names (not the times)
      const keyTypes = [...keyHistory.map(entry => entry['key']), eventKey]
      // filter for only right and left
      const filteredKeyTypes = keyTypes.filter(
        key => key === 'ArrowRight' || key === 'ArrowLeft'
      )
      const switches = filteredKeyTypes
        .slice(1)
        .map((key, index) => (key !== filteredKeyTypes[index] ? 1 : 0))
      const switchCount = switches.reduce<number>((acc, val) => acc + val, 0)

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else {
        return lastY + switchCount + noise[currentPoints.length - 1]
      }
    }

    const description: Description = (scores, _keyHistory, percentile) => {
      const lastScore = scores.at(-1)
      const scorePercent = lastScore ? (lastScore.y / optimalScore) * 100 : 0
      return (
        <div>
          <p className='level-description-text'>
            In this level, both keys had a value equal to the number of times
            that you alternated keys.
            <br />
            Optimal play would have averaged {optimalScore.toFixed(2)}. <br />
            Your score is <b>{scorePercent.toFixed(2)}% </b> of optimal. You
            scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  },
  // Level 4: Set values for left, right up and down
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 3
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const upValue = Math.random() > 0.5 ? 10 : 5
    const downValue = upValue > 5 ? 5 : 10
    const noise = getNoise(noise_level, maxSteps)
    const scoringLogic: ScoringLogic = (
      currentPoints,
      _keyHistory,
      eventKey,
      _timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      let newY
      switch (eventKey) {
        case 'ArrowRight':
          newY = lastY + rightValue
          break
        case 'ArrowLeft':
          newY = lastY + leftValue
          break
        case 'ArrowUp':
          newY = lastY + upValue
          break
        case 'ArrowDown':
          newY = lastY + downValue
          break
        default:
          return null
      }
      if (newY === undefined) return null
      return newY + noise[currentPoints.length - 1]
    }

    const description: Description = (_scores, keyHistory, percentile) => {
      let additionalSentence = ''

      const keyNames = keyHistory.map(entry => entry.key)
      if (keyNames.includes('ArrowUp') || keyNames.includes('ArrowDown')) {
        additionalSentence =
          'You went outside the instructions and were rewarded for it. Good Job.'
      } else {
        additionalSentence =
          "The instructions never said anything about using the up or down arrows, but life doesn't always come with good instructions."
      }
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue} while pressing the up or down
            arrows gives {upValue} and {downValue}. {additionalSentence} You
            scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue, upValue, downValue },
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  },
  // Level 5: score of each button is the number of times it was pressed.
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 4
    const optimalScore = ((maxSteps - 1) * maxSteps) / 2
    const noise = getNoise(noise_level, maxSteps)
    const scoringLogic: ScoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      _timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y

      const keyTypes = [...keyHistory.map(entry => entry['key']), eventKey]
      const arrowLeftCount = keyTypes.filter(key => key === 'ArrowLeft').length
      const arrowRightCount = keyTypes.filter(
        key => key === 'ArrowRight'
      ).length

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else if (eventKey === 'ArrowLeft') {
        return lastY + arrowLeftCount + noise[currentPoints.length - 1]
      } else if (eventKey === 'ArrowRight') {
        return lastY + arrowRightCount + noise[currentPoints.length - 1]
      } else {
        return null
      }
    }

    const description: Description = (scores, _keyHistory, percentile) => {
      const lastScore = scores.at(-1)
      const scorePercent = lastScore ? (lastScore.y / optimalScore) * 100 : 0
      return (
        <div>
          <p className='level-description-text'>
            In this level, the score you from a button equals the number of
            times the button was pressed. The optimal play would press the same
            button each turn and yeild a score of {optimalScore}. Your score is{' '}
            <b>{scorePercent.toFixed(2)}% </b> of optimal. You scored better
            than <b>{percentile.toFixed(1)}%</b> of players on this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  },
  // Level 6: Slow down
  (noise_level: number = 0, maxSteps: number = globalMaxSteps) => {
    const level_ind = 5
    const optimalScore = ((maxSteps - 1) * maxSteps) / 2
    const noise = getNoise(noise_level, maxSteps)
    const scoringLogic: ScoringLogic = (
      currentPoints,
      _keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return (
        lastY +
        Math.min(10, Math.floor(timeInterval)) +
        noise[currentPoints.length - 1]
      )
    }

    const description: Description = (_scores, _keyHistory, percentile) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level your score for each key is determined by the number of{' '}
            seconds between keypresses.
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            {levelAdvice[level_ind].quote}
            <br />
          </i>
          -{levelAdvice[level_ind].author}
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind,
      version: 0
    }
  }
]

// Modify the return type to include possible phase transitions
const getLevelConfig = (
  level: number,
  gameState: string
): LevelConfig => {
  // Phase 1: Levels 1-8 in order
  if (level <= levelConfigs.length) {
    return levelConfigs[level - 1](0, globalMaxSteps)
  }

  // Phase 2: Random levels
  if (level <= levelConfigs.length * 2 + 1) {
    const randomIndex = Math.floor(Math.random() * levelConfigs.length)
    return levelConfigs[randomIndex](0, globalMaxSteps)
  }

  // Phase 3: Random levels with noise
  const randomIndex = Math.floor(Math.random() * levelConfigs.length)
  const config = levelConfigs[randomIndex](1, globalMaxSteps)

  return config
}

export default getLevelConfig
