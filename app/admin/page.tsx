'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {
  Upload,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Building,
  Sparkles,
  BookOpen,
  Award,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  Brain,
  Zap,
  Shield,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';
import { SiteContent, Course } from '@/types/content';
import { defaultContent } from '@/lib/default-content';

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function loadContent() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/content', { cache: 'no-store' });
        if (res.ok) {
          const data = (await res.json()) as SiteContent;
          setContent(data);
        }
      } catch (err) {
        console.error('Failed to load site content:', err);
        setFeedback({
          message: 'Không thể nạp dữ liệu từ máy chủ. Đang sử dụng dữ liệu mặc định.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadContent();
  }, []);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setFeedback(null);

      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const newBlob = await response.json();
      setContent(prev => ({
        ...prev,
        brand: {
          ...prev.brand,
          logoUrl: newBlob.url,
        },
      }));

      setFeedback({
        message: 'Tải lên hình ảnh logo thành công!',
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi không xác định khi upload ảnh';
      console.error('Upload error:', err);
      setFeedback({
        message: `Lỗi upload: ${msg}`,
        type: 'error',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setFeedback(null);

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (!response.ok) {
        throw new Error('Không thể lưu dữ liệu vào Vercel KV');
      }

      setFeedback({
        message: 'Đã lưu tất cả thay đổi thành công! Dữ liệu đã cập nhật trên trang chủ.',
        type: 'success',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi cập nhật';
      setFeedback({
        message: `Lỗi khi lưu dữ liệu: ${msg}`,
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateCourse = (index: number, field: keyof Course, value: string | string[]) => {
    setContent(prev => {
      const newCourses = [...prev.courses];
      newCourses[index] = { ...newCourses[index], [field]: value };
      return { ...prev, courses: newCourses };
    });
  };

  const addCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: 'Khóa học mới',
      ageGroup: 'Độ tuổi',
      duration: 'Thời lượng',
      description: 'Mô tả chi tiết khóa học...',
      features: ['Ưu điểm 1', 'Ưu điểm 2'],
    };
    setContent(prev => ({ ...prev, courses: [...prev.courses, newCourse] }));
  };

  const removeCourse = (index: number) => {
    setContent(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index),
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#1e3a8a] font-bold">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span>Đang nạp cấu hình Vercel KV...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#1e3a8a] text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="p-2 rounded-xl bg-blue-900/60 hover:bg-blue-800 text-blue-200 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Xem Trang Chủ</span>
            </a>
            <div className="h-5 w-px bg-blue-700 hidden sm:block" />
            <h1 className="text-sm sm:text-base font-black uppercase tracking-wide text-orange-400">
              Bảng Quản Trị Hệ Thống (Vercel KV & Blob)
            </h1>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Đang Lưu...' : 'Lưu Thay Đổi'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span className="text-sm font-semibold">{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs font-bold underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Brand Info & Logo Upload */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
              <Building className="w-5 h-5 text-[#1e3a8a]" />
              <h2 className="text-base font-bold text-slate-800">
                1. Thông Tin Thương Hiệu & Logo (Vercel Blob Storage)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tên trung tâm / Thương hiệu
                  </label>
                  <input
                    type="text"
                    value={content.brand.name}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        brand: { ...prev.brand, name: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Số điện thoại Hotline
                  </label>
                  <input
                    type="text"
                    value={content.brand.phone}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        brand: { ...prev.brand, phone: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Địa chỉ Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={content.brand.email}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        brand: { ...prev.brand, email: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Địa chỉ cơ sở hoạt động
                  </label>
                  <input
                    type="text"
                    value={content.brand.address}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        brand: { ...prev.brand, address: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              {/* Logo Upload Box */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Tải lên Logo Thương Hiệu (@vercel/blob)
                  </label>
                  <p className="text-xs text-slate-500 mb-4">
                    Tải lên tệp ảnh PNG hoặc JPG. Hệ thống sẽ tự động lưu trữ trên Vercel Blob CDN và cập nhật đường dẫn.
                  </p>

                  <div className="flex items-center gap-4 mb-4">
                    {content.brand.logoUrl ? (
                      <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 p-2 flex items-center justify-center shadow-xs">
                        <img
                          src={content.brand.logoUrl}
                          alt="Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-white border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                        <span className="text-[10px]">Chưa có logo</span>
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1e3a8a] hover:bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs">
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4" />
                        )}
                        <span>{isUploading ? 'Đang Tải Lên...' : 'Chọn Tệp Ảnh Logo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={isUploading}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-2 truncate">
                        {content.brand.logoUrl ? content.brand.logoUrl : 'Khuyên dùng ảnh logo trong suốt PNG'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Đường dẫn logo thủ công (tùy chọn)
                  </label>
                  <input
                    type="url"
                    value={content.brand.logoUrl}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        brand: { ...prev.brand, logoUrl: e.target.value },
                      }))
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Hero Section */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h2 className="text-base font-bold text-slate-800">
                2. Phần Mở Đầu Trang Chủ (Hero Section)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tiêu đề chính (Headline)
                </label>
                <input
                  type="text"
                  value={content.hero.headline}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, headline: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Mô tả phụ (Subtitle)
                </label>
                <textarea
                  rows={3}
                  value={content.hero.subtitle}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nút kêu gọi chính (CTA Text)
                  </label>
                  <input
                    type="text"
                    value={content.hero.ctaText}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, ctaText: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Nút kêu gọi phụ (Secondary CTA Text)
                  </label>
                  <input
                    type="text"
                    value={content.hero.secondaryCtaText}
                    onChange={e =>
                      setContent(prev => ({
                        ...prev,
                        hero: { ...prev.hero, secondaryCtaText: e.target.value },
                      }))
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: BAC Methodology */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
              <Brain className="w-5 h-5 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-800">
                3. Phương Pháp Độc Quyền BAC (Believe - Active - Control)
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-blue-700 flex items-center gap-1.5 mb-1">
                  <Brain className="w-4 h-4" />
                  <span>Chữ B: BELIEVE (Niềm tin & Tâm lý học tích cực)</span>
                </label>
                <textarea
                  rows={2}
                  value={content.bac.believe}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      bac: { ...prev.bac, believe: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-600 flex items-center gap-1.5 mb-1">
                  <Zap className="w-4 h-4" />
                  <span>Chữ A: ACTIVE (Chủ động tương tác & Phản xạ 100%)</span>
                </label>
                <textarea
                  rows={2}
                  value={content.bac.active}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      bac: { ...prev.bac, active: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-700 flex items-center gap-1.5 mb-1">
                  <Shield className="w-4 h-4" />
                  <span>Chữ C: CONTROL (Kiểm soát chất lượng & Chuẩn Cambridge)</span>
                </label>
                <textarea
                  rows={2}
                  value={content.bac.control}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      bac: { ...prev.bac, control: e.target.value },
                    }))
                  }
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* SECTION 4: Courses Management */}
          <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-800">
                  4. Danh Mục Khóa Học & Lộ Trình Đào Tạo
                </h2>
              </div>
              <button
                type="button"
                onClick={addCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Khóa Học</span>
              </button>
            </div>

            <div className="space-y-6">
              {content.courses.map((course, index) => (
                <div
                  key={course.id || index}
                  className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 relative group"
                >
                  <button
                    type="button"
                    onClick={() => removeCourse(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="Xóa khóa học này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Tên khóa học
                      </label>
                      <input
                        type="text"
                        value={course.title}
                        onChange={e => updateCourse(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">
                        Độ tuổi
                      </label>
                      <input
                        type="text"
                        value={course.ageGroup}
                        onChange={e => updateCourse(index, 'ageGroup', e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Thời lượng & Số khóa
                    </label>
                    <input
                      type="text"
                      value={course.duration}
                      onChange={e => updateCourse(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Mô tả khóa học
                    </label>
                    <textarea
                      rows={2}
                      value={course.description}
                      onChange={e => updateCourse(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Điểm nổi bật (phân cách bằng dấu phẩy)
                    </label>
                    <input
                      type="text"
                      value={course.features.join(', ')}
                      onChange={e =>
                        updateCourse(
                          index,
                          'features',
                          e.target.value.split(',').map(s => s.trim())
                        )
                      }
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl transition-all cursor-pointer text-sm"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              <span>{isSaving ? 'Đang Lưu Vào Vercel KV...' : 'Lưu Tất Cả Thay Đổi'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
