import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  let query = supabase
    .from('projects')
    .select('*, ward:wards(id, name, name_ha)');
  if (!user) query = query.eq('published', true);

  const category = searchParams.get('category');
  if (category && category !== 'all') {
    query = query.in('category', category.split(','));
  }

  const year = searchParams.get('year');
  if (year && year !== 'all') {
    query = query
      .gte('completion_date', `${year}-01-01`)
      .lte('completion_date', `${year}-12-31`);
  }

  const ward = searchParams.get('ward');
  if (ward) {
    query = query.eq('ward_id', parseInt(ward));
  }

  const { data, error } = await query
    .order('completion_date', { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], {
    headers: {
      'Cache-Control': 'public, s-maxage=0, must-revalidate',
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { ward_id, ...rest } = body;

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...rest,
      ward_id: ward_id ? parseInt(ward_id) : null,
      ref_code: generateRefCode(body.category),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  revalidatePath('/');
  revalidatePath('/admin/projects');
  return NextResponse.json(data, { status: 201 });
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
