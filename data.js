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

// =====================================================================
// CALCULADORAS CONFIGURATION
// =====================================================================

window.CALCULADORAS = {
    neto: {
        id: 'neto',
        icon: '💵',
        titulo: 'Salario Neto',
        desc: 'Calcula tu sueldo líquido después de descuentos AFP/ONP e impuestos',
        campos: [
            { id: 'neto-salary', label: 'Sueldo Bruto Mensual (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'neto-hijos', label: '¿Tienes hijos menores?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí (+ S/ 107.50)'}] },
            { id: 'neto-pension', label: 'Sistema de Pensiones', type: 'select', options: [{v:'afp',l:'AFP'},{v:'onp',l:'ONP (13%)'}] },
            { id: 'neto-afp', label: 'AFP', type: 'select', options: [{v:'integra',l:'Integra'},{v:'prima',l:'Prima'},{v:'profuturo',l:'Profuturo'},{v:'habitat',l:'Habitat'}], cond: 'neto-pension', condVal: 'afp' },
            { id: 'neto-comision', label: 'Tipo Comisión', type: 'select', options: [{v:'flujo',l:'Flujo'},{v:'mixta',l:'Mixta'}], cond: 'neto-pension', condVal: 'afp' }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['neto-salary']) || 0;
            const hijos = valores['neto-hijos'] === 'si';
            const pension = valores['neto-pension'] || 'afp';
            const afp = valores['neto-afp'] || 'integra';
            const comision = valores['neto-comision'] || 'flujo';
            const res = calcularSalarioNeto(sal, regimen, { tieneHijos: hijos, sistemaPension: pension, afpNombre: afp, tipoComisionAFP: comision });
            return {
                total: res.salarioNeto,
                detalles: [
                    { l: 'Sueldo Bruto', v: `S/ ${res.salarioBruto.toFixed(2)}` },
                    ...(res.asigFamiliar > 0 ? [{ l: '+ Asig. Familiar', v: `S/ ${res.asigFamiliar.toFixed(2)}`, color: 'emerald' }] : []),
                    { l: '= Base Remunerativa', v: `S/ ${res.baseRemunerativa.toFixed(2)}`, bold: true },
                    { l: '- Pensión', v: `S/ ${res.descuentoPension.toFixed(2)}`, color: 'red' },
                    { l: '- Renta 5ta', v: `S/ ${res.impuesto5ta.toFixed(2)}`, color: 'red' }
                ]
            };
        }
    },
    bruto: {
        id: 'bruto',
        icon: '🎯',
        titulo: 'Bruto desde Neto',
        desc: 'Calcula el bruto necesario para obtener un neto deseado',
        campos: [
            { id: 'bruto-neto', label: 'Neto Deseado (S/)', type: 'number', placeholder: '4000', min: 800 },
            { id: 'bruto-hijos', label: '¿Tienes hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] },
            { id: 'bruto-pension', label: 'Sistema Pensiones', type: 'select', options: [{v:'afp',l:'AFP'},{v:'onp',l:'ONP'}] }
        ],
        calcular: function(valores, regimen) {
            const neto = parseFloat(valores['bruto-neto']) || 0;
            const hijos = valores['bruto-hijos'] === 'si';
            const pension = valores['bruto-pension'] || 'afp';
            const bruto = calcularSalarioBruto(neto, regimen, { tieneHijos: hijos, sistemaPension: pension });
            const verif = calcularSalarioNeto(bruto, regimen, { tieneHijos: hijos, sistemaPension: pension });
            return {
                total: bruto,
                detalles: [
                    { l: 'Neto Deseado', v: `S/ ${neto.toFixed(2)}` },
                    { l: 'Bruto Necesario', v: `S/ ${bruto.toFixed(2)}`, bold: true, color: 'indigo' },
                    { l: 'Neto Real', v: `S/ ${verif.salarioNeto.toFixed(2)}` },
                    { l: 'Precisión', v: `± S/ ${Math.abs(verif.salarioNeto - neto).toFixed(2)}`, color: 'slate' }
                ]
            };
        }
    },
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        titulo: 'Horas Extra',
        desc: 'Calcula pago de horas extraordinarias (Regla Diaria: 2h/día al 25%, resto al 35%)',
        campos: [
            { id: 'he-salary', label: 'Sueldo Bruto (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'he-hijos', label: '¿Tienes hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] },
            { id: 'he-horas', label: 'Total Horas Extra Mes', type: 'number', placeholder: '20', min: 0 },
            { id: 'he-dias', label: 'Días con HE', type: 'number', placeholder: '10', min: 1 },
            { id: 'he-nocturno', label: 'Trabajo Nocturno', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí (+35%)'}] }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['he-salary']) || 0;
            const hijos = valores['he-hijos'] === 'si';
            const horas = parseFloat(valores['he-horas']) || 0;
            const dias = parseFloat(valores['he-dias']) || 1;
            const nocturno = valores['he-nocturno'] === 'si';
            const res = calcularHorasExtra(sal, hijos, regimen, horas, dias, nocturno);
            return {
                total: res.totalPago,
                detalles: [
                    { l: 'Valor Hora Base', v: `S/ ${res.valorHora.toFixed(2)}` },
                    { l: 'Horas al 25%', v: `${res.totalHoras25}h × S/ ${res.valorHora25.toFixed(2)}`, color: 'blue' },
                    { l: 'Pago 25%', v: `S/ ${res.pago25.toFixed(2)}`, color: 'blue' },
                    { l: 'Horas al 35%', v: `${res.totalHoras35}h × S/ ${res.valorHora35.toFixed(2)}`, color: 'purple' },
                    { l: 'Pago 35%', v: `S/ ${res.pago35.toFixed(2)}`, color: 'purple' }
                ]
            };
        }
    },
    cts: {
        id: 'cts',
        icon: '🏦',
        titulo: 'CTS',
        desc: 'Compensación por Tiempo de Servicios (Base = Sueldo + AF + 1/6 Gratif)',
        campos: [
            { id: 'cts-salary', label: 'Sueldo Bruto (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'cts-hijos', label: '¿Tienes hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] },
            { id: 'cts-meses', label: 'Meses trabajados (1-6)', type: 'number', placeholder: '6', min: 1, max: 6 }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['cts-salary']) || 0;
            const hijos = valores['cts-hijos'] === 'si';
            const meses = parseFloat(valores['cts-meses']) || 6;
            const res = calcularCTS(sal, hijos, regimen, meses);
            if (!regimen.cts) return { total: 0, detalles: [{ l: 'Sin CTS en ' + regimen.nombre, v: '-', color: 'slate' }] };
            return {
                total: res.ctsTotal,
                detalles: [
                    { l: 'Rem. Computable', v: `S/ ${res.remuneracionComputable.toFixed(2)}` },
                    { l: '(incluye 1/6 Gratif)', v: `S/ ${res.sextoGratificacion.toFixed(2)}`, color: 'emerald' },
                    { l: 'Meses', v: `${meses}` },
                    { l: 'Factor Régimen', v: `${(regimen.ctsFactor * 100)}%`, color: 'indigo' }
                ]
            };
        }
    },
    gratificaciones: {
        id: 'gratificaciones',
        icon: '🎁',
        titulo: 'Gratificaciones',
        desc: 'Gratificaciones Julio/Diciembre + Bonif. Extraordinaria 9% (Ley 30334)',
        campos: [
            { id: 'gratif-salary', label: 'Sueldo Bruto (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'gratif-hijos', label: '¿Tienes hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] },
            { id: 'gratif-eps', label: 'EPS Privada', type: 'select', options: [{v:'no',l:'No (9%)'},{v:'si',l:'Sí (6.75%)'}] }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['gratif-salary']) || 0;
            const hijos = valores['gratif-hijos'] === 'si';
            const eps = valores['gratif-eps'] === 'si';
            const res = calcularGratificaciones(sal, hijos, regimen, eps);
            if (!regimen.gratificaciones) return { total: 0, detalles: [{ l: 'Sin Gratif en ' + regimen.nombre, v: '-', color: 'slate' }] };
            return {
                total: res.gratificacionTotal,
                detalles: [
                    { l: 'Gratif Base', v: `S/ ${res.gratificacionBase.toFixed(2)}` },
                    { l: `+ Bonif ${(res.tasaBonif * 100).toFixed(2)}%`, v: `S/ ${res.bonifExtraordinaria.toFixed(2)}`, color: 'emerald' },
                    { l: '= Por Gratif', v: `S/ ${res.totalPorGratificacion.toFixed(2)}`, bold: true },
                    { l: 'Total Año (×2)', v: `S/ ${res.gratificacionTotal.toFixed(2)}`, bold: true, color: 'indigo' }
                ]
            };
        }
    },
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        titulo: 'Liquidación',
        desc: 'Cálculo de beneficios por cese laboral',
        campos: [
            { id: 'liq-salary', label: 'Sueldo Bruto (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'liq-hijos', label: '¿Tienes hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] },
            { id: 'liq-anios', label: 'Años trabajados', type: 'number', placeholder: '3.5', min: 0.1, step: 0.1 },
            { id: 'liq-tipo', label: 'Tipo Salida', type: 'select', options: [{v:'despido',l:'Despido'},{v:'renuncia',l:'Renuncia'}] }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['liq-salary']) || 0;
            const hijos = valores['liq-hijos'] === 'si';
            const anios = parseFloat(valores['liq-anios']) || 0;
            const tipo = valores['liq-tipo'] || 'despido';
            const res = calcularLiquidacion(sal, hijos, regimen, anios, tipo, false);
            return {
                total: res.totalLiquidacion,
                detalles: [
                    { l: 'CTS Pendiente', v: `S/ ${res.ctsPendiente.toFixed(2)}`, color: 'blue' },
                    { l: 'Vac. Truncas', v: `S/ ${res.vacacionesTruncas.toFixed(2)}`, color: 'blue' },
                    { l: 'Gratif. Trunca', v: `S/ ${res.gratificacionTrunca.toFixed(2)}`, color: 'blue' },
                    { l: 'Indemnización', v: `S/ ${res.indemnizacion.toFixed(2)}`, color: tipo === 'despido' ? 'orange' : 'slate' }
                ]
            };
        }
    },
    costo_empleador: {
        id: 'costo_empleador',
        icon: '🏢',
        titulo: 'Costo Empleador',
        desc: 'Costo total mensual para la empresa (sueldo + cargas + provisiones)',
        campos: [
            { id: 'emp-salary', label: 'Sueldo Bruto (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'emp-hijos', label: '¿Tiene hijos?', type: 'select', options: [{v:'no',l:'No'},{v:'si',l:'Sí'}] }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['emp-salary']) || 0;
            const hijos = valores['emp-hijos'] === 'si';
            const res = calcularCostoEmpleador(sal, hijos, regimen);
            return {
                total: res.costoTotal,
                detalles: [
                    { l: 'Sueldo Bruto', v: `S/ ${res.sueldoBruto.toFixed(2)}` },
                    ...(res.asigFamiliar > 0 ? [{ l: '+ Asig. Familiar', v: `S/ ${res.asigFamiliar.toFixed(2)}`, color: 'emerald' }] : []),
                    { l: '+ ESSALUD (9%)', v: `S/ ${res.essalud.toFixed(2)}`, color: 'orange' },
                    { l: '+ Vida Ley', v: `S/ ${res.vidaLey.toFixed(2)}`, color: 'orange' },
                    { l: '+ Gratif (prov)', v: `S/ ${res.provGratificaciones.toFixed(2)}`, color: 'purple' },
                    { l: '+ CTS (prov)', v: `S/ ${res.provCTS.toFixed(2)}`, color: 'purple' },
                    { l: '+ Vac (prov)', v: `S/ ${res.provVacaciones.toFixed(2)}`, color: 'purple' },
                    { l: 'Carga Social', v: `${res.porcentajeCarga.toFixed(1)}%`, bold: true, color: 'indigo' }
                ]
            };
        }
    },
    utilidades: {
        id: 'utilidades',
        icon: '💎',
        titulo: 'Utilidades',
        desc: 'Participación en utilidades de la empresa (50% días + 50% remuneración)',
        campos: [
            { id: 'util-salary', label: 'Sueldo Mensual (S/)', type: 'number', placeholder: '5000', min: 1075 },
            { id: 'util-dias', label: 'Días trabajados año', type: 'number', placeholder: '360', min: 1 },
            { id: 'util-utilidad', label: 'Utilidad Empresa (S/)', type: 'number', placeholder: '100000', min: 0 },
            { id: 'util-sector', label: 'Sector', type: 'select', options: [{v:'0.10',l:'Pesquera/Telecom (10%)'},{v:'0.08',l:'Minería/Comercio (8%)'},{v:'0.05',l:'Otras (5%)'}] }
        ],
        calcular: function(valores, regimen) {
            const sal = parseFloat(valores['util-salary']) || 0;
            const dias = parseFloat(valores['util-dias']) || 360;
            const util = parseFloat(valores['util-utilidad']) || 0;
            const sector = parseFloat(valores['util-sector']) || 0.05;
            const utilDist = util * sector;
            const porDias = (utilDist * 0.5 * dias) / 360;
            const porRem = (utilDist * 0.5 * sal * 12) / (sal * 12);
            const total = Math.min(porDias + porRem, sal * 18);
            return {
                total: round2(total),
                detalles: [
                    { l: 'Utilidad Empresa', v: `S/ ${util.toFixed(2)}` },
                    { l: `a distribuir (${(sector*100)}%)`, v: `S/ ${utilDist.toFixed(2)}`, color: 'blue' },
                    { l: '50% por días', v: `S/ ${porDias.toFixed(2)}`, color: 'emerald' },
                    { l: '50% por rem', v: `S/ ${porRem.toFixed(2)}`, color: 'emerald' },
                    { l: 'Tope', v: `18 sueldos`, color: 'slate' }
                ]
            };
        }
    }
};

console.log('✅ DATA.JS CARGADO - 8 Calculadoras Activas');
