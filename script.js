// ==============================================
// CONSTANTS & STATE
// ==============================================
const CONSTANTS = {
    UIT_2026: 5500,
    ASIGNACION_FAMILIAR: 115,
    AFP_RATE: 0.12,
    ONP_RATE: 0.13,
    ESSALUD_RATE: 0.09,
    EPS_RATE: 0.0675,
    FOURTH_CATEGORY_RETENTION: 0.08,
    FOURTH_CATEGORY_THRESHOLD: 1500,
    FIFTH_CATEGORY_DEDUCTION: 7, // UITs
    FIFTH_CATEGORY_RATE: 0.08,
    CTS_MONTHS_MAX: 6
};

let state = {
    currentCalculator: 'cts',
    currentSection: 'calculators',
    charts: {
        forex: null,
        comparison: null
    },
    selectedCurrency: 'USD',
    selectedSector: 'all',
    theme: 'light'
};

// ==============================================
// THEME MANAGEMENT
// ==============================================
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    state.theme = isDark ? 'dark' : 'light';
    
    document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
    
    // Update charts if they exist
    if (state.charts.forex) updateForex();
    if (state.charts.comparison) updateComparison();
    
    localStorage.setItem('theme', state.theme);
}

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-icon').textContent = '☀️';
        state.theme = 'dark';
    }
}

// ==============================================
// NAVIGATION
// ==============================================
function navigateTo(sectionId) {
    // Update sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`sec-${sectionId}`).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-nav="${sectionId}"]`).classList.add('active');
    
    state.currentSection = sectionId;
    
    // Initialize section-specific content
    if (sectionId === 'forex' && !state.charts.forex) {
        initForex();
    }
    if (sectionId === 'comparator' && !state.charts.comparison) {
        initComparator();
    }
    if (sectionId === 'jobs') {
        renderJobs();
    }
    if (sectionId === 'news') {
        renderNews();
    }
}

// ==============================================
// CALCULATOR SYSTEM
// ==============================================
function selectCalculator(calcId) {
    state.currentCalculator = calcId;
    
    // Update tabs
    document.querySelectorAll('.calc-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-calc="${calcId}"]`).classList.add('active');
    
    renderCalculatorForm();
}

function renderCalculatorForm() {
    const container = document.getElementById('calculator-form');
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    
    if (!calc) return;
    
    let formHTML = `
        <h3 class="text-2xl font-black mb-2 dark:text-white">${calc.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-8">${calc.description}</p>
    `;
    
    formHTML += calc.fields.map(field => {
        if (field.type === 'number') {
            return `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    <div class="relative">
                        ${field.prefix ? `<span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-slate-400">${field.prefix}</span>` : ''}
                        <input 
                            type="number" 
                            id="${field.id}" 
                            class="form-input ${field.prefix ? 'pl-14' : ''}" 
                            placeholder="${field.placeholder || '0.00'}"
                            ${field.value !== undefined ? `value="${field.value}"` : ''}
                            ${field.min !== undefined ? `min="${field.min}"` : ''}
                            ${field.max !== undefined ? `max="${field.max}"` : ''}
                        >
                    </div>
                </div>
            `;
        } else if (field.type === 'select') {
            return `
                <div class="form-group">
                    <label class="form-label">${field.label}</label>
                    <select id="${field.id}" class="form-select">
                        ${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
                    </select>
                </div>
            `;
        }
        return '';
    }).join('');
    
    formHTML += `
        <button onclick="executeCalculation()" class="btn-primary">
            CALCULAR AHORA
        </button>
    `;
    
    container.innerHTML = formHTML;
    
    // Update legal info
    document.getElementById('legal-info').textContent = calc.legalInfo;
    
    // Reset results
    document.getElementById('main-result').textContent = 'S/ 0.00';
    document.getElementById('result-details').innerHTML = '';
}

function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    if (!calc || !calc.calculate) return;
    
    // Get form values
    const values = {};
    calc.fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            values[field.id] = field.type === 'number' 
                ? parseFloat(element.value) || 0 
                : element.value;
        }
    });
    
    // Execute calculation
    const result = calc.calculate(values);
    
    // Display result
    displayResult(result);
}

function displayResult(result) {
    const mainResult = document.getElementById('main-result');
    const detailsContainer = document.getElementById('result-details');
    
    // Animate main result
    mainResult.style.transform = 'scale(0.95)';
    mainResult.style.opacity = '0';
    
    setTimeout(() => {
        mainResult.textContent = formatCurrency(result.total);
        mainResult.style.transform = 'scale(1)';
        mainResult.style.opacity = '1';
        mainResult.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }, 100);
    
    // Display details
    if (result.details && result.details.length > 0) {
        detailsContainer.innerHTML = result.details.map(detail => `
            <div class="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                <span class="text-sm opacity-90">${detail.label}</span>
                <span class="font-bold">${detail.value}</span>
            </div>
        `).join('');
    }
}

// ==============================================
// CALCULATOR CONFIGURATIONS
// ==============================================
const CALCULATOR_CONFIGS = {
    cts: {
        title: 'Compensación por Tiempo de Servicios',
        description: 'Calcula tu CTS semestral según normativa peruana',
        legalInfo: 'La CTS se deposita semestralmente (mayo y noviembre). Fórmula: (Sueldo + 1/6 Gratificación promedio) ÷ 12 × Meses trabajados.',
        fields: [
            {
                type: 'number',
                id: 'cts-sueldo',
                label: 'Sueldo Bruto Mensual',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'cts-gratificacion',
                label: 'Última Gratificación Recibida',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'cts-meses',
                label: 'Meses Trabajados en el Semestre',
                value: 6,
                min: 1,
                max: 6
            }
        ],
        calculate: (values) => {
            const sueldo = values['cts-sueldo'];
            const gratificacion = values['cts-gratificacion'];
            const meses = values['cts-meses'];
            
            const baseComputable = sueldo + (gratificacion / 6);
            const total = (baseComputable / 12) * meses;
            
            return {
                total,
                details: [
                    { label: 'Sueldo mensual', value: formatCurrency(sueldo) },
                    { label: '1/6 de gratificación', value: formatCurrency(gratificacion / 6) },
                    { label: 'Base computable', value: formatCurrency(baseComputable) },
                    { label: 'Meses considerados', value: `${meses} ${meses === 1 ? 'mes' : 'meses'}` }
                ]
            };
        }
    },
    
    neto: {
        title: 'Sueldo Neto Mensual',
        description: 'Calcula tu sueldo líquido después de descuentos',
        legalInfo: 'Se descuenta AFP/ONP (12-13%) y el Impuesto a la Renta de 5ta categoría (8% sobre ingresos anuales que excedan 7 UITs).',
        fields: [
            {
                type: 'number',
                id: 'neto-bruto',
                label: 'Sueldo Bruto Mensual',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'select',
                id: 'neto-pension',
                label: 'Sistema de Pensiones',
                options: [
                    { value: CONSTANTS.AFP_RATE, label: 'AFP (12%)' },
                    { value: CONSTANTS.ONP_RATE, label: 'ONP (13%)' }
                ]
            },
            {
                type: 'select',
                id: 'neto-asignacion',
                label: 'Asignación Familiar',
                options: [
                    { value: 0, label: 'No tengo' },
                    { value: CONSTANTS.ASIGNACION_FAMILIAR, label: `Sí (S/ ${CONSTANTS.ASIGNACION_FAMILIAR})` }
                ]
            }
        ],
        calculate: (values) => {
            const bruto = values['neto-bruto'];
            const pensionRate = parseFloat(values['neto-pension']);
            const asignacion = parseFloat(values['neto-asignacion']);
            
            const brutoTotal = bruto + asignacion;
            const descuentoPension = brutoTotal * pensionRate;
            
            // Renta 5ta categoría
            const ingresoAnualProyectado = brutoTotal * 14; // 12 sueldos + 2 gratificaciones
            const deduccion = CONSTANTS.FIFTH_CATEGORY_DEDUCTION * CONSTANTS.UIT_2026;
            const baseImponible = Math.max(0, ingresoAnualProyectado - deduccion);
            const impuestoAnual = baseImponible * CONSTANTS.FIFTH_CATEGORY_RATE;
            const impuestoMensual = impuestoAnual / 12;
            
            const total = brutoTotal - descuentoPension - impuestoMensual;
            
            return {
                total,
                details: [
                    { label: 'Sueldo bruto', value: formatCurrency(bruto) },
                    ...(asignacion > 0 ? [{ label: 'Asignación familiar', value: formatCurrency(asignacion) }] : []),
                    { label: 'Desc. pensión', value: `- ${formatCurrency(descuentoPension)}` },
                    { label: 'Impuesto 5ta', value: `- ${formatCurrency(impuestoMensual)}` }
                ]
            };
        }
    },
    
    gratificacion: {
        title: 'Gratificación Legal',
        description: 'Calcula tu gratificación de julio o diciembre',
        legalInfo: 'La gratificación equivale a un sueldo completo más el bono extraordinario (9% EsSalud o 6.75% EPS). Se paga en julio y diciembre.',
        fields: [
            {
                type: 'number',
                id: 'grat-sueldo',
                label: 'Sueldo Base',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'grat-meses',
                label: 'Meses Trabajados (1-6)',
                value: 6,
                min: 1,
                max: 6
            },
            {
                type: 'select',
                id: 'grat-seguro',
                label: 'Tipo de Seguro',
                options: [
                    { value: CONSTANTS.ESSALUD_RATE, label: 'EsSalud (9%)' },
                    { value: CONSTANTS.EPS_RATE, label: 'EPS (6.75%)' }
                ]
            }
        ],
        calculate: (values) => {
            const sueldo = values['grat-sueldo'];
            const meses = values['grat-meses'];
            const seguroRate = parseFloat(values['grat-seguro']);
            
            const gratificacionProporcional = (sueldo / 6) * meses;
            const bonoExtraordinario = gratificacionProporcional * seguroRate;
            const total = gratificacionProporcional + bonoExtraordinario;
            
            return {
                total,
                details: [
                    { label: 'Gratificación base', value: formatCurrency(gratificacionProporcional) },
                    { label: 'Bono extraordinario', value: formatCurrency(bonoExtraordinario) },
                    { label: 'Meses trabajados', value: `${meses} de 6` }
                ]
            };
        }
    },
    
    liquidacion: {
        title: 'Liquidación de Beneficios',
        description: 'Calcula el monto total al cesar en tu trabajo',
        legalInfo: 'La liquidación incluye: CTS pendiente, vacaciones no gozadas, gratificación trunca y último sueldo.',
        fields: [
            {
                type: 'number',
                id: 'liq-sueldo',
                label: 'Sueldo Mensual',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'liq-meses-cts',
                label: 'Meses CTS Pendiente',
                value: 0,
                min: 0,
                max: 6
            },
            {
                type: 'number',
                id: 'liq-dias-vacaciones',
                label: 'Días de Vacaciones Pendientes',
                value: 0,
                min: 0,
                max: 30
            }
        ],
        calculate: (values) => {
            const sueldo = values['liq-sueldo'];
            const mesesCTS = values['liq-meses-cts'];
            const diasVacaciones = values['liq-dias-vacaciones'];
            
            const cts = (sueldo / 12) * mesesCTS;
            const vacaciones = (sueldo / 30) * diasVacaciones;
            const total = sueldo + cts + vacaciones;
            
            return {
                total,
                details: [
                    { label: 'Último sueldo', value: formatCurrency(sueldo) },
                    { label: 'CTS pendiente', value: formatCurrency(cts) },
                    { label: 'Vacaciones', value: formatCurrency(vacaciones) }
                ]
            };
        }
    },
    
    quinta: {
        title: 'Impuesto a la Renta 5ta Categoría',
        description: 'Calcula el impuesto anual y mensual',
        legalInfo: 'Se aplica 8% sobre ingresos anuales que superen las 7 UITs (S/ 38,500 para 2026).',
        fields: [
            {
                type: 'number',
                id: 'quinta-bruto',
                label: 'Sueldo Bruto Mensual',
                prefix: 'S/',
                placeholder: '0.00'
            }
        ],
        calculate: (values) => {
            const brutoMensual = values['quinta-bruto'];
            const ingresoAnual = brutoMensual * 14;
            const deduccion = CONSTANTS.FIFTH_CATEGORY_DEDUCTION * CONSTANTS.UIT_2026;
            const baseImponible = Math.max(0, ingresoAnual - deduccion);
            const impuestoAnual = baseImponible * CONSTANTS.FIFTH_CATEGORY_RATE;
            const impuestoMensual = impuestoAnual / 12;
            
            return {
                total: impuestoMensual,
                details: [
                    { label: 'Ingreso anual proyectado', value: formatCurrency(ingresoAnual) },
                    { label: 'Deducción (7 UITs)', value: formatCurrency(deduccion) },
                    { label: 'Base imponible', value: formatCurrency(baseImponible) },
                    { label: 'Impuesto anual', value: formatCurrency(impuestoAnual) }
                ]
            };
        }
    },
    
    cuarta: {
        title: 'Renta 4ta Categoría',
        description: 'Calcula la retención en recibos por honorarios',
        legalInfo: 'Se retiene 8% cuando el recibo supera S/ 1,500. Aplica para trabajadores independientes.',
        fields: [
            {
                type: 'number',
                id: 'cuarta-monto',
                label: 'Monto del Recibo',
                prefix: 'S/',
                placeholder: '0.00'
            }
        ],
        calculate: (values) => {
            const monto = values['cuarta-monto'];
            const aplicaRetencion = monto > CONSTANTS.FOURTH_CATEGORY_THRESHOLD;
            const retencion = aplicaRetencion ? monto * CONSTANTS.FOURTH_CATEGORY_RETENTION : 0;
            const total = monto - retencion;
            
            return {
                total,
                details: [
                    { label: 'Monto bruto', value: formatCurrency(monto) },
                    { label: 'Retención 8%', value: aplicaRetencion ? `- ${formatCurrency(retencion)}` : 'No aplica' },
                    { label: 'Estado', value: aplicaRetencion ? 'Supera S/ 1,500' : 'Menor a S/ 1,500' }
                ]
            };
        }
    },
    
    utilidades: {
        title: 'Participación de Utilidades',
        description: 'Calcula tu participación en las utilidades de la empresa',
        legalInfo: 'Las empresas con más de 20 trabajadores deben repartir utilidades. El porcentaje varía según sector.',
        fields: [
            {
                type: 'number',
                id: 'util-utilidad',
                label: 'Utilidad Total de la Empresa',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'util-dias',
                label: 'Días Trabajados en el Año',
                value: 360,
                min: 1,
                max: 360
            },
            {
                type: 'number',
                id: 'util-remuneracion',
                label: 'Remuneración Anual',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'select',
                id: 'util-sector',
                label: 'Sector de la Empresa',
                options: [
                    { value: 0.10, label: 'Minería (10%)' },
                    { value: 0.08, label: 'Industria/Comercio (8%)' },
                    { value: 0.05, label: 'Otros (5%)' }
                ]
            }
        ],
        calculate: (values) => {
            const utilidadTotal = values['util-utilidad'];
            const dias = values['util-dias'];
            const remuneracion = values['util-remuneracion'];
            const porcentajeSector = parseFloat(values['util-sector']);
            
            const montoDistribuible = utilidadTotal * porcentajeSector;
            const mitadDias = montoDistribuible * 0.5;
            const mitadRemuneracion = montoDistribuible * 0.5;
            
            // Asumiendo valores totales para el cálculo proporcional
            const totalDiasTrabajadores = 360; // Simplificado
            const totalRemuneracionTrabajadores = remuneracion * 2; // Simplificado
            
            const porDias = (mitadDias / totalDiasTrabajadores) * dias;
            const porRemuneracion = (mitadRemuneracion / totalRemuneracionTrabajadores) * remuneracion;
            const total = porDias + porRemuneracion;
            
            return {
                total,
                details: [
                    { label: 'Por días trabajados', value: formatCurrency(porDias) },
                    { label: 'Por remuneración', value: formatCurrency(porRemuneracion) },
                    { label: 'Porcentaje sector', value: `${porcentajeSector * 100}%` }
                ]
            };
        }
    },
    
    vacaciones: {
        title: 'Vacaciones',
        description: 'Calcula el pago por vacaciones',
        legalInfo: 'Todo trabajador tiene derecho a 30 días calendario de descanso remunerado al año.',
        fields: [
            {
                type: 'number',
                id: 'vac-sueldo',
                label: 'Sueldo Mensual',
                prefix: 'S/',
                placeholder: '0.00'
            },
            {
                type: 'number',
                id: 'vac-dias',
                label: 'Días de Vacaciones',
                value: 30,
                min: 1,
                max: 30
            }
        ],
        calculate: (values) => {
            const sueldo = values['vac-sueldo'];
            const dias = values['vac-dias'];
            
            const total = (sueldo / 30) * dias;
            
            return {
                total,
                details: [
                    { label: 'Sueldo mensual', value: formatCurrency(sueldo) },
                    { label: 'Días de vacaciones', value: `${dias} días` },
                    { label: 'Valor por día', value: formatCurrency(sueldo / 30) }
                ]
            };
        }
    }
};

// ==============================================
// SALARY COMPARATOR
// ==============================================
const SALARY_RANGES = {
    tecnologia: { junior: [2500, 4500], middle: [4500, 7500], senior: [7500, 12000], lead: [12000, 20000] },
    mineria: { junior: [3500, 5500], middle: [5500, 9000], senior: [9000, 15000], lead: [15000, 25000] },
    finanzas: { junior: [2800, 5000], middle: [5000, 8500], senior: [8500, 14000], lead: [14000, 22000] },
    salud: { junior: [2000, 3500], middle: [3500, 6000], senior: [6000, 10000], lead: [10000, 18000] },
    comercio: { junior: [1800, 3000], middle: [3000, 5500], senior: [5500, 9000], lead: [9000, 15000] },
    educacion: { junior: [1500, 2500], middle: [2500, 4500], senior: [4500, 7500], lead: [7500, 12000] }
};

function initComparator() {
    updateComparison();
}

function updateComparison() {
    const salary = parseFloat(document.getElementById('comp-salary').value) || 0;
    const sector = document.getElementById('comp-sector').value;
    const level = document.getElementById('comp-level').value;
    
    if (!SALARY_RANGES[sector] || !SALARY_RANGES[sector][level]) return;
    
    const range = SALARY_RANGES[sector][level];
    const min = range[0];
    const max = range[1];
    const avg = (min + max) / 2;
    
    // Update chart
    const ctx = document.getElementById('comparison-chart');
    
    if (state.charts.comparison) {
        state.charts.comparison.destroy();
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    
    state.charts.comparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Mínimo', 'Promedio', 'Tu Sueldo', 'Máximo'],
            datasets: [{
                label: 'Comparación Salarial (S/)',
                data: [min, avg, salary, max],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.2)',
                    'rgba(59, 130, 246, 0.5)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(59, 130, 246, 0.7)'
                ],
                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(59, 130, 246)',
                    'rgb(34, 197, 94)',
                    'rgb(59, 130, 246)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: `Rango Salarial: ${sector.charAt(0).toUpperCase() + sector.slice(1)} - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
                    color: isDark ? '#e2e8f0' : '#1e293b',
                    font: { size: 16, weight: 'bold' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        callback: value => `S/ ${value.toLocaleString()}`
                    },
                    grid: {
                        color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'
                    }
                },
                x: {
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Update stats
    const percentile = ((salary - min) / (max - min)) * 100;
    const difference = salary - avg;
    
    document.getElementById('comparison-stats').innerHTML = `
        <div class="stat-card">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">Tu Percentil</div>
            <div class="text-3xl font-black text-brand-500">${Math.round(percentile)}%</div>
        </div>
        <div class="stat-card">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">vs. Promedio</div>
            <div class="text-3xl font-black ${difference >= 0 ? 'text-green-500' : 'text-red-500'}">
                ${difference >= 0 ? '+' : ''}${formatCurrency(difference)}
            </div>
        </div>
        <div class="stat-card">
            <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">Rango</div>
            <div class="text-lg font-black text-slate-700 dark:text-slate-300">
                ${formatCurrency(min)} - ${formatCurrency(max)}
            </div>
        </div>
    `;
}

// ==============================================
// FOREX SYSTEM
// ==============================================
function initForex() {
    renderCurrencyList();
    updateForex();
}

function renderCurrencyList() {
    const list = document.getElementById('forex-list');
    list.innerHTML = window.CURRENCIES.map(currency => `
        <button 
            onclick="selectCurrency('${currency.code}')" 
            data-currency="${currency.code}"
            class="currency-card ${currency.code === state.selectedCurrency ? 'active' : ''}"
        >
            <div>
                <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${currency.name}</div>
                <div class="text-[10px] text-slate-400">${currency.symbol}</div>
            </div>
            <div class="text-sm font-black text-brand-500">${currency.code}</div>
        </button>
    `).join('');
}

function filterCurrencies() {
    const search = document.getElementById('forex-search').value.toLowerCase();
    const buttons = document.querySelectorAll('[data-currency]');
    
    buttons.forEach(btn => {
        const currency = window.CURRENCIES.find(c => c.code === btn.dataset.currency);
        const matches = currency.name.toLowerCase().includes(search) || 
                       currency.code.toLowerCase().includes(search);
        btn.style.display = matches ? 'flex' : 'none';
    });
}

function selectCurrency(code) {
    state.selectedCurrency = code;
    
    document.querySelectorAll('.currency-card').forEach(card => {
        card.classList.remove('active');
    });
    document.querySelector(`[data-currency="${code}"]`).classList.add('active');
    
    updateForex();
}

function updateForex() {
    const amount = parseFloat(document.getElementById('forex-amount').value) || 0;
    const currency = window.CURRENCIES.find(c => c.code === state.selectedCurrency);
    
    if (!currency) return;
    
    const converted = amount / currency.rate;
    
    document.getElementById('forex-pair').textContent = `${currency.code}/PEN`;
    document.getElementById('forex-converted').textContent = `${converted.toFixed(2)} ${currency.code}`;
    
    // Create chart data (simulated week trend)
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const baseRate = currency.rate;
    const chartData = labels.map((_, i) => {
        const variance = (Math.random() - 0.5) * 0.04 * baseRate;
        return baseRate + variance;
    });
    
    const ctx = document.getElementById('forex-chart');
    
    if (state.charts.forex) {
        state.charts.forex.destroy();
    }
    
    const isDark = document.documentElement.classList.contains('dark');
    
    state.charts.forex = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `Tasa ${currency.code}/PEN`,
                data: chartData,
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
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
                    backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'white',
                    titleColor: isDark ? 'rgb(226, 232, 240)' : 'rgb(15, 23, 42)',
                    bodyColor: isDark ? 'rgb(148, 163, 184)' : 'rgb(71, 85, 105)',
                    borderColor: isDark ? 'rgb(51, 65, 85)' : 'rgb(226, 232, 240)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: context => `S/ ${context.parsed.y.toFixed(4)}`
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b',
                        callback: value => `S/ ${value.toFixed(2)}`
                    },
                    grid: {
                        color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'
                    }
                },
                x: {
                    ticks: {
                        color: isDark ? '#94a3b8' : '#64748b'
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ==============================================
// JOBS SYSTEM
// ==============================================
function renderJobs() {
    const search = document.getElementById('job-search').value.toLowerCase();
    const filteredJobs = window.JOBS.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(search) ||
                             job.sector.toLowerCase().includes(search);
        const matchesSector = state.selectedSector === 'all' || 
                             job.sector.toLowerCase() === state.selectedSector;
        return matchesSearch && matchesSector;
    }).slice(0, 40);
    
    document.getElementById('jobs-grid').innerHTML = filteredJobs.map(job => `
        <div class="job-card">
            <div class="text-4xl mb-4">${job.icon}</div>
            <h4 class="text-sm font-black dark:text-white mb-2">${job.title}</h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-4">${job.sector}</p>
            <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                <div>
                    <div class="text-xs text-slate-400 font-bold">Desde</div>
                    <div class="text-lg font-black text-brand-500">${formatCurrency(job.salary)}</div>
                </div>
                <a href="${job.link}" target="_blank" class="px-4 py-2 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-colors">
                    Ver más
                </a>
            </div>
        </div>
    `).join('');
}

function filterJobs() {
    renderJobs();
}

function filterJobsBySector(sector) {
    state.selectedSector = sector;
    
    document.querySelectorAll('.sector-filter').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-sector="${sector}"]`).classList.add('active');
    
    renderJobs();
}

// ==============================================
// NEWS SYSTEM
// ==============================================
function renderNews() {
    document.getElementById('news-grid').innerHTML = window.NEWS.map(article => `
        <div class="news-card">
            <div class="flex items-center gap-2 mb-3">
                <span class="px-3 py-1 bg-brand-500 text-white text-[9px] font-black rounded-full uppercase">
                    ${article.source}
                </span>
                <span class="text-[10px] text-slate-400">${article.date}</span>
            </div>
            <h4 class="text-base font-black dark:text-white mb-3 leading-tight">${article.title}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">${article.description}</p>
            <a href="${article.link}" target="_blank" class="inline-flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
                Leer más
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
            </a>
        </div>
    `).join('');
}

// ==============================================
// UTILITY FUNCTIONS
// ==============================================
function formatCurrency(amount) {
    return `S/ ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function shareResult() {
    const result = document.getElementById('main-result').textContent;
    const calc = CALCULATOR_CONFIGS[state.currentCalculator];
    
    const text = `Calculé mi ${calc.title} en SueldoPro 2026: ${result}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'SueldoPro 2026',
            text: text,
            url: window.location.href
        }).catch(() => {});
    } else {
        navigator.clipboard.writeText(text).then(() => {
            alert('Resultado copiado al portapapeles');
        });
    }
}

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderCalculatorForm();
    
    // Auto-calculate on input change
    document.addEventListener('input', (e) => {
        if (e.target.closest('#calculator-form')) {
            // Optional: auto-calculate as user types
        }
    });
});

// Export for debugging
window.SueldoPro = {
    state,
    CONSTANTS,
    navigateTo,
    selectCalculator,
    executeCalculation
};