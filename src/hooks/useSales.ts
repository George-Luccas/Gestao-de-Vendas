import { useState, useEffect, useCallback } from 'react';
import { User } from '../context/AuthContext';

export type Stage = 'cadastro' | 'negociacao' | 'fechamento' | 'acompanhamento';

export interface Sale {
  id: string;
  clientName: string;
  value: number;
  stage: Stage;
  salespersonId: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
}

export interface Salesperson {
  id: number;
  name: string;
  color: string;
}

export const STAGES: { id: Stage; label: string }[] = [
  { id: 'cadastro', label: 'Cadastro' },
  { id: 'negociacao', label: 'Negociação' },
  { id: 'fechamento', label: 'Fechamento' },
  { id: 'acompanhamento', label: 'Acompanhamento' },
];

const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

export const SALESPEOPLE = [
  { id: 1, name: 'Vendedor 1', color: '#a855f7' },
  { id: 2, name: 'Vendedor 2', color: '#3b82f6' },
  { id: 3, name: 'Vendedor 3', color: '#10b981' },
  { id: 4, name: 'Vendedor 4', color: '#f59e0b' },
];

export function useSales(user: User | null) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const fetchSalespeople = useCallback(async () => {
    try {
      const res = await fetch('/api/sellers');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((s: any, i: number) => ({
          id: s.salespersonId,
          name: s.name,
          color: COLORS[i % COLORS.length]
        }));
        setSalespeople(mapped);
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
    }
  }, []);

  const fetchSales = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const query = new URLSearchParams({
        userId: user.id,
        role: user.role,
        salespersonId: user.role === 'seller' ? String(user.salespersonId) : activeTab === 'all' ? '' : activeTab,
      });
      const res = await fetch(`/api/sales?${query}`);
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  }, [user, activeTab]);

  useEffect(() => {
    fetchSalespeople();
  }, [fetchSalespeople]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const addSale = async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>) => {
    if (!user) return;
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...saleData, ownerId: user.id }),
      });
      if (res.ok) fetchSales();
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  const moveSale = async (id: string, newStage: Stage) => {
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        setSales(prev => prev.map(s => s.id === id ? { ...s, stage: newStage } : s));
      }
    } catch (error) {
      console.error('Error moving sale:', error);
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: 'DELETE' });
      if (res.ok) setSales(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const updateSaleValue = async (id: string, newValue: number) => {
    try {
      const res = await fetch(`/api/sales/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: newValue }),
      });
      if (res.ok) setSales(prev => prev.map(s => s.id === id ? { ...s, value: newValue } : s));
    } catch (error) {
      console.error('Error updating sale value:', error);
    }
  };

  const deleteSalesperson = async (id: number) => {
    try {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSalespeople(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting salesperson:', error);
    }
  };

  return {
    sales,
    loading,
    addSale,
    moveSale,
    deleteSale,
    updateSaleValue,
    deleteSalesperson,
    activeTab,
    setActiveTab,
    refreshSales: fetchSales,
    salespeople
  };
}
