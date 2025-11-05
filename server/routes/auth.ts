import { Router } from 'express';
import { query } from '../db.js';
import bcrypt from 'bcryptjs';

const router = Router();

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario por email
    const result = await query(
      'SELECT id, name, email, password, role, active FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar si el usuario está activo
    if (!user.active) {
      return res.status(403).json({ error: 'Usuario desactivado' });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Retornar datos del usuario (sin password)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// POST logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

// GET current user (para verificar sesión)
router.get('/me', (req, res) => {
  // En una implementación real, esto verificaría el token/sesión
  res.json({ message: 'Endpoint para verificar sesión' });
});

export default router;

