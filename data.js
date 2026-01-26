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
    
    // Salario Mínimo Vital proyectado 2026
    minWage: 1075,
    
    // Asignación Familiar (10% del salario mínimo)
    asignacionFamiliar: 107.50,
    
    // AFP - Datos Reales 2026 (Actualizado con SBS)
    sis: 0.0170, // Seguro de Invalidez y Sobrevivencia (1.70% global - Actualizable)
    
    afp: {
        integra: {
            nombre: 'AFP Integra',
            aporteFondo: 0.10,     // 10% Fondo de Pensiones
            tiposComision: {
                flujo: {
                    nombre: 'Comisión sobre Flujo',
                    tasa: 0.0082,      // 0.82% sobre remuneración
                    sobreSaldo: 0      // No aplica componente sobre saldo
                },
                mixta: {
                    nombre: 'Comisión Mixta',
                    tasa: 0.0047,      // 0.47% sobre remuneración
                    sobreSaldo: 1.25   // 1.25% anual sobre saldo (mensualizado)
                }
            }
        },
        prima: {
            nombre: 'AFP Prima',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: {
                    nombre: 'Comisión sobre Flujo',
                    tasa: 0.0160,      // 1.60%
                    sobreSaldo: 0
                },
                mixta: {
                    nombre: 'Comisión Mixta',
                    tasa: 0.0038,      // 0.38% sobre remuneración
                    sobreSaldo: 1.25   // 1.25% anual sobre saldo
                }
            }
        },
        profuturo: {
            nombre: 'AFP Profuturo',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: {
                    nombre: 'Comisión sobre Flujo',
                    tasa: 0.0169,      // 1.69%
                    sobreSaldo: 0
                },
                mixta: {
                    nombre: 'Comisión Mixta',
                    tasa: 0.0047,      // 0.47% sobre remuneración
                    sobreSaldo: 1.20   // 1.20% anual sobre saldo
                }
            }
        },
        habitat: {
            nombre: 'AFP Habitat',
            aporteFondo: 0.10,
            tiposComision: {
                flujo: {
                    nombre: 'Comisión sobre Flujo',
                    tasa: 0.0147,      // 1.47%
                    sobreSaldo: 0
                },
                mixta: {
                    nombre: 'Comisión Mixta',
                    tasa: 0.0047,      // 0.47% sobre remuneración
                    sobreSaldo: 1.25   // 1.25% anual sobre saldo
                }
            }
        }
    },
    
    // ONP
    onp: 0.13,  // 13%
    
    // Impuesto a la Renta - 5ta Categoría (anual)
    rentaQuinta: {
        uit: 5150,  // UIT 2026 proyectada
        tramos: [
            { hasta: 5, tasa: 0.08 },      // Hasta 5 UIT: 8%
            { hasta: 20, tasa: 0.14 },     // 5-20 UIT: 14%
            { hasta: 35, tasa: 0.17 },     // 20-35 UIT: 17%
            { hasta: 45, tasa: 0.20 },     // 35-45 UIT: 20%
            { desde: 45, tasa: 0.30 }      // Más de 45 UIT: 30%
        ],
        deduccion: 7  // 7 UIT deducibles
    },
    
    // Gratificaciones (Ley 27735)
    gratificaciones: {
        meses: 2,  // Julio y Diciembre
        bonifExtEssalud: 0.09,   // 9% ESSALUD (Bonificación Extraordinaria)
        bonifExtEPS: 0.0675      // 6.75% EPS (si aplica)
    },
    
    // CTS (D.S. 001-97-TR)
    cts: {
        depositosMensuales: 2,   // Mayo (Nov-Abr) y Noviembre (May-Oct)
        sextoGratificacion: 1/6  // Factor para 1/6 de gratificación
    },
    
    // Vacaciones (D.Leg. 713)
    vacaciones: {
        diasPorAnio: 30,
        provisionMensual: 1/12   // Factor de provisión mensual
    },
    
    // Costos del Empleador (Actualizado 2026)
    empleador: {
        essalud: 0.09,         // 9% ESSALUD
        vidaLey: 0.0053,       // 0.53% Vida Ley (promedio)
        sctr: {
            minimo: 0.0053,    // 0.53% (riesgo bajo)
            medio: 0.0071,     // 0.71% (riesgo medio)
            alto: 0.0118       // 1.18% (riesgo alto)
        },
        senati: 0.0075,        // 0.75% solo industria/construcción
        eps: 0.0225            // 2.25% adicional si tiene EPS
    },
    
    // Utilidades por Sector (D.Leg. 892)
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
            porDias: 0.50,         // 50% según días trabajados
            porRemuneracion: 0.50  // 50% según remuneración
        },
        topeMaximo: 18  // 18 remuneraciones mensuales (tope legal)
    }
};

// ===== REGÍMENES LABORALES PERÚ =====
window.REGIMENES_PERU = {
    general: {
        id: 'general',
        nombre: 'Régimen General',
        icon: '🏢',
        descripcion: 'Régimen completo - Todos los beneficios laborales',
        limites: {
            trabajadores: null,  // Sin límite
            ventasAnuales: null
        },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 1.0,  // 100%
            cts: true,
            ctsFactor: 1.0,              // 100%
            vacaciones: 30,
            vacacionesFactor: 1.0,       // 100%
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 1.5           // 1.5 sueldos por año
        },
        essaludBonif: 0.09  // 9% bonificación gratificaciones
    },
    
    pequena: {
        id: 'pequena',
        nombre: 'Pequeña Empresa',
        icon: '🏪',
        descripcion: 'Entre 1-100 trabajadores, ventas anuales hasta 1700 UIT',
        limites: {
            trabajadores: 100,
            ventasAnuales: 1700  // UIT
        },
        beneficios: {
            gratificaciones: true,
            gratificacionesFactor: 0.5,  // 50% (media gratificación)
            cts: true,
            ctsFactor: 0.5,              // 50% (15 días por año)
            vacaciones: 15,
            vacacionesFactor: 0.5,       // 50%
            asignacionFamiliar: true,
            utilidades: true,
            indemnizacion: 0.5           // 0.5 sueldos por año (20 días x año)
        },
        essaludBonif: 0.0  // Sin bonificación
    },
    
    micro: {
        id: 'micro',
        nombre: 'Microempresa',
        icon: '🏠',
        descripcion: 'Entre 1-10 trabajadores, ventas anuales hasta 150 UIT',
        limites: {
            trabajadores: 10,
            ventasAnuales: 150  // UIT
        },
        beneficios: {
            gratificaciones: false,
            gratificacionesFactor: 0,
            cts: false,
            ctsFactor: 0,
            vacaciones: 15,
            vacacionesFactor: 0.5,
            asignacionFamiliar: false,
            utilidades: false,
            indemnizacion: 0.25          // 10 días por año
        },
        essaludBonif: 0.0
    }
};

// ===== FUNCIONES AUXILIARES DE CÁLCULO =====

// Calcula Asignación Familiar dinámica (10% del SMV)
window.calcularAsignacionFamiliar = function() {
    return PERU_DATA.minWage * 0.10;
};

// Calcula descuentos AFP según tipo de comisión
window.calcularAFP = function(salario, afpNombre, tipoComision, saldoAcumulado = 0) {
    const afpData = PERU_DATA.afp[afpNombre];
    if (!afpData) return { aporte: 0, seguro: 0, comision: 0, total: 0 };
    
    const aporte = salario * afpData.aporteFondo;
    const seguro = salario * PERU_DATA.sis;
    
    let comision = 0;
    const comisionData = afpData.tiposComision[tipoComision];
    
    if (tipoComision === 'flujo') {
        comision = salario * comisionData.tasa;
    } else if (tipoComision === 'mixta') {
        const comisionFlujo = salario * comisionData.tasa;
        const comisionSaldo = (saldoAcumulado * comisionData.sobreSaldo) / 12; // Anual mensualizado
        comision = comisionFlujo + comisionSaldo;
    }
    
    return {
        aporte: aporte,
        seguro: seguro,
        comision: comision,
        total: aporte + seguro + comision
    };
};

// Calcula Gratificaciones según Ley 27735
window.calcularGratificacion = function(salario, asigFamiliar, mesesTrabajados, regimen, tieneEPS = false) {
    if (!regimen.beneficios.gratificaciones) {
        return { gratificacion: 0, bonifExt: 0, total: 0 };
    }
    
    const remuneracionComputable = salario + asigFamiliar;
    const gratificacionCompleta = (remuneracionComputable * mesesTrabajados) / 6;
    const gratificacion = gratificacionCompleta * regimen.beneficios.gratificacionesFactor;
    
    // Bonificación Extraordinaria (9% ESSALUD o 6.75% EPS) - INGRESO PARA EL TRABAJADOR
    const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : PERU_DATA.gratificaciones.bonifExtEssalud;
    const bonifExt = gratificacion * tasaBonif;
    
    return {
        gratificacion: gratificacion,
        bonifExt: bonifExt,
        total: gratificacion + bonifExt
    };
};

// Calcula CTS con sexto de gratificación (D.S. 001-97-TR)
window.calcularCTS = function(salario, asigFamiliar, mesesTrabajados, regimen) {
    if (!regimen.beneficios.cts) {
        return { cts: 0, sextoGrati: 0, remComputable: 0 };
    }
    
    const sextoGrati = salario * PERU_DATA.cts.sextoGratificacion;
    const remComputable = salario + asigFamiliar + sextoGrati;
    const ctsCompleto = (remComputable * mesesTrabajados) / 12;
    const cts = ctsCompleto * regimen.beneficios.ctsFactor;
    
    return {
        cts: cts,
        sextoGrati: sextoGrati,
        remComputable: remComputable
    };
};

// Calcula Costo Total del Empleador (Carga Social)
window.calcularCostoEmpleador = function(salario, asigFamiliar, regimen, opciones = {}) {
    const {
        aplicaSenati = false,
        tieneEPS = false,
        nivelRiesgo = 'medio' // 'minimo', 'medio', 'alto'
    } = opciones;
    
    const sueldoBruto = salario + asigFamiliar;
    
    // Cargas directas sobre planilla
    const essalud = sueldoBruto * PERU_DATA.empleador.essalud;
    const vidaLey = sueldoBruto * PERU_DATA.empleador.vidaLey;
    const sctr = sueldoBruto * PERU_DATA.empleador.sctr[nivelRiesgo];
    const senati = aplicaSenati ? sueldoBruto * PERU_DATA.empleador.senati : 0;
    const eps = tieneEPS ? sueldoBruto * PERU_DATA.empleador.eps : 0;
    
    // Provisiones mensuales de beneficios
    let provGratificaciones = 0;
    if (regimen.beneficios.gratificaciones) {
        const gratAnual = (sueldoBruto * 2 * regimen.beneficios.gratificacionesFactor);
        const tasaBonif = tieneEPS ? PERU_DATA.gratificaciones.bonifExtEPS : PERU_DATA.gratificaciones.bonifExtEssalud;
        const bonifAnual = gratAnual * tasaBonif;
        provGratificaciones = (gratAnual + bonifAnual) / 12;
    }
    
    let provCTS = 0;
    if (regimen.beneficios.cts) {
        const sextoGrati = sueldoBruto * PERU_DATA.cts.sextoGratificacion;
        const remComputable = sueldoBruto + sextoGrati;
        provCTS = (remComputable * regimen.beneficios.ctsFactor);
    }
    
    const provVacaciones = sueldoBruto * PERU_DATA.vacaciones.provisionMensual;
    
    // Cálculos totales
    const cargasDirectas = essalud + vidaLey + sctr + senati + eps;
    const provisionesBeneficios = provGratificaciones + provCTS + provVacaciones;
    const costoTotal = sueldoBruto + cargasDirectas + provisionesBeneficios;
    
    return {
        sueldoBruto: sueldoBruto,
        essalud: essalud,
        vidaLey: vidaLey,
        sctr: sctr,
        senati: senati,
        eps: eps,
        cargasDirectas: cargasDirectas,
        provGratificaciones: provGratificaciones,
        provCTS: provCTS,
        provVacaciones: provVacaciones,
        provisionesBeneficios: provisionesBeneficios,
        costoTotal: costoTotal,
        porcentajeCarga: ((cargasDirectas + provisionesBeneficios) / sueldoBruto * 100)
    };
};

// Calcula Utilidades según D.Leg. 892
window.calcularUtilidades = function(salario, diasTrabajados, mesesTrabajados, rentaAnualEmpresa, sector, totalTrabajadores = 10, regimen) {
    if (!regimen.beneficios.utilidades) {
        return { total: 0, porDias: 0, porRemuneracion: 0 };
    }
    
    const sectorData = PERU_DATA.utilidades.sectores[sector] || PERU_DATA.utilidades.sectores.otros;
    const utilidadDistribuir = rentaAnualEmpresa * sectorData.porcentaje;
    
    // Distribución 50/50
    const montoporDias = utilidadDistribuir * PERU_DATA.utilidades.distribucion.porDias;
    const montoPorRemuneracion = utilidadDistribuir * PERU_DATA.utilidades.distribucion.porRemuneracion;
    
    // Cálculo individual (simplificado)
    const totalDiasTrabajadores = totalTrabajadores * 360;
    const totalRemuneracionTrabajadores = salario * 12 * totalTrabajadores;
    
    const partDias = (montoPorDias * diasTrabajados) / totalDiasTrabajadores;
    const partRemuneracion = (montoPorRemuneracion * (salario * mesesTrabajados)) / totalRemuneracionTrabajadores;
    
    let total = partDias + partRemuneracion;
    
    // Aplicar tope legal (18 remuneraciones)
    const topeMaximo = salario * PERU_DATA.utilidades.topeMaximo;
    total = Math.min(total, topeMaximo);
    
    return {
        total: total,
        porDias: partDias,
        porRemuneracion: partRemuneracion,
        sector: sectorData.nombre,
        porcentaje: sectorData.porcentaje
    };
};

// ===== CONFIGURACIONES DE CALCULADORAS =====
window.CALCULATOR_CONFIGS = {
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Sueldo Neto',
        description: 'Calcula tu sueldo líquido después de AFP/ONP y 5ta categoría',
        fields: [
            { 
                id: 'neto-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage,
                help: 'Ingresa tu sueldo base sin asignación familiar'
            },
            {
                id: 'neto-pension-tipo',
                label: 'Sistema de Pensiones',
                type: 'select',
                options: [
                    { value: 'afp', label: 'AFP (Sistema Privado)' },
                    { value: 'onp', label: 'ONP (Sistema Nacional - 13%)' }
                ]
            },
            {
                id: 'neto-afp',
                label: 'AFP',
                type: 'select',
                options: [
                    { value: 'integra', label: 'AFP Integra' },
                    { value: 'prima', label: 'AFP Prima' },
                    { value: 'profuturo', label: 'AFP Profuturo' },
                    { value: 'habitat', label: 'AFP Habitat' }
                ],
                dependsOn: 'neto-pension-tipo',
                showWhen: 'afp'
            },
            {
                id: 'neto-comision-tipo',
                label: 'Tipo de Comisión AFP',
                type: 'select',
                options: [
                    { value: 'flujo', label: 'Sobre Flujo (remuneración)' },
                    { value: 'mixta', label: 'Mixta (flujo + saldo acumulado)' }
                ],
                dependsOn: 'neto-pension-tipo',
                showWhen: 'afp'
            },
            {
                id: 'neto-saldo-afp',
                label: 'Saldo Acumulado AFP (opcional)',
                type: 'number',
                placeholder: '50000',
                min: 0,
                step: 1000,
                help: 'Solo para comisión mixta - deja en 0 si desconoces',
                dependsOn: 'neto-comision-tipo',
                showWhen: 'mixta'
            },
            {
                id: 'neto-hijos',
                label: '¿Tiene hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: `Sí (+ S/ ${calcularAsignacionFamiliar().toFixed(2)})` }
                ]
            },
            {
                id: 'neto-utilidades',
                label: 'Utilidades Anuales Recibidas (opcional)',
                type: 'number',
                placeholder: '0',
                min: 0,
                step: 100,
                help: 'Si recibiste utilidades, ingrésalas para ver el impacto mensual'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['neto-salary']) || 0;
            const pensionTipo = values['neto-pension-tipo'] || 'afp';
            const afpNombre = values['neto-afp'] || 'integra';
            const comisionTipo = values['neto-comision-tipo'] || 'flujo';
            const saldoAFP = parseFloat(values['neto-saldo-afp']) || 0;
            const tieneHijos = values['neto-hijos'] === 'si';
            const utilidades = parseFloat(values['neto-utilidades']) || 0;
            
            // Asignación Familiar
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            const sueldoBruto = salary + asigFamiliar;
            
            // Utilidades prorrateadas mensualmente
            const utilidadesMensual = utilidades / 12;
            const ingresoTotal = sueldoBruto + utilidadesMensual;
            
            // Descuentos de Pensiones
            let pensionAporte = 0;
            let pensionSeguro = 0;
            let pensionComision = 0;
            let pensionTotal = 0;
            let pensionDetalle = '';
            
            if (pensionTipo === 'onp') {
                pensionTotal = salary * PERU_DATA.onp;
                pensionDetalle = 'ONP (13%)';
            } else {
                const afpCalc = calcularAFP(salary, afpNombre, comisionTipo, saldoAFP);
                pensionAporte = afpCalc.aporte;
                pensionSeguro = afpCalc.seguro;
                pensionComision = afpCalc.comision;
                pensionTotal = afpCalc.total;
                const afpData = PERU_DATA.afp[afpNombre];
                pensionDetalle = afpData.nombre;
            }
            
            // Calcular 5ta Categoría (anual proyectado)
            const ingresoAnual = ingresoTotal * 12;
            const uitAnual = PERU_DATA.rentaQuinta.uit;
            const deduccion = PERU_DATA.rentaQuinta.deduccion * uitAnual;
            const baseImponible = Math.max(0, ingresoAnual - deduccion);
            
            let impuestoAnual = 0;
            let acumulado = 0;
            
            PERU_DATA.rentaQuinta.tramos.forEach(tramo => {
                if (tramo.hasta) {
                    const limite = tramo.hasta * uitAnual;
                    if (baseImponible > acumulado) {
                        const imponible = Math.min(baseImponible - acumulado, limite - acumulado);
                        impuestoAnual += imponible * tramo.tasa;
                        acumulado = limite;
                    }
                } else if (tramo.desde) {
                    if (baseImponible > acumulado) {
                        const imponible = baseImponible - acumulado;
                        impuestoAnual += imponible * tramo.tasa;
                    }
                }
            });
            
            const impuestoMensual = impuestoAnual / 12;
            
            // Sueldo Neto
            const neto = ingresoTotal - pensionTotal - impuestoMensual;
            
            // Detalles
            const details = [
                { label: '💼 INGRESOS', value: '', type: 'header' },
                { label: 'Sueldo Base', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' }
            ];
            
            if (asigFamiliar > 0) {
                details.push({ label: 'Asignación Familiar (10% SMV)', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' });
            }
            
            if (utilidadesMensual > 0) {
                details.push({ label: 'Utilidades (prorrateadas)', value: `+ S/ ${utilidadesMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' });
            }
            
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
            
            details.push({ label: 'Impuesto 5ta Categoría', value: `- S/ ${impuestoMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' });
            
            return {
                total: neto,
                details: details
            };
        },
        legalInfo: 'Cálculo según D.S. N° 004-2019-TR y TUO Ley del Impuesto a la Renta. SIS actualizado 2026: 1.70%. AFP con comisiones flujo y mixta según SBS. 5ta categoría progresiva con 7 UIT deducibles.'
    },
    
    cts: {
        id: 'cts',
        icon: '🏦',
        title: 'CTS - Compensación por Tiempo de Servicio',
        description: 'Calcula tu CTS depositada semestralmente (Mayo y Noviembre)',
        fields: [
            { 
                id: 'cts-salary', 
                label: 'Sueldo Mensual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'cts-months', 
                label: 'Meses Completos Trabajados (período)', 
                type: 'number', 
                placeholder: '6', 
                min: 1, 
                max: 6,
                help: 'Máximo 6 meses por depósito semestral'
            },
            {
                id: 'cts-hijos',
                label: '¿Tiene hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (+ Asignación Familiar)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['cts-salary']) || 0;
            const months = Math.min(parseFloat(values['cts-months']) || 0, 6);
            const tieneHijos = values['cts-hijos'] === 'si';
            
            if (!regimen.beneficios.cts) {
                return {
                    total: 0,
                    details: [
                        { label: 'Régimen', value: regimen.nombre, type: 'info' },
                        { label: 'CTS', value: 'No aplica en este régimen', type: 'warning' }
                    ]
                };
            }
            
            // Base de cálculo CTS con sexto de gratificación (D.S. 001-97-TR)
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            const ctsCalc = calcularCTS(salary, asigFamiliar, months, regimen);
            
            return {
                total: ctsCalc.cts,
                details: [
                    { label: '📋 COMPONENTES CTS', value: '', type: 'header' },
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Asignación Familiar', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '1/6 Gratificación', value: `+ S/ ${ctsCalc.sextoGrati.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: 'Remuneración Computable', value: `S/ ${ctsCalc.remComputable.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Meses Trabajados', value: `${months} meses`, type: 'info' },
                    { label: `Factor CTS (${(regimen.beneficios.ctsFactor * 100)}%)`, value: regimen.beneficios.ctsFactor === 1 ? 'Completo' : 'Reducido', type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 Fórmula', value: '(Sueldo + AF + 1/6 Grat.) × Meses / 12', type: 'info' }
                ]
            };
        },
        legalInfo: 'La CTS se deposita semestralmente en Mayo (Nov-Abr) y Noviembre (May-Oct) según D.S. 001-97-TR. La remuneración computable incluye sueldo + 1/6 gratificación + asignación familiar.'
    },
    
    gratificacion: {
        id: 'gratificacion',
        icon: '🎁',
        title: 'Gratificaciones Legales',
        description: 'Calcula tus gratificaciones de Julio y Diciembre',
        fields: [
            { 
                id: 'grat-salary', 
                label: 'Sueldo Mensual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'grat-months', 
                label: 'Meses Completos Trabajados (semestre)', 
                type: 'number', 
                placeholder: '6', 
                min: 1, 
                max: 6,
                help: 'Ene-Jun para gratificación de Julio, Jul-Dic para Diciembre'
            },
            {
                id: 'grat-hijos',
                label: '¿Tiene hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (+ Asignación Familiar)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['grat-salary']) || 0;
            const months = Math.min(parseFloat(values['grat-months']) || 0, 6);
            const tieneHijos = values['grat-hijos'] === 'si';
            
            if (!regimen.beneficios.gratificaciones) {
                return {
                    total: 0,
                    details: [
                        { label: 'Régimen', value: regimen.nombre, type: 'info' },
                        { label: 'Gratificaciones', value: 'No aplica en este régimen', type: 'warning' }
                    ]
                };
            }
            
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? calcularAsignacionFamiliar() : 0;
            const gratCalc = calcularGratificacion(salary, asigFamiliar, months, regimen, false);
            
            return {
                total: gratCalc.total,
                details: [
                    { label: '🎁 GRATIFICACIÓN LEGAL', value: '', type: 'header' },
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Período', value: months === 6 ? 'Semestre completo' : `${months} meses`, type: 'info' },
                    { label: '', value: '', type: 'separator' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Asignación Familiar', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: `Gratificación ${regimen.beneficios.gratificacionesFactor === 1 ? 'Completa' : 'Media (' + (regimen.beneficios.gratificacionesFactor * 100) + '%)'}`, value: `S/ ${gratCalc.gratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Bonif. Extraordinaria (9%)', value: `+ S/ ${gratCalc.bonifExt.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '', value: '', type: 'separator' },
                    { label: '💡 Ingreso en Boleta', value: `S/ ${gratCalc.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' }
                ]
            };
        },
        legalInfo: 'Gratificaciones legales de Julio y Diciembre según Ley 27735. Se pagan proporcionalmente a los meses trabajados. Régimen General recibe gratificación completa + 9% bonificación.'
    },
    
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        title: 'Liquidación de Beneficios Sociales',
        description: 'Calcula todos los beneficios al cesar en el empleo',
        fields: [
            { 
                id: 'liq-salary', 
                label: 'Sueldo Mensual Actual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'liq-years', 
                label: 'Años de Servicio', 
                type: 'number', 
                placeholder: '3', 
                min: 0, 
                max: 50,
                step: 0.5
            },
            {
                id: 'liq-hijos',
                label: '¿Tiene hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (Afecta cálculos)' }
                ]
            },
            {
                id: 'liq-tipo',
                label: 'Tipo de Cese',
                type: 'select',
                options: [
                    { value: 'renuncia', label: 'Renuncia Voluntaria' },
                    { value: 'despido', label: 'Despido Arbitrario (+ Indemnización)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['liq-salary']) || 0;
            const years = parseFloat(values['liq-years']) || 0;
            const tieneHijos = values['liq-hijos'] === 'si';
            const tipoCese = values['liq-tipo'] || 'renuncia';
            
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? PERU_DATA.asignacionFamiliar : 0;
            
            // CTS Acumulada
            let ctsAcumulada = 0;
            if (regimen.beneficios.cts) {
                const remComputableCTS = salary + asigFamiliar + (salary / 6);
                ctsAcumulada = (remComputableCTS * years) * regimen.beneficios.ctsFactor;
            }
            
            // Gratificaciones Truncas (proporcional al semestre actual)
            let gratTruncas = 0;
            if (regimen.beneficios.gratificaciones) {
                const mesesSemestre = 3; // Promedio
                const remComputableGrat = salary + asigFamiliar;
                gratTruncas = ((remComputableGrat * mesesSemestre) / 6) * regimen.beneficios.gratificacionesFactor;
                gratTruncas += gratTruncas * regimen.essaludBonif; // + Bonificación
            }
            
            // Vacaciones Truncas
            const diasVacaciones = regimen.beneficios.vacaciones;
            const mesesAnio = 6; // Promedio
            const vacacionesTruncas = (salary / 30) * ((diasVacaciones * mesesAnio) / 12);
            
            // Indemnización por Despido Arbitrario
            let indemnizacion = 0;
            if (tipoCese === 'despido') {
                indemnizacion = salary * Math.min(years * regimen.beneficios.indemnizacion, 12); // Máximo 12 sueldos
            }
            
            const total = ctsAcumulada + gratTruncas + vacacionesTruncas + indemnizacion;
            
            return {
                total,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Años de Servicio', value: years.toFixed(1), type: 'info' },
                    { label: 'Tipo de Cese', value: tipoCese === 'renuncia' ? 'Renuncia' : 'Despido Arbitrario', type: 'info' },
                    { label: 'CTS Acumulada', value: `S/ ${ctsAcumulada.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Gratificaciones Truncas', value: `S/ ${gratTruncas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Vacaciones Truncas', value: `S/ ${vacacionesTruncas.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    ...(indemnizacion > 0 ? [
                        { label: 'Indemnización por Despido', value: `S/ ${indemnizacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                    ] : [])
                ]
            };
        },
        legalInfo: 'Liquidación incluye CTS, gratificaciones y vacaciones truncas. En despido arbitrario se añade indemnización de 1.5 sueldos/año (Régimen General) según D.S. 003-97-TR.'
    },
    
    vacaciones: {
        id: 'vacaciones',
        icon: '🏖️',
        title: 'Vacaciones',
        description: 'Calcula el pago por vacaciones según régimen',
        fields: [
            { 
                id: 'vac-salary', 
                label: 'Sueldo Mensual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'vac-days', 
                label: 'Días de Vacaciones', 
                type: 'number', 
                placeholder: '15', 
                min: 1, 
                max: 60,
                help: 'Días según tu régimen laboral'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['vac-salary']) || 0;
            const days = Math.min(parseFloat(values['vac-days']) || 0, regimen.beneficios.vacaciones);
            
            const dailyRate = salary / 30;
            const total = dailyRate * days;
            
            return {
                total,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Días por Año', value: `${regimen.beneficios.vacaciones} días`, type: 'info' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Tasa Diaria', value: `S/ ${dailyRate.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Días a Pagar', value: days.toString(), type: 'info' }
                ]
            };
        },
        legalInfo: 'Vacaciones de 30 días anuales (Régimen General) o 15 días (Pequeña Empresa/Micro) según D.Leg. 713. Se calculan sobre el sueldo base dividido entre 30 días.'
    },
    
    utilidades: {
        id: 'utilidades',
        icon: '💰',
        title: 'Participación en Utilidades',
        description: 'Calcula tu participación en las utilidades de la empresa',
        fields: [
            { 
                id: 'util-salary', 
                label: 'Sueldo Mensual Promedio', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'util-months', 
                label: 'Meses Trabajados en el Año', 
                type: 'number', 
                placeholder: '12', 
                min: 1, 
                max: 12 
            },
            { 
                id: 'util-dias', 
                label: 'Días Efectivos Trabajados', 
                type: 'number', 
                placeholder: '360', 
                min: 1, 
                max: 365,
                help: '360 días = año completo'
            },
            {
                id: 'util-renta',
                label: 'Renta Anual de la Empresa',
                type: 'number',
                placeholder: '1000000',
                min: 0,
                help: 'Utilidad neta antes de impuestos'
            },
            {
                id: 'util-sector',
                label: 'Sector Empresarial',
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
            },
            {
                id: 'util-trabajadores',
                label: 'Total de Trabajadores',
                type: 'number',
                placeholder: '10',
                min: 1,
                help: 'Número total de trabajadores en la empresa'
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['util-salary']) || 0;
            const months = parseFloat(values['util-months']) || 0;
            const dias = parseFloat(values['util-dias']) || 0;
            const rentaAnual = parseFloat(values['util-renta']) || 0;
            const sector = values['util-sector'] || 'otros';
            const totalTrabajadores = parseFloat(values['util-trabajadores']) || 10;
            
            if (!regimen.beneficios.utilidades) {
                return {
                    total: 0,
                    details: [
                        { label: 'Régimen', value: regimen.nombre, type: 'info' },
                        { label: 'Utilidades', value: 'No aplica en este régimen', type: 'warning' }
                    ]
                };
            }
            
            const utilCalc = calcularUtilidades(salary, dias, months, rentaAnual, sector, totalTrabajadores, regimen);
            
            return {
                total: utilCalc.total,
                details: [
                    { label: '💰 UTILIDADES LEGALES', value: '', type: 'header' },
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
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
                    { label: '💡 Tope Legal', value: `S/ ${(salary * PERU_DATA.utilidades.topeMaximo).toLocaleString('es-PE', { minimumFractionDigits: 0 })} (18 sueldos)`, type: 'info' }
                ]
            };
        },
        legalInfo: 'Participación en utilidades según D.Leg. 892. Distribución: 50% por días, 50% por remuneración. Porcentajes: Pesquera/Telecom/Industrial 10%, Minería/Comercio 8%, Otros 5%.'
    },
    
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        title: 'Horas Extra',
        description: 'Calcula pago por sobretiempo según legislación peruana',
        fields: [
            { 
                id: 'he-salary', 
                label: 'Sueldo Mensual', 
                type: 'number', 
                placeholder: '5000', 
                min: PERU_DATA.minWage 
            },
            { 
                id: 'he-hours-25', 
                label: 'Horas Extra al 25%', 
                type: 'number', 
                placeholder: '10', 
                min: 0, 
                max: 200,
                help: '2 primeras horas extra del día'
            },
            { 
                id: 'he-hours-35', 
                label: 'Horas Extra al 35%', 
                type: 'number', 
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
            
            // Valor hora = Sueldo / 240 horas mensuales
            const hourlyRate = salary / 240;
            
            // Sobretasa primera y segunda hora: 25%
            const pago25 = hourlyRate * 1.25 * hours25;
            
            // Sobretasa horas adicionales: 35%
            const pago35 = hourlyRate * 1.35 * hours35;
            
            const total = pago25 + pago35;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Valor Hora Ordinaria', value: `S/ ${hourlyRate.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'info' },
                    { label: 'Horas Extra al 25%', value: `${hours25} hrs × S/ ${(hourlyRate * 1.25).toFixed(2)}`, type: 'info' },
                    { label: 'Pago Horas al 25%', value: `S/ ${pago25.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Horas Extra al 35%', value: `${hours35} hrs × S/ ${(hourlyRate * 1.35).toFixed(2)}`, type: 'info' },
                    { label: 'Pago Horas al 35%', value: `S/ ${pago35.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
                ]
            };
        },
        legalInfo: 'Horas extra según D.S. 007-2002-TR: primeras 2 horas +25%, adicionales +35%. Base: sueldo mensual / 240 horas. Máximo 8 hrs extra semanales o voluntarias.'
    },
    
    costo_empleador: {
        id: 'costo_empleador',
        icon: '🏢',
        title: 'Costo Total Empleador',
        description: 'Calcula el costo real total mensual para el empleador (Carga Social)',
        fields: [
            { 
                id: 'emp-salary', 
                label: 'Sueldo Bruto Mensual', 
                type: 'number', 
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
                aplicaSenati: aplicaSenati,
                tieneEPS: tieneEPS,
                nivelRiesgo: nivelRiesgo
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
                    ...(aplicaSenati ? [{ label: 'SENATI (0.75%)', value: `+ S/ ${costoCalc.senati.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' }] : []),
                    ...(tieneEPS ? [{ label: 'EPS Adicional (2.25%)', value: `+ S/ ${costoCalc.eps.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' }] : []),
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
        legalInfo: 'Costo real mensual incluye: Sueldo + Cargas directas (ESSALUD, SCTR, Vida Ley, SENATI) + Provisiones mensualizadas de beneficios (Gratificaciones, CTS, Vacaciones). Base legal: Ley 26790, D.S. 003-97-TR, Ley 27735.'
    }
};