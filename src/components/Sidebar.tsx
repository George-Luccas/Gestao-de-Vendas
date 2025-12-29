import React from 'react';
import { 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  LayoutDashboard,
  Crown,
  X,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { SALESPEOPLE } from '../hooks/useSales';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (id: string) => void;
  onOpenForm: () => void;
  onOpenSettings: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  currentBg?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenForm, 
  onOpenSettings,
  isOpen,
  onClose,
  currentBg
}) => {
  const { user, logout } = useAuth();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] xl:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        w-80 h-[100dvh] fixed top-0 glass-panel border-r border-white/5 p-6 md:p-8 flex flex-col z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isOpen ? 'left-0' : '-left-80 xl:left-0'}
      `}
      style={currentBg ? {
        backgroundImage: `url(/backgrounds/${currentBg})`,
        backgroundSize: '280px', // Adjusted for pattern effect
        backgroundRepeat: 'repeat', 
        backgroundPosition: 'center top',
      } : {}}
      >
        {/* Dark overlay for readability over bg image */}
        {currentBg && <div className="absolute inset-0 bg-black/70 z-[-1]" />}
        
        <div className="flex items-center justify-between mb-10 md:mb-14 px-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center neon-glow">
              <BarChart3 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tighter uppercase">Barber<span className="text-primary italic">Maps</span></h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">VENDAS PRO</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="xl:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

      <div className="flex-1 space-y-12 overflow-y-auto custom-scrollbar pr-2">
        <section>
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 px-4">Menu Principal</p>
          <nav className="space-y-1">
            <SidebarItem 
              icon={<LayoutDashboard size={20} />} 
              label="Painel" 
              active={activeTab !== 'ranking'} 
              onClick={() => onSelectTab('all')} 
            />
            <SidebarItem 
              icon={<Crown size={20} />} 
              label="Copa Vendas" 
              active={activeTab === 'ranking'} 
              onClick={() => onSelectTab('ranking')} 
            />
          </nav>
        </section>

        {user?.role === 'admin' && (
          <section>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 px-4">Vendedores</p>
            <nav className="space-y-1">
              {SALESPEOPLE.map((v) => (
                <SidebarItem 
                  key={v.id}
                  icon={
                    <div 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: v.color, boxShadow: `0 0 10px ${v.color}` }}
                    />
                  } 
                  label={v.name} 
                  active={activeTab === String(v.id)} 
                  onClick={() => onSelectTab(String(v.id))} 
                />
              ))}
            </nav>
          </section>
        )}
      </div>

      <div className="pt-8 mt-auto space-y-4">
        <button 
          onClick={onOpenForm}
          className="w-full h-14 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 neon-glow group shadow-xl shadow-primary/20"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
          <span>Nova Venda</span>
        </button>

        {user?.role === 'admin' && (
           <>
             <button 
               onClick={() => onSelectTab('goals')}
               className={`w-full h-12 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all duration-300 font-bold text-sm mb-4 ${activeTab === 'goals' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-transparent text-white/40 hover:bg-white/5 hover:text-white'}`}
             >
               <Target size={18} />
               <span>Metas</span>
             </button>

             <button 
               onClick={() => onSelectTab('history')}
               className={`w-full h-12 rounded-xl border border-white/5 flex items-center justify-center gap-2 transition-all duration-300 font-bold text-sm mb-4 ${activeTab === 'history' ? 'bg-white/10 text-white' : 'bg-transparent text-white/40 hover:bg-white/5 hover:text-white'}`}
             >
               <LayoutDashboard size={18} />
               <span>Histórico / Caixa</span>
             </button>
           </>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onOpenSettings}
            className="h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <Settings size={18} />
          </button>
          <button 
            onClick={logout}
            className="h-12 rounded-xl bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
      </aside>
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full h-12 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 relative group
      ${active ? 'bg-primary/10 text-primary border border-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}
    `}
  >
    <div className={`${active ? 'text-primary' : 'text-inherit group-hover:scale-110 transition-transform'} flex-shrink-0`}>
      {icon}
    </div>
    <span className="text-sm font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="absolute right-0 w-1 h-6 bg-primary rounded-full" 
      />
    )}
  </button>
);
