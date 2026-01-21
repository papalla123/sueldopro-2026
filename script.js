// script.js - Lógica Principal

// 1. NAVEGACIÓN
function nav(id) {
    // Quitar activo de todo
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    
    // Activar lo seleccionado
    document.getElementById('sec-' + id).classList.add('active');
    document.getElementById('m-' + id).classList.add('active');
}

// 2. RENDERIZADO DEL RADAR
function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid) return;
    
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(query.toLowerCase()));
    
    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-blue-600">${j.n}</h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-4 h-8 overflow-hidden">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800">
                <span class="font-black italic text-sm text-slate-700 dark:text-slate-200">S/ ${j.min.toLocaleString()} - ${j.max.toLocaleString()}</span>
                <a href="${j.l}" target="_blank" class="text-[10px] bg-slate-100 dark:bg-slate-800 p-2 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all">INFO →</a>
            </div>
        </div>
    `).join('');
}

// 3. CALCULADORA DE SUELDO NETO 2026
function calcularSueldoNeto() {
    const bruto = parseFloat(document.getElementById('bruto').value);
    const resDiv = document.getElementById('resultado-calculo');

    if (!bruto || bruto <= 0) {
        alert("Por favor, ingresa un monto válido.");
        return;
    }

    const UIT = 5500;
    const afp = bruto * 0.1184; // Estimado AFP 2026
    
    // Base imponible anual (14 sueldos - 7 UIT)
    const baseAnual = (bruto * 14) - (7 * UIT);
    let impuestoAnual = 0;

    if (baseAnual > 0) {
        // Tramo 1: Hasta 5 UIT (8%)
        if (baseAnual <= 5 * UIT) {
            impuestoAnual = baseAnual * 0.08;
        } else {
            impuestoAnual = (5 * UIT * 0.08) + (baseAnual - 5 * UIT) * 0.14;
        }
    }

    const neto = bruto - afp - (impuestoAnual / 12);

    resDiv.innerHTML = `
        <div class="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-500">
            <p class="text-blue-600 dark:text-blue-400 font-bold uppercase text-xs mb-1">Sueldo Neto Mensual Estimado</p>
            <h3 class="text-4xl font-black text-blue-700 dark:text-blue-300">S/ ${Math.round(neto).toLocaleString('es-PE')}</h3>
            <div class="mt-4 pt-4 border-t border-blue-200 dark:border-blue-800 text-[10px] opacity-70 text-slate-600 dark:text-slate-400">
                <p>AFP (11.84%): - S/ ${Math.round(afp).toLocaleString()}</p>
                <p>Impuesto 5ta: - S/ ${Math.round(impuestoAnual/12).toLocaleString()}</p>
            </div>
        </div>
    `;
}

// 4. INICIO AUTOMÁTICO
window.onload = () => {
    // Escuchar el buscador
    const searchInput = document.getElementById('job-search');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => renderJobs(e.target.value));
    }
    
    // Cargar trabajos iniciales
    renderJobs();
    console.log("SueldoPro 2026: Sistema Cargado");
};