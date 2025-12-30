import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft, Clock, Edit2, X, Check } from 'lucide-react';

interface Visit {
  id: string;
  date: string;
  clientName: string;
  salespersonId: number;
  saleId: string;
}

interface PostSalesDetailsProps {
  salespersonId: number;
  onBack: () => void;
}

export const PostSalesDetails: React.FC<PostSalesDetailsProps> = ({ salespersonId, onBack }) => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<string>('');

  const fetchVisits = async () => {
    try {
      const res = await fetch(`/api/visits?salespersonId=${salespersonId}`);
      if (res.ok) {
          const data = await res.json();
          setVisits(data);
      }
    } catch (error) {
      console.error('Error fetching visits', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [salespersonId]);

  const handleReschedule = async (id: string) => {
      try {
          const res = await fetch(`/api/visits/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ date: new Date(newDate).toISOString() })
          });
          if (res.ok) {
              setEditingId(null);
              fetchVisits(); // Refresh list
          }
      } catch (error) {
          console.error('Error rescheduling', error);
      }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/50 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
           <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Pós-Venda & Visitas</h2>
           <p className="text-sm text-white/40">Agenda de acompanhamento</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-3xl">
           <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
             <Calendar size={24} className="text-white/20" />
           </div>
           <p className="text-white/40 text-sm font-medium">Nenhuma visita agendada</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit, index) => (
            <motion.div
              key={visit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between group hover:border-white/10 transition-all gap-4"
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-primary/10 border border-primary/20">
                   <span className="text-xs font-bold text-primary uppercase">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</span>
                   <span className="text-2xl font-black text-white">{new Date(visit.date).getDate()}</span>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-white/40" />
                    <span className="text-lg font-bold text-white">{visit.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                        {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                 {editingId === visit.id ? (
                     <div className="flex items-center gap-2 w-full md:w-auto">
                         <input 
                            type="date" 
                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-primary/50"
                            onChange={(e) => setNewDate(e.target.value)}
                         />
                         <button 
                            onClick={() => handleReschedule(visit.id)}
                            className="p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-all"
                         >
                            <Check size={16} />
                         </button>
                         <button 
                            onClick={() => setEditingId(null)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                         >
                            <X size={16} />
                         </button>
                     </div>
                 ) : (
                     <button
                        onClick={() => {
                            setEditingId(visit.id);
                            setNewDate(new Date(visit.date).toISOString().split('T')[0]);
                        }} 
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:text-white transition-all flex items-center gap-2 w-full md:w-auto justify-center"
                     >
                        <Edit2 size={12} />
                        <span>Remarcar</span>
                     </button>
                 )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
