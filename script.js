let currentCalc = 'neto';
let currentForex = 'USD';
let chart = null;

// 1. TEMA DÍA/NOCHE
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    document.getElementById('theme-btn').innerText = isDark ? '🌙' : '☀️';
}

// 2. NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') initForex();
}

// 3. CALCULADORAS
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    renderCalcUI();
}

function renderCalcUI() {
    const ui = document.getElementById('calc-ui');
    const configs = {
        neto: { t:"Sueldo Neto", i:"Bruto Mensual", extra:`<select id="pension" class="w-full p-4 rounded-xl bg-white dark:bg-slate-800 mt-4 outline-none font-bold"><option value="0.12">AFP (12%)</option><option value="0.13">ONP (13%)</option></select>` },
        vacaciones: { t:"Liquidación Vacaciones", i:"Sueldo Mensual", extra:`<input type="number" id="v-days" placeholder="Días pendientes" class="w-full p-4 rounded-xl bg-white dark:bg-slate-800 mt-4 outline-none font-bold">` },
        cuarta: { t:"Recibos por Honorarios", i:"Monto del Recibo", extra:`<p class="text-[10px] mt-2 opacity-50 font-bold">RETENCIÓN AUTOMÁTICA DEL 8% SI SUPERA S/ 1,500</p>` }
    };
    const c = configs[currentCalc] || configs.neto;
    ui.innerHTML = `
        <h3 class="text-3xl font-black mb-6 italic">${c.t}</h3>
        <input type="number" id="main-val" placeholder="${c.i}" class="w-full p-6 rounded-2xl bg-white dark:bg-slate-800 text-4xl font-black border-2 border-transparent focus:border-blue-500 outline-none">
        ${c.extra || ''}
        <button onclick="processCalc()" class="w-full mt-6 bg-blue-600 text-white p-5 rounded-2xl font-black hover:bg-blue-700 shadow-xl">CALCULAR AHORA</button>
        <div id="calc-res"></div>
    `;
}

function processCalc() {
    const val = parseFloat(document.getElementById('main-val').value);
    const res = document.getElementById('calc-res');
    if(!val) return;

    let total = 0;
    if(currentCalc === 'neto') {
        const p = val * parseFloat(document.getElementById('pension').value);
        total = val - p;
    } else if(currentCalc === 'vacaciones') {
        const days = parseFloat(document.getElementById('v-days').value) || 0;
        total = (val / 30) * days;
    } else if(currentCalc === 'cuarta') {
        total = val > 1500 ? val * 0.92 : val;
    }

    res.innerHTML = `<div class="mt-8 p-8 bg-slate-900 text-white rounded-[2rem] animate-pulse">
        <p class="text-xs font-bold opacity-50 uppercase">Resultado Neto</p>
        <h2 class="text-5xl font-black tracking-tighter">S/ ${total.toLocaleString()}</h2>
    </div>`;
}

// 4. FOREX PRO
function initForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <div onclick="updateForex('${c.id}')" class="forex-item ${currentForex === c.id ? 'active' : ''}" id="fx-${c.id}">
            <div><span class="font-black">${c.id}</span> <span class="text-[10px] opacity-50 ml-2">${c.n}</span></div>
            <div class="font-bold">${c.p.toLocaleString()}</div>
        </div>
    `).join('');
    updateForex(currentForex);
}

function updateForex(id) {
    currentForex = id;
    const curr = currencies.find(c => c.id === id);
    document.querySelectorAll('.forex-item').forEach(i => i.classList.remove('active'));
    document.getElementById('fx-'+id).classList.add('active');
    document.getElementById('chart-title').innerText = `${id}/PEN`;
    document.getElementById('forex-price').innerText = curr.p.toLocaleString();
    
    renderChart(curr.h);
}

function renderChart(history) {
    const ctx = document.getElementById('forexChart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Hoy'],
            datasets: [{
                data: history,
                borderColor: '#0066ff',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

// 5. RADAR
function renderJobs(q = "") {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.filter(j => j.n.toLowerCase().includes(q.toLowerCase())).map(j => `
        <div class="job-card">
            <div class="text-5xl mb-4">${j.i}</div>
            <h4 class="text-xl font-black text-blue-600 mb-2">${j.n}</h4>
            <p class="text-xs opacity-60 mb-6 leading-relaxed">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t dark:border-slate-800">
                <span class="font-black italic text-sm">S/ ${j.min.toLocaleString()} - ${j.max.toLocaleString()}</span>
                <a href="${j.l}" target="_blank" class="bg-slate-900 text-white p-3 rounded-xl text-[10px] font-bold">INFO</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => {
    renderCalcUI();
    renderJobs();
    document.getElementById('job-search').addEventListener('input', (e) => renderJobs(e.target.value));
};