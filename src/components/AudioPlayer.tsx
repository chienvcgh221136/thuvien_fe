import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward, Volume2, List, X, ChevronUp } from 'lucide-react';
import { Book, AudioChapter } from '../data/mockData';

interface AudioPlayerProps {
  book: Book;
  onClose: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ book, onClose }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(14);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(80);
  const [showChapters, setShowChapters] = useState(false);
  const speedOptions = [0.75, 1, 1.25, 1.5, 2];

  const chapters = book.chapters || [];
  const chapter = chapters[currentChapter];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress(p => (p >= 100 ? 0 : p + 0.05));
    }, 500);
    return () => clearInterval(t);
  }, [playing]);

  const nextSpeed = () => {
    const idx = speedOptions.indexOf(speed);
    setSpeed(speedOptions[(idx + 1) % speedOptions.length]);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f2e] text-white z-50 border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)] animate-slide-up">
      {showChapters && (
        <div className="border-b border-white/10 bg-[#13172a] px-4 py-3 max-h-48 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Danh sách chương</p>
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => { setCurrentChapter(i); setProgress(0); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left transition-colors mb-0.5
                ${i === currentChapter ? 'bg-green-500/20 text-green-400' : 'text-gray-300 hover:bg-white/5'}`}
            >
              <span className="text-xs font-mono text-gray-500 w-5">{i + 1}</span>
              <span className="flex-1 truncate">{ch.title}</span>
              <span className="text-xs text-gray-500">{ch.duration}</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-6 px-8 py-2.5 mx-auto max-w-[1400px]">
        <div className="flex items-center gap-4 w-[380px] flex-shrink-0">
          <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 shadow-lg border-2 border-white/10 ${playing ? 'animate-spin-vinyl' : 'animate-spin-vinyl paused'}`}>
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center overflow-hidden">
            <p className="text-[17px] font-bold text-white truncate" title={chapter?.title || book.title}>
              {chapter?.title || book.title}
            </p>
            <p className="text-[15px] text-gray-300 truncate mt-0.5" title={`${book.title} (Sách nói)`}>
              {book.title} (Sách nói)
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors group"
          >
            <ChevronUp size={16} className={`transition-transform group-hover:text-green-400 ${showChapters ? 'rotate-180' : ''}`} />
            <span className="truncate max-w-[400px]">{chapter?.title || 'Chương hiện tại'}</span>
          </button>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentChapter(c => Math.max(0, c - 1))}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Rewind size={20} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-10 h-10 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.3)] text-white"
            >
              {playing ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <FastForward size={20} />
            </button>
            <button
              onClick={() => setCurrentChapter(c => Math.min(chapters.length - 1, c + 1))}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="w-full max-w-xl flex items-center gap-3 text-xs font-medium text-gray-400">
            <span className="w-10 text-right">02:14</span>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative group">
              <div
                className="h-full bg-green-500 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md transition-opacity -mr-1.5" />
              </div>
            </div>
            <span className="w-10">15:30</span>
          </div>
        </div>

        <div className="flex items-center gap-5 min-w-[280px] justify-end">
          <div className="flex items-center gap-2">
            <Volume2 size={18} className="text-gray-400" />
            <input
              type="range" min={0} max={100} value={volume}
              onChange={e => setVolume(+e.target.value)}
              className="w-20 accent-green-500"
            />
          </div>
          <button
            onClick={nextSpeed}
            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-md text-sm font-bold transition-colors w-12 text-center"
          >
            {speed}x
          </button>
          <button
            onClick={() => setShowChapters(!showChapters)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <List size={20} />
          </button>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-400 transition-colors ml-2"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
