import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Layout, Building2, Settings, LogOut, Plus, Zap, FileText, ClipboardList, Calculator } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DigitAssistant from '../components/DigitAssistant';

const AppLayout = ({ children }) => {
  const { currentTenant, availableTenants, switchBusiness } = useAuth();
  const [showSwitch, setShowSwitch] = React.useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: <Layout size={20} />, label: 'Dashboard', path: '/' },
    { icon: <FileText size={20} />, label: 'Facturación', path: '/invoices' },
    { icon: <ClipboardList size={20} />, label: 'Cotizaciones', path: '/quotes' },
    { icon: <Building2 size={20} />, label: 'Clientes', path: '/clients' },
    { icon: <Zap size={20} />, label: 'Inventario', path: '/inventory' },
    { icon: <Calculator size={20} />, label: 'Contabilidad', path: '/reports' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: 'var(--sidebar-width)', 
        background: 'var(--primary)', 
        color: 'white', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px' }}>
          <img src="/logo_contabilidad.png" alt="TodoDigital Logo" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Menú Principal</div>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              style={{ 
                display: 'flex', 
                gap: '12px', 
                alignItems: 'center', 
                padding: '12px', 
                borderRadius: '8px', 
                background: location.pathname === item.path ? 'var(--accent)' : 'transparent',
                marginBottom: '8px', 
                cursor: 'pointer',
                color: 'white',
                opacity: location.pathname === item.path ? 1 : 0.6,
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          
          <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-light)', marginBottom: '8px' }}>
                  <Zap size={16} fill="var(--accent-light)" />
                  <span style={{ fontSize: '12px', fontWeight: '800' }}>Digit AI Activo</span>
              </div>
              <p style={{ fontSize: '11px', opacity: 0.6, margin: 0 }}>Usa el botón flotante en cualquier momento.</p>
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.6, cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 'var(--sidebar-width)', padding: '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setShowSwitch(!showSwitch)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
                {currentTenant?.name}
              </h1>
              <span style={{ color: 'var(--accent)', fontSize: '12px', background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>CAMBIAR</span>
            </div>
            
            {showSwitch && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                width: '320px', 
                background: 'white', 
                borderRadius: '16px', 
                boxShadow: 'var(--shadow-lg)', 
                border: '1px solid var(--border)',
                marginTop: '12px',
                zIndex: 100,
                overflow: 'hidden',
                animation: 'fadeIn 0.2s ease-out'
              }}>
                <div style={{ padding: '16px', borderBottom: '1px solid var(--border)', background: '#f8fafc', fontSize: '12px', fontWeight: '700', color: 'var(--text-light)' }}>
                  MIS NEGOCIOS
                </div>
                {availableTenants.map(t => (
                  <div 
                    key={t.id}
                    onClick={() => {
                      switchBusiness(t.id);
                      setShowSwitch(false);
                    }}
                    style={{ 
                      padding: '16px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '4px',
                      cursor: 'pointer',
                      background: currentTenant?.id === t.id ? '#f0f9ff' : 'white',
                      borderLeft: currentTenant?.id === t.id ? '4px solid var(--accent)' : '4px solid transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{t.name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-light)' }}>RFC: {t.rfc}</span>
                  </div>
                ))}
              </div>
            )}
            <p style={{ color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Gestión Premium Especializada</p>
          </div>

          <Link to="/invoices/new" style={{ textDecoration: 'none' }}>
            <button style={{ 
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
            }}>
              <Plus size={20} /> Nueva Factura
            </button>
          </Link>
        </header>

        {children}
        <DigitAssistant />
      </main>
    </div>
  );
};

export default AppLayout;
