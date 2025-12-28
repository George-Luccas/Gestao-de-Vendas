import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit2, TrendingUp, User as UserIcon, ChevronRight } from 'lucide-react';
import { SALESPEOPLE, STAGES } from '../hooks/useSales';
import type { Sale, Stage } from '../hooks/useSales';

interface SalesCardProps {
  sale: Sale;
  onDelete?: (id: string) => void;
  onUpdateValue?: (id: string, newValue: number) => void;
  onMove?: (id: string, newStage: Stage) => void;
}

import { useAuth } from '../context/AuthContext';

export const SalesCard: React.FC<SalesCardProps> = ({ sale, onDelete, onUpdateValue, onMove }) => {
  const { user } = useAuth();
  const salesperson = SALESPEOPLE.find(v => v.id === sale.salespersonId);
  const currentStageIndex = STAGES.findIndex(s => s.id === sale.stage);
  const nextStage = STAGES[currentStageIndex + 1];
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(sale.value);

  const formattedDate = new Date(sale.createdAt).toLocaleDateString('pt-BR');

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="glass-card-premium p-4 md:p-6 rounded-2xl md:rounded-[2rem] group relative overflow-hidden"
    >
      {/* Dynamic Glow Overlay */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle at center, ${salesperson?.color}, transparent)` }}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: salesperson?.color, boxShadow: `0 0 10px ${salesperson?.color}` }}
              />
              <span className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{salesperson?.name}</span>
            </div>
            <h4 className="text-lg md:text-xl font-black text-white group-hover:text-primary transition-colors tracking-tight leading-tight">
              {sale.clientName}
            </h4>
          </div>

          <div className="flex gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
             <button 
               onClick={() => onUpdateValue?.(sale.id, -1)}
               className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
               title="Edição Rápida (Valor)"
             >
               <Edit2 size={14} className="text-white/40" />
             </button>
             {user?.role === 'admin' ? (
               <button 
                 onClick={() => onDelete?.(sale.id)}
                 className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                 title="Excluir (Admin)"
               >
                 <Trash2 size={14} className="text-red-400" />
               </button>
             ) : (
                <button 
                  onClick={() => onDelete?.(sale.id)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  title="Cancelar Pedido"
                >
                  <X size={14} className="text-white/40" />
                </button>
             )}
          </div>
        </div>

        <p className="text-xs md:text-sm text-white/50 mb-6 md:mb-8 line-clamp-2 font-medium leading-relaxed">
          {sale.description}
        </p>

        <div className="space-y-6">
          <div className="flex justify-between items-end">
             <div>
               <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Saldo Negociado</p>
               <div className="flex items-center gap-4">
                 <button 
                   onClick={() => onUpdateValue?.(sale.id, -1)} // -1 signal to open modal
                   className="text-2xl font-black text-white tracking-tighter antialiased hover:text-primary transition-colors text-left"
                 >
                   {formattedValue}
                 </button>
                 <div className="flex gap-1.5">
                   <button 
                     onClick={() => onUpdateValue?.(sale.id, sale.value - 1000)}
                     className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/20 transition-all text-white/40 hover:text-red-400 font-bold"
                   >
                     -
                   </button>
                   <button 
                     onClick={() => onUpdateValue?.(sale.id, sale.value + 1000)}
                     className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/20 transition-all text-white/40 hover:text-emerald-400 font-bold"
                   >
                     +
                   </button>
                 </div>
               </div>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                <TrendingUp size={18} className="text-primary/40" />
             </div>
          </div>

          <div className="pt-5 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-2 text-[10px] font-black text-white/20 uppercase tracking-widest">
               <Calendar size={12} className="text-primary" />
               <span>{formattedDate}</span>
             </div>
             <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border border-[#020205] bg-white/5 flex items-center justify-center text-[8px] font-bold text-white/40">
                  <UserIcon size={10} />
                </div>
             </div>
          </div>

          {nextStage && (
             <button 
               onClick={() => onMove?.(sale.id, nextStage.id as Stage)}
               className="w-full py-3 md:py-4 rounded-xl md:rounded-2xl bg-primary/10 border border-primary/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 group/btn shadow-lg shadow-primary/5"
             >
               <span>PROGREDIR PARA {nextStage.label}</span>
               <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
             </button>
           )}
        </div>
      </div>
    </motion.div>
  );
};
