import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all collaborator experience plans
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM collaborator_experience_plans ORDER BY last_update DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching collaborator experience plans:', error);
    res.status(500).json({ error: 'Failed to fetch collaborator experience plans' });
  }
});

// GET collaborator experience plans by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM collaborator_experience_plans WHERE client_id = $1 ORDER BY last_update DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching collaborator experience plans:', error);
    res.status(500).json({ error: 'Failed to fetch collaborator experience plans' });
  }
});

// GET collaborator experience plan by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM collaborator_experience_plans WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collaborator experience plan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching collaborator experience plan:', error);
    res.status(500).json({ error: 'Failed to fetch collaborator experience plan' });
  }
});

// POST create collaborator experience plan
router.post('/', async (req, res) => {
  try {
    const { client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date, description } = req.body;
    const result = await query(
      'INSERT INTO collaborator_experience_plans (client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date || null, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating collaborator experience plan:', error);
    res.status(500).json({ error: 'Failed to create collaborator experience plan' });
  }
});

// PUT update collaborator experience plan
router.put('/:id', async (req, res) => {
  try {
    const { client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date, description } = req.body;
    const result = await query(
      'UPDATE collaborator_experience_plans SET client_id = $1, area_id = $2, plan_name = $3, status = $4, progress_pct = $5, owner_user_id = $6, target_date = $7, description = $8, last_update = NOW(), updated_at = NOW() WHERE id = $9 RETURNING *',
      [client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date || null, description || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collaborator experience plan not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating collaborator experience plan:', error);
    res.status(500).json({ error: 'Failed to update collaborator experience plan' });
  }
});

// DELETE collaborator experience plan
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM collaborator_experience_plans WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Collaborator experience plan not found' });
    }
    res.json({ message: 'Collaborator experience plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting collaborator experience plan:', error);
    res.status(500).json({ error: 'Failed to delete collaborator experience plan' });
  }
});

export default router;

