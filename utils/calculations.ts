
import { Client, TechImplementation, BiClientPanel, ProcessSurvey, ImplementationStatus, Gerencia } from '../types';

export const calculateTechProgress = (implementations: TechImplementation[]): number => {
    const relevantImpls = implementations.filter(impl => impl.status !== ImplementationStatus.DEPRECATED);
    if (relevantImpls.length === 0) return 0;
    const totalProgress = relevantImpls.reduce((sum, impl) => sum + impl.progress_pct, 0);
    return Math.round(totalProgress / relevantImpls.length);
};

export const calculateBiProgress = (panels: BiClientPanel[]): number => {
    if (panels.length === 0) return 0;
    const totalProgress = panels.reduce((sum, panel) => sum + panel.progress_pct, 0);
    return Math.round(totalProgress / panels.length);
};

export const calculateProcessProgress = (surveys: ProcessSurvey[]): number => {
    if (surveys.length === 0) return 0;
    const totalProgress = surveys.reduce((sum, survey) => {
        const avgSurveyProgress = (survey.mapeo_proceso_pct + survey.procedimientos_pct + survey.controles_pct + survey.evidencias_pct) / 4;
        return sum + avgSurveyProgress;
    }, 0);
    return Math.round(totalProgress / surveys.length);
};

export const calculateClientHealthScore = (
    client: Client,
    techImpls: TechImplementation[],
    biPanels: BiClientPanel[],
    processSurveys: ProcessSurvey[]
): number => {
    const avg_tech = calculateTechProgress(techImpls) / 100;
    const avg_bi = calculateBiProgress(biPanels) / 100;
    const avg_process = calculateProcessProgress(processSurveys) / 100;

    let penalty = 0;
    const allItems = [...techImpls, ...biPanels];

    allItems.forEach(item => {
        if (item.status === ImplementationStatus.BLOQUEADO) {
            penalty += 10;
        }
        if (item.target_date && new Date(item.target_date) < new Date() && item.status !== ImplementationStatus.IMPLEMENTADO) {
            penalty += 5;
        }
    });

    const score = (0.4 * avg_tech + 0.3 * avg_bi + 0.3 * avg_process) * 100 - penalty;

    return Math.max(0, Math.min(100, Math.round(score)));
};

export const filterClients = (
    clients: Client[],
    selectedClientId: string | null,
    selectedResponsibleId: string | null,
    selectedGerencia: string | null
): Client[] => {
    return clients.filter(client => {
        // Filtro por cliente
        if (selectedClientId && selectedClientId !== 'all' && client.id !== selectedClientId) {
            return false;
        }
        // Filtro por responsable
        if (selectedResponsibleId && selectedResponsibleId !== 'all' && client.owner_user_id !== selectedResponsibleId) {
            return false;
        }
        // Filtro por gerencia
        if (selectedGerencia && selectedGerencia !== 'all' && client.gerencia !== selectedGerencia) {
            return false;
        }
        return true;
    });
};
