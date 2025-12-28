import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp, CheckCircle2, UserPlus, X } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'sale', title: 'Novo Negócio Fechado', description: 'Vendedor 1 fechou um contrato de R$ 1.500', time: '5m atrás', icon: <TrendingUp className="text-emerald-500" /> },
  { id: 2, type: 'stage', title: 'Progresso de Estágio', description: 'Cliente Polaco mudou para Negociação', time: '12m atrás', icon: <CheckCircle2 className="text-primary" /> },
  { id: 3, type: 'user', title: 'Novo Vendedor', description: 'Marcos de Souza entrou para o time', time: '1h atrás', icon: <UserPlus className="text-blue-500" /> },
];

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[120]" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed top-24 right-10 w-80 glass-panel border border-white/10 rounded-[2rem] shadow-2xl z-[130] overflow-hidden"
          >
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <h3 className="font-black text-xs text-white uppercase tracking-widest">Notificações</h3>
              </div>
              <button onClick={onClose} className="text-white/20 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {MOCK_NOTIFICATIONS.map((n) => (
                <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all">
                      {n.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                      <p className="text-[10px] text-white/40 leading-relaxed mb-2">{n.description}</p>
                      <p className="text-[9px] font-black text-primary uppercase tracking-tighter">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.05] transition-all">
              Ver Todas as Notificações
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
