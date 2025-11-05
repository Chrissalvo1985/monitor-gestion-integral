import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all alerts
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// GET alerts by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM alerts WHERE client_id = $1 ORDER BY created_at DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// GET alert by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM alerts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

export default router;

