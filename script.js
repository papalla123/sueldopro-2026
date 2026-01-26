'use strict';

const state = {
    currentCalculator: 'neto',
    currentSection: 'calculators',
    currentRegimen: 'general',
    charts: {},
    savedCalculations: JSON.parse(localStorage.getItem('sueldopro_saved_calcs') || '[]'),
    lastResult: null
};

document.addEventListener('DOMContentLoaded', () => {
    renderPentagonLinks();
    renderRegimenSelect();
    renderNavigation();
    renderCalculatorTabs();
    setupEventListeners();
    selectCalculator('neto');
    showWelcomeMessage();
});

function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('sueldopro_visited');
    if (!hasVisited) {
        setTimeout(() => {
            alert('¡Bienvenido a SueldoPro Ultra Perú! 🚀\n\nCalculadora Laboral Peruana 2026\n\n✅ 8 Calculadoras especializadas\n✅ 3 Regímenes laborales\n✅ Legislación peruana actualizada\n✅ Gráficos interactivos\n✅ Exportar PDF Premium\n✅ Guardar cálculos\n✅ Pentágono Financiero conectado\n\n🇵🇪 100% Perú - 100% Precisión');
            localStorage.setItem('sueldopro_visited', 'true');
        }, 1000);
    }
}

function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile = document.getElementById('pentagon-mobile');
    const footer = document.getElementById('footer-pentagon-links');
    
    Object.values(PENTAGON_LINKS).forEach(link => {
        desktop.innerHTML += `<a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition">${link.icon} ${link.name}</a>`;
        mobile.innerHTML += `<a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer" class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white"><div class="text-2xl mb-2">${link.icon}</div><div class="font-black text-sm">${link.name}</div></a>`;
        footer.innerHTML += `<a href="${link.url}" target="${link.url === window.location.href ? '_self' : '_blank'}" rel="noopener noreferrer" class="text-sm text-slate-400 hover:text-indigo-400 transition">${link.icon} ${link.name}</a>`;
    });
}

function renderRegimenSelect() {
    const select = document.getElementById('regimen-select');
    const mobileSelect = document.getElementById('mobile-regimen-select');
    
    const options = Object.values(REGIMENES_PERU).map(regimen => `<option value="${regimen.id}">${regimen.icon} ${regimen.nombre}</option>`).join('');
    select.innerHTML = options;
    select.value = state.currentRegimen;
    if (mobileSelect) {
        mobileSelect.innerHTML = options;
        mobileSelect.value = state.currentRegimen;
    }
    updateRegimenInfo();
}

function updateRegimenInfo() {
    const regimen = REGIMENES_PERU[state.currentRegimen];
    const infoDiv = document.getElementById('regimen-info');
    if (infoDiv) {
        infoDiv.innerHTML = `<div class="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-4"><div class="flex items-start gap-3"><div class="text-2xl">${regimen.icon}</div><div class="flex-1"><h4 class="font-bold text-indigo-300 mb-1">${regimen.nombre}</h4><p class="text-xs text-slate-400 mb-3">${regimen.descripcion}</p><div class="grid grid-cols-2 gap-2 text-xs"><div><span class="text-slate-500">Gratificaciones:</span><span class="text-white font-bold ml-2">${regimen.beneficios.gratificaciones ? (regimen.beneficios.gratificacionesFactor * 100) + '%' : 'No'}</span></div><div><span class="text-slate-500">CTS:</span><span class="text-white font-bold ml-2">${regimen.beneficios.cts ? (regimen.beneficios.ctsFactor * 100) + '%' : 'No'}</span></div><div><span class="text-slate-500">Vacaciones:</span><span class="text-white font-bold ml-2">${regimen.beneficios.vacaciones} días</span></div><div><span class="text-slate-500">Asig. Familiar:</span><span class="text-white font-bold ml-2">${regimen.beneficios.asignacionFamiliar ? 'Sí' : 'No'}</span></div></div></div></div></div>`;
    }
}

function renderNavigation() {
    const nav = document.getElementById('nav-buttons');
    const mobileNav = document.getElementById('mobile-nav-buttons');
    const sections = [
        { id: 'calculators', icon: '🔢', name: 'Calculadoras' },
        { id: 'truecost', icon: '💎', name: 'Costo Real' },
        { id: 'comparison', icon: '📊', name: 'Comparador' }
    ];
    sections.forEach(section => {
        const buttonHTML = `<button data-nav="${section.id}" class="nav-btn w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 ${section.id === 'calculators' ? 'active' : 'bg-slate-900 text-slate-400'}">${section.icon} ${section.name}</button>`;
        nav.innerHTML += buttonHTML;
        if (mobileNav) mobileNav.innerHTML += buttonHTML;
    });
}

function renderCalculatorTabs() {
    const tabs = document.getElementById('calc-tabs');
    const mobileSelect = document.getElementById('mobile-calc-select');
    Object.values(CALCULATOR_CONFIGS).forEach(calc => {
        tabs.innerHTML += `<button data-calc="${calc.id}" class="calc-tab w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 border-2 ${calc.id === 'neto' ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 text-slate-400'}">${calc.icon} ${calc.title}</button>`;
        mobileSelect.innerHTML += `<option value="${calc.id}">${calc.icon} ${calc.title}</option>`;
    });
}

function setupEventListeners() {
    document.getElementById('mobile-menu-btn').addEventListener('click', () => document.getElementById('mobile-nav').classList.remove('-translate-x-full'));
    document.getElementById('close-mobile-nav').addEventListener('click', () => document.getElementById('mobile-nav').classList.add('-translate-x-full'));
    
    document.getElementById('regimen-select').addEventListener('change', (e) => {
        state.currentRegimen = e.target.value;
        localStorage.setItem('sueldopro_regimen', state.currentRegimen);
        const mobileSelect = document.getElementById('mobile-regimen-select');
        if (mobileSelect) mobileSelect.value = state.currentRegimen;
        updateRegimenInfo();
        if (state.lastResult) executeCalculation();
    });
    
    const mobileRegimenSelect = document.getElementById('mobile-regimen-select');
    if (mobileRegimenSelect) {
        mobileRegimenSelect.addEventListener('change', (e) => {
            state.currentRegimen = e.target.value;
            localStorage.setItem('sueldopro_regimen', state.currentRegimen);
            document.getElementById('regimen-select').value = state.currentRegimen;
            updateRegimenInfo();
            if (state.lastResult) executeCalculation();
        });
    }
    
    document.querySelectorAll('[data-nav]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.nav)));
    document.querySelectorAll('[data-calc]').forEach(btn => btn.addEventListener('click', () => selectCalculator(btn.dataset.calc)));
    document.getElementById('mobile-calc-select').addEventListener('change', (e) => selectCalculator(e.target.value));
    document.getElementById('share-result-btn').addEventListener('click', shareResult);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('save-calc-btn').addEventListener('click', saveCalculation);
    document.getElementById('tc-calculate-btn').addEventListener('click', calculateTrueCost);
    document.getElementById('comp-calculate-btn').addEventListener('click', calculateComparison);
    document.getElementById('strategic-compare-btn').addEventListener('click', calculateStrategicComparison);
}

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
}

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
    let html = `<h3 class="text-2xl font-black mb-2 text-white">${calc.title}</h3><p class="text-sm text-slate-400 mb-6">${calc.description}</p>`;
    
    calc.fields.forEach(field => {
        const fieldClass = field.dependsOn ? `field-conditional hidden` : '';
        const dataAttrs = field.dependsOn ? `data-depends-on="${field.dependsOn}" data-show-when="${field.showWhen}"` : '';
        
        if (field.type === 'select') {
            html += `<div class="form-group mb-4 ${fieldClass}" ${dataAttrs}><label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">${field.label}</label><select id="${field.id}" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none transition">${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}</select>${field.help ? `<p class="text-xs text-slate-500 mt-1">${field.help}</p>` : ''}</div>`;
        } else {
            html += `<div class="form-group mb-4 ${fieldClass}" ${dataAttrs}><label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">${field.label}</label><input type="${field.type}" id="${field.id}" ${field.inputmode ? `inputmode="${field.inputmode}"` : ''} class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none transition" placeholder="${field.placeholder}" ${field.min !== undefined ? `min="${field.min}"` : ''} ${field.max !== undefined ? `max="${field.max}"` : ''} ${field.step !== undefined ? `step="${field.step}"` : ''}>${field.help ? `<p class="text-xs text-slate-500 mt-1">${field.help}</p>` : ''}</div>`;
        }
    });
    
    html += `<button id="calc-btn" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition mt-2">CALCULAR</button>`;
    container.innerHTML = html;
    
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input) return;
        const hasDependent = calc.fields.some(f => f.dependsOn === field.id);
        if (hasDependent) input.addEventListener('change', () => updateConditionalFields(calc));
    });
    
    updateConditionalFields(calc);
    document.getElementById('calc-btn').addEventListener('click', executeCalculation);
    document.getElementById('legal-info').textContent = calc.legalInfo;
    document.getElementById('main-result').textContent = 'S/ 0.00';
    document.getElementById('result-details').innerHTML = '';
}

function updateConditionalFields(calc) {
    calc.fields.forEach(field => {
        if (field.dependsOn) {
            const parentInput = document.getElementById(field.dependsOn);
            const fieldGroup = document.querySelector(`[data-depends-on="${field.dependsOn}"][data-show-when="${field.showWhen}"]`);
            if (parentInput && fieldGroup) {
                if (parentInput.value === field.showWhen) {
                    fieldGroup.classList.remove('hidden');
                } else {
                    fieldGroup.classList.add('hidden');
                }
            }
        }
    });
}

function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    const regimen = REGIMENES_PERU[state.currentRegimen];
    const values = {};
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        values[field.id] = input.value;
    });
    const result = calc.calculate(values, regimen);
    state.lastResult = { result, calc, regimen, values };
    displayResult(result);
}

function displayResult(result) {
    const mainResult = document.getElementById('main-result');
    const detailsContainer = document.getElementById('result-details');
    mainResult.textContent = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    detailsContainer.innerHTML = result.details.map(detail => {
        let colorClass = 'text-white', styleClass = '';
        if (detail.type === 'header') return `<div class="pt-3 pb-2 font-bold text-indigo-300 text-xs uppercase tracking-wider border-b border-indigo-500/30">${detail.label}</div>`;
        if (detail.type === 'separator') return `<div class="h-2"></div>`;
        if (detail.type === 'ingreso') colorClass = 'text-emerald-400';
        if (detail.type === 'descuento') colorClass = 'text-red-400';
        if (detail.type === 'costo') colorClass = 'text-amber-400';
        if (detail.type === 'subtotal') {
            colorClass = 'text-indigo-400 font-bold text-base';
            styleClass = 'bg-indigo-950/30 rounded-lg px-2';
        }
        if (detail.type === 'warning') colorClass = 'text-amber-500';
        if (detail.type === 'info') colorClass = 'text-slate-400';
        if (detail.type === 'base') colorClass = 'text-white font-semibold';
        return `<div class="flex justify-between items-center py-2 border-b border-white/10 last:border-0 ${styleClass}"><span class="text-sm opacity-90">${detail.label}</span><span class="font-bold ${colorClass}">${detail.value}</span></div>`;
    }).join('');
}

function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary').value) || 0;
    const tieneHijos = document.getElementById('tc-hijos').value === 'si';
    const regimen = REGIMENES_PERU[state.currentRegimen];
    
    if (salary === 0 || salary < PERU_DATA.minWage) {
        alert(`Por favor ingresa un sueldo válido (mínimo S/ ${PERU_DATA.minWage})`);
        return;
    }
    
    const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
    const costoCalc = calcularCostoEmpleador(salary, asigFamiliar, regimen, { aplicaSenati: false, tieneEPS: false, nivelRiesgo: 'medio' });
    const afpCalc = calcularAFP(salary, 'prima', 'flujo', 0);
    const sueldoBruto = salary + asigFamiliar;
    const imp5ta = calcularImpuesto5ta(sueldoBruto, 0);
    const netoEmpleado = sueldoBruto - afpCalc.total - imp5ta.impuestoMensual;
    
    document.getElementById('tc-total-cost').textContent = `S/ ${costoCalc.costoTotal.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`;
    document.getElementById('tc-net-salary').textContent = `S/ ${netoEmpleado.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`;
    
    document.getElementById('tc-breakdown').innerHTML = `
        <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Sueldo Bruto</span><span class="font-bold text-white">S/ ${costoCalc.sueldoBruto.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
        <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Cargas Directas</span><span class="font-bold text-red-400">+S/ ${costoCalc.cargasDirectas.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
        <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Provisión Beneficios</span><span class="font-bold text-amber-400">+S/ ${costoCalc.provisionesBeneficios.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
        <div class="flex justify-between py-2 border-t-2 border-indigo-500/30 mt-2 pt-3"><span class="text-indigo-300 font-bold">Carga Social</span><span class="font-bold text-indigo-400">${costoCalc.porcentajeCarga.toFixed(1)}%</span></div>
    `;
    renderTrueCostChart(salary, costoCalc.costoTotal, netoEmpleado);
}

function renderTrueCostChart(salary, costoTotal, netoEmpleado) {
    const ctx = document.getElementById('tc-chart');
    if (state.charts.trueCost) state.charts.trueCost.destroy();
    const cargas = costoTotal - salary;
    const descuentos = salary - netoEmpleado;
    state.charts.trueCost = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Sueldo Neto Empleado', 'Descuentos Empleado', 'Cargas Empleador'],
            datasets: [{ data: [netoEmpleado, descuentos, cargas], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 15, font: { size: 12, weight: 'bold' } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: S/ ${value.toLocaleString('es-PE')} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function calculateComparison() {
    const salary = parseFloat(document.getElementById('comp-salary').value) || 0;
    const tieneHijos = document.getElementById('comp-hijos').value === 'si';
    
    if (salary === 0 || salary < PERU_DATA.minWage) {
        alert(`Por favor ingresa un sueldo válido (mínimo S/ ${PERU_DATA.minWage})`);
        return;
    }
    
    const asigFamiliar = tieneHijos ? calcularAsignacionFamiliar() : 0;
    const resultados = {};
    Object.values(REGIMENES_PERU).forEach(regimen => {
        resultados[regimen.id] = calcularCostoEmpleador(salary, asigFamiliar, regimen, { aplicaSenati: false, tieneEPS: false, nivelRiesgo: 'medio' });
    });
    displayComparison(resultados, salary);
}

function displayComparison(resultados, salary) {
    const container = document.getElementById('comp-results');
    const html = Object.entries(resultados).map(([regimenId, costoCalc]) => {
        const regimen = REGIMENES_PERU[regimenId];
        const costoMensual = costoCalc.costoTotal;
        const costoAnual = costoMensual * 12;
        const ahorroVsGeneral = regimenId !== 'general' ? resultados.general.costoTotal - costoMensual : 0;
        return `
            <div class="bg-slate-850 rounded-2xl p-6 border-2 ${regimenId === 'general' ? 'border-indigo-500' : 'border-slate-700'}">
                <div class="flex items-center gap-3 mb-4">
                    <div class="text-3xl">${regimen.icon}</div>
                    <div><h4 class="font-bold text-lg text-white">${regimen.nombre}</h4><p class="text-xs text-slate-400">${regimen.descripcion}</p></div>
                </div>
                <div class="space-y-3 mb-4">
                    <div class="bg-indigo-950/30 rounded-xl p-4"><div class="text-xs text-slate-400 mb-1">Costo Mensual</div><div class="text-2xl font-black text-indigo-400">S/ ${costoMensual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</div></div>
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-slate-900 rounded-xl p-3"><div class="text-xs text-slate-500 mb-1">Anual</div><div class="text-sm font-bold text-white">S/ ${costoAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</div></div>
                        <div class="bg-slate-900 rounded-xl p-3"><div class="text-xs text-slate-500 mb-1">Carga</div><div class="text-sm font-bold text-amber-400">${costoCalc.porcentajeCarga.toFixed(1)}%</div></div>
                        <div class="bg-slate-900 rounded-xl p-3"><div class="text-xs text-slate-500 mb-1">${ahorroVsGeneral > 0 ? 'Ahorro' : 'Dif.'}</div><div class="text-sm font-bold ${ahorroVsGeneral > 0 ? 'text-emerald-400' : 'text-slate-400'}">${ahorroVsGeneral > 0 ? '-' : ''}S/ ${Math.abs(ahorroVsGeneral).toLocaleString('es-PE', { minimumFractionDigits: 0 })}</div></div>
                    </div>
                </div>
                <div class="border-t border-slate-700 pt-3"><div class="text-xs text-slate-500 mb-2">Beneficios Incluidos:</div><div class="flex flex-wrap gap-2">
                    ${regimen.beneficios.gratificaciones ? `<span class="px-2 py-1 bg-emerald-900/30 text-emerald-400 rounded text-xs">Gratif. ${(regimen.beneficios.gratificacionesFactor * 100)}%</span>` : ''}
                    ${regimen.beneficios.cts ? `<span class="px-2 py-1 bg-blue-900/30 text-blue-400 rounded text-xs">CTS ${(regimen.beneficios.ctsFactor * 100)}%</span>` : ''}
                    <span class="px-2 py-1 bg-purple-900/30 text-purple-400 rounded text-xs">Vac. ${regimen.beneficios.vacaciones}d</span>
                    ${regimen.beneficios.asignacionFamiliar ? `<span class="px-2 py-1 bg-amber-900/30 text-amber-400 rounded text-xs">Asig. Fam.</span>` : ''}
                </div></div>
            </div>
        `;
    }).join('');
    container.innerHTML = html;
    renderComparisonChart(resultados);
}

function renderComparisonChart(resultados) {
    const ctx = document.getElementById('comp-chart');
    if (state.charts.comparison) state.charts.comparison.destroy();
    const labels = Object.values(REGIMENES_PERU).map(r => r.nombre);
    const data = Object.values(resultados).map(r => r.costoTotal);
    state.charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels, datasets: [{ label: 'Costo Total Mensual (S/)', data: data, backgroundColor: ['#6366f1', '#10b981', '#f59e0b'], borderWidth: 0 }] },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: { beginAtZero: true, ticks: { color: '#94a3b8', callback: function(value) { return 'S/ ' + value.toLocaleString('es-PE'); } }, grid: { color: 'rgba(51, 65, 85, 0.3)' } },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            },
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(context) { return 'Costo: S/ ' + context.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 }); } } } }
        }
    });
}

function calculateStrategicComparison() {
    const salary = parseFloat(document.getElementById('strategic-salary').value) || 0;
    const tieneHijos = document.getElementById('strategic-hijos').value === 'si';
    
    if (salary === 0 || salary < PERU_DATA.minWage) {
        alert(`Por favor ingresa un sueldo válido (mínimo S/ ${PERU_DATA.minWage})`);
        return;
    }
    
    const asigFamiliar = tieneHijos ? calcularAsignacionFamiliar() : 0;
    const comparacion = {};
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const costoCalc = calcularCostoEmpleador(salary, asigFamiliar, regimen, { aplicaSenati: false, tieneEPS: false, nivelRiesgo: 'medio' });
        comparacion[regimen.id] = { regimen, costoMensual: costoCalc.costoTotal, costoAnual: costoCalc.costoTotal * 12, carga: costoCalc.porcentajeCarga };
    });
    displayStrategicComparison(comparacion, salary);
}

function displayStrategicComparison(comparacion, salary) {
    const container = document.getElementById('strategic-results');
    const baseGeneral = comparacion.general.costoMensual;
    
    const mobilecards = Object.values(comparacion).map(data => {
        const ahorro = baseGeneral - data.costoMensual;
        const ahorroAnual = ahorro * 12;
        return `
            <div class="bg-slate-900 rounded-xl p-4 border-2 ${data.regimen.id === 'general' ? 'border-indigo-500' : 'border-slate-700'}">
                <div class="flex items-center gap-3 mb-4"><span class="text-3xl">${data.regimen.icon}</span><div class="flex-1"><h4 class="font-bold text-white">${data.regimen.nombre}</h4><p class="text-xs text-slate-400">${data.regimen.descripcion}</p></div></div>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Costo Mensual</span><span class="font-bold text-white">S/ ${data.costoMensual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
                    <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Costo Anual</span><span class="font-bold text-white">S/ ${data.costoAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
                    <div class="flex justify-between py-2 border-b border-slate-700"><span class="text-slate-400">Carga Social</span><span class="font-bold text-amber-400">${data.carga.toFixed(1)}%</span></div>
                    <div class="flex justify-between py-2"><span class="text-slate-400">Ahorro Anual</span><span class="font-bold ${ahorroAnual > 0 ? 'text-emerald-400' : 'text-slate-400'}">${ahorroAnual > 0 ? '-' : ''}S/ ${Math.abs(ahorroAnual).toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span></div>
                </div>
            </div>
        `;
    }).join('');
    
    const desktopTable = Object.values(comparacion).map(data => {
        const ahorro = baseGeneral - data.costoMensual;
        const ahorroAnual = ahorro * 12;
        return `
            <tr class="border-b border-slate-800 hover:bg-slate-800/50 transition">
                <td class="py-4 px-4"><div class="flex items-center gap-3"><span class="text-2xl">${data.regimen.icon}</span><div><div class="font-bold text-white">${data.regimen.nombre}</div><div class="text-xs text-slate-500">${data.regimen.descripcion}</div></div></div></td>
                <td class="py-4 px-4 text-right font-bold text-white">S/ ${data.costoMensual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</td>
                <td class="py-4 px-4 text-right font-bold text-white">S/ ${data.costoAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</td>
                <td class="py-4 px-4 text-right font-bold text-amber-400">${data.carga.toFixed(1)}%</td>
                <td class="py-4 px-4 text-right font-bold ${ahorroAnual > 0 ? 'text-emerald-400' : 'text-slate-400'}">${ahorroAnual > 0 ? '-' : ''}S/ ${Math.abs(ahorroAnual).toLocaleString('es-PE', { minimumFractionDigits: 0 })}</td>
            </tr>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800 overflow-x-auto">
            <h3 class="text-xl font-black mb-6 text-white">Análisis Comparativo Estratégico</h3>
            <div class="block lg:hidden space-y-4">${mobilecards}</div>
            <div class="hidden lg:block"><table class="w-full"><thead><tr class="border-b border-slate-700"><th class="text-left py-4 px-4 text-sm font-black text-indigo-400">RÉGIMEN</th><th class="text-right py-4 px-4 text-sm font-black text-indigo-400">MENSUAL</th><th class="text-right py-4 px-4 text-sm font-black text-indigo-400">ANUAL</th><th class="text-right py-4 px-4 text-sm font-black text-indigo-400">CARGA %</th><th class="text-right py-4 px-4 text-sm font-black text-indigo-400">AHORRO AÑO</th></tr></thead><tbody>${desktopTable}</tbody></table></div>
            <div class="mt-6 p-4 bg-indigo-950/30 rounded-xl border border-indigo-800/50"><div class="text-xs text-indigo-300 mb-2 font-bold">💡 INSIGHT ESTRATÉGICO</div><p class="text-sm text-slate-300">${comparacion.pequena.costoMensual < comparacion.general.costoMensual ? `La Pequeña Empresa genera un ahorro de <strong class="text-emerald-400">S/ ${(baseGeneral - comparacion.pequena.costoMensual).toLocaleString('es-PE', { minimumFractionDigits: 0 })}</strong> mensual vs Régimen General.` : 'El Régimen General ofrece más beneficios pero con mayor costo laboral.'}</p></div>
        </div>
    `;
    syncToLiquidezForce({ costoMensual: comparacion.general.costoMensual, tipo: 'costo_empleador_comparativo', regimen: 'general', fecha: new Date().toISOString() });
}

function exportPDF() {
    if (!state.lastResult) { alert('⚠️ Primero realiza un cálculo antes de exportar el PDF'); return; }
    const { result, calc, regimen } = state.lastResult;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const cleanText = (text) => text.replace(/S\//g, 'S/').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n').replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I').replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ñ/g, 'N').replace(/[^\x00-\x7F]/g, '');
    
    doc.setFillColor(67, 56, 202);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText('SUELDOPRO PERU 2026'), 105, 22, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(cleanText('Calculadora Laboral Profesional'), 105, 30, { align: 'center' });
    doc.text(cleanText('Pentagono Financiero'), 105, 36, { align: 'center' });
    
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 50, 210, 12, 'F');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    const fechaStr = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(cleanText(`Fecha: ${fechaStr}`), 15, 57);
    doc.text(cleanText(`Regimen: ${regimen.nombre}`), 150, 57);
    
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.line(15, 67, 195, 67);
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText(`${calc.title}`), 15, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 116, 139);
    const descLines = doc.splitTextToSize(cleanText(calc.description), 180);
    doc.text(descLines, 15, 88);
    
    doc.setFillColor(238, 242, 255);
    doc.roundedRect(15, 100, 180, 35, 4, 4, 'F');
    doc.setDrawColor(165, 180, 252);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, 100, 180, 35, 4, 4, 'S');
    doc.setTextColor(67, 56, 202);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText('RESULTADO TOTAL'), 105, 112, { align: 'center' });
    doc.setFontSize(24);
    doc.setTextColor(30, 41, 59);
    const resultText = cleanText(`S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`);
    doc.text(resultText, 105, 126, { align: 'center' });
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText('Desglose Detallado'), 15, 148);
    
    let yPos = 158;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    result.details.forEach((detail) => {
        if (detail.type === 'header') {
            yPos += 5;
            doc.setFont(undefined, 'bold');
            doc.setTextColor(67, 56, 202);
            doc.text(cleanText(detail.label), 20, yPos);
            doc.setFont(undefined, 'normal');
            yPos += 7;
        } else if (detail.type !== 'separator') {
            doc.setTextColor(71, 85, 105);
            doc.text(cleanText(detail.label), 25, yPos);
            doc.setTextColor(30, 41, 59);
            doc.setFont(undefined, 'bold');
            doc.text(cleanText(detail.value), 175, yPos, { align: 'right' });
            doc.line(25, yPos + 2, 185, yPos + 2);
            doc.setFont(undefined, 'normal');
            yPos += 8;
            if (yPos > 270) { doc.addPage(); yPos = 20; }
        }
    });
    
    yPos += 10;
    if (yPos > 250) { doc.addPage(); yPos = 20; }
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(15, yPos, 180, 6, 2, 2, 'F');
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(146, 64, 14);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText('BASE LEGAL'), 20, yPos);
    yPos += 6;
    doc.setFont(undefined, 'normal');
    doc.setTextColor(120, 113, 108);
    const legalLines = doc.splitTextToSize(cleanText(calc.legalInfo), 170);
    doc.text(legalLines, 20, yPos);
    
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 280, 210, 17, 'F');
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.text(cleanText('(c) 2026 SueldoPro Ultra Peru - Pentagono Financiero'), 105, 289, { align: 'center' });
        doc.text(`Pagina ${i} de ${pageCount}`, 195, 289, { align: 'right' });
    }
    
    const filename = cleanText(`SueldoPro_${calc.id}_${regimen.id}_${Date.now()}.pdf`);
    doc.save(filename);
    setTimeout(() => alert(cleanText(`Exportacion exitosa!\n\nArchivo: ${filename}\n\nResultado: ${resultText}\nRegimen: ${regimen.nombre}`)), 300);
}

function saveCalculation() {
    if (!state.lastResult) { alert('⚠️ Primero realiza un cálculo antes de guardarlo'); return; }
    const { result, calc, regimen } = state.lastResult;
    const resultText = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    const savedCalc = { id: Date.now(), calculator: calc.title, regimen: `${regimen.icon} ${regimen.nombre}`, result: resultText, date: new Date().toLocaleDateString('es-PE'), time: new Date().toLocaleTimeString('es-PE') };
    state.savedCalculations.unshift(savedCalc);
    if (state.savedCalculations.length > 10) state.savedCalculations = state.savedCalculations.slice(0, 10);
    localStorage.setItem('sueldopro_saved_calcs', JSON.stringify(state.savedCalculations));
    alert(`💾 Cálculo guardado!\n\n${calc.icon} ${calc.title}\n${resultText}\n${regimen.nombre}\n\n📊 Total guardados: ${state.savedCalculations.length}/10`);
}

function shareResult() {
    if (!state.lastResult) { alert('⚠️ Primero realiza un cálculo antes de compartir'); return; }
    const { result, calc, regimen } = state.lastResult;
    const resultText = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    const text = `${calc.icon} ${calc.title}\n🏢 Régimen: ${regimen.nombre}\n\n💰 Resultado: ${resultText}\n\n✅ Calculado con SueldoPro Ultra Perú 2026\n🇵🇪 100% Legislación Peruana\n🌎 sueldopro-2026.vercel.app`;
    if (navigator.share) navigator.share({ title: 'SueldoPro Ultra Perú - Pentágono Financiero', text: text, url: window.location.href }).catch(() => {});
    else if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => alert('✅ Resultado copiado al portapapeles!\n\n' + text));
    else alert('📋 Copia este resultado:\n\n' + text);
}

function syncToLiquidezForce(data) {
    try {
        const bridgeData = { app: 'sueldopro_peru', timestamp: new Date().toISOString(), data: data };
        localStorage.setItem('pentagon_bridge_sueldopro', JSON.stringify(bridgeData));
        console.log('✅ Sincronizado con Liquidez Force:', bridgeData);
    } catch (error) { console.warn('⚠️ Error sincronizando con Pentágono:', error); }
}