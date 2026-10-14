import React, { useRef, useState } from 'react';
import { Upload, Film, Video, Trash2, CheckCircle2, AlertCircle, Play, X, ExternalLink, Link as LinkIcon } from 'lucide-react';

interface VideoUploadFieldProps {
  label: string;
  videoUrl?: string;
  youtubeUrl?: string;
  videoType?: 'upload' | 'youtube' | 'direct';
  onChangeVideoUrl: (url: string) => void;
  onChangeYoutubeUrl: (url: string) => void;
  onChangeVideoType: (type: 'upload' | 'youtube' | 'direct') => void;
  helperText?: string;
}

export const VideoUploadField: React.FC<VideoUploadFieldProps> = ({
  label,
  videoUrl = '',
  youtubeUrl = '',
  videoType = 'upload',
  onChangeVideoUrl,
  onChangeYoutubeUrl,
  onChangeVideoType,
  helperText,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    }
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Format berkas harus video (MP4, WebM, MOV, AVI).');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setStatusMessage('Sedang memproses video...');

    const reader = new FileReader();
    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Gagal membaca file video.');
    };

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      onChangeVideoUrl(dataUrl);
      onChangeVideoType('upload');
      setIsProcessing(false);
      setStatusMessage(`Video berhasil diupload langsung (${formatFileSize(file.size)})!`);
      setTimeout(() => setStatusMessage(null), 4000);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleVideoFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleVideoFile(file);
    }
  };

  const hasDirectVideo = Boolean(videoUrl && videoUrl.trim());

  return (
    <div className="space-y-3">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-zinc-200 text-xs font-bold flex items-center gap-2">
          <Film className="w-4 h-4 text-slate-300" />
          <span>{label}</span>
        </label>

        {/* Tab switch between Direct Upload and YouTube link */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onChangeVideoType('upload')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              videoType === 'upload'
                ? 'bg-slate-200 text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Video Langsung</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeVideoType('youtube')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              videoType === 'youtube'
                ? 'bg-slate-200 text-zinc-950 font-bold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ExternalLink className="w-3 h-3" />
            <span>Link YouTube</span>
          </button>
        </div>
      </div>

      {videoType === 'upload' ? (
        <div className="space-y-3">
          {/* Direct Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-5 rounded-2xl border-2 border-dashed transition-all text-center ${
              isDragging
                ? 'border-slate-300 bg-slate-900/30'
                : hasDirectVideo
                ? 'border-emerald-500/50 bg-zinc-950/80'
                : 'border-zinc-700 bg-zinc-950/70 hover:border-slate-400/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {hasDirectVideo ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Video className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Video Teaser Berhasil Dimuat</span>
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Tersimpan & siap diputar di halaman undangan tanpa YouTube.
                    </p>
                  </div>
                </div>

                {/* Video Player Preview Inline */}
                <div className="max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800 relative group">
                  <video
                    src={videoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Ganti Video</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeVideoUrl('');
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus Video</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2.5 py-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-600/40 flex items-center justify-center text-slate-300">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-transform active:scale-95 disabled:opacity-50 mx-auto border border-white"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isProcessing ? 'Memproses Berkas...' : 'Pilih Video dari HP / PC'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                  Tarik video langsung ke sini atau klik tombol di atas. Format yang didukung: MP4, WebM, MOV.
                </p>
              </div>
            )}
          </div>

          {/* Atau masukkan direct link file video MP4 jika disimpan di server/CDN */}
          <div className="pt-1">
            <label className="block text-[11px] text-zinc-400 mb-1">
              Atau masukkan Direct URL Video MP4/WebM (Opsional):
            </label>
            <div className="relative">
              <input
                type="text"
                value={videoUrl?.startsWith('data:') ? '' : videoUrl}
                onChange={(e) => {
                  onChangeVideoUrl(e.target.value);
                  onChangeVideoType('upload');
                }}
                placeholder={videoUrl?.startsWith('data:') ? 'Video tersimpan dari upload lokal' : 'https://contoh.com/video-prewedding.mp4'}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 font-mono text-[11px] focus:border-slate-400"
              />
              <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <label className="block text-[11px] text-zinc-400 font-semibold">
            URL Video YouTube / Embed
          </label>
          <div className="relative">
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => onChangeYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 font-mono text-xs focus:border-slate-400"
            />
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-3" />
          </div>
          <p className="text-[10px] text-zinc-500">
            Contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ atau format embed YouTube.
          </p>
        </div>
      )}

      {/* Notifications */}
      {statusMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {helperText && <p className="text-[11px] text-zinc-400">{helperText}</p>}
    </div>
  );
};
