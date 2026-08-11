/**
 * LUMA STUDIO - Interactive Date Picker & Month Calendar Widget
 */

let currentCalendarYear = new Date().getFullYear();
let currentCalendarMonth = new Date().getMonth();

function renderQuickDatePills(containerId, onSelectCallback, selectedDateStr = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const today = new Date();
  const pills = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const isoDate = d.toISOString().split('T')[0];
    const isClosed = d.getDay() === 0; // Sunday closed

    let label = i === 0 ? "Today" : (i === 1 ? "Tomorrow" : d.toLocaleDateString('en-US', { weekday: 'short' }));
    let sublabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const isSelected = selectedDateStr === isoDate;

    pills.push(`
      <button class="date-pill ${isSelected ? 'active' : ''} ${isClosed ? 'disabled' : ''}" 
              data-date="${isoDate}" ${isClosed ? 'disabled' : ''}>
        <span class="pill-day">${label}</span>
        <span class="pill-date">${sublabel}</span>
      </button>
    `);
  }

  container.innerHTML = pills.join('');

  container.querySelectorAll('.date-pill:not(.disabled)').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.date-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dateVal = btn.getAttribute('data-date');
      onSelectCallback(dateVal);
    });
  });
}

function renderMonthCalendar(containerId, onSelectCallback, selectedDateStr = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const todayStr = new Date().toISOString().split('T')[0];

  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
  const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Monday = 0

  let daysHtml = [];

  // Empty cells before 1st of month
  for (let i = 0; i < startDayOfWeek; i++) {
    daysHtml.push('<div class="calendar-day empty"></div>');
  }

  // Days of month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const dObj = new Date(currentCalendarYear, currentCalendarMonth, day);
    // Format YYYY-MM-DD
    const yyyy = dObj.getFullYear();
    const mm = String(dObj.getMonth() + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const isoStr = `${yyyy}-${mm}-${dd}`;

    const isPast = isoStr < todayStr;
    const isClosed = dObj.getDay() === 0; // Sunday
    const isSelected = selectedDateStr === isoStr;

    daysHtml.push(`
      <button class="calendar-day ${isSelected ? 'active' : ''} ${isPast || isClosed ? 'disabled' : ''}"
              data-date="${isoStr}" ${isPast || isClosed ? 'disabled' : ''}>
        ${day}
      </button>
    `);
  }

  container.innerHTML = `
    <div class="calendar-header">
      <button class="cal-nav-btn" id="cal-prev-month" aria-label="Previous Month" style="display:inline-flex; align-items:center; justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <span class="cal-month-title">${monthName}</span>
      <button class="cal-nav-btn" id="cal-next-month" aria-label="Next Month" style="display:inline-flex; align-items:center; justify-content:center;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
    <div class="calendar-weekdays">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>
    <div class="calendar-grid">
      ${daysHtml.join('')}
    </div>
  `;

  // Bind Month Navigation
  document.getElementById('cal-prev-month')?.addEventListener('click', () => {
    currentCalendarMonth--;
    if (currentCalendarMonth < 0) {
      currentCalendarMonth = 11;
      currentCalendarYear--;
    }
    renderMonthCalendar(containerId, onSelectCallback, selectedDateStr);
  });

  document.getElementById('cal-next-month')?.addEventListener('click', () => {
    currentCalendarMonth++;
    if (currentCalendarMonth > 11) {
      currentCalendarMonth = 0;
      currentCalendarYear++;
    }
    renderMonthCalendar(containerId, onSelectCallback, selectedDateStr);
  });

  // Bind Day Selection
  container.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.calendar-day').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const dateVal = btn.getAttribute('data-date');
      onSelectCallback(dateVal);
    });
  });
}
