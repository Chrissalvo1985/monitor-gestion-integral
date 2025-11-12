-- Migration: Add target_date column to process_surveys table
-- Date: 2024

ALTER TABLE process_surveys 
ADD COLUMN IF NOT EXISTS target_date DATE;

COMMENT ON COLUMN process_surveys.target_date IS 'Fecha objetivo para completar el levantamiento de procesos';

