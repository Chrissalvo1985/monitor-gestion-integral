
import React from 'react';
import { ImplementationStatus, ProcessSurveyStatus, RiskLevel, AlertSeverity, TechPlatformCode, ProcessAreaCode, ViewType } from './types';

// FIX: Split STATUS_COLORS into two objects and merged them to avoid duplicate key errors from enums with the same string values.
const implementationStatusColors: Record<ImplementationStatus, string> = {
  [ImplementationStatus.IMPLEMENTADO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ImplementationStatus.PLANIFICADO]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ImplementationStatus.EN_PROGRESO]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ImplementationStatus.BLOQUEADO]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  [ImplementationStatus.NO_INICIADO]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [ImplementationStatus.DEPRECATED]: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
};

const processSurveyStatusColors: Record<ProcessSurveyStatus, string> = {
  [ProcessSurveyStatus.IMPLEMENTADO]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  [ProcessSurveyStatus.EN_LEVANTAMIENTO]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [ProcessSurveyStatus.EN_VALIDACION]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [ProcessSurveyStatus.DOCUMENTADO]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  [ProcessSurveyStatus.NO_INICIADO]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const STATUS_COLORS: Record<ImplementationStatus | ProcessSurveyStatus, string> = {
    ...implementationStatusColors,
    ...processSurveyStatusColors
};

export const SEMAPHORE_COLORS: Record<string, string> = {
  VERDE: 'bg-green-500',
  AMARILLO: 'bg-yellow-500',
  ROJO: 'bg-red-500',
  GRIS: 'bg-gray-400',
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  [RiskLevel.BAJO]: 'text-green-600',
  [RiskLevel.MEDIO]: 'text-yellow-600',
  [RiskLevel.ALTO]: 'text-red-600',
};

export const ALERT_SEVERITY_COLORS: Record<AlertSeverity, { bg: string, text: string, border: string }> = {
    [AlertSeverity.INFO]: { bg: 'bg-blue-50 dark:bg-blue-900/50', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-500'},
    [AlertSeverity.WARN]: { bg: 'bg-yellow-50 dark:bg-yellow-900/50', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-500'},
    [AlertSeverity.CRIT]: { bg: 'bg-red-50 dark:bg-red-900/50', text: 'text-red-700 dark:text-red-300', border: 'border-red-500'},
};

export const TECH_PLATFORM_DISPLAY_NAMES: Record<TechPlatformCode, string> = {
    [TechPlatformCode.ECRMOVIL]: 'ECR Móvil',
    [TechPlatformCode.NSS]: 'NSS',
    [TechPlatformCode.SINEX]: 'SINEX',
    [TechPlatformCode.PORTAL_CLIENTE]: 'Portal Cliente',
    [TechPlatformCode.PANEL_SUPERVISORES]: 'Panel Supervisores',
    [TechPlatformCode.WF_SELECCION]: 'WF Selección',
};

export const PROCESS_AREA_DISPLAY_NAMES: Record<ProcessAreaCode, string> = {
    [ProcessAreaCode.COMERCIAL]: 'Comercial',
    [ProcessAreaCode.RYS]: 'Reclutamiento y Selección',
    [ProcessAreaCode.RELACIONES_LABORALES]: 'Relaciones Laborales',
    [ProcessAreaCode.FACTURACION]: 'Facturación',
    [ProcessAreaCode.MGI]: 'Gestión Integral (MGI)',
};

export const VIEWS: { id: ViewType; name: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', name: 'Dashboard General', icon: React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" }) },
    { id: 'tech', name: 'Gestión Tecnología', icon: React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" }) },
    { id: 'usability', name: 'Usabilidad', icon: React.createElement(React.Fragment, null, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" }), React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" })) },
    { id: 'bi', name: 'Gestión BI', icon: React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.5m1-1.5l1 1.5m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" }) },
    { id: 'experience', name: 'Experiencias', icon: React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.5 21.75l-.398-1.178a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.178-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.178a3.375 3.375 0 002.456 2.456l1.178.398-1.178.398a3.375 3.375 0 00-2.456 2.456z" }) },
    { id: 'process', name: 'Gestión Procesos', icon: React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" }) },
    { id: 'lab', name: 'Pervex Lab', icon: React.createElement(React.Fragment, null, 
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.25 6.087c0-.355.186-.676.401-.959.215-.283.49-.52.793-.719a4.5 4.5 0 016.088 6.088c-.2.303-.436.578-.72.793a.99.99 0 01-.958.401h-3.232c-.355 0-.676-.186-.959-.401a.995.995 0 01-.401-.959v-3.232z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.087 14.25c-.355 0-.676.186-.959.401-.283.215-.52.49-.719.793a4.5 4.5 0 006.088 6.088c.303-.2.578-.436.793-.72a.99.99 0 00.401-.958v-3.232c0-.355-.186-.676-.401-.959a.995.995 0 00-.959-.401h-3.232z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 7.5l.006-.006M9 12l.006-.006M9 16.5l.006-.006M12 9l.006-.006M12 13.5l.006-.006M12 18l.006-.006M16.5 9l.006-.006M16.5 13.5l.006-.006M16.5 18l.006-.006" })) 
    },
];
