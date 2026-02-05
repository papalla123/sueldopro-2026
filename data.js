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
    country: 'Perú',
    flag: '🇵🇪',
    currency: 'PEN',
    currencySymbol: 'S/',
    year: 2026,
    minWage: 1025,       // RMV 2026
    asignacionFamiliar: 102.50, // 10% RMV
    uit: 5150,           // UIT 2026
    
    // Motor de Impuestos SUNAT 2026
    impuestos: {
        deduccion: 7, // 7 UIT
        tramos: [
            { limite: 5, tasa: 0.08 },
            { limite: 20, tasa: 0.14 },
            { limite: 35, tasa: 0.17 },
            { limite: 45, tasa: 0.20 },
            { limite: Infinity, tasa: 0.30 }
        ]
    }
};

// Función Auxiliar de Renta de 5ta (Proyección Anual Correcta)
window.calcularRentaQuinta = function(sueldoMensual, asignacionFamiliar) {
    // Proyección de 14 sueldos (12 meses + 2 gratis)
    const ingresoAnual = (sueldoMensual + asignacionFamiliar) * 14;
    const deduccion = 7 * window.PERU_DATA.uit;
    let base = ingresoAnual - deduccion;
    
    if (base <= 0) return 0;
    
    let impuesto = 0;
    const uit = window.PERU_DATA.uit;
    let tramos = window.PERU_DATA.impuestos.tramos;
    
    // Cálculo por tramos acumulativos
    let tramoAnterior = 0;
    for (let t of tramos) {
        let limiteTramo = t.limite * uit;
        let rango = limiteTramo - tramoAnterior;
        
        if (base > 0) {
            let montoAfecto = Math.min(base, rango);
            if (t.limite === Infinity) montoAfecto = base; // Último tramo
            
            impuesto += montoAfecto * t.tasa;
            base -= montoAfecto;
            tramoAnterior = limiteTramo;
        } else {
            break;
        }
    }
    
    return impuesto / 12; // Retención mensual
};
    
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
    // 1. CALCULADORA DE SUELDO NETO (TRABAJADOR)
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Sueldo Neto (Bolsillo)',
        description: 'Calcula cuánto dinero recibirás realmente tras descuentos de AFP/ONP y Renta.',
        fields: [
            { id: 'salary', label: 'Sueldo Bruto Mensual (S/)', type: 'number', inputmode: 'decimal', placeholder: 'Ej. 2500', min: 1025 },
            { id: 'asignacion', label: '¿Tienes hijos menores? (+S/ 102.50)', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: 'Sí (Asig. Familiar)' }] },
            { id: 'system', label: 'Sistema de Pensiones', type: 'select', options: [
                { value: 'onp', label: 'ONP (Sistema Nacional)' },
                { value: 'habitat', label: 'AFP Hábitat (Privado)' },
                { value: 'integra', label: 'AFP Integra (Privado)' },
                { value: 'prima', label: 'AFP Prima (Privado)' },
                { value: 'profuturo', label: 'AFP Profuturo (Privado)' }
            ]}
        ],
        calculate: (values, regimen) => {
            // Lógica de valores
            const salary = parseFloat(values['salary']) || 0;
            const asigFam = values['asignacion'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const totalBruto = salary + asigFam;

            // Tasas AFP/ONP Actualizadas 2026 (Comisión sobre flujo)
            // Nota: Si es comisión mixta, el cálculo varía ligeramente, aquí usamos flujo estándar.
            const rates = {
                onp: { aporte: 0.13, seguro: 0, comision: 0, nombre: 'ONP Ley 19990' },
                habitat: { aporte: 0.10, seguro: 0.0174, comision: 0.0125, nombre: 'AFP Hábitat' }, // Tasas referenciales promedio
                integra: { aporte: 0.10, seguro: 0.0174, comision: 0.0115, nombre: 'AFP Integra' },
                prima: { aporte: 0.10, seguro: 0.0174, comision: 0.0120, nombre: 'AFP Prima' },
                profuturo: { aporte: 0.10, seguro: 0.0174, comision: 0.0135, nombre: 'AFP Profuturo' }
            };

            const selectedSystem = rates[values['system'] || 'onp'];
            
            // Cálculos de Descuentos
            const aporte = totalBruto * selectedSystem.aporte;
            const seguro = totalBruto * selectedSystem.seguro;
            const comision = totalBruto * selectedSystem.comision;
            const totalPension = aporte + seguro + comision;

            // Renta de 5ta Categoría (Solo Régimen General paga impuestos altos, MYPE paga si supera 7UIT)
            // Usamos la función global definida en la Parte 1
            let rentaQuinta = 0;
            if (window.calcularRentaQuinta) {
                rentaQuinta = window.calcularRentaQuinta(salary, asigFam);
            }

            const totalDescuentos = totalPension + rentaQuinta;
            const sueldoNeto = totalBruto - totalDescuentos;

            // Construcción del Reporte Detallado
            return {
                total: sueldoNeto,
                details: [
                    { label: 'INGRESOS', value: '', type: 'header' },
                    { label: 'Sueldo Básico', value: `S/ ${salary.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'ingreso' },
                    { label: 'Asignación Familiar', value: `+ S/ ${asigFam.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'ingreso' },
                    { label: 'TOTAL BRUTO', value: `S/ ${totalBruto.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'base' },
                    
                    { label: 'DESCUENTOS DE LEY', value: '', type: 'separator' },
                    { label: `Fondo Pensiones (${(selectedSystem.aporte*100)}%)`, value: `- S/ ${aporte.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'egreso' },
                    selectedSystem.seguro > 0 ? { label: 'Seguro de Invalidez', value: `- S/ ${seguro.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'egreso' } : null,
                    selectedSystem.comision > 0 ? { label: 'Comisión AFP', value: `- S/ ${comision.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'egreso' } : null,
                    { label: 'Impuesto Renta (5ta)', value: `- S/ ${rentaQuinta.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'egreso' },
                    
                    { label: 'TOTAL DESCUENTOS', value: `- S/ ${totalDescuentos.toLocaleString('es-PE', {minimumFractionDigits: 2})}`, type: 'subtotal' }
                ].filter(Boolean), // Filtra nulos
                legalInfo: `Cálculo basado en tasas SBS 2026 y TUO Ley Impuesto a la Renta. El sistema seleccionado es ${selectedSystem.nombre}.`
            };
        }
    },

    // 2. CALCULADORA DE CTS (COMPENSACIÓN TIEMPO DE SERVICIOS)
    cts: {
        id: 'cts',
        title: 'Cálculo CTS',
        icon: '🐖',
        description: 'Depositos semestrales (Mayo y Noviembre). Tu seguro de desempleo.',
        fields: [
            { id: 'cts-salary', label: 'Sueldo al 30 de Abril/Octubre', type: 'number', placeholder: 'Ej. 2500' },
            { id: 'cts-asignacion', label: 'Asignación Familiar', type: 'select', options: [{value:'no', label:'No'}, {value:'si', label:'Sí'}] },
            { id: 'cts-months', label: 'Meses computables (Máx 6)', type: 'number', placeholder: '6', max: 6 },
            { id: 'cts-gratification', label: 'Monto de última Gratificación', type: 'number', placeholder: 'Ej. 2500 (Opcional)', description: 'Si no ingresas, se estima.' }
        ],
        calculate: (values, regimen) => {
            // Regla Microempresa: NO TIENE CTS
            if (regimen.id === 'micro') {
                return { 
                    total: 0, 
                    details: [
                        { label: 'RÉGIMEN MICROEMPRESA', value: 'Sin Beneficio', type: 'header' },
                        { label: 'Explicación', value: 'La Ley MYPE excluye CTS para microempresas.', type: 'info' }
                    ],
                    legalInfo: 'Según Ley MYPE, las microempresas no están obligadas al pago de CTS.' 
                };
            }

            const salary = parseFloat(values['cts-salary']) || 0;
            const asigFam = values['cts-asignacion'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const months = Math.min(parseFloat(values['cts-months']) || 0, 6);
            
            // Remuneración Computable
            const remuneracionBasica = salary + asigFam;
            
            // 1/6 de la Gratificación (Ley de CTS)
            // Si el usuario puso un monto de grati manual, usamos ese. Si no, estimamos (Sueldo + Asig).
            let userGrati = parseFloat(values['cts-gratification']);
            let sextoGrati = 0;
            
            if (!isNaN(userGrati)) {
                sextoGrati = userGrati / 6;
            } else {
                // Estimación automática
                sextoGrati = remuneracionBasica / 6;
            }

            const baseComputable = remuneracionBasica + sextoGrati;
            
            // Factor Régimen (Pequeña empresa = 50%, General = 100%)
            const factor = regimen.beneficios.ctsFactor; // viene del data.js Parte 1
            
            // Fórmula: (Base / 12) * Meses * Factor
            const ctsTotal = (baseComputable / 12) * months * factor;

            return {
                total: ctsTotal,
                details: [
                    { label: 'REMUNERACIÓN COMPUTABLE', value: '', type: 'header' },
                    { label: 'Sueldo Básico', value: `S/ ${salary.toFixed(2)}`, type: 'ingreso' },
                    { label: 'Asignación Familiar', value: `+ S/ ${asigFam.toFixed(2)}`, type: 'ingreso' },
                    { label: '1/6 de Gratificación', value: `+ S/ ${sextoGrati.toFixed(2)}`, type: 'ingreso' },
                    { label: 'Base de Cálculo', value: `S/ ${baseComputable.toFixed(2)}`, type: 'base' },
                    { label: '', value: '', type: 'separator' },
                    { label: 'CÁLCULO FINAL', value: '', type: 'header' },
                    { label: 'Factor Régimen', value: `${factor * 100}%`, type: 'info' },
                    { label: 'Meses Laborados', value: `${months} meses`, type: 'info' },
                    { label: 'Monto a Depositar', value: `S/ ${ctsTotal.toFixed(2)}`, type: 'subtotal' }
                ],
                legalInfo: 'D.S. 001-97-TR. La CTS se deposita en la quincena de Mayo y Noviembre.'
            };
        }
    },

    // 3. CALCULADORA DE GRATIFICACIONES
    grati: {
        id: 'grati',
        title: 'Gratificación Fiestas/Navidad',
        icon: '🎁',
        description: 'Julio y Diciembre. Incluye Bono Ley 29351 (9% o 6.75%).',
        fields: [
            { id: 'grati-salary', label: 'Sueldo al 30 de Junio/Noviembre', type: 'number', placeholder: 'Ej. 2500' },
            { id: 'grati-asignacion', label: 'Asignación Familiar', type: 'select', options: [{value:'no', label:'No'}, {value:'si', label:'Sí'}] },
            { id: 'grati-months', label: 'Meses trabajados en el semestre', type: 'number', placeholder: '6', max: 6 },
            { id: 'grati-seguro', label: 'Tipo de Seguro Médico', type: 'select', options: [{value:'essalud', label:'EsSalud (Bono 9%)'}, {value:'eps', label:'EPS (Bono 6.75%)'}] }
        ],
        calculate: (values, regimen) => {
            // Regla Microempresa: NO TIENE GRATIFICACIÓN
            if (regimen.id === 'micro') {
                return { total: 0, details: [{ label: 'RÉGIMEN MICROEMPRESA', value: 'Sin Beneficio', type: 'info' }], legalInfo: 'Ley MYPE excluye Gratificaciones.' };
            }

            const salary = parseFloat(values['grati-salary']) || 0;
            const asigFam = values['grati-asignacion'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const months = Math.min(parseFloat(values['grati-months']) || 0, 6);
            
            // Remuneración Computable
            const baseComputable = salary + asigFam; // Promedio de horas extras se agregaría aquí si fuera muy complejo, simplificamos.

            // Factor (Pequeña = 50%, General = 100%)
            const factor = regimen.beneficios.gratificacionesFactor;
            
            // Grati Bruta
            const gratiBruta = (baseComputable / 6) * months * factor;

            // Bono Ley 29351 (No sujeto a descuento)
            const bonoPorcentaje = values['grati-seguro'] === 'eps' ? 0.0675 : 0.09;
            const bonoLey = gratiBruta * bonoPorcentaje;

            return {
                total: gratiBruta + bonoLey,
                details: [
                    { label: 'REMUNERACIÓN', value: '', type: 'header' },
                    { label: 'Sueldo + Asig. Fam.', value: `S/ ${baseComputable.toFixed(2)}`, type: 'base' },
                    { label: 'CÁLCULO', value: '', type: 'separator' },
                    { label: 'Gratificación Base', value: `S/ ${gratiBruta.toFixed(2)}`, type: 'ingreso' },
                    { label: `Bono Ley (${(bonoPorcentaje*100)}%)`, value: `+ S/ ${bonoLey.toFixed(2)}`, type: 'ingreso' },
                    { label: 'Total a Recibir', value: `S/ ${(gratiBruta + bonoLey).toFixed(2)}`, type: 'subtotal' }
                ],
                legalInfo: 'Ley 27735. El Bono Extraordinario reemplaza el aporte que el empleador haría a EsSalud.'
            };
        }
    },

    // 4. CALCULADORA DE HORAS EXTRAS
    horasExtras: {
        id: 'horasExtras',
        title: 'Horas Extras',
        icon: '⏰',
        description: 'Calculadora de sobretiempo al 25% y 35% según jornada legal.',
        fields: [
            { id: 'he-salary', label: 'Sueldo Bruto', type: 'number', placeholder: '2500' },
            { id: 'he-hijos', label: 'Asignación Familiar', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'si', label: 'Sí' }]},
            { id: 'he-hours-25', label: 'N° Horas al 25% (Primeras 2)', type: 'number', placeholder: '0' },
            { id: 'he-hours-35', label: 'N° Horas al 35% (A partir de la 3ra)', type: 'number', placeholder: '0' }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['he-salary']) || 0;
            const asigFam = values['he-hijos'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const h25 = parseFloat(values['he-hours-25']) || 0;
            const h35 = parseFloat(values['he-hours-35']) || 0;

            const remuneracionMensual = salary + asigFam;
            const valorHora = remuneracionMensual / 240; // Divisor legal estándar

            const tarifa25 = valorHora * 1.25;
            const tarifa35 = valorHora * 1.35;

            const monto25 = h25 * tarifa25;
            const monto35 = h35 * tarifa35;

            return {
                total: monto25 + monto35,
                details: [
                    { label: 'VALORIZACIÓN', value: '', type: 'header' },
                    { label: 'Remuneración Mensual', value: `S/ ${remuneracionMensual.toFixed(2)}`, type: 'base' },
                    { label: 'Valor Hora Ordinaria', value: `S/ ${valorHora.toFixed(2)}`, type: 'info' },
                    { label: 'CÁLCULO SOBRETIEMPO', value: '', type: 'separator' },
                    { label: `Horas 25% (${h25} hrs)`, value: `S/ ${monto25.toFixed(2)}`, type: 'ingreso' },
                    { label: `Horas 35% (${h35} hrs)`, value: `S/ ${monto35.toFixed(2)}`, type: 'ingreso' },
                    { label: 'Total Extra Bruto', value: `S/ ${(monto25 + monto35).toFixed(2)}`, type: 'subtotal' }
                ],
                legalInfo: 'D. Leg. 854. El sobretiempo es voluntario. Las dos primeras horas tienen recargo del 25%, las siguientes del 35%.'
            };
        }
    },

    // 5. CALCULADORA DE LIQUIDACIÓN DE BENEFICIOS SOCIALES
    liquidacion: {
        id: 'liquidacion',
        title: 'Liquidación Total',
        icon: '🤝',
        description: 'Calcula CTS trunca, Vacaciones truncas y Grati trunca al cesar.',
        fields: [
            { id: 'liq-salary', label: 'Sueldo Bruto', type: 'number', placeholder: '2500' },
            { id: 'liq-asig', label: 'Asignación Familiar', type: 'select', options: [{value:'no', label:'No'}, {value:'si', label:'Sí'}] },
            { id: 'liq-meses', label: 'Meses trabajados (Periodo trunco)', type: 'number', placeholder: 'Ej. 5' },
            { id: 'liq-dias', label: 'Días trabajados (Adicionales)', type: 'number', placeholder: 'Ej. 12' },
            { id: 'liq-vac-pen', label: 'Vacaciones Vencidas (No gozadas)', type: 'number', placeholder: 'Días pendientes (Ej. 15)' }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['liq-salary']) || 0;
            const asigFam = values['liq-asig'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const meses = parseFloat(values['liq-meses']) || 0;
            const dias = parseFloat(values['liq-dias']) || 0;
            const vacPendientes = parseFloat(values['liq-vac-pen']) || 0;

            const base = salary + asigFam;

            // --- CTS TRUNCA ---
            let ctsTotal = 0;
            if (regimen.id !== 'micro') {
                const baseCTS = base + (base/6);
                const factorCTS = regimen.beneficios.ctsFactor;
                const ctsMeses = (baseCTS / 12) * meses * factorCTS;
                const ctsDias = (baseCTS / 12 / 30) * dias * factorCTS;
                ctsTotal = ctsMeses + ctsDias;
            }

            // --- GRATI TRUNCA ---
            let gratiTotal = 0;
            let bonoTotal = 0;
            if (regimen.id !== 'micro') {
                const factorGrati = regimen.beneficios.gratificacionesFactor;
                const gratiMeses = (base / 6) * meses * factorGrati;
                // La grati trunca legalmente se paga por mes calendario completo, pero algunas empresas pagan días.
                // Aquí calculamos estricto por mes completo según ley, pero agregaremos días para flexibilidad.
                const gratiDias = (base / 6 / 30) * dias * factorGrati;
                gratiTotal = gratiMeses + gratiDias;
                bonoTotal = gratiTotal * 0.09; // Bono Ley
            }

            // --- VACACIONES TRUNCAS ---
            // Microempresa tiene 15 días de vacaciones al año, General tiene 30.
            const diasVacacionesAnual = regimen.id === 'general' ? 30 : 15;
            const valorDiaVacaciones = base / 30;
            
            // Vacaciones Truncas (proporcional al tiempo trabajado hoy)
            const tiempoComputableAnios = (meses / 12) + (dias / 360);
            const diasGanadosTruncos = tiempoComputableAnios * diasVacacionesAnual;
            const montoVacTruncas = diasGanadosTruncos * valorDiaVacaciones;

            // Vacaciones Vencidas (de años pasados no gozadas)
            const montoVacVencidas = vacPendientes * valorDiaVacaciones;

            const totalVacacionesBruto = montoVacTruncas + montoVacVencidas;
            // Las vacaciones SI tienen descuento de AFP/ONP (aprox 13% promedio para la estimación)
            const descuentoVacaciones = totalVacacionesBruto * 0.13; 
            const totalVacacionesNeto = totalVacacionesBruto - descuentoVacaciones;

            const granTotal = ctsTotal + gratiTotal + bonoTotal + totalVacacionesNeto;

            return {
                total: granTotal,
                details: [
                    { label: 'CTS TRUNCA', value: `S/ ${ctsTotal.toFixed(2)}`, type: 'ingreso' },
                    { label: 'GRATIFICACIÓN TRUNCA', value: `S/ ${gratiTotal.toFixed(2)}`, type: 'ingreso' },
                    { label: 'BONO LEY (9%)', value: `S/ ${bonoTotal.toFixed(2)}`, type: 'ingreso' },
                    { label: 'VACACIONES', value: '', type: 'separator' },
                    { label: 'Vac. Truncas', value: `S/ ${montoVacTruncas.toFixed(2)}`, type: 'info' },
                    { label: 'Vac. Pendientes', value: `S/ ${montoVacVencidas.toFixed(2)}`, type: 'info' },
                    { label: 'Deducción Pensión (~13%)', value: `- S/ ${descuentoVacaciones.toFixed(2)}`, type: 'egreso' },
                    { label: 'Vacaciones Netas', value: `S/ ${totalVacacionesNeto.toFixed(2)}`, type: 'ingreso' },
                    { label: 'LIQUIDACIÓN NET A PAGAR', value: `S/ ${granTotal.toFixed(2)}`, type: 'subtotal' }
                ],
                legalInfo: 'Pago dentro de las 48 horas del cese. CTS y Grati Trunca no tienen descuentos. Vacaciones sí pagan AFP/ONP.'
            };
        }
    },

    // 6. CALCULADORA DE COSTO LABORAL (EMPLEADOR) - LA "ULTRA"
    costo: {
        id: 'costo',
        title: 'Costo Laboral Empresa',
        icon: '🏭',
        description: '¿Cuánto le cuesta realmente un empleado a la empresa?',
        fields: [
            { id: 'costo-salary', label: 'Sueldo Bruto Ofertado', type: 'number', placeholder: '2500' },
            { id: 'costo-asig', label: 'Asignación Familiar', type: 'select', options: [{value:'no', label:'No'}, {value:'si', label:'Sí'}] },
            { id: 'costo-riesgo', label: 'SCTR (Trabajo de Riesgo)', type: 'select', options: [{value:'no', label:'No'}, {value:'si', label:'Sí (Aprox 1.5%)'}] },
            { id: 'costo-vidaley', label: 'Seguro Vida Ley', type: 'select', options: [{value:'si', label:'Sí (Obligatorio desde día 1)'}, {value:'no', label:'No (Riesgo multa)'}] }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['costo-salary']) || 0;
            const asigFam = values['costo-asig'] === 'si' ? window.PERU_DATA.asignacionFamiliar : 0;
            const totalRemuneracion = salary + asigFam;

            // 1. Aportes Mensuales Directos
            // EsSalud: 9% (Microempresa paga SIS que es casi 0 o subsidiado, pero asumiremos regla MYPE estándar 9% para Pequeña/General)
            // En Microempresa inscrita en REMYPE, el empleador paga SIS (S/ 15 aprox), pero aquí usaremos lógica general para ilustrar costo.
            let essalud = totalRemuneracion * 0.09;
            if (regimen.id === 'micro') essalud = 15; // Costo SIS Emprendedor aprox fijo

            let sctr = values['costo-riesgo'] === 'si' ? totalRemuneracion * 0.015 : 0; // Promedio mercado
            let vidaLey = values['costo-vidaley'] === 'si' ? totalRemuneracion * 0.007 : 0; // Promedio mercado

            const aportesMensuales = essalud + sctr + vidaLey;

            // 2. Provisiones Mensuales (Reserva para beneficios futuros)
            // Gratificaciones: 2 al año / 12 meses + Bono 9%
            let factorGrati = regimen.beneficios.gratificacionesFactor; // 100%, 50% o 0%
            let provGrati = 0;
            if (factorGrati > 0) {
                const gratiAnual = (totalRemuneracion * 2 * factorGrati);
                const bonoAnual = gratiAnual * 0.09;
                provGrati = (gratiAnual + bonoAnual) / 12;
            }

            // CTS: 1 al año aprox / 12 meses
            let factorCTS = regimen.beneficios.ctsFactor;
            let provCTS = 0;
            if (factorCTS > 0) {
                const computoCTS = totalRemuneracion + (provGrati / 1.09 / 6); // Base + 1/6 grati
                provCTS = (computoCTS * 2 * factorCTS) / 12; // 2 depositos al año
                // Ajuste simplificado: (Sueldo + 1/6 Grati) / 12
                provCTS = (totalRemuneracion + (totalRemuneracion/6)) / 12 * factorCTS;
            }

            // Vacaciones: 30 días o 15 días
            let factorVac = regimen.id === 'general' ? 1 : 0.5;
            let provVac = (totalRemuneracion * factorVac) / 12;

            const provisiones = provGrati + provCTS + provVac;
            const costoTotal = totalRemuneracion + aportesMensuales + provisiones;
            const sobrecosto = costoTotal - totalRemuneracion;
            const porcentajeSobrecosto = (sobrecosto / totalRemuneracion) * 100;

            return {
                total: costoTotal,
                details: [
                    { label: 'REMUNERACIÓN', value: '', type: 'header' },
                    { label: 'Sueldo + Asig.', value: `S/ ${totalRemuneracion.toFixed(2)}`, type: 'base' },
                    
                    { label: 'APORTES MENSUALES', value: '', type: 'separator' },
                    { label: regimen.id === 'micro' ? 'SIS Emprendedor' : 'EsSalud (9%)', value: `+ S/ ${essalud.toFixed(2)}`, type: 'costo' },
                    sctr > 0 ? { label: 'SCTR', value: `+ S/ ${sctr.toFixed(2)}`, type: 'costo' } : null,
                    vidaLey > 0 ? { label: 'Vida Ley', value: `+ S/ ${vidaLey.toFixed(2)}`, type: 'costo' } : null,

                    { label: 'PROVISIONES (RESERVA)', value: '', type: 'separator' },
                    { label: 'Gratificación + Bono', value: `+ S/ ${provGrati.toFixed(2)}`, type: 'costo' },
                    { label: 'CTS', value: `+ S/ ${provCTS.toFixed(2)}`, type: 'costo' },
                    { label: 'Vacaciones', value: `+ S/ ${provVac.toFixed(2)}`, type: 'costo' },

                    { label: 'RESUMEN FINAL', value: '', type: 'header' },
                    { label: 'Sobrecosto Laboral', value: `+${porcentajeSobrecosto.toFixed(1)}%`, type: 'info' },
                    { label: 'COSTO TOTAL MENSUAL', value: `S/ ${costoTotal.toFixed(2)}`, type: 'subtotal' }
                ].filter(Boolean),
                legalInfo: 'Incluye costos directos (EsSalud) y provisiones (reservas para pagar Grati, CTS y Vacaciones en el futuro).'
            };
        }
    }
};
// FIN DE DATA.JS
// =====================================================================
// FIN DE DATA.JS - SUELDOPRO ULTRA PERÚ 2026
// =====================================================================
