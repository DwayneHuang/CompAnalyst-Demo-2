/* ================================================================
   Our Company Page — Internal compensation database with market comparison
   ================================================================ */

(function () {
  'use strict';

  const PAGE_SIZE = 15;
  let state = {
    employees: [],
    filtered: [],
    page: 1,
    selectedEmp: null,
    filter: { search:'', dept:'', level:'', perf:'', positionMkt:'' },
    sortCol: 'name',
    sortAsc: true,
  };

  function fmtFull(v) { return CompData.fmtFull(v); }
  function fmtK(v)    { return CompData.fmtK(v); }

  const PERF_COLOR = {
    '1 - Needs Improvement':'var(--danger)',
    '2 - Developing':'var(--warning)',
    '3 - Meets Expectations':'var(--text-2)',
    '4 - Exceeds Expectations':'var(--success)',
    '5 - Outstanding':'#7c3aed',
  };
  const PERF_BADGE = {
    '1 - Needs Improvement':'badge-red',
    '2 - Developing':'badge-orange',
    '3 - Meets Expectations':'badge-gray',
    '4 - Exceeds Expectations':'badge-green',
    '5 - Outstanding':'badge-purple',
  };

  function miColor(mi) {
    if (mi >= 115) return 'var(--danger)';
    if (mi <= 85)  return 'var(--warning)';
    return 'var(--success)';
  }
  function miDot(mi) {
    return `<span style="width:8px;height:8px;border-radius:50%;background:${miColor(mi)};display:inline-block;margin-right:5px;vertical-align:middle;flex-shrink:0;"></span>`;
  }

  function applyFilters() {
    const { search, dept, level, perf, positionMkt } = state.filter;
    state.filtered = state.employees.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) &&
                    !e.jobTitle.toLowerCase().includes(search.toLowerCase())) return false;
      if (dept    && e.department !== dept)     return false;
      if (level   && e.levelCode  !== level)    return false;
      if (perf    && e.performance !== perf)    return false;
      if (positionMkt && e.positionToMkt !== positionMkt) return false;
      return true;
    });
    // Sort
    state.filtered.sort((a, b) => {
      let av = a[state.sortCol], bv = b[state.sortCol];
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      return state.sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    state.page = 1;
    state.selectedEmp = null;
  }

  function renderFilters() {
    const depts = CompData.departments;
    const levels = ['L1','L2','L3','L4','L5','L6','L7','L8','L9'];
    const perfs  = ['1 - Needs Improvement','2 - Developing','3 - Meets Expectations','4 - Exceeds Expectations','5 - Outstanding'];
    const positions = ['At Market','Overpaid','Underpaid'];

    // Summary stats
    const total   = state.employees.length;
    const atMkt   = state.employees.filter(e => e.positionToMkt === 'At Market').length;
    const over    = state.employees.filter(e => e.positionToMkt === 'Overpaid').length;
    const under   = state.employees.filter(e => e.positionToMkt === 'Underpaid').length;
    const avgMI   = Math.round(state.employees.reduce((s,e) => s+e.marketIndex, 0) / total);

    return `
    <div class="filter-panel">
      <div class="filter-panel-title">
        Filters
        <button id="co-clear-filters" class="btn btn-ghost btn-xs">Clear</button>
      </div>

      <!-- Summary mini stats -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:14px;">
        <div style="background:var(--bg-subtle);border:1px solid var(--border);border-radius:6px;padding:8px 10px;text-align:center;">
          <div style="font-size:18px;font-weight:800;color:var(--primary);">${total}</div>
          <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;">Employees</div>
        </div>
        <div style="background:var(--bg-subtle);border:1px solid var(--border);border-radius:6px;padding:8px 10px;text-align:center;">
          <div style="font-size:18px;font-weight:800;color:${avgMI>=100?'var(--success)':'var(--warning)'};">${avgMI}%</div>
          <div style="font-size:10px;color:var(--text-3);font-weight:600;text-transform:uppercase;">Avg Mkt Index</div>
        </div>
        <div style="background:var(--success-bg);border:1px solid var(--success-border);border-radius:6px;padding:8px 10px;text-align:center;">
          <div style="font-size:16px;font-weight:800;color:var(--success);">${atMkt}</div>
          <div style="font-size:10px;color:var(--success);font-weight:600;text-transform:uppercase;">At Market</div>
        </div>
        <div style="background:var(--danger-bg);border:1px solid var(--danger-border);border-radius:6px;padding:8px 10px;text-align:center;">
          <div style="font-size:16px;font-weight:800;color:var(--danger);">${under}</div>
          <div style="font-size:10px;color:var(--danger);font-weight:600;text-transform:uppercase;">Underpaid</div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="filter-section">
        <div class="filter-section-label">Department</div>
        <select id="co-dept" class="form-control" aria-label="Filter by department">
          <option value="">All Departments</option>
          ${depts.map(d => `<option value="${d}" ${state.filter.dept===d?'selected':''}>${d}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Level Code</div>
        <select id="co-level" class="form-control" aria-label="Filter by level">
          <option value="">All Levels</option>
          ${levels.map(l => `<option value="${l}" ${state.filter.level===l?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Performance</div>
        <select id="co-perf" class="form-control" aria-label="Filter by performance">
          <option value="">All Ratings</option>
          ${perfs.map(p => `<option value="${p}" ${state.filter.perf===p?'selected':''}>${p.split(' - ')[1]}</option>`).join('')}
        </select>
      </div>
      <div class="filter-section">
        <div class="filter-section-label">Market Position</div>
        <select id="co-position" class="form-control" aria-label="Filter by market position">
          <option value="">All Positions</option>
          ${positions.map(p => `<option value="${p}" ${state.filter.positionMkt===p?'selected':''}>${p}</option>`).join('')}
        </select>
      </div>

      <div class="divider"></div>
      <div style="font-size:11.5px;color:var(--text-3);">
        Showing <strong style="color:var(--text-2);">${state.filtered.length}</strong> of
        <strong style="color:var(--text-2);">${total}</strong>
      </div>
    </div>`;
  }

  function renderMain() {
    const start = (state.page - 1) * PAGE_SIZE;
    const rows  = state.filtered.slice(start, start + PAGE_SIZE);
    const total = state.filtered.length;
    const pages = Math.ceil(total / PAGE_SIZE);

    const tableRows = rows.map(e => {
      const miBar = `<div style="display:inline-block;width:50px;height:4px;background:var(--border);border-radius:100px;overflow:hidden;vertical-align:middle;margin-left:5px;"><div style="height:100%;width:${Math.min(100,e.marketIndex)}%;background:${miColor(e.marketIndex)};border-radius:100px;"></div></div>`;
      return `
      <tr data-emp-id="${e.id}">
        <td>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:30px;height:30px;border-radius:50%;background:${e.avatarColor};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0;">${e.initials}</div>
            <div>
              <div style="font-weight:600;">${e.name}</div>
              <div style="font-size:11px;color:var(--text-3);">${e.id}</div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-size:12.5px;font-weight:500;max-width:160px;" class="truncate" title="${e.jobTitle}">${e.jobTitle}</div>
        </td>
        <td><span class="badge badge-blue">${e.department}</span></td>
        <td style="color:var(--text-2);">${e.manager.split(' ')[0]} ${e.manager.split(' ')[1][0]}.
        </td>
        <td class="mono"><strong>${fmtFull(e.salary)}</strong></td>
        <td class="mono text-secondary">${fmtFull(e.bonus)}</td>
        <td>
          <span class="badge ${PERF_BADGE[e.performance] || 'badge-gray'}" title="${e.performance}">${e.performance.split(' - ')[0]}★</span>
        </td>
        <td style="color:var(--text-2);">${e.tenure} yr${e.tenure!==1?'s':''}</td>
        <td>
          <div style="display:flex;align-items:center;gap:0;">
            ${miDot(e.marketIndex)}
            <span class="mono" style="color:${miColor(e.marketIndex)};font-weight:700;">${e.marketIndex}%</span>
            ${miBar}
          </div>
        </td>
        <td class="mono text-secondary">${e.compaRatio.toFixed(2)}</td>
        <td>
          <span class="badge ${e.positionToMkt==='At Market'?'badge-green':e.positionToMkt==='Overpaid'?'badge-orange':'badge-red'}">${e.positionToMkt}</span>
        </td>
      </tr>`;
    }).join('');

    // Pagination
    let pageBtns = '';
    const start2 = Math.max(1, state.page - 2);
    const end2   = Math.min(pages, state.page + 2);
    if (start2 > 1) pageBtns += `<button class="page-btn" data-page="1">1</button>${start2>2?'<span style="padding:0 4px;color:var(--text-3);">…</span>':''}`;
    for (let p = start2; p <= end2; p++) pageBtns += `<button class="page-btn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`;
    if (end2 < pages) pageBtns += `${end2<pages-1?'<span style="padding:0 4px;color:var(--text-3);">…</span>':''}<button class="page-btn" data-page="${pages}">${pages}</button>`;

    const sortTh = (col, label) => `<th data-col="${col}" style="cursor:pointer;" class="${state.sortCol===col?'sorted':''}">${label} ${state.sortCol===col?(state.sortAsc?'↑':'↓'):'↕'}</th>`;

    return `
    <div class="main-panel">
      <div style="display:flex;gap:10px;margin-bottom:14px;">
        <div class="search-wrap" style="flex:1;">
          <span class="search-icon" style="top:50%;transform:translateY(-50%);">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </span>
          <input id="co-search" class="search-input" type="text" value="${state.filter.search}" placeholder="Search by name or job title…" aria-label="Search employees" />
        </div>
        <button class="btn btn-primary btn-sm" id="co-search-btn">Search</button>
        <button class="btn btn-ghost btn-sm" id="co-export-btn">Export CSV</button>
      </div>

      <div class="card">
        <div class="data-grid-wrap">
          <table class="data-grid" id="company-grid" aria-label="Employee compensation data">
            <thead>
              <tr>
                ${sortTh('name','Employee')}
                ${sortTh('jobTitle','Job Title')}
                <th>Department</th>
                <th>Manager</th>
                ${sortTh('salary','Base Salary')}
                ${sortTh('bonus','Bonus')}
                ${sortTh('performance','Performance')}
                ${sortTh('tenure','Tenure')}
                ${sortTh('marketIndex','Market Index')}
                ${sortTh('compaRatio','Compa Ratio')}
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows || '<tr><td colspan="11" style="text-align:center;padding:32px;color:var(--text-3);">No employees match filters</td></tr>'}
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <button class="page-btn" id="co-prev" ${state.page===1?'disabled':''} aria-label="Previous">‹</button>
          ${pageBtns}
          <button class="page-btn" id="co-next" ${state.page>=pages?'disabled':''} aria-label="Next">›</button>
          <div class="pagination-info">Showing ${start+1}–${Math.min(start+PAGE_SIZE,total)} of ${total}</div>
        </div>
      </div>

      ${state.selectedEmp ? renderEmpDetail(state.selectedEmp) : ''}
    </div>`;
  }

  function renderEmpDetail(emp) {
    const job = CompData.jobs.find(j => j.id === emp.jobId) || {};
    const delta = emp.salary - emp.mrp;
    const deltaSign = delta >= 0 ? '+' : '';
    return `
    <div class="job-detail-panel" id="emp-detail" style="margin-top:12px;">
      <div class="job-detail-header">
        <div style="display:flex;align-items:center;gap:14px;">
          <div style="width:50px;height:50px;border-radius:50%;background:${emp.avatarColor};display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:white;">${emp.initials}</div>
          <div>
            <div class="job-detail-title">${emp.name}</div>
            <div class="job-detail-meta">
              <span class="badge badge-blue">${emp.department}</span>
              <span class="badge badge-gray" style="margin-left:5px;">${emp.level}</span>
              <span class="badge ${PERF_BADGE[emp.performance]||'badge-gray'}" style="margin-left:5px;">${emp.performance}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-ghost btn-sm" id="close-emp-detail">✕ Close</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-top:1px solid var(--border);">
        <div style="padding:16px 20px;border-right:1px solid var(--border);">
          <div class="stat-label">Internal Pay</div>
          <div class="info-row"><span class="info-row-label">Base Salary</span><span class="info-row-value">${fmtFull(emp.salary)}</span></div>
          <div class="info-row"><span class="info-row-label">Annual Bonus</span><span class="info-row-value">${fmtFull(emp.bonus)}</span></div>
          <div class="info-row" style="background:var(--bg-subtle);border-radius:5px;padding:8px;"><span class="info-row-label font-bold">Total Direct Comp</span><span class="info-row-value" style="color:var(--primary);">${fmtFull(emp.tdc)}</span></div>
        </div>
        <div style="padding:16px 20px;border-right:1px solid var(--border);">
          <div class="stat-label">Market Comparison</div>
          <div class="info-row"><span class="info-row-label">Market P50 (MRP)</span><span class="info-row-value">${fmtFull(emp.mrp)}</span></div>
          <div class="info-row"><span class="info-row-label">Market P25</span><span class="info-row-value">${fmtFull(job.salary?.p25||0)}</span></div>
          <div class="info-row"><span class="info-row-label">Market P75</span><span class="info-row-value">${fmtFull(job.salary?.p75||0)}</span></div>
        </div>
        <div style="padding:16px 20px;">
          <div class="stat-label">Position Indicators</div>
          <div class="info-row"><span class="info-row-label">Market Index</span><span class="info-row-value" style="color:${miColor(emp.marketIndex)};">${emp.marketIndex}%</span></div>
          <div class="info-row"><span class="info-row-label">Compa Ratio</span><span class="info-row-value">${emp.compaRatio.toFixed(2)}</span></div>
          <div class="info-row"><span class="info-row-label">Pay vs. Market</span><span class="info-row-value" style="color:${delta>=0?'var(--danger)':'var(--success);'}">${deltaSign}${fmtFull(Math.abs(delta))}</span></div>
        </div>
      </div>
      <div style="padding:12px 20px;border-top:1px solid var(--border);background:var(--bg-subtle);font-size:12.5px;color:var(--text-2);">
        <strong>${emp.name}</strong> · ${emp.jobTitle} · ${emp.location} · ${emp.tenure} yr${emp.tenure!==1?'s':''} tenure · Reporting to ${emp.manager}
      </div>
    </div>`;
  }

  function renderPage() {
    const el = document.getElementById('company-page-inner');
    if (!el) return;
    el.innerHTML = `
    <div class="two-panel-layout">
      ${renderFilters()}
      ${renderMain()}
    </div>`;
    attachEvents();
  }

  function attachEvents() {
    // Search
    const srch = document.getElementById('co-search');
    const srchBtn = document.getElementById('co-search-btn');
    if (srch) srch.addEventListener('keydown', e => { if (e.key === 'Enter') { state.filter.search = srch.value; applyFilters(); renderPage(); } });
    if (srchBtn) srchBtn.addEventListener('click', () => { if (srch) { state.filter.search = srch.value; applyFilters(); renderPage(); } });

    // Filters
    const bind = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', () => { state.filter[key] = el.value; applyFilters(); renderPage(); });
    };
    bind('co-dept','dept'); bind('co-level','level'); bind('co-perf','perf'); bind('co-position','positionMkt');

    const clearBtn = document.getElementById('co-clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      state.filter = { search:'', dept:'', level:'', perf:'', positionMkt:'' };
      applyFilters(); renderPage();
    });

    // Sorting
    document.querySelectorAll('#company-grid thead th[data-col]').forEach(th => {
      th.addEventListener('click', () => {
        const col = th.dataset.col;
        if (state.sortCol === col) state.sortAsc = !state.sortAsc;
        else { state.sortCol = col; state.sortAsc = true; }
        applyFilters(); renderPage();
      });
    });

    // Pagination
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => { state.page = +btn.dataset.page; renderPage(); });
    });
    const prev = document.getElementById('co-prev');
    const next = document.getElementById('co-next');
    if (prev) prev.addEventListener('click', () => { if (state.page > 1) { state.page--; renderPage(); } });
    if (next) next.addEventListener('click', () => { const pages=Math.ceil(state.filtered.length/PAGE_SIZE); if(state.page<pages){state.page++;renderPage();} });

    // Row click
    document.querySelectorAll('#company-grid tbody tr').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.empId;
        const emp = state.employees.find(e => e.id === id);
        state.selectedEmp = (state.selectedEmp?.id === id) ? null : emp;
        renderPage();
      });
    });

    // Close detail
    const closeBtn = document.getElementById('close-emp-detail');
    if (closeBtn) closeBtn.addEventListener('click', () => { state.selectedEmp = null; renderPage(); });
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.CompanyPage = {
    render() {
      state.employees = CompData.employees;
      applyFilters();
      return `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Our Company</h1>
            <div class="page-subtitle">Internal compensation database — ${CompData.employees.length} employees with market benchmarking</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button class="btn btn-outline btn-sm">⚡ Batch Adjust</button>
            <button class="btn btn-primary btn-sm">+ Add Employee</button>
          </div>
        </div>
        <div id="company-page-inner"></div>
      </div>`;
    },

    init() { renderPage(); },
    destroy() { state.selectedEmp = null; }
  };
})();
