import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Flower2 } from 'lucide-react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
}

export const FloatingPetals: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (!isEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colors = [
      'rgba(226, 232, 240, 0.45)', // Ethereal silver
      'rgba(203, 213, 225, 0.4)',  // Moonlit platinum
      'rgba(241, 245, 249, 0.5)',  // Soft pearl white
      'rgba(244, 244, 245, 0.35)', // Frosted zinc
      'rgba(255, 255, 255, 0.3)',  // Pure crystal white
    ];

    const petalCount = Math.min(26, Math.floor(window.innerWidth / 40));
    const petals: Petal[] = [];

    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 6,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 0.9 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      // Organic petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, -p.size * 1.4, 0, -p.size * 2);
      ctx.bezierCurveTo(p.size, -p.size * 1.4, p.size / 2, -p.size, 0, 0);
      ctx.fill();

      // Subtle center vein line
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.2);
      ctx.lineTo(0, -p.size * 1.6);
      ctx.stroke();

      ctx.restore();
    };

    let step = 0;
    const render = () => {
      step++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle twinkling particles
      for (let i = 0; i < 8; i++) {
        const starX = (Math.sin(step * 0.01 + i) * 0.5 + 0.5) * width;
        const starY = (Math.cos(step * 0.012 + i * 2) * 0.5 + 0.5) * height;
        const starSize = Math.sin(step * 0.05 + i) * 1.5 + 1.5;
        if (starSize > 0) {
          ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
          ctx.beginPath();
          ctx.arc(starX, starY, Math.max(0.5, starSize), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw and update petals
      for (const p of petals) {
        drawPetal(p);

        p.x += p.speedX + Math.sin(step * 0.02 + p.y * 0.005) * 0.6;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) {
          p.x = -20;
        } else if (p.x < -20) {
          p.x = width + 20;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isEnabled]);

  return (
    <>
      {isEnabled && (
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-1000"
          style={{ mixBlendMode: 'screen' }}
        />
      )}

      {/* Floating control button to toggle animation */}
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        title={isEnabled ? 'Nonaktifkan Efek Kelopak & Sparkles' : 'Aktifkan Efek Kelopak & Sparkles'}
        className="fixed top-3 right-16 z-40 p-2 rounded-full bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-600/50 backdrop-blur-md shadow-lg transition-transform hover:scale-105 cursor-pointer text-xs flex items-center gap-1.5"
      >
        <Sparkles className={`w-3.5 h-3.5 ${isEnabled ? 'text-slate-200 animate-spin-slow' : 'text-zinc-500'}`} />
        <span className="hidden sm:inline text-[11px] font-medium text-zinc-200">
          {isEnabled ? 'Efek On' : 'Efek Off'}
        </span>
      </button>
    </>
  );
};
