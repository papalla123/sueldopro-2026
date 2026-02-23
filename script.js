/* ============================================
   PayCalc Pro - Application Logic
   Silicon Valley Quality Standards
   ============================================ */

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initTheme();
    initNavbar();
    initParticles();
    initTabs();
    initFAQ();
    initCounters();
    initDates();
});

// ===== LOADER =====
function initLoader() {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 500);
    }, 1800);
}

// ===== THEME =====
function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const saved = localStorage.getItem('paycalc-theme');

    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        toggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
        toggle.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('paycalc-theme', isDark ? 'light' : 'dark');
    });
}

// ===== NAVBAR =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinkElements.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-section') === current);
        });
    });

    // Close mobile menu on link click
    navLinkElements.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

// ===== PARTICLES =====
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationFrame;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const count = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const color = isDark ? '148, 163, 184' : '99, 102, 241';

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = p.x - particles[j].x;
                const dy = p.y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationFrame = requestAnimationFrame(animate);
    }

    resize();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// ===== TABS =====
function initTabs() {
    const tabs = document.querySelectorAll('.calc-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const calcId = tab.getAttribute('data-calc');
            activateCalc(calcId);
        });
    });
}

function activateCalc(calcId) {
    // Update tabs
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.calc-tab[data-calc="${calcId}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Update panels
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(`panel-${calcId}`);
    if (panel) panel.classList.add('active');

    // Scroll to calculators section
    scrollToSection('calculadoras');
}

// ===== FAQ =====
function initFAQ() {
    const faqList = document.getElementById('faqList');

    DATA.FAQ.forEach((item, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <button class="faq-question" onclick="toggleFAQ(this)">
                <span>${item.pregunta}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="faq-answer">
                <div class="faq-answer-inner">${item.respuesta}</div>
            </div>
        `;
        faqList.appendChild(faqItem);
    });
}

function toggleFAQ(btn) {
    const item = btn.closest('.faq-item');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

    // Open clicked if wasn't active
    if (!isActive) item.classList.add('active');
}

// ===== COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString();
    }

    requestAnimationFrame(update);
}

// ===== DATES =====
function initDates() {
    const today = new Date().toISOString().split('T')[0];
    const ceseInput = document.getElementById('liq-fecha-cese');
    if (ceseInput) ceseInput.value = today;

    const ingresoInput = document.getElementById('liq-fecha-ingreso');
    if (ingresoInput) {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        ingresoInput.value = oneYearAgo.toISOString().split('T')[0];
    }
}

// ===== UTILITY FUNCTIONS =====
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
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

function validateInput(value, fieldName) {
    if (value === '' || value === null || value === undefined || isNaN(value)) {
        showToast(`Por favor ingresa un valor válido para: ${fieldName}`, 'error');
        return false;
    }
    if (parseFloat(value) < 0) {
        showToast(`El valor de ${fieldName} no puede ser negativo`, 'error');
        return false;
    }
    return true;
}

function fmt(amount) {
    return DATA.formatMoney(amount);
}

function generateResultHTML(config) {
    const { heroLabel, heroAmount, heroSub, sections, barChart } = config;

    let html = `
        <div class="result-card">
            <div class="result-hero">
                <div class="result-hero-label">${heroLabel}</div>
                <div class="result-hero-amount">S/ ${fmt(heroAmount)}</div>
                ${heroSub ? `<div class="result-hero-sub">${heroSub}</div>` : ''}
            </div>
            <div class="result-body">
    `;

    sections.forEach(section => {
        html += `<div class="result-section">`;
        if (section.title) {
            html += `<div class="result-section-title">${section.title}</div>`;
        }
        section.rows.forEach(row => {
            const valueClass = row.class || '';
            const isTotal = row.total ? ' total' : '';
            html += `
                <div class="result-row${isTotal}">
                    <span class="result-row-label">
                        ${row.icon ? `<i class="${row.icon}"></i>` : ''}
                        ${row.label}
                    </span>
                    <span class="result-row-value ${valueClass}">${row.value}</span>
                </div>
            `;
        });
        html += `</div>`;
    });

    if (barChart && barChart.length > 0) {
        html += `<div class="result-section"><div class="result-section-title">Distribución Visual</div><div class="result-bar-chart">`;
        barChart.forEach(item => {
            html += `
                <div class="bar-chart-item">
                    <div class="bar-chart-label">
                        <span>${item.label}</span>
                        <span>S/ ${fmt(item.value)}</span>
                    </div>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill" style="width:${item.percent}%;background:${item.color}"></div>
                    </div>
                </div>
            `;
        });
        html += `</div></div>`;
    }

    html += `
            </div>
            <div class="result-actions">
                <button class="btn-result-action btn-result-primary" onclick="window.print()">
                    <i class="fas fa-print"></i> Imprimir
                </button>
                <button class="btn-result-action btn-result-secondary" onclick="copyResult(this)">
                    <i class="fas fa-copy"></i> Copiar
                </button>
            </div>
        </div>
    `;

    return html;
}

function copyResult(btn) {
    const card = btn.closest('.result-card');
    const text = card.querySelector('.result-body').innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast('Resultado copiado al portapapeles', 'success');
    }).catch(() => {
        showToast('No se pudo copiar', 'error');
    });
}

// ===== CALCULADORA: SUELDO NETO =====
function calcularSueldoNeto() {
    const sueldoBruto = parseFloat(document.getElementById('sn-sueldo-bruto').value);
    if (!validateInput(sueldoBruto, 'Remuneración Bruta')) return;

    const regimen = document.getElementById('sn-regimen').value;
    const pensionTipo = document.getElementById('sn-pension').value;
    const tieneAsigFamiliar = document.getElementById('sn-asig-familiar').checked;
    const meses = parseInt(document.getElementById('sn-meses').value) || 12;

    const asigFamiliar = tieneAsigFamiliar ? DATA.getAsignacionFamiliar() : 0;
    const remuneracionTotal = sueldoBruto + asigFamiliar;

    // Pensiones
    const pension = DATA.PENSIONES[pensionTipo];
    let descuentoPension = 0;
    let detallePension = [];

    if (pensionTipo === 'onp') {
        descuentoPension = remuneracionTotal * pension.aporte;
        detallePension = [
            { label: 'ONP (13%)', value: descuentoPension }
        ];
    } else {
        const aporteObligatorio = remuneracionTotal * pension.aporte;
        const comision = remuneracionTotal * pension.comision;
        const seguro = remuneracionTotal * pension.seguro;
        descuentoPension = aporteObligatorio + comision + seguro;
        detallePension = [
            { label: `Fondo obligatorio (${(pension.aporte * 100).toFixed(0)}%)`, value: aporteObligatorio },
            { label: `Comisión (${(pension.comision * 100).toFixed(2)}%)`, value: comision },
            { label: `Prima seguro (${(pension.seguro * 100).toFixed(2)}%)`, value: seguro }
        ];
    }

    // IR 5ta categoría (proyección anual simplificada)
    const rentaBrutaAnual = remuneracionTotal * 14; // 12 + 2 gratificaciones
    const deduccion7UIT = DATA.getDeduccion7UIT();
    const rentaNetaAnual = Math.max(0, rentaBrutaAnual - deduccion7UIT);
    const { impuesto: irAnual } = DATA.calcularIRAnual(rentaNetaAnual);
    const irMensual = irAnual / 12;

    const totalDescuentos = descuentoPension + irMensual;
    const sueldoNeto = remuneracionTotal - totalDescuentos;

    // Bar chart data
    const maxVal = remuneracionTotal;
    const barChart = [
        { label: 'Sueldo Neto', value: sueldoNeto, percent: (sueldoNeto / maxVal * 100).toFixed(1), color: '#10b981' },
        { label: 'Pensión', value: descuentoPension, percent: (descuentoPension / maxVal * 100).toFixed(1), color: '#6366f1' },
        { label: 'IR 5ta Cat.', value: irMensual, percent: Math.max(1, (irMensual / maxVal * 100)).toFixed(1), color: '#ef4444' }
    ];

    const sections = [
        {
            title: 'Ingresos',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Bruto', value: `S/ ${fmt(sueldoBruto)}`, class: 'positive' },
                ...(tieneAsigFamiliar ? [{ icon: 'fas fa-people-roof', label: 'Asignación Familiar', value: `S/ ${fmt(asigFamiliar)}`, class: 'positive' }] : []),
                { icon: 'fas fa-plus-circle', label: 'Remuneración Total', value: `S/ ${fmt(remuneracionTotal)}`, class: 'positive', total: true }
            ]
        },
        {
            title: 'Descuentos',
            rows: [
                ...detallePension.map(d => ({
                    icon: 'fas fa-minus-circle',
                    label: d.label,
                    value: `- S/ ${fmt(d.value)}`,
                    class: 'negative'
                })),
                {
                    icon: 'fas fa-landmark',
                    label: `IR 5ta Cat. (mensual)`,
                    value: irMensual > 0 ? `- S/ ${fmt(irMensual)}` : 'S/ 0.00',
                    class: irMensual > 0 ? 'negative' : ''
                },
                {
                    icon: 'fas fa-minus-circle',
                    label: 'Total Descuentos',
                    value: `- S/ ${fmt(totalDescuentos)}`,
                    class: 'negative',
                    total: true
                }
            ]
        },
        {
            title: 'Información Adicional',
            rows: [
                { icon: 'fas fa-briefcase', label: 'Régimen', value: DATA.REGIMENES[regimen].nombre },
                { icon: 'fas fa-id-card', label: 'Sistema Pensiones', value: pension.nombre },
                { icon: 'fas fa-percent', label: '% Descuento Total', value: `${((totalDescuentos / remuneracionTotal) * 100).toFixed(2)}%` },
                { icon: 'fas fa-calendar', label: 'Sueldo Neto Anual (est.)', value: `S/ ${fmt(sueldoNeto * meses)}` }
            ]
        }
    ];

    const resultArea = document.getElementById('result-sueldo-neto');
    resultArea.innerHTML = generateResultHTML({
        heroLabel: 'Tu Sueldo Neto Mensual',
        heroAmount: sueldoNeto,
        heroSub: `De un bruto de S/ ${fmt(remuneracionTotal)}`,
        sections,
        barChart
    });

    showToast('Sueldo neto calculado correctamente', 'success');
}

// ===== CALCULADORA: GRATIFICACIÓN =====
function calcularGratificacion() {
    const sueldo = parseFloat(document.getElementById('grat-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const periodo = document.getElementById('grat-periodo').value;
    const mesesTrabajados = parseInt(document.getElementById('grat-meses').value) || 6;
    const tieneAsigFamiliar = document.getElementById('grat-asig-familiar').checked;
    const tieneBonif = document.getElementById('grat-bonif').checked;

    const asigFamiliar = tieneAsigFamiliar ? DATA.getAsignacionFamiliar() : 0;
    const remuComputable = sueldo + asigFamiliar;

    // Gratificación proporcional
    const gratificacion = (remuComputable / 6) * Math.min(mesesTrabajados, 6);

    // Bonificación extraordinaria (9% = EsSalud que no se paga)
    const bonifExtraordinaria = tieneBonif ? gratificacion * DATA.GRATIFICACION.bonificacion_extraordinaria : 0;

    const totalGratificacion = gratificacion + bonifExtraordinaria;

    const periodoInfo = DATA.GRATIFICACION.periodos[periodo];

    const sections = [
        {
            title: 'Cálculo de Gratificación',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración Base', value: `S/ ${fmt(sueldo)}` },
                ...(tieneAsigFamiliar ? [{ icon: 'fas fa-people-roof', label: 'Asignación Familiar', value: `S/ ${fmt(asigFamiliar)}` }] : []),
                { icon: 'fas fa-calculator', label: 'Remuneración Computable', value: `S/ ${fmt(remuComputable)}` },
                { icon: 'fas fa-calendar', label: 'Meses trabajados en semestre', value: `${mesesTrabajados} / 6 meses` },
                { icon: 'fas fa-gift', label: 'Gratificación', value: `S/ ${fmt(gratificacion)}`, class: 'positive' }
            ]
        },
        {
            title: 'Bonificación Extraordinaria (Ley 30334)',
            rows: [
                { icon: 'fas fa-percent', label: 'Tasa (9% de EsSalud)', value: '9%' },
                { icon: 'fas fa-plus-circle', label: 'Bonificación Extraordinaria', value: `S/ ${fmt(bonifExtraordinaria)}`, class: 'positive' },
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL A RECIBIR', value: `S/ ${fmt(totalGratificacion)}`, class: 'positive', total: true }
            ]
        },
        {
            title: 'Información del Período',
            rows: [
                { icon: 'fas fa-calendar-alt', label: 'Período', value: periodoInfo.nombre },
                { icon: 'fas fa-calendar-check', label: 'Semestre computable', value: `Mes ${periodoInfo.semestre_inicio} al ${periodoInfo.semestre_fin}` },
                { icon: 'fas fa-info-circle', label: 'Nota', value: 'No sujeta a descuentos' }
            ]
        }
    ];

    const barChart = [
        { label: 'Gratificación Base', value: gratificacion, percent: ((gratificacion / totalGratificacion) * 100).toFixed(1), color: '#10b981' },
        { label: 'Bonif. Extraordinaria', value: bonifExtraordinaria, percent: ((bonifExtraordinaria / totalGratificacion) * 100).toFixed(1), color: '#6366f1' }
    ];

    document.getElementById('result-gratificacion').innerHTML = generateResultHTML({
        heroLabel: `Gratificación ${periodoInfo.nombre}`,
        heroAmount: totalGratificacion,
        heroSub: `${mesesTrabajados} meses trabajados en el semestre`,
        sections,
        barChart
    });

    showToast('Gratificación calculada correctamente', 'success');
}

// ===== CALCULADORA: CTS =====
function calcularCTS() {
    const sueldo = parseFloat(document.getElementById('cts-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const meses = parseInt(document.getElementById('cts-meses').value) || 0;
    const dias = parseInt(document.getElementById('cts-dias').value) || 0;
    const tieneAsigFamiliar = document.getElementById('cts-asig-familiar').checked;
    const gratificacion = parseFloat(document.getElementById('cts-gratificacion').value) || 0;

    const asigFamiliar = tieneAsigFamiliar ? DATA.getAsignacionFamiliar() : 0;
    const sextoGratificacion = gratificacion * DATA.CTS.factor_sexto_gratificacion;
    const remuComputable = sueldo + asigFamiliar + sextoGratificacion;

    // CTS = (Remu computable / 360) * (meses * 30 + días)
    const totalDias = (meses * 30) + dias;
    const cts = (remuComputable / 360) * totalDias;

    const sections = [
        {
            title: 'Remuneración Computable',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Base', value: `S/ ${fmt(sueldo)}` },
                ...(tieneAsigFamiliar ? [{ icon: 'fas fa-people-roof', label: 'Asignación Familiar', value: `S/ ${fmt(asigFamiliar)}` }] : []),
                { icon: 'fas fa-gift', label: '1/6 Última Gratificación', value: `S/ ${fmt(sextoGratificacion)}` },
                { icon: 'fas fa-calculator', label: 'Remu. Computable Total', value: `S/ ${fmt(remuComputable)}`, total: true }
            ]
        },
        {
            title: 'Cálculo CTS',
            rows: [
                { icon: 'fas fa-calendar', label: 'Meses completos', value: `${meses} meses` },
                { icon: 'fas fa-calendar-day', label: 'Días adicionales', value: `${dias} días` },
                { icon: 'fas fa-hashtag', label: 'Total días computables', value: `${totalDias} días` },
                { icon: 'fas fa-divide', label: 'Valor diario', value: `S/ ${fmt(remuComputable / 360)}` },
                { icon: 'fas fa-piggy-bank', label: 'CTS a Depositar', value: `S/ ${fmt(cts)}`, class: 'positive', total: true }
            ]
        },
        {
            title: 'Base Legal',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'D.S. N° 001-97-TR' },
                { icon: 'fas fa-calendar-alt', label: 'Depósitos', value: 'Mayo y Noviembre' },
                { icon: 'fas fa-info-circle', label: 'Fórmula', value: '(Remu / 360) × días' }
            ]
        }
    ];

    document.getElementById('result-cts').innerHTML = generateResultHTML({
        heroLabel: 'CTS a Depositar',
        heroAmount: cts,
        heroSub: `Por ${meses} meses y ${dias} días`,
        sections
    });

    showToast('CTS calculada correctamente', 'success');
}

// ===== CALCULADORA: HORAS EXTRAS =====
function calcularHorasExtras() {
    const sueldo = parseFloat(document.getElementById('he-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const horas25 = parseFloat(document.getElementById('he-horas-25').value) || 0;
    const horas35 = parseFloat(document.getElementById('he-horas-35').value) || 0;
    const jornada = parseInt(document.getElementById('he-jornada').value) || 48;
    const esNocturno = document.getElementById('he-nocturno').checked;

    const jornadaDiaria = jornada / 6; // Asumiendo 6 días
    const valorHora = sueldo / 30 / jornadaDiaria;

    // Sobretasa nocturna se aplica al sueldo base
    const sueldoConNocturno = esNocturno ? sueldo * (1 + DATA.HORAS_EXTRAS.nocturno) : sueldo;
    const valorHoraBase = esNocturno ? sueldoConNocturno / 30 / jornadaDiaria : valorHora;

    const pagoHoras25 = horas25 * valorHoraBase * (1 + DATA.HORAS_EXTRAS.primeras_2h);
    const pagoHoras35 = horas35 * valorHoraBase * (1 + DATA.HORAS_EXTRAS.excedentes);
    const sobreTasaNocturna = esNocturno ? sueldo * DATA.HORAS_EXTRAS.nocturno : 0;

    const totalHorasExtras = pagoHoras25 + pagoHoras35;
    const totalConNocturno = totalHorasExtras + sobreTasaNocturna;

    const sections = [
        {
            title: 'Valor Hora',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración Mensual', value: `S/ ${fmt(sueldo)}` },
                { icon: 'fas fa-clock', label: 'Jornada semanal', value: `${jornada} horas` },
                { icon: 'fas fa-clock', label: 'Jornada diaria', value: `${jornadaDiaria.toFixed(1)} horas` },
                { icon: 'fas fa-calculator', label: 'Valor hora normal', value: `S/ ${fmt(valorHora)}` },
                ...(esNocturno ? [{ icon: 'fas fa-moon', label: 'Valor hora nocturna (+35%)', value: `S/ ${fmt(valorHoraBase)}` }] : [])
            ]
        },
        {
            title: 'Horas Extras',
            rows: [
                { icon: 'fas fa-clock', label: `Primeras 2h (+25%): ${horas25}h × S/ ${fmt(valorHoraBase * 1.25)}`, value: `S/ ${fmt(pagoHoras25)}`, class: 'positive' },
                { icon: 'fas fa-clock', label: `Excedentes (+35%): ${horas35}h × S/ ${fmt(valorHoraBase * 1.35)}`, value: `S/ ${fmt(pagoHoras35)}`, class: 'positive' },
                { icon: 'fas fa-calculator', label: 'Total Horas Extras', value: `S/ ${fmt(totalHorasExtras)}`, class: 'positive', total: true }
            ]
        },
        ...(esNocturno ? [{
            title: 'Sobretasa Nocturna',
            rows: [
                { icon: 'fas fa-moon', label: 'Sobretasa nocturna (35%)', value: `S/ ${fmt(sobreTasaNocturna)}`, class: 'positive' },
                { icon: 'fas fa-money-bill-wave', label: 'Total con nocturno', value: `S/ ${fmt(totalConNocturno)}`, class: 'positive', total: true }
            ]
        }] : []),
        {
            title: 'Base Legal',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'D.S. N° 007-2002-TR' },
                { icon: 'fas fa-info-circle', label: 'Nota', value: 'Horas extras son voluntarias' }
            ]
        }
    ];

    const barChart = [
        { label: 'Horas al 25%', value: pagoHoras25, percent: totalHorasExtras > 0 ? ((pagoHoras25 / totalHorasExtras) * 100).toFixed(1) : 0, color: '#10b981' },
        { label: 'Horas al 35%', value: pagoHoras35, percent: totalHorasExtras > 0 ? ((pagoHoras35 / totalHorasExtras) * 100).toFixed(1) : 0, color: '#f59e0b' }
    ];

    document.getElementById('result-horas-extras').innerHTML = generateResultHTML({
        heroLabel: 'Total Horas Extras',
        heroAmount: esNocturno ? totalConNocturno : totalHorasExtras,
        heroSub: `${horas25 + horas35} horas extra en total`,
        sections,
        barChart
    });

    showToast('Horas extras calculadas correctamente', 'success');
}

// ===== CALCULADORA: VACACIONES =====
function calcularVacaciones() {
    const sueldo = parseFloat(document.getElementById('vac-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const diasVac = parseInt(document.getElementById('vac-dias').value) || 30;
    const mesesLaborados = parseInt(document.getElementById('vac-meses').value) || 12;
    const noGozadas = document.getElementById('vac-no-gozadas').checked;

    // Remuneración vacacional proporcional
    const remuVacacional = (sueldo / 30) * diasVac * (mesesLaborados / 12);

    // Indemnización por vacaciones no gozadas (triple)
    const indemnizacion = noGozadas ? remuVacacional * 2 : 0; // 1 ya se pagó como descanso, +2 de indemnización
    const totalVacaciones = remuVacacional + indemnizacion;

    const sections = [
        {
            title: 'Cálculo de Vacaciones',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración Mensual', value: `S/ ${fmt(sueldo)}` },
                { icon: 'fas fa-calendar', label: 'Días de vacaciones', value: `${diasVac} días` },
                { icon: 'fas fa-calendar-check', label: 'Meses laborados', value: `${mesesLaborados} meses` },
                { icon: 'fas fa-calculator', label: 'Valor diario', value: `S/ ${fmt(sueldo / 30)}` },
                { icon: 'fas fa-umbrella-beach', label: 'Remuneración Vacacional', value: `S/ ${fmt(remuVacacional)}`, class: 'positive' }
            ]
        },
        ...(noGozadas ? [{
            title: 'Indemnización por Vacaciones No Gozadas',
            rows: [
                { icon: 'fas fa-exclamation-triangle', label: 'Remuneración por descanso', value: `S/ ${fmt(remuVacacional)}` },
                { icon: 'fas fa-exclamation-triangle', label: 'Indemnización (x2)', value: `S/ ${fmt(indemnizacion)}`, class: 'positive' },
                { icon: 'fas fa-info-circle', label: 'Total (triple remuneración)', value: `S/ ${fmt(totalVacaciones)}`, class: 'positive', total: true }
            ]
        }] : []),
        {
            title: 'Información',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'D. Leg. N° 713' },
                { icon: 'fas fa-calendar', label: 'Derecho', value: '30 días por año completo' },
                { icon: 'fas fa-info-circle', label: 'Récord mínimo', value: '260 días efectivos (6 días/sem)' }
            ]
        }
    ];

    document.getElementById('result-vacaciones').innerHTML = generateResultHTML({
        heroLabel: noGozadas ? 'Total Vacaciones (No Gozadas)' : 'Remuneración Vacacional',
        heroAmount: totalVacaciones,
        heroSub: `${diasVac} días de descanso vacacional`,
        sections
    });

    showToast('Vacaciones calculadas correctamente', 'success');
}

// ===== CALCULADORA: IMPUESTO A LA RENTA =====
function calcularImpuestoRenta() {
    const sueldoMensual = parseFloat(document.getElementById('ir-sueldo').value);
    if (!validateInput(sueldoMensual, 'Remuneración')) return;

    const meses = parseInt(document.getElementById('ir-meses').value) || 12;
    const gratificaciones = parseInt(document.getElementById('ir-gratificaciones').value) || 2;
    const otrosIngresos = parseFloat(document.getElementById('ir-otros').value) || 0;

    const rentaBrutaAnual = (sueldoMensual * meses) + (sueldoMensual * gratificaciones) + otrosIngresos;
    const deduccion7UIT = DATA.getDeduccion7UIT();
    const rentaNetaAnual = Math.max(0, rentaBrutaAnual - deduccion7UIT);

    const { impuesto: irAnual, detalleTramos } = DATA.calcularIRAnual(rentaNetaAnual);
    const irMensual = meses > 0 ? irAnual / meses : 0;
    const tasaEfectiva = rentaBrutaAnual > 0 ? (irAnual / rentaBrutaAnual) * 100 : 0;

    const sections = [
        {
            title: 'Renta Bruta Anual',
            rows: [
                { icon: 'fas fa-coins', label: `Remuneraciones (${meses} meses)`, value: `S/ ${fmt(sueldoMensual * meses)}` },
                { icon: 'fas fa-gift', label: `Gratificaciones (${gratificaciones})`, value: `S/ ${fmt(sueldoMensual * gratificaciones)}` },
                ...(otrosIngresos > 0 ? [{ icon: 'fas fa-plus', label: 'Otros ingresos', value: `S/ ${fmt(otrosIngresos)}` }] : []),
                { icon: 'fas fa-calculator', label: 'Renta Bruta Anual', value: `S/ ${fmt(rentaBrutaAnual)}`, total: true }
            ]
        },
        {
            title: 'Deducciones',
            rows: [
                { icon: 'fas fa-minus-circle', label: `Deducción 7 UIT (${DATA.UIT} × 7)`, value: `- S/ ${fmt(deduccion7UIT)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Renta Neta Anual', value: `S/ ${fmt(rentaNetaAnual)}`, total: true }
            ]
        },
        {
            title: 'Impuesto por Tramos',
            rows: detalleTramos.map(t => ({
                icon: 'fas fa-layer-group',
                label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`,
                value: t.base > 0 ? `S/ ${fmt(t.impuesto)}` : 'S/ 0.00',
                class: t.impuesto > 0 ? 'negative' : ''
            })).concat([
                { icon: 'fas fa-landmark', label: 'IR Anual Total', value: `S/ ${fmt(irAnual)}`, class: 'negative', total: true }
            ])
        },
        {
            title: 'Retención Mensual',
            rows: [
                { icon: 'fas fa-calendar', label: 'Retención mensual estimada', value: `S/ ${fmt(irMensual)}`, class: 'negative' },
                { icon: 'fas fa-percent', label: 'Tasa efectiva', value: `${tasaEfectiva.toFixed(2)}%` },
                { icon: 'fas fa-info-circle', label: 'UIT 2024', value: `S/ ${fmt(DATA.UIT)}` }
            ]
        }
    ];

    const barChart = detalleTramos
        .filter(t => t.impuesto > 0)
        .map(t => ({
            label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`,
            value: t.impuesto,
            percent: irAnual > 0 ? ((t.impuesto / irAnual) * 100).toFixed(1) : 0,
            color: t.color
        }));

    document.getElementById('result-impuesto-renta').innerHTML = generateResultHTML({
        heroLabel: 'Impuesto a la Renta Anual',
        heroAmount: irAnual,
        heroSub: `Retención mensual estimada: S/ ${fmt(irMensual)}`,
        sections,
        barChart
    });

    showToast('Impuesto a la Renta calculado correctamente', 'success');
}

// ===== CALCULADORA: LIQUIDACIÓN =====
function calcularLiquidacion() {
    const sueldo = parseFloat(document.getElementById('liq-sueldo').value);
    if (!validateInput(sueldo, 'Última Remuneración')) return;

    const fechaIngreso = new Date(document.getElementById('liq-fecha-ingreso').value);
    const fechaCese = new Date(document.getElementById('liq-fecha-cese').value);
    const motivo = document.getElementById('liq-motivo').value;
    const vacPendientes = parseInt(document.getElementById('liq-vac-pendientes').value) || 0;
    const tieneAsigFamiliar = document.getElementById('liq-asig-familiar').checked;

    if (isNaN(fechaIngreso.getTime()) || isNaN(fechaCese.getTime())) {
        showToast('Por favor ingresa fechas válidas', 'error');
        return;
    }

    if (fechaCese <= fechaIngreso) {
        showToast('La fecha de cese debe ser posterior al ingreso', 'error');
        return;
    }

    const asigFamiliar = tieneAsigFamiliar ? DATA.getAsignacionFamiliar() : 0;
    const remuTotal = sueldo + asigFamiliar;

    // Calcular tiempo trabajado
    const diffTime = fechaCese - fechaIngreso;
    const totalDias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const anos = Math.floor(totalDias / 365);
    const mesesRestantes = Math.floor((totalDias % 365) / 30);
    const diasRestantes = totalDias % 30;

    // CTS Trunca
    const mesesUltimoSemestre = mesesRestantes % 6 || (mesesRestantes > 0 ? mesesRestantes : 0);
    const ctsTrunca = (remuTotal / 360) * ((mesesUltimoSemestre * 30) + diasRestantes);

    // Gratificación Trunca (proporcional al semestre)
    const mesActual = fechaCese.getMonth() + 1;
    let mesesSemestre;
    if (mesActual <= 6) {
        mesesSemestre = mesActual; // Ene-Jun
    } else {
        mesesSemestre = mesActual - 6; // Jul-Dic
    }
    const gratTrunca = (remuTotal / 6) * mesesSemestre;
    const bonifGratTrunca = gratTrunca * 0.09;

    // Vacaciones Truncas
    const mesesVacTruncos = totalDias > 365 ? mesesRestantes : Math.floor(totalDias / 30);
    const vacTruncas = (remuTotal / 12) * mesesVacTruncos;

    // Vacaciones pendientes
    const pagoVacPendientes = (sueldo / 30) * vacPendientes;

    // Indemnización por despido arbitrario
    let indemnizacion = 0;
    if (motivo === 'despido-arbitrario') {
        const anosCompletos = anos + (mesesRestantes / 12);
        indemnizacion = Math.min(
            remuTotal * 1.5 * anosCompletos,
            remuTotal * DATA.LIQUIDACION.indemnizacion_despido_arbitrario.tope_meses
        );
    }

    const totalLiquidacion = ctsTrunca + gratTrunca + bonifGratTrunca + vacTruncas + pagoVacPendientes + indemnizacion;

    const motivoTextos = {
        'renuncia': 'Renuncia voluntaria',
        'despido-arbitrario': 'Despido arbitrario',
        'mutuo-acuerdo': 'Mutuo acuerdo',
        'fin-contrato': 'Fin de contrato'
    };

    const sections = [
        {
            title: 'Datos del Trabajador',
            rows: [
                { icon: 'fas fa-coins', label: 'Última Remuneración', value: `S/ ${fmt(remuTotal)}` },
                { icon: 'fas fa-calendar-plus', label: 'Fecha Ingreso', value: fechaIngreso.toLocaleDateString('es-PE') },
                { icon: 'fas fa-calendar-minus', label: 'Fecha Cese', value: fechaCese.toLocaleDateString('es-PE') },
                { icon: 'fas fa-clock', label: 'Tiempo de servicio', value: `${anos} años, ${mesesRestantes} meses, ${diasRestantes} días` },
                { icon: 'fas fa-ban', label: 'Motivo de cese', value: motivoTextos[motivo] }
            ]
        },
        {
            title: 'Beneficios Truncos',
            rows: [
                { icon: 'fas fa-piggy-bank', label: 'CTS Trunca', value: `S/ ${fmt(ctsTrunca)}`, class: 'positive' },
                { icon: 'fas fa-gift', label: 'Gratificación Trunca', value: `S/ ${fmt(gratTrunca)}`, class: 'positive' },
                { icon: 'fas fa-plus', label: 'Bonif. Extraordinaria (9%)', value: `S/ ${fmt(bonifGratTrunca)}`, class: 'positive' },
                { icon: 'fas fa-umbrella-beach', label: 'Vacaciones Truncas', value: `S/ ${fmt(vacTruncas)}`, class: 'positive' },
                ...(vacPendientes > 0 ? [{ icon: 'fas fa-calendar-xmark', label: `Vacaciones Pendientes (${vacPendientes} días)`, value: `S/ ${fmt(pagoVacPendientes)}`, class: 'positive' }] : [])
            ]
        },
        ...(motivo === 'despido-arbitrario' ? [{
            title: 'Indemnización por Despido Arbitrario',
            rows: [
                { icon: 'fas fa-gavel', label: '1.5 remuneraciones × año', value: `S/ ${fmt(indemnizacion)}`, class: 'positive' },
                { icon: 'fas fa-info-circle', label: 'Tope máximo', value: `12 remuneraciones (S/ ${fmt(remuTotal * 12)})` }
            ]
        }] : []),
        {
            title: 'Total',
            rows: [
                { icon: 'fas fa-money-bill-wave', label: 'TOTAL LIQUIDACIÓN', value: `S/ ${fmt(totalLiquidacion)}`, class: 'positive', total: true }
            ]
        }
    ];

    const barItems = [
        { label: 'CTS Trunca', value: ctsTrunca, color: '#6366f1' },
        { label: 'Gratif. Trunca', value: gratTrunca + bonifGratTrunca, color: '#10b981' },
        { label: 'Vacaciones', value: vacTruncas + pagoVacPendientes, color: '#06b6d4' }
    ];
    if (indemnizacion > 0) barItems.push({ label: 'Indemnización', value: indemnizacion, color: '#ef4444' });

    const barChart = barItems.map(item => ({
        ...item,
        percent: totalLiquidacion > 0 ? ((item.value / totalLiquidacion) * 100).toFixed(1) : 0
    }));

    document.getElementById('result-liquidacion').innerHTML = generateResultHTML({
        heroLabel: 'Total Liquidación',
        heroAmount: totalLiquidacion,
        heroSub: `${anos} años, ${mesesRestantes} meses de servicio`,
        sections,
        barChart
    });

    showToast('Liquidación calculada correctamente', 'success');
}

// ===== CALCULADORA: ESSALUD =====
function calcularEsSalud() {
    const sueldo = parseFloat(document.getElementById('es-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const trabajadores = parseInt(document.getElementById('es-trabajadores').value) || 1;
    const regimen = document.getElementById('es-regimen').value;

    const tasaInfo = DATA.ESSALUD[regimen];
    const aporteUnitario = sueldo * tasaInfo.tasa;
    const baseMinima = DATA.RMV * tasaInfo.tasa;
    const aporteReal = Math.max(aporteUnitario, baseMinima);
    const aporteTotal = aporteReal * trabajadores;
    const aporteAnual = aporteTotal * 12;

    const sections = [
        {
            title: 'Cálculo EsSalud',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneración por trabajador', value: `S/ ${fmt(sueldo)}` },
                { icon: 'fas fa-percent', label: 'Tasa EsSalud', value: `${(tasaInfo.tasa * 100).toFixed(1)}%` },
                { icon: 'fas fa-calculator', label: 'Aporte por trabajador', value: `S/ ${fmt(aporteReal)}` },
                { icon: 'fas fa-info-circle', label: 'Base mínima (sobre RMV)', value: `S/ ${fmt(baseMinima)}` }
            ]
        },
        {
            title: 'Totales',
            rows: [
                { icon: 'fas fa-users', label: `Trabajadores: ${trabajadores}`, value: '' },
                { icon: 'fas fa-heart-pulse', label: 'Aporte Mensual Total', value: `S/ ${fmt(aporteTotal)}`, class: 'negative', total: true },
                { icon: 'fas fa-calendar', label: 'Aporte Anual Total', value: `S/ ${fmt(aporteAnual)}`, class: 'negative' }
            ]
        },
        {
            title: 'Información',
            rows: [
                { icon: 'fas fa-briefcase', label: 'Régimen', value: tasaInfo.nombre },
                { icon: 'fas fa-gavel', label: 'Norma', value: 'Ley N° 26790' },
                { icon: 'fas fa-info-circle', label: 'Nota', value: 'A cargo del empleador' }
            ]
        }
    ];

    document.getElementById('result-essalud').innerHTML = generateResultHTML({
        heroLabel: 'Aporte Mensual EsSalud',
        heroAmount: aporteTotal,
        heroSub: `${trabajadores} trabajador(es) | ${tasaInfo.nombre}`,
        sections
    });

    showToast('EsSalud calculado correctamente', 'success');
}

// ===== CALCULADORA: UTILIDADES =====
function calcularUtilidades() {
    const rentaEmpresa = parseFloat(document.getElementById('util-renta').value);
    if (!validateInput(rentaEmpresa, 'Renta anual')) return;

    const porcentajeSector = parseInt(document.getElementById('util-sector').value);
    const totalTrabajadores = parseInt(document.getElementById('util-total-trabajadores').value) || 1;
    const diasTrabajados = parseInt(document.getElementById('util-dias-trabajados').value) || 360;
    const totalDias = parseInt(document.getElementById('util-total-dias').value) || 1;
    const remuAnual = parseFloat(document.getElementById('util-remu-anual').value) || 0;
    const totalRemu = parseFloat(document.getElementById('util-total-remu').value) || 1;

    const montoDistribuir = rentaEmpresa * (porcentajeSector / 100);
    const mitad = montoDistribuir / 2;

    // 50% por días trabajados
    const porDias = (mitad / totalDias) * diasTrabajados;

    // 50% por remuneraciones
    const porRemu = totalRemu > 0 ? (mitad / totalRemu) * remuAnual : 0;

    const totalUtilidades = porDias + porRemu;

    // Tope: 18 remuneraciones mensuales
    const remuMensual = remuAnual / 12;
    const tope = remuMensual * 18;
    const utilidadesFinal = Math.min(totalUtilidades, tope);
    const excedente = totalUtilidades > tope ? totalUtilidades - tope : 0;

    const sections = [
        {
            title: 'Datos de la Empresa',
            rows: [
                { icon: 'fas fa-building', label: 'Renta Neta Anual', value: `S/ ${fmt(rentaEmpresa)}` },
                { icon: 'fas fa-percent', label: 'Porcentaje del sector', value: `${porcentajeSector}%` },
                { icon: 'fas fa-calculator', label: 'Monto a distribuir', value: `S/ ${fmt(montoDistribuir)}` },
                { icon: 'fas fa-users', label: 'Total trabajadores', value: totalTrabajadores }
            ]
        },
        {
            title: 'Tu Participación',
            rows: [
                { icon: 'fas fa-calendar-check', label: `50% por días (${diasTrabajados}/${totalDias})`, value: `S/ ${fmt(porDias)}`, class: 'positive' },
                { icon: 'fas fa-coins', label: `50% por remuneración`, value: `S/ ${fmt(porRemu)}`, class: 'positive' },
                { icon: 'fas fa-calculator', label: 'Total calculado', value: `S/ ${fmt(totalUtilidades)}` },
                ...(excedente > 0 ? [{ icon: 'fas fa-exclamation-triangle', label: `Tope 18 remuneraciones (S/ ${fmt(tope)})`, value: `Excedente: S/ ${fmt(excedente)}`, class: 'negative' }] : []),
                { icon: 'fas fa-chart-pie', label: 'UTILIDADES A RECIBIR', value: `S/ ${fmt(utilidadesFinal)}`, class: 'positive', total: true }
            ]
        },
        {
            title: 'Base Legal',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'D. Leg. N° 892' },
                { icon: 'fas fa-info-circle', label: 'Distribución', value: '50% días + 50% remuneraciones' },
                { icon: 'fas fa-calendar', label: 'Plazo de pago', value: '30 días de vencida la DJ anual' }
            ]
        }
    ];

    const barChart = [
        { label: '50% por Días', value: porDias, percent: totalUtilidades > 0 ? ((porDias / totalUtilidades) * 100).toFixed(1) : 50, color: '#6366f1' },
        { label: '50% por Remuneraciones', value: porRemu, percent: totalUtilidades > 0 ? ((porRemu / totalUtilidades) * 100).toFixed(1) : 50, color: '#10b981' }
    ];

    document.getElementById('result-utilidades').innerHTML = generateResultHTML({
        heroLabel: 'Tus Utilidades',
        heroAmount: utilidadesFinal,
        heroSub: `Sector: ${porcentajeSector}% | ${diasTrabajados} días trabajados`,
        sections,
        barChart
    });

    showToast('Utilidades calculadas correctamente', 'success');
}

// ===== CALCULADORA: ASIGNACIÓN FAMILIAR =====
function calcularAsignacionFamiliar() {
    const hijos = parseInt(document.getElementById('af-hijos').value) || 0;
    const rmv = parseFloat(document.getElementById('af-rmv').value);

    const asignacion = rmv * DATA.ASIGNACION_FAMILIAR_PORCENTAJE;
    const tieneDerechoText = hijos > 0 ? 'Sí tiene derecho' : 'No tiene derecho (requiere al menos 1 hijo)';
    const montoFinal = hijos > 0 ? asignacion : 0;

    const sections = [
        {
            title: 'Cálculo',
            rows: [
                { icon: 'fas fa-coins', label: 'RMV Vigente', value: `S/ ${fmt(rmv)}` },
                { icon: 'fas fa-percent', label: 'Porcentaje', value: '10%' },
                { icon: 'fas fa-baby', label: 'Número de hijos', value: hijos },
                { icon: 'fas fa-check-circle', label: 'Derecho', value: tieneDerechoText },
                { icon: 'fas fa-money-bill-wave', label: 'Asignación Familiar Mensual', value: `S/ ${fmt(montoFinal)}`, class: montoFinal > 0 ? 'positive' : '', total: true }
            ]
        },
        {
            title: 'Proyección Anual',
            rows: [
                { icon: 'fas fa-calendar', label: 'Asignación anual (12 meses)', value: `S/ ${fmt(montoFinal * 12)}` },
                { icon: 'fas fa-gift', label: 'Impacto en gratificación', value: `+ S/ ${fmt(montoFinal)} por gratificación` },
                { icon: 'fas fa-piggy-bank', label: 'Impacto en CTS', value: `Se incluye en remu. computable` }
            ]
        },
        {
            title: 'Requisitos',
            rows: [
                { icon: 'fas fa-gavel', label: 'Norma', value: 'Ley N° 25129' },
                { icon: 'fas fa-baby', label: 'Hijos menores de', value: '18 años' },
                { icon: 'fas fa-graduation-cap', label: 'Excepción', value: 'Hasta 24 años si estudian' },
                { icon: 'fas fa-info-circle', label: 'Importante', value: 'Monto fijo (no varía por # hijos)' }
            ]
        }
    ];

    document.getElementById('result-asignacion-familiar').innerHTML = generateResultHTML({
        heroLabel: 'Asignación Familiar Mensual',
        heroAmount: montoFinal,
        heroSub: hijos > 0 ? `Monto fijo por ${hijos} hijo(s)` : 'Sin derecho - Se requiere al menos 1 hijo',
        sections
    });

    showToast('Asignación familiar calculada', 'success');
}

// ===== CALCULADORA: RENTA 5TA DETALLADA =====
function calcularRentaQuinta() {
    const sueldoMensual = parseFloat(document.getElementById('r5-sueldo').value);
    if (!validateInput(sueldoMensual, 'Remuneración')) return;

    const mesCalculo = parseInt(document.getElementById('r5-mes').value);
    const remuRecibidas = parseFloat(document.getElementById('r5-recibido').value) || 0;

    // Paso 1: Proyección de renta bruta anual
    const mesesFaltantes = 12 - mesCalculo + 1; // incluye mes actual
    const proyeccionRemus = sueldoMensual * mesesFaltantes;
    const gratificacionesProyectadas = (mesCalculo <= 7 ? sueldoMensual : 0) + (mesCalculo <= 12 ? sueldoMensual : 0);
    const rentaBrutaAnual = remuRecibidas + proyeccionRemus + gratificacionesProyectadas;

    // Paso 2: Deducción 7 UIT
    const deduccion7UIT = DATA.getDeduccion7UIT();
    const rentaNetaAnual = Math.max(0, rentaBrutaAnual - deduccion7UIT);

    // Paso 3: Impuesto anual
    const { impuesto: irAnual, detalleTramos } = DATA.calcularIRAnual(rentaNetaAnual);

    // Paso 4: Retención mensual según divisor
    const divisor = DATA.DIVISORES_MENSUALES[mesCalculo];
    const retencionMensual = irAnual / divisor;

    const mesesNombres = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const sections = [
        {
            title: 'Paso 1: Proyección Renta Bruta Anual',
            rows: [
                { icon: 'fas fa-coins', label: 'Remuneraciones ya percibidas', value: `S/ ${fmt(remuRecibidas)}` },
                { icon: 'fas fa-arrow-right', label: `Proyección restante (${mesesFaltantes} meses)`, value: `S/ ${fmt(proyeccionRemus)}` },
                { icon: 'fas fa-gift', label: 'Gratificaciones proyectadas', value: `S/ ${fmt(gratificacionesProyectadas)}` },
                { icon: 'fas fa-calculator', label: 'Renta Bruta Anual Proyectada', value: `S/ ${fmt(rentaBrutaAnual)}`, total: true }
            ]
        },
        {
            title: 'Paso 2: Renta Neta',
            rows: [
                { icon: 'fas fa-minus-circle', label: 'Deducción 7 UIT', value: `- S/ ${fmt(deduccion7UIT)}`, class: 'negative' },
                { icon: 'fas fa-calculator', label: 'Renta Neta Anual', value: `S/ ${fmt(rentaNetaAnual)}`, total: true }
            ]
        },
        {
            title: 'Paso 3: Impuesto por Tramos',
            rows: detalleTramos.filter(t => t.base > 0).map(t => ({
                icon: 'fas fa-layer-group',
                label: `${t.nombre}: S/ ${fmt(t.base)} × ${(t.tasa * 100).toFixed(0)}%`,
                value: `S/ ${fmt(t.impuesto)}`
            })).concat([
                { icon: 'fas fa-landmark', label: 'IR Anual Proyectado', value: `S/ ${fmt(irAnual)}`, class: 'negative', total: true }
            ])
        },
        {
            title: `Paso 4: Retención de ${mesesNombres[mesCalculo]}`,
            rows: [
                { icon: 'fas fa-divide', label: `Divisor del mes (${mesesNombres[mesCalculo]})`, value: divisor },
                { icon: 'fas fa-calculator', label: `S/ ${fmt(irAnual)} ÷ ${divisor}`, value: `S/ ${fmt(retencionMensual)}` },
                { icon: 'fas fa-money-bill-wave', label: 'RETENCIÓN DEL MES', value: `S/ ${fmt(retencionMensual)}`, class: 'negative', total: true }
            ]
        }
    ];

    const barChart = detalleTramos
        .filter(t => t.impuesto > 0)
        .map(t => ({
            label: `${t.nombre} (${(t.tasa * 100).toFixed(0)}%)`,
            value: t.impuesto,
            percent: irAnual > 0 ? ((t.impuesto / irAnual) * 100).toFixed(1) : 0,
            color: t.color
        }));

    document.getElementById('result-renta-quinta').innerHTML = generateResultHTML({
        heroLabel: `Retención IR - ${mesesNombres[mesCalculo]}`,
        heroAmount: retencionMensual,
        heroSub: `IR Anual proyectado: S/ ${fmt(irAnual)} | Divisor: ${divisor}`,
        sections,
        barChart
    });

    showToast('Retención mensual calculada correctamente', 'success');
}

// ===== CALCULADORA: COSTO EMPLEADOR =====
function calcularCostoEmpleador() {
    const sueldo = parseFloat(document.getElementById('ce-sueldo').value);
    if (!validateInput(sueldo, 'Remuneración')) return;

    const regimen = document.getElementById('ce-regimen').value;
    const tieneAsigFamiliar = document.getElementById('ce-asig-familiar').checked;
    const tieneSCTR = document.getElementById('ce-sctr').checked;

    const regimenInfo = DATA.REGIMENES[regimen];
    const asigFamiliar = (tieneAsigFamiliar && regimenInfo.asig_familiar) ? DATA.getAsignacionFamiliar() : 0;
    const remuTotal = sueldo + asigFamiliar;

    // EsSalud
    const essalud = remuTotal * regimenInfo.essalud;

    // CTS mensual provisionada
    let ctsMensual = 0;
    if (regimenInfo.cts) {
        const factorCTS = regimenInfo.cts_factor || 1;
        ctsMensual = (remuTotal * factorCTS) / 12;
    }

    // Gratificación mensual provisionada
    let gratMensual = 0;
    if (regimenInfo.gratificacion) {
        const factorGrat = regimenInfo.gratificacion_meses || 1;
        gratMensual = (remuTotal * factorGrat * 2) / 12; // 2 gratificaciones al año
    }

    // Bonificación extraordinaria
    const bonifExtraMensual = gratMensual * 0.09;

    // Vacaciones provisionadas
    const vacMensual = (remuTotal / 12) * (regimenInfo.vacaciones_dias / 30);

    // SCTR
    const sctr = tieneSCTR ? remuTotal * DATA.SCTR.total : 0;

    // Total mensual
    const costoTotal = remuTotal + essalud + ctsMensual + gratMensual + bonifExtraMensual + vacMensual + sctr;
    const costoAnual = costoTotal * 12;
    const porcentajeExtra = ((costoTotal - sueldo) / sueldo * 100);

    const sections = [
        {
            title: 'Remuneración',
            rows: [
                { icon: 'fas fa-coins', label: 'Sueldo Bruto', value: `S/ ${fmt(sueldo)}` },
                ...(asigFamiliar > 0 ? [{ icon: 'fas fa-people-roof', label: 'Asignación Familiar', value: `S/ ${fmt(asigFamiliar)}` }] : []),
                { icon: 'fas fa-calculator', label: 'Remuneración Total', value: `S/ ${fmt(remuTotal)}`, total: true }
            ]
        },
        {
            title: 'Costos del Empleador (mensual provisionado)',
            rows: [
                { icon: 'fas fa-heart-pulse', label: `EsSalud (${(regimenInfo.essalud * 100).toFixed(1)}%)`, value: `S/ ${fmt(essalud)}`, class: 'negative' },
                ...(ctsMensual > 0 ? [{ icon: 'fas fa-piggy-bank', label: 'CTS (provisión mensual)', value: `S/ ${fmt(ctsMensual)}`, class: 'negative' }] : []),
                ...(gratMensual > 0 ? [{ icon: 'fas fa-gift', label: 'Gratificaciones (provisión)', value: `S/ ${fmt(gratMensual)}`, class: 'negative' }] : []),
                ...(bonifExtraMensual > 0 ? [{ icon: 'fas fa-plus', label: 'Bonif. Extraordinaria (9%)', value: `S/ ${fmt(bonifExtraMensual)}`, class: 'negative' }] : []),
                { icon: 'fas fa-umbrella-beach', label: 'Vacaciones (provisión)', value: `S/ ${fmt(vacMensual)}`, class: 'negative' },
                ...(sctr > 0 ? [{ icon: 'fas fa-shield-halved', label: 'SCTR', value: `S/ ${fmt(sctr)}`, class: 'negative' }] : [])
            ]
        },
        {
            title: 'Resumen',
            rows: [
                { icon: 'fas fa-building', label: 'COSTO TOTAL MENSUAL', value: `S/ ${fmt(costoTotal)}`, class: 'negative', total: true },
                { icon: 'fas fa-calendar', label: 'Costo Total Anual', value: `S/ ${fmt(costoAnual)}` },
                { icon: 'fas fa-percent', label: 'Sobrecosto sobre sueldo', value: `+${porcentajeExtra.toFixed(1)}%` },
                { icon: 'fas fa-briefcase', label: 'Régimen', value: regimenInfo.nombre }
            ]
        }
    ];

    const barChart = [
        { label: 'Remuneración', value: remuTotal, percent: ((remuTotal / costoTotal) * 100).toFixed(1), color: '#10b981' },
        { label: 'EsSalud', value: essalud, percent: ((essalud / costoTotal) * 100).toFixed(1), color: '#ef4444' },
        { label: 'CTS', value: ctsMensual, percent: ((ctsMensual / costoTotal) * 100).toFixed(1), color: '#6366f1' },
        { label: 'Gratificaciones', value: gratMensual + bonifExtraMensual, percent: (((gratMensual + bonifExtraMensual) / costoTotal) * 100).toFixed(1), color: '#f59e0b' },
        { label: 'Vacaciones', value: vacMensual, percent: ((vacMensual / costoTotal) * 100).toFixed(1), color: '#06b6d4' }
    ].filter(item => item.value > 0);

    document.getElementById('result-costo-empleador').innerHTML = generateResultHTML({
        heroLabel: 'Costo Total del Empleador',
        heroAmount: costoTotal,
        heroSub: `+${porcentajeExtra.toFixed(1)}% sobre sueldo bruto de S/ ${fmt(sueldo)}`,
        sections,
        barChart
    });

    showToast('Costo del empleador calculado correctamente', 'success');
}
