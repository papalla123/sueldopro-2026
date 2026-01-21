let currentCalc = 'neto';
let currentForexId = 'USD';
let chart = null;

const UIT_2026 = 5500;
const RMV_2026 = 1150;

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

function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + type).classList.add('active');
    renderUI();
}

function renderUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    
    const configs = {
        neto: {
            t: "Cálculo de Sueldo Neto",
            color: "bg-brand-500",
            guide: "<p><b>AFP:</b> Incluye aporte obligatorio (10%), prima de seguro y comisión.</p><p><b>ONP:</b> Retención única del 13%.</p><p><b>Asignación Familiar:</b> 10% de la RMV (S/ 115).</p>",
            html: `
                <label class="label-pro">Sueldo Bruto Mensual</label>
                <input type="number" id="v1" class="input-pro mb-8" placeholder="S/ 0.00">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="label-pro">Sistema Pensión</label>
                        <select id="pension" class="select-pro">
                            <option value="afp">AFP (Integra/Profuturo)</option>
                            <option value="onp">ONP (Estado)</option>
                        </select>
                    </div>
                    <div>
                        <label class="label-pro">Asig. Familiar</label>
                        <select id="hijos" class="select-pro">
                            <option value="0">Sin Hijos</option>
                            <option value="115">Con Hijos (S/ 115)</option>
                        </select>
                    </div>
                </div>
            `
        },
        grati: {
            t: "Gratificación + Bono",
            color: "bg-purple-600",
            guide: "<p>Se paga en Julio y Diciembre. Es un sueldo completo + una bonificación extraordinaria del 9% (Essalud) o 6.75% (EPS).</p>",
            html: `
                <label class="label-pro">Sueldo Base</label>
                <input type="number" id="v1" class="input-pro mb-8">
                <label class="label-pro">Seguro de Salud</label>
                <select id="seguro" class="select-pro">
                    <option value="0.09">Essalud (9%)</option>
                    <option value="0.0675">EPS (6.75%)</option>
                </select>
            `
        },
        cts: {
            t: "Depósito CTS",
            color: "bg-emerald-600",
            guide: "<p>Fórmula: (Sueldo + 1/6 Gratificación) / 2 para el cálculo semestral.</p>",
            html: `
                <label class="label-pro">Sueldo Mensual</label>
                <input type="number" id="v1" class="input-pro mb-8">
                <label class="label-pro">Última Gratificación</label>
                <input type="number" id="v2" class="input-pro">
            `
        },
        liq: {
            t: "Liquidación por Renuncia/Despido",
            color: "bg-slate-900",
            guide: "<p>Incluye Vacaciones truncas, Gratificación trunca y CTS trunca. Un cálculo integral para tu salida.</p>",
            html: `
                <label class="label-pro">Sueldo Bruto</label>
                <input type="number" id="v1" class="input-pro mb-8">
                <label class="label-pro">Meses trabajados en el año</label>
                <input type="number" id="v2" class="input-pro">
            `
        }
    };

    const c = configs[currentCalc] || configs.neto;
    ui.innerHTML = `<h3 class="text-3xl font-black mb-8 dark:text-white uppercase italic tracking-tighter">${c.t}</h3>${c.html}<button onclick="calculate()" class="btn-calc ${c.color}">Generar Reporte Técnico</button>`;
    guide.innerHTML = c.guide;
    document.getElementById('res-card').className = `${c.color} p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden transition-all duration-500`;
}

function calculate() {
    const v1 = parseFloat(document.getElementById('v1')?.value) || 0;
    const breakdown = document.getElementById('calc-breakdown');
    let total = 0;
    let list = "";

    if(currentCalc === 'neto') {
        const asig = parseFloat(document.getElementById('hijos').value);
        const tipo = document.getElementById('pension').value;
        const brutoTotal = v1 + asig;
        const pensVal = tipo === 'afp' ? brutoTotal * 0.125 : brutoTotal * 0.13;
        const renta = brutoTotal > 4500 ? (brutoTotal - 4500) * 0.08 : 0;
        total = brutoTotal - pensVal - renta;
        list = `<li>Bruto: S/ ${brutoTotal}</li><li>Pensión: -S/ ${pensVal.toFixed(2)}</li><li>Impuestos: -S/ ${renta.toFixed(2)}</li>`;
    } else if(currentCalc === 'grati') {
        const bonus = parseFloat(document.getElementById('seguro').value);
        total = v1 * (1 + bonus);
        list = `<li>Sueldo: S/ ${v1}</li><li>Bono Ley: S/ ${(v1*bonus).toFixed(2)}</li>`;
    } else if(currentCalc === 'cts') {
        const v2 = parseFloat(document.getElementById('v2')?.value) || 0;
        total = (v1 + (v2/6)) / 2;
        list = `<li>Base computable: S/ ${(v1 + (v2/6)).toFixed(2)}</li>`;
    }

    document.getElementById('calc-res').innerText = `S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    breakdown.innerHTML = `<ul class="text-xs font-bold space-y-2 uppercase tracking-widest">${list}</ul>`;
}

// RESTO DE FUNCIONES (FOREX, JOBS, NEWS)
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="selectForex('${c.id}')" class="w-full flex justify-between p-5 rounded-2xl border-2 transition-all ${currentForexId === c.id ? 'border-brand-500 bg-brand-50 dark:bg-surface-800' : 'border-transparent bg-slate-50 dark:bg-surface-800'}">
            <span class="font-bold text-xs dark:text-white">${c.n}</span>
            <span class="font-black text-brand-500">${c.id}</span>
        </button>
    `).join('');
    updateForex();
}

function selectForex(id) { currentForexId = id; renderForex(); }

function updateForex() {
    const amt = parseFloat(document.getElementById('f-amt').value) || 0;
    const curr = currencies.find(c => c.id === currentForexId);
    const converted = (amt / curr.p).toLocaleString(undefined, {maximumFractionDigits:2});
    document.getElementById('chart-label').innerText = `${converted} ${curr.id}`;
    
    const ctx = document.getElementById('f-chart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['L','M','M','J','V'],
            datasets: [{ data: curr.h, borderColor: '#0066ff', borderWidth: 6, tension: 0.4, fill: true, backgroundColor: 'rgba(0,102,255,0.05)' }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

function renderJobs() {
    const query = document.getElementById('job-search').value.toLowerCase();
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(query));
    document.getElementById('job-grid').innerHTML = filtered.map(j => `
        <div class="job-card">
            <div class="text-4xl mb-4">${j.i}</div>
            <h4 class="font-black text-xs uppercase mb-2 dark:text-white">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-6">${j.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-brand-500 font-black">S/ ${j.min} - ${j.max}</span>
                <a href="${j.l}" target="_blank" class="bg-brand-500 text-white p-3 rounded-xl text-[8px] font-black">LINKEDIN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-surface-900 p-10 rounded-[3rem] border-l-8 border-red-500 shadow-xl transition-all hover:-translate-y-2">
            <h4 class="font-black text-xl mb-4 dark:text-white leading-tight">${n.t}</h4>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${n.d}</p>
            <div class="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-surface-800">
                <span class="text-[10px] font-black text-red-500 uppercase">${n.f}</span>
                <a href="${n.l}" class="text-xs font-black underline">LEER ARTÍCULO</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };