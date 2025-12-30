import React from 'react';
import { SalesCard } from './SalesCard';
import { STAGES, Sale, Stage } from '../hooks/useSales';
import { motion } from 'framer-motion';
import { ChevronRight, LayoutGrid, CheckCircle2, Clock, Zap } from 'lucide-react';

interface SalesPipelineProps {
  sales: Sale[];
  onMoveSale: (id: string, stage: Stage) => void;
  onDeleteSale: (id: string) => void;
  onUpdateValue?: (id: string, newValue: number) => void;
}

const STAGE_ICONS: Record<Stage, React.ReactNode> = {
  cadastro: <Zap size={16} className="text-primary" />,
  negociacao: <Clock size={16} className="text-amber-500" />,
  fechamento: <LayoutGrid size={16} className="text-blue-500" />,
  acompanhamento: <CheckCircle2 size={16} className="text-emerald-500" />
};

export const SalesPipeline: React.FC<SalesPipelineProps> = ({ sales, onMoveSale, onDeleteSale, onUpdateValue }) => {
  return (
    <div className="flex gap-8 overflow-x-auto pb-8 pt-4 custom-scrollbar">
      {STAGES.map((stage, index) => {
        const stageSales = sales.filter((s) => s.stage === stage.id);
        const stageValue = stageSales.reduce((acc, s) => acc + s.value, 0);

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-72 md:w-80 flex flex-col gap-4 md:gap-6"
          >
            {/* Column Header */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  {STAGE_ICONS[stage.id as Stage]}
               </div>
               
               <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{stage.label}</span>
                  <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
                    {stageSales.length}
                  </div>
               </div>
               
               <div className="flex items-center justify-between">
                  <p className="text-lg font-black text-white tracking-tighter">
                    R$ {stageValue.toLocaleString('pt-BR')}
                  </p>
                  <ChevronRight size={14} className="text-white/20" />
               </div>
            </div>

            {/* Column Body */}
            <div 
              className="flex flex-col gap-8 min-h-[500px] p-2 rounded-[2rem] border-2 border-dashed border-white/[0.03] hover:border-white/[0.06] transition-all"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                // In a real drag-drop app, we'd get the ID here. 
                // For this demo, we're using simple controls on the card if needed, 
                // but let's keep the drop zone logic.
              }}
            >
              {stageSales.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-3xl bg-white/[0.02] flex items-center justify-center mb-4 border border-white/5">
                     <LayoutGrid size={24} className="text-white/10" />
                  </div>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-relaxed">
                    Nenhum negócio <br /> neste estágio
                  </p>
                </div>
              ) : (
                stageSales.map((sale) => (
                  <div key={sale.id} className="relative group/card">
                    <SalesCard 
                      sale={sale} 
                      onDelete={onDeleteSale} 
                      onUpdateValue={onUpdateValue} 
                      onMove={onMoveSale}
                    />
                    
                    {/* Move Controls Hover Overlay */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex-col gap-2 opacity-0 group-hover/card:opacity-100 translate-x-4 group-hover/card:translate-x-0 transition-all z-20 hidden md:flex">
                      {index > 0 && (
                        <button 
                          onClick={() => onMoveSale(sale.id, STAGES[index - 1].id as Stage)}
                          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all shadow-xl"
                        >
                          <ChevronRight className="rotate-180" size={16} />
                        </button>
                      )}
                      {index < STAGES.length - 1 && (
                        <button 
                          onClick={() => onMoveSale(sale.id, STAGES[index + 1].id as Stage)}
                          className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all shadow-xl"
                        >
                          <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
