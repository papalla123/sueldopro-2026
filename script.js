let currentCalc = 'neto';
let currentForex = 'USD';
let chart = null;

// --- TEMA ---
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.getElementById('theme-icon').innerText = isDark ? '☀️' : '🌙';
}

// --- NAVEGACIÓN ---
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') initForex();
}

// --- CALCULADORAS ---
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    renderCalcUI();
}

function renderCalcUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    
    const configs = {
        neto: {
            t: "Cálculo Sueldo Neto",
            i: "Sueldo Bruto Mensual (S/)",
            g: "Determina cuánto recibirás en tu cuenta bancaria después de descontar aportes de pensión (AFP/ONP) e impuesto a la renta. Basado en la normativa de 7 UIT vigentes para 2026.",
            extra: `<select id="pension" class="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mt-4 font-bold outline-none border-2 border-transparent focus:border-blue-500"><option value="0.12">AFP (Promedio 12%)</option><option value="0.13">ONP (Fijo 13%)</option></select>`
        },
        costo: {
            t: "Costo Total de Empresa",
            i: "Sueldo Ofrecido al Trabajador (S/)",
            g: "Análisis para empleadores: incluye Essalud (9%), Gratificaciones (16.66%), CTS (8.33%) y Vacaciones. Es el presupuesto real que una empresa debe tener para contratar legalmente.",
            extra: `<div class="p-4 bg-blue-500/10 rounded-xl mt-4 text-[10px] font-bold text-blue-600 italic">CÁLCULO BASADO EN RÉGIMEN GENERAL 2026</div>`
        },
        cuarta: {
            t: "Recibos por Honorarios",
            i: "Monto Bruto del Recibo (S/)",
            g: "Para trabajadores independientes. La retención del 8% se aplica automáticamente si el recibo supera los S/ 1,500, a menos que cuentes con suspensión de retenciones.",
            extra: ""
        },
        vacaciones: {
            t: "Liquidación de Vacaciones",
            i: "Sueldo Bruto Mensual (S/)",
            g: "Calcula el pago por días de vacaciones no gozados o truncos. Se basa en el promedio de los últimos 6 meses de ingresos.",
            extra: `<input type="number" id="v-days" placeholder="Días pendientes (Ej: 15)" class="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mt-4 font-bold outline-none">`
        }
    };

    const c = configs[currentCalc];
    ui.innerHTML = `
        <h3 class="text-3xl font-black mb-6 italic text-blue-600">${c.t}</h3>
        <label class="block text-[10px] font-black opacity-40 uppercase mb-2">${c.i}</label>
        <input type="number" id="main-val" placeholder="0.00" class="w-full p-6 rounded-2xl bg-slate-100 dark:bg-slate-800 text-4xl font-black outline-none border-2 border-transparent focus:border-blue-500">
        ${c.extra}
        <button onclick="processCalc()" class="pro-btn">
            <span>✨ Procesar Análisis</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
        </button>
        <div id="calc-res"></div>
    `;
    guide.innerHTML = `<p>${c.g}</p><p class='pt-4 border-t border-blue-500/10'><b>Nota:</b> Estos valores son referenciales para el periodo fiscal 2026 en Perú.</p>`;
}

function processCalc() {
    const val = parseFloat(document.getElementById('main-val').value);
    const res = document.getElementById('calc-res');
    if(!val) return;

    let total = 0; let detail = "";
    if(currentCalc === 'neto') {
        total = val * (1 - parseFloat(document.getElementById('pension').value));
        detail = "Neto tras descuentos de ley.";
    } else if(currentCalc === 'costo') {
        total = val * 1.45; // Aprox Essalud + Grati + CTS + Vacas
        detail = "Costo total mensual para el empleador.";
    } else if(currentCalc === 'cuarta') {
        total = val > 1500 ? val * 0.92 : val;
        detail = val > 1500 ? "Con retención del 8%." : "Sin retención.";
    } else if(currentCalc === 'vacaciones') {
        const d = parseFloat(document.getElementById('v-days').value) || 0;
        total = (val / 30) * d;
        detail = `Pago por ${d} días.`;
    }

    res.innerHTML = `
        <div class="mt-8 p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl animate-bounce-short">
            <p class="text-xs font-bold opacity-50 uppercase tracking-widest mb-1">Resultado Final</p>
            <h2 class="text-5xl font-black tracking-tighter">S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}</h2>
            <p class="text-xs mt-3 opacity-70">${detail}</p>
        </div>
    `;
}

// --- FOREX ---
function initForex() {
    const select = document.getElementById('forex-select');
    if(!select.options.length) {
        select.innerHTML = currencies.map(c => `<option value="${c.id}">${c.n} (${c.id})</option>`).join('');
    }
    updateForexUI();
}

function updateForexUI() {
    currentForex = document.getElementById('forex-select').value;
    const curr = currencies.find(c => c.id === currentForex);
    convertCurrency();
    renderChart(curr.h, curr.id);
}

function convertCurrency() {
    const amt = parseFloat(document.getElementById('forex-amount').value) || 0;
    const curr = currencies.find(c => c.id === currentForex);
    const res = amt / curr.p;
    document.getElementById('forex-result').innerText = `${res.toLocaleString(undefined, {maximumFractionDigits:2})} ${curr.id}`;
}

function renderChart(history, label) {
    const ctx = document.getElementById('forexChart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Hoy'],
            datasets: [{
                label: label,
                data: history,
                borderColor: '#2563eb',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.1)'
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

// --- RADAR ---
function renderJobs() {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.map(j => `
        <div class="job-card">
            <span class="text-5xl">${j.i}</span>
            <h4 class="text-xl font-black mt-4 text-blue-600 uppercase tracking-tighter">${j.n}</h4>
            <p class="text-xs opacity-60 my-4 leading-relaxed">${j.d}</p>
            <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span class="font-black text-sm italic">S/ ${j.min.toLocaleString()}</span>
                <a href="${j.l}" class="text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-lg">VER PLAZAS</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => {
    renderCalcUI();
    renderJobs();
};