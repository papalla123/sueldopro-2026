'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - DATA ENGINE (100% FUNCIONAL)
// =====================================================================

// ===== HELPER PARA REDONDEO PRECISO =====
window.round2 = function(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

// ===== PENTAGON LINKS =====
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
        description: 'Análisis de Márgenes'
    },
    leadnexus: { 
        name: 'LeadNexus AI', 
        url: 'https://lead-target.vercel.app', 
        icon: '🎯', 
        color: 'from-violet-500 to-fuchsia-500',
        description: 'Gestión de Leads'
    },
    liquidezforce: { 
        name: 'Liquidez Force', 
        url: 'https://liquidez-force.vercel.app', 
        icon: '💰', 
        color: 'from-yellow-500 to-orange-500',
        description: 'Flujo de Caja'
    },
    wealth: { 
        name: 'Wealth Armor AI', 
        url: 'https://wealth-armor-ai.vercel.app', 
        icon: '🛡️', 
        color: 'from-emerald-500 to-green-600',
        description: 'Planificación Financiera'
    }
};

// ===== CONSTANTES PERÚ 2026 =====
window.PERU_DATA = {
    minWage: 1075,
    asignacionFamiliar: 107.50,
    sis: 0.0170,
    
    afp: {
        integra: { nombre: 'AFP Integra', aporteFondo: 0.10, comisionFlujo: 0.0082, comisionMixta: 0.0047, comisionMixtaSaldo: 1.25 },
        prima: { nombre: 'AFP Prima', aporteFondo: 0.10, comisionFlujo: 0.0160, comisionMixta: 0.0038, comisionMixtaSaldo: 1.25 },
        profuturo: { nombre: 'AFP Profuturo', aporteFondo: 0.10, comisionFlujo: 0.0169, comisionMixta: 0.0047, comisionMixtaSaldo: 1.20 },
        habitat: { nombre: 'AFP Habitat', aporteFondo: 0.10, comisionFlujo: 0.0147, comisionMixta: 0.0047, comisionMixtaSaldo: 1.25 }
    },
    
    onp: 0.13,
    topeAFP: 13733.34,
    
    rentaQuinta: {
        uit: 5150,
        tramos: [
            { desde: 0, hasta: 5, tasa: 0.08 },
            { desde: 5, hasta: 20, tasa: 0.14 },
            { desde: 20, hasta: 35, tasa: 0.17 },
            { desde: 35, hasta: 45, tasa: 0.20 },
            { desde: 45, hasta: null, tasa: 0.30 }
        ],
        deduccion: 7
    },
    
    gratificaciones: { meses: 2, bonifEssalud: 0.09, bonifEPS: 0.0675 },
    
    empleador: {
        essalud: 0.09,
        vidaLey: 0.0053,
        sctr: { minimo: 0.0053, medio: 0.0071, alto: 0.0118 },
        senati: 0.0075,
        eps: 0.0225
    }
};

// ===== REGÍMENES =====
window.REGIMENES_PERU = {
    general: {
        id: 'general', nombre: 'Régimen General', icon: '🏢',
        descripcion: 'Todos los beneficios laborales',
        gratificaciones: true, gratificacionesFactor: 1.0,
        cts: true, ctsFactor: 1.0, vacaciones: 30,
        asignacionFamiliar: true, bonifEssalud: 0.09
    },
    pequena: {
        id: 'pequena', nombre: 'Pequeña Empresa', icon: '🏪',
        descripcion: '1-100 trabajadores. Beneficios al 50%',
        gratificaciones: true, gratificacionesFactor: 0.5,
        cts: true, ctsFactor: 0.5, vacaciones: 15,
        asignacionFamiliar: true, bonifEssalud: 0.0
    },
    micro: {
        id: 'micro', nombre: 'Microempresa', icon: '🏠',
        descripcion: '1-10 trabajadores. Sin gratif/CTS',
        gratificaciones: false, gratificacionesFactor: 0,
        cts: false, ctsFactor: 0, vacaciones: 15,
        asignacionFamiliar: false, bonifEssalud: 0.0
    }
};

// =====================================================================
// FUNCIONES CORE
// =====================================================================

window.calcularBaseRemunerativa = function(salarioBruto, tieneHijos, regimen) {
    const af = (tieneHijos && regimen.asignacionFamiliar) ? PERU_DATA.asignacionFamiliar : 0;
    return round2(salarioBruto + af);
};

window.calcularAFP = function(baseRemunerativa, afpNombre, tipoComision, saldoAcum) {
    const afp = PERU_DATA.afp[afpNombre];
    if (!afp) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
    const base = Math.min(baseRemunerativa, PERU_DATA.topeAFP);
    const aporte = round2(base * afp.aporteFondo);
    const seguro = round2(base * PERU_DATA.sis);
    
    let comision = 0;
    if (tipoComision === 'flujo') {
        comision = round2(base * afp.comisionFlujo);
    } else if (tipoComision === 'mixta') {
        comision = round2(base * afp.comisionMixta + (saldoAcum * afp.comisionMixtaSaldo) / 12);
    }
    
    return { aporte, seguro, comision, total: round2(aporte + seguro + comision) };
};

window.calcularImpuesto5ta = function(baseRemunerativa, regimen) {
    const ingresoMensual = baseRemunerativa;
    const gratifMensual = regimen.gratificaciones ? baseRemunerativa * regimen.gratificacionesFactor : 0;
    const dosGratif = gratifMensual * PERU_DATA.gratificaciones.meses;
    const ingresoAnual = (ingresoMensual * 12) + dosGratif;
    
    const uit = PERU_DATA.rentaQuinta.uit;
    const deduccion = PERU_DATA.rentaQuinta.deduccion * uit;
    const baseImponible = Math.max(0, ingresoAnual - deduccion);
    
    let impuestoAnual = 0;
    PERU_DATA.rentaQuinta.tramos.forEach(tramo => {
        const limInf = tramo.desde * uit;
        const limSup = tramo.hasta ? tramo.hasta * uit : Infinity;
        if (baseImponible > limInf) {
            const imponible = Math.min(baseImponible, limSup) - limInf;
            if (imponible > 0) impuestoAnual += imponible * tramo.tasa;
        }
    });
    
    return round2(impuestoAnual / 12);
};

window.calcularSalarioNeto = function(salarioBruto, regimen, opts) {
    opts = opts || {};
    const tieneHijos = opts.tieneHijos || false;
    const sistemaPension = opts.sistemaPension || 'afp';
    const afpNombre = opts.afpNombre || 'integra';
    const tipoComisionAFP = opts.tipoComisionAFP || 'flujo';
    const saldoAFP = opts.saldoAFP || 0;
    
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const asigFamiliar = baseRemunerativa - salarioBruto;
    
    let descuentoPension = 0;
    let detallesPension = {};
    
    if (sistemaPension === 'afp') {
        detallesPension = calcularAFP(baseRemunerativa, afpNombre, tipoComisionAFP, saldoAFP);
        descuentoPension = detallesPension.total;
    } else {
        descuentoPension = round2(baseRemunerativa * PERU_DATA.onp);
        detallesPension = { total: descuentoPension };
    }
    
    const impuesto5ta = calcularImpuesto5ta(baseRemunerativa, regimen);
    const salarioNeto = round2(baseRemunerativa - descuentoPension - impuesto5ta);
    
    return {
        salarioBruto: round2(salarioBruto),
        asigFamiliar: round2(asigFamiliar),
        baseRemunerativa: round2(baseRemunerativa),
        descuentoPension: round2(descuentoPension),
        impuesto5ta: round2(impuesto5ta),
        salarioNeto: round2(salarioNeto),
        detallesPension: detallesPension
    };
};

window.calcularSalarioBruto = function(netoDeseado, regimen, opts) {
    let bajo = netoDeseado * 0.5, alto = netoDeseado * 2.5;
    for (let i = 0; i < 100; i++) {
        const medio = (bajo + alto) / 2;
        const res = calcularSalarioNeto(medio, regimen, opts);
        const dif = res.salarioNeto - netoDeseado;
        if (Math.abs(dif) < 0.01) return round2(medio);
        if (dif > 0) alto = medio; else bajo = medio;
    }
    return round2((bajo + alto) / 2);
};

window.calcularHorasExtra = function(salarioBruto, tieneHijos, regimen, horasTotales, diasTrabajados, esNocturno) {
    const baseRem = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const valorHora = round2(baseRem / 240);
    
    const promHorasDia = horasTotales / diasTrabajados;
    const h25PorDia = Math.min(2, promHorasDia);
    const h35PorDia = Math.max(0, promHorasDia - 2);
    
    const totalH25 = round2(h25PorDia * diasTrabajados);
    const totalH35 = round2(h35PorDia * diasTrabajados);
    
    let vH25 = round2(valorHora * 1.25);
    let vH35 = round2(valorHora * 1.35);
    
    if (esNocturno) {
        const vHNocturno = round2((PERU_DATA.minWage * 1.35) / 240);
        vH25 = Math.max(vH25, vHNocturno);
        vH35 = Math.max(vH35, vHNocturno);
    }
    
    const p25 = round2(totalH25 * vH25);
    const p35 = round2(totalH35 * vH35);
    
    return {
        valorHora, totalHoras25: totalH25, totalHoras35: totalH35,
        valorHora25: vH25, valorHora35: vH35,
        pago25: p25, pago35: p35, totalPago: round2(p25 + p35)
    };
};

window.calcularCTS = function(salarioBruto, tieneHijos, regimen, mesesTrabajados) {
    if (!regimen.cts) return { ctsTotal: 0 };
    
    const baseRem = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const af = baseRem - salarioBruto;
    const gratifBase = regimen.gratificaciones ? baseRem * regimen.gratificacionesFactor : 0;
    const sextoGratif = round2(gratifBase / 6);
    const remComp = round2(salarioBruto + af + sextoGratif);
    const ctsBase = round2((remComp * mesesTrabajados) / 12);
    const ctsTotal = round2(ctsBase * regimen.ctsFactor);
    
    return { ctsTotal, remuneracionComputable: remComp, sextoGratificacion: sextoGratif };
};

window.calcularGratificaciones = function(salarioBruto, tieneHijos, regimen, tieneEPS) {
    if (!regimen.gratificaciones) return { gratificacionTotal: 0, bonifExtraordinaria: 0 };
    
    const baseRem = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const gratifBase = round2(baseRem * regimen.gratificacionesFactor);
    const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifEPS : regimen.bonifEssalud;
    const bonif = round2(gratifBase * tasaBonif);
    const totalPorGratif = round2(gratifBase + bonif);
    const gratifTotal = round2(totalPorGratif * PERU_DATA.gratificaciones.meses);
    
    return {
        gratificacionBase: gratifBase, bonifExtraordinaria: bonif,
        totalPorGratificacion: totalPorGratif, gratificacionTotal: gratifTotal, tasaBonif
    };
};

window.calcularLiquidacion = function(salarioBruto, tieneHijos, regimen, anios, tipoSalida, tieneEPS) {
    const baseRem = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const ctsCalc = calcularCTS(salarioBruto, tieneHijos, regimen, 6);
    const ctsPend = ctsCalc.ctsTotal;
    
    const diasVacPorcentaje = anios - Math.floor(anios);
    const diasVac = Math.floor(diasVacPorcentaje * regimen.vacaciones);
    const vacTruncas = round2((baseRem / 30) * diasVac);
    
    const mesesGratif = diasVacPorcentaje * 12;
    const gratifCalc = calcularGratificaciones(salarioBruto, tieneHijos, regimen, tieneEPS);
    const gratifTrunca = regimen.gratificaciones ? round2((gratifCalc.totalPorGratificacion * mesesGratif) / 6) : 0;
    
    let indem = 0;
    if (tipoSalida === 'despido') {
        const factor = regimen.id === 'general' ? 1.5 : (regimen.id === 'pequena' ? 0.5 : 0.25);
        indem = Math.min(round2(baseRem * factor * anios), round2(baseRem * 12));
    }
    
    const total = round2(ctsPend + vacTruncas + gratifTrunca + indem);
    
    return { ctsPendiente: ctsPend, vacacionesTruncas: vacTruncas, gratificacionTrunca: gratifTrunca, indemnizacion: indem, totalLiquidacion: total };
};

window.calcularCostoEmpleador = function(salarioBruto, tieneHijos, regimen, opts) {
    opts = opts || {};
    const baseRem = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    
    const essalud = round2(baseRem * PERU_DATA.empleador.essalud);
    const vidaLey = round2(baseRem * PERU_DATA.empleador.vidaLey);
    const sctr = round2(baseRem * PERU_DATA.empleador.sctr[opts.nivelRiesgo || 'medio']);
    const senati = opts.aplicaSenati ? round2(baseRem * PERU_DATA.empleador.senati) : 0;
    const eps = opts.tieneEPS ? round2(baseRem * PERU_DATA.empleador.eps) : 0;
    const cargasDir = round2(essalud + vidaLey + sctr + senati + eps);
    
    const gratifCalc = calcularGratificaciones(salarioBruto, tieneHijos, regimen, opts.tieneEPS);
    const provGratif = round2(gratifCalc.gratificacionTotal / 12);
    
    const ctsCalc = calcularCTS(salarioBruto, tieneHijos, regimen, 6);
    const provCTS = round2((ctsCalc.ctsTotal * 2) / 12);
    
    const provVac = round2((baseRem * (regimen.vacaciones / 30)) / 12);
    const provBenef = round2(provGratif + provCTS + provVac);
    
    const costoTotal = round2(baseRem + cargasDir + provBenef);
    const porcCarga = round2(((costoTotal - baseRem) / baseRem) * 100);
    
    return {
        sueldoBruto: round2(salarioBruto), asigFamiliar: round2(baseRem - salarioBruto), baseRemunerativa: baseRem,
        essalud, vidaLey, sctr, senati, eps, cargasDirectas: cargasDir,
        provGratificaciones: provGratif, provCTS, provVacaciones: provVac, provisionesBeneficios: provBenef,
        costoTotal, porcentajeCarga: porcCarga
    };
};

console.log('✅ DATA.JS CARGADO - Funciones Core Disponibles');
