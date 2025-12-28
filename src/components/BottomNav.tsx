import React from 'react';
import { 
  LayoutDashboard, 
  Crown, 
  PlusCircle, 
  Settings, 
  Search 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (id: string) => void;
  onOpenForm: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  activeTab, 
  onSelectTab, 
  onOpenForm, 
  onOpenSettings,
  onOpenSearch
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#050508]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-[40] xl:hidden pb-safe">
      <NavItem 
        icon={<LayoutDashboard size={22} />} 
        label="Painel" 
        active={activeTab !== 'ranking'} 
        onClick={() => onSelectTab('all')} 
      />
      <NavItem 
        icon={<Crown size={22} />} 
        label="Copa" 
        active={activeTab === 'ranking'} 
        onClick={() => onSelectTab('ranking')} 
      />
      
      <button 
        onClick={onOpenForm}
        className="w-14 h-14 -mt-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/40 active:scale-90 transition-transform border-4 border-[#050508]"
      >
        <PlusCircle size={28} />
      </button>

      <NavItem 
        icon={<Search size={22} />} 
        label="Busca" 
        active={false} 
        onClick={onOpenSearch} 
      />
      <NavItem 
        icon={<Settings size={22} />} 
        label="Ajustes" 
        active={false} 
        onClick={onOpenSettings} 
      />
    </nav>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 min-w-[60px]"
  >
    <div className={`transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-white/30'}`}>
      {icon}
    </div>
    <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-primary' : 'text-white/20'}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="active-nav-dot"
        className="w-1 h-1 bg-primary rounded-full mt-0.5"
      />
    )}
  </button>
);
