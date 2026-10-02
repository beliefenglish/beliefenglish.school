import React, { useState } from 'react';
import {
  FolderPlus,
  Folder,
  FileText,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Edit,
  Trash2,
  BookOpen,
  Sparkles,
  RotateCcw,
  CheckCircle,
  X,
  Save,
  Loader2,
} from 'lucide-react';
import { useAdmin, LibraryFolder, LibraryBookItem } from '../../context/AdminContext';

export default function LibraryManager() {
  const {
    libraryFolders,
    libraryBooks,
    createFolder,
    updateFolder,
    deleteFolder,
    addBook,
    updateBook,
    deleteBook,
    resetLibrary,
    saveAllToCloud,
    isSyncing,
  } = useAdmin();

  const [activeFolderId, setActiveFolderId] = useState<string>(
    libraryFolders[0]?.id || ''
  );

  // Modal states
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [folderForm, setFolderForm] = useState({ id: '', name: '', description: '', category: 'general' });

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState<{
    id?: string;
    folderId: string;
    title: string;
    url: string;
    description: string;
    fileType: LibraryBookItem['fileType'];
    badge: string;
  }>({
    folderId: activeFolderId,
    title: '',
    url: '',
    description: '',
    fileType: 'drive',
    badge: 'Tài Liệu Chuẩn',
  });

  const [toastMsg, setToastMsg] = useState('');
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Active folder & books
  const currentFolder = libraryFolders.find(f => f.id === activeFolderId) || libraryFolders[0];
  const currentBooks = libraryBooks.filter(b => b.folderId === currentFolder?.id);

  // Folder Actions
  const handleOpenCreateFolder = () => {
    setFolderForm({ id: '', name: '', description: '', category: 'general' });
    setIsFolderModalOpen(true);
  };

  const handleOpenEditFolder = (folder: LibraryFolder) => {
    setFolderForm({ ...folder });
    setIsFolderModalOpen(true);
  };

  const handleSaveFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderForm.name) return;
    if (folderForm.id) {
      updateFolder(folderForm.id, folderForm.name, folderForm.description);
      showToast('Đã cập nhật thư mục thành công!');
    } else {
      createFolder(folderForm.name, folderForm.description, folderForm.category);
      showToast('Đã tạo thư mục mới thành công!');
    }
    setIsFolderModalOpen(false);
  };

  // Book Actions
  const handleOpenCreateBook = () => {
    setBookForm({
      folderId: currentFolder ? currentFolder.id : libraryFolders[0]?.id || '',
      title: '',
      url: '',
      description: '',
      fileType: 'drive',
      badge: 'Giáo Trình',
    });
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book: LibraryBookItem) => {
    setBookForm({
      id: book.id,
      folderId: book.folderId,
      title: book.title,
      url: book.url,
      description: book.description || '',
      fileType: book.fileType,
      badge: book.badge || '',
    });
    setIsBookModalOpen(true);
  };

  const handleSaveBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookForm.title || !bookForm.url) return;

    if (bookForm.id) {
      updateBook(bookForm.id, {
        title: bookForm.title,
        url: bookForm.url,
        description: bookForm.description,
        fileType: bookForm.fileType,
        badge: bookForm.badge,
        folderId: bookForm.folderId,
      });
      showToast('Đã cập nhật liên kết sách thành công!');
    } else {
      addBook({
        title: bookForm.title,
        url: bookForm.url,
        description: bookForm.description,
        fileType: bookForm.fileType,
        badge: bookForm.badge,
        folderId: bookForm.folderId,
      });
      showToast('Đã đính kèm liên kết sách mới!');
    }
    setIsBookModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-[#1e3a8a]">
            Thư Viện Sách & Quản Lý Link Tài Liệu Số
          </h3>
          <p className="text-xs text-slate-500">
            Tạo thư mục (folder) và chèn liên kết trực tiếp vào tên sách. Khách hàng/học viên nhấp vào tên sách trên web sẽ tự động mở liên kết tài liệu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (window.confirm('Khôi phục danh mục thư mục & liên kết sách về dữ liệu mẫu mặc định?')) {
                resetLibrary();
                showToast('Đã khôi phục thư viện mặc định');
              }
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi Phục Gốc</span>
          </button>

          <button
            onClick={async () => {
              const res = await saveAllToCloud();
              showToast(res.message || 'Đã lưu thư viện sách thành công!');
            }}
            disabled={isSyncing}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
            title="Lưu toàn bộ thư viện sách lên Vercel Cloud"
          >
            {isSyncing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSyncing ? 'Đang Lưu...' : 'Lưu Thư Viện Sách'}</span>
          </button>

          <button
            onClick={handleOpenCreateFolder}
            className="px-4 py-2 rounded-xl bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tạo Thư Mục Mới</span>
          </button>
        </div>
      </div>

      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Folder & Books Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Folders List (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Danh Sách Thư Mục ({libraryFolders.length})
            </span>
            <button
              onClick={handleOpenCreateFolder}
              className="text-[11px] font-bold text-[#1e3a8a] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm Thư Mục</span>
            </button>
          </div>

          <div className="space-y-2">
            {libraryFolders.map(folder => {
              const count = libraryBooks.filter(b => b.folderId === folder.id).length;
              const isActive = folder.id === currentFolder?.id;
              return (
                <div
                  key={folder.id}
                  onClick={() => setActiveFolderId(folder.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-50/80 border-[#1e3a8a] shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#1e3a8a] text-white' : 'bg-white text-slate-500 shadow-2xs'
                      }`}
                    >
                      <Folder className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <h4
                        className={`text-xs font-bold truncate ${
                          isActive ? 'text-[#1e3a8a]' : 'text-slate-800'
                        }`}
                      >
                        {folder.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {count} tài liệu / sách đính kèm
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEditFolder(folder)}
                      className="p-1 text-slate-400 hover:text-[#1e3a8a] rounded"
                      title="Sửa tên thư mục"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {libraryFolders.length > 1 && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Xóa thư mục "${folder.name}" và toàn bộ sách trong thư mục?`)) {
                            deleteFolder(folder.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600 rounded"
                        title="Xóa thư mục"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Books in Selected Folder (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          {currentFolder ? (
            <>
              {/* Folder Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded">
                      Thư Mục Hiện Tại
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#1e3a8a] mt-1">
                    {currentFolder.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentFolder.description || 'Chưa có mô tả cho thư mục này.'}
                  </p>
                </div>

                <button
                  onClick={handleOpenCreateBook}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Đính Kèm Link Sách Mới</span>
                </button>
              </div>

              {/* Books List with Named Text & Links */}
              <div className="space-y-3">
                {currentBooks.length > 0 ? (
                  currentBooks.map(book => (
                    <div
                      key={book.id}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-100 text-[#1e3a8a] uppercase">
                            {book.fileType}
                          </span>
                          {book.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              {book.badge}
                            </span>
                          )}
                        </div>

                        {/* NAMED TEXT WITH LINK */}
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-black text-[#1e3a8a] hover:text-orange-500 transition-colors flex items-center gap-1.5 group-hover:underline"
                        >
                          <BookOpen className="w-4 h-4 shrink-0 text-orange-500" />
                          <span>{book.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                        </a>

                        <p className="text-xs text-slate-500">
                          {book.description || 'Tài liệu học tập chính thống'}
                        </p>

                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-lg">
                          Link: {book.url}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <span>Mở Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleOpenEditBook(book)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                          title="Sửa tên sách hoặc link"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Xóa sách "${book.title}" khỏi thư mục?`)) {
                              deleteBook(book.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                          title="Xóa sách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto opacity-40" />
                    <p className="text-xs">Chưa có liên kết sách nào trong thư mục này.</p>
                    <button
                      onClick={handleOpenCreateBook}
                      className="text-xs font-bold text-[#1e3a8a] hover:underline"
                    >
                      Bấm vào đây để đính kèm link sách đầu tiên
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              Vui lòng tạo thư mục trước.
            </div>
          )}
        </div>
      </div>

      {/* Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#1e3a8a]">
                {folderForm.id ? 'Chỉnh Sửa Thư Mục' : 'Tạo Thư Mục Tài Liệu Mới'}
              </h3>
              <p className="text-xs text-slate-500">
                Thư mục dùng để phân loại sách theo từng cấp độ hoặc chương trình học
              </p>
            </div>

            <form onSubmit={handleSaveFolder} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Thư Mục (Folder) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thư Mục Sách Hệ Kindy (3-6T)"
                  value={folderForm.name}
                  onChange={e => setFolderForm({ ...folderForm, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả ngắn thư mục
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Giáo trình Cambridge Super Safari, Storyfun..."
                  value={folderForm.description}
                  onChange={e => setFolderForm({ ...folderForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-900 shadow-sm cursor-pointer"
                >
                  {folderForm.id ? 'Lưu Thay Đổi' : 'Tạo Thư Mục'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book Link Modal */}
      {isBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 space-y-4">
            <button
              onClick={() => setIsBookModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="text-lg font-black text-[#1e3a8a]">
                {bookForm.id ? 'Chỉnh Sửa Liên Kết Sách' : 'Đính Kèm Liên Kết Sách Vào Văn Bản'}
              </h3>
              <p className="text-xs text-slate-500">
                Đặt tên cho cuốn sách và gắn link liên kết (Google Drive, PDF, Cambridge Web...)
              </p>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Chọn Thư Mục Chứa Sách *
                </label>
                <select
                  value={bookForm.folderId}
                  onChange={e => setBookForm({ ...bookForm, folderId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                >
                  {libraryFolders.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên Sách / Văn Bản Hiển Thị (Anchor Text) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Cambridge Super Safari 1 - Student’s Book (Full PDF)"
                  value={bookForm.title}
                  onChange={e => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                />
                <span className="text-[10px] text-slate-400">
                  Khách hàng bấm trực tiếp vào tên sách này sẽ tự động mở link.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Đường Link Đích (URL Đính Kèm) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/... hoặc https://..."
                    value={bookForm.url}
                    onChange={e => setBookForm({ ...bookForm, url: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  />
                  <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Định dạng file
                  </label>
                  <select
                    value={bookForm.fileType}
                    onChange={e => setBookForm({ ...bookForm, fileType: e.target.value as LibraryBookItem['fileType'] })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="drive">Google Drive</option>
                    <option value="pdf">File PDF</option>
                    <option value="audio">Audio / MP3</option>
                    <option value="ebook">Ebook / Sách Số</option>
                    <option value="link">Trang Web / Link Ngoài</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Huy hiệu nhãn
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Cambridge Chuẩn"
                    value={bookForm.badge}
                    onChange={e => setBookForm({ ...bookForm, badge: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả ngắn về tài liệu
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Giáo trình chính thức kèm file nghe âm thanh chuẩn bản ngữ..."
                  value={bookForm.description}
                  onChange={e => setBookForm({ ...bookForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#1e3a8a] text-white rounded-lg hover:bg-blue-900 shadow-sm cursor-pointer"
                >
                  {bookForm.id ? 'Lưu Thay Đổi' : 'Đính Kèm Sách'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
