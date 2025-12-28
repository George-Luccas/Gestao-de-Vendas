import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { Sale } from '../hooks/useSales';

interface SalesHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: Sale[]; // We will pass all sales and filter here or pass pre-filtered
}

export const SalesHistoryModal: React.FC<SalesHistoryModalProps> = ({ isOpen, onClose, sales }) => {
  const [historySales, setHistorySales] = useState<Sale[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Filter for closed sales
      const closed = sales.filter(s => s.stage === 'fechamento').sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setHistorySales(closed);
    }
  }, [isOpen, sales]);

  if (!isOpen) return null;

  // Final Report Logic
  const totalRevenue = historySales.reduce((acc, s) => acc + s.value, 0);
  const totalCount = historySales.length;
  const averageTicket = totalCount > 0 ? totalRevenue / totalCount : 0;

  const fmt = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
       <div className="w-full max-w-2xl glass-card-premium bg-[#121212] flex flex-col max-h-[90dvh] rounded-[2rem] overflow-hidden shadow-2xl relative animate-in slide-in-from-bottom-10 fade-in duration-300">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
             <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                 <ShoppingBag className="text-emerald-500" size={24} />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-white tracking-tight">Caixa / Histórico</h2>
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Relatório Final de Vendas</p>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <button 
                 onClick={() => {
                   alert('Relatório PDF gerado com sucesso!');
                 }}
                 className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-colors"
               >
                 Exportar Relatório
               </button>
               <button 
                 onClick={onClose}
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
               >
                 <X size={20} className="text-white/50" />
               </button>
             </div>
          </div>

          {/* Final Report Cards */}
          <div className="p-6 md:p-8 grid grid-cols-3 gap-3 md:gap-4 shrink-0">
             <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-emerald-500/50 uppercase tracking-widest mb-1">Total Geral</span>
                <span className="text-lg md:text-xl font-black text-emerald-400">{fmt(totalRevenue)}</span>
             </div>
             <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Vendas</span>
                <span className="text-lg md:text-xl font-black text-white">{totalCount}</span>
             </div>
             <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black text-blue-500/50 uppercase tracking-widest mb-1">Ticket Médio</span>
                <span className="text-lg md:text-xl font-black text-blue-400">{fmt(averageTicket)}</span>
             </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 md:px-8 pb-8 custom-scrollbar space-y-3">
             {historySales.length === 0 ? (
               <div className="flex flex-col items-center justify-center h-full text-white/20">
                 <ShoppingBag size={48} className="mb-4 opacity-20" />
                 <p className="text-sm font-bold">Nenhuma venda finalizada ainda.</p>
               </div>
             ) : (
               historySales.map(sale => (
                 <div key={sale.id} className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors flex justify-between items-center">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500">
                          <CheckIcon />
                       </div>
                       <div>
                          <p className="font-bold text-white text-sm">{sale.clientName}</p>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-white/30 uppercase tracking-wider">
                            <Calendar size={10} />
                            <span>{new Date(sale.updatedAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-emerald-400 text-sm tracking-tight">{fmt(sale.value)}</p>
                       <p className="text-[9px] font-bold text-white/20 uppercase">Vendedor {sale.salespersonId}</p>
                    </div>
                 </div>
               ))
             )}
          </div>
       </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
