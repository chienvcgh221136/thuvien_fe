import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen, Bell, Search, User, BookMarked,
  Monitor, Headphones, Video, Image, Leaf, Newspaper,
  Archive, X, LogOut, Settings, Menu, ChevronDown
} from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

/* ── Danh mục tài liệu cho mega menu ─────────────────────── */
const TAI_LIEU_CATEGORIES = [
  { id: 'khong-gian-van-hoa', label: 'Không gian văn hóa H...', icon: BookMarked, color: '#e53e3e' },
  { id: 'sach-giay',           label: 'Sách giấy',              icon: BookOpen,   color: '#38a169' },
  { id: 'sach-dien-tu',        label: 'Sách điện tử',           icon: Monitor,    color: '#e53e3e' },
  { id: 'sach-noi',            label: 'Sách nói',               icon: Headphones, color: '#d97706' },
  { id: 'bai-giang',           label: 'Bài giảng điện tử',      icon: Monitor,    color: '#3182ce' },
  { id: 'video',               label: 'Video',                  icon: Video,      color: '#805ad5' },
  { id: 'album',               label: 'Album ảnh',              icon: Image,      color: '#dd6b20' },
  { id: 'ky-nang',             label: 'Kỹ năng sống',           icon: Leaf,       color: '#319795' },
  { id: 'bao-tap-chi',         label: 'Báo, tạp chí',           icon: Newspaper,  color: '#38a169' },
];

const MEGA_IMAGE = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop';

/* ── MegaMenu Component ───────────────────────────────────── */
const MegaMenu: React.FC<{ onNavigate: (page: string) => void; onClose: () => void }> = ({ onNavigate, onClose }) => (
  <div
    className="absolute top-full left-1/2 -translate-x-1/2 mt-0 z-50 animate-fade-in"
    style={{ width: 700 }}
    onMouseLeave={onClose}
  >
    {/* Triangle arrow */}
    <div className="flex justify-center">
      <div className="w-3 h-3 bg-white rotate-45 border-l border-t border-gray-200 -mb-1.5 shadow-sm" />
    </div>

    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      <div className="flex">
        {/* Categories grid */}
        <div className="flex-1 p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Danh mục tài liệu</p>
          <div className="grid grid-cols-3 gap-1.5">
            {TAI_LIEU_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { onNavigate(cat.id); onClose(); }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group text-left w-full"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ background: cat.color + '18' }}
                  >
                    <Icon size={15} style={{ color: cat.color }} />
                  </div>
                  <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 leading-tight">{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">Tất cả tài liệu thư viện THCS Dịch Vọng</span>
            <button
              onClick={() => { onNavigate('sach-giay'); onClose(); }}
              className="text-xs font-semibold text-green-600 hover:text-green-700 flex items-center gap-1"
            >
              Xem tất cả →
            </button>
          </div>
        </div>

        {/* Image panel */}
        <div className="w-48 flex-shrink-0 relative overflow-hidden rounded-r-2xl">
          <img
            src={MEGA_IMAGE}
            alt="Thư viện"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-bold text-sm leading-tight">Khám phá kho tài liệu phong phú</p>
            <p className="text-white/70 text-xs mt-1">Hàng nghìn đầu sách & tài liệu</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Delayed close to prevent flicker when moving between button and dropdown
  const openMega = () => {
    if (megaTimerRef.current) clearTimeout(megaTimerRef.current);
    setShowMegaMenu(true);
  };
  const closeMega = () => {
    megaTimerRef.current = setTimeout(() => setShowMegaMenu(false), 100);
  };

  const mainNavItems = [
    { id: 'home',    label: 'Trang chủ',       hasMega: false },
    { id: 'tai-lieu', label: 'Tài liệu',        hasMega: true  },
    { id: 'gioi-thieu-sach', label: 'Giới thiệu sách', hasMega: false },
    { id: 'tin-tuc',  label: 'Tin tức',         hasMega: false },
    { id: 'profile',  label: 'Giới thiệu',      hasMega: false },
    { id: 'new',      label: 'Liên kết Website', hasMega: false },
  ];

  const isTaiLieuActive = [
    'sach-giay','sach-dien-tu','sach-noi','bai-giang','video','album',
    'ky-nang','bao-tap-chi','khong-gian-van-hoa','tai-lieu'
  ].includes(currentPage);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* Top bar */}
      <div className="bg-[#006633] h-[60px] flex items-center px-6 gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
            <BookOpen size={22} className="text-[#006633]" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] text-green-200 font-medium tracking-wide uppercase">THƯ VIỆN ĐIỆN TỬ</div>
            <div className="text-white font-bold text-sm leading-none">THCS DỊCH VỌNG</div>
          </div>
        </button>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-0.5 ml-6">
          {mainNavItems.map(item => {
            const isActive = item.id === 'tai-lieu'
              ? isTaiLieuActive
              : currentPage === item.id;

            if (item.hasMega) {
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={openMega}
                  onMouseLeave={closeMega}
                  ref={megaRef}
                >
                  <button
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md transition-all
                      ${isActive
                        ? 'text-white bg-white/20 border-b-2 border-yellow-400'
                        : 'text-green-100 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {item.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${showMegaMenu ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {showMegaMenu && (
                    <MegaMenu
                      onNavigate={onNavigate}
                      onClose={() => setShowMegaMenu(false)}
                    />
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all
                  ${isActive
                    ? 'text-white bg-white/20 border-b-2 border-yellow-400'
                    : 'text-green-100 hover:text-white hover:bg-white/10'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className={`hidden md:flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 transition-all duration-200
          ${searchFocused ? 'bg-white border-white w-64' : 'w-48'}`}>
          <Search size={14} className={searchFocused ? 'text-gray-400' : 'text-green-200'} />
          <input
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Tìm kiếm..."
            className={`bg-transparent outline-none text-sm flex-1 placeholder:text-green-200 ${searchFocused ? 'text-gray-700 placeholder:text-gray-400' : 'text-white'}`}
          />
          {searchVal && (
            <button onClick={() => setSearchVal('')}>
              <X size={13} className="text-gray-400" />
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-green-100 hover:bg-white/10 transition-colors">
            <Search size={18} className="md:hidden" />
            <Bell size={18} className="hidden md:block" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full border border-[#006633]" />
          </button>

          <div className="relative" ref={userRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white"
            >
              <User size={17} />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 top-11 bg-white border border-gray-200 rounded-xl shadow-xl w-52 py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">Học sinh</p>
                  <p className="text-xs text-gray-500">THCS Dịch Vọng</p>
                </div>
                {[
                  { icon: User,     label: 'Trang cá nhân',  page: 'profile' },
                  { icon: BookOpen, label: 'Sách đang mượn', page: 'profile' },
                  { icon: Settings, label: 'Cài đặt',        page: 'profile' },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { onNavigate(item.page); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors text-left"
                    >
                      <Icon size={15} />
                      {item.label}
                    </button>
                  );
                })}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors text-left">
                    <LogOut size={15} />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-green-100 hover:bg-white/10 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#005529] border-t border-green-700 px-4 pb-3 animate-fade-in">
          {mainNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id === 'tai-lieu' ? 'sach-giay' : item.id); setMobileOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-sm text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
          {/* Mobile: show categories */}
          <div className="mt-2 pt-2 border-t border-green-700">
            <p className="text-[11px] text-green-400 uppercase font-bold tracking-wider px-3 mb-1">Danh mục</p>
            <div className="grid grid-cols-2 gap-1">
              {TAI_LIEU_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { onNavigate(cat.id); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-green-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Icon size={13} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface FooterProps {}
export const Footer: React.FC<FooterProps> = () => (
  <footer className="bg-[#005A29] text-white pt-10 pb-6 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <BookOpen size={20} />
            THCS Dịch Vọng
          </div>
          <p className="text-sm text-green-200 leading-relaxed">
            Thư viện điện tử Trường THCS Dịch Vọng — nơi kết nối tri thức và học sinh.
          </p>
        </div>
        <div>
          <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-green-300">Danh mục</p>
          <div className="grid grid-cols-2 gap-1.5">
            {['Sách giấy', 'Sách điện tử', 'Sách nói', 'Bài giảng', 'Video', 'Tin tức'].map(l => (
              <span key={l} className="text-sm text-green-200 hover:text-white transition-colors cursor-pointer">{l}</span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm uppercase tracking-wider mb-3 text-green-300">Liên hệ</p>
          <div className="space-y-1.5">
            {['📍 Cầu Giấy, Hà Nội', '📞 024 3764 xxxx', '✉️ thuvien@thcsdichvong.edu.vn'].map(l => (
              <p key={l} className="text-sm text-green-200">{l}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-green-700 pt-4 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-green-300">© 2024 Trường THCS Dịch Vọng. Tất cả quyền được bảo lưu.</p>
        <div className="flex gap-4">
          {['Liên hệ', 'Giới thiệu', 'Quy định mượn trả', 'Trợ giúp'].map(l => (
            <a key={l} href="#" className="text-xs text-green-300 hover:text-white transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// Keep Sidebar export for compatibility
interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
}
export const Sidebar: React.FC<SidebarProps> = () => null;
