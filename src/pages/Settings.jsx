import React, { useState, useEffect } from 'react';
import { Shield, Key, Building, FileCheck, Upload, AlertCircle, Save, CheckCircle2, Globe, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { REGIMENES_FISCALES } from '../constants/sat';

const Settings = () => {
    const { currentTenant, availableTenants, switchBusiness, updateTenant } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [saveStatus, setSaveStatus] = useState(null);
    const [logoPreview, setLogoPreview] = useState(currentTenant?.logo || null);
    const [csdCer, setCsdCer] = useState(currentTenant?.csdCer || null);
    const [csdKey, setCsdKey] = useState(currentTenant?.csdKey || null);
    const [razonSocial, setRazonSocial] = useState(currentTenant?.razonSocial || '');
    const [rfc, setRfc] = useState(currentTenant?.rfc || '');
    const [cp, setCp] = useState(currentTenant?.cp || '');
    const [name, setName] = useState(currentTenant?.name || '');
    const [regimen, setRegimen] = useState(currentTenant?.regimen || '');

    const handleSave = () => {
        // Persistir cambios en el contexto global
        updateTenant(currentTenant.id, { 
            logo: logoPreview,
            csdCer: csdCer,
            csdKey: csdKey,
            razonSocial: razonSocial,
            rfc: rfc,
            cp: cp,
            name: name,
            regimen: regimen
        });
        
        setSaveStatus('success');
        setTimeout(() => setSaveStatus(null), 3000);
    };

    // Sincronizar datos locales cuando cambia el negocio
    useEffect(() => {
        setLogoPreview(currentTenant?.logo || null);
        setCsdCer(currentTenant?.csdCer || null);
        setCsdKey(currentTenant?.csdKey || null);
        setRazonSocial(currentTenant?.razonSocial || '');
        setRfc(currentTenant?.rfc || '');
        setCp(currentTenant?.cp || '');
        setName(currentTenant?.name || '');
        setRegimen(currentTenant?.regimen || '');
    }, [currentTenant]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCerUpload = (e) => {
        const file = e.target.files[0];
        if (file) setCsdCer(file.name);
    };

    const handleKeyUpload = (e) => {
        const file = e.target.files[0];
        if (file) setCsdKey(file.name);
    };

    const tabs = [
        { id: 'perfil', label: 'Perfil del Negocio', icon: <Building size={18} /> },
        { id: 'sellos', label: 'Sellos Digitales (CSD)', icon: <FileCheck size={18} /> },
        { id: 'seguridad', label: 'Seguridad y API', icon: <Shield size={18} /> },
    ];

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Configuración</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Gestiona la identidad y credenciales de <b>{currentTenant.name}</b></p>
                </div>
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '12px' }}>
                    {availableTenants.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => switchBusiness(t.id)}
                            style={{ 
                                padding: '8px 12px', 
                                fontSize: '12px', 
                                fontWeight: '700', 
                                borderRadius: '8px', 
                                border: 'none',
                                background: currentTenant.id === t.id ? 'white' : 'transparent',
                                color: currentTenant.id === t.id ? 'var(--accent)' : 'var(--text-muted)',
                                boxShadow: currentTenant.id === t.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {t.name.split(' ')[0]}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
                
                {/* Sidebar Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 20px',
                                borderRadius: '12px',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--accent-soft)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-main)',
                                fontWeight: activeTab === tab.id ? '700' : '500',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            <span style={{ fontSize: '14px' }}>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ background: 'white', borderRadius: '24px', border: '1px solid var(--border)', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
                    
                    {activeTab === 'perfil' && (
                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: 'var(--accent-soft)', borderRadius: '10px' }}><Briefcase size={20} color="var(--accent)" /></div>
                                Identidad del Negocio
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '32px', alignItems: 'center', marginBottom: '32px', background: '#f8fafc', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ 
                                        width: '120px', 
                                        height: '120px', 
                                        background: 'white', 
                                        borderRadius: '24px', 
                                        border: '2px solid var(--border)', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        overflow: 'hidden'
                                    }}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <Building size={48} color="var(--text-light)" />
                                        )}
                                    </div>
                                    <label style={{ 
                                        position: 'absolute', 
                                        bottom: '-10px', 
                                        right: '-10px', 
                                        background: 'var(--accent)', 
                                        color: 'white', 
                                        width: '36px', 
                                        height: '36px', 
                                        borderRadius: '12px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                                    }}>
                                        <Upload size={18} />
                                        <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
                                    </label>
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>Logo del Negocio</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Carga el logo oficial para <b>{currentTenant.name}</b>. Se usará en la parte superior de todas tus facturas y correos.</p>
                                    <button style={{ marginTop: '12px', background: 'transparent', border: '1px solid var(--accent)', color: 'var(--accent)', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Eliminar logo</button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Nombre de Marca / Comercial</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', background: '#f8fafc' }} 
                                    />
                                    <p style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '6px' }}>Este es el nombre que verán tus clientes en el sistema.</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Razón Social (Legal SAT)</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej. Juan Pérez o Empresa S.A. de C.V." 
                                        value={razonSocial}
                                        onChange={(e) => setRazonSocial(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>RFC</label>
                                    <input 
                                        type="text" 
                                        value={rfc}
                                        onChange={(e) => setRfc(e.target.value.toUpperCase())}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', fontWeight: '600' }} 
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Código Postal</label>
                                    <input 
                                        type="text" 
                                        placeholder="50000" 
                                        value={cp}
                                        onChange={(e) => setCp(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px' }} 
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Régimen Fiscal</label>
                                    <select 
                                        value={regimen}
                                        onChange={(e) => setRegimen(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px', background: 'white' }} 
                                    >
                                        <option value="">Selecciona tu régimen fiscal...</option>
                                        {REGIMENES_FISCALES.map(r => (
                                            <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'sellos' && (
                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div>
                                    <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', background: 'var(--accent-soft)', borderRadius: '10px' }}><FileCheck size={20} color="var(--accent)" /></div>
                                        Certificados de Sello Digital (CSD)
                                    </h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Necesarios para que el SAT autorice tus facturas legales.</p>
                                </div>
                                <span style={{ padding: '6px 12px', background: '#fef2f2', color: '#ef4444', borderRadius: '20px', fontSize: '11px', fontWeight: '700' }}>DEMO MODE: SIN SELLOS</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <label style={{ border: '2px dashed var(--border)', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: csdCer ? '#f0f9ff' : 'transparent', borderColor: csdCer ? 'var(--accent)' : 'var(--border)' }}>
                                        <div style={{ width: '48px', height: '48px', background: csdCer ? 'var(--accent-soft)' : '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Upload size={24} color={csdCer ? 'var(--accent)' : 'var(--text-muted)'} />
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                                            {csdCer ? csdCer : 'Cargar archivo .CER'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>Certificado Público de Sello</div>
                                        <input type="file" hidden accept=".cer" onChange={handleCerUpload} />
                                    </label>
                                    <label style={{ border: '2px dashed var(--border)', borderRadius: '20px', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: csdKey ? '#f0f9ff' : 'transparent', borderColor: csdKey ? 'var(--accent)' : 'var(--border)' }}>
                                        <div style={{ width: '48px', height: '48px', background: csdKey ? 'var(--accent-soft)' : '#f1f5f9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                            <Key size={24} color={csdKey ? 'var(--accent)' : 'var(--text-muted)'} />
                                        </div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
                                            {csdKey ? csdKey : 'Cargar archivo .KEY'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>Llave Privada de Sello</div>
                                        <input type="file" hidden accept=".key" onChange={handleKeyUpload} />
                                    </label>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Contraseña de los Sellos (CSD)</label>
                                    <input type="password" placeholder="Tu contraseña definida en Certifica" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none' }} />
                                </div>

                                <div style={{ background: '#ecfdf5', border: '1px solid #d1fae5', padding: '20px', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                                    <Shield color="#059669" size={24} />
                                    <div style={{ fontSize: '13px', color: '#065f46', lineHeight: '1.5' }}>
                                        <b>Seguridad TodoDigital:</b> Tus sellos se encriptan punto a punto. Nunca almacenamos la llave privada en texto plano en nuestros servidores.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seguridad' && (
                        <div style={{ animation: 'slideUp 0.3s ease-out' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '8px', background: 'var(--accent-soft)', borderRadius: '10px' }}><Shield size={20} color="var(--accent)" /></div>
                                Conectividad y API
                            </h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Facturapi Secret Key (Modo Test/Live)</label>
                                    <div style={{ position: 'relative' }}>
                                        <input 
                                            type="password" 
                                            placeholder="sk_test_..." 
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', background: '#f8fafc' }} 
                                        />
                                        <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: '#10b981', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>CONECTADO</div>
                                    </div>
                                </div>

                                <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--primary)', marginBottom: '16px' }}>Auditoría de Seguridad</h3>
                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {[
                                            'Aislamiento Multi-negocio Activo',
                                            'Encriptación SSL de 256 bits',
                                            'Reglas de Seguridad Cloud Firestore',
                                            'Protección contra inyección de cabeceras'
                                        ].map((check, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--text-muted)' }}>
                                                <CheckCircle2 size={16} color="#10b981" /> {check}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            onClick={handleSave}
                            style={{ 
                                background: saveStatus === 'success' ? '#10b981' : 'var(--accent)', 
                                color: 'white', 
                                padding: '14px 40px', 
                                borderRadius: '14px', 
                                border: 'none', 
                                fontWeight: '700', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}
                        >
                            {saveStatus === 'success' ? <><CheckCircle2 size={20} /> ¡Configuración Guardada!</> : <><Save size={20} /> Guardar Cambios</>}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Settings;
