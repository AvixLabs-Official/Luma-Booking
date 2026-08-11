/**
 * LUMA STUDIO - Customer Dashboard & My Bookings Modal Manager
 * Manages upcoming, past, and cancelled appointments with Reschedule & Cancel flows
 */

let activeDashboardTab = 'upcoming';

document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
});

function initDashboard() {
  document.querySelectorAll('.trigger-dashboard-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDashboardModal();
    });
  });

  const closeBtn = document.getElementById('dashboard-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeDashboardModal);
}

function openDashboardModal() {
  const modal = document.getElementById('dashboard-modal');
  if (!modal) return;

  renderDashboardContent();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDashboardModal() {
  const modal = document.getElementById('dashboard-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderDashboardContent() {
  const container = document.getElementById('dashboard-modal-content');
  if (!container) return;

  const bookings = getStoredBookings();

  const upcomingList = bookings.filter(b => b.status === 'Upcoming');
  const pastList = bookings.filter(b => b.status === 'Completed' || b.status === 'Past');
  const cancelledList = bookings.filter(b => b.status === 'Cancelled');

  let activeList = upcomingList;
  if (activeDashboardTab === 'past') activeList = pastList;
  if (activeDashboardTab === 'cancelled') activeList = cancelledList;

  container.innerHTML = `
    <div class="dashboard-box">
      <div class="dashboard-header">
        <div>
          <span class="section-tag">CUSTOMER PORTAL</span>
          <h2>My Bookings</h2>
          <p style="color:var(--text-muted);">Manage your upcoming appointments, rescheduling, and studio history.</p>
        </div>
      </div>

      <div class="dashboard-tabs">
        <button class="dash-tab-btn ${activeDashboardTab === 'upcoming' ? 'active' : ''}" data-tab="upcoming">
          Upcoming (${upcomingList.length})
        </button>
        <button class="dash-tab-btn ${activeDashboardTab === 'past' ? 'active' : ''}" data-tab="past">
          Past History (${pastList.length})
        </button>
        <button class="dash-tab-btn ${activeDashboardTab === 'cancelled' ? 'active' : ''}" data-tab="cancelled">
          Cancelled (${cancelledList.length})
        </button>
      </div>

      ${activeList.length === 0 ? `
        <div class="dash-empty-state">
          <p>No ${activeDashboardTab} appointments found.</p>
        </div>
      ` : `
        <div class="bookings-card-list">
          ${activeList.map(b => {
            const formattedDate = new Date(b.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
            return `
              <div class="booking-item-card" data-id="${b.id}">
                <div class="booking-card-main">
                  <div class="booking-provider-avatar">
                    <img src="${b.providerImage}" alt="${b.providerName}">
                  </div>
                  <div>
                    <div style="display:flex; align-items:center; gap:10px; margin-bottom:4px;">
                      <span class="booking-status-tag status-${b.status.toLowerCase()}">${b.status}</span>
                      <span style="font-size:0.75rem; font-family:var(--font-display); color:var(--text-muted);">${b.id}</span>
                    </div>
                    <h4 class="booking-title">${b.serviceName}</h4>
                    <p class="booking-pro-meta">with ${b.providerName} • ${b.providerRole}</p>
                    <div class="booking-datetime-tag" style="display:inline-flex; align-items:center; gap:6px;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      <span>${formattedDate} @ <strong>${b.time}</strong> (${b.duration})</span>
                    </div>
                  </div>
                </div>

                <div class="booking-card-actions">
                  <span class="booking-price">${b.priceFormatted}</span>
                  ${b.status === 'Upcoming' ? `
                    <div style="display:flex; gap:8px;">
                      <button class="btn btn-outline btn-sm reschedule-btn" data-id="${b.id}" style="display:inline-flex; align-items:center; gap:4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                        <span>Reschedule</span>
                      </button>
                      <button class="btn btn-outline btn-sm cancel-btn" data-id="${b.id}" style="color:#C84B31; border-color:#C84B31; display:inline-flex; align-items:center; gap:4px;">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        <span>Cancel</span>
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  // Bind Tab Click Handlers
  container.querySelectorAll('.dash-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeDashboardTab = btn.getAttribute('data-tab');
      renderDashboardContent();
    });
  });

  // Bind Reschedule Action Handlers
  container.querySelectorAll('.reschedule-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openRescheduleModal(id);
    });
  });

  // Bind Cancel Action Handlers
  container.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      openCancelConfirmationModal(id);
    });
  });
}

/* Reschedule Modal Flow */
function openRescheduleModal(bookingId) {
  const bookings = getStoredBookings();
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return;

  const modal = document.getElementById('reschedule-modal');
  const body = document.getElementById('reschedule-modal-content');
  if (!modal || !body) return;

  let newDate = b.date;
  let newTime = null;

  body.innerHTML = `
    <div class="reschedule-box">
      <div class="wizard-step-header">
        <h2>Reschedule Appointment</h2>
        <p>Rescheduling <strong>${b.serviceName}</strong> with <strong>${b.providerName}</strong>.</p>
      </div>

      <div style="margin-bottom:24px;">
        <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:10px;">Select New Date</label>
        <div id="reschedule-quick-dates"></div>
      </div>

      <div style="margin-bottom:24px;">
        <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:10px;">Available Time Slots</label>
        <div class="time-slots-grid" id="reschedule-slots-grid"></div>
      </div>

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" onclick="closeRescheduleModal();">Cancel</button>
        <button class="btn btn-primary" id="confirm-reschedule-btn" disabled>Confirm New Time →</button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  function updateSlots(dateStr) {
    newDate = dateStr;
    newTime = null;
    document.getElementById('confirm-reschedule-btn')?.setAttribute('disabled', 'true');

    const srv = SERVICES_DATA.find(s => s.id === b.serviceId) || SERVICES_DATA[0];
    const slots = generateAvailableTimeSlots(b.providerId, dateStr, srv.duration);

    const grid = document.getElementById('reschedule-slots-grid');
    if (!grid) return;

    grid.innerHTML = slots.map(s => `
      <button class="time-slot-btn ${!s.available ? 'disabled' : ''}" data-time="${s.time}" ${!s.available ? 'disabled' : ''}>
        <span>${s.time}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.time-slot-btn:not(.disabled)').forEach(slotBtn => {
      slotBtn.addEventListener('click', () => {
        grid.querySelectorAll('.time-slot-btn').forEach(sb => sb.classList.remove('selected'));
        slotBtn.classList.add('selected');
        newTime = slotBtn.getAttribute('data-time');
        document.getElementById('confirm-reschedule-btn')?.removeAttribute('disabled');
      });
    });
  }

  renderQuickDatePills('reschedule-quick-dates', updateSlots, newDate);
  updateSlots(newDate);

  document.getElementById('confirm-reschedule-btn')?.addEventListener('click', () => {
    if (newDate && newTime) {
      updateBookingStatus(b.id, 'Upcoming', newDate, newTime);
      closeRescheduleModal();
      renderDashboardContent();
    }
  });
}

function closeRescheduleModal() {
  const modal = document.getElementById('reschedule-modal');
  if (modal) modal.classList.remove('active');
}

/* Cancel Confirmation Modal */
function openCancelConfirmationModal(bookingId) {
  const modal = document.getElementById('cancel-confirm-modal');
  const body = document.getElementById('cancel-modal-content');
  if (!modal || !body) return;

  const bookings = getStoredBookings();
  const b = bookings.find(x => x.id === bookingId);
  if (!b) return;

  body.innerHTML = `
    <div style="text-align:center; padding:24px;">
      <h3 style="font-size:1.8rem; margin-bottom:12px;">Cancel Appointment?</h3>
      <p style="color:var(--text-muted); margin-bottom:28px;">Are you sure you want to cancel your <strong>${b.serviceName}</strong> appointment on ${b.date} @ ${b.time}?</p>

      <div style="display:flex; gap:16px; justify-content:center;">
        <button class="btn btn-outline" onclick="closeCancelModal();">Keep Appointment</button>
        <button class="btn btn-primary" id="final-cancel-btn" style="background-color:#C84B31; border-color:#C84B31;">Yes, Cancel Appointment</button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  document.getElementById('final-cancel-btn')?.addEventListener('click', () => {
    updateBookingStatus(b.id, 'Cancelled');
    closeCancelModal();
    renderDashboardContent();
  });
}

function closeCancelModal() {
  const modal = document.getElementById('cancel-confirm-modal');
  if (modal) modal.classList.remove('active');
}
