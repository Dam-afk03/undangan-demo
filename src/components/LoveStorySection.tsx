import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { LOVE_STORIES } from '../data/weddingData';
import { LoveMilestone } from '../types/wedding';
import { FloralDivider } from './AestheticOrnament';

interface LoveStorySectionProps {
  stories?: LoveMilestone[];
}

export const LoveStorySection: React.FC<LoveStorySectionProps> = ({ stories }) => {
  const list = stories && stories.length > 0 ? stories : LOVE_STORIES;

  return (
    <section id="story" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-slate-700/40">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-10 w-80 h-80 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 right-10 w-80 h-80 rounded-full bg-zinc-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Perjalanan Kami
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            Kisah Cinta Kami
          </h2>

          <FloralDivider className="my-3" />

          <p className="max-w-lg mx-auto text-slate-200/80 text-sm font-garamond italic leading-relaxed">
            “Setiap kisah cinta itu indah, namun bagi kami, setiap bab perjalanan inilah yang menuntun kami menuju ikatan suci pernikahan.”
          </p>
        </motion.div>

        {/* Timeline wrapper */}
        <div className="relative">
          {/* Vertical central timeline line with animated shimmer */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-slate-500/10 via-slate-400/50 to-slate-500/10" />

          <div className="space-y-12 md:space-y-16">
            {list.map((milestone, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content Card with Double Hairline Frame */}
                  <div className="w-full md:w-1/2">
                    <div className="p-7 rounded-[2rem] bg-zinc-900/80 border border-slate-400/30 backdrop-blur-md shadow-2xl hover:border-slate-300/50 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden luxury-silver-glow">
                      <div className="absolute inset-2.5 rounded-[1.5rem] border border-slate-400/15 pointer-events-none" />

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs uppercase tracking-[0.2em] font-cinzel text-slate-200 font-bold">
                          {milestone.year}
                        </span>
                        <span className="text-slate-400/60" aria-hidden="true">·</span>
                        <span className="text-[10px] tracking-widest uppercase font-cinzel text-slate-400">Milestone</span>
                      </div>

                      <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>

                      <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-garamond text-base italic">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node / Heart Dot with pulse */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-950 border-2 border-slate-400/70 items-center justify-center shadow-xl shadow-black/70 z-10 animate-pulse-subtle">
                    <Heart className="w-4 h-4 fill-slate-300 text-slate-300" />
                  </div>

                  {/* Photo Card with Arched Silhouette */}
                  <div className="w-full md:w-1/2 flex justify-center">
                    <div className="w-full max-w-sm h-60 sm:h-72 rounded-t-[80px] rounded-b-2xl overflow-hidden border-2 border-slate-400/40 p-1.5 bg-zinc-950 shadow-2xl group">
                      <img
                        src={milestone.photoUrl}
                        alt={milestone.title}
                        className="w-full h-full object-cover rounded-t-[72px] rounded-b-xl group-hover:scale-108 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
