import React, { useState } from 'react';
import {
  BookOpen,
  Folder,
  ExternalLink,
  Search,
  Sparkles,
  FileText,
  Download,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function LibrarySection() {
  const { libraryFolders, libraryBooks } = useAdmin();
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const filteredBooks = libraryBooks.filter(book => {
    const matchesFolder = selectedFolderId === 'all' || book.folderId === selectedFolderId;
    const matchesKeyword =
      searchKeyword === '' ||
      book.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(searchKeyword.toLowerCase()));
    return matchesFolder && matchesKeyword;
  });

  return (
    <section id="thu-vien" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#1e3a8a] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>Học Liệu & Giáo Trình Trực Tuyến</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1e3a8a] tracking-tight">
            Thư Viện Sách & Tài Liệu Số Độc Quyền
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Học viên và quý phụ huynh có thể tra cứu giáo trình theo từng cấp độ. 
            <strong className="text-[#1e3a8a]"> Bấm trực tiếp vào tên sách</strong> để tự động truy cập link tài liệu, file nghe audio và đề thi chính thống.
          </p>
        </div>

        {/* Search Bar & Folder Tabs */}
        <div className="mb-10 space-y-5">
          {/* Search Input */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên sách hoặc nội dung tài liệu..."
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white text-xs sm:text-sm rounded-2xl border border-slate-200/90 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          {/* Folder Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedFolderId === 'all'
                  ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Tất Cả Thư Mục ({libraryBooks.length})
            </button>

            {libraryFolders.map(folder => {
              const count = libraryBooks.filter(b => b.folderId === folder.id).length;
              const isSelected = selectedFolderId === folder.id;
              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1e3a8a] text-white shadow-md shadow-blue-900/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Folder className="w-3.5 h-3.5" />
                  <span>{folder.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => {
              const parentFolder = libraryFolders.find(f => f.id === book.folderId);
              return (
                <div
                  key={book.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded bg-blue-50 text-[#1e3a8a] border border-blue-100">
                        {book.fileType}
                      </span>
                      {book.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-100">
                          {book.badge}
                        </span>
                      )}
                    </div>

                    {/* NAMED BOOK LINK: Direct click jumps to destination URL */}
                    <h3 className="text-base font-black leading-snug">
                      <a
                        href={book.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1e3a8a] hover:text-orange-500 transition-colors inline-flex items-center gap-1.5 group-hover:underline"
                        title="Bấm để mở liên kết sách"
                      >
                        <BookOpen className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{book.title}</span>
                      </a>
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {book.description || 'Tài liệu học tập chính thống phục vụ quá trình đào tạo.'}
                    </p>

                    {parentFolder && (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Folder className="w-3 h-3 text-slate-400" />
                        <span>{parentFolder.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Link Button */}
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Link trực tiếp
                    </span>

                    <a
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 text-orange-700 hover:text-white font-bold text-xs transition-all duration-200"
                    >
                      <span>Mở Sách</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
              <BookOpen className="w-10 h-10 mx-auto opacity-40 text-[#1e3a8a]" />
              <p className="text-sm font-semibold">Không tìm thấy tài liệu phù hợp.</p>
              <p className="text-xs">Quý phụ huynh vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chọn thư mục khác.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
