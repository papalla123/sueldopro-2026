// script.js - Lógica Maestra SueldoPro 2026

let forexChart;

// 1. RENDERIZAR OFICIOS CON BUSCADOR
function renderJobs(query = "") {
    const grid = document.getElementById('job-grid');
    if (!grid) return;
    
    const filtered = jobs.filter(j => 
        j.n.toLowerCase().includes(query.toLowerCase()) || 
        j.d.toLowerCase().includes(query.toLowerCase())
    );

    grid.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg dark:text-white">${j.n}</h4>
            <p class="text-xs text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center">
                <span class="text-brand-500 font-black">S/ ${j.min} - ${j.max}</span>
                <a href="${j.l}" target="_blank" class="text-[10px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold">VER VACANTES</a>
            </div>
        </div>
    `).join('');
}

// 2. SISTEMA DE GRÁFICAS DE DIVISAS
function initForexChart() {
    const ctx = document.getElementById('forexChart')?.getContext('2d');
    if (!ctx) return;

    forexChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['09:00', '11:00', '13:00', '15:00', '17:00', '19:00'],
            datasets: [{
                label: 'Variación de Divisa',
                data: [3.74, 3.76, 3.75, 3.78, 3.75, 3.77],
                borderColor: '#0066ff',
                backgroundColor: 'rgba(0, 102, 255, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// 3. INICIALIZADOR GLOBAL
window.onload = () => {
    setLang('es'); // Función de traducción que ya tienes
    renderJobs();
    initForexChart();
    
    // Escuchar buscador
    document.getElementById('job-search')?.addEventListener('input', (e) => {
        renderJobs(e.target.value);
    });
};