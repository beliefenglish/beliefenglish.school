import React, { createContext, useContext, useState, useEffect } from 'react';
import { COURSES_DATA, CourseItem } from '../data/coursesData';

export interface LeadItem {
  id: string;
  parentName: string;
  phone: string;
  childName: string;
  childAge: string;
  program: string;
  preferredTime: string;
  branch: string;
  note: string;
  createdAt: string;
  status: 'new' | 'called' | 'scheduled' | 'enrolled' | 'cancelled';
  adminNotes?: string;
}

export interface SiteSettings {
  hotline1: string;
  hotline2: string;
  zalo: string;
  address: string;
  email: string;
  workHours: string;
  showAnnouncement: boolean;
  announcementText: string;
  announcementLinkText: string;
  companyName: string;
}

export interface SiteMedia {
  customLogoBlue?: string;
  customLogoWhite?: string;
  customLogoCircle?: string;
  categoryImages: Record<string, string>; // category/course id -> image data URL or URL
}

export interface LibraryFolder {
  id: string;
  name: string;
  description: string;
  category: string;
  createdAt: string;
}

export interface LibraryBookItem {
  id: string;
  folderId: string;
  title: string; // Tên sách được đặt tên
  url: string; // Đường link đính kèm trực tiếp (Drive, PDF, Cambridge...)
  description?: string;
  fileType: 'drive' | 'pdf' | 'audio' | 'ebook' | 'link';
  badge?: string;
  updatedAt: string;
}

export interface AdminAuth {
  isAuthenticated: boolean;
  email: string;
}

interface AdminContextType {
  courses: CourseItem[];
  leads: LeadItem[];
  siteSettings: SiteSettings;
  siteMedia: SiteMedia;
  libraryFolders: LibraryFolder[];
  libraryBooks: LibraryBookItem[];
  isAdminView: boolean;
  setIsAdminView: (val: boolean) => void;
  // Auth
  adminAuth: AdminAuth;
  loginAdmin: (email: string, pass: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; error?: string };
  // Courses actions
  updateCourse: (id: string, updated: Partial<CourseItem>) => void;
  addCourse: (course: CourseItem) => void;
  deleteCourse: (id: string) => void;
  resetCourses: () => void;
  // Leads actions
  addLead: (lead: Omit<LeadItem, 'id' | 'createdAt' | 'status'>) => void;
  updateLeadStatus: (id: string, status: LeadItem['status'], adminNotes?: string) => void;
  deleteLead: (id: string) => void;
  exportLeadsCSV: () => void;
  // Settings actions
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  // Media actions
  updateLogo: (type: 'blue' | 'white' | 'circle', dataUrl: string) => void;
  updateCategoryImage: (categoryId: string, dataUrl: string) => void;
  resetMedia: () => void;
  // Library actions
  createFolder: (name: string, description?: string, category?: string) => void;
  updateFolder: (id: string, name: string, description?: string) => void;
  deleteFolder: (id: string) => void;
  addBook: (book: Omit<LibraryBookItem, 'id' | 'updatedAt'>) => void;
  updateBook: (id: string, updated: Partial<LibraryBookItem>) => void;
  deleteBook: (id: string) => void;
  resetLibrary: () => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  hotline1: '0377.757.877',
  hotline2: '0969.366.641',
  zalo: '0377.757.877',
  address: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
  email: 'beliefenglish.edu@gmail.com',
  workHours: 'Thứ Hai - Chủ Nhật (8h00 - 21h30)',
  showAnnouncement: true,
  announcementText: '🔥 Khai giảng Khóa Mới Tháng Này: Tặng 100% Phí Kiểm Tra Năng Lực 1-1 + Balo Belief English cao cấp!',
  announcementLinkText: 'Đăng Ký Ngay',
  companyName: 'Công Ty Cổ Phần Đào Tạo Quốc Tế BELIS GROUP',
};

const DEFAULT_MEDIA: SiteMedia = {
  customLogoBlue: '',
  customLogoWhite: '',
  customLogoCircle: '',
  categoryImages: {
    kindy: '',
    ready: '',
    starters: '',
    movers: '',
    flyers: '',
    ket: '',
    pet: '',
    ielts: '',
    adults: '',
  },
};

const INITIAL_LEADS: LeadItem[] = [
  {
    id: 'lead-1',
    parentName: 'Nguyễn Thị Thu Hà',
    phone: '0912.456.789',
    childName: 'Bé Gia Hưng',
    childAge: '5',
    program: 'kindy',
    preferredTime: 'Cuối tuần (Thứ 7 & CN)',
    branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
    note: 'Bé chưa học tiếng Anh bao giờ, muốn cho bé làm quen thẩm thấu tự nhiên.',
    createdAt: '2026-10-02 08:30',
    status: 'new',
    adminNotes: 'Đang xếp lịch kiểm tra với cô Mai vào 9h sáng Thứ 7.',
  },
  {
    id: 'lead-2',
    parentName: 'Trần Văn Mạnh',
    phone: '0988.123.456',
    childName: 'Trần Bảo Anh',
    childAge: '8',
    program: 'ready',
    preferredTime: 'Tối các ngày trong tuần (18h-20h)',
    branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
    note: 'Bé học lớp 3 bị mất gốc ngữ pháp trên lớp, sợ nói tiếng Anh.',
    createdAt: '2026-10-01 19:15',
    status: 'scheduled',
    adminNotes: 'Đã hẹn lịch test năng lực 19h00 Tối thứ 5. Phụ huynh rất quan tâm cam kết đầu ra.',
  },
  {
    id: 'lead-3',
    parentName: 'Lê Hoàng Yến',
    phone: '0903.987.654',
    childName: 'Lê Minh Quân',
    childAge: '11',
    program: 'flyers',
    preferredTime: 'Cuối tuần (Thứ 7 & CN)',
    branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
    note: 'Mục tiêu thi Cambridge Flyers 14 khiên để xét tuyển vào trường chuyên.',
    createdAt: '2026-10-01 14:05',
    status: 'enrolled',
    adminNotes: 'Học viên đã test đạt 12/15 điểm Starters, đã xếp lớp Flyers A2 ca Thứ 7.',
  },
  {
    id: 'lead-4',
    parentName: 'Phạm Hồng Nhung',
    phone: '0975.334.889',
    childName: 'Phạm Đức Trọng',
    childAge: '15',
    program: 'ielts',
    preferredTime: 'Tối các ngày trong tuần (18h-20h)',
    branch: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Hồ Chí Minh',
    note: 'Cần đạt IELTS 6.5+ để xét tuyển Đại học Ngoại Thương.',
    createdAt: '2026-09-30 16:40',
    status: 'called',
    adminNotes: 'Đã gọi tư vấn, gửi lộ trình 8 tháng. Phụ huynh hẹn cuối tuần đưa con qua cơ sở.',
  },
];

const INITIAL_FOLDERS: LibraryFolder[] = [
  {
    id: 'folder-kindy',
    name: 'Thư Mục Sách Hệ Kindy (3 - 6 Tuổi)',
    description: 'Giáo trình Cambridge Super Safari, Our Discovery Island & Tài liệu Phonics tương tác',
    category: 'kindy',
    createdAt: '2026-10-01',
  },
  {
    id: 'folder-ready',
    name: 'Thư Mục Sách Hệ Ready (Vá Lỗ Hổng 6 - 9 Tuổi)',
    description: 'Giáo trình Kid’s Box, Everybody Up & Sổ tay củng cố ngữ pháp tiểu học',
    category: 'ready',
    createdAt: '2026-10-01',
  },
  {
    id: 'folder-cambridge',
    name: 'Thư Mục Cambridge Quốc Tế (Starters, Movers, Flyers)',
    description: 'Đề thi thật Cambridge YLE Authentic Tests & Sách rèn luyện 4 kỹ năng Storyfun',
    category: 'cambridge',
    createdAt: '2026-10-01',
  },
  {
    id: 'folder-ielts',
    name: 'Thư Mục Cambridge KET, PET & Luyện Thi IELTS',
    description: 'Mindset for IELTS Level 1-3, Cambridge IELTS Official Tests & Complete Key/PET',
    category: 'ielts',
    createdAt: '2026-10-01',
  },
];

const INITIAL_BOOKS: LibraryBookItem[] = [
  // Kindy Folder
  {
    id: 'book-1',
    folderId: 'folder-kindy',
    title: 'Cambridge Super Safari 1 - Student’s Book & Songs (Bản Đẹp PDF)',
    url: 'https://www.cambridge.org/vn/cambridgeenglish/catalog/primary/super-safari',
    description: 'Sách giáo khoa hình ảnh sinh động giúp trẻ mầm non làm quen với âm điệu Phonics bản ngữ.',
    fileType: 'drive',
    badge: 'Cambridge Official',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-2',
    folderId: 'folder-kindy',
    title: 'Our Discovery Island Level 1 - Interactive Pupil’s Book',
    url: 'https://www.pearson.com/en-us.html',
    description: 'Giáo trình khám phá ngôn ngữ qua câu chuyện phiêu lưu và bài hát vui nhộn.',
    fileType: 'pdf',
    badge: 'Giáo Trình Chuẩn',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-3',
    folderId: 'folder-kindy',
    title: 'Bộ Flashcard Từ Vựng & Vận Động TPR Độc Quyền Belief English',
    url: 'https://zalo.me/0377757877',
    description: 'Học liệu thẻ từ vựng trực quan chuẩn phương pháp BAC giúp kích hoạt phản xạ cơ thể.',
    fileType: 'ebook',
    badge: 'Độc Quyền BAC',
    updatedAt: '2026-10-01',
  },

  // Ready Folder
  {
    id: 'book-4',
    folderId: 'folder-ready',
    title: 'Kid’s Box Updated Second Edition - Level 1 & 2 (Student’s Book)',
    url: 'https://www.cambridge.org/vn/cambridgeenglish/catalog/primary/kids-box-updated-2nd-edition',
    description: 'Giáo trình cốt lõi giúp các em học sinh tiểu học lấy lại căn bản ngữ âm và cấu trúc câu.',
    fileType: 'drive',
    badge: 'Cambridge Chuẩn',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-5',
    folderId: 'folder-ready',
    title: 'Cambridge Everybody Up Starter - Phonics & Grammar Boost',
    url: 'https://elt.oup.com',
    description: 'Sách bổ trợ xây nền tảng tự tin giao tiếp và chuẩn bị tốt cho các bài kiểm tra tại trường.',
    fileType: 'pdf',
    badge: 'Oxford Edition',
    updatedAt: '2026-10-01',
  },

  // Cambridge Folder
  {
    id: 'book-6',
    folderId: 'folder-cambridge',
    title: 'Cambridge Starters Authentic Practice Tests (Đề Thi Thật 15 Khiên)',
    url: 'https://www.cambridgeenglish.org/exams-and-tests/starters/',
    description: 'Trọn bộ đề thi thử mô phỏng 100% format phòng thi Cambridge quốc tế cho cấp độ Pre-A1.',
    fileType: 'drive',
    badge: 'Đề Thi Thật',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-7',
    folderId: 'folder-cambridge',
    title: 'Storyfun for Starters & Fun for Movers (Full Ebook + Audio)',
    url: 'https://www.cambridge.org/vn/cambridgeenglish/catalog/primary/storyfun-starters-movers-and-flyers-2nd-edition',
    description: 'Tài liệu rèn luyện kỹ năng nghe nói qua tranh truyện cực kỳ thu hút cho lứa tuổi 7 - 10.',
    fileType: 'audio',
    badge: 'Luyện 4 Kỹ Năng',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-8',
    folderId: 'folder-cambridge',
    title: 'Cambridge Flyers Authentic Examination Papers (Đề Thi A2 Flyers)',
    url: 'https://www.cambridgeenglish.org/exams-and-tests/flyers/',
    description: 'Tuyển tập đề thi A2 Flyers giúp học sinh chuẩn bị chuyển cấp vào trường chuyên chất lượng cao.',
    fileType: 'pdf',
    badge: 'Tuyển Sinh Chuyên',
    updatedAt: '2026-10-01',
  },

  // IELTS & KET PET Folder
  {
    id: 'book-9',
    folderId: 'folder-ielts',
    title: 'Mindset for IELTS Level 1 (Foundation Band 4.0 - 5.5)',
    url: 'https://www.cambridge.org/vn/cambridgeenglish/catalog/cambridge-english-exams-ielts/mindset-ielts',
    description: 'Giáo trình chính thống từ Cambridge University Press trang bị tư duy làm bài thi học thuật.',
    fileType: 'drive',
    badge: 'IELTS Cambridge',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-10',
    folderId: 'folder-ielts',
    title: 'Cambridge IELTS Official Practice Tests 15 - 19 (Academic Edition)',
    url: 'https://www.cambridgeenglish.org/exams-and-tests/ielts/',
    description: 'Bộ sách luyện đề thực chiến chuẩn nhất cho học sinh đặt mục tiêu 6.5 - 7.5+ xét tuyển Đại học.',
    fileType: 'drive',
    badge: 'Bản Đẹp 2024-2025',
    updatedAt: '2026-10-01',
  },
  {
    id: 'book-11',
    folderId: 'folder-ielts',
    title: 'Cambridge Complete Key for Schools (A2 Key) & Preliminary (B1 PET)',
    url: 'https://www.cambridge.org/vn/cambridgeenglish/catalog/secondary/complete-key-schools-2nd-edition',
    description: 'Giáo trình toàn diện giúp học sinh THCS lấy chứng chỉ quốc tế và miễn thi tốt nghiệp môn Anh văn.',
    fileType: 'pdf',
    badge: 'Miễn Thi Tốt Nghiệp',
    updatedAt: '2026-10-01',
  },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdminView, setIsAdminView] = useState(false);

  const OWNER_EMAIL = 'beliefenglish.edu@gmail.com';
  const DEFAULT_ADMIN_PASSWORD = 'Belief@2025';

  const [adminAuth, setAdminAuth] = useState<AdminAuth>(() => {
    try {
      const savedAuth = localStorage.getItem('belis_admin_auth');
      return savedAuth ? JSON.parse(savedAuth) : { isAuthenticated: false, email: OWNER_EMAIL };
    } catch {
      return { isAuthenticated: false, email: OWNER_EMAIL };
    }
  });

  const [storedPassword, setStoredPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('belis_admin_pwd') || DEFAULT_ADMIN_PASSWORD;
    } catch {
      return DEFAULT_ADMIN_PASSWORD;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('belis_admin_auth', JSON.stringify(adminAuth));
    } catch (e) {
      console.warn(e);
    }
  }, [adminAuth]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_admin_pwd', storedPassword);
    } catch (e) {
      console.warn(e);
    }
  }, [storedPassword]);

  const loginAdmin = (email: string, pass: string) => {
    const cleanInputEmail = email.trim().toLowerCase();
    const cleanOwnerEmail = OWNER_EMAIL.toLowerCase();

    if (cleanInputEmail !== cleanOwnerEmail) {
      return {
        success: false,
        error: `Tài khoản không hợp lệ. Chủ sở hữu hợp lệ: ${OWNER_EMAIL}`,
      };
    }

    if (pass !== storedPassword) {
      return {
        success: false,
        error: 'Mật khẩu quản trị viên không chính xác. Mật khẩu mặc định: Belief@2025',
      };
    }

    const authData = { isAuthenticated: true, email: OWNER_EMAIL };
    setAdminAuth(authData);
    return { success: true };
  };

  const logoutAdmin = () => {
    setAdminAuth({ isAuthenticated: false, email: OWNER_EMAIL });
    setIsAdminView(false);
  };

  const changeAdminPassword = (oldPass: string, newPass: string) => {
    if (oldPass !== storedPassword) {
      return { success: false, error: 'Mật khẩu hiện tại không đúng.' };
    }
    if (!newPass || newPass.length < 6) {
      return { success: false, error: 'Mật khẩu mới phải có tối thiểu 6 ký tự.' };
    }
    setStoredPassword(newPass);
    return { success: true };
  };

  // Courses state
  const [courses, setCourses] = useState<CourseItem[]>(() => {
    try {
      const saved = localStorage.getItem('belis_courses');
      return saved ? JSON.parse(saved) : COURSES_DATA;
    } catch {
      return COURSES_DATA;
    }
  });

  // Leads state
  const [leads, setLeads] = useState<LeadItem[]>(() => {
    try {
      const saved = localStorage.getItem('belis_leads');
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('belis_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Media state (Logos & category images)
  const [siteMedia, setSiteMedia] = useState<SiteMedia>(() => {
    try {
      const saved = localStorage.getItem('belis_media');
      return saved ? JSON.parse(saved) : DEFAULT_MEDIA;
    } catch {
      return DEFAULT_MEDIA;
    }
  });

  // Library folders state
  const [libraryFolders, setLibraryFolders] = useState<LibraryFolder[]>(() => {
    try {
      const saved = localStorage.getItem('belis_folders');
      return saved ? JSON.parse(saved) : INITIAL_FOLDERS;
    } catch {
      return INITIAL_FOLDERS;
    }
  });

  // Library books state
  const [libraryBooks, setLibraryBooks] = useState<LibraryBookItem[]>(() => {
    try {
      const saved = localStorage.getItem('belis_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch {
      return INITIAL_BOOKS;
    }
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('belis_courses', JSON.stringify(courses));
    } catch (e) {
      console.warn(e);
    }
  }, [courses]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_leads', JSON.stringify(leads));
    } catch (e) {
      console.warn(e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_settings', JSON.stringify(siteSettings));
    } catch (e) {
      console.warn(e);
    }
  }, [siteSettings]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_media', JSON.stringify(siteMedia));
    } catch (e) {
      console.warn(e);
    }
  }, [siteMedia]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_folders', JSON.stringify(libraryFolders));
    } catch (e) {
      console.warn(e);
    }
  }, [libraryFolders]);

  useEffect(() => {
    try {
      localStorage.setItem('belis_books', JSON.stringify(libraryBooks));
    } catch (e) {
      console.warn(e);
    }
  }, [libraryBooks]);

  // Actions for Courses
  const updateCourse = (id: string, updated: Partial<CourseItem>) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const addCourse = (newCourse: CourseItem) => {
    setCourses(prev => [newCourse, ...prev]);
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const resetCourses = () => {
    setCourses(COURSES_DATA);
    localStorage.removeItem('belis_courses');
  };

  // Actions for Leads
  const addLead = (newLeadData: Omit<LeadItem, 'id' | 'createdAt' | 'status'>) => {
    const newLead: LeadItem = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'new',
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadItem['status'], adminNotes?: string) => {
    setLeads(prev =>
      prev.map(l =>
        l.id === id
          ? {
              ...l,
              status,
              ...(adminNotes !== undefined ? { adminNotes } : {}),
            }
          : l
      )
    );
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const exportLeadsCSV = () => {
    const headers = ['Mã', 'Họ tên Phụ huynh', 'Số điện thoại', 'Họ tên bé', 'Tuổi bé', 'Chương trình', 'Khung giờ', 'Trạng thái', 'Ghi chú phụ huynh', 'Ghi chú tư vấn', 'Thời gian đăng ký'];
    const rows = leads.map(l => [
      l.id,
      `"${l.parentName}"`,
      `"${l.phone}"`,
      `"${l.childName}"`,
      l.childAge,
      `"${l.program}"`,
      `"${l.preferredTime}"`,
      l.status,
      `"${l.note.replace(/"/g, '""')}"`,
      `"${(l.adminNotes || '').replace(/"/g, '""')}"`,
      `"${l.createdAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Belief_English_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Actions for Settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('belis_settings');
  };

  // Actions for Media (Logos & category images)
  const updateLogo = (type: 'blue' | 'white' | 'circle', dataUrl: string) => {
    setSiteMedia(prev => ({
      ...prev,
      [type === 'blue' ? 'customLogoBlue' : type === 'white' ? 'customLogoWhite' : 'customLogoCircle']: dataUrl,
    }));
  };

  const updateCategoryImage = (categoryId: string, dataUrl: string) => {
    setSiteMedia(prev => ({
      ...prev,
      categoryImages: {
        ...prev.categoryImages,
        [categoryId]: dataUrl,
      },
    }));
  };

  const resetMedia = () => {
    setSiteMedia(DEFAULT_MEDIA);
    localStorage.removeItem('belis_media');
  };

  // Actions for Library
  const createFolder = (name: string, description: string = '', category: string = 'general') => {
    const newFolder: LibraryFolder = {
      id: `folder-${Date.now()}`,
      name,
      description,
      category,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setLibraryFolders(prev => [...prev, newFolder]);
  };

  const updateFolder = (id: string, name: string, description?: string) => {
    setLibraryFolders(prev =>
      prev.map(f => (f.id === id ? { ...f, name, ...(description !== undefined ? { description } : {}) } : f))
    );
  };

  const deleteFolder = (id: string) => {
    setLibraryFolders(prev => prev.filter(f => f.id !== id));
    setLibraryBooks(prev => prev.filter(b => b.folderId !== id));
  };

  const addBook = (bookData: Omit<LibraryBookItem, 'id' | 'updatedAt'>) => {
    const newBook: LibraryBookItem = {
      ...bookData,
      id: `book-${Date.now()}`,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setLibraryBooks(prev => [newBook, ...prev]);
  };

  const updateBook = (id: string, updated: Partial<LibraryBookItem>) => {
    setLibraryBooks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString().slice(0, 10) } : b))
    );
  };

  const deleteBook = (id: string) => {
    setLibraryBooks(prev => prev.filter(b => b.id !== id));
  };

  const resetLibrary = () => {
    setLibraryFolders(INITIAL_FOLDERS);
    setLibraryBooks(INITIAL_BOOKS);
    localStorage.removeItem('belis_folders');
    localStorage.removeItem('belis_books');
  };

  return (
    <AdminContext.Provider
      value={{
        courses,
        leads,
        siteSettings,
        siteMedia,
        libraryFolders,
        libraryBooks,
        isAdminView,
        setIsAdminView,
        adminAuth,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        updateCourse,
        addCourse,
        deleteCourse,
        resetCourses,
        addLead,
        updateLeadStatus,
        deleteLead,
        exportLeadsCSV,
        updateSiteSettings,
        resetSiteSettings,
        updateLogo,
        updateCategoryImage,
        resetMedia,
        createFolder,
        updateFolder,
        deleteFolder,
        addBook,
        updateBook,
        deleteBook,
        resetLibrary,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
