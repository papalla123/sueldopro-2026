'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - CONTROLADOR PRINCIPAL
// Sistema Profesional de Gestión de Calculadoras
// =====================================================================

const APP_STATE = {
    currentCalculator: null,
    currentRegimen: 'general',
    currentResult: null
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando SueldoPro Ultra Profesional...');
    inicializarAplicacion();
});

function inicializarAplicacion() {
    renderizarSelectorRegimen();
    configurarEventListeners();
    mostrarCalculadoraPorDefecto();
    console.log('✅ Sistema Profesional Activo');
}

// ===== SELECTOR DE RÉGIMEN =====
function renderizarSelectorRegimen() {
    const selector = document.getElementById('regimen-selector');
    if (!selector) return;
    
    selector.innerHTML = `
        <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Régimen Laboral</label>
        <select id="regimen-select" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition">
            <option value="general">🏢 Régimen General</option>
            <option value="pequena">🏪 Pequeña Empresa (MYPE)</option>
            <option value="micro">🏠 Microempresa</option>
        </select>
    `;
    
    document.getElementById('regimen-select').addEventListener('change', (e) => {
        APP_STATE.currentRegimen = e.target.value;
        if (APP_STATE.currentCalculator) {
            mostrarCalculadora(APP_STATE.currentCalculator);
        }
    });
}

// ===== EVENT LISTENERS =====
function configurarEventListeners() {
    document.getElementById('btn-calc-neto').addEventListener('click', () => mostrarCalculadora('neto'));
    document.getElementById('btn-calc-horas').addEventListener('click', () => mostrarCalculadora('horas'));
    document.getElementById('btn-calc-cts').addEventListener('click', () => mostrarCalculadora('cts'));
    document.getElementById('btn-calc-gratif').addEventListener('click', () => mostrarCalculadora('gratif'));
    document.getElementById('btn-calc-liquidacion').addEventListener('click', () => mostrarCalculadora('liquidacion'));
    document.getElementById('btn-calc-costo').addEventListener('click', () => mostrarCalculadora('costo'));
}

function mostrarCalculadoraPorDefecto() {
    mostrarCalculadora('neto');
}

// ===== RENDERIZADO DE CALCULADORAS =====
function mostrarCalculadora(tipo) {
    APP_STATE.currentCalculator = tipo;
    
    document.querySelectorAll('[id^="btn-calc-"]').forEach(btn => {
        btn.classList.remove('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
        btn.classList.add('bg-slate-900', 'text-slate-400');
    });
    
    const btnActivo = document.getElementById(`btn-calc-${tipo}`);
    if (btnActivo) {
        btnActivo.classList.remove('bg-slate-900', 'text-slate-400');
        btnActivo.classList.add('active', 'bg-gradient-to-r', 'from-indigo-600', 'to-indigo-500', 'text-white');
    }
    
    const formularioContainer = document.getElementById('formulario-calculadora');
    const resultadoContainer = document.getElementById('resultado-calculadora');
    
    if (resultadoContainer) {
        resultadoContainer.classList.add('hidden');
    }
    
    switch(tipo) {
        case 'neto':
            renderizarCalculadoraNeto(formularioContainer);
            break;
        case 'horas':
            renderizarCalculadoraHoras(formularioContainer);
            break;
        case 'cts':
            renderizarCalculadoraCTS(formularioContainer);
            break;
        case 'gratif':
            renderizarCalculadoraGratificaciones(formularioContainer);
            break;
        case 'liquidacion':
            renderizarCalculadoraLiquidacion(formularioContainer);
            break;
        case 'costo':
            renderizarCalculadoraCosto(formularioContainer);
            break;
    }
}

// =====================================================================
// CALCULADORA 1: SALARIO NETO
// =====================================================================
function renderizarCalculadoraNeto(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">💵 Salario Neto</h2>
            <p class="text-slate-400">Cálculo preciso de sueldo líquido con proyección anual de Renta 5ta</p>
        </div>
        
        <form id="form-neto" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="neto-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="neto-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sistema de Pensiones</label>
                <select id="neto-sistema" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition">
                    <option value="afp">AFP</option>
                    <option value="onp">ONP (13%)</option>
                </select>
            </div>
            
            <div id="neto-afp-container">
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">AFP</label>
                <select id="neto-afp" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition">
                    <option value="integra">AFP Integra (Comisión 0.82%)</option>
                    <option value="prima">AFP Prima (Comisión 1.60%)</option>
                    <option value="profuturo">AFP Profuturo (Comisión 1.69%)</option>
                    <option value="habitat">AFP Habitat (Comisión 1.47%)</option>
                </select>
            </div>
            
            <div id="neto-comision-container">
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Comisión</label>
                <select id="neto-comision" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition">
                    <option value="flujo">Flujo (sobre sueldo)</option>
                    <option value="mixta">Mixta (sueldo + saldo acumulado)</option>
                </select>
            </div>
            
            <div id="neto-saldo-container" class="hidden">
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Saldo Acumulado AFP (S/)</label>
                <input type="number" id="neto-saldo" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="50000" min="0" step="0.01">
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR SALARIO NETO
            </button>
        </form>
    `;
    
    const sistemaSelect = document.getElementById('neto-sistema');
    const afpContainer = document.getElementById('neto-afp-container');
    const comisionContainer = document.getElementById('neto-comision-container');
    const comisionSelect = document.getElementById('neto-comision');
    const saldoContainer = document.getElementById('neto-saldo-container');
    
    sistemaSelect.addEventListener('change', () => {
        if (sistemaSelect.value === 'afp') {
            afpContainer.classList.remove('hidden');
            comisionContainer.classList.remove('hidden');
        } else {
            afpContainer.classList.add('hidden');
            comisionContainer.classList.add('hidden');
            saldoContainer.classList.add('hidden');
        }
    });
    
    comisionSelect.addEventListener('change', () => {
        if (comisionSelect.value === 'mixta') {
            saldoContainer.classList.remove('hidden');
        } else {
            saldoContainer.classList.add('hidden');
        }
    });
    
    document.getElementById('form-neto').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoNeto();
    });
}

function ejecutarCalculoNeto() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('neto-salario').value),
        tieneAsignacionFamiliar: document.getElementById('neto-af').checked,
        sistemaPension: document.getElementById('neto-sistema').value,
        afp: document.getElementById('neto-afp').value,
        tipoComision: document.getElementById('neto-comision').value,
        saldoAcumuladoAFP: parseFloat(document.getElementById('neto-saldo').value) || 0,
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularSalarioNeto(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoNeto(resultado);
}

function mostrarResultadoNeto(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    let detallesPensionHTML = '';
    if (resultado.detallesPension.aporteFondo !== undefined) {
        detallesPensionHTML = `
            <div class="space-y-2 text-sm">
                <div class="flex justify-between"><span class="text-slate-400">Aporte Fondo (10%)</span><span class="text-red-400">- S/ ${resultado.detallesPension.aporteFondo.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Seguro Invalidez (1.70%)</span><span class="text-red-400">- S/ ${resultado.detallesPension.seguroInvalidez.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Comisión</span><span class="text-red-400">- S/ ${resultado.detallesPension.comision.toFixed(2)}</span></div>
            </div>
        `;
    }
    
    let detallesRentaHTML = '';
    resultado.detallesTramos.forEach(tramo => {
        const tasaPorcentaje = (tramo.tasa * 100).toFixed(0);
        detallesRentaHTML += `
            <div class="flex justify-between text-sm">
                <span class="text-slate-400">Tramo ${tasaPorcentaje}%</span>
                <span class="text-slate-300">S/ ${tramo.impuesto.toFixed(2)}</span>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">SALARIO NETO MENSUAL</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.salarioNeto.toFixed(2)}</div>
            <div class="text-sm opacity-90">Después de descuentos AFP/ONP e impuestos</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">📊 Desglose Detallado</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">Sueldo Bruto</span><span class="text-white font-bold">S/ ${resultado.salarioBruto.toFixed(2)}</span></div>
                ${resultado.asignacionFamiliar > 0 ? `<div class="flex justify-between"><span class="text-slate-400">+ Asignación Familiar</span><span class="text-emerald-400 font-bold">S/ ${resultado.asignacionFamiliar.toFixed(2)}</span></div>` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between"><span class="text-slate-400">= Base Remunerativa</span><span class="text-white font-bold">S/ ${resultado.baseRemunerativa.toFixed(2)}</span></div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between font-bold"><span class="text-slate-400">- Descuento Pensión</span><span class="text-red-400">S/ ${resultado.descuentoPension.toFixed(2)}</span></div>
                ${detallesPensionHTML}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between font-bold"><span class="text-slate-400">- Impuesto Renta 5ta</span><span class="text-red-400">S/ ${resultado.impuestoMensual.toFixed(2)}</span></div>
                ${detallesRentaHTML}
                <div class="text-xs text-slate-500 mt-2">
                    Proyección anual: S/ ${resultado.ingresoAnualTotal.toFixed(2)}<br>
                    Base imponible: S/ ${resultado.baseImponibleAnual.toFixed(2)}<br>
                    Impuesto anual: S/ ${resultado.impuestoAnual.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// =====================================================================
// CALCULADORA 2: HORAS EXTRAS
// =====================================================================
function renderizarCalculadoraHoras(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">⏰ Horas Extras</h2>
            <p class="text-slate-400">Cálculo de sobretiempo con criterio contable (25% y 35% por separado)</p>
        </div>
        
        <form id="form-horas" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="horas-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="horas-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Horas al 25%</label>
                    <input type="number" id="horas-25" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="0" min="0" step="0.5" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Horas al 35%</label>
                    <input type="number" id="horas-35" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="0" min="0" step="0.5" required>
                </div>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="horas-nocturno" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Horario Nocturno (Recargo 35% sobre RMV)</span>
                </label>
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR HORAS EXTRAS
            </button>
        </form>
    `;
    
    document.getElementById('form-horas').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoHoras();
    });
}

function ejecutarCalculoHoras() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('horas-salario').value),
        tieneAsignacionFamiliar: document.getElementById('horas-af').checked,
        horas25: parseFloat(document.getElementById('horas-25').value),
        horas35: parseFloat(document.getElementById('horas-35').value),
        horarioNocturno: document.getElementById('horas-nocturno').checked,
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularHorasExtras(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoHoras(resultado);
}

function mostrarResultadoHoras(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">TOTAL HORAS EXTRAS</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.totalPago.toFixed(2)}</div>
            <div class="text-sm opacity-90">Pago adicional por sobretiempo</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">📊 Desglose Detallado</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">Base Remunerativa</span><span class="text-white font-bold">S/ ${resultado.baseRemunerativa.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Valor Hora Base</span><span class="text-white font-bold">S/ ${resultado.valorHoraBase.toFixed(2)}</span></div>
                ${resultado.aplicaRecargNocturno ? `<div class="flex justify-between"><span class="text-slate-400">Con Recargo Nocturno</span><span class="text-emerald-400 font-bold">S/ ${resultado.valorHoraBaseConNocturno.toFixed(2)}</span></div>` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="bg-blue-950/30 border border-blue-800/50 rounded-xl p-4">
                    <div class="font-bold text-blue-300 mb-2">Horas al 25%</div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Cantidad</span><span class="text-white">${resultado.horas25}h</span></div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Valor por hora</span><span class="text-white">S/ ${resultado.valorHora25.toFixed(2)}</span></div>
                    <div class="flex justify-between text-sm font-bold mt-2"><span class="text-blue-300">Subtotal 25%</span><span class="text-blue-400">S/ ${resultado.pagoHoras25.toFixed(2)}</span></div>
                </div>
                <div class="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4">
                    <div class="font-bold text-purple-300 mb-2">Horas al 35%</div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Cantidad</span><span class="text-white">${resultado.horas35}h</span></div>
                    <div class="flex justify-between text-sm"><span class="text-slate-400">Valor por hora</span><span class="text-white">S/ ${resultado.valorHora35.toFixed(2)}</span></div>
                    <div class="flex justify-between text-sm font-bold mt-2"><span class="text-purple-300">Subtotal 35%</span><span class="text-purple-400">S/ ${resultado.pagoHoras35.toFixed(2)}</span></div>
                </div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// =====================================================================
// CALCULADORA 3: CTS
// =====================================================================
function renderizarCalculadoraCTS(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">🏦 CTS</h2>
            <p class="text-slate-400">Compensación por Tiempo de Servicios (incluye 1/6 de gratificación)</p>
        </div>
        
        <form id="form-cts" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="cts-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="cts-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Meses trabajados</label>
                    <input type="number" id="cts-meses" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="6" min="0" max="6" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Días trabajados</label>
                    <input type="number" id="cts-dias" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="0" min="0" max="29" required>
                </div>
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR CTS
            </button>
        </form>
    `;
    
    document.getElementById('form-cts').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoCTS();
    });
}

function ejecutarCalculoCTS() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('cts-salario').value),
        tieneAsignacionFamiliar: document.getElementById('cts-af').checked,
        mesesTrabajados: parseInt(document.getElementById('cts-meses').value),
        diasTrabajados: parseInt(document.getElementById('cts-dias').value),
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularCTS(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoCTS(resultado);
}

function mostrarResultadoCTS(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    if (resultado.mensaje) {
        container.innerHTML = `
            <div class="bg-slate-850 rounded-2xl p-8 text-center border border-slate-800">
                <div class="text-4xl mb-4">⚠️</div>
                <div class="text-white font-bold">${resultado.mensaje}</div>
            </div>
        `;
        container.classList.remove('hidden');
        return;
    }
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">CTS SEMESTRAL</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.ctsSemestral.toFixed(2)}</div>
            <div class="text-sm opacity-90">Compensación por Tiempo de Servicios</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">📊 Composición de la Base</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">Sueldo Bruto</span><span class="text-white font-bold">S/ ${resultado.salarioBruto.toFixed(2)}</span></div>
                ${resultado.asignacionFamiliar > 0 ? `<div class="flex justify-between"><span class="text-slate-400">+ Asignación Familiar</span><span class="text-emerald-400 font-bold">S/ ${resultado.asignacionFamiliar.toFixed(2)}</span></div>` : ''}
                <div class="flex justify-between"><span class="text-slate-400">+ 1/6 Gratificación</span><span class="text-emerald-400 font-bold">S/ ${resultado.sextoGratificacion.toFixed(2)}</span></div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between"><span class="text-slate-400">= Remuneración Computable</span><span class="text-white font-bold">S/ ${resultado.remuneracionComputable.toFixed(2)}</span></div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between"><span class="text-slate-400">Tiempo trabajado</span><span class="text-white">${resultado.mesesTrabajados} meses, ${resultado.diasTrabajados} días</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Total días</span><span class="text-white">${resultado.totalDias} días</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Factor régimen</span><span class="text-white">${(resultado.factorRegimen * 100)}%</span></div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// =====================================================================
// CALCULADORA 4: GRATIFICACIONES
// =====================================================================
function renderizarCalculadoraGratificaciones(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">🎁 Gratificaciones</h2>
            <p class="text-slate-400">Gratificaciones Julio y Diciembre con Bonificación Extraordinaria 9%</p>
        </div>
        
        <form id="form-gratif" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="gratif-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="gratif-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="gratif-eps" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Tiene EPS Privada (Bonif. 6.75% en vez de 9%)</span>
                </label>
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR GRATIFICACIONES
            </button>
        </form>
    `;
    
    document.getElementById('form-gratif').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoGratificaciones();
    });
}

function ejecutarCalculoGratificaciones() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('gratif-salario').value),
        tieneAsignacionFamiliar: document.getElementById('gratif-af').checked,
        tieneEPS: document.getElementById('gratif-eps').checked,
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularGratificaciones(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoGratificaciones(resultado);
}

function mostrarResultadoGratificaciones(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    if (resultado.mensaje) {
        container.innerHTML = `
            <div class="bg-slate-850 rounded-2xl p-8 text-center border border-slate-800">
                <div class="text-4xl mb-4">⚠️</div>
                <div class="text-white font-bold">${resultado.mensaje}</div>
            </div>
        `;
        container.classList.remove('hidden');
        return;
    }
    
    const bonifPorcentaje = (resultado.tasaBonificacion * 100).toFixed(2);
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">GRATIFICACIONES ANUALES</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.gratificacionAnual.toFixed(2)}</div>
            <div class="text-sm opacity-90">Julio + Diciembre (incluye Bonif. Extraordinaria)</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">📊 Desglose por Gratificación</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">Base Remunerativa</span><span class="text-white font-bold">S/ ${resultado.baseRemunerativa.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Gratificación Base</span><span class="text-white font-bold">S/ ${resultado.gratificacionBase.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">+ Bonif. Extraordinaria (${bonifPorcentaje}%)</span><span class="text-emerald-400 font-bold">S/ ${resultado.bonificacionExtraordinaria.toFixed(2)}</span></div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between"><span class="text-slate-400">= Total por Gratificación</span><span class="text-white font-bold text-lg">S/ ${resultado.totalPorGratificacion.toFixed(2)}</span></div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="text-xs text-slate-500">
                    Julio: S/ ${resultado.totalPorGratificacion.toFixed(2)}<br>
                    Diciembre: S/ ${resultado.totalPorGratificacion.toFixed(2)}<br>
                    Total año: S/ ${resultado.gratificacionAnual.toFixed(2)}
                </div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// =====================================================================
// CALCULADORA 5: LIQUIDACIÓN
// =====================================================================
function renderizarCalculadoraLiquidacion(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">📋 Liquidación de Beneficios</h2>
            <p class="text-slate-400">Cálculo completo de beneficios sociales por cese laboral</p>
        </div>
        
        <form id="form-liquidacion" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="liq-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="liq-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Fecha de Inicio</label>
                    <input type="date" id="liq-inicio" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" required>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Fecha de Cese</label>
                    <input type="date" id="liq-cese" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" required>
                </div>
            </div>
            
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Meses para Gratificación Pendiente (0-6)</label>
                <input type="number" id="liq-gratif-meses" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="3" min="0" max="6" required>
            </div>
            
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Días de Vacaciones No Gozadas</label>
                <input type="number" id="liq-vac-dias" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="10" min="0" max="30" required>
            </div>
            
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Tipo de Salida</label>
                <select id="liq-tipo" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition">
                    <option value="renuncia">Renuncia Voluntaria</option>
                    <option value="despido">Despido (con indemnización)</option>
                </select>
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR LIQUIDACIÓN
            </button>
        </form>
    `;
    
    document.getElementById('form-liquidacion').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoLiquidacion();
    });
}

function ejecutarCalculoLiquidacion() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('liq-salario').value),
        tieneAsignacionFamiliar: document.getElementById('liq-af').checked,
        fechaInicio: document.getElementById('liq-inicio').value,
        fechaCese: document.getElementById('liq-cese').value,
        gratificacionPendiente: parseInt(document.getElementById('liq-gratif-meses').value),
        vacacionesNoGozadas: parseInt(document.getElementById('liq-vac-dias').value),
        tipoSalida: document.getElementById('liq-tipo').value,
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularLiquidacion(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoLiquidacion(resultado);
}

function mostrarResultadoLiquidacion(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-orange-600 to-orange-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">LIQUIDACIÓN TOTAL</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.totalLiquidacion.toFixed(2)}</div>
            <div class="text-sm opacity-90">Beneficios sociales por cese laboral</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">⏱️ Tiempo Trabajado</h4>
            <div class="space-y-2">
                <div class="flex justify-between"><span class="text-slate-400">Años</span><span class="text-white font-bold">${resultado.tiempoTrabajado.anios}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Meses</span><span class="text-white font-bold">${resultado.tiempoTrabajado.meses}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Días</span><span class="text-white font-bold">${resultado.tiempoTrabajado.dias}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Total días</span><span class="text-white">${resultado.tiempoTrabajado.totalDias}</span></div>
            </div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">📊 Desglose de Beneficios</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">CTS Pendiente</span><span class="text-white font-bold">S/ ${resultado.ctsPendiente.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Gratificación Trunca</span><span class="text-white font-bold">S/ ${resultado.gratificacionTrunca.toFixed(2)}</span></div>
                <div class="flex justify-between"><span class="text-slate-400">Vacaciones Truncas (${resultado.diasVacaciones} días)</span><span class="text-white font-bold">S/ ${resultado.vacacionesTruncas.toFixed(2)}</span></div>
                ${resultado.indemnizacion > 0 ? `<div class="flex justify-between"><span class="text-slate-400">Indemnización por Despido</span><span class="text-orange-400 font-bold">S/ ${resultado.indemnizacion.toFixed(2)}</span></div>` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between text-lg"><span class="text-slate-400 font-bold">TOTAL A PAGAR</span><span class="text-white font-black">S/ ${resultado.totalLiquidacion.toFixed(2)}</span></div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

// =====================================================================
// CALCULADORA 6: COSTO EMPLEADOR
// =====================================================================
function renderizarCalculadoraCosto(container) {
    container.innerHTML = `
        <div class="mb-6">
            <h2 class="text-3xl font-black text-white mb-2">🏢 Costo Total Empleador</h2>
            <p class="text-slate-400">Costo mensual completo para la empresa (sueldo + cargas + provisiones)</p>
        </div>
        
        <form id="form-costo" class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-400 uppercase mb-2">Sueldo Bruto Mensual (S/)</label>
                <input type="number" id="costo-salario" class="w-full p-3 bg-slate-900 border-2 border-slate-700 rounded-xl text-white font-bold focus:border-indigo-500 transition" placeholder="5000" min="1075" step="0.01" required>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="costo-af" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Asignación Familiar (+ S/ 107.50)</span>
                </label>
            </div>
            
            <div>
                <label class="flex items-center gap-3 p-4 bg-slate-900 border-2 border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition">
                    <input type="checkbox" id="costo-senati" class="w-5 h-5 rounded border-slate-600">
                    <span class="text-white font-bold">Aplica SENATI (+ 0.75%)</span>
                </label>
            </div>
            
            <button type="submit" class="w-full p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-black text-lg rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition shadow-lg">
                ✨ CALCULAR COSTO EMPLEADOR
            </button>
        </form>
    `;
    
    document.getElementById('form-costo').addEventListener('submit', (e) => {
        e.preventDefault();
        ejecutarCalculoCosto();
    });
}

function ejecutarCalculoCosto() {
    const params = {
        salarioBruto: parseFloat(document.getElementById('costo-salario').value),
        tieneAsignacionFamiliar: document.getElementById('costo-af').checked,
        aplicaSENATI: document.getElementById('costo-senati').checked,
        regimen: APP_STATE.currentRegimen
    };
    
    const resultado = calcularCostoEmpleador(params);
    APP_STATE.currentResult = resultado;
    mostrarResultadoCosto(resultado);
}

function mostrarResultadoCosto(resultado) {
    const container = document.getElementById('resultado-calculadora');
    
    container.innerHTML = `
        <div class="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-white mb-6">
            <div class="text-xs font-black opacity-75 mb-2">COSTO MENSUAL TOTAL</div>
            <div class="text-6xl font-black mb-2">S/ ${resultado.costoTotalMensual.toFixed(2)}</div>
            <div class="text-sm opacity-90">Inversión total de la empresa por empleado</div>
        </div>
        
        <div class="bg-slate-850 rounded-2xl p-6 mb-6 border border-slate-800">
            <h4 class="font-bold text-white mb-4">💰 Composición del Costo</h4>
            <div class="space-y-3">
                <div class="flex justify-between"><span class="text-slate-400">Sueldo Bruto</span><span class="text-white font-bold">S/ ${resultado.salarioBruto.toFixed(2)}</span></div>
                ${resultado.asignacionFamiliar > 0 ? `<div class="flex justify-between"><span class="text-slate-400">+ Asignación Familiar</span><span class="text-emerald-400 font-bold">S/ ${resultado.asignacionFamiliar.toFixed(2)}</span></div>` : ''}
                <div class="border-t border-slate-700 my-2"></div>
                <div class="bg-orange-950/30 border border-orange-800/50 rounded-xl p-4">
                    <div class="font-bold text-orange-300 mb-2">Cargas Sociales Directas</div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-slate-400">ESSALUD (9%)</span><span class="text-white">S/ ${resultado.essalud.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Vida Ley (0.53%)</span><span class="text-white">S/ ${resultado.vidaLey.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">SCTR (1.24%)</span><span class="text-white">S/ ${resultado.sctr.toFixed(2)}</span></div>
                        ${resultado.senati > 0 ? `<div class="flex justify-between"><span class="text-slate-400">SENATI (0.75%)</span><span class="text-white">S/ ${resultado.senati.toFixed(2)}</span></div>` : ''}
                        <div class="flex justify-between font-bold"><span class="text-orange-300">Subtotal Cargas</span><span class="text-orange-400">S/ ${resultado.totalCargasSociales.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="bg-purple-950/30 border border-purple-800/50 rounded-xl p-4">
                    <div class="font-bold text-purple-300 mb-2">Provisiones Mensuales</div>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between"><span class="text-slate-400">Gratificaciones</span><span class="text-white">S/ ${resultado.provisionGratificaciones.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">CTS</span><span class="text-white">S/ ${resultado.provisionCTS.toFixed(2)}</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Vacaciones</span><span class="text-white">S/ ${resultado.provisionVacaciones.toFixed(2)}</span></div>
                        <div class="flex justify-between font-bold"><span class="text-purple-300">Subtotal Provisiones</span><span class="text-purple-400">S/ ${resultado.totalProvisiones.toFixed(2)}</span></div>
                    </div>
                </div>
                <div class="border-t border-slate-700 my-2"></div>
                <div class="flex justify-between text-lg"><span class="text-slate-400">Carga Adicional</span><span class="text-red-400 font-bold">${resultado.porcentajeCarga.toFixed(2)}%</span></div>
            </div>
        </div>
    `;
    
    container.classList.remove('hidden');
}

console.log('✅ SCRIPT.JS PROFESIONAL CARGADO - Gestión Robusta del DOM Activa');
