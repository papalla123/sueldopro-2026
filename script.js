/* ================================================================
   SueldoPro Ultra - UI & Controller Layer v4.0 (2026)
   ================================================================
   PRINCIPIO: Separación total Lógica de Negocio ↔ Renderizado
   - CalcEngine (data.js) → Cálculos puros, audit trail
   - Este archivo → Lectura de inputs, renderizado, interacción

   MEJORAS v4.0:
   ✓ Debounce 300ms para Audit Log (DOM-safe live updates)
   ✓ Manejo de inasistencias con factor 1.2 (PLAME)
   ✓ Validador tope AFP SBS en pensión
   ✓ Remuneración variable en Gratif, CTS y Vacaciones
   ✓ Triple Vacacional en Liquidación
   ✓ EPS diferenciado (6.75%) en Gratif y Liquidación
   ✓ Comparador PRO: Costo Laboral Anual Total (contratar vs. despedir)
   ================================================================ */

// ═══════════════════════════════════════════════
//  INICIALIZACIÓN
// ═══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initNavbar();
    initParticles();
    initTabs();
    initFAQ();
    initCounters();
    initDates();
    initLiveBindings();
});

// ─── Loader ──────────────────────────────────────
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }, 1800);
}

// ─── Theme Toggle ────────────────────────────────
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const saved = localStorage.getItem('sueldopro-theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('sueldopro-theme', isDark ? 'light' : 'dark');
    });
}

// ─── Navbar ──────────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    const sections = document.querySelectorAll('section[id], .hero[id]');
    const navLinkEls = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navLinkEls.forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-section') === current);
        });
    });

    navLinkEls.forEach(l => l.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    }));
}

// ─── Particles ───────────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function create() {
        particles = [];
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                size: Math.random() * 1.8 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        const rgb = dark ? '148,163,184' : '99,102,241';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${p.opacity})`;
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${rgb},${0.05 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }

    resize(); create(); animate();
    window.addEventListener('resize', () => { resize(); create(); });
}

// ─── Tabs ────────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', () => activateCalc(tab.getAttribute('data-calc')));
    });
}

function activateCalc(calcId) {
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.calc-tab[data-calc="${calcId}"]`);
    if (activeTab) activeTab.classList.add('active');
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${calcId}`);
    if (panel) panel.classList.add('active');
    scrollToSection('calculadoras');
}

// ─── FAQ ─────────────────────────────────────────
function initFAQ() {
    const list = document.getElementById('faqList');
    if (!list) return;
    DATA.FAQ.forEach(item => {
        const el = document.createElement('div');
        el.className = 'faq-item';
        el.innerHTML = `
            <button class="faq-question" onclick="toggleFAQ(this)">
                <span>${item.pregunta}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-inner">${item.respuesta}</div>
            </div>`;
        list.appendChild(el);
    });
}

function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// ─── Counters ────────────────────────────────────
function initCounters() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { animateCounter(e.target); observer.unobserve(e.target); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-count]').forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const start = performance.now();
    const duration = 2000;
    (function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target).toLocaleString();
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    })(start);
}

// ─── Dates ───────────────────────────────────────
function initDates() {
    const today = new Date().toISOString().split('T')[0];
    const ceseEl = document.getElementById('liq-fecha-cese');
    if (ceseEl) ceseEl.value = today;
    const ingresoEl = document.getElementById('liq-fecha-ingreso');
    if (ingresoEl) {
        const ago = new Date();
        ago.setFullYear(ago.getFullYear() - 1);
        ingresoEl.value = ago.toISOString().split('T')[0];
    }
}

// ═══════════════════════════════════════════════
//  LIVE BINDINGS v4.0
//  Debounce 300ms para Audit Log — no saturar el DOM mientras el usuario escribe
// ═══════════════════════════════════════════════

function initLiveBindings() {
    const bindings = {
        'sueldo-neto':          ['sn-sueldo-bruto', 'sn-regimen', 'sn-pension', 'sn-asig-familiar', 'sn-meses', 'sn-dias-faltados'],
        'gratificacion':        ['grat-sueldo', 'grat-periodo', 'grat-meses', 'grat-asig-familiar', 'grat-bonif', 'grat-promedio-comisiones', 'grat-veces-percibido', 'grat-eps'],
        'cts':                  ['cts-sueldo', 'cts-meses', 'cts-dias', 'cts-asig-familiar', 'cts-gratificacion', 'cts-promedio-comisiones', 'cts-veces-percibido'],
        'horas-extras':         ['he-sueldo', 'he-horas-25', 'he-horas-35', 'he-nocturno', 'he-asig-familiar'],
        'vacaciones':           ['vac-sueldo', 'vac-dias', 'vac-meses', 'vac-no-gozadas', 'vac-promedio-comisiones', 'vac-veces-percibido'],
        'impuesto-renta':       ['ir-sueldo', 'ir-meses', 'ir-gratificaciones', 'ir-otros'],
        'essalud':              ['es-sueldo', 'es-trabajadores', 'es-regimen'],
        'asignacion-familiar':  ['af-hijos', 'af-rmv'],
        'renta-quinta':         ['r5-sueldo', 'r5-mes', 'r5-recibido'],
        'costo-empleador':      ['ce-sueldo', 'ce-regimen', 'ce-asig-familiar', 'ce-sctr', 'ce-eps', 'ce-anos-servicio'],
        'liquidacion':          ['liq-sueldo', 'liq-fecha-ingreso', 'liq-fecha-cese', 'liq-motivo', 'liq-vac-pendientes', 'liq-vac-no-gozadas-dias', 'liq-asig-familiar', 'liq-eps']
    };

    const calcFunctions = {
        'sueldo-neto':          calcularSueldoNeto,
        'gratificacion':        calcularGratificacion,
        'cts':                  calcularCTS,
        'horas-extras':         calcularHorasExtras,
        'vacaciones':           calcularVacaciones,
        'impuesto-renta':       calcularImpuestoRenta,
        'essalud':              calcularEsSalud,
        'asignacion-familiar':  calcularAsignacionFamiliar,
        'renta-quinta':         calcularRentaQuinta,
        'costo-empleador':      calcularCostoEmpleador,
        'liquidacion':          calcularLiquidacion
    };

    // ── Debounce 300ms — Suficiente para no saturar el DOM
    //    mientras el usuario escribe, sin lag perceptible
    function debounce(fn, ms = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn(...args), ms);
        };
    }

    for (const [calcKey, inputIds] of Object.entries(bindings)) {
        const fn = calcFunctions[calcKey];
        if (!fn) continue;

        const debouncedFn = debounce(() => {
            const mainInput = document.getElementById(inputIds[0]);
            if (mainInput && mainInput.value && parseFloat(mainInput.value) > 0) {
                fn(true); // silent mode — no toast
            }
        }, 300);

        inputIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('input', debouncedFn);
            el.addEventListener('change', debouncedFn);
        });
    }
}


// ═══════════════════════════════════════════════
//  UTILIDADES DE UI
// ═══════════════════════════════════════════════

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = {
        success: 'fas fa-check-circle',
        error:   'fas fa-exclamation-circle',
        info:    'fas fa-info-circle'
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function getVal(id) {
    const el = document.getElementById(id);
    if (!el) return 0;
    const v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
}

function getChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

function getSelect(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

function validate(value, fieldName) {
    if (value === '' || value === null || isNaN(value) || value < 0) {
        showToast(`Ingresa un valor válido para: ${fieldName}`, 'error');
        return false;
    }
    return true;
}

const fmt = CalcEngine.formatMoney;


// ═══════════════════════════════════════════════
//  RENDER ENGINE v4.0
//  Genera HTML completo para cada resultado
// ═══════════════════════════════════════════════

function renderResult(targetId, config) {
    const { heroLabel, heroAmount, heroSub, sections, barChart, auditLog, extraTable } = config;

    let html = `<div class="result-card">
        <div class="result-hero">
            <div class="result-hero-label">${heroLabel}</div>
            <div class="result-hero-amount">S/ ${fmt(heroAmount)}</div>
            ${heroSub ? `<div class="result-hero-sub">${heroSub}</div>` : ''}
        </div>
        <div class="result-body">`;

    for (const section of sections) {
        html += `<div class="result-section">`;
        if (section.title) html += `<div class="result-section-title">${section.title}</div>`;
        for (const row of section.rows) {
            const cls = row.class || '';
            const total = row.total ? ' total' : '';
            html += `<div class="result-row${total}">
                <span class="result-row-label">
                    ${row.icon ? `<i class="${row.icon}"></i>` : ''}${row.label}
                </span>
                <span class="result-row-value ${cls}">${row.value}</span>
            </div>`;
        }
        html += `</div>`;
    }

    // Tabla comparativa PRO (solo cuando se incluye)
    if (extraTable) {
        html += renderComparadorProTable(extraTable);
    }

    if (barChart && barChart.length > 0) {
        html += `<div class="result-section"><div class="result-section-title">Distribución Visual</div><div class="result-bar-chart">`;
        for (const item of barChart) {
            html += `<div class="bar-chart-item">
                <div class="bar-chart-label"><span>${item.label}</span><span>S/ ${fmt(item.value)}</span></div>
                <div class="bar-chart-track"><div class="bar-chart-fill" style="width:${item.percent}%;background:${item.color}"></div></div>
            </div>`;
        }
        html += `</div></div>`;
    }

    // Audit Log con debounce 300ms — Bloomberg-style terminal
    if (auditLog) {
        html += `<div class="result-section">
            <div class="result-section-title">
                <i class="fas fa-terminal"></i> Log de Auditoría PLAME
                <button class="audit-toggle-btn" onclick="this.closest('.result-section').querySelector('.audit-log').classList.toggle('expanded')">
                    <i class="fas fa-chevron-down"></i> Expandir
                </button>
            </div>
            <div class="audit-log"><pre>${escapeHtml(auditLog)}</pre></div>
        </div>`;
    }

    html += `</div>
        <div class="result-actions">
            <button class="btn-result-action btn-result-primary" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button class="btn-result-action btn-result-secondary" onclick="copyResult(this)">
                <i class="fas fa-copy"></i> Copiar
            </button>
        </div>
    </div>`;

    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
}

// ─── Comparador PRO — Tabla HTML ─────────────────
function renderComparadorProTable(data) {
    const { general, pequena, micro, ahorroAnualMicro, ahorroAnualPequena } = data;

    const cols = [
        { key: 'general', obj: general, label: 'Régimen General', color: '#6366f1' },
        { key: 'pequena', obj: pequena, label: 'Pequeña Empresa', color: '#10b981' },
        { key: 'micro',   obj: micro,  label: 'Microempresa',    color: '#f59e0b' }
    ];

    let html = `<div class="result-section">
        <div class="result-section-title"><i class="fas fa-table"></i> Comparador PRO — Costo Laboral Anual Total</div>
        <div class="comparador-pro-table-wrap" style="overflow-x:auto">
        <table class="comparador-pro-table" style="width:100%;border-collapse:collapse;font-size:0.85rem;margin-top:0.5rem">
            <thead>
                <tr style="background:var(--bg-secondary,#f8fafc)">
                    <th style="padding:0.6rem 0.8rem;text-align:left;border-bottom:2px solid var(--border,#e2e8f0)">Concepto</th>
                    ${cols.map(c => `<th style="padding:0.6rem 0.8rem;text-align:right;border-bottom:2px solid ${c.color};color:${c.color}">${c.label}</th>`).join('')}
                </tr>
            </thead>
            <tbody>`;

    const rows = [
        { label: 'Remuneración base', fn: c => fmt(c.obj.base.total) },
        { label: 'EsSalud mensual',   fn: c => fmt(c.obj.desglose.essaludMensual) },
        { label: 'CTS (mensualizada)',fn: c => c.obj.desglose.ctsMensualizada > 0 ? fmt(c.obj.desglose.ctsMensualizada) : '—' },
        { label: 'Gratif. + Bonif.',  fn: c => c.obj.desglose.gratMensualizada > 0 ? fmt(c.obj.desglose.gratMensualizada + c.obj.desglose.bonifMensualizada) : '—' },
        { label: 'Vacaciones',        fn: c => fmt(c.obj.desglose.vacMensualizada) },
        { label: 'Costo mensual total',fn: c => `<strong>S/ ${fmt(c.obj.costoTotalMensual)}</strong>`, bold: true },
        { label: 'Costo anual contratar', fn: c => fmt(c.obj.costoTotalAnual), bold: true },
        { label: '+ Indemnización estimada', fn: c => fmt(c.obj.liquidacion.indemnizacionEstimada) },
        { label: '+ Beneficios truncos', fn: c => fmt(c.obj.liquidacion.beneficiosTruncos) },
        { label: 'COSTO LABORAL ANUAL TOTAL', fn: c => `<strong style="color:var(--primary,#6366f1)">S/ ${fmt(c.obj.costoLaboralAnualTotal)}</strong>`, highlight: true },
        { label: 'Sobrecosto s/ sueldo', fn: c => `+${CalcEngine.roundUI(c.obj.porcentajeSobrecosto)}%` }
    ];

    rows.forEach((row, i) => {
        const bg = row.highlight ? 'background:var(--bg-highlight,rgba(99,102,241,0.07))' : (i % 2 === 0 ? '' : 'background:var(--bg-secondary,#f8fafc)');
        html += `<tr style="${bg}">
            <td style="padding:0.5rem 0.8rem;border-bottom:1px solid var(--border,#e2e8f0);${row.bold ? 'font-weight:600' : ''}">${row.label}</td>
            ${cols.map(c => `<td style="padding:0.5rem 0.8rem;border-bottom:1px solid var(--border,#e2e8f0);text-align:right">${row.fn(c)}</td>`).join('')}
        </tr>`;
    });

    html += `</tbody>
            <tfoot>
                <tr style="background:var(--bg-secondary,#f8fafc)">
                    <td style="padding:0.6rem 0.8rem;font-weight:700" colspan="1">Ahorro anual vs. General</td>
                    <td style="padding:0.6rem 0.8rem;text-align:right;color:#6366f1"><strong>—</strong></td>
                    <td style="padding:0.6rem 0.8rem;text-align:right;color:#10b981"><strong>S/ ${fmt(ahorroAnualPequena)}</strong></td>
                    <td style="padding:0.6rem 0.8rem;text-align:right;color:#f59e0b"><strong>S/ ${fmt(ahorroAnualMicro)}</strong></td>
                </tr>
            </tfoot>
        </table>
        </div>
        <p style="font-size:0.75rem;color:var(--text-muted,#94a3b8);margin-top:0.5rem">
            <i class="fas fa-info-circle"></i>
            Costo laboral anual total = Costo anual de contratar + Indemnización estimada + Beneficios truncos al cese.
            Valores calculados según RMV 2026 (S/ 1,075) y legislación vigente.
        </p>
    </div>`;

    return html;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function copyResult(btn) {
    const card = btn.closest('.result-card');
    const text = card.querySelector('.result-body').innerText;
    navigator.clipboard.writeText(text)
        .then(() => showToast('Copiado al portapapeles', 'success'))
        .catch(() => showToast('No se pudo copiar', 'error'));
}


// ═══════════════════════════════════════════════
//  CONTROLADORES DE CALCULADORAS v4.0
//  Cada función: Lee inputs → Llama CalcEngine → Renderiza
// ═══════════════════════════════════════════════

// ─── 1. SUELDO NETO (con descuento de inasistencias) ────────
function calcularSueldoNeto(silent = false) {
    const bruto = getVal('sn-sueldo-bruto');
    if (bruto <= 0) { if (!silent) showToast('Ingresa la remuneración bruta', 'error'); return; }

    const diasFaltados = parseInt(getVal('sn-dias-faltados')) || 0;

    const r = CalcEngine.sueldoNeto({
        sueldoBruto: bruto,
        regimen: getSelect('sn-regimen'),
        tipoPension: getSelect('sn-pension'),
        incluyeAsigFamiliar: getChecked('sn-asig-familiar'),
        mesCalculo: parseInt(getVal('sn-meses')) || 6,
        diasFaltados
    });

    const maxVal = r.base.total;

    const sections = [
        {
            title: 'Ingresos 2026',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Bruto', value: `S/ ${fmt(r.base.sueldoBruto)}`, class: 'positive' },
                ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: `Asig. Familiar (RMV ${DATA.RMV} × 10%)`, value: `S/ ${fmt(r.base.asigFamiliar)}`, class: 'positive' }] : []),
                { icon: 'fas fa-plus-circle', label: 'Remuneración Total', value: `S/ ${fmt(r.base.total)}`, class: 'positive', total: true }
            ]
        },
        ...(diasFaltados > 0 ? [{
            title: 'Descuento por Inasistencias (PLAME)',
            rows: [
                { icon: 'fas fa-calendar-xmark', label: `Días faltados: ${diasFaltados}`, value: `- S/ ${fmt(r.descuentoInasistencias)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Base efectiva de descuentos', value: `S/ ${fmt(r.baseEfectiva)}`, total: true }
            ]
        }] : []),
        {
            title: `Descuentos — ${r.pension.nombre}`,
            rows: [
                ...r.pension.detalle.map(d => ({
                    icon: 'fas fa-minus-circle',
                    label: d.concepto,
                    value: `- S/ ${fmt(d.monto)}`,
                    class: 'negative'
                })),
                {
                    icon: 'fas fa-landmark',
                    label: 'IR 5ta Cat. (mensual)',
                    value: r.ir.mensual > 0 ? `- S/ ${fmt(r.ir.mensual)}` : 'S/ 0.00',
                    class: r.ir.mensual > 0 ? 'negative' : ''
                },
                ...(diasFaltados > 0 ? [{ icon: 'fas fa-calendar-xmark', label: 'Descuento inasistencias', value: `- S/ ${fmt(r.descuentoInasistencias)}`, class: 'negative' }] : []),
                { icon: 'fas fa-minus-circle', label: 'Total Descuentos', value: `- S/ ${fmt(r.totalDescuentos)}`, class: 'negative', total: true }
            ]
        },
        {
            title: 'Información',
            rows: [
                { icon: 'fas fa-briefcase', label: 'Régimen', value: r.regimen.nombre },
                { icon: 'fas fa-percent', label: '% Descuento', value: `${CalcEngine.roundUI(r.porcentajeDescuento)}%` },
                { icon: 'fas fa-calendar', label: 'Neto Anual (est.)', value: `S/ ${fmt(r.sueldoNeto * 12)}` }
            ]
        }
    ];

    const barChart = [
        { label: 'Sueldo Neto', value: r.sueldoNeto, percent: CalcEngine.roundUI((r.sueldoNeto / maxVal) * 100), color: '#10b981' },
        { label: 'Pensión', value: r.pension.total, percent: CalcEngine.roundUI((r.pension.total / maxVal) * 100), color: '#6366f1' },
        { label: 'IR 5ta', value: r.ir.mensual, percent: Math.max(1, CalcEngine.roundUI((r.ir.mensual / maxVal) * 100)), color: '#ef4444' },
        ...(diasFaltados > 0 ? [{ label: 'Inasistencias', value: r.descuentoInasistencias, percent: CalcEngine.roundUI((r.descuentoInasistencias / maxVal) * 100), color: '#f97316' }] : [])
    ];

    renderResult('result-sueldo-neto', {
        heroLabel: 'Tu Sueldo Neto Mensual',
        heroAmount: r.sueldoNeto,
        heroSub: `Bruto S/ ${fmt(r.base.total)} | ${r.pension.nombre}${diasFaltados > 0 ? ` | ${diasFaltados} días faltados` : ''}`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Sueldo neto calculado con precisión 2026', 'success');
}

// ─── 2. GRATIFICACIÓN (con variable y EPS) ───────────────────
function calcularGratificacion(silent = false) {
    const sueldo = getVal('grat-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const promedioComisiones   = getVal('grat-promedio-comisiones') || 0;
    const vecesPercibido       = parseInt(getVal('grat-veces-percibido')) || 0;
    const tieneEPS             = getChecked('grat-eps');

    const r = CalcEngine.gratificacion({
        sueldoBruto: sueldo,
        periodo: getSelect('grat-periodo'),
        mesesTrabajados: parseInt(getVal('grat-meses')) || 6,
        incluyeAsigFamiliar: getChecked('grat-asig-familiar'),
        incluyeBonif: getChecked('grat-bonif'),
        promedioComisiones,
        vecesPercibidoSemestre: vecesPercibido,
        tieneEPS
    });

    const sections = [
        {
            title: 'Remuneración Computable',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración Fija', value: `S/ ${fmt(r.base.sueldoBruto)}` },
                ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: 'Asignación Familiar', value: `S/ ${fmt(r.base.asigFamiliar)}` }] : []),
                ...(r.promVar > 0 ? [{
                    icon: 'fas fa-chart-line',
                    label: `Prom. Comisiones/Bonos (${vecesPercibido} veces ≥3)`,
                    value: `S/ ${fmt(r.promVar)}`, class: 'positive'
                }] : []),
                ...(promedioComisiones > 0 && r.promVar === 0 ? [{
                    icon: 'fas fa-times-circle',
                    label: `Variable NO incluida (${vecesPercibido} veces < 3)`,
                    value: `S/ ${fmt(promedioComisiones)}`, class: 'negative'
                }] : []),
                { icon: 'fas fa-calculator', label: 'Base Computable', value: `S/ ${fmt(r.baseComputable)}`, total: true }
            ]
        },
        {
            title: 'Cálculo de Gratificación',
            rows: [
                { icon: 'fas fa-calendar', label: `Meses en semestre`, value: `${r.mesesEfectivos} / 6` },
                { icon: 'fas fa-gift', label: 'Gratificación Base [PLAME]', value: `S/ ${fmt(r.gratificacionBase)}`, class: 'positive' }
            ]
        },
        {
            title: `Bonificación Extraordinaria — ${tieneEPS ? 'EPS (6.75%)' : 'EsSalud (9%)'}`,
            rows: [
                { icon: 'fas fa-percent', label: `Tasa: ${(r.tasaBonif * 100).toFixed(2)}% (${tieneEPS ? 'Ley 30334 §3 + EPS' : 'Ley 30334 §3'})`, value: `S/ ${fmt(r.bonifExtraordinaria)}`, class: 'positive' },
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL A RECIBIR', value: `S/ ${fmt(r.totalRecibir)}`, class: 'positive', total: true }
            ]
        },
        {
            title: 'Información',
            rows: [
                { icon: 'fas fa-calendar-alt', label: 'Período', value: r.periodo.nombre },
                { icon: 'fas fa-info-circle', label: 'Nota', value: 'No sujeta a descuentos de pensión ni IR' }
            ]
        }
    ];

    const barChart = [
        { label: 'Gratificación', value: r.gratificacionBase, percent: r.totalRecibir > 0 ? CalcEngine.roundUI((r.gratificacionBase / r.totalRecibir) * 100) : 100, color: '#10b981' },
        { label: `Bonif. ${(r.tasaBonif * 100).toFixed(2)}%`, value: r.bonifExtraordinaria, percent: r.totalRecibir > 0 ? CalcEngine.roundUI((r.bonifExtraordinaria / r.totalRecibir) * 100) : 0, color: '#6366f1' }
    ];

    renderResult('result-gratificacion', {
        heroLabel: `Gratificación ${r.periodo.nombre}`,
        heroAmount: r.totalRecibir,
        heroSub: `${r.mesesEfectivos} meses | Bonif. ${(r.tasaBonif * 100).toFixed(2)}% ${tieneEPS ? '(EPS)' : '(EsSalud)'}`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Gratificación calculada con reglas 2026', 'success');
}

// ─── 3. CTS (con promedio variable) ─────────────────────────
function calcularCTS(silent = false) {
    const sueldo = getVal('cts-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const promedioComisiones = getVal('cts-promedio-comisiones') || 0;
    const vecesPercibido     = parseInt(getVal('cts-veces-percibido')) || 0;

    const r = CalcEngine.cts({
        sueldoBruto: sueldo,
        meses: parseInt(getVal('cts-meses')) || 0,
        dias: parseInt(getVal('cts-dias')) || 0,
        incluyeAsigFamiliar: getChecked('cts-asig-familiar'),
        ultimaGratificacion: getVal('cts-gratificacion'),
        promedioComisiones,
        vecesPercibidoSemestre: vecesPercibido
    });

    const sections = [
        {
            title: 'Remuneración Computable',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo', value: `S/ ${fmt(r.base.sueldoBruto)}` },
                ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: 'Asig. Familiar', value: `S/ ${fmt(r.base.asigFamiliar)}` }] : []),
                { icon: 'fas fa-gift', label: '1/6 Gratificación', value: `S/ ${fmt(r.sextoGratificacion)}` },
                ...(r.promVar > 0 ? [{
                    icon: 'fas fa-chart-line',
                    label: `Prom. Comisiones/Bonos (${vecesPercibido} veces ≥3)`,
                    value: `S/ ${fmt(r.promVar)}`, class: 'positive'
                }] : []),
                ...(promedioComisiones > 0 && r.promVar === 0 ? [{
                    icon: 'fas fa-times-circle',
                    label: `Variable NO incluida (${vecesPercibido} veces < 3)`,
                    value: `S/ ${fmt(promedioComisiones)}`, class: 'negative'
                }] : []),
                { icon: 'fas fa-calculator', label: 'Remu. Computable', value: `S/ ${fmt(r.remuComputable)}`, total: true }
            ]
        },
        {
            title: 'Cálculo',
            rows: [
                { icon: 'fas fa-calendar', label: 'Días computables', value: `${r.totalDias} días` },
                { icon: 'fas fa-divide', label: 'Valor diario', value: `S/ ${fmt(r.valorDiario)}` },
                { icon: 'fas fa-piggy-bank', label: 'CTS a Depositar [PLAME]', value: `S/ ${fmt(r.cts)}`, class: 'positive', total: true }
            ]
        }
    ];

    renderResult('result-cts', {
        heroLabel: 'CTS a Depositar',
        heroAmount: r.cts,
        heroSub: `${r.totalDias} días computables | Base S/ ${fmt(r.remuComputable)}`,
        sections, auditLog: r.audit
    });

    if (!silent) showToast('CTS calculada', 'success');
}

// ─── 4. HORAS EXTRAS ────────────────────────────────────────
function calcularHorasExtras(silent = false) {
    const sueldo = getVal('he-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.horasExtras({
        sueldoBruto: sueldo,
        horas25: getVal('he-horas-25'),
        horas35: getVal('he-horas-35'),
        incluyeAsigFamiliar: getChecked('he-asig-familiar'),
        esNocturno: getChecked('he-nocturno')
    });

    // Verificar tope SBS en la pensión (informativo)
    const afpTopeAplicado = sueldo > DATA.AFP_SBS_TOPE;

    const sections = [
        {
            title: `Valor Hora Legal (Base / ${DATA.HORAS_MES_LEGAL}h)`,
            rows: [
                { icon: 'fas fa-coins', label: `Sueldo Bruto`, value: `S/ ${fmt(r.base.sueldoBruto)}` },
                ...(r.base.asigFamiliar > 0 ? [{
                    icon: 'fas fa-people-roof',
                    label: `Asig. Familiar (RMV ${DATA.RMV} × 10% = S/ ${fmt(DATA.RMV * 0.10)})`,
                    value: `S/ ${fmt(r.base.asigFamiliar)}`
                }] : []),
                { icon: 'fas fa-calculator', label: 'Base Remunerativa', value: `S/ ${fmt(r.base.total)}` },
                ...(r.esNocturno ? [
                    { icon: 'fas fa-moon', label: 'Sobretasa nocturna (+35%)', value: `S/ ${fmt(r.sobreTasaNocturna)}` },
                    { icon: 'fas fa-calculator', label: 'Base para HE (con nocturno)', value: `S/ ${fmt(r.baseParaHE)}` }
                ] : []),
                { icon: 'fas fa-clock', label: `Valor hora: ${fmt(r.baseParaHE)} / ${DATA.HORAS_MES_LEGAL}`, value: `S/ ${fmt(r.valorHora)}` }
            ]
        },
        {
            title: 'Desglose Horas Extras [PLAME]',
            rows: [
                { icon: 'fas fa-clock', label: `${r.horas25}h × S/ ${fmt(r.valorHora25)} (+25%)`, value: `S/ ${fmt(r.pagoHoras25)}`, class: 'positive' },
                { icon: 'fas fa-clock', label: `${r.horas35}h × S/ ${fmt(r.valorHora35)} (+35%)`, value: `S/ ${fmt(r.pagoHoras35)}`, class: 'positive' },
                { icon: 'fas fa-calculator', label: 'TOTAL HORAS EXTRAS', value: `S/ ${fmt(r.totalHorasExtras)}`, class: 'positive', total: true }
            ]
        },
        ...(afpTopeAplicado ? [{
            title: '⚠️ Tope SBS — AFP Prima de Seguro',
            rows: [
                { icon: 'fas fa-shield-halved', label: 'Remu. Máx. Asegurable (RMA)', value: `S/ ${fmt(DATA.AFP_SBS_TOPE)}` },
                { icon: 'fas fa-info-circle', label: 'Prima SIS calculada sobre tope', value: `S/ ${fmt(DATA.AFP_SBS_TOPE)} (no sobre ${fmt(sueldo)})` }
            ]
        }] : []),
        {
            title: 'Base Legal',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'D.S. 007-2002-TR' },
                { icon: 'fas fa-calculator', label: 'Divisor legal', value: `${DATA.HORAS_MES_LEGAL} horas/mes (30d × 8h)` },
                { icon: 'fas fa-shield-check', label: 'Método', value: 'PLAME-Style: roundPLAME por concepto' }
            ]
        }
    ];

    const total = r.totalHorasExtras;
    const barChart = [
        { label: 'Horas al 25%', value: r.pagoHoras25, percent: total > 0 ? CalcEngine.roundUI((r.pagoHoras25 / total) * 100) : 50, color: '#10b981' },
        { label: 'Horas al 35%', value: r.pagoHoras35, percent: total > 0 ? CalcEngine.roundUI((r.pagoHoras35 / total) * 100) : 50, color: '#f59e0b' }
    ];

    renderResult('result-horas-extras', {
        heroLabel: 'Total Horas Extras',
        heroAmount: r.totalHorasExtras,
        heroSub: `${r.horas25 + r.horas35} horas | Valor hora S/ ${fmt(r.valorHora)} | Divisor: ${DATA.HORAS_MES_LEGAL}h`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Horas extras calculadas — precisión SUNAT/PLAME', 'success');
}

// ─── 5. VACACIONES (con Triple Vacacional y promedio variable) ─
function calcularVacaciones(silent = false) {
    const sueldo = getVal('vac-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const noGozadas             = getChecked('vac-no-gozadas');
    const promedioComisiones12m = getVal('vac-promedio-comisiones') || 0;
    const vecesPercibidoAno     = parseInt(getVal('vac-veces-percibido')) || 0;

    const r = CalcEngine.vacaciones({
        sueldoBruto: sueldo,
        diasVacaciones: parseInt(getVal('vac-dias')) || 30,
        mesesLaborados: parseInt(getVal('vac-meses')) || 12,
        incluyeAsigFamiliar: false,
        noGozadas,
        promedioComisiones12m,
        vecesPercibidoAno
    });

    const sections = [
        {
            title: 'Remuneración Computable',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración', value: `S/ ${fmt(r.base.total)}` },
                ...(r.promVar > 0 ? [{
                    icon: 'fas fa-chart-line',
                    label: `Prom. Variable Anual (${vecesPercibidoAno} veces ≥3)`,
                    value: `S/ ${fmt(r.promVar)}`, class: 'positive'
                }] : []),
                ...(promedioComisiones12m > 0 && r.promVar === 0 ? [{
                    icon: 'fas fa-times-circle',
                    label: `Variable NO incluida (${vecesPercibidoAno} veces < 3)`,
                    value: `S/ ${fmt(promedioComisiones12m)}`, class: 'negative'
                }] : []),
                { icon: 'fas fa-calculator', label: 'Base computable', value: `S/ ${fmt(r.baseComputable)}`, total: true }
            ]
        },
        {
            title: 'Cálculo Vacacional',
            rows: [
                { icon: 'fas fa-calculator', label: 'Valor diario', value: `S/ ${fmt(r.valorDiario)}` },
                { icon: 'fas fa-umbrella-beach', label: 'Remu. Vacacional [PLAME]', value: `S/ ${fmt(r.remuVacacional)}`, class: 'positive' }
            ]
        },
        ...(noGozadas && r.tripleDetalle ? [{
            title: '⚖️ Triple Vacacional (Art. 23 D.Leg. 713)',
            rows: [
                { icon: 'fas fa-check', label: '1ª Remu. — por el trabajo (ya pagada)', value: `S/ ${fmt(r.tripleDetalle.porTrabajo)}`, class: 'positive' },
                { icon: 'fas fa-money-bill', label: '2ª Remu. — por el descanso no gozado', value: `S/ ${fmt(r.tripleDetalle.porDescanso)}`, class: 'positive' },
                { icon: 'fas fa-gavel', label: '3ª Remu. — indemnización', value: `S/ ${fmt(r.tripleDetalle.porIndemnizacion)}`, class: 'positive' },
                { icon: 'fas fa-exclamation-triangle', label: 'A pagar ahora (2ª + 3ª) [PLAME]', value: `S/ ${fmt(r.tripleDetalle.aPagarAhora)}`, class: 'negative total' }
            ]
        }] : []),
        {
            title: 'Resultado',
            rows: [
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL', value: `S/ ${fmt(r.total)}`, class: 'positive', total: true }
            ]
        }
    ];

    renderResult('result-vacaciones', {
        heroLabel: noGozadas ? 'Vacaciones No Gozadas — Triple' : 'Remuneración Vacacional',
        heroAmount: r.total,
        heroSub: noGozadas
            ? `Triple: S/ ${fmt(r.tripleDetalle?.totalTriple || 0)} | A pagar: S/ ${fmt(r.total)}`
            : `D. Leg. N° 713`,
        sections, auditLog: r.audit
    });

    if (!silent) showToast(noGozadas ? 'Triple Vacacional calculada' : 'Vacaciones calculadas', 'success');
}

// ─── 6. IMPUESTO A LA RENTA ──────────────────────────────────
function calcularImpuestoRenta(silent = false) {
    const sueldo = getVal('ir-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.impuestoRenta({
        sueldoBruto: sueldo,
        meses: parseInt(getVal('ir-meses')) || 12,
        numGratificaciones: parseInt(getVal('ir-gratificaciones')) || 2,
        incluyeAsigFamiliar: false,
        otrosIngresos: getVal('ir-otros')
    });

    const sections = [
        {
            title: 'Renta Bruta Anual',
            rows: [
                { icon: 'fas fa-coins', label: `Sueldos (${r.desglose.sueldosAnuales > 0 ? Math.round(r.desglose.sueldosAnuales / r.base.total) : 0} meses)`, value: `S/ ${fmt(r.desglose.sueldosAnuales)}` },
                { icon: 'fas fa-gift', label: 'Gratificaciones', value: `S/ ${fmt(r.desglose.gratAnuales)}` },
                { icon: 'fas fa-plus', label: 'Bonif. Extraordinaria 9%', value: `S/ ${fmt(r.desglose.bonifAnuales)}` },
                ...(r.desglose.otrosIngresos > 0 ? [{ icon: 'fas fa-plus', label: 'Otros ingresos', value: `S/ ${fmt(r.desglose.otrosIngresos)}` }] : []),
                { icon: 'fas fa-calculator', label: 'Renta Bruta Anual', value: `S/ ${fmt(r.rentaBrutaAnual)}`, total: true }
            ]
        },
        {
            title: 'Deducciones',
            rows: [
                { icon: 'fas fa-minus-circle', label: `Deducción 7 UIT (${DATA.UIT} × 7)`, value: `- S/ ${fmt(r.deduccion7UIT)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Renta Neta Anual', value: `S/ ${fmt(r.rentaNetaAnual)}`, total: true }
            ]
        },
        {
            title: 'Impuesto por Tramos',
            rows: [
                ...r.tramos.filter(t => t.baseGravable > 0).map(t => ({
                    icon: 'fas fa-layer-group',
                    label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%): S/ ${fmt(t.baseGravable)}`,
                    value: `S/ ${fmt(t.impuesto)}`
                })),
                { icon: 'fas fa-landmark', label: 'IR Anual', value: `S/ ${fmt(r.irAnual)}`, class: 'negative', total: true }
            ]
        },
        {
            title: 'Resumen',
            rows: [
                { icon: 'fas fa-calendar', label: 'Retención mensual est.', value: `S/ ${fmt(r.irMensual)}` },
                { icon: 'fas fa-percent', label: 'Tasa efectiva', value: `${CalcEngine.roundUI(r.tasaEfectiva)}%` }
            ]
        }
    ];

    const barChart = r.tramos.filter(t => t.impuesto > 0).map(t => ({
        label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`,
        value: t.impuesto,
        percent: r.irAnual > 0 ? CalcEngine.roundUI((t.impuesto / r.irAnual) * 100) : 0,
        color: t.color
    }));

    renderResult('result-impuesto-renta', {
        heroLabel: 'Impuesto a la Renta Anual',
        heroAmount: r.irAnual,
        heroSub: `Retención mensual: S/ ${fmt(r.irMensual)} | Tasa: ${CalcEngine.roundUI(r.tasaEfectiva)}%`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('IR calculado con proyección completa', 'success');
}

// ─── 7. LIQUIDACIÓN (con Triple Vacacional y EPS) ────────────
function calcularLiquidacion(silent = false) {
    const sueldo = getVal('liq-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const fechaIngreso = new Date(document.getElementById('liq-fecha-ingreso').value);
    const fechaCese    = new Date(document.getElementById('liq-fecha-cese').value);

    if (isNaN(fechaIngreso.getTime()) || isNaN(fechaCese.getTime())) {
        if (!silent) showToast('Ingresa fechas válidas', 'error'); return;
    }
    if (fechaCese <= fechaIngreso) {
        if (!silent) showToast('Fecha de cese debe ser posterior al ingreso', 'error'); return;
    }

    const vacNoGozadasDias = parseInt(getVal('liq-vac-no-gozadas-dias')) || 0;
    const tieneEPS         = getChecked('liq-eps');

    const r = CalcEngine.liquidacion({
        sueldoBruto: sueldo,
        fechaIngreso,
        fechaCese,
        motivo: getSelect('liq-motivo'),
        vacPendientes: parseInt(getVal('liq-vac-pendientes')) || 0,
        vacNoGozadasDias,
        incluyeAsigFamiliar: getChecked('liq-asig-familiar'),
        regimen: 'general',
        tieneEPS
    });

    const motivoTextos = {
        'renuncia':          'Renuncia voluntaria',
        'despido-arbitrario':'Despido arbitrario',
        'mutuo-acuerdo':     'Mutuo acuerdo',
        'fin-contrato':      'Fin de contrato'
    };

    const ts = r.tiempoServicio;

    const sections = [
        {
            title: 'Datos del Cese',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración', value: `S/ ${fmt(r.base.total)}` },
                { icon: 'fas fa-clock', label: 'Tiempo', value: `${ts.anos}a ${ts.meses}m ${ts.dias}d` },
                { icon: 'fas fa-ban', label: 'Motivo', value: motivoTextos[r.motivo] || r.motivo },
                ...(tieneEPS ? [{ icon: 'fas fa-hospital', label: 'EPS', value: 'Sí — Bonif. 6.75%' }] : [])
            ]
        },
        {
            title: 'Beneficios Truncos [PLAME]',
            rows: [
                { icon: 'fas fa-piggy-bank', label: 'CTS Trunca', value: `S/ ${fmt(r.ctsTrunca)}`, class: 'positive' },
                { icon: 'fas fa-gift', label: 'Gratificación Trunca', value: `S/ ${fmt(r.gratTrunca)}`, class: 'positive' },
                { icon: 'fas fa-plus', label: `Bonif. ${tieneEPS ? '6.75% (EPS)' : '9%'}`, value: `S/ ${fmt(r.bonifGratTrunca)}`, class: 'positive' },
                { icon: 'fas fa-umbrella-beach', label: 'Vacaciones Truncas', value: `S/ ${fmt(r.vacTruncas)}`, class: 'positive' },
                ...(r.vacPendientes > 0 ? [{
                    icon: 'fas fa-calendar-check',
                    label: `Vac. Pendientes Normales (${r.vacPendientes}d)`,
                    value: `S/ ${fmt(r.pagoVacPendientes)}`, class: 'positive'
                }] : []),
                ...(r.tripleVacacional > 0 ? [{
                    icon: 'fas fa-gavel',
                    label: `Triple Vacacional (${r.vacNoGozadasDias}d no gozados — Art. 23)`,
                    value: `S/ ${fmt(r.tripleVacacional)}`, class: 'positive'
                }] : []),
                ...(r.indemnizacion > 0 ? [{
                    icon: 'fas fa-gavel',
                    label: 'Indemnización Despido Arbitrario',
                    value: `S/ ${fmt(r.indemnizacion)}`, class: 'positive'
                }] : []),
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL LIQUIDACIÓN', value: `S/ ${fmt(r.totalLiquidacion)}`, class: 'positive', total: true }
            ]
        }
    ];

    const items = [
        { label: 'CTS Trunca',        value: r.ctsTrunca,                       color: '#6366f1' },
        { label: 'Gratif. + Bonif.',  value: r.gratTrunca + r.bonifGratTrunca,  color: '#10b981' },
        { label: 'Vacaciones',        value: r.vacTruncas + r.pagoVacPendientes, color: '#06b6d4' }
    ];
    if (r.tripleVacacional > 0) items.push({ label: 'Triple Vacacional', value: r.tripleVacacional, color: '#f59e0b' });
    if (r.indemnizacion > 0)    items.push({ label: 'Indemnización', value: r.indemnizacion, color: '#ef4444' });

    const barChart = items.map(i => ({
        ...i,
        percent: r.totalLiquidacion > 0 ? CalcEngine.roundUI((i.value / r.totalLiquidacion) * 100) : 0
    }));

    renderResult('result-liquidacion', {
        heroLabel: 'Total Liquidación',
        heroAmount: r.totalLiquidacion,
        heroSub: `${ts.anos} años, ${ts.meses} meses${r.tripleVacacional > 0 ? ' | Incluye Triple Vacacional' : ''}`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Liquidación calculada', 'success');
}

// ─── 8. ESSALUD ──────────────────────────────────────────────
function calcularEsSalud(silent = false) {
    const sueldo = getVal('es-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.essalud({
        sueldoBruto: sueldo,
        regimen: getSelect('es-regimen'),
        numTrabajadores: parseInt(getVal('es-trabajadores')) || 1,
        incluyeAsigFamiliar: false
    });

    const sections = [
        {
            title: 'Cálculo',
            rows: [
                { icon: 'fas fa-coins', label: 'Base', value: `S/ ${fmt(r.base.total)}` },
                { icon: 'fas fa-percent', label: 'Tasa', value: `${(r.tasaInfo.tasa * 100).toFixed(1)}%` },
                { icon: 'fas fa-calculator', label: 'Aporte unitario [PLAME]', value: `S/ ${fmt(r.aporteReal)}` },
                { icon: 'fas fa-users', label: `× ${r.numTrabajadores} trabajador(es)`, value: `S/ ${fmt(r.aporteTotal)}`, total: true },
                { icon: 'fas fa-calendar', label: 'Aporte anual', value: `S/ ${fmt(r.aporteAnual)}` }
            ]
        }
    ];

    renderResult('result-essalud', {
        heroLabel: 'Aporte EsSalud Mensual',
        heroAmount: r.aporteTotal,
        heroSub: `${r.tasaInfo.nombre} | ${r.numTrabajadores} trabajador(es)`,
        sections, auditLog: r.audit
    });

    if (!silent) showToast('EsSalud calculado', 'success');
}

// ─── 9. UTILIDADES ───────────────────────────────────────────
function calcularUtilidades(silent = false) {
    const renta = getVal('util-renta');
    if (renta <= 0) { if (!silent) showToast('Ingresa la renta de la empresa', 'error'); return; }

    const r = CalcEngine.utilidades({
        rentaEmpresa: renta,
        porcentajeSector: parseInt(getSelect('util-sector')),
        diasTrabajados: parseInt(getVal('util-dias-trabajados')) || 360,
        totalDiasTodos: parseInt(getVal('util-total-dias')) || 1,
        remuAnual: getVal('util-remu-anual'),
        totalRemuTodos: getVal('util-total-remu') || 1
    });

    const sections = [
        {
            title: 'Distribución',
            rows: [
                { icon: 'fas fa-building', label: 'Monto a distribuir', value: `S/ ${fmt(r.montoDistribuir)}` },
                { icon: 'fas fa-calendar-check', label: '50% por días [PLAME]', value: `S/ ${fmt(r.porDias)}`, class: 'positive' },
                { icon: 'fas fa-coins', label: '50% por remuneraciones [PLAME]', value: `S/ ${fmt(r.porRemu)}`, class: 'positive' },
                ...(r.excedente > 0 ? [{ icon: 'fas fa-exclamation-triangle', label: `Tope 18 remu (S/ ${fmt(r.tope)})`, value: `Excede: S/ ${fmt(r.excedente)}`, class: 'negative' }] : []),
                { icon: 'fas fa-chart-pie', label: 'UTILIDADES', value: `S/ ${fmt(r.totalFinal)}`, class: 'positive', total: true }
            ]
        }
    ];

    const barChart = [
        { label: '50% Días',          value: r.porDias, percent: r.totalCalculado > 0 ? CalcEngine.roundUI((r.porDias / r.totalCalculado) * 100) : 50, color: '#6366f1' },
        { label: '50% Remuneraciones',value: r.porRemu, percent: r.totalCalculado > 0 ? CalcEngine.roundUI((r.porRemu / r.totalCalculado) * 100) : 50, color: '#10b981' }
    ];

    renderResult('result-utilidades', {
        heroLabel: 'Tus Utilidades',
        heroAmount: r.totalFinal,
        heroSub: 'D. Leg. N° 892',
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Utilidades calculadas', 'success');
}

// ─── 10. ASIGNACIÓN FAMILIAR ─────────────────────────────────
function calcularAsignacionFamiliar(silent = false) {
    const r = CalcEngine.asignacionFamiliar({
        numHijos: parseInt(getVal('af-hijos')) || 0
    });

    const sections = [
        {
            title: 'Cálculo 2026',
            rows: [
                { icon: 'fas fa-coins', label: `RMV 2026`, value: `S/ ${fmt(r.rmv)}` },
                { icon: 'fas fa-percent', label: 'Tasa', value: `${r.porcentaje * 100}%` },
                { icon: 'fas fa-calculator', label: `${r.rmv} × ${r.porcentaje * 100}% [PLAME]`, value: `S/ ${fmt(r.montoMensual)}` },
                { icon: 'fas fa-baby', label: 'Hijos', value: r.numHijos },
                { icon: 'fas fa-check', label: 'Derecho', value: r.tieneDerechoFlag ? 'SÍ' : 'NO' },
                { icon: 'fas fa-money-bill-wave', label: 'Monto Mensual', value: `S/ ${fmt(r.montoMensual)}`, class: r.montoMensual > 0 ? 'positive' : '', total: true },
                { icon: 'fas fa-calendar', label: 'Monto Anual', value: `S/ ${fmt(r.montoAnual)}` }
            ]
        }
    ];

    renderResult('result-asignacion-familiar', {
        heroLabel: 'Asignación Familiar',
        heroAmount: r.montoMensual,
        heroSub: r.tieneDerechoFlag
            ? `RMV ${r.rmv} × 10% = S/ ${fmt(r.montoMensual)} fijo`
            : 'Sin derecho (requiere al menos 1 hijo)',
        sections, auditLog: r.audit
    });

    if (!silent) showToast('Asignación familiar calculada', 'success');
}

// ─── 11. RENTA 5TA DETALLADA ─────────────────────────────────
function calcularRentaQuinta(silent = false) {
    const sueldo = getVal('r5-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.rentaQuintaDetallada({
        sueldoBruto: sueldo,
        mesCalculo: parseInt(getSelect('r5-mes')) || 12,
        remuPercibidas: getVal('r5-recibido'),
        gratPercibidas: 0,
        incluyeAsigFamiliar: false,
        otrosIngresos: 0
    });

    const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesNombre = meses[parseInt(getSelect('r5-mes')) || 12];

    const sections = [
        {
            title: 'Paso 1: Proyección Renta Bruta',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneraciones percibidas', value: `S/ ${fmt(r.desglose.remuPercibidas)}` },
                { icon: 'fas fa-arrow-right', label: `Proyección (${r.desglose.mesesRestantes}m)`, value: `S/ ${fmt(r.desglose.proyeccionSueldos)}` },
                { icon: 'fas fa-gift', label: 'Gratificaciones pendientes', value: `S/ ${fmt(r.desglose.gratPendientes)}` },
                { icon: 'fas fa-plus', label: 'Bonif. extraordinarias 9%', value: `S/ ${fmt(r.desglose.bonifPendientes)}` },
                { icon: 'fas fa-calculator', label: 'Renta Bruta Anual', value: `S/ ${fmt(r.rentaBrutaAnual)}`, total: true }
            ]
        },
        {
            title: 'Paso 2: Renta Neta',
            rows: [
                { icon: 'fas fa-minus-circle', label: `Deducción 7 UIT (S/ ${DATA.UIT} × 7)`, value: `- S/ ${fmt(r.deduccion7UIT)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Renta Neta', value: `S/ ${fmt(r.rentaNetaAnual)}`, total: true }
            ]
        },
        {
            title: 'Paso 3: IR por Tramos',
            rows: [
                ...r.tramos.filter(t => t.baseGravable > 0).map(t => ({
                    icon: 'fas fa-layer-group',
                    label: `${t.nombre}: S/ ${fmt(t.baseGravable)} × ${(t.tasa * 100).toFixed(0)}%`,
                    value: `S/ ${fmt(t.impuesto)}`
                })),
                { icon: 'fas fa-landmark', label: 'IR Anual', value: `S/ ${fmt(r.irAnual)}`, class: 'negative', total: true }
            ]
        },
        {
            title: `Paso 4: Retención ${mesNombre}`,
            rows: [
                { icon: 'fas fa-divide', label: `Divisor (${mesNombre})`, value: r.divisor },
                { icon: 'fas fa-money-bill-wave', label: 'RETENCIÓN', value: `S/ ${fmt(r.retencionMensual)}`, class: 'negative', total: true }
            ]
        }
    ];

    const barChart = r.tramos.filter(t => t.impuesto > 0).map(t => ({
        label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`,
        value: t.impuesto,
        percent: r.irAnual > 0 ? CalcEngine.roundUI((t.impuesto / r.irAnual) * 100) : 0,
        color: t.color
    }));

    renderResult('result-renta-quinta', {
        heroLabel: `Retención IR — ${mesNombre}`,
        heroAmount: r.retencionMensual,
        heroSub: `IR Anual: S/ ${fmt(r.irAnual)} | Divisor: ${r.divisor} | UIT: S/ ${DATA.UIT}`,
        sections, barChart, auditLog: r.audit
    });

    if (!silent) showToast('Retención calculada con proyección real', 'success');
}

// ─── 12. COSTO EMPLEADOR + COMPARADOR PRO ────────────────────
function calcularCostoEmpleador(silent = false) {
    const sueldo = getVal('ce-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const regimenKey   = getSelect('ce-regimen');
    const incluyeAF    = getChecked('ce-asig-familiar');
    const incluyeSCTR  = getChecked('ce-sctr');
    const tieneEPS     = getChecked('ce-eps');
    const anosServicio = parseInt(getVal('ce-anos-servicio')) || 2;

    const r = CalcEngine.costoEmpleador({
        sueldoBruto: sueldo,
        regimen: regimenKey,
        incluyeAsigFamiliar: incluyeAF,
        incluyeSCTR,
        anosServicio,
        tieneEPS
    });

    // Comparador PRO — 3 regímenes
    const comp = CalcEngine.comparadorRegimenes({
        sueldoBruto: sueldo,
        incluyeAsigFamiliar: incluyeAF,
        incluyeSCTR,
        anosServicio,
        tieneEPS
    });

    const d = r.desglose;

    const sections = [
        {
            title: 'Remuneración Base',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Bruto', value: `S/ ${fmt(r.base.sueldoBruto)}` },
                ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: `Asig. Familiar (RMV ${DATA.RMV}×10%)`, value: `S/ ${fmt(r.base.asigFamiliar)}` }] : []),
                { icon: 'fas fa-calculator', label: 'Base', value: `S/ ${fmt(r.base.total)}`, total: true }
            ]
        },
        {
            title: `Costos del Empleador — ${r.regimen.nombre} [PLAME]`,
            rows: [
                { icon: 'fas fa-heart-pulse', label: `EsSalud (${(r.regimen.essalud_tasa * 100).toFixed(1)}%)`, value: `S/ ${fmt(d.essaludMensual)}`, class: 'negative' },
                ...(d.ctsMensualizada > 0 ? [{ icon: 'fas fa-piggy-bank', label: 'CTS (mensualizada)', value: `S/ ${fmt(d.ctsMensualizada)}`, class: 'negative' }] : []),
                ...(d.gratMensualizada > 0 ? [{ icon: 'fas fa-gift', label: 'Gratificaciones (mensualizadas)', value: `S/ ${fmt(d.gratMensualizada)}`, class: 'negative' }] : []),
                ...(d.bonifMensualizada > 0 ? [{ icon: 'fas fa-plus', label: `Bonif. ${tieneEPS ? '6.75% EPS' : '9%'} (mensualizada)`, value: `S/ ${fmt(d.bonifMensualizada)}`, class: 'negative' }] : []),
                { icon: 'fas fa-umbrella-beach', label: 'Vacaciones (mensualizada)', value: `S/ ${fmt(d.vacMensualizada)}`, class: 'negative' },
                ...(d.sctrMensual > 0 ? [{ icon: 'fas fa-shield-halved', label: 'SCTR', value: `S/ ${fmt(d.sctrMensual)}`, class: 'negative' }] : []),
                ...(d.vidaLeyMensual > 0 ? [{ icon: 'fas fa-heart', label: 'Vida Ley', value: `S/ ${fmt(d.vidaLeyMensual)}`, class: 'negative' }] : []),
                { icon: 'fas fa-building', label: 'COSTO TOTAL MENSUAL', value: `S/ ${fmt(r.costoTotalMensual)}`, class: 'negative', total: true }
            ]
        },
        {
            title: 'Costo de Liquidación (estimado)',
            rows: [
                { icon: 'fas fa-gavel', label: 'Indemnización estimada', value: `S/ ${fmt(r.liquidacion.indemnizacionEstimada)}`, class: 'negative' },
                { icon: 'fas fa-calendar', label: 'Beneficios truncos est.', value: `S/ ${fmt(r.liquidacion.beneficiosTruncos)}`, class: 'negative' },
                { icon: 'fas fa-coins', label: 'COSTO LABORAL ANUAL TOTAL', value: `S/ ${fmt(r.costoLaboralAnualTotal)}`, class: 'negative', total: true }
            ]
        },
        {
            title: 'Resumen',
            rows: [
                { icon: 'fas fa-percent', label: 'Sobrecosto s/ sueldo', value: `+${CalcEngine.roundUI(r.porcentajeSobrecosto)}%` },
                { icon: 'fas fa-calendar', label: 'Costo anual contratar', value: `S/ ${fmt(r.costoTotalAnual)}` }
            ]
        }
    ];

    const barItems = [
        { label: 'Remuneración', value: r.base.total, color: '#10b981' },
        { label: 'EsSalud',       value: d.essaludMensual, color: '#ef4444' },
        { label: 'CTS',           value: d.ctsMensualizada, color: '#6366f1' },
        { label: 'Gratif.+Bonif.',value: d.gratMensualizada + d.bonifMensualizada, color: '#f59e0b' },
        { label: 'Vacaciones',    value: d.vacMensualizada, color: '#06b6d4' }
    ];
    if (d.sctrMensual > 0)     barItems.push({ label: 'SCTR',     value: d.sctrMensual,    color: '#ec4899' });
    if (d.vidaLeyMensual > 0)  barItems.push({ label: 'Vida Ley', value: d.vidaLeyMensual, color: '#8b5cf6' });

    const barChart = barItems.filter(i => i.value > 0).map(i => ({
        ...i,
        percent: r.costoTotalMensual > 0 ? CalcEngine.roundUI((i.value / r.costoTotalMensual) * 100) : 0
    }));

    renderResult('result-costo-empleador', {
        heroLabel: 'Costo Laboral Anual Total',
        heroAmount: r.costoLaboralAnualTotal,
        heroSub: `Mensual: S/ ${fmt(r.costoTotalMensual)} | Sobrecosto: +${CalcEngine.roundUI(r.porcentajeSobrecosto)}% | ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`,
        sections,
        barChart,
        extraTable: comp,      // ← Comparador PRO como tabla HTML completa
        auditLog: r.audit + '\n\n' + comp.audit
    });

    if (!silent) showToast('Costo empleador + Comparador PRO calculados', 'success');
}
