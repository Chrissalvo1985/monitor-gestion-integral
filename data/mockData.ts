
import {
    Client, Gerencia, TechPlatform, TechPlatformCode, TechImplementation, ImplementationStatus, RiskLevel,
    BiPanel, BiClientPanel, ProcessArea, ProcessAreaCode, ProcessSurvey, ProcessSurveyStatus, LabEvent, LabEventType,
    Alert, AlertEntityType, AlertSeverity, User, ClientExperience, CollaboratorExperiencePlan, TechUsability
} from '../types';

export const users: User[] = [
    { id: 'u1', name: 'Ana Gómez' },
    { id: 'u2', name: 'Carlos Ruíz' },
    { id: 'u3', name: 'Sofía Marín' },
    { id: 'u4', name: 'Javier Torres' },
    { id: 'u5', name: 'Laura Fernández' },
    { id: 'u6', name: 'Ricardo Bravo' },
    { id: 'u7', name: 'Catalina Andrews' },
];

export const clients: Client[] = [
    { id: 'c1', name: 'Gigante Corp', gerencia: Gerencia.Rbravo, owner_user_id: 'u1', health_score: 0, headcount: 5000 },
    { id: 'c2', name: 'Innovate Solutions', gerencia: Gerencia.Candrews, owner_user_id: 'u2', health_score: 0, headcount: 800 },
    { id: 'c3', name: 'Startup Rápida', gerencia: Gerencia.Rbravo, owner_user_id: 'u1', health_score: 0, headcount: 50 },
    { id: 'c4', name: 'Logística Global', gerencia: Gerencia.Candrews, owner_user_id: 'u3', health_score: 0, headcount: 12000 },
];

export const techPlatforms: TechPlatform[] = [
    { id: 'tp1', code: 'ECRMOVIL', display_name: 'ECR Móvil' },
    { id: 'tp2', code: 'NSS', display_name: 'NSS' },
    { id: 'tp3', code: 'SINEX', display_name: 'SINEX' },
    { id: 'tp4', code: 'PORTAL_CLIENTE', display_name: 'Portal Cliente' },
    { id: 'tp5', code: 'PANEL_SUPERVISORES', display_name: 'Panel Supervisores' },
    { id: 'tp6', code: 'WF_SELECCION', display_name: 'WF Selección' },
];

export const techImplementations: TechImplementation[] = [
    { id: 'ti1', client_id: 'c1', platform_id: 'tp1', status: ImplementationStatus.IMPLEMENTADO, progress_pct: 100, owner_user_id: 'u1', target_date: '2023-10-01', implemented_at: '2023-09-25', last_update: '2024-07-20', risk_level: RiskLevel.BAJO },
    { id: 'ti2', client_id: 'c1', platform_id: 'tp2', status: ImplementationStatus.EN_PROGRESO, progress_pct: 75, owner_user_id: 'u1', target_date: '2024-08-30', last_update: '2024-07-15', risk_level: RiskLevel.MEDIO },
    { id: 'ti3', client_id: 'c1', platform_id: 'tp4', status: ImplementationStatus.BLOQUEADO, progress_pct: 40, owner_user_id: 'u2', target_date: '2024-07-01', last_update: '2024-07-10', risk_level: RiskLevel.ALTO, notes: 'Falta definición de API del cliente.' },
    { id: 'ti4', client_id: 'c2', platform_id: 'tp1', status: ImplementationStatus.IMPLEMENTADO, progress_pct: 100, owner_user_id: 'u2', target_date: '2024-05-15', implemented_at: '2024-05-10', last_update: '2024-07-01', risk_level: RiskLevel.BAJO },
    { id: 'ti5', client_id: 'c2', platform_id: 'tp4', status: ImplementationStatus.EN_PROGRESO, progress_pct: 90, owner_user_id: 'u2', target_date: '2024-09-15', last_update: '2024-07-21', risk_level: RiskLevel.BAJO },
    { id: 'ti6', client_id: 'c3', platform_id: 'tp1', status: ImplementationStatus.PLANIFICADO, progress_pct: 10, owner_user_id: 'u1', target_date: '2024-10-01', last_update: '2024-06-30', risk_level: RiskLevel.MEDIO },
    { id: 'ti7', client_id: 'c3', platform_id: 'tp2', status: ImplementationStatus.NO_INICIADO, progress_pct: 0, owner_user_id: 'u1', last_update: '2024-06-30', risk_level: RiskLevel.BAJO },
    { id: 'ti8', client_id: 'c4', platform_id: 'tp3', status: ImplementationStatus.DEPRECATED, progress_pct: 100, owner_user_id: 'u3', last_update: '2024-01-01', risk_level: RiskLevel.BAJO },
    { id: 'ti9', client_id: 'c4', platform_id: 'tp5', status: ImplementationStatus.EN_PROGRESO, progress_pct: 50, owner_user_id: 'u3', target_date: '2024-07-25', last_update: '2024-07-18', risk_level: RiskLevel.ALTO, notes: 'Target date vencida' },
];

export const biPanels: BiPanel[] = [
    { id: 'bp1', code: 'VENTAS_Q', name: 'Dashboard de Ventas Q', short_desc: 'Análisis de performance comercial.', area: 'Comercial', embed_url: 'https://app.powerbi.com/...' },
    { id: 'bp2', code: 'ROTACION_PERS', name: 'Panel de Rotación', short_desc: 'Métricas de rotación y retención.', area: 'RRHH', embed_url: 'https://app.powerbi.com/...' },
    { id: 'bp3', code: 'SLA_OPER', name: 'Cumplimiento SLA', short_desc: 'Seguimiento de SLAs operativos.', area: 'Operaciones', embed_url: 'https://app.powerbi.com/...' },
];

export const biClientPanels: BiClientPanel[] = [
    { id: 'bcp1', client_id: 'c1', panel_id: 'bp1', status: ImplementationStatus.IMPLEMENTADO, progress_pct: 100, owner_user_id: 'u3', implemented_at: '2024-06-01', last_update: '2024-07-11' },
    { id: 'bcp2', client_id: 'c1', panel_id: 'bp2', status: ImplementationStatus.EN_PROGRESO, progress_pct: 60, owner_user_id: 'u3', target_date: '2024-09-20', last_update: '2024-07-20' },
    { id: 'bcp3', client_id: 'c2', panel_id: 'bp1', status: ImplementationStatus.PLANIFICADO, progress_pct: 20, owner_user_id: 'u3', target_date: '2024-10-10', last_update: '2024-07-15' },
    { id: 'bcp4', client_id: 'c4', panel_id: 'bp3', status: ImplementationStatus.BLOQUEADO, progress_pct: 30, owner_user_id: 'u3', target_date: '2024-08-01', last_update: '2024-07-19', notes: 'Fuente de datos no disponible' },
];

export const processAreas: ProcessArea[] = [
    { id: 'pa1', code: ProcessAreaCode.COMERCIAL, display_name: 'Comercial' },
    { id: 'pa2', code: ProcessAreaCode.RYS, display_name: 'Reclutamiento y Selección' },
    { id: 'pa3', code: ProcessAreaCode.RELACIONES_LABORALES, display_name: 'Relaciones Laborales' },
    { id: 'pa4', code: ProcessAreaCode.FACTURACION, display_name: 'Facturación' },
    { id: 'pa5', code: ProcessAreaCode.MGI, display_name: 'Gestión Integral (MGI)' },
];

export const processSurveys: ProcessSurvey[] = [
    { id: 'ps1', area_id: 'pa1', status: ProcessSurveyStatus.DOCUMENTADO, mapeo_proceso_pct: 100, procedimientos_pct: 100, controles_pct: 80, evidencias_pct: 50, owner_user_id: 'u2', last_update: '2024-07-18' },
    { id: 'ps2', area_id: 'pa2', status: ProcessSurveyStatus.EN_LEVANTAMIENTO, mapeo_proceso_pct: 50, procedimientos_pct: 20, controles_pct: 0, evidencias_pct: 0, owner_user_id: 'u2', last_update: '2024-07-22' },
    { id: 'ps3', area_id: 'pa3', status: ProcessSurveyStatus.IMPLEMENTADO, mapeo_proceso_pct: 100, procedimientos_pct: 100, controles_pct: 100, evidencias_pct: 100, owner_user_id: 'u1', last_update: '2024-07-05' },
    { id: 'ps4', area_id: 'pa4', status: ProcessSurveyStatus.NO_INICIADO, mapeo_proceso_pct: 0, procedimientos_pct: 0, controles_pct: 0, evidencias_pct: 0, owner_user_id: 'u1', last_update: '2024-06-15' },
];

export const labEvents: LabEvent[] = [
    { id: 'le1', date: '2024-07-25', client_id: 'c1', topic: 'Workshop de Automatización de RRHH', type: LabEventType.WORKSHOP, owner_user_id: 'u2', outcomes: 'Se definieron 3 flujos para automatizar.' },
    // FIX: Corrected typo from `CAPACITacion` to `CAPACITACION`.
    { id: 'le2', date: '2024-08-05', topic: 'Capacitación Nuevo Portal Cliente', type: LabEventType.CAPACITACION, owner_user_id: 'u1', outcomes: '15 usuarios capacitados.' },
    { id: 'le3', date: '2024-08-15', client_id: 'c2', topic: 'Piloto Panel BI de Operaciones', type: LabEventType.PILOTO, owner_user_id: 'u3', outcomes: 'Feedback positivo, se ajustarán 2 KPIs.' },
];

export const alerts: Alert[] = [
    { id: 'a1', entity_type: AlertEntityType.TECH, client_id: 'c1', reference_id: 'ti3', severity: AlertSeverity.CRIT, rule_code: 'BLOQUEADO_GT_7D', message: 'Implementación de Portal Cliente bloqueada por más de 7 días.', created_at: '2024-07-18T10:00:00Z' },
    { id: 'a2', entity_type: AlertEntityType.TECH, client_id: 'c4', reference_id: 'ti9', severity: AlertSeverity.WARN, rule_code: 'TARGET_DATE_VENCIDA', message: 'Panel Supervisores tiene fecha objetivo vencida.', created_at: '2024-07-26T09:00:00Z' },
    { id: 'a3', entity_type: AlertEntityType.BI, client_id: 'c4', reference_id: 'bcp4', severity: AlertSeverity.CRIT, rule_code: 'BLOQUEADO_GT_7D', message: 'Panel BI SLA Operaciones bloqueado', created_at: '2024-07-26T11:00:00Z' },
    { id: 'a4', entity_type: AlertEntityType.PROCESS, client_id: 'c1', reference_id: 'ps2', severity: AlertSeverity.INFO, rule_code: 'LAST_UPDATE_GT_14D', message: 'Proceso RyS no actualizado en 15 días.', created_at: '2024-07-21T12:00:00Z' },
];

export const clientExperiences: ClientExperience[] = [
    { id: 'ce1', client_id: 'c1', nps_score: 75, last_survey_date: '2024-06-15' },
    { id: 'ce2', client_id: 'c2', nps_score: 40, last_survey_date: '2024-06-20' },
    { id: 'ce3', client_id: 'c4', nps_score: -10, last_survey_date: '2024-07-01', notes: 'Cliente detractor por problemas en la implementación de SINEX.' },
];

export const collaboratorExperiencePlans: CollaboratorExperiencePlan[] = [
    { id: 'cep1', client_id: 'c1', area_id: 'pa2', plan_name: 'Mejora Comunicación RyS', status: ImplementationStatus.EN_PROGRESO, progress_pct: 50, owner_user_id: 'u5', target_date: '2024-09-30', last_update: '2024-07-22' },
    { id: 'cep2', client_id: 'c1', area_id: 'pa3', plan_name: 'Capacitación Ley 40 horas', status: ImplementationStatus.IMPLEMENTADO, progress_pct: 100, owner_user_id: 'u5', target_date: '2024-07-15', last_update: '2024-07-16' },
    { id: 'cep3', client_id: 'c4', area_id: 'pa3', plan_name: 'Digitalización de Licencias', status: ImplementationStatus.PLANIFICADO, progress_pct: 10, owner_user_id: 'u4', target_date: '2024-10-31', last_update: '2024-07-20' },
];

export const techUsability: TechUsability[] = [
    { id: 'tu1', client_id: 'c1', platform_id: 'tp1', usage_count: 4750, usage_pct: 95, last_update: '2024-07-28' },
    { id: 'tu2', client_id: 'c1', platform_id: 'tp2', usage_count: 3000, usage_pct: 60, last_update: '2024-07-28' },
    { id: 'tu3', client_id: 'c1', platform_id: 'tp4', usage_count: 1500, usage_pct: 30, last_update: '2024-07-28' },
    { id: 'tu4', client_id: 'c2', platform_id: 'tp1', usage_count: 704, usage_pct: 88, last_update: '2024-07-28' },
    { id: 'tu5', client_id: 'c2', platform_id: 'tp4', usage_count: 736, usage_pct: 92, last_update: '2024-07-28' },
    { id: 'tu6', client_id: 'c4', platform_id: 'tp5', usage_count: 5400, usage_pct: 45, last_update: '2024-07-28' },
];