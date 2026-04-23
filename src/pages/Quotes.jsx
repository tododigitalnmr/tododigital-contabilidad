import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, FileText, Download, Trash2, Eye, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

const Quotes = () => {
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const q = query(
                    collection(db, 'quotes'),
                    where('tenantId', '==', currentTenant.id),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setQuotes(data);
            } catch (error) {
                console.error("Error fetching quotes:", error);
                // Fallback a demo data si falla Firestore
                setQuotes([
                    { id: 'COT-7721', clientName: 'Vidrios y Cristales del Norte', total: 12500, status: 'pending', createdAt: new Date().toISOString() },
                    { id: 'COT-7722', clientName: 'Inmobiliaria Premium', total: 43200, status: 'accepted', createdAt: new Date().toISOString() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchQuotes();
    }, [currentTenant]);

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Cotizaciones</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Gestiona tus presupuestos y conviértelos en ventas</p>
                </div>
                <button 
                    onClick={() => navigate('/quotes/new')}
                    style={{ 
                        background: 'var(--accent)', 
                        color: 'white', 
                        padding: '12px 24px', 
                        borderRadius: '12px', 
                        border: 'none', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '10px',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Nueva Cotización
                </button>
            </div>

            <div style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por cliente o folio..." 
                            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                        />
                    </div>
                    <button style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600' }}>
                        <Filter size={18} /> Filtros
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                            <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Folio</th>
                            <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cliente</th>
                            <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</th>
                            <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</th>
                            <th style={{ padding: '16px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                            <th style={{ padding: '16px', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '16px', fontWeight: '700', color: 'var(--primary)' }}>{quote.id}</td>
                                <td style={{ padding: '16px' }}>{quote.clientName}</td>
                                <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                    {new Date(quote.createdAt).toLocaleDateString('es-MX')}
                                </td>
                                <td style={{ padding: '16px', fontWeight: '700' }}>
                                    ${quote.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ 
                                        padding: '4px 12px', 
                                        borderRadius: '20px', 
                                        fontSize: '11px', 
                                        fontWeight: '700',
                                        background: quote.status === 'accepted' ? '#ecfdf5' : '#fff7ed',
                                        color: quote.status === 'accepted' ? '#10b981' : '#f97316',
                                        textTransform: 'uppercase'
                                    }}>
                                        {quote.status === 'accepted' ? 'Aceptada' : 'Pendiente'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => navigate(`/quotes/view/${quote.id}`)}
                                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}
                                        >
                                            <Eye size={18} color="var(--text-main)" />
                                        </button>
                                        <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', cursor: 'pointer' }}>
                                            <MoreVertical size={18} color="var(--text-muted)" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && quotes.length === 0 && (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <ClipboardList size={48} color="var(--border)" style={{ marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--text-muted)' }}>No hay cotizaciones registradas</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quotes;
