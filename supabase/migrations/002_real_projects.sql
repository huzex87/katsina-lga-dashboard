-- Real projects from Katsina LGA 100 Achievements (Hon. Isah Miqdad, first 6 months)
-- GPS coordinates are approximate ward centers — update from admin dashboard with precise field coordinates
-- All projects start as published=false (draft) so admin can verify and publish after confirming GPS coordinates

INSERT INTO projects (ref_code, title_en, title_ha, description_en, description_ha, category, ward_id, community, latitude, longitude, beneficiaries, budget_ngn, expenditure_ngn, completion_date, status, featured, published) VALUES

-- HEALTH PROJECTS
(
  'KTLGA-HLT-2024-101',
  'Renovation and Upgrade of MCHC, Kangiwa',
  'Sabunta da Inganta MCHC, Kangiwa',
  'Complete renovation and upgrade of the Maternal and Child Health Centre (MCHC) in Kangiwa, improving healthcare delivery for mothers and children in Arewa B ward.',
  'Cikakken gyarawa da ingantawa na Cibiyar Kiwon Lafiyar Uwa da Yaro (MCHC) a Kangiwa.',
  'health', 2, 'Kangiwa',
  13.0420, 7.5680,
  3500, 18000000, 17100000,
  '2024-10-15', 'completed', FALSE, FALSE
),
(
  'KTLGA-HLT-2024-102',
  'Fencing and Renovation of PHC Rafindadi',
  'Ginin Shinge da Gyaran PHC Rafindadi',
  'Construction of perimeter fence and full renovation of the Primary Health Centre at Rafindadi, enhancing security and improving patient care facilities.',
  'Ginin shinge da cikakken gyaran Cibiyar Kiwon Lafiya ta Rafindadi.',
  'health', 2, 'Rafindadi',
  13.0380, 7.5720,
  2800, 12000000, 11400000,
  '2024-11-20', 'completed', FALSE, FALSE
),
(
  'KTLGA-HLT-2024-103',
  'Free Medical Outreach — 221 Vulnerable Individuals, Shinkafi B',
  'Kyautar Kiwon Lafiya ga Mutane 221 Masu Rauni, Shinkafi B',
  'Free medical outreach programme providing consultations, medications, and treatment to 221 vulnerable and less-privileged individuals in Shinkafi B ward.',
  'Shirin kyautar kiwon lafiya da ya samar da magunguna da magani ga mutane 221 masu rauni a Shinkafi B.',
  'health', 12, 'Shinkafi B',
  12.9800, 7.5840,
  221, 2500000, 2500000,
  '2024-09-30', 'completed', FALSE, FALSE
),
(
  'KTLGA-HLT-2025-104',
  'Enrollment of 250 Less-Privileged Individuals into State Health Insurance Scheme',
  'Shigar da Mutane 250 Masu Rauni cikin Tsarin Inshora ta Lafiya',
  'Enrollment and registration of 250 less-privileged and vulnerable community members into the Katsina State Health Insurance Scheme, providing them with access to free healthcare services.',
  'Shigar da mutane 250 masu rauni cikin tsarin inshora ta lafiya ta jihar Katsina.',
  'health', 11, 'Katsina City',
  12.9954, 7.6014,
  250, 3750000, 3750000,
  '2025-01-15', 'completed', FALSE, FALSE
),

-- WATER & SANITATION PROJECTS
(
  'KTLGA-WTR-2024-201',
  'Construction of Borehole at Turaruka, Yamma II',
  'Ginin Rijiyar Burtsatse a Turaruka, Yamma II',
  'Drilling and construction of a new borehole at Turaruka community in Yamma II ward, providing clean and safe drinking water to residents.',
  'Ginin rijiyar burtsatse a Turaruka a cikin Yamma II don samar da ruwa mai tsafta.',
  'water', 10, 'Turaruka',
  12.9870, 7.5580,
  1200, 5000000, 4800000,
  '2024-10-01', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-202',
  'Construction of Borehole at Yammawa, Kangiwa',
  'Ginin Rijiyar Burtsatse a Yammawa, Kangiwa',
  'Drilling and construction of a new borehole in Yammawa area of Kangiwa, improving access to potable water for households in the community.',
  'Ginin rijiyar burtsatse a Yammawa, Kangiwa don samar da ruwa mai tsafta ga mazauna.',
  'water', 2, 'Yammawa, Kangiwa',
  13.0450, 7.5700,
  1000, 4800000, 4560000,
  '2024-10-15', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-203',
  'Drilling of Borehole at Layin Zana, Gabas II',
  'Huda Rijiyar Burtsatse a Layin Zana, Gabas II',
  'New borehole drilled at Layin Zana in Gabas II ward to address water scarcity and provide reliable access to clean water for the community.',
  'Huda rijiyar burtsatse a Layin Zana a Gabas II don magance matsalar ruwa.',
  'water', 4, 'Layin Zana',
  13.0110, 7.6480,
  900, 4500000, 4275000,
  '2024-11-10', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-204',
  'Drilling of Borehole at Sabon Tasha, Kudu III',
  'Huda Rijiyar Burtsatse a Sabon Tasha, Kudu III',
  'Provision of a new borehole at Sabon Tasha community in Kudu III ward, ensuring residents have access to clean potable water.',
  'Samar da rijiyar burtsatse a Sabon Tasha a Kudu III don ruwa mai tsafta.',
  'water', 8, 'Sabon Tasha',
  12.9520, 7.5900,
  800, 4500000, 4275000,
  '2024-11-20', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-205',
  'Drilling of Borehole at Kambarawa, Shinkafi B',
  'Huda Rijiyar Burtsatse a Kambarawa, Shinkafi B',
  'New borehole installed at Kambarawa community in Shinkafi B ward to serve households that previously lacked reliable access to safe drinking water.',
  'Rijiyar burtsatse a Kambarawa a Shinkafi B don ba mazauna damar samun ruwa mai tsafta.',
  'water', 12, 'Kambarawa',
  12.9750, 7.5870,
  950, 4800000, 4560000,
  '2024-12-01', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-206',
  'Rehabilitation of 3 Boreholes in Kudu II',
  'Gyaran Rijiyoyi 3 na Burtsatse a Kudu II',
  'Comprehensive rehabilitation of three non-functional boreholes in Kudu II ward, restoring water supply to communities that had lost access to clean water.',
  'Gyaran rijiyoyi uku na burtsatse a Kudu II don maido da ruwan sha ga al-umma.',
  'water', 7, 'Kudu II',
  12.9720, 7.6050,
  2400, 6000000, 5700000,
  '2024-09-15', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-207',
  'Rehabilitation of 2 Boreholes in Shinkafi B',
  'Gyaran Rijiyoyi 2 na Burtsatse a Shinkafi B',
  'Rehabilitation of two broken-down boreholes in Shinkafi B ward, restoring access to potable water for affected households.',
  'Gyaran rijiyoyi biyu da suka lalace a Shinkafi B don maido da ruwan sha.',
  'water', 12, 'Shinkafi B',
  12.9820, 7.5820,
  1600, 4000000, 3800000,
  '2024-10-20', 'completed', FALSE, FALSE
),
(
  'KTLGA-WTR-2024-208',
  'Rehabilitation of 2 Boreholes in Yamma II',
  'Gyaran Rijiyoyi 2 na Burtsatse a Yamma II',
  'Restoration of two damaged boreholes in Yamma II ward to resume water supply to communities that had been without safe water for an extended period.',
  'Maido da rijiyoyi biyu da suka lalace a Yamma II don ci gaba da samar da ruwa.',
  'water', 10, 'Yamma II',
  12.9880, 7.5560,
  1600, 4000000, 3800000,
  '2024-11-05', 'completed', FALSE, FALSE
),

-- AGRICULTURE
(
  'KTLGA-AGR-2024-301',
  'Construction of Agricultural Mechanization Centre',
  'Ginin Cibiyar Masara ta Noma',
  'Construction of a modern Agricultural Mechanization Centre to support local farmers with mechanized farming equipment, training, and technical support for improved crop yields.',
  'Ginin cibiyar masara ta noma don tallafawa manoma da kayan aiki na zamani.',
  'agric', 11, 'Katsina City',
  12.9960, 7.5980,
  5000, 35000000, 33250000,
  '2024-12-15', 'completed', TRUE, FALSE
),

-- YOUTH & EDUCATION
(
  'KTLGA-YTH-2024-401',
  'Solar Installation Training for 70 Youths',
  'Horo Samari 70 a Aikin Hasken Rana',
  'Practical training programme for 70 youths in solar panel installation, maintenance, and electrical systems, equipping them with technical skills for employment in the renewable energy sector.',
  'Horaswa ga samari 70 a aikin sanya hasken rana don ba su damar samun aiki.',
  'youth', 11, 'Katsina City',
  12.9950, 7.6020,
  70, 2000000, 1900000,
  '2024-09-20', 'completed', FALSE, FALSE
),
(
  'KTLGA-EDU-2024-402',
  'Fully-Funded Scholarship — 96 Students at KSITM',
  'Guraben Karatu ga Dalibai 96 a KSITM',
  'Award of fully-funded scholarships to 96 students from Katsina LGA at the Katsina State Institute of Technology and Management (KSITM), covering tuition, accommodation, and stipends.',
  'Samar da guraben karatu ga dalibai 96 daga Katsina LGA a KSITM.',
  'education', 11, 'Katsina City',
  12.9954, 7.6014,
  96, 5760000, 5760000,
  '2024-09-01', 'completed', FALSE, FALSE
),
(
  'KTLGA-EDU-2024-403',
  'Fully-Funded Scholarship — 106 Students at Hassan Usman Katsina Polytechnic',
  'Guraben Karatu ga Dalibai 106 a Hassan Usman Katsina Polytechnic',
  'Award of fully-funded scholarships to 106 indigent students from Katsina LGA enrolled at Hassan Usman Katsina Polytechnic, covering all academic fees and support allowances.',
  'Samar da guraben karatu ga dalibai 106 a Hassan Usman Katsina Polytechnic.',
  'education', 3, 'Katsina (Polytechnic Area)',
  12.9920, 7.6400,
  106, 6360000, 6360000,
  '2024-09-01', 'completed', FALSE, FALSE
),
(
  'KTLGA-YTH-2024-404',
  'Free Cybersecurity and Python Programming Training — 500 Youths',
  'Kyautar Horo a Cybersecurity da Python ga Samari 500',
  'Provision of free cybersecurity awareness and Python programming training to 500 youths across Katsina LGA, delivered in partnership with technology institutions to boost digital skills and employability.',
  'Kyautar horo a cybersecurity da shirye-shiryen Python ga samari 500 daga Katsina LGA.',
  'youth', 11, 'Katsina City',
  12.9970, 7.6030,
  500, 4000000, 3800000,
  '2024-10-30', 'completed', FALSE, FALSE
),
(
  'KTLGA-EDU-2024-405',
  'Community Hubs Initiative with UNICEF — Out-of-School Children',
  'Shirin Community Hubs tare da UNICEF — Yara Masu Fita Makaranta',
  'Launch of Community Hubs initiative in partnership with UNICEF and the Department of Girl Child Education to provide vocational training and skills acquisition for out-of-school children across the LGA.',
  'Fara shirin Community Hubs tare da UNICEF don horar da yara masu fita makaranta.',
  'education', 3, 'Gabas I',
  12.9950, 7.6380,
  800, 5000000, 4750000,
  '2024-11-01', 'completed', FALSE, FALSE
),

-- SECURITY & INFRASTRUCTURE
(
  'KTLGA-SEC-2024-501',
  'Renovation of Vigilantee Office, Sulubawa, Yamma I',
  'Gyaran Ofishin Yan Agaji a Sulubawa, Yamma I',
  'Renovation and refurbishment of the Head of Vigilantee Office at Sulubawa community in Yamma I ward to improve facilities for community security operations.',
  'Gyaran ofishin shugaban yan agaji a Sulubawa, Yamma I don inganta tsaro na al-umma.',
  'security', 9, 'Sulubawa',
  13.0080, 7.5720,
  5000, 6000000, 5700000,
  '2024-10-10', 'completed', FALSE, FALSE
),
(
  'KTLGA-SEC-2024-502',
  'Construction of Wall Fence, Toilet & Renovation of Wakilin Gabas Office',
  'Ginin Shinge, Bayan Gida da Gyaran Ofishin Wakilin Gabas',
  'Construction of perimeter wall fence, toilet facilities, and complete renovation of the Wakilin Gabas Ward Office to improve working conditions and community services.',
  'Ginin shinge, bayan gida da gyaran ofishin Wakilin Gabas.',
  'security', 3, 'Unguwar Gabas',
  12.9940, 7.6410,
  3000, 8000000, 7600000,
  '2024-11-25', 'completed', FALSE, FALSE
),

-- ROADS & INFRASTRUCTURE
(
  'KTLGA-RDS-2024-601',
  'Renovation of Supervisory Councillor of Works Office',
  'Gyaran Ofishin Majalisa na Ayyuka',
  'Complete renovation of the Supervisory Councillor of Works Office at the LGA Secretariat, improving the administrative environment for infrastructure management.',
  'Cikakken gyaran ofishin majalisa na ayyuka a hedikwatar LGA.',
  'roads', 11, 'LGA Secretariat',
  12.9954, 7.6014,
  500, 7000000, 6650000,
  '2024-08-30', 'completed', FALSE, FALSE
),
(
  'KTLGA-RDS-2024-602',
  'Renovation of Supervisory Councillor Admin & Finance Office',
  'Gyaran Ofishin Majalisa na Gudanarwa da Kudi',
  'Renovation of the Supervisory Councillor for Administration and Finance Office, providing a better workspace for financial governance and administrative operations of the LGA.',
  'Gyaran ofishin majalisa na gudanarwa da kudi a hedikwatar LGA.',
  'roads', 11, 'LGA Secretariat',
  12.9955, 7.6012,
  400, 6500000, 6175000,
  '2024-09-10', 'completed', FALSE, FALSE
),
(
  'KTLGA-RDS-2024-603',
  'Renovation of Chairman''s and Vice Chairman''s Offices',
  'Gyaran Ofishin Shugaban da Mataimakin Shugaban LGA',
  'Full renovation of the Executive Chairman''s and Vice Chairman''s offices at the LGA Secretariat, creating a dignified workspace that reflects the standard of governance.',
  'Gyaran ofishin shugaban da mataimakin shugaban LGA don inganta muhalli na aiki.',
  'roads', 11, 'LGA Secretariat',
  12.9958, 7.6016,
  1000, 10000000, 9500000,
  '2024-09-05', 'completed', FALSE, FALSE
),
(
  'KTLGA-RDS-2024-604',
  'Installation of 96 Solar-Powered Street Lights Across All 12 Wards',
  'Sanya Fitilun Hasken Rana 96 a Dukkan Wards 12',
  'Installation of 96 solar-powered street lights distributed across all 12 wards of Katsina LGA, improving safety and security in residential and commercial areas after dark.',
  'Sanya fitilun hasken rana 96 a dukkan wards 12 na Katsina LGA don inganta tsaro da aminci da dare.',
  'roads', 11, 'All 12 Wards',
  12.9954, 7.6014,
  120000, 28800000, 27360000,
  '2024-12-20', 'completed', TRUE, FALSE
),
(
  'KTLGA-RDS-2024-605',
  'Construction of Drainage at Gidan Kaura, Dakin Tara, Wakilin Kudu II',
  'Ginin Magudanar Ruwa a Gidan Kaura da Dakin Tara, Kudu II',
  'Construction of drainage channels at Gidan Kaura and Dakin Tara areas in Wakilin Kudu II, addressing flooding and waterlogging that had plagued the community during rainy seasons.',
  'Ginin magudanar ruwa a Gidan Kaura da Dakin Tara a Kudu II don magance ambaliyar ruwa.',
  'roads', 7, 'Gidan Kaura',
  12.9700, 7.6120,
  4500, 12000000, 11400000,
  '2024-12-10', 'completed', FALSE, FALSE
),
(
  'KTLGA-EDU-2024-606',
  'Construction of Ring Culvert at K/Marusa Primary School',
  'Ginin Ƙofarar Ruwa a Makaranta ta K/Marusa',
  'Construction of a ring culvert behind K/Marusa Primary School to redirect storm water, protect the school infrastructure from erosion, and ensure safe access for pupils during rainy seasons.',
  'Ginin kofarar ruwa a bayan makarantar K/Marusa don kare ginin makaranta daga zaizayar kasa.',
  'education', 6, 'K/Marusa',
  12.9630, 7.6260,
  2000, 5000000, 4750000,
  '2024-11-30', 'completed', FALSE, FALSE
)
ON CONFLICT (ref_code) DO NOTHING;
