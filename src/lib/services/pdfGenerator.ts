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

// Color schemes for each diploma type
const colorSchemes = {
    excellence: {
        primary: [59, 130, 246], // Blue
        secondary: [147, 197, 253],
        accent: [37, 99, 235],
        bg: [15, 23, 42], // Dark slate
        text: [255, 255, 255],
        icon: '🏆'
    },
    participation: {
        primary: [168, 85, 247], // Purple
        secondary: [216, 180, 254],
        accent: [147, 51, 234],
        bg: [24, 24, 27], // Dark zinc
        text: [255, 255, 255],
        icon: '⭐'
    },
    completion: {
        primary: [34, 197, 94], // Green
        secondary: [134, 239, 172],
        accent: [22, 163, 74],
        bg: [20, 29, 47], // Dark blue
        text: [255, 255, 255],
        icon: '🎓'
    },
    tournament: {
        primary: [245, 158, 11], // Amber
        secondary: [253, 224, 71],
        accent: [217, 119, 6],
        bg: [23, 23, 23], // Near black
        text: [255, 255, 255],
        icon: '♛'
    }
};

const drawGradientBackground = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Dark background
    doc.setFillColor(...scheme.bg);
    doc.rect(0, 0, width, height, 'F');

    // Gradient effect with rectangles
    const steps = 50;
    for (let i = 0; i < steps; i++) {
        const alpha = i / steps;
        const r = scheme.bg[0] + (scheme.primary[0] - scheme.bg[0]) * alpha * 0.3;
        const g = scheme.bg[1] + (scheme.primary[1] - scheme.bg[1]) * alpha * 0.3;
        const b = scheme.bg[2] + (scheme.primary[2] - scheme.bg[2]) * alpha * 0.3;

        doc.setFillColor(r, g, b);
        doc.rect(0, (height / steps) * i, width, height / steps, 'F');
    }
};

const drawModernBorder = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Outer border with primary color
    doc.setDrawColor(...scheme.primary);
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);

    // Inner accent border
    doc.setDrawColor(...scheme.accent);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, width - 24, height - 24);

    // Corner accents
    const cornerSize = 15;
    doc.setFillColor(...scheme.primary);

    // Top-left
    doc.rect(10, 10, cornerSize, 2, 'F');
    doc.rect(10, 10, 2, cornerSize, 'F');

    // Top-right
    doc.rect(width - 10 - cornerSize, 10, cornerSize, 2, 'F');
    doc.rect(width - 12, 10, 2, cornerSize, 'F');

    // Bottom-right
    doc.rect(width - 10 - cornerSize, height - 12, cornerSize, 2, 'F');
    doc.rect(width - 12, height - 10 - cornerSize, 2, cornerSize, 'F');

    // Bottom-left
    doc.rect(10, height - 12, cornerSize, 2, 'F');
    doc.rect(10, height - 10 - cornerSize, 2, cornerSize, 'F');
};

const drawDecorativeElements = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Decorative circles in corners
    doc.setFillColor(...scheme.secondary);
    doc.setGState(new doc.GState({ opacity: 0.1 }));

    doc.circle(20, 20, 30, 'F');
    doc.circle(width - 20, 20, 30, 'F');
    doc.circle(20, height - 20, 30, 'F');
    doc.circle(width - 20, height - 20, 30, 'F');

    doc.setGState(new doc.GState({ opacity: 1 }));
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

    // Background
    drawGradientBackground(doc, options.type);

    // Decorative elements
    drawDecorativeElements(doc, options.type);

    // Border
    drawModernBorder(doc, options.type);

    // Icon at top
    doc.setFontSize(60);
    doc.text(scheme.icon, width / 2, 35, { align: "center" });

    // Title
    doc.setTextColor(...scheme.text);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);

    let title = "DIPLOMA DE EXCELENCIA";
    if (options.type === 'completion') title = "DIPLOMA DE FINALIZACIÓN";
    if (options.type === 'participation') title = "CERTIFICADO DE PARTICIPACIÓN";
    if (options.type === 'tournament') title = "CAMPEÓN DE TORNEO";

    doc.text(title.toUpperCase(), width / 2, 55, { align: "center" });

    // Subtitle
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(...scheme.secondary);
    doc.text("OTORGADO A", width / 2, 70, { align: "center" });

    // Student Name with accent color
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(...scheme.primary);
    doc.text(options.studentName, width / 2, 95, { align: "center" });

    // Decorative line under name
    doc.setDrawColor(...scheme.primary);
    doc.setLineWidth(1);
    doc.line(width / 2 - 50, 100, width / 2 + 50, 100);

    // Body Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(...scheme.text);

    let bodyText = "";
    if (options.achievement) {
        bodyText = `En reconocimiento por: "${options.achievement}"`;
    } else if (options.courseName) {
        bodyText = `Por completar con éxito: "${options.courseName}"`;
    } else {
        bodyText = "En reconocimiento a su dedicación y progreso continuo en el ajedrez.";
    }

    const splitText = doc.splitTextToSize(bodyText, 200);
    doc.text(splitText, width / 2, 120, { align: "center" });

    // Center Name
    if (options.centerName) {
        doc.setFontSize(12);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...scheme.secondary);
        doc.text(options.centerName, width / 2, 140, { align: "center" });
    }

    // Signature Area
    const sigY = height - 35;

    // Date
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...scheme.text);
    doc.text(options.date, 50, sigY, { align: "center" });
    doc.setDrawColor(...scheme.primary);
    doc.setLineWidth(0.5);
    doc.line(30, sigY - 2, 70, sigY - 2);
    doc.setFontSize(9);
    doc.setTextColor(...scheme.secondary);
    doc.text("FECHA", 50, sigY + 5, { align: "center" });

    // Instructor Signature
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...scheme.text);
    doc.text(options.instructorName, width - 50, sigY, { align: "center" });
    doc.line(width - 70, sigY - 2, width - 30, sigY - 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...scheme.secondary);
    doc.text("INSTRUCTOR", width - 50, sigY + 5, { align: "center" });

    // Branding
    doc.setFontSize(8);
    doc.setTextColor(...scheme.secondary);
    doc.text("ChessNet • Sistema de Gestión de Academias de Ajedrez", width / 2, height - 8, { align: "center" });

    // Output
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}_${options.type}.pdf`);
};
