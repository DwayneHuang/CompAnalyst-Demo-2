/* ================================================================
   CompAnalyst App — Router, Navigation & Initialization
   ================================================================ */

(function () {
  'use strict';

  const PAGES = {
    home:      { module: () => window.HomePage,    label: 'Home',        icon: homeIcon()    },
    market:    { module: () => window.MarketPage,  label: 'Market Data', icon: marketIcon()  },
    company:   { module: () => window.CompanyPage, label: 'Our Company', icon: companyIcon() },
    analytics: { module: () => window.AnalyticsPage, label: 'Analytics', icon: analyticsIcon() },
  };

  let currentPage = null;
  let currentModule = null;

  /* ── SVG Icons ──────────────────────────────────────────────── */
  function homeIcon()    { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`; }
  function marketIcon()  { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>`; }
  function companyIcon() { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`; }
  function analyticsIcon(){ return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`; }
  function bellIcon()    { return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`; }
  function settingsIcon(){ return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`; }

  /* ── Navigation render ───────────────────────────────────────── */
  function renderNav(activePage) {
    const links = Object.entries(PAGES).map(([key, pg]) =>
      `<button class="nav-link ${key===activePage?'active':''}" data-page="${key}" aria-label="${pg.label}">
        ${pg.icon} ${pg.label}
      </button>`
    ).join('');

    document.getElementById('top-nav').innerHTML = `
      <div class="nav-brand" id="nav-brand" role="banner">
        <div class="nav-brand-icon">CA</div>
        <div class="nav-brand-text">
          <span class="nav-brand-name">CompAnalyst</span>
          <span class="nav-brand-sub">HR Platform</span>
        </div>
      </div>
      <nav class="nav-links" role="navigation" aria-label="Primary navigation">
        ${links}
      </nav>
      <div class="nav-right">
        <button class="nav-icon-btn" id="nav-settings-btn" aria-label="Settings" title="Settings">
          ${settingsIcon()}
        </button>
        <div class="nav-divider"></div>
        <button class="nav-icon-btn" id="nav-bell-btn" aria-label="Notifications" title="Notifications">
          ${bellIcon()}
          <span class="nav-badge"></span>
        </button>
        <div class="nav-avatar" id="nav-avatar" title="User: Alex Thompson" aria-label="User profile">AT</div>
      </div>`;

    // Bind nav click events
    document.querySelectorAll('.nav-link[data-page]').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.page));
    });

    document.getElementById('nav-brand')?.addEventListener('click', () => navigate('home'));
  }

  /* ── Page Navigation ─────────────────────────────────────────── */
  function navigate(pageKey, params) {
    if (!PAGES[pageKey]) { pageKey = 'home'; }

    // Destroy old page
    if (currentModule?.destroy) {
      try { currentModule.destroy(); } catch(e) {}
    }

    // Update URL hash
    window.location.hash = pageKey;

    // Re-render nav with new active state
    renderNav(pageKey);

    // Get page module
    const page = PAGES[pageKey];
    currentModule = page.module();
    currentPage   = pageKey;

    // Render page HTML
    const content = document.getElementById('page-content');
    content.innerHTML = currentModule.render(params || {});

    // Initialize interactions
    if (currentModule.init) {
      try { currentModule.init(params || {}); } catch(e) { console.error('Page init error:', e); }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ── Expose for inter-page navigation ───────────────────────── */
  window.App = {
    navigate,
    currentPage: () => currentPage,
  };

  /* ── Initialize ─────────────────────────────────────────────── */
  function init() {
    // Parse hash or default to home
    const hash = window.location.hash.replace('#', '') || 'home';
    const startPage = PAGES[hash] ? hash : 'home';
    navigate(startPage);

    // Handle browser back/forward
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (PAGES[h] && h !== currentPage) navigate(h);
    });

    console.log('🚀 CompAnalyst initialized');
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
