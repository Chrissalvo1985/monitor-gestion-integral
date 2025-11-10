import express from 'express';
import { query } from '../db.js';
import { getUserContext, getClientFilterSQL } from '../utils/authUtils.js';

const router = express.Router();

// GET all client experiences (filtrado por permisos)
router.get('/', async (req, res) => {
  try {
    const userContext = await getUserContext(req);
    const clientFilter = getClientFilterSQL(userContext, 'client_id');
    
    let sql = 'SELECT * FROM client_experiences';
    let params: any[] = [];
    
    if (clientFilter.sql) {
      sql += ` WHERE ${clientFilter.sql}`;
      params = clientFilter.params;
    }
    
    sql += ' ORDER BY last_survey_date DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching client experiences:', error);
    res.status(500).json({ error: 'Failed to fetch client experiences' });
  }
});

// GET client experiences by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM client_experiences WHERE client_id = $1 ORDER BY last_survey_date DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching client experiences:', error);
    res.status(500).json({ error: 'Failed to fetch client experiences' });
  }
});

// GET client experience by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM client_experiences WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client experience not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching client experience:', error);
    res.status(500).json({ error: 'Failed to fetch client experience' });
  }
});

// POST create client experience
router.post('/', async (req, res) => {
  try {
    const { client_id, nps_score, last_survey_date, notes } = req.body;
    const result = await query(
      'INSERT INTO client_experiences (client_id, nps_score, last_survey_date, notes) VALUES ($1, $2, $3, $4) RETURNING *',
      [client_id, nps_score, last_survey_date, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating client experience:', error);
    res.status(500).json({ error: 'Failed to create client experience' });
  }
});

// PUT update client experience
router.put('/:id', async (req, res) => {
  try {
    const { client_id, nps_score, last_survey_date, notes } = req.body;
    const result = await query(
      'UPDATE client_experiences SET client_id = $1, nps_score = $2, last_survey_date = $3, notes = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [client_id, nps_score, last_survey_date, notes || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client experience not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating client experience:', error);
    res.status(500).json({ error: 'Failed to update client experience' });
  }
});

export default router;

