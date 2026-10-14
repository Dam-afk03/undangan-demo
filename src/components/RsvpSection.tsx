import React, { useState } from 'react';
import {
  Send,
  Users,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Heart,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { WishComment } from '../types/wedding';
import { FloralCornerOrnament, FloralDivider } from './AestheticOrnament';

interface RsvpSectionProps {
  initialGuestName: string;
  wishes: WishComment[];
  onAddWish: (newWish: WishComment) => void;
  onLikeWish: (wishId: string) => void;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  initialGuestName,
  wishes,
  onAddWish,
  onLikeWish,
}) => {
  const [name, setName] = useState(initialGuestName !== 'Tamu Undangan' ? initialGuestName : '');
  const [phone, setPhone] = useState('');
  const [attendance, setAttendance] = useState<'hadir' | 'tidak_hadir' | 'ragu'>('hadir');
  const [pax, setPax] = useState<number>(2);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPass, setSubmittedPass] = useState<{
    token: string;
    name: string;
    pax: number;
    attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  } | null>(null);

  // AI Wish Inspiration Generator
  const generateAiWish = () => {
    const templates = [
      'Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fii khair. Selamat menempuh babak baru yang penuh berkah untuk kedua mempelai!',
      'Selamat menempuh hidup baru sahabatku tercinta! Semoga cinta kalian berdua senantiasa abadi hingga ke jannah.',
      'Dari lubuk hati terdalam, selamat atas ikatan suci ini. Semoga rumah tangga kalian selalu dipenuhi berkah, sakinah mawaddah warahmah.',
      'Pasangan yang sangat serasi! Selamat berbahagia, semoga langkah bersama ini selalu dilindungi dan diridhoi Allah SWT.',
      'Bunga mawar harum mewangi, mekar indah di pagi hari. Bahagia selalu sehidup semati. Sakinah mawaddah warahmah!',
    ];
    const randomWish = templates[Math.floor(Math.random() * templates.length)];
    setMessage(randomWish);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Mohon isi nama lengkap Anda.');
      return;
    }
    if (!message.trim()) {
      alert('Mohon tulis ucapan atau doa restu untuk kedua mempelai.');
      return;
    }

    setIsSubmitting(true);

    // === KONEKSI KE BACKEND LARAGON ===
    fetch('http://localhost:5000/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.trim(),
        attendance: attendance,
        message: message.trim()
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Berhasil masuk database:", data);
      
      // Jika berhasil, jalankan animasi dan tampilan bawaan webnya
      const newWish: WishComment = {
        id: `wish-${Date.now()}`,
        name: name.trim(),
        attendance,
        pax: attendance === 'hadir' ? pax : 0,
        message: message.trim(),
        timestamp: 'Baru saja',
        likes: 0,
      };

      onAddWish(newWish);
      setIsSubmitting(false);

      const token = `PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setSubmittedPass({
        token,
        name: name.trim(),
        pax: attendance === 'hadir' ? pax : 0,
        attendance,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    })
    .catch(err => {
      console.error('Error saat mengirim ke Laragon:', err);
      alert('Gagal mengirim RSVP. Pastikan terminal server.cjs sedang menyala.');
      setIsSubmitting(false);
    });
    // === BATAS KONEKSI ===
  };

  return (
    <section id="rsvp" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-slate-700/40">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Konfirmasi Kehadiran
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            RSVP & Ucapan Doa Restu
          </h2>

          <FloralDivider className="my-3" />

          <p className="max-w-lg mx-auto text-slate-200/80 text-sm font-garamond italic leading-relaxed">
            “Kehadiran dan doa restu Anda merupakan karunia terindah bagi kami. Mohon konfirmasikan kehadiran Anda melalui formulir di bawah ini.”
          </p>
        </motion.div>

        {/* E-Ticket Pass Confirmation Banner (if submitted) */}
        {submittedPass && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-slate-400/50 shadow-2xl text-zinc-100 relative overflow-hidden luxury-silver-glow">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Konfirmasi RSVP Berhasil Dicatat!
                </div>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  E-Pass Undangan: {submittedPass.name}
                </h3>
                <p className="text-xs text-zinc-300">
                  Status: <span className="font-bold text-slate-200 uppercase">{submittedPass.attendance.replace('_', ' ')}</span>
                  {submittedPass.attendance === 'hadir' && ` • Jumlah Tamu: ${submittedPass.pax} Orang`}
                </p>
                <p className="text-[11px] text-zinc-400">
                  Tunjukkan QR Pass ini kepada resepsionis saat tiba di venue untuk check-in instan.
                </p>
              </div>

              {/* QR Code Pass Box */}
              <div className="bg-white p-3 rounded-2xl flex flex-col items-center justify-center shadow-lg text-zinc-900">
                <div className="w-28 h-28 bg-zinc-100 border border-zinc-800 p-1 flex items-center justify-center relative rounded-lg">
                  <QrCode className="w-24 h-24 text-zinc-900" />
                </div>
                <span className="text-[10px] font-mono font-bold text-zinc-700 mt-1">
                  {submittedPass.token}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* RSVP Form Card with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-6 sm:p-10 rounded-3xl bg-zinc-900/80 border border-slate-400/30 backdrop-blur-md shadow-2xl mb-16 luxury-silver-glow"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nama Lengkap Anda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama lengkap Anda..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Nomor WhatsApp / Kontak (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Attendance Choice */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Konfirmasi Kehadiran *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance('hadir')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    attendance === 'hadir'
                      ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-md scale-102'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-xs font-semibold">Ya, Hadir</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('ragu')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    attendance === 'ragu'
                      ? 'bg-slate-800 border-slate-400 text-slate-200 shadow-md scale-102'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-xs font-semibold">Masih Ragu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendance('tidak_hadir')}
                  className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    attendance === 'tidak_hadir'
                      ? 'bg-rose-950/60 border-rose-400 text-rose-300 shadow-md scale-102'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                  <span className="text-xs font-semibold">Tidak Hadir</span>
                </button>
              </div>
            </div>

            {/* Guest Count Pax (only if Hadir) */}
            {attendance === 'hadir' && (
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Jumlah Tamu yang Hadir Bersama Anda:</span>
                  <span className="text-slate-200 font-bold">{pax} Orang</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPax(num)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        pax === num
                          ? 'bg-slate-200 text-zinc-950 shadow-md'
                          : 'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message & AI Helper */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">
                  Ucapan & Doa Restu untuk Mempelai *
                </label>
                <button
                  type="button"
                  onClick={generateAiWish}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-300" />
                  <span>Inspirasi Kata Mutiara / AI</span>
                </button>
              </div>
              <textarea
                required
                rows={4}
                placeholder="Tuliskan doa restu yang tulus dan harapan baik Anda untuk kedua mempelai..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-cinzel border border-white"
            >
              <Send className="w-4 h-4 text-zinc-950" />
              <span>{isSubmitting ? 'Mengirim Konfirmasi...' : 'Kirim RSVP & Ucapan Doa'}</span>
            </button>
          </form>
        </motion.div>

        {/* Wishes Wall (Buku Tamu Digital) with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-300" />
              <span>Buku Tamu & Doa Restu ({wishes.length})</span>
            </h3>
            <span className="text-xs text-zinc-400">Doa terbaru di atas</span>
          </div>

          <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
            {wishes.map((w, i) => (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.05, 0.3), duration: 0.4 }}
                className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-slate-400/40 transition-all shadow-md luxury-silver-glow-hover"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm sm:text-base">
                      {w.name}
                    </h4>
                    <span className="text-[11px] text-zinc-400">{w.timestamp}</span>
                  </div>

                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      w.attendance === 'hadir'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : w.attendance === 'ragu'
                        ? 'bg-slate-800/80 text-slate-200 border-slate-500/30'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {w.attendance === 'hadir'
                      ? `Hadir (${w.pax} Tamu)`
                      : w.attendance === 'ragu'
                      ? 'Ragu'
                      : 'Tidak Hadir'}
                  </span>
                </div>

                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-3 font-sans">
                  {w.message}
                </p>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => onLikeWish(w.id)}
                    className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                      w.isLikedByUser ? 'text-rose-400' : 'text-zinc-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${w.isLikedByUser ? 'fill-rose-500 text-rose-500' : ''}`}
                    />
                    <span>{w.likes || 0} Aamiin</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
