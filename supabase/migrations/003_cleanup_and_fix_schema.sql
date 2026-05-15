-- Migration 003: Remove demo/placeholder projects and fix schema
-- Run in Supabase SQL editor

-- 1. Delete the 8 original demo projects (ref codes 001–008)
--    These were placeholder data; only real LGA projects should remain.
DELETE FROM projects
WHERE ref_code IN (
  'KTLGA-RDS-2025-001',
  'KTLGA-WTR-2025-002',
  'KTLGA-HLT-2024-003',
  'KTLGA-EDU-2024-004',
  'KTLGA-AGR-2025-005',
  'KTLGA-YTH-2025-006',
  'KTLGA-RDS-2025-007',
  'KTLGA-WTR-2024-008'
);

-- 2. Convert completion_date from TEXT to DATE
--    Existing values are already ISO-8601 (YYYY-MM-DD) so the cast is safe.
--    NULL values are preserved.
ALTER TABLE projects
  ALTER COLUMN completion_date TYPE DATE
  USING CASE
    WHEN completion_date IS NULL OR completion_date = '' THEN NULL
    ELSE completion_date::DATE
  END;

-- Verify
-- SELECT ref_code, completion_date, pg_typeof(completion_date) FROM projects LIMIT 5;
