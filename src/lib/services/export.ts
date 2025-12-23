import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Tournament, Student, Payment } from './storage';

// Add autoTable to jsPDF type
declare module 'jspdf' {
    interface jsPDF {
        lastAutoTable: {
            finalY: number;
        };
    }
}

/**
 * Generate a PDF for Tournament Standings
 */
export function exportStandingsPDF(
    tournament: Tournament,
    getStudentName: (id: string) => string,
    currentRound: number,
    totalRounds: number
) {
    const doc = new jsPDF();
    const primaryColor = [245, 158, 11]; // Amber-500 equivalent

    // Header
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(tournament.name, 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    const dateStr = new Date(tournament.date).toLocaleDateString('es-ES', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    doc.text(`${dateStr} - ${tournament.format} - Ronda ${currentRound}/${totalRounds}`, 14, 28);

    // Calculate standings (simple points logic for now, similar to frontend)
    // In a real app, this logic should be shared. 
    // For now we duplicate purely for the export or pass pre-calculated data.
    // Let's rely on calculating it here to ensure consistency if we don't pass the view model.

    // We'll mimic the frontend logic: map points, sort.
    const pointsMap = new Map<string, number>();
    tournament.participants.forEach(p => pointsMap.set(p, 0));

    tournament.matches.forEach(match => {
        if (!match.result) return;
        const [whiteScore, blackScore] = match.result === '1-0' ? [1, 0]
            : match.result === '0-1' ? [0, 1]
                : [0.5, 0.5];

        if (match.whiteId) pointsMap.set(match.whiteId, (pointsMap.get(match.whiteId) || 0) + whiteScore);
        if (match.blackId) pointsMap.set(match.blackId, (pointsMap.get(match.blackId) || 0) + blackScore);
    });

    const standings = tournament.participants.map(id => ({
        id,
        name: getStudentName(id),
        points: pointsMap.get(id) || 0
    })).sort((a, b) => b.points - a.points); // Simple sort by points

    // Table
    const tableData = standings.map((s, index) => [
        index + 1,
        s.name,
        s.points.toFixed(1)
    ]);

    autoTable(doc, {
        startY: 35,
        head: [['Pos', 'Jugador', 'Puntos']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] }, // Slate-800
        styles: { fontSize: 12, cellPadding: 3 },
    });

    // Footer
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text('Generado con ChessNet', 14, finalY);

    // Download
    doc.save(`Clasificacion_${tournament.name.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generate a PDF for Round Pairings
 */
export function exportPairingsPDF(
    tournament: Tournament,
    roundIndex: number, // 0-based
    getStudentName: (id: string) => string
) {
    const doc = new jsPDF();
    const roundNumber = roundIndex + 1;

    // Header
    doc.setFontSize(20);
    doc.text(tournament.name, 14, 20);

    doc.setFontSize(14);
    doc.text(`Emparejamientos - Ronda ${roundNumber}`, 14, 28);

    // Filter matches for this round
    const matches = tournament.matches.filter(m => m.round === roundNumber);

    const tableData = matches.map((m, index) => [
        index + 1,
        m.whiteId ? getStudentName(m.whiteId) : 'BYE',
        m.result || '- -',
        m.blackId ? getStudentName(m.blackId) : 'BYE'
    ]);

    autoTable(doc, {
        startY: 35,
        head: [['Mesa', 'Blancas', 'Resultado', 'Negras']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [50, 50, 50] },
        styles: { fontSize: 11, halign: 'center' },
        columnStyles: {
            1: { halign: 'left', fontStyle: 'bold' }, // White name
            3: { halign: 'left', fontStyle: 'bold' }  // Black name
        }
    });

    doc.save(`Ronda_${roundNumber}_${tournament.name.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generate a Receipt PDF for a single Payment
 */
export function exportReceiptPDF(
    payment: Payment,
    studentName: string,
    centerName: string = "Escuela de Ajedrez ChessNet"
) {
    const doc = new jsPDF();

    // Brand Color (Teal-600)
    const brandColor = [13, 148, 136];

    // --- Header ---
    doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.rect(0, 0, 210, 40, 'F'); // Top banner

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text("RECIBO DE PAGO", 14, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    // Right aligned company info
    doc.text(centerName, 190, 15, { align: 'right' });
    doc.text("Gestión Integral", 190, 20, { align: 'right' });
    doc.text(new Date().toLocaleDateString(), 190, 25, { align: 'right' });

    // --- Content ---
    doc.setTextColor(0, 0, 0);

    // Receipt Details Box
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(14, 50, 182, 40, 3, 3);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("ID Transacción:", 20, 60);
    doc.text("Fecha de Pago:", 120, 60);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(payment.id.split('-')[0].toUpperCase(), 20, 66);
    doc.text(payment.date, 120, 66);

    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text("Alumno:", 20, 78);
    doc.text("Método:", 120, 78);

    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text(studentName, 20, 84);
    const methods: Record<string, string> = { 'cash': 'Efectivo', 'transfer': 'Transferencia', 'bizum': 'Bizum', 'other': 'Otro' };
    doc.text(methods[payment.method] || payment.method, 120, 84);

    // Concept & Amount Table
    autoTable(doc, {
        startY: 100,
        head: [['Concepto / Descripción', 'Importe']],
        body: [
            [payment.concept, `${payment.amount.toFixed(2)} €`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59] }, // Slate-800
        columnStyles: {
            1: { halign: 'right', fontStyle: 'bold' }
        },
        styles: { fontSize: 12, cellPadding: 5 }
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL PAGADO:  ${payment.amount.toFixed(2)} €`, 190, finalY, { align: 'right' });

    // Signature / Footer
    doc.setDrawColor(150);
    doc.line(130, finalY + 40, 190, finalY + 40);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Firma o Sello Conforme", 160, finalY + 45, { align: 'center' });

    doc.text("Documento generado automáticamente por ChessNet.io", 105, 280, { align: 'center' });

    doc.save(`Recibo_${payment.date}_${studentName.replace(/\s+/g, '_')}.pdf`);
}
