
export enum Gerencia {
  Rbravo = 'Rbravo',
  Candrews = 'Candrews',
}

export enum TechPlatformCode {
  ECRMOVIL = 'ECRMOVIL',
  NSS = 'NSS',
  SINEX = 'SINEX',
  PORTAL_CLIENTE = 'PORTAL_CLIENTE',
  PANEL_SUPERVISORES = 'PANEL_SUPERVISORES',
  WF_SELECCION = 'WF_SELECCION',
}

export enum ImplementationStatus {
  NO_INICIADO = 'NO_INICIADO',
  PLANIFICADO = 'PLANIFICADO',
  EN_PROGRESO = 'EN_PROGRESO',
  IMPLEMENTADO = 'IMPLEMENTADO',
  BLOQUEADO = 'BLOQUEADO',
  DEPRECATED = 'DEPRECATED',
}

export enum ProcessSurveyStatus {
    NO_INICIADO = 'NO_INICIADO',
    EN_LEVANTAMIENTO = 'EN_LEVANTAMIENTO',
    EN_VALIDACION = 'EN_VALIDACION',
    DOCUMENTADO = 'DOCUMENTADO',
    IMPLEMENTADO = 'IMPLEMENTADO',
}

export enum RiskLevel {
  BAJO = 'BAJO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
}

export enum ProcessAreaCode {
  COMERCIAL = 'COMERCIAL',
  RYS = 'RYS',
  RELACIONES_LABORALES = 'RELACIONES_LABORALES',
  FACTURACION = 'FACTURACION',
  MGI = 'MGI',
}

export enum LabEventType {
  WORKSHOP = 'WORKSHOP',
  CAPACITACION = 'CAPACITACION',
  PILOTO = 'PILOTO',
  DEMO = 'DEMO',
  RETRO = 'RETRO',
}

export enum AlertEntityType {
  TECH = 'TECH',
  BI = 'BI',
  PROCESS = 'PROCESS',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARN = 'WARN',
  CRIT = 'CRIT',
}

export interface User {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  gerencia: Gerencia;
  owner_user_id: string;
  health_score: number;
  headcount: number;
  notes?: string;
}

export interface TechPlatform {
  id: string;
  code: string;
  display_name: string;
  doc_url?: string;
}

export interface TechImplementation {
  id: string;
  client_id: string;
  platform_id: string;
  status: ImplementationStatus;
  progress_pct: number;
  owner_user_id: string;
  start_date?: string;
  target_date?: string;
  implemented_at?: string;
  last_update: string;
  risk_level: RiskLevel;
  notes?: string;
  evidence_url?: string;
}

export interface BiPanel {
    id: string;
    code: string;
    name: string;
    short_desc: string;
    embed_url: string;
    area?: string;
}

export interface BiClientPanel {
    id: string;
    client_id: string;
    panel_id: string;
    status: ImplementationStatus;
    progress_pct: number;
    owner_user_id: string;
    target_date?: string;
    implemented_at?: string;
    last_update: string;
    notes?: string;
}

export interface ProcessArea {
    id: string;
    code: ProcessAreaCode;
    display_name: string;
}

export interface ProcessSurvey {
    id: string;
    area_id: string;
    status: ProcessSurveyStatus;
    mapeo_proceso_pct: number;
    procedimientos_pct: number;
    controles_pct: number;
    evidencias_pct: number;
    owner_user_id: string;
    last_update: string;
    notes?: string;
    attachments_url?: string;
}

export interface LabEvent {
    id: string;
    date: string;
    client_id?: string;
    topic: string;
    type: LabEventType;
    owner_user_id: string;
    outcomes: string;
    recording_url?: string;
    materials_url?: string;
}

export interface Alert {
    id: string;
    entity_type: AlertEntityType;
    client_id: string;
    reference_id: string;
    severity: AlertSeverity;
    rule_code: string;
    message: string;
    created_at: string;
    ack_by_user_id?: string;
    ack_at?: string;
    resolved_at?: string;
}

export interface ClientExperience {
  id: string;
  client_id: string;
  nps_score: number;
  last_survey_date: string;
  notes?: string;
}

export interface CollaboratorExperiencePlan {
  id: string;
  client_id: string;
  area_id: string;
  plan_name: string;
  status: ImplementationStatus;
  progress_pct: number;
  owner_user_id: string;
  target_date?: string;
  last_update: string;
  description?: string;
}

export interface TechUsability {
  id: string;
  client_id: string;
  platform_id: string;
  usage_count: number;
  usage_pct: number;
  last_update: string;
}

export type ViewType = 'dashboard' | 'tech' | 'bi' | 'process' | 'lab' | 'experience' | 'usability';