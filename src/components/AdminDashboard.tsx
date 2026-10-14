import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Share2,
  Copy,
  Check,
  FileSpreadsheet,
  ExternalLink,
  Sparkles,
  Phone,
  Crown,
  QrCode,
  DollarSign,
  Heart,
  TrendingUp,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trash2,
  Eye,
  ArrowLeft,
  Calendar,
  Gift,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { GuestInfo, WishComment, GiftTransaction } from '../types/wedding';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  guests: GuestInfo[];
  wishes: WishComment[];
  gifts: GiftTransaction[];
  onAddGuest: (newGuest: GuestInfo) => void;
  onUpdateGuest: (updatedGuest: GuestInfo) => void;
  onDeleteGuest: (guestId: string) => void;
  onDeleteWish: (wishId: string) => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  guests,
  wishes,
  gifts,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  onDeleteWish,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'checkin' | 'gifts' | 'wishes'>('overview');
  
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Add Guest State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGroup, setNewGroup] = useState<'Keluarga' | 'Sahabat' | 'Rekan Kerja' | 'VIP' | 'Umum'>('Sahabat');
  const [newIsVip, setNewIsVip] = useState(false);
  const [newPax, setNewPax] = useState(2);
  const [newStatus, setNewStatus] = useState<'pending' | 'hadir' | 'tidak_hadir' | 'ragu'>('pending');

  // Scanner / Check-in State
  const [scanCodeInput, setScanCodeInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    guest?: GuestInfo;
  } | null>(null);

  // Copy States
  const [copiedSql, setCopiedSql] = useState(false);

  // Summary Metrics
  const totalGuests = guests.length;
  const totalHadir = guests.filter((g) => g.status === 'hadir').length;
  const totalRagu = guests.filter((g) => g.status === 'ragu').length;
  const totalTidakHadir = guests.filter((g) => g.status === 'tidak_hadir').length;
  const totalPending = guests.filter((g) => g.status === 'pending').length;
  const totalPaxHadir = guests.reduce((sum, g) => (g.status === 'hadir' ? sum + g.paxCount : sum), 0);
  const totalCheckedIn = guests.filter((g) => g.isCheckedIn).length;
  const totalGiftAmount = gifts.reduce((sum, g) => (g.status === 'success' ? sum + g.amount : sum), 0);

  // Filtered guest list
  const filteredGuests = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.phone && g.phone.includes(searchQuery)) ||
      g.qrCodeToken.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGroup = filterGroup === 'all' || g.group === filterGroup;
    const matchStatus = filterStatus === 'all' || g.status === filterStatus;
    return matchSearch && matchGroup && matchStatus;
  });

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: GuestInfo = {
      id: `gst-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      group: newGroup,
      isVip: newIsVip,
      status: newStatus,
      paxCount: newStatus === 'hadir' ? newPax : 0,
      qrCodeToken: `WED-${newIsVip ? 'VIP' : 'REG'}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      isCheckedIn: false,
    };

    onAddGuest(newGuest);
    setNewName('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const toggleCheckIn = (guest: GuestInfo) => {
    const updated: GuestInfo = {
      ...guest,
      isCheckedIn: !guest.isCheckedIn,
      checkedInAt: !guest.isCheckedIn ? new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : undefined,
    };
    onUpdateGuest(updated);

    if (updated.isCheckedIn) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCheckInByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const query = scanCodeInput.trim().toUpperCase();
    if (!query) return;

    const found = guests.find((g) => g.qrCodeToken.toUpperCase() === query);
    if (found) {
      if (found.isCheckedIn) {
        setScanResult({
          success: true,
          message: `⚠️ Tamu "${found.name}" SUDAH check-in sebelumnya pada pukul ${found.checkedInAt || '-'}.`,
          guest: found,
        });
      } else {
        const updated: GuestInfo = {
          ...found,
          status: 'hadir',
          isCheckedIn: true,
          checkedInAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        };
        onUpdateGuest(updated);
        setScanResult({
          success: true,
          message: `✅ Check-in BERHASIL! Selamat datang ${found.name} (${found.paxCount || 1} Pax)`,
          guest: updated,
        });
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } else {
      setScanResult({
        success: false,
        message: `❌ Kode Token Pass "${query}" tidak ditemukan di database.`,
      });
    }
    setScanCodeInput('');
  };

  const exportCsv = () => {
    const headers = ['ID', 'Nama Tamu', 'No WhatsApp', 'Kategori', 'VIP', 'Status RSVP', 'Jumlah Pax', 'Check-In', 'Jam Check-In', 'QR Token'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.name}"`,
      `"${g.phone || ''}"`,
      g.group || 'Umum',
      g.isVip ? 'YA' : 'TIDAK',
      g.status,
      g.paxCount,
      g.isCheckedIn ? 'SUDAH' : 'BELUM',
      g.checkedInAt || '-',
      g.qrCodeToken,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_tamu_wedding_arya_anindya_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.example.com';
  const getGuestWaUrl = (guest: GuestInfo) => {
    const inviteUrl = `${currentUrl}/?to=${encodeURIComponent(guest.name)}`;
    const text = `Kepada Yth.
*${guest.name}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*Raden Arya Pratama & Siti Anindya Rahma*
🗓 Minggu, 25 Oktober 2026
📍 Grand Ballroom Hotel Mulia Senayan, Jakarta

Akses undangan digital & RSVP kehadiran:
${inviteUrl}

QR Check-in Pass Anda: *${guest.qrCodeToken}*

Terima kasih.
Hormat kami,
Arya & Anindya`;
    return `https://api.whatsapp.com/send?phone=${guest.phone ? guest.phone.replace(/\D/g, '') : ''}&text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="h-16 px-4 sm:px-6 bg-stone-900 border-b border-slate-400/20 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Kembali ke Undangan Tamu"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Lihat Undangan</span>
          </button>

          <div className="h-6 w-px bg-stone-700" />

          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury font-bold text-base sm:text-lg text-slate-200">
                Dashboard Admin & WO
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                LIVE ONLINE
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block">
              Pernikahan Arya & Anindya • Hotel Mulia Senayan Jakarta
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-stone-950" />
            <span>Tambah Tamu</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700 hidden md:flex items-center gap-1.5 transition-all cursor-pointer"
            title="Download CSV Tamu"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-stone-900/60 border-r border-stone-800 p-3 sm:p-4 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-1.5">
          {[
            { id: 'overview', label: 'Ringkasan & Statistik', icon: TrendingUp },
            { id: 'guests', label: `Daftar Tamu (${guests.length})`, icon: Users },
            { id: 'checkin', label: 'Meja Resepsionis / Check-in', icon: QrCode },
            { id: 'gifts', label: 'Kado & Amplop Digital', icon: Gift },
            { id: 'wishes', label: `Doa Restu (${wishes.length})`, icon: Heart },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 md:shrink text-left cursor-pointer ${
                  isActive
                    ? 'bg-slate-200 text-zinc-950 shadow-md font-bold'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-slate-300'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-stone-950">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Ringkasan & Metrik Utama Acara
                </h2>
                <p className="text-xs text-stone-400">
                  Pemantauan real-time status RSVP, perkiraan katering, kehadiran resepsi, dan kado digital.
                </p>
              </div>

              {/* 5 Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-2xl bg-stone-900 border border-slate-400/20 shadow-md">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-medium">Total Tamu</span>
                    <Users className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-200">{totalGuests}</p>
                  <p className="text-[11px] text-stone-400 mt-1">Undangan terdaftar</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-emerald-500/20 shadow-md">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-medium">Hadir (Pax)</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-300">{totalHadir} ({totalPaxHadir} pax)</p>
                  <p className="text-[11px] text-emerald-400/80 mt-1">Estimasi porsi katering</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-slate-400/20 shadow-md">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-medium">Masih Ragu</span>
                    <HelpCircle className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-2xl font-bold text-slate-300">{totalRagu}</p>
                  <p className="text-[11px] text-stone-400 mt-1">Perlu follow-up</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-blue-500/20 shadow-md">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-medium">Check-In Venue</span>
                    <QrCode className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-blue-300">{totalCheckedIn}</p>
                  <p className="text-[11px] text-stone-400 mt-1">Sudah tiba di lokasi</p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-900 border border-slate-400/30 shadow-md col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-stone-400 mb-1">
                    <span className="text-xs font-medium">Amplop Digital</span>
                    <Gift className="w-4 h-4 text-slate-300" />
                  </div>
                  <p className="text-xl font-bold text-slate-300">
                    Rp {totalGiftAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[11px] text-stone-400 mt-1">{gifts.length} transaksi sukses</p>
                </div>
              </div>

              {/* Progress bars breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md">
                  <h3 className="text-sm font-semibold text-stone-200 mb-4 flex items-center justify-between">
                    <span>Distribusi Kehadiran RSVP</span>
                    <span className="text-xs text-stone-400 font-normal">{totalGuests} Total Tamu</span>
                  </h3>

                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-emerald-400 font-medium">Pasti Hadir</span>
                        <span className="text-stone-300">{totalHadir} ({Math.round((totalHadir / (totalGuests || 1)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(totalHadir / (totalGuests || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300 font-medium">Masih Ragu</span>
                        <span className="text-stone-300">{totalRagu} ({Math.round((totalRagu / (totalGuests || 1)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-slate-400 rounded-full"
                          style={{ width: `${(totalRagu / (totalGuests || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-rose-400 font-medium">Tidak Hadir</span>
                        <span className="text-stone-300">{totalTidakHadir} ({Math.round((totalTidakHadir / (totalGuests || 1)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{ width: `${(totalTidakHadir / (totalGuests || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-stone-400 font-medium">Belum Konfirmasi</span>
                        <span className="text-stone-300">{totalPending} ({Math.round((totalPending / (totalGuests || 1)) * 100)}%)</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
                        <div
                          className="h-full bg-stone-600 rounded-full"
                          style={{ width: `${(totalPending / (totalGuests || 1)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Check-in Scanner widget */}
                <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 shadow-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-stone-200 mb-2 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-300" />
                      <span>Check-In Meja Penerima Tamu Cepat</span>
                    </h3>
                    <p className="text-xs text-stone-400 mb-4">
                      Ketik atau scan kode QR Pass tamu (contoh: <code>WED-VIP-001</code>) untuk check-in instan:
                    </p>

                    <form onSubmit={handleCheckInByCode} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Masukkan token QR (misal: WED-VIP-001)..."
                        value={scanCodeInput}
                        onChange={(e) => setScanCodeInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs font-mono text-slate-300 focus:outline-none focus:border-slate-300"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Check-In</span>
                      </button>
                    </form>

                    {scanResult && (
                      <div
                        className={`p-3 rounded-xl border text-xs ${
                          scanResult.success
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-300'
                        }`}
                      >
                        {scanResult.message}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                    <span>Tamu sudah check-in: <strong className="text-slate-300">{totalCheckedIn} Orang</strong></span>
                    <button
                      onClick={() => setActiveTab('checkin')}
                      className="text-slate-300 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      Buka Mode Resepsionis <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. GUESTS MANAGEMENT TAB */}
          {activeTab === 'guests' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-serif-luxury text-white">
                    Buku Tamu Undangan & RSVP
                  </h2>
                  <p className="text-xs text-stone-400">
                    Kelola data tamu, link undangan personal WhatsApp, status kehadiran, dan token QR.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Tamu Baru</span>
                </button>
              </div>

              {/* Filters toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama tamu, no. telepon, atau token QR..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="VIP">Khusus VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Umum">Umum</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300"
                  >
                    <option value="all">Semua Status RSVP</option>
                    <option value="hadir">Pasti Hadir</option>
                    <option value="ragu">Masih Ragu</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                    <option value="pending">Belum Merespons</option>
                  </select>

                  <button
                    onClick={exportCsv}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    title="Export CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>
                </div>
              </div>

              {/* Guests Table */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-900 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-300 border-b border-stone-800 font-semibold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3.5">Nama Tamu & Gelar</th>
                        <th className="p-3.5">Kategori</th>
                        <th className="p-3.5">Status RSVP</th>
                        <th className="p-3.5">Pax</th>
                        <th className="p-3.5">Token QR</th>
                        <th className="p-3.5">Check-In Meja</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800 text-stone-300">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-stone-500">
                            Tidak ada tamu yang sesuai dengan pencarian atau filter.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g) => (
                          <tr key={g.id} className="hover:bg-stone-800/40 transition-colors">
                            <td className="p-3.5">
                              <div className="font-semibold text-stone-100 flex items-center gap-1.5">
                                {g.isVip && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-400/30">
                                    <Crown className="w-3 h-3 text-slate-300 fill-slate-300" /> VIP
                                  </span>
                                )}
                                <span>{g.name}</span>
                              </div>
                              {g.phone && (
                                <span className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                                  <Phone className="w-3 h-3 text-stone-500" /> {g.phone}
                                </span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 rounded-full bg-stone-800 text-[11px] text-stone-300 border border-stone-700">
                                {g.group || 'Umum'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                  g.status === 'hadir'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : g.status === 'ragu'
                                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                    : g.status === 'tidak_hadir'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                                }`}
                              >
                                {g.status === 'hadir' ? 'HADIR' : g.status === 'ragu' ? 'RAGU' : g.status === 'tidak_hadir' ? 'TIDAK' : 'PENDING'}
                              </span>
                            </td>
                            <td className="p-3.5 font-bold text-slate-300">
                              {g.status === 'hadir' ? `${g.paxCount} Orang` : '-'}
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-stone-400">
                              {g.qrCodeToken}
                            </td>
                            <td className="p-3.5">
                              <button
                                onClick={() => toggleCheckIn(g)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-all ${
                                  g.isCheckedIn
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
                                }`}
                              >
                                {g.isCheckedIn ? (
                                  <>
                                    <Check className="w-3 h-3" />
                                    <span>Sudah ({g.checkedInAt || 'Hadir'})</span>
                                  </>
                                ) : (
                                  <span>Tandai Hadir</span>
                                )}
                              </button>
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={getGuestWaUrl(g)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                  title="Kirim Undangan WhatsApp"
                                >
                                  <Share2 className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => {
                                    const inviteLink = `${currentUrl}/?to=${encodeURIComponent(g.name)}`;
                                    navigator.clipboard.writeText(inviteLink);
                                    alert(`Link personal untuk "${g.name}" berhasil disalin!`);
                                  }}
                                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-slate-300 transition-colors cursor-pointer"
                                  title="Salin Link Personal"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Hapus tamu "${g.name}" dari buku undangan?`)) {
                                      onDeleteGuest(g.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 transition-colors cursor-pointer"
                                  title="Hapus Tamu"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CHECK-IN SCANNER TAB */}
          {activeTab === 'checkin' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Meja Penerima Tamu & Check-in On-The-Spot
                </h2>
                <p className="text-xs text-stone-400">
                  Digunakan oleh tim resepsionis saat acara berlangsung untuk memvalidasi QR Pass tamu dan mencatat kehadiran.
                </p>
              </div>

              {/* Scanner Form */}
              <div className="p-6 rounded-3xl bg-stone-900 border border-slate-400/30 shadow-2xl">
                <form onSubmit={handleCheckInByCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-2">
                      Scan atau Ketik Kode Pass Tamu (QR Token):
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <QrCode className="w-5 h-5 text-slate-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          autoFocus
                          placeholder="Contoh: WED-VIP-001 atau PASS-ABC123"
                          value={scanCodeInput}
                          onChange={(e) => setScanCodeInput(e.target.value)}
                          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-950 border-2 border-slate-400/50 text-slate-300 font-mono text-base font-bold tracking-wider focus:outline-none focus:border-slate-300"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-6 py-3 rounded-2xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <UserCheck className="w-5 h-5" />
                        <span>Verifikasi</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Scan Feedback Banner */}
                {scanResult && (
                  <div className="mt-6 p-4 rounded-2xl bg-stone-950 border border-stone-800">
                    <p className="text-sm font-bold mb-2">{scanResult.message}</p>
                    {scanResult.guest && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-stone-300 bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div>
                          <span className="text-stone-500">Nama:</span>
                          <p className="font-bold text-slate-200">{scanResult.guest.name}</p>
                        </div>
                        <div>
                          <span className="text-stone-500">Kategori:</span>
                          <p className="font-bold">{scanResult.guest.group || 'Umum'} {scanResult.guest.isVip ? '(VIP)' : ''}</p>
                        </div>
                        <div>
                          <span className="text-stone-500">Jumlah Pax:</span>
                          <p className="font-bold text-emerald-400">{scanResult.guest.paxCount || 1} Orang</p>
                        </div>
                        <div>
                          <span className="text-stone-500">Jam Check-In:</span>
                          <p className="font-bold text-blue-400">{scanResult.guest.checkedInAt || 'Sekarang'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Live Checked-In Feed */}
              <div>
                <h3 className="text-sm font-semibold text-stone-200 mb-3 flex items-center justify-between">
                  <span>Daftar Tamu yang Sudah Hadir ({totalCheckedIn})</span>
                  <span className="text-xs text-stone-500">Urutan terupdate</span>
                </h3>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {guests.filter((g) => g.isCheckedIn).length === 0 ? (
                    <div className="p-8 text-center text-stone-500 bg-stone-900 rounded-2xl border border-stone-800">
                      Belum ada tamu yang check-in di meja penerima.
                    </div>
                  ) : (
                    guests
                      .filter((g) => g.isCheckedIn)
                      .map((g) => (
                        <div
                          key={g.id}
                          className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                              ✓
                            </div>
                            <div>
                              <p className="font-bold text-stone-100 text-xs sm:text-sm">{g.name}</p>
                              <p className="text-[11px] text-stone-400">{g.group} • {g.paxCount} Pax • Token: {g.qrCodeToken}</p>
                            </div>
                          </div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">
                            {g.checkedInAt || 'Hadir'} WIB
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. GIFTS TAB */}
          {activeTab === 'gifts' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold font-serif-luxury text-white">
                    Rekap Amplop & Kado Digital
                  </h2>
                  <p className="text-xs text-stone-400">
                    Daftar transfer rekening bank dan transaksi QRIS / instant payment dari para tamu.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800 border border-slate-400/30 text-right">
                  <span className="text-[11px] text-stone-400 uppercase font-semibold">Total Terkumpul:</span>
                  <p className="text-xl font-bold text-slate-300">
                    Rp {totalGiftAmount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-900 shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-300 border-b border-stone-800 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-3.5">Kode Transaksi</th>
                      <th className="p-3.5">Nama Pengirim</th>
                      <th className="p-3.5">Nominal (Rp)</th>
                      <th className="p-3.5">Metode Pembayaran</th>
                      <th className="p-3.5">Waktu</th>
                      <th className="p-3.5">Kode Bukti</th>
                      <th className="p-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {gifts.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-stone-400 font-bold">{item.id}</td>
                        <td className="p-3.5 font-semibold text-stone-100">{item.senderName}</td>
                        <td className="p-3.5 font-bold text-emerald-400 text-sm">
                          Rp {item.amount.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3.5 text-stone-300">{item.paymentMethod}</td>
                        <td className="p-3.5 text-stone-400">{item.timestamp} WIB</td>
                        <td className="p-3.5 font-mono text-[11px] text-slate-300">{item.receiptCode}</td>
                        <td className="p-3.5 text-right">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold uppercase">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. WISHES MODERATION TAB */}
          {activeTab === 'wishes' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div>
                <h2 className="text-xl font-bold font-serif-luxury text-white">
                  Moderasi Ucapan & Doa Restu
                </h2>
                <p className="text-xs text-stone-400">
                  Daftar komentar dan ucapan selamat yang masuk ke Buku Tamu Digital. Anda dapat menghapus atau memoderasi pesan yang kurang pantas.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {wishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-200 text-sm">{w.name}</h4>
                        <span className="text-[10px] text-stone-400">{w.timestamp}</span>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed font-sans mb-3">
                        "{w.message}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-xs">
                      <span className="text-stone-400 flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span>{w.likes || 0} Reaksi Aamiin</span>
                      </span>

                      <button
                        onClick={() => {
                          if (confirm(`Hapus ucapan dari "${w.name}"?`)) {
                            onDeleteWish(w.id);
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-rose-900/60 text-stone-400 hover:text-rose-300 flex items-center gap-1 text-[11px] cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. LARAGON MYSQL & NEXT.JS TAB */}
        </main>
      </div>

      {/* Add Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-slate-400/40 rounded-3xl p-6 text-stone-100 shadow-2xl">
            <h3 className="font-serif-luxury text-xl font-bold text-slate-200 mb-1">
              Tambah Tamu Undangan Baru
            </h3>
            <p className="text-xs text-stone-400 mb-5">
              Data tamu akan langsung ditambahkan ke daftar dan dibuatkan token QR unik.
            </p>

            <form onSubmit={handleAddGuestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nama Tamu & Gelar *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bpk. H. Ahmad Sudirman & Keluarga"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nomor WhatsApp (Opsional)
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Kategori Tamu
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                  >
                    <option value="Sahabat">Sahabat</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="VIP">VIP</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Status RSVP Awal
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                  >
                    <option value="pending">Belum Respon</option>
                    <option value="hadir">Pasti Hadir</option>
                    <option value="ragu">Masih Ragu</option>
                    <option value="tidak_hadir">Tidak Hadir</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5 cursor-pointer">
                  <Crown className="w-4 h-4 text-slate-300" />
                  <span>Tandai sebagai Tamu VIP</span>
                </label>
                <input
                  type="checkbox"
                  checked={newIsVip}
                  onChange={(e) => setNewIsVip(e.target.checked)}
                  className="w-4 h-4 accent-slate-400 rounded cursor-pointer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-xs text-zinc-950 font-bold cursor-pointer"
                >
                  Simpan Tamu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
