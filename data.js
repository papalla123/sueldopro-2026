'use strict';

// ===== PENTAGON LINKS (Sincronización Global 2026) =====
window.PENTAGON_LINKS = {
    sueldopro: {
        name: 'SueldoPro Ultra',
        url: 'https://sueldopro-2026.vercel.app',
        icon: '💼',
        color: 'from-blue-500 to-cyan-500'
    },
    marginaxis: {
        name: 'MarginAxis Global',
        url: 'https://margin-master-pro-pboy.vercel.app',
        icon: '📊',
        color: 'from-green-500 to-emerald-500'
    },
    leadnexus: {
        name: 'LeadNexus AI',
        url: 'https://lead-target.vercel.app',
        icon: '🎯',
        color: 'from-violet-500 to-fuchsia-500'
    },
    liquidezforce: {
        name: 'Liquidez Force',
        url: 'https://liquidez-force.vercel.app',
        icon: '💰',
        color: 'from-yellow-500 to-orange-500'
    },
    wealth: {
        name: 'Wealth Armor AI',
        url: 'https://wealth-armor-ai.vercel.app',
        icon: '🛡️',
        color: 'from-emerald-500 to-green-600'
    }
};

// ===== PERÚ 2026 - DATOS LABORALES =====
window.PERU_DATA = {
    country: 'Perú',
    flag: '🇵🇪',
    currency: 'PEN',
    currencySymbol: 'S/',
    year: 2026,
    
    minWage: 1075,
    asignacionFamiliar: 107.50,
    sis: 0.0170,
    
    afp: {
        integra: {
            nombre: 'AFP Integra',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0082, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta', tasa: 0.0047, sobreSaldo: 1.25 }
            }
        },
        prima: {
            nombre: 'AFP Prima',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0160, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta', tasa: 0.0038, sobreSaldo: 1.25 }
            }
        },
        profuturo: {
            nombre: 'AFP Profuturo',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0169, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta', tasa: 0.0047, sobreSaldo: 1.20 }
            }
        },
        habitat: {
            nombre: 'AFP Habitat',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: { nombre: 'Comisión sobre Flujo', tasa: 0.0147, sobreSaldo: 0 },
                mixta: { nombre: 'Comisión Mixta', tasa: 0.0047, sobreSaldo: 1.25 }
            }
        }
    },
    
    onp: 0.13,
    
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
    
    topesSeguros: {
        afpMaxRemuneracion: 13733.34,
        essaludMaxRemuneracion: null
    },
    
    gratificaciones: {
        meses: 2,
        bonifExtEssalud: 0.09,
        bonifExtEPS: 0.0675
    },
    
    cts: {
        depositosMensuales: 2,
        sextoGratificacion: 1/6
    },
    
    vacaciones: {
        diasPorAnio: 30,
        provisionMensual: 1/12
    },
    
    empleador: {
        essalud: 0.09,
        vidaLey: 0.0053,
        sctr: { minimo: 0.0053, medio: 0.0071, alto: 0.0118 },
        senati: 0.0075,
        eps: 0.0225
    },
    
    utilidades: {
        sectores: {
            pesquera: { porcentaje: 0.10, nombre: 'Pesquera' },
            telecomunicaciones: { porcentaje: 0.10, nombre: 'Telecomunicaciones' },
            industrial: { porcentaje: 0.10, nombre: 'Industrial' },
            mineria: { porcentaje: 0.08, nombre: 'Minería' },
            comercio: { porcentaje: 0.08, nombre: 'Comercio al por mayor y menor' },
            restaurantes: { porcentaje: 0.08, nombre: 'Restaurantes' },
            transporte: { porcentaje: 0.05, nombre: 'Transporte' },
            otros: { porcentaje: 0.05, nombre: 'Otras actividades' }
        },
        distribucion: { porDias: 0.50, porRemuneracion: 0.50 },
        topeMaximo: 18
    }
};

// ===== REGÍMENES LABORALES PERÚ =====
window.REGIMENES_PERU = {
    general: {
        id: 'general',
        nombre: 'Régimen General',
        icon: '🏢',
        descripcion: 'Régimen completo - Todos los beneficios laborales',
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
        icon: '🪧',
        descripcion: 'Entre 1-100 trabajadores, ventas anuales hasta 1700 UIT',
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
        descripcion: 'Entre 1-10 trabajadores, ventas anuales hasta 150 UIT',
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

// ===== FUNCIONES AUXILIARES =====

window.calcularAsignacionFamiliar = function() {
    return PERU_DATA.minWage * 0.10;
};

window.calcularAFP = function(salario, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
    const salarioTope = Math.min(salario, PERU_DATA.topesSeguros.afpMaxRemuneracion);
    const aporte = salarioTope * afpData.aporteFondo;
    const seguro = salarioTope * PERU_DATA.sis;
    
    let comision = 0;
    const comisionData = afpData.tiposComision[tipoComision];
    
    if (tipoComision === 'flujo') {
        comision = salarioTope * comisionData.tasa;
    } else if (tipoComision === 'mixta') {
        comision = salarioTope * comisionData.tasa + (saldoAcumulado * comisionData.sobreSaldo) / 12;
    }
    
    return {
        aporte, seguro, comision,
        total: aporte + seguro + comision,
        salarioTope,
        topeAplicado: salario > PERU_DATA.topesSeguros.afpMaxRemuneracion
    };
};

window.calcularImpuesto5ta = function(salarioBruto, utilidadesMensual = 0) {
    const ingresoMensual = salarioBruto + utilidadesMensual;
    const ingresoAnual = ingresoMensual * 12;
    const uitAnual = PERU_DATA.rentaQuinta.uit;
    const deduccion = PERU_DATA.rentaQuinta.deduccion * uitAnual;
    const baseImponible = Math.max(0, ingresoAnual - deduccion);
    
    let impuestoAnual = 0;
    
    PERU_DATA.rentaQuinta.tramos.forEach(tramo => {
        const limiteInferior = tramo.desde * uitAnual;
        const limiteSuperior = tramo.hasta ? tramo.hasta * uitAnual : Infinity;
        
        if (baseImponible > limiteInferior) {
            const imponible = Math.min(baseImponible, limiteSuperior) - limiteInferior;
            if (imponible > 0) impuestoAnual += imponible * tramo.tasa;
        }
    });
    
    return {
        impuestoMensual: impuestoAnual / 12,
        impuestoAnual,
        baseImponible,
        ingresoAnual
    };
};

window.calcularGratificacion = function(salario, asigFamiliar, mesesTrabajados, regimen, tieneEPS = false) {
    if (!regimen.beneficios.gratificaciones) return { gratificacion: 0, bonifExt: 0, total: 0 };
    
    const remuneracionComputable = salario + asigFamiliar;
    const gratificacion = ((remuneracionComputable * mesesTrabajados) / 6) * regimen.beneficios.gratificacionesFactor;
    const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : PERU_DATA.gratificaciones.bonifExtEssalud;
    const bonifExt = gratificacion * tasaBonif;
    
    return { gratificacion, bonifExt, total: gratificacion + bonifExt };
};

window.calcularCTS = function(salario, asigFamiliar, mesesTrabajados, regimen) {
    if (!regimen.beneficios.cts) return { cts: 0, sextoGrati: 0, remComputable: 0 };
    
    const sextoGrati = salario * PERU_DATA.cts.sextoGratificacion;
    const remComputable = salario + asigFamiliar + sextoGrati;
    const cts = ((remComputable * mesesTrabajados) / 12) * regimen.beneficios.ctsFactor;
    
    return { cts, sextoGrati, remComputable };
};

window.calcularCostoEmpleador = function(salario, asigFamiliar, regimen, opciones = {}) {
    const { aplicaSenati = false, tieneEPS = false, nivelRiesgo = 'medio' } = opciones;
    const sueldoBruto = salario + asigFamiliar;
    
    const essalud = sueldoBruto * PERU_DATA.empleador.essalud;
    const vidaLey = sueldoBruto * PERU_DATA.empleador.vidaLey;
    const sctr = sueldoBruto * PERU_DATA.empleador.sctr[nivelRiesgo];
    const senati = aplicaSenati ? sueldoBruto * PERU_DATA.empleador.senati : 0;
    const eps = tieneEPS ? sueldoBruto * PERU_DATA.empleador.eps : 0;
    
    let provGratificaciones = 0;
    if (regimen.beneficios.gratificaciones) {
        const gratAnual = sueldoBruto * 2 * regimen.beneficios.gratificacionesFactor;
        const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : PERU_DATA.gratificaciones.bonifExtEssalud;
        provGratificaciones = (gratAnual + gratAnual * tasaBonif) / 12;
    }
    
    let provCTS = 0;
    if (regimen.beneficios.cts) {
        const sextoGrati = sueldoBruto * PERU_DATA.cts.sextoGratificacion;
        provCTS = (sueldoBruto + sextoGrati) * regimen.beneficios.ctsFactor;
    }
    
    const provVacaciones = sueldoBruto * PERU_DATA.vacaciones.provisionMensual;
    const cargasDirectas = essalud + vidaLey + sctr + senati + eps;
    const provisionesBeneficios = provGratificaciones + provCTS + provVacaciones;
    const costoTotal = sueldoBruto + cargasDirectas + provisionesBeneficios;
    
    return {
        sueldoBruto, essalud, vidaLey, sctr, senati, eps,
        cargasDirectas, provGratificaciones, provCTS, provVacaciones,
        provisionesBeneficios, costoTotal,
        porcentajeCarga: ((cargasDirectas + provisionesBeneficios) / sueldoBruto * 100)
    };
};

window.calcularUtilidades = function(salario, diasTrabajados, mesesTrabajados, rentaAnualEmpresa, sector, totalTrabajadores, regimen) {
    if (!regimen.beneficios.utilidades) return { total: 0, porDias: 0, porRemuneracion: 0 };
    
    const sectorData = PERU_DATA.utilidades.sectores[sector] || PERU_DATA.utilidades.sectores.otros;
    const utilidadDistribuir = rentaAnualEmpresa * sectorData.porcentaje;
    const montoPorDias = utilidadDistribuir * 0.5;
    const montoPorRemuneracion = utilidadDistribuir * 0.5;
    
    const partDias = (montoPorDias * diasTrabajados) / (totalTrabajadores * 360);
    const partRemuneracion = (montoPorRemuneracion * (salario * mesesTrabajados)) / (salario * 12 * totalTrabajadores);
    
    const total = Math.min(partDias + partRemuneracion, salario * PERU_DATA.utilidades.topeMaximo);
    
    return { total, porDias: partDias, porRemuneracion: partRemuneracion, sector: sectorData.nombre, porcentaje: sectorData.porcentaje };
};

// ===== CONFIGURACIONES DE CALCULADORAS =====
window.CALCULATOR_CONFIGS = {
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Sueldo Neto',
        description: 'Calcula tu sueldo líquido después de AFP/ONP y 5ta categoría',
        fields: [
            { id: 'neto-salary', label: 'Sueldo Bruto Mensual', type: 'number', inputmode: 'decimal', placeholder: '5000', min: PERU_DATA.minWage, help: 'Ingresa tu sueldo base sin asignación familiar' },
            { id: 'neto-pension-tipo', label: 'Sistema de Pensiones', type: 'select', options: [{ value: 'afp', label: 'AFP (Sistema Privado)' }, { value: 'onp', label: 'ONP (Sistema Nacional - 13%)' }] },
            { id: 'neto-afp', label: 'AFP', type: 'select', options: [{ value: 'integra', label: 'AFP Integra' }, { value: 'prima', label: 'AFP Prima' }, { value: 'profuturo', label: 'AFP Profuturo' }, { value: 'habitat', label: 'AFP Habitat' }], dependsOn: 'neto-pension-tipo', showWhen: 'afp' },
            { id: 'neto-comision-tipo', label: 'Tipo de Comisión AFP', type: 'select', options: [{ value: 'flujo', label: 'Sobre Flujo (remuneración)' }, { value: 'mixta', label: 'Mixta (flujo + saldo acumulado)' }], dependsOn: 'neto-pension-tipo', showWhen: 'afp' },
            { id: 'neto-saldo-afp', label: 'Saldo Acumulado AFP (opcional)', type: 'number', inputmode: 'decimal', placeholder: '50000', min: 0, step: 1000, help: 'Solo para comisión mixta', dependsOn: 'neto-comision-tipo', showWhen: 'mixta' },
            { id: 'neto-hijos', label: '¿Tiene hijos menores de 18 años?', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: `Sí (+ S/ ${calcularAsignacionFamiliar().toFixed(2)})` }] },
            { id: 'neto-utilidades', label: 'Utilidades Anuales Recibidas (opcional)', type: 'number', inputmode: 'decimal', placeholder: '0', min: 0, step: 100, help: 'Si recibiste utilidades' }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['neto-salary']) || 0;
            const pensionTipo = values['neto-pension-tipo'] || 'afp';
            const afpNombre = values['neto-afp'] || 'integra';
            const comisionTipo = values['neto-comision-tipo'] || 'flujo';
            const saldoAFP = parseFloat(values['neto-saldo-afp']) || 0;
            const tieneHijos = values['neto-hijos'] === 'si';
            const utilidades = parseFloat(values['neto-utilidades']) || 0;
            
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            const sueldoBruto = salary + asigFamiliar;
            const utilidadesMensual = utilidades / 12;
            const ingresoTotal = sueldoBruto + utilidadesMensual;
            
            let pensionTotal = 0, pensionDetalle = '', topeAplicado = false;
            let pensionAporte = 0, pensionSeguro = 0, pensionComision = 0;
            
            if (pensionTipo === 'onp') {
                pensionTotal = salary * PERU_DATA.onp;
                pensionDetalle = 'ONP (13%)';
            } else {
                const afpCalc = calcularAFP(salary, afpNombre, comisionTipo, saldoAFP);
                pensionAporte = afpCalc.aporte;
                pensionSeguro = afpCalc.seguro;
                pensionComision = afpCalc.comision;
                pensionTotal = afpCalc.total;
                topeAplicado = afpCalc.topeAplicado;
                pensionDetalle = PERU_DATA.afp[afpNombre].nombre;
            }
            
            const imp5ta = calcularImpuesto5ta(ingresoTotal, 0);
            const neto = ingresoTotal - pensionTotal - imp5ta.impuestoMensual;
            
            syncToLiquidezForce({ costoMensual: neto, tipo: 'sueldo_neto', fecha: new Date().toISOString() });
            
            const details = [
                { label: '💼 INGRESOS', value: '', type: 'header' },
                { label: 'Sueldo Base', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' }
            ];
            
            if (asigFamiliar > 0) details.push({ label: 'Asignación Familiar (10% SMV)', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' });
            if (utilidadesMensual > 0) details.push({ label: 'Utilidades (prorrateadas)', value: `+ S/ ${utilidadesMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' });
            
            details.push(
                { label: 'Ingreso Bruto Total', value: `S/ ${ingresoTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                { label: '', value: '', type: 'separator' },
                { label: '📉 DESCUENTOS', value: '', type: 'header' }
            );
            
            if (pensionTipo === 'onp') {
                details.push({ label: 'ONP (13%)', value: `- S/ ${pensionTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' });
            } else {
                details.push(
                    { label: `${pensionDetalle} - Aporte (10%)`, value: `- S/ ${pensionAporte.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    { label: `SIS - Seguro (${(PERU_DATA.sis * 100).toFixed(2)}%)`, value: `- S/ ${pensionSeguro.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    { label: `Comisión ${comisionTipo === 'flujo' ? 'Flujo' : 'Mixta'}`, value: `- S/ ${pensionComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' }
                );
            }
            
            details.push({ label: 'Impuesto 5ta Categoría', value: `- S/ ${imp5ta.impuestoMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' });
            if (topeAplicado) details.push({ label: '⚠️ Tope AFP aplicado', value: `S/ ${PERU_DATA.topesSeguros.afpMaxRemuneracion.toLocaleString('es-PE')}`, type: 'warning' });
            
            return { total: neto, details };
        },
        legalInfo: 'Cálculo según D.S. N° 004-2019-TR y TUO Ley del Impuesto a la Renta. SIS 2026: 1.70%. AFP con comisiones según SBS. 5ta categoría progresiva con 7 UIT deducibles.'
    }
};