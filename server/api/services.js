import supabase from './supabaseClient.mjs'; // Adjust the path as needed

export async function getServices(req, res) {
  const { data, error } = await supabase.from('services').select('*');

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
