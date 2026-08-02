import jsPDF from 'jspdf';
import { WeeklyPlanning, SchoolSettings } from '../types';

export function generatePlanningPDF(planning: WeeklyPlanning, settings?: SchoolSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const schoolName = settings?.schoolName || 'ESCOLA DE EDUCAÇÃO INFANTIL';
  const teacherName = planning.teacher || settings?.teacherName || 'Professor(a)';
  const cityState = (settings?.city && settings?.state) ? `${settings.city} - ${settings.state}` : '';

  const addHeader = () => {
    // Top border box / Header styling
    doc.setDrawColor(200, 210, 225);
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, margin, contentWidth, 24, 'FD');

    // Header Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138); // Dark Navy Blue
    doc.text(schoolName.toUpperCase(), margin + 5, margin + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${planning.className} – ${planning.year}`, margin + 5, margin + 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Planejamento: ${planning.week} (${planning.startDate || ''} a ${planning.endDate || ''})`, margin + 5, margin + 20);

    if (cityState) {
      doc.text(cityState, pageWidth - margin - 5, margin + 7, { align: 'right' });
    }
    doc.text(`Profe: ${teacherName}`, pageWidth - margin - 5, margin + 14, { align: 'right' });

    y = margin + 30;
  };

  const addPageIfNeeded = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      addHeader();
    }
  };

  addHeader();

  // General Summary Box if exists
  if (planning.generalTheme || planning.project || planning.bookWorked) {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 58, 138);

    let infoY = y + 5;
    if (planning.generalTheme) {
      doc.text(`TEMA GERAL: ${planning.generalTheme}`, margin + 4, infoY);
      infoY += 5;
    }
    if (planning.project) {
      doc.text(`PROJETO: ${planning.project}`, margin + 4, infoY);
      infoY += 5;
    }
    if (planning.bookWorked) {
      doc.text(`LIVRO TRABALHADO: ${planning.bookWorked}`, margin + 4, infoY);
    }
    y += 25;
  }

  const daysList = [
    planning.days.segunda,
    planning.days.terca,
    planning.days.quarta,
    planning.days.quinta,
    planning.days.sexta
  ];

  daysList.forEach((day) => {
    if (!day) return;

    addPageIfNeeded(18);

    // Day Section Header
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(margin, y, contentWidth, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    const dayTitle = `${day.dayName.toUpperCase()} ${day.dateStr ? `- ${day.dateStr}` : ''} ${day.subHeader ? `(${day.subHeader})` : ''}`;
    doc.text(dayTitle, margin + 4, y + 5.5);
    y += 12;

    // Routine Items
    if (day.routine && day.routine.length > 0) {
      day.routine.forEach((r) => {
        const descLines = r.description ? doc.splitTextToSize(r.description, contentWidth - 8) : [];
        const itemHeight = 6 + (descLines.length * 4.5);
        addPageIfNeeded(itemHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.text(`• ${r.title} (${r.time})`, margin + 4, y);
        y += 5;

        if (descLines.length > 0) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(51, 65, 85);
          descLines.forEach((line: string) => {
            doc.text(`  ${line}`, margin + 6, y);
            y += 4.5;
          });
        }
        y += 2;
      });
    }

    // Lesson Items
    if (day.lessons && day.lessons.length > 0) {
      day.lessons.forEach((l) => {
        addPageIfNeeded(25);

        // Lesson Title Bar
        doc.setFillColor(239, 246, 255); // Blue 50
        doc.setDrawColor(191, 219, 254);
        doc.rect(margin, y, contentWidth, 7, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(29, 78, 216);
        const subjectText = `${l.subject}: ${l.time}${l.theme ? ` – ${l.theme}` : ''}`;
        doc.text(subjectText, margin + 4, y + 5);
        y += 10;

        // Objectives & BNCC
        if (l.bnccCodes && l.bnccCodes.length > 0) {
          addPageIfNeeded(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text('Objetivos (BNCC):', margin + 4, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          l.bnccCodes.forEach((code) => {
            doc.text(`• Code BNCC: ${code}`, margin + 8, y);
            y += 4;
          });
        }

        if (l.objectives) {
          addPageIfNeeded(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(15, 23, 42);
          doc.text('Objetivos da Aula:', margin + 4, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(51, 65, 85);
          const objLines = doc.splitTextToSize(l.objectives, contentWidth - 10);
          objLines.forEach((line: string) => {
            addPageIfNeeded(5);
            doc.text(line, margin + 8, y);
            y += 4;
          });
          y += 2;
        }

        // Development
        if (l.development) {
          addPageIfNeeded(10);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9);
          doc.setTextColor(30, 58, 138);
          doc.text('Desenvolvimento da Aula:', margin + 4, y);
          y += 4.5;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8.5);
          doc.setTextColor(30, 41, 59);

          const devLines = doc.splitTextToSize(l.development, contentWidth - 10);
          devLines.forEach((line: string) => {
            addPageIfNeeded(5);
            doc.text(line, margin + 8, y);
            y += 4.2;
          });
          y += 2;
        }

        // Materials
        if (l.materials && l.materials.length > 0) {
          addPageIfNeeded(8);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(`Materiais: ${l.materials.join(', ')}`, margin + 4, y);
          y += 5;
        }

        y += 4;
      });
    }

    y += 6;
  });

  // Footer Page Numbering
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Página ${i} de ${totalPages} – Gerado por Planejamento Pedagógico Infantil`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  const fileName = `Planejamento_${planning.className}_${planning.week}.pdf`.replace(/\s+/g, '_');
  doc.save(fileName);
}
