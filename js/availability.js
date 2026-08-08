/**
 * LUMA STUDIO - Real Scheduling & Time Slot Availability Logic Engine
 */

function generateAvailableTimeSlots(providerId, dateString, serviceDuration) {
  const provider = PROFESSIONALS_DATA.find(p => p.id === providerId);
  if (!provider || !dateString) return [];

  const dateObj = new Date(dateString);
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

  // Determine working hours for day
  let hours = null;
  if (dayOfWeek === 0) {
    hours = provider.workingHours.sunday;
  } else if (dayOfWeek === 6) {
    hours = provider.workingHours.saturday;
  } else {
    hours = provider.workingHours.weekdays;
  }

  if (!hours) {
    return []; // Closed day
  }

  const [openHour, openMin] = hours.open.split(':').map(Number);
  const [closeHour, closeMin] = hours.close.split(':').map(Number);

  const startMinutes = openHour * 60 + openMin;
  const endMinutes = closeHour * 60 + closeMin;

  const slots = [];
  const slotInterval = 30; // 30 min intervals

  const existingBookings = [...EXISTING_BOOKINGS_DATA, ...getStoredBookings()];

  for (let m = startMinutes; m + serviceDuration <= endMinutes; m += slotInterval) {
    const slotHour = Math.floor(m / 60);
    const slotMin = m % 60;

    const timeFormatted = formatMinutesTo12H(slotHour, slotMin);
    const isPast = checkIfPastTime(dateString, slotHour, slotMin);

    // Conflict check
    const isConflict = existingBookings.some(b => {
      if (b.status === 'Cancelled') return false;
      if (b.providerId === provider.id && b.date === dateString) {
        if (b.time === timeFormatted) return true;
      }
      return false;
    });

    const isAvailable = !isPast && !isConflict;

    slots.push({
      time: timeFormatted,
      available: isAvailable,
      reason: isPast ? 'Past' : (isConflict ? 'Booked' : 'Available')
    });
  }

  return slots;
}

function formatMinutesTo12H(hour, min) {
  const period = hour >= 12 ? 'PM' : 'AM';
  let h12 = hour % 12;
  if (h12 === 0) h12 = 12;
  const mStr = min < 10 ? `0${min}` : `${min}`;
  const hStr = h12 < 10 ? `0${h12}` : `${h12}`;
  return `${hStr}:${mStr} ${period}`;
}

function checkIfPastTime(dateString, hour, min) {
  const todayStr = new Date().toISOString().split('T')[0];
  if (dateString < todayStr) return true;
  if (dateString > todayStr) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const slotMinutes = hour * 60 + min;

  return slotMinutes <= currentMinutes;
}
