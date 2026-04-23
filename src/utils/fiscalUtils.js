/**
 * Fiscal Utilities for TodoDigital NMR
 * Handles calculations and formatting for SAT-ready reports.
 */

/**
 * Calculates a summary of totals from a list of invoices.
 * @param {Array} invoices - List of invoice objects from Firestore
 * @returns {Object} { subtotal, tax, total, retentions }
 */
export const calculateFiscalSummary = (invoices) => {
    return invoices.reduce((acc, inv) => {
        const { subtotal = 0, tax = 0, total = 0, retentions = 0 } = inv.totals || {};
        return {
            subtotal: acc.subtotal + Number(subtotal),
            tax: acc.tax + Number(tax),
            total: acc.total + Number(total),
            retentions: acc.retentions + Number(retentions)
        };
    }, { subtotal: 0, tax: 0, total: 0, retentions: 0 });
};

/**
 * Generates a CSV string formatted for basic SAT accounting.
 * @param {Array} invoices - List of invoice objects
 * @returns {string} CSV content
 */
export const generateFiscalCSV = (invoices) => {
    const headers = ["Fecha", "Folio", "Cliente", "RFC", "Subtotal", "IVA", "Retenciones", "Total", "Estado"];
    const rows = invoices.map(inv => [
        new Date(inv.createdAt?.seconds * 1000 || inv.createdAt).toLocaleDateString(),
        inv.id || inv.folio,
        inv.clientName,
        inv.clientRfc,
        inv.totals?.subtotal || 0,
        inv.totals?.tax || 0,
        inv.totals?.retentions || 0,
        inv.totals?.total || 0,
        inv.status || 'Emitido'
    ]);

    return [headers, ...rows]
        .map(row => row.join(','))
        .join('\n');
};

/**
 * Downloads a string as a CSV file.
 */
export const downloadCSV = (content, filename = 'reporte_fiscal.csv') => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
