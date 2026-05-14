import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import type { Project } from '@/types/project';
import { formatNairaFull, formatCoords, formatDate } from '@/lib/utils';

const TEAL = rgb(0.114, 0.608, 0.541);
const NAVY = rgb(0.039, 0.086, 0.157);
const GOLD = rgb(0.753, 0.502, 0.063);
const WHITE = rgb(1, 1, 1);
const LIGHT_GREY = rgb(0.95, 0.95, 0.96);

export async function generateCertificate(project: Project): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([841.89, 595.28]); // A4 landscape
  const { width, height } = page.getSize();

  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);
  const italicFont = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Header band
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 96, width, height: 6, color: TEAL });

  // LGA title in header
  page.drawText('KATSINA LOCAL GOVERNMENT AREA', {
    x: 40, y: height - 40, size: 18, font: boldFont, color: WHITE,
  });
  page.drawText('OFFICE OF THE EXECUTIVE CHAIRMAN', {
    x: 40, y: height - 62, size: 11, font: regularFont, color: rgb(0.6, 0.9, 0.85),
  });

  // Certificate ref in header (right side)
  page.drawText(`Cert. No: ${project.ref_code}`, {
    x: width - 200, y: height - 40, size: 9, font: regularFont, color: rgb(0.7, 0.7, 0.7),
  });
  page.drawText(new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }), {
    x: width - 200, y: height - 56, size: 9, font: regularFont, color: rgb(0.7, 0.7, 0.7),
  });

  // Gold accent line
  page.drawRectangle({ x: 40, y: height - 120, width: width - 80, height: 1.5, color: GOLD });

  // Certificate title
  const titleText = 'CERTIFICATE OF PROJECT COMPLETION';
  const titleWidth = boldFont.widthOfTextAtSize(titleText, 20);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2, y: height - 148, size: 20, font: boldFont, color: NAVY,
  });

  // Subtitle
  const subText = 'This certifies that the following development project has been successfully completed';
  const subWidth = italicFont.widthOfTextAtSize(subText, 10);
  page.drawText(subText, {
    x: (width - subWidth) / 2, y: height - 168, size: 10, font: italicFont, color: rgb(0.4, 0.4, 0.4),
  });

  // Gold line
  page.drawRectangle({ x: 40, y: height - 178, width: width - 80, height: 1, color: GOLD });

  // Fields
  const fields: [string, string][] = [
    ['Project Title:', project.title_en],
    ['Hausa Title:', project.title_ha ?? 'N/A'],
    ['Category:', project.category.toUpperCase()],
    ['Ward:', project.ward.name],
    ['Community:', project.community],
    ['GPS Coordinates:', formatCoords(project.latitude, project.longitude)],
    ['Beneficiaries:', `${project.beneficiaries.toLocaleString()} people`],
    ['Budget Allocated:', formatNairaFull(project.budget_ngn)],
    ['Expenditure:', formatNairaFull(project.expenditure_ngn)],
    ['Commissioning Date:', formatDate(project.completion_date)],
    ['Contractor:', project.contractor ?? 'N/A'],
    ['Certificate No.:', project.ref_code],
  ];

  const colLeft = 60;
  const colRight = 280;
  const col2Left = width / 2 + 20;
  const col2Right = width / 2 + 160;
  let yLeft = height - 206;
  let yRight = height - 206;
  const lineHeight = 26;

  const half = Math.ceil(fields.length / 2);
  const leftFields = fields.slice(0, half);
  const rightFields = fields.slice(half);

  // Left column fields
  leftFields.forEach(([label, value]) => {
    page.drawText(label, { x: colLeft, y: yLeft, size: 9, font: boldFont, color: TEAL });
    const displayValue = value.length > 38 ? value.substring(0, 35) + '...' : value;
    page.drawText(displayValue, { x: colRight, y: yLeft, size: 9, font: regularFont, color: NAVY });
    yLeft -= lineHeight;
  });

  // Right column fields
  rightFields.forEach(([label, value]) => {
    page.drawText(label, { x: col2Left, y: yRight, size: 9, font: boldFont, color: TEAL });
    const displayValue = value.length > 38 ? value.substring(0, 35) + '...' : value;
    page.drawText(displayValue, { x: col2Right, y: yRight, size: 9, font: regularFont, color: NAVY });
    yRight -= lineHeight;
  });

  // Description box
  if (project.description_en) {
    const descY = Math.min(yLeft, yRight) - 10;
    page.drawRectangle({ x: 40, y: descY - 40, width: width - 80, height: 44, color: LIGHT_GREY });
    page.drawText('Project Description:', { x: 52, y: descY - 10, size: 8, font: boldFont, color: TEAL });
    const desc = project.description_en.length > 180 ? project.description_en.substring(0, 177) + '...' : project.description_en;
    page.drawText(desc, { x: 52, y: descY - 24, size: 8, font: regularFont, color: NAVY });
  }

  // Signature section
  const sigY = 80;
  page.drawRectangle({ x: 40, y: sigY - 5, width: width - 80, height: 1, color: rgb(0.8, 0.8, 0.8) });

  // Signature lines
  page.drawLine({ start: { x: 60, y: sigY + 30 }, end: { x: 220, y: sigY + 30 }, thickness: 1, color: NAVY });
  page.drawText('Executive Chairman', { x: 80, y: sigY + 15, size: 9, font: boldFont, color: NAVY });
  page.drawText('Katsina Local Government Area', { x: 62, y: sigY + 4, size: 8, font: regularFont, color: rgb(0.4,0.4,0.4) });

  page.drawLine({ start: { x: width/2 - 80, y: sigY + 30 }, end: { x: width/2 + 80, y: sigY + 30 }, thickness: 1, color: NAVY });
  page.drawText('Director of Works', { x: width/2 - 55, y: sigY + 15, size: 9, font: boldFont, color: NAVY });
  page.drawText('Katsina LGA', { x: width/2 - 35, y: sigY + 4, size: 8, font: regularFont, color: rgb(0.4,0.4,0.4) });

  // Official seal placeholder
  page.drawCircle({ x: width - 100, y: sigY + 28, size: 32, borderColor: TEAL, borderWidth: 2, color: rgb(0.95, 0.99, 0.98) });
  page.drawText('OFFICIAL', { x: width - 124, y: sigY + 32, size: 7, font: boldFont, color: TEAL });
  page.drawText('SEAL', { x: width - 112, y: sigY + 22, size: 7, font: boldFont, color: TEAL });

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 20, color: NAVY });
  page.drawText('Katsina LGA · Office of the Executive Chairman · Katsina State, Nigeria', {
    x: 40, y: 6, size: 7, font: regularFont, color: rgb(0.6, 0.6, 0.6),
  });
  page.drawText(`Generated: ${new Date().toISOString()}`, {
    x: width - 200, y: 6, size: 7, font: regularFont, color: rgb(0.6, 0.6, 0.6),
  });

  return doc.save();
}
