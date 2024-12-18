import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { level_ind, level, score, version, user_id } = req.body;
    console.log('POST body:', req.body);
    const { error } = await supabase
      .from('scores')
      .insert([{ level_ind, level, score, version, user_id }]);

    if (error) {
      console.error('Error inserting score:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.log('Score inserted successfully');
      res.status(201).json({ message: 'Score submitted successfully' });
    }
  } else if (req.method === 'GET') {
    const { level_ind, version } = req.query;

    console.log('Request method:', req.method);
    console.log('Query parameters:', req.query);

    const { data, error } = await supabase
      .from('scores')
      .select('score')
      .eq('level_ind', level_ind)
      .eq('version', version);

    if (error) {
      console.error('Error fetching scores:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.log('Fetched scores:', data);
      res.status(200).json(data.map(row => row.score));
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}