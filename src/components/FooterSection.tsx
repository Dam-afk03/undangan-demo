import React from 'react';
import { Heart, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { WeddingClientConfig } from '../types/wedding';
import { BotanicalLaurel, FloralDivider } from './AestheticOrnament';

interface FooterSectionProps {
  onOpenAdmin: () => void;
  config?: WeddingClientConfig;
}

export const FooterSection: React.FC<FooterSectionProps> = ({ onOpenAdmin, config }) => {
  const coupleTitle = config ? config.coupleTitle : `${WEDDING_CONFIG.groom.nickname} & ${WEDDING_CONFIG.bride.nickname}`;

  return (
    <footer className="py-20 px-4 bg-zinc-950 text-zinc-300 text-center relative border-t border-slate-700/40 overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-slate-400/5 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto space-y-8 relative z-10"
      >
        {/* Monogram with Laurel */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <BotanicalLaurel className="absolute inset-0 w-full h-full text-slate-300/40 animate-pulse-subtle" />
          <div className="w-12 h-12 rounded-full border border-slate-400/60 bg-zinc-900 mx-auto flex items-center justify-center text-slate-200 shadow-xl">
            <span className="font-pinyon text-2xl">
              {coupleTitle.split('&')[0]?.trim().charAt(0) || 'A'}&{coupleTitle.split('&')[1]?.trim().charAt(0) || 'V'}
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-script text-4xl sm:text-5xl text-white mb-2 shimmer-silver-text">
            {coupleTitle}
          </h3>
          <FloralDivider className="my-2" />
          <p className="text-slate-300/80 text-xs sm:text-sm font-garamond italic max-w-md mx-auto leading-relaxed">
            “Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi lembaran baru hidup kami.”
          </p>
        </div>

        <div className="pt-4 border-t border-zinc-800 text-xs text-zinc-500 space-y-4">
          <p className="flex items-center justify-center gap-1.5">
            Made in <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" /> Two A'Ss 
          </p>

          {/* Discreet Admin Lock Access (Hidden from regular guests) */}
          <div className="pt-2 flex items-center justify-center">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="text-zinc-700 hover:text-white transition-colors p-1.5 rounded-full cursor-pointer opacity-30 hover:opacity-100"
                title="Akses Pengantin / Admin"
                aria-label="Akses Admin"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
