// script.js - Motor SueldoPro 2026 (Refactorizado)

// ==========================================
// 1. SISTEMA DE INICIALIZACIÓN BASADO EN PROMESAS
// ==========================================

class AppInitializer {
    constructor() {
        this.dataReady = false;
        this.domReady = false;
        this.resolvers = {
            data: null,
            dom: null
        };

        this.dataPromise = new Promise(resolve => {
            this.resolvers.data = resolve;
        });

        this.domPromise = new Promise(resolve => {
            this.resolvers.dom = resolve;
        });

        this.readyPromise = Promise.all([this.dataPromise, this.domPromise]);
    }

    markDataReady() {
        if (!this.dataReady) {
            this.dataReady = true;
            this.resolvers.data();
        }
    }

    markDomReady() {
        if (!this.domReady) {
            this.domReady = true;
            this.resolvers.dom();
        }
    }

    async waitForReady() {
        return this.readyPromise;
    }
}

const appInit = new AppInitializer();

// ==========================================
// 2. VERIFICACIÓN DE DEPENDENCIAS
// ==========================================

function checkDataAvailability() {
    const checks = {
        i18n: typeof i18n !== 'undefined',
        jobs: typeof jobs !== 'undefined',
        news: typeof news !== 'undefined'
    };

    const allReady = Object.values(checks).every(v => v);
    
    if (allReady) {
        appInit.markDataReady();
    }

    return checks;
}

// Polling inteligente con backoff exponencial
let pollAttempts = 0;
const maxAttempts = 20;

function pollForData() {
    const checks = checkDataAvailability();
    
    if (checks.i18n && checks.jobs) {
        return;
    }

    if (pollAttempts < maxAttempts) {
        const delay = Math.min(50 * Math.pow(1.5, pollAttempts), 1000);
        pollAttempts++;
        setTimeout(pollForData, delay);
    } else {
        console.error('❌ SueldoPro: Timeout esperando data.js');
    }
}

// ==========================================
// 3. NAVEGACIÓN OPTIMIZADA
// ==========================================

function nav(id) {
    requestAnimationFrame(() => {
        const sections = document.querySelectorAll('.sec-content');
        const buttons = document.querySelectorAll('.sidebar-btn');
        
        sections.forEach(s => s.classList.remove('active'));
        buttons.forEach(b => b.classList.remove('active'));
        
        const target = document.getElementById('sec-' + id);
        const btn = document.getElementById('m-' + id);
        
        if (target) target.classList.add('active');
        if (btn) btn.classList.add('active');
    });
}

// ==========================================
// 4. INTERNACIONALIZACIÓN MEJORADA
// ==========================================

async function setLang(lang) {
    await appInit.waitForReady();
    
    if (typeof i18n === 'undefined' || !i18n[lang]) {
        console.warn(`⚠️ Idioma ${lang} no disponible`);
        return;
    }

    const elements = {
        'guide-neto-title': i18n[lang].g_neto_t,
        'guide-neto-text': i18n[lang].g_neto_txt
    };

    requestAnimationFrame(() => {
        for (let id in elements) {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        }
    });

    renderJobs();
}

// ==========================================
// 5. RENDERIZADO DE TRABAJOS OPTIMIZADO
// ==========================================

let jobsCache = null;
let lastQuery = '';

async function renderJobs(query = "") {
    await appInit.waitForReady();
    
    const grid = document.getElementById('job-grid');
    if (!grid || typeof jobs === 'undefined') {
        console.warn('⚠️ Grid o jobs no disponibles');
        return;
    }

    // Evitar re-renderizados innecesarios
    if (query === lastQuery && jobsCache) {
        return;
    }
    lastQuery = query;

    const normalizedQuery = query.toLowerCase().trim();
    
    // Filtrado optimizado con early return
    const filtered = normalizedQuery 
        ? jobs.filter(j => j.n.toLowerCase().includes(normalizedQuery))
        : jobs;

    // Construcción del HTML con fragment para mejor performance
    const fragment = document.createDocumentFragment();
    const tempDiv = document.createElement('div');
    
    tempDiv.innerHTML = filtered.map(j => `
        <div class="job-card p-6 rounded-3xl bg-white dark:bg-dark-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-xl">
            <div class="text-4xl mb-2">${j.i}</div>
            <h4 class="font-bold text-lg text-brand-500">${j.n}</h4>
            <p class="text-[10px] text-slate-500 mb-4">${j.d}</p>
            <div class="flex justify-between items-center pt-4 border-t">
                <span class="font-black italic text-sm">S/ ${j.min.toLocaleString('es-PE')} - ${j.max.toLocaleString('es-PE')}</span>
                <a href="${j.l}" target="_blank" rel="noopener noreferrer" class="text-[9px] bg-slate-100 dark:bg-dark-800 p-2 rounded-lg font-bold hover:bg-brand-500 hover:text-white transition-all">INFO →</a>
            </div>
        </div>
    `).join('');

    // Batch DOM update
    requestAnimationFrame(() => {
        grid.innerHTML = '';
        grid.appendChild(tempDiv);
        jobsCache = filtered;
    });
}

// Debounce para búsqueda instantánea sin lag
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedRenderJobs = debounce(renderJobs, 150);

// ==========================================
// 6. INICIALIZACIÓN PRINCIPAL
// ==========================================

async function initializeApp() {
    try {
        await appInit.waitForReady();
        
        // Configurar idioma por defecto
        await setLang('es');
        
        // Configurar búsqueda con debounce
        const searchInput = document.getElementById('job-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                debouncedRenderJobs(e.target.value);
            });
        }

        console.log('✅ SueldoPro 2026 inicializado correctamente');
    } catch (error) {
        console.error('❌ Error en inicialización:', error);
    }
}

// ==========================================
// 7. EVENT LISTENERS GLOBALES
// ==========================================

// Detectar cuando data.js se carga
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        appInit.markDomReady();
    });
} else {
    appInit.markDomReady();
}

// Iniciar polling inmediatamente
pollForData();

// Iniciar app cuando todo esté listo
window.addEventListener('load', initializeApp);

// Exponer funciones globales necesarias
window.nav = nav;
window.setLang = setLang;

// Hook para que data.js notifique cuando esté listo
window.notifyDataReady = () => {
    appInit.markDataReady();
};

// ==========================================
// 8. UTILIDADES ADICIONALES
// ==========================================

// Detección de tema oscuro
function initThemeDetection() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
    });
}

initThemeDetection();