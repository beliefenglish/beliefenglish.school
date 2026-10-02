import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import BeliefLogo from '../BeliefLogo';

export default function MediaManager() {
  const { siteMedia, updateLogo, updateCategoryImage, resetMedia } = useAdmin();
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'blue' | 'white' | 'circle' | string,
    isCategory: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Vui lòng chọn hình ảnh có dung lượng dưới 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (isCategory) {
        updateCategoryImage(type, result);
        triggerToast(`Đã tải lên hình ảnh cho danh mục: ${type}`);
      } else {
        updateLogo(type as 'blue' | 'white' | 'circle', result);
        triggerToast(`Đã cập nhật Logo (${type}) thành công!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const categoryList = [
    { id: 'kindy', name: 'Hệ Kindy (Mầm non 3-6T)', desc: 'Ảnh minh họa lớp học mầm non, vui chơi, thẩm thấu' },
    { id: 'ready', name: 'Hệ Ready (Vá mất gốc 6-9T)', desc: 'Ảnh học sinh tiểu học, củng cố ngữ pháp, tự tin' },
    { id: 'starters', name: 'Cambridge Starters (Pre-A1)', desc: 'Ảnh luyện thi chứng chỉ, tranh vẽ, học sinh 7-8T' },
    { id: 'movers', name: 'Cambridge Movers (A1)', desc: 'Ảnh học sinh 8-10T, kỹ năng nghe nói tương tác' },
    { id: 'flyers', name: 'Cambridge Flyers (A2)', desc: 'Ảnh học sinh 10-12T, chuyển cấp chuyên' },
    { id: 'ket', name: 'Cambridge KET (A2 Key)', desc: 'Ảnh học sinh THCS, rèn luyện tiếng Anh học thuật' },
    { id: 'pet', name: 'Cambridge PET (B1 Preliminary)', desc: 'Ảnh học sinh ôn luyện miễn thi tốt nghiệp THPT' },
    { id: 'ielts', name: 'Luyện Thi IELTS (Academic & Expert)', desc: 'Ảnh giảng viên và học sinh bứt phá band 6.5 - 8.0+' },
    { id: 'adults', name: 'Hệ Adults (Giao tiếp người lớn)', desc: 'Ảnh lớp học người đi làm, thuyết trình công sở' },
  ];

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-[#1e3a8a]">
            Quản Lý & Tải Lên Hình Ảnh (Logo & Danh Mục Khóa Học)
          </h3>
          <p className="text-xs text-slate-500">
            Tải lên logo chính thức của trung tâm và hình ảnh minh họa cho từng khóa học. Hệ thống tự động tối ưu và cập nhật trực tiếp trên trang.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Khôi phục toàn bộ hình ảnh và logo về mặc định?')) {
              resetMedia();
              triggerToast('Đã đặt lại hình ảnh mặc định');
            }
          }}
          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Khôi Phục Mặc Định</span>
        </button>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. LOGO UPLOAD SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-sm font-black text-[#1e3a8a] border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span>Hệ Thống Logo Thương Hiệu Belief English</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Logo 1: Blue Version */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1e3a8a]">1. Logo Xanh (Nền Sáng)</span>
                <span className="text-[10px] bg-blue-100 text-[#1e3a8a] px-2 py-0.5 rounded font-bold">Navbar & Header</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Dùng trên thanh Navbar, thẻ thông tin và các khối nền trắng/sáng.
              </p>

              {/* Preview */}
              <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-3 shadow-inner">
                {siteMedia.customLogoBlue ? (
                  <img src={siteMedia.customLogoBlue} alt="Logo Blue" className="max-h-full max-w-full object-contain" />
                ) : (
                  <BeliefLogo variant="blue" size="md" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block w-full text-center py-2 px-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                <span>Tải Lên Logo Xanh</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={e => handleFileUpload(e, 'blue')}
                  className="hidden"
                />
              </label>
              {siteMedia.customLogoBlue && (
                <button
                  onClick={() => updateLogo('blue', '')}
                  className="w-full text-center py-1 text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Xóa ảnh tải lên (Dùng icon mặc định)
                </button>
              )}
            </div>
          </div>

          {/* Logo 2: White Version */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 text-white">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white">2. Logo Trắng (Nền Tối)</span>
                <span className="text-[10px] bg-white/20 text-orange-300 px-2 py-0.5 rounded font-bold">Footer</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">
                Dùng ở chân trang Footer và các banner nền tối/navy.
              </p>

              {/* Preview */}
              <div className="h-28 bg-slate-950 rounded-xl border border-white/10 flex items-center justify-center p-3 shadow-inner">
                {siteMedia.customLogoWhite ? (
                  <img src={siteMedia.customLogoWhite} alt="Logo White" className="max-h-full max-w-full object-contain" />
                ) : (
                  <BeliefLogo variant="white" size="md" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block w-full text-center py-2 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                <span>Tải Lên Logo Trắng</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={e => handleFileUpload(e, 'white')}
                  className="hidden"
                />
              </label>
              {siteMedia.customLogoWhite && (
                <button
                  onClick={() => updateLogo('white', '')}
                  className="w-full text-center py-1 text-[11px] text-red-400 hover:text-red-300 font-semibold cursor-pointer"
                >
                  Xóa ảnh tải lên (Dùng icon mặc định)
                </button>
              )}
            </div>
          </div>

          {/* Logo 3: Circular Badge */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#1e3a8a]">3. Logo Tròn (Circle Badge)</span>
                <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">Huy Hiệu & Widget</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Dùng trên nút đăng ký nổi, chứng chỉ và hình ảnh Hero.
              </p>

              {/* Preview */}
              <div className="h-28 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-3 shadow-inner">
                {siteMedia.customLogoCircle ? (
                  <img src={siteMedia.customLogoCircle} alt="Circle Logo" className="w-16 h-16 rounded-full object-contain" />
                ) : (
                  <BeliefLogo variant="circle" size="md" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block w-full text-center py-2 px-3 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs cursor-pointer shadow-xs transition-colors">
                <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                <span>Tải Lên Logo Tròn</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={e => handleFileUpload(e, 'circle')}
                  className="hidden"
                />
              </label>
              {siteMedia.customLogoCircle && (
                <button
                  onClick={() => updateLogo('circle', '')}
                  className="w-full text-center py-1 text-[11px] text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                >
                  Xóa ảnh tải lên (Dùng icon mặc định)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. COURSE CATEGORY IMAGES SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-sm font-black text-[#1e3a8a]">
            <ImageIcon className="w-4 h-4 text-orange-500" />
            <span>Hình Ảnh Minh Họa Theo Từng Danh Mục Khóa Học</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Hỗ trợ PNG, JPG, WebP</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryList.map(cat => {
            const currentImg = siteMedia.categoryImages[cat.id];
            return (
              <div
                key={cat.id}
                className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <h4 className="text-xs font-black text-[#1e3a8a] mb-1">{cat.name}</h4>
                  <p className="text-[11px] text-slate-500 mb-3">{cat.desc}</p>

                  {/* Thumbnail Preview */}
                  <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative group flex items-center justify-center">
                    {currentImg ? (
                      <img
                        src={currentImg}
                        alt={cat.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center text-slate-400 p-3">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                        <span className="text-[11px] font-semibold block">Chưa tải ảnh lên</span>
                        <span className="text-[10px] text-slate-400 block">(Đang dùng ảnh mẫu mặc định)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <label className="block w-full text-center py-2 px-3 rounded-xl bg-white hover:bg-blue-50 border border-slate-300 text-slate-700 hover:text-[#1e3a8a] font-bold text-xs cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-3.5 h-3.5 inline mr-1 text-[#1e3a8a]" />
                    <span>{currentImg ? 'Thay Đổi Ảnh' : 'Tải Ảnh Mới'}</span>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={e => handleFileUpload(e, cat.id, true)}
                      className="hidden"
                    />
                  </label>

                  {currentImg && (
                    <button
                      onClick={() => updateCategoryImage(cat.id, '')}
                      className="w-full text-center py-1 text-[11px] text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                    >
                      Gỡ bỏ ảnh tùy chỉnh
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
