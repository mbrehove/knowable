// levelConfig.js
const globalMaxSteps = 12
const levelConfigs = [
  // Level 1: set random values for left and right.
  () => {
    const maxSteps = globalMaxSteps
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const optimalScore =
      Math.max(leftValue, rightValue) * (maxSteps - 1) +
      Math.min(leftValue, rightValue)

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      let newY
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      newY = lastY + (eventKey === 'ArrowRight' ? rightValue : leftValue)
      return newY
    }

    const description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores.at(-1).y / optimalScore) * 100
      return (
        <div>
          <p className='level-description-text'>
            In this level, pressing left gives a score of {leftValue} and
            pressing right gives {rightValue}. The optimal strategy is just to
            check the value of each button and keep pressing the one that gives
            you a higher score. This would have yielded a score of{' '}
            {optimalScore}. Your score is <b>{scorePercent.toFixed(2)}% </b> of
            optimal. You scored better than <b>{percentile.toFixed(1)}%</b> of
            players on this level.
          </p>
          <p>Advice:</p>
          <i>
            Insanity is doing the same thing over and over again and expecting
            different results.
            <br />
          </i>
          -Rita Mae Brown
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue },
      description,
      maxSteps,
      level_ind: 0
    }
  },
  // Level 2: switch random values at maxSteps/2.
  () => {
    const maxSteps = globalMaxSteps
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const optimalScore =
      Math.max(leftValue, rightValue) * (maxSteps - 2) +
      Math.min(leftValue, rightValue) * 2

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      let newY
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      newY =
        lastY +
        (currentPoints.length < maxSteps / 2
          ? eventKey === 'ArrowRight'
            ? rightValue
            : leftValue
          : eventKey === 'ArrowRight'
          ? leftValue
          : rightValue)
      return newY
    }

    const description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores.at(-1).y / optimalScore) * 100
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
            It is not the strongest of the species that survives, nor the most
            intelligent that survives. It is the one that is most adaptable to
            change.
            <br />
          </i>
          -Charels Darwin
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue },
      description,
      maxSteps,
      level_ind: 1
    }
  },
  // Level 3: score of each button has a mean plus a random value.
  () => {
    const maxSteps = globalMaxSteps
    const width = 4
    const separation = 4
    const lower = -2
    const higher = lower + separation
    const leftValue = Math.random() < 0.5 ? lower : higher
    const rightValue = leftValue === lower ? higher : lower
    const optimalScore = higher * (maxSteps - 3) + lower * 3

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      const randVal = Math.floor(Math.random() * (width + 1) - width / 2)
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else if (eventKey === 'ArrowLeft') {
        return lastY + leftValue + randVal
      } else if (eventKey === 'ArrowRight') {
        return lastY + rightValue + randVal
      }
    }

    const description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores.at(-1).y / optimalScore) * 100
      return (
        <div>
          <p className='level-description-text'>
            In this level, the right key had an average value of {rightValue}{' '}
            and the left had an average of {leftValue}. A random number between{' '}
            {-width / 2} and {width / 2} was added each turn. Choosing the key
            with the higher value each turn would yeild an average score of{' '}
            {optimalScore}
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
            {/* Optimal play would have averaged {optimalScore.toFixed(2)}. <br />
            Your score is <b>{scorePercent.toFixed(2)}% </b> of optimal. */}
          </p>
          <p>Advice:</p>
          <i>
            When one admits that nothing is certain one must, I think, also add
            that some things are more nearly certain than others.
            <br />
          </i>
          -Bertrand Russell:
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind: 2
    }
  },
  // Level 4: Score of each button increased each time the user alternated buttons
  () => {
    const maxSteps = globalMaxSteps
    const optimalScore = ((maxSteps - 1) * (maxSteps - 2)) / 2

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      // get just the key names (not the times)
      const keyTypes = keyHistory.map(entry => entry['key'])
      // filter for only right and left
      const filteredKeyTypes = keyTypes.filter(
        key => key === 'ArrowRight' || key === 'ArrowLeft'
      )
      const switches = filteredKeyTypes
        .slice(1)
        .map((key, index) => (key !== filteredKeyTypes[index] ? 1 : 0))
      const switchCount = switches.reduce((acc, val) => acc + val, 0)

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else {
        return lastY + switchCount
      }
    }

    const description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores.at(-1).y / optimalScore) * 100
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
            To improve is to change; to be perfect is to change often.
            <br />
          </i>
          -Winston Churchill
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind: 3
    }
  },
  // Level 5: Set values for left, right up and down
  () => {
    const maxSteps = globalMaxSteps
    const leftValue = Math.random() > 0.5 ? 2 : -1
    const rightValue = leftValue > 0 ? -1 : 2
    const upValue = Math.random() > 0.5 ? 10 : 5
    const downValue = upValue > 5 ? 5 : 10

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
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
      return newY
    }

    const description = (scores, keyHistory, percentile) => {
      let additionalSentence = ''

      if (keyHistory.includes('ArrowUp') || keyHistory.includes('ArrowDown')) {
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
            "Rules are made for people who aren't willing to make their own."
            <br />
          </i>
          -Chuck Yeager
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: { leftValue, rightValue, upValue, downValue },
      description,
      maxSteps,
      level_ind: 4
    }
  },
  // Level 6: score of each button is the number of times it was pressed.
  () => {
    const maxSteps = globalMaxSteps
    const optimalScore = ((maxSteps - 1) * maxSteps) / 2

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y

      const keyTypes = keyHistory.map(entry => entry['key'])
      const arrowLeftCount = keyTypes.filter(key => key === 'ArrowLeft').length
      const arrowRightCount = keyTypes.filter(
        key => key === 'ArrowRight'
      ).length

      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      } else if (eventKey === 'ArrowLeft') {
        return lastY + arrowLeftCount
      } else if (eventKey === 'ArrowRight') {
        return lastY + arrowRightCount
      }
    }

    const description = (scores, keyHistory, percentile) => {
      const scorePercent = (scores.at(-1).y / optimalScore) * 100
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
            I fear not the man who has practiced 10,000 kicks once, but I fear
            the man who has practiced one kick 10,000 times.
            <br />
          </i>
          -Bruce Lee
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind: 5
    }
  },
  // Level 7: Random scores
  () => {
    const maxSteps = globalMaxSteps

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      if (Math.random() > 0.5) {
        return lastY + 1
      } else {
        return lastY - 1
      }
    }

    const description = (scores, keyHistory, percentile) => {
      return (
        <div>
          <p className='level-description-text'>
            In this level your score increased or decreased by one randomly when
            you pressed either key with the average score being zero. Hopefully
            you didn't stress yourself out too much trying to find a pattern.{' '}
            <br />
            You scored better than <b>{percentile.toFixed(1)}%</b> of players on
            this level.
          </p>
          <p>Advice:</p>
          <i>
            Don't seek to have events happen as you wish, but wish them to
            happen as they do happen and you will be well.
            <br />
          </i>
          -Epictetus
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps,
      level_ind: 6
    }
  },
  // Level 8: Duration
  () => {
    const maxSteps = globalMaxSteps

    const scoringLogic = (
      currentPoints,
      keyHistory,
      eventKey,
      timeInterval
    ) => {
      const lastPoint = currentPoints[currentPoints.length - 1]
      const lastY = lastPoint.y
      if (eventKey !== 'ArrowRight' && eventKey !== 'ArrowLeft') {
        return null
      }
      return lastY + Math.min(10, Math.floor(timeInterval))
    }

    const description = (scores, keyHistory, percentile) => {
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
            Patience is bitter, but its fruit is sweet.
            <br />
          </i>
          -Aristotle
        </div>
      )
    }

    return {
      scoringLogic,
      randomValues: {},
      description,
      maxSteps
    }
  }
]

const getLevelConfig = level => {
  var level_ind = level - 1 // Adjust for zero-based index
  if (level_ind > levelConfigs.length - 1) {
    level_ind = Math.floor(Math.random() * levelConfigs.length)
  }

  return levelConfigs[level_ind]
}

export default getLevelConfig

/*
Some good quotes for later?
http://www.math.wpi.edu/Course_Materials/SAS/quotes.html
*/
