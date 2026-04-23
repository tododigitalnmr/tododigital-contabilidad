import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [availableTenants, setAvailableTenants] = useState(() => {
        const saved = localStorage.getItem('availableTenants');
        if (saved) return JSON.parse(saved);
        
        return [
            { id: 'tenant-1', name: 'TodoDigital NMR', type: 'web_services', rfc: 'TOD990101AA1', logo: null, csdCer: null, csdKey: null },
            { id: 'tenant-2', name: 'Studio Nails', type: 'beauty_spa', rfc: 'STU990101BB2', logo: null, csdCer: null, csdKey: null },
            { id: 'tenant-3', name: 'Canceleria Garcia', type: 'construction', rfc: 'GAR990101CC3', logo: null, csdCer: null, csdKey: null }
        ];
    });

    const [currentTenant, setCurrentTenant] = useState(() => {
        const savedId = localStorage.getItem('currentTenantId');
        if (savedId) {
            const found = availableTenants.find(t => t.id === savedId);
            if (found) return found;
        }
        return availableTenants[0];
    });

    useEffect(() => {
        setUser({ email: 'admin@tododigital.com' });
        setLoading(false);
    }, []);

    const switchBusiness = (tenantId) => {
        const tenant = availableTenants.find(t => t.id === tenantId);
        if (tenant) {
            setCurrentTenant(tenant);
            localStorage.setItem('currentTenantId', tenantId);
        }
    };

    const updateTenant = (tenantId, data) => {
        const updatedTenants = availableTenants.map(t => t.id === tenantId ? { ...t, ...data } : t);
        setAvailableTenants(updatedTenants);
        localStorage.setItem('availableTenants', JSON.stringify(updatedTenants));

        if (currentTenant.id === tenantId) {
            const updatedCurrent = { ...currentTenant, ...data };
            setCurrentTenant(updatedCurrent);
        }
    };

    const value = {
        user,
        loading,
        availableTenants,
        currentTenant,
        switchBusiness,
        updateTenant
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
