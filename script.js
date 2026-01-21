let currentCalc = 'neto';
let chart = null;

// 1. NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') initChart();
}

// 2. TEMA
function toggleTheme() { document.documentElement.classList.toggle('dark'); }

// 3. LOGICA CALCULADORA
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-card').forEach(c => c.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    renderUI();
}

function renderUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-content');
    
    const content = {
        neto: {
            title: "Calculadora Sueldo Neto",
            label: "Sueldo Bruto Mensual (S/)",
            guide: "Se calcula restando AFP (aprox 12.8%) o ONP (13%) e Impuesto a la Renta de 5ta categoría si excede las 7 UIT anuales.",
            extra: `<select id="pension" class="w-full p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mt-4 font-bold outline-none">
                        <option value="0.128">AFP (12.8% aprox)</option>
                        <option value="0.13">ONP (13%)</option>
                    </select>`
        },
        empleador: {
            title: "Costo Total Empleador",
            label: "Sueldo Bruto Ofrecido (S/)",
            guide: "Muestra cuánto paga realmente la empresa incluyendo Essalud (9%), Gratificaciones, CTS y Vacaciones prorrateadas.",
            extra: `<div class="mt-4 p-4 bg-orange-500/10 rounded-xl text-[10px] font-bold text-orange-600 italic uppercase">Incluye aportes de ley 2026</div>`
        }
    };

    const c = content[currentCalc] || content['neto'];
    ui.innerHTML = `
        <h3 class="text-2xl font-black mb-6">${c.title}</h3>
        <label class="block text-[10px] font-bold opacity-40 uppercase mb-2">${c.label}</label>
        <input type="number" id="val-input" placeholder="Ej: 5000" class="w-full p-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-3xl font-black outline-none border-2 border-transparent focus:border-blue-500">
        ${c.extra || ''}
        <button onclick="calc()" class="w-full mt-6 bg-blue-600 p-5 rounded-2xl text-white font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20">PROCESAR</button>
        <div id="res-box"></div>
    `;
    guide.innerText = c.guide;
}

function calc() {
    const val = parseFloat(document.getElementById('val-input').value);
    const res = document.getElementById('res-box');
    if(!val) return;

    let final = 0;
    let detail = "";

    if(currentCalc === 'neto') {
        const rate = parseFloat(document.getElementById('pension').value);
        const pensionDesc = val * rate;
        const renta = val > 3850 ? (val - 3850) * 0.08 : 0; // Simplificado 5ta
        final = val - pensionDesc - renta;
        detail = `Tu sueldo líquido en cuenta. Descuento Pensión: S/ ${pensionDesc.toFixed(0)}.`;
    } else if(currentCalc === 'empleador') {
        const essalud = val * 0.09;
        const provs = val * 0.18; // Grati + CTS aprox
        final = val + essalud + provs;
        detail = `Costo mensual real para la empresa. Essalud: S/ ${essalud.toFixed(0)}.`;
    }

    res.innerHTML = `
        <div class="mt-8 p-8 bg-slate-900 dark:bg-blue-600 rounded-[2rem] text-white animate-bounce-short">
            <p class="text-[10px] font-bold opacity-60 uppercase mb-1">Monto Estimado</p>
            <h4 class="text-5xl font-black italic">S/ ${Math.round(final).toLocaleString()}</h4>
            <p class="text-[11px] mt-4 opacity-80 font-medium leading-relaxed">${detail}</p>
        </div>
    `;
}

// 4. CHART
function initChart() {
    const ctx = document.getElementById('forexChart');
    if(chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00h', '04h', '08h', '12h', '16h', '20h', '22h', 'Ahora'],
            datasets: [{
                label: 'USD/PEN',
                data: forexHistory,
                borderColor: '#2563eb',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.1)'
            }]
        },
        options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
    });
}

// 5. RADAR
function renderJobs(q = "") {
    const grid = document.getElementById('job-grid');
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(q.toLowerCase()));
    grid.innerHTML = filtered.map(j => `
        <div class="job-card">
            <div class="text-4xl mb-4">${j.i}</div>
            <h4 class="font-bold text-lg mb-1">${j.n}</h4>
            <p class="text-xs opacity-50 mb-6">${j.d}</p>
            <div class="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-5">
                <span class="font-black text-blue-600 italic">S/ ${j.min.toLocaleString()}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] font-black bg-slate-100 dark:bg-slate-800 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all">VER PLAZAS →</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => {
    renderUI();
    renderJobs();
    document.getElementById('job-search').addEventListener('input', (e) => renderJobs(e.target.value));
};