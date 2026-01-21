let currentCalc = 'neto';
let currentForexId = 'USD';
let chart = null;

// TEMA
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('theme-icon').innerText = isDark ? '☀️' : '🌙';
}

// NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') renderForex();
    if(id === 'jobs') renderJobs();
    if(id === 'news') renderNews();
}

// CALCULADORAS
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + type).classList.add('active');
    renderUI();
}

function renderUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    const config = {
        neto: {
            t: "Cálculo de Sueldo Líquido",
            color: "bg-brand-500",
            guide: "<p><b>Asignación Familiar:</b> Si tienes hijos, se suma S/ 115 (10% de la RMV 2026).</p><p><b>Aportes:</b> Se descuenta AFP (aprox 12.5%) u ONP (13%).</p><p><b>5ta Categoría:</b> Retención progresiva si tu ingreso anual supera las 7 UIT.</p>",
            html: `
                <label class="label-pro">Sueldo Bruto Mensual</label>
                <input type="number" id="v1" class="input-pro mb-6" placeholder="Ej: 3500">
                <div class="flex items-center gap-4 bg-slate-50 dark:bg-dark-800 p-4 rounded-2xl mb-4">
                    <input type="checkbox" id="hijos" class="w-6 h-6 rounded-lg accent-brand-500">
                    <label class="text-xs font-black uppercase text-slate-500">¿Tienes hijos menores?</label>
                </div>
            `
        },
        grati: {
            t: "Cálculo de Gratificación",
            color: "bg-purple-600",
            guide: "<p><b>Fórmula:</b> Un sueldo completo + bono ley.</p><p><b>Bono Extra:</b> 9% adicional (Essalud) o 6.75% (EPS). Este monto es libre de impuestos y AFP.</p>",
            html: `
                <label class="label-pro">Sueldo Base Mensual</label>
                <input type="number" id="v1" class="input-pro mb-6" placeholder="S/">
                <label class="label-pro">Meses en el semestre (Max 6)</label>
                <input type="number" id="v2" class="input-pro" value="6">
            `
        },
        cts: {
            t: "CTS Semestral",
            color: "bg-red-600",
            guide: "<p>Se calcula sobre el sueldo base más 1/6 de la gratificación percibida.</p><p>Se deposita dos veces al año (Mayo y Noviembre).</p>",
            html: `
                <label class="label-pro">Sueldo Bruto Mensual</label>
                <input type="number" id="v1" class="input-pro mb-6" placeholder="S/">
                <label class="label-pro">Monto de Última Grati</label>
                <input type="number" id="v2" class="input-pro" placeholder="S/">
            `
        }
    };

    const c = config[currentCalc] || config.neto;
    ui.innerHTML = `<h3 class="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter">${c.t}</h3>${c.html}<button onclick="process()" class="btn-calc ${c.color}">Calcular Ahora</button>`;
    guide.innerHTML = c.guide;
    document.getElementById('res-box').className = `${c.color} text-white p-8 rounded-[2rem] shadow-xl transition-all`;
}

function process() {
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    let res = 0;

    if(currentCalc === 'neto') {
        const asig = document.getElementById('hijos').checked ? 115 : 0;
        const totalBruto = v1 + asig;
        const pension = totalBruto * 0.128; // Promedio AFP 2026
        const renta = totalBruto > 4500 ? (totalBruto - 4500) * 0.08 : 0; // Simplificado
        res = totalBruto - pension - renta;
    } else if(currentCalc === 'grati') {
        const v2 = parseFloat(document.getElementById('v2').value) || 0;
        res = (v1 / 6 * v2) * 1.09;
    } else if(currentCalc === 'cts') {
        const v2 = parseFloat(document.getElementById('v2').value) || 0;
        res = (v1 + (v2 / 6)) / 2;
    }

    document.getElementById('calc-res').innerText = `S/ ${res.toLocaleString(undefined, {minimumFractionDigits:2})}`;
}

// FOREX
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="selectForex('${c.id}')" class="w-full flex justify-between p-4 rounded-xl border-2 transition-all ${currentForexId === c.id ? 'border-brand-500 bg-brand-50 dark:bg-dark-800' : 'border-transparent bg-slate-50 dark:bg-dark-800'}">
            <span class="font-bold text-xs">${c.n}</span>
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
            labels: ['L','M','M','J','V','S','D'],
            datasets: [{ data: curr.h, borderColor: '#0066ff', tension: 0.4, fill: true, backgroundColor: 'rgba(0,102,255,0.05)' }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

// JOBS Y NEWS
function renderJobs() {
    document.getElementById('job-grid').innerHTML = jobs.map(j => `
        <div class="bg-white dark:bg-dark-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all shadow-sm">
            <div class="text-3xl mb-4">${j.i}</div>
            <h4 class="font-black text-xs uppercase mb-2 dark:text-white">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                <span class="font-black text-brand-500 text-sm">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] font-black bg-brand-500 text-white px-3 py-2 rounded-lg">VER EN LINKEDIN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-dark-900 p-8 rounded-[2.5rem] border-l-8 border-brand-500 shadow-xl transition-all hover:translate-x-2">
            <h4 class="font-black text-xl mb-3 dark:text-white">${n.t}</h4>
            <p class="text-sm text-slate-500 mb-5">${n.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-brand-500 uppercase">${n.f}</span>
                <a href="${n.l}" class="text-xs font-bold underline">LEER MÁS</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };