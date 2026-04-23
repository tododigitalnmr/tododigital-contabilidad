import React, { useState } from 'react';
import { X, Zap, DollarSign, Tag, Box, Percent } from 'lucide-react';
import { UNIDADES_SAT, PRODUCTOS_COMUNES } from '../constants/sat';

const ProductForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    price: '',
    sku: '',
    satProduct: '',
    satUnit: 'E48', // Default to Service
    taxRate: '16'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '550px',
        borderRadius: '20px',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>Añadir Producto / Servicio</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Define los detalles fiscales para tu inventario.</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Descripción / Concepto</label>
              <div style={{ position: 'relative' }}>
                <Zap size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Ej. Desarrollo de Landing Page Premium" 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Precio Unitario</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="number" 
                  step="0.01"
                  placeholder="0.00" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>IVA (%)</label>
              <div style={{ position: 'relative' }}>
                <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <select 
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                  style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
                >
                  <option value="16">IVA 16% (Nacional)</option>
                  <option value="8">IVA 8% (Frontera)</option>
                  <option value="0">IVA 0% / Exento</option>
                </select>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Clave de Producto SAT</label>
              <select 
                value={formData.satProduct}
                onChange={(e) => setFormData({...formData, satProduct: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
              >
                <option value="">Selecciona una clave...</option>
                {PRODUCTOS_COMUNES.map(p => (
                  <option key={p.code} value={p.code}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>Unidad SAT</label>
              <select 
                value={formData.satUnit}
                onChange={(e) => setFormData({...formData, satUnit: e.target.value})}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', outline: 'none', background: 'white' }}
              >
                {UNIDADES_SAT.map(u => (
                  <option key={u.code} value={u.code}>{u.code} - {u.name}</option>
                ))}
              </select>
            </div>

          </div>

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'white', fontWeight: '600', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '700', cursor: 'pointer' }}
            >
              Guardar en Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
