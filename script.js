'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - MAIN APPLICATION SCRIPT
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
    console.log('🚀 Inicializando SueldoPro Ultra Perú 2026...');
    
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
    
    console.log('✅ SueldoPro Ultra Perú 2026 iniciado correctamente');
});

// ===== MENSAJE DE BIENVENIDA =====
function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('sueldopro_visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            const message = `¡Bienvenido a SueldoPro Ultra Perú! 🚀

Calculadora Laboral Peruana 2026

✅ 8 Calculadoras especializadas
✅ 3 Regímenes laborales (General, MYPE, Micro)
✅ Legislación peruana actualizada
✅ Gráficos interactivos
✅ Exportar PDF Premium
✅ Guardar cálculos
✅ Pentágono Financiero conectado

🇵🇪 100% Perú - 100% Precisión

UIT 2026: S/ 5,150
RMV 2026: S/ 1,075`;
            
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
                ${calc.icon} ${calc.title}
            </button>
        `;
        
        // Mobile select
        mobileSelect.innerHTML += `
            <option value="${calc.id}">${calc.icon} ${calc.title}</option>
        `;
    });
}

// ===== CONFIGURACIÓN DE EVENT LISTENERS =====
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.remove('-translate-x-full');
        });
    }
    
    if (closeMobileNav) {
        closeMobileNav.addEventListener('click', () => {
            mobileNav.classList.add('-translate-x-full');
        });
    }
    
    // Régimen selectors
    const regimenSelect = document.getElementById('regimen-select');
    if (regimenSelect) {
        regimenSelect.addEventListener('change', (e) => {
            state.currentRegimen = e.target.value;
            localStorage.setItem('sueldopro_regimen', state.currentRegimen);
            
            const mobileRegimenSelect = document.getElementById('mobile-regimen-select');
            if (mobileRegimenSelect) {
                mobileRegimenSelect.value = state.currentRegimen;
            }
            
            updateRegimenInfo();
            
            // Recalcular si hay resultado previo
            if (state.lastResult) {
                executeCalculation();
            }
        });
    }
    
    const mobileRegimenSelect = document.getElementById('mobile-regimen-select');
    if (mobileRegimenSelect) {
        mobileRegimenSelect.addEventListener('change', (e) => {
            state.currentRegimen = e.target.value;
            localStorage.setItem('sueldopro_regimen', state.currentRegimen);
            
            if (regimenSelect) {
                regimenSelect.value = state.currentRegimen;
            }
            
            updateRegimenInfo();
            
            if (state.lastResult) {
                executeCalculation();
            }
        });
    }
    
    // Navigation buttons
    document.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => navigate(btn.dataset.nav));
    });
    
    // Calculator tabs
    document.querySelectorAll('[data-calc]').forEach(btn => {
        btn.addEventListener('click', () => selectCalculator(btn.dataset.calc));
    });
    
    // Mobile calculator select
    const mobileCalcSelect = document.getElementById('mobile-calc-select');
    if (mobileCalcSelect) {
        mobileCalcSelect.addEventListener('change', (e) => {
            selectCalculator(e.target.value);
        });
    }
    
    // Action buttons
    const shareBtn = document.getElementById('share-result-btn');
    if (shareBtn) shareBtn.addEventListener('click', shareResult);
    
    const exportBtn = document.getElementById('export-pdf-btn');
    if (exportBtn) exportBtn.addEventListener('click', exportPDF);
    
    const saveBtn = document.getElementById('save-calc-btn');
    if (saveBtn) saveBtn.addEventListener('click', saveCalculation);
    
    const tcBtn = document.getElementById('tc-calculate-btn');
    if (tcBtn) tcBtn.addEventListener('click', calculateTrueCost);
    
    const compBtn = document.getElementById('comp-calculate-btn');
    if (compBtn) compBtn.addEventListener('click', calculateComparison);
    
    const strategicBtn = document.getElementById('strategic-compare-btn');
    if (strategicBtn) strategicBtn.addEventListener('click', calculateStrategicComparison);
}

// ===== NAVEGACIÓN ENTRE SECCIONES =====
function navigate(sectionId) {
    state.currentSection = sectionId;
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section-content').forEach(s => {
        s.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const targetSection = document.getElementById(`sec-${sectionId}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Actualizar botones de navegación
    document.querySelectorAll('[data-nav]').forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-400');
    });
    
    const activeBtns = document.querySelectorAll(`[data-nav="${sectionId}"]`);
    activeBtns.forEach(btn => {
        btn.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        btn.classList.remove('bg-slate-900', 'text-slate-400');
    });
    
    // Mostrar/ocultar tabs de calculadoras
    const calcTabsContainer = document.getElementById('calc-tabs-container');
    if (calcTabsContainer) {
        calcTabsContainer.classList.toggle('hidden', sectionId !== 'calculators');
    }
    
    // Cerrar mobile nav
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.add('-translate-x-full');
    }
}

// ===== SELECCIÓN DE CALCULADORA =====
function selectCalculator(calcId) {
    state.currentCalculator = calcId;
    const calc = CALCULATOR_CONFIGS[calcId];
    
    if (!calc) return;
    
    // Actualizar tabs
    document.querySelectorAll('[data-calc]').forEach(b => {
        b.classList.remove('active', 'border-indigo-500', 'bg-indigo-500/10');
        b.classList.add('border-slate-700', 'text-slate-400');
    });
    
    const activeTabs = document.querySelectorAll(`[data-calc="${calcId}"]`);
    activeTabs.forEach(tab => {
        tab.classList.add('active', 'border-indigo-500', 'bg-indigo-500/10');
        tab.classList.remove('border-slate-700', 'text-slate-400');
    });
    
    // Actualizar mobile select
    const mobileSelect = document.getElementById('mobile-calc-select');
    if (mobileSelect) {
        mobileSelect.value = calcId;
    }
    
    // Renderizar formulario
    renderCalculatorForm(calc);
}

// ===== RENDERIZADO DE FORMULARIO DE CALCULADORA =====
function renderCalculatorForm(calc) {
    const formContainer = document.getElementById('calculator-form');
    if (!formContainer) return;
    
    let html = `
        <div class="mb-6">
            <div class="flex items-center gap-3 mb-2">
                <div class="text-3xl">${calc.icon}</div>
                <h3 class="text-xl lg:text-2xl font-black text-white">${calc.title}</h3>
            </div>
            <p class="text-sm text-slate-400">${calc.description}</p>
        </div>
    `;
    
    // Generar campos del formulario
    calc.fields.forEach(field => {
        const savedValue = state.formValues[field.id] || '';
        
        html += `
            <div class="form-group mb-4" data-field-id="${field.id}" ${field.conditional ? `data-conditional-field="${field.conditional.field}" data-conditional-value="${field.conditional.value}"` : ''}>
                <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    ${field.label}
                </label>
        `;
        
        if (field.type === 'number') {
            html += `
                <input type="number" 
                       id="${field.id}" 
                       inputmode="${field.inputmode || 'decimal'}"
                       class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none transition" 
                       placeholder="${field.placeholder || ''}" 
                       ${field.min !== undefined ? `min="${field.min}"` : ''}
                       ${field.max !== undefined ? `max="${field.max}"` : ''}
                       ${field.step !== undefined ? `step="${field.step}"` : ''}
                       value="${savedValue}">
            `;
        } else if (field.type === 'select') {
            html += `
                <select id="${field.id}" 
                        class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 focus:outline-none transition">
            `;
            field.options.forEach(option => {
                const selected = savedValue === option.value ? 'selected' : '';
                html += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
            html += `</select>`;
        }
        
        if (field.help) {
            html += `<p class="text-xs text-slate-500 mt-1">${field.help}</p>`;
        }
        
        html += `</div>`;
    });
    
    // Botón de cálculo
    html += `
        <button id="calculate-btn" 
                class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg hover:shadow-indigo-500/50">
            💡 CALCULAR AHORA
        </button>
    `;
    
    formContainer.innerHTML = html;
    
    // Configurar condicionales
    setupConditionalFields();
    
    // Event listener para el botón de cálculo
    const calculateBtn = document.getElementById('calculate-btn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', executeCalculation);
    }
    
    // Event listeners para campos (auto-guardar valores)
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            input.addEventListener('change', (e) => {
                state.formValues[field.id] = e.target.value;
            });
        }
    });
}

// ===== CONFIGURACIÓN DE CAMPOS CONDICIONALES =====
function setupConditionalFields() {
    const allFields = document.querySelectorAll('[data-conditional-field]');
    
    allFields.forEach(field => {
        const conditionalField = field.dataset.conditionalField;
        const conditionalValue = field.dataset.conditionalValue;
        
        const triggerInput = document.getElementById(conditionalField);
        if (triggerInput) {
            const checkVisibility = () => {
                const shouldShow = triggerInput.value === conditionalValue;
                field.style.display = shouldShow ? 'block' : 'none';
            };
            
            triggerInput.addEventListener('change', checkVisibility);
            checkVisibility(); // Check inicial
        }
    });
}

// ===== EJECUCIÓN DE CÁLCULO =====
function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    if (!calc) return;
    
    const regimen = REGIMENES_PERU[state.currentRegimen];
    
    // Recopilar valores del formulario
    const values = {};
    calc.fields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input) {
            values[field.id] = input.value;
            state.formValues[field.id] = input.value;
        }
    });
    
    // Validar campos obligatorios
    const hasRequiredValues = calc.fields.some(field => {
        if (field.type === 'number') {
            const value = parseFloat(values[field.id]);
            return !isNaN(value) && value > 0;
        }
        return true;
    });
    
    if (!hasRequiredValues) {
        alert('⚠️ Por favor completa los campos requeridos antes de calcular.');
        return;
    }
    
    // Ejecutar cálculo
    try {
        const result = calc.calculate(values, regimen);
        
        // Guardar resultado
        state.lastResult = { result, calc, regimen };
        
        // Renderizar resultado
        renderResult(result, calc, regimen);
        
        // Sincronizar con Pentágono
        syncToLiquidezForce({
            calculator: calc.id,
            regimen: regimen.id,
            result: result.total,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error en cálculo:', error);
        alert('❌ Error al realizar el cálculo. Por favor verifica los datos ingresados.');
    }
}

// ===== RENDERIZADO DE RESULTADO =====
function renderResult(result, calc, regimen) {
    const resultContainer = document.getElementById('result-container');
    const mainResult = document.getElementById('main-result');
    const detailsContainer = document.getElementById('details-container');
    const chartCanvas = document.getElementById('result-chart');
    
    if (!resultContainer || !mainResult || !detailsContainer || !chartCanvas) return;
    
    // Mostrar contenedor
    resultContainer.classList.remove('hidden');
    
    // Resultado principal
    mainResult.innerHTML = `
        <div class="text-center">
            <div class="text-5xl lg:text-7xl mb-2">${calc.icon}</div>
            <div class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">${calc.title}</div>
            <div class="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                S/ ${result.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </div>
            <div class="text-xs text-slate-500 mt-2">${regimen.icon} ${regimen.nombre}</div>
        </div>
    `;
    
    // Detalles
    let detailsHTML = '';
    result.details.forEach(detail => {
        if (detail.type === 'header') {
            detailsHTML += `
                <div class="pt-4 pb-2">
                    <h4 class="text-sm font-black text-indigo-400 uppercase tracking-wider">${detail.label}</h4>
                </div>
            `;
        } else if (detail.type === 'separator') {
            detailsHTML += `<div class="border-t border-slate-700 my-3"></div>`;
        } else {
            const colorClass = 
                detail.type === 'base' ? 'text-white' :
                detail.type === 'ingreso' ? 'text-emerald-400' :
                detail.type === 'descuento' ? 'text-red-400' :
                detail.type === 'costo' ? 'text-orange-400' :
                detail.type === 'subtotal' ? 'text-indigo-400 font-bold' :
                'text-slate-300';
            
            detailsHTML += `
                <div class="flex justify-between items-center py-2">
                    <span class="text-sm text-slate-400">${detail.label}</span>
                    <span class="text-sm font-bold ${colorClass}">${detail.value}</span>
                </div>
            `;
        }
    });
    
    detailsContainer.innerHTML = detailsHTML;
    
    // Generar gráfico
    renderChart(result, calc, chartCanvas);
}

// ===== RENDERIZADO DE GRÁFICO =====
function renderChart(result, calc, canvas) {
    // Destruir gráfico anterior si existe
    if (state.charts.result) {
        state.charts.result.destroy();
    }
    
    // Preparar datos para el gráfico
    const chartData = result.details
        .filter(d => d.type === 'ingreso' || d.type === 'descuento' || d.type === 'costo')
        .map(d => ({
            label: d.label,
            value: parseFloat(d.value.replace(/[^\d.-]/g, '')),
            type: d.type
        }))
        .filter(d => !isNaN(d.value) && d.value !== 0);
    
    if (chartData.length === 0) return;
    
    const labels = chartData.map(d => d.label);
    const values = chartData.map(d => Math.abs(d.value));
    const colors = chartData.map(d => 
        d.type === 'ingreso' ? 'rgba(52, 211, 153, 0.8)' :
        d.type === 'descuento' ? 'rgba(248, 113, 113, 0.8)' :
        'rgba(251, 146, 60, 0.8)'
    );
    
    const ctx = canvas.getContext('2d');
    state.charts.result = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: '#1e293b',
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
                        padding: 12
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
                            return ` S/ ${value.toLocaleString('es-PE', { minimumFractionDigits: 2 })} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ===== CÁLCULO DE COSTO REAL (TRUE COST) =====
function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary')?.value) || 0;
    const hijos = document.getElementById('tc-hijos')?.value === 'si';
    
    if (salary < PERU_DATA.minWage) {
        alert('⚠️ Por favor ingresa un sueldo válido (mínimo S/ ' + PERU_DATA.minWage + ')');
        return;
    }
    
    const regimen = REGIMENES_PERU[state.currentRegimen];
    const asigFamiliar = hijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
    
    // Calcular neto
    const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
    
    // Calcular costo empleador
    const costoCalc = calcularCostoEmpleador(salary, asigFamiliar, regimen, {
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
                ${asigFamiliar > 0 ? `
                <div class="flex justify-between text-sm">
                    <span class="text-slate-400">Asignación Familiar</span>
                    <span class="text-emerald-400 font-bold">+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
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

// ===== COMPARACIÓN DE REGÍMENES =====
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
        const costoCalc = calcularCostoEmpleador(
            salary, 
            hijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0, 
            regimen
        );
        
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

// ===== GRÁFICO COMPARATIVO =====
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
        const costoCalc = calcularCostoEmpleador(
            salary, 
            hijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0, 
            regimen
        );
        
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

// ===== COMPARACIÓN ESTRATÉGICA =====
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
    
    let html = '<div class="grid lg:grid-cols-3 gap-6">';
    
    Object.values(REGIMENES_PERU).forEach(regimen => {
        const asigFamiliar = hijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
        
        // Cálculos anuales
        const netoCalc = calcularSalarioNeto(salary, regimen, { tieneHijos: hijos });
        const costoCalc = calcularCostoEmpleador(salary, asigFamiliar, regimen);
        const ctsCalc = calcularCTS(salary, asigFamiliar, regimen, 6);
        const gratifCalc = calcularGratificaciones(salary, asigFamiliar, regimen);
        
        const ingresoAnualTrabajador = (netoCalc.salarioNeto * 12) + 
                                       (ctsCalc.ctsTotal * 2) + 
                                       (gratifCalc.gratificacionTotal);
        
        const costoAnualEmpresa = costoCalc.costoTotal * 12;
        const costoTotalAnios = costoAnualEmpresa * anios;
        const ingresoTotalAnios = ingresoAnualTrabajador * anios;
        
        html += `
            <div class="bg-slate-850 rounded-2xl p-6 border border-slate-800">
                <div class="flex items-center gap-3 mb-6">
                    <div class="text-4xl">${regimen.icon}</div>
                    <div>
                        <h3 class="text-xl font-black text-white">${regimen.nombre}</h3>
                    </div>
                </div>
                
                <div class="space-y-4">
                    <div class="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-4">
                        <div class="text-xs text-slate-400 mb-1">Ingreso Anual Trabajador</div>
                        <div class="text-2xl font-black text-emerald-400">
                            S/ ${ingresoAnualTrabajador.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                        </div>
                        <div class="text-xs text-slate-500 mt-2">
                            12 sueldos + CTS + Gratificaciones
                        </div>
                    </div>
                    
                    <div class="bg-orange-950/30 border border-orange-800/50 rounded-xl p-4">
                        <div class="text-xs text-slate-400 mb-1">Costo Anual Empresa</div>
                        <div class="text-2xl font-black text-orange-400">
                            S/ ${costoAnualEmpresa.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                        </div>
                        <div class="text-xs text-slate-500 mt-2">
                            Incluye todas las cargas sociales
                        </div>
                    </div>
                    
                    <div class="border-t border-slate-700 pt-4">
                        <div class="text-xs font-bold text-indigo-400 uppercase mb-3">Proyección ${anios} año${anios > 1 ? 's' : ''}</div>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-400">Total Ingreso:</span>
                                <span class="text-emerald-400 font-bold">
                                    S/ ${ingresoTotalAnios.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Total Costo:</span>
                                <span class="text-orange-400 font-bold">
                                    S/ ${costoTotalAnios.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                                </span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-400">Eficiencia:</span>
                                <span class="text-indigo-400 font-bold">
                                    ${((ingresoTotalAnios / costoTotalAnios) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-900/50 rounded-lg p-3 text-xs space-y-1">
                        <div class="flex justify-between">
                            <span class="text-slate-500">Gratif.:</span>
                            <span class="text-white">${regimen.beneficios.gratificaciones ? (regimen.beneficios.gratificacionesFactor * 100) + '%' : 'No'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">CTS:</span>
                            <span class="text-white">${regimen.beneficios.cts ? (regimen.beneficios.ctsFactor * 100) + '%' : 'No'}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">Vacac.:</span>
                            <span class="text-white">${regimen.beneficios.vacaciones} días</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-500">Indemn.:</span>
                            <span class="text-white">${regimen.beneficios.indemnizacion}x año</span>
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
        alert('⚠️ Primero realiza un cálculo antes de exportar el PDF');
        return;
    }
    
    const { result, calc, regimen } = state.lastResult;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Función para limpiar texto (evitar caracteres especiales)
    const cleanText = (text) => {
        return text
            .replace(/S\//g, 'S/')
            .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
            .replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
            .replace(/Á/g, 'A').replace(/É/g, 'E').replace(/Í/g, 'I')
            .replace(/Ó/g, 'O').replace(/Ú/g, 'U').replace(/Ñ/g, 'N')
            .replace(/[^\x00-\x7F]/g, '');
    };
    
    // Header
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
            cleanText('(c) 2026 SueldoPro Ultra Peru - Pentagono Financiero'), 
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
        `🇵🇪 100% Legislación Peruana\n` +
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
// FIN DE SCRIPT.JS - SUELDOPRO ULTRA PERÚ 2026
// =====================================================================
