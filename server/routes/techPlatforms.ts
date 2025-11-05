import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// GET all tech platforms
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_platforms ORDER BY display_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tech platforms:', error);
    res.status(500).json({ error: 'Failed to fetch tech platforms' });
  }
});

// GET tech platform by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tech_platforms WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tech platform not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching tech platform:', error);
    res.status(500).json({ error: 'Failed to fetch tech platform' });
  }
});

// POST create tech platform
router.post('/', async (req, res) => {
  try {
    const { code, display_name, doc_url } = req.body;
    
    // Validar que code y display_name estén presentes
    if (!code || !display_name) {
      return res.status(400).json({ error: 'Los campos "code" y "display_name" son requeridos' });
    }
    
    const result = await query(
      'INSERT INTO tech_platforms (code, display_name, doc_url) VALUES ($1, $2, $3) RETURNING *',
      [code, display_name, doc_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    console.error('Error creating tech platform:', error);
    
    // Si es un error de duplicate key (código ya existe)
    if (error.code === '23505') {
      return res.status(409).json({ 
        error: `Ya existe un sistema con el código "${req.body.code}". Por favor usa un código diferente.` 
      });
    }
    
    res.status(500).json({ error: 'Error al crear el sistema tecnológico' });
  }
});

// DELETE tech platform
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay implementaciones que usan este sistema
    const implementationsCheck = await query(
      'SELECT COUNT(*) as count FROM tech_implementations WHERE platform_id = $1',
      [id]
    );
    
    if (parseInt(implementationsCheck.rows[0].count) > 0) {
      return res.status(409).json({ 
        error: 'No se puede eliminar este sistema porque tiene implementaciones asociadas. Elimina primero las implementaciones.' 
      });
    }
    
    // Verificar si hay registros de usabilidad
    const usabilityCheck = await query(
      'SELECT COUNT(*) as count FROM tech_usability WHERE platform_id = $1',
      [id]
    );
    
    if (parseInt(usabilityCheck.rows[0].count) > 0) {
      return res.status(409).json({ 
        error: 'No se puede eliminar este sistema porque tiene registros de usabilidad asociados.' 
      });
    }
    
    // Eliminar el sistema
    const result = await query('DELETE FROM tech_platforms WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Sistema tecnológico no encontrado' });
    }
    
    res.json({ message: 'Sistema tecnológico eliminado correctamente', platform: result.rows[0] });
  } catch (error: any) {
    console.error('Error deleting tech platform:', error);
    res.status(500).json({ error: 'Error al eliminar el sistema tecnológico' });
  }
});

export default router;

