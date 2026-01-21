// script.js - Lógica Global
let currentLang = 'es';

// Función para navegar entre secciones
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-' + id).classList.add('active');
}

// Función para cargar los datos y traducir
function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (i18n[lang][key]) el.innerText = i18n[lang][key];
    });

    // Cargar guías de texto desde data.js
    document.getElementById('guide-neto-title').innerText = i18n[lang].g_neto_t;
    document.getElementById('guide-neto-text').innerText = i18n[lang].g_neto_txt;

    renderJobs();
}

function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid) return;
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(query.toLowerCase()));
    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-brand-500">${j.n}</h4>
            <p class="text-xs text-slate-500 my-2">${j.d}</p>
            <div class="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span class="font-black">S/ ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[10px] font-black underline">INFO →</a>
            </div>
        </div>
    `).join('');
}

// Arrancar la página
window.onload = () => {
    setLang('es');
    document.getElementById('job-search').addEventListener('input', (e) => renderJobs(e.target.value));
};