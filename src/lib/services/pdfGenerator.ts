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

const drawIcon = (doc: jsPDF, type: DiplomaOptions['type'], cx: number, cy: number, scale: number) => {
    // Set color for icon (usually white or primary light)
    const scheme = colorSchemes[type];
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setFillColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(1.5);

    if (type === 'excellence') {
        // Trophy Cup (Simple geometric)
        // Bowl
        doc.path([
            { op: 'm', c: [cx - 10 * scale, cy - 10 * scale] },
            { op: 'l', c: [cx + 10 * scale, cy - 10 * scale] }, // top bar
            { op: 'l', c: [cx + 7 * scale, cy + 5 * scale] },   // tapered sides
            { op: 'c', c: [cx + 7 * scale, cy + 5 * scale, cx, cy + 12 * scale, cx - 7 * scale, cy + 5 * scale] }, // bottom curve
            { op: 'l', c: [cx - 10 * scale, cy - 10 * scale] }, // close
            { op: 'f' } // fill
        ]);
        // Base
        doc.rect(cx - 5 * scale, cy + 12 * scale, 10 * scale, 3 * scale, 'F');
        doc.rect(cx - 8 * scale, cy + 15 * scale, 16 * scale, 2 * scale, 'F');
    }
    else if (type === 'participation') {
        // Star
        const rOuter = 15 * scale;
        const rInner = 6 * scale;
        const angleStep = Math.PI / 5;

        let pathOps: any[] = [];
        // Start top
        pathOps.push({ op: 'm', c: [cx, cy - rOuter] });

        for (let i = 1; i <= 10; i++) {
            const r = i % 2 === 0 ? rOuter : rInner;
            const angle = -Math.PI / 2 + i * angleStep;
            pathOps.push({ op: 'l', c: [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] });
        }
        pathOps.push({ op: 'f' });
        doc.path(pathOps);
    }
    else if (type === 'completion') {
        // Mortarboard (Graduation Cap)
        // Top diamond
        doc.path([
            { op: 'm', c: [cx, cy - 8 * scale] },
            { op: 'l', c: [cx + 14 * scale, cy] },
            { op: 'l', c: [cx, cy + 8 * scale] },
            { op: 'l', c: [cx - 14 * scale, cy] },
            { op: 'f' }
        ]);
        // Cap base
        doc.path([
            { op: 'm', c: [cx - 8 * scale, cy + 4 * scale] }, // left mid
            { op: 'c', c: [cx - 8 * scale, cy + 4 * scale, cx, cy + 14 * scale, cx + 8 * scale, cy + 4 * scale] }, // curve down
            { op: 'l', c: [cx + 8 * scale, cy] }, // connect to right corner
            { op: 'l', c: [cx - 8 * scale, cy] }, // connect to left corner
            { op: 'f' }
        ]);
        // Tassel
        doc.setDrawColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
        doc.setLineWidth(2);
        doc.line(cx + 8 * scale, cy + 4 * scale, cx + 10 * scale, cy + 12 * scale);
        doc.circle(cx + 10 * scale, cy + 12 * scale, 1 * scale, 'F');
    }
    else if (type === 'tournament') {
        // Crown
        doc.path([
            { op: 'm', c: [cx - 12 * scale, cy + 8 * scale] }, // bottom left
            { op: 'l', c: [cx + 12 * scale, cy + 8 * scale] }, // bottom right
            { op: 'l', c: [cx + 14 * scale, cy - 8 * scale] }, // right point
            { op: 'l', c: [cx + 6 * scale, cy + 2 * scale] },  // mid right dip
            { op: 'l', c: [cx, cy - 12 * scale] },             // center point
            { op: 'l', c: [cx - 6 * scale, cy + 2 * scale] },  // mid left dip
            { op: 'l', c: [cx - 14 * scale, cy - 8 * scale] }, // left point
            { op: 'f' }
        ]);
    }
};

const drawGradientBackground = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Solid dark background
    doc.setFillColor(scheme.bg.r, scheme.bg.g, scheme.bg.b);
    doc.rect(0, 0, width, height, 'F');

    // Subtle radial-like gradient at center
    // Casting to any to avoid TS errors with GState constructor if types are missing
    doc.setDrawColor(255, 255, 255);
    try {
        const GState = (doc as any).GState;
        if (GState) {
            doc.setGState(new GState({ opacity: 0.03 }));
            for (let y = 0; y < height; y += 4) {
                doc.line(0, y, width, y);
            }
            doc.setGState(new GState({ opacity: 1.0 }));
        }
    } catch (e) {
        // GState not supported
    }
};

const drawModernBorder = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Main border frame
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(1.0);
    doc.rect(15, 15, width - 30, height - 30);

    // Decorative corners (Lines only, no fills)
    const cl = 20; // corner length
    const m = 15;  // margin

    doc.setLineWidth(3);
    // Draw corners on top of the rect

    // Top Left
    doc.line(m, m + cl, m, m);
    doc.line(m, m, m + cl, m);

    // Top Right
    doc.line(width - m - cl, m, width - m, m);
    doc.line(width - m, m, width - m, m + cl);

    // Bottom Right
    doc.line(width - m, height - m - cl, width - m, height - m);
    doc.line(width - m, height - m, width - m - cl, height - m);

    // Bottom Left
    doc.line(m, height - m - cl, m, height - m);
    doc.line(m, height - m, m + cl, height - m);
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

    // 1. Background
    drawGradientBackground(doc, options.type);

    // 2. Border
    drawModernBorder(doc, options.type);

    // 3. Icon (Vector Drawing)
    drawIcon(doc, options.type, width / 2, 45, 1.0);

    // 4. Title
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);

    let title = "DIPLOMA DE EXCELENCIA";
    if (options.type === 'completion') title = "DIPLOMA DE FINALIZACIÓN";
    if (options.type === 'participation') title = "CERTIFICADO DE PARTICIPACIÓN";
    if (options.type === 'tournament') title = "CAMPEÓN DE TORNEO";

    doc.text(title.toUpperCase(), width / 2, 70, { align: "center" });

    // 5. Subtitle "Otorgado A"
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("OTORGADO A", width / 2, 82, { align: "center" });

    // 6. Student Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    // Glow effect simulation (draw larger lighter text behind?)
    // Keeping it crisp:
    doc.setTextColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.text(options.studentName, width / 2, 100, { align: "center" });

    // Divider Line
    doc.setDrawColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 40, 108, width / 2 + 40, 108);

    // 7. Body Text (Achievement)
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200); // Off-white for readability

    let bodyText = "";
    if (options.achievement) {
        bodyText = `En reconocimiento por: "${options.achievement}"`;
    } else if (options.courseName) {
        bodyText = `Por completar con éxito: "${options.courseName}"`;
    } else {
        bodyText = "En reconocimiento a su dedicación y progreso continuo en el ajedrez.";
    }

    // Split text to ensure it fits
    const splitText = doc.splitTextToSize(bodyText, 180);
    doc.text(splitText, width / 2, 125, { align: "center" });

    // Center Name (Optional)
    if (options.centerName) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
        doc.text(options.centerName, width / 2, 145, { align: "center" });
    }

    // 8. Signature Area
    const sigY = height - 40;

    // Left: Date
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text(options.date, 60, sigY, { align: "center" });

    // Line
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(0.5);
    doc.line(40, sigY + 2, 80, sigY + 2);

    // Label
    doc.setFontSize(9);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("FECHA", 60, sigY + 8, { align: "center" });

    // Right: Instructor
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic"); // Italic signature font simulation
    doc.setTextColor(255, 255, 255);
    doc.text(options.instructorName, width - 60, sigY, { align: "center" });

    // Line
    doc.line(width - 80, sigY + 2, width - 40, sigY + 2);

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("INSTRUCTOR", width - 60, sigY + 8, { align: "center" });

    // 9. Bottom Branding
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("ChessNet • Sistema de Gestión de Academias", width / 2, height - 10, { align: "center" });

    // Save
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}_${options.type}.pdf`);
};
