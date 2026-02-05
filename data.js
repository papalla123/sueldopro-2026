'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - DATA ENGINE
// Pentágono Financiero - Motor de Datos y Cálculos Laborales
// Legislación Peruana 2026 - UIT Proyectada: S/ 5,150
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
    // Información General
    country: 'Perú',
    flag: '🇵🇪',
    currency: 'PEN',
    currencySymbol: 'S/',
    year: 2026,
    
    // Salarios y Asignaciones Básicas
    minWage: 1075,                    // RMV 2026 (D.S. 003-2024-TR proyectado)
    asignacionFamiliar: 107.50,       // 10% de RMV
    sis: 0.0170,                      // Seguro de Invalidez y Sobrevivencia (1.70%)
    
    // Sistema Privado de Pensiones (AFP) - Actualizado 2026
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
    
    // Sistema Nacional de Pensiones (ONP)
    onp: 0.13,                        // 13% de descuento
    
    // Impuesto a la Renta de Quinta Categoría
    rentaQuinta: {
        uit: 5150,                    // UIT 2026 Proyectada
        tramos: [
            { desde: 0, hasta: 5, tasa: 0.08 },      // Hasta 5 UIT: 8%
            { desde: 5, hasta: 20, tasa: 0.14 },     // De 5 a 20 UIT: 14%
            { desde: 20, hasta: 35, tasa: 0.17 },    // De 20 a 35 UIT: 17%
            { desde: 35, hasta: 45, tasa: 0.20 },    // De 35 a 45 UIT: 20%
            { desde: 45, hasta: null, tasa: 0.30 }   // Más de 45 UIT: 30%
        ],
        deduccion: 7                  // 7 UIT de deducción anual
    },
    
    // Topes Máximos para Seguros
    topesSeguros: {
        afpMaxRemuneracion: 13733.34, // Tope AFP (aprox. 13.5 RMV)
        essaludMaxRemuneracion: null  // Sin tope
    },
    
    // Gratificaciones (Julio y Diciembre)
    gratificaciones: {
        meses: 2,                     // 2 gratificaciones al año
        bonifExtEssalud: 0.09,        // 9% sobre gratificación para ESSALUD
        bonifExtEPS: 0.0675           // 6.75% si tiene EPS
    },
    
    // Compensación por Tiempo de Servicios (CTS)
    cts: {
        depositosMensuales: 2,        // Mayo y Noviembre
        sextoGratificacion: 1/6       // 1/6 de gratificación promedio
    },
    
    // Vacaciones
    vacaciones: {
        diasPorAnio: 30,              // 30 días calendario por año
        provisionMensual: 1/12        // Provisión mensual
    },
    
    // Aportes del Empleador
    empleador: {
        essalud: 0.09,                // 9% ESSALUD
        vidaLey: 0.0053,              // 0.53% Seguro de Vida Ley
        sctr: {
            minimo: 0.0053,           // 0.53% Riesgo bajo (oficinas)
            medio: 0.0071,            // 0.71% Riesgo medio (comercio)
            alto: 0.0118              // 1.18% Riesgo alto (construcción/minería)
        },
        senati: 0.0075,               // 0.75% SENATI (solo industria/construcción)
        eps: 0.0225                   // 2.25% EPS adicional (si aplica)
    },
    
    // Participación en Utilidades (D.Leg. 892)
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
        distribucion: {
            porDias: roundToCents(0.50),            // 50% por días trabajados
            porRemuneracion: roundToCents(0.50     // 50% por remuneración
        )},
        topeMaximo: 18                // Tope: 18 remuneraciones mensuales
    }
};

// ===== REGÍMENES LABORALES PERUANOS =====
window.REGIMENES_PERU = {
    general: {
        id: 'general',
        nombre: 'Régimen General',
        icon: '🏢',
        descripcion: 'Régimen completo - Todos los beneficios laborales según Ley de Productividad y Competitividad Laboral (D.S. 003-97-TR)',
        limites: {
            trabajadores: null,       // Sin límite
            ventasAnuales: null       // Sin límite
        },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 1.0,    // 100% (2 sueldos completos)
            cts: true,
            ctsFactor: 1.0,                // 100%
            vacaciones: 30,                // 30 días
            vacacionesFactor: 1.0,
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 1.5             // 1.5 sueldos por año
        },
        essaludBonif: 0.09                 // 9% bonificación extraordinaria
    },
    pequena: {
        id: 'pequena',
        nombre: 'Pequeña Empresa',
        icon: '🏪',
        descripcion: 'Entre 1-100 trabajadores, ventas anuales hasta 1700 UIT. Beneficios reducidos según Ley MYPE (D.S. 013-2013-PRODUCE)',
        limites: {
            trabajadores: 100,
            ventasAnuales: 1700           // 1700 UIT
        },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 0.5,    // 50% (medio sueldo por gratificación)
            cts: true,
            ctsFactor: 0.5,                // 50%
            vacaciones: 15,                // 15 días
            vacacionesFactor: 0.5,
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 0.5             // 0.5 sueldos por año (hasta 6 meses)
        },
        essaludBonif: 0.0                  // Sin bonificación extraordinaria
    },
    micro: {
        id: 'micro',
        nombre: 'Microempresa',
        icon: '🏠',
        descripcion: 'Entre 1-10 trabajadores, ventas anuales hasta 150 UIT. Régimen simplificado según Ley MYPE',
        limites: {
            trabajadores: 10,
            ventasAnuales: 150            // 150 UIT
        },
        beneficios: {
            gratificaciones: false,
            gratificacionesFactor: 0,
            cts: false,
            ctsFactor: 0,
            vacaciones: 15,               // 15 días
            vacacionesFactor: 0.5,
            asignacionFamiliar: false,
            utilidades: false,
            indemnizacion: 0.25           // 0.25 sueldos por año (hasta 3 meses)
        },
        essaludBonif: 0.0
    }
};

// =====================================================================
// FUNCIONES AUXILIARES DE CÁLCULO - RE-ENGINEERED
// =====================================================================


/**
 * Redondea a 2 decimales con precisión de centavos
 */
window.roundToCents = function(value) {
    return Math.round(value * 100) / 100;
};



/**
 * Calcula la Asignación Familiar
 * @returns {number} Monto de asignación familiar (10% de RMV)
 */
window.calcularAsignacionFamiliar = function() {
    return roundToCents(PERU_DATA.minWage * 0.10);
};

/**
 * Calcula los descuentos de AFP (Sistema Privado de Pensiones) - MEJORADO
 * @param {number} salario - Salario bruto mensual
 * @param {string} afpNombre - Nombre de la AFP (integra, prima, profuturo, habitat)
 * @param {string} tipoComision - Tipo de comisión (flujo o mixta)
 * @param {number} saldoAcumulado - Saldo acumulado en AFP (para comisión mixta)
 * @returns {object} Objeto con aporte, seguro, comisión y total (DESGLOSADO)
 */
window.calcularAFP = function(salario, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
    // Aplicar tope máximo AFP
    const salarioTope = Math.min(salario, PERU_DATA.topesSeguros.afpMaxRemuneracion);
    
    // 1. APORTE OBLIGATORIO AL FONDO (10%)
    const aporte = roundToCents(salarioTope * afpData.aporteFondo);
    
    // 2. PRIMA DE SEGURO - Seguro de Invalidez y Sobrevivencia SIS (1.70%)
    const seguro = roundToCents(salarioTope * PERU_DATA.sis);
    
    // 3. COMISIÓN DE LA AFP (Variable según AFP y tipo)
    let comision = 0;
    const comisionData = afpData.tiposComision[tipoComision];
    
    if (tipoComision === 'flujo') {
        comision = roundToCents(salarioTope * comisionData.tasa);
    } else if (tipoComision === 'mixta') {
        const comisionFlujo = salarioTope * comisionData.tasa;
        const comisionSaldo = (saldoAcumulado * comisionData.sobreSaldo) / 12;
        comision = roundToCents(comisionFlujo + comisionSaldo);
    }
    
    return {
        aporte,           // Aporte Obligatorio 10%
        seguro,           // Prima de Seguro (SIS) 1.70%
        comision,         // Comisión AFP (variable)
        total: roundToCents(aporte + seguro + comision),
        salarioTope,
        topeAplicado: salario > PERU_DATA.topesSeguros.afpMaxRemuneracion
    };
};
    
    // Aplicar tope máximo AFP
    const salarioTope = Math.min(salario, PERU_DATA.topesSeguros.afpMaxRemuneracion);
    
    // Aporte obligatorio al fondo (10%)
    const aporte = salarioTope * afpData.aporteFondo;
    
    // Seguro de Invalidez y Sobrevivencia (1.70%)
    const seguro = salarioTope * PERU_DATA.sis;
    
    // Comisión de la AFP
    let comision = 0;
    const comisionData = afpData.tiposComision[tipoComision];
    
    if (tipoComision === 'flujo') {
        comision = salarioTope * comisionData.tasa;
    } else if (tipoComision === 'mixta') {
        comision = salarioTope * comisionData.tasa + (saldoAcumulado * comisionData.sobreSaldo) / 12;
    }
    
    return {
        aporte,
        seguro,
        comision,
        total: aporte + seguro + comision,
        salarioTope,
        topeAplicado: salario > PERU_DATA.topesSeguros.afpMaxRemuneracion
    };
};

/**
 * Calcula el Impuesto a la Renta de Quinta Categoría - MEJORADO
 * Incluye gratificaciones proyectadas en el ingreso anual
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} gratificacionMensual - Gratificación mensualizada (opcional)
 * @param {number} utilidadesMensual - Utilidades mensualizadas (opcional)
 * @returns {number} Impuesto mensual a retener
 */
window.calcularImpuesto5ta = function(salarioBruto, gratificacionMensual = 0, utilidadesMensual = 0) {
    // Ingreso mensual total (incluye proyección de gratificaciones)
    const ingresoMensual = salarioBruto + gratificacionMensual + utilidadesMensual;
    
    // Proyección anual (12 meses de sueldo + gratificaciones)
    const ingresoAnual = ingresoMensual * 12;
    const uitAnual = PERU_DATA.rentaQuinta.uit;
    
    // Deducción de 7 UIT
    const deduccion = PERU_DATA.rentaQuinta.deduccion * uitAnual;
    const baseImponible = Math.max(0, ingresoAnual - deduccion);
    
    // Cálculo por tramos
    let impuestoAnual = 0;
    PERU_DATA.rentaQuinta.tramos.forEach(tramo => {
        const limiteInferior = tramo.desde * uitAnual;
        const limiteSuperior = tramo.hasta ? tramo.hasta * uitAnual : Infinity;
        
        if (baseImponible > limiteInferior) {
            const imponible = Math.min(baseImponible, limiteSuperior) - limiteInferior;
            if (imponible > 0) {
                impuestoAnual += imponible * tramo.tasa;
            }
        }
    });
    
    // Mensualizar el impuesto
    return roundToCents(impuestoAnual / 12);
};

/**
 * Calcula el Salario Neto a partir del Bruto - MEJORADO
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones de cálculo
 * @returns {object} Objeto con salario neto y detalles desglosados
 */
window.calcularSalarioNeto = function(salarioBruto, regimen, opciones = {}) {
    const {
        tieneHijos = false,
        sistemaPension = 'afp',
        afpNombre = 'integra',
        tipoComisionAFP = 'flujo',
        saldoAFP = 0,
        incluirGratificacionesEnRenta = true
    } = opciones;
    
    // Asignación Familiar
    const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar 
        ? calcularAsignacionFamiliar() 
        : 0;
    
    const salarioTotal = roundToCents(salarioBruto + asigFamiliar);
    
    // Gratificaciones proyectadas para Renta 5ta (2 al año)
    let gratificacionMensualizada = 0;
    if (incluirGratificacionesEnRenta && regimen.beneficios.gratificaciones) {
        const gratifBase = (salarioBruto + asigFamiliar) * regimen.beneficios.gratificacionesFactor;
        gratificacionMensualizada = roundToCents((gratifBase * 2) / 12);
    }
    
    // Descuento por pensiones (DESGLOSADO)
    let descuentoPension = 0;
    let detallesPension = {};
    
    if (sistemaPension === 'afp') {
        detallesPension = calcularAFP(salarioTotal, afpNombre, tipoComisionAFP, saldoAFP);
        descuentoPension = detallesPension.total;
    } else if (sistemaPension === 'onp') {
        descuentoPension = roundToCents(salarioTotal * PERU_DATA.onp);
        detallesPension = { total: descuentoPension, porcentaje: PERU_DATA.onp };
    }
    
    // Impuesto a la Renta (incluye gratificaciones proyectadas)
    const impuesto5ta = calcularImpuesto5ta(salarioTotal, gratificacionMensualizada);
    
    // Salario Neto
    const salarioNeto = roundToCents(salarioTotal - descuentoPension - impuesto5ta);
    
    return {
        salarioBruto: roundToCents(salarioBruto),
        asigFamiliar: roundToCents(asigFamiliar),
        salarioTotal: roundToCents(salarioTotal),
        gratificacionMensualizada: roundToCents(gratificacionMensualizada),
        descuentoPension: roundToCents(descuentoPension),
        impuesto5ta: roundToCents(impuesto5ta),
        salarioNeto: roundToCents(salarioNeto),
        detallesPension
    };
};


/**
 * Calcula el Salario Bruto necesario para obtener un Neto deseado
 * @param {number} salarioNetoDeseado - Salario neto objetivo
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones de cálculo
 * @returns {number} Salario bruto necesario
 */
window.calcularSalarioBruto = function(salarioNetoDeseado, regimen, opciones = {}) {
    // Método iterativo para calcular bruto desde neto
    let brutoBajo = salarioNetoDeseado;
    let brutoAlto = salarioNetoDeseado * 2;
    let iteraciones = 0;
    const maxIteraciones = 50;
    const tolerancia = 0.01;
    
    while (iteraciones < maxIteraciones) {
        const brutoMedio = (brutoBajo + brutoAlto) / 2;
        const resultado = calcularSalarioNeto(brutoMedio, regimen, opciones);
        const diferencia = resultado.salarioNeto - salarioNetoDeseado;
        
        if (Math.abs(diferencia) < tolerancia) {
            return brutoMedio;
        }
        
        if (diferencia > 0) {
            brutoAlto = brutoMedio;
        } else {
            brutoBajo = brutoMedio;
        }
        
        iteraciones++;
    }
    
    return roundToCents((brutoBajo + brutoAlto) / 2);
};

/**
 * Calcula la CTS (Compensación por Tiempo de Servicios) - MEJORADO
 * Permite ingresar 1/6 de gratificación manualmente
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @param {number} mesesTrabajados - Meses trabajados en el semestre
 * @param {number} diasTrabajados - Días adicionales trabajados
 * @param {number} sextoGratManual - 1/6 de última gratificación (manual, opcional)
 * @returns {object} Objeto con CTS y detalles
 */
window.calcularCTS = function(salarioBruto, asigFamiliar, regimen, mesesTrabajados = 6, diasTrabajados = 0, sextoGratManual = null) {
    if (!regimen.beneficios.cts) {
        return { ctsTotal: 0, detalles: {} };
    }
    
    // Remuneración computable (salario + 1/6 de gratificación + asig. familiar)
    let sextoGratificacion = 0;
    
    if (sextoGratManual !== null && sextoGratManual > 0) {
        // Usuario ingresó manualmente el 1/6
        sextoGratificacion = roundToCents(sextoGratManual);
    } else {
        // Calcular automáticamente
        sextoGratificacion = roundToCents(
            salarioBruto * regimen.beneficios.gratificacionesFactor * PERU_DATA.cts.sextoGratificacion
        );
    }
    
    const remuneracionComputable = roundToCents(salarioBruto + sextoGratificacion + asigFamiliar);
    
    // CTS = (Rem. Computable × (Meses + Días/30) / 12) × Factor del régimen
    const tiempoEnMeses = mesesTrabajados + (diasTrabajados / 30);
    const ctsBase = (remuneracionComputable * tiempoEnMeses) / 12;
    const ctsTotal = roundToCents(ctsBase * regimen.beneficios.ctsFactor);
    
    return {
        ctsTotal,
        detalles: {
            remuneracionComputable,
            sextoGratificacion,
            mesesTrabajados,
            diasTrabajados,
            tiempoEnMeses: roundToCents(tiempoEnMeses),
            factor: regimen.beneficios.ctsFactor
        }
    };
};


/**
 * Calcula las Gratificaciones - MEJORADO
 * Calcula meses y DÍAS truncos + Bonificación Extraordinaria según EPS/EsSalud
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @param {number} mesesTrabajados - Meses trabajados en el semestre (0-6)
 * @param {number} diasTrabajados - Días adicionales trabajados (0-30)
 * @param {boolean} tieneEPS - Si tiene EPS (6.75%) o EsSalud (9%)
 * @returns {object} Objeto con gratificaciones y bonificaciones
 */
window.calcularGratificaciones = function(salarioBruto, asigFamiliar, regimen, mesesTrabajados = 6, diasTrabajados = 0, tieneEPS = false) {
    if (!regimen.beneficios.gratificaciones) {
        return { gratificacionTotal: 0, bonifEssalud: 0, totalPorGratificacion: 0 };
    }
    
    // Monto de gratificación base (salario + asig. familiar) × factor
    const gratificacionCompleta = (salarioBruto + asigFamiliar) * regimen.beneficios.gratificacionesFactor;
    
    // Calcular proporción trunca (meses + días/30) / 6
    const proporcionTrunca = (mesesTrabajados + (diasTrabajados / 30)) / 6;
    const gratificacionBase = roundToCents(gratificacionCompleta * proporcionTrunca);
    
    // Bonificación extraordinaria (9% EsSalud o 6.75% EPS)
    const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : regimen.essaludBonif;
    const bonifEssalud = roundToCents(gratificacionBase * tasaBonif);
    
    // Total por gratificación
    const totalPorGratificacion = roundToCents(gratificacionBase + bonifEssalud);
    
    // Total anual (2 gratificaciones si corresponde)
    const gratificacionTotal = roundToCents(totalPorGratificacion * 2);
    
    return {
        gratificacionBase,
        bonifEssalud,
        totalPorGratificacion,
        gratificacionTotal,
        proporcionTrunca: roundToCents(proporcionTrunca),
        mesesTrabajados,
        diasTrabajados
    };
};


/**
 * Calcula la Liquidación por Cese - MEJORADO
 * Función unificada: CTS Trunca + Gratificación Trunca + Vacaciones Truncas
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @param {number} aniosTrabajados - Años completos trabajados
 * @param {number} mesesTrabajados - Meses adicionales trabajados
 * @param {number} diasTrabajados - Días adicionales trabajados
 * @param {string} tipoSalida - Tipo de salida (despido, renuncia, mutuo)
 * @param {number} sextoGratManual - 1/6 de gratificación manual para CTS
 * @param {object} opciones - Sistema de pensiones para descuentos
 * @returns {object} Objeto con liquidación completa
 */
window.calcularLiquidacion = function(
    salarioBruto, 
    asigFamiliar, 
    regimen, 
    aniosTrabajados = 0, 
    mesesTrabajados = 0, 
    diasTrabajados = 0,
    tipoSalida = 'despido',
    sextoGratManual = null,
    opciones = {}
) {
    const {
        sistemaPension = 'afp',
        afpNombre = 'integra',
        tipoComisionAFP = 'flujo',
        saldoAFP = 0
    } = opciones;
    
    // 1. CTS TRUNCA (últimos meses/días del semestre)
    let ctsTrunca = 0;
    if (regimen.beneficios.cts) {
        const ctsCalc = calcularCTS(salarioBruto, asigFamiliar, regimen, mesesTrabajados, diasTrabajados, sextoGratManual);
        ctsTrunca = ctsCalc.ctsTotal;
    }
    
    // 2. GRATIFICACIÓN TRUNCA (meses/días del semestre)
    let gratificacionTrunca = 0;
    if (regimen.beneficios.gratificaciones) {
        const gratifCalc = calcularGratificaciones(salarioBruto, asigFamiliar, regimen, mesesTrabajados, diasTrabajados);
        gratificacionTrunca = gratifCalc.totalPorGratificacion;
    }
    
    // 3. VACACIONES TRUNCAS (proporcional a tiempo trabajado)
    const tiempoTotalAnios = aniosTrabajados + (mesesTrabajados / 12) + (diasTrabajados / 360);
    const diasVacacionesAnuales = regimen.beneficios.vacaciones;
    const diasVacacionesTotales = tiempoTotalAnios * diasVacacionesAnuales;
    const vacacionesTruncas = roundToCents((salarioBruto / 30) * diasVacacionesTotales);
    
    // 4. INDEMNIZACIÓN POR DESPIDO ARBITRARIO (si aplica)
    let indemnizacion = 0;
    if (tipoSalida === 'despido') {
        const aniosTotales = aniosTrabajados + (mesesTrabajados / 12);
        indemnizacion = roundToCents(salarioBruto * regimen.beneficios.indemnizacion * aniosTotales);
        // Tope: 12 sueldos
        indemnizacion = Math.min(indemnizacion, salarioBruto * 12);
    }
    
    // 5. DESCUENTOS APLICABLES
    // Los descuentos AFP/ONP se aplican SOLO a: Gratificación Trunca
    // NO se aplican a: CTS Trunca, Vacaciones Truncas, Indemnización
    
    let descuentoPensionGratif = 0;
    let descuentoRentaGratif = 0;
    
    if (gratificacionTrunca > 0) {
        if (sistemaPension === 'afp') {
            const afpCalc = calcularAFP(gratificacionTrunca, afpNombre, tipoComisionAFP, saldoAFP);
            descuentoPensionGratif = afpCalc.total;
        } else if (sistemaPension === 'onp') {
            descuentoPensionGratif = roundToCents(gratificacionTrunca * PERU_DATA.onp);
        }
        // Renta 5ta NO se descuenta en liquidación según normativa
    }
    
    const gratificacionTruncaNeta = roundToCents(gratificacionTrunca - descuentoPensionGratif);
    
    // TOTAL LIQUIDACIÓN
    const totalLiquidacion = roundToCents(
        ctsTrunca + gratificacionTruncaNeta + vacacionesTruncas + indemnizacion
    );
    
    return {
        ctsTrunca,
        gratificacionTrunca,
        gratificacionTruncaNeta,
        vacacionesTruncas,
        indemnizacion,
        descuentoPensionGratif,
        totalLiquidacion,
        detalles: {
            diasVacacionesTotales: roundToCents(diasVacacionesTotales),
            tiempoTotalAnios: roundToCents(tiempoTotalAnios)
        }
    };
};


/**
 * Calcula el Costo Total para el Empleador
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones adicionales
 * @returns {object} Objeto con costo total y detalles
 */
window.calcularCostoEmpleador = function(salarioBruto, asigFamiliar, regimen, opciones = {}) {
    const {
        aplicaSenati = false,
        tieneEPS = false,
        nivelRiesgo = 'medio'
    } = opciones;
    
    const sueldoBruto = roundToCents(salarioBruto + asigFamiliar);
    
    // Cargas Directas Mensuales
    const essalud = roundToCents(sueldoBruto * PERU_DATA.empleador.essalud);
    const vidaLey = roundToCents(sueldoBruto * PERU_DATA.empleador.vidaLey);
    const sctr = roundToCents(sueldoBruto * PERU_DATA.empleador.sctr[nivelRiesgo]);
    const senati = roundToCents(aplicaSenati ? sueldoBruto * PERU_DATA.empleador.senati : 0);
    const eps = roundToCents(tieneEPS ? sueldoBruto * PERU_DATA.empleador.eps : 0);
    
    const cargasDirectas = roundToCents(essalud + vidaLey + sctr + senati + eps);
    
    // Provisiones Mensualizadas de Beneficios
    // Gratificaciones: 2 al año + bonif. → mensualizar
    const gratifMensual = roundToCents(regimen.beneficios.gratificaciones 
        ? (sueldoBruto * regimen.beneficios.gratificacionesFactor * 2) / 12 
        : 0);
    const bonifGratif = roundToCents(regimen.beneficios.gratificaciones 
        ? (gratifMensual * regimen.essaludBonif * 2) / 2 
        : 0);
    const provGratificaciones = roundToCents(gratifMensual + bonifGratif);
    
    // CTS: Provisión mensual
    const provCTS = roundToCents(regimen.beneficios.cts 
        ? (sueldoBruto * 1.1667 * regimen.beneficios.ctsFactor) / 12 
        : 0);
    
    // Vacaciones: Provisión mensual
    const provVacaciones = roundToCents((sueldoBruto * regimen.beneficios.vacacionesFactor) / 12);
    
    const provisionesBeneficios = roundToCents(provGratificaciones + provCTS + provVacaciones);
    
    // Costo Total Mensual
    const costoTotal = roundToCents(sueldoBruto + cargasDirectas + provisionesBeneficios);
    
    // Porcentaje de carga social
    const porcentajeCarga = ((costoTotal - sueldoBruto) / sueldoBruto) * 100;
    
    return {
        sueldoBruto,
        essalud,
        vidaLey,
        sctr,
        senati,
        eps,
        cargasDirectas,
        provGratificaciones,
        provCTS,
        provVacaciones,
        provisionesBeneficios,
        costoTotal,
        porcentajeCarga
    };
};

/**
 * Calcula las Utilidades según D.Leg. 892
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} diasTrabajados - Días trabajados en el año
 * @param {number} rentaAnual - Renta anual de la empresa
 * @param {number} totalRemuneraciones - Total de remuneraciones pagadas
 * @param {number} totalDiasTrabajadores - Total días trabajados por todos
 * @param {string} sector - Sector económico
 * @returns {object} Objeto con utilidades y detalles
 */
window.calcularUtilidades = function(
    salarioBruto, 
    diasTrabajados, 
    rentaAnual, 
    totalRemuneraciones, 
    totalDiasTrabajadores, 
    sector = 'otros'
) {
    const sectorData = PERU_DATA.utilidades.sectores[sector];
    const porcentaje = sectorData.porcentaje;
    
    // Utilidad a distribuir
    const utilidadTotal = rentaAnual * porcentaje;
    
    // 50% por días trabajados
    const porDias = (utilidadTotal * PERU_DATA.utilidades.distribucion.porDias * diasTrabajados) / totalDiasTrabajadores;
    
    // 50% por remuneración
    const remuneracionAnual = salarioBruto * 12;
    const porRemuneracion = (utilidadTotal * PERU_DATA.utilidades.distribucion.porRemuneracion * remuneracionAnual) / totalRemuneraciones;
    
    // Total antes de tope
    const utilidadTrabajador = porDias + porRemuneracion;
    
    // Aplicar tope de 18 remuneraciones mensuales
    const topeMaximo = salarioBruto * PERU_DATA.utilidades.topeMaximo;
    const utilidadFinal = Math.min(utilidadTrabajador, topeMaximo);
    
    return {
        utilidadFinal,
        porDias,
        porRemuneracion,
        utilidadSinTope: utilidadTrabajador,
        topeAplicado: utilidadTrabajador > topeMaximo,
        sector: sectorData.nombre,
        porcentaje
    };
};

// =====================================================================
// CONFIGURACIÓN DE CALCULADORAS
// =====================================================================

window.CALCULATOR_CONFIGS = {
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Salario Neto',
        description: 'Calcula tu sueldo líquido mensual después de descuentos (AFP/ONP, Impuesto a la Renta)',
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
                    { value: 'si', label: 'Sí (+ Asignación Familiar)' }
                ]
            },
            { 
                id: 'pension', 
                label: 'Sistema de Pensiones', 
                type: 'select',
                options: [
                    { value: 'afp', label: 'AFP (Sistema Privado)' },
                    { value: 'onp', label: 'ONP (Sistema Nacional - 13%)' }
                ]
            },
            { 
                id: 'afp', 
                label: 'AFP (si aplica)', 
                type: 'select',
                options: [
                    { value: 'integra', label: 'AFP Integra' },
                    { value: 'prima', label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' },
                    { value: 'habitat', label: 'AFP Habitat' }
                ],
                conditional: { field: 'pension', value: 'afp' }
            },
            { 
                id: 'tipo-comision', 
                label: 'Tipo de Comisión AFP', 
                type: 'select',
                options: [
                    { value: 'flujo', label: 'Comisión sobre Flujo (% sueldo)' },
                    { value: 'mixta', label: 'Comisión Mixta (% sueldo + % saldo)' }
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
                help: 'Solo para comisión mixta',
                conditional: { field: 'tipo-comision', value: 'mixta' }
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['salary']) || 0;
            const tieneHijos = values['hijos'] === 'si';
            const sistemaPension = values['pension'] || 'afp';
            const afpNombre = values['afp'] || 'integra';
            const tipoComisionAFP = values['tipo-comision'] || 'flujo';
            const saldoAFP = parseFloat(values['saldo-afp']) || 0;
            
            const resultado = calcularSalarioNeto(salary, regimen, {
                tieneHijos,
                sistemaPension,
                afpNombre,
                tipoComisionAFP,
                saldoAFP
            });
            
            return {
                total: resultado.salarioNeto,
                details: [
                    { label: '💼 INGRESOS', value: '', type: 'header' },
                    { label: 'Sueldo Bruto', value: `S/ ${resultado.salarioBruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(resultado.asigFamiliar > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${resultado.asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: 'Total Bruto', value: `S/ ${resultado.salarioTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📉 DESCUENTOS', value: '', type: 'header' },
                    ...(sistemaPension === 'afp' ? [
                        { label: `AFP ${afpNombre.charAt(0).toUpperCase() + afpNombre.slice(1)} - Aporte (10%)`, value: `- S/ ${resultado.detallesPension.aporte.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                        { label: 'Seguro Invalidez (1.70%)', value: `- S/ ${resultado.detallesPension.seguro.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                        { label: `Comisión ${tipoComisionAFP === 'flujo' ? 'Flujo' : 'Mixta'}`, value: `- S/ ${resultado.detallesPension.comision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' }
                    ] : [
                        { label: 'ONP (13%)', value: `- S/ ${resultado.descuentoPension.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' }
                    ]),
                    { label: 'Impuesto Renta 5ta Cat.', value: `- S/ ${resultado.impuesto5ta.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    { label: 'Total Descuentos', value: `S/ ${(resultado.descuentoPension + resultado.impuesto5ta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' }
                ]
            };
        },
        legalInfo: `El cálculo del salario neto en Perú se rige por normativas específicas que garantizan la correcta determinación de los descuentos aplicables a la remuneración del trabajador. El Sistema Privado de Pensiones (AFP), regulado por el Decreto Supremo N° 054-97-EF, establece que los afiliados deben realizar tres tipos de aportes obligatorios sobre su remuneración asegurable: el Aporte Obligatorio del 10% que se destina al Fondo de Pensiones individual, la Prima de Seguro de Invalidez y Sobrevivencia (SIS) del 1.70% que cubre contingencias de invalidez y fallecimiento, y la Comisión variable que cobra cada AFP por la administración del fondo (varía entre 0.82% y 1.69% según la AFP en modalidad de flujo, o entre 0.38% y 0.47% más un porcentaje sobre el saldo acumulado en modalidad mixta).

Por otro lado, el Sistema Nacional de Pensiones (ONP), regido por el Decreto Ley N° 19990, aplica un descuento único del 13% sobre la remuneración mensual del trabajador. El Impuesto a la Renta de Quinta Categoría, normado por el Texto Único Ordenado de la Ley del Impuesto a la Renta (Decreto Supremo N° 179-2004-EF) y sus modificatorias, se calcula mediante una proyección anual que incluye las 12 remuneraciones mensuales más las gratificaciones de julio y diciembre. Para el año 2026, la UIT (Unidad Impositiva Tributaria) proyectada es de S/ 5,150, lo que determina una deducción anual de 7 UIT (S/ 36,050) antes de aplicar las tasas progresivas por tramos: 8% hasta 5 UIT, 14% entre 5 y 20 UIT, 17% entre 20 y 35 UIT, 20% entre 35 y 45 UIT, y 30% para ingresos superiores a 45 UIT anuales.

La Asignación Familiar, establecida por la Ley N° 25129, corresponde al 10% de la Remuneración Mínima Vital (RMV) vigente, la cual para 2026 se proyecta en S/ 1,075, resultando en una asignación de S/ 107.50 mensuales. Este beneficio se otorga a los trabajadores del régimen de la actividad privada que tengan a su cargo uno o más hijos menores de 18 años, o mayores de esta edad que se encuentren cursando estudios superiores o universitarios, hasta un máximo de 24 años. Es importante destacar que la asignación familiar no tiene carácter remunerativo para efectos de cálculo de beneficios sociales como CTS, pero sí forma parte de la base de cálculo para aportes a pensiones e impuesto a la renta.

Todos estos cálculos se realizan con precisión de centavos para garantizar que los resultados coincidan exactamente con las boletas de pago reales emitidas por los empleadores. El motor de cálculo de SueldoPro Ultra utiliza redondeos a dos decimales en cada operación intermedia, siguiendo las mejores prácticas contables establecidas por la Superintendencia Nacional de Aduanas y de Administración Tributaria (SUNAT) y la Superintendencia de Banca, Seguros y AFP (SBS).`
    },
    
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
                    { value: 'integra', label: 'AFP Integra' },
                    { value: 'prima', label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' },
                    { value: 'habitat', label: 'AFP Habitat' }
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
            const netoDeseado = parseFloat(values['neto-deseado']) || 0;
            const tieneHijos = values['hijos-bruto'] === 'si';
            const sistemaPension = values['pension-bruto'] || 'afp';
            const afpNombre = values['afp-bruto'] || 'integra';
            const tipoComisionAFP = values['tipo-comision-bruto'] || 'flujo';
            
            const brutoNecesario = calcularSalarioBruto(netoDeseado, regimen, {
                tieneHijos,
                sistemaPension,
                afpNombre,
                tipoComisionAFP,
                saldoAFP: 0
            });
            
            const verificacion = calcularSalarioNeto(brutoNecesario, regimen, {
                tieneHijos,
                sistemaPension,
                afpNombre,
                tipoComisionAFP,
                saldoAFP: 0
            });
            
            return {
                total: brutoNecesario,
                details: [
                    { label: '🎯 OBJETIVO', value: '', type: 'header' },
                    { label: 'Neto Deseado', value: `S/ ${netoDeseado.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Régimen', value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💼 RESULTADO', value: '', type: 'header' },
                    { label: 'Bruto Necesario', value: `S/ ${brutoNecesario.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    ...(verificacion.asigFamiliar > 0 ? [
                        { label: 'Incluye Asig. Familiar', value: `S/ ${verificacion.asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 VERIFICACIÓN', value: '', type: 'header' },
                    { label: 'Descuentos Totales', value: `S/ ${(verificacion.descuentoPension + verificacion.impuesto5ta).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    { label: 'Neto Resultante', value: `S/ ${verificacion.salarioNeto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Diferencia', value: `S/ ${Math.abs(verificacion.salarioNeto - netoDeseado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' }
                ]
            };
        },
        legalInfo: `El cálculo inverso del salario bruto a partir de un salario neto deseado es una herramienta fundamental para la planificación financiera personal y las negociaciones salariales en el contexto laboral peruano. Esta calculadora utiliza un algoritmo iterativo de convergencia que considera todos los descuentos legales obligatorios establecidos por la legislación vigente, garantizando que el trabajador pueda determinar con precisión el monto bruto que debe negociar con su empleador para alcanzar el ingreso neto mensual que necesita para cubrir sus gastos y objetivos financieros.

El proceso de cálculo inverso toma en cuenta el Sistema Privado de Pensiones (AFP) regulado por el D.S. N° 054-97-EF, que incluye el aporte obligatorio del 10%, la prima de seguro SIS del 1.70%, y las comisiones variables de cada AFP que oscilan entre 0.82% y 1.69% en modalidad flujo. Alternativamente, si el trabajador está afiliado al Sistema Nacional de Pensiones (ONP) bajo el D.Ley N° 19990, se considera el descuento único del 13%. Adicionalmente, el algoritmo incorpora el cálculo del Impuesto a la Renta de Quinta Categoría según el TUO de la Ley del Impuesto a la Renta (D.S. N° 179-2004-EF), proyectando el ingreso anual que incluye las gratificaciones de julio y diciembre según la Ley N° 27735, y aplicando las tasas progresivas sobre los tramos que excedan la deducción de 7 UIT anuales.

La Asignación Familiar establecida por la Ley N° 25129 también se considera en el cálculo cuando el trabajador tiene hijos menores de 18 años o mayores cursando estudios superiores hasta los 24 años, añadiendo S/ 107.50 mensuales (10% de la RMV 2026 de S/ 1,075) al ingreso bruto. Este beneficio, aunque no tiene naturaleza remunerativa para el cálculo de beneficios sociales, sí se incluye en la base imponible para pensiones e impuesto a la renta, afectando directamente el cálculo inverso. El motor computacional realiza múltiples iteraciones con precisión de centavos hasta lograr que la diferencia entre el neto deseado y el neto resultante sea menor a un centavo, asegurando la máxima exactitud en el resultado.

Esta herramienta es especialmente valiosa para trabajadores que están en proceso de negociación salarial, cambio de empleo, o planificación de presupuestos familiares, permitiéndoles conocer con certeza el monto bruto que deben solicitar para alcanzar sus objetivos financieros netos. La precisión del cálculo garantiza que no existan sorpresas al momento de recibir la primera boleta de pago, facilitando una mejor toma de decisiones en materia laboral y financiera.`
    },
    
    cts: {
        id: 'cts',
        icon: '🏦',
        title: 'CTS - Compensación por Tiempo de Servicios',
        description: 'Calcula tu CTS semestral (depósitos de Mayo y Noviembre)',
        fields: [
            { 
                id: 'cts-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'cts-hijos', 
                label: '¿Asignación Familiar?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'cts-meses', 
                label: 'Meses trabajados en el semestre', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '6',
                min: 1,
                max: 6,
                help: 'Máximo 6 meses por semestre'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['cts-salary']) || 0;
            const tieneHijos = values['cts-hijos'] === 'si';
            const mesesTrabajados = parseFloat(values['cts-meses']) || 6;
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            
            const ctsCalc = calcularCTS(salary, asigFamiliar, regimen, mesesTrabajados);
            
            if (!regimen.beneficios.cts) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ CTS NO APLICABLE', value: '', type: 'header' },
                        { label: 'Régimen Actual', value: regimen.nombre, type: 'info' },
                        { label: 'Observación', value: 'Este régimen no contempla CTS', type: 'info' }
                    ]
                };
            }
            
            const gratifCalc = calcularGratificaciones(salary, asigFamiliar, regimen);
            
            return {
                total: ctsCalc.ctsTotal,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(asigFamiliar > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: '1/6 de Gratificación', value: `+ S/ ${ctsCalc.detalles.sextoGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 CÁLCULO CTS', value: '', type: 'header' },
                    { label: 'Remuneración Computable', value: `S/ ${ctsCalc.detalles.remuneracionComputable.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Meses Trabajados', value: `${mesesTrabajados} de 6`, type: 'info' },
                    { label: `Factor Régimen (${(regimen.beneficios.ctsFactor * 100)}%)`, value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 PROYECCIÓN ANUAL', value: '', type: 'header' },
                    { label: 'CTS Mayo (6 meses)', value: `S/ ${ctsCalc.ctsTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'CTS Noviembre (6 meses)', value: `S/ ${ctsCalc.ctsTotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Total CTS Anual', value: `S/ ${(ctsCalc.ctsTotal * 2).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' }
                ]
            };
        },
        legalInfo: `La Compensación por Tiempo de Servicios (CTS) es un beneficio social de previsión de las contingencias que origina el cese en el trabajo y de promoción del trabajador y su familia, regulado por el Decreto Supremo N° 001-97-TR (TUO de la Ley de CTS). Este beneficio tiene naturaleza de depósito dinerario y constituye un patrimonio intangible del trabajador, siendo obligatorio para todos los empleadores del régimen laboral de la actividad privada que cumplan jornadas mínimas de 4 horas diarias en promedio. Los depósitos semestrales se realizan obligatoriamente dentro de los primeros 15 días hábiles de los meses de mayo y noviembre de cada año, computándose los períodos comprendidos entre el 1 de noviembre al 30 de abril, y del 1 de mayo al 31 de octubre respectivamente.

La remuneración computable para el cálculo de la CTS está integrada por tres componentes fundamentales según el artículo 9° del TUO: el sueldo básico mensual, la asignación familiar si corresponde según la Ley N° 25129, y la sexta parte del monto de las gratificaciones percibidas en el semestre respectivo según lo establecido en la Ley N° 27735. Esta última gratificación corresponde a las de Fiestas Patrias (julio) y Navidad (diciembre), de modo que se promedie el beneficio recibido. Es importante destacar que la remuneración computable no incluye conceptos variables como horas extras, bonificaciones extraordinarias, o asignaciones ocasionales, concentrándose únicamente en los conceptos fijos y regulares de la remuneración del trabajador.

El cálculo preciso de la CTS se efectúa mediante la fórmula: CTS = (Remuneración Computable × Meses/12) + (Remuneración Computable × Días/360), donde los meses y días corresponden al tiempo efectivamente laborado en el semestre. Este cálculo debe realizarse con absoluta precisión decimal, ya que cualquier error en los centavos puede generar diferencias acumulativas significativas a lo largo de la vida laboral del trabajador. Para el régimen general de la actividad privada se aplica el 100% de este cálculo, mientras que para el régimen de pequeña empresa según la Ley MYPE (Ley N° 28015 y D.S. N° 013-2013-PRODUCE) se aplica solo el 50%, reflejando las características diferenciadas de protección social según el tamaño y capacidad económica de la empresa.

El trabajador tiene derecho a disponer libremente de su CTS y los intereses generados al producirse su cese laboral, cualquiera sea la causa que lo motive. Adicionalmente, la normativa vigente permite retiros parciales de libre disposición de hasta el 70% del excedente de 6 remuneraciones brutas depositadas en su cuenta de CTS, así como retiros específicos para fines de vivienda. La CTS está inafecta al pago de aportes y contribuciones a la seguridad social, así como a cualquier tributo, configurándose como un beneficio neto para el trabajador que busca garantizar su estabilidad económica futura ante eventuales contingencias laborales.`
    },
    
    gratificacion: {
        id: 'gratificacion',
        icon: '🎁',
        title: 'Gratificaciones',
        description: 'Calcula tus gratificaciones de Julio (Fiestas Patrias) y Diciembre (Navidad)',
        fields: [
            { 
                id: 'grat-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'grat-hijos', 
                label: '¿Asignación Familiar?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'grat-pension', 
                label: 'Sistema de Pensiones', 
                type: 'select',
                options: [
                    { value: 'afp', label: 'AFP' },
                    { value: 'onp', label: 'ONP' }
                ]
            },
            { 
                id: 'grat-afp', 
                label: 'AFP (si aplica)', 
                type: 'select',
                options: [
                    { value: 'integra', label: 'AFP Integra' },
                    { value: 'prima', label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' },
                    { value: 'habitat', label: 'AFP Habitat' }
                ],
                conditional: { field: 'grat-pension', value: 'afp' }
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['grat-salary']) || 0;
            const tieneHijos = values['grat-hijos'] === 'si';
            const sistemaPension = values['grat-pension'] || 'afp';
            const afpNombre = values['grat-afp'] || 'integra';
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            
            if (!regimen.beneficios.gratificaciones) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ GRATIFICACIONES NO APLICABLES', value: '', type: 'header' },
                        { label: 'Régimen Actual', value: regimen.nombre, type: 'info' },
                        { label: 'Observación', value: 'Este régimen no contempla gratificaciones', type: 'info' }
                    ]
                };
            }
            
            const gratifCalc = calcularGratificaciones(salary, asigFamiliar, regimen);
            
            // Descuentos sobre gratificación
            let descuentoPension = 0;
            if (sistemaPension === 'afp') {
                const afpCalc = calcularAFP(gratifCalc.totalPorGratificacion, afpNombre, 'flujo', 0);
                descuentoPension = afpCalc.total;
            } else {
                descuentoPension = gratifCalc.totalPorGratificacion * PERU_DATA.onp;
            }
            
            const netoGratificacion = gratifCalc.totalPorGratificacion - descuentoPension;
            
            return {
                total: gratifCalc.totalPorGratificacion,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(asigFamiliar > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '🎁 CÁLCULO GRATIFICACIÓN', value: '', type: 'header' },
                    { label: `Gratificación Base (${(regimen.beneficios.gratificacionesFactor * 100)}%)`, value: `S/ ${gratifCalc.gratificacionBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    ...(gratifCalc.bonifEssalud > 0 ? [
                        { label: 'Bonificación Extra (9%)', value: `+ S/ ${gratifCalc.bonifEssalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: 'Total Bruto por Gratificación', value: `S/ ${gratifCalc.totalPorGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📉 DESCUENTOS', value: '', type: 'header' },
                    { label: `${sistemaPension === 'afp' ? 'AFP' : 'ONP'}`, value: `- S/ ${descuentoPension.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    { label: 'Neto por Gratificación', value: `S/ ${netoGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 RESUMEN ANUAL', value: '', type: 'header' },
                    { label: 'Gratificación Julio', value: `S/ ${netoGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Gratificación Diciembre', value: `S/ ${netoGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Total Neto Anual', value: `S/ ${(netoGratificacion * 2).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' }
                ]
            };
        },
        legalInfo: `Las gratificaciones legales en el Perú constituyen un derecho irrenunciable de los trabajadores sujetos al régimen laboral de la actividad privada, establecido por la Ley N° 27735 "Ley que regula el otorgamiento de las gratificaciones para los trabajadores del régimen de la actividad privada por Fiestas Patrias y Navidad" y su Reglamento aprobado por D.S. N° 005-2002-TR. Este beneficio social consiste en dos pagos anuales equivalentes a una remuneración mensual completa cada uno, que deben ser abonados obligatoriamente en la primera quincena de julio (por Fiestas Patrias) y en la primera quincena de diciembre (por Navidad), constituyendo junto con las 12 remuneraciones mensuales ordinarias, un total de 14 sueldos que el trabajador percibe anualmente en el régimen general.

Para tener derecho a las gratificaciones, el trabajador debe estar laborando en la oportunidad en que corresponda percibir el beneficio, es decir, debe encontrarse trabajando efectivamente en julio y diciembre respectivamente. El monto de cada gratificación es equivalente a la remuneración básica que percibe el trabajador en dichos meses, más la asignación familiar si corresponde según la Ley N° 25129. En caso de que el trabajador no haya laborado el semestre completo (enero-junio para la gratificación de julio, o julio-diciembre para la gratificación de diciembre), tiene derecho a percibir la gratificación en forma proporcional a los meses completos y días calendarios trabajados, aplicando la fórmula: Gratificación Trunca = (Remuneración × Meses/6) + (Remuneración × Días/180), donde se valora cada mes y día efectivamente laborado con absoluta precisión.

La bonificación extraordinaria es un concepto adicional regulado por la Ley N° 29351, que establece que los empleadores de la actividad privada deben pagar a ESSALUD una bonificación extraordinaria equivalente al 9% del monto de cada gratificación abonada a sus trabajadores del régimen general. Este pago se realiza directamente a ESSALUD dentro de los cinco días hábiles siguientes a la fecha de pago de las gratificaciones, y no es remuneración computable para ningún efecto legal. Sin embargo, existe una excepción importante: cuando el empleador otorga cobertura de salud a través de una Entidad Prestadora de Salud (EPS), el porcentaje de la bonificación extraordinaria se reduce al 6.75%, reflejando el ahorro que representa para ESSALUD al tener al trabajador cubierto por un sistema privado de salud. Esta bonificación beneficia indirectamente al trabajador al fortalecer el sistema de salud público y mejorar la calidad de atención médica disponible.

Las gratificaciones están afectas únicamente al descuento de aportes al sistema de pensiones (AFP u ONP según corresponda), pero no al impuesto a la renta de quinta categoría, según lo establecido en el artículo 20° del TUO de la Ley del Impuesto a la Renta. Este tratamiento tributario favorable busca proteger el poder adquisitivo de estos beneficios sociales que tienen como finalidad permitir al trabajador y su familia afrontar gastos extraordinarios asociados a las festividades nacionales y de fin de año. El régimen de pequeña empresa según la Ley MYPE otorga gratificaciones reducidas al 50% del monto que corresponde en el régimen general, mientras que el régimen de microempresa no contempla este beneficio, reflejando las diferencias en capacidad económica y generación de empleo de los distintos tamaños empresariales en el país.`
    },
    
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        title: 'Liquidación de Beneficios Sociales',
        description: 'Calcula el pago final al terminar la relación laboral',
        fields: [
            { 
                id: 'liq-salary', 
                label: 'Último Sueldo Bruto', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'liq-anios', 
                label: 'Años Trabajados', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '3.5',
                min: 0,
                max: 40,
                step: 0.1,
                help: 'Puede incluir decimales (ej: 3.5 años)'
            },
            { 
                id: 'liq-tipo', 
                label: 'Tipo de Salida', 
                type: 'select',
                options: [
                    { value: 'despido', label: 'Despido Arbitrario (con indemnización)' },
                    { value: 'renuncia', label: 'Renuncia Voluntaria (sin indemnización)' },
                    { value: 'mutuo', label: 'Mutuo Acuerdo (sin indemnización)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['liq-salary']) || 0;
            const aniosTrabajados = parseFloat(values['liq-anios']) || 0;
            const tipoSalida = values['liq-tipo'] || 'despido';
            
            const liqCalc = calcularLiquidacion(salary, aniosTrabajados, regimen, tipoSalida);
            
            return {
                total: liqCalc.totalLiquidacion,
                details: [
                    { label: '💼 DATOS LABORALES', value: '', type: 'header' },
                    { label: 'Último Sueldo', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Tiempo de Servicio', value: `${aniosTrabajados} años`, type: 'info' },
                    { label: 'Tipo de Salida', value: tipoSalida === 'despido' ? 'Despido Arbitrario' : tipoSalida === 'renuncia' ? 'Renuncia' : 'Mutuo Acuerdo', type: 'info' },
                    { label: 'Régimen', value: regimen.nombre, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 BENEFICIOS SOCIALES', value: '', type: 'header' },
                    { label: 'CTS Pendiente', value: `S/ ${liqCalc.ctsPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Vacaciones Truncas', value: `S/ ${liqCalc.vacacionesTruncas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    ...(liqCalc.gratificacionTrunca > 0 ? [
                        { label: 'Gratificación Trunca', value: `S/ ${liqCalc.gratificacionTrunca.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    ...(liqCalc.indemnizacion > 0 ? [
                        { label: '⚖️ INDEMNIZACIÓN', value: '', type: 'header' },
                        { label: `Despido Arbitrario (${regimen.beneficios.indemnizacion} × año)`, value: `S/ ${liqCalc.indemnizacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                        { label: 'Tope Máximo', value: '12 remuneraciones', type: 'info' },
                        { label: '', value: '', type: 'separator' }
                    ] : []),
                    { label: '💡 IMPORTANTE', value: '', type: 'header' },
                    { label: 'Sobre liquidación se descuenta:', value: 'AFP/ONP e Impuesto 5ta', type: 'info' },
                    { label: 'Indemnización:', value: 'Inafecta a impuestos', type: 'info' }
                ]
            };
        },
        legalInfo: `La liquidación de beneficios sociales es el procedimiento mediante el cual el empleador calcula y paga al trabajador la totalidad de los derechos laborales pendientes al momento del cese de la relación laboral, independientemente de la causa que origine dicho cese. Este proceso está regulado por el Decreto Supremo N° 003-97-TR (TUO de la Ley de Productividad y Competitividad Laboral) y comprende diversos conceptos que deben liquidarse con absoluta precisión, garantizando que el trabajador reciba íntegramente lo que le corresponde por derecho. La liquidación debe ser entregada al trabajador dentro de las 48 horas de producido el cese, junto con el certificado de trabajo y otros documentos laborales pertinentes, bajo responsabilidad del empleador y con posibilidad de multas administrativas por parte de SUNAFIL en caso de incumplimiento.

La Compensación por Tiempo de Servicios (CTS) trunca constituye el primer componente de la liquidación y corresponde al período trabajado en el último semestre que no fue depositado (ya sea del 1 de noviembre al 30 de abril, o del 1 de mayo al 31 de octubre). El cálculo se efectúa sobre la base de la remuneración computable vigente al cese (sueldo básico + 1/6 de la última gratificación recibida + asignación familiar si corresponde), multiplicada por los meses completos y días calendarios trabajados, divididos entre 12 y 360 respectivamente según lo establece el artículo 2° del D.S. N° 001-97-TR. Este monto es inafecto a cualquier descuento por aportes previsionales o tributarios, siendo de libre disponibilidad total para el trabajador al constituir un derecho de propiedad intangible.

Las vacaciones truncas representan el segundo componente y corresponden a la remuneración equivalente al descanso vacacional no gozado, calculado proporcionalmente al tiempo de servicios prestado. Según el artículo 22° del D.Leg. N° 713, por cada año completo de servicios el trabajador tiene derecho a 30 días calendario de descanso vacacional remunerado en el régimen general (o 15 días en el régimen de pequeña empresa y microempresa según la Ley MYPE). Al producirse el cese, corresponde abonar tantos dozavos y treintavos de la remuneración como meses y días haya laborado el trabajador respectivamente, aplicando la fórmula: Vacaciones Truncas = (Sueldo/30) × Días Acumulados. Este concepto también es inafecto a descuentos por pensiones o impuestos, representando un pago compensatorio por el descanso no disfrutado.

La gratificación trunca constituye el tercer elemento y se otorga cuando el cese se produce antes de cumplirse el semestre completo que da derecho a la gratificación ordinaria de julio o diciembre. Conforme al artículo 6° de la Ley N° 27735 y su reglamento, se calcula en forma proporcional: Gratificación Trunca = (Remuneración + Asignación Familiar) × (Meses/6) + (Remuneración + Asignación Familiar) × (Días/180), donde se computan los meses completos y días calendarios laborados en el semestre respectivo. A diferencia de la CTS y las vacaciones truncas, este concepto SÍ está afecto a los descuentos por sistema de pensiones (AFP u ONP) pero NO al impuesto a la renta, según interpretación vinculante de SUNAT contenida en el Informe N° 091-2004-SUNAT/2B0000.

Finalmente, la indemnización por despido arbitrario se incluye únicamente cuando la relación laboral termina por decisión unilateral del empleador sin causa justificada relacionada con la conducta o capacidad del trabajador, conforme a los artículos 34° al 38° del TUO del D.Leg. N° 728. El monto equivale a 1.5 remuneraciones mensuales por cada año completo de servicios en el régimen general (0.5 en pequeña empresa, 0.25 en microempresa), con un tope máximo de 12 remuneraciones mensuales. Esta indemnización es completamente inafecta a descuentos de pensiones, seguridad social e impuesto a la renta según el literal v) del artículo 18° del TUO de la Ley del Impuesto a la Renta, constituyendo un resarcimiento económico por la pérdida inesperada del empleo que debe protegerse en su integridad para cumplir su función de sostén temporal mientras el trabajador busca una nueva fuente de ingresos.`
    },
    
    utilidades: {
        id: 'utilidades',
        icon: '💼',
        title: 'Participación en Utilidades',
        description: 'Calcula tu participación en las utilidades de la empresa (D.Leg. 892)',
        fields: [
            { 
                id: 'util-salary', 
                label: 'Sueldo Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'util-dias', 
                label: 'Días trabajados en el año', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '365',
                min: 1,
                max: 365
            },
            { 
                id: 'util-renta', 
                label: 'Renta Anual de la Empresa', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '1000000',
                min: 0,
                help: 'Ganancia anual antes de impuestos'
            },
            { 
                id: 'util-total-remuneraciones', 
                label: 'Total Remuneraciones Empresa', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '500000',
                min: 0,
                help: 'Suma de todos los sueldos pagados en el año'
            },
            { 
                id: 'util-total-dias', 
                label: 'Total Días Trabajados (todos)', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '7300',
                min: 1,
                help: 'Suma de días de todos los trabajadores'
            },
            { 
                id: 'util-sector', 
                label: 'Sector Económico', 
                type: 'select',
                options: [
                    { value: 'pesquera', label: 'Pesquera (10%)' },
                    { value: 'telecomunicaciones', label: 'Telecomunicaciones (10%)' },
                    { value: 'industrial', label: 'Industrial (10%)' },
                    { value: 'mineria', label: 'Minería (8%)' },
                    { value: 'comercio', label: 'Comercio (8%)' },
                    { value: 'restaurantes', label: 'Restaurantes (8%)' },
                    { value: 'transporte', label: 'Transporte (5%)' },
                    { value: 'otros', label: 'Otros (5%)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['util-salary']) || 0;
            const diasTrabajados = parseFloat(values['util-dias']) || 365;
            const rentaAnual = parseFloat(values['util-renta']) || 0;
            const totalRemuneraciones = parseFloat(values['util-total-remuneraciones']) || 1;
            const totalDiasTrabajadores = parseFloat(values['util-total-dias']) || 1;
            const sector = values['util-sector'] || 'otros';
            
            if (!regimen.beneficios.utilidades) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ UTILIDADES NO APLICABLES', value: '', type: 'header' },
                        { label: 'Régimen Actual', value: regimen.nombre, type: 'info' },
                        { label: 'Observación', value: 'Este régimen no participa en utilidades', type: 'info' }
                    ]
                };
            }
            
            const utilCalc = calcularUtilidades(
                salary,
                diasTrabajados,
                rentaAnual,
                totalRemuneraciones,
                totalDiasTrabajadores,
                sector
            );
            
            return {
                total: utilCalc.utilidadFinal,
                details: [
                    { label: '🏢 DATOS EMPRESA', value: '', type: 'header' },
                    { label: 'Sector', value: utilCalc.sector, type: 'info' },
                    { label: 'Porcentaje Legal', value: `${(utilCalc.porcentaje * 100)}%`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: 'Renta Anual Empresa', value: `S/ ${rentaAnual.toLocaleString('es-PE', { minimumFractionDigits: 0 })}`, type: 'base' },
                    { label: 'Utilidad a Distribuir', value: `S/ ${(rentaAnual * utilCalc.porcentaje).toLocaleString('es-PE', { minimumFractionDigits: 0 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 DISTRIBUCIÓN 50/50', value: '', type: 'header' },
                    { label: 'Por Días Trabajados (50%)', value: `S/ ${utilCalc.porDias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Por Remuneración (50%)', value: `S/ ${utilCalc.porRemuneracion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    ...(utilCalc.topeAplicado ? [
                        { label: '⚠️ TOPE APLICADO', value: '', type: 'header' },
                        { label: 'Utilidad sin Tope', value: `S/ ${utilCalc.utilidadSinTope.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                        { label: 'Tope Legal (18 sueldos)', value: `S/ ${(salary * PERU_DATA.utilidades.topeMaximo).toLocaleString('es-PE', { minimumFractionDigits: 0 })}`, type: 'info' },
                        { label: '', value: '', type: 'separator' }
                    ] : []),
                    { label: '💡 Tope Legal', value: `S/ ${(salary * PERU_DATA.utilidades.topeMaximo).toLocaleString('es-PE', { minimumFractionDigits: 0 })} (18 sueldos)`, type: 'info' }
                ]
            };
        },
        legalInfo: `La participación de los trabajadores en las utilidades de la empresa constituye un derecho constitucional establecido en el artículo 29° de la Constitución Política del Perú de 1993 y desarrollado mediante el Decreto Legislativo N° 892 "Regulan el derecho de los trabajadores a participar en las utilidades de las empresas que desarrollan actividades generadoras de rentas de tercera categoría". Este beneficio social tiene como fundamento el reconocimiento de que los trabajadores contribuyen directamente a la generación de las ganancias empresariales mediante su esfuerzo laboral, debiendo por tanto participar en los resultados económicos positivos de la organización. El derecho a las utilidades solo es exigible en empresas que cuenten con más de 20 trabajadores en el régimen general, y que hayan generado renta imponible en el ejercicio fiscal correspondiente, excluyéndose las empresas autogestionarias, cooperativas y comunales.

El porcentaje de participación en las utilidades varía según la actividad económica principal de la empresa, estableciéndose los siguientes tramos: 10% para empresas pesqueras, de telecomunicaciones e industriales; 8% para empresas mineras, de comercio al por mayor y menor, y restaurantes y hoteles; y 5% para empresas de transporte, producción y comercialización de combustibles, y demás actividades no especificadas. Este porcentaje se aplica sobre la renta anual antes de impuestos determinada según las normas del Impuesto a la Renta, generando un monto total a distribuir entre todos los trabajadores con derecho. La distribución debe realizarse dentro de los 30 días naturales siguientes al vencimiento del plazo para la presentación de la Declaración Jurada Anual del Impuesto a la Renta (usualmente en abril del año siguiente al ejercicio fiscal correspondiente).

La metodología de distribución individual del monto total de utilidades se efectúa aplicando dos criterios en partes iguales según lo establece el artículo 4° del D.Leg. N° 892: el 50% se distribuye en función a los días laborados por cada trabajador, y el otro 50% en proporción a las remuneraciones percibidas durante el ejercicio. Fórmula específica: Utilidad del trabajador = [(Utilidad Total × 0.50 × Días laborados del trabajador) / Total días laborados de todos] + [(Utilidad Total × 0.50 × Remuneración anual del trabajador) / Total remuneraciones anuales pagadas]. Este sistema busca equilibrar tanto el factor tiempo de permanencia como el nivel de responsabilidad y remuneración de cada trabajador, generando una distribución más equitativa y justa. Sin embargo, existe un tope máximo legal equivalente a 18 remuneraciones mensuales del trabajador, evitando que empleados con muy altas remuneraciones concentren excesivamente el beneficio.

Las utilidades recibidas por los trabajadores tienen tratamiento tributario especial: están afectas al Impuesto a la Renta de Quinta Categoría solo por el excedente de 5 UIT anuales según el artículo 34°-A del TUO de la Ley del Impuesto a la Renta modificado por Ley N° 29392, constituyendo un beneficio tributario significativo que protege el poder adquisitivo del trabajador. Adicionalmente, las utilidades NO están afectas a aportes al sistema de pensiones (ni AFP ni ONP), maximizando el beneficio neto percibido. La empresa debe retener y entregar directamente el monto de utilidades al trabajador mediante depósito en cuenta bancaria o efectivo, quedando prohibido cualquier compensación o deducción salvo orden judicial expresa. El incumplimiento de esta obligación genera multas administrativas por parte de SUNAFIL y el derecho del trabajador a exigir judicialmente el pago con intereses legales laborales desde la fecha en que debió cumplirse la entrega.`
    },
    
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        title: 'Horas Extra (Sobretiempo)',
        description: 'Calcula el pago por horas extras según legislación peruana',
        fields: [
            { 
                id: 'he-salary', 
                label: 'Sueldo Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'he-hours-25', 
                label: 'Horas Extra al 25%', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '10',
                min: 0,
                max: 200,
                help: 'Primeras 2 horas extra del día'
            },
            { 
                id: 'he-hours-35', 
                label: 'Horas Extra al 35%', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5',
                min: 0,
                max: 200,
                help: 'Horas adicionales después de las 2 primeras'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['he-salary']) || 0;
            const hours25 = parseFloat(values['he-hours-25']) || 0;
            const hours35 = parseFloat(values['he-hours-35']) || 0;
            
            // Valor hora = Sueldo mensual / 240 horas
            const hourlyRate = salary / 240;
            
            // Pago horas extra
            const pago25 = hourlyRate * 1.25 * hours25;
            const pago35 = hourlyRate * 1.35 * hours35;
            const total = pago25 + pago35;
            
            return {
                total,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Valor Hora Ordinaria', value: `S/ ${hourlyRate.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Base de Cálculo', value: '240 horas mensuales', type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 25%', value: '', type: 'header' },
                    { label: 'Cantidad de Horas', value: `${hours25} horas`, type: 'info' },
                    { label: 'Valor Hora +25%', value: `S/ ${(hourlyRate * 1.25).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Subtotal 25%', value: `S/ ${pago25.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 35%', value: '', type: 'header' },
                    { label: 'Cantidad de Horas', value: `${hours35} horas`, type: 'info' },
                    { label: 'Valor Hora +35%', value: `S/ ${(hourlyRate * 1.35).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Subtotal 35%', value: `S/ ${pago35.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Total Horas Extra', value: `${hours25 + hours35} horas`, type: 'info' },
                    { label: 'Límite Legal', value: 'Máx. 8 hrs extra/semana', type: 'info' }
                ]
            };
        },
        legalInfo: `El trabajo en sobretiempo, comúnmente denominado "horas extras", está regulado en el Perú por el Decreto Supremo N° 007-2002-TR "TUO de la Ley de Jornada de Trabajo, Horario y Trabajo en Sobretiempo", el cual establece las condiciones, límites y sobretasas remunerativas aplicables cuando un trabajador labora más allá de la jornada ordinaria máxima legal. La jornada ordinaria de trabajo en el Perú es de 8 horas diarias o 48 horas semanales como máximo, según lo dispone el artículo 25° de la Constitución Política. Cuando un trabajador labora en exceso de estos límites, tiene derecho a percibir una remuneración adicional que compensa el mayor esfuerzo y sacrificio de tiempo personal, y que busca desincentivar el uso excesivo de sobretiempo por parte de los empleadores.

La base de cálculo para las horas extras se determina dividiendo la remuneración ordinaria mensual entre 240 horas, que representa el equivalente a 4 semanas completas de 48 horas semanales (48 × 5 = 240). Es fundamental destacar que la remuneración ordinaria incluye no solo el sueldo básico, sino también la asignación familiar cuando ésta corresponde, según interpretación de la Autoridad Administrativa de Trabajo contenida en diversos pronunciamientos y precedentes vinculantes. Esta inclusión de la asignación familiar en la base de cálculo beneficia directamente al trabajador con hijos, incrementando proporcionalmente el valor de cada hora extra trabajada y reconociendo que este beneficio forma parte de la remuneración regular para efectos de cálculos laborales.

Las sobretasas remunerativas aplicables al trabajo en sobretiempo están claramente establecidas en el artículo 10° del D.S. N° 007-2002-TR: las dos primeras horas extras laboradas en un día se pagan con una sobretasa del 25% sobre el valor hora ordinaria (es decir, se paga S/ 1.25 por cada hora), mientras que las horas adicionales que excedan las dos primeras se pagan con una sobretasa del 35% (S/ 1.35 por hora). Esta escala progresiva busca desincentivar la extensión excesiva de la jornada laboral, protegiendo la salud y el equilibrio vida-trabajo del empleado. El trabajo en sobretiempo debe ser excepcional y justificado por necesidades imperiosas o circunstancias extraordinarias de la empresa, no pudiendo exceder en promedio de 8 horas semanales según el límite establecido en el citado decreto supremo.

Los montos percibidos por concepto de horas extras tienen naturaleza remunerativa y, por tanto, están afectos a los descuentos legales correspondientes: aportes al sistema de pensiones (AFP u ONP según corresponda) e Impuesto a la Renta de Quinta Categoría. Asimismo, deben considerarse para el cálculo de beneficios sociales como gratificaciones y CTS cuando tienen carácter regular y permanente, según lo establece el artículo 6° del D.S. N° 001-97-TR. El trabajo en sobretiempo requiere el consentimiento expreso del trabajador, salvo en casos de fuerza mayor que pongan en peligro a las personas, los bienes de la empresa o la continuidad de la actividad productiva. La no remuneración de horas extras debidamente acreditadas constituye una infracción grave en materia laboral, sancionable por la Superintendencia Nacional de Fiscalización Laboral (SUNAFIL) con multas que pueden alcanzar hasta 25 UIT según la gravedad y tamaño de la empresa.`
    },
    
    costo_empleador: {
        id: 'costo_empleador',
        icon: '🏢',
        title: 'Costo Total para Empleador',
        description: 'Calcula el costo real mensual total que asume la empresa (Carga Social)',
        fields: [
            { 
                id: 'emp-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'emp-hijos', 
                label: '¿Asignación Familiar?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'emp-riesgo', 
                label: 'Nivel de Riesgo SCTR', 
                type: 'select',
                options: [
                    { value: 'minimo', label: 'Bajo (0.53%) - Oficinas' },
                    { value: 'medio', label: 'Medio (0.71%) - Comercio' },
                    { value: 'alto', label: 'Alto (1.18%) - Construcción/Minería' }
                ]
            },
            { 
                id: 'emp-senati', 
                label: '¿Aplica SENATI?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No (Servicios/Comercio)' },
                    { value: 'si', label: 'Sí (Industria/Construcción 0.75%)' }
                ]
            },
            { 
                id: 'emp-eps', 
                label: '¿Tiene EPS Privada?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No (Solo ESSALUD 9%)' },
                    { value: 'si', label: 'Sí (+ 2.25% adicional)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['emp-salary']) || 0;
            const tieneHijos = values['emp-hijos'] === 'si';
            const nivelRiesgo = values['emp-riesgo'] || 'medio';
            const aplicaSenati = values['emp-senati'] === 'si';
            const tieneEPS = values['emp-eps'] === 'si';
            
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            
            const costoCalc = calcularCostoEmpleador(salary, asigFamiliar, regimen, {
                aplicaSenati,
                tieneEPS,
                nivelRiesgo
            });
            
            return {
                total: costoCalc.costoTotal,
                details: [
                    { label: '💼 PLANILLA BASE', value: '', type: 'header' },
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Bruto', value: `S/ ${costoCalc.sueldoBruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 CARGAS DIRECTAS', value: '', type: 'header' },
                    { label: 'ESSALUD (9%)', value: `+ S/ ${costoCalc.essalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: `SCTR (${(PERU_DATA.empleador.sctr[nivelRiesgo] * 100).toFixed(2)}%)`, value: `+ S/ ${costoCalc.sctr.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'Vida Ley (0.53%)', value: `+ S/ ${costoCalc.vidaLey.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    ...(aplicaSenati ? [
                        { label: 'SENATI (0.75%)', value: `+ S/ ${costoCalc.senati.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' }
                    ] : []),
                    ...(tieneEPS ? [
                        { label: 'EPS Adicional (2.25%)', value: `+ S/ ${costoCalc.eps.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' }
                    ] : []),
                    { label: 'Subtotal Cargas', value: `S/ ${costoCalc.cargasDirectas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📅 PROVISIONES MENSUALES', value: '', type: 'header' },
                    { label: 'Gratificaciones (prov.)', value: `+ S/ ${costoCalc.provGratificaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'CTS (prov.)', value: `+ S/ ${costoCalc.provCTS.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'Vacaciones (prov.)', value: `+ S/ ${costoCalc.provVacaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'Subtotal Beneficios', value: `S/ ${costoCalc.provisionesBeneficios.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 RESUMEN EJECUTIVO', value: '', type: 'header' },
                    { label: 'Carga Social', value: `${costoCalc.porcentajeCarga.toFixed(1)}%`, type: 'info' },
                    { label: 'Costo vs Sueldo', value: `+${((costoCalc.costoTotal / costoCalc.sueldoBruto - 1) * 100).toFixed(1)}%`, type: 'info' }
                ]
            };
        },
        legalInfo: `Costo real mensual incluye: Sueldo + Cargas directas (ESSALUD 9%, SCTR, Vida Ley, SENATI si aplica) + Provisiones mensualizadas de beneficios (Gratificaciones, CTS, Vacaciones). Base legal: Ley 26790 (ESSALUD), D.S. 003-97-TR (Beneficios), Ley 27735 (Gratificaciones). El costo real para el empleador es significativamente mayor al sueldo bruto.`
    }
};

// =====================================================================
// FIN DE DATA.JS - SUELDOPRO ULTRA PERÚ 2026
// =====================================================================
