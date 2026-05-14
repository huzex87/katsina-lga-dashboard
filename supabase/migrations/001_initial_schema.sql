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

-- Seed the 12 wards
INSERT INTO wards (id, name, name_ha) VALUES
  (1, 'Ward 1', 'Ungwa ta 1'),
  (2, 'Ward 2', 'Ungwa ta 2'),
  (3, 'Ward 3', 'Ungwa ta 3'),
  (4, 'Ward 4', 'Ungwa ta 4'),
  (5, 'Ward 5', 'Ungwa ta 5'),
  (6, 'Ward 6', 'Ungwa ta 6'),
  (7, 'Ward 7', 'Ungwa ta 7'),
  (8, 'Ward 8', 'Ungwa ta 8'),
  (9, 'Ward 9', 'Ungwa ta 9'),
  (10, 'Ward 10', 'Ungwa ta 10'),
  (11, 'Ward 11', 'Ungwa ta 11'),
  (12, 'Ward 12', 'Ungwa ta 12')
ON CONFLICT (id) DO NOTHING;

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

-- Seed demo projects
INSERT INTO projects (ref_code, title_en, title_ha, description_en, category, ward_id, community, latitude, longitude, beneficiaries, budget_ngn, expenditure_ngn, completion_date, status, published) VALUES
(
  'KTLGA-RDS-2024-001',
  'Katsina Central Road Rehabilitation',
  'Gyaran Hanya ta Tsakiyar Katsina',
  'Complete rehabilitation of 5km central road with new drainage system, street lighting, and pedestrian walkways.',
  'roads', 1, 'Katsina City Centre',
  12.9954, 7.6014,
  15000, 2500000000, 2350000000,
  '2024-06-15', 'completed', TRUE
),
(
  'KTLGA-WTR-2024-002',
  'Community Borehole & Water Supply — Dutsin-Ma',
  'Rijiyar Burtsatse da Samar da Ruwa',
  'Construction of solar-powered borehole with distribution network serving 3,500 residents.',
  'water', 2, 'Dutsin-Ma',
  13.0154, 7.6214,
  3500, 800000000, 780000000,
  '2024-03-20', 'completed', TRUE
),
(
  'KTLGA-HLT-2023-003',
  'Primary Health Centre Renovation — Mashi Ward',
  'Sabunta Cibiyar Lafiya',
  'Full renovation and equipment upgrade including maternity ward, pharmacy, and consultation rooms.',
  'health', 3, 'Mashi',
  12.9754, 7.5814,
  8200, 1200000000, 1190000000,
  '2023-11-30', 'completed', TRUE
),
(
  'KTLGA-EDU-2023-004',
  'New Classroom Blocks — Government Secondary School Kaita',
  'Sabbin Dakunan Karatu',
  '6 new classroom blocks with modern furniture, toilets, and a computer lab for 1,200 students.',
  'education', 4, 'Kaita',
  13.0354, 7.6414,
  1200, 1500000000, 1450000000,
  '2023-09-01', 'completed', TRUE
),
(
  'KTLGA-AGR-2024-005',
  'Farmers Support & Input Distribution Program',
  'Taimakon Manoma da Rarraba Kayan Aikin Noma',
  'Distribution of improved seeds, fertilizers, and farming tools to 2,500 registered smallholder farmers.',
  'agric', 5, 'Rimi',
  12.9554, 7.5614,
  2500, 600000000, 590000000,
  '2024-01-15', 'completed', TRUE
),
(
  'KTLGA-YTH-2024-006',
  'Multi-Purpose Youth Sports Complex',
  'Filin Wasanni na Matasa',
  'Modern sports complex with standard football pitch, basketball courts, indoor gym, and changing rooms.',
  'youth', 6, 'Kusada',
  13.0554, 7.6614,
  5000, 2000000000, 1950000000,
  '2024-08-20', 'completed', TRUE
),
(
  'KTLGA-SEC-2023-005',
  'Community Security Post Construction',
  'Gina Ofishin Tsaro na Al''umma',
  'Construction of 4 community security outposts with communication equipment and staff quarters.',
  'security', 7, 'Batagarawa',
  13.0054, 7.5414,
  12000, 450000000, 430000000,
  '2023-07-10', 'completed', TRUE
),
(
  'KTLGA-RDS-2023-006',
  'Rural Feeder Road Construction — Ingawa',
  'Gina Hanyar Kauye ta Ingawa',
  'Construction of 8km feeder road connecting rural farming communities to the main market.',
  'roads', 8, 'Ingawa',
  12.9254, 7.5214,
  6500, 1800000000, 1750000000,
  '2023-05-22', 'completed', TRUE
);
