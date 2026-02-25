/* ================================================================
   SueldoPro Ultra v4.0 - UI & CONTROLLER LAYER
   ================================================================
   Separación total: CalcEngine (data.js) ↔ UI (script.js)
   - Lee inputs del DOM
   - Invoca CalcEngine (funciones puras)
   - Renderiza resultados
   - Maneja perfiles, live-binding, auditoría
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
    initPerfiles();
});

// ─── Loader ──────────────────────────────────
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }, 1500);
}

// ─── Theme ───────────────────────────────────
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

// ─── Navbar ──────────────────────────────────
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
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
        links.forEach(l => l.classList.toggle('active', l.getAttribute('data-section') === current));
    });
    links.forEach(l => l.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
    }));
}

// ─── Particles ───────────────────────────────
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    function create() {
        particles = [];
        const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.1
            });
        }
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        const rgb = dark ? '148,163,184' : '99,102,241';
        particles.forEach((p, i) => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb},${p.opacity})`; ctx.fill();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x, dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${rgb},${0.04 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animate);
    }
    resize(); create(); animate();
    window.addEventListener('resize', () => { resize(); create(); });
}

// ─── Tabs ────────────────────────────────────
function initTabs() {
    document.querySelectorAll('.calc-tab').forEach(tab => {
        tab.addEventListener('click', () => activateCalc(tab.getAttribute('data-calc')));
    });
}

function activateCalc(calcId) {
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.calc-tab[data-calc="${calcId}"]`);
    if (tab) tab.classList.add('active');
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${calcId}`);
    if (panel) panel.classList.add('active');
    scrollToSection('calculadoras');
}

// ─── FAQ ─────────────────────────────────────
function initFAQ() {
    const list = document.getElementById('faqList');
    if (!list) return;
    DATA.FAQ.forEach(item => {
        const el = document.createElement('div');
        el.className = 'faq-item';
        el.innerHTML = `<button class="faq-question" onclick="toggleFAQ(this)"><span>${item.pregunta}</span><i class="fas fa-chevron-down"></i></button><div class="faq-answer"><div class="faq-answer-inner">${item.respuesta}</div></div>`;
        list.appendChild(el);
    });
}
function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const wasActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!wasActive) item.classList.add('active');
}

// ─── Counters ────────────────────────────────
function initCounters() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-number[data-count]').forEach(c => obs.observe(c));
}
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const start = performance.now();
    (function update(now) {
        const p = Math.min((now - start) / 2000, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(update); else el.textContent = target.toLocaleString();
    })(start);
}

// ─── Dates ───────────────────────────────────
function initDates() {
    const today = new Date().toISOString().split('T')[0];
    const cese = document.getElementById('liq-fecha-cese');
    if (cese) cese.value = today;
    const ingreso = document.getElementById('liq-fecha-ingreso');
    if (ingreso) { const d = new Date(); d.setFullYear(d.getFullYear() - 1); ingreso.value = d.toISOString().split('T')[0]; }
}

// ─── Perfiles ────────────────────────────────
function initPerfiles() {
    // Render profile list if container exists
    renderPerfiles();
}

function renderPerfiles() {
    const container = document.getElementById('perfilesLista');
    if (!container) return;
    const perfiles = CalcEngine.listarPerfiles();
    if (perfiles.length === 0) {
        container.innerHTML = '<p class="form-hint">No hay perfiles guardados</p>';
        return;
    }
    container.innerHTML = perfiles.map(p =>
        `<div class="perfil-item">
            <span>${p.nombre}</span>
            <div>
                <button class="btn-perfil" onclick="cargarPerfilUI('${p.nombre}')"><i class="fas fa-upload"></i></button>
                <button class="btn-perfil btn-perfil-danger" onclick="eliminarPerfilUI('${p.nombre}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>`
    ).join('');
}

function guardarPerfilUI() {
    const nombre = prompt('Nombre del perfil:');
    if (!nombre) return;
    const datos = {
        sueldoBruto: getVal('sn-sueldo-bruto'),
        regimen: getSelect('sn-regimen'),
        pension: getSelect('sn-pension'),
        tipoComision: getSelect('sn-tipo-comision') || 'flujo',
        asigFamiliar: getChecked('sn-asig-familiar'),
        tieneEPS: getChecked('sn-tiene-eps'),
        promedioComisiones: getVal('sn-promedio-comisiones'),
        promedioBonos: getVal('sn-promedio-bonos'),
        diasFaltados: getVal('sn-dias-faltados')
    };
    CalcEngine.guardarPerfil(nombre, datos);
    showToast(`Perfil "${nombre}" guardado`, 'success');
    renderPerfiles();
}

function cargarPerfilUI(nombre) {
    const datos = CalcEngine.cargarPerfil(nombre);
    if (!datos) { showToast('Perfil no encontrado', 'error'); return; }
    setVal('sn-sueldo-bruto', datos.sueldoBruto);
    setSelect('sn-regimen', datos.regimen);
    setSelect('sn-pension', datos.pension);
    setChecked('sn-asig-familiar', datos.asigFamiliar);
    setChecked('sn-tiene-eps', datos.tieneEPS);
    setVal('sn-promedio-comisiones', datos.promedioComisiones);
    setVal('sn-promedio-bonos', datos.promedioBonos);
    setVal('sn-dias-faltados', datos.diasFaltados);
    showToast(`Perfil "${nombre}" cargado`, 'info');
    calcularSueldoNeto(true);
}

function eliminarPerfilUI(nombre) {
    if (!confirm(`¿Eliminar perfil "${nombre}"?`)) return;
    CalcEngine.eliminarPerfil(nombre);
    showToast(`Perfil "${nombre}" eliminado`, 'info');
    renderPerfiles();
}


// ═══════════════════════════════════════════════
//  LIVE BINDINGS (Debounce 300ms)
// ═══════════════════════════════════════════════
function initLiveBindings() {
    const bindings = {
        'sueldo-neto': { ids: ['sn-sueldo-bruto','sn-regimen','sn-pension','sn-tipo-comision','sn-asig-familiar','sn-tiene-eps','sn-meses','sn-promedio-comisiones','sn-promedio-bonos','sn-dias-faltados','sn-movilidad','sn-refrigerio'], fn: calcularSueldoNeto },
        'gratificacion': { ids: ['grat-sueldo','grat-periodo','grat-meses','grat-asig-familiar','grat-bonif-tipo','grat-promedio-comisiones','grat-promedio-bonos'], fn: calcularGratificacion },
        'cts': { ids: ['cts-sueldo','cts-meses','cts-dias','cts-asig-familiar','cts-gratificacion','cts-promedio-comisiones','cts-promedio-bonos'], fn: calcularCTS },
        'horas-extras': { ids: ['he-sueldo','he-horas-25','he-horas-35','he-asig-familiar','he-nocturno','he-promedio-comisiones','he-promedio-bonos','he-divisor-tipo'], fn: calcularHorasExtras },
        'vacaciones': { ids: ['vac-sueldo','vac-dias','vac-meses','vac-triple','vac-promedio-comisiones','vac-promedio-bonos'], fn: calcularVacaciones },
        'impuesto-renta': { ids: ['ir-sueldo','ir-meses','ir-gratificaciones','ir-otros','ir-tiene-eps'], fn: calcularImpuestoRenta },
        'liquidacion': { ids: ['liq-sueldo','liq-fecha-ingreso','liq-fecha-cese','liq-motivo','liq-vac-pendientes','liq-asig-familiar','liq-triple-vacacional','liq-tiene-eps','liq-promedio-comisiones','liq-promedio-bonos'], fn: calcularLiquidacion },
        'essalud': { ids: ['es-sueldo','es-trabajadores','es-regimen'], fn: calcularEsSalud },
        'utilidades': { ids: ['util-renta','util-sector','util-dias-trabajados','util-total-dias','util-remu-anual','util-total-remu'], fn: calcularUtilidades },
        'asignacion-familiar': { ids: ['af-hijos'], fn: calcularAsignacionFamiliar },
        'renta-quinta': { ids: ['r5-sueldo','r5-mes','r5-recibido','r5-grat-recibidas','r5-tiene-eps','r5-promedio-comisiones','r5-promedio-bonos'], fn: calcularRentaQuinta },
        'costo-empleador': { ids: ['ce-sueldo','ce-regimen','ce-asig-familiar','ce-sctr','ce-tiene-eps','ce-promedio-comisiones','ce-promedio-bonos'], fn: calcularCostoEmpleador }
    };

    function debounce(fn, ms = 300) {
        let timer;
        return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
    }

    for (const [, { ids, fn }] of Object.entries(bindings)) {
        const debouncedFn = debounce(() => {
            const mainEl = document.getElementById(ids[0]);
            if (mainEl && mainEl.value && parseFloat(mainEl.value) > 0) fn(true);
        }, 300);
        ids.forEach(id => {
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
function scrollToSection(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const icons = { success: 'fas fa-check-circle', error: 'fas fa-exclamation-circle', info: 'fas fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('toast-out'); setTimeout(() => toast.remove(), 300); }, 4000);
}

function getVal(id) { const el = document.getElementById(id); if (!el) return 0; const v = parseFloat(el.value); return isNaN(v) ? 0 : v; }
function getChecked(id) { const el = document.getElementById(id); return el ? el.checked : false; }
function getSelect(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function setVal(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }
function setSelect(id, v) { const el = document.getElementById(id); if (el) el.value = v || ''; }
function setChecked(id, v) { const el = document.getElementById(id); if (el) el.checked = !!v; }
const fmt = CalcEngine.formatMoney;


// ═══════════════════════════════════════════════
//  RENDER ENGINE
// ═══════════════════════════════════════════════
function renderResult(targetId, config) {
    const { heroLabel, heroAmount, heroSub, sections, barChart, auditLog, matrizComparador } = config;

    let html = `<div class="result-card">
        <div class="result-hero">
            <div class="result-hero-label">${heroLabel}</div>
            <div class="result-hero-amount">S/ ${fmt(heroAmount)}</div>
            ${heroSub ? `<div class="result-hero-sub">${heroSub}</div>` : ''}
        </div><div class="result-body">`;

    for (const section of sections) {
        html += `<div class="result-section">`;
        if (section.title) html += `<div class="result-section-title">${section.title}</div>`;
        for (const row of section.rows) {
            html += `<div class="result-row${row.total ? ' total' : ''}">
                <span class="result-row-label">${row.icon ? `<i class="${row.icon}"></i>` : ''}${row.label}</span>
                <span class="result-row-value ${row.class || ''}">${row.value}</span>
            </div>`;
        }
        html += `</div>`;
    }

    // Matriz comparador
    if (matrizComparador) {
        html += `<div class="result-section"><div class="result-section-title"><i class="fas fa-table"></i> Matriz Comparativa de Regímenes</div>`;
        html += `<div class="comparador-table-wrap"><table class="comparador-table"><thead><tr>`;
        matrizComparador.headers.forEach(h => { html += `<th>${h}</th>`; });
        html += `</tr></thead><tbody>`;
        matrizComparador.rows.forEach((row, idx) => {
            const isTotal = row[0].includes('COSTO') || row[0].includes('Sobrecosto');
            html += `<tr class="${isTotal ? 'comparador-total-row' : ''}">`;
            row.forEach((cell, ci) => {
                if (ci === 0) {
                    html += `<td class="comparador-label">${cell}</td>`;
                } else if (typeof cell === 'number') {
                    const isPercent = row[0].includes('%');
                    html += `<td class="comparador-value">${isPercent ? CalcEngine.plameRound(cell) + '%' : 'S/ ' + fmt(cell)}</td>`;
                } else {
                    html += `<td>${cell}</td>`;
                }
            });
            html += `</tr>`;
        });
        html += `</tbody></table></div></div>`;
    }

    // Bar chart
    if (barChart && barChart.length > 0) {
        html += `<div class="result-section"><div class="result-section-title">Distribución Visual</div><div class="result-bar-chart">`;
        for (const item of barChart) {
            html += `<div class="bar-chart-item"><div class="bar-chart-label"><span>${item.label}</span><span>S/ ${fmt(item.value)}</span></div><div class="bar-chart-track"><div class="bar-chart-fill" style="width:${item.percent}%;background:${item.color}"></div></div></div>`;
        }
        html += `</div></div>`;
    }

    // Audit log
    if (auditLog) {
        html += `<div class="result-section">
            <div class="result-section-title"><i class="fas fa-terminal"></i> Log de Auditoría
                <button class="audit-toggle-btn" onclick="this.closest('.result-section').querySelector('.audit-log').classList.toggle('expanded')"><i class="fas fa-chevron-down"></i> Ver</button>
            </div>
            <div class="audit-log"><pre>${auditLog}</pre></div>
        </div>`;
    }

    html += `</div><div class="result-actions">
        <button class="btn-result-action btn-result-primary" onclick="window.print()"><i class="fas fa-print"></i> Imprimir</button>
        <button class="btn-result-action btn-result-secondary" onclick="copyResult(this)"><i class="fas fa-copy"></i> Copiar</button>
    </div></div>`;

    const target = document.getElementById(targetId);
    if (target) target.innerHTML = html;
}

function copyResult(btn) {
    const text = btn.closest('.result-card').querySelector('.result-body').innerText;
    navigator.clipboard.writeText(text).then(() => showToast('Copiado', 'success')).catch(() => showToast('Error', 'error'));
}


// ═══════════════════════════════════════════════
//  CONTROLADORES DE CALCULADORAS
// ═══════════════════════════════════════════════

// ─── 1. SUELDO NETO ─────────────────────────
function calcularSueldoNeto(silent = false) {
    const bruto = getVal('sn-sueldo-bruto');
    if (bruto <= 0) { if (!silent) showToast('Ingresa la remuneración bruta', 'error'); return; }

    const r = CalcEngine.sueldoNeto({
        sueldoBruto: bruto,
        regimen: getSelect('sn-regimen'),
        tipoPension: getSelect('sn-pension'),
        tipoComision: getSelect('sn-tipo-comision') || 'flujo',
        incluyeAsigFamiliar: getChecked('sn-asig-familiar'),
        mesCalculo: parseInt(getVal('sn-meses')) || 6,
        tieneEPS: getChecked('sn-tiene-eps'),
        promedioComisiones: getVal('sn-promedio-comisiones'),
        promedioBonos: getVal('sn-promedio-bonos'),
        diasFaltados: getVal('sn-dias-faltados'),
        conceptosNoRemunerativos: {
            movilidad: getVal('sn-movilidad'),
            refrigerio: getVal('sn-refrigerio')
        }
    });

    // Auditoría de integridad
    const auditoria = CalcEngine.auditarIntegridad({
        sueldoBruto: bruto,
        tipoPension: getSelect('sn-pension'),
        resultadoNeto: r
    });

    const sections = [
        {
            title: 'Ingresos',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Bruto', value: `S/ ${fmt(r.base.sueldoBruto)}`, class: 'positive' },
                ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: `Asig. Familiar (${DATA.ASIGNACION_FAMILIAR_PCT * 100}% RMV)`, value: `S/ ${fmt(r.base.asigFamiliar)}`, class: 'positive' }] : []),
                ...(r.base.comisionesComputable > 0 ? [{ icon: 'fas fa-chart-line', label: 'Prom. Comisiones (6m)', value: `S/ ${fmt(r.base.comisionesComputable)}`, class: 'positive' }] : []),
                ...(r.base.bonosComputable > 0 ? [{ icon: 'fas fa-star', label: 'Prom. Bonos (6m)', value: `S/ ${fmt(r.base.bonosComputable)}`, class: 'positive' }] : []),
                { icon: 'fas fa-calculator', label: 'Base Bruta', value: `S/ ${fmt(r.base.baseBruta)}`, total: true }
            ]
        },
        ...(r.base.descuentoInasistencias > 0 ? [{
            title: `Inasistencias (${r.base.diasFaltados} días × factor ${DATA.FACTOR_DESCUENTO_INASISTENCIA})`,
            rows: [
                { icon: 'fas fa-calendar-xmark', label: 'Descuento con dominical', value: `- S/ ${fmt(r.base.descuentoInasistencias)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Base Neta', value: `S/ ${fmt(r.base.baseNeta)}`, total: true }
            ]
        }] : []),
        {
            title: `Descuentos — ${r.pension.nombre} (${r.pension.tipoComision})`,
            rows: [
                ...r.pension.detalle.map(d => ({
                    icon: 'fas fa-minus-circle', label: d.concepto + (d.topeAplicado ? ' ⚠' : ''), value: `- S/ ${fmt(d.monto)}`, class: 'negative'
                })),
                {
                    icon: 'fas fa-landmark',
                    label: `IR 5ta (${r.ir.tasaBonif === DATA.BONIF_EPS ? 'EPS' : 'EsSalud'})`,
                    value: r.ir.mensual > 0 ? `- S/ ${fmt(r.ir.mensual)}` : 'S/ 0.00',
                    class: r.ir.mensual > 0 ? 'negative' : ''
                },
                { icon: 'fas fa-minus-circle', label: 'Total Descuentos', value: `- S/ ${fmt(r.totalDescuentos)}`, class: 'negative', total: true }
            ]
        },
        ...(r.conceptosNoRemunerativos > 0 ? [{
            title: 'Conceptos No Remunerativos',
            rows: [
                { icon: 'fas fa-bus', label: 'Total no remunerativo', value: `S/ ${fmt(r.conceptosNoRemunerativos)}` },
                { icon: 'fas fa-wallet', label: 'Total en Boleta', value: `S/ ${fmt(r.totalBoleta)}`, class: 'positive', total: true }
            ]
        }] : []),
        {
            title: `Auditoría (${auditoria.pass ? '✓ PASS' : '✗ FAIL'})`,
            rows: [
                { icon: 'fas fa-shield-halved', label: 'Integridad', value: auditoria.pass ? '✓ Verificado' : `✗ Dif: ${auditoria.diferencia}` },
                { icon: 'fas fa-file-invoice', label: 'PLAME', value: `S/ ${auditoria.netoPLAME}` },
                { icon: 'fas fa-percent', label: '% Descuento', value: `${CalcEngine.plameRound(r.porcentajeDescuento)}%` }
            ]
        }
    ];

    const maxVal = r.base.baseNeta;
    const barChart = [
        { label: 'Sueldo Neto', value: r.sueldoNeto, percent: CalcEngine.plameRound((r.sueldoNeto / maxVal) * 100), color: '#10b981' },
        { label: 'Pensión', value: r.pension.total, percent: CalcEngine.plameRound((r.pension.total / maxVal) * 100), color: '#6366f1' },
        { label: 'IR 5ta', value: r.ir.mensual, percent: Math.max(1, CalcEngine.plameRound((r.ir.mensual / maxVal) * 100)), color: '#ef4444' },
        ...(r.base.descuentoInasistencias > 0 ? [{ label: 'Inasistencias', value: r.base.descuentoInasistencias, percent: CalcEngine.plameRound((r.base.descuentoInasistencias / r.base.baseBruta) * 100), color: '#f97316' }] : [])
    ];

    renderResult('result-sueldo-neto', {
        heroLabel: 'Tu Sueldo Neto Mensual',
        heroAmount: r.sueldoNeto,
        heroSub: `Base: S/ ${fmt(r.base.baseNeta)} | ${r.pension.nombre} | PLAME: S/ ${auditoria.netoPLAME}`,
        sections, barChart, auditLog: r.audit + '\n\n' + auditoria.audit
    });
    if (!silent) showToast('Sueldo neto calculado — auditoría ' + (auditoria.pass ? 'PASS ✓' : 'FAIL ✗'), auditoria.pass ? 'success' : 'error');
}

// ─── 2. GRATIFICACIÓN ───────────────────────
function calcularGratificacion(silent = false) {
    const sueldo = getVal('grat-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const tipoStr = getSelect('grat-bonif-tipo') || 'essalud';
    const r = CalcEngine.gratificacion({
        sueldoBruto: sueldo,
        periodo: getSelect('grat-periodo'),
        mesesTrabajados: parseInt(getVal('grat-meses')) || 6,
        incluyeAsigFamiliar: getChecked('grat-asig-familiar'),
        tieneEPS: tipoStr === 'eps',
        promedioComisiones: getVal('grat-promedio-comisiones'),
        promedioBonos: getVal('grat-promedio-bonos')
    });

    const sections = [
        { title: 'Cálculo', rows: [
            { icon: 'fas fa-coins', label: 'Base Beneficios', value: `S/ ${fmt(r.base.baseBeneficios)}` },
            ...(r.base.comisionesComputable > 0 ? [{ icon: 'fas fa-chart-line', label: 'Incl. Comisiones', value: `S/ ${fmt(r.base.comisionesComputable)}` }] : []),
            { icon: 'fas fa-calendar', label: 'Meses', value: `${r.mesesEfectivos} / 6` },
            { icon: 'fas fa-gift', label: 'Gratificación', value: `S/ ${fmt(r.gratificacionBase)}`, class: 'positive' }
        ]},
        { title: `Bonificación (${r.tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'})`, rows: [
            { icon: 'fas fa-plus-circle', label: `Bonif. ${(r.tasaBonif * 100).toFixed(2)}%`, value: `S/ ${fmt(r.bonifExtraordinaria)}`, class: 'positive' },
            { icon: 'fas fa-money-bill-wave', label: 'TOTAL', value: `S/ ${fmt(r.totalRecibir)}`, class: 'positive', total: true }
        ]}
    ];

    renderResult('result-gratificacion', {
        heroLabel: `Gratificación ${r.periodo.nombre}`,
        heroAmount: r.totalRecibir,
        heroSub: `${r.mesesEfectivos}m | ${r.tieneEPS ? 'EPS' : 'EsSalud'}`,
        sections, auditLog: r.audit
    });
    if (!silent) showToast('Gratificación calculada', 'success');
}

// ─── 3. CTS ─────────────────────────────────
function calcularCTS(silent = false) {
    const sueldo = getVal('cts-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.cts({
        sueldoBruto: sueldo,
        meses: parseInt(getVal('cts-meses')) || 0,
        dias: parseInt(getVal('cts-dias')) || 0,
        incluyeAsigFamiliar: getChecked('cts-asig-familiar'),
        ultimaGratificacion: getVal('cts-gratificacion'),
        promedioComisiones: getVal('cts-promedio-comisiones'),
        promedioBonos: getVal('cts-promedio-bonos')
    });

    const sections = [
        { title: 'Remu. Computable', rows: [
            { icon: 'fas fa-coins', label: 'Base Beneficios', value: `S/ ${fmt(r.base.baseBeneficios)}` },
            { icon: 'fas fa-gift', label: '1/6 Gratificación', value: `S/ ${fmt(r.sextoGratificacion)}` },
            { icon: 'fas fa-calculator', label: 'Remu. Computable', value: `S/ ${fmt(r.remuComputable)}`, total: true }
        ]},
        { title: 'Cálculo', rows: [
            { icon: 'fas fa-calendar', label: 'Días', value: `${r.totalDias}` },
            { icon: 'fas fa-divide', label: 'Valor diario', value: `S/ ${fmt(r.valorDiario)}` },
            { icon: 'fas fa-piggy-bank', label: 'CTS', value: `S/ ${fmt(r.cts)}`, class: 'positive', total: true }
        ]}
    ];

    renderResult('result-cts', {
        heroLabel: 'CTS a Depositar', heroAmount: r.cts,
        heroSub: `${r.totalDias} días`, sections, auditLog: r.audit
    });
    if (!silent) showToast('CTS calculada', 'success');
}

// ─── 4. HORAS EXTRAS ────────────────────────
function calcularHorasExtras(silent = false) {
    const sueldo = getVal('he-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const divisorTipo = getSelect('he-divisor-tipo') || 'legal';
    const r = CalcEngine.horasExtras({
        sueldoBruto: sueldo,
        horas25: getVal('he-horas-25'),
        horas35: getVal('he-horas-35'),
        incluyeAsigFamiliar: getChecked('he-asig-familiar'),
        esNocturno: getChecked('he-nocturno'),
        promedioComisiones: getVal('he-promedio-comisiones'),
        promedioBonos: getVal('he-promedio-bonos'),
        divisorHE: divisorTipo === 'real' ? 'real' : 'legal',
        diasRealesMes: parseInt(getVal('he-dias-reales')) || 30
    });

    const sections = [
        { title: `Valor Hora (÷ ${r.divisor}h)`, rows: [
            { icon: 'fas fa-coins', label: 'Base HE', value: `S/ ${fmt(r.base.baseHorasExtras)}` },
            ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: 'Incl. Asig. Familiar', value: `S/ ${fmt(r.base.asigFamiliar)}` }] : []),
            ...(r.esNocturno ? [{ icon: 'fas fa-moon', label: 'Sobretasa nocturna', value: `+ S/ ${fmt(r.sobreTasaNocturna)}` }] : []),
            { icon: 'fas fa-clock', label: `Valor hora: ${fmt(r.baseParaHE)} / ${r.divisor}`, value: `S/ ${fmt(r.valorHora)}` },
            { icon: 'fas fa-clock', label: 'Valor hora +25%', value: `S/ ${fmt(r.valorHora25)}` },
            { icon: 'fas fa-clock', label: 'Valor hora +35%', value: `S/ ${fmt(r.valorHora35)}` }
        ]},
        { title: 'Pago', rows: [
            { icon: 'fas fa-clock', label: `${r.horas25}h × S/ ${fmt(r.valorHora25)}`, value: `S/ ${fmt(r.pagoHoras25)}`, class: 'positive' },
            { icon: 'fas fa-clock', label: `${r.horas35}h × S/ ${fmt(r.valorHora35)}`, value: `S/ ${fmt(r.pagoHoras35)}`, class: 'positive' },
            { icon: 'fas fa-calculator', label: 'TOTAL HE', value: `S/ ${fmt(r.totalHorasExtras)}`, class: 'positive', total: true }
        ]},
        { title: 'Legal', rows: [
            { icon: 'fas fa-gavel', label: 'Norma', value: 'D.S. 007-2002-TR' },
            { icon: 'fas fa-calculator', label: 'Divisor', value: `${r.divisor}h (${divisorTipo === 'real' ? 'días reales' : '30×8 legal'})` },
            { icon: 'fas fa-file-invoice', label: 'PLAME', value: `S/ ${CalcEngine.plameRound(r.totalHorasExtras)}` }
        ]}
    ];

    const total = r.totalHorasExtras;
    const barChart = [
        { label: 'Horas 25%', value: r.pagoHoras25, percent: total > 0 ? CalcEngine.plameRound((r.pagoHoras25 / total) * 100) : 50, color: '#10b981' },
        { label: 'Horas 35%', value: r.pagoHoras35, percent: total > 0 ? CalcEngine.plameRound((r.pagoHoras35 / total) * 100) : 50, color: '#f59e0b' }
    ];

    renderResult('result-horas-extras', {
        heroLabel: 'Total Horas Extras', heroAmount: r.totalHorasExtras,
        heroSub: `${r.horas25 + r.horas35}h | Divisor: ${r.divisor}h | PLAME: S/ ${CalcEngine.plameRound(r.totalHorasExtras)}`,
        sections, barChart, auditLog: r.audit
    });
    if (!silent) showToast('Horas extras calculadas — precisión PLAME', 'success');
}

// ─── 5. VACACIONES ──────────────────────────
function calcularVacaciones(silent = false) {
    const sueldo = getVal('vac-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.vacaciones({
        sueldoBruto: sueldo,
        diasVacaciones: parseInt(getVal('vac-dias')) || 30,
        mesesLaborados: parseInt(getVal('vac-meses')) || 12,
        tripleVacacional: getChecked('vac-triple'),
        promedioComisiones: getVal('vac-promedio-comisiones'),
        promedioBonos: getVal('vac-promedio-bonos')
    });

    const sections = [
        { title: 'Cálculo', rows: [
            { icon: 'fas fa-coins', label: 'Base', value: `S/ ${fmt(r.base.baseBeneficios)}` },
            { icon: 'fas fa-calculator', label: 'Remu. Vacacional', value: `S/ ${fmt(r.remuVacacional)}`, class: 'positive' },
        ]},
        ...(r.tripleVacacional ? [{
            title: 'Triple Vacacional (Art. 23 D.Leg. 713)',
            rows: [
                { icon: 'fas fa-bed', label: '1. Descanso adquirido', value: `S/ ${fmt(r.remuDescanso)}` },
                { icon: 'fas fa-briefcase', label: '2. Trabajo en período vac.', value: `S/ ${fmt(r.remuTrabajo)}` },
                { icon: 'fas fa-gavel', label: '3. Indemnización', value: `S/ ${fmt(r.indemnizacion)}` },
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL TRIPLE', value: `S/ ${fmt(r.total)}`, class: 'positive', total: true }
            ]
        }] : [{ title: 'Total', rows: [
            { icon: 'fas fa-money-bill-wave', label: 'TOTAL', value: `S/ ${fmt(r.total)}`, class: 'positive', total: true }
        ]}])
    ];

    renderResult('result-vacaciones', {
        heroLabel: r.tripleVacacional ? 'Triple Vacacional' : 'Remuneración Vacacional',
        heroAmount: r.total, heroSub: 'D. Leg. N° 713', sections, auditLog: r.audit
    });
    if (!silent) showToast('Vacaciones calculadas', 'success');
}

// ─── 6. IMPUESTO A LA RENTA ────────────────
function calcularImpuestoRenta(silent = false) {
    const sueldo = getVal('ir-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.impuestoRenta({
        sueldoBruto: sueldo,
        meses: parseInt(getVal('ir-meses')) || 12,
        numGratificaciones: parseInt(getVal('ir-gratificaciones')) || 2,
        otrosIngresos: getVal('ir-otros'),
        tieneEPS: getChecked('ir-tiene-eps')
    });

    const sections = [
        { title: 'Renta Bruta', rows: [
            { icon: 'fas fa-coins', label: 'Sueldos', value: `S/ ${fmt(r.desglose.sueldosAnuales)}` },
            { icon: 'fas fa-gift', label: 'Gratificaciones', value: `S/ ${fmt(r.desglose.gratAnuales)}` },
            { icon: 'fas fa-plus', label: `Bonif. ${(r.tasaBonif * 100).toFixed(2)}%`, value: `S/ ${fmt(r.desglose.bonifAnuales)}` },
            { icon: 'fas fa-calculator', label: 'Renta Bruta', value: `S/ ${fmt(r.rentaBrutaAnual)}`, total: true }
        ]},
        { title: 'Deducciones', rows: [
            { icon: 'fas fa-minus-circle', label: '7 UIT', value: `- S/ ${fmt(r.deduccion7UIT)}`, class: 'negative' },
            { icon: 'fas fa-calculator', label: 'Renta Neta', value: `S/ ${fmt(r.rentaNetaAnual)}`, total: true }
        ]},
        { title: 'Tramos', rows: [
            ...r.tramos.filter(t => t.baseGravable > 0).map(t => ({
                icon: 'fas fa-layer-group', label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`, value: `S/ ${fmt(t.impuesto)}`
            })),
            { icon: 'fas fa-landmark', label: 'IR Anual', value: `S/ ${fmt(r.irAnual)}`, class: 'negative', total: true }
        ]},
        { title: 'Resumen', rows: [
            { icon: 'fas fa-calendar', label: 'Mensual est.', value: `S/ ${fmt(r.irMensual)}` },
            { icon: 'fas fa-percent', label: 'Tasa efectiva', value: `${CalcEngine.plameRound(r.tasaEfectiva)}%` }
        ]}
    ];

    renderResult('result-impuesto-renta', {
        heroLabel: 'IR Anual', heroAmount: r.irAnual,
        heroSub: `Mensual: S/ ${fmt(r.irMensual)} | Tasa: ${CalcEngine.plameRound(r.tasaEfectiva)}%`,
        sections, auditLog: r.audit
    });
    if (!silent) showToast('IR calculado', 'success');
}

// ─── 7. LIQUIDACIÓN ─────────────────────────
function calcularLiquidacion(silent = false) {
    const sueldo = getVal('liq-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const fi = new Date(document.getElementById('liq-fecha-ingreso')?.value);
    const fc = new Date(document.getElementById('liq-fecha-cese')?.value);
    if (isNaN(fi.getTime()) || isNaN(fc.getTime())) { if (!silent) showToast('Fechas inválidas', 'error'); return; }
    if (fc <= fi) { if (!silent) showToast('Fecha de cese debe ser posterior', 'error'); return; }

    const r = CalcEngine.liquidacion({
        sueldoBruto: sueldo, fechaIngreso: fi, fechaCese: fc,
        motivo: getSelect('liq-motivo'),
        vacPendientes: parseInt(getVal('liq-vac-pendientes')) || 0,
        vacNoGozadasTriple: getChecked('liq-triple-vacacional'),
        incluyeAsigFamiliar: getChecked('liq-asig-familiar'),
        tieneEPS: getChecked('liq-tiene-eps'),
        promedioComisiones: getVal('liq-promedio-comisiones'),
        promedioBonos: getVal('liq-promedio-bonos')
    });

    const ts = r.tiempoServicio;
    const motivos = { 'renuncia': 'Renuncia', 'despido-arbitrario': 'Despido arbitrario', 'mutuo-acuerdo': 'Mutuo acuerdo', 'fin-contrato': 'Fin contrato' };

    const sections = [
        { title: 'Datos', rows: [
            { icon: 'fas fa-coins', label: 'Base', value: `S/ ${fmt(r.base.baseBeneficios)}` },
            { icon: 'fas fa-clock', label: 'Tiempo', value: `${ts.anos}a ${ts.meses}m ${ts.dias}d` },
            { icon: 'fas fa-ban', label: 'Motivo', value: motivos[r.motivo] || r.motivo },
            { icon: 'fas fa-info-circle', label: 'Bonif.', value: r.tasaBonif === DATA.BONIF_EPS ? 'EPS 6.75%' : 'EsSalud 9%' }
        ]},
        { title: 'Beneficios Truncos', rows: [
            { icon: 'fas fa-piggy-bank', label: 'CTS Trunca', value: `S/ ${fmt(r.ctsTrunca)}`, class: 'positive' },
            { icon: 'fas fa-gift', label: 'Grat. Trunca', value: `S/ ${fmt(r.gratTrunca)}`, class: 'positive' },
            { icon: 'fas fa-plus', label: `Bonif. ${(r.tasaBonif * 100).toFixed(2)}%`, value: `S/ ${fmt(r.bonifGratTrunca)}`, class: 'positive' },
            { icon: 'fas fa-umbrella-beach', label: 'Vac. Truncas', value: `S/ ${fmt(r.vacTruncas)}`, class: 'positive' },
            ...(r.vacPendientes > 0 ? [{ icon: 'fas fa-calendar-xmark', label: `Vac. Pendientes (${r.vacPendientes}d)`, value: `S/ ${fmt(r.pagoVacPendientes)}`, class: 'positive' }] : []),
            ...(r.vacNoGozadasTriple ? [{ icon: 'fas fa-exclamation-triangle', label: 'Triple Vacacional', value: `S/ ${fmt(r.tripleVacacionalMonto)}`, class: 'positive' }] : []),
            ...(r.indemnizacion > 0 ? [{ icon: 'fas fa-gavel', label: 'Indemnización', value: `S/ ${fmt(r.indemnizacion)}`, class: 'positive' }] : []),
            { icon: 'fas fa-money-bill-wave', label: 'TOTAL', value: `S/ ${fmt(r.totalLiquidacion)}`, class: 'positive', total: true }
        ]}
    ];

    renderResult('result-liquidacion', {
        heroLabel: 'Total Liquidación', heroAmount: r.totalLiquidacion,
        heroSub: `${ts.anos}a ${ts.meses}m | ${motivos[r.motivo]}`,
        sections, auditLog: r.audit
    });
    if (!silent) showToast('Liquidación calculada', 'success');
}

// ─── 8. ESSALUD ─────────────────────────────
function calcularEsSalud(silent = false) {
    const sueldo = getVal('es-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.essalud({
        sueldoBruto: sueldo, regimen: getSelect('es-regimen'),
        numTrabajadores: parseInt(getVal('es-trabajadores')) || 1
    });

    const sections = [{ title: 'Cálculo', rows: [
        { icon: 'fas fa-percent', label: `Tasa ${(r.tasaInfo.tasa * 100).toFixed(1)}%`, value: `S/ ${fmt(r.aporteReal)}` },
        { icon: 'fas fa-users', label: `× ${r.numTrabajadores}`, value: `S/ ${fmt(r.aporteTotal)}`, total: true },
        { icon: 'fas fa-calendar', label: 'Anual', value: `S/ ${fmt(r.aporteAnual)}` }
    ]}];

    renderResult('result-essalud', {
        heroLabel: 'EsSalud Mensual', heroAmount: r.aporteTotal,
        heroSub: r.tasaInfo.nombre, sections, auditLog: r.audit
    });
    if (!silent) showToast('EsSalud calculado', 'success');
}

// ─── 9. UTILIDADES ──────────────────────────
function calcularUtilidades(silent = false) {
    const renta = getVal('util-renta');
    if (renta <= 0) { if (!silent) showToast('Ingresa la renta', 'error'); return; }

    const r = CalcEngine.utilidades({
        rentaEmpresa: renta, porcentajeSector: parseInt(getSelect('util-sector')),
        diasTrabajados: parseInt(getVal('util-dias-trabajados')) || 360,
        totalDiasTodos: parseInt(getVal('util-total-dias')) || 1,
        remuAnual: getVal('util-remu-anual'),
        totalRemuTodos: getVal('util-total-remu') || 1
    });

    const sections = [{ title: 'Distribución', rows: [
        { icon: 'fas fa-building', label: 'A distribuir', value: `S/ ${fmt(r.montoDistribuir)}` },
        { icon: 'fas fa-calendar-check', label: '50% días', value: `S/ ${fmt(r.porDias)}`, class: 'positive' },
        { icon: 'fas fa-coins', label: '50% remu.', value: `S/ ${fmt(r.porRemu)}`, class: 'positive' },
        ...(r.excedente > 0 ? [{ icon: 'fas fa-exclamation-triangle', label: 'Excedente tope', value: `S/ ${fmt(r.excedente)}`, class: 'negative' }] : []),
        { icon: 'fas fa-chart-pie', label: 'TOTAL', value: `S/ ${fmt(r.totalFinal)}`, class: 'positive', total: true }
    ]}];

    renderResult('result-utilidades', {
        heroLabel: 'Utilidades', heroAmount: r.totalFinal,
        heroSub: 'D. Leg. N° 892', sections, auditLog: r.audit
    });
    if (!silent) showToast('Utilidades calculadas', 'success');
}

// ─── 10. ASIGNACIÓN FAMILIAR ────────────────
function calcularAsignacionFamiliar(silent = false) {
    const r = CalcEngine.asignacionFamiliar({ numHijos: parseInt(getVal('af-hijos')) || 0 });

    const sections = [{ title: 'Cálculo', rows: [
        { icon: 'fas fa-coins', label: `RMV ${DATA.YEAR}`, value: `S/ ${fmt(r.rmv)}` },
        { icon: 'fas fa-baby', label: 'Hijos', value: r.numHijos },
        { icon: 'fas fa-check', label: 'Derecho', value: r.tieneDerechoFlag ? 'SÍ' : 'NO' },
        { icon: 'fas fa-money-bill-wave', label: 'Mensual', value: `S/ ${fmt(r.montoMensual)}`, class: r.montoMensual > 0 ? 'positive' : '', total: true },
        { icon: 'fas fa-calendar', label: 'Anual', value: `S/ ${fmt(r.montoAnual)}` }
    ]}];

    renderResult('result-asignacion-familiar', {
        heroLabel: 'Asignación Familiar', heroAmount: r.montoMensual,
        heroSub: r.tieneDerechoFlag ? 'Monto fijo (Ley 25129)' : 'Sin derecho',
        sections, auditLog: r.audit
    });
    if (!silent) showToast('Asig. familiar calculada', 'success');
}

// ─── 11. RENTA 5TA DETALLADA ────────────────
function calcularRentaQuinta(silent = false) {
    const sueldo = getVal('r5-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const r = CalcEngine.rentaQuintaDetallada({
        sueldoBruto: sueldo,
        mesCalculo: parseInt(getSelect('r5-mes')) || 12,
        remuPercibidas: getVal('r5-recibido'),
        gratPercibidas: getVal('r5-grat-recibidas'),
        tieneEPS: getChecked('r5-tiene-eps'),
        promedioComisiones: getVal('r5-promedio-comisiones'),
        promedioBonos: getVal('r5-promedio-bonos')
    });

    const meses = ['','Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const mesN = meses[parseInt(getSelect('r5-mes')) || 12];

    const sections = [
        { title: 'Proyección Renta Bruta', rows: [
            { icon: 'fas fa-coins', label: 'Remu. percibidas', value: `S/ ${fmt(r.desglose.remuPercibidas)}` },
            { icon: 'fas fa-arrow-right', label: `Proyección (${r.desglose.mesesRestantes}m)`, value: `S/ ${fmt(r.desglose.proyeccionSueldos)}` },
            { icon: 'fas fa-gift', label: 'Grat. pendientes', value: `S/ ${fmt(r.desglose.gratPendientes)}` },
            { icon: 'fas fa-plus', label: `Bonif. ${(r.tasaBonif * 100).toFixed(2)}%`, value: `S/ ${fmt(r.desglose.bonifPendientes)}` },
            { icon: 'fas fa-calculator', label: 'Renta Bruta', value: `S/ ${fmt(r.rentaBrutaAnual)}`, total: true }
        ]},
        { title: 'Renta Neta', rows: [
            { icon: 'fas fa-minus-circle', label: '7 UIT', value: `- S/ ${fmt(r.deduccion7UIT)}`, class: 'negative' },
            { icon: 'fas fa-calculator', label: 'Renta Neta', value: `S/ ${fmt(r.rentaNetaAnual)}`, total: true }
        ]},
        { title: 'Tramos', rows: [
            ...r.tramos.filter(t => t.baseGravable > 0).map(t => ({
                icon: 'fas fa-layer-group', label: `${t.nombre}: S/ ${fmt(t.baseGravable)} × ${(t.tasa*100).toFixed(0)}%`, value: `S/ ${fmt(t.impuesto)}`
            })),
            { icon: 'fas fa-landmark', label: 'IR Anual', value: `S/ ${fmt(r.irAnual)}`, class: 'negative', total: true }
        ]},
        { title: `Retención ${mesN}`, rows: [
            { icon: 'fas fa-divide', label: `Divisor`, value: r.divisor },
            { icon: 'fas fa-money-bill-wave', label: 'RETENCIÓN', value: `S/ ${fmt(r.retencionMensual)}`, class: 'negative', total: true }
        ]}
    ];

    renderResult('result-renta-quinta', {
        heroLabel: `Retención ${mesN}`, heroAmount: r.retencionMensual,
        heroSub: `IR: S/ ${fmt(r.irAnual)} | ÷${r.divisor}`,
        sections, auditLog: r.audit
    });
    if (!silent) showToast('Retención calculada', 'success');
}

// ─── 12. COSTO EMPLEADOR + COMPARADOR PRO ───
function calcularCostoEmpleador(silent = false) {
    const sueldo = getVal('ce-sueldo');
    if (sueldo <= 0) { if (!silent) showToast('Ingresa la remuneración', 'error'); return; }

    const incluyeAF = getChecked('ce-asig-familiar');
    const incluyeSCTR = getChecked('ce-sctr');
    const tieneEPS = getChecked('ce-tiene-eps');
    const promedioComisiones = getVal('ce-promedio-comisiones');
    const promedioBonos = getVal('ce-promedio-bonos');

    const r = CalcEngine.costoEmpleador({
        sueldoBruto: sueldo, regimen: getSelect('ce-regimen'),
        incluyeAsigFamiliar: incluyeAF, incluyeSCTR, tieneEPS,
        anosServicio: 4, promedioComisiones, promedioBonos
    });

    const comp = CalcEngine.comparadorRegimenes({
        sueldoBruto: sueldo, incluyeAsigFamiliar: incluyeAF,
        incluyeSCTR, tieneEPS, promedioComisiones, promedioBonos
    });

    const d = r.desglose;
    const sections = [
        { title: 'Base', rows: [
            { icon: 'fas fa-coins', label: 'Sueldo', value: `S/ ${fmt(r.base.sueldoBruto)}` },
            ...(r.base.asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: 'Asig. Familiar', value: `S/ ${fmt(r.base.asigFamiliar)}` }] : []),
            { icon: 'fas fa-calculator', label: 'Base', value: `S/ ${fmt(r.base.baseBeneficios)}`, total: true }
        ]},
        { title: `Costos — ${r.regimen.nombre}`, rows: [
            { icon: 'fas fa-heart-pulse', label: `EsSalud (${(r.regimen.essalud_tasa*100).toFixed(1)}%)`, value: `S/ ${fmt(d.essaludMensual)}`, class: 'negative' },
            ...(d.ctsMensualizada > 0 ? [{ icon: 'fas fa-piggy-bank', label: 'CTS', value: `S/ ${fmt(d.ctsMensualizada)}`, class: 'negative' }] : []),
            ...(d.gratMensualizada > 0 ? [{ icon: 'fas fa-gift', label: 'Gratif.', value: `S/ ${fmt(d.gratMensualizada)}`, class: 'negative' }] : []),
            ...(d.bonifMensualizada > 0 ? [{ icon: 'fas fa-plus', label: `Bonif. ${(r.tasaBonif*100).toFixed(2)}%`, value: `S/ ${fmt(d.bonifMensualizada)}`, class: 'negative' }] : []),
            { icon: 'fas fa-umbrella-beach', label: 'Vacaciones', value: `S/ ${fmt(d.vacMensualizada)}`, class: 'negative' },
            ...(d.sctrMensual > 0 ? [{ icon: 'fas fa-shield-halved', label: 'SCTR', value: `S/ ${fmt(d.sctrMensual)}`, class: 'negative' }] : []),
            ...(d.vidaLeyMensual > 0 ? [{ icon: 'fas fa-heart', label: 'Vida Ley', value: `S/ ${fmt(d.vidaLeyMensual)}`, class: 'negative' }] : []),
            { icon: 'fas fa-building', label: 'COSTO MENSUAL', value: `S/ ${fmt(r.costoTotalMensual)}`, class: 'negative', total: true }
        ]},
        { title: 'Resumen', rows: [
            { icon: 'fas fa-percent', label: 'Sobrecosto', value: `+${CalcEngine.plameRound(r.porcentajeSobrecosto)}%` },
            { icon: 'fas fa-calendar', label: 'Anual', value: `S/ ${fmt(r.costoTotalAnual)}` },
            { icon: 'fas fa-gavel', label: 'Costo liquidar (1 año)', value: `S/ ${fmt(r.costoLiquidar1Ano)}` }
        ]},
        { title: 'Ahorros Anuales', rows: [
            { icon: 'fas fa-arrow-down', label: 'Micro vs General', value: `S/ ${fmt(comp.ahorroMicroVsGeneral)}/año`, class: 'positive' },
            { icon: 'fas fa-arrow-down', label: 'Pequeña vs General', value: `S/ ${fmt(comp.ahorroPequenaVsGeneral)}/año`, class: 'positive' }
        ]}
    ];

    const barItems = [
        { label: 'Remuneración', value: r.base.baseBeneficios, color: '#10b981' },
        { label: 'EsSalud', value: d.essaludMensual, color: '#ef4444' },
        { label: 'CTS', value: d.ctsMensualizada, color: '#6366f1' },
        { label: 'Gratif.+Bonif.', value: d.gratMensualizada + d.bonifMensualizada, color: '#f59e0b' },
        { label: 'Vacaciones', value: d.vacMensualizada, color: '#06b6d4' }
    ];
    if (d.sctrMensual > 0) barItems.push({ label: 'SCTR', value: d.sctrMensual, color: '#ec4899' });
    if (d.vidaLeyMensual > 0) barItems.push({ label: 'Vida Ley', value: d.vidaLeyMensual, color: '#8b5cf6' });
    const barChart = barItems.filter(i => i.value > 0).map(i => ({
        ...i, percent: r.costoTotalMensual > 0 ? CalcEngine.plameRound((i.value / r.costoTotalMensual) * 100) : 0
    }));

    renderResult('result-costo-empleador', {
        heroLabel: 'Costo Total Empleador', heroAmount: r.costoTotalMensual,
        heroSub: `+${CalcEngine.plameRound(r.porcentajeSobrecosto)}% sobre S/ ${fmt(sueldo)}`,
        sections, barChart, matrizComparador: comp.matriz,
        auditLog: r.audit + '\n\n' + comp.audit
    });
    if (!silent) showToast('Costo + Comparador PRO calculado', 'success');
}
