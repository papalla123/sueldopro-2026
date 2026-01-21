// script.js - Lógica Maestra
let currentLang = 'es';

// 1. Función de Navegación (Para que los botones funcionen)
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    if(document.getElementById('m-' + id)) {
        document.getElementById('m-' + id).classList.add('active');
    }
}

// 2. Traductor y Carga de Datos
function setLang(lang) {
    currentLang = lang;
    // Traducir etiquetas data-t
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (i18n[lang][key]) el.innerText = i18n[lang][key];
    });

    // Cargar textos de las guías
    if(document.getElementById('guide-neto-title')) {
        document.getElementById('guide-neto-title').innerText = i18n[lang].g_neto_t;
        document.getElementById('guide-neto-text').innerText = i18n[lang].g_neto_txt;
    }

    renderJobs();
}

// 3. Renderizar los 1,000 Oficios
function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid) return;
    
    const filtered = jobs.filter(j => 
        j.n.toLowerCase().includes(query.toLowerCase())
    );

    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-dark-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-brand-500">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t">
                <span class="font-black">S/ ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[10px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold uppercase">Ver Vacante</a>
            </div>
        </div>
    `).join('');
}

// 4. ARRANQUE GLOBAL
window.onload = () => {
    setLang('es');
    document.getElementById('job-search')?.addEventListener('input', (e) => renderJobs(e.target.value));
};