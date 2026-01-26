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
    
    // AFP - Datos 2026
    afp: {
        prima: {
            aporte: 0.10,          // 10% Fondo de Pensiones
            seguro: 0.0117,        // 1.17% Seguro de Invalidez
            comision: 0.0047       // 0.47% Comisión promedio (variable por AFP)
        },
        integra: {
            aporte: 0.10,
            seguro: 0.0117,
            comision: 0.0082       // 0.82%
        },
        profuturo: {
            aporte: 0.10,
            seguro: 0.0117,
            comision: 0.0069       // 0.69%
        },
        habitat: {
            aporte: 0.10,
            seguro: 0.0117,
            comision: 0.0047       // 0.47%
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
    
    // Gratificaciones
    gratificaciones: {
        meses: 2,  // Julio y Diciembre
        bonifExt: 0.09  // 9% ESSALUD bonificación extraordinaria
    },
    
    // CTS
    cts: {
        mesesPorAnio: 1.1667,  // 12/12 + 2 grats/12
        depositosMensuales: 2   // Mayo y Noviembre
    },
    
    // Vacaciones
    vacaciones: {
        diasPorAnio: 30
    },
    
    // Costos del Empleador
    empleador: {
        essalud: 0.09,         // 9%
        vidaLey: 0.0053,       // 0.53% promedio
        sctr: 0.0063,          // 0.63% promedio (variable por riesgo)
        senati: 0.0075         // 0.75% solo en industria/construcción
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
                id: 'neto-afp-type',
                label: 'Sistema de Pensiones',
                type: 'select',
                options: [
                    { value: 'prima', label: 'AFP Prima (Comisión 0.47%)' },
                    { value: 'integra', label: 'AFP Integra (Comisión 0.82%)' },
                    { value: 'profuturo', label: 'AFP Profuturo (Comisión 0.69%)' },
                    { value: 'habitat', label: 'AFP Habitat (Comisión 0.47%)' },
                    { value: 'onp', label: 'ONP (13%)' }
                ]
            },
            {
                id: 'neto-hijos',
                label: '¿Tiene hijos menores de 18 años?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No' },
                    { value: 'si', label: 'Sí (+ S/ 107.50)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['neto-salary']) || 0;
            const afpType = values['neto-afp-type'] || 'prima';
            const tieneHijos = values['neto-hijos'] === 'si';
            
            // Asignación Familiar
            const asigFamiliar = tieneHijos ? PERU_DATA.asignacionFamiliar : 0;
            const sueldoBruto = salary + asigFamiliar;
            
            // Descuentos de Pensiones
            let pensionAporte = 0;
            let pensionSeguro = 0;
            let pensionComision = 0;
            let pensionTotal = 0;
            
            if (afpType === 'onp') {
                pensionTotal = salary * PERU_DATA.onp;
            } else {
                const afpData = PERU_DATA.afp[afpType];
                pensionAporte = salary * afpData.aporte;
                pensionSeguro = salary * afpData.seguro;
                pensionComision = salary * afpData.comision;
                pensionTotal = pensionAporte + pensionSeguro + pensionComision;
            }
            
            // Calcular 5ta Categoría (simplificado mensual)
            const ingresoAnual = sueldoBruto * 12;
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
            const neto = sueldoBruto - pensionTotal - impuestoMensual;
            
            return {
                total: neto,
                details: [
                    { label: 'Sueldo Base', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Asignación Familiar', value: `+ S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Sueldo Bruto Total', value: `S/ ${sueldoBruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: afpType === 'onp' ? 'ONP (13%)' : 'AFP - Aporte (10%)', value: `- S/ ${(afpType === 'onp' ? pensionTotal : pensionAporte).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                    ...(afpType !== 'onp' ? [
                        { label: 'AFP - Seguro (1.17%)', value: `- S/ ${pensionSeguro.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' },
                        { label: `AFP - Comisión (${(PERU_DATA.afp[afpType].comision * 100).toFixed(2)}%)`, value: `- S/ ${pensionComision.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' }
                    ] : []),
                    { label: 'Impuesto 5ta Categoría', value: `- S/ ${impuestoMensual.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'descuento' }
                ]
            };
        },
        legalInfo: 'Cálculo según D.S. N° 004-2019-TR y Ley del Impuesto a la Renta. Los aportes AFP/ONP son obligatorios. La 5ta categoría se calcula anualmente con deducción de 7 UIT.'
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
            
            // Base de cálculo CTS
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? PERU_DATA.asignacionFamiliar : 0;
            const remuneracionComputable = salary + asigFamiliar + (salary / 6); // 1/6 de gratificación
            
            // CTS = (Rem. Computable × Meses) / 12 × Factor régimen
            const ctsCompleto = (remuneracionComputable * months) / 12;
            const cts = ctsCompleto * regimen.beneficios.ctsFactor;
            
            return {
                total: cts,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Asignación Familiar', value: `S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: '1/6 Gratificación', value: `S/ ${(salary / 6).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Remuneración Computable', value: `S/ ${remuneracionComputable.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Meses Trabajados', value: months.toString(), type: 'info' },
                    { label: `Factor CTS (${(regimen.beneficios.ctsFactor * 100)}%)`, value: regimen.beneficios.ctsFactor === 1 ? 'Completo' : 'Reducido', type: 'info' }
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
            
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? PERU_DATA.asignacionFamiliar : 0;
            const remuneracionComputable = salary + asigFamiliar;
            
            // Gratificación proporcional
            const gratCompleta = (remuneracionComputable * months) / 6;
            const gratificacion = gratCompleta * regimen.beneficios.gratificacionesFactor;
            
            // Bonificación Extraordinaria (9% ESSALUD pagado al trabajador)
            const bonifExt = gratificacion * regimen.essaludBonif;
            
            const total = gratificacion + bonifExt;
            
            return {
                total,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'Asignación Familiar', value: `S/ ${asigFamiliar.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Meses Trabajados', value: months.toString(), type: 'info' },
                    { label: `Factor Gratificación (${(regimen.beneficios.gratificacionesFactor * 100)}%)`, value: regimen.beneficios.gratificacionesFactor === 1 ? 'Completa' : 'Media', type: 'info' },
                    { label: 'Gratificación', value: `S/ ${gratificacion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Bonif. Extraordinaria (9%)', value: `+ S/ ${bonifExt.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
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
                label: 'Sueldo Mensual Promedio Anual', 
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
                label: 'Días Trabajados en el Año', 
                type: 'number', 
                placeholder: '360', 
                min: 1, 
                max: 365 
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
                    { value: 'resto', label: 'Otras Actividades (5%)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['util-salary']) || 0;
            const months = parseFloat(values['util-months']) || 0;
            const dias = parseFloat(values['util-dias']) || 0;
            const rentaAnual = parseFloat(values['util-renta']) || 0;
            const sector = values['util-sector'] || 'resto';
            
            if (!regimen.beneficios.utilidades) {
                return {
                    total: 0,
                    details: [
                        { label: 'Régimen', value: regimen.nombre, type: 'info' },
                        { label: 'Utilidades', value: 'No aplica en este régimen', type: 'warning' }
                    ]
                };
            }
            
            // Porcentajes por sector
            const porcentajes = {
                pesquera: 0.10,
                telecomunicaciones: 0.10,
                industrial: 0.10,
                mineria: 0.08,
                comercio: 0.08,
                resto: 0.05
            };
            
            const porcentaje = porcentajes[sector];
            const utilidadDistribuir = rentaAnual * porcentaje;
            
            // 50% por días, 50% por monto de remuneración
            const porDias = utilidadDistribuir * 0.5;
            const porRemuneracion = utilidadDistribuir * 0.5;
            
            // Calcular participación individual (simplificado - asume 10 trabajadores)
            const totalTrabajadores = 10;
            const totalDiasTrabajadores = totalTrabajadores * 360;
            const totalRemuneracionTrabajadores = salary * 12 * totalTrabajadores;
            
            const partDias = (porDias * dias) / totalDiasTrabajadores;
            const partRemuneracion = (porRemuneracion * (salary * months)) / totalRemuneracionTrabajadores;
            
            const total = partDias + partRemuneracion;
            
            return {
                total,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sector', value: sector.charAt(0).toUpperCase() + sector.slice(1), type: 'info' },
                    { label: 'Porcentaje de Distribución', value: `${(porcentaje * 100)}%`, type: 'info' },
                    { label: 'Utilidad a Distribuir', value: `S/ ${utilidadDistribuir.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'Participación por Días', value: `S/ ${partDias.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' },
                    { label: 'Participación por Remuneración', value: `S/ ${partRemuneracion.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'ingreso' }
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
        description: 'Calcula el costo real total para el empleador',
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
                id: 'emp-senati',
                label: '¿Aplica SENATI?',
                type: 'select',
                options: [
                    { value: 'no', label: 'No (Servicios/Comercio)' },
                    { value: 'si', label: 'Sí (Industria/Construcción)' }
                ]
            }
        ],
        calculate: (values, regimen) => {
            const salary = parseFloat(values['emp-salary']) || 0;
            const tieneHijos = values['emp-hijos'] === 'si';
            const aplicaSenati = values['emp-senati'] === 'si';
            
            // Sueldo base
            const asigFamiliar = tieneHijos && regimen.beneficios.asignacionFamiliar ? PERU_DATA.asignacionFamiliar : 0;
            const sueldoBruto = salary + asigFamiliar;
            
            // ESSALUD 9%
            const essalud = sueldoBruto * PERU_DATA.empleador.essalud;
            
            // Vida Ley 0.53%
            const vidaLey = sueldoBruto * PERU_DATA.empleador.vidaLey;
            
            // SCTR 0.63% (promedio)
            const sctr = sueldoBruto * PERU_DATA.empleador.sctr;
            
            // SENATI 0.75% (solo industria/construcción)
            const senati = aplicaSenati ? sueldoBruto * PERU_DATA.empleador.senati : 0;
            
            // Gratificaciones (2 al año) + Bonif. Extraordinaria
            let gratificaciones = 0;
            if (regimen.beneficios.gratificaciones) {
                const gratAnual = sueldoBruto * 2 * regimen.beneficios.gratificacionesFactor;
                const bonifExt = gratAnual * regimen.essaludBonif;
                gratificaciones = (gratAnual + bonifExt) / 12; // Mensualizado
            }
            
            // CTS
            let cts = 0;
            if (regimen.beneficios.cts) {
                const remComputableCTS = sueldoBruto + (sueldoBruto / 6);
                cts = (remComputableCTS * regimen.beneficios.ctsFactor) / 12; // Mensualizado
            }
            
            // Vacaciones (provisionado mensual)
            const vacaciones = (sueldoBruto * (regimen.beneficios.vacaciones / 360));
            
            // Costo Total Mensual
            const costoDirecto = sueldoBruto + essalud + vidaLey + sctr + senati;
            const costoBeneficios = gratificaciones + cts + vacaciones;
            const costoTotal = costoDirecto + costoBeneficios;
            
            return {
                total: costoTotal,
                details: [
                    { label: 'Régimen Laboral', value: regimen.nombre, type: 'info' },
                    { label: 'Sueldo Bruto', value: `S/ ${sueldoBruto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'base' },
                    { label: 'ESSALUD (9%)', value: `+ S/ ${essalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'Vida Ley (0.53%)', value: `+ S/ ${vidaLey.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'SCTR (0.63%)', value: `+ S/ ${sctr.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    ...(senati > 0 ? [{ label: 'SENATI (0.75%)', value: `+ S/ ${senati.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' }] : []),
                    { label: 'Gratificaciones (prov. mensual)', value: `+ S/ ${gratificaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'CTS (prov. mensual)', value: `+ S/ ${cts.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'Vacaciones (prov. mensual)', value: `+ S/ ${vacaciones.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'costo' },
                    { label: 'COSTO DIRECTO MENSUAL', value: `S/ ${costoDirecto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' },
                    { label: 'BENEFICIOS SOCIALES', value: `S/ ${costoBeneficios.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, type: 'subtotal' }
                ]
            };
        },
        legalInfo: 'Costo real incluye: Sueldo + ESSALUD + Vida Ley + SCTR + SENATI (si aplica) + Gratificaciones + CTS + Vacaciones provisionadas. Base legal: Ley 26790, D.S. 003-97-TR.'
    }
};