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

const drawChessPattern = (doc: jsPDF, x: number, y: number, width: number, size: number) => {
    doc.setFillColor(0, 0, 0);
    let drawBlack = true;
    for (let i = x; i < x + width; i += size) {
        if (drawBlack) {
            doc.rect(i, y, size, size, 'F');
        }
        drawBlack = !drawBlack;
    }
    // Second row staggered
    drawBlack = false;
    for (let i = x; i < x + width; i += size) {
        if (drawBlack) {
            doc.rect(i, y + size, size, size, 'F');
        }
        drawBlack = !drawBlack;
    }
};

const drawCorner = (doc: jsPDF, x: number, y: number, size: number, rotation: number) => {
    // Simple ornate corner L-shape
    doc.setDrawColor(183, 142, 60); // Gold
    doc.setLineWidth(1.5);

    // We can just draw lines relative to x,y
    // Rotation is 0 (top-left), 90 (top-right), 180 (bottom-right), 270 (bottom-left)
    // To keep it simple without matrix transforms, we'll just code logic for 4 corners or use simple lines.

    // Actually, simpler is just 4 distinct calls or if/else logic
    // Let's just draw "L" shapes with a double line
    const offset = 5;
    const len = 20;

    let x1 = x, y1 = y, x2 = x, y2 = y;
    let x3 = x, y3 = y, x4 = x, y4 = y;

    // TL
    if (x < 100 && y < 100) {
        doc.line(x, y, x + len, y);
        doc.line(x, y, x, y + len);
        doc.line(x + offset, y + offset, x + len, y + offset);
        doc.line(x + offset, y + offset, x + offset, y + len);
    }
    // TR
    else if (x > 100 && y < 100) {
        doc.line(x, y, x - len, y);
        doc.line(x, y, x, y + len);
        doc.line(x - offset, y + offset, x - len, y + offset);
        doc.line(x - offset, y + offset, x - offset, y + len);
    }
    // BR
    else if (x > 100 && y > 100) {
        doc.line(x, y, x - len, y);
        doc.line(x, y, x, y - len);
        doc.line(x - offset, y - offset, x - len, y - offset);
        doc.line(x - offset, y - offset, x - offset, y - len);
    }
    // BL
    else {
        doc.line(x, y, x + len, y);
        doc.line(x, y, x, y - len);
        doc.line(x + offset, y - offset, x + len, y - offset);
        doc.line(x + offset, y - offset, x + offset, y - len);
    }
};

export const generateDiploma = (options: DiplomaOptions) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // -- Background --
    // Subtle cream background
    doc.setFillColor(255, 253, 245);
    doc.rect(0, 0, width, height, 'F');

    // -- Ornamental Borders --
    // Outer heavy border
    doc.setDrawColor(20, 20, 20);
    doc.setLineWidth(1.5);
    doc.rect(8, 8, width - 16, height - 16);

    // Inner gold border
    doc.setDrawColor(183, 142, 60); // Gold
    doc.setLineWidth(1);
    doc.rect(12, 12, width - 24, height - 24);

    // Decorative Corners
    drawCorner(doc, 12, 12, 0, 0); // TL
    drawCorner(doc, width - 12, 12, 0, 0); // TR
    drawCorner(doc, width - 12, height - 12, 0, 0); // BR
    drawCorner(doc, 12, height - 12, 0, 0); // BL

    // -- Chess Pattern Strip (Bottom) --
    // A subtle checkerboard at the bottom content area ???
    // Maybe too busy. Let's do a simple icon at top.

    // -- Header --
    doc.setTextColor(50, 50, 50);
    doc.setFont("times", "bold");
    doc.setFontSize(40);

    let title = "DIPLOMA DE HONOR";
    if (options.type === 'completion') title = "DIPLOMA DE FINALIZACIÓN";
    if (options.type === 'participation') title = "CERTIFICADO DE MÉRITO";
    if (options.type === 'tournament') title = "CAMPEÓN DE TORNEO";

    doc.text(title.toUpperCase(), width / 2, 45, { align: "center" });

    // -- Subheader --
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(120, 120, 120);
    doc.text("OTORGADO A", width / 2, 65, { align: "center" });

    // -- Student Name --
    doc.setFont("times", "italic");
    doc.setFontSize(48);
    doc.setTextColor(0, 0, 0);
    // Add a slight drop shadow effect by printing twice?
    doc.setTextColor(200, 200, 200);
    doc.text(options.studentName, width / 2 + 0.5, 90.5, { align: "center" }); // Shadow
    doc.setTextColor(183, 142, 60); // Gold Text
    doc.text(options.studentName, width / 2, 90, { align: "center" });

    // -- Divider --
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 40, 100, width / 2 + 40, 100);

    // -- Reason / Body Text --
    doc.setFont("times", "normal");
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);

    let bodyText = "";
    if (options.achievement) {
        bodyText = `En reconocimiento por alcanzar el logro: "${options.achievement}"`;
    } else if (options.courseName) {
        bodyText = `Por haber completado con éxito el curso: "${options.courseName}"`;
    } else {
        bodyText = "En reconocimiento a su dedicación, esfuerzo y progreso continuo en el noble juego del ajedrez.";
    }

    const splitText = doc.splitTextToSize(bodyText, 180);
    doc.text(splitText, width / 2, 120, { align: "center" });

    if (options.centerName) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(options.centerName, width / 2, 145, { align: "center" });
    }

    // -- Signatures Area --
    const sigY = height - 40;

    // Left: Date
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(options.date, 60, sigY, { align: "center" });
    doc.setDrawColor(100, 100, 100);
    doc.line(40, sigY - 2, 80, sigY - 2);
    doc.setFontSize(10);
    doc.text("FECHA", 60, sigY + 5, { align: "center" });

    // Right: Signature
    doc.setFontSize(12);
    doc.setFont("times", "italic");
    doc.text(options.instructorName, width - 60, sigY, { align: "center" });
    doc.line(width - 80, sigY - 2, width - 40, sigY - 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("INSTRUCTOR", width - 60, sigY + 5, { align: "center" });

    // -- Chess Piece Icon (Vector) --
    // Draw a simplified King Crown icon in the center bottom
    const cx = width / 2;
    const cy = height - 25;

    doc.setDrawColor(183, 142, 60);
    doc.setFillColor(183, 142, 60);

    // Cross
    doc.line(cx, cy - 8, cx, cy - 5);
    doc.line(cx - 1.5, cy - 6.5, cx + 1.5, cy - 6.5);

    // Crown Top
    doc.triangle(cx - 4, cy - 2, cx, cy - 5, cx + 4, cy - 2, 'FD');

    // Body
    doc.rect(cx - 3, cy - 2, 6, 4, 'FD');

    // Base
    doc.rect(cx - 4, cy + 2, 8, 1, 'FD');

    // Branding
    doc.setFontSize(8);
    doc.setTextColor(180, 180, 180);
    doc.text("ChessNet System", width / 2, height - 8, { align: "center" });

    // Output
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}.pdf`);
};
