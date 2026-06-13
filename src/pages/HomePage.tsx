import React, { useState, useEffect } from 'react';
import {
  Eye, Heart, Headphones, Play, BookOpen, Monitor,
  ChevronRight, Camera, Image,
} from 'lucide-react';
import { BOOKS, CATEGORIES, TYPE_CONFIG, ResourceType, ALBUMS } from '../data/mockData';

type NavigateFn = (page: string, bookId?: string, autoOpenReader?: boolean) => void;

interface HomePageProps {
  onNavigate: NavigateFn;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [trendingIdx, setTrendingIdx] = useState(0);
  const [autoPlay, setAutoPlay]       = useState(true);
  const featured = BOOKS[trendingIdx];

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setTrendingIdx(i => (i + 1) % Math.min(BOOKS.length, 5));
    }, 4000);
    return () => clearInterval(timer);
  }, [autoPlay]);

  const getActionBtn = (type: ResourceType) => {
    switch (type) {
      case 'sach-noi':     return { icon: Headphones, label: 'Nghe đầy đủ' };
      case 'video':
      case 'bai-giang':   return { icon: Play,        label: 'Xem video' };
      case 'sach-dien-tu': return { icon: BookOpen,   label: 'Đọc ngay' };
      default:             return { icon: BookOpen,   label: 'Xem ngay' };
    }
  };

  const typeConf = TYPE_CONFIG[featured.type];
  const action   = getActionBtn(featured.type);

  const heroImages = [
    'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=500&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=1200&h=500&fit=crop&q=80',
  ];

  return (
    <div className="animate-fade-in">
      {/* ── HERO / TRENDING ──────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: 380 }}>
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${heroImages[trendingIdx]})` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />

        <div className="relative max-w-[1200px] mx-auto px-8 py-10 flex gap-8">
          {/* Left: featured book */}
          <div className="flex-1 flex gap-7 items-start">
            <div
              className="w-36 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-white/20"
              style={{ aspectRatio: '2/3' }}
              onClick={() => onNavigate('detail', featured.id)}
            >
              <img src={featured.cover} alt={featured.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 text-white pt-2">
              <p className="text-xs font-bold uppercase tracking-widest text-yellow-400 mb-1">Tài liệu thịnh hành</p>
              <h1
                className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 cursor-pointer hover:text-yellow-300 transition-colors line-clamp-2"
                onClick={() => onNavigate('detail', featured.id)}
              >
                {featured.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-300 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${typeConf.bg} ${typeConf.text}`}>{typeConf.label}</span>
                <span className="flex items-center gap-1.5"><Headphones size={13} /> {featured.views.toLocaleString()} lượt xem</span>
                <span className="flex items-center gap-1.5"><Heart size={13} /> {featured.likes.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-300 mb-1">Thể loại: <span className="text-white font-medium">{featured.category}</span></p>
              <p className="text-sm text-gray-300 mb-4">Hình thức: <span className="text-white font-medium">{typeConf.label}</span></p>
              <button
                onClick={() => onNavigate('detail', featured.id, featured.type === 'sach-dien-tu' || featured.type === 'bai-giang')}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-400 text-white rounded-full text-sm font-bold transition-all hover:shadow-lg hover:shadow-green-500/40 hover:-translate-y-0.5"
              >
                <action.icon size={16} /> {action.label}
              </button>
            </div>
          </div>

          {/* Right: trending list */}
          <div className="hidden lg:flex flex-col gap-2.5 w-[340px] flex-shrink-0">
            {BOOKS.slice(0, 5).map((book, i) => {
              const conf = TYPE_CONFIG[book.type];
              return (
                <button
                  key={book.id}
                  onClick={() => { setTrendingIdx(i); setAutoPlay(false); }}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200
                    ${i === trendingIdx ? 'bg-white/20 border border-white/30 backdrop-blur-sm' : 'bg-black/30 border border-white/10 hover:bg-white/15 backdrop-blur-sm'}`}
                >
                  <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow">
                    <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-snug">{book.title}</p>
                    <div className="flex gap-1.5 mt-1 flex-wrap">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>{conf.label}</span>
                      <span className="text-[10px] text-gray-300">{book.category}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {BOOKS.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => { setTrendingIdx(i); setAutoPlay(false); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === trendingIdx ? 'bg-yellow-400 w-6' : 'bg-white/40 w-2'}`}
            />
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <section className="bg-[#f8f9fa] pt-8 pb-4">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-100 px-8 py-6 flex items-center">
            <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap mr-12">Danh mục tài liệu</h2>
            
            <div className="flex-1 flex items-start justify-between overflow-x-auto scrollbar-hide px-4">
              {/* 1. Không gian văn hóa HCM */}
              <button onClick={() => onNavigate('khong-gian-van-hoa')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-28">
                <div className="text-red-600 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                    <path d="M12 6l-2 3h4l-2 3"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-red-600 transition-colors">Không gian văn hóa<br/>Hồ Chí Minh</span>
              </button>

              {/* 2. Sách giấy */}
              <button onClick={() => onNavigate('sach-giay')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-24">
                <div className="text-green-500 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-green-600 transition-colors">Sách giấy</span>
              </button>

              {/* 3. Sách điện tử */}
              <button onClick={() => onNavigate('sach-dien-tu')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-24">
                <div className="text-red-500 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                    <line x1="12" y1="18" x2="12.01" y2="18"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-red-500 transition-colors">Sách điện tử</span>
              </button>

              {/* 4. Sách nói */}
              <button onClick={() => onNavigate('sach-noi')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-24">
                <div className="text-orange-400 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12h.01M12 9v6M16 12h.01"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-orange-500 transition-colors">Sách nói</span>
              </button>

              {/* 5. Bài giảng điện tử */}
              <button onClick={() => onNavigate('bai-giang')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-28">
                <div className="text-blue-500 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                    <path d="M7 8l5-3 5 3v4l-5 3-5-3V8z"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-blue-600 transition-colors">Bài giảng điện tử</span>
              </button>

              {/* 6. Video */}
              <button onClick={() => onNavigate('video')} className="flex flex-col items-center gap-3 group flex-shrink-0 hover:-translate-y-1 transition-transform duration-200 w-24">
                <div className="text-purple-500 transition-transform group-hover:scale-110">
                  <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                    <polyline points="17 2 12 7 7 2"/>
                    <polygon points="10 11 16 14.5 10 18 10 11"/>
                  </svg>
                </div>
                <span className="text-[13px] font-medium text-gray-700 text-center leading-tight group-hover:text-purple-600 transition-colors">Video</span>
              </button>
            </div>

            <button className="ml-8 w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-300 hover:bg-gray-50 flex-shrink-0 transition-all shadow-sm">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-8 py-8 space-y-10">

        {/* Sách mới thêm */}
        <BookRow
          title="Sách mới thêm"
          icon="📗"
          books={BOOKS.filter(b => b.type !== 'album')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('sach-giay')}
          size="large"
        />

        {/* Không gian văn hóa Hồ Chí Minh */}
        <BookRow
          title="Không gian văn hóa Hồ Chí Minh"
          icon="⭐"
          books={BOOKS.filter(b => b.category === 'Không gian văn hóa Hồ Chí Minh')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('khong-gian-van-hoa')}
        />

        {/* Sách giấy */}
        <BookRow
          title="Sách giấy"
          icon="📚"
          books={BOOKS.filter(b => b.type === 'sach-giay' && b.category !== 'Không gian văn hóa Hồ Chí Minh')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('sach-giay')}
        />

        {/* Sách điện tử — với nút Đọc ngay trực tiếp */}
        <EbookRow
          title="Sách điện tử"
          icon="💻"
          books={BOOKS.filter(b => b.type === 'sach-dien-tu')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('sach-dien-tu')}
        />

        {/* Sách nói */}
        <BookRow
          title="Sách nói"
          icon="🎧"
          books={BOOKS.filter(b => b.type === 'sach-noi')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('sach-noi')}
        />

        {/* Bài giảng điện tử */}
        <BookRow
          title="Bài giảng điện tử"
          icon="🎓"
          books={BOOKS.filter(b => b.type === 'bai-giang')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('bai-giang')}
        />

        {/* Video bài giảng */}
        <BookRow
          title="Video bài giảng"
          icon="🎬"
          books={BOOKS.filter(b => b.type === 'video')}
          onNavigate={onNavigate}
          onViewAll={() => onNavigate('video')}
          isVideo
        />

        {/* Album ảnh */}
        <AlbumSection albums={ALBUMS} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────
   Album Section
────────────────────────────────────────────────────────── */
interface AlbumSectionProps {
  albums: typeof ALBUMS;
  onNavigate: NavigateFn;
}

const AlbumSection: React.FC<AlbumSectionProps> = ({ albums, onNavigate }) => {
  if (!albums.length) return null;
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>📸</span> Album ảnh
        </h2>
        <button
          onClick={() => onNavigate('album')}
          className="text-sm text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1 group"
        >
          Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums.slice(0, 4).map(album => (
          <div
            key={album.id}
            onClick={() => onNavigate('detail', album.id)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img
                src={album.cover}
                alt={album.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Mini strip */}
              {album.photos && album.photos.length > 1 && (
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex gap-1">
                  {album.photos.slice(1, 4).map(p => (
                    <div key={p.id} className="flex-1 h-7 rounded overflow-hidden border border-white/60">
                      <img src={p.url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
              {/* Photo count */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Camera size={9} /> {album.photoCount || album.photos?.length || 0}
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-0.5 group-hover:text-teal-600 transition-colors">{album.title}</h3>
              <p className="text-xs text-gray-400">{album.category}</p>
              <div className="flex items-center justify-between mt-2 text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Eye size={10} /> {album.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart size={10} /> {album.likes.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ──────────────────────────────────────────────────────────
   Ebook Row — special row with "Đọc ngay" button
────────────────────────────────────────────────────────── */
interface EbookRowProps {
  title: string;
  icon: string;
  books: typeof BOOKS;
  onNavigate: NavigateFn;
  onViewAll: () => void;
}

const EbookRow: React.FC<EbookRowProps> = ({ title, icon, books, onNavigate, onViewAll }) => (
  <section>
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span>{icon}</span> {title}
        <span className="text-xs font-normal text-gray-400 ml-1">— nhấn để đọc trực tuyến với chế độ lật trang</span>
      </h2>
      <button onClick={onViewAll} className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 group">
        Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {books.slice(0, 5).map(book => {
        const conf = TYPE_CONFIG[book.type];
        return (
          <div
            key={book.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 cursor-pointer group"
          >
            {/* Cover with overlay */}
            <div
              className="relative"
              style={{ aspectRatio: '3/4' }}
              onClick={() => onNavigate('detail', book.id)}
            >
              <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>{conf.label}</span>
              {/* Hover: Đọc ngay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={e => { e.stopPropagation(); onNavigate('detail', book.id, true); }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-white text-gray-900 rounded-full text-xs font-bold shadow-lg hover:bg-green-50 transition-colors"
                >
                  <BookOpen size={13} /> Đọc ngay
                </button>
              </div>
            </div>

            <div className="p-3" onClick={() => onNavigate('detail', book.id)}>
              <p className="font-semibold text-sm leading-snug mb-0.5 line-clamp-2 text-gray-800">{book.title}</p>
              <p className="text-xs text-gray-400 mb-2">{book.category}</p>
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1"><Eye size={11} /> {book.views.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Heart size={11} /> {book.likes}</span>
              </div>
            </div>

            {/* Đọc ngay button */}
            <div className="px-3 pb-3">
              <button
                onClick={e => { e.stopPropagation(); onNavigate('detail', book.id, true); }}
                className="w-full py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <BookOpen size={12} /> Đọc ngay (lật trang)
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

/* ──────────────────────────────────────────────────────────
   Generic BookRow
────────────────────────────────────────────────────────── */
interface BookRowProps {
  title: string;
  icon: string;
  books: typeof BOOKS;
  onNavigate: NavigateFn;
  onViewAll: () => void;
  size?: 'default' | 'large';
  isVideo?: boolean;
}

const BookRow: React.FC<BookRowProps> = ({ title, icon, books, onNavigate, onViewAll, size = 'default', isVideo }) => {
  const getActionBtn = (type: ResourceType) => {
    switch (type) {
      case 'sach-noi':     return { icon: Headphones, label: 'Nghe ngay' };
      case 'video':
      case 'bai-giang':   return { icon: Play,        label: 'Xem video' };
      case 'sach-dien-tu': return { icon: BookOpen,   label: 'Đọc ngay' };
      default:             return { icon: BookOpen,   label: 'Xem ngay' };
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        <button onClick={onViewAll} className="text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1 group">
          Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {books.filter(b => b.type !== 'album').slice(0, 5).map(book => {
          const conf = TYPE_CONFIG[book.type];
          const act  = getActionBtn(book.type);
          const ActIcon = act.icon;
          return (
            <div
              key={book.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 cursor-pointer group"
              onClick={() => onNavigate('detail', book.id)}
            >
              <div className={`relative ${isVideo ? 'aspect-video bg-gray-900' : ''}`} style={!isVideo ? { aspectRatio: '3/4' } : {}}>
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md">
                      <Play size={18} className="text-gray-800 ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                )}
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${conf.bg} ${conf.text}`}>
                  {conf.label}
                </span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm leading-snug mb-0.5 line-clamp-2 text-gray-800">{book.title}</p>
                <p className="text-xs text-gray-400 mb-2">{book.category}</p>
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><Eye size={11} />{book.views.toLocaleString()}</span>
                  <span className="flex items-center gap-1"><Heart size={11} />{book.likes}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
