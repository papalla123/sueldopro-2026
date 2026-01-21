let currentCalc = 'neto';
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
        neto: {
            t: "Sueldo Neto Mensual",
            guide: "Se descuenta pensiones (AFP/ONP) e Impuesto de 5ta si superas las 7 UIT anuales.",
            html: `
                <label class="input-label">Sueldo Bruto Mensual</label>
                <input type="number" id="v1" class="input-main mb-6" placeholder="S/ 0.00">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="input-label">Pensión</label>
                        <select id="s1" class="select-main"><option value="0.128">AFP (12.8%)</option><option value="0.13">ONP (13%)</option></select>
                    </div>
                    <div>
                        <label class="input-label">Asig. Familiar</label>
                        <select id="s2" class="select-main"><option value="0">No</option><option value="115">Sí (S/ 115)</option></select>
                    </div>
                </div>`
        },
        cts: {
            t: "Cálculo de CTS",
            guide: "Fórmula: (Sueldo + 1/6 Gratificación) / 12 * Meses laborados.",
            html: `
                <label class="input-label">Sueldo Bruto</label>
                <input type="number" id="v1" class="input-main mb-6">
                <label class="input-label">Última Gratificación</label>
                <input type="number" id="v2" class="input-main mb-6">
                <label class="input-label">Meses laborados en el semestre</label>
                <input type="number" id="v3" class="input-main" value="6" max="6">`
        },
        grati: {
            t: "Gratificación de Ley",
            guide: "Equivale a un sueldo completo + bono extraordinario (9% Essalud o 6.75% EPS).",
            html: `
                <label class="input-label">Sueldo Base</label>
                <input type="number" id="v1" class="input-main mb-6">
                <label class="input-label">Seguro</label>
                <select id="s1" class="select-main"><option value="0.09">Essalud (9%)</option><option value="0.0675">EPS (6.75%)</option></select>
                <label class="input-label" class="mt-4">Meses laborados (1-6)</label>
                <input type="number" id="v2" class="input-main" value="6" max="6">`
        },
        liq: {
            t: "Liquidación Estimada",
            guide: "Suma de truncos: CTS + Grati + Vacaciones. Basado en meses trabajados del año.",
            html: `
                <label class="input-label">Sueldo Bruto</label>
                <input type="number" id="v1" class="input-main mb-6">
                <label class="input-label">Meses trabajados en el año</label>
                <input type="number" id="v2" class="input-main" value="1">`
        }
    };

    const c = configs[currentCalc] || configs.neto;
    ui.innerHTML = `<h3 class="text-2xl font-black mb-6 dark:text-white">${c.t}</h3>${c.html}<button onclick="calculate()" class="w-full mt-8 bg-brand-500 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-brand-600 transition-all">CALCULAR AHORA</button>`;
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

    if(currentCalc === 'neto') {
        const bruto = v1 + s2;
        const pens = bruto * s1;
        const renta = bruto > 5000 ? (bruto - 5000) * 0.08 : 0;
        total = bruto - pens - renta;
        detail = `Bruto: S/ ${bruto} | Pensión: -S/ ${pens.toFixed(2)} | Renta: -S/ ${renta.toFixed(2)}`;
    } else if(currentCalc === 'cts') {
        total = ((v1 + (v2/6)) / 12) * v3;
        detail = `Base Computable: S/ ${(v1+(v2/6)).toFixed(2)}`;
    } else if(currentCalc === 'grati') {
        const base = (v1 / 6) * v2;
        total = base + (base * s1);
        detail = `Bono Ext.: S/ ${(base * s1).toFixed(2)}`;
    } else if(currentCalc === 'liq') {
        total = (v1 * 1.5) * (v2/12); // Simplificado Pro
        detail = "Incluye proporciones legales.";
    }

    document.getElementById('calc-res').innerText = `S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    document.getElementById('calc-details').innerHTML = detail;
}

// RESTO DE FUNCIONES (FOREX, JOBS, NEWS)
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="updateForex('${c.id}')" class="w-full flex justify-between p-4 rounded-xl bg-slate-50 dark:bg-surface-800 border-2 border-transparent hover:border-brand-500 transition-all">
            <span class="font-bold text-xs dark:text-white">${c.n}</span>
            <span class="font-black text-brand-500">${c.id}</span>
        </button>
    `).join('');
    updateForex('USD');
}

function updateForex(id = 'USD') {
    const amt = parseFloat(document.getElementById('f-amt').value) || 0;
    const c = currencies.find(curr => curr.id === id);
    document.getElementById('chart-label').innerText = `${(amt/c.p).toFixed(2)} ${c.id}`;
    
    if(chart) chart.destroy();
    chart = new Chart(document.getElementById('f-chart'), {
        type: 'line',
        data: { labels: ['L','M','X','J','V','S','D'], datasets: [{ data: c.h, borderColor: '#0066ff', tension: 0.4 }] },
        options: { plugins: { legend: false }, scales: { y: { display: false } } }
    });
}

function renderJobs() {
    const q = document.getElementById('job-search').value.toLowerCase();
    document.getElementById('job-grid').innerHTML = jobs.filter(j => j.n.toLowerCase().includes(q)).slice(0, 20).map(j => `
        <div class="job-card">
            <div class="text-3xl mb-3">${j.i}</div>
            <h4 class="text-xs font-black dark:text-white uppercase mb-1">${j.n}</h4>
            <p class="text-[10px] text-slate-400 mb-4">${j.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-brand-500 font-bold">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] font-black bg-brand-500 text-white px-3 py-1 rounded-lg">LINKEDIN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.slice(0, 12).map(n => `
        <div class="bg-white dark:bg-surface-900 p-6 rounded-3xl border-l-4 border-brand-500 shadow-lg">
            <h4 class="font-black text-sm dark:text-white mb-3">${n.t}</h4>
            <div class="flex justify-between items-center">
                <span class="text-[9px] font-bold text-slate-400 uppercase">${n.f}</span>
                <a href="${n.l}" class="text-[10px] text-brand-500 font-black underline">LEER</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };