export interface GuestInfo {
  id: string;
  name: string;
  phone?: string;
  group?: 'Keluarga' | 'Sahabat' | 'Rekan Kerja' | 'VIP' | 'Umum';
  isVip?: boolean;
  status: 'pending' | 'hadir' | 'tidak_hadir' | 'ragu';
  paxCount: number;
  qrCodeToken: string;
  createdAt: string;
  isCheckedIn?: boolean;
  checkedInAt?: string;
}

export interface WishComment {
  id: string;
  name: string;
  attendance: 'hadir' | 'tidak_hadir' | 'ragu';
  pax: number;
  message: string;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
  reply?: string;
  repliedAt?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  logo?: string;
  type?: 'bank' | 'ewallet';
}

export interface EventSchedule {
  title: string;
  dateStr: string; // e.g. "Minggu, 25 Oktober 2026"
  timeStr: string; // e.g. "08:00 - 10:00 WIB"
  isoDateTimeStart: string;
  isoDateTimeEnd: string;
  locationName: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  wazeUrl: string;
  embedMapUrl: string;
}

export interface LoveMilestone {
  year: string;
  title: string;
  description: string;
  photoUrl: string;
}

export interface GalleryItem {
  id: string;
  category: 'prewedding' | 'engagement' | 'memories';
  title: string;
  url: string;
  caption: string;
}

export interface WeddingClientConfig {
  coupleTitle: string;
  weddingDate: string;
  displayDate: string;
  coverPhoto: string;
  viewsCount: number;
  groom: {
    name: string;
    nickname: string;
    father: string;
    mother: string;
    instagram: string;
    photo: string;
    description: string;
  };
  bride: {
    name: string;
    nickname: string;
    father: string;
    mother: string;
    instagram: string;
    photo: string;
    description: string;
  };
  events: {
    akad: EventSchedule;
    resepsi: EventSchedule;
  };
  audio: {
    title: string;
    url: string;
    autoplay: boolean;
  };
  features: {
    loveStory: boolean;
    amplopDigital: boolean;
    liveStreaming: boolean;
    gallery: boolean;
  };
  loveStories: LoveMilestone[];
  galleryItems: GalleryItem[];
  videoTeaser: {
    title: string;
    youtubeUrl: string;
    videoUrl?: string; // Direct uploaded video file (Data URL or direct MP4/WebM URL)
    videoType?: 'youtube' | 'upload' | 'direct';
    posterUrl: string;
  };
  liveStream: {
    platform: string;
    youtubeUrl: string;
    zoomMeetingId: string;
    zoomPasscode: string;
    streamTime: string;
  };
  giftAddress: {
    recipient: string;
    phone: string;
    fullAddress: string;
    note: string;
  };
  qris?: {
    merchantName: string;
    qrisImageUrl: string;
    nmid?: string;
  };
  bankAccounts: BankAccount[];
  waTemplate: string;
  developerSettings?: {
    isMainInfoLocked: boolean;
    developerPin: string;
  };
}

export interface GiftTransaction {
  id: string;
  senderName: string;
  amount: number;
  paymentMethod: string;
  timestamp: string;
  status: 'success' | 'pending';
  receiptCode: string;
}
