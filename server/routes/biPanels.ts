import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all BI panels
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bi_panels ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching BI panels:', error);
    res.status(500).json({ error: 'Failed to fetch BI panels' });
  }
});

// GET BI panel by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bi_panels WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'BI panel not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching BI panel:', error);
    res.status(500).json({ error: 'Failed to fetch BI panel' });
  }
});

// POST create BI panel
router.post('/', async (req, res) => {
  try {
    const { code, name, short_desc, embed_url, area } = req.body;
    const result = await query(
      'INSERT INTO bi_panels (code, name, short_desc, embed_url, area) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [code, name, short_desc || null, embed_url, area || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating BI panel:', error);
    res.status(500).json({ error: 'Failed to create BI panel' });
  }
});

// PUT update BI panel
router.put('/:id', async (req, res) => {
  try {
    const { code, name, short_desc, embed_url, area } = req.body;
    const result = await query(
      'UPDATE bi_panels SET code = $1, name = $2, short_desc = $3, embed_url = $4, area = $5, updated_at = NOW() WHERE id = $6 RETURNING *',
      [code, name, short_desc || null, embed_url, area || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'BI panel not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating BI panel:', error);
    res.status(500).json({ error: 'Failed to update BI panel' });
  }
});

export default router;

