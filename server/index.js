import express from 'express';
import dotenv from 'dotenv';
import supabase from './supabaseClient.js'; 

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/services', async (req, res) => {
  const { data, error } = await supabase.from('services').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
