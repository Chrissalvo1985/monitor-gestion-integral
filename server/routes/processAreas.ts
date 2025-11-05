import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all process areas
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM process_areas ORDER BY display_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching process areas:', error);
    res.status(500).json({ error: 'Failed to fetch process areas' });
  }
});

// GET process area by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM process_areas WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Process area not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching process area:', error);
    res.status(500).json({ error: 'Failed to fetch process area' });
  }
});

export default router;

