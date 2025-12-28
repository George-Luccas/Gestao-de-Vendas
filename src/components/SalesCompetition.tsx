import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp } from 'lucide-react';

interface RankItem {
  id: number;
  totalValue: number;
  count: number;
  name?: string;
}

const SELLER_NAMES: Record<number, string> = {
  1: 'Vendedor 1',
  2: 'Vendedor 2',
  3: 'Vendedor 3',
  4: 'Vendedor 4'
};

const SELLER_COLORS: Record<number, string> = {
  1: '#a855f7',
  2: '#3b82f6',
  3: '#10b981',
  4: '#f59e0b'
};

export const SalesCompetition: React.FC = () => {
  const [ranking, setRanking] = useState<RankItem[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from /api/ranking
    // For now, let's mock the live updates if the API isn't ready
    const fetchRanking = async () => {
      try {
        const response = await fetch('/api/ranking');
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        // Fallback for development appearance
        setRanking([
          { id: 1, totalValue: 45000, count: 12 },
          { id: 2, totalValue: 38000, count: 8 },
          { id: 3, totalValue: 25000, count: 5 },
          { id: 4, totalValue: 12000, count: 3 },
        ].sort((a, b) => b.totalValue - a.totalValue));
      }
    };

    fetchRanking();
    const interval = setInterval(fetchRanking, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel rounded-3xl p-6 border border-white/5">
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/20">
          <Trophy className="text-amber-500" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white tracking-tight">Copa de Vendas</h3>
          <p className="text-[9px] md:text-[10px] text-white/40 uppercase font-black tracking-widest">Ranking em Tempo Real</p>
        </div>
      </div>

      <div className="space-y-4">
        {ranking && ranking.length > 0 ? (
          ranking.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.05] transition-all"
            >
              <div className="flex-shrink-0 w-6 md:w-8 text-center font-black text-white/20 text-base md:text-lg italic">
                #{index + 1}
              </div>

              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white relative"
                style={{ 
                  backgroundColor: `${SELLER_COLORS[item.id] || '#8b5cf6'}20`, 
                  border: `1px solid ${SELLER_COLORS[item.id] || '#8b5cf6'}40` 
                }}
              >
                {index === 0 ? <Medal size={24} className="text-amber-400" /> : 
                 index === 1 ? <Medal size={20} className="text-slate-400" /> :
                 <Star size={18} className="text-amber-700/50" />}
                
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#020205]"
                  style={{ backgroundColor: SELLER_COLORS[item.id] || '#8b5cf6' }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs md:text-sm text-white truncate">{SELLER_NAMES[item.id] || `Consultor ${item.id}`}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <TrendingUp size={10} className="text-emerald-500" />
                  <span className="text-[9px] md:text-[10px] font-bold text-white/40 uppercase">{item.count} Negócios</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs font-black text-white leading-none">
                  R$ {item.totalValue.toLocaleString('pt-BR')}
                </p>
                <div className="h-1 w-20 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: ranking[0]?.totalValue ? `${(item.totalValue / ranking[0].totalValue) * 100}%` : '0%' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: SELLER_COLORS[item.id] || '#8b5cf6' }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-8 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
            Aguardando dados...
          </div>
        )}
      </div>

      <button className="w-full mt-8 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all">
        Ver Regulamento Completo
      </button>
    </div>
  );
};
