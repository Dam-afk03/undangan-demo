import { BankAccount, EventSchedule, GalleryItem, LoveMilestone, WishComment, GuestInfo, WeddingClientConfig } from '../types/wedding';

export const WEDDING_CONFIG = {
  groom: {
    name: 'Raden Arya Pratama, S.Kom.',
    nickname: 'Arya',
    father: 'Bpk. Ir. H. Bambang Sudiro',
    mother: 'Ibu Hj. Ratna Juwita',
    instagram: '@aryapratama',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Putra pertama dari Bpk. Ir. H. Bambang Sudiro & Ibu Hj. Ratna Juwita',
  },
  bride: {
    name: 'Siti Anindya Rahma, S.E.',
    nickname: 'Anindya',
    father: 'Bpk. Drs. H. Suryo Hartono, M.M.',
    mother: 'Ibu Hj. Sri Rahayu',
    instagram: '@anindyarahma',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Putri kedua dari Bpk. Drs. H. Suryo Hartono, M.M. & Ibu Hj. Sri Rahayu',
  },
  weddingDate: '2026-10-25T08:00:00+07:00', // Minggu, 25 Oktober 2026
  displayDate: 'Minggu, 25 Oktober 2026',
  holyVerse: {
    arabic: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً',
    translation: '“Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.”',
    source: 'QS. Ar-Rum: 21',
  },
  liveStream: {
    platform: 'YouTube Live & Zoom Meeting',
    youtubeId: 'live_stream_placeholder',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    zoomMeetingId: '892 4102 9912',
    zoomPasscode: 'ARYAANIN',
    streamTime: 'Minggu, 25 Oktober 2026 • 08:30 WIB',
    isLiveNow: false,
  },
  dressCode: {
    theme: 'Silver Slate & Modern Elegance',
    palette: [
      { name: 'Platinum Silver', hex: '#cbd5e1' },
      { name: 'Moonlit Slate', hex: '#64748b' },
      { name: 'Pure Pearl', hex: '#f8fafc' },
      { name: 'Charcoal Noir', hex: '#334155' },
    ],
    note: 'Mohon berkenan mengenakan busana bertema formal atau batik elegan bernuansa silver, abu-abu, atau monochrome.',
  },
  giftAddress: {
    recipient: 'Arya & Anindya (Pernikahan)',
    phone: '0812-3456-7890',
    fullAddress: 'Jl. Kemang Raya No. 45B, Bangka, Mampang Prapatan, Jakarta Selatan, DKI Jakarta 12730',
    note: 'Pengiriman kado fisik mohon disertakan nama pengirim untuk ucapan terima kasih.',
  },
};

export const EVENTS: { akad: EventSchedule; resepsi: EventSchedule } = {
  akad: {
    title: 'Akad Nikah',
    dateStr: 'Minggu, 25 Oktober 2026',
    timeStr: '08:00 - 10:00 WIB',
    isoDateTimeStart: '2026-10-25T08:00:00+07:00',
    isoDateTimeEnd: '2026-10-25T10:00:00+07:00',
    locationName: 'Masjid Agung Al-Azhar Kebayoran Baru',
    address: 'Jl. Sisingamangaraja No.1, Selong, Kebayoran Baru, Jakarta Selatan',
    city: 'Jakarta Selatan',
    googleMapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
    wazeUrl: 'https://waze.com/ul?q=Masjid%20Agung%20Al-Azhar%20Jakarta',
    embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.241517036611!2d106.79707237499052!3d-6.231885993756286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f145f66c9db3%3A0xa61327fc0ffdc2da!2sMasjid%20Agung%20Al-Azhar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  },
  resepsi: {
    title: 'Resepsi Pernikahan',
    dateStr: 'Minggu, 25 Oktober 2026',
    timeStr: '11:00 - 14:00 & 18:30 - 21:00 WIB',
    isoDateTimeStart: '2026-10-25T11:00:00+07:00',
    isoDateTimeEnd: '2026-10-25T21:00:00+07:00',
    locationName: 'Grand Ballroom Hotel Mulia Senayan',
    address: 'Jl. Asia Afrika, Gelora, Kecamatan Tanah Abang, Kota Jakarta Pusat, DKI Jakarta 10270',
    city: 'Jakarta Pusat',
    googleMapsUrl: 'https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta',
    wazeUrl: 'https://waze.com/ul?q=Hotel%20Mulia%20Senayan',
    embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3861299908337!2d106.79813297499039!3d-6.212702993775266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14e7a00f2ab%3A0xd64ad24a68251e60!2sHotel%20Mulia%20Senayan%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000001!5m2!1sid!2sid',
  },
};

export const LOVE_STORIES: LoveMilestone[] = [
  {
    year: '2021',
    title: 'Awal Mula Bertemu',
    description: 'Sebuah ketidaksengajaan yang dirancang semesta di sebuah kedai kopi di Bandung. Pandangan pertama yang membawa obrolan hangat berjam-jam tentang impian masa depan dan secangkir americano.',
    photoUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2023',
    title: 'Merajut Komitmen',
    description: 'Melewati suka dan duka bersama, belajar saling memahami dan menerima kekurangan masing-masing. Kami menyadari bahwa cinta bukan hanya tentang kesempurnaan, melainkan tentang bertumbuh bersama.',
    photoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2025',
    title: 'She Said "Yes!"',
    description: 'Di bawah temaram matahari terbenam Pantai Jimbaran Bali, Arya berlutut dan meminta Anindya untuk mendampingi langkah hidupnya selamanya. Sebuah kata "Iya" yang mengukir babak baru.',
    photoUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    year: '2026',
    title: 'Menuju Ikrar Suci',
    description: 'Dengan restu kedua orang tua dan rahmat Tuhan Yang Maha Esa, kami melangkah mantap untuk menyatukan dua hati dan dua keluarga dalam ikatan suci pernikahan.',
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'prewedding',
    title: 'Harmoni di Padang Rumput',
    caption: 'Kehangatan sinar senja yang abadi dalam dekapan.',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-2',
    category: 'prewedding',
    title: 'Tatapan Penuh Makna',
    caption: 'Setiap mata memandang, ada jutaan doa yang terucap tanpa suara.',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-3',
    category: 'engagement',
    title: 'Momen Bahagia Lamaran',
    caption: 'Senyum haru saat dua keluarga besar bersatu dalam sukacita.',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-4',
    category: 'memories',
    title: 'Langkah Pertama Bersama',
    caption: 'Menyusuri jalan berbatu dengan tawa yang tak pernah surut.',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-5',
    category: 'prewedding',
    title: 'Sentuhan Kasih',
    caption: 'Di setiap hela napas, ada syukur atas takdir yang mempertemukan kita.',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-6',
    category: 'engagement',
    title: 'Cincin Pengikat Janji',
    caption: 'Lingkaran emas penanda awal perjalanan panjang yang penuh keberkahan.',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-7',
    category: 'memories',
    title: 'Senja di Tepian Pantai',
    caption: 'Langit jingga menjadi saksi janji setia dua insan.',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'gal-8',
    category: 'prewedding',
    title: 'Menatap Masa Depan',
    caption: 'Bersama mengarungi samudra kehidupan dengan ridho Ilahi.',
    url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
  },
];

export const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'bca',
    bankName: 'Bank BCA',
    accountNumber: '8691527840',
    accountHolder: 'Raden Arya Pratama',
    logo: 'BCA',
    type: 'bank',
  },
  {
    id: 'mandiri',
    bankName: 'Bank Mandiri',
    accountNumber: '1370019283741',
    accountHolder: 'Siti Anindya Rahma',
    logo: 'Mandiri',
    type: 'bank',
  },
  {
    id: 'bri',
    bankName: 'Bank BRI',
    accountNumber: '034101002345501',
    accountHolder: 'Raden Arya Pratama',
    logo: 'BRI',
    type: 'bank',
  },
  {
    id: 'gopay',
    bankName: 'GoPay / OVO / Dana',
    accountNumber: '081234567890',
    accountHolder: 'Siti Anindya Rahma',
    logo: 'E-Wallet',
    type: 'ewallet',
  },
];

export const DEFAULT_CLIENT_CONFIG = {
  coupleTitle: 'Roni & Vina',
  weddingDate: '2026-09-28T09:00:00+07:00',
  displayDate: 'Senin, 28 September 2026',
  coverPhoto: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  viewsCount: 111,
  groom: {
    name: 'Roni Juli Utomo, S.T.',
    nickname: 'Roni',
    father: 'Bpk. H. Utomo Prasetyo',
    mother: 'Ibu Hj. Siti Maryam',
    instagram: '@ronijuli',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    description: 'Putra pertama dari Bpk. H. Utomo Prasetyo & Ibu Hj. Siti Maryam',
  },
  bride: {
    name: 'Vina Febriani, S.E.',
    nickname: 'Vina',
    father: 'Bpk. H. Suwandi',
    mother: 'Ibu Hj. Nurjanah',
    instagram: '@vinafebri',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    description: 'Putri kedua dari Bpk. H. Suwandi & Ibu Hj. Nurjanah',
  },
  events: {
    akad: {
      title: 'Akad Nikah',
      dateStr: 'Senin, 28 September 2026',
      timeStr: '08:00 - 10:00 WIB',
      isoDateTimeStart: '2026-09-28T08:00:00+07:00',
      isoDateTimeEnd: '2026-09-28T10:00:00+07:00',
      locationName: 'Masjid Agung Al-Azhar',
      address: 'Jl. Sisingamangaraja No.1, Kebayoran Baru, Jakarta Selatan',
      city: 'Jakarta Selatan',
      googleMapsUrl: 'https://maps.google.com/?q=Masjid+Agung+Al-Azhar+Jakarta',
      wazeUrl: 'https://waze.com/ul?q=Masjid%20Agung%20Al-Azhar%20Jakarta',
      embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.241517036611!2d106.79707237499052!3d-6.231885993756286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f145f66c9db3%3A0xa61327fc0ffdc2da!2sMasjid%20Agung%20Al-Azhar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    },
    resepsi: {
      title: 'Resepsi Pernikahan',
      dateStr: 'Senin, 28 September 2026',
      timeStr: '11:00 - 14:00 & 18:30 - 21:00 WIB',
      isoDateTimeStart: '2026-09-28T11:00:00+07:00',
      isoDateTimeEnd: '2026-09-28T21:00:00+07:00',
      locationName: 'Grand Ballroom Hotel Mulia Senayan',
      address: 'Jl. Asia Afrika, Gelora, Tanah Abang, Jakarta Pusat',
      city: 'Jakarta Pusat',
      googleMapsUrl: 'https://maps.google.com/?q=Hotel+Mulia+Senayan+Jakarta',
      wazeUrl: 'https://waze.com/ul?q=Hotel%20Mulia%20Senayan',
      embedMapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.3861299908337!2d106.79813297499039!3d-6.212702993775266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14e7a00f2ab%3A0xd64ad24a68251e60!2sHotel%20Mulia%20Senayan%20Jakarta!5e0!3m2!1sid!2sid!4v1700000000001!5m2!1sid!2sid',
    },
  },
  audio: {
    title: 'Romantic Piano & Strings',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3',
    autoplay: true,
  },
  features: {
    loveStory: true,
    amplopDigital: true,
    liveStreaming: true,
    gallery: true,
  },
  bankAccounts: [
    {
      id: 'acc-1',
      bankName: 'Jago',
      accountNumber: '505234731103',
      accountHolder: 'Roni Juli Utomo',
      logo: 'Jago',
      type: 'bank' as const,
    },
    {
      id: 'acc-2',
      bankName: 'BCA',
      accountNumber: '8691527840',
      accountHolder: 'Roni Juli Utomo',
      logo: 'BCA',
      type: 'bank' as const,
    },
  ],
  loveStories: LOVE_STORIES,
  galleryItems: GALLERY_ITEMS,
  videoTeaser: {
    title: 'Cinematic Prewedding Teaser',
    youtubeUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    posterUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
  },
  liveStream: {
    platform: 'YouTube Live & Zoom Meeting',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    zoomMeetingId: '892 4102 9912',
    zoomPasscode: 'RONIVINA',
    streamTime: 'Senin, 28 September 2026 • 08:30 WIB',
  },
  giftAddress: {
    recipient: 'Roni & Vina (Pernikahan)',
    phone: '0812-3456-7890',
    fullAddress: 'Jl. Asia Afrika No. 8, Gelora, Tanah Abang, Jakarta Pusat, DKI Jakarta 10270',
    note: 'Mohon sertakan nama pengirim pada paket kado pernikahan.',
  },
  qris: {
    merchantName: 'RONI & VINA WEDDING',
    qrisImageUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=00020101021226610014ID.LINKAJA.WWW01189360091100212345675204581253033605802ID5919RONI+VINA+WEDDING6007JAKARTA6105102706304A1B2',
    nmid: 'ID1020088921471',
  },
  waTemplate: `Kepada Yth.
*{nama}*

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:

*Roni & Vina*
🗓 Senin, 28 September 2026
📍 Grand Ballroom Hotel Mulia Senayan, Jakarta

Buka undangan digital Anda di:
{link}

Terima kasih. Hormat kami,
Roni & Vina`,
  developerSettings: {
    isMainInfoLocked: true,
    developerPin: '1234',
  },
};

export const sanitizeClientConfig = (saved: any): WeddingClientConfig => {
  if (!saved || typeof saved !== 'object') {
    return { ...DEFAULT_CLIENT_CONFIG };
  }

  return {
    ...DEFAULT_CLIENT_CONFIG,
    ...saved,
    groom: {
      ...DEFAULT_CLIENT_CONFIG.groom,
      ...(saved.groom || {}),
    },
    bride: {
      ...DEFAULT_CLIENT_CONFIG.bride,
      ...(saved.bride || {}),
    },
    events: {
      akad: {
        ...DEFAULT_CLIENT_CONFIG.events.akad,
        ...(saved.events?.akad || {}),
      },
      resepsi: {
        ...DEFAULT_CLIENT_CONFIG.events.resepsi,
        ...(saved.events?.resepsi || {}),
      },
    },
    audio: {
      ...DEFAULT_CLIENT_CONFIG.audio,
      ...(saved.audio || {}),
    },
    features: {
      ...DEFAULT_CLIENT_CONFIG.features,
      ...(saved.features || {}),
    },
    loveStories: Array.isArray(saved.loveStories) && saved.loveStories.length > 0
      ? saved.loveStories
      : DEFAULT_CLIENT_CONFIG.loveStories,
    galleryItems: Array.isArray(saved.galleryItems) && saved.galleryItems.length > 0
      ? saved.galleryItems
      : DEFAULT_CLIENT_CONFIG.galleryItems,
    videoTeaser: {
      ...DEFAULT_CLIENT_CONFIG.videoTeaser,
      ...(saved.videoTeaser || {}),
    },
    liveStream: {
      ...DEFAULT_CLIENT_CONFIG.liveStream,
      ...(saved.liveStream || {}),
    },
    giftAddress: {
      ...DEFAULT_CLIENT_CONFIG.giftAddress,
      ...(saved.giftAddress || {}),
    },
    qris: {
      ...DEFAULT_CLIENT_CONFIG.qris,
      ...(saved.qris || {}),
    },
    bankAccounts: Array.isArray(saved.bankAccounts) && saved.bankAccounts.length > 0
      ? saved.bankAccounts
      : DEFAULT_CLIENT_CONFIG.bankAccounts,
    developerSettings: {
      isMainInfoLocked:
        saved.developerSettings?.isMainInfoLocked !== undefined
          ? Boolean(saved.developerSettings.isMainInfoLocked)
          : true,
      developerPin: saved.developerSettings?.developerPin || '1234',
    },
  };
};

export const INITIAL_WISHES: WishComment[] = [
  {
    id: 'wish-1',
    name: 'Rapli',
    attendance: 'tidak_hadir',
    pax: 0,
    message: 'Selamat menempuh hidup baru mas roni & teh vina Semoga samawa🥰🥰',
    timestamp: '2 jam yang lalu',
    likes: 3,
  },
  {
    id: 'wish-2',
    name: 'Mas ratno',
    attendance: 'tidak_hadir',
    pax: 0,
    message: 'Selamat menempuh hidup baru semoga menjadi keluarga yang sakinah mawadah warohmah... amin. Amin yra',
    timestamp: '3 jam yang lalu',
    likes: 4,
  },
  {
    id: 'wish-3',
    name: 'Dimas Satria & Keluarga',
    attendance: 'hadir',
    pax: 2,
    message: 'Barakallahu lakuma wa baraka alaikuma! Selamat menempuh hidup baru Roni & Vina, semoga rukun dan sakinah mawaddah warahmah selamanya.',
    timestamp: '5 jam yang lalu',
    likes: 12,
  },
  {
    id: 'wish-4',
    name: 'Nabila Putri',
    attendance: 'hadir',
    pax: 1,
    message: 'MasyaAllah selamat ya teh Vina cantik & mas Roni! Lancar sampai hari H yaa ❤️',
    timestamp: '6 jam yang lalu',
    likes: 8,
  },
  // Additional wishes to match total 24 (2 Hadir, 22 Tidak Hadir) as seen in screenshots
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: `wish-auto-${i + 5}`,
    name: ['Fajar Hidayat', 'Siti Rahma', 'Bayu Pratama', 'Indah Permata', 'Agus Setiawan', 'Wulan Dari', 'Rizky Ramadhan', 'Maya Sari', 'Dian Anggraini', 'Eko Prasetyo'][i % 10] + (i > 9 ? ` #${Math.floor(i / 10) + 1}` : ''),
    attendance: 'tidak_hadir' as const,
    pax: 0,
    message: 'Mohon maaf belum bisa hadir langsung karena dinas di luar kota. Doa terbaik untuk kedua mempelai selalu barakah dan bahagia.',
    timestamp: `${i + 1} hari yang lalu`,
    likes: (i * 3) % 7,
  })),
];

export const INITIAL_GUESTS: GuestInfo[] = [
  {
    id: 'gst-1',
    name: 'Kak yulia',
    phone: '081299887711',
    group: 'Sahabat',
    isVip: false,
    status: 'pending',
    paxCount: 0,
    qrCodeToken: 'WED-YUL-001',
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'gst-2',
    name: 'Mba tita',
    phone: '081388776622',
    group: 'Keluarga',
    isVip: false,
    status: 'pending',
    paxCount: 0,
    qrCodeToken: 'WED-TIT-002',
    createdAt: '2026-09-20T11:00:00Z',
  },
  {
    id: 'gst-3',
    name: 'Alan',
    phone: '085712345633',
    group: 'Sahabat',
    isVip: false,
    status: 'pending',
    paxCount: 0,
    qrCodeToken: 'WED-ALN-003',
    createdAt: '2026-09-20T12:00:00Z',
  },
  {
    id: 'gst-4',
    name: 'Samhani',
    phone: '081122334444',
    group: 'Sahabat',
    isVip: false,
    status: 'pending',
    paxCount: 0,
    qrCodeToken: 'WED-SMH-004',
    createdAt: '2026-09-20T13:00:00Z',
  },
  {
    id: 'gst-5',
    name: 'Teh erni',
    phone: '081900112255',
    group: 'Keluarga',
    isVip: false,
    status: 'pending',
    paxCount: 0,
    qrCodeToken: 'WED-ERN-005',
    createdAt: '2026-09-20T14:00:00Z',
  },
  {
    id: 'gst-6',
    name: 'Bpk. H. Abdullah & Ibu',
    phone: '081299887766',
    group: 'VIP',
    isVip: true,
    status: 'hadir',
    paxCount: 2,
    qrCodeToken: 'WED-VIP-006',
    createdAt: '2026-09-21T09:00:00Z',
  },
  {
    id: 'gst-7',
    name: 'Dimas Satria',
    phone: '081388776655',
    group: 'Sahabat',
    isVip: false,
    status: 'hadir',
    paxCount: 2,
    qrCodeToken: 'WED-REG-007',
    createdAt: '2026-09-21T10:30:00Z',
  },
  {
    id: 'gst-8',
    name: 'Rapli',
    phone: '085799881122',
    group: 'Sahabat',
    isVip: false,
    status: 'tidak_hadir',
    paxCount: 0,
    qrCodeToken: 'WED-REG-008',
    createdAt: '2026-09-21T11:15:00Z',
  },
  {
    id: 'gst-9',
    name: 'Mas ratno',
    phone: '081288774433',
    group: 'Sahabat',
    isVip: false,
    status: 'tidak_hadir',
    paxCount: 0,
    qrCodeToken: 'WED-REG-009',
    createdAt: '2026-09-21T12:00:00Z',
  },
  // Populate to total 208 names as seen in screenshot "208 nama"
  ...Array.from({ length: 199 }).map((_, i) => ({
    id: `gst-auto-${i + 10}`,
    name: ['Rendi Saputra', 'Anisa Tri', 'Dedi Kurniawan', 'Rina Wati', 'Hendra Wijaya', 'Sinta Dewi', 'Gilang Pratama', 'Nurul Hidayah', 'Bagas Pamungkas', 'Fitri Handayani', 'Yoga Pratama', 'Ira Maya', 'Faisal Akbar', 'Lestari Ayu', 'Doni Kusuma', 'Tari Anggraeni'][i % 16] + ` (${i + 1})`,
    phone: `08${Math.floor(1000000000 + Math.random() * 8999999999)}`,
    group: ['Sahabat', 'Keluarga', 'Rekan Kerja', 'Umum'][i % 4] as any,
    isVip: i % 25 === 0,
    status: (i < 20 ? 'tidak_hadir' : 'pending') as any,
    paxCount: 0,
    qrCodeToken: `WED-AUT-${String(i + 10).padStart(3, '0')}`,
    createdAt: '2026-09-22T08:00:00Z',
  })),
];
