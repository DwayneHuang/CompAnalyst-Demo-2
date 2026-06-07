/* ================================================================
   Market Data Page — External compensation benchmarking database
   ================================================================ */

(function () {
  'use strict';

  const PAGE_SIZE = 20;
  let state = {
    jobs: [],
    filtered: [],
    page: 1,
    sortCol: null,
    sortAsc: true,
    selectedJob: null,
    compTab: 'salary',
    selectedLocation: 'National Average',
    filter: { search:'', dept:'', fn:'', expLevel:'', edu:'', location:'' },
  };

  function fmtFull(v) { return CompData.fmtFull(v); }
  function fmtK(v)    { return CompData.fmtK(v); }

  /* ── Filter Logic ────────────────────────────────────────────── */
  function applyFilters() {
    const { search, dept, fn, expLevel, edu } = state.filter;
    state.filtered = state.jobs.filter(j => {
      if (search && !j.title.toLowerCase().includes(search.toLowerCase()) &&
                   !j.family.toLowerCase().includes(search.toLowerCase())) return false;
      if (dept    && j.department !== dept) return false;
      if (fn      && j.function   !== fn)   return false;
      if (edu     && j.education  !== edu)  return false;
      if (expLevel) {
        const e = parseInt(expLevel);
        if (j.experienceMin > e || j.experienceMax < e) return false;
      }
      return true;
    });
    state.page = 1;
    state.selectedJob = null;
    renderGrid();
  }

  /* ── Location-adjusted salary ────────────────────────────────── */
  function adjustedSalary(baseSal) {
    if (state.selectedLocation === 'National Average') return baseSal;
    return CompData.adjustForLocation(baseSal, state.selectedLocation);
  }

  /* ── Render Filter Panel ─────────────────────────────────────── */
  function renderFilters() {
    const depts = CompData.departments;
    const fns   = CompData.functions;
    const edus  = CompData.education;
    const expLevels = [
      {label:'Entry (0–2 yrs)', val:'1'},
      {label:'Mid (2–5 yrs)',   val:'3'},
      {label:'Senior (5–8 yrs)',val:'6'},
      {label:'Lead (8–12 yrs)', val:'9'},
      {label:'Director (12+)',  val:'14'},
    ];
    return `
    <div class="filter-panel">
      <div class="filter-panel-title">
        Filters
        <button id="clear-filters" class="btn btn-ghost btn-xs">Clear</button>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Department</div>
        <select id="f-dept" class="form-control" aria-label="Filter by department">
          <option value="">All Departments</option>
          ${depts.map(d => `<option value="${d}">${d}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Job Function</div>
        <select id="f-fn" class="form-control" aria-label="Filter by function">
          <option value="">All Functions</option>
          ${fns.map(f => `<option value="${f}">${f}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Experience Level</div>
        <select id="f-exp" class="form-control" aria-label="Filter by experience">
          <option value="">Any Experience</option>
          ${expLevels.map(e => `<option value="${e.val}">${e.label}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Education Req.</div>
        <select id="f-edu" class="form-control" aria-label="Filter by education">
          <option value="">Any Education</option>
          ${edus.map(e => `<option value="${e}">${e}</option>`).join('')}
        </select>
      </div>
      <div class="divider"></div>
      <div style="font-size:11.5px;color:var(--text-3);">
        <strong style="color:var(--text-2);">${state.filtered.length}</strong> of
        <strong style="color:var(--text-2);">${state.jobs.length}</strong> jobs
      </div>
    </div>`;
  }

  /* ── Render Main Area ────────────────────────────────────────── */
  function renderMain() {
    const start = (state.page - 1) * PAGE_SIZE;
    const rows  = state.filtered.slice(start, start + PAGE_SIZE);
    const total = state.filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE);

    const tableRows = rows.map(j => {
      const sal = adjustedSalary(j.salary.p50);
      const sel = state.selectedJob?.id === j.id;
      return `
      <tr class="${sel ? 'selected' : ''}" data-job-id="${j.id}">
        <td>
          <div style="font-weight:600;color:var(--text);">${j.title}</div>
          <div style="font-size:11.5px;color:var(--text-3);margin-top:2px;">${j.family}</div>
        </td>
        <td><span class="badge badge-blue">${j.department}</span></td>
        <td><span class="text-secondary">${j.function}</span></td>
        <td><span class="badge badge-gray">${j.level}</span></td>
        <td>${j.education}</td>
        <td style="color:var(--text-2);">${j.experienceMin}–${j.experienceMax} yrs</td>
        <td><span class="font-semibold" style="color:var(--primary);">${fmtK(sal)}</span></td>
        <td>
          <span class="badge ${j.management ? 'badge-purple' : 'badge-teal'}">${j.management ? 'Yes' : 'No'}</span>
        </td>
        <td>
          <button class="btn btn-ghost btn-xs view-detail-btn" data-job-id="${j.id}">Details →</button>
        </td>
      </tr>`;
    }).join('');

    // Pagination buttons
    let pageBtns = '';
    if (pages <= 7) {
      for (let p = 1; p <= pages; p++) {
        pageBtns += `<button class="page-btn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`;
      }
    } else {
      pageBtns += `<button class="page-btn ${state.page===1?'active':''}" data-page="1">1</button>`;
      if (state.page > 3) pageBtns += `<span style="padding:0 4px;color:var(--text-3);">…</span>`;
      for (let p = Math.max(2, state.page-1); p <= Math.min(pages-1, state.page+1); p++) {
        pageBtns += `<button class="page-btn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`;
      }
      if (state.page < pages - 2) pageBtns += `<span style="padding:0 4px;color:var(--text-3);">…</span>`;
      pageBtns += `<button class="page-btn ${state.page===pages?'active':''}" data-page="${pages}">${pages}</button>`;
    }

    const locOptions = ['National Average', ...CompData.locations.map(l => `${l.city}, ${l.state}`)];

    return `
    <div class="main-panel">
      <div style="display:flex;gap:10px;margin-bottom:14px;">
        <div class="search-wrap" style="flex:1;">
          <span class="search-icon" style="top:50%;transform:translateY(-50%);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <input id="market-search" class="search-input" type="text" value="${state.filter.search}" placeholder="Search job title or family…" aria-label="Search market data" />
        </div>
        <button class="btn btn-primary btn-sm" id="market-search-btn">Search</button>
      </div>

      <div class="card">
        <div class="results-bar" style="padding:12px 16px 0;">
          <div class="results-count"><strong>${total.toLocaleString()}</strong> matching jobs</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <label style="font-size:12px;font-weight:600;color:var(--text-2);">Location:</label>
            <select id="market-location" class="form-control" style="width:220px;" aria-label="Select location">
              ${locOptions.map(l => `<option ${l===state.selectedLocation?'selected':''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="data-grid-wrap">
          <table class="data-grid" id="market-grid" aria-label="Market compensation data">
            <thead>
              <tr>
                <th data-sort="title">Job Title ↕</th>
                <th data-sort="department">Department ↕</th>
                <th>Function</th>
                <th data-sort="level">Level ↕</th>
                <th>Education</th>
                <th>Experience</th>
                <th data-sort="salary">Mkt P50 ↕</th>
                <th>Mgmt</th>
                <th></th>
              </tr>
            </thead>
            <tbody id="market-tbody">
              ${tableRows || '<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--text-3);">No results found</td></tr>'}
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button class="page-btn" id="pg-prev" ${state.page===1?'disabled':''} aria-label="Previous page">‹</button>
          ${pageBtns}
          <button class="page-btn" id="pg-next" ${state.page>=pages?'disabled':''} aria-label="Next page">›</button>
          <div class="pagination-info">Showing ${start+1}–${Math.min(start+PAGE_SIZE, total)} of ${total}</div>
        </div>
      </div>

      ${state.selectedJob ? renderJobDetail(state.selectedJob) : ''}
    </div>`;
  }

  /* ── Job Detail Panel ────────────────────────────────────────── */
  function renderJobDetail(job) {
    const loc = state.selectedLocation;
    const locLabel = loc === 'National Average' ? 'National Average' : loc;

    function getSal(pct) {
      const v = job.salary[pct];
      return state.selectedLocation === 'National Average' ? v : CompData.adjustForLocation(v, state.selectedLocation);
    }
    function getBonus(pct) {
      const v = job.bonus[pct];
      return state.selectedLocation === 'National Average' ? v : CompData.adjustForLocation(v, state.selectedLocation);
    }
    function getTcc(pct) { return getSal(pct) + getBonus(pct); }

    const compRows = {
      salary: [
        { pct:'p25', label:'25th Pctl', val: getSal('p25') },
        { pct:'p50', label:'50th Pctl', val: getSal('p50') },
        { pct:'p75', label:'75th Pctl', val: getSal('p75') },
        { pct:'p90', label:'90th Pctl', val: getSal('p90') },
      ],
      bonus: [
        { pct:'p25', label:'25th Pctl', val: getBonus('p25') },
        { pct:'p50', label:'50th Pctl', val: getBonus('p50') },
        { pct:'p75', label:'75th Pctl', val: getBonus('p75') },
        { pct:'p90', label:'90th Pctl', val: Math.round(getBonus('p75') * 1.22 / 500) * 500 },
      ],
      tcc: [
        { pct:'p25', label:'25th Pctl', val: getTcc('p25') },
        { pct:'p50', label:'50th Pctl', val: getTcc('p50') },
        { pct:'p75', label:'75th Pctl', val: getTcc('p75') },
        { pct:'p90', label:'90th Pctl', val: getTcc('p90') },
      ],
    }[state.compTab];

    const tabBtns = ['salary','bonus','tcc'].map(t =>
      `<button class="tab-btn ${state.compTab===t?'active':''}" data-tab="${t}">${t==='tcc'?'Total Cash Comp':t==='salary'?'Base Salary':'Bonus'}</button>`
    ).join('');

    return `
    <div class="job-detail-panel" id="job-detail">
      <div class="job-detail-header">
        <div>
          <div class="job-detail-title">${job.title}</div>
          <div class="job-detail-meta">
            <span class="badge badge-blue">${job.department}</span>
            <span class="badge badge-gray" style="margin-left:6px;">${job.level}</span>
            <span class="badge badge-purple" style="margin-left:6px;">${job.marketLevel}</span>
            <span style="margin-left:10px;font-size:12px;color:var(--text-3);">Exp: ${job.experienceMin}–${job.experienceMax} yrs · Edu: ${job.education}</span>
          </div>
          <div style="font-size:12.5px;color:var(--text-2);margin-top:8px;max-width:700px;line-height:1.55;">${job.description}</div>
        </div>
        <button class="btn btn-ghost btn-sm" id="close-detail">✕ Close</button>
      </div>

      <div style="padding:12px 20px 0;">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:14px;">
          <div class="tabs" style="flex:1;">${tabBtns}</div>
          <div style="font-size:12px;color:var(--text-2);">📍 ${locLabel}</div>
        </div>
        <div class="comp-pct-grid">
          ${compRows.map(r => `
          <div class="comp-pct-item">
            <div class="comp-pct-label">${r.label}</div>
            <div class="comp-pct-value">${fmtFull(r.val)}</div>
          </div>`).join('')}
        </div>
        <div style="padding:12px 0 14px;">
          <div style="font-size:11.5px;color:var(--text-3);font-style:italic;">
            Data sourced from ${(Math.random() * 300 + 500).toFixed(0)} survey participants.
            Values adjusted for <strong>${locLabel}</strong> cost of living.
          </div>
        </div>
      </div>
    </div>`;
  }

  /* ── Full Page Render ────────────────────────────────────────── */
  function renderPage() {
    const container = document.getElementById('market-page-inner');
    if (!container) return;
    container.innerHTML = `
      <div class="two-panel-layout">
        ${renderFilters()}
        ${renderMain()}
      </div>`;
    attachEvents();
  }

  function renderGrid() {
    // Only re-render the right side
    renderPage();
  }

  /* ── Event Binding ───────────────────────────────────────────── */
  function attachEvents() {
    // Filter controls
    const fDept = document.getElementById('f-dept');
    const fFn   = document.getElementById('f-fn');
    const fExp  = document.getElementById('f-exp');
    const fEdu  = document.getElementById('f-edu');
    const clearBtn = document.getElementById('clear-filters');

    if (fDept) fDept.addEventListener('change', () => { state.filter.dept = fDept.value; applyFilters(); renderPage(); });
    if (fFn)   fFn.addEventListener('change',   () => { state.filter.fn = fFn.value;     applyFilters(); renderPage(); });
    if (fExp)  fExp.addEventListener('change',   () => { state.filter.expLevel = fExp.value; applyFilters(); renderPage(); });
    if (fEdu)  fEdu.addEventListener('change',   () => { state.filter.edu = fEdu.value;  applyFilters(); renderPage(); });
    if (clearBtn) clearBtn.addEventListener('click', () => {
      state.filter = { search:'', dept:'', fn:'', expLevel:'', edu:'', location:'' };
      [fDept, fFn, fExp, fEdu].forEach(el => { if (el) el.value = ''; });
      document.getElementById('market-search').value = '';
      applyFilters(); renderPage();
    });

    // Search
    const srch = document.getElementById('market-search');
    const srchBtn = document.getElementById('market-search-btn');
    if (srch) {
      srch.addEventListener('keydown', e => { if (e.key === 'Enter') { state.filter.search = srch.value; applyFilters(); renderPage(); } });
    }
    if (srchBtn) srchBtn.addEventListener('click', () => { if (srch) { state.filter.search = srch.value; applyFilters(); renderPage(); } });

    // Location
    const locSel = document.getElementById('market-location');
    if (locSel) locSel.addEventListener('change', () => { state.selectedLocation = locSel.value; renderPage(); });

    // Pagination
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { state.page = +btn.dataset.page; state.selectedJob = null; renderPage(); });
    });
    const pprev = document.getElementById('pg-prev');
    const pnext = document.getElementById('pg-next');
    if (pprev) pprev.addEventListener('click', () => { if (state.page > 1) { state.page--; state.selectedJob = null; renderPage(); } });
    if (pnext) pnext.addEventListener('click', () => { const pages = Math.ceil(state.filtered.length/PAGE_SIZE); if (state.page < pages) { state.page++; state.selectedJob = null; renderPage(); } });

    // Row click / detail button
    document.querySelectorAll('#market-tbody tr').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest('.view-detail-btn')) return;
        const id = row.dataset.jobId;
        const job = state.jobs.find(j => j.id === id);
        state.selectedJob = (state.selectedJob?.id === id) ? null : job;
        renderPage();
      });
    });
    document.querySelectorAll('.view-detail-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.dataset.jobId;
        const job = state.jobs.find(j => j.id === id);
        state.selectedJob = (state.selectedJob?.id === id) ? null : job;
        renderPage();
      });
    });

    // Close detail
    const closeBtn = document.getElementById('close-detail');
    if (closeBtn) closeBtn.addEventListener('click', () => { state.selectedJob = null; renderPage(); });

    // Comp tabs
    document.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => { state.compTab = btn.dataset.tab; renderPage(); });
    });
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.MarketPage = {
    render(params) {
      // Accept pre-filter from home page navigation
      if (params?.search) {
        state.filter.search = params.search;
      }
      state.jobs     = CompData.jobs;
      applyFilters();

      return `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Market Data</h1>
            <div class="page-subtitle">External compensation benchmarking — ${state.jobs.length.toLocaleString()} jobs across ${CompData.departments.length} departments</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>
            <button class="btn btn-primary btn-sm">📊 Compare Jobs</button>
          </div>
        </div>
        <div id="market-page-inner"></div>
      </div>`;
    },

    init(params) {
      renderPage();
      // If pre-search from home card, scroll to top
      if (params?.search) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    destroy() {
      // Reset state for next visit
      state.selectedJob = null;
    }
  };
})();
