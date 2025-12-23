import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Type definitions for Diploma options
export interface DiplomaOptions {
    studentName: string;
    courseName?: string;
    achievement?: string;
    date: string;
    instructorName: string;
    centerName?: string;
    type: 'excellence' | 'participation' | 'completion' | 'tournament';
}

// Color schemes for each diploma type (RGB objects for jsPDF)
const colorSchemes = {
    excellence: {
        primary: { r: 59, g: 130, b: 246 }, // Blue
        secondary: { r: 147, g: 197, b: 253 },
        accent: { r: 255, g: 255, b: 255 }, // White Drawing
        bg: { r: 15, g: 23, b: 42 }, // Dark slate
        text: { r: 255, g: 255, b: 255 }
    },
    participation: {
        primary: { r: 168, g: 85, b: 247 }, // Purple
        secondary: { r: 216, g: 180, b: 254 },
        accent: { r: 255, g: 255, b: 255 },
        bg: { r: 24, g: 24, b: 27 }, // Dark zinc
        text: { r: 255, g: 255, b: 255 }
    },
    completion: {
        primary: { r: 34, g: 197, b: 94 }, // Green
        secondary: { r: 134, g: 239, b: 172 },
        accent: { r: 255, g: 255, b: 255 },
        bg: { r: 20, g: 29, b: 47 }, // Dark blue
        text: { r: 255, g: 255, b: 255 }
    },
    tournament: {
        primary: { r: 245, g: 158, b: 11 }, // Amber
        secondary: { r: 253, g: 224, b: 71 },
        accent: { r: 255, g: 255, b: 255 },
        bg: { r: 23, g: 23, b: 23 }, // Near black
        text: { r: 255, g: 255, b: 255 }
    }
};

const drawSolidIcon = (doc: jsPDF, type: DiplomaOptions['type'], cx: number, cy: number) => {
    const scheme = colorSchemes[type];
    doc.setFillColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);

    // Background circle for uniformity
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(1);
    doc.circle(cx, cy, 18, 'S');

    if (type === 'excellence') {
        // Trophy / Cup
        doc.path([
            { op: 'm', c: [cx - 8, cy - 8] },
            { op: 'l', c: [cx + 8, cy - 8] },
            { op: 'l', c: [cx + 5, cy + 2] },
            { op: 'c', c: [cx + 5, cy + 2, cx, cy + 8, cx - 5, cy + 2] },
            { op: 'l', c: [cx - 8, cy - 8] },
            { op: 'f' }
        ]);
        doc.rect(cx - 4, cy + 6, 8, 2, 'F');
        doc.rect(cx - 6, cy + 8, 12, 2, 'F');

    } else if (type === 'participation') {
        // Star
        const r = 10;
        const pts: any[] = [];
        const angle = Math.PI / 5;
        for (let i = 0; i < 10; i++) {
            const rad = i % 2 === 0 ? r : r / 2.5;
            const a = -Math.PI / 2 + i * angle;
            pts.push({ op: i === 0 ? 'm' : 'l', c: [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] });
        }
        pts.push({ op: 'f' });
        doc.path(pts);

    } else if (type === 'completion') {
        // Graduation Cap
        doc.triangle(cx, cy - 8, cx + 12, cy, cx, cy + 8, 'F');
        doc.triangle(cx, cy - 8, cx - 12, cy, cx, cy + 8, 'F');
        doc.rect(cx - 7, cy, 14, 5, 'F');

    } else if (type === 'tournament') {
        // Crown
        const baseW = 16;
        doc.rect(cx - baseW / 2, cy + 2, baseW, 3, 'F');
        doc.triangle(cx - 8, cy + 2, cx - 12, cy - 6, cx - 4, cy + 2, 'F');
        doc.triangle(cx - 4, cy + 2, cx, cy - 9, cx + 4, cy + 2, 'F');
        doc.triangle(cx + 4, cy + 2, cx + 12, cy - 6, cx + 8, cy + 2, 'F');
    }
};

const drawElegantBorder = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Double border line
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);

    // Outer thick
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);

    // Inner thin
    doc.setLineWidth(0.5);
    doc.rect(13, 13, width - 26, height - 26);

    // Corner embellishment (simple squares)
    doc.setFillColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    const size = 6;
    doc.rect(8, 8, size, size, 'F'); // TL
    doc.rect(width - 8 - size, 8, size, size, 'F'); // TR
    doc.rect(8, height - 8 - size, size, size, 'F'); // BL
    doc.rect(width - 8 - size, height - 8 - size, size, size, 'F'); // BR
};

export const generateDiploma = (options: DiplomaOptions) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[options.type];

    // 1. Solid Dark Background
    doc.setFillColor(scheme.bg.r, scheme.bg.g, scheme.bg.b);
    doc.rect(0, 0, width, height, 'F');

    // 2. Elegant Border
    drawElegantBorder(doc, options.type);

    // 3. Icon at Top Center
    drawSolidIcon(doc, options.type, width / 2, 40);

    // 4. Main Titles
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);

    let title = "DIPLOMA DE EXCELENCIA";
    if (options.type === 'completion') title = "DIPLOMA DE FINALIZACIÓN";
    if (options.type === 'participation') title = "DIPLOMA DE PARTICIPACIÓN";
    if (options.type === 'tournament') title = "CAMPEÓN DE TORNEO";

    doc.text(title, width / 2, 70, { align: "center" });

    // 5. Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("OTORGADO A", width / 2, 85, { align: "center" });

    // 6. Student Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.text(options.studentName, width / 2, 105, { align: "center" });

    // Underline name
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(1);
    doc.line(width / 2 - 60, 112, width / 2 + 60, 112);

    // 7. Achievement / Description
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(230, 230, 230); // Very light gray (almost white)

    let bodyText = "Por su esfuerzo y dedicación en el aprendizaje del ajedrez.";
    if (options.achievement) bodyText = `En reconocimiento por: "${options.achievement}"`;
    if (options.courseName) bodyText = `Por haber completado el curso: "${options.courseName}"`;

    const splitText = doc.splitTextToSize(bodyText, 200);
    doc.text(splitText, width / 2, 130, { align: "center" });

    if (options.centerName) {
        doc.setFontSize(12);
        doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
        doc.text(options.centerName, width / 2, 150, { align: "center" });
    }

    // 8. Signatures Footer
    const sigY = height - 40;

    // Line Styles for signatures
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);

    // Date (Left)
    doc.line(40, sigY, 90, sigY);
    doc.setFontSize(10);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("FECHA", 65, sigY + 6, { align: "center" });

    // Value
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(options.date, 65, sigY - 4, { align: "center" });

    // Instructor (Right)
    doc.line(width - 90, sigY, width - 40, sigY);
    doc.setFontSize(10);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("INSTRUCTOR", width - 65, sigY + 6, { align: "center" });

    // Value
    doc.setFontSize(12);
    doc.setFont("times", "italic");
    doc.setTextColor(255, 255, 255);
    doc.text(options.instructorName, width - 65, sigY - 4, { align: "center" });

    // 9. Branding
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    doc.text("Generado por ChessNet", width / 2, height - 10, { align: "center" });

    // Output
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}.pdf`);
};
