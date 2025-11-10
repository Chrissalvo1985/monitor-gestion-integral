import express from 'express';
import { query } from '../db.js';
import { getUserContext, getClientFilterSQL } from '../utils/authUtils.js';

const router = express.Router();

// GET all BI client panels (filtrado por permisos)
router.get('/', async (req, res) => {
  try {
    const userContext = await getUserContext(req);
    const clientFilter = getClientFilterSQL(userContext, 'client_id');
    
    let sql = 'SELECT * FROM bi_client_panels';
    let params: any[] = [];
    
    if (clientFilter.sql) {
      sql += ` WHERE ${clientFilter.sql}`;
      params = clientFilter.params;
    }
    
    sql += ' ORDER BY last_update DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching BI client panels:', error);
    res.status(500).json({ error: 'Failed to fetch BI client panels' });
  }
});

// GET BI client panels by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bi_client_panels WHERE client_id = $1 ORDER BY last_update DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching BI client panels:', error);
    res.status(500).json({ error: 'Failed to fetch BI client panels' });
  }
});

// GET BI client panel by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bi_client_panels WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'BI client panel not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching BI client panel:', error);
    res.status(500).json({ error: 'Failed to fetch BI client panel' });
  }
});

// POST create BI client panel
router.post('/', async (req, res) => {
  try {
    const { client_id, panel_id, status, progress_pct, owner_user_id, target_date, implemented_at, notes } = req.body;
    const result = await query(
      'INSERT INTO bi_client_panels (client_id, panel_id, status, progress_pct, owner_user_id, target_date, implemented_at, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [client_id, panel_id, status, progress_pct, owner_user_id, target_date || null, implemented_at || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating BI client panel:', error);
    res.status(500).json({ error: 'Failed to create BI client panel' });
  }
});

// PUT update BI client panel
router.put('/:id', async (req, res) => {
  try {
    const { client_id, panel_id, status, progress_pct, owner_user_id, target_date, implemented_at, notes } = req.body;
    const result = await query(
      'UPDATE bi_client_panels SET client_id = $1, panel_id = $2, status = $3, progress_pct = $4, owner_user_id = $5, target_date = $6, implemented_at = $7, notes = $8, last_update = NOW(), updated_at = NOW() WHERE id = $9 RETURNING *',
      [client_id, panel_id, status, progress_pct, owner_user_id, target_date || null, implemented_at || null, notes || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'BI client panel not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating BI client panel:', error);
    res.status(500).json({ error: 'Failed to update BI client panel' });
  }
});

export default router;

