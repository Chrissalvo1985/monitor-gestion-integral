import express from 'express';
import { query } from '../db.js';
import { getUserContext, filterClientsByPermissions } from '../utils/authUtils.js';

const router = express.Router();

// GET all clients (filtrado por permisos del usuario)
router.get('/', async (req, res) => {
  try {
    const userContext = await getUserContext(req);
    const result = await query('SELECT * FROM clients ORDER BY name');
    
    // Filtrar clientes según los permisos del usuario
    const filteredClients = filterClientsByPermissions(result.rows, userContext);
    
    res.json(filteredClients);
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
    const { name, gerencia, owner_user_id, owner_name, headcount, notes } = req.body;
    
    let finalOwnerId = owner_user_id;
    
    // Si se proporciona owner_name, buscar o crear el usuario
    if (owner_name && owner_name.trim()) {
      const trimmedName = owner_name.trim();
      
      // Buscar si el usuario ya existe
      const existingUser = await query(
        'SELECT * FROM users WHERE LOWER(name) = LOWER($1)',
        [trimmedName]
      );
      
      if (existingUser.rows.length > 0) {
        finalOwnerId = existingUser.rows[0].id;
      } else {
        // Crear nuevo usuario
        const newUser = await query(
          'INSERT INTO users (name) VALUES ($1) RETURNING *',
          [trimmedName]
        );
        finalOwnerId = newUser.rows[0].id;
      }
    }
    
    const result = await query(
      'INSERT INTO clients (name, gerencia, owner_user_id, headcount, notes) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, gerencia, finalOwnerId, headcount || 0, notes || null]
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
    const { name, gerencia, owner_user_id, owner_name, health_score, headcount, notes } = req.body;
    
    let finalOwnerId = owner_user_id;
    
    // Si se proporciona owner_name, buscar o crear el usuario
    if (owner_name && owner_name.trim()) {
      const trimmedName = owner_name.trim();
      
      // Buscar si el usuario ya existe
      const existingUser = await query(
        'SELECT * FROM users WHERE LOWER(name) = LOWER($1)',
        [trimmedName]
      );
      
      if (existingUser.rows.length > 0) {
        finalOwnerId = existingUser.rows[0].id;
      } else {
        // Crear nuevo usuario
        const newUser = await query(
          'INSERT INTO users (name) VALUES ($1) RETURNING *',
          [trimmedName]
        );
        finalOwnerId = newUser.rows[0].id;
      }
    }
    
    const result = await query(
      'UPDATE clients SET name = $1, gerencia = $2, owner_user_id = $3, health_score = $4, headcount = $5, notes = $6, updated_at = NOW() WHERE id = $7 RETURNING *',
      [name, gerencia, finalOwnerId, health_score, headcount, notes || null, req.params.id]
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

