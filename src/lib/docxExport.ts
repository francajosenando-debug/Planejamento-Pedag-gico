import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType
} from 'docx';
import { WeeklyPlanning, SchoolSettings } from '../types';

export async function generatePlanningDOCX(planning: WeeklyPlanning, settings?: SchoolSettings) {
  const schoolName = settings?.schoolName || 'ESCOLA DE EDUCAÇÃO INFANTIL';
  const teacherName = planning.teacher || settings?.teacherName || 'Professor(a)';

  const children: any[] = [];

  // Title Header
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: schoolName.toUpperCase(),
          bold: true,
          size: 28,
          color: '1E3A8A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${planning.className} – ${planning.year}`,
          bold: true,
          size: 24,
          color: '0F172A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Planejamento: ${planning.week} (${planning.startDate || ''} a ${planning.endDate || ''}) | Professor(a): ${teacherName}`,
          italics: true,
          size: 20,
          color: '475569'
        })
      ]
    }),
    new Paragraph({ text: '' })
  );

  // General Theme Table
  if (planning.generalTheme || planning.project || planning.bookWorked) {
    const infoRows: TableRow[] = [];
    if (planning.generalTheme) {
      infoRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'TEMA GERAL: ', bold: true, size: 20, color: '1E3A8A' }),
                    new TextRun({ text: planning.generalTheme, size: 20 })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        })
      );
    }
    if (planning.project) {
      infoRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'PROJETO: ', bold: true, size: 20, color: '1E3A8A' }),
                    new TextRun({ text: planning.project, size: 20 })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        })
      );
    }
    if (planning.bookWorked) {
      infoRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'LIVRO TRABALHADO: ', bold: true, size: 20, color: '1E3A8A' }),
                    new TextRun({ text: planning.bookWorked, size: 20 })
                  ]
                })
              ],
              width: { size: 100, type: WidthType.PERCENTAGE }
            })
          ]
        })
      );
    }

    children.push(
      new Table({
        rows: infoRows,
        width: { size: 100, type: WidthType.PERCENTAGE }
      }),
      new Paragraph({ text: '' })
    );
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

    // Day Heading
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: `${day.dayName.toUpperCase()} ${day.dateStr ? `- ${day.dateStr}` : ''} ${day.subHeader ? `(${day.subHeader})` : ''}`,
            bold: true,
            size: 22,
            color: '2563EB'
          })
        ]
      })
    );

    // Routine
    if (day.routine && day.routine.length > 0) {
      day.routine.forEach((r) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${r.title} (${r.time})`, bold: true, size: 20 }),
              new TextRun({ text: r.description ? `\n${r.description}` : '', size: 18, color: '334155' })
            ]
          })
        );
      });
    }

    // Lessons
    if (day.lessons && day.lessons.length > 0) {
      day.lessons.forEach((l) => {
        children.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_3,
            children: [
              new TextRun({
                text: `${l.subject}: ${l.time}${l.theme ? ` – ${l.theme}` : ''}`,
                bold: true,
                size: 20,
                color: '1D4ED8'
              })
            ]
          })
        );

        if (l.bnccCodes && l.bnccCodes.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Objetivos BNCC: ', bold: true, size: 18 }),
                new TextRun({ text: l.bnccCodes.join(', '), italics: true, size: 18 })
              ]
            })
          );
        }

        if (l.objectives) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Objetivos: ', bold: true, size: 18 }),
                new TextRun({ text: l.objectives, size: 18 })
              ]
            })
          );
        }

        if (l.development) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Desenvolvimento: ', bold: true, size: 18, color: '1E3A8A' })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({ text: l.development, size: 18 })
              ]
            })
          );
        }

        if (l.materials && l.materials.length > 0) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Materiais: ', bold: true, size: 18, color: '475569' }),
                new TextRun({ text: l.materials.join(', '), size: 18 })
              ]
            })
          );
        }

        children.push(new Paragraph({ text: '' }));
      });
    }

    children.push(new Paragraph({ text: '' }));
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Planejamento_${planning.className}_${planning.week}.docx`.replace(/\s+/g, '_');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
