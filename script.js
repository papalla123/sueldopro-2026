'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - MAIN APPLICATION SCRIPT (REFACTORED)
// Pentágono Financiero - Motor de Interfaz y Lógica
// =====================================================================

// ===== ESTADO GLOBAL DE LA APLICACIÓN =====
const state = {
    currentCalculator: 'neto',
    currentSection: 'calculators',
    currentRegimen: localStorage.getItem('sueldopro_regimen') || 'general',
    charts: {},
    savedCalculations: JSON.parse(localStorage.getItem('sueldopro_saved_calcs') || '[]'),
    lastResult: null,
    formValues: {}
};

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando SueldoPro Ultra Perú 2026 (REFACTORED)...');
    
    // Renderizar componentes principales
    renderPentagonLinks();
    renderRegimenSelect();
    renderNavigation();
    renderCalculatorTabs();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Seleccionar calculadora por defecto
    selectCalculator('neto');
    
    // Mostrar mensaje de bienvenida (solo primera vez)
    showWelcomeMessage();
    
    console.log('✅ SueldoPro Ultra Perú 2026 (REFACTORED) iniciado correctamente');
});

// ===== MENSAJE DE BIENVENIDA =====
function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('sueldopro_visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            const message = `¡Bienvenido a SueldoPro Ultra Perú! 🚀

Calculadora Laboral Peruana 2026 - REFACTORED

✅ 8 Calculadoras especializadas
✅ 3 Regímenes laborales (General, MYPE, Micro)
✅ Legislación peruana actualizada
✅ 100% Precisión legal garantizada
✅ Gráficos interactivos
✅ Exportar PDF Premium
✅ Guardar cálculos
✅ Pentágono Financiero conectado

🇵🇪 100% Perú - 100% Precisión

UIT 2026: S/ 5,150
RMV 2026: S/ 1,075
AF: S/ 107.50

🔧 MEJORAS CRÍTICAS:
✓ Base Remunerativa correcta (AF integrada)
✓ Horas Extra con "Regla Diaria"
✓ Renta 5ta con gratificaciones
✓ CTS con 1/6 gratificación
✓ Bonif. Extraordinaria 9% (6.75% EPS)`;
            
            alert(message);
            localStorage.setItem('sueldopro_visited', 'true');
        }, 1000);
    }
}

// ===== RENDERIZADO DE ENLACES DEL PENTÁGONO =====
function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile = document.getElementById('pentagon-mobile');
    const footer = document.getElementById('footer-pentagon-links');
    
    if (!desktop || !mobile || !footer) return;
    
    Object.values(PENTAGON_LINKS).forEach(link => {
        const isCurrentApp = link.url === window.location.href || 
                             link.url.includes(window.location.hostname);
        const target = isCurrentApp ? '_self' : '_blank';
        
        // Desktop
        desktop.innerHTML += `
            <a href="${link.url}" 
               target="${target}" 
               rel="noopener noreferrer" 
               class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition"
               title="${link.description}">
                ${link.icon} ${link.name}
            </a>
        `;
        
        // Mobile
        mobile.innerHTML += `
            <a href="${link.url}" 
               target="${target}" 
               rel="noopener noreferrer" 
               class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white hover:scale-105 transition">
                <div class="text-2xl mb-2">${link.icon}</div>
                <div class="font-black text-sm">${link.name}</div>
                <div class="text-xs opacity-80 mt-1">${link.description}</div>
            </a>
        `;
        
        // Footer
        footer.innerHTML += `
            <a href="${link.url}" 
               target="${target}" 
               rel="noopener noreferrer" 
               class="text-sm text-slate-400 hover:text-indigo-400 transition">
                ${link.icon} ${link.name}
            </a>
        `;
    });
}

// ===== RENDERIZADO DE SELECTOR DE RÉGIMEN =====
function renderRegimenSelect() {
    const select = document.getElementById('regimen-select');
    const mobileSelect = document.getElementById('mobile-regimen-select');
    
    if (!select || !mobileSelect) return;
    
    const options = Object.values(REGIMENES_PERU).map(regimen => 
        `<option value="${regimen.id}">${regimen.icon} ${regimen.nombre}</option>`
    ).join('');
    
    select.innerHTML = options;
    select.value = state.currentRegimen;
    
    mobileSelect.innerHTML = options;
    mobileSelect.value = state.currentRegimen;
    
    updateRegimenInfo();
}

// ===== ACTUALIZACIÓN DE INFORMACIÓN DEL RÉGIMEN =====
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
                        <div>
                            <span class="text-slate-500">Gratificaciones:</span>
                            <span class="text-white font-bold ml-2">
                                ${regimen.beneficios.gratificaciones 
                                    ? (regimen.beneficios.gratificacionesFactor * 100) + '%' 
                                    : 'No'}
                            </span>
                        </div>
                        <div>
                            <span class="text-slate-500">CTS:</span>
                            <span class="text-white font-bold ml-2">
                                ${regimen.beneficios.cts 
                                    ? (regimen.beneficios.ctsFactor * 100) + '%' 
                                    : 'No'}
                            </span>
                        </div>
                        <div>
                            <span class="text-slate-500">Vacaciones:</span>
                            <span class="text-white font-bold ml-2">${regimen.beneficios.vacaciones} días</span>
                        </div>
                        <div>
                            <span class="text-slate-500">Asig. Familiar:</span>
                            <span class="text-white font-bold ml-2">
                                ${regimen.beneficios.asignacionFamiliar ? 'Sí' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== RENDERIZADO DE NAVEGACIÓN PRINCIPAL =====
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
                           ${isActive ? 'active' : 'bg-slate-900 text-slate-400'}">
                ${section.icon} ${section.name}
            </button>
        `;
        nav.innerHTML += buttonHTML;
        mobileNav.innerHTML += buttonHTML;
    });
}

// ===== RENDERIZADO DE PESTAÑAS DE CALCULADORAS =====
function renderCalculatorTabs() {
    const tabs = document.getElementById('calc-tabs');
    const mobileSelect = document.getElementById('mobile-calc-select');
    
    if (!tabs || !mobileSelect) return;
    
    Object.values(CALCULATOR_CONFIGS).forEach(calc => {
        const isActive = calc.id === 'neto';
        
        // Desktop tabs
        tabs.innerHTML += `
            <button data-calc="${calc.id}" 
                    class="calc-tab w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 border-2 
                           ${isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 text-slate-400'}">
                ${calc.icon} ${calc.title.split(' - ')[0]}
            </button>
        `;
        
        // Mobile select
        mobileSelect.innerHTML += `<option value="${calc.id}">${calc.icon} ${calc.title}</option>`;
    });
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Cambio de régimen
    document.getElementById('regimen-select')?.addEventListener('change', (e) => {
        state.currentRegimen = e.target.value;
        localStorage.setItem('sueldopro_regimen', state.currentRegimen);
        document.getElementById('mobile-regimen-select').value = state.currentRegimen;
        updateRegimenInfo();
        
        // Recalcular si hay un resultado previo
        if (state.lastResult) {
            executeCalculation();
        }
    });
    
    document.getElementById('mobile-regimen-select')?.addEventListener('change', (e) => {
        state.currentRegimen = e.target.value;
        localStorage.setItem('sueldopro_regimen', state.currentRegimen);
        document.getElementById('regimen-select').value = state.currentRegimen;
        updateRegimenInfo();
        
        if (state.lastResult) {
            executeCalculation();
        }
    });
    
    // Navegación de secciones
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.getAttribute('data-nav');
            navigate(sectionId);
            
            // Cerrar menú móvil
            document.getElementById('mobile-nav')?.classList.remove('translate-x-0');
            document.getElementById('mobile-nav')?.classList.add('-translate-x-full');
        });
    });
    
    // Pestañas de calculadoras
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => {
            const calcId = btn.getAttribute('data-calc');
            selectCalculator(calcId);
        });
    });
    
    // Select móvil de calculadora
    document.getElementById('mobile-calc-select')?.addEventListener('change', (e) => {
        selectCalculator(e.target.value);
    });
    
    // Menú móvil
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
        document.getElementById('mobile-nav')?.classList.remove('-translate-x-full');
        document.getElementById('mobile-nav')?.classList.add('translate-x-0');
    });
    
    document.getElementById('close-mobile-nav')?.addEventListener('click', () => {
        document.getElementById('mobile-nav')?.classList.remove('translate-x-0');
        document.getElementById('mobile-nav')?.classList.add('-translate-x-full');
    });
    
    // Botón calcular
    document.getElementById('btn-calculate')?.addEventListener('click', executeCalculation);
    
    // Botón limpiar
    document.getElementById('btn-clear')?.addEventListener('click', () => {
        document.querySelectorAll('#calc-form input, #calc-form select').forEach(input => {
            if (input.type === 'number') {
                input.value = '';
            } else {
                input.selectedIndex = 0;
            }
        });
        document.getElementById('result-container')?.classList.add('hidden');
        state.lastResult = null;
    });
    
    // Botón guardar
    document.getElementById('btn-save')?.addEventListener('click', saveCalculation);
    
    // Botón compartir
    document.getElementById('btn-share')?.addEventListener('click', shareResult);
    
    // Botón exportar PDF
    document.getElementById('btn-export')?.addEventListener('click', exportPDF);
    
    // True Cost
    document.getElementById('btn-tc-calculate')?.addEventListener('click', calculateTrueCost);
    
    // Comparison
    document.getElementById('btn-compare')?.addEventListener('click', calculateComparison);
    document.getElementById('btn-strategic-compare')?.addEventListener('click', calculateStrategicComparison);
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function navigate(sectionId) {
    // Actualizar botones
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
        btn.classList.add('bg-slate-900', 'text-slate-400');
        
        if (btn.getAttribute('data-nav') === sectionId) {
            btn.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
            btn.classList.remove('bg-slate-900', 'text-slate-400');
        }
    });
    
    // Mostrar sección
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
        if (section.id === `sec-${sectionId}`) {
            section.classList.add('active');
        }
    });
    
    // Mostrar/ocultar tabs de calculadoras
    const tabsContainer = document.getElementById('calc-tabs-container');
    if (tabsContainer) {
        if (sectionId === 'calculators') {
            tabsContainer.classList.remove('hidden');
        } else {
            tabsContainer.classList.add('hidden');
        }
    }
    
    state.currentSection = sectionId;
}

// ===== SELECCIÓN DE CALCULADORA =====
function selectCalculator(calcId) {
    state.currentCalculator = calcId;
    
    // Actualizar tabs
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-500/10', 'text-white');
        btn.classList.add('border-slate-700', 'text-slate-400');
        
        if (btn.getAttribute('data-calc') === calcId) {
            btn.classList.add('border-indigo-500', 'bg-indigo-500/10', 'text-white');
            btn.classList.remove('border-slate-700', 'text-slate-400');
        }
    });
    
    // Actualizar select móvil
    const mobileSelect = document.getElementById('mobile-calc-select');
    if (mobileSelect) {
        mobileSelect.value = calcId;
    }
    
    // Renderizar formulario
    const calc = CALCULATOR_CONFIGS[calcId];
    if (calc) {
        renderCalculatorForm(calc);
    }
    
    // Ocultar resultado
    document.getElementById('result-container')?.classList.add('hidden');
    state.lastResult = null;
}

// ===== RENDERIZADO DE FORMULARIO DE CALCULADORA =====
function renderCalculatorForm(calc) {
    const form = document.getElementById('calc-form');
    const title = document.getElementById('calc-title');
    const desc = document.getElementById('calc-description');
    
    if (!form || !title || !desc) return;
    
    title.textContent = calc.title;
    desc.textContent = calc.description;
    
    let html = '';
    
    calc.fields.forEach(field => {
        const fieldId = field.id;
        const conditional = field.conditional ? `data-conditional-field="${field.conditional.field}" data-conditional-value="${field.conditional.value}"` : '';
        const isConditional = field.conditional ? 'hidden' : '';
        
        if (field.type === 'select') {
            html += `
                <div class="form-field ${isConditional}" ${conditional}>
                    <label class="block text-sm font-bold text-slate-300 mb-2">
                        ${field.label}
                    </label>
                    <select id="${fieldId}" 
                            class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-medium focus:border-indigo-500 focus:outline-none transition">
                        ${field.options.map(opt => 
                            `<option value="${opt.value}">${opt.label}</option>`
                        ).join('')}
                    </select>
                    ${field.help ? `<p class="mt-1 text-xs text-slate-500">${field.help}</p>` : ''}
                </div>
            `;
        } else {
            html += `
                <div class="form-field ${isConditional}" ${conditional}>
                    <label class="block text-sm font-bold text-slate-300 mb-2">
                        ${field.label}
                    </label>
                    <input type="${field.type}" 
                           id="${fieldId}" 
                           inputmode="${field.inputmode || 'text'}"
                           placeholder="${field.placeholder || ''}"
                           min="${field.min || ''}"
                           max="${field.max || ''}"
                           step="${field.step || ''}"
                           class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-medium focus:border-indigo-500 focus:outline-none transition">
                    ${field.help ? `<p class="mt-1 text-xs text-slate-500">${field.help}</p>` : ''}
                </div>
            `;
        }
    });
    
    form.innerHTML = html;
    
    // Setup conditional fields
    setupConditionalFields();
}

// ===== CONFIGURACIÓN DE CAMPOS CONDICIONALES =====
function setupConditionalFields() {
    document.querySelectorAll('[data-conditional-field]').forEach(conditionalField => {
        const targetFieldId = conditionalField.getAttribute('data-conditional-field');
        const targetValue = conditionalField.getAttribute('data-conditional-value');
        const targetField = document.getElementById(targetFieldId);
        
        if (targetField) {
            const checkCondition = () => {
                if (targetField.value === targetValue) {
                    conditionalField.classList.remove('hidden');
                } else {
                    conditionalField.classList.add('hidden');
                }
            };
            
            targetField.addEventListener('change', checkCondition);
            checkCondition();
        }
    });
}

// ===== EJECUCIÓN DE CÁLCULO =====
function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    if (!calc) return;
    
    const regimen = REGIMENES_PERU[state.currentRegimen];
    if (!regimen) return;
    
    // Recopilar valores del formulario
    const values = {};
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            values[field.id] = input.value;
        }
    });
    
    // Validar campos requeridos
    const requiredFields = calc.fields.filter(f => !f.conditional);
    const missingFields = requiredFields.filter(field => {
        const val = values[field.id];
        return !val || (field.type === 'number' && (isNaN(parseFloat(val)) || parseFloat(val) < (field.min || 0)));
    });
    
    if (missingFields.length > 0) {
        alert('⚠️ Por favor completa todos los campos requeridos con valores válidos');
        return;
    }
    
    // Ejecutar cálculo
    try {
        const result = calc.calculate(values, regimen);
        
        // Guardar resultado
        state.lastResult = { result, calc, regimen };
        state.formValues = values;
        
        // Renderizar resultado
        renderResult(result, calc, regimen);
        
        // Sincronizar con Pentágono
        syncToLiquidezForce({
            calculator: calc.id,
            result: result.total,
            regimen: regimen.id,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error en cálculo:', error);
        alert('⚠️ Error al realizar el cálculo. Por favor verifica los datos ingresados.');
    }
}

// ===== RENDERIZADO DE RESULTADO =====
function renderResult(result, calc, regimen) {
    const container = document.getElementById('result-container');
    const totalEl = document.getElementById('result-total');
    const detailsEl = document.getElementById('result-details');
    const legalEl = document.getElementById('result-legal');
    const canvas = document.getElementById('result-chart');
    
    if (!container || !totalEl || !detailsEl) return;
    
    // Mostrar container
    container.classList.remove('hidden');
    
    // Total
    totalEl.textContent = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    // Detalles
    let detailsHTML = '';
    result.details.forEach(detail => {
        if (detail.type === 'header') {
            detailsHTML += `
                <div class="flex items-center gap-2 mt-4 mb-2">
                    <div class="text-lg">${detail.label.split(' ')[0]}</div>
                    <div class="flex-1 h-px bg-slate-700"></div>
                </div>
            `;
        } else if (detail.type === 'separator') {
            detailsHTML += `<div class="border-t border-slate-700 my-3"></div>`;
        } else {
            let valueColor = 'text-white';
            if (detail.type === 'ingreso') valueColor = 'text-emerald-400';
            if (detail.type === 'descuento') valueColor = 'text-red-400';
            if (detail.type === 'costo') valueColor = 'text-orange-400';
            if (detail.type === 'subtotal') valueColor = 'text-indigo-400';
            
            detailsHTML += `
                <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-slate-400">${detail.label}</span>
                    <span class="font-bold ${valueColor}">${detail.value}</span>
                </div>
            `;
        }
    });
    detailsEl.innerHTML = detailsHTML;
    
    // Info legal
    if (legalEl) {
        legalEl.textContent = calc.legalInfo;
    }
    
    // Gráfico
    if (canvas) {
        renderChart(result, calc, canvas);
    }
    
    // Scroll to result
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== RENDERIZADO DE GRÁFICO =====
function renderChart(result, calc, canvas) {
    if (state.charts.result) {
        state.charts.result.destroy();
    }
    
    // Extraer datos para gráfico
    const labels = [];
    const data = [];
    const colors = [];
    
    result.details.forEach(detail => {
        if (detail.type !== 'header' && detail.type !== 'separator' && detail.type !== 'info') {
            const match = detail.value.match(/S\/\s*([\d,]+\.?\d*)/);
            if (match) {
                const value = parseFloat(match[1].replace(/,/g, ''));
                if (!isNaN(value) && value > 0) {
                    labels.push(detail.label);
                    data.push(value);
                    
                    if (detail.type === 'ingreso') colors.push('rgba(52, 211, 153, 0.8)');
                    else if (detail.type === 'descuento') colors.push('rgba(239, 68, 68, 0.8)');
                    else if (detail.type === 'costo') colors.push('rgba(251, 146, 60, 0.8)');
                    else colors.push('rgba(99, 102, 241, 0.8)');
                }
            }
        }
    });
    
    if (labels.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    state.charts.result = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: '#0f172a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#cbd5e1',
                        font: { size: 11 },
                        padding: 12,
                        boxWidth: 12
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#6366f1',
                    bodyColor: '#cbd5e1',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` ${context.label}: S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ===== CÁLCULO DE COSTO REAL (REFACTORED) =====
function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary')?.value) || 0;
    const hijos = document.getElementById('tc-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Por favor ingresa un sueldo válido (mínimo S/ ' + PERU_DATA.minWage + ')');
        return;
    }
    
    const regimen = REGIMENES_PERU[state.currentRegimen];
    
    // REFACTORED: Usar nueva API con tieneHijos
    const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
    
    // REFACTORED: calcularCostoEmpleador ahora acepta tieneHijos directamente
    const costoCalc = calcularCostoEmpleador(salary, hijos, regimen, {
        aplicaSenati: false,
        tieneEPS: false,
        nivelRiesgo: 'medio'
    });
    
    // Renderizar resultados
    const netSalaryEl = document.getElementById('tc-net-salary');
    const totalCostEl = document.getElementById('tc-total-cost');
    const breakdownEl = document.getElementById('tc-breakdown');
    
    if (netSalaryEl) {
        netSalaryEl.textContent = `S/ ${netoCalc.salarioNeto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    }
    
    if (totalCostEl) {
        totalCostEl.textContent = `S/ ${costoCalc.costoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    }
    
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
                </div>
                ` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">ESSALUD (9%)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.essalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Vida Ley (0.53%)</span>
                    <span class="text-orange-400 font-bold">+ S/ ${costoCalc.vidaLey.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Gratificaciones (prov.)</span>
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

// ===== COMPARACIÓN DE REGÍMENES (REFACTORED) =====
function calculateComparison() {
    const salary = parseFloat(document.getElementById('comp-salary')?.value) || 0;
    const hijos = document.getElementById('comp-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Por favor ingresa un sueldo válido');
        return;
    }
    
    const resultsContainer = document.getElementById('comp-results');
    if (!resultsContainer) return;
    
    let html = '';
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        
        // REFACTORED: Nueva API con tieneHijos
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
    
    // Generar gráfico comparativo
    renderComparisonChart(salary, hijos);
}

// ===== GRÁFICO COMPARATIVO (REFACTORED) =====
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
        
        // REFACTORED: Nueva API
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
                    label: 'Salario Neto Trabajador',
                    data: netosData,
                    backgroundColor: 'rgba(52, 211, 153, 0.8)',
                    borderColor: 'rgba(52, 211, 153, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Costo Total Empresa',
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
                    labels: {
                        color: '#cbd5e1',
                        font: { size: 12 },
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    titleColor: '#6366f1',
                    bodyColor: '#cbd5e1',
                    borderColor: '#6366f1',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return ` ${context.dataset.label}: S/ ${context.parsed.y.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return 'S/ ' + value.toLocaleString('es-PE', { maximumFractionDigits: 0 });
                        }
                    },
                    grid: {
                        color: 'rgba(71, 85, 105, 0.3)'
                    }
                },
                x: {
                    ticks: { color: '#94a3b8' },
                    grid: { display: false }
                }
            }
        }
    });
}

// ===== COMPARACIÓN ESTRATÉGICA (REFACTORED) =====
function calculateStrategicComparison() {
    const salary = parseFloat(document.getElementById('strategic-salary')?.value) || 0;
    const anios = parseFloat(document.getElementById('strategic-years')?.value) || 1;
    const hijos = document.getElementById('strategic-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Por favor ingresa un sueldo válido');
        return;
    }
    
    const resultsContainer = document.getElementById('strategic-results');
    if (!resultsContainer) return;
    
    let html = '<div class="grid gap-6">';
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        
        // REFACTORED
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
                                <span class="text-slate-500">Neto Mensual × 12:</span>
                                <span class="text-slate-300">S/ ${netoAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>
                            ${gratifAnual > 0 ? `
                            <div class="flex justify-between">
                                <span class="text-slate-500">Gratificaciones:</span>
                                <span class="text-slate-300">S/ ${gratifAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>
                            ` : ''}
                            ${ctsAnual > 0 ? `
                            <div class="flex justify-between">
                                <span class="text-slate-500">CTS:</span>
                                <span class="text-slate-300">S/ ${ctsAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="bg-orange-950/30 border border-orange-800/50 rounded-xl p-4">
                        <div class="text-xs text-slate-400 mb-2">🏢 COSTO EMPRESA/AÑO</div>
                        <div class="text-3xl font-black text-orange-400">
                            S/ ${totalEmpleador.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                        </div>
                        <div class="text-xs text-slate-500 mt-1">
                            Carga social: ${costoCalc.porcentajeCarga.toFixed(1)}%
                        </div>
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

// ===== EXPORTAR PDF =====
function exportPDF() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de exportar');
        return;
    }
    
    const { result, calc, regimen } = state.lastResult;
    
    // Require jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Helper para limpiar texto
    const cleanText = (text) => {
        return text
            .replace(/[^\x00-\x7F]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    };
    
    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText('SUELDOPRO PERU 2026'), 105, 22, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text(cleanText('Calculadora Laboral Profesional'), 105, 30, { align: 'center' });
    doc.text(cleanText('Pentagono Financiero'), 105, 36, { align: 'center' });
    
    // Info bar
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 50, 210, 12, 'F');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    const fechaStr = new Date().toLocaleDateString('es-PE', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    doc.text(cleanText(`Fecha: ${fechaStr}`), 15, 57);
    doc.text(cleanText(`Regimen: ${regimen.nombre}`), 150, 57);
    
    // Separator
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(1);
    doc.line(15, 67, 195, 67);
    
    // Title
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text(cleanText(`${calc.title}`), 15, 80);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 116, 139);
    const descLines = doc.splitTextToSize(cleanText(calc.description), 180);
    doc.text(descLines, 15, 88);
    
    // Result box
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
    
    // Details
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
            
            if (yPos > 270) {
                doc.addPage();
                yPos = 20;
            }
        }
    });
    
    // Legal info
    yPos += 10;
    if (yPos > 250) {
        doc.addPage();
        yPos = 20;
    }
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
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 280, 210, 17, 'F');
        doc.setTextColor(148, 163, 184);
        doc.setFontSize(8);
        doc.text(
            cleanText('(c) 2026 SueldoPro Ultra Peru - Pentagono Financiero - 100% Precision Legal'), 
            105, 289, 
            { align: 'center' }
        );
        doc.text(`Pagina ${i} de ${pageCount}`, 195, 289, { align: 'right' });
    }
    
    // Save
    const filename = cleanText(`SueldoPro_${calc.id}_${regimen.id}_${Date.now()}.pdf`);
    doc.save(filename);
    
    setTimeout(() => {
        alert(cleanText(
            `Exportacion exitosa!\n\n` +
            `Archivo: ${filename}\n\n` +
            `Resultado: ${resultText}\n` +
            `Regimen: ${regimen.nombre}`
        ));
    }, 300);
}

// ===== GUARDAR CÁLCULO =====
function saveCalculation() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de guardarlo');
        return;
    }
    
    const { result, calc, regimen } = state.lastResult;
    const resultText = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    const savedCalc = {
        id: Date.now(),
        calculator: calc.title,
        regimen: `${regimen.icon} ${regimen.nombre}`,
        result: resultText,
        date: new Date().toLocaleDateString('es-PE'),
        time: new Date().toLocaleTimeString('es-PE')
    };
    
    state.savedCalculations.unshift(savedCalc);
    
    // Limitar a 10 cálculos guardados
    if (state.savedCalculations.length > 10) {
        state.savedCalculations = state.savedCalculations.slice(0, 10);
    }
    
    localStorage.setItem('sueldopro_saved_calcs', JSON.stringify(state.savedCalculations));
    
    alert(
        `💾 Cálculo guardado!\n\n` +
        `${calc.icon} ${calc.title}\n` +
        `${resultText}\n` +
        `${regimen.nombre}\n\n` +
        `📊 Total guardados: ${state.savedCalculations.length}/10`
    );
}

// ===== COMPARTIR RESULTADO =====
function shareResult() {
    if (!state.lastResult) {
        alert('⚠️ Primero realiza un cálculo antes de compartir');
        return;
    }
    
    const { result, calc, regimen } = state.lastResult;
    const resultText = `S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
    
    const text = 
        `${calc.icon} ${calc.title}\n` +
        `🏢 Régimen: ${regimen.nombre}\n\n` +
        `💰 Resultado: ${resultText}\n\n` +
        `✅ Calculado con SueldoPro Ultra Perú 2026\n` +
        `🇵🇪 100% Legislación Peruana - REFACTORED\n` +
        `🌎 sueldopro-2026.vercel.app`;
    
    if (navigator.share) {
        navigator.share({
            title: 'SueldoPro Ultra Perú - Pentágono Financiero',
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

// ===== SINCRONIZACIÓN CON PENTÁGONO (BRIDGE) =====
function syncToLiquidezForce(data) {
    try {
        const bridgeData = {
            app: 'sueldopro_peru',
            timestamp: new Date().toISOString(),
            data: data
        };
        
        localStorage.setItem('pentagon_bridge_sueldopro', JSON.stringify(bridgeData));
        console.log('✅ Sincronizado con Liquidez Force:', bridgeData);
    } catch (error) {
        console.warn('⚠️ Error sincronizando con Pentágono:', error);
    }
}

// =====================================================================
// FIN DE SCRIPT.JS - SUELDOPRO ULTRA PERÚ 2026 (REFACTORED)
// =====================================================================
