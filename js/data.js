/* ================================================================
   CompAnalyst — Data Layer
   Generates all mock data: 500 jobs, 100 employees, 300 cities
   ================================================================ */

(function () {
  'use strict';

  /* ── Seeded PRNG for reproducibility ─────────────────────────── */
  let _seed = 12345;
  function rand() {
    _seed = (_seed * 1664525 + 1013904223) & 0xffffffff;
    return ((_seed >>> 0) / 0xffffffff);
  }
  function rBetween(lo, hi) { return lo + rand() * (hi - lo); }
  function rInt(lo, hi)    { return Math.floor(lo + rand() * (hi - lo + 1)); }
  function pick(arr)       { return arr[Math.floor(rand() * arr.length)]; }
  function pickW(arr, ws)  {
    const r = rand(); let c = 0;
    for (let i = 0; i < ws.length; i++) { c += ws[i]; if (r < c) return arr[i]; }
    return arr[arr.length - 1];
  }

  /* ================================================================
     LOCATIONS — 185 US cities (well-structured for demo)
     ================================================================ */
  const RAW_LOCATIONS = [
    // California
    {city:'San Francisco',state:'CA',col:2.05,region:'West Coast'},
    {city:'San Jose',state:'CA',col:1.90,region:'West Coast'},
    {city:'Oakland',state:'CA',col:1.76,region:'West Coast'},
    {city:'Los Angeles',state:'CA',col:1.65,region:'West Coast'},
    {city:'San Diego',state:'CA',col:1.55,region:'West Coast'},
    {city:'Palo Alto',state:'CA',col:1.92,region:'West Coast'},
    {city:'Sunnyvale',state:'CA',col:1.85,region:'West Coast'},
    {city:'Santa Clara',state:'CA',col:1.82,region:'West Coast'},
    {city:'Mountain View',state:'CA',col:1.88,region:'West Coast'},
    {city:'Redwood City',state:'CA',col:1.78,region:'West Coast'},
    {city:'Fremont',state:'CA',col:1.70,region:'West Coast'},
    {city:'Santa Monica',state:'CA',col:1.60,region:'West Coast'},
    {city:'Irvine',state:'CA',col:1.50,region:'West Coast'},
    {city:'Anaheim',state:'CA',col:1.40,region:'West Coast'},
    {city:'Sacramento',state:'CA',col:1.20,region:'West Coast'},
    {city:'Riverside',state:'CA',col:1.22,region:'West Coast'},
    {city:'Fresno',state:'CA',col:0.98,region:'West Coast'},
    {city:'Bakersfield',state:'CA',col:0.95,region:'West Coast'},
    {city:'Santa Barbara',state:'CA',col:1.62,region:'West Coast'},
    {city:'Ventura',state:'CA',col:1.35,region:'West Coast'},
    // Washington
    {city:'Seattle',state:'WA',col:1.65,region:'Pacific Northwest'},
    {city:'Bellevue',state:'WA',col:1.72,region:'Pacific Northwest'},
    {city:'Redmond',state:'WA',col:1.65,region:'Pacific Northwest'},
    {city:'Kirkland',state:'WA',col:1.60,region:'Pacific Northwest'},
    {city:'Tacoma',state:'WA',col:1.20,region:'Pacific Northwest'},
    {city:'Spokane',state:'WA',col:0.95,region:'Pacific Northwest'},
    {city:'Vancouver',state:'WA',col:1.22,region:'Pacific Northwest'},
    // Oregon
    {city:'Portland',state:'OR',col:1.30,region:'Pacific Northwest'},
    {city:'Hillsboro',state:'OR',col:1.25,region:'Pacific Northwest'},
    {city:'Bend',state:'OR',col:1.22,region:'Pacific Northwest'},
    {city:'Eugene',state:'OR',col:1.05,region:'Pacific Northwest'},
    // New York
    {city:'New York City',state:'NY',col:1.95,region:'Northeast'},
    {city:'Yonkers',state:'NY',col:1.60,region:'Northeast'},
    {city:'White Plains',state:'NY',col:1.65,region:'Northeast'},
    {city:'Buffalo',state:'NY',col:0.90,region:'Northeast'},
    {city:'Rochester',state:'NY',col:0.92,region:'Northeast'},
    {city:'Albany',state:'NY',col:1.05,region:'Northeast'},
    {city:'Syracuse',state:'NY',col:0.88,region:'Northeast'},
    // Massachusetts
    {city:'Boston',state:'MA',col:1.75,region:'Northeast'},
    {city:'Cambridge',state:'MA',col:1.80,region:'Northeast'},
    {city:'Worcester',state:'MA',col:1.10,region:'Northeast'},
    {city:'Lowell',state:'MA',col:1.08,region:'Northeast'},
    // New Jersey
    {city:'Jersey City',state:'NJ',col:1.55,region:'Northeast'},
    {city:'Princeton',state:'NJ',col:1.60,region:'Northeast'},
    {city:'Newark',state:'NJ',col:1.35,region:'Northeast'},
    {city:'Hoboken',state:'NJ',col:1.65,region:'Northeast'},
    // Connecticut
    {city:'Stamford',state:'CT',col:1.70,region:'Northeast'},
    {city:'Hartford',state:'CT',col:1.20,region:'Northeast'},
    {city:'New Haven',state:'CT',col:1.25,region:'Northeast'},
    // Pennsylvania
    {city:'Philadelphia',state:'PA',col:1.22,region:'Northeast'},
    {city:'Pittsburgh',state:'PA',col:0.98,region:'Northeast'},
    {city:'Allentown',state:'PA',col:1.05,region:'Northeast'},
    // DC Metro
    {city:'Washington',state:'DC',col:1.70,region:'Mid-Atlantic'},
    {city:'Arlington',state:'VA',col:1.55,region:'Mid-Atlantic'},
    {city:'McLean',state:'VA',col:1.62,region:'Mid-Atlantic'},
    {city:'Bethesda',state:'MD',col:1.65,region:'Mid-Atlantic'},
    {city:'Rockville',state:'MD',col:1.55,region:'Mid-Atlantic'},
    {city:'Baltimore',state:'MD',col:1.18,region:'Mid-Atlantic'},
    // Virginia
    {city:'Richmond',state:'VA',col:1.05,region:'Mid-Atlantic'},
    {city:'Virginia Beach',state:'VA',col:1.05,region:'Mid-Atlantic'},
    {city:'Norfolk',state:'VA',col:1.00,region:'Mid-Atlantic'},
    // Texas
    {city:'Austin',state:'TX',col:1.20,region:'South Central'},
    {city:'Dallas',state:'TX',col:1.08,region:'South Central'},
    {city:'Houston',state:'TX',col:1.05,region:'South Central'},
    {city:'San Antonio',state:'TX',col:0.95,region:'South Central'},
    {city:'Plano',state:'TX',col:1.10,region:'South Central'},
    {city:'Fort Worth',state:'TX',col:1.00,region:'South Central'},
    {city:'Irving',state:'TX',col:1.05,region:'South Central'},
    {city:'El Paso',state:'TX',col:0.82,region:'South Central'},
    {city:'Corpus Christi',state:'TX',col:0.88,region:'South Central'},
    // Florida
    {city:'Miami',state:'FL',col:1.30,region:'Southeast'},
    {city:'Fort Lauderdale',state:'FL',col:1.20,region:'Southeast'},
    {city:'Tampa',state:'FL',col:1.08,region:'Southeast'},
    {city:'Orlando',state:'FL',col:1.05,region:'Southeast'},
    {city:'Jacksonville',state:'FL',col:0.95,region:'Southeast'},
    {city:'Tallahassee',state:'FL',col:0.90,region:'Southeast'},
    // Georgia
    {city:'Atlanta',state:'GA',col:1.12,region:'Southeast'},
    {city:'Savannah',state:'GA',col:0.95,region:'Southeast'},
    {city:'Augusta',state:'GA',col:0.88,region:'Southeast'},
    // North Carolina
    {city:'Charlotte',state:'NC',col:1.05,region:'Southeast'},
    {city:'Raleigh',state:'NC',col:1.10,region:'Southeast'},
    {city:'Durham',state:'NC',col:1.05,region:'Southeast'},
    {city:'Cary',state:'NC',col:1.15,region:'Southeast'},
    {city:'Greensboro',state:'NC',col:0.92,region:'Southeast'},
    // South Carolina
    {city:'Charleston',state:'SC',col:1.05,region:'Southeast'},
    {city:'Columbia',state:'SC',col:0.90,region:'Southeast'},
    // Tennessee
    {city:'Nashville',state:'TN',col:1.05,region:'Southeast'},
    {city:'Memphis',state:'TN',col:0.85,region:'Southeast'},
    {city:'Knoxville',state:'TN',col:0.88,region:'Southeast'},
    {city:'Chattanooga',state:'TN',col:0.90,region:'Southeast'},
    // Illinois
    {city:'Chicago',state:'IL',col:1.25,region:'Midwest'},
    {city:'Naperville',state:'IL',col:1.10,region:'Midwest'},
    {city:'Rockford',state:'IL',col:0.87,region:'Midwest'},
    // Ohio
    {city:'Columbus',state:'OH',col:0.97,region:'Midwest'},
    {city:'Cleveland',state:'OH',col:0.90,region:'Midwest'},
    {city:'Cincinnati',state:'OH',col:0.93,region:'Midwest'},
    {city:'Akron',state:'OH',col:0.85,region:'Midwest'},
    // Michigan
    {city:'Detroit',state:'MI',col:0.92,region:'Midwest'},
    {city:'Ann Arbor',state:'MI',col:1.08,region:'Midwest'},
    {city:'Grand Rapids',state:'MI',col:0.95,region:'Midwest'},
    // Minnesota
    {city:'Minneapolis',state:'MN',col:1.18,region:'Midwest'},
    {city:'St. Paul',state:'MN',col:1.12,region:'Midwest'},
    // Indiana
    {city:'Indianapolis',state:'IN',col:0.92,region:'Midwest'},
    // Wisconsin
    {city:'Milwaukee',state:'WI',col:0.95,region:'Midwest'},
    {city:'Madison',state:'WI',col:1.05,region:'Midwest'},
    // Missouri
    {city:'Kansas City',state:'MO',col:0.95,region:'Midwest'},
    {city:'St. Louis',state:'MO',col:0.93,region:'Midwest'},
    // Colorado
    {city:'Denver',state:'CO',col:1.30,region:'Mountain West'},
    {city:'Boulder',state:'CO',col:1.45,region:'Mountain West'},
    {city:'Colorado Springs',state:'CO',col:1.10,region:'Mountain West'},
    {city:'Fort Collins',state:'CO',col:1.18,region:'Mountain West'},
    {city:'Aurora',state:'CO',col:1.20,region:'Mountain West'},
    // Arizona
    {city:'Phoenix',state:'AZ',col:1.10,region:'Southwest'},
    {city:'Scottsdale',state:'AZ',col:1.18,region:'Southwest'},
    {city:'Tempe',state:'AZ',col:1.08,region:'Southwest'},
    {city:'Chandler',state:'AZ',col:1.12,region:'Southwest'},
    {city:'Tucson',state:'AZ',col:0.92,region:'Southwest'},
    // Nevada
    {city:'Las Vegas',state:'NV',col:1.05,region:'Southwest'},
    {city:'Henderson',state:'NV',col:1.08,region:'Southwest'},
    {city:'Reno',state:'NV',col:1.10,region:'Southwest'},
    // Utah
    {city:'Salt Lake City',state:'UT',col:1.12,region:'Mountain West'},
    {city:'Provo',state:'UT',col:1.05,region:'Mountain West'},
    // New Mexico
    {city:'Albuquerque',state:'NM',col:0.92,region:'Southwest'},
    {city:'Santa Fe',state:'NM',col:1.10,region:'Southwest'},
    // Idaho
    {city:'Boise',state:'ID',col:1.08,region:'Mountain West'},
    // Hawaii
    {city:'Honolulu',state:'HI',col:1.90,region:'Pacific'},
    // Alaska
    {city:'Anchorage',state:'AK',col:1.35,region:'Pacific'},
    // Alabama
    {city:'Birmingham',state:'AL',col:0.87,region:'Southeast'},
    {city:'Huntsville',state:'AL',col:0.95,region:'Southeast'},
    // Louisiana
    {city:'New Orleans',state:'LA',col:0.95,region:'South Central'},
    {city:'Baton Rouge',state:'LA',col:0.90,region:'South Central'},
    // Oklahoma
    {city:'Oklahoma City',state:'OK',col:0.87,region:'South Central'},
    {city:'Tulsa',state:'OK',col:0.88,region:'South Central'},
    // Kansas
    {city:'Wichita',state:'KS',col:0.87,region:'Midwest'},
    // Iowa
    {city:'Des Moines',state:'IA',col:0.90,region:'Midwest'},
    // Nebraska
    {city:'Omaha',state:'NE',col:0.90,region:'Midwest'},
    // Kentucky
    {city:'Louisville',state:'KY',col:0.90,region:'Southeast'},
    {city:'Lexington',state:'KY',col:0.92,region:'Southeast'},
    // Arkansas
    {city:'Little Rock',state:'AR',col:0.83,region:'South Central'},
    // Mississippi
    {city:'Jackson',state:'MS',col:0.80,region:'Southeast'},
    // Rhode Island
    {city:'Providence',state:'RI',col:1.20,region:'Northeast'},
    // New Hampshire
    {city:'Manchester',state:'NH',col:1.25,region:'Northeast'},
    {city:'Nashua',state:'NH',col:1.30,region:'Northeast'},
    // Maine
    {city:'Portland',state:'ME',col:1.10,region:'Northeast'},
    // Vermont
    {city:'Burlington',state:'VT',col:1.15,region:'Northeast'},
    // Delaware
    {city:'Wilmington',state:'DE',col:1.20,region:'Mid-Atlantic'},
    // Montana
    {city:'Billings',state:'MT',col:0.95,region:'Mountain West'},
    // North Dakota
    {city:'Fargo',state:'ND',col:0.90,region:'Midwest'},
    // South Dakota
    {city:'Sioux Falls',state:'SD',col:0.88,region:'Midwest'},
    // Wyoming
    {city:'Cheyenne',state:'WY',col:0.92,region:'Mountain West'},
    // West Virginia
    {city:'Charleston',state:'WV',col:0.82,region:'Mid-Atlantic'},
  ];

  /* ================================================================
     JOBS — 500 records from 25 families × 20 level/variant combos
     ================================================================ */
  const FAMILIES = [
    { name:'Software Engineering', dept:'Engineering', fn:'Engineering', mult:1.30 },
    { name:'Data Science & ML', dept:'Engineering', fn:'Engineering', mult:1.32 },
    { name:'Machine Learning Engineering', dept:'Engineering', fn:'Engineering', mult:1.38 },
    { name:'DevOps & Platform Engineering', dept:'Engineering', fn:'Engineering', mult:1.22 },
    { name:'Cybersecurity', dept:'Engineering', fn:'Engineering', mult:1.26 },
    { name:'Frontend Engineering', dept:'Engineering', fn:'Engineering', mult:1.25 },
    { name:'Backend Engineering', dept:'Engineering', fn:'Engineering', mult:1.28 },
    { name:'Mobile Engineering', dept:'Engineering', fn:'Engineering', mult:1.24 },
    { name:'QA & Test Engineering', dept:'Engineering', fn:'Engineering', mult:1.08 },
    { name:'Site Reliability Engineering', dept:'Engineering', fn:'Engineering', mult:1.28 },
    { name:'Product Management', dept:'Product', fn:'Product', mult:1.30 },
    { name:'UX & Product Design', dept:'Product', fn:'Design', mult:1.05 },
    { name:'Technical Program Management', dept:'Product', fn:'Program Management', mult:1.18 },
    { name:'Enterprise Sales', dept:'Sales', fn:'Sales', mult:0.90 },
    { name:'Business Development', dept:'Sales', fn:'Business Development', mult:1.05 },
    { name:'Account Management', dept:'Sales', fn:'Account Management', mult:0.95 },
    { name:'HR Business Partnership', dept:'HR', fn:'Human Resources', mult:0.92 },
    { name:'Talent Acquisition', dept:'HR', fn:'Recruiting', mult:0.90 },
    { name:'Compensation & Benefits', dept:'HR', fn:'Total Rewards', mult:0.97 },
    { name:'Finance & Accounting', dept:'Finance', fn:'Finance', mult:1.10 },
    { name:'Financial Planning & Analysis', dept:'Finance', fn:'Finance', mult:1.20 },
    { name:'Marketing & Growth', dept:'Marketing', fn:'Marketing', mult:0.95 },
    { name:'Legal & Compliance', dept:'Legal', fn:'Legal', mult:1.28 },
    { name:'Operations & Strategy', dept:'Operations', fn:'Operations', mult:0.90 },
    { name:'Customer Success', dept:'Operations', fn:'Customer Success', mult:0.85 },
  ];

  const LEVELS = [
    { name:'Associate',      code:'L1', expMin:0,  expMax:2,  eduReq:"Bachelor's", mult:0.62,  mgmt:false },
    { name:'Analyst',        code:'L1', expMin:0,  expMax:3,  eduReq:"Bachelor's", mult:0.68,  mgmt:false },
    { name:'Mid-Level',      code:'L2', expMin:2,  expMax:5,  eduReq:"Bachelor's", mult:0.85,  mgmt:false },
    { name:'Senior',         code:'L3', expMin:5,  expMax:8,  eduReq:"Master's",   mult:1.10,  mgmt:false },
    { name:'Senior II',      code:'L3', expMin:6,  expMax:9,  eduReq:"Master's",   mult:1.18,  mgmt:false },
    { name:'Lead',           code:'L4', expMin:7,  expMax:12, eduReq:"Master's",   mult:1.38,  mgmt:true  },
    { name:'Staff',          code:'L4', expMin:8,  expMax:13, eduReq:"Master's",   mult:1.42,  mgmt:false },
    { name:'Principal',      code:'L5', expMin:10, expMax:16, eduReq:"Master's",   mult:1.70,  mgmt:false },
    { name:'Principal Staff',code:'L5', expMin:12, expMax:18, eduReq:"Master's",   mult:1.80,  mgmt:false },
    { name:'Senior Staff',   code:'L5', expMin:11, expMax:17, eduReq:"Master's",   mult:1.65,  mgmt:false },
    { name:'Manager',        code:'L4', expMin:5,  expMax:12, eduReq:"MBA",        mult:1.35,  mgmt:true  },
    { name:'Senior Manager', code:'L5', expMin:8,  expMax:15, eduReq:"MBA",        mult:1.60,  mgmt:true  },
    { name:'Director',       code:'L6', expMin:12, expMax:20, eduReq:"MBA",        mult:2.15,  mgmt:true  },
    { name:'Senior Director',code:'L7', expMin:15, expMax:25, eduReq:"MBA",        mult:2.60,  mgmt:true  },
    { name:'Group Director', code:'L7', expMin:14, expMax:24, eduReq:"MBA",        mult:2.45,  mgmt:true  },
    { name:'VP',             code:'L8', expMin:18, expMax:30, eduReq:"MBA",        mult:3.20,  mgmt:true  },
    { name:'Senior VP',      code:'L9', expMin:20, expMax:35, eduReq:"MBA",        mult:3.90,  mgmt:true  },
    { name:'Executive VP',   code:'L9', expMin:22, expMax:35, eduReq:"MBA",        mult:4.30,  mgmt:true  },
    { name:'C-Level',        code:'L10',expMin:20, expMax:40, eduReq:"MBA",        mult:6.00,  mgmt:true  },
    { name:'Fellow',         code:'L6', expMin:15, expMax:30, eduReq:"PhD",        mult:2.50,  mgmt:false },
  ];

  const BONUS_PCT = {
    L1: {p25:.04, p50:.06, p75:.09},
    L2: {p25:.06, p50:.08, p75:.11},
    L3: {p25:.08, p50:.10, p75:.14},
    L4: {p25:.10, p50:.14, p75:.19},
    L5: {p25:.13, p50:.18, p75:.25},
    L6: {p25:.18, p50:.26, p75:.35},
    L7: {p25:.24, p50:.33, p75:.45},
    L8: {p25:.30, p50:.42, p75:.58},
    L9: {p25:.38, p50:.52, p75:.72},
    L10:{p25:.50, p50:.75, p75:1.10},
  };

  const BASE = 82000; // national median associate salary

  const DESCRIPTIONS = {
    'Software Engineering': 'Design, develop, test, and maintain scalable software systems and applications. Collaborate with cross-functional teams to deliver high-quality products on time.',
    'Data Science & ML': 'Derive actionable insights from complex datasets using statistical modeling, machine learning algorithms, and data visualization techniques.',
    'Machine Learning Engineering': 'Build, deploy, and maintain production-grade machine learning systems at scale. Research novel algorithms and optimize model performance.',
    'DevOps & Platform Engineering': 'Build and maintain CI/CD pipelines, cloud infrastructure, and developer tooling to maximize engineering velocity and reliability.',
    'Cybersecurity': 'Protect organizational assets through security architecture design, threat detection, incident response, and enterprise risk management.',
    'Frontend Engineering': 'Craft exceptional user-facing web experiences using modern JavaScript frameworks, focusing on performance, accessibility, and scalability.',
    'Backend Engineering': 'Architect and implement robust server-side systems, APIs, microservices, and distributed data pipelines.',
    'Mobile Engineering': 'Develop native and cross-platform mobile applications for iOS and Android with a focus on performance and UX.',
    'QA & Test Engineering': 'Design and execute comprehensive testing strategies including automated, integration, and performance testing to ensure product quality.',
    'Site Reliability Engineering': 'Ensure the reliability, scalability, and performance of mission-critical systems through observability, incident management, and automation.',
    'Product Management': 'Define product vision and strategy, prioritize features based on user research and business impact, and lead cross-functional teams to ship.',
    'UX & Product Design': 'Create intuitive, delightful user experiences through research, wireframing, prototyping, and managing a scalable design system.',
    'Technical Program Management': 'Drive large-scale technical programs across engineering and product, ensuring delivery on scope, schedule, and quality.',
    'Enterprise Sales': 'Drive new enterprise revenue by prospecting, building executive relationships, running complex sales cycles, and closing strategic deals.',
    'Business Development': 'Identify and execute strategic partnerships, integrations, and market expansion opportunities.',
    'Account Management': 'Manage and grow a portfolio of enterprise accounts to maximize retention, upsell, and customer lifetime value.',
    'HR Business Partnership': 'Serve as a strategic advisor to senior business leaders on organizational design, talent strategy, and employee relations.',
    'Talent Acquisition': 'Source, attract, and close top-tier talent through innovative recruiting programs and an exceptional candidate experience.',
    'Compensation & Benefits': 'Design and administer competitive compensation structures, equity programs, and total rewards strategies.',
    'Finance & Accounting': 'Manage financial reporting, close cycles, regulatory compliance, and accounting operations across the organization.',
    'Financial Planning & Analysis': 'Lead financial planning, long-range forecasting, and analytical modeling to guide executive decision-making.',
    'Marketing & Growth': 'Develop and execute integrated marketing strategies to drive brand awareness, pipeline generation, and customer acquisition.',
    'Legal & Compliance': 'Provide strategic legal counsel and ensure organizational compliance with applicable laws, regulations, and corporate policies.',
    'Operations & Strategy': 'Drive operational excellence, business process optimization, and strategic initiatives to support company scaling.',
    'Customer Success': 'Drive product adoption, retention, and expansion by ensuring customers achieve their desired outcomes.',
  };

  function mkSalary(family, level) {
    const base = Math.round((BASE * family.mult * level.mult) / 1000) * 1000;
    return {
      p25: Math.round(base * 0.820 / 1000) * 1000,
      p50: base,
      p75: Math.round(base * 1.220 / 1000) * 1000,
      p90: Math.round(base * 1.430 / 1000) * 1000,
    };
  }

  function mkBonus(salary, levelCode) {
    const pct = BONUS_PCT[levelCode] || BONUS_PCT.L2;
    return {
      p25: Math.round(salary.p50 * pct.p25 / 500) * 500,
      p50: Math.round(salary.p50 * pct.p50 / 500) * 500,
      p75: Math.round(salary.p50 * pct.p75 / 500) * 500,
    };
  }

  const JOBS = [];
  let jobSeq = 1000;
  const EDU_LEVELS = ["High School", "Associate's", "Bachelor's", "Master's", "MBA", "PhD"];

  for (const fam of FAMILIES) {
    for (const lvl of LEVELS) {
      const sal  = mkSalary(fam, lvl);
      const bon  = mkBonus(sal, lvl.code);
      JOBS.push({
        id:           `JOB-${jobSeq++}`,
        title:        `${lvl.name} ${fam.name}`,
        family:       fam.name,
        department:   fam.dept,
        function:     fam.fn,
        level:        lvl.name,
        levelCode:    lvl.code,
        education:    lvl.eduReq,
        experienceMin: lvl.expMin,
        experienceMax: lvl.expMax,
        management:   lvl.mgmt,
        description:  DESCRIPTIONS[fam.name] || '',
        salary:       sal,
        bonus:        bon,
        tcc:          { p25:sal.p25+bon.p25, p50:sal.p50+bon.p50, p75:sal.p75+bon.p75, p90:sal.p90+bon.p75 },
        marketLevel:  `Grade ${lvl.code.replace('L','')}`,
      });
    }
  }

  /* ================================================================
     EMPLOYEES — 100 records
     ================================================================ */
  const FIRST = ['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda',
    'William','Barbara','David','Susan','Richard','Jessica','Joseph','Sarah','Thomas','Karen',
    'Charles','Lisa','Christopher','Nancy','Daniel','Betty','Matthew','Margaret','Anthony',
    'Sandra','Mark','Ashley','Donald','Dorothy','Steven','Kimberly','Paul','Emily','Andrew',
    'Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Melissa','George',
    'Deborah','Timothy','Stephanie','Eric','Sharon','Justin','Christine','Scott','Rebecca',
    'Brandon','Cynthia','Samuel','Laura','Raymond','Kathleen','Gregory','Amy','Frank','Angela',
    'Alexander','Brenda','Patrick','Catherine','Jack','Emma','Sophia','Liam','Noah','Olivia',
    'Isabella','Lucas','Mason','Mia','Ethan','Aiden','Harper','Avery','Jackson','Sofia','Aria'];

  const LAST = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis',
    'Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas',
    'Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez',
    'Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott',
    'Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera',
    'Campbell','Mitchell','Carter','Roberts','Chen','Kim','Patel','Gupta','Singh','Kumar',
    'Zhang','Wang','Liu','Yang','Chang','Nakamura','Tanaka','Suzuki','Watanabe','Ito',
    'Fernandez','Morales','Jimenez','Ortiz','Reyes','Cruz','Vargas','Ramos','Romero','Guerrero'];

  const PERF_RATINGS = ['1 - Needs Improvement','2 - Developing','3 - Meets Expectations','4 - Exceeds Expectations','5 - Outstanding'];
  const PERF_WEIGHTS = [0.04, 0.09, 0.44, 0.32, 0.11];
  const MANAGERS = ['Alex Thompson','Maria Garcia','James Wilson','Lisa Chen','Robert Kim','Sarah Martinez','David Patel'];
  const AVATAR_COLORS = ['#1a56db','#0e9f6e','#d97706','#7c3aed','#db2777','#0891b2','#16a34a','#dc2626','#ea580c','#0284c7'];

  // Featured employees (always present in comp statement)
  const FEATURED = [
    { name:'John Smith',     jobIdx:20,  compaRatio:1.05 },
    { name:'Sarah Johnson',  jobIdx:60,  compaRatio:0.92 },
    { name:'David Lee',      jobIdx:35,  compaRatio:1.14 },
    { name:'Emily Brown',    jobIdx:100, compaRatio:0.87 },
    { name:'Michael Chen',   jobIdx:15,  compaRatio:1.19 },
  ];

  const EMPLOYEES = [];
  const usedNames = new Set();

  function mkEmployee(name, jobIdx, compaRatio, isFeatured, empSeq) {
    const job  = JOBS[jobIdx % JOBS.length];
    const salary = Math.round(job.salary.p50 * compaRatio / 1000) * 1000;
    const bpct   = (BONUS_PCT[job.levelCode] || BONUS_PCT.L2).p50;
    const bonus  = Math.round(salary * bpct / 500) * 500;
    const mrp    = job.salary.p50;
    const marketIndex = Math.round((salary / mrp) * 100);
    const loc    = pick(RAW_LOCATIONS);
    const initials = name.split(' ').map(n=>n[0]).join('');
    return {
      id:           `EMP-${1000 + empSeq}`,
      name,
      initials,
      avatarColor:  AVATAR_COLORS[empSeq % AVATAR_COLORS.length],
      jobTitle:     job.title,
      jobId:        job.id,
      department:   job.department,
      function:     job.function,
      level:        job.level,
      levelCode:    job.levelCode,
      manager:      pick(MANAGERS),
      salary,
      bonus,
      tdc:          salary + bonus,
      performance:  pickW(PERF_RATINGS, PERF_WEIGHTS),
      tenure:       rInt(0, 14),
      location:     `${loc.city}, ${loc.state}`,
      mrp,
      marketIndex,
      compaRatio:   Math.round(compaRatio * 100) / 100,
      positionToMkt: marketIndex >= 115 ? 'Overpaid' : marketIndex <= 85 ? 'Underpaid' : 'At Market',
      featured: isFeatured,
    };
  }

  FEATURED.forEach((f, i) => {
    usedNames.add(f.name);
    EMPLOYEES.push(mkEmployee(f.name, f.jobIdx, f.compaRatio, true, i));
  });

  let seq = FEATURED.length;
  while (EMPLOYEES.length < 100) {
    let name;
    let tries = 0;
    do { name = `${pick(FIRST)} ${pick(LAST)}`; tries++; } while (usedNames.has(name) && tries < 100);
    usedNames.add(name);
    const ratio = 0.76 + rand() * 0.52;
    EMPLOYEES.push(mkEmployee(name, rInt(0, JOBS.length - 1), ratio, false, seq++));
  }

  /* ================================================================
     HELPERS
     ================================================================ */
  const COL_NATIONAL_AVG = 1.10;

  function fmtCurrency(v) {
    if (v >= 1000000) return `$${(v/1000000).toFixed(2)}M`;
    return '$' + new Intl.NumberFormat('en-US').format(v);
  }

  function fmtK(v) {
    return `$${(v/1000).toFixed(0)}K`;
  }

  function fmtFull(v) {
    return new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 }).format(v);
  }

  function getLocationByName(name) {
    return RAW_LOCATIONS.find(l => `${l.city}, ${l.state}` === name);
  }

  function adjustForLocation(baseSalary, locationName) {
    const loc = getLocationByName(locationName);
    if (!loc) return baseSalary;
    return Math.round(baseSalary * (loc.col / COL_NATIONAL_AVG) / 1000) * 1000;
  }

  function predictSalary(inputs) {
    const { department, education, yearsExp, hasManagement, location } = inputs;
    const fam = FAMILIES.find(f => f.dept === department) || FAMILIES[0];
    const eduMult = { "High School":0.72, "Associate's":0.84, "Bachelor's":1.00,
                      "Master's":1.16, "MBA":1.22, "PhD":1.28 }[education] || 1.0;
    const expMult = 0.58 + (Math.min(yearsExp, 22) / 22) * 0.85;
    const mgmtMult = hasManagement ? 1.15 : 1.0;
    const loc = getLocationByName(location);
    const colMult = loc ? (loc.col / COL_NATIONAL_AVG) : 1.0;
    const base = BASE * fam.mult * expMult * eduMult * mgmtMult * colMult;
    const p50  = Math.round(base / 1000) * 1000;
    const p25  = Math.round(p50 * 0.83 / 1000) * 1000;
    const p75  = Math.round(p50 * 1.20 / 1000) * 1000;
    const bpct = 0.05 + (Math.min(yearsExp, 20) / 20) * 0.26;
    const bp25 = Math.round(p25 * bpct * 0.78 / 500) * 500;
    const bp50 = Math.round(p50 * bpct       / 500) * 500;
    const bp75 = Math.round(p75 * bpct * 1.22 / 500) * 500;
    const confidence = Math.min(95, 60 + yearsExp * 1.4 + (education !== 'High School' ? 8 : 0) + (hasManagement ? 5 : 0));
    const fi = [
      { feature:'Years of Experience', pct: Math.min(35, 20 + Math.round(yearsExp / 1.2)) },
      { feature:'Geographic Location',  pct: Math.round(Math.abs(colMult - 1) * 100 + 14) },
      { feature:'Education Level',      pct: Math.round((eduMult - 0.72) * 36 + 8) },
      { feature:'Job Department',       pct: Math.round(fam.mult * 10) },
      { feature:'Job Function',         pct: 12 },
      { feature:'Management Scope',     pct: hasManagement ? 18 : 7 },
    ].sort((a,b) => b.pct - a.pct);
    // normalize
    const total = fi.reduce((s,x) => s+x.pct, 0);
    fi.forEach(f => { f.pct = Math.round(f.pct / total * 100); });
    return {
      salary: {p25, p50, p75},
      bonus:  {p25:bp25, p50:bp50, p75:bp75},
      tcc:    {p25:p25+bp25, p50:p50+bp50, p75:p75+bp75},
      confidence,
      featureImportance: fi,
      marketAlignment: colMult > 1.3 ? 'above' : colMult < 0.9 ? 'below' : 'aligned',
    };
  }

  /* Dept salary distribution for Cost to Budget histogram */
  function getDeptSalaries(dept) {
    return EMPLOYEES.filter(e => e.department === dept).map(e => e.salary);
  }

  /* All unique department names */
  function getDepartments() {
    return [...new Set(EMPLOYEES.map(e => e.department))].sort();
  }

  /* Expose globally */
  window.CompData = {
    jobs: JOBS,
    employees: EMPLOYEES,
    locations: RAW_LOCATIONS,
    families: FAMILIES,
    departments: ['Engineering','Product','Sales','HR','Finance','Marketing','Legal','Operations'],
    functions:  ['Engineering','Product','Design','Sales','Business Development','Account Management',
                 'Human Resources','Recruiting','Total Rewards','Finance','Marketing',
                 'Legal','Operations','Customer Success','Program Management'],
    education:  ["High School","Associate's","Bachelor's","Master's","MBA","PhD"],
    fmtCurrency,
    fmtK,
    fmtFull,
    adjustForLocation,
    getLocationByName,
    predictSalary,
    getDeptSalaries,
    getDepartments,
    featuredEmployees: () => EMPLOYEES.filter(e => e.featured),
  };

  console.log(`✅ CompData: ${JOBS.length} jobs | ${EMPLOYEES.length} employees | ${RAW_LOCATIONS.length} locations`);
})();
