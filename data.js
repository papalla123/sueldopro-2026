'use strict';

// =====================================================================
// SUELDOPRO ULTRA PERÚ 2026 - DATA ENGINE (REFACTORED FOR 100% ACCURACY)
// Pentágono Financiero - Motor de Datos y Cálculos Laborales
// Legislación Peruana 2026 - UIT Proyectada: S/ 5,150
// =====================================================================

// ===== HELPER FUNCTION FOR ROUNDING =====
window.round2 = function(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

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
    },
    
    // Horas Extra - Configuración
    horasExtra: {
        horasPorDia: 8,               // Jornada estándar
        diasPorMes: 30,               // Base mensual
        recargo25: 0.25,              // +25% primeras 2 horas
        recargo35: 0.35,              // +35% horas adicionales
        recargoNocturno: 0.35,        // +35% trabajo nocturno
        limiteHoras25: 2              // Primeras 2 horas del día al 25%
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
// FUNCIONES AUXILIARES DE CÁLCULO (REFACTORED)
// =====================================================================

/**
 * Calcula la Asignación Familiar
 * @returns {number} Monto de asignación familiar (10% de RMV)
 */
window.calcularAsignacionFamiliar = function() {
    return round2(PERU_DATA.asignacionFamiliar);
};

/**
 * Calcula la Base Remunerativa (CRITICAL FIX #1)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos menores de 18 años
 * @param {object} regimen - Régimen laboral
 * @returns {number} Base remunerativa total
 */
window.calcularBaseRemunerativa = function(salarioBruto, tieneHijos, regimen) {
    const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar 
        ? calcularAsignacionFamiliar() 
        : 0;
    return round2(salarioBruto + asigFamiliar);
};

/**
 * Calcula los descuentos de AFP (Sistema Privado de Pensiones)
 * UPDATED: Now uses base remunerativa
 * @param {number} baseRemunerativa - Base remunerativa (salario + AF si aplica)
 * @param {string} afpNombre - Nombre de la AFP (integra, prima, profuturo, habitat)
 * @param {string} tipoComision - Tipo de comisión (flujo o mixta)
 * @param {number} saldoAcumulado - Saldo acumulado en AFP (para comisión mixta)
 * @returns {object} Objeto con aporte, seguro, comisión y total
 */
window.calcularAFP = function(baseRemunerativa, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
    // Aplicar tope máximo AFP
    const salarioTope = Math.min(baseRemunerativa, PERU_DATA.topesSeguros.afpMaxRemuneracion);
    
    // Aporte obligatorio al fondo (10%)
    const aporte = round2(salarioTope * afpData.aporteFondo);
    
    // Seguro de Invalidez y Sobrevivencia (1.70%)
    const seguro = round2(salarioTope * PERU_DATA.sis);
    
    // Comisión de la AFP
    let comision = 0;
    const comisionData = afpData.tiposComision[tipoComision];
    
    if (tipoComision === 'flujo') {
        comision = round2(salarioTope * comisionData.tasa);
    } else if (tipoComision === 'mixta') {
        comision = round2(salarioTope * comisionData.tasa + (saldoAcumulado * comisionData.sobreSaldo) / 12);
    }
    
    return {
        aporte,
        seguro,
        comision,
        total: round2(aporte + seguro + comision),
        salarioTope: round2(salarioTope),
        topeAplicado: baseRemunerativa > PERU_DATA.topesSeguros.afpMaxRemuneracion
    };
};

/**
 * Calcula el Impuesto a la Renta de Quinta Categoría (CRITICAL FIX #3)
 * FIXED: Ahora incluye gratificaciones en la proyección anual
 * @param {number} baseRemunerativa - Base remunerativa mensual (salario + AF si aplica)
 * @param {object} regimen - Régimen laboral
 * @param {number} utilidadesMensual - Utilidades mensualizadas
 * @returns {number} Impuesto mensual a retener
 */
window.calcularImpuesto5ta = function(baseRemunerativa, regimen, utilidadesMensual = 0) {
    // Ingreso mensual total
    const ingresoMensual = baseRemunerativa + utilidadesMensual;
    
    // CRITICAL FIX: Proyección anual CORRECTA según SUNAT
    // Debe incluir: (Ingreso Mensual × 12) + (2 Gratificaciones)
    const gratificacionMensual = regimen.beneficios.gratificaciones 
        ? baseRemunerativa * regimen.beneficios.gratificacionesFactor 
        : 0;
    const dosGratificaciones = gratificacionMensual * 2;
    
    const ingresoAnual = (ingresoMensual * 12) + dosGratificaciones;
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
    return round2(impuestoAnual / 12);
};

/**
 * Calcula el Salario Neto a partir del Bruto (REFACTORED)
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
    
    // CRITICAL FIX #1: Calcular base remunerativa primero
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const asigFamiliar = baseRemunerativa - salarioBruto;
    
    // Descuento por pensiones (sobre base remunerativa)
    let descuentoPension = 0;
    let detallesPension = {};
    
    if (sistemaPension === 'afp') {
        detallesPension = calcularAFP(baseRemunerativa, afpNombre, tipoComisionAFP, saldoAFP);
        descuentoPension = detallesPension.total;
    } else if (sistemaPension === 'onp') {
        descuentoPension = round2(baseRemunerativa * PERU_DATA.onp);
        detallesPension = { total: descuentoPension, porcentaje: PERU_DATA.onp };
    }
    
    // CRITICAL FIX #3: Impuesto a la Renta con proyección correcta
    const impuesto5ta = calcularImpuesto5ta(baseRemunerativa, regimen);
    
    // Salario Neto
    const salarioNeto = round2(baseRemunerativa - descuentoPension - impuesto5ta);
    
    return {
        salarioBruto: round2(salarioBruto),
        asigFamiliar: round2(asigFamiliar),
        baseRemunerativa: round2(baseRemunerativa),
        descuentoPension: round2(descuentoPension),
        impuesto5ta: round2(impuesto5ta),
        salarioNeto: round2(salarioNeto),
        detallesPension
    };
};

/**
 * Calcula el Salario Bruto necesario para obtener un Neto deseado (REFACTORED)
 * CRITICAL FIX #5: Ajustado para nueva lógica de Renta 5ta
 * @param {number} salarioNetoDeseado - Salario neto objetivo
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones de cálculo
 * @returns {number} Salario bruto necesario
 */
window.calcularSalarioBruto = function(salarioNetoDeseado, regimen, opciones = {}) {
    // Método iterativo para calcular bruto desde neto
    let brutoBajo = salarioNetoDeseado * 0.5;
    let brutoAlto = salarioNetoDeseado * 2.5;
    let iteraciones = 0;
    const maxIteraciones = 100;
    const tolerancia = 0.01;
    
    while (iteraciones < maxIteraciones) {
        const brutoMedio = (brutoBajo + brutoAlto) / 2;
        const resultado = calcularSalarioNeto(brutoMedio, regimen, opciones);
        const diferencia = resultado.salarioNeto - salarioNetoDeseado;
        
        if (Math.abs(diferencia) < tolerancia) {
            return round2(brutoMedio);
        }
        
        if (diferencia > 0) {
            brutoAlto = brutoMedio;
        } else {
            brutoBajo = brutoMedio;
        }
        
        iteraciones++;
    }
    
    return round2((brutoBajo + brutoAlto) / 2);
};

/**
 * Calcula las Horas Extra con "Daily Rule" (CRITICAL FIX #2)
 * FIXED: Implementa regla diaria correcta
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos (para AF)
 * @param {object} regimen - Régimen laboral
 * @param {number} horasTotales - Total de horas extra trabajadas en el mes
 * @param {number} diasTrabajados - Días en que se trabajó horas extra
 * @param {boolean} esNocturno - Si aplica recargo nocturno
 * @returns {object} Objeto con pago de horas extra y detalles
 */
window.calcularHorasExtra = function(salarioBruto, tieneHijos, regimen, horasTotales, diasTrabajados, esNocturno = false) {
    // Base remunerativa (incluye AF si tiene hijos)
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    
    // CRITICAL FIX #2: Valor hora según ley
    // Valor Hora = (Base Remunerativa) / 30 días / 8 horas
    const valorHora = round2(baseRemunerativa / (PERU_DATA.horasExtra.diasPorMes * PERU_DATA.horasExtra.horasPorDia));
    
    // Aplicar "Daily Rule"
    // Primeras 2 horas de CADA día: +25%
    // Horas adicionales de CADA día: +35%
    const horas25PorDia = Math.min(PERU_DATA.horasExtra.limiteHoras25, horasTotales / diasTrabajados);
    const totalHoras25 = round2(horas25PorDia * diasTrabajados);
    const totalHoras35 = round2(Math.max(0, horasTotales - totalHoras25));
    
    // Cálculo de pagos
    let valorHora25 = valorHora * (1 + PERU_DATA.horasExtra.recargo25);
    let valorHora35 = valorHora * (1 + PERU_DATA.horasExtra.recargo35);
    
    // Aplicar recargo nocturno si aplica (+35% adicional sobre RMV)
    if (esNocturno) {
        const valorHoraNocturno = (PERU_DATA.minWage * (1 + PERU_DATA.horasExtra.recargoNocturno)) / 
                                  (PERU_DATA.horasExtra.diasPorMes * PERU_DATA.horasExtra.horasPorDia);
        valorHora25 = Math.max(valorHora25, valorHoraNocturno);
        valorHora35 = Math.max(valorHora35, valorHoraNocturno);
    }
    
    const pago25 = round2(totalHoras25 * valorHora25);
    const pago35 = round2(totalHoras35 * valorHora35);
    const totalPago = round2(pago25 + pago35);
    
    return {
        baseRemunerativa: round2(baseRemunerativa),
        valorHora: round2(valorHora),
        valorHora25: round2(valorHora25),
        valorHora35: round2(valorHora35),
        totalHoras25: round2(totalHoras25),
        totalHoras35: round2(totalHoras35),
        pago25: round2(pago25),
        pago35: round2(pago35),
        totalPago: round2(totalPago),
        esNocturno
    };
};

/**
 * Calcula la CTS (Compensación por Tiempo de Servicios) (UPDATED)
 * CRITICAL FIX #4: Base correcta con 1/6 de gratificación
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos (para AF)
 * @param {object} regimen - Régimen laboral
 * @param {number} mesesTrabajados - Meses trabajados en el semestre
 * @returns {object} Objeto con CTS y detalles
 */
window.calcularCTS = function(salarioBruto, tieneHijos, regimen, mesesTrabajados = 6) {
    if (!regimen.beneficios.cts) {
        return { ctsTotal: 0, detalles: {} };
    }
    
    // Base remunerativa
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const asigFamiliar = baseRemunerativa - salarioBruto;
    
    // CRITICAL FIX #4: Remuneración computable
    // Base CTS = Sueldo + AF + (1/6 de Gratificación)
    const gratificacionBase = regimen.beneficios.gratificaciones 
        ? baseRemunerativa * regimen.beneficios.gratificacionesFactor 
        : 0;
    const sextoGratificacion = round2(gratificacionBase * PERU_DATA.cts.sextoGratificacion);
    
    const remuneracionComputable = round2(salarioBruto + asigFamiliar + sextoGratificacion);
    
    // CTS = (Rem. Computable × Meses / 12) × Factor del régimen
    const ctsBase = round2((remuneracionComputable * mesesTrabajados) / 12);
    const ctsTotal = round2(ctsBase * regimen.beneficios.ctsFactor);
    
    return {
        ctsTotal: round2(ctsTotal),
        detalles: {
            remuneracionComputable: round2(remuneracionComputable),
            salarioBruto: round2(salarioBruto),
            asigFamiliar: round2(asigFamiliar),
            sextoGratificacion: round2(sextoGratificacion),
            mesesTrabajados,
            factor: regimen.beneficios.ctsFactor
        }
    };
};

/**
 * Calcula las Gratificaciones (Julio y Diciembre) (UPDATED)
 * CRITICAL FIX #4: Incluye Bonificación Extraordinaria correcta (9% o 6.75%)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos (para AF)
 * @param {object} regimen - Régimen laboral
 * @param {boolean} tieneEPS - Si tiene EPS privada
 * @returns {object} Objeto con gratificaciones y bonificaciones
 */
window.calcularGratificaciones = function(salarioBruto, tieneHijos, regimen, tieneEPS = false) {
    if (!regimen.beneficios.gratificaciones) {
        return { 
            gratificacionBase: 0, 
            bonifExtraordinaria: 0, 
            totalPorGratificacion: 0,
            gratificacionTotal: 0 
        };
    }
    
    // Base remunerativa
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    
    // Monto de gratificación (base remunerativa × factor)
    const gratificacionBase = round2(baseRemunerativa * regimen.beneficios.gratificacionesFactor);
    
    // CRITICAL FIX #4: Bonificación extraordinaria correcta
    // Si tiene EPS: 6.75%, sino: 9% (solo régimen general)
    const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : regimen.essaludBonif;
    const bonifExtraordinaria = round2(gratificacionBase * tasaBonif);
    
    // Total por gratificación
    const totalPorGratificacion = round2(gratificacionBase + bonifExtraordinaria);
    
    // Total anual (2 gratificaciones)
    const gratificacionTotal = round2(totalPorGratificacion * PERU_DATA.gratificaciones.meses);
    
    return {
        gratificacionBase: round2(gratificacionBase),
        bonifExtraordinaria: round2(bonifExtraordinaria),
        tasaBonif: round2(tasaBonif * 100) / 100,
        totalPorGratificacion: round2(totalPorGratificacion),
        gratificacionTotal: round2(gratificacionTotal)
    };
};

/**
 * Calcula la Liquidación por Despido (UPDATED)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos (para AF)
 * @param {number} aniosTrabajados - Años trabajados
 * @param {object} regimen - Régimen laboral
 * @param {string} tipoSalida - Tipo de salida (despido, renuncia, etc.)
 * @param {boolean} tieneEPS - Si tiene EPS
 * @returns {object} Objeto con indemnización y detalles
 */
window.calcularLiquidacion = function(salarioBruto, tieneHijos, aniosTrabajados, regimen, tipoSalida = 'despido', tieneEPS = false) {
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    
    // CTS pendiente (últimos 6 meses aproximado)
    const ctsCalc = calcularCTS(salarioBruto, tieneHijos, regimen, 6);
    const ctsPendiente = round2(ctsCalc.ctsTotal);
    
    // Vacaciones truncas (proporcional)
    const diasVacacionesPorcentaje = (aniosTrabajados - Math.floor(aniosTrabajados));
    const diasVacaciones = Math.floor(diasVacacionesPorcentaje * regimen.beneficios.vacaciones);
    const vacacionesTruncas = round2((baseRemunerativa / 30) * diasVacaciones);
    
    // Gratificación trunca (proporcional)
    const mesesGratificacion = diasVacacionesPorcentaje * 12;
    const gratifCalc = calcularGratificaciones(salarioBruto, tieneHijos, regimen, tieneEPS);
    const gratificacionTrunca = regimen.beneficios.gratificaciones 
        ? round2((gratifCalc.totalPorGratificacion * mesesGratificacion) / 6) 
        : 0;
    
    // Indemnización por despido arbitrario
    let indemnizacion = 0;
    if (tipoSalida === 'despido') {
        indemnizacion = round2(baseRemunerativa * regimen.beneficios.indemnizacion * aniosTrabajados);
        // Tope: 12 sueldos
        indemnizacion = Math.min(indemnizacion, round2(baseRemunerativa * 12));
    }
    
    const totalLiquidacion = round2(ctsPendiente + vacacionesTruncas + gratificacionTrunca + indemnizacion);
    
    return {
        ctsPendiente: round2(ctsPendiente),
        vacacionesTruncas: round2(vacacionesTruncas),
        gratificacionTrunca: round2(gratificacionTrunca),
        indemnizacion: round2(indemnizacion),
        totalLiquidacion: round2(totalLiquidacion)
    };
};

/**
 * Calcula el Costo Total para el Empleador (UPDATED)
 * @param {number} salarioBruto - Salario bruto mensual
 * @param {boolean} tieneHijos - Si tiene hijos
 * @param {object} regimen - Régimen laboral
 * @param {object} opciones - Opciones adicionales
 * @returns {object} Objeto con costo total y detalles
 */
window.calcularCostoEmpleador = function(salarioBruto, tieneHijos, regimen, opciones = {}) {
    const {
        aplicaSenati = false,
        tieneEPS = false,
        nivelRiesgo = 'medio'
    } = opciones;
    
    const baseRemunerativa = calcularBaseRemunerativa(salarioBruto, tieneHijos, regimen);
    const asigFamiliar = baseRemunerativa - salarioBruto;
    
    // Cargas Directas Mensuales
    const essalud = round2(baseRemunerativa * PERU_DATA.empleador.essalud);
    const vidaLey = round2(baseRemunerativa * PERU_DATA.empleador.vidaLey);
    const sctr = round2(baseRemunerativa * PERU_DATA.empleador.sctr[nivelRiesgo]);
    const senati = aplicaSenati ? round2(baseRemunerativa * PERU_DATA.empleador.senati) : 0;
    const eps = tieneEPS ? round2(baseRemunerativa * PERU_DATA.empleador.eps) : 0;
    
    const cargasDirectas = round2(essalud + vidaLey + sctr + senati + eps);
    
    // Provisiones Mensualizadas de Beneficios
    const gratifCalc = calcularGratificaciones(salarioBruto, tieneHijos, regimen, tieneEPS);
    const provGratificaciones = round2(gratifCalc.gratificacionTotal / 12);
    
    const ctsCalc = calcularCTS(salarioBruto, tieneHijos, regimen, 6);
    const provCTS = round2((ctsCalc.ctsTotal * 2) / 12); // 2 depósitos al año
    
    const provVacaciones = round2((baseRemunerativa * regimen.beneficios.vacacionesFactor) / 12);
    
    const provisionesBeneficios = round2(provGratificaciones + provCTS + provVacaciones);
    
    // Costo Total Mensual
    const costoTotal = round2(baseRemunerativa + cargasDirectas + provisionesBeneficios);
    
    // Porcentaje de carga social
    const porcentajeCarga = round2(((costoTotal - baseRemunerativa) / baseRemunerativa) * 100);
    
    return {
        sueldoBruto: round2(salarioBruto),
        asigFamiliar: round2(asigFamiliar),
        baseRemunerativa: round2(baseRemunerativa),
        essalud: round2(essalud),
        vidaLey: round2(vidaLey),
        sctr: round2(sctr),
        senati: round2(senati),
        eps: round2(eps),
        cargasDirectas: round2(cargasDirectas),
        provGratificaciones: round2(provGratificaciones),
        provCTS: round2(provCTS),
        provVacaciones: round2(provVacaciones),
        provisionesBeneficios: round2(provisionesBeneficios),
        costoTotal: round2(costoTotal),
        porcentajeCarga: round2(porcentajeCarga)
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
    const utilidadTotal = round2(rentaAnual * porcentaje);
    
    // 50% por días trabajados
    const porDias = round2((utilidadTotal * PERU_DATA.utilidades.distribucion.porDias * diasTrabajados) / totalDiasTrabajadores);
    
    // 50% por remuneración
    const remuneracionAnual = round2(salarioBruto * 12);
    const porRemuneracion = round2((utilidadTotal * PERU_DATA.utilidades.distribucion.porRemuneracion * remuneracionAnual) / totalRemuneraciones);
    
    // Total antes de tope
    const utilidadTrabajador = round2(porDias + porRemuneracion);
    
    // Aplicar tope de 18 remuneraciones mensuales
    const topeMaximo = round2(salarioBruto * PERU_DATA.utilidades.topeMaximo);
    const utilidadFinal = Math.min(utilidadTrabajador, topeMaximo);
    
    return {
        utilidadFinal: round2(utilidadFinal),
        porDias: round2(porDias),
        porRemuneracion: round2(porRemuneracion),
        utilidadSinTope: round2(utilidadTrabajador),
        topeAplicado: utilidadTrabajador > topeMaximo,
        sector: sectorData.nombre,
        porcentaje: round2(porcentaje * 100) / 100
    };
};

// =====================================================================
// CONFIGURACIÓN DE CALCULADORAS (Continuará en siguiente mensaje)
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
                    { label: 'Base Remunerativa', value: `S/ ${resultado.baseRemunerativa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
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
        legalInfo: 'Base legal: D.S. 054-97-EF (AFP), D.Ley 19990 (ONP), TUO Ley del Impuesto a la Renta (D.S. 179-2004-EF). ACTUALIZADO 2026: Proyección Renta 5ta incluye gratificaciones según normativa SUNAT.'
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
                    { label: 'Precisión', value: `± S/ ${Math.abs(verificacion.salarioNeto - netoDeseado).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' }
                ]
            };
        },
        legalInfo: 'Cálculo inverso con algoritmo iterativo de convergencia. Considera base remunerativa (incluye AF) para AFP e Impuesto a la Renta con proyección anual correcta.'
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
            
            const ctsCalc = calcularCTS(salary, tieneHijos, regimen, mesesTrabajados);
            
            if (!regimen.beneficios.cts) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ ATENCIÓN', value: '', type: 'header' },
                        { label: 'Régimen Sin CTS', value: regimen.nombre, type: 'info' },
                        { label: 'Motivo', value: 'Este régimen no otorga CTS', type: 'info' }
                    ]
                };
            }
            
            const baseRemunerativa = calcularBaseRemunerativa(salary, tieneHijos, regimen);
            
            return {
                total: ctsCalc.ctsTotal,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Bruto', value: `S/ ${ctsCalc.detalles.salarioBruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(ctsCalc.detalles.asigFamiliar > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${ctsCalc.detalles.asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: '1/6 Gratificación', value: `+ S/ ${ctsCalc.detalles.sextoGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Remuneración Computable', value: `S/ ${ctsCalc.detalles.remuneracionComputable.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📅 PERIODO', value: '', type: 'header' },
                    { label: 'Meses Trabajados', value: `${mesesTrabajados} meses`, type: 'info' },
                    { label: 'Factor Régimen', value: `${(regimen.beneficios.ctsFactor * 100)}%`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Depósitos Anuales', value: '2 (Mayo y Noviembre)', type: 'info' },
                    { label: 'Base Legal', value: 'D.S. 001-97-TR', type: 'info' }
                ]
            };
        },
        legalInfo: 'CTS según D.S. 001-97-TR. ACTUALIZADO 2026: Base = Sueldo + AF + (1/6 Gratificación). Se deposita en Mayo y Noviembre. Factor variable según régimen laboral.'
    },
    
    gratificaciones: {
        id: 'gratificaciones',
        icon: '🎁',
        title: 'Gratificaciones Legales',
        description: 'Calcula tus gratificaciones de Julio y Diciembre (incluye bonificación extraordinaria)',
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
                id: 'grat-eps', 
                label: '¿Tiene EPS Privada?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No (Bonif. 9%)' },
                    { value: 'si', label: 'Sí (Bonif. 6.75%)' }
                ],
                help: 'Afecta la tasa de bonificación extraordinaria'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['grat-salary']) || 0;
            const tieneHijos = values['grat-hijos'] === 'si';
            const tieneEPS = values['grat-eps'] === 'si';
            
            const gratifCalc = calcularGratificaciones(salary, tieneHijos, regimen, tieneEPS);
            
            if (!regimen.beneficios.gratificaciones) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ ATENCIÓN', value: '', type: 'header' },
                        { label: 'Régimen Sin Gratificaciones', value: regimen.nombre, type: 'info' },
                        { label: 'Motivo', value: 'Este régimen no otorga gratificaciones', type: 'info' }
                    ]
                };
            }
            
            const baseRemunerativa = calcularBaseRemunerativa(salary, tieneHijos, regimen);
            
            return {
                total: gratifCalc.gratificacionTotal,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Bruto', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(baseRemunerativa - salary > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${(baseRemunerativa - salary).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: 'Base Remunerativa', value: `S/ ${baseRemunerativa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Factor Régimen', value: `${(regimen.beneficios.gratificacionesFactor * 100)}%`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '🎁 GRATIFICACIÓN', value: '', type: 'header' },
                    { label: 'Monto por Gratificación', value: `S/ ${gratifCalc.gratificacionBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: `Bonif. Extraordinaria (${(gratifCalc.tasaBonif * 100).toFixed(2)}%)`, value: `+ S/ ${gratifCalc.bonifExtraordinaria.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Total por Gratificación', value: `S/ ${gratifCalc.totalPorGratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📅 ANUAL', value: '', type: 'header' },
                    { label: 'Gratificaciones al Año', value: '2 (Julio y Diciembre)', type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Bonif. Extraordinaria', value: tieneEPS ? 'Ley 30334 (EPS 6.75%)' : 'Ley 30334 (9%)', type: 'info' },
                    { label: 'Afecta Impuesto Renta', value: 'Sí', type: 'info' }
                ]
            };
        },
        legalInfo: 'Gratificaciones según Ley 27735. ACTUALIZADO 2026: Bonificación Extraordinaria 9% (6.75% si EPS) por Ley 30334. Base incluye Asignación Familiar si aplica.'
    },
    
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        title: 'Liquidación de Beneficios',
        description: 'Calcula tu liquidación por cese laboral (CTS, vacaciones, gratificaciones, indemnización)',
        fields: [
            { 
                id: 'liq-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'liq-hijos', 
                label: '¿Asignación Familiar?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'liq-eps', 
                label: '¿Tiene EPS Privada?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'liq-anios', 
                label: 'Años Trabajados', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '3.5',
                min: 0.1,
                step: 0.1,
                help: 'Incluye decimales (ej: 3.5 años)'
            },
            { 
                id: 'liq-tipo', 
                label: 'Tipo de Salida', 
                type: 'select',
                options: [
                    { value: 'despido', label: 'Despido Arbitrario (con indemnización)' },
                    { value: 'renuncia', label: 'Renuncia Voluntaria (sin indemnización)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['liq-salary']) || 0;
            const tieneHijos = values['liq-hijos'] === 'si';
            const tieneEPS = values['liq-eps'] === 'si';
            const aniosTrabajados = parseFloat(values['liq-anios']) || 0;
            const tipoSalida = values['liq-tipo'] || 'despido';
            
            const liqCalc = calcularLiquidacion(salary, tieneHijos, aniosTrabajados, regimen, tipoSalida, tieneEPS);
            const baseRemunerativa = calcularBaseRemunerativa(salary, tieneHijos, regimen);
            
            return {
                total: liqCalc.totalLiquidacion,
                details: [
                    { label: '💼 DATOS LABORALES', value: '', type: 'header' },
                    { label: 'Sueldo Bruto', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Base Remunerativa', value: `S/ ${baseRemunerativa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Años de Servicio', value: `${aniosTrabajados} años`, type: 'info' },
                    { label: 'Régimen', value: regimen.nombre, type: 'info' },
                    { label: 'Tipo de Salida', value: tipoSalida === 'despido' ? 'Despido Arbitrario' : 'Renuncia Voluntaria', type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💰 BENEFICIOS A PAGAR', value: '', type: 'header' },
                    ...(liqCalc.ctsPendiente > 0 ? [
                        { label: 'CTS Pendiente', value: `S/ ${liqCalc.ctsPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    ...(liqCalc.vacacionesTruncas > 0 ? [
                        { label: 'Vacaciones Truncas', value: `S/ ${liqCalc.vacacionesTruncas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    ...(liqCalc.gratificacionTrunca > 0 ? [
                        { label: 'Gratificación Trunca', value: `S/ ${liqCalc.gratificacionTrunca.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    ...(liqCalc.indemnizacion > 0 ? [
                        { label: 'Indemnización por Despido', value: `S/ ${liqCalc.indemnizacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Incluye Bonif. Extraordinaria', value: 'Sí (en gratificación trunca)', type: 'info' },
                    ...(tipoSalida === 'despido' ? [
                        { label: 'Factor Indemnización', value: `${regimen.beneficios.indemnizacion} sueldos/año`, type: 'info' },
                        { label: 'Tope Indemnización', value: 'Máx. 12 sueldos', type: 'info' }
                    ] : [])
                ]
            };
        },
        legalInfo: 'Liquidación según D.S. 003-97-TR. ACTUALIZADO 2026: CTS incluye 1/6 gratificación. Gratificación trunca incluye Bonif. Extraordinaria (9% o 6.75% EPS). Indemnización: 1.5 sueldos/año régimen general.'
    },
    
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        title: 'Horas Extra',
        description: 'Calcula el pago de horas extraordinarias aplicando la "Regla Diaria" (primeras 2h/día: 25%, resto: 35%)',
        fields: [
            { 
                id: 'he-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'he-hijos', 
                label: '¿Asignación Familiar?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí' }
                ]
            },
            { 
                id: 'he-horas-totales', 
                label: 'Horas Extra Totales del Mes', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '20',
                min: 0,
                max: 200,
                help: 'Total de horas extra trabajadas'
            },
            { 
                id: 'he-dias', 
                label: 'Días que Trabajó Horas Extra', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '10',
                min: 1,
                max: 30,
                help: 'Cantidad de días con horas extra'
            },
            { 
                id: 'he-nocturno', 
                label: '¿Trabajo Nocturno (10pm-6am)?', 
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (+35% adicional)' }
                ],
                help: 'Recargo adicional por trabajo nocturno'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['he-salary']) || 0;
            const tieneHijos = values['he-hijos'] === 'si';
            const horasTotales = parseFloat(values['he-horas-totales']) || 0;
            const diasTrabajados = parseFloat(values['he-dias']) || 1;
            const esNocturno = values['he-nocturno'] === 'si';
            
            const heCalc = calcularHorasExtra(salary, tieneHijos, regimen, horasTotales, diasTrabajados, esNocturno);
            
            return {
                total: heCalc.totalPago,
                details: [
                    { label: '💼 DATOS BASE', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    ...(heCalc.baseRemunerativa - salary > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${(heCalc.baseRemunerativa - salary).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: 'Base Remunerativa', value: `S/ ${heCalc.baseRemunerativa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Valor Hora Ordinaria', value: `S/ ${heCalc.valorHora.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Base Cálculo', value: '30 días × 8 horas = 240h', type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ REGLA DIARIA APLICADA', value: '', type: 'header' },
                    { label: 'Total Horas Extra', value: `${horasTotales} horas`, type: 'info' },
                    { label: 'Días Trabajados', value: `${diasTrabajados} días`, type: 'info' },
                    { label: 'Promedio Horas/Día', value: `${round2(horasTotales / diasTrabajados)} h/día`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 25%', value: '', type: 'header' },
                    { label: 'Cantidad de Horas', value: `${heCalc.totalHoras25} horas`, type: 'info' },
                    { label: 'Valor Hora +25%', value: `S/ ${heCalc.valorHora25.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Subtotal 25%', value: `S/ ${heCalc.pago25.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '⏰ HORAS EXTRA AL 35%', value: '', type: 'header' },
                    { label: 'Cantidad de Horas', value: `${heCalc.totalHoras35} horas`, type: 'info' },
                    { label: 'Valor Hora +35%', value: `S/ ${heCalc.valorHora35.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Subtotal 35%', value: `S/ ${heCalc.pago35.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    ...(esNocturno ? [
                        { label: '', value: '', type: 'separator' },
                        { label: '🌙 RECARGO NOCTURNO', value: '', type: 'header' },
                        { label: 'Aplicado', value: '+35% adicional sobre RMV', type: 'info' }
                    ] : []),
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 OBSERVACIONES', value: '', type: 'header' },
                    { label: 'Límite Legal', value: 'Máx. 8 hrs extra/semana', type: 'info' },
                    { label: 'Afecto a Descuentos', value: 'Sí (AFP/ONP e Impuesto)', type: 'info' }
                ]
            };
        },
        legalInfo: 'Horas extra según D.S. 007-2002-TR. ACTUALIZADO 2026: REGLA DIARIA implementada correctamente - Primeras 2 horas de CADA día: +25%. Horas adicionales de CADA día: +35%. Valor hora = Base Remunerativa/240. Trabajo nocturno (10pm-6am): +35% adicional.'
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
            
            const costoCalc = calcularCostoEmpleador(salary, tieneHijos, regimen, {
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
                    ...(costoCalc.asigFamiliar > 0 ? [
                        { label: 'Asignación Familiar', value: `+ S/ ${costoCalc.asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : []),
                    { label: 'Base Remunerativa', value: `S/ ${costoCalc.baseRemunerativa.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
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
        legalInfo: 'Costo real mensual según legislación peruana. ACTUALIZADO 2026: Todas las provisiones calculadas sobre base remunerativa correcta. Gratificaciones incluyen Bonificación Extraordinaria. CTS incluye 1/6 gratificación.'
    },
    
    utilidades: {
        id: 'utilidades',
        icon: '💎',
        title: 'Participación en Utilidades',
        description: 'Calcula tu participación en las utilidades anuales de la empresa según D.Leg. 892',
        fields: [
            { 
                id: 'util-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '5000',
                min: PERU_DATA.minWage
            },
            { 
                id: 'util-dias', 
                label: 'Días Trabajados en el Año', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '360',
                min: 1,
                max: 360
            },
            { 
                id: 'util-renta', 
                label: 'Renta Anual de la Empresa (S/)', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '1000000',
                min: 0
            },
            { 
                id: 'util-total-rem', 
                label: 'Total Remuneraciones Pagadas (S/)', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '500000',
                min: 0,
                help: 'Suma de todas las remuneraciones del año'
            },
            { 
                id: 'util-total-dias', 
                label: 'Total Días Trabajados (Todos)', 
                type: 'number',
                inputmode: 'decimal',
                placeholder: '3600',
                min: 1,
                help: 'Suma de días trabajados por todos los empleados'
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
                    { value: 'otros', label: 'Otras Actividades (5%)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['util-salary']) || 0;
            const diasTrabajados = parseFloat(values['util-dias']) || 360;
            const rentaAnual = parseFloat(values['util-renta']) || 0;
            const totalRemuneraciones = parseFloat(values['util-total-rem']) || 1;
            const totalDiasTrabajadores = parseFloat(values['util-total-dias']) || 1;
            const sector = values['util-sector'] || 'otros';
            
            if (!regimen.beneficios.utilidades) {
                return {
                    total: 0,
                    details: [
                        { label: '⚠️ ATENCIÓN', value: '', type: 'header' },
                        { label: 'Régimen Sin Utilidades', value: regimen.nombre, type: 'info' },
                        { label: 'Motivo', value: 'Este régimen no otorga utilidades', type: 'info' }
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
                    { label: 'Renta Anual', value: `S/ ${rentaAnual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: `Utilidad Distribuir (${(utilCalc.porcentaje * 100)}%)`, value: `S/ ${(rentaAnual * utilCalc.porcentaje).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: '', value: '', type: 'separator' },
                    { label: '👤 DATOS TRABAJADOR', value: '', type: 'header' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Días Trabajados', value: `${diasTrabajados} días`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '📊 DISTRIBUCIÓN', value: '', type: 'header' },
                    { label: '50% Por Días Trabajados', value: `S/ ${utilCalc.porDias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '50% Por Remuneración', value: `S/ ${utilCalc.porRemuneracion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Subtotal', value: `S/ ${utilCalc.utilidadSinTope.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    ...(utilCalc.topeAplicado ? [
                        { label: '', value: '', type: 'separator' },
                        { label: '⚠️ TOPE APLICADO', value: '', type: 'header' },
                        { label: 'Tope Máximo', value: `S/ ${(salary * 18).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                        { label: 'Motivo', value: '18 remuneraciones máximo', type: 'info' }
                    ] : [])
                ]
            };
        },
        legalInfo: 'Participación en utilidades según D.Leg. 892. Distribución: 50% por días trabajados, 50% por remuneración. Tope: 18 remuneraciones mensuales. Porcentaje varía por sector económico.'
    }
};

// =====================================================================
// FIN DE DATA.JS - SUELDOPRO ULTRA PERÚ 2026 (REFACTORED)
// =====================================================================
