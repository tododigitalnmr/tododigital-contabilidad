import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Layout, Building2, Settings, LogOut, Plus, Zap, FileText, ClipboardList, Calculator, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import DigitAssistant from '../components/DigitAssistant';

const AppLayout = ({ children }) => {
  const { currentTenant, availableTenants, switchBusiness } = useAuth();
  const [showSwitch, setShowSwitch] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 1024);
  const location = useLocation();

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)', position: 'relative' }}>
      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 45,
            animation: 'fadeIn 0.2s ease'
          }} 
        />
      )}

      {/* Sidebar */}
      <aside style={{ 
        width: isMobile ? '280px' : 'var(--sidebar-width)', 
        background: 'var(--primary)', 
        color: 'white', 
        padding: '24px',
        display: isMobile && !isMobileMenuOpen ? 'none' : 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: isMobile ? '20px 0 50px rgba(0,0,0,0.3)' : 'none',
        animation: isMobile ? 'slideIn 0.3s ease-out' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <img src="/logo_contabilidad.png" alt="TodoDigital Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
          {isMobile && (
            <X 
              size={24} 
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ cursor: 'pointer', opacity: 0.6 }} 
            />
          )}
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Menú Principal</div>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              onClick={() => isMobile && setIsMobileMenuOpen(false)}
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
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', opacity: 0.6, cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        marginLeft: isMobile ? 0 : 'var(--sidebar-width)', 
        padding: isMobile ? '20px' : '40px',
        width: '100%',
        minWidth: 0
      }}>
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isMobile ? '24px' : '40px',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isMobile && (
              <Menu 
                size={28} 
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ color: 'var(--primary)', cursor: 'pointer' }} 
              />
            )}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowSwitch(!showSwitch)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <h1 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>
                  {currentTenant?.name}
                </h1>
                <span style={{ color: 'var(--accent)', fontSize: '10px', background: 'var(--accent-soft)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>CAMBIAR</span>
              </div>
              
              {showSwitch && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  width: '280px', 
                  background: 'white', 
                  borderRadius: '16px', 
                  boxShadow: 'var(--shadow-lg)', 
                  border: '1px solid var(--border)',
                  marginTop: '12px',
                  zIndex: 100,
                  overflow: 'hidden',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <div style={{ padding: '12px', borderBottom: '1px solid var(--border)', background: '#f8fafc', fontSize: '11px', fontWeight: '700', color: 'var(--text-light)' }}>
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
                        padding: '12px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '4px',
                        cursor: 'pointer',
                        background: currentTenant?.id === t.id ? '#f0f9ff' : 'white',
                        borderLeft: currentTenant?.id === t.id ? '4px solid var(--accent)' : '4px solid transparent'
                      }}
                    >
                      <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '13px' }}>{t.name}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-light)' }}>RFC: {t.rfc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link to="/invoices/new" style={{ textDecoration: 'none' }}>
            <button style={{ 
              background: 'var(--accent)', 
              color: 'white', 
              padding: isMobile ? '8px 12px' : '12px 24px', 
              borderRadius: '10px', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              fontWeight: '700',
              fontSize: isMobile ? '12px' : '14px',
              cursor: 'pointer'
            }}>
              <Plus size={isMobile ? 16 : 20} /> {isMobile ? 'Nueva' : 'Nueva Factura'}
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
