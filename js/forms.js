/**
 * LUMA STUDIO - Landing Page Search & Category Filter Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  initServiceCatalogFilter();
});

function initServiceCatalogFilter() {
  const container = document.getElementById('landing-services-grid');
  const categoryContainer = document.getElementById('landing-category-pills');
  const searchInput = document.getElementById('landing-service-search');

  if (!container) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function renderLandingServices() {
    const filtered = SERVICES_DATA.filter(srv => {
      const matchCat = activeCategory === 'all' || srv.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = srv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          srv.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:60px 20px; background:var(--bg-card); border:1px dashed var(--border-color); border-radius:var(--radius-sm);">
          <h3>No services found</h3>
          <p style="color:var(--text-muted);">Try searching for hair, facial, massage, pilates, or consultation.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(srv => `
      <div class="landing-service-card">
        <div class="landing-srv-img-box">
          <img src="${srv.image}" alt="${srv.name}" loading="lazy">
          <span class="srv-cat-badge">${srv.categoryLabel}</span>
        </div>
        <div class="landing-srv-body">
          <h3 class="landing-srv-title">${srv.name}</h3>
          <p class="landing-srv-desc">${srv.description}</p>
          <div class="landing-srv-footer">
            <div>
              <span class="srv-price-main">${srv.priceFormatted}</span>
              <span class="srv-dur-sub">• ${srv.durationText}</span>
            </div>
            <button class="btn btn-outline btn-sm trigger-booking-btn" data-service-id="${srv.id}">Book Now →</button>
          </div>
        </div>
      </div>
    `).join('');

    // Re-bind booking buttons
    container.querySelectorAll('.trigger-booking-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const srvId = btn.getAttribute('data-service-id');
        openBookingModal(srvId);
      });
    });
  }

  // Category Pills Binding
  if (categoryContainer) {
    categoryContainer.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        categoryContainer.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-category');
        renderLandingServices();
      });
    });
  }

  // Search Input Binding
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderLandingServices();
    });
  }

  // Initial render
  renderLandingServices();
}
