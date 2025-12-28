import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, User } from 'lucide-react';
import type { Sale } from '../hooks/useSales';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: Sale[];
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, sales }) => {
  const [query, setQuery] = useState('');

  const filteredSales = query 
    ? sales.filter(s => 
        s.clientName.toLowerCase().includes(query.toLowerCase()) || 
        s.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center p-6 pt-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0a0a0f]/80 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden glass"
          >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <Search className="text-primary" size={24} />
              <input 
                autoFocus
                type="text"
                placeholder="Buscar clientes, negócios ou descrições..."
                className="flex-1 bg-transparent border-none outline-none text-xl font-medium text-white placeholder:text-white/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-4">
              {query && filteredSales.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-sm">Nenhum resultado encontrado para "{query}"</p>
                </div>
              ) : query ? (
                <div className="space-y-2">
                  {filteredSales.map((sale) => (
                    <button 
                      key={sale.id}
                      className="w-full p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all flex items-center justify-between group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-white tracking-tight">{sale.clientName}</p>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">{sale.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-white">R$ {sale.value.toLocaleString()}</p>
                        <p className="text-[10px] text-primary font-black uppercase tracking-widest">{sale.stage}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Comece a digitar para buscar...</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
