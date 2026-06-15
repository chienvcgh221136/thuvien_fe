import React, { useState } from 'react';
import { User, LogOut, ChevronRight, Eye, Heart } from 'lucide-react';
import { BOOKS, TYPE_CONFIG } from '../data/mockData';

interface ProfilePageProps {
  onNavigate: (page: string, bookId?: string) => void;
}

const CATEGORIES = [
  'Không gian văn hóa Hồ Chí Minh',
  'Sách giấy',
  'Sách điện tử',
  'Sách nói',
  'Bài giảng điện tử',
  'Video',
  'Album ảnh',
  'Kỹ năng sống'
];

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const [activeMenu, setActiveMenu] = useState('tu-sach');
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeFilter, setActiveFilter] = useState<'dang-doc' | 'yeu-thich'>('yeu-thich'); 

  
  
  const displayBooks = BOOKS.slice(0, 4); 

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8 py-8 flex flex-col lg:flex-row gap-6">
        
        
        <div className="w-full lg:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center py-8">
            
            <div className="w-24 h-24 bg-gray-300 text-white rounded-full flex items-center justify-center text-3xl font-medium mb-4 shadow-inner">
              A
            </div>
            
            <h2 className="text-xl font-medium text-gray-800 mb-1">Bùi Ngân An</h2>
            <p className="text-sm text-gray-500 mb-8">Học sinh</p>

            <div className="w-full px-4 space-y-1">
              <button 
                onClick={() => setActiveMenu('quan-ly')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeMenu === 'quan-ly' ? 'bg-[#008844] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <User size={18} />
                Quản lý thông tin
              </button>
              
              <button 
                onClick={() => setActiveMenu('tu-sach')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeMenu === 'tu-sach' ? 'bg-[#008844] text-white' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-4 bg-current rounded-sm"></div>
                  <div className="w-1.5 h-4 bg-current rounded-sm opacity-80"></div>
                  <div className="w-1.5 h-4 bg-current rounded-sm opacity-60"></div>
                </div>
                Tủ sách
              </button>

              <button 
                onClick={() => {}}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50 mt-4 border-t border-gray-100`}
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[600px]">
            
            {activeMenu === 'tu-sach' && (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-6">Danh sách tài liệu</h1>

                
                <div className="relative border-b border-gray-200 mb-6">
                  <div className="flex overflow-x-auto scrollbar-hide pr-8 gap-6">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap pb-3 text-sm font-medium transition-all border-b-2
                          ${activeCategory === cat ? 'border-[#008844] text-[#008844]' : 'border-transparent text-gray-600 hover:text-[#008844]'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent flex items-center justify-end pointer-events-none">
                    <ChevronRight size={16} className="text-gray-400" />
                  </div>
                </div>

                
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={() => setActiveFilter('dang-doc')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors border
                      ${activeFilter === 'dang-doc' ? 'bg-[#008844] border-[#008844] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#008844] hover:text-[#008844]'}`}
                  >
                    Đang đọc
                  </button>
                  <button
                    onClick={() => setActiveFilter('yeu-thich')}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-colors border
                      ${activeFilter === 'yeu-thich' ? 'bg-[#008844] border-[#008844] text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-[#008844] hover:text-[#008844]'}`}
                  >
                    Yêu thích
                  </button>
                </div>

                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
                  {displayBooks.map(book => {
                    const conf = TYPE_CONFIG[book.type];
                    return (
                      <div
                        key={book.id}
                        onClick={() => onNavigate('detail', book.id)}
                        className="group cursor-pointer"
                      >
                        
                        <div className="relative bg-gray-100 rounded-lg overflow-hidden shadow-sm mb-3" style={{ aspectRatio: '3/4' }}>
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>

                        
                        <div>
                          <h3 className="font-bold text-sm text-gray-900 line-clamp-2 mb-1 group-hover:text-[#008844] transition-colors">{book.title}</h3>
                          <p className="text-xs text-gray-500 mb-2">{book.category}</p>
                          
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              <Eye size={12} /> {book.views} lượt xem
                            </span>
                            <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                              <Heart size={12} /> {book.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {displayBooks.length === 0 && (
                  <div className="text-center py-20 text-gray-400">
                    Chưa có tài liệu nào trong danh sách.
                  </div>
                )}
              </>
            )}

            {activeMenu === 'quan-ly' && (
              <div className="animate-fade-in max-w-3xl">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý thông tin</h1>

                
                <div className="flex gap-6 border-b border-gray-100 mb-8">
                  <button className="pb-3 text-sm font-semibold text-[#008844] border-b-2 border-[#008844]">Thông tin cá nhân</button>
                  <button className="pb-3 text-sm font-semibold text-gray-500 hover:text-gray-700">Mật khẩu</button>
                </div>

                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gray-300 text-white rounded-full flex items-center justify-center text-2xl font-medium shadow-inner">
                    A
                  </div>
                  <div>
                    <div className="flex gap-3 mb-1">
                      <button className="text-sm font-medium text-[#008844] hover:underline">Tải ảnh mới lên</button>
                      <span className="text-gray-300">-</span>
                      <button className="text-sm font-medium text-[#008844] hover:underline">Gỡ bỏ ảnh</button>
                    </div>
                    <p className="text-sm text-gray-400">Những bức ảnh giúp chúng tôi, tôi đã nhận ra bạn</p>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Họ và tên<span className="text-red-500">*</span></label>
                    <input type="text" defaultValue="Bùi Ngân An" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#008844] text-sm text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Giới tính<span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#008844] text-sm text-gray-800 appearance-none bg-white">
                      <option>Nữ</option>
                      <option>Nam</option>
                      <option>Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Số điện thoại<span className="text-red-500">*</span></label>
                    <input type="text" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#008844] text-sm text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Mã học sinh</label>
                    <input type="text" defaultValue="0133220279" disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-[#008844] text-sm text-gray-800" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2">Lớp học</label>
                    <input type="text" disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm outline-none cursor-not-allowed" />
                  </div>
                </div>

                <button className="px-6 py-2.5 bg-[#008844] hover:bg-[#007733] text-white rounded-lg text-sm font-bold transition-colors">
                  Cập nhật
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
