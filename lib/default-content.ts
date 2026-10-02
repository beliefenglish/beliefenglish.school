import { SiteContent } from '@/types/content';

export const defaultContent: SiteContent = {
  brand: {
    name: 'Belief English - BELIS GROUP',
    logoUrl: '',
    address: '30 đường B1, KDC Đông Tăng Long, Phường Long Phước, TP. Thủ Đức, TP. HCM',
    phone: '0377.757.877',
    email: 'beliefenglish.edu@gmail.com',
    facebookUrl: 'https://facebook.com/beliefenglish',
  },
  hero: {
    headline: 'Tiên phong tri thức, hậu vận thành công',
    subtitle:
      'Hệ sinh thái học tập toàn diện khơi dậy niềm tin và phát triển thế hệ tương lai với phương pháp độc quyền BAC và chuẩn khảo thí quốc tế Cambridge.',
    ctaText: 'Đăng ký Test Năng Lực',
    secondaryCtaText: 'Khám Phá Lộ Trình',
  },
  bac: {
    believe:
      'BELIEVE (Niềm tin): Khơi dậy tình yêu ngôn ngữ, xóa bỏ tâm lý sợ hãi, xây dựng sự tự tin tuyệt đối cho học viên ngay từ ngày đầu tiếp cận tiếng Anh.',
    active:
      'ACTIVE (Chủ động): Phương pháp tương tác liên tục, lấy học viên làm trung tâm, phản xạ tự nhiên 100% tiếng Anh thông qua tình huống thực tế và trò chơi trí tuệ.',
    control:
      'CONTROL (Kiểm soát): Đo lường tiến độ khoa học theo chuẩn Cambridge & CEFR quốc tế, cá nhân hóa lộ trình, đảm bảo chuẩn hóa phát âm và ngữ pháp chuẩn xác.',
  },
  courses: [
    {
      id: 'kindy',
      title: 'Hệ Tiếng Anh Mầm Non (KINDY)',
      ageGroup: '3 - 6 tuổi',
      duration: '18 khóa • 36 tháng',
      description:
        'Thẩm thấu ngôn ngữ tự nhiên thông qua phương pháp phản xạ đa giác quan (Total Physical Response), âm nhạc và kể chuyện tương tác.',
      features: [
        'Chuẩn phát âm Phonics bản ngữ từ sớm',
        'Hình thành tư duy phản xạ không dịch nghĩa',
        'Lớp học vui nhộn với màn hình tương tác thông minh',
        'Giáo trình tiêu chuẩn Oxford Show and Tell',
      ],
    },
    {
      id: 'ready',
      title: 'Hệ Tiểu Học & Vá Mất Gốc (READY)',
      ageGroup: '6 - 9 tuổi (Học sinh mất gốc)',
      duration: '12 khóa • 24 tháng',
      description:
        'Xây dựng nền tảng ngữ pháp vững chắc, bồi đắp từ vựng chuyên sâu và lấy lại niềm đam mê học tập cho học sinh tiểu học.',
      features: [
        'Lấy lại gốc căn bản chỉ sau 8 - 12 tuần',
        'Bám sát khung chương trình Bộ GD&ĐT và Cambridge',
        'Luyện phát âm chuẩn IPA và phản xạ giao tiếp',
        'Cam kết theo sát 1 kèm 1 trong từng buổi học',
      ],
    },
    {
      id: 'cambridge-ielts',
      title: 'Hệ Chứng Chỉ Quốc Tế (Starters, Movers, Flyers, KET, PET & IELTS)',
      ageGroup: '9 - 18 tuổi & Người lớn',
      duration: 'Lộ trình cá nhân hóa theo Band điểm',
      description:
        'Luyện thi chuyên sâu 4 kỹ năng Nghe - Nói - Đọc - Viết theo tiêu chuẩn khảo thí đại học Cambridge và IDP/British Council.',
      features: [
        'Chiến thuật làm bài thi đạt điểm tối đa',
        'Ngân hàng đề thi thật cập nhật liên tục hàng quý',
        'Chấm chữa bài Writing & Speaking chi tiết từng tiêu chí',
        'Cam kết chuẩn đầu ra Starters, Movers, Flyers, PET, IELTS 7.0+',
      ],
    },
  ],
  updatedAt: new Date().toISOString(),
};
