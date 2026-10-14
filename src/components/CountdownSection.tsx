import React, { useState, useEffect } from 'react';
import { Calendar, Download, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_CONFIG, EVENTS } from '../data/weddingData';
import { generateGoogleCalendarUrl, downloadIcsFile } from '../utils/calendar';
import { WeddingClientConfig } from '../types/wedding';
import { FloralDivider } from './AestheticOrnament';

interface CountdownSectionProps {
  config?: WeddingClientConfig;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ config }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  const weddingDateStr = config ? config.weddingDate : WEDDING_CONFIG.weddingDate;

  useEffect(() => {
    const target = new Date(weddingDateStr).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isCompleted: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isCompleted: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr]);

  const activeEvents = config?.events || EVENTS;
  const coupleName = config?.coupleTitle || 'Arya & Anindya';

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl(
      `Pernikahan ${coupleName}`,
      `Undangan Pernikahan ${coupleName}.\nAkad: ${activeEvents.akad.timeStr}\nResepsi: ${activeEvents.resepsi.timeStr}\nLokasi: ${activeEvents.resepsi.locationName}`,
      activeEvents.resepsi.address,
      activeEvents.akad.isoDateTimeStart,
      activeEvents.resepsi.isoDateTimeEnd
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleAppleCalendar = () => {
    downloadIcsFile(
      `Pernikahan ${coupleName}`,
      `Undangan Pernikahan ${coupleName}.\nAkad: ${activeEvents.akad.timeStr}\nResepsi: ${activeEvents.resepsi.timeStr}\nLokasi: ${activeEvents.resepsi.locationName}`,
      activeEvents.resepsi.address,
      activeEvents.akad.isoDateTimeStart,
      activeEvents.resepsi.isoDateTimeEnd
    );
  };

  const timeBlocks = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds },
  ];

  return (
    <section className="py-24 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden border-y border-slate-700/50">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/15 via-zinc-950/85 to-zinc-950" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Hitung Mundur
          </p>

          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
            Menuju Hari Bahagia
          </h2>

          <FloralDivider className="my-3" />

          <p className="text-slate-200/80 text-sm font-garamond italic max-w-md mx-auto mb-12">
            “Setiap detik begitu berharga menanti ikatan suci janji pernikahan kami di hadapan Sang Pencipta.”
          </p>
        </motion.div>

        {/* 4 Countdown Blocks with double hairline silver frame */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-5 max-w-xl mx-auto mb-12">
          {timeBlocks.map((block, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              className="p-3.5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-slate-400/35 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center luxury-silver-glow relative overflow-hidden group"
            >
              {/* Inner hairline */}
              <div className="absolute inset-1.5 rounded-xl border border-slate-400/15 pointer-events-none" />

              <span className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow">
                {String(block.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-slate-300/80 mt-1 font-cinzel font-medium">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Smart Calendar Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto"
        >
          <button
            onClick={handleGoogleCalendar}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 shadow-xl shadow-black/50 transition-all cursor-pointer hover:scale-103 border border-white"
          >
            <Calendar className="w-4 h-4 text-zinc-950" />
            <span>Google Calendar</span>
            <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
          </button>

          <button
            onClick={handleAppleCalendar}
            className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-cinzel tracking-wider uppercase font-semibold bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-slate-400/40 transition-all cursor-pointer hover:scale-103 shadow-lg"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Simpan Kalender (.ics)</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};
