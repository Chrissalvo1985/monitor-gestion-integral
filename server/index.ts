import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import clientsRouter from './routes/clients.js';
import usersRouter from './routes/users.js';
import techPlatformsRouter from './routes/techPlatforms.js';
import techImplementationsRouter from './routes/techImplementations.js';
import biPanelsRouter from './routes/biPanels.js';
import biClientPanelsRouter from './routes/biClientPanels.js';
import processAreasRouter from './routes/processAreas.js';
import processSurveysRouter from './routes/processSurveys.js';
import labEventsRouter from './routes/labEvents.js';
import alertsRouter from './routes/alerts.js';
import clientExperiencesRouter from './routes/clientExperiences.js';
import collaboratorExperiencePlansRouter from './routes/collaboratorExperiencePlans.js';
import techUsabilityRouter from './routes/techUsability.js';

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}/api`);
});

