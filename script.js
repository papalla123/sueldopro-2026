let currentCalc = 'cts';
let chart = null;
const UIT = 5500;

function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    document.getElementById('theme-icon').innerText = document.documentElement.classList.contains('dark') ? '☀️' : '🌙';
}

function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
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
    
    const conf = {
        cts: {
            t: "Cálculo de CTS",
            g: "Fórmula: (Sueldo + 1/6 Gratificación) / 12 * Meses laborados.",
            html: `
                <label class="input-label">Sueldo Bruto Actual</label>
                <input type="number" id="v1" class="input-main mb-6" oninput="calc()">
                <label class="input-label">Gratificación percibida (1/6)</label>
                <input type="number" id="v2" class="input-main mb-6" oninput="calc()">
                <label class="input-label">Meses laborados (1-6)</label>
                <input type="number" id="v3" class="input-main" value="6" oninput="calc()">`
        },
        neto: {
            t: "Sueldo Neto Mensual",
            g: "Descuento de pensión (AFP/ONP) y proyección de impuesto a la renta de 5ta.",
            html: `
                <label class="input-label">Sueldo Bruto</label>
                <input type="number" id="v1" class="input-main mb-6" oninput="calc()">
                <label class="input-label">Sistema Pensión</label>
                <select id="s1" class="select-main" onchange="calc()"><option value="0.12">AFP (12%)</option><option value="0.13">ONP (13%)</option></select>`
        }
    };

    const c = conf[currentCalc] || conf.cts;
    ui.innerHTML = `<h3 class="text-2xl font-black mb-6 dark:text-white uppercase tracking-tighter">${c.t}</h3>${c.html}`;
    guide.innerText = c.g;
    calc();
}

function calc() {
    // Ajuste de precisión para Renta 5ta en script.js
function calcularRenta5ta(sueldoBruto) {
    const sueldoAnual = sueldoBruto * 14; // Incluye gratificaciones
    const baseImponible = sueldoAnual - (7 * 5500); // 7 UIT de 2026
    if (baseImponible <= 0) return 0;
    
    // Escala simplificada para el demo (8% primer tramo)
    const impuestoAnual = baseImponible * 0.08;
    return impuestoAnual / 12;
}

    if(currentCalc === 'cts') {
        res = ((v1 + (v2/6)) / 12) * v3;
        detail = `Base computable: S/ ${(v1+(v2/6)).toFixed(2)}`;
    } else if(currentCalc === 'neto') {
        const pens = v1 * s1;
        const renta = v1 > 5000 ? (v1 - 5000) * 0.08 : 0;
        res = v1 - pens - renta;
        detail = `Pensión: -S/ ${pens.toFixed(2)} | Renta: -S/ ${renta.toFixed(2)}`;
    }

    document.getElementById('calc-res').innerText = `S/ ${res.toLocaleString(undefined, {minimumFractionDigits:2})}`;
    document.getElementById('calc-details').innerHTML = detail;
}

// Funciones de Renderizado (Forex, Jobs, News)
function renderForex() {
    document.getElementById('forex-list').innerHTML = currencies.map(c => `
        <button onclick="updateChart('${c.id}')" class="w-full flex justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:border-brand-500 border-2 border-transparent transition-all">
            <span class="font-bold text-xs dark:text-slate-300">${c.n}</span>
            <span class="font-black text-brand-500">${c.id}</span>
        </button>`).join('');
    updateChart('USD');
}

function updateChart(id) {
    const c = currencies.find(x => x.id === id);
    if(chart) chart.destroy();
    chart = new Chart(document.getElementById('f-chart'), {
        type: 'line',
        data: { labels: ['L','M','X','J','V'], datasets: [{ data: [c.p, c.p*1.02, c.p*0.98, c.p*1.01, c.p], borderColor: '#0066ff', tension:0.4 }] },
        options: { plugins: { legend: false } }
    });
}

function renderJobs() {
    const q = document.getElementById('job-search').value.toLowerCase();
    document.getElementById('job-grid').innerHTML = jobs.filter(j => j.n.toLowerCase().includes(q)).slice(0, 15).map(j => `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border dark:border-slate-800">
            <div class="text-3xl mb-4">${j.i}</div>
            <h4 class="text-sm font-black dark:text-white uppercase mb-1">${j.n}</h4>
            <p class="text-[10px] text-slate-400 mb-4">${j.d}</p>
            <div class="flex justify-between items-center border-t dark:border-slate-800 pt-4">
                <span class="text-brand-500 font-bold">S/ ${j.min.toFixed(0)}</span>
                <button class="bg-brand-500 text-white text-[10px] font-black px-4 py-2 rounded-lg">VER MÁS</button>
            </div>
        </div>`).join('');
}

function renderNews() {
    document.getElementById('news-grid').innerHTML = news.map(n => `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-3xl border-l-8 border-brand-500">
            <h4 class="font-black text-sm dark:text-white mb-2">${n.t}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${n.d}</p>
            <span class="text-[9px] font-bold text-brand-500 uppercase">${n.f}</span>
        </div>`).join('');
}

window.onload = () => { renderUI(); renderJobs(); renderNews(); };