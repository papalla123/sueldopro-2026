// script.js - Lógica Maestra SueldoPro 2026

let forexChart;

// 1. LA FUNCIÓN QUE FALTABA (Traducción y arranque)
function setLang(lang) {
    // Traducir textos
    document.querySelectorAll('[data-t]').forEach(el => {
        const key = el.getAttribute('data-t');
        if (typeof i18n !== 'undefined' && i18n[lang][key]) {
            el.innerText = i18n[lang][key];
        }
    });

    // Cargar Guías
    const guides = ['neto'];
    guides.forEach(g => {
        const titleEl = document.getElementById(`guide-${g}-title`);
        const textEl = document.getElementById(`guide-${g}-text`);
        if (titleEl && typeof i18n !== 'undefined') titleEl.innerText = i18n[lang][`g_${g}_t`];
        if (textEl && typeof i18n !== 'undefined') textEl.innerText = i18n[lang][`g_${g}_txt`];
    });

    renderJobs();
}

// 2. RENDERIZAR OFICIOS
function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid || typeof jobs === 'undefined') return;
    
    const filtered = jobs.filter(j => 
        j.n.toLowerCase().includes(query.toLowerCase()) || 
        j.d.toLowerCase().includes(query.toLowerCase())
    );

    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg dark:text-white">${j.n}</h4>
            <p class="text-xs text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-brand-500 font-black">S/ ${j.min} - ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[10px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold">INFO</a>
            </div>
        </div>
    `).join('');
}

// 3. INICIALIZADOR
window.onload = () => {
    if (typeof i18n !== 'undefined') {
        setLang('es');
    }
    
    document.getElementById('job-search')?.addEventListener('input', (e) => {
        renderJobs(e.target.value);
    });
};