import React, { useState } from 'react';
import {
  Gift,
  Copy,
  Check,
  CreditCard,
  QrCode,
  Sparkles,
  MapPin,
  CheckCircle2,
  Download,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { BANK_ACCOUNTS, WEDDING_CONFIG } from '../data/weddingData';
import { GiftTransaction, BankAccount, WeddingClientConfig } from '../types/wedding';
import { FloralCornerOrnament, FloralDivider } from './AestheticOrnament';

interface DigitalEnvelopeProps {
  onAddWishMessage?: (name: string, message: string) => void;
  bankAccounts?: BankAccount[];
  giftAddress?: WeddingClientConfig['giftAddress'];
  coupleTitle?: string;
  qrisConfig?: WeddingClientConfig['qris'];
}

export const DigitalEnvelopeSection: React.FC<DigitalEnvelopeProps> = ({
  onAddWishMessage,
  bankAccounts,
  giftAddress,
  coupleTitle,
  qrisConfig,
}) => {
  const accountsToDisplay = bankAccounts && bankAccounts.length > 0 ? bankAccounts : BANK_ACCOUNTS;
  const addressData = giftAddress || WEDDING_CONFIG.giftAddress;
  const coupleName = coupleTitle || 'Arya & Anindya';
  const qrisData = qrisConfig || {
    merchantName: `${coupleName.toUpperCase()} WEDDING`,
    qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226610014ID.LINKAJA.WWW01189360091100212345675204581253033605802ID5919RONI+VINA+WEDDING6007JAKARTA6105102706304A1B2',
    nmid: 'ID1020088921471',
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // QRIS Payment Sandbox State
  const [nominal, setNominal] = useState<number>(250000);
  const [customNominal, setCustomNominal] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [blessingNote, setBlessingNote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showQrisModal, setShowQrisModal] = useState<boolean>(false);
  const [activeTransaction, setActiveTransaction] = useState<GiftTransaction | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(
      `${addressData.recipient} | ${addressData.phone}\n${addressData.fullAddress}`
    );
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

  const effectiveAmount = customNominal ? parseInt(customNominal.replace(/\D/g, ''), 10) || 0 : nominal;

  const handleGenerateQris = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveAmount || effectiveAmount < 10000) {
      alert('Nominal minimal adalah Rp 10.000');
      return;
    }
    if (!senderName.trim()) {
      alert('Mohon masukkan nama pengirim');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const txId = `INV-WED-${Date.now().toString().slice(-6)}`;
      const newTx: GiftTransaction = {
        id: txId,
        senderName: senderName.trim(),
        amount: effectiveAmount,
        paymentMethod: 'QRIS / Instant Payment',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'pending',
        receiptCode: `RC-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      };
      setActiveTransaction(newTx);
      setIsProcessing(false);
      setShowQrisModal(true);
      setPaymentSuccess(false);
    }, 600);
  };

  const handleSimulatePaymentConfirm = () => {
    if (!activeTransaction) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setActiveTransaction({
        ...activeTransaction,
        status: 'success',
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (blessingNote.trim() && onAddWishMessage) {
        onAddWishMessage(senderName, `${blessingNote} (Kado Digital: Rp ${effectiveAmount.toLocaleString('id-ID')})`);
      }
    }, 1000);
  };

  return (
    <section id="gift" className="py-28 px-4 bg-zinc-950 text-zinc-100 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-slate-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-300 font-cinzel mb-2">
            Tanda Kasih
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-white font-bold mb-2">
            Amplop Digital & Kado
          </h2>

          <FloralDivider className="my-3" />

          <p className="max-w-lg mx-auto text-slate-200/80 text-sm font-garamond italic leading-relaxed">
            “Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda berkenan memberikan tanda kasih, Anda dapat menyampaikannya melalui saluran digital berikut.”
          </p>
        </motion.div>

        {/* Bank & E-Wallet Transfer Cards Styled as Luxury Metallic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {accountsToDisplay.map((acc, idx) => (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-[2rem] bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-slate-400/35 backdrop-blur-xl shadow-2xl flex flex-col justify-between hover:border-slate-300/60 transition-all luxury-silver-glow relative overflow-hidden group"
            >
              {/* Inner hairline */}
              <div className="absolute inset-2.5 rounded-[1.5rem] border border-slate-400/15 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    {/* Metallic Silver Chip SVG */}
                    <div className="w-10 h-7 rounded-md bg-gradient-to-r from-slate-300 via-white to-slate-400 border border-slate-300/60 p-1 flex items-center justify-center shadow-inner">
                      <div className="w-full h-full border border-zinc-700 rounded-xs grid grid-cols-2 gap-0.5" />
                    </div>
                    <span className="font-serif-luxury font-bold text-white tracking-wider text-lg">{acc.bankName}</span>
                  </div>
                  <span className="text-[10px] tracking-widest font-cinzel text-slate-300 uppercase">
                    {acc.type === 'bank' ? 'Bank Transfer' : 'E-Wallet'}
                  </span>
                </div>

                <div className="bg-zinc-950/80 p-4 rounded-2xl border border-zinc-800 mb-3">
                  <p className="text-xs text-zinc-400 mb-0.5">Nomor Rekening / No. HP:</p>
                  <p className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wider">
                    {acc.accountNumber}
                  </p>
                  <p className="text-xs text-zinc-300 mt-1">
                    a.n. <span className="font-semibold text-slate-200">{acc.accountHolder}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopy(acc.accountNumber, acc.id)}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copiedId === acc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Nomor Rekening Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-300" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Secure QRIS / Instant Payment Gateway Card with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900/90 to-zinc-950/90 border border-slate-400/30 shadow-2xl backdrop-blur-md mb-14 luxury-silver-glow"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-200 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-400/25 mb-2">
                <QrCode className="w-3.5 h-3.5 text-slate-300" />
                <span>Gerbang Pembayaran Instan (QRIS & Virtual Account)</span>
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Kirim Kado Digital Otomatis
              </h3>
              <p className="text-xs text-zinc-400">
                Mendukung seluruh aplikasi M-Banking (BCA, Mandiri, BRI, BNI) dan E-Wallet (GoPay, OVO, ShopeePay, Dana).
              </p>
            </div>
            <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 text-xs text-emerald-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifikasi Otomatis</span>
            </div>
          </div>

          <form onSubmit={handleGenerateQris} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Pilih Nominal Hadiah:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
                {presetAmounts.map((amt) => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setNominal(amt);
                      setCustomNominal('');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer font-cinzel ${
                      nominal === amt && !customNominal
                        ? 'bg-slate-200 text-zinc-950 shadow-md scale-102 font-bold'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                    }`}
                  >
                    Rp {amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Atau ketik nominal lainnya (contoh: 300000)..."
                  value={customNominal}
                  onChange={(e) => {
                    setCustomNominal(e.target.value);
                    setNominal(0);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nama Anda / Pengirim: *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi & Keluarga"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Pesan / Doa Singkat (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Doa untuk kedua mempelai..."
                  value={blessingNote}
                  onChange={(e) => setBlessingNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-100 text-sm focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 font-cinzel border border-white"
            >
              <QrCode className="w-4 h-4 text-zinc-950" />
              <span>
                {isProcessing
                  ? 'Menyiapkan Pembayaran...'
                  : `Lanjutkan Pembayaran (Rp ${effectiveAmount.toLocaleString('id-ID')})`}
              </span>
              <Sparkles className="w-4 h-4 text-zinc-900" />
            </button>
          </form>
        </motion.div>

        {/* Physical Gift Shipping Address Card with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-slate-400/25 backdrop-blur-md shadow-xl text-center luxury-silver-glow"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 border border-slate-400/30 text-slate-200 text-xs font-medium mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-300" />
            Kirim Kado Fisik
          </div>
          <h4 className="font-serif-luxury text-xl font-bold text-white mb-2">
            Alamat Pengiriman Kado
          </h4>
          <p className="text-xs text-zinc-400 mb-4 max-w-md mx-auto">
            {addressData.note}
          </p>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 max-w-lg mx-auto text-left text-xs sm:text-sm text-zinc-300 mb-4 space-y-1">
            <p className="font-bold text-white">{addressData.recipient}</p>
            <p className="text-zinc-300">{addressData.phone}</p>
            <p className="text-zinc-400 leading-relaxed">{addressData.fullAddress}</p>
          </div>

          <button
            onClick={handleCopyAddress}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-slate-200 border border-slate-400/30 transition-all cursor-pointer hover:scale-103"
          >
            {copiedAddress ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Alamat Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-300" />
                <span>Salin Alamat Lengkap</span>
              </>
            )}
          </button>
        </motion.div>

        {/* QRIS Modal & Payment Simulator */}
        {showQrisModal && activeTransaction && (
          <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-zinc-900 border border-slate-400/40 rounded-3xl p-6 sm:p-7 text-zinc-100 shadow-2xl relative">
              {!paymentSuccess ? (
                <>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
                    <div>
                      <h4 className="font-serif-luxury text-xl font-bold text-white">
                        Pembayaran QRIS Sandi Aman
                      </h4>
                      <p className="text-xs text-zinc-400">Order ID: {activeTransaction.id}</p>
                    </div>
                    <button
                      onClick={() => setShowQrisModal(false)}
                      className="text-zinc-400 hover:text-white p-1 text-lg font-bold"
                    >
                      ✕
                    </button>
                  </div>

                  {/* QRIS Code Box */}
                  <div className="bg-white p-5 rounded-2xl flex flex-col items-center justify-center mb-4 text-zinc-950 shadow-inner">
                    <div className="flex items-center justify-between w-full mb-2 px-2 text-zinc-800 font-bold text-xs">
                      <span>QRIS STANDAR NASIONAL</span>
                      <span className="text-red-600 font-extrabold">GPN</span>
                    </div>

                    {/* QR Code Image / Generator */}
                    <div className="w-52 h-52 bg-white border-2 border-zinc-900 p-2 flex items-center justify-center relative rounded-xl shadow-sm">
                      {qrisData.qrisImageUrl ? (
                        <img
                          src={qrisData.qrisImageUrl}
                          alt="QRIS Code"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="grid grid-cols-6 gap-1 w-full h-full p-2 bg-zinc-100 rounded-lg">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                (i % 2 === 0 && i % 3 === 0) || i === 0 || i === 5 || i === 30 || i === 35
                                  ? 'bg-zinc-950'
                                  : (i * 7) % 5 === 0
                                  ? 'bg-zinc-900'
                                  : 'bg-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] text-zinc-800 mt-2 font-bold tracking-wide">
                      {qrisData.merchantName} {qrisData.nmid ? `• NMID: ${qrisData.nmid}` : ''}
                    </p>
                  </div>

                  {/* Transaction Details */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1.5 mb-5">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Pengirim:</span>
                      <span className="font-semibold text-zinc-200">{activeTransaction.senderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Nominal Transfer:</span>
                      <span className="font-bold text-white">
                        Rp {activeTransaction.amount.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Status Pembayaran:</span>
                      <span className="text-slate-300 font-medium">Menunggu Pembayaran</span>
                    </div>
                  </div>

                  {/* Action Simulation Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={handleSimulatePaymentConfirm}
                      disabled={isProcessing}
                      className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>{isProcessing ? 'Memverifikasi Bank...' : 'Konfirmasi Pembayaran Selesai (Simulasi)'}</span>
                    </button>

                    <button
                      onClick={() => setShowQrisModal(false)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                      Batal / Tutup
                    </button>
                  </div>
                </>
              ) : (
                /* E-Receipt Proof */
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <h4 className="font-serif-luxury text-2xl font-bold text-white mb-1">
                    Pembayaran Berhasil!
                  </h4>
                  <p className="text-xs text-zinc-300 mb-5">
                    Terima kasih atas tanda kasih dan doa tulus yang Anda berikan.
                  </p>

                  <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-left text-xs space-y-2 mb-6">
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-zinc-400">Kode Bukti:</span>
                      <span className="font-mono font-bold text-slate-200">{activeTransaction.receiptCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Pengirim:</span>
                      <span className="font-semibold text-zinc-200">{activeTransaction.senderName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Nominal:</span>
                      <span className="font-bold text-emerald-400">Rp {activeTransaction.amount.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Waktu:</span>
                      <span className="text-zinc-300">{activeTransaction.timestamp} WIB</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQrisModal(false)}
                    className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-white text-zinc-950 transition-all cursor-pointer"
                  >
                    Selesai & Simpan Tanda Terima
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
