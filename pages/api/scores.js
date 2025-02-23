import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler (req, res) {
  console.log('API Request:', {
    method: req.method,
    query: req.query,
    body: req.method === 'POST' ? req.body : undefined
  })

  if (req.method === 'POST') {
    const {
      phase,
      score,
      user_id,
      version,
      accuracy,
      level_ind,
      level,
      percent
    } = req.body
    console.log('POST body:', req.body)

    // If it's a phase-level submission (no specific level)
    if (level === undefined && level_ind === undefined) {
      const { error } = await supabase.from('phase_scores').insert([
        {
          phase,
          score,
          user_id,
          version,
          accuracy
        }
      ])

      if (error) {
        console.error('Error inserting phase score:', error)
        res.status(500).json({ error: error.message })
      } else {
        res.status(201).json({ message: 'Phase score submitted successfully' })
      }
    } else {
      // It's a level-specific score
      const { error } = await supabase.from('scores').insert([
        {
          level_ind,
          level,
          score,
          version,
          user_id,
          percent,
          phase,
          accuracy
        }
      ])

      if (error) {
        console.error('Error inserting score:', error)
        res.status(500).json({ error: error.message })
      } else {
        console.log('Score inserted successfully')
        res.status(201).json({ message: 'Score submitted successfully' })
      }
    }
  } else if (req.method === 'GET') {
    const { type, phase, version, level_ind, user_id } = req.query

    // Log the parsed query parameters
    console.log('Parsed query parameters:', {
      type,
      phase,
      version,
      level_ind,
      user_id
    })

    try {
      // Type 1: Get all scores for a specific level
      if (type === 'level_scores') {
        const { data, error } = await supabase
          .from('scores')
          .select('score')
          .eq('level_ind', level_ind)
          .eq('version', version)

        if (error) throw error
        return res.status(200).json(data.map(row => row.score))
      }

      // Type 2: Get all phase scores for all players
      if (type === 'phase_scores') {
        const { data, error } = await supabase
          .from('phase_scores')
          .select('score')
          .eq('phase', phase)
          .eq('version', version || 0)

        if (error) throw error
        return res.status(200).json(data.map(row => row.score))
      }

      // Type 3: Get user's scores for a specific phase
      if (type === 'user_phase_scores') {
        const { data: userScores, error: userError } = await supabase
          .from('scores')
          .select('level, score, created_at')
          .eq('user_id', user_id)
          .eq('phase', phase)
          .order('created_at', { ascending: false })

        if (userError) throw userError

        // Get only the most recent score for each level
        const latestScores = new Map()
        userScores.forEach(score => {
          if (!latestScores.has(score.level)) {
            latestScores.set(score.level, score.score)
          }
        })

        const totalScore = Array.from(latestScores.values()).reduce(
          (sum, score) => sum + score,
          0
        )

        return res.status(200).json({ totalScore })
      }

      throw new Error('Invalid request type')
    } catch (error) {
      console.error('Error in scores API:', error)
      res.status(500).json({
        error: error.message,
        details: error.toString()
      })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
