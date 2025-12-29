import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, TrendingUp, Calendar, Target, BarChart3, Wallet, ShieldAlert, ChevronsDown } from 'lucide-react';
import { useSales } from '../hooks/useSales';

interface RankItem {
  id: number;
  totalValue: number;
  count: number;
  name?: string;
}

export const SalesCompetition: React.FC = () => {
  const [ranking, setRanking] = useState<RankItem[]>([]);
  const [isRegulationOpen, setIsRegulationOpen] = useState(false);
  const { salespeople } = useSales(null); // Fetch salespeople names

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
                  backgroundColor: `${salespeople.find(s => s.id === item.id)?.color || '#8b5cf6'}20`, 
                  border: `1px solid ${salespeople.find(s => s.id === item.id)?.color || '#8b5cf6'}40` 
                }}
              >
                {index === 0 ? <Medal size={24} className="text-amber-400" /> : 
                 index === 1 ? <Medal size={20} className="text-slate-400" /> :
                 <Star size={18} className="text-amber-700/50" />}
                
                <div 
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#020205]"
                  style={{ backgroundColor: salespeople.find(s => s.id === item.id)?.color || '#8b5cf6' }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs md:text-sm text-white truncate">{salespeople.find(s => s.id === item.id)?.name || `Consultor ${item.id}`}</h4>
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
                    style={{ backgroundColor: salespeople.find(s => s.id === item.id)?.color || '#8b5cf6' }}
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

      <button 
        onClick={() => setIsRegulationOpen(true)}
        className="w-full mt-8 py-4 rounded-2xl border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all"
      >
        Ver Regulamento Completo
      </button>

      {/* Regulation Modal */}
      {isRegulationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0e0e11] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[80vh] overflow-y-auto custom-scrollbar shadow-2xl"
          >
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Regulamento</h2>
                   <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">Copa de Vendas – Edição Trimestral</p>
                </div>
                <button 
                  onClick={() => setIsRegulationOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all"
                >
                  <ChevronsDown size={24} className="rotate-180" />
                </button>
              </div>

              <div className="space-y-6 text-sm text-white/70 font-light leading-relaxed">
                <section>
                  <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Trophy size={14} className="text-primary"/> 1. Objetivo</h3>
                  <p>A Copa de Vendas visa incentivar a alta performance da equipe comercial, premiando o colaborador (ou equipe) que atingir os melhores resultados de conversão e faturamento dentro do período estipulado.</p>
                </section>

                <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Calendar size={14} className="text-primary"/> 2. Período da Competição</h3>
                   <p>A competição terá duração de 3 (três) meses, iniciando no dia <strong className="text-white">01/02/2026</strong> e encerrando-se no dia <strong className="text-white">30/04/2026</strong>.</p>
                </section>

                <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Target size={14} className="text-primary"/> 3. Critérios de Participação</h3>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>Estão elegíveis todos os consultores/vendedores ativos na empresa durante todo o trimestre.</li>
                     <li>É necessário o cumprimento de pelo menos <strong className="text-white">75% da meta Trimestral</strong> para que seja contemplado o vencedor (o não comprimento da meta prorroga automaticamente até o abatimento da mesma).</li>
                   </ul>
                </section>

                <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><BarChart3 size={14} className="text-primary"/> 4. Critérios de Pontuação e Vencedor</h3>
                   <p>O vencedor será definido com base nos seguintes indicadores (KPIs):</p>
                   <ul className="list-disc pl-5 space-y-1 mt-2">
                     <li><strong>Volume Total de Vendas (R$):</strong> Peso principal.</li>
                     <li><strong>Taxa de Conversão:</strong> Porcentagem de leads convertidos em vendas.</li>
                     <li><strong>Ticket Médio:</strong> Valor médio por venda realizada.</li>
                   </ul>
                   <p className="mt-2 text-xs text-white/40 italic">Nota: Em caso de empate, o critério de desempate será quem atingiu o resultado com o menor número de cancelamentos/estornos (Chargebacks).</p>
                </section>

                <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Medal size={14} className="text-primary"/> 5. Da Premiação</h3>
                   <p>O grande vencedor da Copa de Vendas fará jus a um bônus extraordinário equivalente a:</p>
                   <div className="p-4 my-2 rounded-xl bg-gradient-to-r from-primary/20 to-transparent border border-primary/20">
                      <p className="text-lg font-black text-white">25% (vinte e cinco por cento)</p>
                      <p className="text-xs uppercase tracking-widest text-primary">sobre o Lucro Líquido do Faturamento Trimestral</p>
                   </div>
                   <h4 className="font-bold text-white text-xs uppercase mt-3 mb-1">5.1. Definição de Lucro para Fins de Prêmio</h4>
                   <p>Para fins deste regulamento, o "Lucro do Faturamento" será calculado subtraindo-se do faturamento bruto:</p>
                   <ul className="list-disc pl-5 space-y-1 mt-1 text-xs">
                     <li>Impostos diretos sobre a venda.</li>
                     <li>Custos operacionais diretos do serviço/produto.</li>
                     <li>Taxas de processamento de pagamentos.</li>
                   </ul>
                </section>

                <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Wallet size={14} className="text-primary"/> 6. Prazo de Pagamento</h3>
                   <p>O prêmio será calculado após o fechamento contábil do trimestre e pago ao vencedor até o dia 7 do mês subsequente ao encerramento da Copa, via <strong>Pix</strong>.</p>
                </section>

                 <section>
                   <h3 className="font-bold text-white mb-2 flex items-center gap-2"><ShieldAlert size={14} className="text-primary"/> 7. Disposições Gerais</h3>
                   <ul className="list-disc pl-5 space-y-1">
                     <li>Tentativas de fraude, "vendas fakes" ou comportamento antiético resultarão na desclassificação imediata do participante.</li>
                     <li>A diretoria reserva-se o direito de auditar todas as vendas computadas para a premiação.</li>
                     <li>As vendas só serão contabilizadas após validação via comprovante.</li>
                   </ul>
                </section>
              </div>

               <button 
                  onClick={() => setIsRegulationOpen(false)}
                  className="w-full py-4 rounded-xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary-dark transition-all"
                >
                  Entendi
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
