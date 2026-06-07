/* ================================================================
   Home Page — 6 interactive dashboard cards
   ================================================================ */

(function () {
  'use strict';

  const ChartRefs = {};

  function destroyCharts() {
    Object.values(ChartRefs).forEach(c => { try { c.destroy(); } catch(e) {} });
    Object.keys(ChartRefs).forEach(k => delete ChartRefs[k]);
  }

  /* ── Formatters ─────────────────────────────────────────────── */
  const fmtK   = v => CompData.fmtK(v);
  const fmtFull = v => CompData.fmtFull(v);

  /* ── Hot Jobs data ──────────────────────────────────────────── */
  const HOT_JOBS = [
    { title:'Software Engineer',    dept:'Engineering', p50:'$145K', trend:'+8.2%', badge:'🔥 High Demand' },
    { title:'Data Scientist',       dept:'Engineering', p50:'$138K', trend:'+11.4%', badge:'📈 Fast Growing' },
    { title:'AI Product Manager',   dept:'Product',     p50:'$162K', trend:'+14.7%', badge:'🚀 Emerging' },
    { title:'HR Business Partner',  dept:'HR',          p50:'$102K', trend:'+4.1%',  badge:'💼 Stable' },
    { title:'Sales Director',       dept:'Sales',       p50:'$175K', trend:'+6.8%',  badge:'⭐ Strategic' },
  ];

  /* ── Card 1: Market Price a Job ─────────────────────────────── */
  function renderMarketPriceCard() {
    const titles = CompData.jobs.map(j => j.title).filter((v,i,a) => a.indexOf(v) === i).slice(0, 60);
    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">🔍 Market Price a Job</div>
          <div class="card-subtitle">Search compensation benchmarks</div>
        </div>
      </div>
      <div class="card-body" style="flex:1;">
        <div class="autocomplete-wrap">
          <div class="search-wrap" style="margin-bottom:8px;">
            <span class="search-icon" style="top:50%;transform:translateY(-50%);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
            <input id="job-search-input" class="search-input" type="text" placeholder="e.g. Senior Software Engineer…" autocomplete="off" aria-label="Search jobs" />
          </div>
          <div id="job-autocomplete" class="autocomplete-list" aria-live="polite"></div>
        </div>
        <button id="job-search-go" class="btn btn-primary w-full" style="margin-top:8px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          Search Market Data
        </button>
        <div class="recent-searches" style="margin-top:14px;">
          <div class="recent-searches-label">Quick Access</div>
          <span class="recent-search-chip" data-job="Software Engineer">Software Engineer</span>
          <span class="recent-search-chip" data-job="Data Scientist">Data Scientist</span>
          <span class="recent-search-chip" data-job="Product Manager">Product Manager</span>
          <span class="recent-search-chip" data-job="Sales Director">Sales Director</span>
        </div>
      </div>
    </div>`;
  }

  function initMarketPriceCard() {
    const input = document.getElementById('job-search-input');
    const list  = document.getElementById('job-autocomplete');
    const goBtn = document.getElementById('job-search-go');
    const titles = [...new Set(CompData.jobs.map(j => j.title))];

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { list.classList.remove('open'); return; }
      const matches = titles.filter(t => t.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) { list.classList.remove('open'); return; }
      list.innerHTML = matches.map(t => `
        <div class="autocomplete-item" data-value="${t}">
          <span class="autocomplete-item-dot"></span>${t}
        </div>`).join('');
      list.classList.add('open');
    });

    list.addEventListener('click', e => {
      const item = e.target.closest('.autocomplete-item');
      if (!item) return;
      input.value = item.dataset.value;
      list.classList.remove('open');
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.autocomplete-wrap')) list.classList.remove('open');
    }, true);

    function doSearch() {
      const q = input.value.trim();
      list.classList.remove('open');
      App.navigate('market', { search: q });
    }

    goBtn.addEventListener('click', doSearch);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

    document.querySelectorAll('.recent-search-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        App.navigate('market', { search: chip.dataset.job });
      });
    });
  }

  /* ── Card 2: Hot Jobs Carousel ──────────────────────────────── */
  function renderHotJobsCard() {
    const slides = HOT_JOBS.map(j => `
      <div class="hot-job-slide">
        <div class="hot-job-card" data-job="${j.title}">
          <div class="hot-job-title">${j.title}</div>
          <div class="hot-job-meta">
            <span class="badge badge-blue">${j.dept}</span>
            <span style="margin-left:6px;font-size:11.5px;color:var(--success);font-weight:600;">${j.trend} YoY</span>
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;margin-left:6px;">
            <span class="hot-job-salary">P50: ${j.p50}</span>
            <span style="font-size:11px;background:#f0fdf4;color:var(--success);padding:2px 8px;border-radius:100px;font-weight:600;">${j.badge}</span>
          </div>
        </div>
      </div>`).join('');

    const dots = HOT_JOBS.map((_,i) => `<button class="carousel-dot ${i===0?'active':''}" data-idx="${i}" aria-label="Slide ${i+1}"></button>`).join('');

    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">🔥 Hot Jobs</div>
          <div class="card-subtitle">Trending compensation benchmarks</div>
        </div>
        <span class="badge badge-orange">Live</span>
      </div>
      <div class="card-body" style="flex:1;">
        <div class="hot-jobs-track">
          <div class="hot-jobs-slides" id="hot-slides">${slides}</div>
        </div>
        <div class="carousel-nav">
          <button class="carousel-btn" id="carousel-prev" aria-label="Previous">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="carousel-dots">${dots}</div>
          <button class="carousel-btn" id="carousel-next" aria-label="Next">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>
    </div>`;
  }

  function initHotJobsCard() {
    const track  = document.getElementById('hot-slides');
    const dots   = document.querySelectorAll('.carousel-dot');
    const prev   = document.getElementById('carousel-prev');
    const next   = document.getElementById('carousel-next');
    let current  = 0;
    const total  = HOT_JOBS.length;

    function goTo(idx) {
      current = (idx + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.idx)));

    document.querySelectorAll('.hot-job-card').forEach(card => {
      card.addEventListener('click', () => App.navigate('market', { search: card.dataset.job }));
    });

    // Auto-advance
    let timer = setInterval(() => goTo(current + 1), 4000);
    track.closest('.card').addEventListener('mouseenter', () => clearInterval(timer));
    track.closest('.card').addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 4000); });
  }

  /* ── Card 3: Total Compensation Statement ───────────────────── */
  function renderCompStatementCard() {
    const featured = CompData.featuredEmployees();
    const options = featured.map((e,i) => `<option value="${i}">${e.name}</option>`).join('');
    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">📋 Total Compensation Statement</div>
          <div class="card-subtitle">Individual employee pay analysis</div>
        </div>
        <select id="emp-select" class="form-control" style="width:160px;" aria-label="Select employee">${options}</select>
      </div>
      <div class="card-body" style="flex:1;" id="comp-statement-body">
      </div>
    </div>`;
  }

  function renderCompStatement(emp) {
    const pctClass = emp.marketIndex >= 115 ? 'text-danger' : emp.marketIndex <= 85 ? 'text-warning' : 'text-success';
    const barColor = emp.marketIndex >= 115 ? 'var(--danger)' : emp.marketIndex <= 85 ? 'var(--warning)' : 'var(--success)';
    const barW     = Math.min(100, emp.marketIndex);

    return `
      <div class="comp-statement-header">
        <div class="emp-avatar" style="background:${emp.avatarColor};">${emp.initials}</div>
        <div>
          <div class="comp-statement-name">${emp.name}</div>
          <div class="comp-statement-role">${emp.jobTitle}</div>
          <div style="margin-top:4px;">
            <span class="badge badge-blue">${emp.department}</span>
            <span class="badge badge-gray" style="margin-left:4px;">${emp.level}</span>
          </div>
        </div>
      </div>
      <div class="info-row">
        <span class="info-row-label">Market Pay Level</span>
        <span class="info-row-value">${emp.levelCode}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Years at Company</span>
        <span class="info-row-value">${emp.tenure} yrs</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Performance Rating</span>
        <span class="info-row-value">${emp.performance}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Base Salary</span>
        <span class="info-row-value">${fmtFull(emp.salary)}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Annual Bonus</span>
        <span class="info-row-value">${fmtFull(emp.bonus)}</span>
      </div>
      <div class="info-row" style="background:var(--bg-subtle);border-radius:6px;padding:8px 10px;margin-top:4px;">
        <span class="info-row-label font-bold" style="color:var(--text);">Total Direct Comp</span>
        <span class="info-row-value" style="font-size:15px;color:var(--primary);">${fmtFull(emp.tdc)}</span>
      </div>
      <div class="info-row">
        <span class="info-row-label">Composite MRP</span>
        <span class="info-row-value">${fmtFull(emp.mrp)}</span>
      </div>
      <div style="margin-top:8px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">
          <span class="text-secondary font-medium">Market Index</span>
          <span class="font-bold ${pctClass}">${emp.marketIndex}%</span>
        </div>
        <div class="market-index-bar">
          <div class="market-index-fill" style="width:${barW}%;background:${barColor};"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:10.5px;color:var(--text-3);margin-top:3px;">
          <span>0%</span><span>Market (100%)</span><span>150%+</span>
        </div>
      </div>`;
  }

  function initCompStatementCard() {
    const featured = CompData.featuredEmployees();
    const body = document.getElementById('comp-statement-body');
    const sel  = document.getElementById('emp-select');

    function update() {
      body.innerHTML = renderCompStatement(featured[+sel.value]);
    }

    sel.addEventListener('change', update);
    update();
  }

  /* ── Card 4: Employees Scatter Plot ─────────────────────────── */
  function renderEmployeesCard() {
    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">👥 Employees</div>
          <div class="card-subtitle">Pay vs. market positioning (100 employees)</div>
        </div>
      </div>
      <div class="card-body" style="flex:1;display:flex;flex-direction:column;">
        <div class="scatter-legend">
          <div class="scatter-legend-item"><span class="legend-dot" style="background:#1a56db;"></span>At Market</div>
          <div class="scatter-legend-item"><span class="legend-dot" style="background:#f59e0b;"></span>Overpaid</div>
          <div class="scatter-legend-item"><span class="legend-dot" style="background:#ef4444;"></span>Underpaid</div>
        </div>
        <div class="chart-container" style="flex:1;min-height:0;">
          <canvas id="scatter-chart" aria-label="Employee pay scatter plot" role="img"></canvas>
        </div>
      </div>
    </div>`;
  }

  function initEmployeesScatter() {
    const ctx = document.getElementById('scatter-chart');
    if (!ctx) return;

    const at = [], over = [], under = [];
    CompData.employees.forEach(e => {
      const pt = { x: e.mrp, y: e.salary, label: e.name, job: e.jobTitle, dept: e.department };
      if (e.marketIndex >= 115) over.push(pt);
      else if (e.marketIndex <= 85) under.push(pt);
      else at.push(pt);
    });

    ChartRefs.scatter = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [
          { label:'At Market', data:at,    backgroundColor:'rgba(26,86,219,0.72)',  pointRadius:5, pointHoverRadius:7 },
          { label:'Overpaid',  data:over,  backgroundColor:'rgba(245,158,11,0.75)', pointRadius:5, pointHoverRadius:7 },
          { label:'Underpaid', data:under, backgroundColor:'rgba(239,68,68,0.75)',  pointRadius:5, pointHoverRadius:7 },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
            titleFont: { size: 13, weight: '700' },
            bodyFont: { size: 12 },
            callbacks: {
              title: ([item]) => item.raw.label,
              label: (item) => [
                `Job: ${item.raw.job}`,
                `Salary: ${CompData.fmtFull(item.raw.y)}`,
                `Market P50: ${CompData.fmtFull(item.raw.x)}`,
              ],
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'Composite MRP (Market Ref. Point)', font:{size:11,weight:'600'}, color:'#64748b' },
            grid: { color: '#f1f5f9' },
            ticks: { font:{size:11}, color:'#94a3b8', callback: v => CompData.fmtK(v) },
          },
          y: {
            title: { display: true, text: 'Employee Pay', font:{size:11,weight:'600'}, color:'#64748b' },
            grid: { color: '#f1f5f9' },
            ticks: { font:{size:11}, color:'#94a3b8', callback: v => CompData.fmtK(v) },
          },
        },
      }
    });
  }

  /* ── Card 5: Cost to Budget ─────────────────────────────────── */
  function renderCostToBudgetCard() {
    const depts = CompData.departments;
    const opts = depts.map(d => `<option value="${d}">${d}</option>`).join('');
    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">💰 Cost to Budget</div>
          <div class="card-subtitle">Department salary distribution</div>
        </div>
      </div>
      <div class="card-body" style="flex:1;display:flex;flex-direction:column;">
        <div class="budget-controls">
          <select id="budget-dept" class="form-control" aria-label="Select department">${opts}</select>
          <input id="budget-threshold" class="form-control" type="number" min="50000" max="800000" step="10000" value="150000" placeholder="Budget threshold ($)" aria-label="Budget threshold" />
        </div>
        <div class="chart-container" style="flex:1;min-height:0;">
          <canvas id="budget-chart" aria-label="Salary distribution histogram" role="img"></canvas>
        </div>
        <div class="budget-info" id="budget-info"></div>
      </div>
    </div>`;
  }

  function buildHistogramData(dept, threshold) {
    const allSalaries = CompData.employees.filter(e => e.department === dept).map(e => e.salary);
    if (!allSalaries.length) {
      // fallback – use all employees
      CompData.employees.slice(0, 20).map(e => e.salary);
    }
    const bucketSize = 20000;
    const min = 40000, max = 500000;
    const buckets = [];
    for (let b = min; b < max; b += bucketSize) {
      buckets.push({ lo: b, hi: b + bucketSize, count: 0, label: `${fmtK(b)}` });
    }
    allSalaries.forEach(s => {
      const idx = Math.min(Math.floor((s - min) / bucketSize), buckets.length - 1);
      if (idx >= 0) buckets[idx].count++;
    });
    const active = buckets.filter(b => b.count > 0);
    // pad a bit
    const start = Math.max(0, active.findIndex(b=>b.count>0) - 1);
    const end   = Math.min(buckets.length - 1, buckets.map(b=>b.count).lastIndexOf(Math.max(...buckets.map(b=>b.count>0?1:0))) + 2);
    return { buckets: buckets.slice(start, end+3), allSalaries };
  }

  function initCostToBudgetCard() {
    const deptSel   = document.getElementById('budget-dept');
    const threshInp = document.getElementById('budget-threshold');
    const info      = document.getElementById('budget-info');
    const ctx       = document.getElementById('budget-chart');
    if (!ctx) return;

    function redraw() {
      const dept      = deptSel.value;
      const threshold = parseInt(threshInp.value) || 150000;
      const { buckets, allSalaries } = buildHistogramData(dept, threshold);

      const labels = buckets.map(b => b.label);
      const vals   = buckets.map(b => b.count);
      const colors = buckets.map(b => b.lo >= threshold ? 'rgba(239,68,68,0.75)' : 'rgba(26,86,219,0.72)');

      if (ChartRefs.budget) { ChartRefs.budget.destroy(); delete ChartRefs.budget; }

      ChartRefs.budget = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Employees',
            data: vals,
            backgroundColor: colors,
            borderColor: colors.map(c => c.replace('0.72','1').replace('0.75','1')),
            borderWidth: 1,
            borderRadius: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              callbacks: {
                title: ([item]) => `Salary: ${item.label}–${fmtK(buckets[item.dataIndex]?.hi || 0)}`,
                label: (item) => `${item.raw} employee${item.raw !== 1 ? 's' : ''}`,
              }
            },
            annotation: {},
          },
          scales: {
            x: { grid:{ display:false }, ticks:{ font:{size:10}, color:'#94a3b8', maxRotation:45 } },
            y: { grid:{ color:'#f1f5f9' }, ticks:{ font:{size:11}, color:'#94a3b8', stepSize:1 }, beginAtZero:true },
          },
        }
      });

      const aboveBudget = allSalaries.filter(s => s >= threshold).length;
      const total = allSalaries.length;
      info.innerHTML = `
        <span>${total} employees in ${dept}</span>
        <span style="color:${aboveBudget > 0 ? 'var(--danger)' : 'var(--success)'};">
          ${aboveBudget} above budget threshold
        </span>`;
    }

    deptSel.addEventListener('change', redraw);
    threshInp.addEventListener('input', redraw);
    redraw();
  }

  /* ── Card 6: Relocation Wizard ──────────────────────────────── */
  function renderRelocationCard() {
    const locOptions = CompData.locations.map(l => `<option value="${l.city}, ${l.state}">${l.city}, ${l.state}</option>`).join('');
    const levelOpts  = ['L1 – Associate','L2 – Mid-Level','L3 – Senior','L4 – Lead/Manager','L5 – Principal','L6 – Director','L8 – VP'].map(l => `<option>${l}</option>`).join('');
    return `
    <div class="card" style="display:flex;flex-direction:column;">
      <div class="card-header">
        <div>
          <div class="card-title">✈️ Relocation Wizard</div>
          <div class="card-subtitle">Geographic compensation adjustment</div>
        </div>
      </div>
      <div class="card-body" style="flex:1;display:flex;flex-direction:column;padding-top:12px;">
        <div class="reloc-inputs">
          <div>
            <label class="form-label">Job Level</label>
            <select id="reloc-level" class="form-control">${levelOpts}</select>
          </div>
          <div>
            <label class="form-label">Current Salary</label>
            <input id="reloc-salary" class="form-control" type="number" value="120000" min="30000" max="1000000" step="5000" aria-label="Current salary" />
          </div>
          <div>
            <label class="form-label">Current Location</label>
            <select id="reloc-from" class="form-control">${locOptions}</select>
          </div>
          <div>
            <label class="form-label">New Location</label>
            <select id="reloc-to" class="form-control">${locOptions}</select>
          </div>
        </div>
        <div class="reloc-charts" style="flex:1;min-height:0;">
          <div style="display:flex;flex-direction:column;">
            <div class="reloc-chart-title">📍 Geo Differential</div>
            <div class="chart-container" style="flex:1;min-height:0;">
              <canvas id="reloc-geo-chart" aria-label="Geographic differential chart" role="img"></canvas>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;">
            <div class="reloc-chart-title">🏙️ Cost of Living Index</div>
            <div class="chart-container" style="flex:1;min-height:0;">
              <canvas id="reloc-col-chart" aria-label="Cost of living chart" role="img"></canvas>
            </div>
          </div>
        </div>
        <div id="reloc-result" style="text-align:center;margin-top:8px;font-size:13px;font-weight:600;color:var(--text);"></div>
      </div>
    </div>`;
  }

  // Pre-select sensible defaults for relocation
  function initRelocationCard() {
    const fromSel   = document.getElementById('reloc-from');
    const toSel     = document.getElementById('reloc-to');
    const salaryInp = document.getElementById('reloc-salary');
    const resultDiv = document.getElementById('reloc-result');

    // Default: SF → Austin
    const sfIdx = [...fromSel.options].findIndex(o => o.value.startsWith('San Francisco'));
    const ausIdx= [...toSel.options].findIndex(o => o.value.startsWith('Austin'));
    if (sfIdx >= 0) fromSel.selectedIndex = sfIdx;
    if (ausIdx >= 0) toSel.selectedIndex = ausIdx;

    function redraw() {
      const fromLoc   = CompData.getLocationByName(fromSel.value);
      const toLoc     = CompData.getLocationByName(toSel.value);
      const salary    = parseInt(salaryInp.value) || 120000;

      if (!fromLoc || !toLoc) return;

      const adjusted  = Math.round(salary * (toLoc.col / fromLoc.col) / 1000) * 1000;
      const delta     = adjusted - salary;
      const deltaSign = delta >= 0 ? '+' : '';
      const geoCtx    = document.getElementById('reloc-geo-chart');
      const colCtx    = document.getElementById('reloc-col-chart');
      if (!geoCtx || !colCtx) return;

      if (ChartRefs.reloGeo) { ChartRefs.reloGeo.destroy(); delete ChartRefs.reloGeo; }
      if (ChartRefs.reloCol) { ChartRefs.reloCol.destroy(); delete ChartRefs.reloCol; }

      ChartRefs.reloGeo = new Chart(geoCtx, {
        type: 'bar',
        data: {
          labels: ['Current Salary', 'Adjusted Salary'],
          datasets: [{
            data: [salary, adjusted],
            backgroundColor: ['rgba(26,86,219,0.75)', delta >= 0 ? 'rgba(16,185,129,0.75)' : 'rgba(239,68,68,0.75)'],
            borderColor:     ['#1a56db', delta >= 0 ? '#059669' : '#dc2626'],
            borderWidth: 1.5,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend:{ display:false }, tooltip:{ backgroundColor:'#0f172a', callbacks:{ label: i => fmtFull(i.raw) } } },
          scales: {
            x: { grid:{ display:false }, ticks:{ font:{size:10}, color:'#94a3b8' } },
            y: { grid:{ color:'#f1f5f9' }, ticks:{ font:{size:10}, color:'#94a3b8', callback: v => fmtK(v) } },
          }
        }
      });

      ChartRefs.reloCol = new Chart(colCtx, {
        type: 'bar',
        data: {
          labels: [fromLoc.city, toLoc.city],
          datasets: [{
            data: [fromLoc.col, toLoc.col],
            backgroundColor: ['rgba(124,58,237,0.70)', 'rgba(245,158,11,0.75)'],
            borderColor:     ['#7c3aed','#d97706'],
            borderWidth: 1.5,
            borderRadius: 4,
          }]
        },
        options: {
          responsive: true, maintainAspectRatio: false,
          plugins: { legend:{ display:false }, tooltip:{ backgroundColor:'#0f172a', callbacks:{ label: i => `COL Index: ${i.raw.toFixed(2)}` } } },
          scales: {
            x: { grid:{ display:false }, ticks:{ font:{size:10}, color:'#94a3b8' } },
            y: { grid:{ color:'#f1f5f9' }, ticks:{ font:{size:10}, color:'#94a3b8' }, beginAtZero:false },
          }
        }
      });

      const color = delta >= 0 ? 'var(--success)' : 'var(--danger)';
      resultDiv.innerHTML = `Adjusted: <span style="color:${color}">${fmtFull(adjusted)}</span> <span style="font-size:12px;color:${color};">(${deltaSign}${fmtFull(delta)})</span>`;
    }

    fromSel.addEventListener('change', redraw);
    toSel.addEventListener('change', redraw);
    salaryInp.addEventListener('input', redraw);
    redraw();
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.HomePage = {
    render() {
      return `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Executive Dashboard</h1>
            <div class="page-subtitle">Compensation analytics overview — ${new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export
            </button>
            <button class="btn btn-primary btn-sm">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Report
            </button>
          </div>
        </div>
        <div class="home-grid">
          ${renderMarketPriceCard()}
          ${renderCompStatementCard()}
          ${renderEmployeesCard()}
          ${renderHotJobsCard()}
          ${renderCostToBudgetCard()}
          ${renderRelocationCard()}
        </div>
      </div>`;
    },

    init() {
      initMarketPriceCard();
      initHotJobsCard();
      initCompStatementCard();
      initEmployeesScatter();
      initCostToBudgetCard();
      initRelocationCard();
    },

    destroy() {
      destroyCharts();
    }
  };
})();
