let currentCalc = 'neto';
let chart = null;

// TEMA
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
}

// NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
    if(id === 'forex') initForex();
    if(id === 'jobs') renderJobs();
    if(id === 'news') renderNews();
}

// CALCULADORAS
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + type).classList.add('active');
    renderCalcUI();
}

function renderCalcUI() {
    const ui = document.getElementById('calc-ui');
    const guide = document.getElementById('guide-text');
    const configs = {
        neto: {
            title: "Calculadora de Sueldo Líquido",
            color: "bg-blue-600",
            guide: `
                <p><b>Asignación Familiar:</b> Si tienes hijos menores o universitarios, sumamos el 10% del sueldo mínimo.</p>
                <p><b>5ta Categoría:</b> Aplicamos retenciones progresivas (8%, 14%, 17%...) sobre el exceso de 7 UIT.</p>
                <p><b>Seguro:</b> Descontamos AFP (aprox 12.8%) u ONP (13%).</p>
            `,
            fields: `
                <label class="label-pro">Sueldo Bruto Mensual</label>
                <input type="number" id="val-1" class="input-pro mb-4" placeholder="Ej: 3500">
                <div class="flex gap-4 items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
                    <input type="checkbox" id="hijos" class="w-6 h-6">
                    <label class="text-xs font-bold uppercase">¿Tengo hijos / Asig. Familiar?</label>
                </div>
            `
        },
        grati: {
            title: "Proyección Gratificación",
            color: "bg-purple-600",
            guide: `
                <p><b>Ley N° 30334:</b> Las gratificaciones no tienen descuentos de AFP/ONP.</p>
                <p><b>Bono Extra:</b> Recibes un 9% adicional (Essalud) o 6.75% (Eps) sobre tu gratificación.</p>
            `,
            fields: `
                <label class="label-pro">Sueldo Base</label>
                <input type="number" id="val-1" class="input-pro mb-4" placeholder="Ej: 2000">
                <label class="label-pro">Meses Trabajados (Semestre)</label>
                <input type="number" id="val-2" class="input-pro" value="6">
            `
        },
        cts: {
            title: "Cálculo de CTS Semestral",
            color: "bg-red-600",
            guide: `
                <p>La CTS equivale a medio sueldo más 1/6 de la gratificación percibida en el semestre.</p>
                <p>Se deposita en Mayo y Noviembre.</p>
            `,
            fields: `
                <label class="label-pro">Sueldo Mensual</label>
                <input type="number" id="val-1" class="input-pro mb-4" placeholder="S/">
                <label class="label-pro">Monto de Última Gratificación</label>
                <input type="number" id="val-2" class="input-pro" placeholder="S/">
            `
        }
    };

    const c = configs[currentCalc] || configs.neto;
    ui.innerHTML = `
        <h3 class="text-2xl font-black mb-6 uppercase tracking-tighter text-slate-800 dark:text-white">${c.title}</h3>
        ${c.fields}
        <button onclick="processCalc()" class="btn-calc ${c.color}">Calcular con Ley 2026</button>
    `;
    guide.innerHTML = c.guide;
}

function processCalc() {
    const v1 = parseFloat(document.getElementById('val-1').value) || 0;
    const res = document.getElementById('calc-res');
    let final = 0;

    if(currentCalc === 'neto') {
        const asig = document.getElementById('hijos').checked ? 115 : 0;
        const bruto = v1 + asig;
        const pension = bruto * 0.12; // AFP
        const ir = bruto > 4000 ? (bruto - 4000) * 0.08 : 0; // Simplificado
        final = bruto - pension - ir;
    } else if(currentCalc === 'grati') {
        const meses = parseFloat(document.getElementById('val-2').value) || 6;
        final = (v1 / 6 * meses) * 1.09;
    } else if(currentCalc === 'cts') {
        const grati = parseFloat(document.getElementById('val-2').value) || 0;
        final = (v1 + (grati / 6)) / 2;
    }

    res.innerText = `S/ ${final.toLocaleString(undefined, {minimumFractionDigits:2})}`;
}

// RESTO DE FUNCIONES (Jobs, News, Forex)
function renderJobs() {
    const grid = document.getElementById('job-grid');
    grid.innerHTML = jobs.map(j => `
        <div class="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 hover:scale-105 transition-all">
            <span class="text-3xl">${j.i}</span>
            <h4 class="font-black text-xs uppercase mt-3 dark:text-white">${j.n}</h4>
            <div class="flex justify-between items-center mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <span class="font-black text-blue-600">S/ ${j.min}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">VER POSTULACIÓN</a>
            </div>
        </div>
    `).join('');
}

function renderNews() {
    const grid = document.getElementById('news-grid');
    grid.innerHTML = news.map(n => `
        <div class="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-l-8 border-red-600 shadow-sm">
            <h4 class="font-black text-lg mb-2 dark:text-white">${n.t}</h4>
            <p class="text-sm text-slate-500 mb-4">${n.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-[10px] font-bold uppercase text-red-600">${n.f}</span>
                <a href="${n.l}" target="_blank" class="text-xs font-black underline">LEER FUENTE</a>
            </div>
        </div>
    `).join('');
}

function initForex() {
    const list = document.getElementById('forex-list');
    list.innerHTML = currencies.map(c => `
        <button onclick="updateForex('${c.id}')" class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 font-bold text-xs hover:bg-blue-600 hover:text-white transition-all">
            ${c.id} - ${c.n}
        </button>
    `).join('');
}

window.onload = () => { setCalc('neto'); renderJobs(); renderNews(); };