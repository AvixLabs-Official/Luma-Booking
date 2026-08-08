/**
 * LUMA STUDIO - Main Application Orchestrator
 * Controls navigation transitions, mobile menu, and global modal event listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initMobileMenu();
  updateBookingBadgeCount();
});

function initNavigation() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileDrawer);
  });
}

function closeMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateBookingBadgeCount() {
  const badge = document.getElementById('my-bookings-count-badge');
  if (badge) {
    const bookings = getStoredBookings();
    const upcoming = bookings.filter(b => b.status === 'Upcoming');
    badge.textContent = upcoming.length;
  }
}

// Global Keyboard Escape Key Listener
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeBookingModal();
    closeSuccessModal();
    closeDashboardModal();
    closeRescheduleModal();
    closeCancelModal();
    closeMobileDrawer();
  }
});
