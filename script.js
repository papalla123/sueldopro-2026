// script.js - Motor de SueldoPro 2026

// 1. NAVEGACIÓN
function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    document.getElementById('sec-' + id).classList.add('active');
    
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-' + id).classList.add('active');
}

// 2. TRADUCTOR Y CARGA
function setLang(lang) {
    // Cargar textos de las guías desde data.js
    const titleEl = document.getElementById('guide-neto-title');
    const textEl = document.getElementById('guide-neto-text');
    
    if (i18n && i18n[lang]) {
        if (titleEl) titleEl.innerText = i18n[lang].g_neto_t;
        if (textEl) textEl.innerText = i18n[lang].g_neto_txt;
    }
    renderJobs();
}

// 3. RENDERIZAR LOS 1,000 OFICIOS
function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid || typeof jobs === 'undefined') return;
    
    const filtered = jobs.filter(j => 
        j.n.toLowerCase().includes(query.toLowerCase())
    );

    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-dark-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-brand-500">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t">
                <span class="font-black italic">S/ ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold">INFO →</a>
            </div>
        </div>
    `).join('');
}

// 4. INICIO AUTOMÁTICO
window.onload = () => {
    setLang('es');
    document.getElementById('job-search')?.addEventListener('input', (e) => {
        renderJobs(e.target.value);
    });
};