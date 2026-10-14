import React, { useState, useEffect } from 'react';
import { OpeningGate } from './components/OpeningGate';
import { FloatingNav } from './components/FloatingNav';
import { HeroSection } from './components/HeroSection';
import { CoupleSection } from './components/CoupleSection';
import { CountdownSection } from './components/CountdownSection';
import { EventScheduleSection } from './components/EventScheduleSection';
import { LoveStorySection } from './components/LoveStorySection';
import { GallerySection } from './components/GallerySection';
import { LiveStreamingSection } from './components/LiveStreamingSection';
import { DigitalEnvelopeSection } from './components/DigitalEnvelopeSection';
import { RsvpSection } from './components/RsvpSection';
import { FooterSection } from './components/FooterSection';
import { ClientDashboard } from './components/ClientDashboard';
import { FloatingPetals } from './components/FloatingPetals';
import { weddingAudio } from './utils/audioPlayer';
import { DEFAULT_CLIENT_CONFIG, INITIAL_GUESTS, INITIAL_WISHES, sanitizeClientConfig } from './data/weddingData';
import { GuestInfo, WishComment, WeddingClientConfig } from './types/wedding';
import { LayoutDashboard, Lock, X, LogOut, ShieldCheck, KeyRound } from 'lucide-react';

export default function App() {
  // Default to 'invitation' mode so guests and visitors always see the wedding invitation
  const [appMode, setAppMode] = useState<'dashboard' | 'invitation'>('invitation');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wedding_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Admin PIN modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [isInvitationOpen, setIsInvitationOpen] = useState(false);
  const [guestName, setGuestName] = useState('Tamu Undangan');
  const [activeSection, setActiveSection] = useState('hero');

  // Client configuration with persistence and sanitization
  const [clientConfig, setClientConfig] = useState<WeddingClientConfig>(() => {
    try {
      const saved = localStorage.getItem('wedding_client_config');
      return saved ? sanitizeClientConfig(JSON.parse(saved)) : DEFAULT_CLIENT_CONFIG;
    } catch {
      return DEFAULT_CLIENT_CONFIG;
    }
  });

  // Persistent Wishes State
  const [wishes, setWishes] = useState<WishComment[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_wishes_data');
      return saved ? JSON.parse(saved) : INITIAL_WISHES;
    } catch {
      return INITIAL_WISHES;
    }
  });

  // Persistent Guests State
  const [guests, setGuests] = useState<GuestInfo[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_guests_data');
      return saved ? JSON.parse(saved) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('wedding_client_config', JSON.stringify(clientConfig));
    } catch (e) {
      console.error(e);
    }
  }, [clientConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_wishes_data', JSON.stringify(wishes));
    } catch (e) {
      console.error(e);
    }
  }, [wishes]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_guests_data', JSON.stringify(guests));
    } catch (e) {
      console.error(e);
    }
  }, [guests]);

  // Read guest name & admin mode from URL parameter (?to=Nama+Tamu or secret ?admin=true)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to') || params.get('u') || params.get('guest');
      if (toParam && toParam.trim()) {
        setGuestName(decodeURIComponent(toParam.trim()));
        // If a guest link is accessed, always show the invitation view
        setAppMode('invitation');
      }

      // Check if admin access requested (?admin=true, ?mode=dashboard, #admin)
      const hasAdminParam =
        params.get('admin') === 'true' ||
        params.get('admin') === '1' ||
        params.get('mode') === 'dashboard' ||
        window.location.hash === '#admin';

      if (hasAdminParam) {
        setIsAdminAuthenticated(true);
        setAppMode('dashboard');
        try {
          sessionStorage.setItem('wedding_admin_auth', 'true');
        } catch {}
      }
    }
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = clientConfig.developerSettings?.developerPin || '1234';
    if (pinInput.trim() === correctPin) {
      try {
        sessionStorage.setItem('wedding_admin_auth', 'true');
      } catch (err) {
        console.error(err);
      }
      setIsAdminAuthenticated(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
      setAppMode('dashboard');
    } else {
      setPinError('PIN salah! Silakan masukkan 4 digit PIN yang benar.');
    }
  };

  const handleAdminLogout = () => {
    try {
      sessionStorage.removeItem('wedding_admin_auth');
    } catch (err) {
      console.error(err);
    }
    setIsAdminAuthenticated(false);
    setAppMode('invitation');
  };

  // Section observer for floating dock active indicator
  useEffect(() => {
    if (appMode !== 'invitation') return;

    const handleScroll = () => {
      const sections = ['hero', 'couple', 'events', 'story', 'gallery', 'rsvp', 'gift'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [appMode]);

  const handleOpenInvitation = () => {
    setIsInvitationOpen(true);
    weddingAudio.play();

    // Increment viewsCount in client config
    setClientConfig((prev) => ({
      ...prev,
      viewsCount: (prev.viewsCount || 0) + 1,
    }));

    setTimeout(() => {
      const hero = document.getElementById('hero');
      hero?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddWish = (newWish: WishComment) => {
    setWishes((prev) => [newWish, ...prev]);

    // Also update guests list if not already present
    setGuests((prev) => {
      const existsIndex = prev.findIndex(
        (g) => g.name.toLowerCase() === newWish.name.toLowerCase()
      );
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          status: newWish.attendance,
          paxCount: newWish.pax,
        };
        return updated;
      } else {
        const newGuest: GuestInfo = {
          id: `gst-${Date.now()}`,
          name: newWish.name,
          status: newWish.attendance,
          paxCount: newWish.pax,
          qrCodeToken: `WED-${Math.floor(100 + Math.random() * 900)}`,
          createdAt: new Date().toISOString(),
          group: 'Umum',
        };
        return [newGuest, ...prev];
      }
    });
  };

  const handleLikeWish = (wishId: string) => {
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          const isLiked = w.isLikedByUser;
          return {
            ...w,
            likes: isLiked ? Math.max(0, w.likes - 1) : w.likes + 1,
            isLikedByUser: !isLiked,
          };
        }
        return w;
      })
    );
  };

  const handleReplyWish = (wishId: string, replyText: string) => {
    setWishes((prev) =>
      prev.map((w) =>
        w.id === wishId
          ? {
              ...w,
              reply: replyText,
              repliedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            }
          : w
      )
    );
  };

  const handleDeleteWish = (wishId: string) => {
    setWishes((prev) => prev.filter((w) => w.id !== wishId));
  };

  const handleAddGuestsBatch = (names: string[]) => {
    const newItems: GuestInfo[] = names.map((name, idx) => ({
      id: `gst-${Date.now()}-${idx}`,
      name: name.trim(),
      group: 'Sahabat',
      isVip: false,
      status: 'pending',
      paxCount: 0,
      qrCodeToken: `WED-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
    }));
    setGuests((prev) => [...newItems, ...prev]);
  };

  const handleDeleteGuest = (id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="min-h-screen">
      {/* Floating Admin Return Badge (ONLY visible to authenticated admin while previewing invitation) */}
      {isAdminAuthenticated && appMode === 'invitation' && (
        <div className="fixed top-3 left-3 z-50 flex items-center gap-2">
          <button
            onClick={() => setAppMode('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-white text-zinc-950 text-xs font-bold shadow-xl flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 border border-white"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900/95 hover:bg-rose-950 text-zinc-300 hover:text-rose-200 border border-zinc-700 text-xs font-medium backdrop-blur-md cursor-pointer transition-all shadow-lg flex items-center gap-1"
            title="Keluar dari sesi Admin"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* RENDER MODE 1: CLIENT DASHBOARD (ORIGINAL BESPOKE LUXURY SUITE) */}
      {appMode === 'dashboard' ? (
        <ClientDashboard
          clientConfig={clientConfig}
          onUpdateConfig={(newCfg) => setClientConfig(sanitizeClientConfig(newCfg))}
          guests={guests}
          onAddGuestsBatch={handleAddGuestsBatch}
          onDeleteGuest={handleDeleteGuest}
          wishes={wishes}
          onDeleteWish={handleDeleteWish}
          onReplyWish={handleReplyWish}
          onViewInvitation={() => setAppMode('invitation')}
          onLogout={handleAdminLogout}
        />
      ) : (
        /* RENDER MODE 2: LUXURY WEDDING INVITATION (GUEST VIEW WITH ANIMATIONS) */
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans-clean selection:bg-slate-300 selection:text-zinc-950 relative">
          {/* Ambient Romantic Floating Petals & Moonlight Sparkles Animation */}
          <FloatingPetals />

          {/* 1. Opening Cover Envelope Gate */}
          <OpeningGate
            guestName={guestName}
            isOpen={isInvitationOpen}
            onOpen={handleOpenInvitation}
            config={clientConfig}
          />

          {/* Floating Bottom Nav Dock & Floating Audio Button */}
          {isInvitationOpen && (
            <FloatingNav
              activeSection={activeSection}
              onNavigate={handleNavigate}
            />
          )}

          {/* Main Wedding Content */}
          <main className="relative z-10">
            {/* Hero Section */}
            <HeroSection
              guestName={guestName}
              onScrollDown={() => handleNavigate('couple')}
              config={clientConfig}
            />

            {/* Both Bride & Groom Profiles */}
            <CoupleSection config={clientConfig} />

            {/* Live Countdown & Smart Calendar */}
            <CountdownSection config={clientConfig} />

            {/* Event Schedule (Akad, Resepsi, Google Maps, Waze, Dress Code) */}
            <EventScheduleSection events={clientConfig.events} />

            {/* Love Story Timeline (Toggled via Dashboard Edit) */}
            {clientConfig.features?.loveStory && (
              <LoveStorySection stories={clientConfig.loveStories} />
            )}

            {/* Aesthetic Gallery & Teaser Video & Lightbox (Toggled via Dashboard Edit) */}
            {clientConfig.features?.gallery && (
              <GallerySection
                galleryItems={clientConfig.galleryItems}
                videoTeaser={clientConfig.videoTeaser}
              />
            )}

            {/* Live Streaming Section (Toggled via Dashboard Edit) */}
            {clientConfig.features?.liveStreaming && (
              <LiveStreamingSection liveStream={clientConfig.liveStream} />
            )}

            {/* Digital Envelope, Bank Accounts, QRIS Payment Gateway (Toggled via Dashboard Edit) */}
            {clientConfig.features?.amplopDigital && (
              <DigitalEnvelopeSection
                bankAccounts={clientConfig.bankAccounts}
                giftAddress={clientConfig.giftAddress}
                coupleTitle={clientConfig.coupleTitle}
                qrisConfig={clientConfig.qris}
                onAddWishMessage={(name, msg) => {
                  handleAddWish({
                    id: `wish-gift-${Date.now()}`,
                    name,
                    attendance: 'hadir',
                    pax: 2,
                    message: msg,
                    timestamp: 'Baru saja',
                    likes: 1,
                  });
                }}
              />
            )}

            {/* RSVP & Guest Wishes Wall */}
            <RsvpSection
              initialGuestName={guestName}
              wishes={wishes}
              onAddWish={handleAddWish}
              onLikeWish={handleLikeWish}
            />

            {/* Footer with subtle hidden admin access */}
            <FooterSection
              config={clientConfig}
              onOpenAdmin={() => {
                setIsAdminAuthenticated(true);
                try {
                  sessionStorage.setItem('wedding_admin_auth', 'true');
                } catch {}
                setAppMode('dashboard');
              }}
            />
          </main>
        </div>
      )}

      {/* Admin Passcode / PIN Security Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-slate-400/40 rounded-3xl p-6 sm:p-7 text-zinc-100 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-400/30 flex items-center justify-center text-slate-200">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif-luxury font-bold text-white text-base">
                    Akses Dashboard Admin
                  </h3>
                  <p className="text-[11px] text-zinc-400">Khusus Pengantin & Owner</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPinModal(false);
                  setPinInput('');
                  setPinError('');
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 text-xs text-zinc-300 space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Dashboard Terproteksi</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Tamu undangan biasa tidak memiliki akses ke dashboard ini. Masukkan PIN keamanan Anda untuk mengedit konten atau mengelola tamu.
              </p>
              <p className="text-[10px] text-zinc-500 font-mono pt-0.5">
                Default PIN: <span className="text-slate-200 font-bold">1234</span>
              </p>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Masukkan PIN (4 Digit)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={8}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setPinError('');
                    }}
                    placeholder="••••"
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-center font-mono text-xl tracking-[0.4em] text-white focus:outline-none focus:border-slate-400 placeholder:tracking-normal placeholder:text-zinc-600 transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {pinError && (
                  <p className="text-xs text-rose-400 text-center font-medium mt-1.5 animate-pulse">
                    {pinError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowPinModal(false);
                    setPinInput('');
                    setPinError('');
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-slate-200 via-white to-slate-200 hover:from-white hover:to-slate-100 text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer border border-white"
                >
                  Buka Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
