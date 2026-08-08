/**
 * LUMA STUDIO - LocalStorage Session & Booking State Manager
 */

const STORAGE_KEYS = {
  BOOKINGS: 'luma_user_bookings',
  FAVORITES: 'luma_favorite_services',
  CUSTOMER: 'luma_customer_info'
};

function getStoredBookings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!saved) {
      // Seed default initial booking if empty for seamless demo
      const seedBooking = [
        {
          id: "LUMA-92K4F",
          serviceId: "srv-02",
          serviceName: "Deep Tissue Massage",
          providerId: "pro-01",
          providerName: "Maya Sen",
          providerRole: "Senior Wellness Specialist",
          providerImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
          date: getTomorrowDateString(),
          time: "10:30 AM",
          duration: "75 minutes",
          priceFormatted: "₹2,000",
          price: 2000,
          customerName: "Ananya Kapoor",
          customerEmail: "ananya@example.com",
          customerPhone: "+91 98300 12345",
          status: "Upcoming",
          createdDate: new Date().toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(seedBooking));
      return seedBooking;
    }
    return JSON.parse(saved);
  } catch (e) {
    return [];
  }
}

function saveBooking(bookingObj) {
  const bookings = getStoredBookings();
  bookings.unshift(bookingObj);
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  } catch (e) {}
}

function updateBookingStatus(bookingId, newStatus, newDate = null, newTime = null) {
  const bookings = getStoredBookings();
  const target = bookings.find(b => b.id === bookingId);
  if (target) {
    target.status = newStatus;
    if (newDate) target.date = newDate;
    if (newTime) target.time = newTime;
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    } catch (e) {}
  }
}

function getStoredFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function toggleFavoriteService(serviceId) {
  let favs = getStoredFavorites();
  if (favs.includes(serviceId)) {
    favs = favs.filter(id => id !== serviceId);
  } else {
    favs.push(serviceId);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
  } catch (e) {}
  return favs;
}

function getTomorrowDateString() {
  const tm = new Date();
  tm.setDate(tm.getDate() + 1);
  return tm.toISOString().split('T')[0];
}
