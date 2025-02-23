function getRandomInt (min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getNoise (level: number, length: number = 12) {
  if (length <= 0) return []
  if (length === 1) return [0]

  const result = []
  let currentSum = 0

  for (let i = 0; i < length; i++) {
    const remaining = length - i - 1
    // For the remaining numbers, the sum they can achieve lies between -remaining*level and remaining*level.
    // To eventually reach a total sum of 0, the next number x must satisfy:
    //   currentSum + x + [minPossible, maxPossible] contains 0.
    // That is, x must be in the interval [-remaining*level - currentSum, remaining*level - currentSum].
    const lowerBound = Math.max(-level, -remaining * level - currentSum)
    const upperBound = Math.min(level, remaining * level - currentSum)

    if (lowerBound > upperBound) {
      throw new Error('No valid solution exists with the given parameters.')
    }

    const x = getRandomInt(lowerBound, upperBound)
    result.push(x)
    currentSum += x
  }

  return result
}

// Add this utility function to handle array shuffling
export const shuffleArray = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

interface ScoreSubmission {
  level_ind: number
  level: number
  score: number
  version: number
  user_id: string
  percentScore: number
  accuracy: number
  phase: number
}

export const calculatePercentile = (
  currentScore: number,
  scores: number[]
): number => {
  if (scores.length === 0) return 100

  const sortedScores = [...scores].sort((a, b) => a - b)
  // Find the position where the current score would fit
  // Add 1 to handle the case where the score is higher than all others
  const rank = sortedScores.filter(score => score < currentScore).length + 1
  return (rank / (sortedScores.length + 1)) * 100
}

export const fetchScores = async (
  level_ind: number,
  version: number
): Promise<number[]> => {
  const response = await fetch(
    `/api/scores?type=level_scores&level_ind=${level_ind}&version=${version}`
  )
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}

export const submitScore = async (data: ScoreSubmission): Promise<void> => {
  const response = await fetch('/api/scores', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const result = await response.json()
  console.log('Score submitted successfully:', result)
}
