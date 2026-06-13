import React from 'react';
import { ChevronRight, Eye } from 'lucide-react';

interface ArticleListPageProps {
  category: string;
  onNavigate: (page: string, bookId?: string, autoReader?: boolean) => void;
}

const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'GIỚI THIỆU SÁCH',
    date: '23/02/2024',
    excerpt: '',
    views: 45,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'GIỚI THIỆU SÁCH THÁNG 12 NĂM 2023-2024',
    date: '23/02/2024',
    excerpt: 'GIỚI THIỆU SÁCH',
    views: 25,
    isFeatured: false,
  },
  {
    id: '3',
    title: 'GIỚI THIỆU SÁCH',
    date: '20/02/2024',
    excerpt: '',
    views: 20,
    isFeatured: false,
  }
];

const PlaceholderImage = () => (
  <div className="w-full h-full bg-[#d9d9d9] flex items-center justify-center">
    <div className="w-16 h-16 flex flex-col items-center justify-center">
      <div className="flex -mb-1">
        <div className="w-4 h-8 bg-[#e96c24] rounded-sm transform -rotate-[15deg]"></div>
        <div className="w-4 h-8 bg-[#008844] rounded-sm transform rotate-[15deg]"></div>
      </div>
      <div className="w-10 h-10 border-b-4 border-[#008844] rounded-full"></div>
      <span className="text-[#008844] font-bold text-[8px] mt-1">VIELIB</span>
    </div>
  </div>
);

export const ArticleListPage: React.FC<ArticleListPageProps> = ({ category, onNavigate }) => {
  const pageTitle = category === 'gioi-thieu-sach' ? 'Giới thiệu sách' : 'Tin tức';

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8 py-6">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-6">
          <button onClick={() => onNavigate('home')} className="text-gray-500 hover:text-green-600 transition-colors">Trang chủ</button>
          <span className="text-gray-400">/</span>
          <span className="text-green-600 font-medium">{pageTitle}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Main Content (Left) */}
          <div className="flex-1 space-y-8">
            {MOCK_ARTICLES.filter(a => a.isFeatured || !a.isFeatured).map((article, idx) => (
              <div key={article.id} className={`group cursor-pointer ${idx !== MOCK_ARTICLES.length - 1 ? 'border-b border-gray-100 pb-8' : ''}`}>
                {article.isFeatured ? (
                  // Featured article layout (Image top, text bottom or Image left, text right)
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[60%] rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
                      <PlaceholderImage />
                    </div>
                    <div className="flex-1 pt-2">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{article.title}</h2>
                      <p className="text-sm text-gray-400 mb-3">{article.date}</p>
                      {article.excerpt && <p className="text-gray-600 text-sm">{article.excerpt}</p>}
                    </div>
                  </div>
                ) : (
                  // Standard article layout (Image left small, text right)
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-[40%] rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '16/9' }}>
                      <PlaceholderImage />
                    </div>
                    <div className="flex-1 pt-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">{article.title}</h3>
                      <p className="text-sm text-gray-400 mb-3">{article.date}</p>
                      {article.excerpt && <p className="text-gray-600 text-sm uppercase">{article.excerpt}</p>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <h3 className="text-lg font-bold text-gray-900 border-b-2 border-green-600 pb-2 mb-5 inline-block">Xem nhiều</h3>
            
            <div className="space-y-5">
              {MOCK_ARTICLES.filter(a => !a.isFeatured).map(article => (
                <div key={'sidebar-' + article.id} className="flex gap-4 group cursor-pointer">
                  <div className="flex-1">
                    <h4 className="font-bold text-[13px] text-gray-900 leading-snug mb-2 group-hover:text-green-600 transition-colors">
                      {article.title}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                      <Eye size={12} /> {article.views} lượt xem
                    </span>
                  </div>
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <PlaceholderImage />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
