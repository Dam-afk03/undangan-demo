import React from 'react';
import { Calendar, MapPin, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { WeddingClientConfig } from '../types/wedding';
import {
  FloralCornerOrnament,
  FloralDivider,
  BotanicalLaurel,
  BismillahEmblem,
} from './AestheticOrnament';

interface HeroSectionProps {
  guestName: string;
  onScrollDown: () => void;
  config?: WeddingClientConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ guestName, onScrollDown, config }) => {
  const groomName = config ? config.groom.nickname : WEDDING_CONFIG.groom.nickname;
  const brideName = config ? config.bride.nickname : WEDDING_CONFIG.bride.nickname;
  const displayDate = config ? config.displayDate : WEDDING_CONFIG.displayDate;
  const coverUrl = config ? config.coverPhoto : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80';

  return (
    <header id="hero" className="relative min-h-screen flex items-center justify-center text-center px-4 py-28 overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Background Image with Ken Burns animation */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-[0.32] filter animate-kenburns transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('${coverUrl}')`,
        }}
      />

      {/* Decorative gradient overlay with silver/charcoal moonlight tones */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/60 to-zinc-950/95" />

      {/* Subtle ambient silver light glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-1/3 w-80 h-80 rounded-full bg-slate-400/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-zinc-300/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero content with motion stagger */}
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Monogram Crest with Botanical Laurel in Silver */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-24 h-24 flex items-center justify-center mb-5"
        >
          <BotanicalLaurel className="absolute inset-0 w-full h-full text-slate-300/50 animate-pulse-subtle" />
          <div className="w-14 h-14 rounded-full border border-slate-400/60 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center shadow-2xl">
            <span className="font-pinyon text-3xl text-slate-100">
              {groomName.charAt(0)}&{brideName.charAt(0)}
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-xs uppercase tracking-[0.35em] text-slate-300/90 font-cinzel mb-2"
        >
          The Wedding Celebration
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="font-script text-6xl sm:text-7xl md:text-8xl shimmer-silver-text text-white tracking-wide mb-2 drop-shadow-2xl"
        >
          {groomName} & {brideName}
        </motion.h1>

        {/* Floral Divider */}
        <FloralDivider className="my-3" />

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-garamond italic text-lg sm:text-xl text-slate-200/90 max-w-lg mb-8 leading-relaxed"
        >
          “Kami mengundang Anda untuk menjadi saksi atas ikatan suci janji cinta kami.”
        </motion.p>

        {/* Clean Unboxed Metadata: Date and Venue (Anti-Slop Zero-Pill) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex items-center justify-center gap-3 text-xs sm:text-sm text-zinc-300 font-cinzel tracking-wider uppercase mb-8"
        >
          <span className="flex items-center gap-1.5 text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-300" />
            {displayDate}
          </span>
          <span className="text-slate-400/60" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 text-slate-200">
            <MapPin className="w-3.5 h-3.5 text-slate-300" />
            Jakarta, Indonesia
          </span>
        </motion.div>

        {/* Personalized Guest Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          whileHover={{ scale: 1.02 }}
          className="w-full max-w-md mx-auto p-5 mb-8 rounded-2xl bg-zinc-900/80 backdrop-blur-md border border-slate-400/35 text-center shadow-xl luxury-silver-glow-hover transition-all relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 font-cinzel mb-1">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <p className="text-xl sm:text-2xl font-serif-luxury font-bold text-white">
            {guestName}
          </p>
        </motion.div>

        {/* Quran Verse Sacred Parchment Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-8 max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-950/70 border border-slate-400/30 backdrop-blur-xl relative shadow-2xl luxury-silver-glow"
        >
          {/* Delicate Corner Ornaments */}
          <FloralCornerOrnament position="top-left" className="w-10 h-10 text-slate-300/40" />
          <FloralCornerOrnament position="top-right" className="w-10 h-10 text-slate-300/40" />
          <FloralCornerOrnament position="bottom-left" className="w-10 h-10 text-slate-300/40" />
          <FloralCornerOrnament position="bottom-right" className="w-10 h-10 text-slate-300/40" />

          {/* Bismillah Calligraphy */}
          <BismillahEmblem className="mb-4" />

          <p className="font-serif text-lg sm:text-xl text-slate-100 leading-loose font-arabic mb-4 tracking-wide">
            {WEDDING_CONFIG.holyVerse.arabic}
          </p>

          <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-400/50 to-transparent mx-auto mb-4" />

          <p className="font-garamond italic text-zinc-300 text-sm leading-relaxed mb-3">
            “{WEDDING_CONFIG.holyVerse.translation}”
          </p>

          <p className="text-[11px] font-cinzel text-slate-300 tracking-[0.2em] uppercase">
            ({WEDDING_CONFIG.holyVerse.source})
          </p>
        </motion.div>

        {/* Scroll down prompt */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          onClick={onScrollDown}
          className="mt-14 inline-flex flex-col items-center gap-1.5 text-slate-300/70 hover:text-white transition-colors cursor-pointer group"
        >
          <span className="text-[10px] tracking-[0.25em] font-cinzel uppercase group-hover:underline">
            Gulir ke bawah
          </span>
          <ChevronDown className="w-5 h-5 animate-bounce text-slate-300" />
        </motion.button>
      </div>
    </header>
  );
};
