import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Zap, 
  Clock,
  Plus,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BillingCharts from '../components/BillingCharts';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { calculateFiscalSummary } from '../utils/fiscalUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();

  const [stats, setStats] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [fiscalSummary, setFiscalSummary] = useState({ subtotal: 0, tax: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Recent Invoices
        const invRef = collection(db, 'invoices');
        const qRecent = query(
          invRef, 
          where('tenantId', '==', currentTenant.id),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const invSnapshot = await getDocs(qRecent);
        const invData = invSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.seconds 
            ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString()
            : 'Reciente'
        }));
        setRecentInvoices(invData);

        // Fetch All Monthly Invoices for Stats
        // (En un app real filtraríamos por fecha aquí)
        const qAll = query(invRef, where('tenantId', '==', currentTenant.id));
        const allSnapshot = await getDocs(qAll);
        const allInvoices = allSnapshot.docs.map(d => d.data());
        
        const summary = calculateFiscalSummary(allInvoices);
        setFiscalSummary(summary);

        // Fetch Clients Count
        const cliRef = collection(db, 'clients');
        const qCli = query(cliRef, where('tenantId', '==', currentTenant.id));
        const cliSnapshot = await getDocs(qCli);

        setStats([
          { 
            label: 'Facturado Total', 
            value: `$${summary.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
            change: '+ Real', 
            color: 'var(--accent)', 
            icon: <Activity size={20} />,
            bg: 'var(--accent-soft)'
          },
          { 
            label: 'Facturas Emitidas', 
            value: allInvoices.length.toString(), 
            change: 'Histórico', 
            color: '#10b981', 
            icon: <FileText size={20} />,
            bg: '#ecfdf5'
          },
          { 
            label: 'Clientes en CRM', 
            value: cliSnapshot.size.toString(), 
            change: 'Registrados', 
            color: '#6366f1', 
            icon: <Users size={20} />,
            bg: '#eef2ff'
          },
          { 
            label: 'IVA Acumulado', 
            value: `$${summary.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 
            change: 'Por declarar', 
            color: '#f59e0b', 
            icon: <TrendingUp size={20} />,
            bg: '#fffbeb'
          },
        ]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentTenant) {
      fetchDashboardData();
    }
  }, [currentTenant]);

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>Panel de Control</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bienvenido de nuevo a <span style={{ fontWeight: '700', color: 'var(--accent)' }}>{currentTenant?.name}</span></p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '20px', 
            border: '1px solid var(--border)', 
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: stat.bg, 
                color: stat.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '20px'
            }}>
                {stat.icon}
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>{stat.value}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '600', color: stat.color }}>
                <ArrowUpRight size={14} /> {stat.change}
            </div>
          </div>
        ))}
      </div>
      
      {/* Analytics Charts */}
      <BillingCharts />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Recent Invoices Table */}
        <div style={{ 
            background: 'white', 
            borderRadius: '24px', 
            border: '1px solid var(--border)', 
            padding: '32px',
            boxShadow: 'var(--shadow-sm)' 
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Clock size={20} color="var(--accent)" /> Facturación Reciente
                </h2>
                <Link to="/invoices" style={{ color: 'var(--accent)', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>Ver todo</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentInvoices.map((inv, i) => (
                    <div key={i} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '16px', 
                        borderRadius: '16px', 
                        border: '1px solid #f8fafc',
                        background: '#fcfdfe'
                    }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
                            <FileText size={18} color="var(--text-muted)" />
                        </div>
                        <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '14px' }}>{inv.clientName}</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-light)' }}>{inv.id} • {inv.date}</div>
                            </div>
                            <div style={{ textAlign: 'right', marginRight: '24px' }}>
                                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '15px' }}>${inv.totals?.total?.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
                                <div style={{ 
                                    fontSize: '10px', 
                                    fontWeight: '700', 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.5px',
                                    color: inv.status === 'Pagado' ? '#059669' : '#ea580c'
                                }}>{inv.status || 'Emitida'}</div>
                        </div>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}>
                            <ArrowRight size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Quick Insights / Help Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', 
                borderRadius: '24px', 
                padding: '32px',
                color: 'white',
                boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.2)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} color="var(--accent-light)" />
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Resumen para el SAT</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ opacity: 0.7 }}>Base Gravable (Ingresos)</span>
                        <span style={{ fontWeight: '700' }}>${fiscalSummary.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ opacity: 0.7 }}>IVA Trasladado</span>
                        <span style={{ fontWeight: '700' }}>${fiscalSummary.tax.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {fiscalSummary.retentions > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                            <span style={{ opacity: 0.7 }}>Retenciones</span>
                            <span style={{ fontWeight: '700', color: '#fb7185' }}>-${fiscalSummary.retentions.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                        </div>
                    )}
                </div>

                <button 
                    onClick={() => navigate('/reports')}
                    style={{ 
                        width: '100%', 
                        padding: '12px', 
                        borderRadius: '12px', 
                        background: 'var(--accent)', 
                        color: 'white', 
                        border: 'none', 
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Generar Declaración
                </button>
            </div>

            <div style={{ 
                background: 'white', 
                borderRadius: '24px', 
                border: '1px solid var(--border)', 
                padding: '24px',
                textAlign: 'center'
            }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Users size={24} color="var(--accent)" />
                 </div>
                 <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>Invitación Digital</h4>
                 <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>Gana meses gratis invitando a otros negocios.</p>
                 <button style={{ color: 'var(--accent)', background: 'transparent', border: 'none', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>Copiar Link</button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
