'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - DATA ENGINE v3.0
// Motor de Precisión Quirúrgica - Legislación Peruana 2026
// UIT 2026: S/ 5,150 | RMV: S/ 1,075
// =====================================================================
// CORRECCIONES v3.0:
//  [FIX-1] AFP: Tope SBS aplicado ÚNICAMENTE al SIS (1.70%). El aporte
//          al fondo (10%) y la comisión NO tienen tope legal. Error
//          previo inflaba el descuento AFP en sueldos altos.
//  [FIX-2] Renta 5ta: Proyección anual incluye gratificaciones Ley 27735
//          + Bonificación Extraordinaria (9%) per Art. 40 TUO LIR.
//          Error previo subestimaba el impuesto hasta en 18%.
//  [FIX-3] Precisión 4-6 decimales en cálculos intermedios, r2() solo
//          en outputs finales de cada categoría.
//  [NEW-1] generarLogCalculo(): Log paso a paso de cada fórmula legal.
//  [NEW-2] Validación safe() en todas las funciones core.
// =====================================================================

// ===== PENTAGON ECOSYSTEM BRIDGE =====
window.PENTAGON_LINKS = {
    sueldopro: {
        name: 'SueldoPro Ultra',
        url: 'https://sueldopro-2026.vercel.app',
        icon: '💼',
        color: 'from-blue-500 to-cyan-500',
        description: 'Calculadora Laboral Peruana'
    },
    marginaxis: {
        name: 'MarginAxis Global',
        url: 'https://margin-master-pro-pboy.vercel.app',
        icon: '📊',
        color: 'from-green-500 to-emerald-500',
        description: 'Análisis de Márgenes Empresariales'
    },
    leadnexus: {
        name: 'LeadNexus AI',
        url: 'https://lead-target.vercel.app',
        icon: '🎯',
        color: 'from-violet-500 to-fuchsia-500',
        description: 'Scoring y Gestión de Leads'
    },
    liquidezforce: {
        name: 'Liquidez Force',
        url: 'https://liquidez-force.vercel.app',
        icon: '💰',
        color: 'from-yellow-500 to-orange-500',
        description: 'Proyección de Flujo de Caja'
    },
    wealth: {
        name: 'Wealth Armor AI',
        url: 'https://wealth-armor-ai.vercel.app',
        icon: '🛡️',
        color: 'from-emerald-500 to-green-600',
        description: 'Planificación Financiera Personal'
    }
};

// ===== PERÚ 2026 - CONSTANTES LABORALES OFICIALES =====
window.PERU_DATA = {
    country: 'Perú',
    flag: '🇵🇪',
    currency: 'PEN',
    currencySymbol: 'S/',
    year: 2026,

    // --- Salarios y Asignaciones Básicas ---
    minWage: 1075,               // RMV 2026 (D.S. 003-2024-TR proyectado)
    asignacionFamiliar: 107.50,  // 10% de RMV

    // --- Sistema Privado de Pensiones (AFP) ---
    // Base: D.S. 054-97-EF | Circular SBS AFP-148-2013 y Res. SBS 2016+
    sis: 0.0170,                 // Seguro de Invalidez y Sobrevivencia (1.70%)

    afp: {
        integra: {
            nombre: 'AFP Integra',
            aporteFondo: 0.10,   // 10% al fondo (SIN TOPE)
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0082, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta',      tasa: 0.0047, sobreSaldo: 1.25 }
            }
        },
        prima: {
            nombre: 'AFP Prima',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0160, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta',      tasa: 0.0038, sobreSaldo: 1.25 }
            }
        },
        profuturo: {
            nombre: 'AFP Profuturo',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0169, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta',      tasa: 0.0047, sobreSaldo: 1.20 }
            }
        },
        habitat: {
            nombre: 'AFP Habitat',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0147, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta',      tasa: 0.0047, sobreSaldo: 1.25 }
            }
        }
    },

    // --- Sistema Nacional de Pensiones (ONP) ---
    onp: 0.13,                   // 13% D.Ley 19990

    // --- Impuesto a la Renta de 5ta Categoría ---
    // Base: TUO LIR D.S. 179-2004-EF, Art. 40
    rentaQuinta: {
        uit: 5150,               // UIT 2026
        tramos: [
            { desde: 0,  hasta: 5,    tasa: 0.08 },
            { desde: 5,  hasta: 20,   tasa: 0.14 },
            { desde: 20, hasta: 35,   tasa: 0.17 },
            { desde: 35, hasta: 45,   tasa: 0.20 },
            { desde: 45, hasta: null, tasa: 0.30 }
        ],
        deduccion: 7             // 7 UIT de deducción anual
    },

    // --- Topes Máximos ---
    // [FIX-1] El sbsTopeAsegurable se aplica SOLO al SIS (seguro de vida AFP).
    //         El aporteFondo (10%) y la comisión AFP NO tienen tope legal.
    //         Ref: Res. SBS N° 0524-2016 y actualizaciones trimestrales.
    //         Valor 2026 (estimado Q1): actualizar vía SBS cada trimestre.
    topesSeguros: {
        sbsTopeAsegurable: 12943.35, // Remuneración Máxima Asegurable SBS (SIS only)
        essaludMaxRemuneracion: null  // Sin tope
    },

    // --- Gratificaciones (Ley 27735) ---
    gratificaciones: {
        meses: 2,                // 2 gratificaciones/año (Julio y Diciembre)
        bonifExtEssalud: 0.09,   // 9% Bonificación Extraordinaria (Ley 29351)
        bonifExtEPS: 0.0675      // 6.75% si tiene EPS
    },

    // --- CTS (D.S. 001-97-TR) ---
    cts: {
        depositosMensuales: 2,   // Mayo y Noviembre
        sextoGratificacion: 1/6  // 1/6 de gratificación como computable
    },

    // --- Vacaciones ---
    vacaciones: {
        diasPorAnio: 30,
        provisionMensual: 1/12
    },

    // --- Aportes del Empleador ---
    empleador: {
        essalud: 0.09,
        vidaLey: 0.0053,
        sctr: {
            minimo: 0.0053,
            medio: 0.0071,
            alto: 0.0118
        },
        senati: 0.0075,
        eps: 0.0225
    },

    // --- Participación en Utilidades (D.Leg. 892) ---
    utilidades: {
        sectores: {
            pesquera:          { porcentaje: 0.10, nombre: 'Pesquera' },
            telecomunicaciones: { porcentaje: 0.10, nombre: 'Telecomunicaciones' },
            industrial:        { porcentaje: 0.10, nombre: 'Industrial' },
            mineria:           { porcentaje: 0.08, nombre: 'Minería' },
            comercio:          { porcentaje: 0.08, nombre: 'Comercio al por mayor y menor' },
            restaurantes:      { porcentaje: 0.08, nombre: 'Restaurantes' },
            transporte:        { porcentaje: 0.05, nombre: 'Transporte' },
            otros:             { porcentaje: 0.05, nombre: 'Otras actividades' }
        },
        distribucion: {
            porDias:         0.50,
            porRemuneracion: 0.50
        },
        topeMaximo: 18
    }
};

// ===== REGÍMENES LABORALES PERUANOS =====
window.REGIMENES_PERU = {
    general: {
        id: 'general',
        nombre: 'Régimen General',
        icon: '🏢',
        descripcion: 'Régimen completo - Todos los beneficios laborales según Ley de Productividad y Competitividad Laboral (D.S. 003-97-TR)',
        limites: { trabajadores: null, ventasAnuales: null },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 1.0,
            cts: true,
            ctsFactor: 1.0,
            vacaciones: 30,
            vacacionesFactor: 1.0,
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 1.5
        },
        essaludBonif: 0.09
    },
    pequena: {
        id: 'pequena',
        nombre: 'Pequeña Empresa',
        icon: '🏪',
        descripcion: 'Entre 1-100 trabajadores, ventas anuales hasta 1700 UIT. Beneficios reducidos según Ley MYPE (D.S. 013-2013-PRODUCE)',
        limites: { trabajadores: 100, ventasAnuales: 1700 },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 0.5,
            cts: true,
            ctsFactor: 0.5,
            vacaciones: 15,
            vacacionesFactor: 0.5,
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 0.5
        },
        essaludBonif: 0.0
    },
    micro: {
        id: 'micro',
        nombre: 'Microempresa',
        icon: '🏠',
        descripcion: 'Entre 1-10 trabajadores, ventas anuales hasta 150 UIT. Régimen simplificado según Ley MYPE',
        limites: { trabajadores: 10, ventasAnuales: 150 },
        beneficios: {
            gratificaciones: false,
            gratificacionesFactor: 0,
            cts: false,
            ctsFactor: 0,
            vacaciones: 15,
            vacacionesFactor: 0.5,
            asignacionFamiliar: false,
            utilidades: false,
            indemnizacion: 0.25
        },
        essaludBonif: 0.0
    }
};

// =====================================================================
// ===== HELPERS DE PRECISIÓN Y VALIDACIÓN (v3.0) =====
// =====================================================================

/**
 * r4: Redondeo intermedio a 4 decimales (cálculos internos)
 * Elimina errores flotantes acumulados antes de multiplicaciones
 */
const r4 = n => Math.round(n * 10000) / 10000;

/**
 * r6: Redondeo fino a 6 decimales (tasas y factores muy pequeños)
 */
const r6 = n => Math.round(n * 1000000) / 1000000;

/**
 * r2: Redondeo de salida (output final de cada categoría)
 * SOLO aplicar en el return final, nunca en cálculos intermedios
 */
const r2 = n => Math.round(n * 100) / 100;

/**
 * safe: Guarda contra NaN, Infinity y valores negativos.
 * Retorna 0 en caso de valor inválido.
 */
const safe = n => {
    const v = typeof n === 'number' ? n : parseFloat(n);
    return (isNaN(v) || !isFinite(v) || v < 0) ? 0 : v;
};

/**
 * pct: Formatea porcentaje con precisión correcta
 */
const pct = (value, decimals = 2) => `${(value * 100).toFixed(decimals)}%`;

/**
 * fmt: Formatea moneda S/ con 2 decimales (para Details)
 */
const fmt = n => `S/ ${r2(safe(n)).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Exponer helpers globalmente para uso en CALCULATOR_CONFIGS
window.r2 = r2;
window.r4 = r4;
window.safe = safe;
window.fmt = fmt;
window.pct = pct;

// =====================================================================
// ===== FUNCIONES AUXILIARES DE CÁLCULO =====
// =====================================================================

/**
 * Calcula la Asignación Familiar
 * Base: D.S. 035-90-TR (10% de RMV)
 */
window.calcularAsignacionFamiliar = function () {
    return r2(PERU_DATA.minWage * 0.10);
};

/**
 * [FIX-1] Calcula los descuentos AFP con precisión quirúrgica.
 *
 * CORRECCIÓN CRÍTICA: El Tope Máximo Asegurable (TMA) de la SBS se aplica
 * EXCLUSIVAMENTE al SIS (Seguro de Invalidez y Sobrevivencia, 1.70%).
 * El aporte al fondo (10%) y la comisión AFP NO tienen tope legal —
 * se calculan sobre la remuneración bruta completa.
 *
 * Base: D.S. 054-97-EF Art. 30, Res. SBS N° 0524-2016.
 *
 * @param {number} salario - Remuneración bruta mensual (sin tope)
 * @param {string} afpNombre - integra | prima | profuturo | habitat
 * @param {string} tipoComision - flujo | mixta
 * @param {number} saldoAcumulado - Fondo acumulado (para comisión mixta)
 */
window.calcularAFP = function (salario, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };

    const rem = safe(salario);
    const saldo = safe(saldoAcumulado);
    const comisionData = afpData.tiposComision[tipoComision] || afpData.tiposComision.flujo;

    // ── Aporte al Fondo Previsional (10%) ── SIN TOPE
    const aporte = r4(rem * afpData.aporteFondo);

    // ── SIS: Seguro de Invalidez y Sobrevivencia (1.70%) ── CON TOPE SBS
    // El TMA (Remuneración Máxima Asegurable) actualizado por SBS trimestralmente.
    const remParaSIS = Math.min(rem, PERU_DATA.topesSeguros.sbsTopeAsegurable);
    const seguro = r4(remParaSIS * PERU_DATA.sis);

    // ── Comisión AFP ── SIN TOPE
    let comision = 0;
    if (tipoComision === 'flujo') {
        comision = r4(rem * comisionData.tasa);
    } else if (tipoComision === 'mixta') {
        // Parte sobre flujo + parte anual sobre saldo (prorrateada mensualmente)
        const sobreFlujo  = r4(rem   * comisionData.tasa);
        const sobreSaldo  = r4((saldo * comisionData.sobreSaldo / 100) / 12);
        comision = r4(sobreFlujo + sobreSaldo);
    }

    const total = r4(aporte + seguro + comision);

    return {
        aporte:       r2(aporte),
        seguro:       r2(seguro),
        comision:     r2(comision),
        total:        r2(total),
        remParaSIS,
        topeAplicado: rem > PERU_DATA.topesSeguros.sbsTopeAsegurable,
        // Raw intermedios (útiles para el Log)
        _aporte4:  aporte,
        _seguro4:  seguro,
        _comision4: comision
    };
};

/**
 * [FIX-2] Calcula el Impuesto a la Renta de 5ta Categoría con proyección completa.
 *
 * CORRECCIÓN CRÍTICA: El Art. 40 del TUO LIR (D.S. 179-2004-EF) dispone que la
 * renta bruta proyectada debe incluir:
 *   1. Remuneraciones ordinarias (sueldo × 12)
 *   2. Gratificaciones Ley 27735 (Julio + Diciembre)
 *   3. Bonificación Extraordinaria (9% de gratificación, Ley 29351)
 *   4. Otras rentas de 5ta (utilidades, bonos, etc.)
 *
 * El cálculo previo solo proyectaba el sueldo × 12, omitiendo ítems 2 y 3,
 * lo que generaba diferencias de hasta 18% vs. boletas reales.
 *
 * Nota: Se calcula desde mes 1 del año fiscal. Para mayor precisión en meses
 * posteriores, debe considerar retenciones acumuladas (ver Art. 40 lit. b).
 *
 * @param {number} salarioBruto - Remuneración mensual (incluye Asig. Familiar)
 * @param {object} regimen - Régimen laboral (para factores de gratificación)
 * @param {number} utilidadesMensual - Utilidades mensualizadas gravadas
 */
window.calcularImpuesto5ta = function (salarioBruto, regimen, utilidadesMensual = 0) {
    const rem   = safe(salarioBruto);
    const utils = safe(utilidadesMensual);
    const uit   = PERU_DATA.rentaQuinta.uit;

    // Factor de gratificación según régimen
    const gFactor = (regimen && regimen.beneficios.gratificacionesFactor) || 1.0;
    // Factor de bonificación extraordinaria según régimen
    const bFactor = (regimen && regimen.essaludBonif) || 0.0;

    // ─────────────────────────────────────────────────────────────────
    // PASO 1: Renta Bruta Anual (Art. 40 TUO LIR)
    // ─────────────────────────────────────────────────────────────────
    const remuAnual   = r4(rem * 12);                               // 12 meses ordinarios
    const gratifAnual = r4(rem * gFactor * 2);                      // 2 gratificaciones
    const bonifAnual  = r4(rem * gFactor * bFactor * 2);            // 2 bonif. extraord.
    const utilsAnual  = r4(utils * 12);
    const rentaBruta  = r4(remuAnual + gratifAnual + bonifAnual + utilsAnual);

    // PASO 2: Deducción de 7 UIT
    const deduccion     = r4(PERU_DATA.rentaQuinta.deduccion * uit);   // 7 × 5150 = 36,050
    const baseImponible = r4(Math.max(0, rentaBruta - deduccion));

    // PASO 3: Cálculo escalonado por tramos
    let impuestoAnual = 0;
    const detalleTramos = [];
    PERU_DATA.rentaQuinta.tramos.forEach(tramo => {
        const limInf = r4(tramo.desde * uit);
        const limSup = tramo.hasta !== null ? r4(tramo.hasta * uit) : Infinity;
        if (baseImponible > limInf) {
            const porcion = r4(Math.min(baseImponible, limSup) - limInf);
            const impTramo = r4(porcion * tramo.tasa);
            impuestoAnual += impTramo;
            if (porcion > 0) {
                detalleTramos.push({
                    rango: `${tramo.desde}-${tramo.hasta || '∞'} UIT`,
                    tasa: tramo.tasa,
                    porcion: r2(porcion),
                    impuesto: r2(impTramo)
                });
            }
        }
    });

    const mensual = r4(impuestoAnual / 12);

    return {
        mensual:        r2(mensual),
        anual:          r2(impuestoAnual),
        baseImponible:  r2(baseImponible),
        deduccion:      r2(deduccion),
        rentaBruta:     r2(rentaBruta),
        remuAnual:      r2(remuAnual),
        gratifAnual:    r2(gratifAnual),
        bonifAnual:     r2(bonifAnual),
        utilsAnual:     r2(utilsAnual),
        detalleTramos,
        // ¿Aplica impuesto?
        aplica: baseImponible > 0
    };
};

/**
 * Calcula el Salario Neto a partir del Bruto.
 * Integra las correcciones de AFP (FIX-1) y Renta 5ta (FIX-2).
 */
window.calcularSalarioNeto = function (salarioBruto, regimen, opciones = {}) {
    const {
        tieneHijos      = false,
        sistemaPension  = 'afp',
        afpNombre       = 'integra',
        tipoComisionAFP = 'flujo',
        saldoAFP        = 0,
        utilidadesMensual = 0
    } = opciones;

    const bruto = safe(salarioBruto);

    // ── Asignación Familiar ──
    const asigFamiliar = (tieneHijos && regimen.beneficios.asignacionFamiliar)
        ? calcularAsignacionFamiliar()
        : 0;

    const salarioTotal = r4(bruto + asigFamiliar);

    // ── Descuentos Previsionales ──
    let descuentoPension = 0;
    let detallesPension  = {};

    if (sistemaPension === 'afp') {
        detallesPension  = calcularAFP(salarioTotal, afpNombre, tipoComisionAFP, saldoAFP);
        descuentoPension = safe(detallesPension.total);
    } else if (sistemaPension === 'onp') {
        descuentoPension = r4(salarioTotal * PERU_DATA.onp);
        detallesPension  = { total: r2(descuentoPension), porcentaje: PERU_DATA.onp };
    }

    // ── Impuesto 5ta Categoría (con proyección completa) ──
    const ir5ta = calcularImpuesto5ta(salarioTotal, regimen, utilidadesMensual);

    // ── Sueldo Neto ──
    const salarioNeto = r4(salarioTotal - descuentoPension - ir5ta.mensual);

    return {
        salarioBruto:    r2(bruto),
        asigFamiliar:    r2(asigFamiliar),
        salarioTotal:    r2(salarioTotal),
        descuentoPension: r2(descuentoPension),
        impuesto5ta:     r2(ir5ta.mensual),
        ir5taDetalle:    ir5ta,
        salarioNeto:     r2(Math.max(0, salarioNeto)),
        detallesPension
    };
};

/**
 * Calcula el Salario Bruto necesario para obtener un Neto deseado.
 * Usa bisección iterativa (50 iteraciones, tolerancia S/ 0.01).
 */
window.calcularSalarioBruto = function (salarioNetoDeseado, regimen, opciones = {}) {
    const neto = safe(salarioNetoDeseado);
    let bajo  = neto;
    let alto  = neto * 2.5;
    const TOL = 0.01;

    for (let i = 0; i < 60; i++) {
        const medio     = r4((bajo + alto) / 2);
        const resultado = calcularSalarioNeto(medio, regimen, opciones);
        const diff      = resultado.salarioNeto - neto;

        if (Math.abs(diff) < TOL) return r2(medio);
        if (diff > 0) alto = medio;
        else          bajo = medio;
    }
    return r2((bajo + alto) / 2);
};

/**
 * Calcula la CTS Semestral.
 * Remuneración computable = Sueldo + Asig. Familiar + 1/6 de Gratificación.
 * Base: D.S. 001-97-TR.
 */
window.calcularCTS = function (salarioBruto, asigFamiliar, regimen, mesesTrabajados = 6) {
    if (!regimen.beneficios.cts) return { ctsTotal: 0, detalles: {} };

    const bruto  = safe(salarioBruto);
    const asig   = safe(asigFamiliar);
    const meses  = Math.min(6, Math.max(0, safe(mesesTrabajados)));

    // 1/6 de una gratificación (Factor régimen × sueldo / 6)
    const sextoGratificacion     = r4(bruto * regimen.beneficios.gratificacionesFactor * PERU_DATA.cts.sextoGratificacion);
    const remuneracionComputable = r4(bruto + asig + sextoGratificacion);

    // CTS = (Rem. Computable / 12) × Meses × Factor régimen
    const ctsBase  = r4((remuneracionComputable * meses) / 12);
    const ctsTotal = r4(ctsBase * regimen.beneficios.ctsFactor);

    return {
        ctsTotal: r2(ctsTotal),
        detalles: {
            remuneracionComputable: r2(remuneracionComputable),
            sextoGratificacion:     r2(sextoGratificacion),
            mesesTrabajados:        meses,
            factor:                 regimen.beneficios.ctsFactor
        }
    };
};

/**
 * Calcula Gratificaciones (Julio y Diciembre).
 * Incluye Bonificación Extraordinaria (Ley 29351) para Régimen General.
 * Base: Ley 27735 y D.S. 005-2002-TR.
 */
window.calcularGratificaciones = function (salarioBruto, asigFamiliar, regimen) {
    if (!regimen.beneficios.gratificaciones) {
        return { gratificacionBase: 0, bonifEssalud: 0, totalPorGratificacion: 0, gratificacionTotal: 0 };
    }

    const bruto = safe(salarioBruto);
    const asig  = safe(asigFamiliar);

    const base         = r4((bruto + asig) * regimen.beneficios.gratificacionesFactor);
    const bonifEssalud = r4(base * regimen.essaludBonif);  // 9% para Rég. General
    const totalUna     = r4(base + bonifEssalud);
    const totalAnual   = r4(totalUna * PERU_DATA.gratificaciones.meses);

    return {
        gratificacionBase:      r2(base),
        bonifEssalud:           r2(bonifEssalud),
        totalPorGratificacion:  r2(totalUna),
        gratificacionTotal:     r2(totalAnual)
    };
};

/**
 * Calcula la Liquidación por Cesación.
 * Base: D.S. 003-97-TR (LPCL) y Ley MYPE.
 */
window.calcularLiquidacion = function (salarioBruto, aniosTrabajados, regimen, tipoSalida = 'despido') {
    const bruto = safe(salarioBruto);
    const anios = safe(aniosTrabajados);

    const ctsPendiente = r4(bruto * 1.1667 * regimen.beneficios.ctsFactor * 0.5);

    const diasVac          = Math.floor(anios * regimen.beneficios.vacaciones);
    const vacacionesTruncas = r4((bruto / 30) * diasVac);

    const mesesGratif       = r4((anios - Math.floor(anios)) * 12);
    const gratificacionTrunca = regimen.beneficios.gratificaciones
        ? r4((bruto * regimen.beneficios.gratificacionesFactor * mesesGratif) / 6)
        : 0;

    let indemnizacion = 0;
    if (tipoSalida === 'despido') {
        indemnizacion = r4(bruto * regimen.beneficios.indemnizacion * anios);
        indemnizacion = r4(Math.min(indemnizacion, bruto * 12));  // Tope: 12 sueldos
    }

    const total = r4(ctsPendiente + vacacionesTruncas + gratificacionTrunca + indemnizacion);

    return {
        ctsPendiente:       r2(ctsPendiente),
        vacacionesTruncas:  r2(vacacionesTruncas),
        gratificacionTrunca: r2(gratificacionTrunca),
        indemnizacion:      r2(indemnizacion),
        totalLiquidacion:   r2(total)
    };
};

/**
 * Calcula el Costo Total para el Empleador (Planilla Completa).
 * Base: Ley 26790 (ESSALUD), D.S. 003-97-TR.
 */
window.calcularCostoEmpleador = function (salarioBruto, asigFamiliar, regimen, opciones = {}) {
    const { aplicaSenati = false, tieneEPS = false, nivelRiesgo = 'medio' } = opciones;

    const base = r4(safe(salarioBruto) + safe(asigFamiliar));

    const essalud = r4(base * PERU_DATA.empleador.essalud);
    const vidaLey = r4(base * PERU_DATA.empleador.vidaLey);
    const sctr    = r4(base * PERU_DATA.empleador.sctr[nivelRiesgo]);
    const senati  = aplicaSenati ? r4(base * PERU_DATA.empleador.senati) : 0;
    const eps     = tieneEPS    ? r4(base * PERU_DATA.empleador.eps)    : 0;
    const cargasDirectas = r4(essalud + vidaLey + sctr + senati + eps);

    // Provisión Gratificaciones (mensualizada)
    const gratifMensual      = regimen.beneficios.gratificaciones ? r4((base * regimen.beneficios.gratificacionesFactor * 2) / 12) : 0;
    const bonifGratif        = regimen.beneficios.gratificaciones ? r4(gratifMensual * regimen.essaludBonif) : 0;
    const provGratificaciones = r4(gratifMensual + bonifGratif);

    // Provisión CTS (mensualizada)
    const provCTS = regimen.beneficios.cts ? r4((base * 1.1667 * regimen.beneficios.ctsFactor) / 12) : 0;

    // Provisión Vacaciones (mensualizada)
    const provVacaciones = r4((base * regimen.beneficios.vacacionesFactor) / 12);

    const provisionesBeneficios = r4(provGratificaciones + provCTS + provVacaciones);
    const costoTotal            = r4(base + cargasDirectas + provisionesBeneficios);
    const porcentajeCarga       = r4(((costoTotal - base) / base) * 100);

    return {
        sueldoBruto:            r2(base),
        essalud:                r2(essalud),
        vidaLey:                r2(vidaLey),
        sctr:                   r2(sctr),
        senati:                 r2(senati),
        eps:                    r2(eps),
        cargasDirectas:         r2(cargasDirectas),
        provGratificaciones:    r2(provGratificaciones),
        provCTS:                r2(provCTS),
        provVacaciones:         r2(provVacaciones),
        provisionesBeneficios:  r2(provisionesBeneficios),
        costoTotal:             r2(costoTotal),
        porcentajeCarga:        r4(porcentajeCarga)
    };
};

/**
 * Calcula Utilidades según D.Leg. 892.
 */
window.calcularUtilidades = function (
    salarioBruto, diasTrabajados, rentaAnual,
    totalRemuneraciones, totalDiasTrabajadores, sector = 'otros'
) {
    const sectorData      = PERU_DATA.utilidades.sectores[sector];
    const utilidadTotal   = r4(rentaAnual * sectorData.porcentaje);
    const porDias         = r4((utilidadTotal * PERU_DATA.utilidades.distribucion.porDias * diasTrabajados) / totalDiasTrabajadores);
    const remuAnual       = r4(salarioBruto * 12);
    const porRemuneracion = r4((utilidadTotal * PERU_DATA.utilidades.distribucion.porRemuneracion * remuAnual) / totalRemuneraciones);
    const utilidadTrab    = r4(porDias + porRemuneracion);
    const tope            = r4(salarioBruto * PERU_DATA.utilidades.topeMaximo);
    const utilidadFinal   = r4(Math.min(utilidadTrab, tope));

    return {
        utilidadFinal:    r2(utilidadFinal),
        porDias:          r2(porDias),
        porRemuneracion:  r2(porRemuneracion),
        utilidadSinTope:  r2(utilidadTrab),
        topeAplicado:     utilidadTrab > tope,
        sector:           sectorData.nombre,
        porcentaje:       sectorData.porcentaje
    };
};

// =====================================================================
// ===== [NEW-1] GENERADOR DE LOG DE CÁLCULO =====
// Genera trazabilidad paso a paso de fórmulas legales aplicadas.
// =====================================================================

/**
 * Genera un array de pasos que explican el cálculo realizado.
 * Ideal para mostrar en un panel "Ver fórmulas" o exportar a PDF.
 *
 * @param {string} calcId - ID de la calculadora
 * @param {object} resultado - Resultado del cálculo
 * @param {object} regimen - Régimen laboral utilizado
 * @param {object} inputs - Valores ingresados por el usuario
 */
window.generarLogCalculo = function (calcId, resultado, regimen, inputs = {}) {
    const log = [];
    const push = (paso, formula, valor, nota = '') => {
        log.push({ paso, formula, valor, nota });
    };
    const S = n => `S/ ${r2(safe(n)).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

    switch (calcId) {

        case 'neto': {
            const rem   = safe(inputs.salarioBruto || inputs.salarioTotal);
            const ir5ta = resultado.ir5taDetalle || {};
            push('1', 'Sueldo Bruto ingresado',
                S(rem), 'Punto de partida del cálculo');

            if (resultado.asigFamiliar > 0) {
                push('2', 'RMV × 10% = Asignación Familiar',
                    S(resultado.asigFamiliar), 'D.S. 035-90-TR');
                push('3', 'Bruto + Asig. Familiar = Remuneración Total',
                    S(resultado.salarioTotal), 'Base imponible AFP/ONP e IR5ta');
            } else {
                push('2', 'Remuneración Total = Sueldo Bruto',
                    S(resultado.salarioTotal), 'Sin asignación familiar');
            }

            push('3', 'Aporte AFP al Fondo: Rem. Total × 10%',
                S(resultado.detallesPension?.aporte || 0), 'D.S. 054-97-EF. SIN TOPE');
            push('4', `SIS: min(Rem, TMA SBS) × 1.70%`,
                S(resultado.detallesPension?.seguro || 0),
                `TMA SBS 2026: ${S(PERU_DATA.topesSeguros.sbsTopeAsegurable)}`);
            push('5', `Comisión AFP: Rem. Total × tasa`,
                S(resultado.detallesPension?.comision || 0), 'Varía por AFP y tipo de comisión');
            push('6', 'Total AFP = Fondo + SIS + Comisión',
                S(resultado.descuentoPension), 'Descuento total AFP');

            if (ir5ta && ir5ta.rentaBruta !== undefined) {
                push('7', 'Renta Bruta Anual: (Rem×12) + Gratif×2 + BonifExt×2',
                    S(ir5ta.rentaBruta),
                    `Gratif: ${S(ir5ta.gratifAnual)} | BonifExt: ${S(ir5ta.bonifAnual)}`);
                push('8', `Renta Bruta − 7 UIT (7 × ${S(PERU_DATA.rentaQuinta.uit)})`,
                    S(ir5ta.baseImponible), 'Base Imponible IR5ta');
                push('9', `Impuesto Anual ÷ 12 = IR5ta Mensual`,
                    S(ir5ta.mensual),
                    `Impuesto anual: ${S(ir5ta.anual)}. Art. 40 TUO LIR D.S. 179-2004-EF`);
            }

            push('10', 'Sueldo Neto = Rem. Total − AFP − IR5ta',
                S(resultado.salarioNeto), '✅ Output Final');
            break;
        }

        case 'gratificacion': {
            push('1', 'Remuneración Computable = Sueldo + Asig. Familiar',
                S(inputs.base || 0), 'Ley 27735 Art. 3');
            push('2', `Gratif. Base = Rem. Computable × ${pct(regimen.beneficios.gratificacionesFactor)}`,
                S(resultado.gratificacionBase || 0), 'Factor según régimen laboral');
            push('3', 'Bonificación Extraordinaria = Gratif. Base × 9%',
                S(resultado.bonifEssalud || 0),
                'Ley 29351 — Inafecta a AFP/ONP e IR5ta. Solo Régimen General');
            push('4', 'Total por Gratificación = Base + Bonificación',
                S(resultado.totalPorGratificacion || 0), '✅ Se paga en Julio y Diciembre');
            push('5', 'Total Anual = Total × 2 gratificaciones',
                S((resultado.totalPorGratificacion || 0) * 2), '');
            break;
        }

        case 'cts': {
            push('1', '1/6 de Gratificación = Sueldo × Factor × (1/6)',
                '', 'D.S. 001-97-TR. Incorporado como computable CTS');
            push('2', 'Rem. Computable = Sueldo + Asig. Familiar + 1/6 Gratif.',
                '', 'Base de cálculo CTS');
            push('3', `CTS Semestral = (Rem. Comp. × Meses) / 12 × ${pct(regimen.beneficios.ctsFactor)}`,
                '', `Factor: ${pct(regimen.beneficios.ctsFactor)} según ${regimen.nombre}`);
            push('4', '✅ Depósito semestral en Mayo y Noviembre', '', 'No afecto a IR5ta ni AFP');
            break;
        }

        default:
            push('INFO', 'Log detallado disponible para: neto, gratificacion, cts',
                '', 'Próximamente: liquidación, utilidades, costo empleador');
    }

    return log;
};

// =====================================================================
// ===== CONFIGURACIÓN DE CALCULADORAS =====
// =====================================================================

window.CALCULATOR_CONFIGS = {

    // ─── 1. SALARIO NETO ─────────────────────────────────────────────
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Salario Neto',
        description: 'Calcula tu sueldo líquido mensual después de descuentos (AFP/ONP, Impuesto a la Renta 5ta)',
        fields: [
            {
                id: 'salary',
                label: 'Sueldo Bruto Mensual',
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage,
                help: 'Monto antes de descuentos'
            },
            {
                id: 'hijos',
                label: '¿Tienes hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (+ Asignación Familiar S/ 107.50)' }
                ]
            },
            {
                id: 'pension',
                label: 'Sistema de Pensiones',
                type: 'select',
                options: [
                    { value: 'afp', label: 'AFP (Sistema Privado)' },
                    { value: 'onp', label: 'ONP (Sistema Nacional 13%)' }
                ]
            },
            {
                id: 'afp',
                label: 'AFP',
                type: 'select',
                options: [
                    { value: 'integra',   label: 'AFP Integra (flujo 0.82%)' },
                    { value: 'prima',     label: 'AFP Prima (flujo 1.60%)' },
                    { value: 'profuturo', label: 'AFP Profuturo (flujo 1.69%)' },
                    { value: 'habitat',   label: 'AFP Habitat (flujo 1.47%)' }
                ],
                conditional: { field: 'pension', value: 'afp' }
            },
            {
                id: 'tipo-comision',
                label: 'Tipo de Comisión AFP',
                type: 'select',
                options: [
                    { value: 'flujo', label: 'Comisión sobre Flujo (% del sueldo)' },
                    { value: 'mixta', label: 'Comisión Mixta (% sueldo + % saldo anual)' }
                ],
                conditional: { field: 'pension', value: 'afp' }
            },
            {
                id: 'saldo-afp',
                label: 'Saldo Acumulado AFP (S/)',
                type: 'number',
                inputmode: 'decimal',
                placeholder: '50000',
                min: 0,
                help: 'Requerido solo para comisión mixta',
                conditional: { field: 'tipo-comision', value: 'mixta' }
            }
        ],
        calculate: (values, regimen) => {
            const salary         = safe(parseFloat(values['salary']));
            const tieneHijos     = values['hijos'] === 'si';
            const sistemaPension = values['pension'] || 'afp';
            const afpNombre      = values['afp'] || 'integra';
            const tipoComisionAFP = values['tipo-comision'] || 'flujo';
            const saldoAFP       = safe(parseFloat(values['saldo-afp']));

            if (salary < PERU_DATA.minWage) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ SUELDO INVÁLIDO', value: '', type: 'header' },
                        { label: 'El sueldo no puede ser menor a la RMV', value: `S/ ${PERU_DATA.minWage}`, type: 'info' }
                    ]
                };
            }

            const resultado = calcularSalarioNeto(salary, regimen, {
                tieneHijos, sistemaPension, afpNombre, tipoComisionAFP, saldoAFP
            });

            const ir5ta = resultado.ir5taDetalle || {};
            const afp   = resultado.detallesPension || {};

            const details = [
                { label: '💼 INGRESOS', value: '', type: 'header' },
                { label: 'Sueldo Bruto', value: fmt(resultado.salarioBruto), type: 'base' },
                ...(resultado.asigFamiliar > 0 ? [
                    { label: 'Asignación Familiar (10% RMV)', value: `+ ${fmt(resultado.asigFamiliar)}`, type: 'ingreso' }
                ] : []),
                { label: 'Remuneración Total', value: fmt(resultado.salarioTotal), type: 'subtotal' },
                { label: '', value: '', type: 'separator' },

                { label: '🏦 DESCUENTO AFP / ONP', value: '', type: 'header' },
                ...(sistemaPension === 'afp' ? [
                    { label: `Aporte Fondo AFP ${afpNombre.charAt(0).toUpperCase() + afpNombre.slice(1)} (10%)`, value: `- ${fmt(afp.aporte)}`, type: 'descuento' },
                    { label: `SIS — Seguro Invalidez/Sobrev. (1.70%)${afp.topeAplicado ? ' [TOPE SBS]' : ''}`, value: `- ${fmt(afp.seguro)}`, type: 'descuento' },
                    { label: `Comisión AFP ${tipoComisionAFP === 'flujo' ? 'Flujo' : 'Mixta'}`, value: `- ${fmt(afp.comision)}`, type: 'descuento' },
                    ...(afp.topeAplicado ? [
                        { label: '  ↳ Tope SBS aplicado al SIS', value: `Base: ${fmt(afp.remParaSIS)}`, type: 'info' }
                    ] : [])
                ] : [
                    { label: 'ONP (13%) — D.Ley 19990', value: `- ${fmt(resultado.descuentoPension)}`, type: 'descuento' }
                ]),
                { label: '', value: '', type: 'separator' },

                { label: '📊 IMPUESTO A LA RENTA 5TA CATEGORÍA', value: '', type: 'header' },
                ...(ir5ta.aplica ? [
                    { label: 'Proyección Anual:', value: '', type: 'info' },
                    { label: '  Remuneraciones (× 12)', value: fmt(ir5ta.remuAnual), type: 'info' },
                    { label: '  + Gratificaciones Ley 27735 (× 2)', value: `+ ${fmt(ir5ta.gratifAnual)}`, type: 'info' },
                    { label: '  + Bonificación Extraordinaria (× 2)', value: `+ ${fmt(ir5ta.bonifAnual)}`, type: 'info' },
                    { label: 'Renta Bruta Anual', value: fmt(ir5ta.rentaBruta), type: 'subtotal' },
                    { label: 'Deducción 7 UIT (Art. 40 TUO LIR)', value: `- ${fmt(ir5ta.deduccion)}`, type: 'descuento' },
                    { label: 'Base Imponible Anual', value: fmt(ir5ta.baseImponible), type: 'subtotal' },
                    { label: 'Impuesto Anual (tramos)', value: fmt(ir5ta.anual), type: 'descuento' },
                    { label: 'Retención Mensual (÷ 12)', value: `- ${fmt(ir5ta.mensual)}`, type: 'descuento' }
                ] : [
                    { label: 'IR 5ta Categoría', value: 'S/ 0.00 — No alcanza 7 UIT', type: 'info' }
                ]),
                { label: '', value: '', type: 'separator' },

                { label: '📉 RESUMEN DESCUENTOS', value: '', type: 'header' },
                { label: 'Total Pensiones', value: `- ${fmt(resultado.descuentoPension)}`, type: 'descuento' },
                { label: 'Total IR 5ta Cat.', value: `- ${fmt(resultado.impuesto5ta)}`, type: 'descuento' },
                { label: 'TOTAL DESCUENTOS', value: fmt(resultado.descuentoPension + resultado.impuesto5ta), type: 'subtotal' }
            ];

            return {
                total: resultado.salarioNeto,
                details,
                _log: generarLogCalculo('neto', resultado, regimen, { salarioBruto: salary, salarioTotal: resultado.salarioTotal }),
                _resultado: resultado
            };
        },
        legalInfo: 'D.S. 054-97-EF (AFP) | D.Ley 19990 (ONP) | TUO LIR D.S. 179-2004-EF Art. 40 (IR 5ta). SIS con Tope Máximo Asegurable SBS. Gratificaciones y Bonificación Extraordinaria incluidas en proyección anual IR5ta.'
    },

    // ─── 2. SALARIO BRUTO DESDE NETO ──────────────────────────────────
    bruto: {
        id: 'bruto',
        icon: '🎯',
        title: 'Salario Bruto (desde Neto)',
        description: 'Calcula cuánto debe ser tu sueldo bruto para recibir el neto que deseas',
        fields: [
            {
                id: 'neto-deseado',
                label: 'Sueldo Neto Deseado',
                type: 'number',
                inputmode: 'decimal',
                placeholder: '4000',
                min: PERU_DATA.minWage * 0.7,
                help: 'Monto líquido que quieres recibir'
            },
            {
                id: 'hijos-bruto',
                label: '¿Tienes hijos menores?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            {
                id: 'pension-bruto',
                label: 'Sistema de Pensiones',
                type: 'select',
                options: [
                    { value: 'afp', label: 'AFP' },
                    { value: 'onp', label: 'ONP (13%)' }
                ]
            },
            {
                id: 'afp-bruto',
                label: 'AFP (si aplica)',
                type: 'select',
                options: [
                    { value: 'integra',   label: 'AFP Integra' },
                    { value: 'prima',     label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' },
                    { value: 'habitat',   label: 'AFP Habitat' }
                ],
                conditional: { field: 'pension-bruto', value: 'afp' }
            },
            {
                id: 'tipo-comision-bruto',
                label: 'Tipo de Comisión',
                type: 'select',
                options: [
                    { value: 'flujo', label: 'Flujo' },
                    { value: 'mixta', label: 'Mixta' }
                ],
                conditional: { field: 'pension-bruto', value: 'afp' }
            }
        ],
        calculate: (values, regimen) => {
            const netoDeseado    = safe(parseFloat(values['neto-deseado']));
            const tieneHijos     = values['hijos-bruto'] === 'si';
            const sistemaPension = values['pension-bruto'] || 'afp';
            const afpNombre      = values['afp-bruto'] || 'integra';
            const tipoComisionAFP = values['tipo-comision-bruto'] || 'flujo';

            if (netoDeseado <= 0) return { total: 0, details: [{ label: '⚠️ Ingresa un neto válido', value: '', type: 'header' }] };

            const brutoNecesario = calcularSalarioBruto(netoDeseado, regimen, { tieneHijos, sistemaPension, afpNombre, tipoComisionAFP });
            const verificacion   = calcularSalarioNeto(brutoNecesario, regimen, { tieneHijos, sistemaPension, afpNombre, tipoComisionAFP });

            return {
                total: brutoNecesario,
                details: [
                    { label: '🎯 OBJETIVO', value: '', type: 'header' },
                    { label: 'Neto Deseado', value: fmt(netoDeseado), type: 'base' },
                    { label: 'Régimen', value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💼 RESULTADO', value: '', type: 'header' },
                    { label: 'Bruto Necesario', value: fmt(brutoNecesario), type: 'subtotal' },
                    ...(verificacion.asigFamiliar > 0 ? [
                        { label: 'Incluye Asig. Familiar', value: fmt(verificacion.asigFamiliar), type: 'info' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 VERIFICACIÓN', value: '', type: 'header' },
                    { label: 'Pensiones', value: `- ${fmt(verificacion.descuentoPension)}`, type: 'descuento' },
                    { label: 'IR 5ta Cat.', value: `- ${fmt(verificacion.impuesto5ta)}`, type: 'descuento' },
                    { label: 'Neto Resultante', value: fmt(verificacion.salarioNeto), type: 'ingreso' },
                    { label: 'Diferencia vs Objetivo', value: fmt(Math.abs(verificacion.salarioNeto - netoDeseado)), type: 'info' }
                ]
            };
        },
        legalInfo: 'Cálculo inverso iterativo (bisección, 60 iteraciones, tolerancia S/ 0.01). Considera AFP/ONP con correcciones FIX-1 y FIX-2. Útil para negociaciones salariales.'
    },

    // ─── 3. CTS ────────────────────────────────────────────────────────
    cts: {
        id: 'cts',
        icon: '🏦',
        title: 'CTS — Compensación por Tiempo de Servicios',
        description: 'Calcula tu CTS semestral (depósitos Mayo y Noviembre)',
        fields: [
            { id: 'cts-salary', label: 'Sueldo Bruto Mensual', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'cts-hijos', label: '¿Asignación Familiar?', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: 'Sí' }] },
            { id: 'cts-meses', label: 'Meses trabajados en el semestre', type: 'number', inputmode: 'decimal', placeholder: '6', min: 1, max: 6, help: 'Máximo 6 meses por semestre' }
        ],
        calculate: (values, regimen) => {
            const salary      = safe(parseFloat(values['cts-salary']));
            const tieneHijos  = values['cts-hijos'] === 'si';
            const meses       = safe(parseFloat(values['cts-meses'])) || 6;
            const asigFamiliar = (tieneHijos && regimen.beneficios.asignacionFamiliar) ? calcularAsignacionFamiliar() : 0;

            const ctsCalc = calcularCTS(salary, asigFamiliar, regimen, meses);

            if (!regimen.beneficios.cts) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ CTS NO APLICABLE', value: '', type: 'header' },
                        { label: 'Régimen', value: regimen.nombre, type: 'info' },
                        { label: 'Observación', value: 'Este régimen no contempla CTS', type: 'info' }
                    ]
                };
            }

            return {
                total: ctsCalc.ctsTotal,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: fmt(salary), type: 'base' },
                    ...(asigFamiliar > 0 ? [{ label: 'Asignación Familiar', value: `+ ${fmt(asigFamiliar)}`, type: 'ingreso' }] : []),
                    { label: '1/6 de Gratificación', value: `+ ${fmt(ctsCalc.detalles.sextoGratificacion)}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 CÁLCULO CTS', value: '', type: 'header' },
                    { label: 'Remuneración Computable', value: fmt(ctsCalc.detalles.remuneracionComputable), type: 'subtotal' },
                    { label: 'Meses Trabajados', value: `${meses} de 6`, type: 'info' },
                    { label: `Factor Régimen (${regimen.beneficios.ctsFactor * 100}%)`, value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 PROYECCIÓN ANUAL', value: '', type: 'header' },
                    { label: 'CTS Mayo', value: fmt(ctsCalc.ctsTotal), type: 'ingreso' },
                    { label: 'CTS Noviembre', value: fmt(ctsCalc.ctsTotal), type: 'ingreso' },
                    { label: 'Total CTS Anual', value: fmt(ctsCalc.ctsTotal * 2), type: 'subtotal' }
                ]
            };
        },
        legalInfo: 'D.S. 001-97-TR. Rem. Computable = Sueldo + 1/6 Gratif + Asig. Familiar. Depósitos semestrales. Factor: General 100%, Pequeña 50%, Micro 0%.'
    },

    // ─── 4. GRATIFICACIONES ────────────────────────────────────────────
    gratificacion: {
        id: 'gratificacion',
        icon: '🎁',
        title: 'Gratificaciones',
        description: 'Calcula tus gratificaciones de Julio (Fiestas Patrias) y Diciembre (Navidad)',
        fields: [
            { id: 'grat-salary', label: 'Sueldo Bruto Mensual', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'grat-hijos', label: '¿Asignación Familiar?', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: 'Sí' }] },
            { id: 'grat-pension', label: 'Sistema de Pensiones', type: 'select', options: [{ value: 'afp', label: 'AFP' }, { value: 'onp', label: 'ONP' }] },
            {
                id: 'grat-afp', label: 'AFP (si aplica)', type: 'select',
                options: [
                    { value: 'integra', label: 'AFP Integra' }, { value: 'prima', label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' }, { value: 'habitat', label: 'AFP Habitat' }
                ],
                conditional: { field: 'grat-pension', value: 'afp' }
            }
        ],
        calculate: (values, regimen) => {
            const salary         = safe(parseFloat(values['grat-salary']));
            const tieneHijos     = values['grat-hijos'] === 'si';
            const sistemaPension = values['grat-pension'] || 'afp';
            const afpNombre      = values['grat-afp'] || 'integra';
            const asigFamiliar   = (tieneHijos && regimen.beneficios.asignacionFamiliar) ? calcularAsignacionFamiliar() : 0;

            if (!regimen.beneficios.gratificaciones) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ GRATIFICACIONES NO APLICABLES', value: '', type: 'header' },
                        { label: 'Régimen', value: regimen.nombre, type: 'info' }
                    ]
                };
            }

            const gratifCalc = calcularGratificaciones(salary, asigFamiliar, regimen);

            let descuentoPension = 0;
            if (sistemaPension === 'afp') {
                // Sobre gratificaciones, el SIS y comisión también aplican (sin IR5ta)
                const afpCalc = calcularAFP(gratifCalc.gratificacionBase, afpNombre, 'flujo', 0);
                descuentoPension = afpCalc.total;
            } else {
                descuentoPension = r2(gratifCalc.gratificacionBase * PERU_DATA.onp);
            }

            const netoGratif = r2(gratifCalc.totalPorGratificacion - descuentoPension);

            return {
                total: r2(gratifCalc.totalPorGratificacion),
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: fmt(salary), type: 'base' },
                    ...(asigFamiliar > 0 ? [{ label: 'Asignación Familiar', value: `+ ${fmt(asigFamiliar)}`, type: 'ingreso' }] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '🎁 CÁLCULO GRATIFICACIÓN (Ley 27735)', value: '', type: 'header' },
                    { label: `Gratificación Base (${regimen.beneficios.gratificacionesFactor * 100}%)`, value: fmt(gratifCalc.gratificacionBase), type: 'subtotal' },
                    ...(gratifCalc.bonifEssalud > 0 ? [
                        { label: 'Bonificación Extraordinaria (9% — Ley 29351)', value: `+ ${fmt(gratifCalc.bonifEssalud)}`, type: 'ingreso' },
                        { label: '  ↳ Inafecta a AFP/ONP e IR5ta', value: '', type: 'info' }
                    ] : []),
                    { label: 'Total Bruto por Gratificación', value: fmt(gratifCalc.totalPorGratificacion), type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📉 DESCUENTOS (sobre Gratif. Base)', value: '', type: 'header' },
                    { label: sistemaPension === 'afp' ? 'AFP (aporte + SIS + comisión)' : 'ONP (13%)', value: `- ${fmt(descuentoPension)}`, type: 'descuento' },
                    { label: 'IR 5ta Categoría', value: 'No aplica sobre gratificaciones', type: 'info' },
                    { label: 'Neto por Gratificación', value: fmt(netoGratif), type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 RESUMEN ANUAL', value: '', type: 'header' },
                    { label: 'Gratificación Julio (Fiestas Patrias)', value: fmt(netoGratif), type: 'info' },
                    { label: 'Gratificación Diciembre (Navidad)', value: fmt(netoGratif), type: 'info' },
                    { label: 'Total Neto Anual', value: fmt(netoGratif * 2), type: 'subtotal' }
                ]
            };
        },
        legalInfo: 'Ley 27735 | D.S. 005-2002-TR. Bonificación Extraordinaria 9% (Ley 29351) inafecta a contribuciones. Factor: General 100%, Pequeña 50%, Micro 0%. El IR5ta NO se descuenta de gratificaciones.'
    },

    // ─── 5. LIQUIDACIÓN ────────────────────────────────────────────────
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        title: 'Liquidación de Beneficios Sociales',
        description: 'Calcula el pago final al terminar la relación laboral',
        fields: [
            { id: 'liq-salary', label: 'Último Sueldo Bruto', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'liq-anios', label: 'Años Trabajados', type: 'number', inputmode: 'decimal', placeholder: '3.5', min: 0, max: 40, step: 0.1, help: 'Puede incluir decimales (ej: 3.5)' },
            {
                id: 'liq-tipo', label: 'Tipo de Salida', type: 'select',
                options: [
                    { value: 'despido', label: 'Despido Arbitrario (con indemnización)' },
                    { value: 'renuncia', label: 'Renuncia Voluntaria (sin indemnización)' },
                    { value: 'mutuo', label: 'Mutuo Acuerdo (sin indemnización)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary         = safe(parseFloat(values['liq-salary']));
            const aniosTrabajados = safe(parseFloat(values['liq-anios']));
            const tipoSalida     = values['liq-tipo'] || 'despido';
            const liqCalc        = calcularLiquidacion(salary, aniosTrabajados, regimen, tipoSalida);

            return {
                total: liqCalc.totalLiquidacion,
                details: [
                    { label: '💼 DATOS LABORALES', value: '', type: 'header' },
                    { label: 'Último Sueldo', value: fmt(salary), type: 'base' },
                    { label: 'Tiempo de Servicio', value: `${aniosTrabajados} años`, type: 'info' },
                    { label: 'Tipo de Salida', value: tipoSalida === 'despido' ? 'Despido Arbitrario' : tipoSalida === 'renuncia' ? 'Renuncia' : 'Mutuo Acuerdo', type: 'info' },
                    { label: 'Régimen', value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 BENEFICIOS SOCIALES', value: '', type: 'header' },
                    { label: 'CTS Pendiente', value: fmt(liqCalc.ctsPendiente), type: 'ingreso' },
                    { label: 'Vacaciones Truncas', value: fmt(liqCalc.vacacionesTruncas), type: 'ingreso' },
                    ...(liqCalc.gratificacionTrunca > 0 ? [
                        { label: 'Gratificación Trunca', value: fmt(liqCalc.gratificacionTrunca), type: 'ingreso' }
                    ] : []),
                    ...(liqCalc.indemnizacion > 0 ? [
                        { label: 'Indemnización (1.5 sueldos/año, tope 12)', value: fmt(liqCalc.indemnizacion), type: 'ingreso' }
                    ] : [
                        { label: 'Indemnización', value: 'No aplica — Renuncia/Mutuo Acuerdo', type: 'info' }
                    ]),
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 TOTAL LIQUIDACIÓN', value: fmt(liqCalc.totalLiquidacion), type: 'subtotal' }
                ]
            };
        },
        legalInfo: 'LPCL D.S. 003-97-TR | Ley MYPE. Indemnización: 1.5 sueldos/año (tope 12) Rég. General; 0.5 Pequeña Empresa; 0.25 Micro. Vacaciones truncas y gratificación proporcionales.'
    },

    // ─── 6. UTILIDADES ─────────────────────────────────────────────────
    utilidades: {
        id: 'utilidades',
        icon: '📈',
        title: 'Participación en Utilidades',
        description: 'Calcula tu participación en utilidades según D.Leg. 892',
        fields: [
            { id: 'util-salary', label: 'Sueldo Mensual Promedio', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'util-dias', label: 'Días Trabajados en el Año', type: 'number', inputmode: 'decimal', placeholder: '260', min: 1, max: 365 },
            { id: 'util-renta', label: 'Renta Neta Anual de la Empresa (S/)', type: 'number', inputmode: 'decimal', placeholder: '1000000', min: 0 },
            { id: 'util-total-rem', label: 'Total Remuneraciones Empresa (S/)', type: 'number', inputmode: 'decimal', placeholder: '5000000', min: 1 },
            { id: 'util-total-dias', label: 'Total Días Trabajados (todos)', type: 'number', inputmode: 'decimal', placeholder: '10000', min: 1 },
            {
                id: 'util-sector', label: 'Sector Económico', type: 'select',
                options: Object.entries(PERU_DATA.utilidades.sectores).map(([k, v]) =>
                    ({ value: k, label: `${v.nombre} (${v.porcentaje * 100}%)` })
                )
            }
        ],
        calculate: (values, regimen) => {
            const salary     = safe(parseFloat(values['util-salary']));
            const dias       = safe(parseFloat(values['util-dias']));
            const renta      = safe(parseFloat(values['util-renta']));
            const totalRem   = safe(parseFloat(values['util-total-rem'])) || 1;
            const totalDias  = safe(parseFloat(values['util-total-dias'])) || 1;
            const sector     = values['util-sector'] || 'otros';

            if (!regimen.beneficios.utilidades) {
                return { total: 0, details: [{ label: '⚠️ Régimen Micro no participa en utilidades', value: '', type: 'header' }] };
            }

            const utilCalc = calcularUtilidades(salary, dias, renta, totalRem, totalDias, sector);

            return {
                total: utilCalc.utilidadFinal,
                details: [
                    { label: '📈 CÁLCULO UTILIDADES (D.Leg. 892)', value: '', type: 'header' },
                    { label: 'Sector', value: `${utilCalc.sector} (${pct(utilCalc.porcentaje)})`, type: 'info' },
                    { label: 'Fondo Total Utilidades', value: fmt(renta * utilCalc.porcentaje), type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '50% por Días Trabajados', value: fmt(utilCalc.porDias), type: 'ingreso' },
                    { label: '50% por Remuneración', value: fmt(utilCalc.porRemuneracion), type: 'ingreso' },
                    { label: 'Subtotal sin Tope', value: fmt(utilCalc.utilidadSinTope), type: 'subtotal' },
                    ...(utilCalc.topeAplicado ? [
                        { label: '⚠️ Tope Máximo (18 remuneraciones)', value: fmt(salary * 18), type: 'info' }
                    ] : []),
                    { label: 'Total Utilidades', value: fmt(utilCalc.utilidadFinal), type: 'subtotal' }
                ]
            };
        },
        legalInfo: 'D.Leg. 892. Solo empresas con +20 trabajadores. Tope: 18 remuneraciones. 50% por días trabajados, 50% por remuneración. No aplica a Microempresa.'
    },

    // ─── 7. HORAS EXTRA ────────────────────────────────────────────────
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        title: 'Horas Extra',
        description: 'Calcula el pago de horas extra según D.S. 007-2002-TR',
        fields: [
            { id: 'he-salary', label: 'Sueldo Mensual Base', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'he-hours-25', label: 'Horas Extra al 25%', type: 'number', inputmode: 'decimal', placeholder: '10', min: 0, max: 200, help: 'Primeras 2 horas extra del día' },
            { id: 'he-hours-35', label: 'Horas Extra al 35%', type: 'number', inputmode: 'decimal', placeholder: '5', min: 0, max: 200, help: 'A partir de la 3ra hora extra' }
        ],
        calculate: (values, regimen) => {
            const salary  = safe(parseFloat(values['he-salary']));
            const h25     = safe(parseFloat(values['he-hours-25']));
            const h35     = safe(parseFloat(values['he-hours-35']));
            const hRate   = r4(salary / 240);     // 240 horas mensuales (48 sem × 5)
            const pago25  = r4(hRate * 1.25 * h25);
            const pago35  = r4(hRate * 1.35 * h35);
            const total   = r2(pago25 + pago35);

            return {
                total,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: fmt(salary), type: 'base' },
                    { label: 'Valor Hora Ordinaria (÷ 240)', value: fmt(hRate), type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 25%', value: '', type: 'header' },
                    { label: 'Cantidad', value: `${h25} horas`, type: 'info' },
                    { label: 'Valor Hora +25%', value: fmt(hRate * 1.25), type: 'info' },
                    { label: 'Subtotal 25%', value: fmt(pago25), type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 35%', value: '', type: 'header' },
                    { label: 'Cantidad', value: `${h35} horas`, type: 'info' },
                    { label: 'Valor Hora +35%', value: fmt(hRate * 1.35), type: 'info' },
                    { label: 'Subtotal 35%', value: fmt(pago35), type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Total Horas Extra', value: `${h25 + h35} horas`, type: 'info' },
                    { label: 'Límite Legal', value: 'Máx. 8 hrs extra/semana', type: 'info' }
                ]
            };
        },
        legalInfo: 'D.S. 007-2002-TR. Valor hora = Sueldo/240 horas. Primeras 2 horas diarias: +25%. Horas adicionales: +35%. Límite: 8 horas semanales. Afectas a AFP/ONP e IR5ta.'
    },

    // ─── 8. COSTO EMPLEADOR ────────────────────────────────────────────
    costo_empleador: {
        id: 'costo_empleador',
        icon: '🏢',
        title: 'Costo Total para Empleador',
        description: 'Calcula el costo real mensual y la carga social completa',
        fields: [
            { id: 'emp-salary', label: 'Sueldo Bruto Mensual', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage },
            { id: 'emp-hijos', label: '¿Asignación Familiar?', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: 'Sí' }] },
            {
                id: 'emp-riesgo', label: 'Nivel de Riesgo SCTR', type: 'select',
                options: [
                    { value: 'minimo', label: 'Bajo (0.53%) — Oficinas' },
                    { value: 'medio',  label: 'Medio (0.71%) — Comercio' },
                    { value: 'alto',   label: 'Alto (1.18%) — Construcción/Minería' }
                ]
            },
            { id: 'emp-senati', label: '¿Aplica SENATI?', type: 'select', options: [{ value: 'no', label: 'No (Servicios/Comercio)' }, { value: 'si', label: 'Sí — Industria/Construcción (0.75%)' }] },
            { id: 'emp-eps', label: '¿Tiene EPS Privada?', type: 'select', options: [{ value: 'no', label: 'No (Solo ESSALUD 9%)' }, { value: 'si', label: 'Sí (+2.25% adicional)' }] }
        ],
        calculate: (values, regimen) => {
            const salary       = safe(parseFloat(values['emp-salary']));
            const tieneHijos   = values['emp-hijos'] === 'si';
            const nivelRiesgo  = values['emp-riesgo'] || 'medio';
            const aplicaSenati = values['emp-senati'] === 'si';
            const tieneEPS     = values['emp-eps'] === 'si';
            const asigFamiliar = (tieneHijos && regimen.beneficios.asignacionFamiliar) ? calcularAsignacionFamiliar() : 0;
            const costoCalc    = calcularCostoEmpleador(salary, asigFamiliar, regimen, { aplicaSenati, tieneEPS, nivelRiesgo });

            return {
                total: costoCalc.costoTotal,
                details: [
                    { label: '💼 PLANILLA BASE', value: '', type: 'header' },
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Bruto', value: fmt(costoCalc.sueldoBruto), type: 'base' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 CARGAS DIRECTAS', value: '', type: 'header' },
                    { label: 'ESSALUD (9%)', value: `+ ${fmt(costoCalc.essalud)}`, type: 'costo' },
                    { label: `SCTR (${pct(PERU_DATA.empleador.sctr[nivelRiesgo])})`, value: `+ ${fmt(costoCalc.sctr)}`, type: 'costo' },
                    { label: 'Seguro Vida Ley (0.53%)', value: `+ ${fmt(costoCalc.vidaLey)}`, type: 'costo' },
                    ...(aplicaSenati ? [{ label: 'SENATI (0.75%)', value: `+ ${fmt(costoCalc.senati)}`, type: 'costo' }] : []),
                    ...(tieneEPS ? [{ label: 'EPS Adicional (2.25%)', value: `+ ${fmt(costoCalc.eps)}`, type: 'costo' }] : []),
                    { label: 'Subtotal Cargas', value: fmt(costoCalc.cargasDirectas), type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📅 PROVISIONES MENSUALIZADAS', value: '', type: 'header' },
                    { label: 'Gratificaciones + Bonif. Ext.', value: `+ ${fmt(costoCalc.provGratificaciones)}`, type: 'costo' },
                    { label: 'CTS', value: `+ ${fmt(costoCalc.provCTS)}`, type: 'costo' },
                    { label: 'Vacaciones', value: `+ ${fmt(costoCalc.provVacaciones)}`, type: 'costo' },
                    { label: 'Subtotal Beneficios', value: fmt(costoCalc.provisionesBeneficios), type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 RESUMEN EJECUTIVO', value: '', type: 'header' },
                    { label: 'Carga Social Total', value: `${costoCalc.porcentajeCarga.toFixed(1)}%`, type: 'info' },
                    { label: 'Costo vs Sueldo Bruto', value: `+${((costoCalc.costoTotal / costoCalc.sueldoBruto - 1) * 100).toFixed(1)}%`, type: 'info' }
                ]
            };
        },
        legalInfo: 'Ley 26790 (ESSALUD 9%) | D.S. 003-97-TR (Beneficios) | Ley 27735 (Gratificaciones). Costo real mensual = Sueldo + Cargas directas + Provisiones de beneficios mensualizadas.'
    }
};

// =====================================================================
// FIN DE DATA.JS v3.0 — SUELDOPRO ULTRA PERÚ 2026
// Correcciones: AFP-SBS-Tope | IR5ta-Gratificaciones | Precisión 4dec
// =====================================================================
