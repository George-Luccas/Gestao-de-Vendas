import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, Save, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';
import { Sale, Salesperson } from '../hooks/useSales';

interface SalesGoalsProps {
  sales: Sale[];
  salespeople: Salesperson[];
  onDeleteSalesperson?: (id: number) => void;
}

export const SalesGoals: React.FC<SalesGoalsProps> = ({ sales, salespeople, onDeleteSalesperson }) => {
  const [goals, setGoals] = useState<{ [key: number]: number }>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedGoals = localStorage.getItem('vendas_pro_goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      // Default goals
      const defaults: any = {};
      salespeople.forEach(s => defaults[s.id] = 50000);
      setGoals(defaults);
    }
  }, [salespeople]);

  const handleSave = () => {
    localStorage.setItem('vendas_pro_goals', JSON.stringify(goals));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getSalesTotal = (id: number) => {
    return sales
      .filter(s => s.salespersonId === id && (s.stage === 'fechamento' || s.stage === 'acompanhamento'))
      .reduce((acc, curr) => acc + curr.value, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
            <Target className="text-primary" size={28} />
            Metas de Vendas
          </h2>
          <p className="text-sm text-white/40 font-medium">Defina os objetivos mensais para cada vendedor.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          {saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
          {saved ? 'Salvo!' : 'Salvar Metas'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {salespeople.map(seller => {
          const currentTotal = getSalesTotal(seller.id);
          const goal = goals[seller.id] || 0;
          const progress = goal > 0 ? (currentTotal / goal) * 100 : 0;
          const isMet = progress >= 100;

          return (
            <motion.div 
              key={seller.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
            >
              {/* Background Glow */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 transition-all group-hover:opacity-30"
                style={{ backgroundColor: seller.color }}
              />

              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                    style={{ backgroundColor: seller.color }}
                  >
                    {seller.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{seller.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/5 ${isMet ? 'text-emerald-400' : 'text-white/40'}`}>
                        {isMet ? 'Meta Batida!' : 'Em progresso'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Tem certeza que deseja excluir este vendedor?')) {
                        onDeleteSalesperson?.(seller.id);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-1">Atual</p>
                    <p className="text-lg font-bold text-white font-mono">{formatCurrency(currentTotal)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div>
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-2">
                    Meta de Vendas (R$)
                  </label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input 
                      type="number" 
                      value={goal}
                      onChange={(e) => setGoals(prev => ({ ...prev, [seller.id]: Number(e.target.value) }))}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 text-white font-mono outline-none focus:border-white/20 transition-all"
                    />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black text-white/50 uppercase tracking-wider">
                    <span>Progresso</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full relative"
                      style={{ backgroundColor: seller.color }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};


