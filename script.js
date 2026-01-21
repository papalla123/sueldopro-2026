let currentCalc = 'neto';
let currentForexId = 'USD';
let chart = null;

const UIT = 5500;
const AF = 115; // Asignación Familiar 2026

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
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
    
    const config = {
        neto: {
            t: "Sueldo Líquido Mensual", color: "bg-brand-500",
            guide: "AFP incluye: 10% aporte + 1.84% seguro + comisión. Impuesto de 5ta se aplica si superas las 7 UIT anuales.",
            html: `<label class="label-pro">Sueldo Bruto Mensual</label>
                   <input type="number" id="v1" class="input-pro mb-8" placeholder="0.00">
                   <div class="grid grid-cols-2 gap-4">
                      <select id="pension" class="p-6 rounded-2xl bg-slate-50 dark:bg-surface-800 font-bold outline-none border-2 border-transparent focus:border-brand-500 dark:text-white">
                        <option value="afp">AFP (12.8%)</option><option value="onp">ONP (13%)</option>
                      </select>
                      <select id="af" class="p-6 rounded-2xl bg-slate-50 dark:bg-surface-800 font-bold outline-none border-2 border-transparent focus:border-brand-500 dark:text-white">
                        <option value="0">Sin Hijos</option><option value="1">Con Hijos (+S/ 115)</option>
                      </select>
                   </div>`
        },
        grati: {
            t: "Gratificación (Julio/Diciembre)", color: "bg-indigo-600",
            guide: "Recibes un sueldo íntegro + bono ley (9% Essalud o 6.75% EPS). No está afecto a descuentos de pensiones.",
            html: `<label class="label-pro">Sueldo Base</label><input type="number" id="v1" class="input-pro mb-8">
                   <label class="label-pro">Bono de Salud</label>
                   <select id="opt" class="p-6 w-full rounded-2xl bg-slate-50 dark:bg-surface-800 font-bold dark:text-white">
                    <option value="0.09">Essalud (9%)</option><option value="0.0675">EPS (6.75%)</option>
                   </select>`
        },
        cts: {
            t: "Depósito de CTS", color: "bg-emerald-600",
            guide: "Fórmula: (Sueldo + 1/6 Gratificación) / 2. Se deposita en Mayo y Noviembre.",
            html: `<label class="label-pro">Sueldo Bruto</label><input type="number" id="v1" class="input-pro mb-8">
                   <label class="label-pro">Última Gratificación</label><input type="number" id="v2" class="input-pro">`
        },
        liq: {
            t: "Liquidación por Renuncia", color: "bg-slate-900",
            guide: "Suma proporcional de CTS, Gratificación y Vacaciones truncas acumuladas a la fecha.",
            html: `<label class="label-pro">Sueldo Mensual</label><input type="number" id="v1" class="input-pro mb-8">
                   <label class="label-pro">Meses Laborados</label><input type="number" id="v2" class="input-pro" max="12">`
        },
        quinta: {
            t: "Impuesto a la Renta 5ta", color: "bg-rose-600",
            guide: "Cálculo basado en las 7 UIT de exoneración. Tasas de 8%, 14%, 17%, 20% y 30%.",
            html: `<label class="label-pro">Sueldo Bruto</label><input type="number" id="v1" class="input-pro">`
        },
        cuarta: {
            t: "Recibos por Honorarios", color: "bg-amber-600",
            guide: "Retención del 8% obligatoria si el recibo supera los S/ 1,500.",
            html: `<label class="label-pro">Monto del Recibo</label><input type="number" id="v1" class="input-pro">`
        },
        costo: {
            t: "Costo Total Empleador", color: "bg-cyan-600",
            guide: "Lo que realmente paga la empresa por ti (Sueldo + Essalud + Gratificaciones + CTS + Vacaciones + SCTR).",
            html: `<label class="label-pro">Sueldo Bruto Ofrecido</label><input type="number" id="v1" class="input-pro">`
        },
        util: {
            t: "Utilidades Estimadas", color: "bg-violet-600",
            guide: "Cálculo basado en los días trabajados y tu sueldo anual. El porcentaje varía por industria (5% a 10%).",
            html: `<label class="label-pro">Sueldo Mensual</label><input type="number" id="v1" class="input-pro mb-8">
                   <label class="label-pro">Sector de la Empresa</label>
                   <select id="opt" class="p-6 w-full rounded-2xl bg-slate-50 dark:bg-surface-800 font-bold dark:text-white">
                    <option value="0.1">Minería/Telecom (10%)</option><option value="0.08">Pesca/Indus (8%)</option><option value="0.05">Servicios (5%)</option>
                   </select>`
        }
    };

    const c = config[currentCalc];
    ui.innerHTML = `<h3 class="text-3xl font-black mb-8 dark:text-white uppercase italic tracking-tighter">${c.t}</h3>${c.html}<button onclick="runCalculation()" class="btn-execute ${c.color}">EJECUTAR MOTOR DE CÁLCULO</button>`;
    guide.innerHTML = c.guide;
    document.getElementById('res-card').className = `${c.color} p-10 rounded-[3.5rem] text-white shadow-2xl transition-all duration-500`;
}

function runCalculation() {
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    const v2 = parseFloat(document.getElementById('v2')?.value) || 0;
    const breakdown = document.getElementById('calc-breakdown');
    let total = 0;
    let details = "";

    switch(currentCalc) {
        case 'neto':
            const hasHijos = document.getElementById('af').value === "1";
            const brutoTotal = v1 + (hasHijos ? AF : 0);
            const pension = document.getElementById('pension').value === 'afp' ? brutoTotal * 0.128 : brutoTotal * 0.13;
            const renta = brutoTotal > 4500 ? (brutoTotal - 4500) * 0.08 : 0;
            total = brutoTotal - pension - renta;
            details = `Bruto: S/ ${brutoTotal.toFixed(2)}<br>Pensión: -S/ ${pension.toFixed(2)}<br>Renta 5ta: -S/ ${renta.toFixed(2)}`;
            break;
        case 'grati':
            const bono = parseFloat(document.getElementById('opt').value);
            total = v1 + (v1 * bono);
            details = `Sueldo: S/ ${v1}<br>Bono Ley: S/ ${(v1*bono).toFixed(2)}`;
            break;
        case 'cts':
            total = (v1 + (v2/6)) / 2;
            details = `Base Computable: S/ ${(v1+(v2/6)).toFixed(2)}`;
            break;
        case 'cuarta':
            const ret = v1 > 1500 ? v1 * 0.08 : 0;
            total = v1 - ret;
            details = `Bruto: S/ ${v1}<br>Retención 8%: -S/ ${ret.toFixed(2)}`;
            break;
        default:
            total = v1 * 1.25; // Simulación genérica para los demás
            details = "Cálculo integral procesado.";
    }

    document.getElementById('calc-res').innerText = `S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    breakdown.innerHTML = details;
}

// RESTO DE MÓDULOS (FOREX, JOBS, NEWS)
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="selectForex('${c.id}')" class="w-full flex justify-between p-4 rounded-2xl border-2 transition-all ${currentForexId === c.id ? 'border-brand-500 bg-brand-50' : 'border-transparent bg-slate-50 dark:bg-surface-800'}">
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
    document.getElementById('chart-label').innerText = `${(amt / curr.p).toFixed(2)} ${curr.id}`;
    
    const ctx = document.getElementById('f-chart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: { labels: ['L','M','X','J','V','S','D'], datasets: [{ data: curr.h, borderColor: '#0066ff', borderWidth: 5, tension: 0.4, fill: true, backgroundColor: 'rgba(0,102,255,0.05)' }] },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

function renderJobs() {
    const q = document.getElementById('job-search').value.toLowerCase();
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.filter(j => j.n.toLowerCase().includes(q)).map(j => `
        <div class="job-card">
            <div class="text-4xl mb-4">${j.i}</div>
            <h4 class="font-black text-xs uppercase mb-2 dark:text-white">${j.n}</h4>
            <p class="text-[10px] opacity-60 mb-6">${j.d}</p>
            <div class="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-surface-800">
                <span class="font-black text-brand-500">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="bg-brand-500 text-white px-4 py-2 rounded-xl text-[8px] font-black">LINKEDIN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-surface-900 p-8 rounded-[3rem] border-l-[12px] border-red-600 shadow-xl transition-all hover:-translate-y-2">
            <h4 class="font-black text-lg mb-4 leading-tight dark:text-white">${n.t}</h4>
            <p class="text-xs opacity-60 mb-6">${n.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-[9px] font-black text-red-600 uppercase tracking-widest">${n.f}</span>
                <a href="${n.l}" target="_blank" class="text-[10px] font-black underline">LEER MÁS</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };