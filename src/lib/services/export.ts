import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Tournament, Student } from './storage';

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
