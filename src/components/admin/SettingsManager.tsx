import React, { useState } from 'react';
import {
  Settings,
  Phone,
  MessageCircle,
  MapPin,
  Mail,
  Clock,
  Megaphone,
  Save,
  RotateCcw,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export default function SettingsManager() {
  const { siteSettings, updateSiteSettings, resetSiteSettings } = useAdmin();
  const [formState, setFormState] = useState({ ...siteSettings });
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formState);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[#1e3a8a]">
            Cài Đặt Website & Kênh Liên Hệ
          </h3>
          <p className="text-xs text-slate-500">
            Cập nhật hotline, Zalo, địa chỉ cơ sở, email và thanh thông báo ưu đãi hiển thị trên trang.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.confirm('Khôi phục toàn bộ cài đặt về mặc định?')) {
              resetSiteSettings();
              setFormState(siteSettings);
            }
          }}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Mặc Định</span>
        </button>
      </div>

      {showSavedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Đã lưu cài đặt thành công! Dữ liệu đã được cập nhật trực tiếp trên website.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1e3a8a] border-b border-slate-100 pb-3">
            <Phone className="w-4 h-4 text-orange-500" />
            <span>Kênh Liên Hệ Trực Tiếp (Hotline & Zalo)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hotline chính (Hiển thị đầu trang & Widget gọi) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formState.hotline1}
                  onChange={e => setFormState({ ...formState, hotline1: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hotline phụ / Tuyển sinh
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formState.hotline2}
                  onChange={e => setFormState({ ...formState, hotline2: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Số Zalo Tư Vấn (Dùng để tạo link chat Zalo) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formState.zalo}
                  onChange={e => setFormState({ ...formState, zalo: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <MessageCircle className="w-3.5 h-3.5 text-blue-600 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Hệ thống tự động liên kết đến https://zalo.me/[Số_Zalo]</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email nhận liên hệ
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Địa chỉ cơ sở chính
            </label>
            <div className="relative">
              <input
                type="text"
                value={formState.address}
                onChange={e => setFormState({ ...formState, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <MapPin className="w-3.5 h-3.5 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Thời gian làm việc / Tiếp phụ huynh
            </label>
            <div className="relative">
              <input
                type="text"
                value={formState.workHours}
                onChange={e => setFormState({ ...formState, workHours: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Announcement Bar Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1e3a8a]">
              <Megaphone className="w-4 h-4 text-orange-500" />
              <span>Thanh Thông Báo Ưu Đãi / Tuyển Sinh Đầu Trang</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formState.showAnnouncement}
                onChange={e => setFormState({ ...formState, showAnnouncement: e.target.checked })}
                className="w-4 h-4 text-[#1e3a8a] rounded"
              />
              <span className="text-xs font-bold text-slate-700">Bật hiển thị</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nội dung thông báo nổi bật
            </label>
            <input
              type="text"
              value={formState.announcementText}
              onChange={e => setFormState({ ...formState, announcementText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Chữ trên nút bấm hành động
            </label>
            <input
              type="text"
              value={formState.announcementLinkText}
              onChange={e => setFormState({ ...formState, announcementLinkText: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
        </div>

        {/* Legal & Brand Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="text-sm font-bold text-[#1e3a8a] border-b border-slate-100 pb-3">
            Pháp Nhân & Thương Hiệu
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên pháp nhân công ty
            </label>
            <input
              type="text"
              value={formState.companyName}
              onChange={e => setFormState({ ...formState, companyName: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Toàn Bộ Cài Đặt</span>
          </button>
        </div>
      </form>
    </div>
  );
}
