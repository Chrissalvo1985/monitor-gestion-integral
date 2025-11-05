import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from '../server/db.js';

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Monitor de Gestión Integral API is running' });
});

// API routes
app.use('/api/clients', clientsRouter);
app.use('/api/users', usersRouter);
app.use('/api/tech-platforms', techPlatformsRouter);
app.use('/api/tech-implementations', techImplementationsRouter);
app.use('/api/bi-panels', biPanelsRouter);
app.use('/api/bi-client-panels', biClientPanelsRouter);
app.use('/api/process-areas', processAreasRouter);
app.use('/api/process-surveys', processSurveysRouter);
app.use('/api/lab-events', labEventsRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/client-experiences', clientExperiencesRouter);
app.use('/api/collaborator-experience-plans', collaboratorExperiencePlansRouter);
app.use('/api/tech-usability', techUsabilityRouter);

export default app;

