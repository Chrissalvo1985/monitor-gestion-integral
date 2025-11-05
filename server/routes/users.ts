import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create or get user by name
router.post('/find-or-create', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'El nombre del usuario es requerido' });
    }

    const trimmedName = name.trim();
    
    // Buscar si el usuario ya existe (case-insensitive)
    const existingUser = await query(
      'SELECT * FROM users WHERE LOWER(name) = LOWER($1)',
      [trimmedName]
    );
    
    if (existingUser.rows.length > 0) {
      return res.json(existingUser.rows[0]);
    }
    
    // Si no existe, crear uno nuevo
    const newUser = await query(
      'INSERT INTO users (name) VALUES ($1) RETURNING *',
      [trimmedName]
    );
    
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error finding or creating user:', error);
    res.status(500).json({ error: 'Error al buscar o crear el usuario' });
  }
});

export default router;

