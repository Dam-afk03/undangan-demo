import React, { useState } from 'react';
import { Video, Bell, Check, ExternalLink, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { WeddingClientConfig } from '../types/wedding';

interface LiveStreamingSectionProps {
  liveStream?: WeddingClientConfig['liveStream'];
}

export const LiveStreamingSection: React.FC<LiveStreamingSectionProps> = ({ liveStream }) => {
  const [reminderSet, setReminderSet] = useState(false);
  const [showLiveEmbed, setShowLiveEmbed] = useState(false);

  const streamData = liveStream || WEDDING_CONFIG.liveStream;

  const handleSetReminder = () => {
    setReminderSet(true);
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
    setTimeout(() => setReminderSet(false), 4000);
  };

  const youtubeEmbed = streamData.youtubeUrl?.includes('embed')
    ? streamData.youtubeUrl
    : (streamData.youtubeUrl?.replace('watch?v=', 'embed/') || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');

  return (
    <section className="py-20 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-slate-700/40">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-rose-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Broadcast
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-white mb-2">
            Siaran Langsung Pernikahan
          </h2>
          <p className="max-w-md mx-auto text-zinc-300 text-sm font-garamond italic">
            Bagi keluarga dan sahabat yang tidak dapat hadir secara langsung, Anda tetap dapat menyaksikan momen sakral kami melalui siaran langsung virtual.
          </p>
        </motion.div>

        {/* Live Stream Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-slate-400/30 backdrop-blur-md shadow-2xl luxury-silver-glow"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{streamData.platform}</span>
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Akad Nikah & Resepsi Virtual
              </h3>
              <p className="text-zinc-300 text-sm">
                Jadwal: <span className="font-semibold text-slate-200">{streamData.streamTime}</span>
              </p>
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 max-w-md">
                <p>Zoom Meeting ID: <span className="text-white font-mono font-bold">{streamData.zoomMeetingId}</span></p>
                <p>Passcode: <span className="text-white font-mono font-bold">{streamData.zoomPasscode}</span></p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <button
                onClick={() => setShowLiveEmbed(!showLiveEmbed)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40 transition-all cursor-pointer font-cinzel tracking-wider"
              >
                <Video className="w-4 h-4" />
                <span>{showLiveEmbed ? 'Tutup Siaran' : 'Tonton Siaran'}</span>
              </button>

              <button
                onClick={handleSetReminder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-slate-200 border border-slate-400/30 transition-all cursor-pointer font-cinzel tracking-wider"
              >
                {reminderSet ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">Pengingat Disimpan!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4 text-slate-300" />
                    <span>Pasang Pengingat</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Embedded Live Video Frame */}
          {showLiveEmbed && (
            <div className="mt-8 pt-6 border-t border-zinc-800">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-400/30 shadow-inner bg-black">
                <iframe
                  src={`${youtubeEmbed}?autoplay=1`}
                  title="Live Streaming Pernikahan"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-zinc-400">
                <span>Siaran langsung dipandu oleh Wedding Organizer.</span>
                <a
                  href={streamData.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 hover:text-white hover:underline"
                >
                  Buka di YouTube App <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
