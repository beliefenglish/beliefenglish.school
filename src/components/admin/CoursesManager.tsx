import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  RotateCcw,
  CheckCircle,
  Clock,
  Calendar,
  Gift,
  X,
  Sparkles,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { CourseItem } from '../../data/coursesData';

export default function CoursesManager() {
  const { courses, updateCourse, addCourse, deleteCourse, resetCourses } = useAdmin();
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for editing or creating
  const [formData, setFormData] = useState<Partial<CourseItem>>({});

  const handleStartEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setFormData({ ...course });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse || !formData.name) return;
    updateCourse(editingCourse.id, formData);
    setEditingCourse(null);
  };

  const handleStartAdd = () => {
    setFormData({
      id: `course-${Date.now()}`,
      name: '',
      badge: 'Mới',
      category: 'cambridge',
      targetAudience: '',
      level: '',
      roadmap: '',
      duration: '',
      schedule: '2 buổi / tuần • 90 phút / buổi',
      textbook: '',
      highlights: ['Chương trình chuẩn hóa quốc tế', 'Giáo viên giàu kinh nghiệm', 'Cam kết chuẩn đầu ra'],
      promotion: 'Ưu đãi đăng ký sớm lên đến 15%',
      tuitionNote: 'Học phí được tư vấn cá nhân hóa sau bài kiểm tra năng lực.',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.id) return;
    addCourse(formData as CourseItem);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-[#1e3a8a]">
            Quản Lý Danh Mục Khóa Học ({courses.length} Khóa)
          </h3>
          <p className="text-xs text-slate-500">
            Cập nhật tên, lộ trình, giáo trình, thời gian học và chính sách ưu đãi học bổng hiển thị trên trang web.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục danh sách khóa học về dữ liệu mặc định ban đầu?')) {
                resetCourses();
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            onClick={handleStartAdd}
            className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Khóa Học Mới</span>
          </button>
        </div>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <div
            key={course.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#1e3a8a] border border-blue-100">
                  {course.badge}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Mã: {course.id}
                </span>
              </div>

              <h4 className="text-base font-black text-[#1e3a8a] leading-snug">
                {course.name}
              </h4>

              <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1">
                <div className="text-slate-500 font-semibold">Trình độ:</div>
                <div className="font-bold text-slate-800">{course.level}</div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span><strong>Lộ trình:</strong> {course.roadmap}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#1e3a8a] shrink-0 mt-0.5" />
                  <span><strong>Lịch:</strong> {course.schedule}</span>
                </div>
                <div className="flex items-start gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sách:</strong> {course.textbook}</span>
                </div>
              </div>

              <div className="text-xs bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 text-amber-900">
                <div className="flex items-center gap-1 font-bold text-[11px] uppercase text-orange-700 mb-0.5">
                  <Gift className="w-3 h-3" />
                  <span>Ưu đãi:</span>
                </div>
                <p className="text-[11px] line-clamp-2">{course.promotion}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 italic">
                Học phí bảo mật
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartEdit(course)}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1e3a8a] hover:bg-blue-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Xóa khóa học "${course.name}"?`)) {
                      deleteCourse(course.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                  title="Xóa khóa học"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Course Modal */}
      {(editingCourse || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto space-y-4">
            <button
              onClick={() => {
                setEditingCourse(null);
                setIsAddModalOpen(false);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-xl font-black text-[#1e3a8a]">
                {editingCourse ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin được cập nhật tức thì trên toàn bộ giao diện khách hàng
              </p>
            </div>

            <form
              onSubmit={editingCourse ? handleSaveEdit : handleSaveAdd}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên khóa học *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Huy hiệu lứa tuổi</label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    placeholder="VD: 3 - 6 Tuổi"
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phân loại danh mục</label>
                  <select
                    value={formData.category || 'cambridge'}
                    onChange={e => setFormData({ ...formData, category: e.target.value as CourseItem['category'] })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="kindy">Hệ Kindy (Mầm non)</option>
                    <option value="ready">Hệ Ready (Vá mất gốc)</option>
                    <option value="cambridge">Chứng chỉ Cambridge</option>
                    <option value="ielts">Luyện thi IELTS</option>
                    <option value="adults">Người lớn & Giao tiếp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trình độ chuẩn (CEFR / Band)</label>
                  <input
                    type="text"
                    value={formData.level || ''}
                    placeholder="VD: Pre-A1 Starters / IELTS 6.5+"
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Quy mô lộ trình</label>
                  <input
                    type="text"
                    value={formData.roadmap || ''}
                    placeholder="VD: 4 Khóa • 64 buổi đào tạo"
                    onChange={e => setFormData({ ...formData, roadmap: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian hoàn thành</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    placeholder="VD: 8 tháng"
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian học (Buổi/tuần, số phút, ca học)</label>
                <input
                  type="text"
                  value={formData.schedule || ''}
                  placeholder="VD: 2 buổi / tuần • 90 phút / buổi (Ca Tối T2-T4 hoặc Cuối tuần)"
                  onChange={e => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sách theo chương trình</label>
                <input
                  type="text"
                  value={formData.textbook || ''}
                  placeholder="VD: Cambridge Young Learners Official Practice Tests & Storyfun"
                  onChange={e => setFormData({ ...formData, textbook: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chính sách ưu đãi & Học bổng</label>
                <textarea
                  rows={2}
                  value={formData.promotion || ''}
                  placeholder="Tặng Balo & đồng phục; Học bổng lộ trình 15%..."
                  onChange={e => setFormData({ ...formData, promotion: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú học phí bảo mật</label>
                <input
                  type="text"
                  value={formData.tuitionNote || ''}
                  placeholder="Chính sách ưu đãi học phí được tư vấn cá nhân hóa..."
                  onChange={e => setFormData({ ...formData, tuitionNote: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCourse(null);
                    setIsAddModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-900 shadow-sm cursor-pointer"
                >
                  {editingCourse ? 'Lưu Thay Đổi' : 'Tạo Khóa Học'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
