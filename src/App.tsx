import React, { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Zap,
  Shield,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Sparkles,
  BookOpen,
  Award,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  FileText,
  Star,
  Gamepad2,
  Cpu,
  MonitorPlay,
  Check,
  X,
  GraduationCap,
  MessageCircle,
  Menu,
  ShieldCheck,
  Send,
  LayoutDashboard,
  Lock,
} from 'lucide-react';

import BeliefLogo from './components/BeliefLogo';
import CoursesSection from './components/CoursesSection';
import AdvisorySection from './components/AdvisorySection';
import LibrarySection from './components/LibrarySection';
import FloatingContact from './components/FloatingContact';
import SpeakingChatbot from './components/SpeakingChatbot';
import AnnouncementBar from './components/AnnouncementBar';
import AdminDashboard from './components/admin/AdminDashboard';
import { CourseItem } from './data/coursesData';
import { AdminProvider, useAdmin } from './context/AdminContext';

// Pre-generated local image assets
import heroKidsImg from './assets/images/hero_kids_learning_1790950201865.jpg';
import edtechTabletImg from './assets/images/edtech_interactive_tablet_1790950216485.jpg';
import campusClassroomImg from './assets/images/belief_campus_classroom_1790950228719.jpg';

function LandingPageContent() {
  const { siteSettings, isAdminView, setIsAdminView, addLead } = useAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavDropdownOpen, setIsNavDropdownOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(true);
  const navDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target as Node)) {
        setIsNavDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [activeEdTechTab, setActiveEdTechTab] = useState<'kahoot' | 'ai' | 'ipevo'>('kahoot');
  const [activeBacTab, setActiveBacTab] = useState<'believe' | 'active' | 'control'>('believe');
  
  // Registration Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedCourseInfo, setSelectedCourseInfo] = useState<CourseItem | null>(null);

  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '6',
    program: 'kindy',
    preferredTime: 'Cuối tuần (Thứ 7 & CN)',
    branch: siteSettings.address,
    note: '',
  });

  const handleOpenCourseModal = (course: CourseItem) => {
    setSelectedCourseInfo(course);
    setFormData(prev => ({
      ...prev,
      program: course.id,
      note: `Đăng ký tư vấn lộ trình: ${course.name}`,
    }));
    setIsModalOpen(true);
  };

  const handleGeneralModalOpen = () => {
    setSelectedCourseInfo(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentName || !formData.phone) return;

    // Save lead to Admin state
    addLead({
      parentName: formData.parentName,
      phone: formData.phone,
      childName: formData.childName,
      childAge: formData.childAge,
      program: formData.program,
      preferredTime: formData.preferredTime,
      branch: siteSettings.address,
      note: formData.note,
    });

    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setIsModalOpen(false);
    setSelectedCourseInfo(null);
    setFormData({
      parentName: '',
      phone: '',
      childName: '',
      childAge: '6',
      program: 'kindy',
      preferredTime: 'Cuối tuần (Thứ 7 & CN)',
      branch: siteSettings.address,
      note: '',
    });
  };

  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, '');

  if (isAdminView) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white pb-14 sm:pb-0">
      {/* Top Announcement Bar */}
      <AnnouncementBar onOpenModal={handleGeneralModalOpen} />

      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Brand Logo Zone */}
            <a href="#" className="flex items-center group">
              <BeliefLogo variant="blue" size="md" />
            </a>

            {/* Desktop Navigation Links (Clean & Organized) */}
            <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
              <a href="#trang-chu" className="hover:text-[#1e3a8a] transition-colors py-1">
                Trang chủ
              </a>
              <a href="#ve-belis" className="hover:text-[#1e3a8a] transition-colors py-1">
                Về BELIS
              </a>
              <a href="#phuong-phap-bac" className="hover:text-[#1e3a8a] transition-colors py-1">
                Phương pháp BAC
              </a>
              <a href="#khoa-hoc" className="hover:text-[#1e3a8a] transition-colors py-1">
                Khóa học & Lộ trình
              </a>

              {/* DROPDOWN MENU: Tiện ích & Hệ thống (Thư viện sách, Bảng tư vấn, EdTech, Dashboard) */}
              <div
                className="relative py-2"
                ref={navDropdownRef}
                onMouseEnter={() => setIsNavDropdownOpen(true)}
              >
                <button
                  type="button"
                  onClick={() => setIsNavDropdownOpen(!isNavDropdownOpen)}
                  className={`inline-flex items-center gap-1.5 py-1 text-sm font-semibold transition-colors cursor-pointer select-none ${
                    isNavDropdownOpen ? 'text-[#1e3a8a]' : 'text-slate-600 hover:text-[#1e3a8a]'
                  }`}
                  aria-expanded={isNavDropdownOpen}
                >
                  <span>Tiện ích & Hệ thống</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isNavDropdownOpen ? 'rotate-180 text-[#1e3a8a]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {/* Dropdown Card */}
                {isNavDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsNavDropdownOpen(false)}
                    className="absolute left-1/2 -translate-x-1/2 top-full w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-2 space-y-1">
                      {/* 1. Thư viện sách */}
                      <a
                        href="#thu-vien"
                        onClick={() => setIsNavDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 transition-colors group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-[#1e3a8a] transition-colors">
                            Thư viện sách
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            Giáo trình số & tài liệu học Oxford, Cambridge
                          </div>
                        </div>
                      </a>

                      {/* 2. Bảng tư vấn */}
                      <a
                        href="#bang-tu-van"
                        onClick={() => setIsNavDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            Bảng tư vấn
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            Quy trình tư vấn & lộ trình học tập BAC 1-1
                          </div>
                        </div>
                      </a>

                      {/* 3. EdTech */}
                      <a
                        href="#edtech"
                        onClick={() => setIsNavDropdownOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-purple-50/80 transition-colors group cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                            EdTech & Công nghệ
                          </div>
                          <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            Học tương tác 4.0 (Kahoot, AI, Ipevo)
                          </div>
                        </div>
                      </a>

                      {/* Divider */}
                      <div className="my-1 border-t border-slate-100"></div>

                      {/* 4. Dashboard */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsNavDropdownOpen(false);
                          setIsAdminView(true);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/80 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-start gap-3 text-left flex-1 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                            <LayoutDashboard className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 group-hover:text-orange-600 flex items-center gap-1.5 transition-colors">
                              <span>Dashboard Quản Trị</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-orange-100 text-orange-600 border border-orange-200">
                                Admin
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                              Cổng quản lý nội dung & học viên
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <a href="#lien-he" className="hover:text-[#1e3a8a] transition-colors py-1">
                Liên hệ
              </a>
            </div>

            {/* Action CTA & Hotline */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`tel:${cleanPhone(siteSettings.hotline1)}`}
                className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#1e3a8a] py-1.5 px-3 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>Hotline: {siteSettings.hotline1}</span>
              </a>

              <button
                onClick={handleGeneralModalOpen}
                className="relative inline-flex items-center justify-center px-4 py-2 text-xs sm:text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                <span>Đăng ký Test</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={handleGeneralModalOpen}
                className="px-3 py-1.5 text-xs font-bold text-white bg-orange-500 rounded-lg shadow-sm"
              >
                Test Ngay
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-[#1e3a8a] focus:outline-none cursor-pointer"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in fade-in duration-200">
            <a
              href="#trang-chu"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Trang chủ
            </a>
            <a
              href="#ve-belis"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Về BELIS
            </a>
            <a
              href="#phuong-phap-bac"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Phương pháp BAC
            </a>
            <a
              href="#khoa-hoc"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Khóa học & Lộ trình
            </a>

            {/* Mobile Dropdown / Collapsible: Tiện ích & Hệ thống */}
            <div className="rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50/60 my-1">
              <button
                type="button"
                onClick={() => setIsMobileSubmenuOpen(!isMobileSubmenuOpen)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-sm font-bold text-[#1e3a8a] bg-blue-50/50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Tiện ích & Hệ thống</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isMobileSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isMobileSubmenuOpen && (
                <div className="p-2 space-y-1 bg-white border-t border-slate-200/60">
                  <a
                    href="#thu-vien"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 rounded-lg cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Thư viện sách</span>
                  </a>
                  <a
                    href="#bang-tu-van"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span>Bảng tư vấn</span>
                  </a>
                  <a
                    href="#edtech"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-purple-50 rounded-lg cursor-pointer"
                  >
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>EdTech & Công nghệ</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAdminView(true);
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-bold text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-orange-500" />
                      <span>Dashboard Quản Trị</span>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.2 bg-orange-100 text-orange-600 rounded">
                      Admin
                    </span>
                  </button>
                </div>
              )}
            </div>

            <a
              href="#lien-he"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Liên hệ
            </a>

            <div className="pt-2 space-y-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleGeneralModalOpen();
                }}
                className="w-full py-3 text-center text-sm font-bold text-white bg-orange-500 rounded-xl shadow-md cursor-pointer"
              >
                Đăng ký Test Năng Lực Miễn Phí
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <header id="trang-chu" className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-blue-50/70 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                <span>Hệ Thống Anh Ngữ Trực Thuộc BELIS GROUP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-[#1e3a8a] tracking-tight leading-[1.15]">
                Tiên phong tri thức, <br className="hidden sm:inline" />
                <span className="text-orange-500">hậu vận thành công</span>
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl">
                Hệ sinh thái học tập toàn diện khơi dậy niềm tin và phát triển thế hệ tương lai. Khác biệt vượt trội với <strong className="font-bold text-[#1e3a8a]">phương pháp BAC độc quyền</strong> giúp học viên tự tin làm chủ tiếng Anh chỉ với 2 buổi/tuần.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <a
                  href="#phuong-phap-bac"
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-white bg-[#1e3a8a] hover:bg-blue-900 rounded-xl shadow-lg shadow-blue-900/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  <span>Khám phá phương pháp BAC</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>

                <button
                  onClick={handleGeneralModalOpen}
                  className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-bold text-[#1e3a8a] bg-white hover:bg-slate-50 border-2 border-[#1e3a8a] rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                >
                  <span>Nhận tư vấn ngay</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1e3a8a]">100%</div>
                  <div className="text-xs text-slate-500 font-medium">Cam kết chuẩn đầu ra</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-orange-500">2 Buổi</div>
                  <div className="text-xs text-slate-500 font-medium">Mỗi tuần vẫn xuất sắc</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#1e3a8a]">BAC</div>
                  <div className="text-xs text-slate-500 font-medium">Phương pháp độc quyền</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-4/3 group">
                  <img
                    src={heroKidsImg}
                    alt="Lớp học tương tác tại Belief English"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating Badge on Image */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2.5">
                    <BeliefLogo variant="circle" size="sm" />
                    <div>
                      <div className="text-[11px] font-extrabold text-[#1e3a8a]">Belief English</div>
                      <div className="text-[9px] text-slate-500 font-semibold">Cơ sở Đông Tăng Long</div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Giáo Viên 7.0+ IELTS</div>
                      <div className="text-[10px] text-slate-500">Chuyên môn sư phạm quốc tế</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. ABOUT US - BELIS GROUP (3 Cards) */}
      <section id="ve-belis" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <BeliefLogo variant="icon-only" size="sm" />
              <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">
                Hệ Sinh Thái BELIS GROUP
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e3a8a] tracking-tight">
              Phát Triển Doanh Nghiệp Để Phát Triển Thế Hệ
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              Tập đoàn BELIS GROUP định hình sứ mệnh giáo dục bằng việc trao truyền niềm tin và tạo dựng nền tảng tri thức vững chắc cho các thế hệ học viên Việt Nam vươn tầm thế giới.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                Giá Trị Cốt Lõi 01
              </div>
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">
                Kiến thức rộng
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Chương trình tích hợp nội dung thực tế (CBI), kết nối ngôn ngữ với khoa học, xã hội và đời sống thường nhật. Trẻ học tiếng Anh như một công cụ mở rộng tư duy toàn cầu.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Mở rộng vốn hiểu biết liên môn</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Xây dựng phản xạ tư duy bằng tiếng Anh</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                Giá Trị Cốt Lõi 02
              </div>
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">
                Chất lượng tốt
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Đội ngũ giáo viên giàu chuyên môn với chứng chỉ quốc tế và IELTS 7.0+. Khung chương trình chuẩn hóa quốc tế, kiểm soát chặt chẽ qua Bài kiểm tra định kỳ (BKTDK) nghiêm ngặt.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>100% Giáo viên đạt chuẩn sư phạm quốc tế</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Báo cáo tiến độ chi tiết tới từng phụ huynh</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#1e3a8a] flex items-center justify-center mb-6 shadow-sm group-hover:bg-[#1e3a8a] group-hover:text-white transition-colors duration-300">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-1">
                Giá Trị Cốt Lõi 03
              </div>
              <h3 className="text-xl font-bold text-[#1e3a8a] mb-3">
                Trải nghiệm hay
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Không gian học tập truyền cảm hứng kết hợp công nghệ tương tác EdTech. Trẻ hào hứng đến lớp, học không áp lực qua trò chơi, đóng kịch và hoạt động vận động thể chất trực quan.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Xóa bỏ nỗi sợ sai, kích thích tương tác tự tin</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Môi trường thân thiện, giàu tính gắn kết</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE BAC METHODOLOGY SECTION */}
      <section id="phuong-phap-bac" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-blue-50/40 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-orange-500 tracking-widest uppercase">
              Phương Pháp Giảng Dạy Độc Quyền
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e3a8a] tracking-tight">
              Triết lý Giáo dục Độc quyền BAC
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              <strong className="font-bold text-[#1e3a8a]">Học 2 buổi/tuần vẫn giao tiếp xuất sắc</strong> nhờ phương pháp độc quyền kết hợp 3 trụ cột vững chắc: <span className="font-bold text-blue-900">Believe</span> - <span className="font-bold text-orange-500">Active</span> - <span className="font-bold text-blue-900">Control</span>.
            </p>
          </div>

          {/* Interactive Navigation for BAC Pillars */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveBacTab('believe')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeBacTab === 'believe'
                  ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Brain className="w-4 h-4 text-orange-400" />
              <span>B - BELIEVE (Niềm tin)</span>
            </button>
            <button
              onClick={() => setActiveBacTab('active')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeBacTab === 'active'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Zap className="w-4 h-4 text-yellow-300" />
              <span>A - ACTIVE (Chủ động)</span>
            </button>
            <button
              onClick={() => setActiveBacTab('control')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                activeBacTab === 'control'
                  ? 'bg-[#1e3a8a] text-white shadow-lg shadow-blue-900/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>C - CONTROL (Kiểm soát)</span>
            </button>
          </div>

          {/* 3 Prominent BAC Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                activeBacTab === 'believe' ? 'border-[#1e3a8a] ring-4 ring-blue-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center shadow-inner">
                  <Brain className="w-9 h-9" />
                </div>
                <span className="text-3xl font-black text-blue-900/20">01</span>
              </div>
              <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">
                Trụ Cột 1
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-3">
                BELIEVE (Niềm Tin)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Thúc đẩy niềm tin nội tại, không áp đặt. Khen ngợi và khích lệ để trẻ tự tin giao tiếp, vượt qua nỗi sợ sai.
              </p>
              <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-xs">
                <div className="font-bold text-[#1e3a8a] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Xây dựng "Vùng An Toàn Ngôn Ngữ":</span>
                </div>
                <p className="text-slate-600">
                  Tại Belief English, giáo viên tạo ra môi trường tích cực nơi mỗi câu trả lời đều được chào đón. Trẻ dám nói, dám thể hiện và hình thành phản xạ tự nhiên.
                </p>
                <div className="text-orange-700 font-semibold pt-1">
                  ✓ Học sinh tự tin thuyết trình trước đám đông
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                activeBacTab === 'active' ? 'border-orange-500 ring-4 ring-orange-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shadow-inner">
                  <Zap className="w-9 h-9" />
                </div>
                <span className="text-3xl font-black text-orange-500/20">02</span>
              </div>
              <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">
                Trụ Cột 2
              </div>
              <h3 className="text-2xl font-black text-orange-600 mb-3">
                ACTIVE (Chủ Động)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Tương tác đa chiều. Học tiếng Anh qua kiến thức thực tế (CBI). Dạy từ vựng trực quan (TPR), loại bỏ hoàn toàn cách học "ngữ pháp - dịch".
              </p>
              <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 text-xs">
                <div className="font-bold text-orange-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Công nghệ học tập chuyển động TPR + CBI:</span>
                </div>
                <p className="text-slate-600">
                  Total Physical Response giúp ghi nhớ từ vựng qua hành động cơ thể. Kết hợp Content-Based Instruction để tiếng Anh là công cụ khám phá khoa học đời sống thực tế.
                </p>
                <div className="text-orange-700 font-semibold pt-1">
                  ✓ Loại bỏ 100% phương pháp học vẹt ngữ pháp khô khan
                </div>
              </div>
            </div>

            <div
              className={`bg-white rounded-2xl p-8 border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                activeBacTab === 'control' ? 'border-[#1e3a8a] ring-4 ring-blue-100' : 'border-slate-200/90'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                  <Shield className="w-9 h-9" />
                </div>
                <span className="text-3xl font-black text-blue-900/20">03</span>
              </div>
              <div className="text-xs font-black text-orange-500 uppercase tracking-widest mb-1">
                Trụ Cột 3
              </div>
              <h3 className="text-2xl font-black text-[#1e3a8a] mb-3">
                CONTROL (Kiểm Soát)
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                Cam kết đầu ra thực tế. Đánh giá chất lượng qua Bài kiểm tra định kỳ (BKTDK) vào buổi 13 và 14 mỗi khóa học.
              </p>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Quy trình BKTDK buổi 13 & 14 chuẩn mực:</span>
                </div>
                <p className="text-slate-600">
                  Kiểm tra toàn diện 4 kỹ năng. Phụ huynh nhận video bài nói và phiếu nhận xét chi tiết từng tiêu chí, kèm lộ trình củng cố kịp thời.
                </p>
                <div className="text-emerald-700 font-semibold pt-1">
                  ✓ Cam kết bảo đảm đầu ra bằng văn bản
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. COURSES SECTION */}
      <CoursesSection onSelectCourse={handleOpenCourseModal} />

      {/* 5.1 DIGITAL LIBRARY SECTION (THƯ VIỆN SÁCH & TÀI LIỆU SỐ) */}
      <LibrarySection />

      {/* 6. ADVISORY SECTION (BẢNG TƯ VẤN) */}
      <AdvisorySection onOpenConsultation={handleGeneralModalOpen} />

      {/* 7. EDTECH INNOVATION SECTION */}
      <section id="edtech" className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider border border-blue-400/20">
                <Cpu className="w-3.5 h-3.5" />
                <span>Tiên Phong Công Nghệ Giáo Dục</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Tích hợp công nghệ (EdTech) <br />
                <span className="text-orange-400">tối đa hóa sự hứng thú</span>
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Biến mỗi giờ học thành một hành trình phiêu lưu tri thức thú vị. Tại Belief English, công nghệ không thay thế người thầy mà khuếch đại tình yêu học tập của học sinh.
              </p>

              <div className="space-y-4 pt-2">
                <div
                  onClick={() => setActiveEdTechTab('kahoot')}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    activeEdTechTab === 'kahoot'
                      ? 'bg-white/10 border-orange-400/80 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Tương tác qua Kahoot, Quizizz, Wordwall</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Đua top điểm số, giải đố từ vựng sôi động, tạo không khí học tập hào hứng, cạnh tranh lành mạnh.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveEdTechTab('ai')}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    activeEdTechTab === 'ai'
                      ? 'bg-white/10 border-orange-400/80 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Nền tảng bài tập AI cá nhân hóa độ khó</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Hệ thống tự động nhận diện điểm yếu để giao bài tập vừa sức, chấm sửa phát âm chuẩn xác từng âm tiết.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setActiveEdTechTab('ipevo')}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    activeEdTechTab === 'ipevo'
                      ? 'bg-white/10 border-orange-400/80 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/8'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-300 flex items-center justify-center shrink-0">
                    <MonitorPlay className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>IPEVO Annotator minh họa bài giảng trực quan</span>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Camera vật thể kết hợp bút vẽ số hóa bài giảng thời gian thực, trực quan hóa từng cấu trúc ngữ pháp.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-800 shadow-2xl">
                <img
                  src={edtechTabletImg}
                  alt="Học sinh sử dụng công nghệ EdTech tại lớp học"
                  className="w-full h-80 sm:h-96 object-cover object-center"
                />
                
                <div className="p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                      Công Nghệ Đang Hoạt Động
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      Trực quan 100%
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    {activeEdTechTab === 'kahoot' &&
                      'Học viên được cấp mã PIN tham gia đấu trường từ vựng trực tiếp trên màn hình lớn cùng các bạn.'}
                    {activeEdTechTab === 'ai' &&
                      'AI phân tích giọng nói của từng em, phản hồi màu sắc trực quan (Xanh: chuẩn, Vàng: cần sửa).'}
                    {activeEdTechTab === 'ipevo' &&
                      'Giáo viên phóng to bài làm của học sinh để cả lớp cùng sửa bài và thảo luận nhóm tương tác.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CAMPUS & LEARNING ENVIRONMENT */}
      <section id="co-so" className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                <span>Không Gian Giáo Dục Hiện Đại</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-[#1e3a8a] tracking-tight">
                Cơ sở vật chất chuẩn quốc tế <br />
                tại Đông Tăng Long
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                Tọa lạc tại khu đô thị hiện đại bậc nhất khu vực, cơ sở Belief English được thiết kế theo tiêu chuẩn công thái học với ánh sáng tự nhiên và trang thiết bị hỗ trợ giáo dục tiên tiến.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Phòng học thông minh đa chức năng</h3>
                    <p className="text-xs text-slate-500">Màn hình tương tác cỡ lớn, điều hòa lọc không khí hai chiều.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Góc thư viện sách tiếng Anh Cambridge & Oxford</h3>
                    <p className="text-xs text-slate-500">Hàng trăm đầu sách truyện thiếu nhi phân cấp theo trình độ.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Khu vực sinh hoạt và phòng chờ tiện nghi cho phụ huynh</h3>
                    <p className="text-xs text-slate-500">Trà nước miễn phí, camera quan sát lớp học minh bạch và an toàn.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-slate-100 aspect-4/3">
                <img
                  src={campusClassroomImg}
                  alt="Không gian phòng học Belief English"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer id="lien-he" className="bg-[#0f172a] text-slate-400 pt-16 pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Column 1: Brand & Logo */}
            <div className="lg:col-span-5 space-y-4">
              <BeliefLogo variant="white" size="lg" />
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm pt-2">
                <strong className="text-white">Trung tâm Ngoại ngữ Niềm Tin - Belief English</strong> là thành viên trực thuộc <strong className="text-white">BELIS GROUP</strong>. Tiên phong tri thức, hậu vận thành công với phương pháp đào tạo độc quyền BAC.
              </p>
              <div className="text-xs text-slate-400 space-y-1 pt-1">
                <div>Pháp nhân: <strong>{siteSettings.companyName}</strong></div>
                <div>Đơn vị chủ quản: Hệ Thống Anh Ngữ Belief English</div>
              </div>
            </div>

            {/* Column 2: Exact Contact & Hotlines */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Địa Chỉ & Thông Tin Liên Hệ
              </h3>
              <ul className="space-y-3 text-xs">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white">Cơ sở:</strong> {siteSettings.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>
                    Hotline: <a href={`tel:${cleanPhone(siteSettings.hotline1)}`} className="text-white font-bold hover:text-orange-400 transition-colors">{siteSettings.hotline1}</a> {siteSettings.hotline2 ? ` / ${siteSettings.hotline2}` : ''}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>
                    Zalo Tư Vấn: <a href={`https://zalo.me/${cleanPhone(siteSettings.zalo)}`} target="_blank" rel="noopener noreferrer" className="text-white font-bold hover:text-orange-400 transition-colors">{siteSettings.zalo}</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>
                    Email: <a href={`mailto:${siteSettings.email}`} className="text-white hover:text-orange-400 transition-colors">{siteSettings.email}</a>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Giờ làm việc: {siteSettings.workHours}</span>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation & Admin Access */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Chương Trình & Quản Trị
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#khoa-hoc" className="hover:text-white transition-colors">Hệ Kindy (3-6 tuổi)</a>
                </li>
                <li>
                  <a href="#khoa-hoc" className="hover:text-white transition-colors">Hệ Ready (Vá mất gốc 6-9 tuổi)</a>
                </li>
                <li>
                  <a href="#khoa-hoc" className="hover:text-white transition-colors">Cambridge Starters, Movers, Flyers</a>
                </li>
                <li>
                  <a href="#khoa-hoc" className="hover:text-white transition-colors">Luyện thi IELTS & IELTS Expert</a>
                </li>
                <li>
                  <a href="#thu-vien" className="hover:text-white transition-colors font-semibold text-orange-300">Thư viện sách & Tài liệu số</a>
                </li>
                <li className="pt-2">
                  <button
                    onClick={() => setIsAdminView(true)}
                    className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Mở Bảng Quản Trị Dashboard</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer Bar */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>
              © {new Date().getFullYear()} {siteSettings.companyName}. Bản quyền thuộc về BELIS GROUP.
            </p>
            <div className="flex items-center gap-6">
              <span className="hover:text-slate-400 cursor-pointer">Chính sách bảo mật</span>
              <span className="hover:text-slate-400 cursor-pointer">Quy chế đào tạo</span>
              <span className="hover:text-slate-400 cursor-pointer">Cam kết chuẩn đầu ra</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons (Hotline & Zalo on Right) */}
      <FloatingContact onOpenTestModal={handleGeneralModalOpen} />

      {/* AI Speaking Chatbot with Gemini Flash (Bottom Left) */}
      <SpeakingChatbot />

      {/* INTERACTIVE REGISTRATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1e3a8a]">
                      {selectedCourseInfo ? 'Nhận Báo Giá & Ưu Đãi Học Bổng' : 'Đăng Ký Test Năng Lực 1-1'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedCourseInfo ? selectedCourseInfo.name : 'Đánh giá 4 kỹ năng miễn phí cùng giáo viên chuyên môn'}
                    </p>
                  </div>
                </div>

                {selectedCourseInfo && (
                  <div className="mb-4 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-[#1e3a8a]">{selectedCourseInfo.name}</div>
                    <div className="text-slate-600">Lộ trình: {selectedCourseInfo.roadmap}</div>
                    <div className="text-orange-700 font-semibold">{selectedCourseInfo.tuitionNote}</div>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên Phụ huynh / Học viên *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Nguyễn Thị Lan"
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Số điện thoại / Zalo *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="03xx xxx xxx / 09xx xxx xxx"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Họ tên & độ tuổi của bé
                      </label>
                      <input
                        type="text"
                        placeholder="VD: Bé Bảo An (6 tuổi)"
                        value={formData.childName}
                        onChange={e => setFormData({ ...formData, childName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Chương trình học quan tâm
                    </label>
                    <select
                      value={formData.program}
                      onChange={e => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="kindy">Hệ KINDY (3 - 6 tuổi: Thẩm thấu tự nhiên)</option>
                      <option value="ready">Hệ READY (6 - 9 tuổi: Vá lỗ hổng cho trẻ mất gốc)</option>
                      <option value="starters">Cambridge Starters (7 - 8 tuổi: Pre-A1)</option>
                      <option value="movers">Cambridge Movers (8 - 10 tuổi: A1)</option>
                      <option value="flyers">Cambridge Flyers (10 - 12 tuổi: A2)</option>
                      <option value="ket">Cambridge KET (11 - 14 tuổi: A2 Key)</option>
                      <option value="pet">Cambridge PET (13 - 16 tuổi: B1 Preliminary)</option>
                      <option value="pre-ielts">Hệ Pre-IELTS (Xây nền 4.0 - 5.0+)</option>
                      <option value="ielts">Hệ IELTS Chuyên sâu (Target 5.5 - 6.5+)</option>
                      <option value="ielts-expert">Hệ IELTS Expert (Target 7.0 - 8.0+)</option>
                      <option value="adults">Hệ Adults (Giao tiếp & Người đi làm)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Cơ sở tiếp nhận
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={siteSettings.address}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-100 rounded-xl border border-slate-200 text-slate-600 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Khung giờ mong muốn tư vấn / Test
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                    >
                      <option value="Cuối tuần (Thứ 7 & CN)">Cuối tuần (Thứ 7 hoặc Chủ Nhật)</option>
                      <option value="Tối các ngày trong tuần (18h-20h)">Tối các ngày trong tuần (18h - 20h)</option>
                      <option value="Ban ngày trong tuần">Ban ngày trong tuần (Sáng/Chiều)</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                    >
                      Gửi Thông Tin & Nhận Báo Giá Ưu Đãi
                    </button>
                  </div>
                  <p className="text-[11px] text-center text-slate-400">
                    * Thông tin đăng ký được bảo mật 100% theo quy chế của BELIS GROUP.
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-[#1e3a8a]">
                  Đăng Ký Thành Công!
                </h3>
                <p className="text-sm text-slate-600 max-w-sm mx-auto">
                  Cảm ơn Quý phụ huynh <strong className="text-slate-900">{formData.parentName}</strong> đã gửi thông tin. Ban tuyển sinh Belief English sẽ liên hệ qua số điện thoại/Zalo <strong className="text-slate-900">{formData.phone}</strong> trong vòng 30 phút để gửi kế hoạch lộ trình và biểu phí ưu đãi.
                </p>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hotline hỗ trợ:</span>
                    <span className="font-bold text-slate-800">{siteSettings.hotline1}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Zalo trung tâm:</span>
                    <span className="font-bold text-blue-600">{siteSettings.zalo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Địa điểm:</span>
                    <span className="font-bold text-slate-800">{siteSettings.address}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={resetForm}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#1e3a8a] rounded-xl shadow-md hover:bg-blue-900 transition-colors cursor-pointer"
                  >
                    Đóng cửa sổ
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <LandingPageContent />
    </AdminProvider>
  );
}
