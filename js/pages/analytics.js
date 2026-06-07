/* ================================================================
   Analytics Page — Compensation prediction engine
   ================================================================ */

(function () {
  'use strict';

  const ChartRefs = {};
  let lastResult = null;

  function destroyCharts() {
    Object.values(ChartRefs).forEach(c => { try { c.destroy(); } catch(e){} });
    Object.keys(ChartRefs).forEach(k => delete ChartRefs[k]);
  }

  function fmtFull(v) { return CompData.fmtFull(v); }
  function fmtK(v)    { return CompData.fmtK(v); }

  /* ── Input Form ─────────────────────────────────────────────── */
  function renderForm() {
    const depts = CompData.departments;
    const fns   = CompData.functions;
    const edus  = CompData.education;
    const locs  = CompData.locations.map(l => `${l.city}, ${l.state}`);

    return `
    <div class="card prediction-form-card">
      <div class="card-header">
        <div>
          <div class="card-title">🧮 Compensation Predictor</div>
          <div class="card-subtitle">AI-powered salary modeling</div>
        </div>
      </div>
      <div class="card-body">
        <div class="form-group">
          <label class="form-label" for="pred-title">Job Title</label>
          <input id="pred-title" class="form-control" type="text" placeholder="e.g. Senior Data Scientist" value="Senior Software Engineer" />
        </div>
        <div class="form-group">
          <label class="form-label" for="pred-dept">Department</label>
          <select id="pred-dept" class="form-control" aria-label="Select department">
            ${depts.map(d => `<option ${d==='Engineering'?'selected':''}>${d}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="pred-fn">Job Function</label>
          <select id="pred-fn" class="form-control" aria-label="Select function">
            ${fns.map(f => `<option ${f==='Engineering'?'selected':''}>${f}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="pred-exp">Years of Experience</label>
          <div style="display:flex;align-items:center;gap:10px;">
            <input id="pred-exp" class="form-control" type="range" min="0" max="30" value="6" style="padding:4px;" />
            <span id="pred-exp-val" style="font-weight:700;min-width:28px;color:var(--primary);">6</span>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="pred-edu">Education Level</label>
          <select id="pred-edu" class="form-control" aria-label="Select education">
            ${edus.map(e => `<option ${e==="Bachelor's"?'selected':''}>${e}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Management Responsibility</label>
          <div style="display:flex;gap:10px;margin-top:4px;">
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:500;">
              <input type="radio" name="pred-mgmt" id="pred-mgmt-no" value="no" checked style="accent-color:var(--primary);" /> Individual Contributor
            </label>
            <label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:13px;font-weight:500;">
              <input type="radio" name="pred-mgmt" id="pred-mgmt-yes" value="yes" style="accent-color:var(--primary);" /> People Manager
            </label>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label" for="pred-loc">Location</label>
          <select id="pred-loc" class="form-control" aria-label="Select location">
            ${locs.map(l => `<option ${l.startsWith('San Francisco')?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>

        <button id="predict-btn" class="btn btn-primary predict-btn">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          Run Prediction
        </button>
        <div class="note" style="margin-top:10px;text-align:center;">Powered by simulated multiple linear regression on ${CompData.jobs.length.toLocaleString()} market data points</div>
      </div>
    </div>`;
  }

  /* ── Results Panel ───────────────────────────────────────────── */
  function renderResults(result, inputs) {
    if (!result) {
      return `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:400px;color:var(--text-3);text-align:center;">
        <div style="font-size:48px;margin-bottom:16px;">🧮</div>
        <div style="font-size:16px;font-weight:600;color:var(--text-2);">Ready to Predict</div>
        <div style="font-size:13px;margin-top:6px;">Fill in the form and click <strong>Run Prediction</strong><br>to generate compensation estimates.</div>
      </div>`;
    }

    const { salary, bonus, tcc, confidence, featureImportance, marketAlignment } = result;
    const alignMap = {
      aligned: { cls:'aligned', icon:'✅', text:'Market Aligned', sub:`Predicted compensation aligns with ${inputs.location} market rates.` },
      above:   { cls:'above',   icon:'⬆️', text:'Above National Average', sub:`Location premium applied for ${inputs.location}.` },
      below:   { cls:'below',   icon:'⬇️', text:'Below National Average', sub:`Lower cost-of-living market for ${inputs.location}.` },
    };
    const align = alignMap[marketAlignment] || alignMap.aligned;

    const featureBars = featureImportance.map(f => `
      <div class="feature-bar-row">
        <div class="feature-bar-labels">
          <span class="feature-name">${f.feature}</span>
          <span class="feature-pct">${f.pct}%</span>
        </div>
        <div class="feature-track">
          <div class="feature-fill" style="width:0;" data-width="${f.pct}%"></div>
        </div>
      </div>`).join('');

    return `
    <div>
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;padding:14px 16px;background:white;border:1px solid var(--border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);">
        <div>
          <div style="font-size:15px;font-weight:800;color:var(--text);">${inputs.title || 'Compensation Estimate'}</div>
          <div style="font-size:12.5px;color:var(--text-2);margin-top:3px;">
            ${inputs.dept} · ${inputs.fn} · ${inputs.exp} yrs exp · ${inputs.edu} · ${inputs.location}
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          <span class="badge badge-${confidence>=80?'green':confidence>=65?'orange':'red'}">${confidence}% Confidence</span>
          <button class="btn btn-ghost btn-sm">Export</button>
        </div>
      </div>

      <!-- Salary cards -->
      <div class="results-grid">
        <div class="result-card result-card-salary">
          <div class="result-card-label">Base Salary</div>
          <div class="result-card-p50">${fmtK(salary.p50)}</div>
          <div class="result-card-range">P25: ${fmtK(salary.p25)} · P75: ${fmtK(salary.p75)}</div>
        </div>
        <div class="result-card result-card-bonus">
          <div class="result-card-label">Annual Bonus</div>
          <div class="result-card-p50">${fmtK(bonus.p50)}</div>
          <div class="result-card-range">P25: ${fmtK(bonus.p25)} · P75: ${fmtK(bonus.p75)}</div>
        </div>
        <div class="result-card result-card-tcc">
          <div class="result-card-label">Total Cash Comp</div>
          <div class="result-card-p50">${fmtK(tcc.p50)}</div>
          <div class="result-card-range">P25: ${fmtK(tcc.p25)} · P75: ${fmtK(tcc.p75)}</div>
        </div>
      </div>

      <!-- Bottom grid -->
      <div class="analytics-right-grid">
        <!-- Feature importance -->
        <div class="card">
          <div class="card-header">
            <div class="card-title">📊 Feature Importance</div>
          </div>
          <div class="card-body">
            <div style="margin-bottom:8px;font-size:11.5px;color:var(--text-2);">Contribution of each factor to predicted salary</div>
            ${featureBars}
            <div class="note" style="margin-top:8px;">Based on multiple linear regression model</div>
          </div>
        </div>

        <!-- Confidence + Market Alignment -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="card" style="flex:1;">
            <div class="card-header">
              <div class="card-title">🎯 Prediction Confidence</div>
            </div>
            <div class="card-body">
              <div class="confidence-display">
                <div class="confidence-score">${confidence}%</div>
                <div class="confidence-label">Model Confidence Score</div>
                <div style="width:100%;margin-top:14px;">
                  <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-3);margin-bottom:4px;">
                    <span>Low</span><span>High</span>
                  </div>
                  <div style="height:8px;background:var(--border);border-radius:100px;overflow:hidden;">
                    <div style="height:100%;width:${confidence}%;background:linear-gradient(90deg,var(--primary),#60a5fa);border-radius:100px;transition:width 0.8s ease;"></div>
                  </div>
                </div>
              </div>
              <div style="margin-top:12px;">
                <div class="info-row">
                  <span class="info-row-label">Prediction Range</span>
                  <span class="info-row-value">${fmtK(salary.p25)} – ${fmtK(salary.p75)}</span>
                </div>
                <div class="info-row">
                  <span class="info-row-label">Data Points</span>
                  <span class="info-row-value">${(Math.floor(Math.random()*400)+400).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">📍 Market Alignment</div>
            </div>
            <div class="card-body" style="padding-top:10px;">
              <div class="market-alignment ${align.cls}">
                <div class="market-alignment-icon">${align.icon}</div>
                <div>
                  <div class="market-alignment-text">${align.text}</div>
                  <div class="market-alignment-sub">${align.sub}</div>
                </div>
              </div>
              <canvas id="comp-range-chart" style="margin-top:12px;" aria-label="Compensation range chart" role="img"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }

  function initFeatureBars() {
    // Animate feature bars in
    setTimeout(() => {
      document.querySelectorAll('.feature-fill[data-width]').forEach(el => {
        el.style.width = el.dataset.width;
      });
    }, 100);
  }

  function renderCompRangeChart(result) {
    const ctx = document.getElementById('comp-range-chart');
    if (!ctx || !result) return;
    if (ChartRefs.compRange) { ChartRefs.compRange.destroy(); delete ChartRefs.compRange; }

    ChartRefs.compRange = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['P25', 'P50', 'P75'],
        datasets: [
          {
            label: 'Base Salary',
            data: [result.salary.p25, result.salary.p50, result.salary.p75],
            backgroundColor: 'rgba(26,86,219,0.75)',
            borderColor: '#1a56db',
            borderWidth: 1.5,
            borderRadius: 4,
          },
          {
            label: 'Bonus',
            data: [result.bonus.p25, result.bonus.p50, result.bonus.p75],
            backgroundColor: 'rgba(16,185,129,0.70)',
            borderColor: '#059669',
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: true, position: 'bottom', labels: { font:{size:11}, boxWidth:12 } },
          tooltip: {
            backgroundColor: '#0f172a',
            callbacks: { label: item => `${item.dataset.label}: ${fmtFull(item.raw)}` }
          }
        },
        scales: {
          x: { stacked: true, grid:{display:false}, ticks:{font:{size:11},color:'#94a3b8'} },
          y: { stacked: true, grid:{color:'#f1f5f9'}, ticks:{font:{size:11},color:'#94a3b8', callback: v => fmtK(v)} },
        }
      }
    });
  }

  function runPrediction() {
    const btn = document.getElementById('predict-btn');
    if (btn) {
      btn.innerHTML = '<span class="spinner"></span> Analyzing…';
      btn.disabled = true;
    }

    const inputs = {
      title:         document.getElementById('pred-title')?.value || '',
      department:    document.getElementById('pred-dept')?.value || 'Engineering',
      jobFunction:   document.getElementById('pred-fn')?.value || 'Engineering',
      yearsExp:      parseInt(document.getElementById('pred-exp')?.value) || 5,
      education:     document.getElementById('pred-edu')?.value || "Bachelor's",
      hasManagement: document.querySelector('input[name="pred-mgmt"]:checked')?.value === 'yes',
      location:      document.getElementById('pred-loc')?.value || 'San Francisco, CA',
    };
    // alias for predictSalary
    inputs.dept   = inputs.department;
    inputs.edu    = inputs.education;
    inputs.exp    = inputs.yearsExp;
    inputs.fn     = inputs.jobFunction;

    setTimeout(() => {
      const result = CompData.predictSalary(inputs);
      lastResult = { result, inputs };

      const resultsPanel = document.getElementById('analytics-results');
      if (resultsPanel) {
        resultsPanel.innerHTML = renderResults(result, inputs);
        initFeatureBars();
        renderCompRangeChart(result);
      }

      if (btn) {
        btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> Run Prediction`;
        btn.disabled = false;
      }
    }, 800);
  }

  /* ── Public API ─────────────────────────────────────────────── */
  window.AnalyticsPage = {
    render() {
      return `
      <div>
        <div class="page-header">
          <div>
            <h1 class="page-title">Analytics</h1>
            <div class="page-subtitle">AI-powered compensation modeling and predictive analytics</div>
          </div>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost btn-sm">Model Settings</button>
            <button class="btn btn-primary btn-sm">Save Scenario</button>
          </div>
        </div>
        <div class="analytics-layout">
          ${renderForm()}
          <div id="analytics-results">
            ${renderResults(null, {})}
          </div>
        </div>
      </div>`;
    },

    init() {
      // Experience range display
      const expRange = document.getElementById('pred-exp');
      const expVal   = document.getElementById('pred-exp-val');
      if (expRange && expVal) {
        expRange.addEventListener('input', () => { expVal.textContent = expRange.value; });
      }

      // Run on button click
      const btn = document.getElementById('predict-btn');
      if (btn) btn.addEventListener('click', runPrediction);

      // Auto-predict on load with defaults
      setTimeout(runPrediction, 300);
    },

    destroy() {
      destroyCharts();
      lastResult = null;
    }
  };
})();
