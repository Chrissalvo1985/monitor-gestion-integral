import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all tech implementations
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_implementations ORDER BY last_update DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech implementations:', error);
    res.status(500).json({ error: 'Failed to fetch tech implementations' });
  }
});

// GET tech implementations by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_implementations WHERE client_id = $1 ORDER BY last_update DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech implementations:', error);
    res.status(500).json({ error: 'Failed to fetch tech implementations' });
  }
});

// GET tech implementation by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_implementations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tech implementation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tech implementation:', error);
    res.status(500).json({ error: 'Failed to fetch tech implementation' });
  }
});

// POST create tech implementation
router.post('/', async (req, res) => {
  try {
    const { client_id, platform_id, status, progress_pct, owner_user_id, start_date, target_date, implemented_at, risk_level, notes, evidence_url } = req.body;
    const result = await query(
      'INSERT INTO tech_implementations (client_id, platform_id, status, progress_pct, owner_user_id, start_date, target_date, implemented_at, risk_level, notes, evidence_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [client_id, platform_id, status, progress_pct, owner_user_id, start_date || null, target_date || null, implemented_at || null, risk_level, notes || null, evidence_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating tech implementation:', error);
    res.status(500).json({ error: 'Failed to create tech implementation' });
  }
});

// PUT update tech implementation
router.put('/:id', async (req, res) => {
  try {
    const { client_id, platform_id, status, progress_pct, owner_user_id, start_date, target_date, implemented_at, risk_level, notes, evidence_url } = req.body;
    const result = await query(
      'UPDATE tech_implementations SET client_id = $1, platform_id = $2, status = $3, progress_pct = $4, owner_user_id = $5, start_date = $6, target_date = $7, implemented_at = $8, risk_level = $9, notes = $10, evidence_url = $11, last_update = NOW(), updated_at = NOW() WHERE id = $12 RETURNING *',
      [client_id, platform_id, status, progress_pct, owner_user_id, start_date || null, target_date || null, implemented_at || null, risk_level, notes || null, evidence_url || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tech implementation not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating tech implementation:', error);
    res.status(500).json({ error: 'Failed to update tech implementation' });
  }
});

// DELETE tech implementation
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM tech_implementations WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Implementación no encontrada' });
    }
    res.json({ message: 'Implementación eliminada correctamente', implementation: result.rows[0] });
  } catch (error) {
    console.error('Error deleting tech implementation:', error);
    res.status(500).json({ error: 'Error al eliminar la implementación' });
  }
});

export default router;

