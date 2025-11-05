import { query } from '../db.js';
import { v4 as uuidv4 } from 'uuid';

// Create UUID mapping for mock data
const uuidMap = new Map<string, string>();
const getUUID = (oldId: string): string => {
  if (!uuidMap.has(oldId)) {
    uuidMap.set(oldId, uuidv4());
  }
  return uuidMap.get(oldId)!;
};

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await query('TRUNCATE TABLE tech_usability CASCADE');
    await query('TRUNCATE TABLE collaborator_experience_plans CASCADE');
    await query('TRUNCATE TABLE client_experiences CASCADE');
    await query('TRUNCATE TABLE alerts CASCADE');
    await query('TRUNCATE TABLE lab_events CASCADE');
    await query('TRUNCATE TABLE process_surveys CASCADE');
    await query('TRUNCATE TABLE bi_client_panels CASCADE');
    await query('TRUNCATE TABLE tech_implementations CASCADE');
    await query('TRUNCATE TABLE clients CASCADE');
    await query('TRUNCATE TABLE users CASCADE');
    await query('TRUNCATE TABLE bi_panels CASCADE');
    await query('TRUNCATE TABLE tech_platforms CASCADE');
    await query('TRUNCATE TABLE process_areas CASCADE');

    // Insert users
    console.log('👥 Inserting users...');
    const users = [
      { id: 'u1', name: 'Ana Gómez' },
      { id: 'u2', name: 'Carlos Ruíz' },
      { id: 'u3', name: 'Sofía Marín' },
      { id: 'u4', name: 'Javier Torres' },
      { id: 'u5', name: 'Laura Fernández' },
      { id: 'u6', name: 'Ricardo Bravo' },
      { id: 'u7', name: 'Catalina Andrews' },
    ];

    for (const user of users) {
      await query('INSERT INTO users (id, name) VALUES ($1, $2)', [getUUID(user.id), user.name]);
    }

    // Insert process areas
    console.log('📋 Inserting process areas...');
    const processAreas = [
      { id: 'pa1', code: 'COMERCIAL', display_name: 'Comercial' },
      { id: 'pa2', code: 'RYS', display_name: 'Reclutamiento y Selección' },
      { id: 'pa3', code: 'RELACIONES_LABORALES', display_name: 'Relaciones Laborales' },
      { id: 'pa4', code: 'FACTURACION', display_name: 'Facturación' },
      { id: 'pa5', code: 'MGI', display_name: 'Gestión Integral (MGI)' },
    ];

    for (const area of processAreas) {
      await query('INSERT INTO process_areas (id, code, display_name) VALUES ($1, $2, $3)', 
        [getUUID(area.id), area.code, area.display_name]);
    }

    // Insert tech platforms
    console.log('💻 Inserting tech platforms...');
    const techPlatforms = [
      { id: 'tp1', code: 'ECRMOVIL', display_name: 'ECR Móvil' },
      { id: 'tp2', code: 'NSS', display_name: 'NSS' },
      { id: 'tp3', code: 'SINEX', display_name: 'SINEX' },
      { id: 'tp4', code: 'PORTAL_CLIENTE', display_name: 'Portal Cliente' },
      { id: 'tp5', code: 'PANEL_SUPERVISORES', display_name: 'Panel Supervisores' },
      { id: 'tp6', code: 'WF_SELECCION', display_name: 'WF Selección' },
    ];

    for (const platform of techPlatforms) {
      await query('INSERT INTO tech_platforms (id, code, display_name) VALUES ($1, $2, $3)',
        [getUUID(platform.id), platform.code, platform.display_name]);
    }

    // Insert clients
    console.log('🏢 Inserting clients...');
    const clients = [
      { id: 'c1', name: 'Gigante Corp', gerencia: 'Rbravo', owner_user_id: 'u1', headcount: 5000 },
      { id: 'c2', name: 'Innovate Solutions', gerencia: 'Candrews', owner_user_id: 'u2', headcount: 800 },
      { id: 'c3', name: 'Startup Rápida', gerencia: 'Rbravo', owner_user_id: 'u1', headcount: 50 },
      { id: 'c4', name: 'Logística Global', gerencia: 'Candrews', owner_user_id: 'u3', headcount: 12000 },
    ];

    for (const client of clients) {
      await query(
        'INSERT INTO clients (id, name, gerencia, owner_user_id, headcount) VALUES ($1, $2, $3, $4, $5)',
        [getUUID(client.id), client.name, client.gerencia, getUUID(client.owner_user_id), client.headcount]
      );
    }

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
