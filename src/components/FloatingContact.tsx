import React from 'react';
import { Phone, MessageCircle, Sparkles } from 'lucide-react';
import BeliefLogo from './BeliefLogo';
import { useAdmin } from '../context/AdminContext';

interface FloatingContactProps {
  onOpenTestModal: () => void;
}

export default function FloatingContact({ onOpenTestModal }: FloatingContactProps) {
  const { siteSettings } = useAdmin();

  const cleanPhone = (phoneStr: string) => phoneStr.replace(/[^0-9]/g, '');

  return (
    <>
      {/* Desktop / Tablet Floating Widgets (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3 pointer-events-none">
        {/* Zalo Button */}
        <a
          href={`https://zalo.me/${cleanPhone(siteSettings.zalo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto group flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-x-1"
          aria-label={`Chat Zalo ${siteSettings.zalo}`}
        >
          <div className="w-8 h-8 rounded-full bg-white text-blue-600 flex items-center justify-center font-black text-xs shadow-xs">
            Zalo
          </div>
          <div className="text-left">
            <div className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">Chat Zalo 24/7</div>
            <div className="text-xs font-black tracking-wide">{siteSettings.zalo}</div>
          </div>
        </a>

        {/* Hotline Call Button */}
        <a
          href={`tel:${cleanPhone(siteSettings.hotline1)}`}
          className="pointer-events-auto group flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-x-1"
          aria-label={`Gọi Hotline ${siteSettings.hotline1}`}
        >
          <div className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-xs">
            <Phone className="w-4 h-4 animate-bounce" />
          </div>
          <div className="text-left">
            <div className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider">Hotline Tư Vấn</div>
            <div className="text-xs font-black tracking-wide">
              {siteSettings.hotline1} {siteSettings.hotline2 ? `/ ${siteSettings.hotline2}` : ''}
            </div>
          </div>
        </a>

        {/* Test Registration Button with Belief Logo */}
        <button
          onClick={onOpenTestModal}
          className="pointer-events-auto group flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white pl-2.5 pr-5 py-2.5 rounded-full shadow-xl shadow-orange-500/30 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
        >
          <BeliefLogo variant="circle" size="sm" />
          <div className="text-left">
            <div className="text-[10px] text-orange-100 font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Miễn Phí 1-1</span>
            </div>
            <div className="text-sm font-black tracking-tight">Đăng Ký Test Năng Lực</div>
          </div>
        </button>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center justify-between gap-2">
        <a
          href={`https://zalo.me/${cleanPhone(siteSettings.zalo)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Zalo {siteSettings.zalo}</span>
        </a>

        <a
          href={`tel:${cleanPhone(siteSettings.hotline1)}`}
          className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Phone className="w-4 h-4" />
          <span>Gọi Hotline</span>
        </a>

        <button
          onClick={onOpenTestModal}
          className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-center font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-orange-500/25"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Test 1-1</span>
        </button>
      </div>
    </>
  );
}
