import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthenticationModal';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { OfflineStatus } from './components/OfflineStatus';
import { SalesPipeline } from './components/SalesPipeline';
import { SalesForm } from './components/SalesForm';
import { SalesCompetition } from './components/SalesCompetition';
import { SettingsModal } from './components/SettingsModal';
import { SearchModal } from './components/SearchModal';
import { SalesValueModal } from './components/SalesValueModal';
import { SalesHistoryModal } from './components/SalesHistoryModal';
import { SalesGoals } from './components/SalesGoals';
import { PostSalesDetails } from './components/PostSalesDetails';

import { NotificationsPopover } from './components/NotificationsPopover';
import { useSales } from './hooks/useSales';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Menu,
  Target,
  TrendingUp,
  CheckCircle2,
  LayoutGrid,
  Wallet,
  Crown
} from 'lucide-react';

import { Celebration } from './components/Celebration';

function Dashboard() {
  const { user } = useAuth();
  const { 
    sales, 
    addSale, 
    moveSale, 
    deleteSale,
    updateSaleValue,
    activeTab, 
    setActiveTab,
    salespeople,
    deleteSalesperson,
    generalGoal,
    updateGeneralGoal
  } = useSales(user);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Advanced Features State
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [selectedSaleForValue, setSelectedSaleForValue] = useState<{id: string, value: number} | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [postSalesTargetId, setPostSalesTargetId] = useState<number | null>(null);
  
  // Stats calculation
  const totalValue = sales.reduce((acc, s) => acc + s.value, 0);
  const realizedRevenue = sales
    .filter(s => s.stage === 'fechamento' || s.stage === 'acompanhamento')
    .reduce((acc, s) => acc + s.value, 0);

  const totalCount = sales.length;
  const closedSales = sales.filter(s => s.stage === 'fechamento' || s.stage === 'acompanhamento').length;
  const conversionRate = totalCount > 0 ? ((closedSales / totalCount) * 100).toFixed(1) : "0";

  // Background State
  const [currentBg, setCurrentBg] = useState<string | null>(localStorage.getItem('vendas_pro_bg') || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Menu State

  const handleSetBg = (bg: string | null) => {
    setCurrentBg(bg);
    if (bg) localStorage.setItem('vendas_pro_bg', bg);
    else localStorage.removeItem('vendas_pro_bg');
  };

  return (
    <div className="flex bg-[#050508] min-h-screen text-foreground font-['Outfit'] overflow-hidden selection:bg-primary/30">
      <Celebration currentTotal={realizedRevenue} generalGoal={generalGoal} />
      <Sidebar 
        activeTab={activeTab}
        salespeople={salespeople}
        currentBg={currentBg} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSelectTab={(id) => {
          if (id === 'history') setIsHistoryOpen(true);
          else setActiveTab(id);
        }}
        onOpenForm={() => setIsFormOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <OfflineStatus />

      <main className="flex-1 ml-0 xl:ml-80 p-4 md:p-10 min-h-screen overflow-y-auto custom-scrollbar">
        <header className="mb-6 md:mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 md:gap-8">
          <div className="flex items-center justify-between w-full xl:w-auto">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex xl:hidden items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
              >
                <Menu size={24} />
              </button>
              <div className="space-y-1 md:space-y-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full w-fit"
                >
                  <Target size={12} className="text-primary" />
                  <span className="tracking-[0.2em] uppercase text-[10px] font-black text-primary/80">VENDAS PRO BARBER MAPS</span>
                  {user?.role === 'admin' && activeTab !== 'ranking' && activeTab !== 'goals' && activeTab !== 'all' && activeTab !== 'history' && !isNaN(Number(activeTab)) && (
                     <RankingBadge salespersonId={Number(activeTab)} />
                  )}
                </motion.div>
                <h2 className="text-2xl md:text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                  {activeTab === 'ranking' ? 'COPA VENDAS' : 
                   activeTab === 'goals' ? 'GESTÃO DE METAS' :
                   activeTab === 'all' && user?.role === 'admin' ? 'Dashboard Global' :
                   !isNaN(Number(activeTab)) ? `VISÃO: ${salespeople.find(s => s.id === Number(activeTab))?.name || 'Vendedor'}` :
                   `Olá, ${user?.name?.split(' ')[0] || 'Visitante'}`}
                </h2>
                <p className="text-[10px] md:text-sm text-white/30 font-medium tracking-tight uppercase">Monitorando o ecossistema em tempo real.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 w-full xl:w-auto">
            <div className="flex -space-x-3 order-2 md:order-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              {salespeople.map(v => (
                 <div 
                   key={v.id} 
                   className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#050508] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40 ring-2 ring-white/5 cursor-pointer hover:border-primary transition-all"
                   title={v.name}
                   onClick={() => setActiveTab(String(v.id))}
                   style={activeTab === String(v.id) ? { borderColor: v.color, backgroundColor: `${v.color}20` } : {}}
                 >
                   {v.name[0]}
                 </div>
              ))}
              <div 
                onClick={() => setIsFormOpen(true)}
                className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#050508] bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-primary/20 cursor-pointer hover:scale-110 transition-all">+</div>
            </div>
            
            <div className="h-8 md:h-12 w-[1px] bg-white/10 hidden xl:block" />
            
            <div className="flex items-center justify-between xl:justify-start gap-3 w-full xl:w-auto order-1 md:order-2">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
                >
                  <Search size={18} />
                </button>
                <button 
                  onClick={() => setIsNotificationOpen(true)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.08] transition-all relative"
                >
                  <Bell size={18} />
                  <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 md:ring-4 ring-[#050508]" />
                </button>
              </div>
              <div 
                onClick={() => setIsSettingsOpen(true)}
                className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-primary/80 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 ring-2 ring-primary/20 cursor-pointer hover:scale-105 transition-all"
              >
                <span className="font-black text-white text-xs md:text-sm">{user?.name?.[0] || 'U'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Status Grid */}
        {activeTab !== 'ranking' && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
           <StatCard 
              icon={<TrendingUp size={24} className="text-emerald-400" />} 
              label="Caixa / Faturamento" 
              value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(realizedRevenue)}
              trend="+12.5%"
              color="emerald"
              onClick={() => setActiveTab('all')}
            />
            <StatCard 
              icon={<LayoutGrid size={24} className="text-primary" />} 
              label="Negócios Ativos" 
              value={totalCount.toString()} 
              trend="+4"
              color="primary"
              onClick={() => setActiveTab('all')}
            />
            <StatCard 
              icon={<CheckCircle2 size={24} className="text-blue-400" />} 
              label="Conversão" 
              value={`${conversionRate}%`} 
              trend="Stable"
              color="blue"
              onClick={() => setActiveTab('ranking')}
            />
            <StatCard 
              icon={<Wallet size={24} className="text-amber-400" />} 
              label="NEGOCIAÇÕES" 
              value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCount > 0 ? totalValue/totalCount : 0)} 
              trend="-R$200"
              color="amber"
              onClick={() => setActiveTab('all')}
            />
        </section>
        )}

        <div className="flex flex-col gap-8">
          {activeTab === 'goals' ? (
             <SalesGoals 
               sales={sales} 
               salespeople={salespeople} 
               onDeleteSalesperson={deleteSalesperson}
               generalGoal={generalGoal}
               onUpdateGeneralGoal={updateGeneralGoal} 
              />
          ) : activeTab === 'ranking' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto w-full"
            >
              <SalesCompetition salespeople={salespeople} />
            </motion.div>
                     
                  />
              </motion.div>
          ) : activeTab === 'post-sales' ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full"
              >
                 <PostSalesDetails 
                    salespersonId={
                        user?.role === 'seller' 
                        ? (user.salespersonId || 0) 
                        : (postSalesTargetId || (Number(activeTab) || 0))
                    } 
                    onBack={() => {
                        setActiveTab(postSalesTargetId ? String(postSalesTargetId) : 'all');
                        setPostSalesTargetId(null);
                    }}
                 />
              </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <SalesPipeline 
                sales={sales} 
                onMoveSale={moveSale} 
                onDeleteSale={deleteSale} 
                onOpenPostSales={() => {
                    const currentId = !isNaN(Number(activeTab)) ? Number(activeTab) : 0;
                    setPostSalesTargetId(currentId);
                    setActiveTab('post-sales');
                }}
                onUpdateValue={(id, val) => {
                   if (val === -1) {
                     // Open Manual Modal
                     const sale = sales.find(s => s.id === id);
                     if (sale) {
                       setSelectedSaleForValue({ id, value: sale.value });
                       setIsValueModalOpen(true);
                     }
                   } else {
                     updateSaleValue(id, val);
                   }
                }}
              />
            </motion.div>
          )}
        </div>



        <SalesForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={addSale} 
          salespeople={salespeople}
          user={user}
        />

        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentBg={currentBg}
          onSetBg={handleSetBg}
        />

        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          sales={sales}
        />

        <NotificationsPopover
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />

        <BottomNav 
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenForm={() => setIsFormOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Advanced Features Modals */}
        <SalesValueModal 
          isOpen={isValueModalOpen}
          onClose={() => setIsValueModalOpen(false)}
          initialValue={selectedSaleForValue?.value || 0}
          onConfirm={(newValue) => {
            if (selectedSaleForValue) {
              updateSaleValue(selectedSaleForValue.id, newValue);
              setIsValueModalOpen(false);
            }
          }}
        />

        <SalesHistoryModal 
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          sales={sales}
        />
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color, onClick }: { icon: React.ReactNode, label: string, value: string, trend: string, color: string, onClick?: () => void }) {
  const colorMap: Record<string, string> = {
    primary: 'border-primary/20 bg-primary/5 group-hover:bg-primary/10',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10',
    blue: 'border-blue-500/20 bg-blue-500/5 group-hover:bg-blue-500/10',
    amber: 'border-amber-500/20 bg-amber-500/5 group-hover:bg-amber-500/10',
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left glass border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] group hover:border-white/20 transition-all duration-500 relative overflow-hidden bg-white/[0.02] cursor-pointer`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 ${colorMap[color].split(' ')[0].replace('border', 'bg')}`} />
      
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${colorMap[color]}`}>
          {icon}
        </div>
        <div className="px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-white/40 tracking-wider">
          {trend}
        </div>
      </div>
      
      <div className="space-y-1">
        <p className="text-[10px] md:text-xs font-bold text-white/20 uppercase tracking-[0.2em]">{label}</p>
        <p className="text-2xl md:text-3xl font-black text-white tracking-tighter antialiased">{value}</p>
      </div>
    </button>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050508] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthModal />;
}



function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function RankingBadge({ salespersonId }: { salespersonId: number }) {
  const [rank, setRank] = React.useState<{ position: number, total: number } | null>(null);

  React.useEffect(() => {
    fetch('/api/ranking').then(res => res.json()).then(data => {
      const idx = data.findIndex((r: any) => r.id === salespersonId);
      if (idx !== -1) {
        setRank({ position: idx + 1, total: data[idx].totalValue });
      }
    });
  }, [salespersonId]);

  if (!rank) return null;

  return (
    <div className="flex items-center gap-2 ml-4">
      <div className="w-1 h-3 bg-white/10 rounded-full" />
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
        <Crown size={10} className="text-emerald-500" />
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">#{rank.position} na Copa</span>
      </div>
    </div>
  );
}

export default App;
