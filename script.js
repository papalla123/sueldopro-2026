'use strict';

const state = {
    currentCalculator: 'neto',
    currentSection: 'calculators',
    currentCountry: localStorage.getItem('sueldopro_country') || 'PE',
    charts: {}
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
});

// ==========================================
// PENTÁGONO FINANCIERO
// ==========================================

function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile = document.getElementById('pentagon-mobile');
    const footer = document.getElementById('footer-pentagon-links');
    
    Object.values(PENTAGON_LINKS).forEach(link => {
        // Desktop
        desktop.innerHTML += `
            <a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer" 
               class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition">
                ${link.icon} ${link.name}
            </a>
        `;
        
        // Mobile
        mobile.innerHTML += `
            <a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer"
               class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white">
                <div class="text-2xl mb-2">${link.icon}</div>
                <div class="font-black text-sm">${link.name}</div>
                <div class="text-xs opacity-90">${link.description}</div>
            </a>
        `;
        
        // Footer
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
    select.innerHTML = Object.values(COUNTRIES_DATA).map(country => 
        `<option value="${country.code}">${country.flag} ${country.name}</option>`
    ).join('');
    select.value = state.currentCountry;
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function renderNavigation() {
    const nav = document.getElementById('nav-buttons');
    const sections = [
        { id: 'calculators', icon: '🔢', name: 'Calculadoras' },
        { id: 'truecost', icon: '💎', name: 'Costo Real' },
        { id: 'expansion', icon: '📊', name: 'Expansión' },
        { id: 'database', icon: '🌍', name: 'Base Datos' }
    ];
    
    sections.forEach(section => {
        nav.innerHTML += `
            <button data-nav="${section.id}" class="nav-btn w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 ${section.id === 'calculators' ? 'active' : 'bg-slate-900 text-slate-400'}">
                ${section.icon} ${section.name}
            </button>
        `;
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
// EVENT LISTENERS
// ==========================================

function setupEventListeners() {
    // Mobile menu
    document.getElementById('mobile-menu-btn').addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.remove('-translate-x-full');
    });
    
    document.getElementById('close-mobile-nav').addEventListener('click', () => {
        document.getElementById('mobile-nav').classList.add('-translate-x-full');
    });
    
    // Country select
    document.getElementById('country-select').addEventListener('change', (e) => {
        state.currentCountry = e.target.value;
        localStorage.setItem('sueldopro_country', state.currentCountry);
    });
    
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.nav));
    });
    
    // Calculator tabs
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => selectCalculator(btn.dataset.calc));
    });
    
    document.getElementById('mobile-calc-select').addEventListener('change', (e) => {
        selectCalculator(e.target.value);
    });
    
    // Share button
    document.getElementById('share-result-btn').addEventListener('click', shareResult);
    
    // True Cost
    document.getElementById('tc-calculate-btn').addEventListener('click', calculateTrueCost);
    
    // Expansion
    document.getElementById('exp-calculate-btn').addEventListener('click', calculateExpansion);
    
    // Country search
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
    
    document.querySelectorAll('[data-nav]').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-nav="${sectionId}"]`).classList.add('active');
    
    document.getElementById('calc-tabs-container').classList.toggle('hidden', sectionId !== 'calculators');
    
    // Cerrar menú móvil
    document.getElementById('mobile-nav').classList.add('-translate-x-full');
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
    const result = document.getElementById('main-result').textContent;
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    const country = COUNTRIES_DATA[state.currentCountry];
    const text = `${calc.title} (${country.name}): ${result} - Calculado con SueldoPro Ultra`;
    
    if (navigator.share) {
        navigator.share({
            title: 'SueldoPro Ultra',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Resultado copiado al portapapeles');
        });
    }
}