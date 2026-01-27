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
            porDias: 0.50,            // 50% por días trabajados
            porRemuneracion: 0.50     // 50% por remuneración
        },
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
// FUNCIONES AUXILIARES DE CÁLCULO
// =====================================================================

/**
 * Calcula la Asignación Familiar
 * @returns {number} Monto de asignación familiar (10% de RMV)
 */
window.calcularAsignacionFamiliar = function() {
    return PERU_DATA.minWage * 0.10;
};

/**
 * Calcula los descuentos de AFP (Sistema Privado de Pensiones)
 * @param {number} salario - Salario bruto mensual
 * @param {string} afpNombre - Nombre de la AFP (integra, prima, profuturo, habitat)
 * @param {string} tipoComision - Tipo de comisión (flujo o mixta)
 * @param {number} saldoAcumulado - Saldo acumulado en AFP (para comisión mixta)
 * @returns {object} Objeto con aporte, seguro, comisión y total
 */
window.calcularAFP = function(salario, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
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
 * Calcula el Impuesto a la Renta de Quinta Categoría
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} utilidadesMensual - Utilidades mensualizadas
 * @returns {number} Impuesto mensual a retener
 */
window.calcularImpuesto5ta = function(salarioBruto, utilidadesMensual = 0) {
    // Ingreso mensual total
    const ingresoMensual = salarioBruto + utilidadesMensual;
    
    // Proyección anual
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
    return impuestoAnual / 12;
};

/**
 * Calcula el Salario Neto a partir del Bruto
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones de cálculo
 * @returns {object} Objeto con salario neto y detalles
 */
window.calcularSalarioNeto = function(salarioBruto, regimen, opciones = {}) {
    const {
        tieneHijos = false,
        sistemaPension = 'afp',
        afpNombre = 'integra',
        tipoComisionAFP = 'flujo',
        saldoAFP = 0
    } = opciones;
    
    // Asignación Familiar
    const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar 
        ? calcularAsignacionFamiliar() 
        : 0;
    
    const salarioTotal = salarioBruto + asigFamiliar;
    
    // Descuento por pensiones
    let descuentoPension = 0;
    let detallesPension = {};
    
    if (sistemaPension === 'afp') {
        detallesPension = calcularAFP(salarioTotal, afpNombre, tipoComisionAFP, saldoAFP);
        descuentoPension = detallesPension.total;
    } else if (sistemaPension === 'onp') {
        descuentoPension = salarioTotal * PERU_DATA.onp;
        detallesPension = { total: descuentoPension, porcentaje: PERU_DATA.onp };
    }
    
    // Impuesto a la Renta (sobre salario antes de pensiones)
    const impuesto5ta = calcularImpuesto5ta(salarioTotal);
    
    // Salario Neto
    const salarioNeto = salarioTotal - descuentoPension - impuesto5ta;
    
    return {
        salarioBruto,
        asigFamiliar,
        salarioTotal,
        descuentoPension,
        impuesto5ta,
        salarioNeto,
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
    
    return (brutoBajo + brutoAlto) / 2;
};

/**
 * Calcula la CTS (Compensación por Tiempo de Servicios)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @param {number} mesesTrabajados - Meses trabajados en el semestre
 * @returns {object} Objeto con CTS y detalles
 */
window.calcularCTS = function(salarioBruto, asigFamiliar, regimen, mesesTrabajados = 6) {
    if (!regimen.beneficios.cts) {
        return { ctsTotal: 0, detalles: {} };
    }
    
    // Remuneración computable (salario + 1/6 de gratificación + asig. familiar)
    const sextoGratificacion = salarioBruto * regimen.beneficios.gratificacionesFactor * PERU_DATA.cts.sextoGratificacion;
    const remuneracionComputable = salarioBruto + sextoGratificacion + asigFamiliar;
    
    // CTS = (Rem. Computable × Meses / 12) × Factor del régimen
    const ctsBase = (remuneracionComputable * mesesTrabajados) / 12;
    const ctsTotal = ctsBase * regimen.beneficios.ctsFactor;
    
    return {
        ctsTotal,
        detalles: {
            remuneracionComputable,
            sextoGratificacion,
            mesesTrabajados,
            factor: regimen.beneficios.ctsFactor
        }
    };
};

/**
 * Calcula las Gratificaciones (Julio y Diciembre)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} asigFamiliar - Asignación familiar
 * @param {object} regimen - Régimen laboral
 * @returns {object} Objeto con gratificaciones y bonificaciones
 */
window.calcularGratificaciones = function(salarioBruto, asigFamiliar, regimen) {
    if (!regimen.beneficios.gratificaciones) {
        return { gratificacionTotal: 0, bonifEssalud: 0, totalPorGratificacion: 0 };
    }
    
    // Monto de gratificación (salario + asig. familiar) × factor
    const gratificacionBase = (salarioBruto + asigFamiliar) * regimen.beneficios.gratificacionesFactor;
    
    // Bonificación extraordinaria (9% para régimen general)
    const bonifEssalud = gratificacionBase * regimen.essaludBonif;
    
    // Total por gratificación
    const totalPorGratificacion = gratificacionBase + bonifEssalud;
    
    // Total anual (2 gratificaciones)
    const gratificacionTotal = totalPorGratificacion * PERU_DATA.gratificaciones.meses;
    
    return {
        gratificacionBase,
        bonifEssalud,
        totalPorGratificacion,
        gratificacionTotal
    };
};

/**
 * Calcula la Liquidación por Despido
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {number} aniosTrabajados - Años trabajados
 * @param {object} regimen - Régimen laboral
 * @param {string} tipoSalida - Tipo de salida (despido, renuncia, etc.)
 * @returns {object} Objeto con indemnización y detalles
 */
window.calcularLiquidacion = function(salarioBruto, aniosTrabajados, regimen, tipoSalida = 'despido') {
    // CTS pendiente (simplificado)
    const ctsPendiente = (salarioBruto * 1.1667) * 0.5; // Aproximado últimos 6 meses
    
    // Vacaciones truncas (proporcional)
    const diasVacaciones = Math.floor(aniosTrabajados * regimen.beneficios.vacaciones);
    const vacacionesTruncas = (salarioBruto / 30) * diasVacaciones;
    
    // Gratificación trunca (proporcional)
    const mesesGratificacion = (aniosTrabajados - Math.floor(aniosTrabajados)) * 12;
    const gratificacionTrunca = regimen.beneficios.gratificaciones 
        ? (salarioBruto * regimen.beneficios.gratificacionesFactor * mesesGratificacion) / 6 
        : 0;
    
    // Indemnización por despido arbitrario
    let indemnizacion = 0;
    if (tipoSalida === 'despido') {
        indemnizacion = salarioBruto * regimen.beneficios.indemnizacion * aniosTrabajados;
        // Tope: 12 sueldos
        indemnizacion = Math.min(indemnizacion, salarioBruto * 12);
    }
    
    const totalLiquidacion = ctsPendiente + vacacionesTruncas + gratificacionTrunca + indemnizacion;
    
    return {
        ctsPendiente,
        vacacionesTruncas,
        gratificacionTrunca,
        indemnizacion,
        totalLiquidacion
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
    
    const sueldoBruto = salarioBruto + asigFamiliar;
    
    // Cargas Directas Mensuales
    const essalud = sueldoBruto * PERU_DATA.empleador.essalud;
    const vidaLey = sueldoBruto * PERU_DATA.empleador.vidaLey;
    const sctr = sueldoBruto * PERU_DATA.empleador.sctr[nivelRiesgo];
    const senati = aplicaSenati ? sueldoBruto * PERU_DATA.empleador.senati : 0;
    const eps = tieneEPS ? sueldoBruto * PERU_DATA.empleador.eps : 0;
    
    const cargasDirectas = essalud + vidaLey + sctr + senati + eps;
    
    // Provisiones Mensualizadas de Beneficios
    // Gratificaciones: 2 al año + bonif. → mensualizar
    const gratifMensual = regimen.beneficios.gratificaciones 
        ? (sueldoBruto * regimen.beneficios.gratificacionesFactor * 2) / 12 
        : 0;
    const bonifGratif = regimen.beneficios.gratificaciones 
        ? (gratifMensual * regimen.essaludBonif * 2) / 2 
        : 0;
    const provGratificaciones = gratifMensual + bonifGratif;
    
    // CTS: Provisión mensual
    const provCTS = regimen.beneficios.cts 
        ? (sueldoBruto * 1.1667 * regimen.beneficios.ctsFactor) / 12 
        : 0;
    
    // Vacaciones: Provisión mensual
    const provVacaciones = (sueldoBruto * regimen.beneficios.vacacionesFactor) / 12;
    
    const provisionesBeneficios = provGratificaciones + provCTS + provVacaciones;
    
    // Costo Total Mensual
    const costoTotal = sueldoBruto + cargasDirectas + provisionesBeneficios;
    
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
        legalInfo: 'Base legal: D.S. 054-97-EF (AFP), D.Ley 19990 (ONP), TUO Ley del Impuesto a la Renta (D.S. 179-2004-EF). Cálculo mensualizado según legislación vigente 2026.'
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
        legalInfo: 'Cálculo inverso considerando todos los descuentos legales vigentes. Útil para negociaciones salariales y planificación presupuestaria.'
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
        legalInfo: 'CTS según D.S. 001-97-TR. Remuneración computable = Sueldo + 1/6 de gratificación + Asig. Familiar. Depósitos semestrales (Mayo y Noviembre). Factor según régimen: General 100%, Pequeña Empresa 50%, Microempresa 0%.'
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
        legalInfo: 'Gratificaciones según Ley 27735. Dos gratificaciones: Julio (Fiestas Patrias) y Diciembre (Navidad). Bonificación extraordinaria 9% (solo Régimen General). Factor según régimen: General 100%, Pequeña Empresa 50%, Microempresa 0%. Se descuenta AFP/ONP pero NO Impuesto a la Renta.'
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
        legalInfo: 'Liquidación según D.S. 003-97-TR. Incluye: CTS pendiente, vacaciones truncas, gratificación trunca. Indemnización por despido arbitrario: 1.5 sueldos/año (Régimen General), 0.5 (Pequeña Empresa), 0.25 (Microempresa). Tope: 12 remuneraciones. La indemnización es inafecta a AFP/ONP e Impuesto a la Renta.'
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
        legalInfo: 'Participación en utilidades según D.Leg. 892. Distribución: 50% por días trabajados, 50% por remuneración. Porcentajes: Pesquera/Telecom/Industrial 10%, Minería/Comercio/Restaurantes 8%, Transporte/Otros 5%. Tope máximo: 18 remuneraciones mensuales. Empresas con más de 20 trabajadores.'
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
        legalInfo: 'Horas extra según D.S. 007-2002-TR. Valor hora = Sueldo/240. Primeras 2 horas extra diarias: +25%. Horas adicionales: +35%. Límite: 8 horas semanales o trabajo voluntario. Base de cálculo: 48 horas semanales (240 mensuales). Las horas extra están afectas a descuentos AFP/ONP e Impuesto a la Renta.'
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
        legalInfo: 'Costo real mensual incluye: Sueldo + Cargas directas (ESSALUD 9%, SCTR, Vida Ley, SENATI si aplica) + Provisiones mensualizadas de beneficios (Gratificaciones, CTS, Vacaciones). Base legal: Ley 26790 (ESSALUD), D.S. 003-97-TR (Beneficios), Ley 27735 (Gratificaciones). El costo real para el empleador es significativamente mayor al sueldo bruto.'
    }
};

// =====================================================================
// FIN DE DATA.JS - SUELDOPRO ULTRA PERÚ 2026
// =====================================================================
