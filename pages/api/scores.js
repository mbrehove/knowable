import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  const { level_ind, version } = req.query;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('level_ind', level_ind)
      .eq('version', version);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(200).json(data.map(row => row.score));
    }
  } else if (req.method === 'POST') {
    const { score, user_id } = req.body;
    const { error } = await supabase
      .from('scores')
      .insert([{ level_ind, score, user_id, version }]);

    if (error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(201).json({ message: 'Score submitted successfully' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}