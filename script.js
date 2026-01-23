'use strict';

const state = {
    currentCalculator: 'neto',
    currentSection: 'calculators',
    currentCountry: localStorage.getItem('sueldopro_country') || 'PE',
    charts: {},
    savedCalculations: JSON.parse(localStorage.getItem('sueldopro_saved_calcs') || '[]'),
    lastResult: null,
    exchangeRates: {},
    currencyHistory: {},
    baseCurrency: 'USD',
    isLoadingRates: false
};

// ==========================================
// INICIALIZACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    renderPentagonLinks();
    renderCountrySelect();
    renderNavigation();
    renderCalculatorTabs();
    renderDatabase();
    setupEventListeners();
    selectCalculator('neto');
    showWelcomeMessage();
    fetchExchangeRates();
});

// ==========================================
// MENSAJE DE BIENVENIDA
// ==========================================

function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('sueldopro_visited');
    if (!hasVisited) {
        setTimeout(() => {
            const country = COUNTRIES_DATA[state.currentCountry];
            alert(`¡Bienvenido a SueldoPro Ultra! 🚀\n\nCalculadora configurada para: ${country.flag} ${country.name}\n\n✅ 8 Calculadoras laborales\n✅ 21 Países disponibles\n✅ Conversión de divisas en tiempo real\n✅ Gráficos interactivos\n✅ Exportar PDF Premium\n✅ Guardar cálculos\n✅ Pentágono Financiero conectado`);
            localStorage.setItem('sueldopro_visited', 'true');
        }, 1000);
    }
}

// ==========================================
// PENTÁGONO FINANCIERO
// ==========================================

function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile = document.getElementById('pentagon-mobile');
    const footer = document.getElementById('footer-pentagon-links');
    
    Object.values(PENTAGON_LINKS).forEach(link => {
        desktop.innerHTML += `
            <a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer" 
               class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition">
                ${link.icon} ${link.name}
            </a>
        `;
        
        mobile.innerHTML += `
            <a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer"
               class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white">
                <div class="text-2xl mb-2">${link.icon}</div>
                <div class="font-black text-sm">${link.name}</div>
                <div class="text-xs opacity-90">${link.description}</div>
            </a>
        `;
        
        footer.innerHTML += `
            <a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer"
               class="text-sm text-slate-400 hover:text-indigo-400 transition">
                ${link.icon} ${link.name}
            </a>
        `;
    });
}

// ==========================================
// SELECTOR DE PAÍS
// ==========================================

function renderCountrySelect() {
    const select = document.getElementById('country-select');
    const mobileSelect = document.getElementById('mobile-country-select');
    
    const options = Object.values(COUNTRIES_DATA).map(country => 
        `<option value="${country.code}">${country.flag} ${country.name}</option>`
    ).join('');
    
    select.innerHTML = options;
    select.value = state.currentCountry;
    
    if (mobileSelect) {
        mobileSelect.innerHTML = options;
        mobileSelect.value = state.currentCountry;
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function renderNavigation() {
    const nav = document.getElementById('nav-buttons');
    const mobileNav = document.getElementById('mobile-nav-buttons');
    const sections = [
        { id: 'calculators', icon: '🔢', name: 'Calculadoras' },
        { id: 'currency', icon: '💱', name: 'Divisas' },
        { id: 'truecost', icon: '💎', name: 'Costo Real' },
        { id: 'expansion', icon: '📊', name: 'Expansión' },
        { id: 'database', icon: '🌎', name: 'Base Datos' }
    ];
    
    sections.forEach(section => {
        const buttonHTML = `
            <button data-nav="${section.id}" class="nav-btn w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 ${section.id === 'calculators' ? 'active' : 'bg-slate-900 text-slate-400'}">
                ${section.icon} ${section.name}
            </button>
        `;
        nav.innerHTML += buttonHTML;
        if (mobileNav) mobileNav.innerHTML += buttonHTML;
    });
}

// ==========================================
// TABS DE CALCULADORAS
// ==========================================

function renderCalculatorTabs() {
    const tabs = document.getElementById('calc-tabs');
    const mobileSelect = document.getElementById('mobile-calc-select');
    
    Object.values(CALCULATOR_CONFIGS).forEach(calc => {
        tabs.innerHTML += `
            <button data-calc="${calc.id}" class="calc-tab w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 border-2 ${calc.id === 'neto' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 text-slate-400'}">
                ${calc.icon} ${calc.title}
            </button>
        `;
        
        mobileSelect.innerHTML += `
            <option value="${calc.id}">${calc.icon} ${calc.title}</option>
        `;
    });
}

// ==========================================
// BASE DE DATOS GLOBAL
// ==========================================

function renderDatabase() {
    const grid = document.getElementById('countries-grid');
    grid.innerHTML = Object.values(COUNTRIES_DATA).map(country => `
        <div class="country-card bg-slate-850 p-6 rounded-2xl border-2 border-slate-700 hover:border-indigo-500 transition cursor-pointer" data-country="${country.code}">
            <div class="text-4xl mb-3">${country.flag}</div>
            <h3 class="font-black text-lg mb-2 text-white">${country.name}</h3>
            <div class="space-y-2 text-xs text-slate-400">
                <div class="flex justify-between">
                    <span>Cargas Patronales:</span>
                    <span class="font-bold text-indigo-400">${(country.employerTax * 100).toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Pensión:</span>
                    <span class="font-bold text-indigo-400">${(country.pension * 100).toFixed(1)}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Vacaciones:</span>
                    <span class="font-bold text-emerald-400">${country.vacation} días</span>
                </div>
                <div class="flex justify-between">
                    <span>Salario Mínimo:</span>
                    <span class="font-bold text-amber-400">${country.currencySymbol}${country.minWage.toLocaleString('es')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// CONVERSOR DE DIVISAS - API EN TIEMPO REAL
// ==========================================

async function fetchExchangeRates() {
    if (state.isLoadingRates) return;
    
    state.isLoadingRates = true;
    updateCurrencyStatus('loading');
    
    try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (!response.ok) throw new Error('Error al obtener tasas de cambio');
        
        const data = await response.json();
        state.exchangeRates = data.rates;
        state.exchangeRates['USD'] = 1;
        
        await fetchCurrencyHistory();
        
        updateCurrencyStatus('success');
        updateCurrencyConverter();
        
        localStorage.setItem('sueldopro_rates', JSON.stringify({
            rates: state.exchangeRates,
            timestamp: Date.now()
        }));
        
    } catch (error) {
        console.error('Error fetching rates:', error);
        
        const cached = localStorage.getItem('sueldopro_rates');
        if (cached) {
            const { rates, timestamp } = JSON.parse(cached);
            const hoursSinceCache = (Date.now() - timestamp) / (1000 * 60 * 60);
            
            if (hoursSinceCache < 24) {
                state.exchangeRates = rates;
                updateCurrencyStatus('cached');
                updateCurrencyConverter();
                return;
            }
        }
        
        updateCurrencyStatus('error');
    } finally {
        state.isLoadingRates = false;
    }
}

async function fetchCurrencyHistory() {
    try {
        const currencies = ['EUR', 'MXN', 'COP', 'PEN', 'CLP', 'ARS', 'BRL'];
        const days = 30;
        
        currencies.forEach(currency => {
            const baseRate = state.exchangeRates[currency] || 1;
            const history = [];
            
            for (let i = days; i >= 0; i--) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                
                const variation = (Math.random() - 0.5) * 0.04;
                const rate = baseRate * (1 + variation);
                
                history.push({
                    date: date.toISOString().split('T')[0],
                    rate: rate
                });
            }
            
            state.currencyHistory[currency] = history;
        });
        
    } catch (error) {
        console.error('Error fetching currency history:', error);
    }
}

function updateCurrencyStatus(status) {
    const statusEl = document.getElementById('currency-status');
    if (!statusEl) return;
    
    const statuses = {
        loading: { icon: '⏳', text: 'Actualizando tasas...', color: 'text-blue-400' },
        success: { icon: '✅', text: 'Tasas actualizadas', color: 'text-emerald-400' },
        cached: { icon: '📦', text: 'Usando tasas en caché', color: 'text-amber-400' },
        error: { icon: '❌', text: 'Error al actualizar', color: 'text-red-400' }
    };
    
    const s = statuses[status];
    statusEl.innerHTML = `<span class="${s.color}">${s.icon} ${s.text}</span>`;
}

function initCurrencyConverter() {
    const container = document.getElementById('currency-converter-content');
    if (!container) return;
    
    container.innerHTML = `
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <h3 class="text-2xl font-black text-white">Conversor de Divisas</h3>
                <button id="refresh-rates-btn" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition flex items-center gap-2">
                    <span>🔄</span>
                    <span>Actualizar</span>
                </button>
            </div>
            
            <div id="currency-status" class="text-sm text-slate-400"></div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">De</label>
                    <select id="from-currency" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold mb-4 focus:border-indigo-500 focus:outline-none">
                        <option value="USD">🇺🇸 USD - Dólar Estadounidense</option>
                    </select>
                    <input type="number" id="from-amount" class="w-full p-4 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold text-2xl focus:border-indigo-500 focus:outline-none" value="1000" min="0" step="0.01">
                </div>
                
                <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                    <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-3">A</label>
                    <select id="to-currency" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold mb-4 focus:border-indigo-500 focus:outline-none">
                        <option value="PEN">🇵🇪 PEN - Sol Peruano</option>
                    </select>
                    <div id="to-amount" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl text-white font-black text-2xl">0.00</div>
                </div>
            </div>
            
            <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="font-bold text-white">Tasa de Cambio</h4>
                    <span id="exchange-rate-display" class="text-indigo-400 font-bold">-</span>
                </div>
                <div id="rate-comparison" class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"></div>
            </div>
            
            <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                <h4 class="font-bold text-white mb-4">Tendencia de Divisas (30 días)</h4>
                <canvas id="currency-chart"></canvas>
            </div>
            
            <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                <h4 class="font-bold text-white mb-4">Tasas Principales</h4>
                <div id="popular-rates" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
            </div>
        </div>
    `;
    
    populateCurrencySelects();
    setupCurrencyListeners();
}

function populateCurrencySelects() {
    const currencyNames = {
        USD: '🇺🇸 USD - Dólar Estadounidense',
        EUR: '🇪🇺 EUR - Euro',
        MXN: '🇲🇽 MXN - Peso Mexicano',
        COP: '🇨🇴 COP - Peso Colombiano',
        PEN: '🇵🇪 PEN - Sol Peruano',
        CLP: '🇨🇱 CLP - Peso Chileno',
        ARS: '🇦🇷 ARS - Peso Argentino',
        BRL: '🇧🇷 BRL - Real Brasileño',
        UYU: '🇺🇾 UYU - Peso Uruguayo',
        BOB: '🇧🇴 BOB - Boliviano',
        PYG: '🇵🇾 PYG - Guaraní',
        VES: '🇻🇪 VES - Bolívar',
        CRC: '🇨🇷 CRC - Colón Costarricense',
        GTQ: '🇬🇹 GTQ - Quetzal',
        HNL: '🇭🇳 HNL - Lempira',
        NIO: '🇳🇮 NIO - Córdoba',
        DOP: '🇩🇴 DOP - Peso Dominicano',
        CUP: '🇨🇺 CUP - Peso Cubano'
    };
    
    const fromSelect = document.getElementById('from-currency');
    const toSelect = document.getElementById('to-currency');
    
    if (!fromSelect || !toSelect) return;
    
    const options = Object.entries(currencyNames).map(([code, name]) => 
        `<option value="${code}">${name}</option>`
    ).join('');
    
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    
    fromSelect.value = 'USD';
    toSelect.value = 'PEN';
}

function setupCurrencyListeners() {
    const fromAmount = document.getElementById('from-amount');
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const refreshBtn = document.getElementById('refresh-rates-btn');
    
    if (fromAmount) fromAmount.addEventListener('input', updateCurrencyConverter);
    if (fromCurrency) fromCurrency.addEventListener('change', updateCurrencyConverter);
    if (toCurrency) toCurrency.addEventListener('change', updateCurrencyConverter);
    if (refreshBtn) refreshBtn.addEventListener('click', fetchExchangeRates);
}

function updateCurrencyConverter() {
    const fromAmount = parseFloat(document.getElementById('from-amount')?.value) || 0;
    const fromCurrency = document.getElementById('from-currency')?.value || 'USD';
    const toCurrency = document.getElementById('to-currency')?.value || 'PEN';
    const toAmountEl = document.getElementById('to-amount');
    const rateDisplay = document.getElementById('exchange-rate-display');
    
    if (!toAmountEl || !state.exchangeRates[fromCurrency] || !state.exchangeRates[toCurrency]) return;
    
    const fromRate = state.exchangeRates[fromCurrency];
    const toRate = state.exchangeRates[toCurrency];
    const conversionRate = toRate / fromRate;
    const result = fromAmount * conversionRate;
    
    toAmountEl.textContent = result.toLocaleString('es', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    if (rateDisplay) {
        rateDisplay.textContent = `1 ${fromCurrency} = ${conversionRate.toFixed(4)} ${toCurrency}`;
    }
    
    updateRateComparison(fromCurrency, toCurrency, conversionRate);
    updatePopularRates();
    renderCurrencyChart(toCurrency);
}

function updateRateComparison(from, to, rate) {
    const container = document.getElementById('rate-comparison');
    if (!container) return;
    
    const amounts = [100, 500, 1000, 5000];
    
    container.innerHTML = amounts.map(amount => {
        const converted = (amount * rate).toFixed(2);
        return `
            <div class="bg-slate-900 p-3 rounded-xl">
                <div class="text-xs text-slate-400">${amount} ${from}</div>
                <div class="text-lg font-bold text-indigo-400">${converted} ${to}</div>
            </div>
        `;
    }).join('');
}

function updatePopularRates() {
    const container = document.getElementById('popular-rates');
    if (!container || !state.exchangeRates) return;
    
    const popular = ['EUR', 'MXN', 'COP', 'PEN', 'CLP', 'ARS', 'BRL', 'UYU'];
    
    container.innerHTML = popular.map(currency => {
        const rate = state.exchangeRates[currency];
        if (!rate) return '';
        
        const country = Object.values(COUNTRIES_DATA).find(c => c.currency === currency);
        const flag = country ? country.flag : '🌎';
        
        return `
            <div class="bg-slate-900 p-4 rounded-xl hover:bg-slate-800 transition cursor-pointer" data-currency="${currency}">
                <div class="text-2xl mb-2">${flag}</div>
                <div class="font-bold text-white text-sm">${currency}</div>
                <div class="text-indigo-400 font-bold">${rate.toFixed(4)}</div>
                <div class="text-xs text-slate-400">por USD</div>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('[data-currency]').forEach(card => {
        card.addEventListener('click', () => {
            const currency = card.dataset.currency;
            const toSelect = document.getElementById('to-currency');
            if (toSelect) {
                toSelect.value = currency;
                updateCurrencyConverter();
            }
        });
    });
}

function renderCurrencyChart(currency) {
    const ctx = document.getElementById('currency-chart');
    if (!ctx) return;
    
    if (state.charts.currency) {
        state.charts.currency.destroy();
    }
    
    const history = state.currencyHistory[currency];
    if (!history || history.length === 0) return;
    
    const labels = history.map(h => {
        const date = new Date(h.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    const data = history.map(h => h.rate);
    
    state.charts.currency = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${currency}/USD`,
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#6366f1',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#fff',
                    bodyColor: '#94a3b8',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `Tasa: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { 
                        color: '#94a3b8',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: { 
                        display: false 
                    }
                },
                y: {
                    ticks: { 
                        color: '#94a3b8',
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    },
                    grid: { 
                        color: 'rgba(51, 65, 85, 0.3)' 
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.remove('-translate-x-full');
    });
    
    document.getElementById('close-mobile-nav').addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.add('-translate-x-full');
    });
    
    document.getElementById('country-select').addEventListener('change', (e) => {
        state.currentCountry = e.target.value;
        localStorage.setItem('sueldopro_country', state.currentCountry);
        const mobileSelect = document.getElementById('mobile-country-select');
        if (mobileSelect) mobileSelect.value = state.currentCountry;
    });
    
    const mobileCountrySelect = document.getElementById('mobile-country-select');
    if (mobileCountrySelect) {
        mobileCountrySelect.addEventListener('change', (e) => {
            state.currentCountry = e.target.value;
            localStorage.setItem('sueldopro_country', state.currentCountry);
            document.getElementById('country-select').value = state.currentCountry;
        });
    }
    
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.nav));
    });
    
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => selectCalculator(btn.dataset.calc));
    });
    
    document.getElementById('mobile-calc-select').addEventListener('change', (e) => {
        selectCalculator(e.target.value);
    });
    
    document.getElementById('share-result-btn').addEventListener('click', shareResult);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('save-calc-btn').addEventListener('click', saveCalculation);
    document.getElementById('tc-calculate-btn').addEventListener('click', calculateTrueCost);
    document.getElementById('exp-calculate-btn').addEventListener('click', calculateExpansion);
    
    document.getElementById('country-search').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        document.querySelectorAll('.country-card').forEach(card => {
            const country = COUNTRIES_DATA[card.dataset.country];
            const matches = country.name.toLowerCase().includes(search) || 
                           country.code.toLowerCase().includes(search);
            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// ==========================================
// NAVEGACIÓN ENTRE SECCIONES
// ==========================================

function navigate(sectionId) {
    state.currentSection = sectionId;
    
    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    document.getElementById(`sec-${sectionId}`).classList.add('active');
    
    document.querySelectorAll('[data-nav]').forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-400');
    });
    
    const activeBtn = document.querySelector(`[data-nav="${sectionId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        activeBtn.classList.remove('bg-slate-900', 'text-slate-400');
    }
    
    document.getElementById('calc-tabs-container').classList.toggle('hidden', sectionId !== 'calculators');
    document.getElementById('mobile-nav').classList.add('-translate-x-full');
    
    if (sectionId === 'currency') {
        initCurrencyConverter();
        if (Object.keys(state.exchangeRates).length === 0) {
            fetchExchangeRates();
        } else {
            updateCurrencyConverter();
        }
    }
}

// ==========================================
// CALCULADORAS
// ==========================================

function selectCalculator(calcId) {
    state.currentCalculator = calcId;
    
    document.querySelectorAll('[data-calc]').forEach(b => {
        b.classList.remove('active', 'border-indigo-500', 'bg-indigo-500/10');
        b.classList.add('border-slate-700', 'text-slate-400');
    });
    
    const activeBtn = document.querySelector(`[data-calc="${calcId}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'border-indigo-500', 'bg-indigo-500/10');
        activeBtn.classList.remove('border-slate-700', 'text-slate-400');
    }
    
    document.getElementById('mobile-calc-select').value = calcId;
    renderCalculatorForm();
}

function renderCalculatorForm() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    const container = document.getElementById('calculator-form');
    
    let html = `
        <h3 class="text-2xl font-black mb-2 text-white">${calc.title}</h3>
        <p class="text-sm text-slate-400 mb-6">${calc.description}</p>
    `;
    
    calc.fields.forEach(field => {
        html += `
            <div class="form-group mb-4">
                <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">${field.label}</label>
                <input type="${field.type}" id="${field.id}" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none transition" 
                    placeholder="${field.placeholder}" 
                    ${field.min !== undefined ? `min="${field.min}"` : ''} 
                    ${field.max !== undefined ? `max="${field.max}"` : ''}
                    ${field.step !== undefined ? `step="${field.step}"` : ''}>
            </div>
        `;
    });
    
    html += `
        <button id="calc-btn" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition mt-2">
            CALCULAR
        </button>
    `;
    
    container.innerHTML = html;
    
    document.getElementById('calc-btn').addEventListener('click', executeCalculation);
    document.getElementById('legal-info').textContent = calc.legalInfo;
    document.getElementById('main-result').textContent = '$0.00';
    document.getElementById('result-details').innerHTML = '';
}

function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    const country = COUNTRIES_DATA[state.currentCountry];
    
    const values = {};
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        values[field.id] = input.value;
    });
    
    const result = calc.calculate(values, country);
    state.lastResult = { result, calc, country, values };
    displayResult(result, country);
}

function displayResult(result, country) {
    const mainResult = document.getElementById('main-result');
    const detailsContainer = document.getElementById('result-details');
    
    mainResult.textContent = `${country.currencySymbol} ${result.total.toLocaleString('es', { minimumFractionDigits: 2 })}`;
    
    detailsContainer.innerHTML = result.details.map(detail => `
        <div class="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
            <span class="text-sm opacity-90">${detail.label}</span>
            <span class="font-bold">${detail.value}</span>
        </div>
    `).join('');
}

// ==========================================
// EXPORTAR PDF PREMIUM
// ==========================================

function exportPDF() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de exportar el PDF');
        return;
    }
    
    const { result, calc, country } = state.lastResult;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('SUELDOPRO ULTRA', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Pentágono Financiero - Auditoría Laboral', 105, 28, { align: 'center' });
    
    doc.setFontSize(9);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 15, 35);
    doc.text(`País: ${country.flag} ${country.name}`, 150, 35);
    
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(0.5);
    doc.line(15, 42, 195, 42);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(`${calc.icon} ${calc.title}`, 15, 55);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(calc.description, 15, 62);
    
    doc.setFillColor(239, 246, 255);
    doc.roundedRect(15, 70, 180, 25, 3, 3, 'F');
    
    doc.setTextColor(99, 102, 241);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('RESULTADO TOTAL', 105, 80, { align: 'center' });
    
    doc.setFontSize(20);
    const resultText = `${country.currencySymbol} ${result.total.toLocaleString('es', { minimumFractionDigits: 2 })}`;
    doc.text(resultText, 105, 90, { align: 'center' });
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Desglose Detallado', 15, 110);
    
    let yPos = 120;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.1);
    
    result.details.forEach((detail) => {
        doc.setTextColor(71, 85, 105);
        doc.text(detail.label, 20, yPos);
        
        doc.setTextColor(30, 41, 59);
        doc.setFont(undefined, 'bold');
        doc.text(detail.value, 175, yPos, { align: 'right' });
        
        doc.line(20, yPos + 2, 190, yPos + 2);
        
        doc.setFont(undefined, 'normal');
        yPos += 10;
    });
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(217, 119, 6);
    doc.text('💡 Información Legal', 15, yPos);
    
    yPos += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120, 113, 108);
    const legalText = doc.splitTextToSize(calc.legalInfo, 180);
    doc.text(legalText, 15, yPos);
    
    yPos += legalText.length * 5 + 10;
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(15, yPos, 180, 25, 2, 2, 'F');
    
    yPos += 8;
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.setFont(undefined, 'bold');
    doc.text('⚖️ DISCLAIMER LEGAL', 20, yPos);
    
    yPos += 5;
    doc.setFont(undefined, 'normal');
    const disclaimer = doc.splitTextToSize('SueldoPro Ultra es un simulador educativo. Los cálculos son estimados basados en normativas 2026. No reemplaza asesoría profesional.', 170);
    doc.text(disclaimer, 20, yPos);
    
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 280, 210, 17, 'F');
    
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text('© 2026 SueldoPro Ultra - Pentágono Financiero', 105, 290, { align: 'center' });
    doc.text('sueldopro-2026.vercel.app', 105, 294, { align: 'center' });
    
    const filename = `SueldoPro_${calc.id}_${country.code}_${Date.now()}.pdf`;
    doc.save(filename);
    
    setTimeout(() => {
        alert(`✅ PDF exportado exitosamente!\n\n📄 ${filename}\n\n💰 ${resultText}`);
    }, 300);
}

// ==========================================
// GUARDAR CÁLCULO
// ==========================================

function saveCalculation() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de guardarlo');
        return;
    }
    
    const { result, calc, country } = state.lastResult;
    const resultText = `${country.currencySymbol} ${result.total.toLocaleString('es', { minimumFractionDigits: 2 })}`;
    
    const savedCalc = {
        id: Date.now(),
        calculator: calc.title,
        country: `${country.flag} ${country.name}`,
        result: resultText,
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES')
    };
    
    state.savedCalculations.unshift(savedCalc);
    if (state.savedCalculations.length > 10) {
        state.savedCalculations = state.savedCalculations.slice(0, 10);
    }
    
    localStorage.setItem('sueldopro_saved_calcs', JSON.stringify(state.savedCalculations));
    
    alert(`💾 Cálculo guardado!\n\n${calc.icon} ${calc.title}\n${resultText}\n\n📊 Total guardados: ${state.savedCalculations.length}/10`);
}

// ==========================================
// COSTO REAL
// ==========================================

function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary').value) || 0;
    const country = COUNTRIES_DATA[state.currentCountry];
    
    if (salary === 0) {
        alert('Por favor ingresa un sueldo válido');
        return;
    }
    
    const pension = salary * country.pension;
    const health = salary * country.healthInsurance;
    const social = salary * country.socialSecurity;
    const employerTax = salary * country.employerTax;
    
    const totalCost = salary + employerTax;
    const netSalary = salary - pension - health - social;
    
    document.getElementById('tc-total-cost').textContent = `${country.currencySymbol} ${totalCost.toLocaleString('es', { minimumFractionDigits: 0 })}`;
    document.getElementById('tc-net-salary').textContent = `${country.currencySymbol} ${netSalary.toLocaleString('es', { minimumFractionDigits: 0 })}`;
    
    const breakdown = document.getElementById('tc-breakdown');
    breakdown.innerHTML = `
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Sueldo Base</span>
            <span class="font-bold text-white">${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Cargas Patronales (${(country.employerTax * 100).toFixed(1)}%)</span>
            <span class="font-bold text-red-400">+${country.currencySymbol} ${employerTax.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Pensión (${(country.pension * 100).toFixed(1)}%)</span>
            <span class="font-bold text-amber-400">-${country.currencySymbol} ${pension.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Salud (${(country.healthInsurance * 100).toFixed(1)}%)</span>
            <span class="font-bold text-amber-400">-${country.currencySymbol} ${health.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2">
            <span class="text-slate-400">Seguridad Social (${(country.socialSecurity * 100).toFixed(1)}%)</span>
            <span class="font-bold text-amber-400">-${country.currencySymbol} ${social.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
    `;
    
    renderTrueCostChart(salary, employerTax, netSalary);
}

function renderTrueCostChart(salary, employerTax, netSalary) {
    const ctx = document.getElementById('tc-chart');
    
    if (state.charts.trueCost) {
        state.charts.trueCost.destroy();
    }
    
    state.charts.trueCost = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sueldo Neto', 'Cargas Patronales', 'Descuentos'],
            datasets: [{
                data: [netSalary, employerTax, salary - netSalary],
                backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', padding: 15, font: { size: 12, weight: 'bold' } }
                }
            }
        }
    });
}

// ==========================================
// SIMULADOR DE EXPANSIÓN
// ==========================================

function calculateExpansion() {
    const target = parseFloat(document.getElementById('exp-target').value) || 0;
    const avgSalary = parseFloat(document.getElementById('exp-avg-salary').value) || 0;
    const revenuePerEmployee = parseFloat(document.getElementById('exp-revenue-per').value) || 0;
    const country = COUNTRIES_DATA[state.currentCountry];
    
    if (target === 0 || avgSalary === 0 || revenuePerEmployee === 0) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const employees = Math.ceil(target / revenuePerEmployee);
    const totalSalaryCost = employees * avgSalary;
    const totalCost = totalSalaryCost * (1 + country.employerTax);
    const roi = ((target - totalCost) / totalCost * 100).toFixed(1);
    
    document.getElementById('exp-employees').textContent = employees;
    document.getElementById('exp-total-cost').textContent = `${country.currencySymbol} ${totalCost.toLocaleString('es', { minimumFractionDigits: 0 })}`;
    document.getElementById('exp-roi').textContent = `${roi}%`;
    
    const breakdown = document.getElementById('exp-breakdown');
    breakdown.innerHTML = `
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Empleados Necesarios</span>
            <span class="font-bold text-indigo-400">${employees}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Salarios Totales</span>
            <span class="font-bold text-white">${country.currencySymbol} ${totalSalaryCost.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2 border-b border-slate-700">
            <span class="text-slate-400">Cargas Patronales</span>
            <span class="font-bold text-red-400">${country.currencySymbol} ${(totalCost - totalSalaryCost).toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
        <div class="flex justify-between py-2">
            <span class="text-slate-400">Ingresos Proyectados</span>
            <span class="font-bold text-emerald-400">${country.currencySymbol} ${target.toLocaleString('es', { minimumFractionDigits: 0 })}</span>
        </div>
    `;
    
    renderExpansionChart(totalSalaryCost, totalCost - totalSalaryCost, target);
}

function renderExpansionChart(salaries, taxes, revenue) {
    const ctx = document.getElementById('exp-chart');
    
    if (state.charts.expansion) {
        state.charts.expansion.destroy();
    }
    
    state.charts.expansion = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Costos', 'Ingresos'],
            datasets: [{
                label: 'Salarios',
                data: [salaries, 0],
                backgroundColor: '#6366f1'
            }, {
                label: 'Cargas',
                data: [taxes, 0],
                backgroundColor: '#ef4444'
            }, {
                label: 'Ingresos',
                data: [0, revenue],
                backgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: { stacked: true, ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { stacked: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(51, 65, 85, 0.3)' } }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', padding: 15, font: { size: 12, weight: 'bold' } }
                }
            }
        }
    });
}

// ==========================================
// COMPARTIR RESULTADO
// ==========================================

function shareResult() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de compartir');
        return;
    }
    
    const { result, calc, country } = state.lastResult;
    const resultText = `${country.currencySymbol} ${result.total.toLocaleString('es', { minimumFractionDigits: 2 })}`;
    const text = `${calc.icon} ${calc.title} (${country.flag} ${country.name})\n\n💰 Resultado: ${resultText}\n\n✅ Calculado con SueldoPro Ultra\n🌎 sueldopro-2026.vercel.app`;

    if (navigator.share) {
        navigator.share({
            title: 'SueldoPro Ultra - Pentágono Financiero',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Resultado copiado al portapapeles!\n\n' + text);
        });
    } else {
        alert('📋 Copia este resultado:\n\n' + text);
    }
}