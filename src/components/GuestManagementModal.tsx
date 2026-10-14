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
  X,
  Sparkles,
  Phone,
  Crown,
} from 'lucide-react';
import { GuestInfo } from '../types/wedding';

interface GuestManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  guests: GuestInfo[];
  onAddGuest: (newGuest: GuestInfo) => void;
}

export const GuestManagementModal: React.FC<GuestManagementModalProps> = ({
  isOpen,
  onClose,
  guests,
  onAddGuest,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'generator'>('guests');
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  
  // Add guest form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGroup, setNewGroup] = useState<'Keluarga' | 'Sahabat' | 'Rekan Kerja' | 'VIP' | 'Umum'>('Sahabat');
  const [newIsVip, setNewIsVip] = useState(false);

  // Link generator state
  const [inviteeName, setInviteeName] = useState('Bpk. Budi Santoso & Keluarga');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const filteredGuests = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase());
    const matchGroup = filterGroup === 'all' || g.group === filterGroup;
    return matchSearch && matchGroup;
  });

  const totalPax = guests.reduce((sum, g) => (g.status === 'hadir' ? sum + g.paxCount : sum), 0);
  const totalHadir = guests.filter((g) => g.status === 'hadir').length;
  const totalRagu = guests.filter((g) => g.status === 'ragu').length;
  const totalTidakHadir = guests.filter((g) => g.status === 'tidak_hadir').length;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.example.com';
  const generatedLink = `${currentUrl}/?to=${encodeURIComponent(inviteeName)}`;

  const waMessage = `Kepada Yth.
*${inviteeName}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*Raden Arya Pratama & Siti Anindya Rahma*
🗓 Minggu, 25 Oktober 2026
📍 Grand Ballroom Hotel Mulia Senayan, Jakarta

Informasi lengkap acara, reservasi kehadiran (RSVP), dan siaran langsung dapat diakses melalui link undangan digital berikut:
${generatedLink}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.
Hormat kami,
Arya & Anindya`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWa = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
    window.open(url, '_blank');
  };

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newGuest: GuestInfo = {
      id: `gst-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim(),
      group: newGroup,
      isVip: newIsVip,
      status: 'pending',
      paxCount: 0,
      qrCodeToken: `WED-${newIsVip ? 'VIP' : 'REG'}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    };

    onAddGuest(newGuest);
    setNewName('');
    setNewPhone('');
  };

  const exportCsv = () => {
    const headers = ['ID', 'Nama Tamu', 'No WhatsApp', 'Kategori', 'VIP', 'Status RSVP', 'Jumlah Pax', 'QR Token'];
    const rows = guests.map((g) => [
      g.id,
      `"${g.name}"`,
      `"${g.phone || ''}"`,
      g.group || 'Umum',
      g.isVip ? 'YA' : 'TIDAK',
      g.status,
      g.paxCount,
      g.qrCodeToken,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `daftar_tamu_rsvp_wedding_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-4xl bg-stone-900 border border-slate-400/40 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-400/30 flex items-center justify-center text-slate-300">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-slate-200">
                Manajemen Tamu Undangan
              </h3>
              <p className="text-xs text-stone-400">
                Daftar Tamu, Status Kehadiran RSVP & Generator Link WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-4 pb-3 border-b border-stone-800 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'guests'
                ? 'bg-slate-200 text-zinc-950 font-bold shadow-md'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Daftar Tamu & RSVP ({guests.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'generator'
                ? 'bg-slate-200 text-zinc-950 font-bold shadow-md'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Generator Undangan WhatsApp</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 mt-4 pr-1">
          {activeTab === 'guests' && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-center">
                  <span className="text-[11px] text-stone-400">Total Tamu</span>
                  <p className="text-xl font-bold text-slate-200 mt-0.5">{guests.length}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-emerald-900/40 text-center">
                  <span className="text-[11px] text-emerald-400">Hadir (Pax)</span>
                  <p className="text-xl font-bold text-emerald-300 mt-0.5">
                    {totalHadir} ({totalPax} pax)
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-zinc-800 text-center">
                  <span className="text-[11px] text-slate-400">Masih Ragu</span>
                  <p className="text-xl font-bold text-slate-300 mt-0.5">{totalRagu}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-stone-950 border border-rose-900/40 text-center">
                  <span className="text-[11px] text-rose-400">Tidak Hadir</span>
                  <p className="text-xl font-bold text-rose-300 mt-0.5">{totalTidakHadir}</p>
                </div>
              </div>

              {/* Add New Guest Form */}
              <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4" /> Tambah Tamu Baru ke Buku Undangan
                </h4>
                <form onSubmit={handleAddGuestSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Nama Lengkap / Gelar..."
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="No. WhatsApp..."
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                  />
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-stone-900 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                  >
                    <option value="Sahabat">Sahabat</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="VIP">VIP</option>
                    <option value="Umum">Umum</option>
                  </select>
                  <button
                    type="submit"
                    className="py-2 px-4 rounded-xl text-xs font-bold bg-slate-200 hover:bg-white text-zinc-950 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Simpan Tamu</span>
                  </button>
                </form>
              </div>

              {/* Filter and Export Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama tamu..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-200 focus:outline-none focus:border-slate-300"
                    />
                  </div>
                  <select
                    value={filterGroup}
                    onChange={(e) => setFilterGroup(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="VIP">Khusus VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                  </select>
                </div>

                <button
                  onClick={exportCsv}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export ke CSV / Excel</span>
                </button>
              </div>

              {/* Table of Guests */}
              <div className="border border-stone-800 rounded-2xl overflow-hidden bg-stone-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-900/80 text-stone-300 border-b border-stone-800 font-semibold">
                    <tr>
                      <th className="p-3">Nama Tamu</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Status Kehadiran</th>
                      <th className="p-3">Pax</th>
                      <th className="p-3">QR Pass</th>
                      <th className="p-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800 text-stone-300">
                    {filteredGuests.map((g) => (
                      <tr key={g.id} className="hover:bg-stone-900/40 transition-colors">
                        <td className="p-3">
                          <div className="font-semibold text-stone-100 flex items-center gap-1.5">
                            {g.isVip && <Crown className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />}
                            <span>{g.name}</span>
                          </div>
                          {g.phone && <span className="text-[11px] text-stone-500">{g.phone}</span>}
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-stone-800 text-[10px] text-stone-300">
                            {g.group || 'Umum'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              g.status === 'hadir'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : g.status === 'ragu'
                                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                : g.status === 'tidak_hadir'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {g.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-300">
                          {g.status === 'hadir' ? `${g.paxCount} Tamu` : '-'}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-stone-400">{g.qrCodeToken}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setInviteeName(g.name);
                              setActiveTab('generator');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-slate-200 hover:text-zinc-950 text-[11px] text-slate-300 transition-colors"
                          >
                            Kirim WA
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-400/30 text-xs text-slate-200">
                ✨ Fitur ini memungkinkan Anda membuat link undangan dengan nama tamu yang dipersonalisasi di sampul cover (contoh: <code>?to=Bpk.+Budi+&+Keluarga</code>).
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Nama Tamu yang Dituju:
                </label>
                <input
                  type="text"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                  placeholder="Contoh: Bpk. Ir. Joko Widodo & Ibu"
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-slate-300 text-sm focus:outline-none focus:border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Link Undangan Personal:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-300 text-xs font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Pratinjau Pesan WhatsApp Otomatis:
                </label>
                <textarea
                  readOnly
                  rows={8}
                  value={waMessage}
                  className="w-full p-4 rounded-xl bg-stone-950 border border-stone-700 text-stone-300 text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShareWa}
                  className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Buka & Kirim Langsung via WhatsApp</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
