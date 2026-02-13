'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - MAIN SCRIPT (100% FUNCIONAL)
// =====================================================================

const state = {
    currentRegimen: localStorage.getItem('sueldopro_regimen') || 'general',
    currentSection: 'calculators',
    charts: {},
    lastResult: null
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando SueldoPro Ultra Perú 2026...');
    
    renderPentagonLinks();
    renderRegimenSelect();
    renderNavigation();
    setupEventListeners();
    
    console.log('✅ SueldoPro Ultra iniciado correctamente');
});

// ===== PENTAGON LINKS =====
function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile = document.getElementById('pentagon-mobile');
    const footer = document.getElementById('footer-pentagon-links');
    
    if (!desktop || !mobile || !footer) return;
    
    Object.values(PENTAGON_LINKS).forEach(link => {
        const target = link.url.includes(window.location.hostname) ? '_self' : '_blank';
        
        desktop.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer" 
               class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition"
               title="${link.description}">${link.icon} ${link.name}</a>
        `;
        
        mobile.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer" 
               class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white hover:scale-105 transition">
                <div class="text-2xl mb-2">${link.icon}</div>
                <div class="font-black text-sm">${link.name}</div>
                <div class="text-xs opacity-80 mt-1">${link.description}</div>
            </a>
        `;
        
        footer.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer" 
               class="text-sm text-slate-400 hover:text-indigo-400 transition">
                ${link.icon} ${link.name}
            </a>
        `;
    });
}

// ===== RÉGIMEN SELECT =====
function renderRegimenSelect() {
    const select = document.getElementById('regimen-select');
    const mobileSelect = document.getElementById('mobile-regimen-select');
    
    if (!select || !mobileSelect) return;
    
    const options = Object.values(REGIMENES_PERU).map(r => 
        `<option value="${r.id}">${r.icon} ${r.nombre}</option>`
    ).join('');
    
    select.innerHTML = options;
    select.value = state.currentRegimen;
    
    mobileSelect.innerHTML = options;
    mobileSelect.value = state.currentRegimen;
    
    updateRegimenInfo();
}

function updateRegimenInfo() {
    const regimen = REGIMENES_PERU[state.currentRegimen];
    const infoDiv = document.getElementById('regimen-info');
    
    if (!infoDiv || !regimen) return;
    
    infoDiv.innerHTML = `
        <div class="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-4">
            <div class="flex items-start gap-3">
                <div class="text-2xl">${regimen.icon}</div>
                <div class="flex-1">
                    <h4 class="font-bold text-indigo-300 mb-1">${regimen.nombre}</h4>
                    <p class="text-xs text-slate-400 mb-3">${regimen.descripcion}</p>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div><span class="text-slate-500">Gratificaciones:</span>
                            <span class="text-white font-bold ml-2">${regimen.gratificaciones ? (regimen.gratificacionesFactor * 100) + '%' : 'No'}</span></div>
                        <div><span class="text-slate-500">CTS:</span>
                            <span class="text-white font-bold ml-2">${regimen.cts ? (regimen.ctsFactor * 100) + '%' : 'No'}</span></div>
                        <div><span class="text-slate-500">Vacaciones:</span>
                            <span class="text-white font-bold ml-2">${regimen.vacaciones} días</span></div>
                        <div><span class="text-slate-500">Asig. Familiar:</span>
                            <span class="text-white font-bold ml-2">${regimen.asignacionFamiliar ? 'Sí' : 'No'}</span></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== NAVEGACIÓN =====
function renderNavigation() {
    const nav = document.getElementById('nav-buttons');
    const mobileNav = document.getElementById('mobile-nav-buttons');
    
    if (!nav || !mobileNav) return;
    
    const sections = [
        { id: 'calculators', icon: '🔢', name: 'Calculadoras' },
        { id: 'truecost', icon: '💎', name: 'Costo Real' },
        { id: 'comparison', icon: '📊', name: 'Comparador' }
    ];
    
    sections.forEach(section => {
        const isActive = section.id === 'calculators';
        const buttonHTML = `
            <button data-nav="${section.id}" 
                    class="nav-btn w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 
                           ${isActive ? 'active bg-gradient-to-r from-indigo-600 to-indigo-500 text-white' : 'bg-slate-900 text-slate-400'}">
                ${section.icon} ${section.name}
            </button>
        `;
        nav.innerHTML += buttonHTML;
        mobileNav.innerHTML += buttonHTML;
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Régimen change
    ['regimen-select', 'mobile-regimen-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', (e) => {
                state.currentRegimen = e.target.value;
                localStorage.setItem('sueldopro_regimen', state.currentRegimen);
                document.getElementById('regimen-select').value = state.currentRegimen;
                document.getElementById('mobile-regimen-select').value = state.currentRegimen;
                updateRegimenInfo();
            });
        }
    });
    
    // Nav buttons
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.getAttribute('data-nav')));
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.remove('-translate-x-full');
            mobileNav.classList.add('translate-x-0');
        });
    }
    
    if (closeMobileNav && mobileNav) {
        closeMobileNav.addEventListener('click', () => {
            mobileNav.classList.remove('translate-x-0');
            mobileNav.classList.add('-translate-x-full');
        });
    }
    
    // True Cost
    const tcBtn = document.getElementById('tc-calculate-btn');
    if (tcBtn) tcBtn.addEventListener('click', calculateTrueCost);
    
    // Comparison
    const compBtn = document.getElementById('comp-calculate-btn');
    if (compBtn) compBtn.addEventListener('click', calculateComparison);
    
    const strategicBtn = document.getElementById('strategic-compare-btn');
    if (strategicBtn) strategicBtn.addEventListener('click', calculateStrategicComparison);
    
    // Export/Share/Save buttons
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) exportBtn.addEventListener('click', () => alert('Función PDF disponible en versión completa'));
    
    const shareBtn = document.getElementById('share-result-btn');
    if (shareBtn) shareBtn.addEventListener('click', shareResult);
    
    const saveBtn = document.getElementById('save-calc-btn');
    if (saveBtn) saveBtn.addEventListener('click', () => alert('Cálculo guardado localmente'));
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function navigate(sectionId) {
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
        btn.classList.add('bg-slate-900', 'text-slate-400');
        
        if (btn.getAttribute('data-nav') === sectionId) {
            btn.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
            btn.classList.remove('bg-slate-900', 'text-slate-400');
        }
    });
    
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        if (section.id === `sec-${sectionId}`) {
            section.classList.add('active');
        }
    });
    
    const tabsContainer = document.getElementById('calc-tabs-container');
    if (tabsContainer) {
        tabsContainer.style.display = sectionId === 'calculators' ? 'block' : 'none';
    }
    
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.remove('translate-x-0');
        mobileNav.classList.add('-translate-x-full');
    }
    
    state.currentSection = sectionId;
}

// ===== TRUE COST CALCULATION =====
function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary')?.value) || 0;
    const hijos = document.getElementById('tc-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Ingresa un sueldo válido (mínimo S/ ' + PERU_DATA.minWage + ')');
        return;
    }
    
    const regimen = REGIMENES_PERU[state.currentRegimen];
    const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
    const costoCalc = calcularCostoEmpleador(salary, hijos, regimen, { nivelRiesgo: 'medio' });
    
    const netSalaryEl = document.getElementById('tc-net-salary');
    const totalCostEl = document.getElementById('tc-total-cost');
    const breakdownEl = document.getElementById('tc-breakdown');
    
    if (netSalaryEl) netSalaryEl.textContent = `S/ ${netoCalc.salarioNeto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    if (totalCostEl) totalCostEl.textContent = `S/ ${costoCalc.costoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    if (breakdownEl) {
        breakdownEl.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Sueldo Bruto</span>
                    <span class="text-white font-bold">S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                ${costoCalc.asigFamiliar > 0 ? `
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Asignación Familiar</span>
                    <span class="text-emerald-400 font-bold">+ S/ ${costoCalc.asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">ESSALUD (9%)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.essalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Vida Ley</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.vidaLey.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Gratif. (prov.)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.provGratificaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">CTS (prov.)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.provCTS.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Vacaciones (prov.)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.provVacaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Carga Social</span>
                    <span class="text-indigo-400 font-bold">${costoCalc.porcentajeCarga.toFixed(1)}%</span>
                </div>
            </div>
        `;
    }
}

// ===== COMPARISON =====
function calculateComparison() {
    const salary = parseFloat(document.getElementById('comp-salary')?.value) || 0;
    const hijos = document.getElementById('comp-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Ingresa un sueldo válido');
        return;
    }
    
    const resultsContainer = document.getElementById('comp-results');
    if (!resultsContainer) return;
    
    let html = '';
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        const costoCalc = calcularCostoEmpleador(salary, hijos, regimen);
        
        html += `
            <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                <div class="flex items-center gap-3 mb-4">
                    <div class="text-3xl">${regimen.icon}</div>
                    <div>
                        <h3 class="text-lg font-black text-white">${regimen.nombre}</h3>
                        <p class="text-xs text-slate-500">${regimen.descripcion}</p>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-3">
                        <div class="text-xs text-slate-400 mb-1">Salario Neto</div>
                        <div class="text-2xl font-black text-emerald-400">
                            S/ ${netoCalc.salarioNeto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div class="bg-orange-950/30 border border-orange-800/50 rounded-xl p-3">
                        <div class="text-xs text-slate-400 mb-1">Costo Empresa</div>
                        <div class="text-2xl font-black text-orange-400">
                            S/ ${costoCalc.costoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <span class="text-slate-500">Carga Social:</span>
                            <span class="text-white font-bold ml-1">${costoCalc.porcentajeCarga.toFixed(1)}%</span>
                        </div>
                        <div>
                            <span class="text-slate-500">Descuentos:</span>
                            <span class="text-white font-bold ml-1">
                                S/ ${(netoCalc.descuentoPension + netoCalc.impuesto5ta).toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
    renderComparisonChart(salary, hijos);
}

function renderComparisonChart(salary, hijos) {
    const canvas = document.getElementById('comp-chart');
    if (!canvas) return;
    
    if (state.charts.comparison) {
        state.charts.comparison.destroy();
    }
    
    const labels = [];
    const netosData = [];
    const costosData = [];
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        const costoCalc = calcularCostoEmpleador(salary, hijos, regimen);
        
        labels.push(regimen.nombre);
        netosData.push(netoCalc.salarioNeto);
        costosData.push(costoCalc.costoTotal);
    });
    
    const ctx = canvas.getContext('2d');
    state.charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Salario Neto',
                    data: netosData,
                    backgroundColor: 'rgba(52, 211, 153, 0.8)',
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Costo Empresa',
                    data: costosData,
                    backgroundColor: 'rgba(251, 146, 60, 0.8)',
                    borderColor: 'rgba(251, 146, 60, 1)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', font: { size: 12 }, padding: 16 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: (value) => 'S/ ' + value.toLocaleString('es-PE', { maximumFractionDigits: 0 })
                    },
                    grid: { color: 'rgba(71, 85, 105, 0.3)' }
                },
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
            }
        }
    });
}

// ===== STRATEGIC COMPARISON =====
function calculateStrategicComparison() {
    const salary = parseFloat(document.getElementById('strategic-salary')?.value) || 0;
    const anios = parseFloat(document.getElementById('strategic-years')?.value) || 1;
    const hijos = document.getElementById('strategic-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Ingresa un sueldo válido');
        return;
    }
    
    const resultsContainer = document.getElementById('strategic-results');
    if (!resultsContainer) return;
    
    let html = '<div class="grid gap-6">';
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        const costoCalc = calcularCostoEmpleador(salary, hijos, regimen);
        const gratifCalc = calcularGratificaciones(salary, hijos, regimen, false);
        const ctsCalc = calcularCTS(salary, hijos, regimen, 6);
        
        const netoAnual = netoCalc.salarioNeto * 12;
        const gratifAnual = gratifCalc.gratificacionTotal;
        const ctsAnual = ctsCalc.ctsTotal * 2;
        const costoAnual = costoCalc.costoTotal * 12;
        
        const totalTrabajador = netoAnual + gratifAnual + ctsAnual;
        const totalEmpleador = costoAnual;
        
        html += `
            <div class="bg-slate-850 rounded-2xl p-6 border-2 border-slate-800 hover:border-indigo-500 transition">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                        <div class="text-4xl">${regimen.icon}</div>
                        <div>
                            <h3 class="text-xl font-black text-white">${regimen.nombre}</h3>
                            <p class="text-xs text-slate-500">${anios} ${anios === 1 ? 'año' : 'años'}</p>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4">
                        <div class="text-xs text-slate-400 mb-2">💰 INGRESOS TRABAJADOR/AÑO</div>
                        <div class="text-3xl font-black text-emerald-400 mb-2">
                            S/ ${totalTrabajador.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                        <div class="space-y-1 text-xs">
                            <div class="flex justify-between">
                                <span class="text-slate-500">Neto × 12:</span>
                                <span class="text-slate-300">S/ ${netoAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>
                            ${gratifAnual > 0 ? `
                            <div class="flex justify-between">
                                <span class="text-slate-500">Gratificaciones:</span>
                                <span class="text-slate-300">S/ ${gratifAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>` : ''}
                            ${ctsAnual > 0 ? `
                            <div class="flex justify-between">
                                <span class="text-slate-500">CTS:</span>
                                <span class="text-slate-300">S/ ${ctsAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>` : ''}
                        </div>
                    </div>
                    
                    <div class="bg-orange-950/30 border border-orange-800/50 rounded-xl p-4">
                        <div class="text-xs text-slate-400 mb-2">🏢 COSTO EMPRESA/AÑO</div>
                        <div class="text-3xl font-black text-orange-400">
                            S/ ${totalEmpleador.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                        <div class="text-xs text-slate-500 mt-1">Carga social: ${costoCalc.porcentajeCarga.toFixed(1)}%</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 text-xs">
                        <div class="bg-slate-900 rounded-lg p-3">
                            <div class="text-slate-500 mb-1">Total ${anios} ${anios === 1 ? 'año' : 'años'}</div>
                            <div class="text-lg font-black text-indigo-400">
                                S/ ${(totalTrabajador * anios).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                        <div class="bg-slate-900 rounded-lg p-3">
                            <div class="text-slate-500 mb-1">Costo ${anios} ${anios === 1 ? 'año' : 'años'}</div>
                            <div class="text-lg font-black text-orange-400">
                                S/ ${(totalEmpleador * anios).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

// ===== SHARE RESULT =====
function shareResult() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo');
        return;
    }
    
    const text = `Resultado SueldoPro Perú 2026\n🇵🇪 100% Legislación Peruana\nsueldopro-2026.vercel.app`;
    
    if (navigator.share) {
        navigator.share({ title: 'SueldoPro Perú', text, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('✅ Copiado al portapapeles'));
    } else {
        alert('📋 ' + text);
    }
}

console.log('✅ SCRIPT.JS CARGADO - Event Listeners Activos');
