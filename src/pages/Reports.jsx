import React, { useState, useEffect } from 'react';
import { Download, FileSpreadsheet, Calendar, Search, ArrowLeft, Filter, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { calculateFiscalSummary, generateFiscalCSV, downloadCSV } from '../utils/fiscalUtils';

const Reports = () => {
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const invRef = collection(db, 'invoices');
                // En una app con miles de facturas usaríamos filtros de fecha en Firestore.
                // Para este MVP, traemos las del tenant y filtramos en JS.
                const q = query(invRef, where('tenantId', '==', currentTenant.id), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching invoices for reports:", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentTenant) fetchInvoices();
    }, [currentTenant]);

    // Filtrar facturas por mes y año seleccionado
    const filteredInvoices = invoices.filter(inv => {
        const date = inv.createdAt?.seconds ? new Date(inv.createdAt.seconds * 1000) : new Date(inv.createdAt);
        return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    const summary = calculateFiscalSummary(filteredInvoices);

    const handleDownload = () => {
        const csv = generateFiscalCSV(filteredInvoices);
        downloadCSV(csv, `Reporte_Fiscal_${selectedMonth + 1}_${selectedYear}.csv`);
    };

    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/')} style={{ background: 'white', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                    <ArrowLeft size={20} />
                </button>
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Reportes Contables</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>Tu centro de control para la declaración de impuestos</p>
                </div>
            </div>

            <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Selectors */}
                    <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-muted)' }}>MES DE DECLARACIÓN</label>
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }}
                            >
                                {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: '1 1 150px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: 'var(--text-muted)' }}>AÑO</label>
                            <select 
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: '#f8fafc' }}
                            >
                                <option value={2024}>2024</option>
                                <option value={2025}>2025</option>
                                <option value={2026}>2026</option>
                            </select>
                        </div>
                        <button onClick={handleDownload} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                            <Download size={20} /> Exportar CSV
                        </button>
                    </div>

                    {/* Invoices List */}
                    <div className="table-container" style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>FECHA</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>CLIENTE / RFC</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>SUBTOTAL</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>IVA (16%)</th>
                                    <th style={{ padding: '16px 24px', fontSize: '12px', color: 'var(--text-muted)' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInvoices.map(inv => (
                                    <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '16px 24px', fontSize: '13px' }}>{new Date(inv.createdAt?.seconds * 1000 || inv.createdAt).toLocaleDateString()}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '700' }}>{inv.clientName}</div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.clientRfc}</div>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontWeight: '600' }}>${inv.totals?.subtotal?.toLocaleString()}</td>
                                        <td style={{ padding: '16px 24px', color: 'var(--accent)' }}>${inv.totals?.tax?.toLocaleString()}</td>
                                        <td style={{ padding: '16px 24px', fontWeight: '800' }}>${inv.totals?.total?.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {filteredInvoices.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No hay facturas registradas para este periodo.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Fiscal Summary Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '32px', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <TrendingUp size={20} color="var(--accent-light)" /> Totales del Periodo
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>INGRESOS BRUTOS</div>
                                <div style={{ fontSize: '24px', fontWeight: '800' }}>${summary.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>IVA TRASLADADO (16%)</div>
                                <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-light)' }}>${summary.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                            {summary.retentions > 0 && (
                                <div>
                                    <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>RETENCIONES</div>
                                    <div style={{ fontSize: '24px', fontWeight: '800', color: '#fb7185' }}>-${summary.retentions.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                                </div>
                            )}
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                            <div>
                                <div style={{ fontSize: '12px', opacity: 0.6, marginBottom: '4px' }}>TOTAL A REPORTAR</div>
                                <div style={{ fontSize: '32px', fontWeight: '900', color: '#10b981' }}>${(summary.subtotal + summary.tax - summary.retentions).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ background: '#f8fafc', border: '1px dashed var(--border)', padding: '24px', borderRadius: '24px' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--primary)' }}>Tip Contable</h4>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Recuerda que si estás en **RESICO**, tu tasa de ISR es muy baja (1% al 2.5%), pero se calcula sobre el Subtotal antes de impuestos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
