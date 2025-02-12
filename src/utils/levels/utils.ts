export const getNoise = (noise_level: number = 0, maxSteps: number = 12) => {
  const noise_range = Array.from(
    { length: 2 * noise_level + 1 },
    (_, i) => i - noise_level
  )
  const repeatedNoise = Array(Math.ceil(maxSteps / noise_range.length))
    .fill(noise_range)
    .flat()
    .slice(0, maxSteps)
  const noise = [...repeatedNoise].sort(() => Math.random() - 0.5)
  let sum = noise.reduce((a, b) => a + b, 0)
  noise[noise.length - 1] = -sum + noise[noise.length - 1]
  sum = noise.reduce((a, b) => a + b, 0)
  if (sum !== 0) {
    throw new Error(`Noise sum should be 0 but is ${sum}`)
  }
  return noise
}

// Add this utility function to handle array shuffling
export const shuffleArray = (array: number[]): number[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export const globalMaxSteps = 12
