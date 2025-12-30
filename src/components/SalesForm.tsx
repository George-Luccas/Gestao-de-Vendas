import React, { useState } from 'react';
import { X, User, DollarSign, FileText, ChevronRight } from 'lucide-react';
import { STAGES } from '../hooks/useSales';
import { motion, AnimatePresence } from 'framer-motion';
import { saleSchema } from '../utils/validation';

interface SalesFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sale: any) => void;
  salespeople: { id: number; name: string }[];
  user: any; // Using any to avoid importing User type if not strictly needed, or import it. Ideally import User.
}

export const SalesForm: React.FC<SalesFormProps> = ({ isOpen, onClose, onSubmit, salespeople, user }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    value: '',
    stage: 'cadastro',
    salespersonId: user?.role === 'seller' ? user.salespersonId : (salespeople[0]?.id || 1),
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const validation = saleSchema.safeParse({
      ...formData,
      value: Number(formData.value)
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach(issue => {
        if (issue.path[0]) fieldErrors[issue.path[0].toString()] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit({
      ...formData,
      value: Number(formData.value),
      createdAt: new Date().toISOString(),
    });
    setFormData({ 
      clientName: '', 
      value: '', 
      stage: 'cadastro', 
      salespersonId: user?.role === 'seller' ? user.salespersonId : (salespeople[0]?.id || 1), 
      description: '' 
    });
    onClose();
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
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          />
          
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-full max-w-2xl glass-card-premium overflow-hidden rounded-3xl relative max-h-[90dvh] overflow-y-auto"
          >
            {/* Form Header */}
            <div className="p-6 md:p-10 pb-4 md:pb-4 flex justify-between items-center bg-white/5 border-b border-white/5">
               <div>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter">Novo Negócio</h2>
                  <p className="text-[9px] md:text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Preencha os dados do contrato</p>
               </div>
               <button 
                 onClick={onClose}
                 className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/40 hover:text-white"
               >
                 <X size={20} />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Cliente</label>
                     <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                          required
                          className={`w-full h-14 pl-12 pr-6 bg-white/[0.03] border ${errors.clientName ? 'border-red-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all text-sm font-bold placeholder:text-white/10`}
                          placeholder="Nome da empresa ou contato"
                          value={formData.clientName}
                          onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                        />
                     </div>
                     {errors.clientName && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">{errors.clientName}</p>}
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Valor do Contrato</label>
                     <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <input 
                          required
                          type="number"
                          data-error={!!errors.value}
                          className={`w-full h-14 pl-12 pr-6 bg-white/[0.03] border ${errors.value ? 'border-red-500/50' : 'border-white/10'} rounded-2xl focus:outline-none focus:border-emerald-500/40 focus:bg-white/[0.06] transition-all text-sm font-bold`}
                          placeholder="0,00"
                          value={formData.value}
                          onChange={e => setFormData({ ...formData, value: e.target.value })}
                        />
                     </div>
                     {errors.value && <p className="text-[10px] text-red-500 font-bold ml-1 mt-1">{errors.value}</p>}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Estágio Inicial</label>
                     <select 
                       className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all text-sm font-bold appearance-none cursor-pointer"
                       value={formData.stage}
                       onChange={e => setFormData({ ...formData, stage: e.target.value as any })}
                     >
                       {STAGES.map(s => <option key={s.id} value={s.id} className="bg-[#0f0f15]">{s.label}</option>)}
                     </select>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Vendedor Responsável</label>
                     <select 
                       className="w-full h-14 px-6 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all text-sm font-bold appearance-none cursor-pointer"
                       value={formData.salespersonId}
                       onChange={e => setFormData({ ...formData, salespersonId: Number(e.target.value) })}
                       disabled={user?.role === 'seller'}
                     >
                       {salespeople.map(v => <option key={v.id} value={v.id} className="bg-[#0f0f15]">{v.name}</option>)}
                     </select>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1">Observações do Negócio</label>
                  <div className="relative group">
                     <FileText className="absolute left-4 top-5 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                     <textarea 
                       className="w-full h-32 pl-12 pr-6 pt-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:outline-none focus:border-primary/40 focus:bg-white/[0.06] transition-all text-sm font-bold resize-none placeholder:text-white/10"
                       placeholder="Descreva os detalhes da negociação..."
                       value={formData.description}
                       onChange={e => setFormData({ ...formData, description: e.target.value })}
                     />
                  </div>
               </div>

               <div className="flex flex-col-reverse md:flex-row justify-end gap-3 md:gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="h-12 md:h-14 px-8 rounded-xl md:rounded-2xl border border-white/10 font-bold text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all w-full md:w-auto"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="h-12 md:h-14 px-10 rounded-xl md:rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group w-full md:w-auto"
                  >
                    <span>Salvar Negócio</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
