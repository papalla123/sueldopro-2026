'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 — MAIN APPLICATION SCRIPT v3.0
// Arquitectura: CalculationEngine | UIController | State Manager
// =====================================================================
// CAMBIOS v3.0:
//  [ARCH-1] Separación de capas: CalculationEngine (lógica pura, sin DOM)
//           vs UIController (solo DOM, sin lógica de negocio).
//  [ARCH-2] Validaciones robustas: NaN, negativo, < RMV — bloquean render.
//  [ARCH-3] Panel de Log de Cálculo: muestra fórmulas paso a paso.
//  [ARCH-4] Sticky Result Panel: resultado siempre visible.
//  [ARCH-5] Recálculo automático en cambio de régimen.
// =====================================================================

// =====================================================================
// ─── CAPA 1: STATE (fuente única de verdad) ───────────────────────────
// =====================================================================
const AppState = {
    currentCalculator: 'neto',
    currentSection:    'calculators',
    currentRegimen:    localStorage.getItem('sueldopro_regimen') || 'general',
    charts:            {},
    savedCalculations: JSON.parse(localStorage.getItem('sueldopro_saved_calcs') || '[]'),
    lastPayload:       null,   // { result, calc, regimen, log }
    formValues:        {},
    showLog:           false
};

// =====================================================================
// ─── CAPA 2: CALCULATION ENGINE (lógica pura — cero DOM) ─────────────
// =====================================================================
const CalculationEngine = {

    /**
     * Valida un valor numérico. Devuelve {ok, value, error}.
     * @param {*} raw - Valor crudo del input
     * @param {object} opts - { min, max, label }
     */
    validate(raw, opts = {}) {
        const n = parseFloat(raw);
        if (raw === '' || raw === null || raw === undefined) {
            return { ok: false, value: 0, error: `${opts.label || 'Campo'} es requerido.` };
        }
        if (isNaN(n) || !isFinite(n)) {
            return { ok: false, value: 0, error: `${opts.label || 'Valor'} inválido (NaN).` };
        }
        if (n < 0) {
            return { ok: false, value: 0, error: `${opts.label || 'Valor'} no puede ser negativo.` };
        }
        if (opts.min !== undefined && n < opts.min) {
            return { ok: false, value: 0, error: `${opts.label || 'Valor'} mínimo: ${opts.min}.` };
        }
        if (opts.max !== undefined && n > opts.max) {
            return { ok: false, value: 0, error: `${opts.label || 'Valor'} máximo: ${opts.max}.` };
        }
        return { ok: true, value: n, error: null };
    },

    /**
     * Valida todos los campos numéricos de un formulario.
     * Devuelve lista de errores (vacía si todo OK).
     */
    validateForm(calc, values) {
        const errors = [];
        let hasAtLeastOneNumber = false;

        calc.fields.forEach(field => {
            if (field.type !== 'number') return;

            // Si el campo tiene conditional, verificar si está activo
            if (field.conditional) {
                const depValue = values[field.conditional.field];
                if (depValue !== field.conditional.value) return;
            }

            const raw = values[field.id];
            if (raw === '' || raw === undefined) return; // Opcional si no tiene min obligatorio

            const result = this.validate(raw, {
                min:   field.min,
                max:   field.max,
                label: field.label
            });

            if (!result.ok) {
                errors.push(result.error);
            } else {
                hasAtLeastOneNumber = true;
            }
        });

        if (!hasAtLeastOneNumber) {
            errors.push('Ingresa al menos un valor numérico para calcular.');
        }

        return errors;
    },

    /**
     * Ejecuta el cálculo de forma segura.
     * Retorna { success, payload, errors }
     */
    run(calcId, values, regimenId) {
        const calc    = CALCULATOR_CONFIGS[calcId];
        const regimen = REGIMENES_PERU[regimenId];

        if (!calc || !regimen) {
            return { success: false, payload: null, errors: ['Calculadora o régimen no encontrado.'] };
        }

        // Validar formulario
        const errors = this.validateForm(calc, values);
        if (errors.length > 0) {
            return { success: false, payload: null, errors };
        }

        // Ejecutar con try-catch
        try {
            const result = calc.calculate(values, regimen);

            // Guardia final: el total no puede ser NaN ni negativo
            if (isNaN(result.total) || !isFinite(result.total)) {
                console.warn('[CalculationEngine] total NaN — forzando a 0', { calcId, values });
                result.total = 0;
            }
            if (result.total < 0) {
                result.total = 0;
            }

            // Sanear cada línea de details
            if (Array.isArray(result.details)) {
                result.details = result.details.map(d => ({
                    ...d,
                    label: d.label || '',
                    value: d.value || ''
                }));
            }

            // Generar log de cálculo
            const log = (typeof generarLogCalculo === 'function')
                ? generarLogCalculo(calcId, result._resultado || result, regimen, values)
                : [];

            return {
                success: true,
                payload: { result, calc, regimen, log },
                errors: []
            };

        } catch (err) {
            console.error('[CalculationEngine] Error en cálculo:', err);
            return {
                success: false,
                payload: null,
                errors: [`Error interno: ${err.message}. Verifica los datos ingresados.`]
            };
        }
    }
};

// =====================================================================
// ─── CAPA 3: UI CONTROLLER (solo DOM — cero lógica de negocio) ────────
// =====================================================================
const UIController = {

    /**
     * Renderiza el resultado principal en el panel sticky.
     */
    renderResult(payload) {
        const { result, calc, regimen } = payload;

        const resultContainer = document.getElementById('result-container');
        const mainResult      = document.getElementById('main-result');
        const detailsContainer = document.getElementById('details-container');
        const logContainer    = document.getElementById('log-container');

        if (!resultContainer || !mainResult || !detailsContainer) return;

        resultContainer.classList.remove('hidden');

        // ── Panel Resultado Principal ──
        const totalFmt = r2(result.total).toLocaleString('es-PE', { minimumFractionDigits: 2 });
        mainResult.innerHTML = `
            <div class="result-hero text-center">
                <div class="text-5xl lg:text-6xl mb-3">${calc.icon}</div>
                <div class="result-label">${calc.title}</div>
                <div class="result-amount" id="animated-total">
                    S/ <span id="result-number">${totalFmt}</span>
                </div>
                <div class="result-regime">
                    ${regimen.icon} ${regimen.nombre}
                </div>
                ${result._resultado?.ir5taDetalle?.aplica
                    ? `<div class="ir5ta-badge">⚠️ IR 5ta Cat.: S/ ${r2(result._resultado.ir5taDetalle.mensual).toLocaleString('es-PE',{minimumFractionDigits:2})}/mes</div>`
                    : ''
                }
            </div>
        `;

        // ── Panel Detalles ──
        let detailsHTML = '';
        (result.details || []).forEach(detail => {
            if (detail.type === 'header') {
                detailsHTML += `<div class="detail-header"><h4>${detail.label}</h4></div>`;
            } else if (detail.type === 'separator') {
                detailsHTML += `<div class="detail-separator"></div>`;
            } else if (detail.type === 'info' && !detail.label && !detail.value) {
                // skip empty
            } else {
                const cls = {
                    base:     'detail-base',
                    ingreso:  'detail-ingreso',
                    descuento:'detail-descuento',
                    subtotal: 'detail-subtotal',
                    costo:    'detail-costo',
                    info:     'detail-info'
                }[detail.type] || 'detail-info';

                detailsHTML += `
                    <div class="detail-row ${cls}">
                        <span class="detail-label">${detail.label}</span>
                        <span class="detail-value">${detail.value}</span>
                    </div>
                `;
            }
        });
        detailsContainer.innerHTML = detailsHTML;

        // ── Panel Log de Cálculo ──
        if (logContainer) {
            this.renderLog(logContainer, payload.log || []);
        }

        // Animar número
        this._animateNumber('result-number', result.total);
    },

    /**
     * Renderiza el Log de Cálculo paso a paso.
     */
    renderLog(container, log) {
        if (!log || log.length === 0) {
            container.innerHTML = `<p class="log-empty">Log no disponible para esta calculadora.</p>`;
            return;
        }

        let html = `<div class="log-header">
            <span class="log-icon">🔬</span>
            <span>Fórmulas Legales Aplicadas</span>
        </div>`;

        log.forEach(step => {
            html += `
                <div class="log-step">
                    <div class="log-step-num">${step.paso}</div>
                    <div class="log-step-body">
                        <div class="log-formula">${step.formula}</div>
                        ${step.valor ? `<div class="log-value">${step.valor}</div>` : ''}
                        ${step.nota ? `<div class="log-nota">${step.nota}</div>` : ''}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    /**
     * Muestra un error de validación en el UI.
     */
    renderError(errors) {
        const resultContainer = document.getElementById('result-container');
        const mainResult      = document.getElementById('main-result');

        if (!resultContainer || !mainResult) return;
        resultContainer.classList.remove('hidden');

        mainResult.innerHTML = `
            <div class="error-panel">
                <div class="error-icon">⚠️</div>
                <div class="error-title">Datos inválidos</div>
                <ul class="error-list">
                    ${errors.map(e => `<li>${e}</li>`).join('')}
                </ul>
            </div>
        `;

        const detailsContainer = document.getElementById('details-container');
        if (detailsContainer) detailsContainer.innerHTML = '';
    },

    /**
     * Muestra el spinner de cálculo.
     */
    showSpinner() {
        const btn = document.getElementById('calculate-btn');
        if (btn) {
            btn.disabled   = true;
            btn.innerHTML  = `<span class="calc-spinner"></span> Calculando...`;
        }
    },

    /**
     * Oculta el spinner.
     */
    hideSpinner() {
        const btn = document.getElementById('calculate-btn');
        if (btn) {
            btn.disabled  = false;
            btn.innerHTML = `⚡ CALCULAR AHORA`;
        }
    },

    /**
     * Anima el número resultado con efecto count-up.
     */
    _animateNumber(elemId, target) {
        const el = document.getElementById(elemId);
        if (!el) return;
        const duration = 600;
        const start    = performance.now();
        const from     = 0;

        const tick = (now) => {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = 1 - Math.pow(1 - progress, 3);  // cubic ease-out
            const current  = from + (target - from) * ease;
            el.textContent = r2(current).toLocaleString('es-PE', { minimumFractionDigits: 2 });
            if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    },

    /**
     * Toggle del panel Log de Cálculo.
     */
    toggleLog() {
        AppState.showLog = !AppState.showLog;
        const logPanel = document.getElementById('log-panel');
        const logBtn   = document.getElementById('toggle-log-btn');
        if (logPanel) {
            logPanel.classList.toggle('hidden', !AppState.showLog);
        }
        if (logBtn) {
            logBtn.textContent = AppState.showLog ? '🔒 Ocultar Fórmulas' : '🔬 Ver Fórmulas';
            logBtn.classList.toggle('active', AppState.showLog);
        }
    },

    /**
     * Renderiza los detalles de régimen laboral.
     */
    renderRegimenInfo(regimen) {
        const infoDiv = document.getElementById('regimen-info');
        if (!infoDiv || !regimen) return;

        infoDiv.innerHTML = `
            <div class="regimen-card">
                <div class="regimen-card-icon">${regimen.icon}</div>
                <div class="regimen-card-body">
                    <h4>${regimen.nombre}</h4>
                    <p>${regimen.descripcion}</p>
                    <div class="regimen-grid">
                        <div class="regimen-item">
                            <span class="r-label">Gratificaciones</span>
                            <span class="r-value">${regimen.beneficios.gratificaciones ? (regimen.beneficios.gratificacionesFactor * 100) + '%' : 'No'}</span>
                        </div>
                        <div class="regimen-item">
                            <span class="r-label">CTS</span>
                            <span class="r-value">${regimen.beneficios.cts ? (regimen.beneficios.ctsFactor * 100) + '%' : 'No'}</span>
                        </div>
                        <div class="regimen-item">
                            <span class="r-label">Vacaciones</span>
                            <span class="r-value">${regimen.beneficios.vacaciones} días</span>
                        </div>
                        <div class="regimen-item">
                            <span class="r-label">Asig. Familiar</span>
                            <span class="r-value">${regimen.beneficios.asignacionFamiliar ? 'Sí' : 'No'}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
};

// =====================================================================
// ─── CAPA 4: ORQUESTADOR (conecta State + Engine + UI) ────────────────
// =====================================================================

/**
 * Orquesta todo el flujo: recopila valores → valida → calcula → renderiza.
 */
function executeCalculation() {
    const calc = CALCULATOR_CONFIGS[AppState.currentCalculator];
    if (!calc) return;

    // 1. Recopilar valores del formulario
    const values = {};
    calc.fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            values[field.id]             = el.value;
            AppState.formValues[field.id] = el.value;
        }
    });

    // 2. Mostrar spinner
    UIController.showSpinner();

    // 3. Delegar al motor de cálculo (microtask para no bloquear UI)
    setTimeout(() => {
        const { success, payload, errors } = CalculationEngine.run(
            AppState.currentCalculator,
            values,
            AppState.currentRegimen
        );

        UIController.hideSpinner();

        if (!success) {
            UIController.renderError(errors);
            return;
        }

        // 4. Guardar en state y renderizar
        AppState.lastPayload = payload;
        UIController.renderResult(payload);

        // 5. Scroll suave hacia el resultado (mobile)
        const resultEl = document.getElementById('result-container');
        if (resultEl && window.innerWidth < 1024) {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // 6. Sincronizar con Pentágono Bridge
        syncToLiquidezForce({
            calculator: payload.calc.id,
            regimen:    payload.regimen.id,
            result:     payload.result.total,
            timestamp:  new Date().toISOString()
        });

    }, 50);
}

// =====================================================================
// ─── INICIALIZACIÓN ───────────────────────────────────────────────────
// =====================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 SueldoPro Ultra v3.0 — Iniciando...');

    renderPentagonLinks();
    renderRegimenSelect();
    renderNavigation();
    renderCalculatorTabs();
    setupEventListeners();
    selectCalculator('neto');
    showWelcomeMessage();

    console.log('✅ SueldoPro Ultra v3.0 — Listo. Engine: CalculationEngine + UIController');
});

// ===== MENSAJE DE BIENVENIDA =====
function showWelcomeMessage() {
    if (!localStorage.getItem('sueldopro_visited')) {
        setTimeout(() => {
            alert(`¡Bienvenido a SueldoPro Ultra Perú 2026! 🚀\n\n` +
                `✅ Motor de precisión 4-6 decimales\n` +
                `✅ AFP: Tope SBS solo en SIS (corregido)\n` +
                `✅ IR 5ta: Gratificaciones + Bonif. Extra (corregido)\n` +
                `✅ Log de fórmulas legales paso a paso\n` +
                `✅ 8 calculadoras | 3 regímenes | UIT S/ 5,150\n\n` +
                `🇵🇪 100% Legislación Peruana — Boleta-precision™`);
            localStorage.setItem('sueldopro_visited', 'true');
        }, 800);
    }
}

// ===== RENDERIZADO DE ENLACES DEL PENTÁGONO =====
function renderPentagonLinks() {
    const desktop = document.getElementById('pentagon-desktop');
    const mobile  = document.getElementById('pentagon-mobile');
    const footer  = document.getElementById('footer-pentagon-links');
    if (!desktop || !mobile || !footer) return;

    // Limpiar antes de renderizar
    desktop.innerHTML = mobile.innerHTML = footer.innerHTML = '';

    Object.values(PENTAGON_LINKS).forEach(link => {
        const isCurrent = link.url.includes(window.location.hostname);
        const target    = isCurrent ? '_self' : '_blank';

        desktop.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer"
               class="px-4 py-2 rounded-xl bg-gradient-to-r ${link.color} text-white font-bold text-xs hover:scale-105 transition"
               title="${link.description}">
                ${link.icon} ${link.name}
            </a>`;

        mobile.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer"
               class="block p-4 rounded-xl bg-gradient-to-r ${link.color} text-white hover:scale-105 transition">
                <div class="text-2xl mb-2">${link.icon}</div>
                <div class="font-black text-sm">${link.name}</div>
                <div class="text-xs opacity-80 mt-1">${link.description}</div>
            </a>`;

        footer.innerHTML += `
            <a href="${link.url}" target="${target}" rel="noopener noreferrer"
               class="text-sm text-slate-400 hover:text-indigo-400 transition">
                ${link.icon} ${link.name}
            </a>`;
    });
}

// ===== SELECTOR DE RÉGIMEN =====
function renderRegimenSelect() {
    const select       = document.getElementById('regimen-select');
    const mobileSelect = document.getElementById('mobile-regimen-select');
    if (!select || !mobileSelect) return;

    const options = Object.values(REGIMENES_PERU)
        .map(r => `<option value="${r.id}">${r.icon} ${r.nombre}</option>`)
        .join('');

    select.innerHTML = mobileSelect.innerHTML = options;
    select.value = mobileSelect.value = AppState.currentRegimen;

    updateRegimenInfo();
}

function updateRegimenInfo() {
    const regimen = REGIMENES_PERU[AppState.currentRegimen];
    UIController.renderRegimenInfo(regimen);
}

// ===== NAVEGACIÓN =====
function renderNavigation() {
    const nav       = document.getElementById('nav-buttons');
    const mobileNav = document.getElementById('mobile-nav-buttons');
    if (!nav || !mobileNav) return;

    const sections = [
        { id: 'calculators', icon: '🔢', name: 'Calculadoras' },
        { id: 'truecost',    icon: '💎', name: 'Costo Real' },
        { id: 'comparison',  icon: '📊', name: 'Comparador' }
    ];

    nav.innerHTML = mobileNav.innerHTML = '';

    sections.forEach(section => {
        const isActive = section.id === 'calculators';
        const btnHTML = `
            <button data-nav="${section.id}"
                    class="nav-btn w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2
                           ${isActive ? 'active' : 'bg-slate-900 text-slate-400'}">
                ${section.icon} ${section.name}
            </button>`;
        nav.innerHTML       += btnHTML;
        mobileNav.innerHTML += btnHTML;
    });
}

function navigate(sectionId) {
    AppState.currentSection = sectionId;

    document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`sec-${sectionId}`);
    if (target) target.classList.add('active');

    document.querySelectorAll('[data-nav]').forEach(b => {
        b.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        b.classList.add('bg-slate-900', 'text-slate-400');
    });
    document.querySelectorAll(`[data-nav="${sectionId}"]`).forEach(b => {
        b.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-700', 'text-white');
        b.classList.remove('bg-slate-900', 'text-slate-400');
    });

    const calcTabsContainer = document.getElementById('calc-tabs-container');
    if (calcTabsContainer) calcTabsContainer.classList.toggle('hidden', sectionId !== 'calculators');

    const mobileNavEl = document.getElementById('mobile-nav');
    if (mobileNavEl) mobileNavEl.classList.add('-translate-x-full');
}

// ===== CALCULADORA TABS =====
function renderCalculatorTabs() {
    const tabs         = document.getElementById('calc-tabs');
    const mobileSelect = document.getElementById('mobile-calc-select');
    if (!tabs || !mobileSelect) return;

    tabs.innerHTML = mobileSelect.innerHTML = '';

    Object.values(CALCULATOR_CONFIGS).forEach(calc => {
        const isActive = calc.id === 'neto';

        tabs.innerHTML += `
            <button data-calc="${calc.id}"
                    class="calc-tab w-full p-3 rounded-xl font-bold text-sm flex items-center gap-2 border-2
                           ${isActive ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 text-slate-400'}">
                ${calc.icon} ${calc.title}
            </button>`;

        mobileSelect.innerHTML += `<option value="${calc.id}">${calc.icon} ${calc.title}</option>`;
    });
}

function selectCalculator(calcId) {
    AppState.currentCalculator = calcId;
    const calc = CALCULATOR_CONFIGS[calcId];
    if (!calc) return;

    // Actualizar tabs
    document.querySelectorAll('[data-calc]').forEach(b => {
        b.classList.remove('active', 'border-indigo-500', 'bg-indigo-500/10');
        b.classList.add('border-slate-700', 'text-slate-400');
    });
    document.querySelectorAll(`[data-calc="${calcId}"]`).forEach(t => {
        t.classList.add('active', 'border-indigo-500', 'bg-indigo-500/10');
        t.classList.remove('border-slate-700', 'text-slate-400');
    });

    const mobileSelect = document.getElementById('mobile-calc-select');
    if (mobileSelect) mobileSelect.value = calcId;

    renderCalculatorForm(calc);
}

// ===== FORMULARIO DINÁMICO =====
function renderCalculatorForm(calc) {
    const formContainer = document.getElementById('calculator-form');
    if (!formContainer) return;

    let html = `
        <div class="calc-header mb-6">
            <div class="flex items-center gap-3 mb-2">
                <div class="text-3xl">${calc.icon}</div>
                <h3 class="text-xl lg:text-2xl font-black text-white">${calc.title}</h3>
            </div>
            <p class="text-sm text-slate-400">${calc.description}</p>
        </div>`;

    calc.fields.forEach(field => {
        const saved = AppState.formValues[field.id] || '';
        const conditionalAttr = field.conditional
            ? `data-conditional-field="${field.conditional.field}" data-conditional-value="${field.conditional.value}"`
            : '';

        html += `
            <div class="form-group mb-4" data-field-id="${field.id}" ${conditionalAttr}>
                <label class="block text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                    ${field.label}
                </label>`;

        if (field.type === 'number') {
            html += `
                <input type="number"
                       id="${field.id}"
                       inputmode="${field.inputmode || 'decimal'}"
                       class="calc-input"
                       placeholder="${field.placeholder || ''}"
                       ${field.min !== undefined ? `min="${field.min}"` : ''}
                       ${field.max !== undefined ? `max="${field.max}"` : ''}
                       ${field.step !== undefined ? `step="${field.step}"` : ''}
                       value="${saved}">`;
        } else if (field.type === 'select') {
            html += `<select id="${field.id}" class="calc-select">`;
            field.options.forEach(opt => {
                html += `<option value="${opt.value}" ${saved === opt.value ? 'selected' : ''}>${opt.label}</option>`;
            });
            html += `</select>`;
        }

        if (field.help) {
            html += `<p class="text-xs text-slate-500 mt-1">${field.help}</p>`;
        }
        html += `</div>`;
    });

    // Botones acción
    html += `
        <button id="calculate-btn" class="calc-btn-primary w-full">
            ⚡ CALCULAR AHORA
        </button>
        <div class="flex gap-2 mt-3">
            <button id="toggle-log-btn" class="calc-btn-secondary flex-1">
                🔬 Ver Fórmulas
            </button>
            <button id="save-inline-btn" class="calc-btn-secondary flex-1">
                💾 Guardar
            </button>
        </div>
    `;

    formContainer.innerHTML = html;

    // Event listeners del formulario
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) calcBtn.addEventListener('click', executeCalculation);

    const logBtn = document.getElementById('toggle-log-btn');
    if (logBtn) logBtn.addEventListener('click', () => UIController.toggleLog());

    const saveInlineBtn = document.getElementById('save-inline-btn');
    if (saveInlineBtn) saveInlineBtn.addEventListener('click', saveCalculation);

    // Auto-guardar valores en AppState
    calc.fields.forEach(field => {
        const el = document.getElementById(field.id);
        if (el) {
            el.addEventListener('input', e => {
                AppState.formValues[field.id] = e.target.value;
            });
        }
    });

    setupConditionalFields();
}

// ===== CAMPOS CONDICIONALES =====
function setupConditionalFields() {
    document.querySelectorAll('[data-conditional-field]').forEach(fieldEl => {
        const depField = fieldEl.dataset.conditionalField;
        const depValue = fieldEl.dataset.conditionalValue;
        const trigger  = document.getElementById(depField);

        if (!trigger) return;

        const toggle = () => {
            const show = trigger.value === depValue;
            fieldEl.style.display = show ? 'block' : 'none';
        };

        trigger.addEventListener('change', toggle);
        toggle(); // estado inicial
    });
}

// ===== EVENT LISTENERS GLOBALES =====
function setupEventListeners() {
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMobileNav = document.getElementById('close-mobile-nav');
    const mobileNav     = document.getElementById('mobile-nav');

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', () => mobileNav?.classList.remove('-translate-x-full'));
    if (closeMobileNav) closeMobileNav.addEventListener('click', () => mobileNav?.classList.add('-translate-x-full'));

    // Régimen selectors (sincronizados + recálculo auto)
    const regimenSelectors = ['regimen-select', 'mobile-regimen-select'];
    regimenSelectors.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', e => {
            AppState.currentRegimen = e.target.value;
            localStorage.setItem('sueldopro_regimen', AppState.currentRegimen);
            // Sincronizar el otro select
            regimenSelectors.forEach(otherId => {
                const other = document.getElementById(otherId);
                if (other && other.id !== id) other.value = AppState.currentRegimen;
            });
            updateRegimenInfo();
            // Recalcular automáticamente si hay resultado previo
            if (AppState.lastPayload) executeCalculation();
        });
    });

    // Navegación
    document.addEventListener('click', e => {
        const navBtn = e.target.closest('[data-nav]');
        if (navBtn) navigate(navBtn.dataset.nav);

        const calcTab = e.target.closest('[data-calc]');
        if (calcTab) selectCalculator(calcTab.dataset.calc);
    });

    // Mobile calc select
    const mobileCalcSelect = document.getElementById('mobile-calc-select');
    if (mobileCalcSelect) mobileCalcSelect.addEventListener('change', e => selectCalculator(e.target.value));

    // Botones de acción en panel resultado
    const shareBtn  = document.getElementById('share-result-btn');
    const exportBtn = document.getElementById('export-pdf-btn');
    const saveBtn   = document.getElementById('save-calc-btn');
    const tcBtn     = document.getElementById('tc-calculate-btn');
    const compBtn   = document.getElementById('comp-calculate-btn');

    if (shareBtn)  shareBtn.addEventListener('click', shareResult);
    if (exportBtn) exportBtn.addEventListener('click', exportPDF);
    if (saveBtn)   saveBtn.addEventListener('click', saveCalculation);
    if (tcBtn)     tcBtn.addEventListener('click', calculateTrueCost);
    if (compBtn)   compBtn.addEventListener('click', calculateComparison);
}

// =====================================================================
// ─── FUNCIONES DE ACCIÓN ──────────────────────────────────────────────
// =====================================================================

function saveCalculation() {
    if (!AppState.lastPayload) {
        alert('⚠️ Primero realiza un cálculo.');
        return;
    }
    const { result, calc, regimen } = AppState.lastPayload;
    const entry = {
        id:         Date.now(),
        calculator: calc.title,
        regimen:    `${regimen.icon} ${regimen.nombre}`,
        result:     `S/ ${r2(result.total).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
        date:       new Date().toLocaleDateString('es-PE'),
        time:       new Date().toLocaleTimeString('es-PE')
    };

    AppState.savedCalculations.unshift(entry);
    if (AppState.savedCalculations.length > 10) AppState.savedCalculations = AppState.savedCalculations.slice(0, 10);
    localStorage.setItem('sueldopro_saved_calcs', JSON.stringify(AppState.savedCalculations));

    alert(`💾 Guardado!\n${calc.icon} ${calc.title}\n${entry.result}\n${regimen.nombre}`);
}

function shareResult() {
    if (!AppState.lastPayload) { alert('⚠️ Primero realiza un cálculo.'); return; }
    const { result, calc, regimen } = AppState.lastPayload;
    const text = `${calc.icon} ${calc.title}\n🏢 ${regimen.nombre}\n💰 S/ ${r2(result.total).toLocaleString('es-PE',{minimumFractionDigits:2})}\n✅ SueldoPro Ultra Perú 2026 — sueldopro-2026.vercel.app`;

    if (navigator.share) {
        navigator.share({ title: 'SueldoPro Ultra', text, url: window.location.href }).catch(() => {});
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => alert('✅ Copiado al portapapeles!'));
    } else {
        alert(text);
    }
}

function exportPDF() {
    if (!AppState.lastPayload) { alert('⚠️ Primero realiza un cálculo.'); return; }
    // Delegar a la función exportPDF existente en el código original si existe,
    // o emitir una notificación de que se necesita jsPDF.
    if (typeof window.jspdf !== 'undefined' || typeof window.jsPDF !== 'undefined') {
        _doPDFExport(AppState.lastPayload);
    } else {
        alert('⚠️ PDF Export requiere la librería jsPDF. Verifica que esté cargada en index.html.');
    }
}

// ===== CÁLCULOS ESPECIALES DE SECCIONES =====
function calculateTrueCost() {
    const salary = parseFloat(document.getElementById('tc-salary')?.value || 0);
    const { ok, error } = CalculationEngine.validate(salary, { min: PERU_DATA.minWage, label: 'Sueldo' });
    if (!ok) { alert(`⚠️ ${error}`); return; }

    const regimen  = REGIMENES_PERU[AppState.currentRegimen];
    const costoCalc = calcularCostoEmpleador(salary, 0, regimen, {});
    // Renderizar en el contenedor de Costo Real
    const tcResult = document.getElementById('tc-result');
    if (tcResult) {
        tcResult.innerHTML = `
            <div class="tc-summary">
                <div class="tc-row"><span>Sueldo Bruto</span><span>${fmt(costoCalc.sueldoBruto)}</span></div>
                <div class="tc-row"><span>ESSALUD (9%)</span><span>${fmt(costoCalc.essalud)}</span></div>
                <div class="tc-row"><span>SCTR + Vida Ley</span><span>${fmt(costoCalc.sctr + costoCalc.vidaLey)}</span></div>
                <div class="tc-row"><span>Gratificaciones (prov.)</span><span>${fmt(costoCalc.provGratificaciones)}</span></div>
                <div class="tc-row"><span>CTS (prov.)</span><span>${fmt(costoCalc.provCTS)}</span></div>
                <div class="tc-row"><span>Vacaciones (prov.)</span><span>${fmt(costoCalc.provVacaciones)}</span></div>
                <div class="tc-total"><span>COSTO TOTAL</span><span>${fmt(costoCalc.costoTotal)}</span></div>
                <div class="tc-pct">Carga Social: ${costoCalc.porcentajeCarga.toFixed(1)}%</div>
            </div>
        `;
    }
}

function calculateComparison() {
    const salary  = parseFloat(document.getElementById('comp-salary')?.value || 0);
    if (!salary || salary < PERU_DATA.minWage) { alert('⚠️ Ingresa un sueldo válido.'); return; }

    const resultados = Object.values(REGIMENES_PERU).map(reg => {
        const neto = calcularSalarioNeto(salary, reg, { sistemaPension: 'afp', afpNombre: 'integra' });
        return { regimen: reg, neto: neto.salarioNeto };
    });

    const compResult = document.getElementById('comp-result');
    if (compResult) {
        compResult.innerHTML = resultados.map(r => `
            <div class="comp-row">
                <span>${r.regimen.icon} ${r.regimen.nombre}</span>
                <span class="comp-neto">${fmt(r.neto)}</span>
            </div>
        `).join('');
    }
}

// ===== PENTÁGONO BRIDGE =====
function syncToLiquidezForce(data) {
    try {
        localStorage.setItem('pentagon_bridge_sueldopro', JSON.stringify({
            app: 'sueldopro_peru',
            timestamp: new Date().toISOString(),
            data
        }));
    } catch (e) {
        console.warn('Bridge sync error:', e);
    }
}

// =====================================================================
// FIN DE SCRIPT.JS v3.0 — SUELDOPRO ULTRA PERÚ 2026
// Arquitectura: CalculationEngine + UIController + AppState
// =====================================================================
