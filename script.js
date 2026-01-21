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

// CALCULADORAS EXPERTAS
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.tab-pill').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + type).classList.add('active');
    renderUI();
}

function renderUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    const config = {
        neto: {
            t: "Sueldo Líquido Mensual", color: "bg-brand-500",
            guide: "<li><b>Asignación Familiar:</b> S/ 115 adicionales si tienes hijos.</li><li><b>5ta Categoría:</b> Aplicamos la escala progresiva sobre el exceso de 7 UIT (S/ 38,500 anuales).</li>",
            html: `<label class="label-pro">Sueldo Bruto (S/)</label><input type="number" id="v1" class="input-pro mb-8" placeholder="Ej: 5000">
                   <div class="flex items-center gap-4 bg-slate-100 dark:bg-surface-800 p-6 rounded-3xl">
                   <input type="checkbox" id="hijos" class="w-8 h-8 rounded-xl accent-brand-500"><label class="text-xs font-black uppercase text-slate-500">¿Hijos menores o universitarios?</label></div>`
        },
        grati: {
            t: "Gratificación Proyectada", color: "bg-purple-600",
            guide: "<li><b>Bono Ley:</b> Recibes un 9% adicional (Essalud) o 6.75% (EPS) que no tiene descuentos de pensiones.</li>",
            html: `<label class="label-pro">Sueldo Mensual</label><input type="number" id="v1" class="input-pro mb-8" placeholder="S/">
                   <label class="label-pro">Meses trabajados en el periodo</label><input type="number" id="v2" class="input-pro" value="6" max="6">`
        },
        cts: {
            t: "Compensación por Tiempo de Servicio", color: "bg-emerald-600",
            guide: "<li>La CTS se deposita en Mayo y Noviembre. Es el sueldo más 1/6 de la gratificación dividido entre 2.</li>",
            html: `<label class="label-pro">Sueldo Bruto</label><input type="number" id="v1" class="input-pro mb-8" placeholder="S/">
                   <label class="label-pro">Sexto de Gratificación</label><input type="number" id="v2" class="input-pro" placeholder="S/">`
        },
        cuarta: {
            t: "Recibos por Honorarios", color: "bg-amber-600",
            guide: "<li><b>Retención:</b> 8% obligatorio si el recibo supera los S/ 1,500.</li>",
            html: `<label class="label-pro">Monto del Recibo</label><input type="number" id="v1" class="input-pro" placeholder="S/">`
        }
    };

    const c = config[currentCalc];
    ui.innerHTML = `<h3 class="text-3xl font-black mb-8 dark:text-white italic tracking-tighter uppercase">${c.t}</h3>${c.html}<button onclick="process()" class="btn-calc ${c.color}">Ejecutar Simulación</button>`;
    guide.innerHTML = c.guide;
    document.getElementById('res-card').className = `${c.color} p-10 rounded-[3rem] text-white shadow-2xl transition-all duration-500`;
}

function process() {
    const v1 = parseFloat(document.getElementById('v1').value) || 0;
    const res = document.getElementById('calc-res');
    const breakdown = document.getElementById('calc-breakdown');
    let total = 0;
    let detail = "";

    if(currentCalc === 'neto') {
        const af = document.getElementById('hijos').checked ? 115 : 0;
        const brutoTotal = v1 + af;
        const pension = brutoTotal * 0.125;
        const renta = brutoTotal > 4500 ? (brutoTotal - 4500) * 0.08 : 0;
        total = brutoTotal - pension - renta;
        detail = `Bruto: S/ ${brutoTotal} | AFP: -S/ ${pension.toFixed(2)} | IR: -S/ ${renta.toFixed(2)}`;
    } else if(currentCalc === 'grati') {
        const meses = parseFloat(document.getElementById('v2').value) || 6;
        const base = (v1 / 6) * meses;
        total = base * 1.09;
        detail = `Base: S/ ${base.toFixed(2)} | Bono Ley (9%): S/ ${(base*0.09).toFixed(2)}`;
    } else if(currentCalc === 'cts') {
        const v2 = parseFloat(document.getElementById('v2').value) || 0;
        total = (v1 + v2) / 2;
        detail = `Sueldo + 1/6 Grati: S/ ${(v1+v2).toFixed(2)}`;
    } else if(currentCalc === 'cuarta') {
        const ret = v1 > 1500 ? v1 * 0.08 : 0;
        total = v1 - ret;
        detail = `Monto Bruto: S/ ${v1} | Retención (8%): -S/ ${ret.toFixed(2)}`;
    }

    res.innerText = `S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    breakdown.innerHTML = detail;
}

// FOREX ENGINE
function renderForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="selectForex('${c.id}')" class="w-full flex justify-between p-5 rounded-2xl border-2 transition-all ${currentForexId === c.id ? 'border-brand-500 bg-brand-50 dark:bg-surface-800' : 'border-transparent bg-slate-50 dark:bg-surface-800'}">
            <span class="font-bold text-sm dark:text-white">${c.n}</span>
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
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'],
            datasets: [{ data: curr.h, borderColor: '#0066ff', borderWidth: 4, tension: 0.4, fill: true, backgroundColor: 'rgba(0,102,255,0.05)' }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }
    });
}

// JOBS Y NEWS
function renderJobs() {
    const search = document.getElementById('job-search').value.toLowerCase();
    const grid = document.getElementById('job-grid');
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(search));
    grid.innerHTML = filtered.map(j => `
        <div class="job-card bg-white dark:bg-surface-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-surface-800 transition-all hover:scale-105">
            <div class="text-4xl mb-4">${j.i}</div>
            <h4 class="font-black text-xs uppercase mb-2 dark:text-white tracking-tighter">${j.n}</h4>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mb-6">${j.d}</p>
            <div class="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-surface-800">
                <span class="font-black text-brand-500">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="bg-brand-500 text-white px-5 py-2 rounded-xl text-[10px] font-black hover:bg-black transition-colors">LINKEDIN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-surface-900 p-8 rounded-[3rem] border-l-[12px] border-red-600 shadow-xl transition-all hover:-translate-y-2">
            <h4 class="font-black text-xl mb-4 leading-tight dark:text-white">${n.t}</h4>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-6">${n.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-red-600 uppercase tracking-widest">${n.f}</span>
                <a href="${n.l}" target="_blank" class="text-xs font-black underline hover:text-red-600 transition-colors dark:text-white">READ FULL STORY</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { setCalc('neto'); renderJobs(); renderNews(); };