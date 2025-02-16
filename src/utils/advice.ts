import { AdviceQuote } from './types'

export const levelAdvice: AdviceQuote[] = [
  {
    quote:
      'Insanity is doing the same thing over and over again and expecting different results.',
    author: 'Rita Mae Brown',
    rule: 'One key adds 2 and the other subtracts 1'
  },
  {
    quote:
      'It is not the strongest of the species that survives, nor the most intelligent that survives. It is the one that is most adaptable to change.',
    author: 'Charels Darwin',
    rule: 'One key adds 2 and the other subtracts 1. The keys switch at two random times during play.'
  },
  {
    quote: 'To improve is to change; to be perfect is to change often.',
    author: 'Winston Churchill',
    rule: 'Each key adds points equal to the number of times the player has alternated keys.'
  },
  {
    quote: "Rules are made for people who aren't willing to make their own.",
    author: 'Chuck Yeager',
    rule: 'Left and right keys give either 2 or -1 points. Up and down give either 3 or 4 points.'
  },
  {
    quote:
      'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.',
    author: 'Bruce Lee',
    rule: 'Each key adds points equal to the number of times the key was pressed'
  },
  {
    quote: 'Patience is bitter, but its fruit is sweet.',
    author: 'Aristotle',
    rule: 'Each key adds points equal to the number of seconds since the last key press with a maximum of 5'
  }
]

export const numberOfLevels = levelAdvice.length
