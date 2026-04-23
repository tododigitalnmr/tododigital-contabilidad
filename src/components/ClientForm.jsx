import React, { useState } from 'react';
import { X, ShieldCheck, Mail, MapPin, Phone, FileText, Hash, Building2, Globe } from 'lucide-react';
import { REGIMENES_FISCALES, USOS_CFDI } from '../constants/sat';

const ClientForm = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    rfc: '',
    email: '',
    phone: '',
    cp: '',
    street: '',
    extNumber: '',
    intNumber: '',
    colony: '',
    city: '',
    state: '',
    regimen: '',
    usoCfdi: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // No cerramos aquí, el padre (Clients.jsx) manejará el guardado real y el cierre
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 10px 10px 36px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    outline: 'none',
    fontSize: '14px',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--text-main)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'white',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
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
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--primary)', margin: 0 }}>Ficha del Cliente</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>Datos obligatorios para CFDI 4.0 y contacto comercial</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'var(--text-light)', cursor: 'pointer', padding: '8px', borderRadius: '50%' }}>
            <X size={24} />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* --- SECCIÓN FISCAL --- */}
            <div style={{ gridColumn: 'span 2', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', letterSpacing: '1px' }}>DATOS FISCALES (CONSTANCIA SAT)</span>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Razón Social / Nombre Completo *</label>
              <div style={{ position: 'relative' }}>
                <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="COMO APARECE EN LA CONSTANCIA (SIN RÉGIMEN CAPITAL)" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>RFC *</label>
              <div style={{ position: 'relative' }}>
                <Hash size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="XAXX010101000" 
                  value={formData.rfc}
                  onChange={(e) => setFormData({...formData, rfc: e.target.value.toUpperCase()})}
                  required
                  maxLength={13}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>CP Fiscal *</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="64000" 
                  value={formData.cp}
                  onChange={(e) => setFormData({...formData, cp: e.target.value})}
                  required
                  maxLength={5}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Régimen Fiscal *</label>
              <select 
                value={formData.regimen}
                onChange={(e) => setFormData({...formData, regimen: e.target.value})}
                required
                style={{ ...inputStyle, paddingLeft: '12px', background: 'white' }}
              >
                <option value="">Selecciona...</option>
                {REGIMENES_FISCALES.map(r => (
                  <option key={r.code} value={r.code}>{r.code} - {r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Uso de CFDI *</label>
              <select 
                value={formData.usoCfdi}
                onChange={(e) => setFormData({...formData, usoCfdi: e.target.value})}
                required
                style={{ ...inputStyle, paddingLeft: '12px', background: 'white' }}
              >
                <option value="">Selecciona...</option>
                {USOS_CFDI.map(u => (
                  <option key={u.code} value={u.code}>{u.code} - {u.name}</option>
                ))}
              </select>
            </div>

            {/* --- CONTACTO Y DIRECCIÓN --- */}
            <div style={{ gridColumn: 'span 2', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px', marginTop: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent)', letterSpacing: '1px' }}>CONTACTO Y DOMICILIO COMERCIAL</span>
            </div>

            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="email" 
                  placeholder="cliente@ejemplo.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Teléfono de Contacto</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="81 1234 5678" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Calle y Número</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Av. Hidalgo #123 Int 4B" 
                  value={formData.street}
                  onChange={(e) => setFormData({...formData, street: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Colonia / Localidad</label>
              <input 
                type="text" 
                placeholder="Centro" 
                value={formData.colony}
                onChange={(e) => setFormData({...formData, colony: e.target.value})}
                style={{ ...inputStyle, paddingLeft: '12px' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Ciudad / Estado</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  placeholder="Monterrey, NL" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={labelStyle}>Notas Internas / Referencias</label>
              <textarea 
                placeholder="Ej. Entrada por portón gris, Horario de recepción 9-2pm..."
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                style={{ ...inputStyle, paddingLeft: '12px', height: '80px', resize: 'none' }}
              />
            </div>

          </div>

          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', position: 'sticky', bottom: 0, background: 'white', padding: '16px 0' }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', fontWeight: '700', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--accent)', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
            >
              Registrar Cliente Premium
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
