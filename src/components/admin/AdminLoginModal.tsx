import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import BeliefLogo from '../BeliefLogo';
import { useAdmin } from '../../context/AdminContext';

interface AdminLoginModalProps {
  onBackToSite: () => void;
}

export default function AdminLoginModal({ onBackToSite }: AdminLoginModalProps) {
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('beliefenglish.edu@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const res = loginAdmin(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Đăng nhập không thành công.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Return Button */}
        <button
          onClick={onBackToSite}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1e3a8a] mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ khách hàng</span>
        </button>

        {/* Branding Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-block">
            <BeliefLogo variant="circle" size="lg" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#1e3a8a] tracking-tight">
              Đăng Nhập Quản Trị Viên
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Bảng điều khiển hệ thống Belief English • BELIS GROUP
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-[#1e3a8a] border border-blue-100 rounded-full text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chủ sở hữu: beliefenglish.edu@gmail.com</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Quản Trị Viên *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="beliefenglish.edu@gmail.com"
                className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mật Khẩu *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              💡 Mật khẩu ban đầu mặc định: <code className="text-[#1e3a8a] font-bold bg-blue-50 px-1.5 py-0.5 rounded">Belief@2025</code>
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-blue-900 transition-all duration-200 shadow-lg shadow-blue-900/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Đăng Nhập Vào Dashboard</span>
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Chỉ dành riêng cho ban điều hành và tuyển sinh BELIS GROUP
        </div>
      </div>
    </div>
  );
}
