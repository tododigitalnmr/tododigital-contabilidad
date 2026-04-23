import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download, Mail, ShieldCheck, CheckCircle, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const InvoiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const [invoiceData, setInvoiceData] = React.useState(null);

    React.useEffect(() => {
        if (id === 'FAC-NEW') {
            const saved = localStorage.getItem('lastInvoice');
            if (saved) setInvoiceData(JSON.parse(saved));
        } else {
            // Aquí se buscaría en Firestore. Por ahora usamos mock inteligente.
            setInvoiceData({
                id: id,
                clientName: 'CLIENTE DE PRUEBA SA DE CV',
                clientRfc: 'XAXX010101000',
                clientCp: '72000',
                items: [
                    { description: 'Desarrollo de Plataforma Web SaaS', quantity: 1, price: 1500.00, tax: 16 },
                    { description: 'Mantenimiento Mensual Cloud', quantity: 1, price: 500.00, tax: 16 }
                ],
                totals: { subtotal: 2000, tax: 320, total: 2320 },
                metodoPago: 'PUE',
                formaPago: '03',
                createdAt: new Date().toISOString()
            });
        }
    }, [id]);

    if (!invoiceData) return null;

    const invoice = {
        folio: invoiceData.id,
        fecha: invoiceData.createdAt,
        emisor: {
            nombre: currentTenant.razonSocial || currentTenant.name,
            rfc: currentTenant.rfc,
            regime: currentTenant.regimen || '601',
            domicilio: `CP: ${currentTenant.cp || '00000'}`,
        },
        receptor: {
            nombre: invoiceData.clientName,
            rfc: invoiceData.clientRfc,
            usoCFDI: 'G03 - Gastos en general',
            domicilio: invoiceData.clientCp
        },
        items: invoiceData.items.map(i => ({
            desc: i.description,
            qty: i.quantity,
            price: i.price,
            tax: i.price * (i.tax / 100),
            total: i.price * (1 + i.tax / 100)
        })),
        totals: invoiceData.totals,
        timbrado: {
            uuid: '550e8400-e29b-41d4-a716-446655440000',
            cert: '00001000000504465028',
            sello: 'SelloDigitalSat1234567890...'
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={{ paddingBottom: '100px' }}>
            {/* Header / Actions */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '32px',
                padding: '16px',
                background: 'white',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                        onClick={() => navigate('/invoices')}
                        style={{ padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>Vista Previa de Factura</h1>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{invoice.folio} • Generada Correctamente</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button style={{ 
                        padding: '10px 20px', 
                        borderRadius: '10px', 
                        border: '1px solid var(--border)', 
                        background: 'white', 
                        fontWeight: '600', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        cursor: 'pointer'
                    }}>
                        <Mail size={18} color="var(--accent)" /> Enviar
                    </button>
                    <button 
                        onClick={handlePrint}
                        style={{ 
                            padding: '10px 20px', 
                            borderRadius: '10px', 
                            background: 'var(--accent)', 
                            color: 'white', 
                            border: 'none', 
                            fontWeight: '700', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <Printer size={18} /> Imprimir / PDF
                    </button>
                </div>
            </div>

            {/* Invoice Sheet */}
            <div className="invoice-sheet" style={{ 
                background: 'white', 
                width: '100%', 
                maxWidth: '850px', 
                margin: '0 auto', 
                padding: '60px', 
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                minHeight: '1100px',
                position: 'relative'
            }}>
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {currentTenant.logo ? (
                            <img src={currentTenant.logo} alt="Logo" style={{ maxHeight: '120px', maxWidth: '280px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ padding: '16px', background: 'var(--accent-soft)', borderRadius: '20px' }}>
                                <ShieldCheck size={56} color="var(--accent)" />
                            </div>
                        )}
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.5px' }}>{currentTenant.razonSocial || currentTenant.name}</h2>
                            <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>Comprobante Fiscal Digital por Internet</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Folio Fiscal (UUID)</div>
                        <div style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>{invoice.timbrado.uuid}</div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>FOLIO</div>
                                <div style={{ fontSize: '15px', fontWeight: '800' }}>{invoice.folio}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>FECHA EMISIÓN</div>
                                <div style={{ fontSize: '15px', fontWeight: '800' }}>{new Date(invoice.fecha).toLocaleDateString('es-MX')}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emisor / Receptor Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', marginBottom: '40px' }}>
                    <div>
                        <div style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>Emisor (Quien envía)</span>
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: '800' }}>{invoice.emisor.nombre}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>RFC: <span style={{ fontWeight: '700' }}>{invoice.emisor.rfc}</span></p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>Régimen: {invoice.emisor.regime}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>CP: {invoice.emisor.domicilio.split(', ')[2]}</p>
                    </div>
                    <div>
                        <div style={{ borderBottom: '2px solid var(--accent)', paddingBottom: '8px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase' }}>Receptor (Cliente)</span>
                        </div>
                        <p style={{ margin: '4px 0', fontSize: '15px', fontWeight: '800' }}>{invoice.receptor.nombre}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>RFC: <span style={{ fontWeight: '700' }}>{invoice.receptor.rfc}</span></p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>Uso CFDI: {invoice.receptor.usoCFDI}</p>
                        <p style={{ margin: '4px 0', fontSize: '13px' }}>CP: {invoice.receptor.domicilio}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '60px' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderTop: '2px solid var(--primary)', borderBottom: '2px solid var(--primary)' }}>
                            <th style={{ padding: '16px 12px', fontSize: '12px', textAlign: 'left', width: '80px' }}>CANT</th>
                            <th style={{ padding: '16px 12px', fontSize: '12px', textAlign: 'left' }}>DESCRIPCIÓN / CLAVE SAT</th>
                            <th style={{ padding: '16px 12px', fontSize: '12px', textAlign: 'right', width: '150px' }}>VALOR UNITARIO</th>
                            <th style={{ padding: '16px 12px', fontSize: '12px', textAlign: 'right', width: '150px' }}>IMPORTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '700' }}>{item.qty}.00</td>
                                <td style={{ padding: '16px 12px' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{item.desc}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Clave SAT: 81111500 | Unidad: E48</div>
                                </td>
                                <td style={{ padding: '16px 12px', fontSize: '14px', textAlign: 'right' }}>${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '16px 12px', fontSize: '14px', fontWeight: '700', textAlign: 'right' }}>${(item.qty * item.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ width: '400px' }}>
                        <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: '800', marginBottom: '8px' }}>IMPORTE CON LETRA</div>
                            <div style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase' }}>DOS MIL TRESCIENTOS VEINTE PESOS 00/100 MXN</div>
                        </div>
                    </div>
                    <div style={{ width: '250px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px' }}>Subtotal:</span>
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>${invoice.totals.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '14px' }}>IVA Trasladado:</span>
                            <span style={{ fontSize: '14px', fontWeight: '700' }}>${invoice.totals.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div style={{ height: '2px', background: 'var(--primary)', margin: '12px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '18px', fontWeight: '800' }}>Total:</span>
                            <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--accent)' }}>${invoice.totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* SAT Metadata (Mock Seals) */}
                <div style={{ position: 'absolute', bottom: '60px', left: '60px', right: '60px' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <div style={{ width: '120px', height: '120px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyItems: 'center', textAlign: 'center' }}>
                           <span style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 'auto' }}>CÓDIGO QR<br/>SOPORTE SAT 2026</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '4px' }}>SELLO DIGITAL DEL EMISOR</div>
                            <div style={{ fontSize: '8px', wordBreak: 'break-all', opacity: 0.6 }}>asdf98a7sdf98a7sdf98a7sdf98a7sdf98a7sdf98a7sdf98a7sdf98a7sdf89a7sdf987a98sdf7a89sdf789a7fd9as7f89asdfasf89asdf789as7fd89as7f98as7f98as7df</div>
                            <div style={{ height: '8px' }}></div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', marginBottom: '4px' }}>CADENA ORIGINAL DEL COMPLEMENTO DE CERTIFICACIÓN DIGITAL DEL SAT</div>
                            <div style={{ fontSize: '8px', wordBreak: 'break-all', opacity: 0.6 }}>||1.1|550e8400-e29b-41d4-a716-446655440000|2024-05-18T12:00:00|SAT970701NN3|SelloEmisor123...|00001000000504465028||</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '10px', color: 'var(--text-light)', fontStyle: 'italic' }}>
                        Este documento es una representación impresa de un CFDI 4.0 - Generado por TodoDigital NMR
                    </div>
                </div>
            </div>

            <style>{`
                @media print {
                    body { background: white !important; }
                    .sidebar, .header-actions, button { display: none !important; }
                    main { margin-left: 0 !important; padding: 0 !important; }
                    .invoice-sheet { box-shadow: none !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
                    .layout-header { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default InvoiceDetail;
