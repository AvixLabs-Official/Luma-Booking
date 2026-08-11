/**
 * LUMA STUDIO - Multi-Step Interactive Booking Engine & State Manager
 */

let bookingState = {
  service: null,
  provider: null,
  date: getTomorrowDateString(),
  time: null,
  customer: { name: '', email: '', phone: '', note: '' },
  currentStep: 1
};

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
});

function initBookingWizard() {
  const wizardContainer = document.getElementById('booking-wizard-modal');
  if (!wizardContainer) return;

  // Global triggers
  document.querySelectorAll('.trigger-booking-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const srvId = btn.getAttribute('data-service-id');
      const proId = btn.getAttribute('data-provider-id');
      openBookingModal(srvId, proId);
    });
  });

  const closeBtn = document.getElementById('booking-modal-close');
  if (closeBtn) closeBtn.addEventListener('click', closeBookingModal);
}

function openBookingModal(initialServiceId = null, initialProviderId = null) {
  const modal = document.getElementById('booking-wizard-modal');
  if (!modal) return;

  // Reset state
  bookingState = {
    service: initialServiceId ? SERVICES_DATA.find(s => s.id === initialServiceId) : SERVICES_DATA[0],
    provider: initialProviderId ? PROFESSIONALS_DATA.find(p => p.id === initialProviderId) : null,
    date: getTomorrowDateString(),
    time: null,
    customer: { name: 'Ananya Kapoor', email: 'ananya@example.com', phone: '+91 98300 12345', note: '' },
    currentStep: initialServiceId ? (initialProviderId ? 3 : 2) : 1
  };

  if (bookingState.service && !bookingState.provider) {
    const validProviders = PROFESSIONALS_DATA.filter(p => p.serviceIds.includes(bookingState.service.id));
    bookingState.provider = validProviders[0] || PROFESSIONALS_DATA[0];
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  renderBookingStep();
}

function closeBookingModal() {
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function renderBookingStep() {
  const content = document.getElementById('booking-step-content');
  const progressHeader = document.getElementById('booking-progress-header');

  if (!content) return;

  // Progress Header Indicator
  if (progressHeader) {
    const steps = ["Service", "Specialist", "Date", "Time", "Details", "Review"];
    progressHeader.innerHTML = steps.map((name, i) => {
      const stepNum = i + 1;
      const isActive = stepNum === bookingState.currentStep;
      const isDone = stepNum < bookingState.currentStep;
      return `
        <div class="progress-step-pill ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}">
          <span class="step-num">${isDone ? '✓' : stepNum}</span>
          <span class="step-name">${name}</span>
        </div>
      `;
    }).join('');
  }

  switch (bookingState.currentStep) {
    case 1:
      renderStep1Service(content);
      break;
    case 2:
      renderStep2Provider(content);
      break;
    case 3:
      renderStep3Date(content);
      break;
    case 4:
      renderStep4Time(content);
      break;
    case 5:
      renderStep5Customer(content);
      break;
    case 6:
      renderStep6Review(content);
      break;
  }
}

/* STEP 1: Select Service */
function renderStep1Service(container) {
  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Select Service</h2>
        <p>Choose from our curated wellness, beauty, movement, and consultation offerings.</p>
      </div>

      <div class="services-select-grid">
        ${SERVICES_DATA.map(srv => {
          const isSelected = bookingState.service?.id === srv.id;
          return `
            <div class="service-select-card ${isSelected ? 'selected' : ''}" data-id="${srv.id}">
              <div class="srv-select-img-box">
                <img src="${srv.image}" alt="${srv.name}">
              </div>
              <div class="srv-select-info">
                <span class="service-category-tag">${srv.categoryLabel}</span>
                <h4 class="srv-select-title">${srv.name}</h4>
                <p class="srv-select-desc">${srv.description}</p>
                <div class="srv-select-footer">
                  <span class="srv-duration">⏱ ${srv.durationText}</span>
                  <span class="srv-price">${srv.priceFormatted}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="wizard-nav-actions">
        <button class="btn btn-primary" id="step1-next-btn" ${bookingState.service ? '' : 'disabled'}>Continue to Specialist →</button>
      </div>
    </div>
  `;

  container.querySelectorAll('.service-select-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const id = card.getAttribute('data-id');
      bookingState.service = SERVICES_DATA.find(s => s.id === id);

      // Auto-assign valid provider if current one doesn't match
      if (bookingState.provider && !bookingState.provider.serviceIds.includes(id)) {
        const validPro = PROFESSIONALS_DATA.find(p => p.serviceIds.includes(id));
        bookingState.provider = validPro || PROFESSIONALS_DATA[0];
      }

      document.getElementById('step1-next-btn').removeAttribute('disabled');
    });
  });

  document.getElementById('step1-next-btn')?.addEventListener('click', () => {
    if (bookingState.service) {
      bookingState.currentStep = 2;
      renderBookingStep();
    }
  });
}

/* STEP 2: Select Professional */
function renderStep2Provider(container) {
  const validProviders = PROFESSIONALS_DATA.filter(p => p.serviceIds.includes(bookingState.service.id));

  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Select Professional</h2>
        <p>Specialists available for <strong>${bookingState.service.name}</strong> (${bookingState.service.durationText}).</p>
      </div>

      <div class="providers-select-grid">
        ${validProviders.map(pro => {
          const isSelected = bookingState.provider?.id === pro.id;
          return `
            <div class="provider-select-card ${isSelected ? 'selected' : ''}" data-id="${pro.id}">
              <div class="pro-avatar-box">
                <img src="${pro.image}" alt="${pro.name}">
              </div>
              <div class="pro-select-info">
                <h4>${pro.name}</h4>
                <p class="pro-role">${pro.role}</p>
                <div class="pro-rating" style="display:inline-flex; align-items:center; gap:4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#C28E5C" stroke="#C28E5C"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  <span>${pro.rating} (${pro.reviewCount} Reviews)</span>
                </div>
                <p class="pro-bio">${pro.bio}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" id="step2-back-btn">← Back</button>
        <button class="btn btn-primary" id="step2-next-btn" ${bookingState.provider ? '' : 'disabled'}>Continue to Date →</button>
      </div>
    </div>
  `;

  container.querySelectorAll('.provider-select-card').forEach(card => {
    card.addEventListener('click', () => {
      container.querySelectorAll('.provider-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const id = card.getAttribute('data-id');
      bookingState.provider = PROFESSIONALS_DATA.find(p => p.id === id);
      document.getElementById('step2-next-btn').removeAttribute('disabled');
    });
  });

  document.getElementById('step2-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 1;
    renderBookingStep();
  });

  document.getElementById('step2-next-btn')?.addEventListener('click', () => {
    if (bookingState.provider) {
      bookingState.currentStep = 3;
      renderBookingStep();
    }
  });
}

/* STEP 3: Select Date */
function renderStep3Date(container) {
  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Select Appointment Date</h2>
        <p>Booking with <strong>${bookingState.provider.name}</strong> for <strong>${bookingState.service.name}</strong>.</p>
      </div>

      <div class="date-selection-container">
        <!-- Quick Date Pills -->
        <div style="margin-bottom:28px;">
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:12px;">Quick Select</label>
          <div class="quick-dates-strip" id="wizard-quick-dates"></div>
        </div>

        <!-- Full Month Calendar -->
        <div>
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:12px;">Or Select From Calendar</label>
          <div class="calendar-widget-box" id="wizard-month-calendar"></div>
        </div>
      </div>

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" id="step3-back-btn">← Back</button>
        <button class="btn btn-primary" id="step3-next-btn" ${bookingState.date ? '' : 'disabled'}>Continue to Time Slot →</button>
      </div>
    </div>
  `;

  function handleDatePicked(newDateStr) {
    bookingState.date = newDateStr;
    bookingState.time = null; // reset time selection
    document.getElementById('step3-next-btn').removeAttribute('disabled');
  }

  renderQuickDatePills('wizard-quick-dates', handleDatePicked, bookingState.date);
  renderMonthCalendar('wizard-month-calendar', handleDatePicked, bookingState.date);

  document.getElementById('step3-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 2;
    renderBookingStep();
  });

  document.getElementById('step3-next-btn')?.addEventListener('click', () => {
    if (bookingState.date) {
      bookingState.currentStep = 4;
      renderBookingStep();
    }
  });
}

/* STEP 4: Select Time Slot */
function renderStep4Time(container) {
  const slots = generateAvailableTimeSlots(bookingState.provider.id, bookingState.date, bookingState.service.duration);
  const formattedDate = new Date(bookingState.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Select Time Slot</h2>
        <p>Available times on <strong>${formattedDate}</strong> with <strong>${bookingState.provider.name}</strong>.</p>
      </div>

      ${slots.length === 0 ? `
        <div class="empty-state-notice">
          <p>⚠️ No available time slots on this date (Sunday or Studio Closed). Please choose another date.</p>
        </div>
      ` : `
        <div class="time-slots-grid">
          ${slots.map(s => {
            const isSelected = bookingState.time === s.time;
            return `
              <button class="time-slot-btn ${isSelected ? 'selected' : ''} ${!s.available ? 'disabled' : ''}" 
                      data-time="${s.time}" ${!s.available ? 'disabled' : ''}>
                <span class="slot-time-text">${s.time}</span>
                <span class="slot-status-lbl">${s.reason}</span>
              </button>
            `;
          }).join('')}
        </div>
      `}

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" id="step4-back-btn">← Back to Date</button>
        <button class="btn btn-primary" id="step4-next-btn" ${bookingState.time ? '' : 'disabled'}>Continue to Details →</button>
      </div>
    </div>
  `;

  container.querySelectorAll('.time-slot-btn:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      bookingState.time = btn.getAttribute('data-time');
      document.getElementById('step4-next-btn').removeAttribute('disabled');
    });
  });

  document.getElementById('step4-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 3;
    renderBookingStep();
  });

  document.getElementById('step4-next-btn')?.addEventListener('click', () => {
    if (bookingState.time) {
      bookingState.currentStep = 5;
      renderBookingStep();
    }
  });
}

/* STEP 5: Customer Information Form */
function renderStep5Customer(container) {
  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Your Information</h2>
        <p>Please enter your contact details to complete the booking reservation.</p>
      </div>

      <form id="booking-customer-form" class="form-grid">
        <div>
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">Full Name *</label>
          <input type="text" id="cust-name" value="${bookingState.customer.name}" placeholder="Ananya Kapoor" class="form-control" required>
        </div>

        <div>
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">Email Address *</label>
          <input type="email" id="cust-email" value="${bookingState.customer.email}" placeholder="ananya@example.com" class="form-control" required>
        </div>

        <div class="form-full">
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">Phone Number *</label>
          <input type="tel" id="cust-phone" value="${bookingState.customer.phone}" placeholder="+91 98300 12345" class="form-control" required>
        </div>

        <div class="form-full">
          <label style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.12em; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">Optional Notes or Special Preferences</label>
          <textarea id="cust-note" placeholder="Any allergies, mobility requirements, or preferences..." rows="3" class="form-control">${bookingState.customer.note}</textarea>
        </div>
      </form>

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" id="step5-back-btn">← Back to Time</button>
        <button class="btn btn-primary" id="step5-next-btn">Review Booking →</button>
      </div>
    </div>
  `;

  document.getElementById('step5-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 4;
    renderBookingStep();
  });

  document.getElementById('step5-next-btn')?.addEventListener('click', () => {
    const name = document.getElementById('cust-name')?.value.trim();
    const email = document.getElementById('cust-email')?.value.trim();
    const phone = document.getElementById('cust-phone')?.value.trim();
    const note = document.getElementById('cust-note')?.value.trim();

    if (!name || !email || !phone) {
      alert("Please fill in your name, email, and phone number.");
      return;
    }

    bookingState.customer = { name, email, phone, note };
    bookingState.currentStep = 6;
    renderBookingStep();
  });
}

/* STEP 6: Review & Final Confirmation */
function renderStep6Review(container) {
  const formattedDate = new Date(bookingState.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  container.innerHTML = `
    <div class="wizard-step-box">
      <div class="wizard-step-header">
        <h2>Review & Confirm Appointment</h2>
        <p>Please double-check your appointment details before confirming.</p>
      </div>

      <div class="review-summary-card">
        <div class="review-summary-header">
          <div>
            <span class="service-category-tag">${bookingState.service.categoryLabel}</span>
            <h3 style="font-size:1.8rem;">${bookingState.service.name}</h3>
            <p style="color:var(--text-muted); font-size:0.9rem;">Duration: ${bookingState.service.durationText}</p>
          </div>
          <div class="review-price-tag">${bookingState.service.priceFormatted}</div>
        </div>

        <div class="review-meta-grid">
          <div>
            <span class="review-label">Professional</span>
            <div style="display:flex; align-items:center; gap:10px; margin-top:4px;">
              <img src="${bookingState.provider.image}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;">
              <span style="font-weight:700;">${bookingState.provider.name}</span>
            </div>
          </div>

          <div>
            <span class="review-label">Date & Time</span>
            <div style="font-weight:700; margin-top:4px; color:var(--color-accent);">${formattedDate}</div>
            <div style="font-size:1.1rem; font-family:var(--font-display);">${bookingState.time}</div>
          </div>

          <div>
            <span class="review-label">Customer Name</span>
            <div style="font-weight:600; margin-top:4px;">${bookingState.customer.name}</div>
          </div>

          <div>
            <span class="review-label">Contact Details</span>
            <div style="font-size:0.88rem; color:var(--text-muted); margin-top:4px;">${bookingState.customer.email} • ${bookingState.customer.phone}</div>
          </div>
        </div>
      </div>

      <div class="wizard-nav-actions">
        <button class="btn btn-outline" id="step6-back-btn">← Edit Details</button>
        <button class="btn btn-primary" id="confirm-booking-btn" style="background-color:var(--color-accent); border-color:var(--color-accent);">Confirm Appointment →</button>
      </div>
    </div>
  `;

  document.getElementById('step6-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 5;
    renderBookingStep();
  });

  document.getElementById('confirm-booking-btn')?.addEventListener('click', () => {
    // Generate unique confirmation ID
    const randomHex = Math.floor(1000 + Math.random() * 9000).toString(16).toUpperCase();
    const confirmId = `LUMA-${randomHex}`;

    const newBooking = {
      id: confirmId,
      serviceId: bookingState.service.id,
      serviceName: bookingState.service.name,
      providerId: bookingState.provider.id,
      providerName: bookingState.provider.name,
      providerRole: bookingState.provider.role,
      providerImage: bookingState.provider.image,
      date: bookingState.date,
      time: bookingState.time,
      duration: bookingState.service.durationText,
      priceFormatted: bookingState.service.priceFormatted,
      price: bookingState.service.price,
      customerName: bookingState.customer.name,
      customerEmail: bookingState.customer.email,
      customerPhone: bookingState.customer.phone,
      status: "Upcoming",
      createdDate: new Date().toISOString()
    };

    saveBooking(newBooking);
    closeBookingModal();
    renderBookingSuccessScreen(newBooking);
  });
}

function renderBookingSuccessScreen(booking) {
  const modal = document.getElementById('success-modal');
  const body = document.getElementById('success-modal-content');

  if (!modal || !body) return;

  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  body.innerHTML = `
    <div class="success-screen-box">
      <div class="success-icon-badge">✓</div>
      <span class="section-tag">APPOINTMENT CONFIRMED</span>
      <h2 style="font-size:2.8rem; margin-bottom:12px;">YOU'RE BOOKED.</h2>
      <p style="color:var(--text-muted); margin-bottom:28px;">A confirmation receipt has been saved to your account session.</p>

      <div class="confirmation-code-box">
        <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.15em; color:var(--text-muted);">Confirmation Code</span>
        <strong class="code-val">${booking.id}</strong>
      </div>

      <div class="success-summary-grid">
        <div>
          <span class="review-label">Service</span>
          <div style="font-weight:700;">${booking.serviceName}</div>
        </div>
        <div>
          <span class="review-label">Professional</span>
          <div style="font-weight:700;">${booking.providerName}</div>
        </div>
        <div>
          <span class="review-label">Date & Time</span>
          <div style="font-weight:700; color:var(--color-accent);">${formattedDate} @ ${booking.time}</div>
        </div>
        <div>
          <span class="review-label">Price Paid / Due</span>
          <div style="font-weight:700;">${booking.priceFormatted}</div>
        </div>
      </div>

      <div style="display:flex; gap:16px; justify-content:center; margin-top:32px;">
        <button class="btn btn-outline" onclick="closeSuccessModal();">Back to Home</button>
        <button class="btn btn-primary" onclick="closeSuccessModal(); openDashboardModal();">View My Bookings →</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
