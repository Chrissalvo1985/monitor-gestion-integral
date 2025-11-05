import express from 'express';
import { query } from '../db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET all users (sin passwords)
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, active, created_at FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID (sin password)
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, active, created_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role, active } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar si el email ya existe
    const existingUser = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'El email ya está en uso' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO users (name, email, password, role, active) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, active, created_at',
      [name, email, hashedPassword, role || 'user', active !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, active } = req.body;

    const result = await query(
      'UPDATE users SET name = $1, email = $2, role = $3, active = $4, updated_at = NOW() WHERE id = $5 RETURNING id, name, email, role, active, created_at',
      [name, email, role, active, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    // Email duplicado
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El email ya está en uso' });
    }
    
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});

// PUT change password
router.put('/:id/password', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
      [hashedPassword, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario' });
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

