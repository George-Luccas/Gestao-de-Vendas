import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface SalesValueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: number) => void;
  initialValue: number;
}

export const SalesValueModal: React.FC<SalesValueModalProps> = ({ isOpen, onClose, onConfirm, initialValue }) => {
  const [valueStr, setValueStr] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Initialize with current value but allow empty start if desired, 
      // or just keep it string for easy editing
      setValueStr(String(initialValue));
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(valueStr.replace(',', '.'));
    if (!isNaN(num)) {
      onConfirm(num);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm glass-card-premium bg-[#121212] p-6 rounded-[2rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Alterar Valor Manual</h2>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-white/50" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-bold text-lg">R$</span>
            <input
              autoFocus
              type="number" 
              inputMode="decimal" // Mobile numeric keyboard with decimal
              step="0.01"
              value={valueStr}
              onChange={(e) => setValueStr(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-2xl py-6 pl-12 pr-4 text-3xl font-black text-white focus:ring-2 focus:ring-primary/50 outline-none text-center tracking-tight"
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
             <button
               type="button"
               onClick={onClose}
               className="py-4 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
             >
               Cancelar
             </button>
             <button
               type="submit"
               className="py-4 rounded-xl font-bold bg-primary hover:bg-primary/80 text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
             >
               <Check size={20} />
               Confirmar
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
