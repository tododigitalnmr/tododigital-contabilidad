import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Mail, FileText, MapPin, Trash2, Phone, MoreVertical } from 'lucide-react';
import ClientForm from '../components/ClientForm';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';

const Clients = () => {
  const { currentTenant } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar clientes desde Firestore con aislamiento de tenant y fallback local
  const fetchClients = async () => {
    setLoading(true);
    try {
      // Intentar cargar de Firestore
      const q = query(
        collection(db, 'clients'),
        where('tenantId', '==', currentTenant.id),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Combinar con locales de este tenant si existen
      let localData = localStorage.getItem(`clients_${currentTenant.id}`);
      let localClients = [];
      
      if (!localData) {
        // Inicializar con Demo Client si es la primera vez (no hay registro en local)
        localClients = [
            { id: 'demo-cli-1', name: 'CLIENTE DE PRUEBA SA DE CV', rfc: 'XAXX010101000', email: 'demo@ejemplo.com', cp: '64000', phone: '8100000000', city: 'Monterrey, NL', regimen: '601', tenantId: currentTenant.id }
        ];
        localStorage.setItem(`clients_${currentTenant.id}`, JSON.stringify(localClients));
      } else {
        localClients = JSON.parse(localData);
      }

      let combined = [...data, ...localClients].filter((v, i, a) => a.findIndex(t => (t.rfc === v.rfc)) === i);
      
      setClients(combined.sort((a,b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error("Error fetching clients:", error);
      // Fallback total a local
      const localData = localStorage.getItem(`clients_${currentTenant.id}`);
      const localClients = localData ? JSON.parse(localData) : [
        { id: 'demo-cli-1', name: 'CLIENTE DE PRUEBA SA DE CV', rfc: 'XAXX010101000', email: 'demo@ejemplo.com', cp: '64000', phone: '8100000000', city: 'Monterrey, NL', regimen: '601', tenantId: currentTenant.id }
      ];
      setClients(localClients);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [currentTenant]);

  const handleSaveClient = async (clientData) => {
    setLoading(true);
    try {
      const newClient = {
        ...clientData,
        tenantId: currentTenant.id,
        createdAt: new Date().toISOString()
      };
      
      // Guardar en LocalStorage primero para respuesta instantánea
      const localClients = JSON.parse(localStorage.getItem(`clients_${currentTenant.id}`) || '[]');
      localStorage.setItem(`clients_${currentTenant.id}`, JSON.stringify([...localClients, { id: `local_${Date.now()}`, ...newClient }]));
      
      // Intentar en segundo plano guardar en Firestore
      try {
        await addDoc(collection(db, 'clients'), newClient);
      } catch (e) {
        console.warn("Firestore save failed, kept in local:", e);
      }

      await fetchClients(); // Recargar
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Error al guardar el cliente.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteDoc(doc(db, 'clients', id));
        setClients(clients.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting client:", error);
      }
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.rfc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <ClientForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveClient} 
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--primary)', marginBottom: '8px' }}>Directorio de Clientes</h1>
          <p style={{ color: 'var(--text-muted)' }}>Gestión centralizada de contactos y datos fiscales</p>
        </div>
        <button 
          className="desktop-only"
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--accent)', 
            color: 'white', 
            padding: '12px 28px', 
            borderRadius: '14px', 
            border: 'none', 
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}
        >
          <Plus size={22} /> Nuevo Cliente
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)', background: '#f8fafc' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                    type="text" 
                    placeholder="Buscar clientes por nombre, RFC..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px 12px 48px', borderRadius: '12px', border: '1px solid var(--border)', outline: 'none', background: 'white', fontSize: '14px' }}
                />
            </div>
        </div>

        <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cliente / Empresa</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>RFC</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto</th>
              <th style={{ padding: '16px 24px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ubicación</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '15px' }}>{client.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{client.regimen || 'Sin régimen'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '20px 24px', fontWeight: '600' }}>{client.rfc}</td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>{client.email}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={12} /> {client.phone || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: '20px 24px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500' }}>CP: {client.cp}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{client.city || 'Desconocida'}</div>
                </td>
                <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'white', color: 'var(--text-main)', cursor: 'pointer' }}>
                            <MoreVertical size={18} />
                        </button>
                        <button 
                            onClick={() => handleDeleteClient(client.id)}
                            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', background: 'white', color: '#ef4444', cursor: 'pointer' }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        </div>
        
        {loading && (
            <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Cargando clientes...</div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <User size={64} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <h3 style={{ color: 'var(--text-muted)' }}>No se encontraron clientes</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Intenta con otro término o registra uno nuevo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Clients;
