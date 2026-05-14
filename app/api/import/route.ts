import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface CSVRow {
  title_en?: string;
  title_ha?: string;
  category?: string;
  ward_id?: string;
  community?: string;
  latitude?: string;
  longitude?: string;
  beneficiaries?: string;
  budget_ngn?: string;
  expenditure_ngn?: string;
  completion_date?: string;
  contractor?: string;
  description_en?: string;
  description_ha?: string;
  status?: string;
}

function parseCSV(csv: string): CSVRow[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as CSVRow;
  });
}

function generateRefCode(category: string): string {
  const cats: Record<string, string> = {
    roads: 'RDS', water: 'WTR', health: 'HLT', education: 'EDU',
    agric: 'AGR', youth: 'YTH', security: 'SEC',
  };
  const prefix = cats[category] ?? 'GEN';
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  return `KTLGA-${prefix}-${year}-${num}`;
}

export async function POST(request: NextRequest) {
  const { csv } = await request.json();

  if (!csv || typeof csv !== 'string') {
    return NextResponse.json({ error: 'CSV content required' }, { status: 400 });
  }

  const rows = parseCSV(csv);
  if (rows.length === 0) {
    return NextResponse.json({ error: 'No valid rows found in CSV' }, { status: 400 });
  }

  const supabase = await createClient();
  const projects = rows
    .filter((r) => r.title_en && r.category && r.community)
    .map((r) => ({
      ref_code: generateRefCode(r.category ?? 'roads'),
      title_en: r.title_en!,
      title_ha: r.title_ha || null,
      category: r.category!,
      ward_id: r.ward_id ? parseInt(r.ward_id) : null,
      community: r.community!,
      latitude: parseFloat(r.latitude ?? '12.9954'),
      longitude: parseFloat(r.longitude ?? '7.6014'),
      beneficiaries: parseInt(r.beneficiaries ?? '0'),
      budget_ngn: Math.round(parseFloat(r.budget_ngn ?? '0') * 100),
      expenditure_ngn: Math.round(parseFloat(r.expenditure_ngn ?? '0') * 100),
      completion_date: r.completion_date || null,
      contractor: r.contractor || null,
      description_en: r.description_en || null,
      description_ha: r.description_ha || null,
      status: r.status || 'completed',
      published: true,
    }));

  if (projects.length === 0) {
    return NextResponse.json({ error: 'No valid projects found. Ensure title_en, category, and community columns exist.' }, { status: 400 });
  }

  const { data, error } = await supabase.from('projects').insert(projects).select('id');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ count: data?.length ?? 0, message: 'Import successful' });
}
