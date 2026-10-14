import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Navigation, ExternalLink, Shirt } from 'lucide-react';
import { motion } from 'motion/react';
import { EVENTS, WEDDING_CONFIG } from '../data/weddingData';
import { EventSchedule } from '../types/wedding';
import { FloralCornerOrnament, FloralDivider } from './AestheticOrnament';

interface EventScheduleSectionProps {
  events?: {
    akad: EventSchedule;
    resepsi: EventSchedule;
  };
}

export const EventScheduleSection: React.FC<EventScheduleSectionProps> = ({ events }) => {
  const [activeTab, setActiveTab] = useState<'akad' | 'resepsi'>('resepsi');

  const activeEvents = events || EVENTS;
  const selectedEvent = activeEvents[activeTab];

  return (
    <section id="events" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Waktu & Tempat
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            Rangkaian Acara
          </h2>
          
          <FloralDivider className="my-3" />

          <p className="max-w-xl mx-auto text-slate-200/80 text-sm font-garamond italic leading-relaxed">
            “Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.”
          </p>
        </motion.div>

        {/* 2 Event Cards with staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Akad Nikah */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/80 border border-slate-400/35 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between hover:border-slate-300/50 transition-all duration-500 shadow-2xl luxury-silver-glow group"
          >
            {/* Delicate Inner Hairline Frame */}
            <div className="absolute inset-3 rounded-[2rem] border border-slate-400/15 pointer-events-none" />

            {/* Floral Corner Ornaments */}
            <FloralCornerOrnament position="top-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="top-right" className="w-12 h-12 text-slate-300/40" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-cinzel mb-2">
                Sesi Sakral
              </p>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-6 tracking-wide">
                {activeEvents.akad.title}
              </h3>

              <div className="space-y-4 text-sm text-zinc-300 mb-8 font-garamond text-base">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-slate-200 font-semibold">{activeEvents.akad.dateStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-slate-200 font-semibold">{activeEvents.akad.timeStr}</p>
                    <p className="text-xs text-zinc-400 italic">Khusus Keluarga & Kerabat Dekat</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-white font-semibold">{activeEvents.akad.locationName}</p>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">{activeEvents.akad.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-slate-400/15">
              <a
                href={activeEvents.akad.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 transition-all cursor-pointer shadow-lg border border-white"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
              <a
                href={activeEvents.akad.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-5 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-zinc-950 hover:bg-zinc-800 text-slate-200 border border-slate-400/30 transition-all"
              >
                <span>Waze</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </motion.div>

          {/* Resepsi Pernikahan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-8 sm:p-10 rounded-[2.5rem] bg-zinc-900/80 border border-slate-400/35 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between hover:border-slate-300/50 transition-all duration-500 shadow-2xl luxury-silver-glow group"
          >
            {/* Delicate Inner Hairline Frame */}
            <div className="absolute inset-3 rounded-[2rem] border border-slate-400/15 pointer-events-none" />

            {/* Floral Corner Ornaments */}
            <FloralCornerOrnament position="top-left" className="w-12 h-12 text-slate-300/40" />
            <FloralCornerOrnament position="top-right" className="w-12 h-12 text-slate-300/40" />

            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-300 font-cinzel mb-2">
                Perayaan Utama
              </p>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white mb-6 tracking-wide">
                {activeEvents.resepsi.title}
              </h3>

              <div className="space-y-4 text-sm text-zinc-300 mb-8 font-garamond text-base">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-slate-200 font-semibold">{activeEvents.resepsi.dateStr}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-slate-200 font-semibold">{activeEvents.resepsi.timeStr}</p>
                    <p className="text-xs text-zinc-400 italic">Sesi 1: Siang | Sesi 2: Malam</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full border border-slate-400/30 bg-zinc-950 flex items-center justify-center shrink-0 text-slate-300">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif-luxury text-white font-semibold">{activeEvents.resepsi.locationName}</p>
                    <p className="text-xs text-zinc-300 leading-relaxed italic">{activeEvents.resepsi.address}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-5 border-t border-slate-400/15">
              <a
                href={activeEvents.resepsi.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 transition-all cursor-pointer shadow-lg border border-white"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Google Maps</span>
              </a>
              <a
                href={activeEvents.resepsi.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-3 px-5 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-zinc-950 hover:bg-zinc-800 text-slate-200 border border-slate-400/30 transition-all"
              >
                <span>Waze</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Embedded Interactive Map Preview with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-6 rounded-3xl bg-zinc-900/60 border border-slate-400/25 backdrop-blur-sm shadow-xl mb-12 luxury-silver-glow"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-200">
              <MapPin className="w-4 h-4 text-slate-300" />
              <span>Petunjuk Peta Lokasi:</span>
            </div>

            <div className="flex items-center gap-2 bg-zinc-800/80 p-1 rounded-xl border border-zinc-700">
              <button
                onClick={() => setActiveTab('resepsi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'resepsi'
                    ? 'bg-slate-200 text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Lokasi Resepsi
              </button>
              <button
                onClick={() => setActiveTab('akad')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === 'akad'
                    ? 'bg-slate-200 text-zinc-950 font-semibold'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Lokasi Akad
              </button>
            </div>
          </div>

          <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-400/20 relative shadow-inner">
            <iframe
              src={selectedEvent.embedMapUrl}
              title={`Peta Lokasi ${selectedEvent.title}`}
              className="w-full h-full border-0 filter contrast-105"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="text-center text-xs text-zinc-400 mt-3">
            📍 {selectedEvent.locationName} — {selectedEvent.address}
          </p>
        </motion.div>

        {/* Dress Code Section with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/50 border border-slate-400/25 text-center max-w-2xl mx-auto luxury-silver-glow"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-800 border border-slate-400/30 text-slate-200 text-xs font-medium mb-3">
            <Shirt className="w-3.5 h-3.5 text-slate-300" />
            Dress Code & Tata Busana
          </div>
          <h4 className="font-serif-luxury text-xl font-bold text-white mb-2">
            {WEDDING_CONFIG.dressCode.theme}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-300 mb-6">
            {WEDDING_CONFIG.dressCode.note}
          </p>

          <div className="flex items-center justify-center gap-4">
            {WEDDING_CONFIG.dressCode.palette.map((color, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-10 h-10 rounded-full border-2 border-slate-400/40 shadow-md transition-transform"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="text-[10px] text-zinc-400">{color.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
