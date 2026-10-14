import React, { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight, Play, Maximize2 } from 'lucide-react';
import { motion } from 'motion/react';
import { GALLERY_ITEMS } from '../data/weddingData';
import { GalleryItem } from '../types/wedding';
import { FloralDivider } from './AestheticOrnament';

interface GallerySectionProps {
  galleryItems?: GalleryItem[];
  videoTeaser?: {
    title: string;
    youtubeUrl: string;
    videoUrl?: string;
    videoType?: 'youtube' | 'upload' | 'direct';
    posterUrl: string;
  };
}

export const GallerySection: React.FC<GallerySectionProps> = ({ galleryItems, videoTeaser }) => {
  const [filter, setFilter] = useState<'all' | 'prewedding' | 'engagement' | 'memories'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const itemsList = galleryItems && galleryItems.length > 0 ? galleryItems : GALLERY_ITEMS;
  const filteredItems = filter === 'all'
    ? itemsList
    : itemsList.filter((item) => item.category === filter);

  const videoTitle = videoTeaser?.title || 'Cinematic Prewedding Teaser';
  const videoPoster = videoTeaser?.posterUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80';
  const hasDirectVideo = Boolean(videoTeaser?.videoUrl && videoTeaser.videoUrl.trim());
  const isDirectUploadMode = videoTeaser?.videoType === 'upload' || (hasDirectVideo && !videoTeaser?.youtubeUrl);

  const videoEmbedUrl = videoTeaser?.youtubeUrl?.includes('embed')
    ? videoTeaser.youtubeUrl
    : (videoTeaser?.youtubeUrl?.replace('watch?v=', 'embed/') || 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');

  const currentIndex = activePhoto ? filteredItems.findIndex((p) => p.id === activePhoto.id) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredItems.length - 1) {
      setActivePhoto(filteredItems[currentIndex + 1]);
    } else {
      setActivePhoto(filteredItems[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActivePhoto(filteredItems[currentIndex - 1]);
    } else {
      setActivePhoto(filteredItems[filteredItems.length - 1]);
    }
  };

  return (
    <section id="gallery" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Momen Kebahagiaan
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            Galeri Foto & Video
          </h2>
          
          <FloralDivider className="my-3" />

          <p className="max-w-md mx-auto text-slate-200/80 text-sm font-garamond italic leading-relaxed">
            “Potret senyuman dan debar kebahagiaan dalam menyongsong ikrar cinta suci kami.”
          </p>
        </motion.div>

        {/* Video Teaser Preview Banner with Motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 rounded-3xl overflow-hidden border border-slate-400/30 bg-zinc-900 shadow-2xl relative max-w-4xl mx-auto luxury-silver-glow"
        >
          {!isPlayingVideo ? (
            <div className="relative aspect-video w-full group cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
              <img
                src={videoPoster}
                alt={videoTitle}
                className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
                <button
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-200 hover:bg-white text-zinc-950 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300 mb-4 cursor-pointer animate-pulse-subtle border border-white"
                  title="Putar Video Prewedding"
                >
                  <Play className="w-8 h-8 fill-zinc-950 ml-1" />
                </button>
                <h3 className="font-serif-luxury text-xl sm:text-2xl text-white font-bold mb-1">
                  {videoTitle}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 font-garamond italic">
                  “Cinta Sejati Menemukan Jalannya” • Putar Video
                </p>
              </div>
            </div>
          ) : (
            <div className="relative aspect-video w-full bg-zinc-950 flex items-center justify-center">
              {isDirectUploadMode && hasDirectVideo ? (
                <video
                  src={videoTeaser?.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <iframe
                  src={`${videoEmbedUrl}?autoplay=1`}
                  title="Prewedding Teaser Video"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              <button
                onClick={() => setIsPlayingVideo(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 cursor-pointer shadow-lg"
                title="Tutup Video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: 'Semua Momen' },
            { id: 'prewedding', label: 'Prewedding' },
            { id: 'engagement', label: 'Lamaran' },
            { id: 'memories', label: 'Kenangan' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer font-cinzel tracking-wider ${
                filter === cat.id
                  ? 'bg-slate-200 text-zinc-950 font-semibold shadow-md'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
              onClick={() => setActivePhoto(item)}
              className="group relative aspect-4/5 rounded-2xl overflow-hidden cursor-pointer border border-slate-400/25 bg-zinc-900 shadow-md transform hover:-translate-y-1.5 transition-all duration-300 hover:border-slate-300/50"
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-xs font-serif-luxury font-bold text-white">
                  {item.title}
                </span>
                <span className="text-[11px] text-zinc-300 truncate">
                  {item.caption}
                </span>
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-900/70 text-slate-200">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div className="fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-5 right-5 p-3 rounded-full bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors z-20 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 text-slate-200 hover:bg-zinc-800 hover:scale-110 transition-all z-20 cursor-pointer"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-zinc-900/80 text-slate-200 hover:bg-zinc-800 hover:scale-110 transition-all z-20 cursor-pointer"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
              <div className="rounded-2xl overflow-hidden border border-slate-400/30 shadow-2xl max-h-[70vh]">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-contain max-h-[70vh]"
                />
              </div>
              <div className="text-center mt-4 text-zinc-200">
                <h4 className="font-serif-luxury text-lg font-bold text-white">
                  {activePhoto.title}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-lg">
                  {activePhoto.caption}
                </p>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Foto {currentIndex + 1} dari {filteredItems.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
