import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateCertificate } from '@/lib/certificate/generator';

export async function POST(request: NextRequest) {
  const { projectId } = await request.json();

  if (!projectId) {
    return NextResponse.json({ error: 'projectId required' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: project, error } = await supabase
    .from('projects')
    .select('*, ward:wards(*)')
    .eq('id', projectId)
    .single();

  if (error || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  try {
    const pdfBytes = await generateCertificate(project as any);

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="KTLGA_${project.ref_code}_${new Date().getFullYear()}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Certificate generation error:', err);
    return NextResponse.json({ error: 'Certificate generation failed' }, { status: 500 });
  }
}
