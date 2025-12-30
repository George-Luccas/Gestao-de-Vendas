import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, TrendingUp, CheckCircle2, UserPlus, X } from 'lucide-react';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
     if (isOpen) {
         fetch('/api/notifications')
           .then(res => res.json())
           .then(data => setNotifications(data))
           .catch(err => console.error('Error fetching notifications', err));
     }
  }, [isOpen]);

  const STAGE_ICONS: Record<string, React.ReactNode> = {
    'sale': <TrendingUp size={16} className="text-emerald-500" />,
    'stage': <CheckCircle2 size={16} className="text-primary" />,
    'user': <UserPlus size={16} className="text-blue-500" />,
    'visit': <Bell size={16} className="text-amber-500" />  
  };

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
              {notifications.length === 0 ? (
                  <div className="p-8 text-center text-white/20 text-xs">
                      Nenhuma notificação recente
                  </div>
              ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-all">
                          {STAGE_ICONS[n.type] || <Bell size={16} className="text-white" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white mb-0.5">{n.title}</p>
                          <p className="text-[10px] text-white/40 leading-relaxed mb-2">{n.description}</p>
                          <p className="text-[9px] font-black text-primary uppercase tracking-tighter">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
            
            <button 
              onClick={() => {
                onClose();
                alert('Histórico completo de notificações em breve!');
              }}
              className="w-full py-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.05] transition-all"
            >
              Ver Todas as Notificações
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
