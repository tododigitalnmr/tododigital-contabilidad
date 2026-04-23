import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Lógica de Firebase vendrá aquí
        setTimeout(() => setLoading(false), 1500); 
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                padding: '48px 40px',
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <img src="/logo_contabilidad.png" alt="Logo" style={{ height: '80px', marginBottom: '24px', objectFit: 'contain' }} />
                    <h1 style={{ fontSize: '28px', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px' }}>
                        Portal Fiscal
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                        Gestión TodoDigital NMR Contabilidad
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                            Correo Electrónico
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="email"
                                placeholder="tu@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontSize: '15px'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                            Contraseña
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 12px 12px 40px',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    outline: 'none',
                                    fontSize: '15px'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            background: 'var(--accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '16px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Ingresar al Portal'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <a href="#" style={{ fontSize: '14px', color: 'var(--accent)', fontWeight: '500' }}>
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
            </div>
            
            <div style={{
                position: 'absolute',
                bottom: '30px',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '12px'
            }}>
                Explora la potencia de TodoDigital NMR &bull; CFDI 4.0 Compliance
            </div>
        </div>
    );
};

export default Login;
