// script.js - Lógica Maestra
let currentCalc = 'peru';

// 1. NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
}

// 2. MODO OSCURO
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
}

// 3. LOGICA DE CALCULADORAS
function setCalc(type) {
    currentCalc = type;
    document.querySelectorAll('.calc-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    const labels = {
        peru: "Sueldo Bruto Mensual",
        gratificacion: "Sueldo Bruto para Grati",
        cts: "Sueldo Bruto para CTS",
        renta: "Proyección Anual Bruta"
    };
    document.getElementById('input-label').innerText = labels[type] || "Monto a calcular";
}

function ejecutarCalculo() {
    const val = parseFloat(document.getElementById('main-input').value);
    const res = document.getElementById('resultado-calculo');
    if(!val) return;

    let final = 0;
    let desc = "";

    switch(currentCalc) {
        case 'peru': 
            final = val * 0.88; // Simplicado: AFP + Seguro
            desc = "Neto mensual aproximado tras descuentos de ley.";
            break;
        case 'gratificacion':
            final = val + (val * 0.09);
            desc = "Sueldo completo + Bono extraordinario (9%).";
            break;
        case 'independiente':
            final = val > 3500 ? val * 0.92 : val;
            desc = "Retención de 8% (IR) aplicada si supera el tope.";
            break;
        default:
            final = val * 1.15;
            desc = "Cálculo proyectado según normativa 2026.";
    }

    res.innerHTML = `
        <div class="mt-8 p-6 bg-blue-600 rounded-2xl text-white animate-pulse">
            <p class="text-[10px] font-bold uppercase opacity-80">Resultado Estimado</p>
            <h3 class="text-4xl font-black">S/ ${final.toLocaleString()}</h3>
            <p class="text-xs mt-2 opacity-90">${desc}</p>
        </div>
    `;
}

// 4. RENDERS (Noticias, Empleos, Divisas)
function renderAll() {
    // Empleos
    const jobGrid = document.getElementById('job-grid');
    jobGrid.innerHTML = jobs.map(j => `
        <div class="job-card">
            <span class="text-3xl">${j.i}</span>
            <h4 class="font-bold text-blue-600 mt-2">${j.n}</h4>
            <p class="text-xs opacity-60 mb-4">${j.d}</p>
            <div class="font-black text-sm text-slate-400">S/ ${j.min} - S/ ${j.max}</div>
        </div>
    `).join('');

    // Noticias
    const newsGrid = document.getElementById('news-grid');
    newsGrid.innerHTML = news.map(n => `
        <div class="news-card">
            <div class="flex justify-between items-start mb-4">
                <span class="text-2xl">${n.i}</span>
                <span class="text-[10px] bg-slate-100 dark:bg-slate-800 p-1 rounded font-bold">${n.f}</span>
            </div>
            <h4 class="font-bold mb-2">${n.t}</h4>
            <p class="text-xs opacity-70">${n.d}</p>
        </div>
    `).join('');

    // Divisas
    const forexGrid = document.getElementById('forex-grid');
    forexGrid.innerHTML = forexData.map(f => `
        <div class="p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
            <p class="text-xs font-bold opacity-50">${f.n}</p>
            <h3 class="text-2xl font-black">${f.c}</h3>
            <span class="${f.v > 0 ? 'text-green-500' : 'text-red-500'} text-[10px] font-bold">
                ${f.v > 0 ? '▲' : '▼'} ${f.v}%
            </span>
        </div>
    `).join('');
}

window.onload = renderAll;