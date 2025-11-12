import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all process surveys
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM process_surveys ORDER BY last_update DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching process surveys:', error);
    res.status(500).json({ error: 'Failed to fetch process surveys' });
  }
});

// GET process survey by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM process_surveys WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Process survey not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching process survey:', error);
    res.status(500).json({ error: 'Failed to fetch process survey' });
  }
});

// POST create process survey
router.post('/', async (req, res) => {
  try {
    const { area_id, status, mapeo_proceso_pct, procedimientos_pct, controles_pct, evidencias_pct, owner_user_id, target_date, notes, attachments_url } = req.body;
    const result = await query(
      'INSERT INTO process_surveys (area_id, status, mapeo_proceso_pct, procedimientos_pct, controles_pct, evidencias_pct, owner_user_id, target_date, notes, attachments_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
      [area_id, status, mapeo_proceso_pct, procedimientos_pct, controles_pct, evidencias_pct, owner_user_id, target_date || null, notes || null, attachments_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating process survey:', error);
    res.status(500).json({ error: 'Failed to create process survey' });
  }
});

// PUT update process survey
router.put('/:id', async (req, res) => {
  try {
    const { area_id, status, mapeo_proceso_pct, procedimientos_pct, controles_pct, evidencias_pct, owner_user_id, target_date, notes, attachments_url } = req.body;
    
    // Validar campos requeridos
    if (!area_id || !status || owner_user_id === undefined) {
      return res.status(400).json({ error: 'Missing required fields: area_id, status, owner_user_id' });
    }
    
    // Normalizar target_date: convertir string vacío, undefined o null a null
    const normalizedTargetDate = (target_date && typeof target_date === 'string' && target_date.trim() !== '') ? target_date.trim() : null;
    
    // Verificar si la columna target_date existe
    let hasTargetDateColumn = true;
    try {
      await query('SELECT target_date FROM process_surveys LIMIT 1');
    } catch (checkError: any) {
      if (checkError.code === '42703') { // column does not exist
        hasTargetDateColumn = false;
      } else {
        throw checkError;
      }
    }
    
    let result;
    if (hasTargetDateColumn) {
      // Query con target_date
      result = await query(
        'UPDATE process_surveys SET area_id = $1, status = $2, mapeo_proceso_pct = $3, procedimientos_pct = $4, controles_pct = $5, evidencias_pct = $6, owner_user_id = $7, target_date = $8, notes = $9, attachments_url = $10, last_update = NOW(), updated_at = NOW() WHERE id = $11 RETURNING *',
        [
          area_id, 
          status, 
          mapeo_proceso_pct || 0, 
          procedimientos_pct || 0, 
          controles_pct || 0, 
          evidencias_pct || 0, 
          owner_user_id, 
          normalizedTargetDate, 
          notes || null, 
          attachments_url || null, 
          req.params.id
        ]
      );
    } else {
      // Query sin target_date (fallback)
      result = await query(
        'UPDATE process_surveys SET area_id = $1, status = $2, mapeo_proceso_pct = $3, procedimientos_pct = $4, controles_pct = $5, evidencias_pct = $6, owner_user_id = $7, notes = $8, attachments_url = $9, last_update = NOW(), updated_at = NOW() WHERE id = $10 RETURNING *',
        [
          area_id, 
          status, 
          mapeo_proceso_pct || 0, 
          procedimientos_pct || 0, 
          controles_pct || 0, 
          evidencias_pct || 0, 
          owner_user_id, 
          notes || null, 
          attachments_url || null, 
          req.params.id
        ]
      );
    }
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Process survey not found' });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating process survey:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    res.status(500).json({ 
      error: 'Failed to update process survey',
      details: error.message,
      code: error.code
    });
  }
});

export default router;

