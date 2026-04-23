import React from 'react';
import { TrendingUp, PieChart, BarChart3, ArrowUpRight } from 'lucide-react';

const BillingCharts = () => {
    // Datos simulados premium
    const salesData = [35000, 42000, 38000, 51000, 48000, 62000];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const maxVal = Math.max(...salesData);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '32px' }}>
            
            {/* Sales Performance Chart (SVG Custom) */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Rendimiento de Ventas</h3>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Ingresos mensuales proyectados 2026</p>
                    </div>
                    <div style={{ background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={14} /> +12.5%
                    </div>
                </div>

                <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 10px' }}>
                    {/* Grid Lines */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 0, opacity: 0.05 }}>
                        {[1,2,3,4].map(i => <div key={i} style={{ borderBottom: '1px solid black', width: '100%' }}></div>)}
                    </div>

                    {/* Bars */}
                    {salesData.map((val, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1, zIndex: 1 }}>
                            <div style={{ 
                                width: '40%', 
                                height: `${(val / maxVal) * 180}px`, 
                                background: i === 5 ? 'var(--accent)' : 'linear-gradient(to top, #f1f5f9 0%, #e2e8f0 100%)',
                                borderRadius: '6px 6px 0 0',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                if (i !== 5) e.target.style.background = 'var(--accent-soft)';
                            }}
                            onMouseLeave={(e) => {
                                if (i !== 5) e.target.style.background = 'linear-gradient(to top, #f1f5f9 0%, #e2e8f0 100%)';
                            }}>
                                {i === 5 && (
                                    <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>
                                        ${(val/1000).toFixed(1)}k
                                    </div>
                                )}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-light)' }}>{months[i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Distribution Chart (Doughnut Simulation) */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>Distribución por Servicio</h3>
                
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center' }}>
                    {[
                        { label: 'Desarrollo Web', val: 45, color: 'var(--accent)' },
                        { label: 'Spa / Belleza', val: 30, color: '#10b981' },
                        { label: 'Cancelería / Vidrio', val: 25, color: '#f59e0b' }
                    ].map((item, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.label}</span>
                                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>{item.val}%</span>
                            </div>
                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{ width: `${item.val}%`, height: '100%', background: item.color, borderRadius: '4px' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                     <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <div style={{ background: 'var(--accent)', padding: '6px', borderRadius: '8px' }}>
                             <ArrowUpRight size={16} color="white" />
                         </div>
                         <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                             El **Desarrollo Web** ha crecido un 15% este mes. Considera ofrecer paquetes premium.
                         </p>
                     </div>
                </div>
            </div>

        </div>
    );
};

export default BillingCharts;
