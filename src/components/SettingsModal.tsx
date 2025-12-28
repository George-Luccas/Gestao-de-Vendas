import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings, Moon, Bell, Shield, Palette, ChevronLeft, Check, Sun, Smartphone, Globe } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBg?: string | null;
  onSetBg?: (bg: string | null) => void;
}

type SettingsSection = 'main' | 'appearance' | 'alerts' | 'security' | 'branding';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentBg, onSetBg }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');
  const [config, setConfig] = useState({
    theme: 'purple',
    notifications: true,
    emailAlerts: false,
    companyName: 'BARBER MAPS',
  });

  const bgs = ['bg-1.png', 'bg-2.png', 'bg-3.jpg', 'bg-4.jpg'];

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            
            {/* Background Selection */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white ml-2">Plano de Fundo (Menu)</h4>
              <div className="grid grid-cols-3 gap-3">
                 <div 
                   onClick={() => onSetBg?.(null)}
                   className={`aspect-video rounded-xl border border-white/10 bg-[#121212] flex items-center justify-center cursor-pointer hover:border-white/30 transition-all ${!currentBg ? 'ring-2 ring-primary' : ''}`}
                 >
                   <span className="text-[10px] uppercase font-bold text-white/30">Padrão</span>
                 </div>
                 {bgs.map(bg => (
                   <div 
                     key={bg}
                     onClick={() => onSetBg?.(bg)}
                     className={`aspect-video rounded-xl border border-white/10 bg-cover bg-center cursor-pointer hover:border-white/30 transition-all ${currentBg === bg ? 'ring-2 ring-primary' : ''}`}
                     style={{ backgroundImage: `url(/backgrounds/${bg})` }}
                   />
                 ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {['purple', 'blue', 'emerald', 'amber'].map((color) => (
                <div 
                  key={color}
                  onClick={() => setConfig({...config, theme: color})}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col items-center gap-3 ${config.theme === color ? 'bg-primary/10 border-primary' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                >
                  <div className={`w-12 h-12 rounded-full shadow-lg ${
                    color === 'purple' ? 'bg-purple-600' : 
                    color === 'blue' ? 'bg-blue-600' : 
                    color === 'emerald' ? 'bg-emerald-600' : 'bg-amber-600'
                  }`} />
                  <span className="text-xs font-black uppercase text-white tracking-widest">{color}</span>
                  {config.theme === color && <Check size={16} className="text-primary" />}
                </div>
              ))}
            </div>
            <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                  {config.theme === 'amber' ? <Sun size={20} /> : <Moon size={20} />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Modo Escuro Premium</h4>
                  <p className="text-[10px] text-white/30">Otimizado para telas OLED</p>
                </div>
              </div>
              <div className="w-12 h-6 rounded-full bg-primary/20 border border-primary/30 p-1 flex items-center justify-end">
                <div className="w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/20" />
              </div>
            </div>
          </motion.div>
        );
      case 'alerts':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <ToggleOption 
              icon={<Bell size={18} />} 
              title="Notificações Push" 
              description="Alertas em tempo real no navegador" 
              active={config.notifications}
              onToggle={() => setConfig({...config, notifications: !config.notifications})}
            />
            <ToggleOption 
              icon={<Globe size={18} />} 
              title="Relatórios Diários" 
              description="Resumo de vendas via e-mail" 
              active={config.emailAlerts}
              onToggle={() => setConfig({...config, emailAlerts: !config.emailAlerts})}
            />
            <ToggleOption 
              icon={<Smartphone size={18} />} 
              title="Alertas Mobile" 
              description="Sincronizar com aplicativo Barber Maps" 
              active={false}
            />
          </motion.div>
        );
      case 'security':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Nova Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-6 text-white text-sm outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Confirmar Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-6 text-white text-sm outline-none focus:border-primary/50 transition-all font-mono"
              />
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3">
              <Shield size={16} className="text-emerald-500" />
              <p className="text-[10px] text-emerald-500/60 font-medium italic">Autenticação em dois fatores ativa para este administrador.</p>
            </div>
          </motion.div>
        );
      case 'branding':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="space-y-4 text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-accent mx-auto flex items-center justify-center shadow-2xl shadow-primary/20 border border-white/10">
                <Palette className="text-white" size={40} />
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Alterar Logotipo</button>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Nome da Empresa</label>
              <input 
                type="text" 
                value={config.companyName}
                onChange={(e) => setConfig({...config, companyName: e.target.value})}
                className="w-full h-14 rounded-2xl bg-white/[0.03] border border-white/10 px-6 text-white text-sm font-black outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </motion.div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <SettingsGroup 
              icon={<Moon size={20} />} 
              title="Aparência" 
              description="Customizar tema e visuais"
              onClick={() => setActiveSection('appearance')}
            />
            <SettingsGroup 
              icon={<Bell size={20} />} 
              title="Alertas" 
              description="Gestão de avisos e metas"
              onClick={() => setActiveSection('alerts')}
            />
            <SettingsGroup 
              icon={<Shield size={20} />} 
              title="Segurança" 
              description="Gestão de acesso e senhas"
              onClick={() => setActiveSection('security')}
            />
            <SettingsGroup 
              icon={<Palette size={20} />} 
              title="Identidade visual" 
              description="Identidade visual da empresa"
              onClick={() => setActiveSection('branding')}
            />
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 left-0 w-64 h-64 blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-1000 ${
              config.theme === 'purple' ? 'bg-purple-600/20' : 
              config.theme === 'blue' ? 'bg-blue-600/20' : 
              config.theme === 'emerald' ? 'bg-emerald-600/20' : 'bg-amber-600/20'
            }`} />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <div className="flex items-center gap-4">
                {activeSection !== 'main' && (
                  <button 
                    onClick={() => setActiveSection('main')}
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all mr-2"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                  <Settings className="text-primary" size={24} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                    {activeSection === 'main' ? 'CONFIGURAÇÕES' : 
                     activeSection === 'appearance' ? 'APARÊNCIA' :
                     activeSection === 'alerts' ? 'ALERTAS' :
                     activeSection === 'security' ? 'SEGURANÇA' : 'BRANDING'}
                  </h2>
                  <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">Painel de Controle Barber Maps</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  onClose();
                  setTimeout(() => setActiveSection('main'), 300);
                }}
                className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all hover:bg-white/10"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative z-10">
              {renderSection()}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 relative z-10">
              <button 
                onClick={() => {
                  onClose();
                  setTimeout(() => setActiveSection('main'), 300);
                }}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Salvar Alterações
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface SettingsGroupProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active?: boolean;
  onClick: () => void;
}

const SettingsGroup: React.FC<SettingsGroupProps> = ({ icon, title, description, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 rounded-3xl border transition-all cursor-pointer group ${active ? 'bg-primary/5 border-primary/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
  >
    <div className="flex items-center gap-4 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-primary text-white' : 'bg-white/5 text-white/20 group-hover:text-white'}`}>
        {icon}
      </div>
      <h3 className="font-bold text-white tracking-tight">{title}</h3>
    </div>
    <p className="text-xs text-white/30 font-medium">{description}</p>
  </div>
);

interface ToggleOptionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onToggle?: () => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({ icon, title, description, active, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`p-6 rounded-3xl border flex items-center justify-between transition-all cursor-pointer group ${active ? 'bg-primary/5 border-primary/20' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-primary text-white' : 'bg-white/5 text-white/20 group-hover:text-white'}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-[10px] text-white/30">{description}</p>
      </div>
    </div>
    <div className={`w-12 h-6 rounded-full transition-all p-1 flex items-center ${active ? 'bg-primary/20 border border-primary/30 justify-end' : 'bg-white/5 border border-white/10 justify-start'}`}>
      <div className={`w-4 h-4 rounded-full shadow-lg transition-transform ${active ? 'bg-primary shadow-primary/20' : 'bg-white/20'}`} />
    </div>
  </div>
);
