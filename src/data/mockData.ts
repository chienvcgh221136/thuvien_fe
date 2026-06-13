// Mock data for the library application
export type ResourceType = 'sach-giay' | 'sach-dien-tu' | 'sach-noi' | 'bai-giang' | 'video' | 'album';

export interface AlbumPhoto {
  id: string;
  url: string;
  caption: string;
  isCover?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  year: number;
  type: ResourceType;
  cover: string;
  category: string;
  grade: string[];
  description: string;
  views: number;
  likes: number;
  rating: number;
  ratingCount: number;
  available?: number;
  total?: number;
  shelf?: string;
  fileSize?: string;
  duration?: string;
  chapters?: AudioChapter[];
  timestamps?: VideoTimestamp[];
  tableOfContents?: string[];
  pages?: number;
  videoUrl?: string;
  videoSource?: string;
  photos?: AlbumPhoto[];        // dùng cho album
  photoCount?: number;          // tổng số ảnh
}

export interface AudioChapter {
  id: string;
  title: string;
  duration: string;
}

export interface VideoTimestamp {
  time: string;
  label: string;
}

export interface Review {
  id: string;
  bookId: string;
  userName: string;
  userClass: string;
  rating: number;
  text: string;
  date: string;
}

export const BOOKS: Book[] = [
  /* ─── SÁCH NÓI ─── */
  {
    id: '1',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    publisher: 'NXB Kim Đồng',
    year: 1941,
    type: 'sach-noi',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
    category: 'Văn học thiếu nhi',
    grade: ['6', '7'],
    description: '"Dế Mèn phiêu lưu ký" là tác phẩm văn xuôi đặc sắc và nổi tiếng nhất của nhà văn Tô Hoài viết về loài vật, dành cho lứa tuổi thiếu nhi. Truyện kể về cuộc phiêu lưu của Dế Mèn qua thế giới của những loài vật nhỏ bé, học hỏi những bài học về cuộc sống, tình bạn và sự tử tế.',
    views: 12400,
    likes: 3200,
    rating: 4.8,
    ratingCount: 450,
    duration: '5g 32p',
    chapters: [
      { id: 'c1', title: 'Chương 1: Tôi sống độc lập từ thuở bé', duration: '15:30' },
      { id: 'c2', title: 'Chương 2: Cuộc phiêu lưu đầu tiên', duration: '22:14' },
      { id: 'c3', title: 'Chương 3: Gặp Dế Trũi', duration: '18:47' },
      { id: 'c4', title: 'Chương 4: Vùng đất lạ', duration: '20:05' },
      { id: 'c5', title: 'Chương 5: Trở về cố hương', duration: '16:30' },
    ],
    tableOfContents: ['Chương 1: Tôi sống độc lập', 'Chương 2: Phiêu lưu đầu tiên', 'Chương 3: Gặp Dế Trũi', 'Chương 4: Vùng đất lạ', 'Chương 5: Trở về cố hương'],
  },

  /* ─── SÁCH GIẤY ─── */
  {
    id: '2',
    title: 'Toán 8 - Tập 1',
    author: 'Bộ GD&ĐT',
    publisher: 'NXB Giáo Dục',
    year: 2023,
    type: 'sach-giay',
    cover: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=600&fit=crop',
    category: 'Toán học',
    grade: ['8'],
    description: 'Sách giáo khoa Toán 8 Tập 1 theo chương trình GDPT mới 2018, bao gồm các chủ đề: Biểu thức đại số, Đa thức, Phân thức đại số và Hình học phẳng.',
    views: 8500,
    likes: 1200,
    rating: 4.5,
    ratingCount: 280,
    available: 5,
    total: 10,
    shelf: 'Kho A, Kệ 2',
    pages: 180,
    tableOfContents: ['Chương I: Biểu thức đại số', 'Chương II: Phân thức đại số', 'Chương III: Hình tứ giác', 'Chương IV: Đa giác'],
  },
  {
    id: '3',
    title: 'English 7 - Global Success',
    author: 'Hoàng Văn Vân',
    publisher: 'NXB Giáo Dục',
    year: 2022,
    type: 'sach-giay',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=600&fit=crop',
    category: 'Ngoại ngữ',
    grade: ['7'],
    description: 'Sách tiếng Anh 7 Global Success theo chương trình mới, tích hợp 4 kỹ năng Nghe, Nói, Đọc, Viết.',
    views: 6200,
    likes: 980,
    rating: 4.6,
    ratingCount: 190,
    available: 3,
    total: 8,
    shelf: 'Kho B, Kệ 1',
    pages: 200,
  },
  {
    id: '9',
    title: 'Búp Sen Xanh',
    author: 'Sơn Tùng',
    publisher: 'NXB Kim Đồng',
    year: 1982,
    type: 'sach-giay',
    cover: 'https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=600&fit=crop',
    category: 'Không gian văn hóa Hồ Chí Minh',
    grade: ['6', '7', '8', '9'],
    description: 'Tiểu thuyết lịch sử viết về thời thơ ấu và tuổi trẻ của Chủ tịch Hồ Chí Minh.',
    views: 15400,
    likes: 4200,
    rating: 4.9,
    ratingCount: 890,
    available: 10,
    total: 15,
    shelf: 'Tủ sách Bác Hồ',
    pages: 350,
  },

  /* ─── SÁCH ĐIỆN TỬ ─── */
  {
    id: '4',
    title: 'Lịch Sử Hà Nội Nghìn Năm',
    author: 'Nhiều tác giả',
    publisher: 'NXB Hà Nội',
    year: 2020,
    type: 'sach-dien-tu',
    cover: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400&h=600&fit=crop',
    category: 'Lịch sử',
    grade: ['8', '9'],
    description: 'Cuốn sách tổng hợp lịch sử ngàn năm của thủ đô Hà Nội, từ thời kỳ Lý - Trần - Lê cho đến hiện đại, với nhiều hình ảnh và tư liệu quý giá.',
    views: 4300,
    likes: 670,
    rating: 4.7,
    ratingCount: 120,
    fileSize: '4.2 MB',
    pages: 350,
    tableOfContents: ['Phần 1: Thăng Long thời phong kiến', 'Phần 2: Hà Nội thời Pháp thuộc', 'Phần 3: Hà Nội trong kháng chiến', 'Phần 4: Hà Nội đổi mới'],
  },

  /* ─── VIDEO ─── */
  {
    id: '5',
    title: 'Vật Lý 8: Chuyển Động Cơ Học',
    author: 'Nguyễn Việt Kinh',
    publisher: 'NXB Giáo Dục',
    year: 2023,
    type: 'video',
    cover: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=600&fit=crop',
    category: 'Khoa học',
    grade: ['8'],
    description: 'Bài giảng video chi tiết về Chuyển Động Cơ Học trong chương trình Vật Lý 8.',
    views: 15600,
    likes: 2800,
    rating: 4.9,
    ratingCount: 380,
    duration: '48:30',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoSource: 'YouTube',
    timestamps: [
      { time: '00:00', label: 'Giới thiệu chủ đề' },
      { time: '05:30', label: 'Định nghĩa chuyển động' },
      { time: '15:20', label: 'Vận tốc và tốc độ' },
      { time: '28:00', label: 'Chuyển động đều và không đều' },
      { time: '38:00', label: 'Bài tập áp dụng' },
    ],
  },

  /* ─── SÁCH NÓI ─── */
  {
    id: '6',
    title: 'Kỹ Năng Thuyết Trình',
    author: 'TS. Nguyễn Thị Lan',
    publisher: 'NXB Trẻ',
    year: 2022,
    type: 'sach-noi',
    cover: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=600&fit=crop',
    category: 'Kỹ năng sống',
    grade: ['6', '7', '8', '9'],
    description: 'Hướng dẫn kỹ năng thuyết trình từ cơ bản đến nâng cao, giúp học sinh tự tin đứng trước đám đông.',
    views: 7800,
    likes: 1560,
    rating: 4.6,
    ratingCount: 230,
    duration: '3g 15p',
    chapters: [
      { id: 'c1', title: 'Chương 1: Vượt qua nỗi sợ', duration: '22:10' },
      { id: 'c2', title: 'Chương 2: Cấu trúc bài thuyết trình', duration: '28:45' },
      { id: 'c3', title: 'Chương 3: Ngôn ngữ cơ thể', duration: '19:30' },
    ],
  },

  /* ─── SÁCH GIẤY ─── */
  {
    id: '7',
    title: 'Ngữ Văn 9 - Tập 2',
    author: 'Nguyễn Khắc Phi',
    publisher: 'Chân trời sáng tạo',
    year: 2023,
    type: 'sach-giay',
    cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
    category: 'Văn học',
    grade: ['9'],
    description: 'Sách Ngữ Văn 9 Tập 2 theo bộ sách Chân Trời Sáng Tạo, gồm các tác phẩm văn học Việt Nam và nước ngoài đặc sắc.',
    views: 5400,
    likes: 890,
    rating: 4.4,
    ratingCount: 165,
    available: 0,
    total: 5,
    shelf: 'Kho C, Kệ 2',
    pages: 220,
  },

  /* ─── BÀI GIẢNG ─── */
  {
    id: '8',
    title: 'Bài Giảng Toán 9: Hệ Phương Trình',
    author: 'Thầy Nguyễn Minh Tuấn',
    publisher: 'Thư viện THCS Dịch Vọng',
    year: 2024,
    type: 'bai-giang',
    cover: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?w=400&h=600&fit=crop',
    category: 'Toán học',
    grade: ['9'],
    description: 'Bài giảng điện tử chi tiết về Hệ Phương Trình cho học sinh lớp 9, bao gồm lý thuyết, ví dụ và bài tập từ cơ bản đến nâng cao.',
    views: 9800,
    likes: 2100,
    rating: 4.9,
    ratingCount: 310,
    fileSize: '2.4 MB',
    pages: 48,
    videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
    videoSource: 'YouTube',
  },

  /* ─── ALBUM ─── */
  {
    id: 'a1',
    title: 'Ngày Hội Đọc Sách 2024',
    author: 'Thư viện THCS Dịch Vọng',
    publisher: 'THCS Dịch Vọng',
    year: 2024,
    type: 'album',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    category: 'Hoạt động thư viện',
    grade: ['6', '7', '8', '9'],
    description: 'Album hình ảnh ghi lại những khoảnh khắc đáng nhớ trong Ngày Hội Đọc Sách năm 2024 tại Trường THCS Dịch Vọng, với sự tham gia của toàn thể học sinh và giáo viên.',
    views: 7200,
    likes: 1840,
    rating: 4.9,
    ratingCount: 210,
    photoCount: 24,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop', caption: 'Khai mạc Ngày Hội Đọc Sách', isCover: true },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=600&fit=crop', caption: 'Học sinh say mê đọc sách' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=600&fit=crop', caption: 'Góc đọc sách sáng tạo' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=900&h=600&fit=crop', caption: 'Gian hàng sách văn học' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=600&fit=crop', caption: 'Các em học sinh lớp 7 tham quan' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&h=600&fit=crop', caption: 'Thầy cô hướng dẫn học sinh chọn sách' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&h=600&fit=crop', caption: 'Góc trưng bày sách quý' },
      { id: 'p8', url: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&h=600&fit=crop', caption: 'Trao giải cuộc thi giới thiệu sách hay' },
      { id: 'p9', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&h=600&fit=crop', caption: 'Hoạt động nhóm thảo luận về sách' },
      { id: 'p10', url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=900&h=600&fit=crop', caption: 'Bế mạc và tổng kết sự kiện' },
    ],
  },
  {
    id: 'a2',
    title: 'Hình Ảnh Hoạt Động Thư Viện',
    author: 'Thư viện THCS Dịch Vọng',
    publisher: 'THCS Dịch Vọng',
    year: 2024,
    type: 'album',
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=400&fit=crop',
    category: 'Hoạt động thư viện',
    grade: ['6', '7', '8', '9'],
    description: 'Bộ sưu tập hình ảnh ghi lại các hoạt động thường nhật tại thư viện trường: đọc sách, mượn trả, hội thảo và các câu lạc bộ sách.',
    views: 4800,
    likes: 960,
    rating: 4.7,
    ratingCount: 145,
    photoCount: 18,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=600&fit=crop', caption: 'Không gian thư viện hiện đại', isCover: true },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=900&h=600&fit=crop', caption: 'Khu đọc sách yên tĩnh' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=900&h=600&fit=crop', caption: 'Quầy mượn trả sách' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&h=600&fit=crop', caption: 'Giá sách được sắp xếp ngăn nắp' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=600&fit=crop', caption: 'Buổi sinh hoạt câu lạc bộ sách' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=600&fit=crop', caption: 'Học sinh đọc sách tự do' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=900&h=600&fit=crop', caption: 'Triển lãm sách mới' },
      { id: 'p8', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop', caption: 'Góc sách thiếu nhi' },
    ],
  },
  {
    id: 'a3',
    title: 'Giới Thiệu Sách Hay - Học Kỳ I',
    author: 'CLB Đọc Sách',
    publisher: 'THCS Dịch Vọng',
    year: 2024,
    type: 'album',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
    category: 'Ngày hội sách',
    grade: ['6', '7', '8', '9'],
    description: 'Hình ảnh buổi giới thiệu sách hay của các bạn học sinh trong học kỳ I năm học 2024-2025. Nhiều đầu sách thú vị được chia sẻ và bình luận sôi nổi.',
    views: 3600,
    likes: 720,
    rating: 4.8,
    ratingCount: 98,
    photoCount: 15,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=900&h=600&fit=crop', caption: 'Mở đầu buổi giới thiệu sách', isCover: true },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&h=600&fit=crop', caption: 'Bạn Minh Anh giới thiệu sách yêu thích' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&h=600&fit=crop', caption: 'Thảo luận nhóm về nội dung sách' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=900&h=600&fit=crop', caption: 'Trưng bày bìa sách đẹp nhất' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=900&h=600&fit=crop', caption: 'Bình chọn cuốn sách hay nhất' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop', caption: 'Tổng kết và trao phần thưởng' },
    ],
  },
  {
    id: 'a4',
    title: 'Khai Giảng Năm Học 2024-2025',
    author: 'Thư viện THCS Dịch Vọng',
    publisher: 'THCS Dịch Vọng',
    year: 2024,
    type: 'album',
    cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    category: 'Khai giảng',
    grade: ['6', '7', '8', '9'],
    description: 'Những khoảnh khắc đáng nhớ trong lễ khai giảng năm học mới 2024-2025 tại Trường THCS Dịch Vọng.',
    views: 9100,
    likes: 2340,
    rating: 4.9,
    ratingCount: 310,
    photoCount: 32,
    photos: [
      { id: 'p1', url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&h=600&fit=crop', caption: 'Lễ khai giảng long trọng', isCover: true },
      { id: 'p2', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&h=600&fit=crop', caption: 'Học sinh háo hức ngày đầu năm học' },
      { id: 'p3', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&h=600&fit=crop', caption: 'Tiết mục văn nghệ chào mừng' },
      { id: 'p4', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=900&h=600&fit=crop', caption: 'Ban giám hiệu phát biểu' },
      { id: 'p5', url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=900&h=600&fit=crop', caption: 'Học sinh xếp hàng ngay ngắn' },
      { id: 'p6', url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=900&h=600&fit=crop', caption: 'Cắt băng khánh thành thư viện mới' },
      { id: 'p7', url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&h=600&fit=crop', caption: 'Tham quan không gian thư viện' },
      { id: 'p8', url: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=600&fit=crop', caption: 'Kỷ niệm với thầy cô và bạn bè' },
    ],
  },
];

export const REVIEWS: Review[] = [
  { id: 'r1', bookId: '1', userName: 'Nguyễn Minh Anh', userClass: 'Lớp 7A2', rating: 5, text: 'Sách rất hay và thú vị! Tôi đã nghe hết trong 2 ngày. Giọng đọc rất truyền cảm, câu chuyện sinh động. Rất phù hợp cho học sinh lớp 6-7.', date: '15/11/2024' },
  { id: 'r2', bookId: '1', userName: 'Trần Phương Linh', userClass: 'Lớp 6A1', rating: 5, text: 'Tuyệt vời! Tôi rất thích phần Dế Mèn gặp Dế Trũi. Bài học về tình bạn và sự dũng cảm rất ý nghĩa.', date: '10/11/2024' },
  { id: 'r3', bookId: '1', userName: 'Lê Quang Huy', userClass: 'Lớp 7B3', rating: 4, text: 'Nội dung hay nhưng audio hơi nhỏ ở chương 3. Mong ban quản trị cải thiện chất lượng âm thanh.', date: '05/11/2024' },
  { id: 'r4', bookId: 'a1', userName: 'Phạm Thị Hoa', userClass: 'Lớp 8A1', rating: 5, text: 'Album ảnh rất đẹp! Kỷ niệm đáng nhớ của Ngày Hội Đọc Sách. Rất vui khi được tham gia sự kiện này.', date: '20/10/2024' },
  { id: 'r5', bookId: 'a1', userName: 'Ngô Văn Đức', userClass: 'Lớp 7C2', rating: 5, text: 'Ảnh chụp rất sắc nét và sinh động. Nhìn lại mà thấy nhớ ngày hội quá!', date: '18/10/2024' },
];

export const CATEGORIES = [
  { label: 'Sách giấy',       icon: '📚', path: '/sach-giay',    count: 145 },
  { label: 'Sách điện tử',    icon: '💻', path: '/sach-dien-tu', count: 89 },
  { label: 'Sách nói',        icon: '🎧', path: '/sach-noi',     count: 56 },
  { label: 'Bài giảng ĐT',   icon: '🎓', path: '/bai-giang',    count: 234 },
  { label: 'Video',           icon: '🎬', path: '/video',        count: 78 },
  { label: 'Album ảnh',       icon: '📸', path: '/album',        count: 42 },
  { label: 'Kỹ năng sống',    icon: '🌱', path: '/ky-nang-song', count: 67 },
  { label: 'Tin tức',         icon: '📰', path: '/tin-tuc',      count: 93 },
];

export const TYPE_CONFIG: Record<ResourceType, { label: string; bg: string; text: string }> = {
  'sach-giay':    { label: 'Sách giấy',    bg: 'bg-green-100',  text: 'text-green-800' },
  'sach-dien-tu': { label: 'Sách điện tử', bg: 'bg-blue-100',   text: 'text-blue-800' },
  'sach-noi':     { label: 'Sách nói',     bg: 'bg-orange-100', text: 'text-orange-700' },
  'bai-giang':    { label: 'Bài giảng',    bg: 'bg-purple-100', text: 'text-purple-800' },
  'video':        { label: 'Video',         bg: 'bg-red-100',    text: 'text-red-700' },
  'album':        { label: 'Album ảnh',    bg: 'bg-teal-100',   text: 'text-teal-700' },
};

// Albums subset for easy access
export const ALBUMS = BOOKS.filter(b => b.type === 'album');
