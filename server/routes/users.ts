import express from 'express';
import { query } from '../db.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// GET all users (sin passwords, con clientes asignados)
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, active, created_at FROM users ORDER BY name');
    
    // Obtener clientes asignados para cada usuario
    const usersWithClients = await Promise.all(
      result.rows.map(async (user) => {
        if (user.role === 'admin') {
          return { ...user, assigned_clients: [] };
        }
        const clientsResult = await query(
          'SELECT client_id FROM user_clients WHERE user_id = $1',
          [user.id]
        );
        return {
          ...user,
          assigned_clients: clientsResult.rows.map(row => row.client_id),
        };
      })
    );
    
    res.json(usersWithClients);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID (sin password, con clientes asignados)
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role, active, created_at FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    // Obtener clientes asignados
    let assignedClients: string[] = [];
    if (user.role !== 'admin') {
      const clientsResult = await query(
        'SELECT client_id FROM user_clients WHERE user_id = $1',
        [user.id]
      );
      assignedClients = clientsResult.rows.map(row => row.client_id);
    }
    
    res.json({ ...user, assigned_clients: assignedClients });
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

// GET assigned clients for a user
router.get('/:id/clients', async (req, res) => {
  try {
    const result = await query(
      'SELECT client_id FROM user_clients WHERE user_id = $1',
      [req.params.id]
    );
    res.json(result.rows.map(row => row.client_id));
  } catch (error) {
    console.error('Error fetching user clients:', error);
    res.status(500).json({ error: 'Failed to fetch user clients' });
  }
});

// PUT update assigned clients for a user
router.put('/:id/clients', async (req, res) => {
  try {
    const { client_ids } = req.body;
    const userId = req.params.id;

    // Verificar que el usuario existe
    const userResult = await query('SELECT id, role FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Si es admin, no necesita asignaciones
    if (userResult.rows[0].role === 'admin') {
      return res.json({ message: 'Los administradores tienen acceso a todos los clientes', assigned_clients: [] });
    }

    // Eliminar asignaciones actuales
    await query('DELETE FROM user_clients WHERE user_id = $1', [userId]);

    // Insertar nuevas asignaciones
    if (client_ids && client_ids.length > 0) {
      const values = client_ids.map((clientId: string, index: number) => 
        `($1, $${index + 2})`
      ).join(', ');
      
      await query(
        `INSERT INTO user_clients (user_id, client_id) VALUES ${values}`,
        [userId, ...client_ids]
      );
    }

    res.json({ message: 'Clientes asignados correctamente', assigned_clients: client_ids || [] });
  } catch (error) {
    console.error('Error updating user clients:', error);
    res.status(500).json({ error: 'Error al asignar clientes' });
  }
});

export default router;

