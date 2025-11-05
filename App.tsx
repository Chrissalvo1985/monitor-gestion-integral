
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ViewType, Client, TechImplementation, BiClientPanel, ProcessSurvey, Alert, LabEvent, User, TechPlatform, BiPanel, ProcessArea, ClientExperience, CollaboratorExperiencePlan, TechUsability } from './types';
import { clients as mockClients, techImplementations as mockTechImplementations, biClientPanels as mockBiClientPanels, processSurveys as mockProcessSurveys, alerts as mockAlerts, labEvents as mockLabEvents, users as mockUsers, techPlatforms as mockTechPlatforms, biPanels as mockBiPanels, processAreas as mockProcessAreas, clientExperiences as mockClientExperiences, collaboratorExperiencePlans as mockCollaboratorExperiencePlans, techUsability as mockTechUsability } from './data/mockData';
import { calculateClientHealthScore } from './utils/calculations';
import { DataContext } from './context/DataContext';

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
  
  // State management for all data
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [techPlatforms, setTechPlatforms] = useState<TechPlatform[]>(mockTechPlatforms);
  const [techImplementations, setTechImplementations] = useState<TechImplementation[]>(mockTechImplementations);
  const [biPanels, setBiPanels] = useState<BiPanel[]>(mockBiPanels);
  const [biClientPanels, setBiClientPanels] = useState<BiClientPanel[]>(mockBiClientPanels);
  const [processSurveys, setProcessSurveys] = useState<ProcessSurvey[]>(mockProcessSurveys);
  const [labEvents, setLabEvents] = useState<LabEvent[]>(mockLabEvents);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [clientExperiences, setClientExperiences] = useState<ClientExperience[]>(mockClientExperiences);
  const [collaboratorExperiencePlans, setCollaboratorExperiencePlans] = useState<CollaboratorExperiencePlan[]>(mockCollaboratorExperiencePlans);
  const [techUsability, setTechUsability] = useState<TechUsability[]>(mockTechUsability);


  // Static data
  const [users] = useState<User[]>(mockUsers);
  const [processAreas] = useState<ProcessArea[]>(mockProcessAreas);


  // --- CRUD Functions ---
  const addClient = (client: Omit<Client, 'id' | 'health_score'>) => {
    const newClient: Client = { ...client, id: crypto.randomUUID(), health_score: 0 };
    setClients(prev => [...prev, newClient]);
  };
  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  const deleteClient = (clientId: string) => {
      if (!window.confirm('¿Está seguro de que desea eliminar este cliente y toda su información asociada? Esta acción no se puede deshacer.')) {
        return;
      }
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
  };
  
  const addTechPlatform = (platform: Omit<TechPlatform, 'id'>) => {
      const newPlatform: TechPlatform = { ...platform, id: crypto.randomUUID() };
      setTechPlatforms(prev => [...prev, newPlatform]);
  };
  
  const addTechImplementation = (impl: Omit<TechImplementation, 'id' | 'last_update'>) => {
    const newImpl: TechImplementation = { ...impl, id: crypto.randomUUID(), last_update: new Date().toISOString() };
    setTechImplementations(prev => [...prev, newImpl]);
  };
  const updateTechImplementation = (updatedImpl: TechImplementation) => {
    setTechImplementations(prev => prev.map(i => i.id === updatedImpl.id ? { ...updatedImpl, last_update: new Date().toISOString() } : i));
  };
  
  const addBiPanel = (panel: Omit<BiPanel, 'id'>, clientPanelData: Omit<BiClientPanel, 'id' | 'panel_id' | 'last_update'>) => {
      const newPanel: BiPanel = { ...panel, id: crypto.randomUUID() };
      setBiPanels(prev => [...prev, newPanel]);
      
      const newClientPanel: BiClientPanel = { ...clientPanelData, id: crypto.randomUUID(), panel_id: newPanel.id, last_update: new Date().toISOString() };
      setBiClientPanels(prev => [...prev, newClientPanel]);
  };

  const updateBiPanel = (updatedPanel: BiPanel) => {
      setBiPanels(prev => prev.map(p => p.id === updatedPanel.id ? updatedPanel : p));
  };

  const updateBiClientPanel = (updatedPanel: BiClientPanel) => {
      setBiClientPanels(prev => prev.map(p => p.id === updatedPanel.id ? { ...updatedPanel, last_update: new Date().toISOString() } : p));
  };

  const addProcessSurvey = (survey: Omit<ProcessSurvey, 'id' | 'last_update'>) => {
      const newSurvey: ProcessSurvey = { ...survey, id: crypto.randomUUID(), last_update: new Date().toISOString() };
      setProcessSurveys(prev => [...prev, newSurvey]);
  };
  const updateProcessSurvey = (updatedSurvey: ProcessSurvey) => {
      setProcessSurveys(prev => prev.map(s => s.id === updatedSurvey.id ? { ...updatedSurvey, last_update: new Date().toISOString() } : s));
  };

  const addLabEvent = (event: Omit<LabEvent, 'id'>) => {
      const newEvent: LabEvent = { ...event, id: crypto.randomUUID() };
      setLabEvents(prev => [...prev, newEvent]);
  };
  const updateLabEvent = (updatedEvent: LabEvent) => {
      setLabEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };
  const deleteLabEvent = (eventId: string) => {
      setLabEvents(prev => prev.filter(e => e.id !== eventId));
  };
  
  const addClientExperience = (experience: Omit<ClientExperience, 'id'>) => {
      const newExperience: ClientExperience = { ...experience, id: crypto.randomUUID() };
      setClientExperiences(prev => [...prev, newExperience]);
  };
  const updateClientExperience = (updatedExperience: ClientExperience) => {
      setClientExperiences(prev => prev.map(e => e.id === updatedExperience.id ? updatedExperience : e));
  };

  const addCollaboratorExperiencePlan = (plan: Omit<CollaboratorExperiencePlan, 'id' | 'last_update'>) => {
      const newPlan: CollaboratorExperiencePlan = { ...plan, id: crypto.randomUUID(), last_update: new Date().toISOString() };
      setCollaboratorExperiencePlans(prev => [...prev, newPlan]);
  };
  const updateCollaboratorExperiencePlan = (updatedPlan: CollaboratorExperiencePlan) => {
      setCollaboratorExperiencePlans(prev => prev.map(p => p.id === updatedPlan.id ? { ...updatedPlan, last_update: new Date().toISOString() } : p));
  };
  const deleteCollaboratorExperiencePlan = (planId: string) => {
      setCollaboratorExperiencePlans(prev => prev.filter(p => p.id !== planId));
  };

  const upsertTechUsability = (clientId: string, platformId: string, usageCount: number, lastUpdate: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const usagePct = client.headcount > 0 ? Math.round((usageCount / client.headcount) * 100) : 0;
    const finalUsagePct = Math.min(100, usagePct);

    setTechUsability(prev => {
        const existing = prev.find(tu => tu.client_id === clientId && tu.platform_id === platformId);
        if (existing) {
            return prev.map(tu => tu.id === existing.id ? { ...tu, usage_count: usageCount, usage_pct: finalUsagePct, last_update: lastUpdate } : tu);
        } else {
            const newUsability: TechUsability = {
                id: crypto.randomUUID(),
                client_id: clientId,
                platform_id: platformId,
                usage_count: usageCount,
                usage_pct: finalUsagePct,
                last_update: lastUpdate,
            };
            return [...prev, newUsability];
        }
    });
  };

  const processedClients = useMemo(() => {
    return clients.map(client => {
      const clientTechImpls = techImplementations.filter(impl => impl.client_id === client.id);
      const clientBiPanels = biClientPanels.filter(panel => panel.client_id === client.id);
      
      return {
        ...client,
        health_score: calculateClientHealthScore(client, clientTechImpls, clientBiPanels, []), // ProcessSurveys no longer client-specific
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