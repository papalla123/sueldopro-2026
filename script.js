let currentCalc = 'neto';
let currentForexId = 'USD';
let chart = null;

// --- SISTEMA DE TEMAS ---
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('t-btn').innerText = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
}

// --- NAVEGACIÓN ---
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') renderForexList();
    if(id === 'news') renderNews();
}

// --- CALCULADORAS PERSONALIZADAS ---
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    
    const colors = {
        neto: { b: "border-blue-600", btn: "bg-blue-600", g: "Análisis de sueldo líquido tras impuestos y AFP." },
        costo: { b: "border-emerald-500", btn: "bg-emerald-500", g: "Costo total para el empleador (Incl. Beneficios)." },
        cuarta: { b: "border-orange-500", btn: "bg-orange-500", g: "Retención del 8% para trabajadores independientes." },
        grati: { b: "border-purple-600", btn: "bg-purple-600", g: "Cálculo de gratificaciones Julio/Diciembre + Bonificación." },
        cts: { b: "border-red-500", btn: "bg-red-500", g: "Compensación por Tiempo de Servicios semestral." }
    };
    
    const config = colors[type];
    document.getElementById('calc-border').className = `lg:col-span-3 p-1 rounded-[3rem] border-2 ${config.b}`;
    document.getElementById('guide-text').innerText = config.g;
    
    renderCalcUI(config.btn);
}

function renderCalcUI(btnColor) {
    const ui = document.getElementById('calc-ui');
    ui.innerHTML = `
        <label class="label-pro">Monto de Ingreso (S/)</label>
        <input type="number" id="main-val" class="input-pro mb-6 text-4xl" placeholder="0.00">
        <button onclick="calculate()" class="btn-magic ${btnColor}">🔥 Calcular Ahora</button>
    `;
}

function calculate() {
    const val = parseFloat(document.getElementById('main-val').value) || 0;
    let res = 0;
    if(currentCalc === 'neto') res = val * 0.88;
    else if(currentCalc === 'costo') res = val * 1.45;
    else if(currentCalc === 'cuarta') res = val > 1500 ? val * 0.92 : val;
    else if(currentCalc === 'grati') res = val * 1.09;
    else if(currentCalc === 'cts') res = val / 2;

    document.getElementById('calc-res').innerHTML = `
        <h2 class="text-4xl font-black mt-2">S/ ${res.toLocaleString()}</h2>
        <p class="text-[10px] opacity-50 mt-2">RESULTADO BASADO EN LEGISLACIÓN VIGENTE</p>
    `;
}

// --- FOREX ---
function renderForexList() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <div onclick="selectForex('${c.id}')" class="p-4 rounded-2xl cursor-pointer transition-all border border-transparent hover:bg-blue-50 flex justify-between items-center ${currentForexId === c.id ? 'bg-blue-100 border-blue-500' : ''}">
            <span class="font-bold">${c.n}</span>
            <span class="text-xs font-black opacity-40">${c.id}</span>
        </div>
    `).join('');
    updateForex();
}

function selectForex(id) {
    currentForexId = id;
    renderForexList();
}

function updateForex() {
    const amt = parseFloat(document.getElementById('f-amt').value) || 0;
    const curr = currencies.find(c => c.id === currentForexId);
    const result = (amt / curr.p).toLocaleString(undefined, {maximumFractionDigits:2});
    
    document.getElementById('chart-title').innerText = `${result} ${curr.id}`;
    renderChart(curr.h, curr.id);
}

function renderChart(data, label) {
    const ctx = document.getElementById('f-chart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Hoy'],
            datasets: [{ data: data, borderColor: '#3b82f6', tension: 0.4, fill: true, backgroundColor: 'rgba(59,130,246,0.1)' }]
        },
        options: { plugins: { legend: { display: false } }, responsive: true }
    });
}

// --- JOBS & NEWS ---
function renderJobs() {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.map(j => `
        <div class="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-blue-500 transition-all">
            <span class="text-4xl">${j.i}</span>
            <h4 class="font-black mt-4 text-xs uppercase">${j.n}</h4>
            <p class="text-[10px] opacity-50 my-2">${j.d}</p>
            <div class="flex justify-between items-center mt-4 pt-4 border-t">
                <span class="font-black text-xs">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="bg-blue-600 text-white p-2 px-4 rounded-lg text-[9px] font-bold">APLICAR</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = news.map(n => `
        <div class="news-card">
            <h4 class="font-black text-lg leading-tight mb-2">${n.t}</h4>
            <p class="text-sm opacity-60 mb-4">${n.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold text-red-600 uppercase">${n.f}</span>
                <a href="${n.l}" target="_blank" class="text-[10px] font-black underline">LEER MÁS</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { setCalc('neto'); renderJobs(); };