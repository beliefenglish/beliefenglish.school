import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  ArrowLeft,
  Sparkles,
  Phone,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  ExternalLink,
  Image as ImageIcon,
  FolderOpen,
  LogOut,
  Key,
  ShieldCheck,
  X,
} from 'lucide-react';
import BeliefLogo from '../BeliefLogo';
import LeadsManager from './LeadsManager';
import CoursesManager from './CoursesManager';
import SettingsManager from './SettingsManager';
import MediaManager from './MediaManager';
import LibraryManager from './LibraryManager';
import AdminLoginModal from './AdminLoginModal';
import { useAdmin } from '../../context/AdminContext';

export default function AdminDashboard() {
  const {
    adminAuth,
    logoutAdmin,
    changeAdminPassword,
    setIsAdminView,
    leads,
    courses,
    libraryBooks,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'leads' | 'courses' | 'media' | 'library' | 'settings'>('leads');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; error?: boolean } | null>(null);

  // If not logged in, show Login Screen
  if (!adminAuth.isAuthenticated) {
    return <AdminLoginModal onBackToSite={() => setIsAdminView(false)} />;
  }

  const pendingLeads = leads.filter(l => l.status === 'new').length;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);
    const res = changeAdminPassword(oldPassword, newPassword);
    if (res.success) {
      setPwdMsg({ text: 'Đã đổi mật khẩu thành công!' });
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPwdMsg(null);
      }, 1500);
    } else {
      setPwdMsg({ text: res.error || 'Đổi mật khẩu thất bại.', error: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col">
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#1e3a8a] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Portal Title */}
            <div className="flex items-center gap-3">
              <BeliefLogo variant="white" size="sm" showSubtitle={false} />
              <div className="h-6 w-px bg-blue-700 hidden sm:block"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black tracking-wide text-orange-300 uppercase">
                  Bảng Quản Trị Hệ Thống
                </span>
                <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-800 text-blue-200 border border-blue-700">
                  BELIS Admin Portal
                </span>
              </div>
            </div>

            {/* Right Action Controls: Owner Email, Password, Logout, Return */}
            <div className="flex items-center gap-2.5">
              {/* Owner Email Pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-700 text-xs text-blue-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{adminAuth.email}</span>
                <span className="text-[10px] text-orange-300 font-bold">(Chủ sở hữu)</span>
              </div>

              {/* Change Password Button */}
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Đổi mật khẩu quản trị"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đổi MK</span>
              </button>

              {/* Back to Live Website Button */}
              <button
                onClick={() => setIsAdminView(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem Trang Web</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={logoutAdmin}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold bg-red-500/20 hover:bg-red-500/40 text-red-200 border border-red-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                title="Đăng xuất khỏi Dashboard"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'leads'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Đăng Ký Học Viên</span>
            {pendingLeads > 0 && (
              <span className="w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-black flex items-center justify-center">
                {pendingLeads}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Khóa Học ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'media'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Upload Logo & Hình Ảnh</span>
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>Thư Viện Sách & Link ({libraryBooks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 min-w-[150px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#1e3a8a] text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cài Đặt Website</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'leads' && <LeadsManager />}
        {activeTab === 'courses' && <CoursesManager />}
        {activeTab === 'media' && <MediaManager />}
        {activeTab === 'library' && <LibraryManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#1e3a8a]">
                Đổi Mật Khẩu Quản Trị
              </h3>
              <p className="text-xs text-slate-500">
                Tài khoản: {adminAuth.email}
              </p>
            </div>

            {pwdMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-bold ${
                  pwdMsg.error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                {pwdMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự) *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-900 shadow-sm cursor-pointer"
                >
                  Cập Nhật Mật Khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Hệ thống Quản trị Nội bộ • Trung tâm Ngoại ngữ Niềm Tin - Belief English (BELIS GROUP)</p>
      </footer>
    </div>
  );
}
