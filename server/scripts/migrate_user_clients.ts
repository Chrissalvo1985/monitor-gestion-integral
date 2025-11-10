import { query } from '../db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('🚀 Ejecutando migración: Crear tabla user_clients...');
    
    const sqlPath = path.join(__dirname, 'create_user_clients_table.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    
    await query(sql);
    
    console.log('✅ Migración completada exitosamente');
    console.log('📋 Tabla user_clients creada con éxito');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error ejecutando migración:', error);
    process.exit(1);
  }
}

runMigration();

