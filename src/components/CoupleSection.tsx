import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { WeddingClientConfig } from '../types/wedding';
import { FloralCornerOrnament, FloralDivider, BotanicalLaurel } from './AestheticOrnament';

interface CoupleSectionProps {
  config?: WeddingClientConfig;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({ config }) => {
  const groom = config ? config.groom : WEDDING_CONFIG.groom;
  const bride = config ? config.bride : WEDDING_CONFIG.bride;

  return (
    <section id="couple" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-zinc-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Kedua Mempelai
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            Mempelai Pengantin
          </h2>
          
          <FloralDivider className="my-3" />

          <p className="max-w-xl mx-auto text-slate-200/80 text-sm sm:text-base font-garamond italic mb-16 leading-relaxed">
            “Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan. Dengan memohon rahmat dan ridho Allah SWT, izinkan kami memperkenalkan kedua mempelai.”
          </p>
        </motion.div>

        {/* Grid 2 Columns: Groom & Bride with Staggered Viewport Entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Groom Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/80 border border-slate-400/30 backdrop-blur-md shadow-2xl hover:border-slate-300/50 transition-all duration-500 group luxury-silver-glow relative overflow-hidden"
          >
            {/* Delicate Inner Hairline Frame */}
            <div className="absolute inset-3 rounded-[2rem] border border-slate-400/15 pointer-events-none" />

            {/* Floral Corner Ornaments */}
            <FloralCornerOrnament position="top-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="top-right" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="bottom-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="bottom-right" className="w-12 h-12 text-slate-300/40" />

            {/* Arch Photo Frame with Double Silver Hairline */}
            <div className="relative mb-6">
              <div className="w-60 h-80 rounded-t-[120px] rounded-b-2xl overflow-hidden border-2 border-slate-300/60 p-2 bg-zinc-950 shadow-2xl relative">
                <div className="w-full h-full rounded-t-[112px] rounded-b-xl overflow-hidden relative border border-slate-400/30">
                  <img
                    src={groom.photo}
                    alt={groom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Status Ribbon with cinzel typography */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-950 border border-slate-400/60 rounded-full px-5 py-1 text-[10px] text-slate-200 tracking-widest font-cinzel uppercase shadow-xl whitespace-nowrap">
                Pengantin Pria
              </div>
            </div>

            <p className="font-script text-4xl text-slate-100 shimmer-silver-text mb-1 mt-2">
              {groom.nickname}
            </p>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-3 tracking-wide">
              {groom.name}
            </h3>

            <p className="text-zinc-300 text-sm leading-relaxed mb-6 max-w-xs font-garamond italic">
              {groom.description}
            </p>

            {/* Clean Unboxed Instagram Link (Anti-Slop Zero-Pill) */}
            <a
              href={`https://instagram.com/${groom.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs font-cinzel text-slate-400 hover:text-white tracking-wider hover:underline transition-all"
            >
              <Instagram className="w-4 h-4 text-slate-300" />
              <span>{groom.instagram}</span>
            </a>
          </motion.div>

          {/* Bride Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/80 border border-slate-400/30 backdrop-blur-md shadow-2xl hover:border-slate-300/50 transition-all duration-500 group luxury-silver-glow relative overflow-hidden"
          >
            {/* Delicate Inner Hairline Frame */}
            <div className="absolute inset-3 rounded-[2rem] border border-slate-400/15 pointer-events-none" />

            {/* Floral Corner Ornaments */}
            <FloralCornerOrnament position="top-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="top-right" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="bottom-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="bottom-right" className="w-12 h-12 text-slate-300/40" />

            {/* Arch Photo Frame with Double Silver Hairline */}
            <div className="relative mb-6">
              <div className="w-60 h-80 rounded-t-[120px] rounded-b-2xl overflow-hidden border-2 border-slate-300/60 p-2 bg-zinc-950 shadow-2xl relative">
                <div className="w-full h-full rounded-t-[112px] rounded-b-xl overflow-hidden relative border border-slate-400/30">
                  <img
                    src={bride.photo}
                    alt={bride.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent to-transparent opacity-60" />
                </div>
              </div>

              {/* Status Ribbon with cinzel typography */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-zinc-950 border border-slate-400/60 rounded-full px-5 py-1 text-[10px] text-slate-200 tracking-widest font-cinzel uppercase shadow-xl whitespace-nowrap">
                Pengantin Wanita
              </div>
            </div>

            <p className="font-script text-4xl text-slate-100 shimmer-silver-text mb-1 mt-2">
              {bride.nickname}
            </p>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-3 tracking-wide">
              {bride.name}
            </h3>

            <p className="text-zinc-300 text-sm leading-relaxed mb-6 max-w-xs font-garamond italic">
              {bride.description}
            </p>

            {/* Clean Unboxed Instagram Link (Anti-Slop Zero-Pill) */}
            <a
              href={`https://instagram.com/${bride.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs font-cinzel text-slate-400 hover:text-white tracking-wider hover:underline transition-all"
            >
              <Instagram className="w-4 h-4 text-slate-300" />
              <span>{bride.instagram}</span>
            </a>
          </motion.div>
        </div>

        {/* Center Interlocking Heart Emblem with Botanical Ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 flex items-center justify-center"
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <BotanicalLaurel className="absolute inset-0 w-full h-full text-slate-300/50 animate-pulse-subtle" />
            <div className="w-10 h-10 rounded-full border border-slate-400/60 bg-zinc-950/90 flex items-center justify-center text-rose-400 shadow-2xl">
              <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
