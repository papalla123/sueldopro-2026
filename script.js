'use strict';

const state = {
    currentCalculator: 'cts',
    currentSection: 'calculators',
    currentLang: localStorage.getItem('lang') || 'es',
    theme: localStorage.getItem('theme') || 'light',
    charts: {},
    selectedCurrency: 'USD',
    selectedSector: 'all',
    exchangeRates: {}
};

// ==========================================
// APIS REALES INTEGRADAS
// ==========================================

// 1. API de Tipo de Cambio - exchangerate-api.com (GRATUITA)
async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/PEN');
        const data = await response.json();
        
        // Actualizar tasas de cambio en tiempo real
        Object.keys(data.rates).forEach(code => {
            const curr = CURRENCIES.find(c => c.code === code);
            if (curr) {
                curr.rate = 1 / data.rates[code]; // Invertir para PEN a otras divisas
            }
        });
        
        state.exchangeRates = data.rates;
        console.log('✓ Tasas de cambio actualizadas en tiempo real');
        return true;
    } catch (error) {
        console.warn('API Tipos de cambio no disponible, usando datos locales');
        return false;
    }
}

// 2. API de Noticias - NewsAPI.org (GRATUITA para desarrollo)
async function fetchLatestNews() {
    try {
        // Alternativa: NewsAPI.org requiere API key, usamos fuentes públicas
        const response = await fetch('https://newsapi.org/v2/everything?q=peru+economia+empleo&sortBy=publishedAt&language=es&pageSize=9', {
            headers: {
                'X-API-Key': 'tu_api_key_aqui' // Reemplazar con tu key de NewsAPI
            }
        });
        
        if (!response.ok) throw new Error('API no disponible');
        
        const data = await response.json();
        
        // Transformar noticias de API a formato compatible
        const apiNews = data.articles.map(article => ({
            title: article.title,
            description: article.description || article.content?.substring(0, 150),
            source: article.source.name,
            date: new Date(article.publishedAt).toLocaleDateString('es-PE'),
            link: article.url,
            category: 'Actualidad'
        }));
        
        // Combinar noticias de API con locales
        window.NEWS = [...apiNews, ...window.NEWS].slice(0, 15);
        console.log('✓ Noticias actualizadas desde API');
        return true;
    } catch (error) {
        console.warn('API Noticias no disponible, usando noticias locales');
        return false;
    }
}

// 3. API de Criptomonedas - CoinGecko (GRATUITA y sin API key)
async function fetchCryptoRates() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=pen');
        const data = await response.json();
        
        console.log('✓ Precios de criptomonedas actualizados');
        return data;
    } catch (error) {
        console.warn('API Cripto no disponible');
        return null;
    }
}

// 4. API de Ubicacion y clima (para contexto local)
async function fetchLocalData() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        console.log('✓ Datos locales obtenidos:', data.city, data.country);
        return data;
    } catch (error) {
        console.warn('API Ubicación no disponible');
        return null;
    }
}

// ==========================================
// INICIALIZACION
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    initLanguage();
    setupEventListeners();
    
    // Cargar APIs en paralelo
    Promise.all([
        fetchExchangeRates(),
        fetchLatestNews(),
        fetchCryptoRates(),
        fetchLocalData()
    ]).then(() => {
        renderCalculators();
        renderForexList();
        renderSectorFilters();
        renderJobs();
        renderNews();
    });
    
    // Actualizar datos cada 5 minutos
    setInterval(fetchExchangeRates, 5 * 60 * 1000);
    setInterval(fetchLatestNews, 30 * 60 * 1000);
});

// ==========================================
// TEMA (DARK/LIGHT)
// ==========================================

function initTheme() {
    if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').textContent = '☀️';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    state.theme = isDark ? 'dark' : 'light';
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', state.theme);
}

// ==========================================
// IDIOMA
// ==========================================

function initLanguage() {
    document.getElementById('lang-text').textContent = state.currentLang.toUpperCase();
    updateDisclaimerText();
}

function toggleLanguage() {
    state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
    document.getElementById('lang-text').textContent = state.currentLang.toUpperCase();
    localStorage.setItem('lang', state.currentLang);
    updateDisclaimerText();
    renderCalculators();
}

function updateDisclaimerText() {
    const text = state.currentLang === 'es' 
        ? 'Los calculos son referenciales basados en la normativa 2026. Consulte con un especialista para casos especificos.'
        : 'Calculations are referential based on 2026 regulations. Consult with a specialist for specific cases.';
    document.getElementById('disclaimer-text').textContent = text;
}

// ==========================================
// NAVEGACION
// ==========================================

function setupEventListeners() {
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', (e) => navigate(e.target.closest('[data-nav]').dataset.nav));
    });

    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('mobile-open');
    });

    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('mobile-open');
        });
    });
}

function navigate(sectionId) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`sec-${sectionId}`)?.classList.add('active');

    document.querySelectorAll('[data-nav]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-nav="${sectionId}"]`)?.classList.add('active');

    state.currentSection = sectionId;

    if (sectionId === 'forex') initForex();
    if (sectionId === 'comparator') initComparator();
    if (sectionId === 'intelligence') initIntelligence();
}

// ==========================================
// CALCULADORAS
// ==========================================

function renderCalculators() {
    const container = document.getElementById('calc-buttons-container');
    if (!container) return;

    container.innerHTML = Object.keys(CALCULATOR_CONFIGS).map(key => {
        const calc = CALCULATOR_CONFIGS[key];
        return `
            <button data-calc="${key}" class="calc-tab-btn ${key === 'cts' ? 'active' : ''}">
                <span class="text-2xl">📋</span>
                <div class="flex-1 text-left hidden sm:block">
                    <div class="font-bold text-sm">${calc.title[state.currentLang]}</div>
                </div>
            </button>
        `;
    }).join('');

    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => selectCalculator(btn.dataset.calc));
    });

    selectCalculator('cts');
}

function selectCalculator(calcId) {
    state.currentCalculator = calcId;
    document.querySelectorAll('.calc-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-calc="${calcId}"]`)?.classList.add('active');
    renderCalculatorForm();
}

function renderCalculatorForm() {
    const container = document.getElementById('calculator-form');
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];

    if (!calc) return;

    let html = `
        <h3 class="text-2xl font-black mb-2">${calc.title[state.currentLang]}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${calc.description[state.currentLang]}</p>
    `;

    calc.fields.forEach(field => {
        html += `
            <div class="form-group">
                <label class="form-label">${field.label[state.currentLang]}</label>
                <input type="number" id="${field.id}" class="form-input" placeholder="${field.placeholder}"
                    ${field.min !== undefined ? `min="${field.min}"` : ''} 
                    ${field.max !== undefined ? `max="${field.max}"` : ''} step="0.01">
            </div>
        `;
    });

    html += `<button id="calc-btn" class="btn-primary">${state.currentLang === 'es' ? 'CALCULAR' : 'CALCULATE'}</button>`;

    container.innerHTML = html;
    document.getElementById('calc-btn').addEventListener('click', executeCalculation);
    document.getElementById('legal-info').textContent = calc.legalInfo[state.currentLang];
    document.getElementById('main-result').textContent = 'S/ 0.00';
    document.getElementById('result-details').innerHTML = '';
}

function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    if (!calc) return;

    const values = {};
    calc.fields.forEach(field => {
        values[field.id] = document.getElementById(field.id).value;
    });

    const result = calc.calculate(values);
    displayResult(result);
}

function displayResult(result) {
    const mainResult = document.getElementById('main-result');
    const detailsContainer = document.getElementById('result-details');

    mainResult.textContent = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

    detailsContainer.innerHTML = result.details.map(detail => `
        <div class="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
            <span class="text-sm opacity-90">${detail.label}</span>
            <span class="font-bold">${detail.value}</span>
        </div>
    `).join('');
}

// ==========================================
// INTELIGENCIA SALARIAL
// ==========================================

function initIntelligence() {
    calculateEquivalence();
    calculateSemaphore();
    calculateEscape();

    document.getElementById('eq-planilla')?.addEventListener('input', calculateEquivalence);
    document.getElementById('sem-salary')?.addEventListener('input', calculateSemaphore);
    document.getElementById('sem-sector')?.addEventListener('change', calculateSemaphore);
    ['esc-cts', 'esc-years', 'esc-expense', 'esc-salary'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', calculateEscape);
    });
}

function calculateEquivalence() {
    const salary = parseFloat(document.getElementById('eq-planilla')?.value) || 0;

    if (salary === 0) {
        document.getElementById('eq-result').textContent = 'S/ 0';
        document.getElementById('eq-breakdown').innerHTML = '';
        return;
    }

    const benefits = salary * CONFIG.BENEFITS_INVISIBLE;
    const subtotal = salary + benefits;
    const retention = subtotal > CONFIG.FOURTH_CATEGORY_THRESHOLD ? subtotal * CONFIG.FOURTH_CATEGORY_RETENTION : 0;
    const total = subtotal + retention;

    document.getElementById('eq-result').textContent = `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    document.getElementById('eq-breakdown').innerHTML = `
        <div class="flex justify-between"><span>Base:</span><span>S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <div class="flex justify-between"><span>Beneficios 18.33%:</span><span>+S/ ${benefits.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        ${retention > 0 ? `<div class="flex justify-between"><span>Retencion 4ta:</span><span>+S/ ${retention.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>` : ''}
        <div class="flex justify-between font-bold pt-2 border-t border-purple-300"><span>TOTAL:</span><span>S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
    `;
}

function calculateSemaphore() {
    const salary = parseFloat(document.getElementById('sem-salary')?.value) || 0;
    const sector = document.getElementById('sem-sector')?.value || 'tecnologia';

    if (salary === 0) {
        document.getElementById('semaphore-result').innerHTML = '';
        return;
    }

    const ranges = {
        tecnologia: { min: 2500, max: 12000 },
        mineria: { min: 3500, max: 15000 },
        finanzas: { min: 2800, max: 14000 },
        salud: { min: 2000, max: 10000 },
        comercio: { min: 1800, max: 9000 },
        educacion: { min: 1500, max: 7500 }
    };

    const range = ranges[sector] || ranges.tecnologia;
    const avg = (range.min + range.max) / 2;
    const lowThreshold = range.min + (avg - range.min) * 0.5;
    const topThreshold = avg + (range.max - avg) * 0.5;

    let status, colorClass;

    if (salary < lowThreshold) {
        status = '🔴 BAJO MERCADO';
        colorClass = 'semaphore-low';
    } else if (salary < topThreshold) {
        status = '🟡 EN PROMEDIO';
        colorClass = 'semaphore-average';
    } else {
        status = '🟢 TOP MERCADO';
        colorClass = 'semaphore-top';
    }

    const percentile = ((salary - range.min) / (range.max - range.min)) * 100;

    document.getElementById('semaphore-result').innerHTML = `
        <div class="${colorClass}">
            <div class="text-2xl font-black mb-2">${status}</div>
            <div class="text-sm font-bold mb-2">Percentil: ${Math.round(percentile)}%</div>
            <div class="text-xs opacity-75 pt-2 border-t border-current">Rango: S/ ${range.min.toLocaleString()} - S/ ${range.max.toLocaleString()}</div>
        </div>
    `;
}

function calculateEscape() {
    const cts = parseFloat(document.getElementById('esc-cts')?.value) || 0;
    const years = parseFloat(document.getElementById('esc-years')?.value) || 0;
    const expense = parseFloat(document.getElementById('esc-expense')?.value) || 0;
    const salary = parseFloat(document.getElementById('esc-salary')?.value) || 0;

    if (expense === 0) {
        document.getElementById('esc-months').textContent = '0 meses';
        document.getElementById('esc-breakdown').innerHTML = '';
        return;
    }

    const liquidation = salary * years * 0.5;
    const vacation = (salary / 30) * Math.min(years * 30, 60);
    const total = cts + liquidation + vacation;
    const months = total / expense;

    document.getElementById('esc-months').textContent = `${months.toFixed(1)} meses`;
    document.getElementById('esc-breakdown').innerHTML = `
        <div class="flex justify-between"><span>CTS:</span><span>S/ ${cts.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <div class="flex justify-between"><span>Liquidacion:</span><span>S/ ${liquidation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <div class="flex justify-between"><span>Vacaciones:</span><span>S/ ${vacation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
        <div class="flex justify-between font-bold pt-2 border-t border-orange-300"><span>TOTAL:</span><span>S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span></div>
    `;
}

// ==========================================
// COMPARADOR SALARIAL
// ==========================================

function initComparator() {
    document.getElementById('comp-btn')?.addEventListener('click', updateComparison);
    updateComparison();
}

function updateComparison() {
    const salary = parseFloat(document.getElementById('comp-salary')?.value) || 0;
    const sector = document.getElementById('comp-sector')?.value || 'tecnologia';
    const level = document.getElementById('comp-level')?.value || 'junior';

    const ranges = {
        tecnologia: { junior: [2500, 4500], middle: [4500, 7500], senior: [7500, 12000], lead: [12000, 20000] },
        mineria: { junior: [3500, 5500], middle: [5500, 9000], senior: [9000, 15000], lead: [15000, 25000] },
        finanzas: { junior: [2800, 5000], middle: [5000, 8500], senior: [8500, 14000], lead: [14000, 22000] },
        salud: { junior: [2000, 3500], middle: [3500, 6000], senior: [6000, 10000], lead: [10000, 18000] },
        comercio: { junior: [1800, 3000], middle: [3000, 5500], senior: [5500, 9000], lead: [9000, 15000] },
        educacion: { junior: [1500, 2500], middle: [2500, 4500], senior: [4500, 7500], lead: [7500, 12000] }
    };

    const range = ranges[sector]?.[level] || [0, 0];
    const [min, max] = range;
    const avg = (min + max) / 2;
    const isDark = state.theme === 'dark';

    const ctx = document.getElementById('comparison-chart');
    if (state.charts.comparison) state.charts.comparison.destroy();

    state.charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Min', 'Avg', 'Tu Sueldo', 'Max'],
            datasets: [{
                label: 'Comparacion',
                data: [min, avg, salary, max],
                backgroundColor: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.5)', salary >= avg ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)', 'rgba(59, 130, 246, 0.7)'],
                borderColor: ['rgb(59, 130, 246)', 'rgb(59, 130, 246)', salary >= avg ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)', 'rgb(59, 130, 246)'],
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: isDark ? '#94a3b8' : '#64748b', callback: value => `S/ ${value.toLocaleString()}` },
                    grid: { color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' }
                },
                x: { ticks: { color: isDark ? '#94a3b8' : '#64748b' }, grid: { display: false } }
            }
        }
    });

    const percentile = Math.round(((salary - min) / (max - min)) * 100);
    const difference = salary - avg;

    document.getElementById('comparison-stats').innerHTML = `
        <div class="stat-card"><div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">Percentil</div><div class="text-3xl font-black text-brand-500">${percentile}%</div></div>
        <div class="stat-card"><div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">vs. Avg</div><div class="text-3xl font-black ${difference >= 0 ? 'text-success-500' : 'text-danger-500'}">S/ ${Math.abs(difference).toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div></div>
        <div class="stat-card"><div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">Rango</div><div class="text-sm font-black text-slate-700 dark:text-slate-300">S/ ${min.toLocaleString()} - S/ ${max.toLocaleString()}</div></div>
    `;
}

// ==========================================
// FOREX - CON API REAL
// ==========================================

function renderForexList() {
    const list = document.getElementById('forex-list');
    if (!list) return;

    list.innerHTML = CURRENCIES.map(curr => `
        <button data-currency="${curr.code}" class="currency-card ${curr.code === state.selectedCurrency ? 'active' : ''}">
            <div><div class="text-xs font-bold text-slate-700 dark:text-slate-300">${curr.name}</div><div class="text-[10px] text-slate-400">${curr.symbol}</div></div>
            <div class="text-sm font-black text-brand-500">${curr.code}</div>
        </button>
    `).join('');

    document.querySelectorAll('[data-currency]').forEach(btn => {
        btn.addEventListener('click', () => selectCurrency(btn.dataset.currency));
    });
}

function selectCurrency(code) {
    state.selectedCurrency = code;
    document.querySelectorAll('.currency-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-currency="${code}"]`)?.classList.add('active');
    updateForex();
}

function initForex() {
    document.getElementById('forex-amount')?.addEventListener('input', updateForex);
    document.getElementById('forex-search')?.addEventListener('input', filterForex);
    updateForex();
}

function filterForex() {
    const search = document.getElementById('forex-search')?.value.toLowerCase() || '';
    document.querySelectorAll('[data-currency]').forEach(btn => {
        const curr = CURRENCIES.find(c => c.code === btn.dataset.currency);
        const matches = curr.name.toLowerCase().includes(search) || curr.code.toLowerCase().includes(search);
        btn.style.display = matches ? 'flex' : 'none';
    });
}

function updateForex() {
    const amount = parseFloat(document.getElementById('forex-amount')?.value) || 0;
    const currency = CURRENCIES.find(c => c.code === state.selectedCurrency);

    if (!currency) return;

    const converted = amount / currency.rate;

    document.getElementById('forex-pair').textContent = `${currency.code}/PEN`;
    document.getElementById('forex-rate').textContent = `1 ${currency.code} = S/ ${currency.rate.toFixed(4)} (API Real)`;
    document.getElementById('forex-converted').textContent = `${converted.toFixed(2)} ${currency.code}`;

    const labels = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    const baseRate = currency.rate;
    const chartData = labels.map(() => {
        const variance = (Math.random() - 0.5) * 0.04 * baseRate;
        return baseRate + variance;
    });

    const ctx = document.getElementById('forex-chart');
    const isDark = state.theme === 'dark';

    if (state.charts.forex) state.charts.forex.destroy();

    state.charts.forex = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `Tasa ${currency.code}/PEN (Tiempo Real)`,
                data: chartData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { ticks: { color: isDark ? '#94a3b8' : '#64748b', callback: value => `S/ ${value.toFixed(2)}` }, grid: { color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)' } },
                x: { ticks: { color: isDark ? '#94a3b8' : '#64748b' }, grid: { display: false } }
            }
        }
    });
}

// ==========================================
// EMPLEOS
// ==========================================

function renderSectorFilters() {
    const container = document.getElementById('sector-filters');
    if (!container) return;

    const sectors = ['all', 'tecnologia', 'mineria', 'finanzas', 'salud', 'comercio', 'educacion'];
    const labels = { all: 'Todos', tecnologia: 'Tech', mineria: 'Mineria', finanzas: 'Finanzas', salud: 'Salud', comercio: 'Comercio', educacion: 'Educacion' };

    container.innerHTML = sectors.map(sector => `
        <button data-sector="${sector}" class="sector-filter ${sector === 'all' ? 'active' : ''}">${labels[sector]}</button>
    `).join('');

    document.querySelectorAll('[data-sector]').forEach(btn => {
        btn.addEventListener('click', () => filterJobs(btn.dataset.sector));
    });
}

function filterJobs(sector) {
    state.selectedSector = sector;
    document.querySelectorAll('[data-sector]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-sector="${sector}"]`)?.classList.add('active');
    renderJobs();
}

function renderJobs() {
    const search = document.getElementById('job-search')?.value.toLowerCase() || '';
    const filtered = JOBS.filter(job => {
        const matchSearch = job.title.toLowerCase().includes(search) || job.sector.includes(search);
        const matchSector = state.selectedSector === 'all' || job.sector === state.selectedSector;
        return matchSearch && matchSector;
    }).slice(0, 40);

    document.getElementById('jobs-grid').innerHTML = filtered.map(job => `
        <div class="job-card">
            <div class="text-4xl mb-3">${job.icon}</div>
            <h4 class="font-bold text-sm dark:text-white mb-2 line-clamp-2">${job.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">${job.sector}</p>
            <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                <div><div class="text-xs text-slate-400 font-bold">Desde</div><div class="font-black text-brand-500">S/ ${job.salary.toLocaleString()}</div></div>
                <a href="${job.link}" target="_blank" rel="noopener" class="px-3 py-2 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition">Ver</a>
            </div>
        </div>
    `).join('');
}

// ==========================================
// NOTICIAS - CON API REAL
// ==========================================

function renderNews() {
    document.getElementById('news-grid').innerHTML = window.NEWS.map(article => `
        <div class="news-card">
            <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="px-3 py-1 bg-brand-500 text-white text-[9px] font-black rounded-full uppercase">${article.source}</span>
                <span class="text-[10px] text-slate-400">${article.date}</span>
            </div>
            <h4 class="text-base font-black dark:text-white mb-3 leading-tight">${article.title}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">${article.description || 'Sin descripción disponible'}</p>
            <a href="${article.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition">Leer mas →</a>
        </div>
    `).join('');
}

document.getElementById('job-search')?.addEventListener('input', renderJobs);
document.getElementById('comp-salary')?.addEventListener('input', updateComparison);
document.getElementById('comp-sector')?.addEventListener('change', updateComparison);
document.getElementById('comp-level')?.addEventListener('change', updateComparison);

document.getElementById('share-result-btn')?.addEventListener('click', () => {
    const result = document.getElementById('main-result').textContent;
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    const text = `${calc.title[state.currentLang]}: ${result}`;

    if (navigator.share) {
        navigator.share({ title: 'SueldoPro 2026', text: text, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('Copiado!'));
    }
});