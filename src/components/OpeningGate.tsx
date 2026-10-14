import React from 'react';
import { MailOpen, Heart, Sparkles, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { WeddingClientConfig } from '../types/wedding';
import { FloralCornerOrnament, FloralDivider, BotanicalLaurel } from './AestheticOrnament';

interface OpeningGateProps {
  guestName: string;
  isOpen: boolean;
  onOpen: () => void;
  config?: WeddingClientConfig;
}

export const OpeningGate: React.FC<OpeningGateProps> = ({ guestName, isOpen, onOpen, config }) => {
  const groomName = config ? config.groom.nickname : WEDDING_CONFIG.groom.nickname;
  const brideName = config ? config.bride.nickname : WEDDING_CONFIG.bride.nickname;
  const dateStr = config ? config.displayDate : WEDDING_CONFIG.displayDate;
  const coverUrl = config ? config.coverPhoto : 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -90, filter: 'blur(8px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-zinc-950"
        >
          {/* Background romantic photo with dark luxury blur overlay & Ken Burns motion */}
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-[0.32] scale-105 animate-kenburns transition-all duration-1000"
            style={{
              backgroundImage: `url('${coverUrl}')`,
            }}
          />

          {/* Silver luxury radial glow overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600/15 via-zinc-950/85 to-zinc-950/98" />

          {/* Ambient luxury particle / light glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-52 h-52 rounded-full bg-slate-300/15 blur-3xl animate-pulse" />
            <div className="absolute bottom-1/3 right-1/4 w-60 h-60 rounded-full bg-zinc-400/15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>

          {/* Luxury Royal Envelope Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md mx-4 p-7 sm:p-9 text-center text-white backdrop-blur-2xl bg-zinc-900/85 rounded-[2.5rem] border border-slate-400/35 shadow-2xl luxury-silver-glow overflow-hidden"
          >
            {/* Delicate Inner Hairline Border */}
            <div className="absolute inset-3 rounded-[2rem] border border-slate-400/20 pointer-events-none" />

            {/* Aesthetic Floral Corner Ornaments */}
            <FloralCornerOrnament position="top-left" className="w-14 h-14 text-slate-300/45" />
            <FloralCornerOrnament position="top-right" className="w-14 h-14 text-slate-300/45" />
            <FloralCornerOrnament position="bottom-left" className="w-14 h-14 text-slate-300/45" />
            <FloralCornerOrnament position="bottom-right" className="w-14 h-14 text-slate-300/45" />

            {/* Top Monogram Seal with Laurel */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 220, damping: 18 }}
              className="relative mx-auto w-20 h-20 flex items-center justify-center mb-4"
            >
              <BotanicalLaurel className="absolute inset-0 w-full h-full text-slate-300/40 animate-pulse-subtle" />
              <div className="w-12 h-12 rounded-full border border-slate-400/60 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center shadow-lg">
                <span className="font-pinyon text-2xl text-slate-100">
                  {groomName.charAt(0)}&{brideName.charAt(0)}
                </span>
              </div>
            </motion.div>

            {/* Kicker with diamond stars */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[11px] uppercase tracking-[0.35em] text-slate-300/90 font-cinzel mb-1 flex items-center justify-center gap-2"
            >
              <span>The Wedding Of</span>
            </motion.p>

            {/* Couple Calligraphy Names */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-script text-5xl sm:text-6xl shimmer-silver-text text-white mb-2 drop-shadow-lg tracking-wide"
            >
              {groomName} & {brideName}
            </motion.h1>

            {/* Floral Divider */}
            <FloralDivider className="my-2" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="font-garamond italic text-slate-300/80 text-sm tracking-wide mb-4"
            >
              {dateStr}
            </motion.p>

            {/* Recipient Aesthetic Stationery Box */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="p-4 my-4 rounded-2xl bg-zinc-950/80 border border-slate-400/35 shadow-xl relative group overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
              <p className="text-[10px] text-slate-400 tracking-[0.25em] uppercase font-cinzel mb-1">
                Kepada Yth. Bapak/Ibu/Saudara/i:
              </p>
              <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white break-words drop-shadow">
                {guestName}
              </h2>
              <p className="text-[10px] text-zinc-400 mt-1 italic font-garamond">
                *Mohon maaf bila ada kesalahan penulisan nama atau gelar
              </p>
            </motion.div>

            {/* Open Button with Glowing Silver / Platinum Accent */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(226, 232, 240, 0.5)' }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpen}
              className="w-full py-3.5 px-6 rounded-full font-medium text-sm tracking-wider bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 font-cinzel font-semibold shadow-xl flex items-center justify-center gap-2.5 transition-all duration-300 border border-white cursor-pointer"
            >
              <MailOpen className="w-4 h-4 text-zinc-950" />
              <span className="font-bold tracking-widest uppercase text-xs">Buka Undangan</span>
              <Music className="w-3.5 h-3.5 text-zinc-950 ml-1 animate-bounce" />
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
              className="mt-3.5 flex items-center justify-center gap-1.5 text-slate-300/70 text-[11px] font-garamond italic"
            >
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 animate-pulse" />
              <span>Musik diputar otomatis saat undangan dibuka</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
