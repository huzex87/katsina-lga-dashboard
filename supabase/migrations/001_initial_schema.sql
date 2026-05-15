-- Enable PostGIS for geospatial support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Wards table
CREATE TABLE IF NOT EXISTS wards (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ha TEXT,
  geojson JSONB,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the 12 official wards (IDs match katsina-wards.geojson feature IDs)
INSERT INTO wards (id, name, name_ha) VALUES
  (1,  'Arewa A',    'Arewa A'),
  (2,  'Arewa B',    'Arewa B'),
  (3,  'Gabas I',    'Gabas I'),
  (4,  'Gabas II',   'Gabas II'),
  (5,  'Gabas III',  'Gabas III'),
  (6,  'Kudu I',     'Kudu I'),
  (7,  'Kudu II',    'Kudu II'),
  (8,  'Kudu III',   'Kudu III'),
  (9,  'Yamma I',    'Yamma I'),
  (10, 'Yamma II',   'Yamma II'),
  (11, 'Shinkafi A', 'Shinkafi A'),
  (12, 'Shinkafi B', 'Shinkafi B')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, name_ha = EXCLUDED.name_ha;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref_code TEXT UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_ha TEXT,
  description_en TEXT,
  description_ha TEXT,
  category TEXT NOT NULL CHECK (category IN ('roads','water','health','education','agric','youth','security')),
  ward_id INTEGER REFERENCES wards(id),
  community TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  beneficiaries INTEGER NOT NULL DEFAULT 0,
  budget_ngn BIGINT NOT NULL DEFAULT 0,
  expenditure_ngn BIGINT NOT NULL DEFAULT 0,
  completion_date DATE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('planning','ongoing','completed')),
  contractor TEXT,
  images TEXT[] DEFAULT '{}',
  before_images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Spatial index
CREATE INDEX IF NOT EXISTS idx_projects_location ON projects USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_ward ON projects (ward_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects (published);
CREATE INDEX IF NOT EXISTS idx_projects_completion_date ON projects (completion_date);

-- Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;

-- Public read published projects only
CREATE POLICY "public_read_published"
  ON projects FOR SELECT TO anon
  USING (published = TRUE);

-- Admin full access
CREATE POLICY "admin_read_all"
  ON projects FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "admin_write"
  ON projects FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- Wards: public read, admin write
CREATE POLICY "public_read_wards" ON wards FOR SELECT TO anon USING (TRUE);
CREATE POLICY "admin_write_wards" ON wards FOR ALL TO authenticated USING (TRUE);

-- Seed demo projects (budget_ngn stored in Naira, NOT kobo)
INSERT INTO projects (ref_code, title_en, title_ha, description_en, category, ward_id, community, latitude, longitude, beneficiaries, budget_ngn, expenditure_ngn, completion_date, status, featured, published) VALUES
(
  'KTLGA-RDS-2025-001',
  'Nagogo Road Rehabilitation & Drainage Upgrade',
  'Gyaran Hanyar Nagogo da Tsabtace Rafin Ruwa',
  'Full rehabilitation of 6.5km Nagogo Road including road widening, drainage channels, streetlighting, and pedestrian walkways along the LGA Secretariat corridor.',
  'roads', 11, 'Katsina City Centre',
  12.9954, 7.6014,
  18000, 32000000000, 30400000000,
  '2025-03-15', 'completed', TRUE, TRUE
),
(
  'KTLGA-WTR-2025-002',
  'Solar-Powered Borehole & Water Distribution Network',
  'Rijiyar Burtsatse da Samar da Ruwa ta Hasken Rana',
  'Solar-powered borehole with 50,000-litre overhead tank serving 5 communities in Arewa A ward through a reticulated pipe network.',
  'water', 1, 'Unguwar Rimi',
  13.0320, 7.5980,
  5200, 9500000000, 9200000000,
  '2025-01-20', 'completed', FALSE, TRUE
),
(
  'KTLGA-HLT-2024-003',
  'Gabas Primary Health Centre Renovation & Equipment',
  'Sabunta Cibiyar Lafiya ta Gabas da Kayan Aiki',
  'Complete renovation of the Gabas PHC with new maternity ward, laboratory equipment, solar power system, and medical waste disposal facility.',
  'health', 3, 'Unguwar Gabas',
  12.9900, 7.6450,
  9500, 14000000000, 13800000000,
  '2024-11-30', 'completed', TRUE, TRUE
),
(
  'KTLGA-EDU-2024-004',
  'Government Secondary School — 8 New Classroom Blocks',
  NULL,
  '8 new classroom blocks with ICT laboratory, library, sanitation facilities, and perimeter fence at Government Secondary School, Kudu ward.',
  'education', 6, 'Unguwar Kudu',
  12.9680, 7.6120,
  2400, 18000000000, 17200000000,
  '2024-09-01', 'completed', FALSE, TRUE
),
(
  'KTLGA-AGR-2025-005',
  'Farmers Input & Irrigation Support Programme',
  'Shirin Tallafin Manoma da Ban Ruwa',
  'Distribution of high-yield seeds, fertilisers, herbicides, and drip irrigation kits to 3,800 registered smallholder farmers across Yamma ward.',
  'agric', 9, 'Unguwar Yamma',
  13.0020, 7.5720,
  3800, 7500000000, 7100000000,
  '2025-02-15', 'completed', FALSE, TRUE
),
(
  'KTLGA-YTH-2025-006',
  'Shinkafi Youth Multi-Purpose Sports & Skills Complex',
  'Cibiyar Wasanni da Sana''a ta Samari ta Shinkafi',
  'Modern sports complex with football pitch, basketball court, gymnasium, digital skills hub, and vocational training centre serving youth across Shinkafi ward.',
  'youth', 12, 'Shinkafi',
  13.0060, 7.6180,
  6500, 22000000000, 21500000000,
  '2025-04-10', 'completed', TRUE, TRUE
),
(
  'KTLGA-RDS-2025-007',
  'Arewa Intra-Ward Road Network Paving',
  NULL,
  'Interlocking paving of 12 streets within Arewa B ward improving all-season access and reducing flood damage to properties.',
  'roads', 2, 'Unguwar Arewa',
  13.0420, 7.6130,
  7200, 11000000000, 10500000000,
  '2025-03-28', 'completed', FALSE, TRUE
),
(
  'KTLGA-WTR-2024-008',
  'Kudu Ward Sanitation & Public Toilet Facilities',
  NULL,
  'Construction of 6 modern public toilet and handwashing stations across Kudu II ward markets and public spaces, serving over 4,000 daily users.',
  'water', 7, 'Kudu Market Area',
  12.9720, 7.6250,
  4100, 5500000000, 5300000000,
  '2024-12-15', 'completed', FALSE, TRUE
);
