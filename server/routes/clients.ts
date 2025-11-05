import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM clients ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET client by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// POST create client
router.post('/', async (req, res) => {
  try {
    const { name, gerencia, owner_user_id, headcount, notes } = req.body;
    const result = await query(
      'INSERT INTO clients (name, gerencia, owner_user_id, headcount, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, gerencia, owner_user_id, headcount || 0, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  try {
    const { name, gerencia, owner_user_id, health_score, headcount, notes } = req.body;
    const result = await query(
      'UPDATE clients SET name = $1, gerencia = $2, owner_user_id = $3, health_score = $4, headcount = $5, notes = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, gerencia, owner_user_id, health_score, headcount, notes || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE client
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM clients WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;

