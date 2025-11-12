import { query } from '../db.js';

async function runMigration() {
  try {
    console.log('Iniciando migración: actualizar constraint de status en process_surveys...');
    
    // Eliminar constraint existente
    await query(`
      ALTER TABLE process_surveys 
      DROP CONSTRAINT IF EXISTS process_surveys_status_check;
    `);
    
    console.log('✓ Constraint anterior eliminado');
    
    // Crear nueva constraint con PLANIFICADO incluido
    await query(`
      ALTER TABLE process_surveys 
      ADD CONSTRAINT process_surveys_status_check 
      CHECK (status IN ('NO_INICIADO', 'PLANIFICADO', 'EN_LEVANTAMIENTO', 'EN_VALIDACION', 'DOCUMENTADO', 'IMPLEMENTADO'));
    `);
    
    console.log('✓ Nueva constraint creado con PLANIFICADO');
    console.log('✅ Migración completada exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();

