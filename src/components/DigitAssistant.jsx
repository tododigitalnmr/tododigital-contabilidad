import React, { useState } from 'react';
import { Sparkles, X, Search, Check, Brain, Lightbulb } from 'lucide-react';

const DigitAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);

    const KNOWLEDGE_BASE = [
        { label: 'Desarrollo de Software / Apps', code: '81111500', unit: 'E48', type: 'web' },
        { label: 'Diseño de Páginas Web', code: '81112101', unit: 'E48', type: 'web' },
        { label: 'Servicios de Estética / Manicure', code: '94131602', unit: 'E48', type: 'spa' },
        { label: 'Vidrio Templado / Cancelería', code: '30171505', unit: 'H87', type: 'glass' },
        { label: 'Instalación de Vidrios', code: '72152401', unit: 'E48', type: 'glass' },
        { label: 'Servicios de Consultoría Digital', code: '80101509', unit: 'E48', type: 'web' }
    ];

    const handleSearch = (val) => {
        setSearch(val);
        if (val.length > 2) {
            const filtered = KNOWLEDGE_BASE.filter(k => 
                k.label.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
            {/* Main Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '30px',
                        background: 'linear-gradient(135deg, var(--accent) 0%, #1d4ed8 100%)',
                        border: 'none',
                        color: 'white',
                        boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <Sparkles size={28} />
                </button>
            )}

            {/* Assistant Panel */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '500px',
                    background: 'white',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '12px' }}>
                                <Brain size={24} color="var(--accent-light)" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '800', fontSize: '18px' }}>Digit AI</div>
                                <div style={{ fontSize: '12px', opacity: 0.7 }}>Tu Copiloto Fiscal</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.6 }}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                <Lightbulb size={20} color="var(--accent)" style={{ marginTop: '2px' }} />
                                <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, lineHeight: '1.5' }}>
                                    ¡Hola! Soy **Digit**. Puedo ayudarte a encontrar la clave del SAT correcta para tus servicios. ¿Qué estás facturando hoy?
                                </p>
                            </div>
                        </div>

                        {/* Search Input */}
                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input 
                                type="text"
                                placeholder="Ej: Vidrio templado o Uñas..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', fontSize: '14px' }}
                            />
                        </div>

                        {/* Suggestions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {suggestions.map((s, i) => (
                                <div key={i} style={{ padding: '12px', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '13px', color: 'var(--primary)' }}>{s.label}</span>
                                        <span style={{ fontSize: '11px', background: 'var(--accent-soft)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>SAT {s.code}</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Sugerencia optimizada para CFDI 4.0</div>
                                </div>
                            ))}
                            {search.length > 2 && suggestions.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-light)', fontSize: '13px' }}>
                                    No encontré una clave exacta, pero podemos intentar con términos más generales.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{ padding: '16px', borderTop: '1px solid var(--border)', background: '#f8fafc', textAlign: 'center', fontSize: '11px', color: 'var(--text-light)' }}>
                        Respaldado por TodoDigital NMR IA Engine
                    </div>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4); }
                    50% { transform: scale(1.05); box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.6); }
                    100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4); }
                }
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default DigitAssistant;
