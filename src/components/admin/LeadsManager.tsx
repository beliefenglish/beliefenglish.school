import React, { useState } from 'react';
import {
  Users,
  Search,
  Download,
  Phone,
  MessageCircle,
  Clock,
  Trash2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Plus,
  Filter,
  Eye,
  Edit,
  X,
  UserCheck,
  Save,
  Loader2,
} from 'lucide-react';
import { useAdmin, LeadItem } from '../../context/AdminContext';

export default function LeadsManager() {
  const {
    leads,
    updateLeadStatus,
    deleteLead,
    exportLeadsCSV,
    addLead,
    saveAllToCloud,
    isSyncing,
  } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    parentName: '',
    phone: '',
    childName: '',
    childAge: '7',
    program: 'kindy',
    preferredTime: 'Cuối tuần (Thứ 7 & CN)',
    branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
    note: 'Đăng ký trực tiếp tại văn phòng cơ sở',
  });

  // Calculate statistics
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const scheduledLeads = leads.filter(l => l.status === 'scheduled').length;
  const enrolledLeads = leads.filter(l => l.status === 'enrolled').length;

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.childName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenNoteModal = (lead: LeadItem) => {
    setSelectedLead(lead);
    setAdminNoteInput(lead.adminNotes || '');
    setIsNoteModalOpen(true);
  };

  const handleSaveAdminNote = () => {
    if (!selectedLead) return;
    updateLeadStatus(selectedLead.id, selectedLead.status, adminNoteInput);
    setIsNoteModalOpen(false);
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.parentName || !newLeadForm.phone) return;
    addLead(newLeadForm);
    setIsAddModalOpen(false);
    setNewLeadForm({
      parentName: '',
      phone: '',
      childName: '',
      childAge: '7',
      program: 'kindy',
      preferredTime: 'Cuối tuần (Thứ 7 & CN)',
      branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
      note: 'Đăng ký trực tiếp tại văn phòng cơ sở',
    });
  };

  const statusBadge = (status: LeadItem['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            Mới Đăng Ký
          </span>
        );
      case 'called':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 w-max">
            Đã Liên Hệ
          </span>
        );
      case 'scheduled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 flex items-center gap-1 w-max">
            <Calendar className="w-3 h-3" />
            Đã Hẹn Test
          </span>
        );
      case 'enrolled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
            <CheckCircle className="w-3 h-3" />
            Đã Nhập Học
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 w-max">
            Hủy / Không Nghe Máy
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Lượt Đăng Ký</p>
            <h3 className="text-2xl font-black text-[#1e3a8a] mt-1">{totalLeads}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1e3a8a] flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Cần Liên Hệ Ngay</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{newLeads}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Lịch Hẹn Test 1-1</p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{scheduledLeads}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Đã Nhập Học Thành Công</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{enrolledLeads}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters & Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên phụ huynh, SĐT, tên bé..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
          />
        </div>

        {/* Filters and Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 border border-slate-200 rounded-xl text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới đăng ký</option>
              <option value="called">Đã gọi</option>
              <option value="scheduled">Đã hẹn test</option>
              <option value="enrolled">Đã nhập học</option>
              <option value="cancelled">Hủy</option>
            </select>
          </div>

          <button
            onClick={async () => {
              const res = await saveAllToCloud();
              triggerToast(res.message || 'Đã lưu danh sách học viên thành công!');
            }}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Lưu dữ liệu học viên lên Vercel Cloud"
          >
            {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSyncing ? 'Đang Lưu...' : 'Lưu Danh Sách'}</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#1e3a8a] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Đăng Ký Mới</span>
          </button>

          <button
            onClick={exportLeadsCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất File Excel (CSV)</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[880px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Thời gian</th>
                <th className="py-3.5 px-4">Phụ huynh & SĐT</th>
                <th className="py-3.5 px-4">Học viên</th>
                <th className="py-3.5 px-4">Chương trình</th>
                <th className="py-3.5 px-4">Khung giờ test</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-4 text-center">Ghi chú & Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      {lead.createdAt}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{lead.parentName}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-slate-600 font-bold">{lead.phone}</span>
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9]/g, '')}`}
                          title="Gọi điện"
                          className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://zalo.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Nhắn Zalo"
                          className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[10px]"
                        >
                          Zalo
                        </a>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {lead.childName || 'Chưa cập nhật'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {lead.childAge ? `${lead.childAge} tuổi` : ''}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[#1e3a8a] uppercase text-[11px] bg-blue-50 px-2 py-0.5 rounded">
                        {lead.program}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {lead.preferredTime}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={lead.status}
                        onChange={e => updateLeadStatus(lead.id, e.target.value as LeadItem['status'])}
                        className="text-xs font-bold rounded-lg border border-slate-200 bg-white px-2 py-1 focus:outline-none cursor-pointer"
                      >
                        <option value="new">Mới đăng ký</option>
                        <option value="called">Đã liên hệ</option>
                        <option value="scheduled">Đã hẹn test</option>
                        <option value="enrolled">Đã nhập học</option>
                        <option value="cancelled">Hủy</option>
                      </select>
                      <div className="mt-1">{statusBadge(lead.status)}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenNoteModal(lead)}
                          title="Xem & Ghi chú tư vấn"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-[#1e3a8a] transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn xóa đăng ký của ${lead.parentName}?`)) {
                              deleteLead(lead.id);
                            }
                          }}
                          title="Xóa đăng ký"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {lead.adminNotes && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-1 text-center italic">
                          "{lead.adminNotes}"
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Không tìm thấy dữ liệu đăng ký phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Notes & Details Modal */}
      {isNoteModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsNoteModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#1e3a8a]">
                Chi Tiết & Ghi Chú Tư Vấn
              </h3>
              <p className="text-xs text-slate-400">
                Phụ huynh: <strong className="text-slate-800">{selectedLead.parentName}</strong> ({selectedLead.phone})
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Bé & Độ tuổi:</span>
                <span className="font-bold text-slate-800">{selectedLead.childName} ({selectedLead.childAge} tuổi)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khóa quan tâm:</span>
                <span className="font-bold text-orange-600 uppercase">{selectedLead.program}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Khung giờ hẹn:</span>
                <span className="font-bold text-slate-800">{selectedLead.preferredTime}</span>
              </div>
              <div className="pt-1 border-t border-slate-200">
                <span className="text-slate-500 block mb-0.5">Lời nhắn của phụ huynh:</span>
                <p className="text-slate-700 italic bg-white p-2 rounded border border-slate-100">
                  {selectedLead.note || 'Không có lời nhắn'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Ghi chú nội bộ chuyên viên tuyển sinh:
              </label>
              <textarea
                rows={3}
                placeholder="VD: Đã hẹn thi thử 9h sáng thứ 7. Bé cần test kỹ phần ngữ âm Phonics..."
                value={adminNoteInput}
                onChange={e => setAdminNoteInput(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={handleSaveAdminNote}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-sm cursor-pointer"
              >
                Lưu Ghi Chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Lead Creation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#1e3a8a]">
                Thêm Đăng Ký Học Viên Mới
              </h3>
              <p className="text-xs text-slate-400">
                Ghi nhận thông tin phụ huynh đến trực tiếp cơ sở hoặc gọi hotline
              </p>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên Phụ huynh *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Nam"
                  value={newLeadForm.parentName}
                  onChange={e => setNewLeadForm({ ...newLeadForm, parentName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    placeholder="09xx xxx xxx"
                    value={newLeadForm.phone}
                    onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên & Tuổi bé</label>
                  <input
                    type="text"
                    placeholder="Bé Minh (7 tuổi)"
                    value={newLeadForm.childName}
                    onChange={e => setNewLeadForm({ ...newLeadForm, childName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khóa học</label>
                  <select
                    value={newLeadForm.program}
                    onChange={e => setNewLeadForm({ ...newLeadForm, program: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="kindy">Hệ Kindy (3-6T)</option>
                    <option value="ready">Hệ Ready (6-9T)</option>
                    <option value="starters">Starters Pre-A1</option>
                    <option value="movers">Movers A1</option>
                    <option value="flyers">Flyers A2</option>
                    <option value="ket">KET A2 Key</option>
                    <option value="pet">PET B1 Preliminary</option>
                    <option value="ielts">IELTS Academic</option>
                    <option value="adults">Adults Giao tiếp</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Khung giờ hẹn</label>
                  <select
                    value={newLeadForm.preferredTime}
                    onChange={e => setNewLeadForm({ ...newLeadForm, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Cuối tuần (Thứ 7 & CN)">Cuối tuần (T7 - CN)</option>
                    <option value="Tối các ngày trong tuần (18h-20h)">Tối trong tuần (18h-20h)</option>
                    <option value="Ban ngày trong tuần">Ban ngày trong tuần</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú tiếp nhận</label>
                <textarea
                  rows={2}
                  value={newLeadForm.note}
                  onChange={e => setNewLeadForm({ ...newLeadForm, note: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-900 shadow-sm cursor-pointer"
                >
                  Thêm Học Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
