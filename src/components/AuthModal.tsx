import React, { useState } from 'react';
import { useAuth, Role } from '../context/AuthContext';
import { LogIn, User as UserIcon, Mail, Lock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('seller');
  const [salespersonId, setSalespersonId] = useState<number>(1);
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email);
      } else {
        await register(name, email, role, role === 'seller' ? salespersonId : undefined);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass-card p-6 md:p-8 max-h-[90dvh] overflow-y-auto"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
          {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h2>
        <p className="text-white/40 text-center mb-8 text-sm">
          {isLogin ? 'Acesse o painel de gestão Vendas Pro' : 'Comece a gerenciar suas vendas agora'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                required
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              required
              type="email"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase px-1">Cargo</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                >
                  <option value="seller">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              {role === 'seller' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase px-1">ID Vendedor</label>
                  <select 
                    value={salespersonId} 
                    onChange={(e) => setSalespersonId(Number(e.target.value))}
                    className="w-full bg-[#121216] border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                  >
                    {[1, 2, 3, 4].map(id => <option key={id} value={id}>Vendedor {id}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              required
              type="password"
              placeholder="Senha"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 transition-all outline-none opacity-50"
              disabled
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20">Automático</span>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] mt-4"
          >
            {isLogin ? <LogIn size={20} /> : <UserIcon size={20} />}
            {isLogin ? 'Entrar Agora' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça o Login'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
