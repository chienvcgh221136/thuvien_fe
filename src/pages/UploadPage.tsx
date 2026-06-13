import React, { useState, useCallback, useRef } from 'react';
import {
  BookOpen, Monitor, Headphones, Video, Image, Upload, ChevronRight,
  Check, GripVertical, X, Plus, Trash2, Star, ArrowUp, ArrowDown,
  Camera, FolderOpen, AlertCircle,
} from 'lucide-react';

type DocType = 'sach-giay' | 'sach-dien-tu' | 'sach-noi' | 'bai-giang' | 'video' | 'album';

const DOC_TYPES: { id: DocType; icon: React.ReactNode; label: string; color: string }[] = [
  { id: 'sach-giay',    icon: <BookOpen size={22} />,  label: 'Sách Giấy',    color: 'text-green-600' },
  { id: 'sach-dien-tu', icon: <Monitor size={22} />,   label: 'Sách Điện Tử', color: 'text-blue-600' },
  { id: 'sach-noi',     icon: <Headphones size={22} />, label: 'Sách Nói',    color: 'text-orange-600' },
  { id: 'video',        icon: <Video size={22} />,      label: 'Video',        color: 'text-red-600' },
  { id: 'album',        icon: <Image size={22} />,      label: 'Album Ảnh',   color: 'text-teal-600' },
];

interface Chapter   { id: string; name: string; duration: string; }
interface Timestamp { id: string; time: string; label: string; }
interface AlbumPhoto {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
  isCover: boolean;
}

/* ─── helpers ─── */
const uid = () => Math.random().toString(36).slice(2, 9);

export const UploadPage: React.FC = () => {
  const [step, setStep]           = useState(1);
  const [docType, setDocType]     = useState<DocType>('sach-giay');
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [urlMode, setUrlMode]     = useState<'file' | 'url'>('url');
  const [urlInput, setUrlInput]   = useState('');
  const [showUrlPreview, setShowUrlPreview] = useState(false);
  const [published, setPublished] = useState(true);
  const [success, setSuccess]     = useState(false);

  /* chapters / timestamps */
  const [chapters, setChapters] = useState<Chapter[]>([
    { id: '1', name: 'Chương 1: Tôi sống độc lập từ thuở bé', duration: '15:30' },
    { id: '2', name: 'Chương 2: Cuộc phiêu lưu đầu tiên',     duration: '22:14' },
    { id: '3', name: 'Chương 3: Gặp Dế Trũi',                 duration: '18:47' },
  ]);
  const [timestamps, setTimestamps] = useState<Timestamp[]>([
    { id: '1', time: '00:00', label: 'Giới thiệu chủ đề' },
    { id: '2', time: '08:30', label: 'Phương pháp thế' },
    { id: '3', time: '22:15', label: 'Phương pháp cộng đại số' },
  ]);

  /* album photos */
  const [photos, setPhotos]       = useState<AlbumPhoto[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  /* ── chapter helpers ── */
  const addChapter    = () => setChapters(c => [...c, { id: uid(), name: `Chương ${c.length + 1}`, duration: '00:00' }]);
  const removeChapter = (id: string) => setChapters(c => c.filter(ch => ch.id !== id));

  /* ── timestamp helpers ── */
  const addTimestamp    = () => setTimestamps(t => [...t, { id: uid(), time: '00:00', label: '' }]);
  const removeTimestamp = (id: string) => setTimestamps(t => t.filter(ts => ts.id !== id));

  /* ── album helpers ── */
  const addPhotos = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;
    setPhotos(prev => {
      const next: AlbumPhoto[] = arr.map((f, i) => ({
        id: uid(),
        file: f,
        previewUrl: URL.createObjectURL(f),
        caption: '',
        isCover: prev.length === 0 && i === 0, // first ever photo becomes cover
      }));
      return [...prev, ...next];
    });
  }, []);

  const removePhoto = (id: string) =>
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== id);
      // if we removed the cover, auto-assign next
      if (prev.find(p => p.id === id)?.isCover && filtered.length > 0) {
        filtered[0] = { ...filtered[0], isCover: true };
      }
      return filtered;
    });

  const setCover = (id: string) =>
    setPhotos(prev => prev.map(p => ({ ...p, isCover: p.id === id })));

  const movePhoto = (id: string, dir: 'up' | 'down') =>
    setPhotos(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const swap = dir === 'up' ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });

  const updateCaption = (id: string, caption: string) =>
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption } : p));

  /* drag-and-drop on drop zone */
  const handleDropZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addPhotos(e.dataTransfer.files);
  };

  const steps = ['Thông tin cơ bản', 'Tải file lên', 'Xuất bản'];

  /* ── success screen ── */
  if (success) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 text-5xl">✅</div>
        <h2 className="text-3xl font-black text-gray-900 mb-3">Đăng tải thành công!</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">
          Tài liệu của bạn đã được đăng tải và sẽ xuất hiện trong thư viện ngay bây giờ.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => { setSuccess(false); setStep(1); setPhotos([]); }}
            className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-green-400 hover:text-green-600 transition-all"
          >
            Thêm tài liệu mới
          </button>
          <button className="px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors">
            Xem tài liệu →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Tải tài liệu mới</h1>

      {/* Stepper */}
      <div className="flex items-center mb-8 px-4">
        {steps.map((s, i) => {
          const stepNum = i + 1;
          const done   = stepNum < step;
          const active = stepNum === step;
          return (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all
                  ${done ? 'bg-green-100 border-green-500 text-green-700' : active ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {done ? <Check size={16} /> : stepNum}
                </div>
                <span className={`text-xs font-semibold mt-1.5 whitespace-nowrap ${active ? 'text-green-600' : done ? 'text-green-500' : 'text-gray-400'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 transition-colors ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Step 1: Basic Info ── */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 animate-fade-in">
          <h2 className="text-xl font-bold mb-6">1. Thông tin cơ bản</h2>

          {/* Doc type selector */}
          <div className="mb-7">
            <label className="block text-sm font-bold text-gray-700 mb-3">Loại tài liệu</label>
            <div className="flex gap-3 flex-wrap">
              {DOC_TYPES.map(dt => (
                <button
                  key={dt.id}
                  onClick={() => setDocType(dt.id)}
                  className={`flex-1 min-w-[110px] max-w-[150px] border-2 rounded-xl py-4 px-3 flex flex-col items-center gap-2 transition-all
                    ${docType === dt.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/50'}`}
                >
                  <span className={docType === dt.id ? dt.color : 'text-gray-400'}>{dt.icon}</span>
                  <span className={`text-xs font-semibold text-center ${docType === dt.id ? 'text-green-700' : 'text-gray-600'}`}>{dt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Album: only title + description needed in step 1 */}
          {docType === 'album' ? (
            <div className="space-y-4">
              {/* Thumbnail upload */}
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh bìa album</label>
                  <label className="block">
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setCoverPreview(URL.createObjectURL(f));
                    }} />
                    {coverPreview ? (
                      <div className="relative border-2 border-teal-400 rounded-xl overflow-hidden cursor-pointer group" style={{ aspectRatio: '4/3', maxHeight: '200px' }}>
                        <img src={coverPreview} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <p className="text-white text-sm font-semibold">Thay đổi ảnh</p>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all" style={{ aspectRatio: '4/3', maxHeight: '200px' }}>
                        <Camera size={28} className="text-teal-400" />
                        <p className="text-sm text-gray-500 text-center px-4">Ảnh đại diện album</p>
                        <p className="text-xs text-gray-400">JPG, PNG (Tối đa 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">
                      Tên album <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Ngày hội đọc sách 2024..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Danh mục</label>
                    <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 transition-colors appearance-none bg-white">
                      <option value="">Chọn danh mục...</option>
                      {['Hoạt động thư viện', 'Ngày hội sách', 'Hội thảo', 'Ngoại khoá', 'Tốt nghiệp', 'Khai giảng', 'Khác'].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả</label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả ngắn về album ảnh..."
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-teal-400 resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Normal doc: cover + fields */
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ảnh bìa</label>
                <label className="block">
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) setCoverPreview(URL.createObjectURL(f));
                  }} />
                  {coverPreview ? (
                    <div className="relative border-2 border-green-400 rounded-xl overflow-hidden cursor-pointer group" style={{ aspectRatio: '3/4', maxHeight: '220px' }}>
                      <img src={coverPreview} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-sm font-semibold">Thay đổi ảnh</p>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-green-400 hover:bg-green-50 transition-all" style={{ aspectRatio: '3/4', maxHeight: '220px' }}>
                      <Upload size={28} className="text-green-400" />
                      <p className="text-sm text-gray-500 text-center px-4">Kéo thả ảnh vào đây hoặc click để chọn file</p>
                      <p className="text-xs text-gray-400">JPG, PNG (Tối đa 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Tên tài liệu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề tài liệu..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Tác giả</label>
                    <input type="text" placeholder="Tên tác giả" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Danh mục</label>
                    <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-colors appearance-none bg-white">
                      <option value="">Chọn danh mục...</option>
                      {['Toán học', 'Ngữ văn', 'Ngoại ngữ', 'Khoa học', 'Lịch sử', 'Kỹ năng sống'].map(o => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Mô tả tóm tắt</label>
                  <textarea
                    rows={4}
                    placeholder="Nhập tóm tắt nội dung..."
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 resize-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-7 pt-5 border-t border-gray-100">
            <button className="px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">Hủy bỏ</button>
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Tiếp tục <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Upload ── */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 animate-fade-in">
          <h2 className="text-xl font-bold mb-6">2. Tải file lên</h2>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━ ALBUM ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {docType === 'album' && (
            <div>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDropZoneDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all mb-6
                  ${dragOver ? 'border-teal-400 bg-teal-50 scale-[1.01]' : 'border-gray-300 hover:border-teal-400 hover:bg-teal-50/50'}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && addPhotos(e.target.files)}
                />
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? 'bg-teal-100' : 'bg-gray-100'}`}>
                  <FolderOpen size={32} className={dragOver ? 'text-teal-500' : 'text-gray-400'} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {dragOver ? 'Thả ảnh vào đây!' : 'Kéo & thả ảnh vào đây'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">hoặc <span className="text-teal-600 font-semibold">click để chọn ảnh</span></p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP • Có thể chọn nhiều ảnh cùng lúc</p>
                </div>
              </div>

              {/* Photo count badge */}
              {photos.length > 0 && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-bold">
                      <Image size={14} />
                      {photos.length} ảnh đã chọn
                    </span>
                    <span className="text-xs text-gray-400">• Nhấn ⭐ để đặt ảnh bìa</span>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    <Plus size={14} /> Thêm ảnh
                  </button>
                </div>
              )}

              {/* Photo grid */}
              {photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-2">
                  {photos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className={`relative group rounded-xl overflow-hidden border-2 transition-all
                        ${photo.isCover ? 'border-teal-400 shadow-md shadow-teal-100' : 'border-gray-200 hover:border-teal-300'}`}
                    >
                      {/* Image */}
                      <div className="aspect-[4/3] bg-gray-100">
                        <img
                          src={photo.previewUrl}
                          alt={photo.caption || `Ảnh ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Cover badge */}
                      {photo.isCover && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-teal-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                          <Star size={9} fill="white" /> ẢNH BÌA
                        </div>
                      )}

                      {/* Index */}
                      <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>

                      {/* Hover actions overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                        <div className="flex items-center gap-1 justify-between">
                          <div className="flex gap-1">
                            {/* Set cover */}
                            {!photo.isCover && (
                              <button
                                onClick={() => setCover(photo.id)}
                                title="Đặt làm ảnh bìa"
                                className="w-7 h-7 bg-teal-500 hover:bg-teal-600 text-white rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Star size={12} />
                              </button>
                            )}
                            {/* Move up */}
                            {idx > 0 && (
                              <button
                                onClick={() => movePhoto(photo.id, 'up')}
                                title="Lên trên"
                                className="w-7 h-7 bg-white/20 hover:bg-white/40 text-white rounded-lg flex items-center justify-center transition-colors"
                              >
                                <ArrowUp size={12} />
                              </button>
                            )}
                            {/* Move down */}
                            {idx < photos.length - 1 && (
                              <button
                                onClick={() => movePhoto(photo.id, 'down')}
                                title="Xuống dưới"
                                className="w-7 h-7 bg-white/20 hover:bg-white/40 text-white rounded-lg flex items-center justify-center transition-colors"
                              >
                                <ArrowDown size={12} />
                              </button>
                            )}
                          </div>
                          {/* Delete */}
                          <button
                            onClick={() => removePhoto(photo.id)}
                            title="Xóa ảnh"
                            className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                        {/* Caption input */}
                        <input
                          type="text"
                          value={photo.caption}
                          onChange={e => updateCaption(photo.id, e.target.value)}
                          placeholder="Chú thích ảnh..."
                          className="w-full bg-black/40 text-white placeholder-white/60 text-[11px] px-2 py-1 rounded-md outline-none border border-white/20 focus:border-white/60 transition-colors"
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add more tile */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-200 hover:border-teal-400 hover:bg-teal-50 flex flex-col items-center justify-center gap-2 transition-all text-gray-400 hover:text-teal-500"
                  >
                    <Plus size={24} />
                    <span className="text-xs font-semibold">Thêm ảnh</span>
                  </button>
                </div>
              )}

              {/* Empty state tip */}
              {photos.length === 0 && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span>Chưa có ảnh nào được chọn. Kéo thả hoặc click vào vùng trên để thêm ảnh vào album.</span>
                </div>
              )}
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ PDF ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {(docType === 'sach-dien-tu' || docType === 'bai-giang') && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Tải lên file PDF</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center gap-3 hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
                <Upload size={40} className="text-green-400" />
                <p className="text-sm font-semibold text-gray-600">Kéo thả file PDF vào đây hoặc click để chọn</p>
                <p className="text-xs text-gray-400">Tối đa 50MB • PDF</p>
              </div>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ AUDIO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {docType === 'sach-noi' && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Tải lên file âm thanh theo chương</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center gap-2 hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer mb-5">
                <Upload size={32} className="text-green-400" />
                <p className="text-sm text-gray-500">Kéo thả file MP3/WAV vào đây (chọn nhiều file)</p>
                <p className="text-xs text-gray-400">Tối đa 100MB mỗi file</p>
              </div>
              <div className="space-y-2 mb-3">
                {chapters.map(ch => (
                  <div key={ch.id} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                    <GripVertical size={16} className="text-gray-300 cursor-grab" />
                    <Headphones size={15} className="text-green-500 shrink-0" />
                    <span className="flex-1 text-sm font-medium text-gray-700 truncate">{ch.name}</span>
                    <span className="text-xs text-gray-400 font-mono shrink-0">{ch.duration}</span>
                    <button onClick={() => removeChapter(ch.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addChapter} className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                <Plus size={16} /> Thêm chương
              </button>
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━ VIDEO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {docType === 'video' && (
            <div>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
                {(['file', 'url'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setUrlMode(mode)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                      ${urlMode === mode ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {mode === 'file' ? '📂 Tải file lên' : '🔗 Nhúng từ URL'}
                  </button>
                ))}
              </div>

              {urlMode === 'file' && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center gap-3 hover:border-green-400 hover:bg-green-50/50 transition-all cursor-pointer">
                  <Video size={40} className="text-green-400" />
                  <p className="text-sm font-semibold text-gray-600">Tải lên file MP4/WebM</p>
                  <p className="text-xs text-gray-400">Tối đa 500MB</p>
                </div>
              )}

              {urlMode === 'url' && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Dán link YouTube / Google Drive / Vimeo</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-colors"
                    />
                    <button
                      onClick={() => setShowUrlPreview(true)}
                      className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors shrink-0"
                    >
                      Lấy thông tin
                    </button>
                  </div>

                  {showUrlPreview && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-4 items-center mb-5">
                      <div className="w-24 h-14 bg-gray-800 rounded-lg flex-shrink-0 flex items-center justify-center text-white">
                        <Video size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm">Vật Lý 8: Chuyển Động Cơ Học</p>
                        <p className="text-xs text-gray-500 mt-0.5">YouTube • 48:30 • Nguyễn Việt Kinh</p>
                      </div>
                    </div>
                  )}

                  <label className="block text-sm font-bold text-gray-700 mb-3">Mốc thời gian (Chapters)</label>
                  <div className="space-y-2 mb-3">
                    {timestamps.map(ts => (
                      <div key={ts.id} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={ts.time}
                          onChange={e => setTimestamps(t => t.map(x => x.id === ts.id ? { ...x, time: e.target.value } : x))}
                          className="w-20 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-green-400 transition-colors"
                          placeholder="00:00"
                        />
                        <input
                          type="text"
                          value={ts.label}
                          onChange={e => setTimestamps(t => t.map(x => x.id === ts.id ? { ...x, label: e.target.value } : x))}
                          className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400 transition-colors"
                          placeholder="Tên chương..."
                        />
                        <button onClick={() => removeTimestamp(ts.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={addTimestamp} className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
                    <Plus size={16} /> Thêm mốc thời gian
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━ SÁCH GIẤY ━━━━━━━━━━━━━━━━━━━━━━━━ */}
          {docType === 'sach-giay' && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Số lượng', placeholder: '10' },
                { label: 'Vị trí kệ sách', placeholder: 'Kho A, Kệ 2' },
                { label: 'Tình trạng', placeholder: 'Tốt' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
                  <input type="text" placeholder={f.placeholder} className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-green-400 transition-colors" />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between gap-3 mt-8 pt-5 border-t border-gray-100">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
              ← Quay lại
            </button>
            <button onClick={() => setStep(3)} className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors">
              Tiếp tục <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Publish ── */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 animate-fade-in">
          <h2 className="text-xl font-bold mb-6">3. Xuất bản</h2>

          {/* Preview card */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 flex gap-5 border border-gray-100">
            {docType === 'album' ? (
              /* Album preview */
              <div className="flex gap-4 w-full">
                <div className="w-28 h-20 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-gray-200">
                  {coverPreview
                    ? <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                    : photos[0]
                    ? <img src={photos[0].previewUrl} alt="cover" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Image size={28} className="text-gray-400" /></div>
                  }
                </div>
                <div className="flex-1">
                  <span className="inline-flex px-2.5 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded-full mb-2">Album Ảnh</span>
                  <h3 className="font-bold text-base mb-1">Tên album đã nhập</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                    <Image size={13} /> {photos.length} ảnh
                  </p>
                </div>
                {/* Mini photo strip */}
                {photos.length > 0 && (
                  <div className="flex gap-1.5 items-center">
                    {photos.slice(0, 4).map((p, i) => (
                      <div key={p.id} className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={p.previewUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    {photos.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                        +{photos.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Normal doc preview */
              <>
                <div className="w-24 rounded-xl overflow-hidden shadow-md flex-shrink-0" style={{ aspectRatio: '3/4' }}>
                  {coverPreview
                    ? <img src={coverPreview} alt="preview" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
                        <BookOpen size={30} className="text-white" />
                      </div>
                  }
                </div>
                <div>
                  <span className="inline-flex px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full mb-2">
                    {DOC_TYPES.find(d => d.id === docType)?.label}
                  </span>
                  <h3 className="font-bold text-base mb-1">Tên tài liệu đã nhập</h3>
                  <p className="text-sm text-gray-500">Tác giả đã nhập</p>
                  <p className="text-xs text-gray-400 mt-2">Mô tả tóm tắt sẽ hiển thị tại đây...</p>
                </div>
              </>
            )}
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
            <div className="flex-1">
              <p className="font-semibold text-sm">Trạng thái xuất bản</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {published ? 'Tài liệu sẽ được hiển thị ngay sau khi đăng tải' : 'Tài liệu sẽ được lưu vào nháp'}
              </p>
            </div>
            <div className="flex gap-2">
              {[true, false].map(val => (
                <button
                  key={String(val)}
                  onClick={() => setPublished(val)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all
                    ${published === val ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                  {val ? '🚀 Xuất bản ngay' : '📝 Lưu nháp'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-3 pt-5 border-t border-gray-100">
            <button onClick={() => setStep(2)} className="flex items-center gap-2 px-6 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
              ← Quay lại
            </button>
            <button
              onClick={() => setSuccess(true)}
              className="flex items-center gap-2 px-8 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all hover:shadow-lg hover:shadow-green-200 hover:-translate-y-0.5"
            >
              🚀 {published ? 'Xuất bản' : 'Lưu nháp'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
