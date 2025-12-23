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

export const generateDiploma = (options: DiplomaOptions) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // -- Background & Border --
    // Beige/Paper background color check - standard white is usually better for home printers, 
    // but a very light cream adds "premium". Let's stick to white for cleaner printing or add a subtle option.
    // We will stick to white for now to save ink.

    // Outer Border
    doc.setDrawColor(20, 20, 20); // Dark Grey/Black
    doc.setLineWidth(1);
    doc.rect(10, 10, width - 20, height - 20);

    // Inner Border (Golden or Accent)
    doc.setDrawColor(183, 142, 60); // Metallic Gold-ish
    doc.setLineWidth(2);
    doc.rect(15, 15, width - 30, height - 30);

    // -- Header --
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(36);

    let title = "DIPLOMA DE HONOR";
    if (options.type === 'completion') title = "CERTIFICADO DE FINALIZACIÓN";
    if (options.type === 'participation') title = "CERTIFICADO DE PARTICIPACIÓN";
    if (options.type === 'tournament') title = "DIPLOMA DE TORNEO";

    doc.text(title, width / 2, 50, { align: "center" });

    // -- Logo / Decoration (Optional Placeholder) --
    // A simple Chess piece icon drawn with lines could go here, or just text.
    // Let's settle for a subtitle.

    doc.setFont("times", "normal");
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("Se otorga el presente reconocimiento a:", width / 2, 75, { align: "center" });

    // -- Student Name --
    doc.setFont("times", "italic");
    doc.setFontSize(42);
    doc.setTextColor(0, 0, 0); // Black for name
    doc.text(options.studentName, width / 2, 100, { align: "center" });

    // -- Divider Line --
    doc.setDrawColor(183, 142, 60);
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 60, 105, width / 2 + 60, 105);

    // -- Reason / Body Text --
    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.setTextColor(60, 60, 60);

    let bodyText = "";
    if (options.achievement) {
        bodyText = `Por haber alcanzado el logro: "${options.achievement}"`;
    } else if (options.courseName) {
        bodyText = `Por haber completado satisfactoriamente el curso de ajedrez: "${options.courseName}"`;
    } else {
        bodyText = "Por su dedicación, esfuerzo y excelente desempeño en el aprendizaje del ajedrez.";
    }

    // Wrap text if needed (simple centering for now)
    doc.text(bodyText, width / 2, 125, { align: "center", maxWidth: 200 });

    if (options.centerName) {
        doc.setFontSize(14);
        doc.text(`Otorgado en ${options.centerName}`, width / 2, 140, { align: "center" });
    }

    // -- Date & Signature --
    const bottomY = height - 45;

    // Date
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${options.date}`, 50, bottomY);
    doc.line(40, bottomY - 5, 90, bottomY - 5); // Line over date

    // Signature
    doc.text(options.instructorName, width - 50, bottomY, { align: "center" });
    doc.text("Instructor", width - 50, bottomY + 6, { align: "center" });
    doc.line(width - 80, bottomY - 5, width - 20, bottomY - 5); // Line over signature

    // -- Footer Branding --
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Generado con ChessNet", width / 2, height - 12, { align: "center" });

    // Output
    doc.save(`Diploma_${options.studentName.replace(/\s+/g, '_')}.pdf`);
};
