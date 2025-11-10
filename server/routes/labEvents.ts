import express from 'express';
import { query } from '../db.js';
import { getUserContext, getClientFilterSQL } from '../utils/authUtils.js';

const router = express.Router();

// GET all lab events (filtrado por permisos)
router.get('/', async (req, res) => {
  try {
    const userContext = await getUserContext(req);
    const clientFilter = getClientFilterSQL(userContext, 'client_id');
    
    let sql = 'SELECT * FROM lab_events';
    let params: any[] = [];
    
    if (clientFilter.sql) {
      // Lab events pueden tener client_id NULL, así que lo manejamos diferente
      if (clientFilter.sql.includes('IS NULL AND')) {
        // Usuario sin clientes asignados - solo ver eventos sin cliente
        sql += ' WHERE client_id IS NULL';
      } else {
        // Usuario con clientes asignados - ver eventos de sus clientes O sin cliente
        sql += ` WHERE (${clientFilter.sql} OR client_id IS NULL)`;
        params = clientFilter.params;
      }
    }
    
    sql += ' ORDER BY date DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lab events:', error);
    res.status(500).json({ error: 'Failed to fetch lab events' });
  }
});

// GET lab events by client ID
router.get('/client/:clientId', async (req, res) => {
  try {
    const result = await query('SELECT * FROM lab_events WHERE client_id = $1 ORDER BY date DESC', [req.params.clientId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching lab events:', error);
    res.status(500).json({ error: 'Failed to fetch lab events' });
  }
});

// GET lab event by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM lab_events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching lab event:', error);
    res.status(500).json({ error: 'Failed to fetch lab event' });
  }
});

// POST create lab event
router.post('/', async (req, res) => {
  try {
    const { date, client_id, topic, type, owner_user_id, outcomes, recording_url, materials_url } = req.body;
    const result = await query(
      'INSERT INTO lab_events (date, client_id, topic, type, owner_user_id, outcomes, recording_url, materials_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [date, client_id || null, topic, type, owner_user_id, outcomes, recording_url || null, materials_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating lab event:', error);
    res.status(500).json({ error: 'Failed to create lab event' });
  }
});

// PUT update lab event
router.put('/:id', async (req, res) => {
  try {
    const { date, client_id, topic, type, owner_user_id, outcomes, recording_url, materials_url } = req.body;
    const result = await query(
      'UPDATE lab_events SET date = $1, client_id = $2, topic = $3, type = $4, owner_user_id = $5, outcomes = $6, recording_url = $7, materials_url = $8, updated_at = NOW() WHERE id = $9 RETURNING *',
      [date, client_id || null, topic, type, owner_user_id, outcomes, recording_url || null, materials_url || null, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab event not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating lab event:', error);
    res.status(500).json({ error: 'Failed to update lab event' });
  }
});

// DELETE lab event
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM lab_events WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lab event not found' });
    }
    res.json({ message: 'Lab event deleted successfully' });
  } catch (error) {
    console.error('Error deleting lab event:', error);
    res.status(500).json({ error: 'Failed to delete lab event' });
  }
});

export default router;

