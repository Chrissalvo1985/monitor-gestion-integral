import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ViewType, Client, TechImplementation, BiClientPanel, ProcessSurvey, Alert, LabEvent, User, TechPlatform, BiPanel, ProcessArea, ClientExperience, CollaboratorExperiencePlan, TechUsability } from './types';
import { calculateClientHealthScore } from './utils/calculations';
import { DataContext } from './context/DataContext';
import { api } from './lib/api';

import DashboardView from './views/DashboardView';
import TechMonitorView from './views/TechMonitorView';
import BiMonitorView from './views/BiMonitorView';
import ProcessMonitorView from './views/ProcessMonitorView';
import PervexLabView from './views/PervexLabView';
import ExperienceView from './views/ExperienceView';
import UsabilityView from './views/UsabilityView';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<string | null>('all');
  const [loading, setLoading] = useState(true);
  
  // State management for all data
  const [clients, setClients] = useState<Client[]>([]);
  const [techPlatforms, setTechPlatforms] = useState<TechPlatform[]>([]);
  const [techImplementations, setTechImplementations] = useState<TechImplementation[]>([]);
  const [biPanels, setBiPanels] = useState<BiPanel[]>([]);
  const [biClientPanels, setBiClientPanels] = useState<BiClientPanel[]>([]);
  const [processSurveys, setProcessSurveys] = useState<ProcessSurvey[]>([]);
  const [labEvents, setLabEvents] = useState<LabEvent[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [clientExperiences, setClientExperiences] = useState<ClientExperience[]>([]);
  const [collaboratorExperiencePlans, setCollaboratorExperiencePlans] = useState<CollaboratorExperiencePlan[]>([]);
  const [techUsability, setTechUsability] = useState<TechUsability[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [processAreas, setProcessAreas] = useState<ProcessArea[]>([]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          usersData,
          clientsData,
          techPlatformsData,
          techImplementationsData,
          biPanelsData,
          biClientPanelsData,
          processAreasData,
          processSurveysData,
          labEventsData,
          alertsData,
          clientExperiencesData,
          collaboratorExperiencePlansData,
          techUsabilityData,
        ] = await Promise.all([
          api.getUsers(),
          api.getClients(),
          api.getTechPlatforms(),
          api.getTechImplementations(),
          api.getBiPanels(),
          api.getBiClientPanels(),
          api.getProcessAreas(),
          api.getProcessSurveys(),
          api.getLabEvents(),
          api.getAlerts(),
          api.getClientExperiences(),
          api.getCollaboratorExperiencePlans(),
          api.getTechUsability(),
        ]);

        setUsers(usersData);
        setClients(clientsData);
        setTechPlatforms(techPlatformsData);
        setTechImplementations(techImplementationsData);
        setBiPanels(biPanelsData);
        setBiClientPanels(biClientPanelsData);
        setProcessAreas(processAreasData);
        setProcessSurveys(processSurveysData);
        setLabEvents(labEventsData);
        setAlerts(alertsData);
        setClientExperiences(clientExperiencesData);
        setCollaboratorExperiencePlans(collaboratorExperiencePlansData);
        setTechUsability(techUsabilityData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --- CRUD Functions ---
  const addClient = async (client: Omit<Client, 'id' | 'health_score'>) => {
    try {
      const newClient = await api.createClient(client);
      setClients(prev => [...prev, newClient]);
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  };

  const updateClient = async (updatedClient: Client) => {
    try {
      const client = await api.updateClient(updatedClient.id, updatedClient);
      setClients(prev => prev.map(c => c.id === client.id ? client : c));
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const deleteClient = async (clientId: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este cliente y toda su información asociada? Esta acción no se puede deshacer.')) {
      return;
    }
    try {
      await api.deleteClient(clientId);
      setClients(prev => prev.filter(c => c.id !== clientId));
      setTechImplementations(prev => prev.filter(ti => ti.client_id !== clientId));
      setBiClientPanels(prev => prev.filter(bcp => bcp.client_id !== clientId));
      setLabEvents(prev => prev.filter(le => le.client_id !== clientId));
      setAlerts(prev => prev.filter(a => a.client_id !== clientId));
      setClientExperiences(prev => prev.filter(ce => ce.client_id !== clientId));
      setCollaboratorExperiencePlans(prev => prev.filter(cep => cep.client_id !== clientId));
      setTechUsability(prev => prev.filter(tu => tu.client_id !== clientId));

      if (selectedClientId === clientId) {
        setSelectedClientId('all');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };
  
  const addTechPlatform = async (platform: Omit<TechPlatform, 'id'>) => {
    try {
      const newPlatform = await api.createTechPlatform(platform);
      setTechPlatforms(prev => [...prev, newPlatform]);
    } catch (error) {
      console.error('Error creating tech platform:', error);
      throw error;
    }
  };
  
  const addTechImplementation = async (impl: Omit<TechImplementation, 'id' | 'last_update'>) => {
    try {
      const newImpl = await api.createTechImplementation(impl);
      setTechImplementations(prev => [...prev, newImpl]);
    } catch (error) {
      console.error('Error creating tech implementation:', error);
      throw error;
    }
  };

  const updateTechImplementation = async (updatedImpl: TechImplementation) => {
    try {
      const impl = await api.updateTechImplementation(updatedImpl.id, updatedImpl);
      setTechImplementations(prev => prev.map(i => i.id === impl.id ? impl : i));
    } catch (error) {
      console.error('Error updating tech implementation:', error);
      throw error;
    }
  };
  
  const addBiPanel = async (panel: Omit<BiPanel, 'id'>, clientPanelData: Omit<BiClientPanel, 'id' | 'panel_id' | 'last_update'>) => {
    try {
      const newPanel = await api.createBiPanel(panel);
      const newClientPanel = await api.createBiClientPanel({ ...clientPanelData, panel_id: newPanel.id });
      setBiPanels(prev => [...prev, newPanel]);
      setBiClientPanels(prev => [...prev, newClientPanel]);
    } catch (error) {
      console.error('Error creating BI panel:', error);
      throw error;
    }
  };

  const updateBiPanel = async (updatedPanel: BiPanel) => {
    try {
      const panel = await api.updateBiPanel(updatedPanel.id, updatedPanel);
      setBiPanels(prev => prev.map(p => p.id === panel.id ? panel : p));
    } catch (error) {
      console.error('Error updating BI panel:', error);
      throw error;
    }
  };

  const updateBiClientPanel = async (updatedPanel: BiClientPanel) => {
    try {
      const panel = await api.updateBiClientPanel(updatedPanel.id, updatedPanel);
      setBiClientPanels(prev => prev.map(p => p.id === panel.id ? panel : p));
    } catch (error) {
      console.error('Error updating BI client panel:', error);
      throw error;
    }
  };

  const addProcessSurvey = async (survey: Omit<ProcessSurvey, 'id' | 'last_update'>) => {
    try {
      const newSurvey = await api.createProcessSurvey(survey);
      setProcessSurveys(prev => [...prev, newSurvey]);
    } catch (error) {
      console.error('Error creating process survey:', error);
      throw error;
    }
  };

  const updateProcessSurvey = async (updatedSurvey: ProcessSurvey) => {
    try {
      const survey = await api.updateProcessSurvey(updatedSurvey.id, updatedSurvey);
      setProcessSurveys(prev => prev.map(s => s.id === survey.id ? survey : s));
    } catch (error) {
      console.error('Error updating process survey:', error);
      throw error;
    }
  };

  const addLabEvent = async (event: Omit<LabEvent, 'id'>) => {
    try {
      const newEvent = await api.createLabEvent(event);
      setLabEvents(prev => [...prev, newEvent]);
    } catch (error) {
      console.error('Error creating lab event:', error);
      throw error;
    }
  };

  const updateLabEvent = async (updatedEvent: LabEvent) => {
    try {
      const event = await api.updateLabEvent(updatedEvent.id, updatedEvent);
      setLabEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } catch (error) {
      console.error('Error updating lab event:', error);
      throw error;
    }
  };

  const deleteLabEvent = async (eventId: string) => {
    try {
      await api.deleteLabEvent(eventId);
      setLabEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (error) {
      console.error('Error deleting lab event:', error);
      throw error;
    }
  };
  
  const addClientExperience = async (experience: Omit<ClientExperience, 'id'>) => {
    try {
      const newExperience = await api.createClientExperience(experience);
      setClientExperiences(prev => [...prev, newExperience]);
    } catch (error) {
      console.error('Error creating client experience:', error);
      throw error;
    }
  };

  const updateClientExperience = async (updatedExperience: ClientExperience) => {
    try {
      const experience = await api.updateClientExperience(updatedExperience.id, updatedExperience);
      setClientExperiences(prev => prev.map(e => e.id === experience.id ? experience : e));
    } catch (error) {
      console.error('Error updating client experience:', error);
      throw error;
    }
  };

  const addCollaboratorExperiencePlan = async (plan: Omit<CollaboratorExperiencePlan, 'id' | 'last_update'>) => {
    try {
      const newPlan = await api.createCollaboratorExperiencePlan(plan);
      setCollaboratorExperiencePlans(prev => [...prev, newPlan]);
    } catch (error) {
      console.error('Error creating collaborator experience plan:', error);
      throw error;
    }
  };

  const updateCollaboratorExperiencePlan = async (updatedPlan: CollaboratorExperiencePlan) => {
    try {
      const plan = await api.updateCollaboratorExperiencePlan(updatedPlan.id, updatedPlan);
      setCollaboratorExperiencePlans(prev => prev.map(p => p.id === plan.id ? plan : p));
    } catch (error) {
      console.error('Error updating collaborator experience plan:', error);
      throw error;
    }
  };

  const deleteCollaboratorExperiencePlan = async (planId: string) => {
    try {
      await api.deleteCollaboratorExperiencePlan(planId);
      setCollaboratorExperiencePlans(prev => prev.filter(p => p.id !== planId));
    } catch (error) {
      console.error('Error deleting collaborator experience plan:', error);
      throw error;
    }
  };

  const upsertTechUsability = async (clientId: string, platformId: string, usageCount: number, lastUpdate: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const usagePct = client.headcount > 0 ? Math.round((usageCount / client.headcount) * 100) : 0;
    const finalUsagePct = Math.min(100, usagePct);

    try {
      const usability = await api.upsertTechUsability({
        client_id: clientId,
        platform_id: platformId,
        usage_count: usageCount,
        usage_pct: finalUsagePct,
      });
      setTechUsability(prev => {
        const existing = prev.find(tu => tu.client_id === clientId && tu.platform_id === platformId);
        if (existing) {
          return prev.map(tu => tu.id === existing.id ? usability : tu);
        } else {
          return [...prev, usability];
        }
      });
    } catch (error) {
      console.error('Error upserting tech usability:', error);
      throw error;
    }
  };

  const processedClients = useMemo(() => {
    return clients.map(client => {
      const clientTechImpls = techImplementations.filter(impl => impl.client_id === client.id);
      const clientBiPanels = biClientPanels.filter(panel => panel.client_id === client.id);
      
      return {
        ...client,
        health_score: calculateClientHealthScore(client, clientTechImpls, clientBiPanels, []),
      };
    });
  }, [clients, techImplementations, biClientPanels]);

  const dataContextValue = {
    clients: processedClients,
    techImplementations,
    biClientPanels,
    processSurveys,
    alerts,
    labEvents,
    users,
    techPlatforms,
    biPanels,
    processAreas,
    clientExperiences,
    collaboratorExperiencePlans,
    techUsability,
    selectedClientId,
    setSelectedClientId,
    addClient,
    updateClient,
    deleteClient,
    addTechPlatform,
    addTechImplementation,
    updateTechImplementation,
    addBiPanel,
    updateBiPanel,
    updateBiClientPanel,
    addProcessSurvey,
    updateProcessSurvey,
    addLabEvent,
    updateLabEvent,
    deleteLabEvent,
    addClientExperience,
    updateClientExperience,
    addCollaboratorExperiencePlan,
    updateCollaboratorExperiencePlan,
    deleteCollaboratorExperiencePlan,
    upsertTechUsability,
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />;
      case 'tech': return <TechMonitorView />;
      case 'bi': return <BiMonitorView />;
      case 'process': return <ProcessMonitorView />;
      case 'lab': return <PervexLabView />;
      case 'experience': return <ExperienceView />;
      case 'usability': return <UsabilityView />;
      default: return <DashboardView />;
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#F4F6FA] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B82F6] mx-auto mb-4"></div>
          <p className="text-[#1f2937]">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <DataContext.Provider value={dataContextValue}>
        <div className="flex h-screen bg-[#F4F6FA] text-[#1f2937]">
          <Sidebar activeView={activeView} setActiveView={setActiveView} />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
              {renderView()}
            </div>
          </main>
        </div>
    </DataContext.Provider>
  );
};

export default App;
