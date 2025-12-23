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
        primary: { r: 59, g: 130, b: 246 }, // Blue
        secondary: { r: 147, g: 197, b: 253 },
        accent: { r: 37, g: 99, b: 235 },
        bg: { r: 15, g: 23, b: 42 }, // Dark slate
        text: { r: 255, g: 255, b: 255 },
        icon: '🏆'
    },
    participation: {
        primary: { r: 168, g: 85, b: 247 }, // Purple
        secondary: { r: 216, g: 180, b: 254 },
        accent: { r: 147, g: 51, b: 234 },
        bg: { r: 24, g: 24, b: 27 }, // Dark zinc
        text: { r: 255, g: 255, b: 255 },
        icon: '⭐'
    },
    completion: {
        primary: { r: 34, g: 197, b: 94 }, // Green
        secondary: { r: 134, g: 239, b: 172 },
        accent: { r: 22, g: 163, b: 74 },
        bg: { r: 20, g: 29, b: 47 }, // Dark blue
        text: { r: 255, g: 255, b: 255 },
        icon: '🎓'
    },
    tournament: {
        primary: { r: 245, g: 158, b: 11 }, // Amber
        secondary: { r: 253, g: 224, b: 71 },
        accent: { r: 217, g: 119, b: 6 },
        bg: { r: 23, g: 23, b: 23 }, // Near black
        text: { r: 255, g: 255, b: 255 },
        icon: '♛'
    }
};

const drawGradientBackground = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Dark background
    doc.setFillColor(scheme.bg.r, scheme.bg.g, scheme.bg.b);
    doc.rect(0, 0, width, height, 'F');

    // Gradient effect with rectangles
    const steps = 50;
    for (let i = 0; i < steps; i++) {
        const alpha = i / steps;
        const r = scheme.bg.r + (scheme.primary.r - scheme.bg.r) * alpha * 0.3;
        const g = scheme.bg.g + (scheme.primary.g - scheme.bg.g) * alpha * 0.3;
        const b = scheme.bg.b + (scheme.primary.b - scheme.bg.b) * alpha * 0.3;

        doc.setFillColor(r, g, b);
        doc.rect(0, (height / steps) * i, width, height / steps, 'F');
    }
};

const drawModernBorder = (doc: jsPDF, type: DiplomaOptions['type']) => {
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    const scheme = colorSchemes[type];

    // Outer border with primary color
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(2);
    doc.rect(10, 10, width - 20, height - 20);

    // Inner accent border
    doc.setDrawColor(scheme.accent.r, scheme.accent.g, scheme.accent.b);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, width - 24, height - 24);

    // Corner accents
    const cornerSize = 15;
    doc.setFillColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);

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

    // Decorative circles in corners with lighter colors
    const lightR = scheme.secondary.r + (255 - scheme.secondary.r) * 0.9;
    const lightG = scheme.secondary.g + (255 - scheme.secondary.g) * 0.9;
    const lightB = scheme.secondary.b + (255 - scheme.secondary.b) * 0.9;

    doc.setFillColor(lightR, lightG, lightB);
    doc.circle(20, 20, 30, 'F');
    doc.circle(width - 20, 20, 30, 'F');
    doc.circle(20, height - 20, 30, 'F');
    doc.circle(width - 20, height - 20, 30, 'F');
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
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);
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
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("OTORGADO A", width / 2, 70, { align: "center" });

    // Student Name with accent color
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.setTextColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.text(options.studentName, width / 2, 95, { align: "center" });

    // Decorative line under name
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(1);
    doc.line(width / 2 - 50, 100, width / 2 + 50, 100);

    // Body Text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);

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
        doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
        doc.text(options.centerName, width / 2, 140, { align: "center" });
    }

    // Signature Area
    const sigY = height - 35;

    // Date
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);
    doc.text(options.date, 50, sigY, { align: "center" });
    doc.setDrawColor(scheme.primary.r, scheme.primary.g, scheme.primary.b);
    doc.setLineWidth(0.5);
    doc.line(30, sigY - 2, 70, sigY - 2);
    doc.setFontSize(9);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("FECHA", 50, sigY + 5, { align: "center" });

    // Instructor Signature
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(scheme.text.r, scheme.text.g, scheme.text.b);
    doc.text(options.instructorName, width - 50, sigY, { align: "center" });
    doc.line(width - 70, sigY - 2, width - 30, sigY - 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("INSTRUCTOR", width - 50, sigY + 5, { align: "center" });

    // Branding
    doc.setFontSize(8);
    doc.setTextColor(scheme.secondary.r, scheme.secondary.g, scheme.secondary.b);
    doc.text("ChessNet • Sistema de Gestión de Academias de Ajedrez", width / 2, height - 8, { align: "center" });

    // Output
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}_${options.type}.pdf`);
};
