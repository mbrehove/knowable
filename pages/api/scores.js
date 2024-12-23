import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler (req, res) {
  if (req.method === 'POST') {
    // Check if this is a phase score
    if (req.body.phase !== undefined) {
      const { phase, score, user_id, version } = req.body
      const { error } = await supabase
        .from('phase_scores')
        .insert([{ phase, score, user_id, version }])

      if (error) {
        console.error('Error inserting phase score:', error)
        res.status(500).json({ error: error.message })
      } else {
        res.status(201).json({ message: 'Phase score submitted successfully' })
      }
    } else {
      const { level_ind, level, score, version, user_id } = req.body
      console.log('POST body:', req.body)
      const { error } = await supabase
        .from('scores')
        .insert([{ level_ind, level, score, version, user_id }])

      if (error) {
        console.error('Error inserting score:', error)
        res.status(500).json({ error: error.message })
      } else {
        console.log('Score inserted successfully')
        res.status(201).json({ message: 'Score submitted successfully' })
      }
    }
  } else if (req.method === 'GET') {
    if (req.query.phase !== undefined) {
      const { phase, version } = req.query
      const { data, error } = await supabase
        .from('phase_scores')
        .select('score')
        .eq('phase', phase)
        .eq('version', version || 0)

      if (error) {
        res.status(500).json({ error: error.message })
      } else {
        res.status(200).json(data.map(row => row.score))
      }
    } else {
      // Check if this is a phase scores request
      if (req.query.start_level && req.query.end_level && req.query.user_id) {
        const { start_level, end_level, user_id } = req.query

        try {
          // Get user's scores for the phase
          const { data: userScores, error: userError } = await supabase
            .from('scores')
            .select('level, score, created_at')
            .eq('user_id', user_id)
            .gte('level', start_level)
            .lte('level', end_level)
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

          // Get all users' scores for this phase
          const { data: allScores, error: allError } = await supabase
            .from('scores')
            .select('user_id, score, level, created_at')
            .gte('level', start_level)
            .lte('level', end_level)
            .order('created_at', { ascending: false })

          if (allError) throw allError

          // Calculate other users' total scores
          const userTotals = new Map()
          allScores.forEach(score => {
            if (!userTotals.has(score.user_id)) {
              userTotals.set(score.user_id, new Map())
            }
            const userScores = userTotals.get(score.user_id)
            if (!userScores.has(score.level)) {
              userScores.set(score.level, score.score)
            }
          })

          const allTotalScores = Array.from(userTotals.values()).map(scores =>
            Array.from(scores.values()).reduce((sum, score) => sum + score, 0)
          )

          // Calculate percentile
          const sortedScores = allTotalScores.sort((a, b) => a - b)
          const rank = sortedScores.findIndex(score => score >= totalScore) + 1
          const percentile =
            sortedScores.length > 1 ? (rank / sortedScores.length) * 100 : null

          res.status(200).json({ totalScore, percentile })
        } catch (error) {
          console.error('Error:', error)
          res.status(500).json({ error: error.message })
        }
      } else {
        // Existing level scores logic
        const { level_ind, version } = req.query
        const { data, error } = await supabase
          .from('scores')
          .select('score')
          .eq('level_ind', level_ind)
          .eq('version', version)

        if (error) {
          console.error('Error fetching scores:', error)
          res.status(500).json({ error: error.message })
        } else {
          console.log('Fetched scores:', data)
          res.status(200).json(data.map(row => row.score))
        }
      }
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
