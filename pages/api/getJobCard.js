import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body; // Get code from frontend's POST body
    const backendResponse = await axios.get('http://localhost:5001/api/job-card/code', {
      data: { code }, // Send GET request with body to your backend
    });

    res.status(200).json(backendResponse.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job card' });
  }
}
