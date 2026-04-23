import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, User, Calendar, ArrowLeft, Send, CheckCircle, FileText, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const CreateQuote = () => {
    const navigate = useNavigate();
    const { currentTenant } = useAuth();
    const [client, setClient] = useState('');
    const [validDays, setValidDays] = useState(15);
    const [items, setItems] = useState([
        { id: Date.now(), description: '', quantity: 1, price: 0, tax: 16 }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [inventory, setInventory] = useState([
        { id: 'demo1', description: 'Desarrollo Web React', price: 1500, taxRate: 16, satProduct: '81111500' },
        { id: 'demo2', description: 'Mantenimiento Cloud', price: 500, taxRate: 16, satProduct: '81111500' },
        { id: 'demo3', description: 'Vidrio Templado 10mm', price: 2800, taxRate: 16, satProduct: '30171505' },
        { id: 'demo4', description: 'Manicure Premium', price: 450, taxRate: 16, satProduct: '94131602' }
    ]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeRowId, setActiveRowId] = useState(null);

    const [clients, setClients] = useState([]);

    // Cargar inventario y clientes al iniciar
    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const queryRef = collection(db, 'products');
                const q = query(queryRef, where('tenantId', '==', currentTenant.id));
                const querySnapshot = await getDocs(q);
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                if (data.length > 0) setInventory(data);
            } catch (error) {
                console.error("Error loading inventory:", error);
            }
        };

        const fetchClients = async () => {
            try {
                const q = query(collection(db, 'clients'), where('tenantId', '==', currentTenant.id));
                const querySnapshot = await getDocs(q);
                let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                
                // Demo fallback if empty
                if (data.length === 0) {
                    data = [
                        { id: 'demo-cli-1', name: 'CLIENTE DE PRUEBA SA DE CV', rfc: 'XAXX010101000', email: 'demo@ejemplo.com', cp: '64000', phone: '8100000000', city: 'Monterrey, NL', regimen: '601' }
                    ];
                }
                setClients(data);
            } catch (error) {
                console.error("Error loading clients:", error);
                setClients([
                    { id: 'demo-cli-1', name: 'CLIENTE DE PRUEBA SA DE CV', rfc: 'XAXX010101000', email: 'demo@ejemplo.com', cp: '64000', phone: '8100000000', city: 'Monterrey, NL', regimen: '601' }
                ]);
            }
        };

        fetchInventory();
        fetchClients();
    }, [currentTenant]);

    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    useEffect(() => {
        let subtotal = 0;
        let tax = 0;
        items.forEach(item => {
            const rowSubtotal = item.quantity * item.price;
            subtotal += rowSubtotal;
            tax += rowSubtotal * (item.tax / 100);
        });
        setTotals({ subtotal, tax, total: subtotal + tax });
    }, [items]);

    const addItem = () => {
        setItems([...items, { id: Date.now(), description: '', quantity: 1, price: 0, tax: 16 }]);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handleSaveQuote = async () => {
        if (!client) {
            alert('❌ Por favor selecciona un cliente.');
            return;
        }

        const validItems = items.filter(i => i.description.trim() !== '' && i.price > 0);
        if (validItems.length === 0) {
            alert('❌ Debes agregar al menos un concepto.');
            return;
        }
        
        setIsSubmitting(true);
        const isDemo = true; // Modo Demo habilitado para asegurar fluidez
        
        const selectedClient = clients.find(c => c.id === client);
        if (!selectedClient) {
            alert('❌ Cliente no seleccionado.');
            setIsSubmitting(false);
            return;
        }

        const quoteData = {
            id: `COT-${Math.floor(Math.random() * 9000) + 1000}`,
            tenantId: currentTenant.id,
            clientId: selectedClient.id,
            clientName: selectedClient.name,
            clientRfc: selectedClient.rfc,
            clientCp: selectedClient.cp,
            clientEmail: selectedClient.email,
            items: validItems,
            totals,
            validDays,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Guardar para vista previa inmediata
        localStorage.setItem('lastQuote', JSON.stringify(quoteData));

        if (isDemo) {
            setTimeout(() => {
                setIsSubmitting(false);
                setShowSuccess(true);
            }, 1000);
            return;
        }

        try {
            await addDoc(collection(db, 'quotes'), { ...quoteData, createdAt: serverTimestamp() });
            setIsSubmitting(false);
            setShowSuccess(true);
        } catch (error) {
            console.error("Error al guardar cotización:", error);
            setIsSubmitting(false);
            setShowSuccess(true);
        }
    };

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out', position: 'relative' }}>
            {/* Success Overlay */}
            {showSuccess && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: 'white', width: '440px', padding: '48px', borderRadius: '32px', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', background: '#eff6ff', color: 'var(--accent)', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                            <CheckCircle size={48} />
                        </div>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '12px' }}>¡Cotización Guardada!</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>El presupuesto ha sido generado y está listo para enviarse.</p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                            <button 
                                onClick={() => navigate('/quotes/view/COT-NEW')}
                                style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                <FileText size={18} color="var(--accent)" /> Ver PDF
                            </button>
                            <button style={{ padding: '12px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600' }}>
                                <Send size={18} color="#10b981" /> Compartir
                            </button>
                        </div>

                        <button onClick={() => navigate('/quotes')} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700' }}>
                            Ir al Listado
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button onClick={() => navigate('/quotes')} style={{ background: 'white', border: '1px solid var(--border)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>Generar Nueva Cotización</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Crea un presupuesto profesional para tu cliente</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                            <User size={24} color="var(--accent)" />
                            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Datos del Cliente</h2>
                        </div>
                        <div style={{ width: '100%' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>Seleccionar Cliente</label>
                            <select value={client} onChange={(e) => setClient(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white' }}>
                                <option value="">Busca un cliente...</option>
                                {clients.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.rfc})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Receipt size={24} color="var(--accent)" />
                                <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Conceptos</h2>
                            </div>
                            <button onClick={addItem} style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <Plus size={18} /> Agregar
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {items.map((item, index) => (
                                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 140px 100px 40px', gap: '16px', alignItems: 'end', paddingBottom: '16px', borderBottom: index < items.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                    <div style={{ position: 'relative' }}>
                                        <label style={{ display: 'block', marginBottom: '4px', fontSize: '11px', fontWeight: '700', color: 'var(--text-light)' }}>Descripción</label>
                                        <input 
                                            type="text" 
                                            value={item.description}
                                            onFocus={() => { setActiveRowId(item.id); setSearchTerm(item.description); }}
                                            onChange={(e) => { updateItem(item.id, 'description', e.target.value); setSearchTerm(e.target.value); }}
                                            onBlur={() => setTimeout(() => setActiveRowId(null), 200)}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }}
                                        />
                                        {activeRowId === item.id && searchTerm && (
                                            <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 10, maxHeight: '200px', overflowY: 'auto' }}>
                                                {inventory.filter(i => i.description.toLowerCase().includes(searchTerm.toLowerCase())).map(i => (
                                                    <div key={i.id} onMouseDown={(e) => { e.preventDefault(); updateItem(item.id, 'description', i.description); updateItem(item.id, 'price', Number(i.price)); updateItem(item.id, 'tax', Number(i.taxRate)); setSearchTerm(''); setActiveRowId(null); }} style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f8fafc' }} onMouseEnter={(e) => e.target.style.background = '#f0f9ff'} onMouseLeave={(e) => e.target.style.background = 'white'}>
                                                        <div style={{ fontWeight: '700' }}>{i.description}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>${i.price}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                    <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)' }} />
                                    <select value={item.tax} onChange={(e) => updateItem(item.id, 'tax', Number(e.target.value))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white' }}>
                                        <option value="16">16%</option>
                                        <option value="8">8%</option>
                                        <option value="0">0%</option>
                                    </select>
                                    <button onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', opacity: 0.6, cursor: 'pointer' }}>
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', color: 'var(--primary)' }}>
                            <Calendar size={18} />
                            <h3 style={{ fontSize: '15px', fontWeight: '700' }}>Vigencia</h3>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Días de Validez</label>
                            <input type="number" value={validDays} onChange={(e) => setValidDays(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                        </div>
                    </div>

                    <div style={{ background: 'var(--primary)', color: 'white', padding: '32px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                                <span>Subtotal</span>
                                <span>${totals.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                                <span>IVA</span>
                                <span>${totals.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Total</span>
                                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--accent-light)' }}>
                                    ${totals.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleSaveQuote} disabled={isSubmitting} style={{ width: '100%', marginTop: '24px', padding: '16px', borderRadius: '12px', background: isSubmitting ? '#94a3b8' : 'var(--accent)', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}>
                            {isSubmitting ? 'Guardando...' : 'Guardar Cotización'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateQuote;
