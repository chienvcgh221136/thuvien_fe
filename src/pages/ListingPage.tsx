import React, { useState } from 'react';
import {
  Grid, List, MapPin, ChevronLeft, ChevronRight,
  BookOpen, Headphones, Play, Eye, Heart, Camera, Image,
} from 'lucide-react';
import { BOOKS, TYPE_CONFIG } from '../data/mockData';
import { Pagination } from '../components/Pagination';

type NavigateFn = (page: string, bookId?: string, autoOpenReader?: boolean) => void;

interface ListingPageProps {
  category: string;
  onNavigate: NavigateFn;
}

const CATEGORY_INFO: Record<string, { title: string; desc: string; emoji: string }> = {
  'sach-giay':    { title: 'Khám Phá Sách Giấy',    desc: 'Bộ sưu tập sách giáo khoa, sách tham khảo và văn học truyền thống dành cho học sinh và giáo viên THCS Dịch Vọng.',         emoji: '📚' },
  'sach-dien-tu': { title: 'Sách Điện Tử',          desc: 'Kho sách điện tử phong phú — đọc trực tuyến với chế độ lật trang 3D, hỗ trợ zoom và đánh dấu trang.',                         emoji: '💻' },
  'sach-noi':     { title: 'Sách Nói',              desc: 'Thư viện sách nói audio chất lượng cao, nghe mọi lúc mọi nơi.',                                                               emoji: '🎧' },
  'bai-giang':    { title: 'Bài Giảng Điện Tử',    desc: 'Tài liệu bài giảng PDF do giáo viên biên soạn, hỗ trợ đọc trực tuyến và tải về.',                                            emoji: '🎓' },
  'video':        { title: 'Video Bài Giảng',       desc: 'Kho video bài giảng trực quan, sinh động cho học sinh.',                                                                       emoji: '🎬' },
  'album':        { title: 'Album Ảnh',             desc: 'Bộ sưu tập hình ảnh sự kiện, hoạt động ngoại khoá, kỷ niệm nhà trường.',                                                      emoji: '📸' },
  'ky-nang-song': { title: 'Kỹ Năng Sống',         desc: 'Tài liệu phát triển kỹ năng sống, tự tin và trưởng thành.',                                                                   emoji: '🌱' },
  'tin-tuc':      { title: 'Tin Tức & Sự Kiện',    desc: 'Tin tức mới nhất từ thư viện và nhà trường.',                                                                                  emoji: '📰' },
};

const AVAILABILITY = [
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Đã mượn hết', dotColor: 'bg-gray-300',  textColor: 'text-gray-400' },
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
  { label: 'Đã mượn hết', dotColor: 'bg-gray-300',  textColor: 'text-gray-400' },
  { label: 'Sẵn sàng',    dotColor: 'bg-green-500', textColor: 'text-green-600' },
];

/* Action button config per type */
const getActionInfo = (type: string) => {
  switch (type) {
    case 'sach-dien-tu': return { icon: BookOpen, label: 'Đọc ngay',    color: 'bg-blue-500 hover:bg-blue-600',   autoReader: true };
    case 'bai-giang':    return { icon: BookOpen, label: 'Xem bài giảng', color: 'bg-purple-500 hover:bg-purple-600', autoReader: true };
    case 'sach-noi':     return { icon: Headphones, label: 'Nghe ngay', color: 'bg-orange-500 hover:bg-orange-600', autoReader: false };
    case 'video':        return { icon: Play, label: 'Xem video',        color: 'bg-red-500 hover:bg-red-600',    autoReader: false };
    default:             return { icon: BookOpen, label: 'Xem chi tiết', color: 'bg-green-500 hover:bg-green-600', autoReader: false };
  }
};

export const ListingPage: React.FC<ListingPageProps> = ({ category, onNavigate }) => {
  const [viewMode, setViewMode]     = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy]         = useState('Mới nhất');

  const isAlbum = category === 'album';
  const info    = CATEGORY_INFO[category] || CATEGORY_INFO['sach-giay'];

  const books = BOOKS.filter(b => {
    if (category === 'album')        return b.type === 'album';
    if (category === 'sach-giay')    return b.type === 'sach-giay';
    if (category === 'sach-dien-tu') return b.type === 'sach-dien-tu';
    if (category === 'sach-noi')     return b.type === 'sach-noi';
    if (category === 'bai-giang')    return b.type === 'bai-giang';
    if (category === 'video')        return b.type === 'video';
    return true; // other categories show all
  });

  const ITEMS_PER_PAGE = isAlbum ? 9 : 10;
  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);
  const currentBooks = books.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="animate-fade-in">
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm text-gray-400 mb-4">
          <button onClick={() => onNavigate('home')} className="hover:text-green-600 transition-colors">Trang chủ</button>
          <ChevronRight size={14} />
          <span className="text-gray-700 font-medium">{info.title}</span>
        </div>

        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-2xl font-black text-green-600 mb-1 flex items-center gap-2">
            <span>{info.emoji}</span> {info.title}
          </h1>
          <p className="text-sm text-gray-500 max-w-xl">{info.desc}</p>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {isAlbum ? (
            /* Album filters */
            <>
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer outline-none hover:border-teal-400 transition-colors">
                <option value="">Danh mục ▾</option>
                {['Hoạt động thư viện', 'Ngày hội sách', 'Khai giảng', 'Ngoại khoá', 'Khác'].map(o => <option key={o}>{o}</option>)}
              </select>
              <select className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer outline-none hover:border-teal-400 transition-colors">
                <option value="">Năm ▾</option>
                {['2024', '2023', '2022', '2021'].map(o => <option key={o}>{o}</option>)}
              </select>
            </>
          ) : (
            /* Normal filters */
            <>
              {[
                { label: 'Thể loại', options: ['Tất cả', 'Toán học', 'Ngữ văn', 'Ngoại ngữ', 'Khoa học'] },
                { label: 'Lớp học',  options: ['Tất cả', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'] },
              ].map(f => (
                <div key={f.label} className="relative">
                  <select className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer outline-none pr-7 hover:border-green-400 transition-colors">
                    <option value="">{f.label} ▾</option>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </>
          )}

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className={`appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 cursor-pointer outline-none hover:border-${isAlbum ? 'teal' : 'green'}-400 transition-colors`}
          >
            {['Mới nhất', 'Xem nhiều nhất', 'Đánh giá cao', 'A-Z'].map(o => (
              <option key={o}>Sắp xếp: {o}</option>
            ))}
          </select>

          {/* View toggle — not for albums */}
          {!isAlbum && (
            <div className="ml-auto flex gap-1">
              {(['grid', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-lg border transition-all ${viewMode === mode ? 'bg-green-50 border-green-400 text-green-600' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'}`}
                >
                  {mode === 'grid' ? <Grid size={16} /> : <List size={16} />}
                </button>
              ))}
            </div>
          )}

          {/* Album count */}
          {isAlbum && (
            <span className="ml-auto text-sm text-gray-400">
              <strong className="text-gray-700">{books.length}</strong> album
            </span>
          )}
        </div>

        {/* ═══ ALBUM GRID ═════════════════════════════════ */}
        {isAlbum && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {(currentBooks.length > 0 ? currentBooks : BOOKS.filter(b => b.type === 'album').slice(0, ITEMS_PER_PAGE)).map((book, i) => (
              <div
                key={book.id}
                onClick={() => onNavigate('detail', book.id)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                {/* Cover thumbnail */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Photo strip overlay (simulated) */}
                  {book.photos && book.photos.length > 1 && (
                    <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                      {book.photos.slice(1, 4).map(p => (
                        <div key={p.id} className="flex-1 h-8 rounded overflow-hidden border border-white/50 shadow-sm">
                          <img src={p.url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {(book.photoCount || book.photos.length) > 4 && (
                        <div className="flex-1 h-8 rounded overflow-hidden bg-black/60 border border-white/30 flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold">+{(book.photoCount || book.photos.length) - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {/* Photo count badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <Camera size={11} />
                    {book.photoCount || book.photos?.length || 0}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <span className="inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 mb-2">
                    {book.category}
                  </span>
                  <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{book.author} · {book.year}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye size={11} /> {book.views.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Heart size={11} /> {book.likes.toLocaleString()}</span>
                    <button
                      onClick={e => { e.stopPropagation(); onNavigate('detail', book.id); }}
                      className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1"
                    >
                      <Image size={11} /> Xem album
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ STANDARD BOOK GRID ══════════════════════════ */}
        {!isAlbum && (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6' : 'flex flex-col gap-3 mb-6'}>
              {currentBooks.map((book, i) => {
                const conf    = TYPE_CONFIG[book.type];
                const avail   = AVAILABILITY[i % AVAILABILITY.length];
                const actInfo = getActionInfo(book.type);
                const ActIcon = actInfo.icon;

                if (viewMode === 'list') {
                  return (
                    <div
                      key={book.id}
                      className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex gap-4 cursor-pointer hover:shadow-md hover:border-green-200 transition-all"
                    >
                      {/* Cover */}
                      <div
                        className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 shadow-sm cursor-pointer"
                        onClick={() => onNavigate('detail', book.id)}
                      >
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0" onClick={() => onNavigate('detail', book.id)}>
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text} mb-1`}>{conf.label}</span>
                        <h3 className="font-bold text-sm text-gray-900">{book.title}</h3>
                        <p className="text-xs text-gray-400">{book.author} • {book.publisher}</p>
                      </div>
                      {/* Actions */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-1 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full ${avail.dotColor}`} />
                          <span className={avail.textColor}>{avail.label}</span>
                        </div>
                        <button
                          onClick={() => onNavigate('detail', book.id, actInfo.autoReader)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 ${actInfo.color} text-white rounded-lg text-xs font-bold transition-colors`}
                        >
                          <ActIcon size={12} /> {actInfo.label}
                        </button>
                      </div>
                    </div>
                  );
                }

                /* Grid card */
                return (
                  <div
                    key={book.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                  >
                    {/* Cover */}
                    <div
                      className="relative"
                      style={{ aspectRatio: '3/4' }}
                      onClick={() => onNavigate('detail', book.id)}
                    >
                      <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      {/* Availability */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm">
                        <span className={`w-1.5 h-1.5 rounded-full ${avail.dotColor}`} />
                        <span className={avail.textColor}>{avail.label}</span>
                      </div>
                      {/* Quick-read overlay for ebooks */}
                      {(book.type === 'sach-dien-tu' || book.type === 'bai-giang') && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={e => { e.stopPropagation(); onNavigate('detail', book.id, true); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-full text-xs font-bold shadow-lg hover:bg-green-50 transition-colors"
                          >
                            <BookOpen size={14} /> Đọc ngay
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-3" onClick={() => onNavigate('detail', book.id)}>
                      <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full mb-1.5 ${conf.bg} ${conf.text}`}>{conf.label}</span>
                      <h3 className="font-bold text-[13.5px] leading-snug mb-0.5 text-gray-900 line-clamp-2">{book.title}</h3>
                      <p className="text-[11.5px] text-gray-400 mb-2">{book.publisher}</p>
                      {book.shelf && (
                        <div className="flex items-center gap-1 text-[11px] text-gray-400">
                          <MapPin size={11} /> {book.shelf}
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <div className="px-3 pb-3">
                      <button
                        onClick={e => { e.stopPropagation(); onNavigate('detail', book.id, actInfo.autoReader); }}
                        className={`w-full py-1.5 rounded-lg ${actInfo.color} text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors`}
                      >
                        <ActIcon size={12} /> {actInfo.label}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              colorTheme="green"
            />
          </>
        )}

        {/* Album pagination */}
        {isAlbum && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            colorTheme="teal"
          />
        )}
      </div>
    </div>
  );
};
