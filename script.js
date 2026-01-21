// script.js - El motor de SueldoPro 2026

function nav(id) {
    document.querySelectorAll('.sec-content').forEach(s => s.classList.remove('active'));
    const target = document.getElementById('sec-' + id);
    if(target) target.classList.add('active');
    
    document.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('m-' + id);
    if(btn) btn.classList.add('active');
}

function setLang(lang) {
    if (typeof i18n === 'undefined') return;
    
    const elements = {
        'guide-neto-title': i18n[lang].g_neto_t,
        'guide-neto-text': i18n[lang].g_neto_txt
    };

    for (let id in elements) {
        const el = document.getElementById(id);
        if (el) el.innerText = elements[id];
    }
    renderJobs();
}

function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid || typeof jobs === 'undefined') return;
    
    const filtered = jobs.filter(j => j.n.toLowerCase().includes(query.toLowerCase()));
    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-brand-500">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t">
                <span class="font-black italic text-sm">S/ ${j.min} - ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[9px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold">INFO →</a>
            </div>
        </div>
    `).join('');
}

// ARRANQUE SEGURO
window.addEventListener('load', () => {
    setTimeout(() => { // Pequeño delay para asegurar que data.js se leyó
        if (typeof i18n !== 'undefined') {
            setLang('es');
        }
    }, 100);

    document.getElementById('job-search')?.addEventListener('input', (e) => renderJobs(e.target.value));
});