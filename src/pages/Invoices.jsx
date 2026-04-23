import React from 'react';
import { Search, Plus, FileText, Download, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Invoices = () => {
  const navigate = useNavigate();
  const { currentTenant } = useAuth();

  // Datos aislados por empresa
  const dataMap = {
    'tenant-1': [
      { id: 'FAC-NMR-001', date: '2026-04-18', client: 'CLIENTE DESARROLLO WEB', total: 15400.00, status: 'emitted' },
      { id: 'FAC-NMR-002', date: '2026-04-16', client: 'NATH AI SERVICES', total: 8500.00, status: 'emitted' }
    ],
    'tenant-2': [
      { id: 'FAC-NAILS-101', date: '2026-04-18', client: 'KARLA GOMEZ', total: 850.00, status: 'emitted' },
      { id: 'FAC-NAILS-102', date: '2026-04-17', client: 'SOFIA LOPEZ', total: 1200.00, status: 'emitted' }
    ],
    'tenant-3': [
      { id: 'FAC-GARCIA-501', date: '2026-04-18', client: 'CONSTRUCTORA DEL NORTE', total: 45000.00, status: 'emitted' },
      { id: 'FAC-GARCIA-502', date: '2026-04-15', client: 'ALUMINIOS RIVERA', total: 12300.00, status: 'emitted' }
    ]
  };

  const invoices = dataMap[currentTenant?.id] || [];

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '330px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Buscar por folio o cliente..." 
            style={{ 
              width: '100%',
              padding: '12px 12px 12px 40px', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              fontSize: '14px',
              outline: 'none',
              background: 'white'
            }} 
          />
        </div>

        <button 
          className="desktop-only"
          onClick={() => navigate('/invoices/new')}
          style={{ 
            background: 'var(--accent)', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            border: 'none', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Plus size={20} /> Nueva Factura
        </button>
      </div>

      <div className="table-container" style={{ 
        background: 'white', 
        borderRadius: '16px', 
        border: '1px solid var(--border)', 
        boxShadow: 'var(--shadow-sm)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>FOLIO / FECHA</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>CLIENTE RECEPTOR</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>TOTAL</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>ESTADO</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>DESCARGAS</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--primary)' }}>{inv.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{inv.date}</div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-main)', fontWeight: '500' }}>{inv.client}</td>
                <td style={{ padding: '16px 24px', fontWeight: '700' }}>
                   ${inv.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    background: '#ecfdf5', 
                    color: '#059669', 
                    fontSize: '12px', 
                    fontWeight: '600'
                  }}>
                    Timbrada
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                        onClick={() => navigate(`/invoices/view/${inv.id}`)}
                        title="Ver PDF" 
                        style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', color: '#ef4444', cursor: 'pointer' }}
                    >
                        <FileText size={18} />
                    </button>
                    <button title="XML" style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'white', color: 'var(--accent)', cursor: 'pointer' }}>
                        <Download size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
             <FileText size={48} style={{ opacity: 0.1, marginBottom: '16px' }} />
             <h3 style={{ color: 'var(--text-muted)' }}>No hay facturas emitidas</h3>
             <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Las facturas que timbres aparecerán aquí.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
