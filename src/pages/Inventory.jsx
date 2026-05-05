import React, { useState, useEffect } from 'react';
import { Search, Plus, Box, Hash, Tag, DollarSign, Zap, RefreshCw } from 'lucide-react';
import ProductForm from '../components/ProductForm';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Inventory = () => {
  const { currentTenant } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos del negocio actual
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setProducts([]); // Limpiar estado anterior para evitar leaks entre tenants
      try {
        const queryRef = collection(db, 'products');
        const q = query(queryRef, where('tenantId', '==', currentTenant.id));
        const querySnapshot = await getDocs(q);
        let data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Cargar locales de este tenant
        const localItems = JSON.parse(localStorage.getItem(`inventory_${currentTenant.id}`) || '[]');
        const combined = [...data, ...localItems].filter((v, i, a) => a.findIndex(t => (t.description === v.description)) === i);

        // Si no hay productos en Firestore ni Locales, cargamos los demos específicos del negocio
        if (combined.length === 0) {
            const demoMap = {
                'tenant-1': [
                    { id: 'IT-001', description: 'Desarrollo Web Corporativo', price: 18500, satProduct: '81111500', satUnit: 'E48', taxRate: '16' },
                    { id: 'IT-002', description: 'Tienda en Línea E-commerce', price: 25000, satProduct: '81111500', satUnit: 'E48', taxRate: '16' },
                    { id: 'IT-003', description: 'Gestión de Redes Sociales (Mensual)', price: 4500, satProduct: '82101500', satUnit: 'E48', taxRate: '16' },
                    { id: 'IT-004', description: 'Publicidad Digital (Google/Meta Ads)', price: 3000, satProduct: '82101600', satUnit: 'E48', taxRate: '16' },
                    { id: 'IT-005', description: 'Consultoría en Transformación Digital', price: 1500, satProduct: '81111508', satUnit: 'E48', taxRate: '16' },
                    { id: 'IT-006', description: 'Hosting y Dominio Anual', price: 2200, satProduct: '81112105', satUnit: 'E48', taxRate: '16' }
                ],
                'tenant-2': [
                    { id: 'SPA-001', description: 'Aplicación de Uñas Acrílicas', price: 450, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' },
                    { id: 'SPA-002', description: 'Retoque de Acrílico', price: 250, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' },
                    { id: 'SPA-003', description: 'Diseño de Uñas (Nail Art)', price: 150, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' },
                    { id: 'SPA-004', description: 'Retiro de Gelish / Acrílico', price: 100, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' },
                    { id: 'SPA-005', description: 'Manicura Rusa', price: 350, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' },
                    { id: 'SPA-006', description: 'Pedicura Spa Profunda', price: 600, satProduct: '53131600', satUnit: 'ACT', taxRate: '16' }
                ],
                'tenant-3': [
                    { id: 'CAN-001', description: 'Puerta de Aluminio Linea Panorama', price: 4500, satProduct: '30171500', satUnit: 'H87', taxRate: '16' },
                    { id: 'CAN-002', description: 'Barandal de Cristal Templado (Metro lineal)', price: 2800, satProduct: '30171500', satUnit: 'MTR', taxRate: '16' },
                    { id: 'CAN-003', description: 'Domo de Cristal INOX', price: 8500, satProduct: '30171500', satUnit: 'H87', taxRate: '16' },
                    { id: 'CAN-004', description: 'Mosquitero Corredizo', price: 850, satProduct: '30171500', satUnit: 'H87', taxRate: '16' },
                    { id: 'CAN-005', description: 'Mantenimiento a Canceles', price: 1200, satProduct: '72101500', satUnit: 'E48', taxRate: '16' },
                    { id: 'CAN-006', description: 'Espejo Biselado a Medida', price: 1500, satProduct: '30171500', satUnit: 'H87', taxRate: '16' }
                ]
            };
            setProducts(demoMap[currentTenant?.id] || []);
        } else {
            setProducts(combined);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        // Fallback total a local si falla Firebase
        const localItems = JSON.parse(localStorage.getItem(`inventory_${currentTenant.id}`) || '[]');
        setProducts(localItems);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [currentTenant]);

  const handleSaveProduct = async (newProduct) => {
    try {
        const productData = { 
            ...newProduct, 
            tenantId: currentTenant.id,
            createdAt: new Date().toISOString()
        };
        
        // Guardar Local
        const localItems = JSON.parse(localStorage.getItem(`inventory_${currentTenant.id}`) || '[]');
        localStorage.setItem(`inventory_${currentTenant.id}`, JSON.stringify([...localItems, { id: `local_${Date.now()}`, ...productData }]));
        
        // Segundo plano Firestore
        try {
            await addDoc(collection(db, 'products'), productData);
        } catch (e) {
            console.warn("Firestore save failed in inventory:", e);
        }

        const itemsNow = JSON.parse(localStorage.getItem(`inventory_${currentTenant.id}`) || '[]');
        setProducts(itemsNow);
        setIsModalOpen(false);
    } catch (e) {
        console.error("Error saving product:", e);
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <ProductForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProduct} 
      />
      
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
            placeholder="Buscar producto o clave SAT..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '12px 12px 12px 40px', 
              borderRadius: '12px', 
              border: '1px solid var(--border)', 
              fontSize: '14px',
              outline: 'none',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }} 
          />
        </div>

        <button 
          className="desktop-only"
          onClick={() => setIsModalOpen(true)}
          style={{ 
            background: 'var(--accent)', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '12px', 
            border: 'none', 
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)'
          }}
        >
          <Plus size={20} /> Añadir al Inventario
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
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>PRODUCTO / SERVICIO</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>PRECIO UNIT.</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>CLAVE SAT / UNIDAD</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>IVA</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--primary)' }}>{product.description}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontWeight: '700', color: 'var(--text-main)' }}>
                  ${Number(product.price).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', fontWeight: '500' }}>{product.satProduct}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>Unidad: {product.satUnit}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    background: product.taxRate === '8' ? '#ecfdf5' : '#eff6ff', 
                    color: product.taxRate === '8' ? '#059669' : '#2563eb',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    IVA {product.taxRate}%
                  </span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                   <button style={{ 
                     padding: '8px 16px', 
                     borderRadius: '6px', 
                     border: '1px solid var(--border)', 
                     background: 'white',
                     fontSize: '13px',
                     fontWeight: '500'
                   }}>
                     Editar
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 24px' }}>
            <div style={{ color: 'var(--text-light)', marginBottom: '16px' }}>
              <Box size={64} style={{ opacity: 0.2 }} />
            </div>
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>El inventario está vacío</h3>
            <p style={{ color: 'var(--text-light)', fontSize: '14px' }}>Agrega tus servicios para facilitar la creación de facturas.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
