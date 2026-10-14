/**
 * Utility for client-side image compression and conversion to lightweight Data URLs (Base64).
 * This allows direct image upload from mobile gallery/desktop files while keeping
 * localStorage usage well within browser limits.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  fileName: string;
}

export const compressImageFile = (
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<ProcessedImageResult> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih bukan merupakan format gambar'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar'));
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Gagal memuat gambar'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original read if canvas 2d context fails
          resolve({
            dataUrl: src,
            originalSize: file.size,
            compressedSize: file.size,
            width: img.width,
            height: img.height,
            fileName: file.name,
          });
          return;
        }

        // Fill background with white in case of transparent PNG converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to lightweight JPEG data URL
        const mimeType = file.type === 'image/png' ? 'image/jpeg' : file.type;
        const compressedDataUrl = canvas.toDataURL(mimeType, quality);

        // Approximate size calculation
        const head = `data:${mimeType};base64,`;
        const base64Len = compressedDataUrl.length - head.length;
        const compressedBytes = Math.round((base64Len * 3) / 4);

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize: compressedBytes,
          width,
          height,
          fileName: file.name,
        });
      };

      img.src = src;
    };

    reader.readAsDataURL(file);
  });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
