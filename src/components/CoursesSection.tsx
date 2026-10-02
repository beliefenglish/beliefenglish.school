import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  Gift,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CourseItem } from '../data/coursesData';
import { useAdmin } from '../context/AdminContext';

interface CoursesSectionProps {
  onSelectCourse: (course: CourseItem) => void;
}

export default function CoursesSection({ onSelectCourse }: CoursesSectionProps) {
  const { courses, siteMedia } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tất Cả Khóa Học' },
    { id: 'kindy', label: 'Mầm Non (Kindy 3-6T)' },
    { id: 'ready', label: 'Vá Mất Gốc (Ready 6-9T)' },
    { id: 'cambridge', label: 'Chứng Chỉ Cambridge (Starters - PET)' },
    { id: 'ielts', label: 'Luyện Thi IELTS (4.0 - 8.0+)' },
    { id: 'adults', label: 'Người Lớn & Giao Tiếp (Adults)' },
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch =
      searchQuery === '' ||
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="khoa-hoc" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-blue-100/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            <span>Hệ Thống Chương Trình Đào Tạo Chuẩn BELIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e3a8a] tracking-tight">
            Khóa Học, Lộ Trình & Ưu Đãi Học Bổng
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Hệ thống đào tạo phân tầng chuẩn hóa quốc tế từ mầm non đến IELTS 8.0+ và giao tiếp người lớn. 
            Mỗi chương trình được thiết kế theo <strong className="text-[#1e3a8a]">phương pháp độc quyền BAC</strong> với cam kết chuẩn đầu ra.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/90'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Notice Banner: Confidential Tuition Policy */}
        <div className="mb-10 bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-col sm:flex-row gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Chính sách Học phí & Giáo trình Cá nhân hóa
              </h4>
              <p className="text-xs text-amber-700">
                Học phí và giá sách được giữ kín và thông báo kèm các gói ưu đãi học bổng sau khi học viên hoàn thành bài kiểm tra năng lực đầu vào 1-1 miễn phí.
              </p>
            </div>
          </div>
          <div className="shrink-0 text-xs font-bold text-amber-900 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs">
            Học bổng lên đến 25%
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map(course => {
            const customImg = siteMedia?.categoryImages?.[course.id] || siteMedia?.categoryImages?.[course.category];
            return (
            <div
              key={course.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Uploaded Course / Category Image (if exists) */}
                {customImg && (
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-2">
                    <img
                      src={customImg}
                      alt={course.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Header Tag & Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-[#1e3a8a] border border-blue-100">
                    {course.badge}
                  </span>
                  <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                    Phương pháp BAC
                  </span>
                </div>

                {/* Course Name */}
                <h3 className="text-xl font-black text-[#1e3a8a] group-hover:text-blue-800 transition-colors">
                  {course.name}
                </h3>

                {/* Level / Target */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <div className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Trình Độ Đầu Ra</div>
                  <div className="font-bold text-slate-800">{course.level}</div>
                </div>

                {/* Key Course Specifications */}
                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Lộ trình:</strong> {course.roadmap} ({course.duration})
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-[#1e3a8a] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Thời gian học:</strong> {course.schedule}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">Giáo trình:</strong> {course.textbook}
                    </div>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Điểm Nổi Bật:
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {course.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Promotion & Gift Box */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3.5 rounded-2xl border border-orange-100 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-orange-800 font-extrabold text-[11px] uppercase tracking-wide">
                    <Gift className="w-3.5 h-3.5 text-orange-500" />
                    <span>Ưu Đãi & Học Bổng:</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-medium">
                    {course.promotion}
                  </p>
                </div>
              </div>

              {/* Action Zone */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Cam kết chuẩn đầu ra
                  </span>
                  <span className="text-orange-600 font-semibold italic">
                    Học phí ưu đãi
                  </span>
                </div>

                <button
                  onClick={() => onSelectCourse(course)}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-[#1e3a8a] hover:bg-orange-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn cursor-pointer"
                >
                  <span>Nhận Báo Giá & Ưu Đãi Học Bổng</span>
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
