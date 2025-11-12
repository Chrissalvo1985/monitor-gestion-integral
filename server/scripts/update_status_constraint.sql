-- Migration: Update process_surveys status constraint to include PLANIFICADO
-- Date: 2024

-- Eliminar constraint existente
ALTER TABLE process_surveys 
DROP CONSTRAINT IF EXISTS process_surveys_status_check;

-- Crear nueva constraint con PLANIFICADO incluido
ALTER TABLE process_surveys 
ADD CONSTRAINT process_surveys_status_check 
CHECK (status IN ('NO_INICIADO', 'PLANIFICADO', 'EN_LEVANTAMIENTO', 'EN_VALIDACION', 'DOCUMENTADO', 'IMPLEMENTADO'));

COMMENT ON CONSTRAINT process_surveys_status_check ON process_surveys IS 'Valores permitidos para el estado del levantamiento de procesos';

