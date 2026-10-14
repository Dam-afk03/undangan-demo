import React, { useEffect, useState } from 'react';
import {
  Home,
  Heart,
  Calendar,
  BookOpen,
  Image,
  Send,
  Gift,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { weddingAudio } from '../utils/audioPlayer';

interface FloatingNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const FloatingNav: React.FC<FloatingNavProps> = ({ activeSection, onNavigate }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = weddingAudio.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'couple', label: 'Mempelai', icon: Heart },
    { id: 'events', label: 'Acara', icon: Calendar },
    { id: 'story', label: 'Kisah', icon: BookOpen },
    { id: 'gallery', label: 'Galeri', icon: Image },
    { id: 'rsvp', label: 'RSVP', icon: Send },
    { id: 'gift', label: 'Kado', icon: Gift },
  ];

  return (
    <>
      {/* Floating Music Button (Bottom Right - Elegant Neutral Gray / Silver Palette) */}
      <div className="fixed bottom-20 right-4 sm:bottom-5 sm:right-6 z-40">
        <button
          onClick={() => weddingAudio.toggle()}
          title={isPlaying ? 'Jeda Musik' : 'Putar Musik'}
          aria-label="Toggle background music"
          className="group relative flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900/95 backdrop-blur-xl border border-zinc-600/70 text-zinc-200 shadow-2xl shadow-black/80 transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-400 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Vinyl disk animation in monochrome gray / silver */}
          <div
            className={`w-7 h-7 rounded-full bg-zinc-950 border border-zinc-600/90 flex items-center justify-center relative shrink-0 shadow-inner ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            {/* Fine vinyl groove */}
            <div className="w-5 h-5 rounded-full border border-zinc-800/80 absolute" />
            {/* Center silver/gray label */}
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-sm" />
            {/* Center spindle hole */}
            <div className="w-1 h-1 rounded-full bg-zinc-950 absolute" />
          </div>

          {/* Equalizer sound wave bars in silver/gray */}
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3.5 px-0.5" aria-hidden="true">
              <span className="w-0.5 bg-zinc-300 rounded-full animate-bounce h-3" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 bg-zinc-400 rounded-full animate-bounce h-2" style={{ animationDuration: '0.4s' }} />
              <span className="w-0.5 bg-zinc-300 rounded-full animate-bounce h-3.5" style={{ animationDuration: '0.8s' }} />
            </div>
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          )}

          <div className="pr-1 text-xs font-cinzel font-medium hidden sm:flex items-center gap-1.5 text-zinc-300">
            {isPlaying ? (
              <span className="text-[10px] tracking-wider uppercase text-zinc-200 font-semibold">Musik On</span>
            ) : (
              <span className="text-[10px] tracking-wider uppercase text-zinc-400 font-normal">Musik Off</span>
            )}
          </div>
        </button>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw]">
        <nav className="flex items-center gap-1 sm:gap-2 px-3 py-2 bg-zinc-950/90 backdrop-blur-xl border border-zinc-500/40 rounded-full shadow-2xl text-zinc-300 luxury-silver-glow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex flex-col sm:flex-row items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-cinzel tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-zinc-700/60 via-slate-600/50 to-zinc-700/60 text-white border border-slate-400/50 shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                }`}
                title={item.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-200 scale-110' : 'text-zinc-500'}`} />
                <span className="text-[9px] sm:text-[10px] uppercase font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};
