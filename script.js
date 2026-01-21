let currentCalc = 'neto';
let currentForex = 'USD';
let chart = null;

// --- TEMA DÍA/NOCHE ---
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-btn');
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    btn.innerText = isDark ? '☀️ Modo Día' : '🌙 Modo Noche';
}

// --- NAVEGACIÓN ---
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') initForex();
}

// --- CALCULADORAS ---
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    renderCalcUI();
}

function renderCalcUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    
    const configs = {
        neto: {
            t: "Sueldo Neto Mensual",
            i: "Sueldo Bruto (S/)",
            g: "Calcula el dinero real que recibes después de descuentos de AFP (aprox 12%) o ONP (13%) e Impuesto a la Renta de 5ta categoría.",
            extra: `<select id="pension" class="main-input mt-4 text-lg"><option value="0.12">AFP (Promedio 12%)</option><option value="0.13">ONP (Fijo 13%)</option></select>`
        },
        costo: {
            t: "Análisis Costo Empresa",
            i: "Sueldo Bruto Ofrecido",
            g: "Muestra la inversión total del empleador. Suma Essalud (9%), Gratificaciones, CTS y Vacaciones. ¡Es casi un 45% más!",
            extra: `<div class="p-4 bg-blue-500/10 rounded-xl mt-4 text-[10px] font-bold text-blue-600">RÉGIMEN GENERAL 2026 ACTUALIZADO</div>`
        },
        cuarta: {
            t: "Independiente (4ta)",
            i: "Monto del Recibo",
            g: "Para trabajadores por recibos. Si superas los S/ 1,500, se aplica la retención del 8% de SUNAT.",
            extra: ""
        },
        vacaciones: {
            t: "Cálculo de Vacaciones",
            i: "Sueldo Mensual",
            g: "Proyecta el pago por tus 30 días de descanso o el pago trunco si dejas la empresa.",
            extra: `<input type="number" id="v-days" placeholder="Días (Ej: 15)" class="main-input mt-4">`
        },
        grati: {
            t: "Gratificación Proyectada",
            i: "Sueldo Mensual",
            g: "Pago adicional en Julio y Diciembre. Incluye la bonificación extraordinaria de Essalud (9%).",
            extra: ""
        }
    };

    const c = configs[currentCalc];
    ui.innerHTML = `
        <h3 class="text-3xl font-black mb-6 italic text-blue-600 uppercase tracking-tighter">${c.t}</h3>
        <label class="label-text">${c.i}</label>
        <input type="number" id="main-val" placeholder="0.00" class="main-input">
        ${c.extra}
        <button onclick="processCalc()" class="pro-btn">✨ Calcular Ahora</button>
        <div id="calc-res"></div>
    `;
    guide.innerHTML = `<p>${c.g}</p><p class='pt-4 border-t border-blue-500/10'><b>Nota Legal:</b> Datos calculados con la UIT 2026 de S/ 5,500.</p>`;
}

function processCalc() {
    const val = parseFloat(document.getElementById('main-val').value);
    const res = document.getElementById('calc-res');
    if(!val) return;

    let total = 0;
    if(currentCalc === 'neto') total = val * (1 - parseFloat(document.getElementById('pension').value));
    else if(currentCalc === 'costo') total = val * 1.45;
    else if(currentCalc === 'cuarta') total = val > 1500 ? val * 0.92 : val;
    else if(currentCalc === 'vacaciones') total = (val/30) * (parseFloat(document.getElementById('v-days').value) || 0);
    else if(currentCalc === 'grati') total = val * 1.09;

    res.innerHTML = `
        <div class="mt-8 p-8 bg-slate-900 text-white rounded-[2rem] shadow-2xl animate-pulse">
            <p class="text-[10px] font-bold opacity-50 uppercase tracking-widest">Resultado Estimado</p>
            <h2 class="text-5xl font-black">S/ ${total.toLocaleString(undefined, {minimumFractionDigits:2})}</h2>
        </div>
    `;
}

// --- FOREX ---
function initForex() {
    const select = document.getElementById('forex-select');
    if(!select.options.length) {
        select.innerHTML = currencies.map(c => `<option value="${c.id}">${c.n} (${c.id})</option>`).join('');
    }
    updateForexUI();
}

function updateForexUI() {
    currentForex = document.getElementById('forex-select').value;
    const curr = currencies.find(c => c.id === currentForex);
    convertCurrency();
    renderChart(curr.h, curr.id);
}

function convertCurrency() {
    const amt = parseFloat(document.getElementById('forex-amount').value) || 0;
    const curr = currencies.find(c => c.id === currentForex);
    document.getElementById('forex-result').innerText = `${(amt / curr.p).toLocaleString(undefined, {maximumFractionDigits:2})} ${curr.id}`;
}

function renderChart(history, label) {
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
                tension: 0.4
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });
}

// --- RADAR ---
function renderJobs() {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.map(j => `
        <div class="job-card p-8 rounded-[2rem] border border-slate-100 transition-all hover:border-blue-500">
            <span class="text-5xl">${j.i}</span>
            <h4 class="text-xl font-black mt-4 text-blue-600 uppercase">${j.n}</h4>
            <p class="text-xs opacity-60 my-4 leading-relaxed">${j.d}</p>
            <div class="pt-6 border-t flex justify-between items-center">
                <span class="font-black text-sm">S/ ${j.min.toLocaleString()}</span>
                <a href="${j.l}" target="_blank" class="bg-slate-900 text-white px-4 py-2 rounded-lg text-[10px] font-bold">INFO MINTRA</a>
            </div>
        </div>
    `).join('');
}

window.onload = () => { renderCalcUI(); renderJobs(); };