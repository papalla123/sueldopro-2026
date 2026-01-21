let currentCalc = 'cts';
let chart = null;
const CONST = { UIT: 5500, ASIG_FAM: 115 };

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    document.getElementById('theme-icon').innerText = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}

function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') renderForex();
    if(id === 'jobs') renderJobs();
    if(id === 'news') renderNews();
}

function setCalc(id) {
    currentCalc = id;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    renderUI();
}

function renderUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    
    const configs = {
        cts: {
            t: "Cálculo de CTS Semestral",
            guide: "Fórmula: (Sueldo + 1/6 Gratificación) / 12 * Meses laborados. Se deposita en Mayo y Noviembre.",
            html: `
                <label class="input-label">Sueldo Bruto Actual</label>
                <input type="number" id="v1" class="input-main mb-6" placeholder="0.00">
                <label class="input-label">Última Gratificación recibida</label>
                <input type="number" id="v2" class="input-main mb-6" placeholder="0.00">
                <label class="input-label">Meses laborados en el semestre</label>
                <input type="number" id="v3" class="input-main" value="6" max="6">`
        },
        neto: {
            t: "Sueldo Neto Mensual",
            guide: "Cálculo tras descuentos de AFP/ONP e Impuesto a la Renta de 5ta categoría.",
            html: `
                <label class="input-label">Sueldo Bruto Mensual</label>
                <input type="number" id="v1" class="input-main mb-6" placeholder="0.00">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="input-label">Sistema Pensión</label>
                        <select id="s1" class="select-main"><option value="0.12">AFP (12%)</option><option value="0.13">ONP (13%)</option></select>
                    </div>
                    <div>
                        <label class="input-label">Asig. Familiar</label>
                        <select id="s2" class="select-main"><option value="0">No</option><option value="115">Sí (S/ 115)</option></select>
                    </div>
                </div>`
        },
        grati: {
            t: "Gratificación (Julio/Dic)",
            guide: "Equivale a 1 sueldo completo + bono extraordinario de salud (9% Essalud o 6.75% EPS).",
            html: `
                <label class="input-label">Sueldo Base</label>
                <input type="number" id="v1" class="input-main mb-6">
                <label class="input-label">Meses laborados (1-6)</label>
                <input type="number" id="v2" class="input-main mb-6" value="6">
                <label class="input-label">Seguro</label>
                <select id="s1" class="select-main"><option value="0.09">Essalud (9%)</option><option value="0.0675">EPS (6.75%)</option></select>`
        },
        cuarta: {
            t: "Recibos por Honorarios",
            guide: "Retención obligatoria del 8% si el monto supera los S/ 1,500.",
            html: `
                <label class="input-label">Monto del Recibo</label>
                <input type="number" id="v1" class="input-main">`
        }
    };

    const c = configs[currentCalc] || configs.cts;
    ui.innerHTML = `<h3 class="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter">${c.t}</h3>${c.html}<button onclick="calculate()" class="w-full mt-8 bg-brand-500 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-brand-600 transition-all">EJECUTAR CÁLCULO</button>`;
    guide.innerText = c.guide;
}

function calculate() {
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    const v2 = parseFloat(document.getElementById('v2')?.value) || 0;
    const v3 = parseFloat(document.getElementById('v3')?.value) || 0;
    const s1 = parseFloat(document.getElementById('s1')?.value) || 0;
    const s2 = parseFloat(document.getElementById('s2')?.value) || 0;
    
    let total = 0;
    let detail = "";

    if (currentCalc === 'cts') {
        const base = v1 + (v2 / 6);
        total = (base / 12) * v3;
        detail = `Base computable: S/ ${base.toFixed(2)}<br>Meses considerados: ${v3}`;
    } else if (currentCalc === 'neto') {
        const bruto = v1 + s2;
        const pens = bruto * s1;
        const proyectado = (bruto * 14) - (7 * CONST.UIT);
        const renta = proyectado > 0 ? (proyectado * 0.08) / 12 : 0;
        total = bruto - pens - renta;
        detail = `Bruto: S/ ${bruto.toFixed(2)}<br>Pensión: -S/ ${pens.toFixed(2)}<br>Renta 5ta: -S/ ${renta.toFixed(2)}`;
    } else if (currentCalc === 'grati') {
        const base = (v1 / 6) * v2;
        total = base + (base * s1);
        detail = `Gratificación: S/ ${base.toFixed(2)}<br>Bono Ley: S/ ${(base * s1).toFixed(2)}`;
    } else if (currentCalc === 'cuarta') {
        const ret = v1 > 1500 ? v1 * 0.08 : 0;
        total = v1 - ret;
        detail = `Monto Bruto: S/ ${v1}<br>Retención (8%): -S/ ${ret.toFixed(2)}`;
    }

    document.getElementById('calc-res').innerText = `S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    document.getElementById('calc-details').innerHTML = detail;
}

// RESTO DE FUNCIONES
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="updateForex('${c.id}')" class="w-full flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-surface-800 border-2 border-transparent hover:border-brand-500 transition-all">
            <span class="font-bold text-[10px] dark:text-slate-300 uppercase">${c.n}</span>
            <span class="font-black text-brand-500">${c.id}</span>
        </button>
    `).join('');
    updateForex('USD');
}

function updateForex(id = 'USD') {
    const amt = parseFloat(document.getElementById('f-amt').value) || 0;
    const curr = currencies.find(c => c.id === id);
    document.getElementById('chart-label').innerText = `${(amt / curr.p).toFixed(2)} ${curr.id}`;
    
    if (chart) chart.destroy();
    const ctx = document.getElementById('f-chart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['L','M','X','J','V','S','D'], datasets: [{ data: [curr.p, curr.p*1.02, curr.p*0.98, curr.p*1.01, curr.p], borderColor: '#0066ff', tension: 0.4 }] },
        options: { plugins: { legend: false } }
    });
}

function renderJobs() {
    const q = document.getElementById('job-search').value.toLowerCase();
    document.getElementById('job-grid').innerHTML = jobs.filter(j => j.n.toLowerCase().includes(q)).slice(0, 20).map(j => `
        <div class="job-card">
            <div class="text-3xl mb-4">${j.i}</div>
            <h4 class="text-xs font-black dark:text-white uppercase mb-1">${j.n}</h4>
            <p class="text-[10px] text-slate-400 mb-6">${j.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-brand-500 font-bold">S/ ${j.min.toFixed(0)}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] font-black bg-brand-500 text-white px-3 py-1 rounded-lg">VER VACANTE</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-surface-900 p-6 rounded-3xl border-l-4 border-brand-500 shadow-md">
            <h4 class="font-black text-sm dark:text-white mb-2">${n.t}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${n.d}</p>
            <span class="text-[9px] font-bold text-brand-500 uppercase">${n.f}</span>
        </div>
    `).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };