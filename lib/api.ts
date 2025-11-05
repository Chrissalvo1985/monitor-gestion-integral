// Always use relative URL in production, fallback to localhost for dev
const getApiBaseUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3001/api';
  }
  // Always use same origin - no hardcoded URLs
  return `${window.location.origin}/api`;
};

const API_BASE_URL = getApiBaseUrl();

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Intentar extraer el mensaje de error del servidor
    let errorMessage = `API Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // Si no se puede parsear el JSON, usar el statusText
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Users
  getUsers: () => fetchAPI<any[]>('/users'),
  getUser: (id: string) => fetchAPI<any>(`/users/${id}`),

  // Clients
  getClients: () => fetchAPI<any[]>('/clients'),
  getClient: (id: string) => fetchAPI<any>(`/clients/${id}`),
  createClient: (data: any) => fetchAPI<any>('/clients', { method: 'POST', body: JSON.stringify(data) }),
  updateClient: (id: string, data: any) => fetchAPI<any>(`/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteClient: (id: string) => fetchAPI<any>(`/clients/${id}`, { method: 'DELETE' }),

  // Tech Platforms
  getTechPlatforms: () => fetchAPI<any[]>('/tech-platforms'),
  getTechPlatform: (id: string) => fetchAPI<any>(`/tech-platforms/${id}`),
  createTechPlatform: (data: any) => fetchAPI<any>('/tech-platforms', { method: 'POST', body: JSON.stringify(data) }),
  deleteTechPlatform: (id: string) => fetchAPI<any>(`/tech-platforms/${id}`, { method: 'DELETE' }),

  // Tech Implementations
  getTechImplementations: () => fetchAPI<any[]>('/tech-implementations'),
  getTechImplementationsByClient: (clientId: string) => fetchAPI<any[]>(`/tech-implementations/client/${clientId}`),
  getTechImplementation: (id: string) => fetchAPI<any>(`/tech-implementations/${id}`),
  createTechImplementation: (data: any) => fetchAPI<any>('/tech-implementations', { method: 'POST', body: JSON.stringify(data) }),
  updateTechImplementation: (id: string, data: any) => fetchAPI<any>(`/tech-implementations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTechImplementation: (id: string) => fetchAPI<any>(`/tech-implementations/${id}`, { method: 'DELETE' }),

  // BI Panels
  getBiPanels: () => fetchAPI<any[]>('/bi-panels'),
  getBiPanel: (id: string) => fetchAPI<any>(`/bi-panels/${id}`),
  createBiPanel: (data: any) => fetchAPI<any>('/bi-panels', { method: 'POST', body: JSON.stringify(data) }),
  updateBiPanel: (id: string, data: any) => fetchAPI<any>(`/bi-panels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // BI Client Panels
  getBiClientPanels: () => fetchAPI<any[]>('/bi-client-panels'),
  getBiClientPanelsByClient: (clientId: string) => fetchAPI<any[]>(`/bi-client-panels/client/${clientId}`),
  getBiClientPanel: (id: string) => fetchAPI<any>(`/bi-client-panels/${id}`),
  createBiClientPanel: (data: any) => fetchAPI<any>('/bi-client-panels', { method: 'POST', body: JSON.stringify(data) }),
  updateBiClientPanel: (id: string, data: any) => fetchAPI<any>(`/bi-client-panels/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Process Areas
  getProcessAreas: () => fetchAPI<any[]>('/process-areas'),
  getProcessArea: (id: string) => fetchAPI<any>(`/process-areas/${id}`),

  // Process Surveys
  getProcessSurveys: () => fetchAPI<any[]>('/process-surveys'),
  getProcessSurvey: (id: string) => fetchAPI<any>(`/process-surveys/${id}`),
  createProcessSurvey: (data: any) => fetchAPI<any>('/process-surveys', { method: 'POST', body: JSON.stringify(data) }),
  updateProcessSurvey: (id: string, data: any) => fetchAPI<any>(`/process-surveys/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Lab Events
  getLabEvents: () => fetchAPI<any[]>('/lab-events'),
  getLabEventsByClient: (clientId: string) => fetchAPI<any[]>(`/lab-events/client/${clientId}`),
  getLabEvent: (id: string) => fetchAPI<any>(`/lab-events/${id}`),
  createLabEvent: (data: any) => fetchAPI<any>('/lab-events', { method: 'POST', body: JSON.stringify(data) }),
  updateLabEvent: (id: string, data: any) => fetchAPI<any>(`/lab-events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteLabEvent: (id: string) => fetchAPI<any>(`/lab-events/${id}`, { method: 'DELETE' }),

  // Alerts
  getAlerts: () => fetchAPI<any[]>('/alerts'),
  getAlertsByClient: (clientId: string) => fetchAPI<any[]>(`/alerts/client/${clientId}`),
  getAlert: (id: string) => fetchAPI<any>(`/alerts/${id}`),

  // Client Experiences
  getClientExperiences: () => fetchAPI<any[]>('/client-experiences'),
  getClientExperiencesByClient: (clientId: string) => fetchAPI<any[]>(`/client-experiences/client/${clientId}`),
  getClientExperience: (id: string) => fetchAPI<any>(`/client-experiences/${id}`),
  createClientExperience: (data: any) => fetchAPI<any>('/client-experiences', { method: 'POST', body: JSON.stringify(data) }),
  updateClientExperience: (id: string, data: any) => fetchAPI<any>(`/client-experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Collaborator Experience Plans
  getCollaboratorExperiencePlans: () => fetchAPI<any[]>('/collaborator-experience-plans'),
  getCollaboratorExperiencePlansByClient: (clientId: string) => fetchAPI<any[]>(`/collaborator-experience-plans/client/${clientId}`),
  getCollaboratorExperiencePlan: (id: string) => fetchAPI<any>(`/collaborator-experience-plans/${id}`),
  createCollaboratorExperiencePlan: (data: any) => fetchAPI<any>('/collaborator-experience-plans', { method: 'POST', body: JSON.stringify(data) }),
  updateCollaboratorExperiencePlan: (id: string, data: any) => fetchAPI<any>(`/collaborator-experience-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCollaboratorExperiencePlan: (id: string) => fetchAPI<any>(`/collaborator-experience-plans/${id}`, { method: 'DELETE' }),

  // Tech Usability
  getTechUsability: () => fetchAPI<any[]>('/tech-usability'),
  getTechUsabilityByClient: (clientId: string) => fetchAPI<any[]>(`/tech-usability/client/${clientId}`),
  upsertTechUsability: (data: any) => fetchAPI<any>('/tech-usability', { method: 'POST', body: JSON.stringify(data) }),
};

