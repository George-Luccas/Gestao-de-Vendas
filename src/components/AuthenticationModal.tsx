import React, { useState } from 'react';
import { useAuth, Role } from '../context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
// import { motion } from 'framer-motion';

export const AuthModal: React.FC = () => {
  // Initialize state based on URL parameter
  const [isLogin, setIsLogin] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') !== 'register';
  });
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('seller');
  // const [salespersonId, setSalespersonId] = useState<number>(1); // Removed: auto-assigned by backend
  const { login, register } = useAuth();
  const [error, setError] = useState('');

  const toggleMode = () => {
    const newMode = isLogin ? 'register' : 'login';
    const url = new URL(window.location.href);
    if (newMode === 'login') {
      url.searchParams.delete('mode');
    } else {
      url.searchParams.set('mode', 'register');
    }
    window.location.href = url.toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div 
        className="w-full max-w-md glass-card-premium bg-[#121212] p-6 md:p-8 max-h-[90dvh] overflow-y-auto"
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
          <div className={`${isLogin ? 'hidden' : 'block'}`}>
            <div className="relative">
              <input
                required={!isLogin}
                type="text"
                placeholder="Nome Completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              />
            </div>
          </div>

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

          <div className={`${isLogin ? 'hidden' : 'block'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 px-1 notranslate" translate="no">Cargo</label>
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full bg-[#121216] border border-white/10 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                >
                  <option value="seller">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
{/* ID Selector Removed (Auto-assigned) */}
            </div>
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
            <input
              required
              type="password"
              placeholder="Senha"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-white/20">Manual</span> */}
          </div>

          {error && <p className="text-red-400 text-xs text-center font-medium bg-red-400/10 py-2 rounded-lg">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary/80 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] mt-4"
          >
            {isLogin ? <LogIn size={20} /> : null}
            {isLogin ? 'Entrar Agora' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={toggleMode}
            className="text-white/40 hover:text-primary transition-colors text-sm"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça o Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
