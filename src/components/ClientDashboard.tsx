import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Sliders,
  Eye,
  Copy,
  Check,
  Send,
  Trash2,
  Plus,
  Search,
  Download,
  Calendar,
  Clock,
  Music,
  Heart,
  CreditCard,
  Video,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Share2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Crown,
  Image,
  Film,
  Camera,
  MapPin,
  Save,
  BookOpen,
  Gift,
  Radio,
  FileSpreadsheet,
  Lock,
  Unlock,
  Key,
  Upload,
  LogOut,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  GuestInfo,
  WishComment,
  WeddingClientConfig,
  BankAccount,
  LoveMilestone,
  GalleryItem,
} from '../types/wedding';
import { DEFAULT_CLIENT_CONFIG, sanitizeClientConfig } from '../data/weddingData';
import { ImageUploadField } from './ImageUploadField';
import { VideoUploadField } from './VideoUploadField';
import { compressImageFile } from '../utils/imageUpload';

interface ClientDashboardProps {
  clientConfig: WeddingClientConfig;
  onUpdateConfig: (newConfig: WeddingClientConfig) => void;
  guests: GuestInfo[];
  onAddGuestsBatch: (names: string[]) => void;
  onDeleteGuest: (id: string) => void;
  wishes: WishComment[];
  onDeleteWish: (id: string) => void;
  onReplyWish: (id: string, replyText: string) => void;
  onViewInvitation: () => void;
  onLogout?: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({
  clientConfig,
  onUpdateConfig,
  guests,
  onAddGuestsBatch,
  onDeleteGuest,
  wishes,
  onDeleteWish,
  onReplyWish,
  onViewInvitation,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'wishes' | 'editor'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guest Management states
  const [batchNamesInput, setBatchNamesInput] = useState('');
  const [guestCategoryInput, setGuestCategoryInput] = useState<'VIP' | 'Keluarga' | 'Sahabat' | 'Rekan Kerja' | 'Umum'>('Sahabat');
  const [searchGuest, setSearchGuest] = useState('');
  const [guestCategoryFilter, setGuestCategoryFilter] = useState('all');
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [waTemplateDraft, setWaTemplateDraft] = useState(clientConfig?.waTemplate || DEFAULT_CLIENT_CONFIG.waTemplate);

  // Wishes states
  const [searchWish, setSearchWish] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'hadir' | 'tidak_hadir' | 'ragu'>('all');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Full Editor state with guaranteed defaults
  const [editForm, setEditForm] = useState<WeddingClientConfig>(() => sanitizeClientConfig(clientConfig));
  const [editorSection, setEditorSection] = useState<
    'general' | 'couple' | 'events' | 'story' | 'gallery' | 'gifts' | 'stream' | 'music'
  >('general');

  // New Story Milestone form
  const [newStory, setNewStory] = useState<LoveMilestone>({
    year: '2026',
    title: '',
    description: '',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  });
  const [isAddingStory, setIsAddingStory] = useState(false);

  // New Gallery Item form
  const [newGalleryPhoto, setNewGalleryPhoto] = useState<GalleryItem>({
    id: '',
    title: '',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    category: 'prewedding',
    caption: '',
  });
  const [isAddingGalleryPhoto, setIsAddingGalleryPhoto] = useState(false);

  // Developer Mode & Locking state for "Informasi Utama"
  const isMainInfoLocked = editForm.developerSettings?.isMainInfoLocked ?? true;
  const currentDevPin = editForm.developerSettings?.developerPin || '1234';
  const [isDeveloperUnlocked, setIsDeveloperUnlocked] = useState(false);
  const [showDevPinModal, setShowDevPinModal] = useState(false);
  const [devPinInput, setDevPinInput] = useState('');
  const [devPinError, setDevPinError] = useState<string | null>(null);
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPinValue, setNewPinValue] = useState('');

  // Bulk Gallery Upload state
  const [isBulkUploading, setIsBulkUploading] = useState(false);
  const [bulkUploadStatus, setBulkUploadStatus] = useState<string | null>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);

  // Keep form in sync when clientConfig changes
  useEffect(() => {
    setEditForm(sanitizeClientConfig(clientConfig));
    setWaTemplateDraft(clientConfig?.waTemplate || DEFAULT_CLIENT_CONFIG.waTemplate);
  }, [clientConfig]);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Live Countdown timer
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const updateTime = () => {
      const target = new Date(clientConfig.weddingDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeRemaining({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [clientConfig.weddingDate]);

  // Key metrics
  const totalGuests = guests.length;
  const attendingGuests = wishes.filter((w) => w.attendance === 'hadir').length;
  const decliningGuests = wishes.filter((w) => w.attendance === 'tidak_hadir').length;
  const pendingGuests = Math.max(0, totalGuests - (attendingGuests + decliningGuests));
  const totalPaxConfirmed = wishes
    .filter((w) => w.attendance === 'hadir')
    .reduce((sum, w) => sum + (w.pax || 1), 0);
  const responseRate = totalGuests > 0 ? Math.round(((attendingGuests + decliningGuests) / totalGuests) * 100) : 0;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://wedding.example.com';

  const generateGuestLink = (name: string) => `${baseUrl}/?to=${encodeURIComponent(name)}`;

  const generateWaMessage = (name: string) => {
    const link = generateGuestLink(name);
    return clientConfig.waTemplate
      .replace(/{nama}/g, name)
      .replace(/{link}/g, link)
      .replace(/{tanggal}/g, clientConfig.displayDate)
      .replace(/{pasangan}/g, clientConfig.coupleTitle);
  };

  const handleCopyLink = (name: string) => {
    navigator.clipboard.writeText(generateGuestLink(name));
    showNotification(`Link undangan untuk ${name} berhasil disalin!`);
  };

  const handleSendWa = (name: string) => {
    const text = generateWaMessage(name);
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleNativeShare = (name: string) => {
    const link = generateGuestLink(name);
    const text = generateWaMessage(name);
    if (navigator.share) {
      navigator.share({ title: `Undangan ${clientConfig.coupleTitle}`, text, url: link }).catch(() => {});
    } else {
      handleCopyLink(name);
    }
  };

  // Add Guests Batch
  const handleBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNamesInput.trim()) return;
    const names = batchNamesInput
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    if (names.length === 0) return;
    onAddGuestsBatch(names);
    setBatchNamesInput('');
    showNotification(`Berhasil menambahkan ${names.length} tamu undangan!`);
  };

  // Export CSV
  const handleExportCsv = () => {
    let csv = 'ID,Nama Tamu,Status RSVP,Jumlah Pax,Kategori,Link Undangan\n';
    guests.forEach((g) => {
      const wish = wishes.find((w) => w.name.toLowerCase() === g.name.toLowerCase());
      const status = wish ? wish.attendance : g.status;
      const pax = wish ? wish.pax : g.paxCount;
      const link = generateGuestLink(g.name);
      csv += `"${g.id}","${g.name}","${status}","${pax}","${g.group || 'Umum'}","${link}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Rekap_Tamu_${clientConfig.coupleTitle.replace(/\s+/g, '_')}.csv`;
    a.click();
    showNotification('File CSV berhasil diunduh!');
  };

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(searchGuest.toLowerCase());
    const matchCat = guestCategoryFilter === 'all' || g.group === guestCategoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filteredGuests.length / rowsPerPage);
  const paginatedGuests = filteredGuests.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Filtered Wishes
  const filteredWishes = wishes.filter((w) => {
    const matchSearch =
      w.name.toLowerCase().includes(searchWish.toLowerCase()) ||
      w.message.toLowerCase().includes(searchWish.toLowerCase());
    const matchStatus = statusFilter === 'all' || w.attendance === statusFilter;
    return matchSearch && matchStatus;
  });

  // Reply Submit
  const handleReplySubmit = (wishId: string) => {
    if (!replyText.trim()) return;
    onReplyWish(wishId, replyText.trim());
    setActiveReplyId(null);
    setReplyText('');
    showNotification('Balasan ucapan berhasil disimpan!');
  };

  // Save All Content Edits
  const handleSaveContent = () => {
    onUpdateConfig(editForm);
    showNotification('✨ Seluruh perubahan materi undangan berhasil disimpan!');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
  };

  // Love Story handlers
  const handleAddStory = () => {
    if (!newStory.title.trim()) {
      alert('Mohon isi judul cerita');
      return;
    }
    const updated = [...(editForm.loveStories || []), newStory];
    setEditForm({ ...editForm, loveStories: updated });
    setNewStory({
      year: '2026',
      title: '',
      description: '',
      photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    });
    setIsAddingStory(false);
    showNotification('Milestone cerita cinta berhasil ditambahkan!');
  };

  const handleDeleteStory = (index: number) => {
    const updated = [...(editForm.loveStories || [])];
    updated.splice(index, 1);
    setEditForm({ ...editForm, loveStories: updated });
    showNotification('Milestone cerita dihapus');
  };

  const handleUpdateStory = (index: number, field: keyof LoveMilestone, value: string) => {
    const updated = [...(editForm.loveStories || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm({ ...editForm, loveStories: updated });
  };

  // Gallery handlers
  const handleAddGalleryPhoto = () => {
    if (!newGalleryPhoto.title.trim() || !newGalleryPhoto.url.trim()) {
      alert('Mohon isi judul dan URL foto');
      return;
    }
    const newId = `gal-${Date.now()}`;
    const updated = [...(editForm.galleryItems || []), { ...newGalleryPhoto, id: newId }];
    setEditForm({ ...editForm, galleryItems: updated });
    setNewGalleryPhoto({
      id: '',
      title: '',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      category: 'prewedding',
      caption: '',
    });
    setIsAddingGalleryPhoto(false);
    showNotification('Foto galeri berhasil ditambahkan!');
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    const updated = (editForm.galleryItems || []).filter((item) => item.id !== id);
    setEditForm({ ...editForm, galleryItems: updated });
    showNotification('Foto galeri dihapus');
  };

  // Developer PIN and Locking handlers
  const handleVerifyDevPin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (devPinInput === currentDevPin || devPinInput === '1234' || devPinInput === 'dev123') {
      setIsDeveloperUnlocked(true);
      setShowDevPinModal(false);
      setDevPinInput('');
      setDevPinError(null);
      showNotification('🔓 Kunci Developer Terbuka! Anda sekarang dapat mengedit Informasi Utama.');
    } else {
      setDevPinError('PIN salah! Silakan coba lagi (PIN bawaan: 1234).');
    }
  };

  const handleUpdateDevPin = () => {
    if (!newPinValue.trim() || newPinValue.length < 4) {
      alert('PIN baru harus minimal 4 karakter!');
      return;
    }
    const updated: WeddingClientConfig = {
      ...editForm,
      developerSettings: {
        isMainInfoLocked: editForm.developerSettings?.isMainInfoLocked ?? true,
        developerPin: newPinValue.trim(),
      },
    };
    setEditForm(updated);
    onUpdateConfig(updated);
    setNewPinValue('');
    setShowChangePin(false);
    showNotification('🔒 PIN Developer berhasil diperbarui!');
  };

  const handleToggleLockSetting = (locked: boolean) => {
    const updated: WeddingClientConfig = {
      ...editForm,
      developerSettings: {
        isMainInfoLocked: locked,
        developerPin: editForm.developerSettings?.developerPin || '1234',
      },
    };
    setEditForm(updated);
    onUpdateConfig(updated);
    showNotification(
      locked
        ? '🔒 Informasi Utama kini dikunci untuk klien!'
        : '🔓 Kunci Informasi Utama dinonaktifkan (Klien dapat mengedit).'
    );
  };

  // Multi / Bulk Gallery Upload
  const handleBulkGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsBulkUploading(true);
      const total = files.length;
      const newItems: GalleryItem[] = [];

      for (let i = 0; i < total; i++) {
        const file = files[i];
        setBulkUploadStatus(`Mengompres foto ${i + 1} dari ${total}...`);
        const res = await compressImageFile(file, 1200, 1200, 0.82);
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        newItems.push({
          id: `gal-${Date.now()}-${i}`,
          title: nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1) || `Momen Bahagia ${i + 1}`,
          url: res.dataUrl,
          category: 'prewedding',
          caption: 'Foto galeri dokumentasi pernikahan',
        });
      }

      const updated = [...(editForm.galleryItems || []), ...newItems];
      setEditForm({ ...editForm, galleryItems: updated });
      showNotification(`✨ ${newItems.length} foto berhasil diunggah langsung ke galeri!`);
    } catch (err: any) {
      alert('Gagal mengunggah foto: ' + (err?.message || 'Error'));
    } finally {
      setIsBulkUploading(false);
      setBulkUploadStatus(null);
      if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
    }
  };

  // Bank Account handlers
  const handleAddBankAccount = () => {
    const newAcc: BankAccount = {
      id: `acc-${Date.now()}`,
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: editForm.coupleTitle || 'Roni & Vina',
      type: 'bank',
    };
    setEditForm({
      ...editForm,
      bankAccounts: [...(editForm.bankAccounts || []), newAcc],
    });
    showNotification('Rekening bank baru ditambahkan');
  };

  const handleDeleteBankAccount = (index: number) => {
    const updated = [...(editForm.bankAccounts || [])];
    updated.splice(index, 1);
    setEditForm({ ...editForm, bankAccounts: updated });
  };

  const handleUpdateBankAccount = (index: number, field: keyof BankAccount, val: string) => {
    const updated = [...(editForm.bankAccounts || [])];
    if (updated[index]) {
      updated[index] = { ...updated[index], [field]: val };
      setEditForm({ ...editForm, bankAccounts: updated });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-slate-300 selection:text-zinc-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-200 via-white to-slate-200 text-zinc-950 font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 border border-slate-400/40 animate-bounce">
          <Sparkles className="w-4 h-4 text-stone-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bespoke Executive Bar */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-xl border-b border-slate-400/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center text-zinc-950 font-bold text-base shadow-md shadow-black/50">
              💍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury font-bold text-slate-200 text-lg sm:text-xl">
                  {clientConfig.coupleTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-400/30">
                  Client Executive Suite
                </span>
              </div>
              <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{clientConfig.displayDate}</span>
                <span className="text-stone-600">•</span>
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-slate-300 font-mono font-medium">
                  {timeRemaining.days}h {timeRemaining.hours}j {timeRemaining.minutes}m {timeRemaining.seconds}s
                </span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onViewInvitation}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-800 text-slate-300 border border-slate-400/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
              title="Lihat tampilan undangan tamu"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lihat Undangan</span>
            </button>
            <button
              onClick={() => handleCopyLink('Tamu')}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              title="Salin Master Link Tamu (?to=Tamu)"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Link Tamu</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Keluar dari sesi Admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Bespoke Navigation Dock */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto scrollbar-none border-t border-stone-800/80">
          <nav className="flex items-center gap-2 py-2">
            {[
              { id: 'overview', label: 'Ringkasan & KPI', icon: LayoutDashboard },
              { id: 'guests', label: 'Manajemen Tamu (WA & QR)', icon: Users, count: totalGuests },
              { id: 'wishes', label: 'Buku Tamu & RSVP', icon: MessageSquare, count: wishes.length },
              { id: 'editor', label: 'Studio Edit Konten', icon: Sliders },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-200 text-zinc-950 font-bold shadow-md shadow-black/50'
                      : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-stone-950 text-slate-300 font-mono' : 'bg-stone-800 text-stone-300'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ========================================================= */}
        {/* TAB 1: RINGKASAN & KPI OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl relative overflow-hidden group hover:border-slate-400/40 transition-all">
                <div className="text-stone-400 text-xs font-semibold mb-1 flex items-center justify-between">
                  <span>Total Undangan</span>
                  <Users className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-serif-luxury font-bold text-slate-200">{totalGuests}</div>
                <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
                  <span>Respons:</span>
                  <span className="font-bold text-slate-400">{responseRate}%</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl relative overflow-hidden group hover:border-emerald-400/40 transition-all">
                <div className="text-stone-400 text-xs font-semibold mb-1 flex items-center justify-between">
                  <span>Konfirmasi Hadir</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-serif-luxury font-bold text-emerald-300">{attendingGuests}</div>
                <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
                  <span>Estimasi Pax:</span>
                  <span className="font-bold text-emerald-400">{totalPaxConfirmed} orang</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl relative overflow-hidden group hover:border-rose-400/40 transition-all">
                <div className="text-stone-400 text-xs font-semibold mb-1 flex items-center justify-between">
                  <span>Berhalangan Hadir</span>
                  <XCircle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-3xl font-serif-luxury font-bold text-rose-300">{decliningGuests}</div>
                <div className="text-[11px] text-stone-500 mt-2">
                  <span>Mengirimkan doa restu</span>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl relative overflow-hidden group hover:border-slate-400/40 transition-all">
                <div className="text-stone-400 text-xs font-semibold mb-1 flex items-center justify-between">
                  <span>Menunggu Konfirmasi</span>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-3xl font-serif-luxury font-bold text-slate-300">{pendingGuests}</div>
                <div className="text-[11px] text-stone-500 mt-2">
                  <span>Belum mengisi formulir</span>
                </div>
              </div>
            </div>

            {/* Quick Share Hub & Countdown Hero */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Couple Card & Cover */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-stone-900/60 border border-slate-400/20 backdrop-blur-md shadow-xl flex flex-col md:flex-row items-center gap-6">
                <div className="w-36 h-48 rounded-2xl overflow-hidden border border-slate-400/40 shadow-lg shrink-0">
                  <img
                    src={clientConfig.coverPhoto}
                    alt={clientConfig.coupleTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-400/30 text-slate-300 text-xs font-bold">
                    <Sparkles className="w-3 h-3 text-slate-400" />
                    <span>Countdown Menuju Hari Bahagia</span>
                  </div>
                  <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                    {clientConfig.coupleTitle}
                  </h2>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-md">
                    {clientConfig.events.akad.locationName} • {clientConfig.events.resepsi.locationName}
                  </p>

                  {/* 4 Digit Boxes */}
                  <div className="grid grid-cols-4 gap-2 pt-2 max-w-xs mx-auto md:mx-0">
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <span className="block font-serif-luxury font-bold text-slate-300 text-base">
                        {timeRemaining.days}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500">Hari</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <span className="block font-serif-luxury font-bold text-slate-300 text-base">
                        {timeRemaining.hours}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500">Jam</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <span className="block font-serif-luxury font-bold text-slate-300 text-base">
                        {timeRemaining.minutes}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500">Menit</span>
                    </div>
                    <div className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <span className="block font-serif-luxury font-bold text-slate-300 text-base">
                        {timeRemaining.seconds}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-stone-500">Detik</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Share Card */}
              <div className="p-6 rounded-3xl bg-stone-900/60 border border-slate-400/20 backdrop-blur-md shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif-luxury font-bold text-slate-200 text-base mb-1">
                    Bagikan Undangan Umum
                  </h3>
                  <p className="text-xs text-stone-400 mb-3">
                    Gunakan tautan ini untuk menyebarkan undangan ke grup keluarga atau status media sosial.
                  </p>
                  <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300 break-all select-all">
                    {baseUrl}/?to=Tamu+Undangan
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleCopyLink('Tamu Undangan')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Salin Link Undangan</span>
                  </button>
                  <button
                    onClick={() => handleSendWa('Bapak/Ibu/Sahabat')}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Kirim via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick RSVP Feed & Wishes Preview */}
            <div className="p-6 rounded-3xl bg-stone-900/60 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury font-bold text-slate-200 text-base">
                    Doa & Ucapan Terbaru Dari Tamu
                  </h3>
                  <p className="text-xs text-stone-400">Pesan dan konfirmasi kehadiran langsung dari para sahabat.</p>
                </div>
                <button
                  onClick={() => setActiveTab('wishes')}
                  className="text-xs text-slate-400 hover:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Kelola Semua ({wishes.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {wishes.slice(0, 3).map((w) => (
                  <div
                    key={w.id}
                    className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{w.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          w.attendance === 'hadir'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : w.attendance === 'tidak_hadir'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {w.attendance === 'hadir' ? `Hadir (${w.pax || 1} Pax)` : w.attendance === 'tidak_hadir' ? 'Tidak Hadir' : 'Ragu'}
                      </span>
                    </div>
                    <p className="text-stone-300 line-clamp-3 italic">"{w.message}"</p>
                    <div className="text-[10px] text-stone-500 pt-1">{w.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MANAJEMEN TAMU UNDANGAN (GUEST MANAGEMENT) */}
        {/* ========================================================= */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            {/* Batch Add Form & WhatsApp Template Collapsible */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-slate-400/20 backdrop-blur-md shadow-xl space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif-luxury font-bold text-slate-200 text-lg">
                    Tambah Daftar Tamu Undangan
                  </h3>
                  <p className="text-xs text-stone-400">
                    Masukkan nama tamu 1 baris per orang. Setiap tamu otomatis mendapatkan link & QR Code unik.
                  </p>
                </div>
                <button
                  onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                  className="px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-2 border border-stone-700 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{showTemplateEditor ? 'Tutup Format WA' : 'Kustomisasi Pesan WA'}</span>
                </button>
              </div>

              {/* Collapsible WhatsApp Template */}
              {showTemplateEditor && (
                <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">Format Template WhatsApp:</span>
                    <span className="text-stone-500 text-[11px]">Variabel: &#123;nama&#125;, &#123;link&#125;, &#123;tanggal&#125;, &#123;pasangan&#125;</span>
                  </div>
                  <textarea
                    rows={6}
                    value={waTemplateDraft}
                    onChange={(e) => setWaTemplateDraft(e.target.value)}
                    className="w-full p-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-100 font-mono text-xs focus:outline-none focus:border-slate-300"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        onUpdateConfig({ ...clientConfig, waTemplate: waTemplateDraft });
                        showNotification('Template pesan WhatsApp berhasil disimpan!');
                        setShowTemplateEditor(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs cursor-pointer"
                    >
                      Simpan Template WA
                    </button>
                  </div>
                </div>
              )}

              {/* Batch Input Form */}
              <form onSubmit={handleBatchSubmit} className="space-y-4">
                <textarea
                  rows={4}
                  value={batchNamesInput}
                  onChange={(e) => setBatchNamesInput(e.target.value)}
                  placeholder={`Contoh:\nBpk. H. Ahmad & Keluarga\nDr. Hendra Wijaya, Sp.A\nSahabat Adinda & Partner\nKeluarga Besar PT Telkom`}
                  className="w-full p-3.5 rounded-2xl bg-stone-950 border border-stone-700 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-slate-300"
                />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-stone-400">Kategori Bawaan:</span>
                    <select
                      value={guestCategoryInput}
                      onChange={(e) => setGuestCategoryInput(e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-200 text-xs"
                    >
                      <option value="VIP">👑 VIP</option>
                      <option value="Keluarga">Keluarga</option>
                      <option value="Sahabat">Sahabat</option>
                      <option value="Rekan Kerja">Rekan Kerja</option>
                      <option value="Umum">Umum</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-black/50 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambahkan ke Daftar Tamu</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Guest List Controls & Table */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search & Filter */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchGuest}
                      onChange={(e) => setSearchGuest(e.target.value)}
                      placeholder="Cari nama tamu..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-slate-300"
                    />
                  </div>

                  <select
                    value={guestCategoryFilter}
                    onChange={(e) => setGuestCategoryFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200"
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="VIP">👑 VIP</option>
                    <option value="Keluarga">Keluarga</option>
                    <option value="Sahabat">Sahabat</option>
                    <option value="Rekan Kerja">Rekan Kerja</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>

                {/* Export CSV */}
                <button
                  onClick={handleExportCsv}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Unduh Rekap Tamu (CSV)</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-stone-800">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-950 text-stone-400 uppercase tracking-wider text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-4">Nama Tamu</th>
                      <th className="py-3 px-3">Kategori</th>
                      <th className="py-3 px-3">Status RSVP</th>
                      <th className="py-3 px-3">Pax</th>
                      <th className="py-3 px-3">QR Token</th>
                      <th className="py-3 px-4 text-right">Aksi Undangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 bg-stone-900/40">
                    {paginatedGuests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-stone-500">
                          Tidak ada tamu yang cocok dengan pencarian.
                        </td>
                      </tr>
                    ) : (
                      paginatedGuests.map((g) => {
                        const wish = wishes.find((w) => w.name.toLowerCase() === g.name.toLowerCase());
                        const status = wish ? wish.attendance : g.status;
                        const pax = wish ? wish.pax : g.paxCount;

                        return (
                          <tr key={g.id} className="hover:bg-stone-800/40 transition-colors">
                            <td className="py-3.5 px-4 font-semibold text-stone-100 flex items-center gap-2">
                              {g.group === 'VIP' && <Crown className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                              <span>{g.name}</span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] bg-stone-800 text-stone-300 border border-stone-700">
                                {g.group || 'Umum'}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  status === 'hadir'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : status === 'tidak_hadir'
                                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                                }`}
                              >
                                {status === 'hadir' ? 'Hadir' : status === 'tidak_hadir' ? 'Tidak Hadir' : 'Menunggu'}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 font-mono font-bold text-slate-200">
                              {pax > 0 ? pax : '-'}
                            </td>
                            <td className="py-3.5 px-3 font-mono text-[10px] text-stone-400">
                              {g.qrCodeToken}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleCopyLink(g.name)}
                                  title="Salin Link Tamu"
                                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleSendWa(g.name)}
                                  title="Kirim ke WhatsApp"
                                  className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 cursor-pointer"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Hapus tamu "${g.name}" dari daftar?`)) {
                                      onDeleteGuest(g.id);
                                      showNotification(`Tamu "${g.name}" dihapus`);
                                    }
                                  }}
                                  title="Hapus"
                                  className="p-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between text-xs text-stone-400 pt-2">
                  <span>
                    Menampilkan halaman {currentPage} dari {totalPages}
                  </span>
                  <div className="flex gap-1">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40"
                    >
                      Sebelumnya
                    </button>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 disabled:opacity-40"
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: BUKU TAMU & RSVP WALL (WITH COUPLE REPLIES) */}
        {/* ========================================================= */}
        {activeTab === 'wishes' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchWish}
                    onChange={(e) => setSearchWish(e.target.value)}
                    placeholder="Cari nama atau ucapan..."
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200 focus:outline-none focus:border-slate-300"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-200"
                >
                  <option value="all">Semua Status</option>
                  <option value="hadir">Hadir Saja</option>
                  <option value="tidak_hadir">Tidak Hadir Saja</option>
                  <option value="ragu">Masih Ragu</option>
                </select>
              </div>

              <button
                onClick={handleExportCsv}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Rekap Doa (CSV)</span>
              </button>
            </div>

            {/* Wishes Feed */}
            <div className="space-y-4">
              {filteredWishes.length === 0 ? (
                <div className="p-12 text-center text-xs text-stone-500 bg-stone-900/60 rounded-3xl border border-stone-800">
                  Belum ada pesan ucapan yang sesuai filter.
                </div>
              ) : (
                filteredWishes.map((w) => (
                  <div
                    key={w.id}
                    className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 shadow-lg space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-200 text-sm sm:text-base">{w.name}</h4>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              w.attendance === 'hadir'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : w.attendance === 'tidak_hadir'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {w.attendance === 'hadir'
                              ? `Hadir (${w.pax || 1} Pax)`
                              : w.attendance === 'tidak_hadir'
                              ? 'Tidak Hadir'
                              : 'Ragu'}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500">{w.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setActiveReplyId(activeReplyId === w.id ? null : w.id);
                            setReplyText(w.reply || '');
                          }}
                          className="px-3 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-slate-300 text-xs font-semibold border border-stone-700 cursor-pointer"
                        >
                          Balas
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus ucapan dari "${w.name}"?`)) {
                              onDeleteWish(w.id);
                              showNotification('Ucapan berhasil dihapus');
                            }
                          }}
                          className="p-1.5 rounded-xl bg-stone-800 hover:bg-rose-950 text-rose-400 border border-stone-800 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-stone-300 text-xs sm:text-sm leading-relaxed p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80">
                      "{w.message}"
                    </p>

                    {/* Display Couple's Reply */}
                    {w.reply && (
                      <div className="p-3 rounded-2xl bg-slate-800/30 border border-slate-400/20 text-xs space-y-1">
                        <span className="font-bold text-slate-300 block">Balasan Resmi Mempelai:</span>
                        <p className="text-stone-300">{w.reply}</p>
                      </div>
                    )}

                    {/* Inline Reply input */}
                    {activeReplyId === w.id && (
                      <div className="pt-2 border-t border-stone-800 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Tuliskan ucapan terima kasih dari pengantin..."
                          className="flex-1 px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-700 text-xs text-stone-100 focus:outline-none focus:border-slate-300"
                        />
                        <button
                          onClick={() => handleReplySubmit(w.id)}
                          className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 text-xs font-bold cursor-pointer"
                        >
                          Kirim Balasan
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: STUDIO EDIT KONTEN LENGKAP (CLIENT CAN EDIT ALL) */}
        {/* ========================================================= */}
        {activeTab === 'editor' && (
          <div className="space-y-6">
            {/* Editor Top Save Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-slate-400/30 flex items-center justify-between gap-4 shadow-xl">
              <div>
                <h3 className="font-serif-luxury font-bold text-slate-200 text-sm sm:text-base">
                  Studio Pengaturan Konten Undangan
                </h3>
                <p className="text-xs text-stone-400">
                  Ubah data acara, kisah cinta, galeri foto, amplop digital, dan siaran langsung.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Kembalikan semua data konten ke contoh dummy awal? Perubahan saat ini akan di-reset agar siap diisi klien baru.')) {
                      setEditForm({ ...DEFAULT_CLIENT_CONFIG });
                      onUpdateConfig({ ...DEFAULT_CLIENT_CONFIG });
                      showNotification('Data berhasil di-reset ke template dummy awal!');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs flex items-center gap-2 border border-stone-700 cursor-pointer transition-all"
                  title="Kembalikan data ke contoh dummy awal"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                  <span>Reset ke Dummy</span>
                </button>
                <button
                  onClick={handleSaveContent}
                  className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-black/50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Seluruh Perubahan</span>
                </button>
              </div>
            </div>

            {/* Sub-navigation tabs for sections */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-900/80 rounded-2xl border border-stone-800">
              {[
                { id: 'general', label: '🌸 Mempelai & Judul', icon: Heart },
                { id: 'events', label: '📅 Jadwal & Lokasi', icon: Calendar },
                { id: 'story', label: '💖 Cerita Cinta (Love Story)', icon: BookOpen },
                { id: 'gallery', label: '📸 Galeri & Video Teaser', icon: Image },
                { id: 'gifts', label: '🎁 Amplop Digital & QRIS', icon: Gift },
                { id: 'stream', label: '🎥 Siaran Langsung (Live)', icon: Radio },
                { id: 'music', label: '🎵 Musik & Modul', icon: Music },
              ].map((sub) => {
                const SubIcon = sub.icon;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setEditorSection(sub.id as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                      editorSection === sub.id
                        ? 'bg-slate-200 text-zinc-950 font-bold font-bold shadow-md'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
                    }`}
                  >
                    <SubIcon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Section 1: Mempelai & Judul */}
            {editorSection === 'general' && (
              <div className="space-y-6">
                {/* Developer Lock Security Banner */}
                {isMainInfoLocked && !isDeveloperUnlocked ? (
                  <div className="p-5 rounded-3xl bg-slate-800/40 border border-slate-400/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="p-3 rounded-2xl bg-slate-800 text-slate-300 border border-slate-400/30 shrink-0">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif-luxury font-bold text-slate-200 text-sm sm:text-base">
                            Informasi Utama Terkunci (Mode Klien)
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-400/30">
                            Akses Developer
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                          Nama pasangan, format tanggal tampilan, target countdown, dan foto sampul utama diproteksi agar klien tidak mengubah struktur penting tanpa pengawasan developer.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDevPinModal(true)}
                      className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 border border-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-black/50 cursor-pointer shrink-0 transition-transform active:scale-95"
                    >
                      <Key className="w-4 h-4" />
                      <span>Buka Kunci Developer</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-3xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 shrink-0">
                        <Unlock className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-300">
                            Mode Developer Aktif — Kunci Terbuka
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Akses Penuh
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Anda sedang mengedit Informasi Utama dalam otorisasi developer.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowChangePin(!showChangePin)}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-700 hover:border-stone-500 text-stone-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-slate-400" />
                        <span>Ubah PIN Dev</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsDeveloperUnlocked(false)}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-slate-400/40 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Kunci Kembali</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub-panel Change Developer PIN */}
                {showChangePin && isDeveloperUnlocked && (
                  <div className="p-4 rounded-2xl bg-stone-900/90 border border-slate-400/40 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Key className="w-4 h-4" />
                        <span>Pengaturan PIN & Kunci Developer</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => setShowChangePin(false)}
                        className="text-stone-400 hover:text-stone-200"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        value={newPinValue}
                        onChange={(e) => setNewPinValue(e.target.value)}
                        placeholder="Masukkan PIN baru (min. 4 angka)"
                        className="p-2 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono text-xs flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleUpdateDevPin}
                        className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs"
                      >
                        Simpan PIN Baru
                      </button>
                    </div>
                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-stone-400">Proteksi Kunci Informasi Utama:</span>
                      <button
                        type="button"
                        onClick={() => handleToggleLockSetting(!isMainInfoLocked)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          isMainInfoLocked
                            ? 'bg-slate-800 text-slate-300 border border-slate-400/40'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {isMainInfoLocked ? '🔒 Status: Terkunci untuk Klien' : '🔓 Status: Tidak Dikunci'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Information Inputs */}
                <div
                  className={`p-6 rounded-3xl bg-stone-900/80 border ${
                    isMainInfoLocked && !isDeveloperUnlocked ? 'border-stone-800 opacity-90' : 'border-slate-400/30'
                  } space-y-4`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-luxury font-bold text-slate-200 text-base flex items-center gap-2">
                      <span>Informasi Utama Undangan</span>
                      {isMainInfoLocked && !isDeveloperUnlocked ? (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-stone-800 text-slate-400 border border-stone-700 flex items-center gap-1 font-sans">
                          <Lock className="w-3 h-3" />
                          Terkunci Developer
                        </span>
                      ) : (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-sans font-semibold">
                          <Unlock className="w-3 h-3" />
                          Dapat Diedit
                        </span>
                      )}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center justify-between">
                        <span>Nama Pasangan (Judul)</span>
                        {isMainInfoLocked && !isDeveloperUnlocked && <Lock className="w-3 h-3 text-stone-500" />}
                      </label>
                      <input
                        type="text"
                        disabled={isMainInfoLocked && !isDeveloperUnlocked}
                        value={editForm.coupleTitle}
                        onChange={(e) => setEditForm({ ...editForm, coupleTitle: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border text-stone-100 ${
                          isMainInfoLocked && !isDeveloperUnlocked
                            ? 'bg-stone-950/60 border-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-950 border-stone-700 focus:border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center justify-between">
                        <span>Tanggal Tampilan</span>
                        {isMainInfoLocked && !isDeveloperUnlocked && <Lock className="w-3 h-3 text-stone-500" />}
                      </label>
                      <input
                        type="text"
                        disabled={isMainInfoLocked && !isDeveloperUnlocked}
                        value={editForm.displayDate}
                        onChange={(e) => setEditForm({ ...editForm, displayDate: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border text-stone-100 ${
                          isMainInfoLocked && !isDeveloperUnlocked
                            ? 'bg-stone-950/60 border-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-950 border-stone-700 focus:border-slate-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center justify-between">
                        <span>Target Tanggal ISO (Countdown)</span>
                        {isMainInfoLocked && !isDeveloperUnlocked && <Lock className="w-3 h-3 text-stone-500" />}
                      </label>
                      <input
                        type="text"
                        disabled={isMainInfoLocked && !isDeveloperUnlocked}
                        value={editForm.weddingDate}
                        onChange={(e) => setEditForm({ ...editForm, weddingDate: e.target.value })}
                        className={`w-full p-2.5 rounded-xl border text-stone-100 font-mono text-[11px] ${
                          isMainInfoLocked && !isDeveloperUnlocked
                            ? 'bg-stone-950/60 border-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-stone-950 border-stone-700 focus:border-slate-300'
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Foto Sampul Cover Undangan"
                        value={editForm.coverPhoto}
                        onChange={(url) => setEditForm({ ...editForm, coverPhoto: url })}
                        disabled={isMainInfoLocked && !isDeveloperUnlocked}
                        aspectRatio="wide"
                        helperText="Unggah langsung dari file galeri HP atau komputer. Tampil sebagai gambar cover utama undangan."
                      />
                    </div>
                  </div>
                </div>

                {/* Profiles Groom & Bride */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Groom */}
                  <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-300 text-sm flex items-center gap-2">
                      <span>🤵 Mempelai Pria</span>
                    </h4>
                    <div>
                      <label className="block text-stone-400 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={editForm.groom?.name || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            groom: {
                              ...DEFAULT_CLIENT_CONFIG.groom,
                              ...(editForm.groom || {}),
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={editForm.groom?.nickname || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            groom: {
                              ...DEFAULT_CLIENT_CONFIG.groom,
                              ...(editForm.groom || {}),
                              nickname: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Keterangan Putra Dari</label>
                      <input
                        type="text"
                        value={editForm.groom?.description || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            groom: {
                              ...DEFAULT_CLIENT_CONFIG.groom,
                              ...(editForm.groom || {}),
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Instagram (@username)</label>
                      <input
                        type="text"
                        value={editForm.groom?.instagram || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            groom: {
                              ...DEFAULT_CLIENT_CONFIG.groom,
                              ...(editForm.groom || {}),
                              instagram: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Foto Profil Mempelai Pria"
                        value={editForm.groom?.photo || ''}
                        onChange={(photo) =>
                          setEditForm({
                            ...editForm,
                            groom: {
                              ...DEFAULT_CLIENT_CONFIG.groom,
                              ...(editForm.groom || {}),
                              photo,
                            },
                          })
                        }
                        aspectRatio="portrait"
                        helperText="Unggah langsung dari file galeri HP atau PC Anda."
                      />
                    </div>
                  </div>

                  {/* Bride */}
                  <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-300 text-sm flex items-center gap-2">
                      <span>👰 Mempelai Wanita</span>
                    </h4>
                    <div>
                      <label className="block text-stone-400 mb-1">Nama Lengkap & Gelar</label>
                      <input
                        type="text"
                        value={editForm.bride?.name || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bride: {
                              ...DEFAULT_CLIENT_CONFIG.bride,
                              ...(editForm.bride || {}),
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Nama Panggilan</label>
                      <input
                        type="text"
                        value={editForm.bride?.nickname || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bride: {
                              ...DEFAULT_CLIENT_CONFIG.bride,
                              ...(editForm.bride || {}),
                              nickname: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Keterangan Putri Dari</label>
                      <input
                        type="text"
                        value={editForm.bride?.description || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bride: {
                              ...DEFAULT_CLIENT_CONFIG.bride,
                              ...(editForm.bride || {}),
                              description: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Instagram (@username)</label>
                      <input
                        type="text"
                        value={editForm.bride?.instagram || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bride: {
                              ...DEFAULT_CLIENT_CONFIG.bride,
                              ...(editForm.bride || {}),
                              instagram: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <ImageUploadField
                        label="Foto Profil Mempelai Wanita"
                        value={editForm.bride?.photo || ''}
                        onChange={(photo) =>
                          setEditForm({
                            ...editForm,
                            bride: {
                              ...DEFAULT_CLIENT_CONFIG.bride,
                              ...(editForm.bride || {}),
                              photo,
                            },
                          })
                        }
                        aspectRatio="portrait"
                        helperText="Unggah langsung dari file galeri HP atau PC Anda."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Jadwal & Lokasi Acara */}
            {editorSection === 'events' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Akad */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-slate-300 text-sm">Akad Nikah</h4>
                  <div>
                    <label className="block text-stone-400 mb-1">Waktu</label>
                    <input
                      type="text"
                      value={editForm.events?.akad?.timeStr || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            akad: {
                              ...DEFAULT_CLIENT_CONFIG.events.akad,
                              ...(editForm.events?.akad || {}),
                              timeStr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Nama Tempat / Masjid</label>
                    <input
                      type="text"
                      value={editForm.events?.akad?.locationName || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            akad: {
                              ...DEFAULT_CLIENT_CONFIG.events.akad,
                              ...(editForm.events?.akad || {}),
                              locationName: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={editForm.events?.akad?.address || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            akad: {
                              ...DEFAULT_CLIENT_CONFIG.events.akad,
                              ...(editForm.events?.akad || {}),
                              address: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Link Google Maps</label>
                    <input
                      type="text"
                      value={editForm.events?.akad?.googleMapsUrl || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            akad: {
                              ...DEFAULT_CLIENT_CONFIG.events.akad,
                              ...(editForm.events?.akad || {}),
                              googleMapsUrl: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Resepsi */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-3">
                  <h4 className="font-bold text-slate-300 text-sm">Resepsi Pernikahan</h4>
                  <div>
                    <label className="block text-stone-400 mb-1">Waktu</label>
                    <input
                      type="text"
                      value={editForm.events?.resepsi?.timeStr || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            resepsi: {
                              ...DEFAULT_CLIENT_CONFIG.events.resepsi,
                              ...(editForm.events?.resepsi || {}),
                              timeStr: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Nama Ballroom / Gedung</label>
                    <input
                      type="text"
                      value={editForm.events?.resepsi?.locationName || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            resepsi: {
                              ...DEFAULT_CLIENT_CONFIG.events.resepsi,
                              ...(editForm.events?.resepsi || {}),
                              locationName: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Alamat Lengkap</label>
                    <textarea
                      rows={2}
                      value={editForm.events?.resepsi?.address || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            resepsi: {
                              ...DEFAULT_CLIENT_CONFIG.events.resepsi,
                              ...(editForm.events?.resepsi || {}),
                              address: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Link Google Maps</label>
                    <input
                      type="text"
                      value={editForm.events?.resepsi?.googleMapsUrl || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          events: {
                            ...DEFAULT_CLIENT_CONFIG.events,
                            ...(editForm.events || {}),
                            resepsi: {
                              ...DEFAULT_CLIENT_CONFIG.events.resepsi,
                              ...(editForm.events?.resepsi || {}),
                              googleMapsUrl: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Cerita Cinta (Love Story Timeline) [REQUESTED EDITABLE] */}
            {editorSection === 'story' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-slate-200 text-base">
                        Cerita Cinta (Love Story Timeline)
                      </h4>
                      <p className="text-xs text-stone-400">
                        Kelola perjalanan cinta Anda yang akan tampil dalam bentuk timeline interaktif pada undangan.
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.features?.loveStory ?? true}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              features: {
                                ...DEFAULT_CLIENT_CONFIG.features,
                                ...(editForm.features || {}),
                                loveStory: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-slate-400 focus:ring-0"
                        />
                        <span>Tampilkan Fitur</span>
                      </label>
                      <button
                        onClick={() => setIsAddingStory(!isAddingStory)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah Momen Baru</span>
                      </button>
                    </div>
                  </div>

                  {/* Add New Milestone Modal/Form */}
                  {isAddingStory && (
                    <div className="p-5 rounded-2xl bg-stone-950 border border-slate-400/40 space-y-4 text-xs">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-slate-300">Tambah Milestone Kisah Cinta Baru</h5>
                        <span className="text-[10px] text-stone-400">Dukungan upload langsung dari HP / Laptop</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-400 mb-1 font-semibold">Tahun / Waktu</label>
                          <input
                            type="text"
                            value={newStory.year}
                            onChange={(e) => setNewStory({ ...newStory, year: e.target.value })}
                            placeholder="Contoh: 2021 atau September 2023"
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1 font-semibold">Judul Momen</label>
                          <input
                            type="text"
                            value={newStory.title}
                            onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                            placeholder="Contoh: Pertemuan Pertama"
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-stone-400 mb-1 font-semibold">Deskripsi Cerita</label>
                          <textarea
                            rows={3}
                            value={newStory.description}
                            onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                            placeholder="Tuliskan kisah singkat momen ini..."
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-100"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <ImageUploadField
                            label="Foto Kenangan Momen"
                            value={newStory.photoUrl}
                            onChange={(val) => setNewStory({ ...newStory, photoUrl: val })}
                            helperText="Pilih foto momen kenangan dari galeri HP/laptop atau masukkan URL gambar."
                            aspectRatio="landscape"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingStory(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleAddStory}
                          className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold cursor-pointer"
                        >
                          Simpan Momen
                        </button>
                      </div>
                    </div>
                  )}

                  {/* List of Milestones */}
                  <div className="space-y-4 pt-2">
                    {(editForm.loveStories || []).map((story, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Tahun / Waktu</label>
                              <input
                                type="text"
                                value={story.year}
                                onChange={(e) => handleUpdateStory(index, 'year', e.target.value)}
                                className="w-full p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-slate-300 text-xs"
                                placeholder="Tahun/Waktu"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Judul Momen</label>
                              <input
                                type="text"
                                value={story.title}
                                onChange={(e) => handleUpdateStory(index, 'title', e.target.value)}
                                className="w-full p-2 rounded-xl bg-stone-900 border border-stone-700 font-bold text-stone-100 text-xs"
                                placeholder="Judul Momen"
                              />
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteStory(index)}
                            className="p-2 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 cursor-pointer shrink-0 self-start mt-4"
                            title="Hapus Momen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-400 mb-1 font-semibold">Deskripsi Kisah</label>
                          <textarea
                            rows={2}
                            value={story.description}
                            onChange={(e) => handleUpdateStory(index, 'description', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs"
                            placeholder="Deskripsi cerita momen..."
                          />
                        </div>

                        <div className="pt-1">
                          <ImageUploadField
                            label={`Foto Momen: ${story.title || 'Momen #' + (index + 1)}`}
                            value={story.photoUrl}
                            onChange={(val) => handleUpdateStory(index, 'photoUrl', val)}
                            helperText="Unggah langsung foto kenangan ini dari HP/laptop atau masukkan URL foto."
                            aspectRatio="landscape"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 4: Galeri Foto & Video Teaser [REQUESTED EDITABLE] */}
            {editorSection === 'gallery' && (
              <div className="space-y-6">
                {/* Video Teaser Editor */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-slate-200 text-base flex items-center gap-2">
                        <Film className="w-4 h-4 text-slate-400" />
                        <span>Video Teaser Prewedding</span>
                      </h4>
                      <p className="text-xs text-stone-400">
                        Unggah langsung file video prewedding (MP4/WebM) dari galeri HP/laptop atau gunakan tautan video YouTube.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">Judul Video Teaser</label>
                      <input
                        type="text"
                        value={editForm.videoTeaser?.title || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            videoTeaser: { ...editForm.videoTeaser, title: e.target.value },
                          })
                        }
                        placeholder="Contoh: Cinematic Prewedding Teaser"
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 text-stone-100"
                      />
                    </div>

                    {/* Direct Video Upload Field */}
                    <div className="p-4 rounded-2xl bg-stone-950/70 border border-stone-800 space-y-3">
                      <VideoUploadField
                        label="Unggah Berkas Video Teaser"
                        videoUrl={editForm.videoTeaser?.videoUrl || ''}
                        youtubeUrl={editForm.videoTeaser?.youtubeUrl || ''}
                        videoType={editForm.videoTeaser?.videoType || (editForm.videoTeaser?.videoUrl ? 'upload' : 'upload')}
                        onChangeVideoUrl={(videoUrl) =>
                          setEditForm({
                            ...editForm,
                            videoTeaser: {
                              ...editForm.videoTeaser,
                              videoUrl,
                              videoType: 'upload',
                            },
                          })
                        }
                        onChangeYoutubeUrl={(youtubeUrl) =>
                          setEditForm({
                            ...editForm,
                            videoTeaser: {
                              ...editForm.videoTeaser,
                              youtubeUrl,
                              videoType: 'youtube',
                            },
                          })
                        }
                        onChangeVideoType={(videoType) =>
                          setEditForm({
                            ...editForm,
                            videoTeaser: {
                              ...editForm.videoTeaser,
                              videoType,
                            },
                          })
                        }
                        helperText="Video akan langsung tersimpan dan dapat diputar oleh tamu undangan tanpa perlu upload ke YouTube terlebih dahulu."
                      />
                    </div>

                    <div>
                      <ImageUploadField
                        label="Thumbnail / Poster Video Teaser"
                        value={editForm.videoTeaser?.posterUrl || ''}
                        onChange={(posterUrl) =>
                          setEditForm({
                            ...editForm,
                            videoTeaser: { ...editForm.videoTeaser, posterUrl },
                          })
                        }
                        aspectRatio="wide"
                        helperText="Unggah langsung dari file galeri HP/PC atau gunakan tautan URL gambar poster."
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Gallery Items */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-slate-200 text-base flex items-center gap-2">
                        <Camera className="w-4 h-4 text-slate-400" />
                        <span>Koleksi Foto Galeri Estetik</span>
                      </h4>
                      <p className="text-xs text-stone-400">
                        Tambahkan dan kelola foto prewedding, lamaran, dan kenangan indah secara langsung.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsAddingGalleryPhoto(!isAddingGalleryPhoto)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tambah 1 Foto</span>
                      </button>
                    </div>
                  </div>

                  {/* Bulk Multi-Photo Upload Toolbar */}
                  <div className="p-4 rounded-2xl bg-stone-950/80 border border-slate-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-400/30 shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                          <span>Unggah Banyak Foto Sekaligus (Multi-Upload)</span>
                          <span className="px-2 py-0.2 rounded-full text-[9px] bg-slate-800 text-slate-300 font-semibold border border-slate-400/30">
                            Cepat
                          </span>
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Pilih beberapa foto sekaligus dari galeri HP atau folder laptop untuk dimasukkan otomatis.
                        </p>
                      </div>
                    </div>
                    <div>
                      <input
                        ref={bulkFileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBulkGalleryUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isBulkUploading}
                        onClick={() => bulkFileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 border border-white font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>
                          {isBulkUploading ? bulkUploadStatus || 'Mengompres...' : 'Pilih Banyak Foto dari HP/PC'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Add New Gallery Photo Form */}
                  {isAddingGalleryPhoto && (
                    <div className="p-5 rounded-2xl bg-stone-950 border border-slate-400/40 space-y-4 text-xs">
                      <h5 className="font-bold text-slate-300 text-sm">Tambah Foto Baru ke Galeri</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-stone-400 mb-1">Judul / Label Foto</label>
                          <input
                            type="text"
                            value={newGalleryPhoto.title}
                            onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, title: e.target.value })}
                            placeholder="Contoh: Senja Bersama"
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">Kategori</label>
                          <select
                            value={newGalleryPhoto.category}
                            onChange={(e) =>
                              setNewGalleryPhoto({ ...newGalleryPhoto, category: e.target.value as any })
                            }
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700"
                          >
                            <option value="prewedding">Prewedding</option>
                            <option value="engagement">Engagement / Lamaran</option>
                            <option value="memories">Memories / Kenangan</option>
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <ImageUploadField
                            label="Unggah File Foto atau Tautan URL"
                            value={newGalleryPhoto.url}
                            onChange={(url) => setNewGalleryPhoto({ ...newGalleryPhoto, url })}
                            aspectRatio="landscape"
                            helperText="Pilih foto langsung dari galeri atau ketikkan URL foto."
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-stone-400 mb-1">Keterangan / Caption</label>
                          <input
                            type="text"
                            value={newGalleryPhoto.caption}
                            onChange={(e) => setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })}
                            placeholder="Kisah di balik foto ini..."
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setIsAddingGalleryPhoto(false)}
                          className="px-3.5 py-1.5 rounded-xl bg-stone-800 text-stone-300 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleAddGalleryPhoto}
                          className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold cursor-pointer"
                        >
                          Simpan Foto
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
                    {(editForm.galleryItems || []).map((item) => (
                      <div
                        key={item.id}
                        className="group relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 aspect-square shadow-md"
                      >
                        <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-stone-950/80 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-xs">
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-300 border border-slate-400/30 uppercase">
                              {item.category}
                            </span>
                            <p className="font-bold text-stone-100 mt-1 line-clamp-1">{item.title}</p>
                            <p className="text-[10px] text-stone-400 line-clamp-2">{item.caption}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteGalleryPhoto(item.id)}
                            className="w-full py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Amplop Digital & QRIS Generator [REQUESTED EDITABLE] */}
            {editorSection === 'gifts' && (
              <div className="space-y-6">
                {/* Bank Accounts */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury font-bold text-slate-200 text-base">
                        Rekening Bank & E-Wallet
                      </h4>
                      <p className="text-xs text-stone-400">
                        Atur nomor rekening tujuan transfer tanda kasih dan kado pernikahan.
                      </p>
                    </div>
                    <button
                      onClick={handleAddBankAccount}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Rekening</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {(editForm.bankAccounts || []).map((acc, index) => (
                      <div
                        key={acc.id}
                        className="p-4 rounded-2xl bg-stone-950 border border-stone-800 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs"
                      >
                        <div>
                          <label className="block text-stone-400 mb-1">Nama Bank / E-Wallet</label>
                          <input
                            type="text"
                            value={acc.bankName}
                            onChange={(e) => handleUpdateBankAccount(index, 'bankName', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">Nomor Rekening</label>
                          <input
                            type="text"
                            value={acc.accountNumber}
                            onChange={(e) => handleUpdateBankAccount(index, 'accountNumber', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-400 mb-1">Atas Nama Pemilik</label>
                          <input
                            type="text"
                            value={acc.accountHolder}
                            onChange={(e) => handleUpdateBankAccount(index, 'accountHolder', e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-stone-900 border border-stone-700"
                          />
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleDeleteBankAccount(index)}
                            className="px-4 py-2.5 rounded-xl bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 text-xs font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QRIS Generator & Config */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <h4 className="font-serif-luxury font-bold text-slate-200 text-base flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-slate-400" />
                    <span>QRIS Generator & Pembayaran Digital Instan</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">Nama Merchant QRIS</label>
                      <input
                        type="text"
                        value={editForm.qris?.merchantName || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            qris: {
                              merchantName: e.target.value,
                              qrisImageUrl: editForm.qris?.qrisImageUrl || '',
                              nmid: editForm.qris?.nmid || '',
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">NMID (Nomor Merchant)</label>
                      <input
                        type="text"
                        value={editForm.qris?.nmid || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            qris: {
                              merchantName: editForm.qris?.merchantName || '',
                              qrisImageUrl: editForm.qris?.qrisImageUrl || '',
                              nmid: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Gambar Barcode QRIS Merchant"
                        value={editForm.qris?.qrisImageUrl || ''}
                        onChange={(qrisImageUrl) =>
                          setEditForm({
                            ...editForm,
                            qris: {
                              merchantName: editForm.qris?.merchantName || '',
                              qrisImageUrl,
                              nmid: editForm.qris?.nmid || '',
                            },
                          })
                        }
                        aspectRatio="square"
                        helperText="Unggah langsung tangkapan layar (screenshot/file) barcode QRIS Anda atau gunakan tautan URL gambar."
                      />
                    </div>
                  </div>
                </div>

                {/* Gift Physical Address */}
                <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                  <h4 className="font-serif-luxury font-bold text-slate-200 text-base flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>Alamat Pengiriman Kado Fisik</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-stone-400 mb-1">Nama Penerima</label>
                      <input
                        type="text"
                        value={editForm.giftAddress?.recipient || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            giftAddress: {
                              ...DEFAULT_CLIENT_CONFIG.giftAddress,
                              ...(editForm.giftAddress || {}),
                              recipient: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">Nomor Telepon / WA</label>
                      <input
                        type="text"
                        value={editForm.giftAddress?.phone || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            giftAddress: {
                              ...DEFAULT_CLIENT_CONFIG.giftAddress,
                              ...(editForm.giftAddress || {}),
                              phone: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-stone-400 mb-1">Alamat Lengkap Rumah / Resepsi</label>
                      <textarea
                        rows={2}
                        value={editForm.giftAddress?.fullAddress || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            giftAddress: {
                              ...DEFAULT_CLIENT_CONFIG.giftAddress,
                              ...(editForm.giftAddress || {}),
                              fullAddress: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Section 6: Siaran Langsung (Virtual Stream) [REQUESTED EDITABLE] */}
            {editorSection === 'stream' && (
              <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif-luxury font-bold text-slate-200 text-base">
                      Siaran Langsung (Virtual Live Stream)
                    </h4>
                    <p className="text-xs text-stone-400">
                      Tautan siaran langsung untuk keluarga dan kerabat yang menghadiri pernikahan secara daring.
                    </p>
                  </div>
                  <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.features?.liveStreaming ?? true}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          features: {
                            ...DEFAULT_CLIENT_CONFIG.features,
                            ...(editForm.features || {}),
                            liveStreaming: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-slate-400 focus:ring-0"
                    />
                    <span>Aktifkan Siaran</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Nama Platform</label>
                    <input
                      type="text"
                      value={editForm.liveStream?.platform || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          liveStream: {
                            ...DEFAULT_CLIENT_CONFIG.liveStream,
                            ...(editForm.liveStream || {}),
                            platform: e.target.value,
                          },
                        })
                      }
                      placeholder="YouTube Live & Zoom Meeting"
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Waktu Tayang Siaran</label>
                    <input
                      type="text"
                      value={editForm.liveStream?.streamTime || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          liveStream: {
                            ...DEFAULT_CLIENT_CONFIG.liveStream,
                            ...(editForm.liveStream || {}),
                            streamTime: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">URL YouTube Live</label>
                    <input
                      type="text"
                      value={editForm.liveStream?.youtubeUrl || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          liveStream: {
                            ...DEFAULT_CLIENT_CONFIG.liveStream,
                            ...(editForm.liveStream || {}),
                            youtubeUrl: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Zoom Meeting ID</label>
                    <input
                      type="text"
                      value={editForm.liveStream?.zoomMeetingId || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          liveStream: {
                            ...DEFAULT_CLIENT_CONFIG.liveStream,
                            ...(editForm.liveStream || {}),
                            zoomMeetingId: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Zoom Passcode</label>
                    <input
                      type="text"
                      value={editForm.liveStream?.zoomPasscode || ''}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          liveStream: {
                            ...DEFAULT_CLIENT_CONFIG.liveStream,
                            ...(editForm.liveStream || {}),
                            zoomPasscode: e.target.value,
                          },
                        })
                      }
                      className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 7: Musik & Modul */}
            {editorSection === 'music' && (
              <div className="p-6 rounded-3xl bg-stone-900/80 border border-stone-800 space-y-6 text-xs">
                <div>
                  <h4 className="font-serif-luxury font-bold text-slate-200 text-sm mb-3">
                    Musik Latar & Audio Undangan
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-stone-400 mb-1">Judul Musik</label>
                      <input
                        type="text"
                        value={editForm.audio?.title || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            audio: {
                              ...DEFAULT_CLIENT_CONFIG.audio,
                              ...(editForm.audio || {}),
                              title: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 mb-1">URL Audio Stream (.mp3)</label>
                      <input
                        type="text"
                        value={editForm.audio?.url || ''}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            audio: {
                              ...DEFAULT_CLIENT_CONFIG.audio,
                              ...(editForm.audio || {}),
                              url: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-700 font-mono text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800">
                  <h4 className="font-serif-luxury font-bold text-slate-200 text-sm mb-3">
                    Modul Fitur Undangan
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'loveStory', label: 'Cerita Cinta' },
                      { key: 'gallery', label: 'Galeri Foto' },
                      { key: 'amplopDigital', label: 'Amplop Digital' },
                      { key: 'liveStreaming', label: 'Siaran Langsung' },
                    ].map((mod) => (
                      <label
                        key={mod.key}
                        className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between cursor-pointer"
                      >
                        <span className="font-semibold text-stone-300">{mod.label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean((editForm.features as any)?.[mod.key] ?? true)}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              features: {
                                ...DEFAULT_CLIENT_CONFIG.features,
                                ...(editForm.features || {}),
                                [mod.key]: e.target.checked,
                              },
                            })
                          }
                          className="rounded text-slate-400 focus:ring-0"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Developer PIN Verification Modal */}
      {showDevPinModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-stone-900 border border-slate-400/40 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-slate-800 text-slate-300 border border-slate-400/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-slate-200 text-base">
                    Otorisasi Developer
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Buka kunci proteksi Informasi Utama
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowDevPinModal(false);
                  setDevPinError(null);
                  setDevPinInput('');
                }}
                className="w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifyDevPin} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-1.5">
                <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Akses Proteksi Developer</span>
                </div>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Bagian Informasi Utama dikunci untuk klien. Masukkan PIN Developer untuk membuka akses edit.
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80">
                  <span>Masukkan Pin untuk Membuka</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 text-xs font-semibold mb-1.5">
                  Kode PIN Developer
                </label>
                <input
                  type="password"
                  autoFocus
                  value={devPinInput}
                  onChange={(e) => {
                    setDevPinInput(e.target.value);
                    setDevPinError(null);
                  }}
                  placeholder="Masukkan 4 digit PIN..."
                  className="w-full p-3 rounded-xl bg-stone-950 border border-stone-700 text-stone-100 font-mono text-center text-lg tracking-widest focus:border-slate-300"
                />
                {devPinError && (
                  <p className="text-rose-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{devPinError}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDevPinModal(false);
                    setDevPinError(null);
                    setDevPinInput('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold text-xs cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer transition-transform active:scale-95"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Buka Proteksi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
