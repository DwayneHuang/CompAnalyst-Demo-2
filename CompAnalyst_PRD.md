# CompAnalyst — Product Requirements Document

## Product Vision

CompAnalyst is a modern, enterprise-grade HR Compensation Analytics Platform that empowers HR professionals, compensation managers, and business leaders to make data-driven pay decisions. The platform provides real-time market benchmarking, internal equity analysis, predictive compensation modeling, and relocation adjustment tools — all in a single, intuitive interface.

**Mission:** Eliminate compensation guesswork by giving every HR team access to market intelligence, internal insights, and predictive analytics in one unified platform.

---

## User Personas

### 1. Compensation Manager — "Chris"
- **Role:** Total Rewards / Compensation Analyst
- **Goals:** Price jobs accurately, ensure internal equity, design competitive salary bands
- **Pain Points:** Fragmented data sources, manual spreadsheet processes, delayed market surveys
- **Key Modules:** Market Data, Analytics (prediction model), Our Company

### 2. HR Business Partner — "Priya"
- **Role:** Strategic HR Partner embedded in a business unit
- **Goals:** Advise hiring managers on offer amounts, manage relocation packages, flag pay inequities
- **Pain Points:** Lack of real-time data, slow approval cycles for offers outside band
- **Key Modules:** Home Dashboard, Relocation Wizard, Our Company

### 3. Executive — "David"
- **Role:** VP of HR or CHRO
- **Goals:** Understand workforce cost, ensure competitive positioning, plan headcount budgets
- **Pain Points:** No single view of compensation health, difficulty tying pay to performance
- **Key Modules:** Home Dashboard (executive KPIs), Analytics

---

## User Stories

| ID | As a… | I want to… | So that… |
|----|--------|-----------|----------|
| US-01 | Compensation Manager | Search for any job title and see P25/P50/P75/P90 market pay | I can quickly build salary bands |
| US-02 | Compensation Manager | Filter market data by dept, function, education, and location | I get relevant benchmarks for my context |
| US-03 | HR Business Partner | View each employee's pay vs. market in a scatter plot | I can identify underpaid/overpaid employees at a glance |
| US-04 | HR Business Partner | Calculate relocation-adjusted salaries between any two cities | I can make fair offers for relocating employees |
| US-05 | Compensation Manager | Run a predictive salary model with 7 input variables | I can price unique or new roles without survey data |
| US-06 | HR Business Partner | View a total compensation statement for any named employee | I can discuss pay holistically with business leaders |
| US-07 | Executive | See department salary distribution vs. budget threshold | I can spot budget risk at a glance |
| US-08 | Compensation Manager | See compa-ratio and market index for every employee | I can prioritize pay adjustments in the next cycle |
| US-09 | All users | Navigate to any module via a consistent top navigation | I can switch contexts without losing my place |
| US-10 | Compensation Manager | Click a "Hot Job" trending card to jump to market data | I can quickly explore in-demand roles |

---

## Information Architecture

```
CompAnalyst
├── Home (Executive Dashboard)
│   ├── Market Price a Job (search widget)
│   ├── Hot Jobs (carousel)
│   ├── Total Compensation Statement (employee lookup)
│   ├── Employees Scatter Plot (100 employees)
│   ├── Cost to Budget (histogram + threshold)
│   └── Relocation Wizard (geo + COL charts)
├── Market Data
│   ├── Filter Panel (dept, fn, exp, edu)
│   ├── Job Results Grid (paginated, sortable)
│   └── Job Detail Panel (Base/Bonus/TCC tabs + location selector)
├── Our Company
│   ├── Filter Panel (dept, level, perf, market position)
│   ├── Employee Grid (with comparison columns)
│   └── Employee Detail Panel (internal vs. market pay)
└── Analytics
    ├── Prediction Form (7 inputs)
    ├── Predicted Pay Cards (P25/P50/P75)
    ├── Feature Importance Chart
    ├── Confidence Score
    └── Market Alignment Indicator
```

---

## Functional Requirements

### Module 1: Home Dashboard

| ID | Requirement |
|----|-------------|
| F-01 | Job search input with autocomplete suggestions from 500+ job titles |
| F-02 | Navigation to Market Data with pre-populated search filter |
| F-03 | Hot Jobs carousel with 5 trending roles, auto-advances every 4 seconds |
| F-04 | Clicking any Hot Job navigates to Market Data with filter applied |
| F-05 | Employee dropdown for Total Comp Statement (5 featured employees) |
| F-06 | Comp statement shows: Job Title, Dept, Level, Tenure, Performance, Base, Bonus, TDC, MRP, Market Index |
| F-07 | Scatter plot with 100 employees colored by market position (at market / overpaid / underpaid) |
| F-08 | Tooltip on scatter hover shows name, job, salary, market pay |
| F-09 | Cost to Budget histogram updates dynamically on dept/threshold change |
| F-10 | Relocation Wizard calculates adjusted salary based on COL ratio |
| F-11 | Relocation dual charts: Geo Differential bar chart + COL Index comparison |

### Module 2: Market Data

| ID | Requirement |
|----|-------------|
| F-12 | Filter panel with: Department, Job Function, Experience Level, Education |
| F-13 | Text search by job title or family with Enter/button trigger |
| F-14 | Results count updates after filtering |
| F-15 | Paginated data grid (20 rows/page) with column sort |
| F-16 | Row click or "Details" button shows job detail panel |
| F-17 | Detail panel shows Base Salary / Bonus / TCC tabs |
| F-18 | Each tab shows P25 / P50 / P75 / P90 |
| F-19 | Location selector dynamically adjusts all comp values by COL |
| F-20 | Clear filters button resets all filter state |

### Module 3: Our Company

| ID | Requirement |
|----|-------------|
| F-21 | Filter panel: Department, Level Code, Performance Rating, Market Position |
| F-22 | Employee grid with columns: Name, Job Title, Dept, Manager, Salary, Bonus, Perf, Tenure, Market Index, Compa Ratio, Position |
| F-23 | Market Index column shows colored dot + bar indicator |
| F-24 | Color coding: green (at market), orange (overpaid), red (underpaid) |
| F-25 | Summary stats panel: total employees, avg market index, at market count, underpaid count |
| F-26 | Employee detail panel with side-by-side internal vs. market pay |
| F-27 | Column sorting on all sortable columns |
| F-28 | Search by employee name or job title |

### Module 4: Analytics

| ID | Requirement |
|----|-------------|
| F-29 | 7-field prediction form: Job Title, Department, Function, Experience (slider), Education, Management, Location |
| F-30 | "Run Prediction" button shows loading state, then shows results after 800ms |
| F-31 | Results show P25/P50/P75 for Base Salary, Bonus, and TCC |
| F-32 | Feature importance horizontal bar chart animates in on result |
| F-33 | Confidence score (%) with progress bar |
| F-34 | Market alignment indicator (above/aligned/below market) |
| F-35 | Stacked bar chart shows salary + bonus at P25/P50/P75 |
| F-36 | Auto-prediction on page load with default values |

---

## Data Model

### Job Table (500 records)

```
Job {
  id:           String (JOB-1000+)
  title:        String
  family:       String          // e.g. "Software Engineering"
  department:   String          // Engineering, Product, Sales, HR, Finance, Marketing, Legal, Operations
  function:     String          // Engineering, Product, Design, Sales, etc.
  level:        String          // Associate, Mid-Level, Senior, Lead, Principal, Director, VP, etc.
  levelCode:    String          // L1-L10
  education:    String          // Bachelor's, Master's, MBA, PhD
  experienceMin: Number
  experienceMax: Number
  management:   Boolean
  description:  String
  salary {
    p25: Number, p50: Number, p75: Number, p90: Number
  }
  bonus {
    p25: Number, p50: Number, p75: Number
  }
  tcc {
    p25: Number, p50: Number, p75: Number, p90: Number
  }
  marketLevel:  String          // Grade 1-10
}
```

### Employee Table (100 records)

```
Employee {
  id:           String (EMP-1000+)
  name:         String
  initials:     String
  avatarColor:  String (hex)
  jobTitle:     String
  jobId:        String          // FK to Job
  department:   String
  function:     String
  level:        String
  levelCode:    String
  manager:      String
  salary:       Number
  bonus:        Number
  tdc:          Number          // salary + bonus
  performance:  String          // 1-5 rating string
  tenure:       Number          // years
  location:     String          // "City, State"
  mrp:          Number          // market reference point (job.salary.p50)
  marketIndex:  Number          // (salary / mrp) * 100
  compaRatio:   Number          // salary / mrp
  positionToMkt: "At Market" | "Overpaid" | "Underpaid"
  featured:     Boolean
}
```

### Location Table (185 US cities)

```
Location {
  city:   String
  state:  String (2-letter)
  col:    Number              // cost of living index (1.0 = national median)
  region: String              // West Coast, Northeast, Southeast, Midwest, etc.
}
```

### Compensation Adjustment Logic

```
adjustedSalary = baseSalary * (targetCOL / nationalAverageCOL)
nationalAverageCOL = 1.10

marketIndex = (employeeSalary / marketP50) * 100
compaRatio  = employeeSalary / marketP50

positionToMkt:
  marketIndex >= 115 → "Overpaid"
  marketIndex <= 85  → "Underpaid"
  else               → "At Market"
```

---

## Analytics Logic — Compensation Prediction Model

**Model Type:** Simulated Multiple Linear Regression

**Input Features:**

| Feature | Weight Range |
|---------|-------------|
| Years of Experience | 20–35% |
| Geographic Location (COL) | 14–25% |
| Education Level | 8–22% |
| Job Department | 10–15% |
| Job Function | ~12% |
| Management Scope | 7–18% |

**Prediction Formula:**
```
baseSalary = BASE_SALARY
           × departmentMultiplier
           × experienceMultiplier      // 0.58 + (exp/22) × 0.85
           × educationMultiplier       // HS=0.72 ... PhD=1.28
           × managementMultiplier      // 1.15 if manager, 1.0 if IC
           × locationCOLMultiplier     // targetCOL / nationalAvgCOL

P25 = baseSalary × 0.83
P50 = baseSalary
P75 = baseSalary × 1.20

bonusPct = 0.05 + (min(exp, 20) / 20) × 0.26
confidenceScore = 60 + exp × 1.4 + (edu≠HS ? 8 : 0) + (mgmt ? 5 : 0)
```

---

## Future Roadmap

### Phase 2 — Q2 2026
- [ ] Pay equity analysis module (gender, ethnicity, age)
- [ ] Salary range band builder with market anchoring
- [ ] Approval workflow for out-of-band offers
- [ ] Real-time Radford / Mercer survey data integration

### Phase 3 — Q3 2026
- [ ] Headcount planning and workforce cost modeling
- [ ] Integration with HRIS (Workday, SuccessFactors)
- [ ] Job architecture / leveling framework tool
- [ ] Compensation statement PDF export

### Phase 4 — Q4 2026
- [ ] Equity (RSU/option) modeling
- [ ] Total rewards optimization recommendations
- [ ] Multi-country / global pay analysis
- [ ] Manager self-service compensation review portal
