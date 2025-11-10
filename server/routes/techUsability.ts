import express from 'express';
import { query } from '../db.js';
import { getUserContext, getClientFilterSQL } from '../utils/authUtils.js';

const router = express.Router();

// GET all tech usability records (filtrado por permisos)
router.get('/', async (req, res) => {
  try {
    const userContext = await getUserContext(req);
    const clientFilter = getClientFilterSQL(userContext, 'client_id');
    
    let sql = 'SELECT * FROM tech_usability';
    let params: any[] = [];
    
    if (clientFilter.sql) {
      sql += ` WHERE ${clientFilter.sql}`;
      params = clientFilter.params;
    }
    
    sql += ' ORDER BY last_update DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech usability:', error);
    res.status(500).json({ error: 'Failed to fetch tech usability' });
  }
});

// GET tech usability by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_usability WHERE client_id = $1 ORDER BY last_update DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech usability:', error);
    res.status(500).json({ error: 'Failed to fetch tech usability' });
  }
});

// GET tech usability by client ID and platform ID
router.get('/client/:clientId/platform/:platformId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_usability WHERE client_id = $1 AND platform_id = $2', [req.params.clientId, req.params.platformId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tech usability record not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tech usability:', error);
    res.status(500).json({ error: 'Failed to fetch tech usability' });
  }
});

// POST create or update tech usability (upsert)
router.post('/', async (req, res) => {
  try {
    const { client_id, platform_id, usage_count, usage_pct } = req.body;
    const result = await query(
      `INSERT INTO tech_usability (client_id, platform_id, usage_count, usage_pct, last_update)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (client_id, platform_id)
       DO UPDATE SET usage_count = $3, usage_pct = $4, last_update = NOW(), updated_at = NOW()
       RETURNING *`,
      [client_id, platform_id, usage_count, usage_pct]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating/updating tech usability:', error);
    res.status(500).json({ error: 'Failed to create/update tech usability' });
  }
});

export default router;

