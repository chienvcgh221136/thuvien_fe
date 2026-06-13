import React, { useState } from 'react';
import { Header, Footer } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ListingPage } from './pages/ListingPage';
import { DetailPage } from './pages/DetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { UploadPage } from './pages/UploadPage';
import { ArticleListPage } from './pages/ArticleListPage';
import { AudioPlayer } from './components/AudioPlayer';
import { Book } from './data/mockData';

const LISTING_PAGES = ['sach-giay', 'sach-dien-tu', 'sach-noi', 'bai-giang', 'video', 'album', 'ky-nang-song', 'trending', 'new'];
const ARTICLE_PAGES = ['tin-tuc', 'gioi-thieu-sach'];

export default function App() {
  const [currentPage, setCurrentPage]     = useState('home');
  const [selectedBookId, setSelectedBookId] = useState<string>('1');
  const [playingBook, setPlayingBook]     = useState<Book | null>(null);
  const [showToast, setShowToast]         = useState(false);
  const [autoOpenReader, setAutoOpenReader] = useState(false);

  /**
   * navigate(page, bookId?, autoReader?)
   * autoReader = true  → khi vào DetailPage, tự động mở BookReader ngay
   */
  const navigate = (page: string, bookId?: string, autoReader = false) => {
    setCurrentPage(page);
    if (bookId) setSelectedBookId(bookId);
    setAutoOpenReader(autoReader);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlayAudio = (book: Book) => {
    setPlayingBook(book);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const renderPage = () => {
    if (currentPage === 'detail') {
      return (
        <DetailPage
          bookId={selectedBookId}
          onNavigate={navigate}
          onPlayAudio={handlePlayAudio}
          autoOpenReader={autoOpenReader}
        />
      );
    }
    if (currentPage === 'profile') {
      return <ProfilePage onNavigate={navigate} />;
    }
    if (currentPage === 'upload' || currentPage === 'manage') {
      return <UploadPage />;
    }
    if (LISTING_PAGES.includes(currentPage)) {
      return <ListingPage category={currentPage} onNavigate={navigate} />;
    }
    if (ARTICLE_PAGES.includes(currentPage)) {
      return <ArticleListPage category={currentPage} onNavigate={navigate} />;
    }
    return <HomePage onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Inter]">
      <Header onNavigate={navigate} currentPage={currentPage} />

      <div className="pt-[60px] flex flex-col min-h-screen">
        <main className={`flex-1 ${playingBook ? 'pb-28' : 'pb-0'}`}>
          {renderPage()}
        </main>
        <Footer />
      </div>

      {/* Audio player */}
      {playingBook && (
        <AudioPlayer book={playingBook} onClose={() => setPlayingBook(null)} />
      )}

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-24 right-5 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
          <span className="text-green-400">🎧</span>
          <span className="text-sm font-medium">Đang phát: <strong>{playingBook?.title}</strong></span>
        </div>
      )}
    </div>
  );
}
