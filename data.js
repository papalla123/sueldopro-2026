/* ============================================
   PayCalc Pro - Data Layer
   Normativa SUNAT / Legislación Laboral Perú 2024
   ============================================ */

const DATA = {

    // ===== PARÁMETROS GENERALES 2024 =====
    UIT: 5150,
    RMV: 1025,
    ASIGNACION_FAMILIAR_PORCENTAJE: 0.10, // 10% de la RMV

    // ===== SISTEMA DE PENSIONES =====
    PENSIONES: {
        onp: {
            nombre: "ONP",
            aporte: 0.13, // 13%
            comision: 0,
            seguro: 0,
            descripcion: "Oficina de Normalización Previsional"
        },
        "afp-integra": {
            nombre: "AFP Integra",
            aporte: 0.10, // 10% fondo
            comision: 0.0155, // 1.55% comisión flujo
            seguro: 0.0192, // 1.92% prima seguro
            descripcion: "Fondo obligatorio 10% + comisión + seguro"
        },
        "afp-profuturo": {
            nombre: "AFP ProFuturo",
            aporte: 0.10,
            comision: 0.0169, // 1.69%
            seguro: 0.0192,
            descripcion: "Fondo obligatorio 10% + comisión + seguro"
        },
        "afp-prima": {
            nombre: "AFP Prima",
            aporte: 0.10,
            comision: 0.0155, // 1.55%
            seguro: 0.0192,
            descripcion: "Fondo obligatorio 10% + comisión + seguro"
        },
        "afp-habitat": {
            nombre: "AFP Habitat",
            aporte: 0.10,
            comision: 0.0138, // 1.38%
            seguro: 0.0192,
            descripcion: "Fondo obligatorio 10% + comisión + seguro"
        }
    },

    // ===== TRAMOS IMPUESTO A LA RENTA 5TA CATEGORÍA =====
    // Renta neta anual = Renta bruta anual - 7 UIT
    TRAMOS_IR: [
        {
            hasta_uit: 5,
            tasa: 0.08,
            nombre: "1er Tramo",
            color: "#6366f1"
        },
        {
            hasta_uit: 20,
            tasa: 0.14,
            nombre: "2do Tramo",
            color: "#10b981"
        },
        {
            hasta_uit: 35,
            tasa: 0.17,
            nombre: "3er Tramo",
            color: "#f59e0b"
        },
        {
            hasta_uit: 45,
            tasa: 0.20,
            nombre: "4to Tramo",
            color: "#f97316"
        },
        {
            hasta_uit: Infinity,
            tasa: 0.30,
            nombre: "5to Tramo",
            color: "#ef4444"
        }
    ],

    // ===== ESSALUD =====
    ESSALUD: {
        general: { tasa: 0.09, nombre: "Régimen General" },
        agrario: { tasa: 0.06, nombre: "Régimen Agrario" },
        micro: { tasa: 0.045, nombre: "Microempresa (50%)" }
    },

    // ===== REGÍMENES LABORALES =====
    REGIMENES: {
        general: {
            nombre: "Régimen General",
            cts: true,
            gratificacion: true,
            gratificacion_meses: 1, // 1 sueldo por gratificación
            vacaciones_dias: 30,
            essalud: 0.09,
            sctr: false,
            utilidades: true,
            asig_familiar: true,
            descripcion: "Aplica todos los beneficios laborales completos"
        },
        pequena: {
            nombre: "Pequeña Empresa",
            cts: true,
            cts_factor: 0.5, // 15 días por año
            gratificacion: true,
            gratificacion_meses: 0.5, // medio sueldo
            vacaciones_dias: 15,
            essalud: 0.09,
            sctr: false,
            utilidades: true,
            asig_familiar: true,
            descripcion: "Beneficios reducidos para pequeña empresa"
        },
        micro: {
            nombre: "Microempresa",
            cts: false,
            gratificacion: false,
            vacaciones_dias: 15,
            essalud: 0.045, // 50% subsidiado
            sctr: false,
            utilidades: false,
            asig_familiar: false,
            descripcion: "Régimen especial con beneficios mínimos"
        }
    },

    // ===== UTILIDADES POR SECTOR =====
    UTILIDADES_SECTOR: {
        pesca: { porcentaje: 10, nombre: "Pesquería" },
        telecomunicaciones: { porcentaje: 10, nombre: "Telecomunicaciones" },
        industrial: { porcentaje: 8, nombre: "Industriales" },
        mineria: { porcentaje: 8, nombre: "Minería" },
        comercio: { porcentaje: 5, nombre: "Comercio al por mayor y menor" },
        restaurantes: { porcentaje: 5, nombre: "Restaurantes" },
        otros: { porcentaje: 5, nombre: "Otras actividades" }
    },

    // ===== PROCEDIMIENTO RETENCIÓN RENTA 5TA =====
    // Divisores mensuales según Art. 40° del Reglamento LIR
    DIVISORES_MENSUALES: {
        1: 12, 2: 12, 3: 12, 4: 12,
        5: 8, 6: 8, 7: 8, 8: 8,
        9: 4, 10: 4, 11: 4, 12: 1
    },

    // ===== SCTR =====
    SCTR: {
        salud: 0.0053, // 0.53% promedio
        pension: 0.0053, // 0.53% promedio
        total: 0.0106
    },

    // ===== HORAS EXTRAS =====
    HORAS_EXTRAS: {
        primeras_2h: 0.25, // 25% sobretasa
        excedentes: 0.35,  // 35% sobretasa
        nocturno: 0.35,    // 35% sobretasa nocturna
        jornada_maxima_semanal: 48,
        jornada_maxima_diaria: 8,
        dias_mes: 30
    },

    // ===== GRATIFICACIÓN =====
    GRATIFICACION: {
        bonificacion_extraordinaria: 0.09, // 9% - Ley 30334
        periodos: {
            julio: {
                nombre: "Fiestas Patrias",
                semestre_inicio: 1, // Enero
                semestre_fin: 6     // Junio
            },
            diciembre: {
                nombre: "Navidad",
                semestre_inicio: 7,  // Julio
                semestre_fin: 12     // Diciembre
            }
        }
    },

    // ===== CTS =====
    CTS: {
        deposito_mayo: { periodo_inicio: 11, periodo_fin: 4 },   // Nov - Abr
        deposito_noviembre: { periodo_inicio: 5, periodo_fin: 10 }, // May - Oct
        factor_sexto_gratificacion: 1/6
    },

    // ===== VACACIONES =====
    VACACIONES: {
        dias_por_ano: 30,
        record_minimo_meses: 12, // 1 año para derecho
        dias_minimos_mes: 1,     // Al menos 1 día efectivo
        indemnizacion_no_gozadas: 3 // Triple remuneración
    },

    // ===== LIQUIDACIÓN =====
    LIQUIDACION: {
        indemnizacion_despido_arbitrario: {
            por_mes: 1.5, // 1.5 remuneraciones por año
            tope_meses: 12 // Máximo 12 remuneraciones
        }
    },

    // ===== FAQ =====
    FAQ: [
        {
            pregunta: "¿Cómo se calcula el sueldo neto en Perú?",
            respuesta: "El sueldo neto se obtiene restando al sueldo bruto los descuentos de ley: aporte al sistema de pensiones (ONP 13% o AFP ~13.5%) y, si corresponde, el Impuesto a la Renta de 5ta categoría. La fórmula es: Sueldo Neto = Sueldo Bruto - Aporte Pensiones - IR 5ta Categoría."
        },
        {
            pregunta: "¿Cuándo se pagan las gratificaciones en Perú?",
            respuesta: "Las gratificaciones se pagan en julio (Fiestas Patrias) y diciembre (Navidad). El monto es equivalente a una remuneración mensual completa si se trabajó el semestre completo, o proporcional (tantos sextos como meses completos trabajados). Además, se recibe una bonificación extraordinaria del 9% (Ley 30334)."
        },
        {
            pregunta: "¿Cuánto es la CTS y cuándo se deposita?",
            respuesta: "La CTS equivale aproximadamente a un sueldo mensual por cada año trabajado. Se deposita semestralmente: hasta el 15 de mayo (periodo noviembre-abril) y hasta el 15 de noviembre (periodo mayo-octubre). La remuneración computable incluye el sueldo básico + 1/6 de la última gratificación percibida."
        },
        {
            pregunta: "¿Cómo se calculan las horas extras?",
            respuesta: "Las primeras 2 horas extras diarias se pagan con una sobretasa mínima del 25% sobre el valor hora. A partir de la tercera hora extra, la sobretasa es del 35%. El valor hora se calcula dividiendo la remuneración mensual entre 30 y luego entre el número de horas de la jornada diaria."
        },
        {
            pregunta: "¿Cuál es la UIT vigente en 2024?",
            respuesta: "La Unidad Impositiva Tributaria (UIT) para el año 2024 es de S/ 5,150. Este valor es fundamental para calcular el Impuesto a la Renta, ya que las primeras 7 UIT (S/ 36,050) de renta bruta anual están exoneradas."
        },
        {
            pregunta: "¿Cuál es la diferencia entre ONP y AFP?",
            respuesta: "La ONP (Sistema Nacional de Pensiones) descuenta 13% del sueldo bruto. Las AFP (Sistema Privado de Pensiones) descuentan: 10% de aporte obligatorio al fondo + comisión por administración (varía según AFP, entre 1.38% y 1.69%) + prima de seguro (1.92%). El descuento total de AFP es aproximadamente 13.30% a 13.61%."
        },
        {
            pregunta: "¿Qué es la asignación familiar?",
            respuesta: "La asignación familiar es un beneficio equivalente al 10% de la Remuneración Mínima Vital (RMV). En 2024, con una RMV de S/ 1,025, la asignación familiar es de S/ 102.50 mensuales. Se otorga a trabajadores con uno o más hijos menores de 18 años (o hasta 24 años si están cursando estudios superiores). El monto es fijo, independientemente del número de hijos."
        },
        {
            pregunta: "¿Cómo se calcula la liquidación de beneficios sociales?",
            respuesta: "La liquidación incluye: CTS trunca (proporcional al tiempo no depositado), gratificación trunca (proporcional a los meses del semestre), vacaciones truncas (proporcional al record vacacional), y si aplica, indemnización por despido arbitrario (1.5 remuneraciones por año, tope 12). Cada concepto se calcula proporcionalmente al tiempo trabajado."
        },
        {
            pregunta: "¿Cuánto cuesta realmente un trabajador al empleador?",
            respuesta: "Además del sueldo bruto, el empleador debe pagar: EsSalud (9%), provisión de CTS (~8.33% mensual), provisión de gratificaciones (~16.67% mensual), provisión de vacaciones (~8.33% mensual), y si aplica, SCTR y asignación familiar. En total, un trabajador puede costar entre 40% y 50% más que su sueldo bruto."
        },
        {
            pregunta: "¿Las utilidades son obligatorias?",
            respuesta: "Sí, las empresas con más de 20 trabajadores que generan rentas de tercera categoría están obligadas a distribuir utilidades. El porcentaje varía según el sector: Pesquería y Telecomunicaciones (10%), Industria y Minería (8%), Comercio y otros (5%). Se distribuye 50% en función a los días trabajados y 50% en función a las remuneraciones."
        }
    ],

    // ===== HELPERS =====
    getAsignacionFamiliar() {
        return this.RMV * this.ASIGNACION_FAMILIAR_PORCENTAJE;
    },

    getDeduccion7UIT() {
        return this.UIT * 7;
    },

    getPensionTotal(tipo) {
        const p = this.PENSIONES[tipo];
        if (!p) return 0;
        return p.aporte + p.comision + p.seguro;
    },

    calcularIRAnual(rentaNetaAnual) {
        let impuesto = 0;
        let rentaRestante = rentaNetaAnual;
        let limiteAnterior = 0;
        const detalleTramos = [];

        for (const tramo of this.TRAMOS_IR) {
            const limiteTramo = tramo.hasta_uit === Infinity
                ? Infinity
                : tramo.hasta_uit * this.UIT;
            const rangoTramo = limiteTramo === Infinity
                ? rentaRestante
                : (limiteTramo - limiteAnterior);

            if (rentaRestante <= 0) {
                detalleTramos.push({
                    ...tramo,
                    base: 0,
                    impuesto: 0,
                    limiteInferior: limiteAnterior,
                    limiteSuperior: limiteTramo
                });
                limiteAnterior = limiteTramo;
                continue;
            }

            const baseGravable = Math.min(rentaRestante, rangoTramo);
            const impuestoTramo = baseGravable * tramo.tasa;

            detalleTramos.push({
                ...tramo,
                base: baseGravable,
                impuesto: impuestoTramo,
                limiteInferior: limiteAnterior,
                limiteSuperior: limiteTramo
            });

            impuesto += impuestoTramo;
            rentaRestante -= baseGravable;
            limiteAnterior = limiteTramo;
        }

        return { impuesto, detalleTramos };
    },

    formatMoney(amount) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
};
