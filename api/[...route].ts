import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';

import clientsRouter from '../server/routes/clients.js';
import usersRouter from '../server/routes/users.js';
import techPlatformsRouter from '../server/routes/techPlatforms.js';
import techImplementationsRouter from '../server/routes/techImplementations.js';
import biPanelsRouter from '../server/routes/biPanels.js';
import biClientPanelsRouter from '../server/routes/biClientPanels.js';
import processAreasRouter from '../server/routes/processAreas.js';
import processSurveysRouter from '../server/routes/processSurveys.js';
import labEventsRouter from '../server/routes/labEvents.js';
import alertsRouter from '../server/routes/alerts.js';
import clientExperiencesRouter from '../server/routes/clientExperiences.js';
import collaboratorExperiencePlansRouter from '../server/routes/collaboratorExperiencePlans.js';
import techUsabilityRouter from '../server/routes/techUsability.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Monitor de Gestión Integral API is running' });
});

// API routes - these paths are relative to /api
app.use('/clients', clientsRouter);
app.use('/users', usersRouter);
app.use('/tech-platforms', techPlatformsRouter);
app.use('/tech-implementations', techImplementationsRouter);
app.use('/bi-panels', biPanelsRouter);
app.use('/bi-client-panels', biClientPanelsRouter);
app.use('/process-areas', processAreasRouter);
app.use('/process-surveys', processSurveysRouter);
app.use('/lab-events', labEventsRouter);
app.use('/alerts', alertsRouter);
app.use('/client-experiences', clientExperiencesRouter);
app.use('/collaborator-experience-plans', collaboratorExperiencePlansRouter);
app.use('/tech-usability', techUsabilityRouter);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(200).end();
  }

  return app(req as any, res as any);
}

