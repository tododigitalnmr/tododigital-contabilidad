import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Mail, ShieldCheck, CheckCircle, Share2, FileText, Repeat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const QuoteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const [quoteData, setQuoteData] = React.useState(null);

    React.useEffect(() => {
        if (id === 'COT-NEW') {
            const saved = localStorage.getItem('lastQuote');
            if (saved) setQuoteData(JSON.parse(saved));
        } else {
            // Mock data para folios existentes
            setQuoteData({
                id: id,
                clientName: 'CLIENTE DE PRUEBA SA DE CV',
                clientRfc: 'XAXX010101000',
                clientCp: '72000',
                items: [
                    { description: 'Ventana de Alumnio Premium', quantity: 2, price: 4500.00, tax: 16 },
                    { description: 'Instalación y Vidrio', quantity: 1, price: 1500.00, tax: 16 }
                ],
                totals: { subtotal: 10500, tax: 1680, total: 12180 },
                validDays: 15,
                createdAt: new Date().toISOString()
            });
        }
    }, [id]);

    if (!quoteData) return null;

    const handlePrint = () => window.print();

    const handleConvertToInvoice = () => {
        // Guardamos los datos en localStorage para que CreateInvoice los tome
        localStorage.setItem('convertFromQuote', JSON.stringify(quoteData));
        navigate('/invoices/new?fromQuote=' + quoteData.id);
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Header / Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button onClick={() => navigate('/quotes')} style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}><ArrowLeft size={18} /></button>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>Vista Previa de Cotización</h1>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{quoteData.id} • Válida por {quoteData.validDays} días</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={handleConvertToInvoice}
                        style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #10b981', background: '#ecfdf5', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                    >
                        <Repeat size={18} /> Convertir a Factura
                    </button>
                    <button onClick={handlePrint} style={{ padding: '10px 20px', borderRadius: '10px', background: 'var(--accent)', color: 'white', border: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Printer size={18} /> Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* Quote Sheet */}
            <div className="invoice-sheet" style={{ background: 'white', width: '100%', maxWidth: '850px', margin: '0 auto', padding: '60px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', minHeight: '1000px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {currentTenant.logo ? (
                            <img src={currentTenant.logo} alt="Logo" style={{ maxHeight: '100px' }} />
                        ) : (
                            <div style={{ padding: '16px', background: 'var(--accent-soft)', borderRadius: '20px' }}><ShieldCheck size={40} color="var(--accent)" /></div>
                        )}
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '900', color: 'var(--primary)' }}>{currentTenant.name}</h2>
                            <p style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '800', textTransform: 'uppercase' }}>COTIZACIÓN / PRESUPUESTO</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>FOLIO</div>
                        <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)' }}>{quoteData.id}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800', marginTop: '12px' }}>FECHA</div>
                        <div style={{ fontSize: '14px', fontWeight: '700' }}>{new Date(quoteData.createdAt).toLocaleDateString('es-MX')}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '40px' }}>
                    <div>
                        <div style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>SOLICITANTE / CLIENTE</span>
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: '800' }}>{quoteData.clientName}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>RFC: {quoteData.clientRfc}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>CP: {quoteData.clientCp}</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>MÉTODO DE PAGO ESTIMADO</p>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>Transferencia Electrónica (PUE)</p>
                        <p style={{ margin: '16px 0 8px 0', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)' }}>VALIDEZ</p>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>Esta cotización es válida por {quoteData.validDays} días naturales.</p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderTop: '2px solid var(--primary)', borderBottom: '2px solid var(--primary)' }}>
                            <th style={{ padding: '16px 12px', fontSize: '11px', textAlign: 'left' }}>CANT</th>
                            <th style={{ padding: '16px 12px', fontSize: '11px', textAlign: 'left' }}>DESCRIPCIÓN</th>
                            <th style={{ padding: '16px 12px', fontSize: '11px', textAlign: 'right' }}>PRECIO UNITARIO</th>
                            <th style={{ padding: '16px 12px', fontSize: '11px', textAlign: 'right' }}>SUBTOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quoteData.items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '700' }}>{item.quantity}.00</td>
                                <td style={{ padding: '16px 12px', fontSize: '14px' }}>{item.description}</td>
                                <td style={{ padding: '16px 12px', fontSize: '14px', textAlign: 'right' }}>${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '700', textAlign: 'right' }}>${(item.quantity * item.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '14px' }}>Subtotal:</span><span style={{ fontSize: '14px', fontWeight: '700' }}>${quoteData.totals.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '14px' }}>IVA 16%:</span><span style={{ fontSize: '14px', fontWeight: '700' }}>${quoteData.totals.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                        <div style={{ height: '2px', background: 'var(--primary)', margin: '12px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: '18px', fontWeight: '800' }}>Total:</span><span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>${quoteData.totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span></div>
                    </div>
                </div>

                <div style={{ marginTop: '100px', borderTop: '1px solid var(--border)', paddingTop: '24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Cualquier duda sobre este presupuesto, por favor contactar a <strong>{currentTenant.name}</strong>.</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '8px' }}>Generado por TodoDigital NMR</p>
                </div>
            </div>

            <style>{`
                @media print {
                    body { background: white !important; }
                    .sidebar, .header-actions, button { display: none !important; }
                    main { margin-left: 0 !important; padding: 0 !important; }
                    .invoice-sheet { box-shadow: none !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default QuoteDetail;
