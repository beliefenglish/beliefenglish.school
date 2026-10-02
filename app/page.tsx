export const revalidate = 0;
export const dynamic = 'force-dynamic';

import React from 'react';
import { kv } from '@vercel/kv';
import {
  Brain,
  Zap,
  Shield,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle,
  GraduationCap,
  Gamepad2,
  Cpu,
  MonitorPlay,
  ShieldCheck,
  Award,
  ChevronRight,
  LayoutDashboard,
} from 'lucide-react';
import { SiteContent } from '@/types/content';
import { defaultContent } from '@/lib/default-content';

const KV_KEY = 'belief_english_site_content';

async function getSiteContent(): Promise<SiteContent> {
  try {
    const data = await kv.get<SiteContent>(KV_KEY);
    return data || defaultContent;
  } catch (error) {
    console.error('Error fetching data from Vercel KV, falling back to default:', error);
    return defaultContent;
  }
}

export default async function HomePage() {
  const content = await getSiteContent();
  const { brand, hero, bac, courses } = content;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo & Name */}
            <a href="/" className="flex items-center gap-3 group">
              {brand.logoUrl ? (
                <div className="h-12 w-auto max-w-[180px] flex items-center justify-center">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1e3a8a] to-blue-900 text-white flex items-center justify-center font-black shadow-md border-2 border-orange-400">
                    <span className="text-xl">B</span>
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-black tracking-tight text-[#1e3a8a] block leading-none">
                      BELIEF ENGLISH
                    </span>
                    <span className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">
                      Member of BELIS GROUP
                    </span>
                  </div>
                </div>
              )}
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <a href="#ve-belis" className="hover:text-[#1e3a8a] transition-colors py-1">
                Về BELIS
              </a>
              <a href="#phuong-phap-bac" className="hover:text-[#1e3a8a] transition-colors py-1">
                Phương pháp BAC
              </a>
              <a href="#khoa-hoc" className="hover:text-[#1e3a8a] transition-colors py-1">
                Khóa học & Lộ trình
              </a>
              <a href="#edtech" className="hover:text-[#1e3a8a] transition-colors py-1">
                EdTech 4.0
              </a>
              <a href="#lien-he" className="hover:text-[#1e3a8a] transition-colors py-1">
                Liên hệ
              </a>
            </div>

            {/* Action CTA & Admin Link */}
            <div className="flex items-center gap-3">
              <a
                href={`tel:${brand.phone.replace(/[^0-9]/g, '')}`}
                className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1e3a8a] py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>{brand.phone}</span>
              </a>

              <a
                href="#lien-he"
                className="relative inline-flex items-center justify-center px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>{hero.ctaText || 'Đăng ký Test'}</span>
              </a>

              <a
                href="/admin"
                title="Mở Bảng Quản Trị Hệ Thống"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#1e3a8a] bg-slate-100 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#1e3a8a]" />
                <span className="hidden sm:inline">Admin</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#1e3a8a] text-xs font-bold shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-orange-500" />
                <span>Trung tâm Ngoại ngữ Niềm Tin • Chuẩn Khảo Thí Cambridge</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                {hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {hero.subtitle}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <a
                  href="#lien-he"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-2xl shadow-xl shadow-orange-500/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{hero.ctaText}</span>
                </a>
                <a
                  href="#khoa-hoc"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-bold text-[#1e3a8a] bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-xs transition-colors"
                >
                  <span>{hero.secondaryCtaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-[#1e3a8a]">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Giáo viên đạt chuẩn</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-orange-500">BAC</div>
                  <div className="text-xs text-slate-500 font-medium">Phương pháp độc quyền</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-xl sm:text-2xl font-black text-emerald-600">Cambridge</div>
                  <div className="text-xs text-slate-500 font-medium">Lộ trình chuẩn hóa</div>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 font-bold shadow-xs">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#1e3a8a] mb-2">
                  Cam Kết Chất Lượng Đào Tạo
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Đánh giá năng lực 4 kỹ năng miễn phí và xây dựng lộ trình chuyên biệt cho từng học viên.
                </p>

                <div className="space-y-3.5 mb-6 text-xs text-slate-700">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Test năng lực 1 kèm 1 với giáo viên chuyên môn</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/70 border border-orange-100">
                    <CheckCircle className="w-4 h-4 text-orange-600 shrink-0" />
                    <span className="font-semibold">Học thử trải nghiệm phương pháp phản xạ BAC</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Báo cáo học tập và số hóa tiến độ qua EdTech</span>
                  </div>
                </div>

                <a
                  href="#lien-he"
                  className="w-full py-3.5 px-4 bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold rounded-xl text-xs sm:text-sm text-center block shadow-md transition-colors"
                >
                  Đăng Ký Tư Vấn & Nhận Học Bổng
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BAC METHODOLOGY SECTION */}
      <section id="phuong-phap-bac" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-500">
              Công Thức Thành Công Độc Quyền
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a8a] tracking-tight">
              Phương Pháp Giáo Dục Đột Phá BAC
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Sự kết hợp hoàn hảo giữa tâm lý học giáo dục tích cực, phản xạ ngôn ngữ chủ động và hệ thống đo lường kiểm soát tiêu chuẩn quốc tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card B: BELIEVE */}
            <div className="rounded-3xl p-8 bg-blue-50/60 border border-blue-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shadow-md mb-6">
                  <Brain className="w-7 h-7" />
                </div>
                <div className="text-xs font-black uppercase text-blue-700 tracking-wider mb-1">
                  Chữ B • Nền tảng tâm lý
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">BELIEVE (Niềm Tin)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{bac.believe}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-blue-200/60 flex items-center gap-2 text-xs font-bold text-blue-700">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                <span>Xây dựng sự tự tin vững chắc</span>
              </div>
            </div>

            {/* Card A: ACTIVE */}
            <div className="rounded-3xl p-8 bg-orange-50/60 border border-orange-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-2xl shadow-md mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <div className="text-xs font-black uppercase text-orange-600 tracking-wider mb-1">
                  Chữ A • Phản xạ tương tác
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">ACTIVE (Chủ Động)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{bac.active}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-orange-200/60 flex items-center gap-2 text-xs font-bold text-orange-600">
                <CheckCircle className="w-4 h-4 text-orange-500" />
                <span>Học qua hành động & phản xạ 100%</span>
              </div>
            </div>

            {/* Card C: CONTROL */}
            <div className="rounded-3xl p-8 bg-emerald-50/60 border border-emerald-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl shadow-md mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <div className="text-xs font-black uppercase text-emerald-700 tracking-wider mb-1">
                  Chữ C • Tiêu chuẩn quốc tế
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">CONTROL (Kiểm Soát)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{bac.control}</p>
              </div>
              <div className="pt-6 mt-6 border-t border-emerald-200/60 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Đo lường theo khung Cambridge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COURSE ROADMAP SECTION */}
      <section id="khoa-hoc" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-orange-500">
              Lộ Trình Toàn Diện
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a8a] tracking-tight">
              Các Chương Trình Đào Tạo Trọng Điểm
            </h2>
            <p className="text-sm text-slate-600">
              Thiết kế bài bản từ lứa tuổi mầm non đến người lớn, cam kết đầu ra chuẩn Cambridge và CEFR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, idx) => (
              <div
                key={course.id || idx}
                className="bg-white rounded-3xl p-7 shadow-md hover:shadow-2xl border border-slate-200 flex flex-col justify-between transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1e3a8a] border border-blue-200">
                      {course.ageGroup}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{course.duration}</span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="space-y-2.5 mb-6">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Đặc điểm chương trình:
                    </div>
                    {course.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href="#lien-he"
                  className="w-full py-3 text-center text-xs font-bold text-[#1e3a8a] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors block border border-blue-200"
                >
                  Nhận Báo Giá & Lộ Trình 1-1
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. EDTECH SECTION */}
      <section id="edtech" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-blue-900 to-[#172554] text-white p-8 sm:p-14 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-400/30">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>EdTech 4.0 • Công Nghệ Số Hóa Lớp Học</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Trải Nghiệm Học Tập Tương Tác Cùng Nền Tảng Công Nghệ Hiện Đại
                </h2>

                <p className="text-sm sm:text-base text-blue-100 max-w-xl leading-relaxed">
                  Tại Belief English, học viên được tiếp cận phương pháp trực quan sinh động với thiết bị trình chiếu thông minh IPEVO, thi đua kiến thức sôi nổi trên Kahoot/Quizizz và trợ giảng số AI luyện phát âm phản xạ.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                    <Gamepad2 className="w-6 h-6 text-orange-400 mb-2" />
                    <div className="font-bold text-sm">Kahoot & Quizizz</div>
                    <div className="text-xs text-blue-200 mt-1">Đấu trí từ vựng hào hứng</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                    <MonitorPlay className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="font-bold text-sm">IPEVO Camera</div>
                    <div className="text-xs text-blue-200 mt-1">Trực quan hóa trang sách</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10 text-left">
                    <Brain className="w-6 h-6 text-amber-400 mb-2" />
                    <div className="font-bold text-sm">Trợ Giảng AI</div>
                    <div className="text-xs text-blue-200 mt-1">Chữa phát âm & phản xạ 24/7</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/20 text-center">
                <Award className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Đăng Ký Học Thử Miễn Phí</h3>
                <p className="text-xs text-blue-200 mb-6 leading-relaxed">
                  Trải nghiệm 01 buổi học với công nghệ EdTech 4.0 và kiểm tra phát âm chuẩn quốc tế.
                </p>
                <a
                  href="#lien-he"
                  className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm block shadow-lg transition-colors"
                >
                  Nhận Suất Học Thử Ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CONTACT / FOOTER */}
      <footer id="lien-he" className="bg-[#0f172a] text-slate-300 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            {/* Col 1: About */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
                  B
                </div>
                <span className="text-base font-black text-white">{brand.name}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống đào tạo tiếng Anh chuẩn quốc tế trực thuộc BELIS GROUP. Tiên phong tri thức, hậu vận thành công với phương pháp độc quyền BAC.
              </p>
              <div className="text-xs text-orange-400 font-semibold">
                Member of BELIS GROUP Educational Ecosystem
              </div>
            </div>

            {/* Col 2: Contact Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Thông Tin Liên Hệ</h4>
              <div className="flex items-start gap-2.5 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{brand.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`tel:${brand.phone}`} className="hover:text-white transition-colors">
                  {brand.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a href={`mailto:${brand.email}`} className="hover:text-white transition-colors">
                  {brand.email}
                </a>
              </div>
            </div>

            {/* Col 3: Programs */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Chương Trình Học</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>• Tiếng Anh Mầm Non (Kindy 3-6T)</li>
                <li>• Tiểu học & Vá mất gốc (Ready 6-9T)</li>
                <li>• Cambridge Starters, Movers, Flyers</li>
                <li>• Luyện thi KET, PET & IELTS 7.0+</li>
                <li>• Tiếng Anh Giao tiếp Người lớn</li>
              </ul>
            </div>

            {/* Col 4: Management & Social */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quản Trị Hệ Thống</h4>
              <p className="text-xs text-slate-400">
                Dữ liệu được lưu trữ tự động trên đám mây Vercel KV và Vercel Blob CDN.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-xs font-bold rounded-xl border border-blue-700 transition-colors"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Mở Bảng Quản Trị (Admin)</span>
              </a>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Belief English (BELIS GROUP). All rights reserved.</p>
            <p>Hệ thống giáo dục chuẩn quốc tế Cambridge.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
