import { query } from '../db.js';

async function runMigration() {
  try {
    console.log('Iniciando migración: agregar target_date a process_surveys...');
    
    // Agregar columna target_date si no existe
    await query(`
      ALTER TABLE process_surveys 
      ADD COLUMN IF NOT EXISTS target_date DATE;
    `);
    
    console.log('✓ Columna target_date agregada exitosamente');
    
    // Agregar comentario
    await query(`
      COMMENT ON COLUMN process_surveys.target_date IS 'Fecha objetivo para completar el levantamiento de procesos';
    `);
    
    console.log('✓ Comentario agregado exitosamente');
    console.log('✅ Migración completada exitosamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();

