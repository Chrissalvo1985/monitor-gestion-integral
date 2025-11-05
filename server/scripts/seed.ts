import { query } from '../db.js';
import {
  users as mockUsers,
  clients as mockClients,
  techPlatforms as mockTechPlatforms,
  techImplementations as mockTechImplementations,
  biPanels as mockBiPanels,
  biClientPanels as mockBiClientPanels,
  processAreas as mockProcessAreas,
  processSurveys as mockProcessSurveys,
  labEvents as mockLabEvents,
  alerts as mockAlerts,
  clientExperiences as mockClientExperiences,
  collaboratorExperiencePlans as mockCollaboratorExperiencePlans,
  techUsability as mockTechUsability,
} from '../../data/mockData.ts';

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
    for (const user of mockUsers) {
      await query('INSERT INTO users (id, name) VALUES ($1, $2) ON CONFLICT DO NOTHING', [user.id, user.name]);
    }

    // Insert process areas
    console.log('📋 Inserting process areas...');
    for (const area of mockProcessAreas) {
      await query('INSERT INTO process_areas (id, code, display_name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', 
        [area.id, area.code, area.display_name]);
    }

    // Insert tech platforms
    console.log('💻 Inserting tech platforms...');
    for (const platform of mockTechPlatforms) {
      await query('INSERT INTO tech_platforms (id, code, display_name, doc_url) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [platform.id, platform.code, platform.display_name, platform.doc_url || null]);
    }

    // Insert clients
    console.log('🏢 Inserting clients...');
    for (const client of mockClients) {
      await query(
        'INSERT INTO clients (id, name, gerencia, owner_user_id, health_score, headcount, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING',
        [client.id, client.name, client.gerencia, client.owner_user_id, client.health_score, client.headcount, client.notes || null]
      );
    }

    // Insert BI panels
    console.log('📊 Inserting BI panels...');
    for (const panel of mockBiPanels) {
      await query(
        'INSERT INTO bi_panels (id, code, name, short_desc, embed_url, area) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING',
        [panel.id, panel.code, panel.name, panel.short_desc, panel.embed_url, panel.area || null]
      );
    }

    // Insert tech implementations
    console.log('⚙️  Inserting tech implementations...');
    for (const impl of mockTechImplementations) {
      await query(
        `INSERT INTO tech_implementations (id, client_id, platform_id, status, progress_pct, owner_user_id, start_date, target_date, implemented_at, risk_level, notes, evidence_url, last_update)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT DO NOTHING`,
        [
          impl.id, impl.client_id, impl.platform_id, impl.status, impl.progress_pct, impl.owner_user_id,
          impl.start_date || null, impl.target_date || null, impl.implemented_at || null,
          impl.risk_level, impl.notes || null, impl.evidence_url || null, impl.last_update
        ]
      );
    }

    // Insert BI client panels
    console.log('📈 Inserting BI client panels...');
    for (const panel of mockBiClientPanels) {
      await query(
        `INSERT INTO bi_client_panels (id, client_id, panel_id, status, progress_pct, owner_user_id, target_date, implemented_at, notes, last_update)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
        [
          panel.id, panel.client_id, panel.panel_id, panel.status, panel.progress_pct, panel.owner_user_id,
          panel.target_date || null, panel.implemented_at || null, panel.notes || null, panel.last_update
        ]
      );
    }

    // Insert process surveys
    console.log('📝 Inserting process surveys...');
    for (const survey of mockProcessSurveys) {
      await query(
        `INSERT INTO process_surveys (id, area_id, status, mapeo_proceso_pct, procedimientos_pct, controles_pct, evidencias_pct, owner_user_id, notes, attachments_url, last_update)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
        [
          survey.id, survey.area_id, survey.status, survey.mapeo_proceso_pct, survey.procedimientos_pct,
          survey.controles_pct, survey.evidencias_pct, survey.owner_user_id,
          survey.notes || null, survey.attachments_url || null, survey.last_update
        ]
      );
    }

    // Insert lab events
    console.log('🔬 Inserting lab events...');
    for (const event of mockLabEvents) {
      await query(
        `INSERT INTO lab_events (id, date, client_id, topic, type, owner_user_id, outcomes, recording_url, materials_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT DO NOTHING`,
        [
          event.id, event.date, event.client_id || null, event.topic, event.type, event.owner_user_id,
          event.outcomes, event.recording_url || null, event.materials_url || null
        ]
      );
    }

    // Insert alerts
    console.log('⚠️  Inserting alerts...');
    for (const alert of mockAlerts) {
      await query(
        `INSERT INTO alerts (id, entity_type, client_id, reference_id, severity, rule_code, message, created_at, ack_by_user_id, ack_at, resolved_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT DO NOTHING`,
        [
          alert.id, alert.entity_type, alert.client_id, alert.reference_id, alert.severity, alert.rule_code,
          alert.message, alert.created_at, alert.ack_by_user_id || null, alert.ack_at || null, alert.resolved_at || null
        ]
      );
    }

    // Insert client experiences
    console.log('😊 Inserting client experiences...');
    for (const exp of mockClientExperiences) {
      await query(
        'INSERT INTO client_experiences (id, client_id, nps_score, last_survey_date, notes) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [exp.id, exp.client_id, exp.nps_score, exp.last_survey_date, exp.notes || null]
      );
    }

    // Insert collaborator experience plans
    console.log('👨‍💼 Inserting collaborator experience plans...');
    for (const plan of mockCollaboratorExperiencePlans) {
      await query(
        `INSERT INTO collaborator_experience_plans (id, client_id, area_id, plan_name, status, progress_pct, owner_user_id, target_date, description, last_update)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT DO NOTHING`,
        [
          plan.id, plan.client_id, plan.area_id, plan.plan_name, plan.status, plan.progress_pct, plan.owner_user_id,
          plan.target_date || null, plan.description || null, plan.last_update
        ]
      );
    }

    // Insert tech usability
    console.log('📱 Inserting tech usability...');
    for (const usability of mockTechUsability) {
      await query(
        `INSERT INTO tech_usability (id, client_id, platform_id, usage_count, usage_pct, last_update)
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING`,
        [usability.id, usability.client_id, usability.platform_id, usability.usage_count, usability.usage_pct, usability.last_update]
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

