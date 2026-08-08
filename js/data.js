/**
 * LUMA STUDIO - Fictional Services, Professionals, & Scheduling Data Model
 */

const SERVICES_DATA = [
  {
    id: "srv-01",
    name: "Signature Facial",
    category: "Skin",
    categoryLabel: "SKIN",
    description: "Deep botanical cleansing, ultrasonic exfoliation, and custom lymphatic facial massage for radiant skin.",
    duration: 60,
    durationText: "60 minutes",
    price: 1800,
    priceFormatted: "₹1,800",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-03", "pro-01"]
  },
  {
    id: "srv-02",
    name: "Deep Tissue Massage",
    category: "Wellness",
    categoryLabel: "WELLNESS",
    description: "Therapeutic muscle release using organic warm cedar oils, targeting chronic tension and spinal alignment.",
    duration: 75,
    durationText: "75 minutes",
    price: 2000,
    priceFormatted: "₹2,000",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-01", "pro-05"]
  },
  {
    id: "srv-03",
    name: "Hair Styling & Cut",
    category: "Beauty",
    categoryLabel: "BEAUTY",
    description: "Bespoke consultation, scalp detox cleanse, precision cut, and signature botanical blow-dry.",
    duration: 60,
    durationText: "60 minutes",
    price: 1200,
    priceFormatted: "₹1,200",
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-04"]
  },
  {
    id: "srv-04",
    name: "Private Pilates Session",
    category: "Movement",
    categoryLabel: "MOVEMENT",
    description: "One-on-one reformer Pilates session designed around core strength, mobility, and postural alignment.",
    duration: 50,
    durationText: "50 minutes",
    price: 1500,
    priceFormatted: "₹1,500",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-02"]
  },
  {
    id: "srv-05",
    name: "Wellness Consultation",
    category: "Consultation",
    categoryLabel: "CONSULTATION",
    description: "Comprehensive 360-degree lifestyle, nutrition, and stress management strategy session.",
    duration: 45,
    durationText: "45 minutes",
    price: 1200,
    priceFormatted: "₹1,200",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-05", "pro-01"]
  },
  {
    id: "srv-06",
    name: "Scalp Ritual & Head Massage",
    category: "Beauty",
    categoryLabel: "BEAUTY",
    description: "Warm Ayurvedic oil infusion, acupressure scalp stimulation, and restorative hair mask.",
    duration: 45,
    durationText: "45 minutes",
    price: 1000,
    priceFormatted: "₹1,000",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-04", "pro-03"]
  },
  {
    id: "srv-07",
    name: "Glow Light Therapy",
    category: "Skin",
    categoryLabel: "SKIN",
    description: "LED cellular regeneration facial combined with cold-pressed rosehip hydration mask.",
    duration: 50,
    durationText: "50 minutes",
    price: 1600,
    priceFormatted: "₹1,600",
    image: "https://images.unsplash.com/photo-1512290900673-70020014a604?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-03"]
  },
  {
    id: "srv-08",
    name: "Aromatherapy Body Massage",
    category: "Wellness",
    categoryLabel: "WELLNESS",
    description: "Gentle full-body Swedish massage infused with essential eucalyptus, lavender, and bergamot extracts.",
    duration: 60,
    durationText: "60 minutes",
    price: 1800,
    priceFormatted: "₹1,800",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=800&auto=format&fit=crop",
    providerIds: ["pro-01", "pro-05"]
  }
];

const PROFESSIONALS_DATA = [
  {
    id: "pro-01",
    name: "Maya Sen",
    role: "Senior Wellness Specialist",
    bio: "Maya brings 9+ years of international spa therapy and bodywork experience from Switzerland and Bali.",
    experience: "9+ Years",
    rating: 4.9,
    reviewCount: 142,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    serviceIds: ["srv-01", "srv-02", "srv-05", "srv-08"],
    workingHours: {
      weekdays: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: null
    }
  },
  {
    id: "pro-02",
    name: "Arjun Rao",
    role: "Movement & Pilates Coach",
    bio: "Certified Stott Pilates instructor specializing in functional core rehabilitation and posture alignment.",
    experience: "7+ Years",
    rating: 5.0,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    serviceIds: ["srv-04"],
    workingHours: {
      weekdays: { open: "08:00", close: "17:00" },
      saturday: { open: "09:00", close: "15:00" },
      sunday: null
    }
  },
  {
    id: "pro-03",
    name: "Rhea Kapoor",
    role: "Skin Therapist & Esthetician",
    bio: "Rhea is trained in clinical dermatological facials, LED therapy, and botanical skin rejuvenation.",
    experience: "6+ Years",
    rating: 4.85,
    reviewCount: 116,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    serviceIds: ["srv-01", "srv-06", "srv-07"],
    workingHours: {
      weekdays: { open: "10:00", close: "19:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: null
    }
  },
  {
    id: "pro-04",
    name: "Nikhil Mehta",
    role: "Senior Hair Specialist",
    bio: "Nikhil trained in London and specializes in organic scalp care treatments and structural precision cuts.",
    experience: "8+ Years",
    rating: 4.92,
    reviewCount: 84,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    serviceIds: ["srv-03", "srv-06"],
    workingHours: {
      weekdays: { open: "09:00", close: "18:00" },
      saturday: { open: "10:00", close: "16:00" },
      sunday: null
    }
  },
  {
    id: "pro-05",
    name: "Tara Bose",
    role: "Holistic Wellness Consultant",
    bio: "Tara focuses on stress reduction, body mechanics, and integrated mind-body wellness consultations.",
    experience: "10+ Years",
    rating: 4.95,
    reviewCount: 160,
    image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=600&auto=format&fit=crop",
    serviceIds: ["srv-02", "srv-05", "srv-08"],
    workingHours: {
      weekdays: { open: "09:00", close: "17:00" },
      saturday: { open: "10:00", close: "14:00" },
      sunday: null
    }
  }
];

// Fictional Existing Bookings to demonstrate real scheduling conflict logic
const EXISTING_BOOKINGS_DATA = [
  {
    id: "LUMA-EX-01",
    providerId: "pro-01",
    serviceId: "srv-01",
    date: "2026-08-09",
    time: "10:00 AM",
    customerName: "Kavita R."
  },
  {
    id: "LUMA-EX-02",
    providerId: "pro-03",
    serviceId: "srv-07",
    date: "2026-08-09",
    time: "11:30 AM",
    customerName: "Priya S."
  },
  {
    id: "LUMA-EX-03",
    providerId: "pro-02",
    serviceId: "srv-04",
    date: "2026-08-10",
    time: "09:00 AM",
    customerName: "Dev M."
  }
];
