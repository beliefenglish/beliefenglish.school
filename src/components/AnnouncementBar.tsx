import React from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

interface AnnouncementBarProps {
  onOpenModal: () => void;
}

export default function AnnouncementBar({ onOpenModal }: AnnouncementBarProps) {
  const { siteSettings, updateSiteSettings } = useAdmin();

  if (!siteSettings.showAnnouncement) return null;

  return (
    <div className="bg-gradient-to-r from-[#1e3a8a] via-blue-900 to-[#172554] text-white text-xs py-2.5 px-4 relative z-50 border-b border-blue-800/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 text-center sm:text-left overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse shrink-0 hidden sm:inline-block"></span>
          <p className="font-semibold truncate text-[11px] sm:text-xs text-blue-100">
            {siteSettings.announcementText}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenModal}
            className="px-3 py-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-[11px] shadow-sm flex items-center gap-1 transition-transform hover:scale-105 cursor-pointer"
          >
            <span>{siteSettings.announcementLinkText || 'Đăng Ký Ngay'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => updateSiteSettings({ showAnnouncement: false })}
            title="Đóng thông báo"
            className="p-1 rounded-full text-blue-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
