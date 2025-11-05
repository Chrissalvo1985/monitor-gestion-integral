
import React from 'react';
import { 
    Client, TechImplementation, BiClientPanel, ProcessSurvey, Alert, LabEvent, User, 
    TechPlatform, BiPanel, ProcessArea, ClientExperience, CollaboratorExperiencePlan, TechUsability 
} from '../types';

export interface IDataContext {
    clients: Client[];
    techImplementations: TechImplementation[];
    biClientPanels: BiClientPanel[];
    processSurveys: ProcessSurvey[];
    alerts: Alert[];
    labEvents: LabEvent[];
    users: User[];
    techPlatforms: TechPlatform[];
    biPanels: BiPanel[];
    processAreas: ProcessArea[];
    clientExperiences: ClientExperience[];
    collaboratorExperiencePlans: CollaboratorExperiencePlan[];
    techUsability: TechUsability[];
    
    selectedClientId: string | null;
    setSelectedClientId: (id: string | null) => void;

    // CRUD functions
    addClient: (client: Omit<Client, 'id' | 'health_score'>) => void;
    updateClient: (client: Client) => void;
    deleteClient: (clientId: string) => void;
    
    addTechPlatform: (platform: Omit<TechPlatform, 'id'>) => void;
    deleteTechPlatform: (platformId: string) => void;

    addTechImplementation: (impl: Omit<TechImplementation, 'id' | 'last_update'>) => void;
    updateTechImplementation: (impl: TechImplementation) => void;
    deleteTechImplementation: (implId: string) => void;
    
    addBiPanel: (panel: Omit<BiPanel, 'id'>, clientPanelData: Omit<BiClientPanel, 'id' | 'panel_id' | 'last_update'>) => void;
    updateBiPanel: (panel: BiPanel) => void;
    updateBiClientPanel: (panel: BiClientPanel) => void;

    addProcessSurvey: (survey: Omit<ProcessSurvey, 'id' | 'last_update'>) => void;
    updateProcessSurvey: (survey: ProcessSurvey) => void;

    addLabEvent: (event: Omit<LabEvent, 'id'>) => void;
    updateLabEvent: (event: LabEvent) => void;
    deleteLabEvent: (eventId: string) => void;

    addClientExperience: (experience: Omit<ClientExperience, 'id'>) => void;
    updateClientExperience: (experience: ClientExperience) => void;
    
    addCollaboratorExperiencePlan: (plan: Omit<CollaboratorExperiencePlan, 'id' | 'last_update'>) => void;
    updateCollaboratorExperiencePlan: (plan: CollaboratorExperiencePlan) => void;
    deleteCollaboratorExperiencePlan: (planId: string) => void;

    upsertTechUsability: (clientId: string, platformId: string, usageCount: number, lastUpdate: string) => void;
}

export const DataContext = React.createContext<IDataContext | undefined>(undefined);