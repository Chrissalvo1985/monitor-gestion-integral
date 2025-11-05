import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all tech platforms
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_platforms ORDER BY display_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech platforms:', error);
    res.status(500).json({ error: 'Failed to fetch tech platforms' });
  }
});

// GET tech platform by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_platforms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tech platform not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tech platform:', error);
    res.status(500).json({ error: 'Failed to fetch tech platform' });
  }
});

// POST create tech platform
router.post('/', async (req, res) => {
  try {
    const { code, display_name, doc_url } = req.body;
    const result = await query(
      'INSERT INTO tech_platforms (code, display_name, doc_url) VALUES ($1, $2, $3) RETURNING *',
      [code, display_name, doc_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tech platform:', error);
    res.status(500).json({ error: 'Failed to create tech platform' });
  }
});

export default router;

