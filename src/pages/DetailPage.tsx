import React, { useState, useEffect } from 'react';
import {
  Eye, Heart, BookOpen, Headphones, Play,
  ChevronRight, X, MapPin, FileText, Clock,
  ZoomIn, ZoomOut, Maximize2, ArrowLeft, ArrowRight,
  Camera, Download, Grid3X3,
} from 'lucide-react';
import { BOOKS, REVIEWS, TYPE_CONFIG, type AlbumPhoto } from '../data/mockData';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */
type NavigateFn = (page: string, bookId?: string, autoOpenReader?: boolean) => void;

interface DetailPageProps {
  bookId: string;
  onNavigate: NavigateFn;
  onPlayAudio: (book: import('../data/mockData').Book) => void;
  autoOpenReader?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   Album Lightbox — fullscreen photo viewer
───────────────────────────────────────────────────────────── */
const AlbumLightbox: React.FC<{
  photos: AlbumPhoto[];
  initialIndex: number;
  onClose: () => void;
}> = ({ photos, initialIndex, onClose }) => {
  const [idx, setIdx] = useState(initialIndex);
  const photo = photos[idx];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  setIdx(i => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIdx(i => Math.min(photos.length - 1, i + 1));
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [photos.length, onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col animate-fade-in"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        onClick={e => e.stopPropagation()}
      >
        <span className="text-white/50 text-sm font-semibold">
          {idx + 1} / {photos.length}
        </span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main image */}
      <div
        className="flex-1 flex items-center justify-center relative px-20 min-h-0"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:scale-110"
        >
          <ArrowLeft size={22} />
        </button>

        <img
          key={photo.id}
          src={photo.url}
          alt={photo.caption || ''}
          className="max-h-full max-w-full object-contain rounded-xl shadow-2xl select-none"
          style={{ maxHeight: 'calc(100vh - 190px)' }}
          draggable={false}
        />

        <button
          onClick={() => setIdx(i => Math.min(photos.length - 1, i + 1))}
          disabled={idx === photos.length - 1}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white disabled:opacity-20 transition-all hover:scale-110"
        >
          <ArrowRight size={22} />
        </button>
      </div>

      {/* Caption + thumbnail strip */}
      <div className="flex-shrink-0 px-6 pb-5 pt-3" onClick={e => e.stopPropagation()}>
        {photo.caption && (
          <p className="text-white/70 text-center text-sm mb-3 font-medium">{photo.caption}</p>
        )}
        <div className="flex gap-2 justify-center overflow-x-auto pb-1">
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className={`w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                i === idx ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'
              }`}
            >
              <img src={p.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Borrow Modal
───────────────────────────────────────────────────────────── */
const BorrowModal: React.FC<{
  book: import('../data/mockData').Book;
  onClose: () => void;
}> = ({ book, onClose }) => {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="font-bold text-lg">
            {step === 1 ? 'Xác nhận mượn sách' : step === 2 ? 'Chọn ngày nhận sách' : 'Đặt mượn thành công!'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="px-6 py-5">
          {step === 1 && (
            <>
              <div className="flex gap-4 bg-green-50 border border-green-100 rounded-xl p-4 mb-5">
                <div className="w-14 h-20 rounded-lg overflow-hidden shadow-sm flex-shrink-0">
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-sm">{book.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{book.author}</p>
                  <p className="text-xs text-green-600 font-medium mt-2">Còn {book.available}/{book.total} cuốn</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <p className="text-xs font-bold text-amber-700 mb-2">📋 Quy định mượn sách</p>
                <ul className="space-y-1.5">
                  {['Thời hạn mượn tối đa: 7 ngày', 'Số sách tối đa cùng lúc: 3 cuốn', 'Gia hạn tối đa: 1 lần', 'Vui lòng giữ gìn sách cẩn thận'].map(r => (
                    <li key={r} className="text-xs text-amber-800 flex items-start gap-1.5"><span className="text-amber-500 mt-0.5">•</span> {r}</li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Hủy bỏ</button>
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">Tiếp tục →</button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn ngày nhận sách</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400" />
                {date && <p className="mt-2 text-sm text-green-600 font-medium">📅 {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">← Quay lại</button>
                <button onClick={() => setStep(3)} disabled={!date} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white rounded-xl text-sm font-semibold">Xác nhận →</button>
              </div>
            </>
          )}
          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
              <h3 className="font-black text-xl mb-2">Đặt mượn thành công!</h3>
              <p className="text-sm text-gray-500 mb-4">Vui lòng đến thư viện vào ngày đã chọn để nhận sách</p>
              <p className="text-xs text-gray-400 mb-6">Mã phiếu: <strong className="text-green-600">TV-2024-001234</strong></p>
              <button onClick={onClose} className="w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">Đóng</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Book Reader — lật trang 3D
───────────────────────────────────────────────────────────── */
const BookReader: React.FC<{
  book: import('../data/mockData').Book;
  onClose: () => void;
}> = ({ book, onClose }) => {
  const totalPages = book.pages || 48;
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDir, setFlipDir] = useState<'next' | 'prev'>('next');
  const [zoom, setZoom] = useState(1);

  const progress = (currentPage / totalPages) * 100;

  const triggerFlip = (dir: 'next' | 'prev') => {
    if (isFlipping) return;
    if (dir === 'next' && currentPage + 2 > totalPages) return;
    if (dir === 'prev' && currentPage <= 1) return;
    setFlipDir(dir);
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPage(p => dir === 'next' ? p + 2 : Math.max(1, p - 2));
      setIsFlipping(false);
    }, 620);
  };

  const PageContent = ({ pageNum }: { pageNum: number }) => {
    if (pageNum <= 1) {
      return (
        <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <img src={book.cover} alt={book.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 6, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }} />
        </div>
      );
    }
    const s = pageNum * 17;
    const ws = Array.from({ length: 14 }, (_, i) => {
      const r = (s + i * 11) % 5;
      return ['75%', '90%', '65%', '95%', '100%'][r];
    });
    const hasImg = pageNum % 3 === 0;
    const hasH   = pageNum % 2 === 1;
    const hasSub = pageNum % 5 === 2;
    return (
      <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', padding: '22px 20px 16px', overflow: 'hidden', userSelect: 'none', boxSizing: 'border-box' }}>
        <div style={{ fontSize: 9, color: '#c0c0c0', textAlign: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #f3f4f6', letterSpacing: '0.05em' }}>{book.title}</div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {hasH  && <div style={{ height: 13, background: '#1f2937', borderRadius: 3, width: '58%', marginBottom: 12 }} />}
          {hasSub && <div style={{ height: 9, background: '#9ca3af', borderRadius: 3, width: '38%', marginBottom: 9 }} />}
          {ws.slice(0, hasImg ? 5 : 14).map((w, i) => (
            <div key={i} style={{ height: 7, background: '#e5e7eb', borderRadius: 3, width: w, marginBottom: 6 }} />
          ))}
          {hasImg && (
            <div style={{ margin: '10px 0', height: 76, borderRadius: 8, overflow: 'hidden', background: `linear-gradient(135deg, ${pageNum % 2 ? '#eff6ff' : '#f0fdf4'}, ${pageNum % 3 ? '#fef3c7' : '#f0fdf4'})`, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 26, opacity: 0.3 }}>{['📷', '🗺️', '📊', '🖼️', '📈', '🎨'][pageNum % 6]}</span>
            </div>
          )}
          {hasImg && ws.slice(5).map((w, i) => (
            <div key={i} style={{ height: 7, background: '#e5e7eb', borderRadius: 3, width: w, marginBottom: 6 }} />
          ))}
        </div>
        <div style={{ fontSize: 9, color: '#c0c0c0', textAlign: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #f3f4f6' }}>{pageNum}</div>
      </div>
    );
  };

  const PW = 330;
  const PH = 470;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', background: '#c8c8c8' }} className="animate-fade-in">
      <style>{`
        @keyframes flipNext {
          0%   { transform: rotateY(0deg);    box-shadow:  2px 0 12px rgba(0,0,0,0.15); }
          50%  { transform: rotateY(-90deg);  box-shadow: -8px 0 24px rgba(0,0,0,0.3);  }
          100% { transform: rotateY(-180deg); box-shadow:  2px 0 12px rgba(0,0,0,0.1);  }
        }
        @keyframes flipPrev {
          0%   { transform: rotateY(0deg);   box-shadow: -2px 0 12px rgba(0,0,0,0.15); }
          50%  { transform: rotateY(90deg);  box-shadow:  8px 0 24px rgba(0,0,0,0.3);  }
          100% { transform: rotateY(180deg); box-shadow: -2px 0 12px rgba(0,0,0,0.1);  }
        }
        .book-flip-next { animation: flipNext 0.62s cubic-bezier(0.645,0.045,0.355,1.000) forwards; transform-style: preserve-3d; }
        .book-flip-prev { animation: flipPrev 0.62s cubic-bezier(0.645,0.045,0.355,1.000) forwards; transform-style: preserve-3d; }
      `}</style>

      {/* Top bar */}
      <div style={{ height: 56, background: '#006633', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, flexShrink: 0, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.18)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ArrowLeft size={18} />
        </button>
        <span style={{ flex: 1, textAlign: 'center', color: 'white', fontWeight: 700, fontSize: 15, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', padding: '0 8px' }}>{book.title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
          <button onClick={() => setZoom(z => Math.max(0.55, parseFloat((z - 0.15).toFixed(2))))} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomOut size={15} /></button>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, minWidth: 34, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(1.8, parseFloat((z + 0.15).toFixed(2))))} style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ZoomIn size={15} /></button>
          <button style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 4 }}><Maximize2 size={14} /></button>
        </div>
      </div>

      {/* Book stage */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <button onClick={() => triggerFlip('prev')} disabled={currentPage <= 1 || isFlipping}
          style={{ position: 'absolute', left: 20, zIndex: 20, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', opacity: (currentPage <= 1 || isFlipping) ? 0.2 : 1, transition: 'opacity 0.2s' }}>
          <ArrowLeft size={20} />
        </button>

        <div style={{ position: 'relative', display: 'flex', transform: `scale(${zoom})`, transition: 'transform 0.2s ease', perspective: 2400, perspectiveOrigin: 'center center', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.45))' }}>
          {/* Left page */}
          <div style={{ width: PW, height: PH, overflow: 'hidden', position: 'relative', borderRadius: '4px 0 0 4px', boxShadow: '-4px 0 16px rgba(0,0,0,0.18)' }}>
            <PageContent pageNum={currentPage} />
            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 28, background: 'linear-gradient(to left, rgba(0,0,0,0.09), transparent)', pointerEvents: 'none' }} />
          </div>
          {/* Spine */}
          <div style={{ width: 3, background: 'linear-gradient(to right, rgba(0,0,0,0.18), rgba(0,0,0,0.04))', flexShrink: 0, zIndex: 6 }} />
          {/* Right page */}
          <div style={{ width: PW, height: PH, overflow: 'hidden', position: 'relative', borderRadius: '0 4px 4px 0', boxShadow: '4px 0 16px rgba(0,0,0,0.18)' }}>
            {currentPage + 1 <= totalPages ? <PageContent pageNum={currentPage + 1} /> : <div style={{ width: '100%', height: '100%', background: '#fafafa' }} />}
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 28, background: 'linear-gradient(to right, rgba(0,0,0,0.09), transparent)', pointerEvents: 'none' }} />

            {isFlipping && flipDir === 'next' && (
              <div className="book-flip-next" style={{ position: 'absolute', inset: 0, zIndex: 10, transformOrigin: 'left center' }}>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                  <PageContent pageNum={currentPage + 1} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.12) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', overflow: 'hidden' }}>
                  <PageContent pageNum={currentPage + 2} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,0.10) 0%, transparent 50%)', pointerEvents: 'none' }} />
                </div>
              </div>
            )}
          </div>

          {isFlipping && flipDir === 'prev' && (
            <div className="book-flip-prev" style={{ position: 'absolute', top: 0, left: 0, width: PW, height: PH, zIndex: 10, transformOrigin: 'right center' }}>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', overflow: 'hidden' }}>
                <PageContent pageNum={currentPage} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(0,0,0,0.12) 0%, transparent 50%)', pointerEvents: 'none' }} />
              </div>
              <div style={{ position: 'absolute', inset: 0, backfaceVisibility: 'hidden', transform: 'rotateY(-180deg)', overflow: 'hidden' }}>
                <PageContent pageNum={currentPage - 1} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.10) 0%, transparent 50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          )}
        </div>

        <button onClick={() => triggerFlip('next')} disabled={currentPage + 2 > totalPages || isFlipping}
          style={{ position: 'absolute', right: 20, zIndex: 20, width: 44, height: 44, borderRadius: '50%', border: 'none', background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.25)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', opacity: (currentPage + 2 > totalPages || isFlipping) ? 0.2 : 1, transition: 'opacity 0.2s' }}>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Bottom bar */}
      <div style={{ height: 44, background: 'white', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 14, flexShrink: 0 }}>
        <span style={{ fontSize: 13, color: '#6b7280', minWidth: 100 }}>Trang <strong style={{ color: '#111827' }}>{currentPage}/{totalPages}</strong></span>
        <div style={{ flex: 1, height: 6, background: '#e5e7eb', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#22c55e', borderRadius: 99, width: `${progress}%`, transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          <button onClick={() => setZoom(z => Math.max(0.55, parseFloat((z - 0.15).toFixed(2))))} style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><ZoomOut size={14} /></button>
          <button onClick={() => setZoom(z => Math.min(1.8, parseFloat((z + 0.15).toFixed(2))))} style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><ZoomIn size={14} /></button>
          <button style={{ width: 28, height: 28, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}><Maximize2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   Main Detail Page
───────────────────────────────────────────────────────────── */
export const DetailPage: React.FC<DetailPageProps> = ({ bookId, onNavigate, onPlayAudio, autoOpenReader }) => {
  const book = BOOKS.find(b => b.id === bookId) || BOOKS[0];

  const [activeTab, setActiveTab]         = useState('mo-ta');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showReader, setShowReader]       = useState(false);
  const [liked, setLiked]                 = useState(false);
  const [reviewRating, setReviewRating]   = useState(0);
  const [videoUrl, setVideoUrl]           = useState(book.videoUrl || '');
  const [videoUrlInput, setVideoUrlInput] = useState(book.videoUrl || '');
  const [showUrlInput, setShowUrlInput]   = useState(!book.videoUrl);
  const [lightboxIdx, setLightboxIdx]     = useState<number | null>(null);

  const isAlbum     = book.type === 'album';
  const isVideoType = book.type === 'video' || book.type === 'bai-giang';

  /* Auto-open reader (e.g. clicked "Đọc ngay" từ listing page) */
  useEffect(() => {
    if (autoOpenReader && (book.type === 'sach-dien-tu' || book.type === 'bai-giang')) {
      setShowReader(true);
    }
  }, [autoOpenReader, book.type]);

  const toEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    const watchMatch = url.match(/[?&]v=([\w-]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    return url;
  };

  const embedUrl = toEmbedUrl(videoUrl);
  const conf     = TYPE_CONFIG[book.type];
  const reviews  = REVIEWS.filter(r => r.bookId === bookId);
  const relatedBooks = BOOKS.filter(b => b.id !== bookId && b.type === book.type).slice(0, 5);

  const renderStars = (rating: number, size = 14) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} style={{ fontSize: size, color: i < Math.round(rating) ? '#f59e0b' : '#d1d5db' }}>★</span>
    ));

  /* CTA buttons in hero */
  const renderCTA = () => {
    switch (book.type) {
      case 'album':
        return (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => document.getElementById('album-gallery')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-0.5"
            >
              <Camera size={16} /> Xem {book.photoCount || book.photos?.length || 0} ảnh
            </button>
            <button
              onClick={() => setLiked(l => !l)}
              className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${liked ? 'border-red-400 text-red-500 bg-red-50/20' : 'border-white/40 text-white/70 hover:border-white hover:text-white'}`}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        );

      case 'sach-dien-tu':
      case 'bai-giang':
        return (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowReader(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
            >
              <BookOpen size={16} /> ĐỌC SÁCH
            </button>
            <button
              onClick={() => setLiked(l => !l)}
              className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${liked ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'}`}
            >
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        );

      case 'sach-noi':
        return (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => onPlayAudio(book)}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
            >
              <Headphones size={16} /> NGHE SÁCH
            </button>
            <button onClick={() => setLiked(l => !l)} className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${liked ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'}`}>
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        );

      case 'video':
        return (
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowUrlInput(v => !v)}
              className="flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full text-sm font-medium transition-all"
            >
              <Play size={14} /> Cài URL video
            </button>
            <button onClick={() => setLiked(l => !l)} className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${liked ? 'border-red-400 text-red-500 bg-red-50/20' : 'border-white/40 text-white/70 hover:border-white hover:text-white'}`}>
              <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
            </button>
          </div>
        );

      case 'sach-giay':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${(book.available || 0) > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={(book.available || 0) > 0 ? 'text-green-600 font-medium' : 'text-gray-400'}>
                {(book.available || 0) > 0 ? `Còn ${book.available}/${book.total} cuốn` : 'Đã mượn hết'}
              </span>
              {book.shelf && <span className="flex items-center gap-1 text-gray-400"><MapPin size={11} /> {book.shelf}</span>}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBorrowModal(true)}
                disabled={!book.available}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full font-bold text-sm transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
              >
                <FileText size={16} /> ĐĂNG KÝ MƯỢN
              </button>
              <button onClick={() => setLiked(l => !l)} className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all ${liked ? 'border-red-400 text-red-500 bg-red-50' : 'border-gray-300 text-gray-500 hover:border-green-400 hover:text-green-600'}`}>
                <Heart size={16} fill={liked ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <>
      {showReader     && <BookReader   book={book} onClose={() => setShowReader(false)} />}
      {showBorrowModal && <BorrowModal book={book} onClose={() => setShowBorrowModal(false)} />}
      {lightboxIdx !== null && book.photos && (
        <AlbumLightbox
          photos={book.photos}
          initialIndex={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
        />
      )}

      <div className="animate-fade-in">
        {/* ── HERO ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #2d4a3e 0%, #1a3a2e 40%, #3a5a4e 100%)', minHeight: 280 }}
        >
          <div className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110" style={{ backgroundImage: `url(${book.cover})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20" />

          <div className="relative max-w-[1200px] mx-auto px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-sm text-white/60 mb-6">
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Trang chủ</button>
              <ChevronRight size={13} />
              <button onClick={() => onNavigate(book.type)} className="hover:text-white transition-colors">{conf.label}</button>
              <ChevronRight size={13} />
              <span className="text-white/90 font-medium truncate max-w-[300px]">Chi tiết {conf.label.toLowerCase()}</span>
            </div>

            <div className="flex gap-8 items-start">
              {/* Cover — landscape cho album, portrait cho sách */}
              {isAlbum ? (
                <div className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20" style={{ aspectRatio: '4/3' }}>
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-44 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20" style={{ aspectRatio: '3/4' }}>
                  <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0 text-white pt-1">
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">{book.title}</h1>
                <div className="flex items-center gap-4 text-sm text-white/70 mb-4 flex-wrap">
                  <span className="flex items-center gap-1.5"><Eye size={14} /> {book.views.toLocaleString()} lượt xem</span>
                  <span className="flex items-center gap-1.5"><Heart size={14} /> {liked ? book.likes + 1 : book.likes} lượt yêu thích</span>
                  {isAlbum && (
                    <span className="flex items-center gap-1.5"><Camera size={14} /> {book.photoCount || book.photos?.length || 0} ảnh</span>
                  )}
                </div>
                <div className="space-y-2 mb-5 text-sm">
                  {book.publisher && (
                    <div className="flex items-center gap-2 text-white/80">
                      <span className="text-lg">⊞</span>
                      <span>{isAlbum ? 'Đơn vị thực hiện' : 'Nhà xuất bản'}: <span className="text-white font-medium">{book.publisher}</span></span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-white/80">
                    <span className="text-lg mt-0.5">👤</span>
                    <span>{isAlbum ? 'Thực hiện' : 'Tác giả'}: <span className="text-white font-medium">{book.author}</span></span>
                  </div>
                  {book.duration && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock size={15} />
                      <span>Thời lượng: <span className="text-white font-medium">{book.duration}</span></span>
                    </div>
                  )}
                  {book.pages && !isAlbum && (
                    <div className="flex items-center gap-2 text-white/80">
                      <FileText size={15} />
                      <span>Số trang: <span className="text-white font-medium">{book.pages} trang</span></span>
                    </div>
                  )}
                  {isAlbum && (
                    <div className="flex items-center gap-2 text-white/80">
                      <Grid3X3 size={15} />
                      <span>Danh mục: <span className="text-white font-medium">{book.category}</span></span>
                    </div>
                  )}
                </div>
                {renderCTA()}
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ────────────────────────────────────── */}

        {/* ═══ ALBUM GALLERY ═══════════════════════════════ */}
        {isAlbum && (
          <div id="album-gallery" className="max-w-[1200px] mx-auto px-8 py-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Camera size={20} className="text-teal-500" />
                <span className="text-teal-600">{book.photos?.length || 0}</span> ảnh trong album
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-sm font-semibold border border-teal-200 transition-colors">
                <Download size={14} /> Tải về
              </button>
            </div>

            {book.photos && book.photos.length > 0 && (
              <>
                {/* Featured + side (first 3 photos) */}
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {/* Big featured */}
                  <div
                    className="col-span-2 relative cursor-pointer group overflow-hidden rounded-xl"
                    style={{ aspectRatio: '4/3' }}
                    onClick={() => setLightboxIdx(0)}
                  >
                    <img
                      src={book.photos[0].url}
                      alt={book.photos[0].caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {book.photos[0].isCover && (
                      <div className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">⭐ Ảnh bìa</div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-white text-sm font-medium">{book.photos[0].caption}</p>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-lg">Nhấn để xem</div>
                    </div>
                  </div>

                  {/* Side column: photos 2 & 3 */}
                  <div className="flex flex-col gap-3">
                    {book.photos.slice(1, 3).map((photo, i) => (
                      <div
                        key={photo.id}
                        className="relative cursor-pointer group overflow-hidden rounded-xl flex-1"
                        style={{ aspectRatio: '4/3' }}
                        onClick={() => setLightboxIdx(i + 1)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <p className="text-white text-xs font-medium line-clamp-1">{photo.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rest of photos: 3-col uniform grid */}
                {book.photos.length > 3 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {book.photos.slice(3).map((photo, i) => (
                      <div
                        key={photo.id}
                        className="relative cursor-pointer group overflow-hidden rounded-xl"
                        style={{ aspectRatio: '4/3' }}
                        onClick={() => setLightboxIdx(i + 3)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/65 to-transparent translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <p className="text-white text-xs font-medium line-clamp-1">{photo.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Album description + metadata */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-3">Giới thiệu album</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
                <div className="mt-4 flex gap-6 text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1.5"><Eye size={14} /> {book.views.toLocaleString()} lượt xem</span>
                  <span className="flex items-center gap-1.5"><Heart size={14} /> {book.likes.toLocaleString()} lượt thích</span>
                  <span className="flex items-center gap-1.5"><Camera size={14} /> {book.photos?.length || 0} ảnh</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Thông tin album</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Danh mục', value: book.category },
                    { label: 'Năm', value: String(book.year) },
                    { label: 'Thực hiện', value: book.author },
                    { label: 'Số ảnh', value: `${book.photos?.length || 0} ảnh` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</span>
                      <span className="text-sm text-gray-800 font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews section for album */}
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                Đánh giá
                {reviews.length > 0 && (
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full">{reviews.length}</span>
                )}
              </h3>
              <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4">
                <p className="text-sm font-semibold mb-3">Viết nhận xét của bạn</p>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(star => (
                    <button key={star} onClick={() => setReviewRating(star)} className={`text-2xl transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}>★</button>
                  ))}
                </div>
                <textarea rows={3} placeholder="Chia sẻ cảm nhận của bạn về album ảnh này..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-400 resize-none" />
                <button className="mt-3 px-5 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-sm font-semibold">Gửi nhận xét</button>
              </div>
              {reviews.map(r => (
                <div key={r.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{r.userName[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-semibold text-sm">{r.userName}</span>
                        <span className="text-xs text-gray-400 ml-2">{r.userClass}</span>
                      </div>
                      <span className="text-xs text-gray-400">{r.date}</span>
                    </div>
                    <div className="text-sm mb-1">{renderStars(r.rating, 13)}</div>
                    <p className="text-sm text-gray-600">{r.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Related albums */}
            {BOOKS.filter(b => b.type === 'album' && b.id !== bookId).length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 mb-4">Album liên quan</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {BOOKS.filter(b => b.type === 'album' && b.id !== bookId).map(album => (
                    <div
                      key={album.id}
                      onClick={() => onNavigate('detail', album.id)}
                      className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm line-clamp-2 text-gray-900">{album.title}</p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Camera size={11} /> {album.photoCount || album.photos?.length || 0} ảnh</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ VIDEO LAYOUT ════════════════════════════════ */}
        {isVideoType && !isAlbum && (
          <div className="max-w-[1200px] mx-auto px-8 py-8">
            <div className="flex gap-6">
              {/* Left: player + info */}
              <div className="flex-1 min-w-0">
                {(showUrlInput || !embedUrl) && (
                  <div className="mb-4 p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <p className="text-sm font-bold text-gray-700 mb-2">🔗 Nhập URL video (YouTube hoặc link trực tiếp)</p>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={videoUrlInput}
                        onChange={e => setVideoUrlInput(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-green-400 transition-colors"
                      />
                      <button
                        onClick={() => { setVideoUrl(videoUrlInput); setShowUrlInput(false); }}
                        className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
                      >Áp dụng</button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Hỗ trợ: youtube.com/watch?v=, youtu.be/, hoặc URL video trực tiếp (.mp4)</p>
                  </div>
                )}

                <div className="relative w-full rounded-2xl overflow-hidden shadow-xl bg-black" style={{ aspectRatio: '16/9' }}>
                  {embedUrl ? (
                    embedUrl.includes('youtube.com/embed') ? (
                      <iframe
                        key={embedUrl}
                        src={embedUrl + '?rel=0&modestbranding=1'}
                        title={book.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <video controls className="w-full h-full" src={embedUrl}>Trình duyệt không hỗ trợ video.</video>
                    )
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white gap-4">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                      <p className="text-sm text-white/60">Chưa có URL video</p>
                      <button onClick={() => setShowUrlInput(true)} className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors">+ Thêm URL video</button>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5"><Eye size={14} /> {book.views.toLocaleString()} lượt xem</span>
                      <span>•</span>
                      <span>{book.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setLiked(l => !l)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-all
                          ${liked ? 'bg-red-50 border-red-300 text-red-500' : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'}`}
                      >
                        <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                        {liked ? book.likes + 1 : book.likes} lượt thích
                      </button>
                      {embedUrl && (
                        <button
                          onClick={() => setShowUrlInput(v => !v)}
                          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border-2 border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                        >🔗 Đổi URL</button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{book.author[0]}</div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{book.author}</p>
                        <p className="text-xs text-gray-400">{book.publisher} · {book.videoSource || 'Thư viện'}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
                  </div>

                  {book.timestamps && book.timestamps.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-gray-700 mb-2">Nội dung video</h3>
                      <div className="space-y-1">
                        {book.timestamps.map((ts, i) => (
                          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 cursor-pointer group transition-colors">
                            <span className="text-xs font-mono font-bold text-green-600 min-w-[40px]">{ts.time}</span>
                            <span className="text-sm text-gray-600 group-hover:text-green-700">{ts.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: related */}
              <div className="w-72 flex-shrink-0 hidden lg:block">
                <h3 className="font-bold text-gray-800 mb-3 text-sm">Xem nhiều</h3>
                <div className="space-y-3">
                  {BOOKS.filter(b => b.id !== bookId && (b.type === 'video' || b.type === 'bai-giang')).map(rb => (
                    <div key={rb.id} onClick={() => onNavigate('detail', rb.id)}
                      className="flex gap-3 cursor-pointer group hover:bg-gray-50 p-2 rounded-xl transition-colors border border-transparent hover:border-gray-100">
                      <div className="relative w-28 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900" style={{ aspectRatio: '16/9' }}>
                        <img src={rb.cover} alt={rb.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 bg-black/60 rounded-full flex items-center justify-center">
                            <Play size={12} className="text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-green-700">{rb.title}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{rb.publisher}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                          <span className="flex items-center gap-0.5"><Eye size={10} /> {rb.views.toLocaleString()}</span>
                          <span className="flex items-center gap-0.5"><Heart size={10} /> {rb.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STANDARD BOOK LAYOUT (tabs) ════════════════ */}
        {!isAlbum && !isVideoType && (
          <div className="max-w-[1200px] mx-auto px-8 py-8">
            <div className="flex gap-8">
              {/* Main */}
              <div className="flex-1 min-w-0">
                {/* Tabs */}
                <div className="flex border-b-2 border-gray-200 mb-6">
                  {[
                    { id: 'mo-ta',    label: 'Giới thiệu sách' },
                    { id: 'muc-luc', label: 'Mục lục' },
                    { id: 'danh-gia', label: 'Đánh giá', count: book.ratingCount },
                    { id: 'lien-quan', label: 'Tài liệu liên quan' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-5 py-3 text-sm font-semibold border-b-2 -mb-0.5 transition-all
                        ${activeTab === tab.id ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab.label}
                      {tab.count && <span className="ml-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">{tab.count}</span>}
                    </button>
                  ))}
                </div>

                <div className="animate-fade-in">
                  {/* Tab: Giới thiệu */}
                  {activeTab === 'mo-ta' && (
                    <div className="max-w-3xl">
                      <h1 className="text-2xl font-black text-gray-900 uppercase mb-3 tracking-wide">GIỚI THIỆU SÁCH</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6 pb-4 border-b border-gray-100">
                        <span>23/02/2024</span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">Q</span>
                          Quản trị nhà trường
                        </span>
                        <span className="flex items-center gap-1.5"><Eye size={13} /> {book.views.toLocaleString()} lượt xem</span>
                      </div>

                      {/* Tệp đính kèm */}
                      <div className="mb-6">
                        <h3 className="text-sm font-bold text-gray-700 mb-3">Tệp đính kèm</h3>
                        <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer group w-fit">
                          <div className="w-12 h-14 bg-[#2B579A] rounded-lg flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                            <span className="text-white font-black text-lg leading-none">W</span>
                            <span className="text-[9px] text-blue-200 font-medium mt-0.5">docx</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-blue-800 line-clamp-1 group-hover:text-blue-900">GTS-{book.year}-{book.id}-gioithieusach.docx</p>
                            <p className="text-xs text-blue-500 mt-0.5">Microsoft Word Document · 245 KB</p>
                          </div>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-200 hover:bg-blue-300 text-blue-700 transition-colors flex-shrink-0">
                            <FileText size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
                        <div className="space-y-4 text-[15px] text-gray-700 leading-[1.85]">
                          <p className="text-justify">{book.description}</p>
                          <p className="text-justify">
                            Tác phẩm <em className="font-semibold text-gray-900">&ldquo;{book.title}&rdquo;</em> của tác giả{' '}
                            <strong className="text-green-700">{book.author}</strong> là một trong những tài liệu được học sinh và giáo viên
                            Trường THCS Dịch Vọng đánh giá cao nhất. Được xuất bản bởi <span className="font-medium">{book.publisher}</span> năm {book.year}, cuốn sách mang đến
                            góc nhìn sâu sắc và toàn diện về {book.category.toLowerCase()}.
                          </p>
                          <p className="text-justify">
                            Cuốn sách được viết với ngôn ngữ trong sáng, dễ hiểu, phù hợp với lứa tuổi học sinh trung học cơ sở.
                            Nội dung được sắp xếp theo trình tự logic, từ những khái niệm cơ bản đến những vấn đề phức tạp hơn,
                            giúp người đọc dễ dàng tiếp thu và vận dụng kiến thức vào thực tiễn.
                          </p>
                          {book.tableOfContents && (
                            <div className="mt-5 p-4 bg-green-50 border border-green-100 rounded-xl">
                              <p className="font-bold text-green-800 text-sm mb-3">📋 Nội dung chính của sách:</p>
                              <ul className="space-y-1.5">
                                {book.tableOfContents.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                                    <span className="w-5 h-5 bg-green-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          <p className="text-justify">
                            Đây là tài liệu không thể thiếu trong chương trình học tập của học sinh THCS. Thư viện nhà trường khuyến khích
                            tất cả học sinh tham khảo và sử dụng tài liệu này để nâng cao kiến thức và kết quả học tập.
                          </p>
                        </div>

                        <div className="mt-6 pt-5 border-t border-gray-100">
                          <h4 className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-3">Thông tin xuất bản</h4>
                          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                            {[
                              { label: 'Nhan đề',       value: book.title },
                              { label: 'Tác giả',       value: book.author },
                              { label: 'Nhà xuất bản',  value: book.publisher },
                              { label: 'Năm xuất bản',  value: String(book.year) },
                              { label: 'Thể loại',      value: book.category },
                              { label: 'Hình thức',     value: conf.label },
                              ...(book.pages    ? [{ label: 'Số trang',   value: `${book.pages} trang` }] : []),
                              ...(book.duration ? [{ label: 'Thời lượng', value: book.duration }] : []),
                            ].map(({ label, value }) => (
                              <div key={label} className="flex gap-2 text-sm py-1">
                                <span className="text-gray-400 min-w-[110px] font-medium">{label}:</span>
                                <span className="text-gray-800 font-medium">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Nút Đọc sách for ebook/bai-giang */}
                      {(book.type === 'sach-dien-tu' || book.type === 'bai-giang') && (
                        <div className="mt-5 p-5 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <p className="font-bold text-green-800">Đọc sách trực tuyến</p>
                            <p className="text-sm text-green-600 mt-0.5">Lật trang trực quan, hỗ trợ zoom và đánh dấu trang</p>
                          </div>
                          <button
                            onClick={() => setShowReader(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5 flex-shrink-0"
                          >
                            <BookOpen size={16} /> Mở trình đọc
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: Mục lục */}
                  {activeTab === 'muc-luc' && (
                    <div className="max-w-2xl">
                      {(book.tableOfContents || book.chapters?.map(c => c.title) || ['Chương 1', 'Chương 2']).map((item, i) => (
                        <div key={i}
                          className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-green-50 cursor-pointer transition-colors border-b border-gray-100 last:border-0 group"
                          onClick={() => book.type === 'sach-noi' && onPlayAudio(book)}
                        >
                          <span className="font-bold text-green-600 text-sm min-w-[28px]">{i + 1}</span>
                          <span className="flex-1 text-sm text-gray-700 group-hover:text-green-700">{item}</span>
                          {book.chapters?.[i] && <span className="text-xs text-gray-400">{book.chapters[i].duration}</span>}
                          {(book.type === 'sach-dien-tu' || book.type === 'bai-giang') && (
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowReader(true); }}
                              className="opacity-0 group-hover:opacity-100 text-xs text-green-600 font-semibold flex items-center gap-1 transition-opacity"
                            >
                              <BookOpen size={12} /> Đọc
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Đánh giá */}
                  {activeTab === 'danh-gia' && (
                    <div className="max-w-3xl">
                      <div className="flex gap-8 items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
                        <div className="text-center">
                          <div className="text-5xl font-black text-green-600">{book.rating}</div>
                          <div className="text-xl mt-1">{renderStars(book.rating, 18)}</div>
                          <div className="text-xs text-gray-400 mt-1">{book.ratingCount} đánh giá</div>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map(star => (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="text-gray-500 w-3">{star}</span>
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : 5}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-5">
                        <h4 className="font-bold text-sm mb-3">Viết đánh giá của bạn</h4>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map(star => (
                            <button key={star} onClick={() => setReviewRating(star)} className={`text-3xl transition-colors ${star <= reviewRating ? 'text-amber-400' : 'text-gray-200 hover:text-amber-300'}`}>★</button>
                          ))}
                        </div>
                        <textarea rows={3} placeholder="Chia sẻ cảm nhận của bạn..."
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-400 resize-none" />
                        <button className="mt-3 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold">Gửi đánh giá</button>
                      </div>
                      {reviews.map(r => (
                        <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-3">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">{r.userName[0]}</div>
                            <div>
                              <p className="font-semibold text-sm">{r.userName}</p>
                              <p className="text-xs text-gray-400">{r.userClass}</p>
                            </div>
                            <span className="ml-auto text-xs text-gray-400">{r.date}</span>
                          </div>
                          <div className="text-base mb-2">{renderStars(r.rating)}</div>
                          <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab: Tài liệu liên quan */}
                  {activeTab === 'lien-quan' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {BOOKS.filter(b => b.id !== bookId).map(rb => {
                        const rc = TYPE_CONFIG[rb.type];
                        return (
                          <div key={rb.id} onClick={() => onNavigate('detail', rb.id)}
                            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                            <div style={{ aspectRatio: rb.type === 'album' ? '4/3' : '3/4' }} className="overflow-hidden">
                              <img src={rb.cover} alt={rb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <div className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${rc.bg} ${rc.text}`}>{rc.label}</span>
                              <p className="font-bold text-[13px] mt-1.5 line-clamp-2">{rb.title}</p>
                              <p className="text-[11px] text-gray-400">{rb.author}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-64 flex-shrink-0 hidden lg:block">
                <h3 className="font-bold text-gray-800 mb-4 text-sm">Tài liệu liên quan</h3>
                <div className="space-y-3">
                  {relatedBooks.map(rb => {
                    const rc = TYPE_CONFIG[rb.type];
                    return (
                      <div key={rb.id} onClick={() => onNavigate('detail', rb.id)}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-green-50 cursor-pointer transition-colors group border border-transparent hover:border-green-100">
                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                          <img src={rb.cover} alt={rb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${rc.bg} ${rc.text}`}>{rc.label}</span>
                          <p className="text-[12px] font-semibold text-gray-800 line-clamp-2 leading-snug mt-1">{rb.title}</p>
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-500">★ {rb.rating}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button onClick={() => onNavigate(book.type)} className="block text-center text-sm text-green-600 font-medium mt-4 hover:text-green-700">
                  Xem tất cả →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
