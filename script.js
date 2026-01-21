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
// 8. CALCULADORA DE SUELDO NETO
// ==========================================

const CONSTANTES_2026 = {
    UIT: 5500,
    AFP_PORCENTAJE: 0.1184, // 11.84%
    ONP_PORCENTAJE: 0.13,   // 13%
    TRAMOS_RENTA: [
        { hasta: 5, tasa: 0.08 },   // 8% hasta 5 UIT
        { hasta: 20, tasa: 0.14 },  // 14% de 5 a 20 UIT
        { hasta: 35, tasa: 0.17 },  // 17% de 20 a 35 UIT
        { hasta: 45, tasa: 0.20 },  // 20% de 35 a 45 UIT
        { hasta: Infinity, tasa: 0.30 } // 30% más de 45 UIT
    ]
};

function calcularSueldoNeto() {
    const brutoInput = document.getElementById('bruto');
    const bruto = parseFloat(brutoInput.value);

    // Validaciones
    if (!bruto || bruto <= 0) {
        mostrarError('⚠️ Ingresa un sueldo bruto válido');
        return;
    }

    // 1. Calcular AFP (o puedes dar opción ONP)
    const descuentoAFP = bruto * CONSTANTES_2026.AFP_PORCENTAJE;
    const baseImponible = bruto - descuentoAFP;

    // 2. Calcular Impuesto a la Renta (5ta Categoría)
    const sueldoAnual = bruto * 12;
    const uitAnual = sueldoAnual / CONSTANTES_2026.UIT;
    
    let impuestoAnual = 0;
    let uitAcumulada = 0;

    // Aplicar tramos progresivos
    for (let tramo of CONSTANTES_2026.TRAMOS_RENTA) {
        if (uitAnual > tramo.hasta) {
            const uitEnTramo = tramo.hasta - uitAcumulada;
            impuestoAnual += uitEnTramo * CONSTANTES_2026.UIT * tramo.tasa;
            uitAcumulada = tramo.hasta;
        } else {
            const uitEnTramo = uitAnual - uitAcumulada;
            if (uitEnTramo > 0) {
                impuestoAnual += uitEnTramo * CONSTANTES_2026.UIT * tramo.tasa;
            }
            break;
        }
    }

    const impuestoMensual = impuestoAnual / 12;
    
    // 3. Sueldo Neto Final
    const sueldoNeto = bruto - descuentoAFP - impuestoMensual;

    // 4. Renderizar resultado
    mostrarResultado({
        bruto,
        descuentoAFP,
        impuestoMensual,
        sueldoNeto,
        uitAnual
    });
}

function mostrarResultado(datos) {
    let resultadoDiv = document.getElementById('resultado-calculo');
    
    if (!resultadoDiv) {
        resultadoDiv = document.createElement('div');
        resultadoDiv.id = 'resultado-calculo';
        const botonCalcular = document.querySelector('button[onclick*="alert"]') || 
                              document.querySelector('#sec-neto button');
        if (botonCalcular && botonCalcular.parentNode) {
            botonCalcular.parentNode.insertBefore(resultadoDiv, botonCalcular.nextSibling);
        }
    }

    const porcentajeNeto = ((datos.sueldoNeto / datos.bruto) * 100).toFixed(1);
    const tramoIR = determinarTramoIR(datos.uitAnual);

    resultadoDiv.innerHTML = `
        <div class="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-3xl shadow-2xl border-2 border-blue-200 dark:border-blue-800 animate-slideUp">
            <!-- Header del Resultado -->
            <div class="text-center mb-6">
                <div class="inline-block bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-black mb-3 shadow-lg">
                    ✅ CÁLCULO COMPLETADO 2026
                </div>
                <h3 class="text-5xl font-black text-slate-800 dark:text-white mb-2">
                    S/ ${datos.sueldoNeto.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 font-bold">
                    Tu sueldo neto mensual • ${porcentajeNeto}% de tu bruto
                </p>
            </div>

            <!-- Breakdown de Descuentos -->
            <div class="space-y-4 mb-6">
                <!-- Sueldo Bruto -->
                <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-xl">
                            💰
                        </div>
                        <div>
                            <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">Sueldo Bruto</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">Base de cálculo</p>
                        </div>
                    </div>
                    <span class="font-black text-lg text-green-600 dark:text-green-400">
                        S/ ${datos.bruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <!-- AFP -->
                <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-xl">
                            🏦
                        </div>
                        <div>
                            <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">Descuento AFP</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">11.84% • Aporte previsional</p>
                        </div>
                    </div>
                    <span class="font-black text-lg text-orange-600 dark:text-orange-400">
                        - S/ ${datos.descuentoAFP.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <!-- Impuesto a la Renta -->
                <div class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-xl">
                            📊
                        </div>
                        <div>
                            <p class="font-bold text-slate-700 dark:text-slate-300 text-sm">Impuesto a la Renta</p>
                            <p class="text-xs text-slate-500 dark:text-slate-400">${tramoIR} • 5ta Categoría</p>
                        </div>
                    </div>
                    <span class="font-black text-lg text-red-600 dark:text-red-400">
                        - S/ ${datos.impuestoMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>

            <!-- Desglose Anual -->
            <div class="bg-blue-500/10 dark:bg-blue-500/20 p-5 rounded-2xl border-2 border-blue-300 dark:border-blue-700 mb-4">
                <div class="flex items-center justify-between mb-3">
                    <span class="text-sm font-bold text-blue-700 dark:text-blue-300">📅 Proyección Anual</span>
                    <span class="text-xs bg-blue-200 dark:bg-blue-800 px-3 py-1 rounded-full font-bold text-blue-800 dark:text-blue-200">
                        ${datos.uitAnual.toFixed(2)} UIT
                    </span>
                </div>
                <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="bg-white dark:bg-slate-800 p-3 rounded-xl">
                        <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Ingreso Anual</p>
                        <p class="font-black text-slate-800 dark:text-white">S/ ${(datos.bruto * 12).toLocaleString('es-PE')}</p>
                    </div>
                    <div class="bg-white dark:bg-slate-800 p-3 rounded-xl">
                        <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">Neto Anual</p>
                        <p class="font-black text-slate-800 dark:text-white">S/ ${(datos.sueldoNeto * 12).toLocaleString('es-PE')}</p>
                    </div>
                </div>
            </div>

            <!-- Footer con Info -->
            <div class="text-center pt-4 border-t border-blue-200 dark:border-blue-800">
                <p class="text-xs text-slate-600 dark:text-slate-400 italic">
                    ℹ️ Cálculo basado en UIT 2026: S/ ${CONSTANTES_2026.UIT.toLocaleString('es-PE')} | 
                    <button onclick="mostrarDetalleTramos()" class="underline hover:text-blue-500 transition-colors">
                        Ver tabla de tramos IR
                    </button>
                </p>
            </div>
        </div>
    `;

    // Animación de entrada
    requestAnimationFrame(() => {
        resultadoDiv.querySelector('.animate-slideUp').style.animation = 'slideUp 0.5s ease-out';
    });
}

function mostrarError(mensaje) {
    let resultadoDiv = document.getElementById('resultado-calculo');
    
    if (!resultadoDiv) {
        resultadoDiv = document.createElement('div');
        resultadoDiv.id = 'resultado-calculo';
        const botonCalcular = document.querySelector('button[onclick*="alert"]') || 
                              document.querySelector('#sec-neto button');
        if (botonCalcular && botonCalcular.parentNode) {
            botonCalcular.parentNode.insertBefore(resultadoDiv, botonCalcular.nextSibling);
        }
    }

    resultadoDiv.innerHTML = `
        <div class="mt-6 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-800 p-6 rounded-2xl text-center">
            <div class="text-4xl mb-2">⚠️</div>
            <p class="font-bold text-red-700 dark:text-red-300">${mensaje}</p>
        </div>
    `;
}

function determinarTramoIR(uitAnual) {
    if (uitAnual <= 5) return 'Tramo 1: 8%';
    if (uitAnual <= 20) return 'Tramo 2: 14%';
    if (uitAnual <= 35) return 'Tramo 3: 17%';
    if (uitAnual <= 45) return 'Tramo 4: 20%';
    return 'Tramo 5: 30%';
}

function mostrarDetalleTramos() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-blue-300 dark:border-blue-700" onclick="event.stopPropagation()">
            <h3 class="text-2xl font-black mb-6 text-center text-blue-600 dark:text-blue-400">
                📊 Tabla de Tramos - Impuesto a la Renta 2026
            </h3>
            <div class="space-y-3 mb-6">
                ${CONSTANTES_2026.TRAMOS_RENTA.map((tramo, i) => {
                    const desde = i === 0 ? 0 : CONSTANTES_2026.TRAMOS_RENTA[i-1].hasta;
                    const hasta = tramo.hasta === Infinity ? '∞' : tramo.hasta;
                    return `
                        <div class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                            <span class="font-bold text-slate-700 dark:text-slate-300">
                                Tramo ${i + 1}: ${desde} - ${hasta} UIT
                            </span>
                            <span class="text-2xl font-black text-blue-600 dark:text-blue-400">
                                ${(tramo.tasa * 100)}%
                            </span>
                        </div>
                    `;
                }).join('')}
            </div>
            <p class="text-xs text-center text-slate-600 dark:text-slate-400 italic mb-4">
                UIT 2026 = S/ ${CONSTANTES_2026.UIT.toLocaleString('es-PE')} • Los tramos se aplican de forma progresiva
            </p>
            <button onclick="this.closest('.fixed').remove()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all">
                CERRAR
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// ==========================================
// 9. UTILIDADES ADICIONALES
// ==========================================

// Detección de tema oscuro
function initThemeDetection() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    prefersDark.addEventListener('change', (e) => {
        document.documentElement.classList.toggle('dark', e.matches);
    });
}

initThemeDetection();

// Exponer función de cálculo globalmente
window.calcularSueldoNeto = calcularSueldoNeto;