import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Trash2, CheckCircle2, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { compressImageFile, formatFileSize } from '../utils/imageUpload';

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  helperText?: string;
  disabled?: boolean;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  maxWidth?: number;
  maxHeight?: number;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  disabled = false,
  aspectRatio = 'portrait',
  maxWidth = 1200,
  maxHeight = 1200,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (disabled) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Pilih berkas format gambar (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMessage(null);
      setStatusMessage('Mengompres & memproses foto...');

      const result = await compressImageFile(file, maxWidth, maxHeight, 0.82);
      onChange(result.dataUrl);

      const savedRatio = Math.round((1 - result.compressedSize / result.originalSize) * 100);
      setStatusMessage(
        `Foto berhasil diunggah (${formatFileSize(result.compressedSize)}${
          savedRatio > 0 ? `, hemat ${savedRatio}%` : ''
        })`
      );
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Gagal memproses gambar');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'landscape'
      ? 'aspect-[4/3]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'aspect-[3/4]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-stone-300 font-semibold text-xs flex items-center gap-1.5">
          <span>{label}</span>
          {disabled && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-600/40">
              <Lock className="w-2.5 h-2.5" />
              Terkunci (Dev Only)
            </span>
          )}
        </label>

        {!disabled && (
          <div className="flex items-center gap-1 bg-stone-950 p-0.5 rounded-lg border border-stone-800 text-[10px]">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                mode === 'upload' ? 'bg-slate-200 text-zinc-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Upload Langsung
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                mode === 'url' ? 'bg-slate-200 text-zinc-950 font-bold' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Tautan URL
            </button>
          </div>
        )}
      </div>

      {/* Main Container */}
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        {/* Preview thumbnail */}
        <div
          className={`relative w-24 sm:w-28 shrink-0 rounded-xl overflow-hidden border ${
            disabled ? 'border-stone-800 bg-stone-950/60 opacity-80' : 'border-stone-700 bg-stone-950'
          } ${aspectClass} flex items-center justify-center group`}
        >
          {value ? (
            <>
              <img
                src={value}
                alt={label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80';
                }}
              />
              {!disabled && (
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 rounded bg-slate-200 hover:bg-white text-zinc-950 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Ganti Foto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ganti</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="p-1 rounded bg-rose-600 text-white text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-2 text-stone-600 flex flex-col items-center">
              <ImageIcon className="w-6 h-6 mb-1 text-stone-600" />
              <span className="text-[9px]">Kosong</span>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 bg-stone-950/80 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-slate-300 animate-spin" />
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="flex-1 w-full space-y-2">
          {disabled ? (
            <div className="p-3 rounded-xl bg-stone-950/80 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-300 shrink-0" />
              <span>Bagian foto ini dikunci. Aktifkan Mode Developer untuk mengubah atau mengunggah foto baru.</span>
            </div>
          ) : (
            <>
              {mode === 'upload' ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-3.5 rounded-xl border-2 border-dashed transition-all text-center ${
                    isDragging
                      ? 'border-slate-300 bg-slate-900/30'
                      : 'border-stone-700 bg-stone-950/70 hover:border-slate-400/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isProcessing ? 'Memproses...' : 'Pilih Foto dari Galeri / File'}</span>
                    </button>
                    <p className="text-[10px] text-stone-400">
                      Bisa langsung klik tombol di atas atau tarik foto ke sini (JPG, PNG, WebP)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      placeholder="https://contoh.com/foto-pernikahan.jpg"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 text-xs font-mono"
                    />
                    <LinkIcon className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                  </div>
                  <p className="text-[10px] text-stone-500">
                    Masukkan URL gambar langsung dari internet atau Unsplash.
                  </p>
                </div>
              )}

              {/* Status or Error Notifications */}
              {statusMessage && (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}

          {helperText && <p className="text-[11px] text-stone-400">{helperText}</p>}
        </div>
      </div>
    </div>
  );
};
