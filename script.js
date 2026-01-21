let currentCalc = 'neto';
let currentForexId = 'USD';
let chart = null;

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('theme-btn').innerText = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
}

function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') renderForexList();
    if(id === 'jobs') renderJobs();
    if(id === 'news') renderNews();
}

// CALCULADORAS CON LÓGICA FAMILIAR
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    
    const configs = {
        neto: {
            title: "Sueldo Neto Mensual", color: "bg-blue-600",
            guide: "<b>Asignación Familiar:</b> Equivale al 10% de la RMV (S/ 115) si tienes hijos menores.<br><b>AFP/ONP:</b> Descuento aproximado del 13% para tu jubilación.",
            ui: `
                <label class="label-pro">Sueldo Bruto (S/)</label>
                <input type="number" id="v1" class="input-pro mb-4" placeholder="Ej: 3000">
                <div class="flex gap-3 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl mb-4">
                    <input type="checkbox" id="hijos" class="w-6 h-6">
                    <label class="text-xs font-bold uppercase">Tengo hijos / Asignación Familiar</label>
                </div>`
        },
        grati: {
            title: "Gratificación (Jul/Dic)", color: "bg-purple-600",
            guide: "Las gratificaciones son sueldos completos + Bono Extra del 9% (Essalud) o 6.75% (EPS). No están sujetas a descuentos de AFP.",
            ui: `
                <label class="label-pro">Sueldo Base</label>
                <input type="number" id="v1" class="input-pro mb-4" placeholder="S/">
                <label class="label-pro">Meses Laborados</label>
                <input type="number" id="v2" class="input-pro" value="6">`
        },
        cts: {
            title: "Cálculo de CTS", color: "bg-red-600",
            guide: "La CTS se calcula sumando tu sueldo + 1/6 de la gratificación, dividido entre 2 para el pago semestral.",
            ui: `
                <label class="label-pro">Sueldo Mensual</label>
                <input type="number" id="v1" class="input-pro mb-4" placeholder="S/">
                <label class="label-pro">Monto Última Grati</label>
                <input type="number" id="v2" class="input-pro" placeholder="S/">`
        }
    };

    const c = configs[type] || configs.neto;
    document.getElementById('calc-ui').innerHTML = `<h3 class="text-2xl font-black mb-6 dark:text-white">${c.title}</h3>${c.ui}<button onclick="calculate()" class="btn-calc ${c.color}">Calcular Ahora</button>`;
    document.getElementById('guide-text').innerHTML = c.guide;
    document.getElementById('res-card').className = `${c.color} text-white p-8 rounded-[2.5rem] shadow-xl transition-all`;
}

function calculate() {
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    let final = 0;
    if(currentCalc === 'neto') {
        const asig = document.getElementById('hijos').checked ? 115 : 0;
        final = (v1 + asig) * 0.87; 
    } else if(currentCalc === 'grati') {
        const v2 = parseFloat(document.getElementById('v2').value) || 6;
        final = (v1 / 6 * v2) * 1.09;
    } else if(currentCalc === 'cts') {
        const v2 = parseFloat(document.getElementById('v2').value) || 0;
        final = (v1 + (v2/6)) / 2;
    }
    document.getElementById('calc-res').innerText = `S/ ${final.toLocaleString(undefined, {minimumFractionDigits:2})}`;
}

// FOREX, JOBS Y NEWS (RESTORED)
function renderForexList() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `<div onclick="selectForex('${c.id}')" class="p-4 rounded-xl cursor-pointer transition-all border dark:border-slate-800 hover:bg-blue-600 hover:text-white ${currentForexId === c.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800'} flex justify-between font-bold"><span>${c.n}</span><span>${c.id}</span></div>`).join('');
    updateForex();
}

function selectForex(id) { currentForexId = id; renderForexList(); }

function updateForex() {
    const amt = parseFloat(document.getElementById('f-amt').value) || 0;
    const curr = currencies.find(c => c.id === currentForexId);
    const res = (amt / curr.p).toLocaleString(undefined, {maximumFractionDigits:2});
    document.getElementById('chart-title').innerText = `${res} ${curr.id}`;
    renderChart(curr.h);
}

function renderChart(data) {
    const ctx = document.getElementById('f-chart').getContext('2d');
    if(chart) chart.destroy();
    chart = new Chart(ctx, { type: 'line', data: { labels: ['L','M','M','J','V','S','D'], datasets: [{ data, borderColor: '#3b82f6', tension:0.4 }] }, options: { plugins: { legend: { display: false } } } });
}

function renderJobs() {
    document.getElementById('job-grid').innerHTML = jobs.map(j => `<div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-all hover:scale-105 shadow-sm">
        <span class="text-3xl">${j.i}</span><h4 class="font-black mt-4 text-xs uppercase dark:text-white">${j.n}</h4><p class="text-[10px] opacity-50 my-2 dark:text-slate-400">${j.d}</p>
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <span class="font-black text-blue-600">S/ ${j.min}</span>
            <a href="${j.l}" target="_blank" class="bg-blue-600 text-white px-3 py-2 rounded-lg text-[9px] font-bold">LINKEDIN</a>
        </div></div>`).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `<div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-l-8 border-red-600 shadow-sm transition-all hover:shadow-xl">
        <h4 class="font-black text-lg mb-2 dark:text-white">${n.t}</h4><p class="text-sm text-slate-500 mb-4">${n.d}</p>
        <div class="flex justify-between items-center"><span class="text-[10px] font-bold text-red-600 uppercase">${n.f}</span><a href="${n.l}" target="_blank" class="text-xs font-black underline dark:text-white">VER FUENTE</a></div></div>`).join('');
}

window.onload = () => { setCalc('neto'); renderJobs(); renderNews(); };