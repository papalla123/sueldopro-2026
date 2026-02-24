/* ================================================================
   SueldoPro Ultra - DATA LAYER v3.0
   ================================================================
   Motor Financiero de Precisión
   Legislación Laboral Peruana 2024 - SUNAT / MTPE / SBS
   
   PRINCIPIOS DE ARQUITECTURA:
   1. CERO redondeos intermedios (6+ decimales internos)
   2. Solo redondeo final para UI (2 decimales)
   3. Toda base remunerativa = Sueldo + Asig. Familiar
   4. Funciones puras: input → output, sin side effects
   5. Audit trail en cada cálculo
   ================================================================ */

const DATA = Object.freeze({

    // ═══════════════════════════════════════════
    //  PARÁMETROS NACIONALES 2024
    // ═══════════════════════════════════════════
    UIT: 5150,
    RMV: 1025,
    ASIGNACION_FAMILIAR_PCT: 0.10,

    // ═══════════════════════════════════════════
    //  CONSTANTES DE CÁLCULO LEGAL
    // ═══════════════════════════════════════════
    HORAS_MES_LEGAL: 240,          // 8h × 30d = 240 (D.S. 007-2002-TR Art. 12)
    DIAS_MES: 30,
    DIAS_ANO: 360,
    MESES_ANO: 12,
    MESES_SEMESTRE: 6,

    // ═══════════════════════════════════════════
    //  SISTEMA DE PENSIONES (SBS - Marzo 2024)
    // ═══════════════════════════════════════════
    PENSIONES: Object.freeze({
        onp: {
            nombre: "ONP",
            nombreCompleto: "Oficina de Normalización Previsional",
            aporte: 0.13,
            comision: 0,
            seguro: 0,
            get total() { return this.aporte + this.comision + this.seguro; }
        },
        "afp-habitat": {
            nombre: "AFP Habitat",
            nombreCompleto: "AFP Habitat S.A.",
            aporte: 0.10,
            comision: 0.0138,
            seguro: 0.0192,
            get total() { return this.aporte + this.comision + this.seguro; }
        },
        "afp-integra": {
            nombre: "AFP Integra",
            nombreCompleto: "AFP Integra S.A.",
            aporte: 0.10,
            comision: 0.0155,
            seguro: 0.0192,
            get total() { return this.aporte + this.comision + this.seguro; }
        },
        "afp-prima": {
            nombre: "AFP Prima",
            nombreCompleto: "AFP Prima S.A.",
            aporte: 0.10,
            comision: 0.0155,
            seguro: 0.0192,
            get total() { return this.aporte + this.comision + this.seguro; }
        },
        "afp-profuturo": {
            nombre: "AFP ProFuturo",
            nombreCompleto: "AFP ProFuturo S.A.",
            aporte: 0.10,
            comision: 0.0169,
            seguro: 0.0192,
            get total() { return this.aporte + this.comision + this.seguro; }
        }
    }),

    // ═══════════════════════════════════════════
    //  TRAMOS IR 5TA CATEGORÍA (Art. 53° LIR)
    // ═══════════════════════════════════════════
    TRAMOS_IR: Object.freeze([
        { hasta_uit: 5,        tasa: 0.08, nombre: "1er Tramo", color: "#6366f1" },
        { hasta_uit: 20,       tasa: 0.14, nombre: "2do Tramo", color: "#10b981" },
        { hasta_uit: 35,       tasa: 0.17, nombre: "3er Tramo", color: "#f59e0b" },
        { hasta_uit: 45,       tasa: 0.20, nombre: "4to Tramo", color: "#f97316" },
        { hasta_uit: Infinity, tasa: 0.30, nombre: "5to Tramo", color: "#ef4444" }
    ]),

    DEDUCCION_UIT: 7, // 7 UIT exoneradas

    // Divisores mensuales para retención 5ta (Art. 40° Reglamento LIR)
    DIVISORES_RETENCION: Object.freeze({
        1: 12, 2: 12, 3: 12, 4: 12,
        5: 8,  6: 8,  7: 8,  8: 8,
        9: 4,  10: 4, 11: 4, 12: 1
    }),

    // ═══════════════════════════════════════════
    //  HORAS EXTRAS (D.S. 007-2002-TR)
    // ═══════════════════════════════════════════
    SOBRETASA_HE_25: 0.25,   // Primeras 2 horas
    SOBRETASA_HE_35: 0.35,   // A partir de 3ra hora
    SOBRETASA_NOCTURNO: 0.35, // 10pm - 6am

    // ═══════════════════════════════════════════
    //  ESSALUD (Ley 26790)
    // ═══════════════════════════════════════════
    ESSALUD: Object.freeze({
        general:  { tasa: 0.09,  nombre: "Régimen General" },
        pequena:  { tasa: 0.09,  nombre: "Pequeña Empresa" },
        agrario:  { tasa: 0.06,  nombre: "Régimen Agrario" },
        micro:    { tasa: 0.045, nombre: "Microempresa (subsidiado 50%)" }
    }),

    // ═══════════════════════════════════════════
    //  SCTR (D.S. 003-98-SA) - Tasas promedio
    // ═══════════════════════════════════════════
    SCTR: Object.freeze({
        salud:   0.0053,
        pension: 0.0053,
        get total() { return this.salud + this.pension; }
    }),

    // ═══════════════════════════════════════════
    //  VIDA LEY (D. Leg. 688)
    //  Obligatorio desde 4 años de servicio
    // ═══════════════════════════════════════════
    VIDA_LEY: Object.freeze({
        "4-mas":  { factor: 16, nombre: "4+ años (16 remuneraciones)" },
        "natural": { factor: 32, nombre: "Muerte natural (32 remuneraciones)" },
        prima_mensual_estimada: 0.0053 // ~0.53% de la remuneración
    }),

    // ═══════════════════════════════════════════
    //  GRATIFICACIÓN (Ley 27735 + Ley 30334)
    // ═══════════════════════════════════════════
    BONIF_EXTRAORDINARIA: 0.09, // 9% (equivalente al EsSalud no descontado)

    PERIODOS_GRATIFICACION: Object.freeze({
        julio:    { nombre: "Fiestas Patrias", semestre: [1, 6],  mes_pago: 7 },
        diciembre:{ nombre: "Navidad",         semestre: [7, 12], mes_pago: 12 }
    }),

    // ═══════════════════════════════════════════
    //  CTS (D.S. 001-97-TR)
    // ═══════════════════════════════════════════
    CTS_SEXTO_GRATIFICACION: 1 / 6,

    // ═══════════════════════════════════════════
    //  REGÍMENES LABORALES
    // ═══════════════════════════════════════════
    REGIMENES: Object.freeze({
        general: {
            nombre: "Régimen General",
            cts: true,
            cts_dias_ano: 30,             // 30 días por año = 1 sueldo
            gratificacion: true,
            gratificacion_factor: 1,       // 1 sueldo completo
            vacaciones_dias: 30,
            essalud_tasa: 0.09,
            asig_familiar: true,
            vida_ley: true,
            utilidades: true,
            indemnizacion_despido: 1.5,    // 1.5 remu por año
            indemnizacion_tope_remu: 12    // Tope 12 remuneraciones
        },
        pequena: {
            nombre: "Pequeña Empresa",
            cts: true,
            cts_dias_ano: 15,             // 15 días por año = 0.5 sueldo
            gratificacion: true,
            gratificacion_factor: 0.5,     // Medio sueldo
            vacaciones_dias: 15,
            essalud_tasa: 0.09,
            asig_familiar: true,
            vida_ley: true,
            utilidades: true,
            indemnizacion_despido: 0.6667, // 20 remu diarias por año
            indemnizacion_tope_remu: 4     // Tope 120 remu diarias
        },
        micro: {
            nombre: "Microempresa",
            cts: false,
            cts_dias_ano: 0,
            gratificacion: false,
            gratificacion_factor: 0,
            vacaciones_dias: 15,
            essalud_tasa: 0.045,           // Subsidiado 50%
            asig_familiar: false,
            vida_ley: false,
            utilidades: false,
            indemnizacion_despido: 0.3333, // 10 remu diarias por año
            indemnizacion_tope_remu: 3     // Tope 90 remu diarias
        }
    }),

    // ═══════════════════════════════════════════
    //  UTILIDADES (D. Leg. 892)
    // ═══════════════════════════════════════════
    UTILIDADES_SECTOR: Object.freeze({
        pesca:    { pct: 10, nombre: "Pesquería" },
        telecom:  { pct: 10, nombre: "Telecomunicaciones" },
        industria:{ pct: 8,  nombre: "Industria Manufacturera" },
        mineria:  { pct: 8,  nombre: "Minería" },
        comercio: { pct: 5,  nombre: "Comercio al por mayor/menor" },
        otros:    { pct: 5,  nombre: "Otras actividades" }
    }),
    UTILIDADES_TOPE_REMUNERACIONES: 18, // Tope 18 remuneraciones mensuales

    // ═══════════════════════════════════════════
    //  VACACIONES (D. Leg. 713)
    // ═══════════════════════════════════════════
    VACACIONES_INDEMNIZACION_FACTOR: 3, // Triple (1 descanso + 1 trabajo + 1 indemn.)

    // ═══════════════════════════════════════════
    //  FAQ
    // ═══════════════════════════════════════════
    FAQ: Object.freeze([
        {
            pregunta: "¿Cómo se calcula el sueldo neto en Perú?",
            respuesta: "El sueldo neto se obtiene restando al sueldo bruto (incluyendo asignación familiar si aplica) los descuentos de ley: aporte al sistema de pensiones (ONP 13% o AFP ~13.30%-13.61%) y, si corresponde, el Impuesto a la Renta de 5ta categoría. La fórmula es: <strong>Sueldo Neto = (Sueldo + Asig. Familiar) - Pensión - IR 5ta</strong>."
        },
        {
            pregunta: "¿Cuándo se pagan las gratificaciones en Perú?",
            respuesta: "Se pagan en <strong>julio (Fiestas Patrias)</strong> y <strong>diciembre (Navidad)</strong>. El monto equivale a una remuneración completa si se trabajó el semestre íntegro, o proporcional (sextos). Adicionalmente, se recibe una <strong>Bonificación Extraordinaria del 9%</strong> (Ley 30334), que representa el EsSalud que el empleador deja de aportar."
        },
        {
            pregunta: "¿Cómo se calcula la CTS?",
            respuesta: "La CTS se deposita semestralmente (mayo y noviembre). La remuneración computable incluye: <strong>Sueldo + Asig. Familiar + 1/6 de la última gratificación</strong>. Se calcula como (Remu. Computable / 360) × días del semestre. Para régimen general equivale a ~1 sueldo por año."
        },
        {
            pregunta: "¿Cómo se calculan las horas extras legalmente?",
            respuesta: "El valor hora se obtiene dividiendo la remuneración mensual (incluyendo asig. familiar) entre <strong>240 horas</strong> (30 días × 8 horas). Las primeras 2 horas extras diarias tienen sobretasa de <strong>25%</strong> y las siguientes <strong>35%</strong>. El trabajo nocturno (10pm-6am) tiene una sobretasa adicional del 35% sobre la remuneración."
        },
        {
            pregunta: "¿Cuál es la UIT vigente en 2024?",
            respuesta: "La UIT 2024 es de <strong>S/ 5,150</strong> (D.S. N° 309-2023-EF). Las primeras <strong>7 UIT (S/ 36,050)</strong> de renta bruta anual están exoneradas del Impuesto a la Renta de 5ta categoría."
        },
        {
            pregunta: "¿Cuál es la diferencia entre ONP y AFP?",
            respuesta: "La <strong>ONP</strong> descuenta un 13% fijo. Las <strong>AFP</strong> descuentan: 10% aporte obligatorio + comisión (1.38% a 1.69%) + prima de seguro (1.92%), totalizando entre ~13.30% y ~13.61%. La AFP Habitat es actualmente la más económica."
        },
        {
            pregunta: "¿Qué incluye la liquidación de beneficios sociales?",
            respuesta: "Incluye: <strong>CTS trunca</strong> (proporcional), <strong>Gratificación trunca</strong> + bonif. 9%, <strong>Vacaciones truncas</strong>, vacaciones no gozadas si las hubiera, y en caso de despido arbitrario, <strong>indemnización</strong> (1.5 remuneraciones por año en régimen general, tope 12 remuneraciones)."
        },
        {
            pregunta: "¿Cuánto cuesta realmente un trabajador al empleador?",
            respuesta: "En régimen general, el costo adicional sobre el sueldo bruto es aproximadamente <strong>+45% a +55%</strong>, incluyendo: EsSalud (9%), CTS mensualizada (~8.33%), Gratificaciones mensualizadas (~18.17% con bonif.), Vacaciones (~8.33%), Vida Ley (~0.53%), y SCTR si aplica (~1.06%)."
        },
        {
            pregunta: "¿Las utilidades son obligatorias para todas las empresas?",
            respuesta: "Solo para empresas con <strong>más de 20 trabajadores</strong> que generan rentas de tercera categoría. El porcentaje varía por sector: Pesca/Telecom (10%), Industria/Minería (8%), Comercio/Otros (5%). Se distribuye 50% por días trabajados y 50% por remuneraciones. <strong>Tope: 18 remuneraciones mensuales</strong> por trabajador."
        },
        {
            pregunta: "¿Qué es el Seguro Vida Ley?",
            respuesta: "Es un seguro obligatorio que el empleador debe contratar para trabajadores con <strong>4 o más años de servicio</strong> (D. Leg. 688). Cubre muerte natural (32 remuneraciones), muerte accidental (32 remu.) e invalidez (32 remu.). La prima promedio es ~0.53% de la remuneración mensual."
        }
    ])
});


// ═══════════════════════════════════════════════════════════════
//  MOTOR DE CÁLCULO DE PRECISIÓN (Calculation Engine)
// ═══════════════════════════════════════════════════════════════

const CalcEngine = (() => {

    // ─── Precisión Financiera ────────────────────────
    // NO redondear hasta el resultado final para UI
    const _precision = 10; // decimales internos

    function safeCalc(value) {
        if (typeof value !== 'number' || !isFinite(value)) return 0;
        return parseFloat(value.toFixed(_precision));
    }

    function roundUI(value) {
        return Math.round(value * 100) / 100;
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(roundUI(amount));
    }

    // ─── Base Remunerativa Universal ──────────────────
    function getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen = 'general') {
        const reg = DATA.REGIMENES[regimen];
        let asigFamiliar = 0;
        if (incluyeAsigFamiliar && reg && reg.asig_familiar) {
            asigFamiliar = safeCalc(DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT);
        }
        return {
            sueldoBruto: safeCalc(sueldoBruto),
            asigFamiliar: safeCalc(asigFamiliar),
            total: safeCalc(sueldoBruto + asigFamiliar)
        };
    }

    // ─── Pensiones ────────────────────────────────────
    function calcularPension(baseTotal, tipoPension) {
        const p = DATA.PENSIONES[tipoPension];
        if (!p) return { total: 0, detalle: [], audit: 'Pensión no encontrada' };

        const audit = [];
        let detalles = [];

        if (tipoPension === 'onp') {
            const monto = safeCalc(baseTotal * p.aporte);
            detalles.push({ concepto: `ONP (${(p.aporte * 100).toFixed(0)}%)`, monto, tasa: p.aporte });
            audit.push(`ONP: ${baseTotal} × ${p.aporte} = ${monto}`);
        } else {
            const fondo = safeCalc(baseTotal * p.aporte);
            const comision = safeCalc(baseTotal * p.comision);
            const seguro = safeCalc(baseTotal * p.seguro);
            detalles = [
                { concepto: `Fondo obligatorio (${(p.aporte * 100).toFixed(0)}%)`, monto: fondo, tasa: p.aporte },
                { concepto: `Comisión flujo (${(p.comision * 100).toFixed(2)}%)`, monto: comision, tasa: p.comision },
                { concepto: `Prima seguro (${(p.seguro * 100).toFixed(2)}%)`, monto: seguro, tasa: p.seguro }
            ];
            audit.push(`Fondo: ${baseTotal} × ${p.aporte} = ${fondo}`);
            audit.push(`Comisión: ${baseTotal} × ${p.comision} = ${comision}`);
            audit.push(`Seguro: ${baseTotal} × ${p.seguro} = ${seguro}`);
        }

        const total = safeCalc(detalles.reduce((s, d) => s + d.monto, 0));
        audit.push(`Total pensión: ${total}`);

        return {
            nombre: p.nombre,
            nombreCompleto: p.nombreCompleto,
            total,
            detalle: detalles,
            tasaEfectiva: safeCalc(total / baseTotal),
            audit: audit.join('\n')
        };
    }

    // ─── Impuesto a la Renta 5ta Categoría ────────────
    function calcularIRAnual(rentaNetaAnual) {
        const audit = [];
        let impuestoTotal = 0;
        let restante = safeCalc(Math.max(0, rentaNetaAnual));
        let limiteAnterior = 0;
        const tramos = [];

        audit.push(`Renta neta anual: S/ ${restante}`);

        for (const tramo of DATA.TRAMOS_IR) {
            const limiteSuperior = tramo.hasta_uit === Infinity
                ? Infinity
                : safeCalc(tramo.hasta_uit * DATA.UIT);
            const rangoTramo = limiteSuperior === Infinity
                ? restante
                : safeCalc(limiteSuperior - limiteAnterior);

            const baseGravable = safeCalc(Math.min(Math.max(0, restante), rangoTramo));
            const impuestoTramo = safeCalc(baseGravable * tramo.tasa);

            tramos.push({
                nombre: tramo.nombre,
                tasa: tramo.tasa,
                color: tramo.color,
                limiteInferior: limiteAnterior,
                limiteSuperior,
                rangoTramo,
                baseGravable,
                impuesto: impuestoTramo
            });

            if (baseGravable > 0) {
                audit.push(`${tramo.nombre}: ${baseGravable} × ${tramo.tasa} = ${impuestoTramo}`);
            }

            impuestoTotal = safeCalc(impuestoTotal + impuestoTramo);
            restante = safeCalc(restante - baseGravable);
            limiteAnterior = limiteSuperior;
        }

        audit.push(`IR Anual Total: S/ ${impuestoTotal}`);

        return {
            impuesto: impuestoTotal,
            tramos,
            audit: audit.join('\n')
        };
    }

    // ─── Proyección Renta 5ta (Procedimiento SUNAT) ───
    function proyectarRenta5ta(params) {
        const {
            sueldoMensual,
            asigFamiliar = 0,
            mesCalculo,
            remuPercibidas = 0,
            gratPercibidas = 0,
            otrosIngresos = 0
        } = params;

        const audit = [];
        const base = safeCalc(sueldoMensual + asigFamiliar);
        const mesesRestantes = 12 - mesCalculo + 1;
        const proyeccionSueldos = safeCalc(base * mesesRestantes);

        // Gratificaciones pendientes (con Bonif. Extraordinaria)
        let gratPendientes = 0;
        let bonifPendientes = 0;

        // Gratificación Julio
        if (mesCalculo <= 7) {
            gratPendientes = safeCalc(gratPendientes + base);
            bonifPendientes = safeCalc(bonifPendientes + base * DATA.BONIF_EXTRAORDINARIA);
        }
        // Gratificación Diciembre
        if (mesCalculo <= 12) {
            gratPendientes = safeCalc(gratPendientes + base);
            bonifPendientes = safeCalc(bonifPendientes + base * DATA.BONIF_EXTRAORDINARIA);
        }

        const rentaBrutaAnual = safeCalc(
            remuPercibidas +
            gratPercibidas +
            proyeccionSueldos +
            gratPendientes +
            bonifPendientes +
            otrosIngresos
        );

        const deduccion7UIT = safeCalc(DATA.DEDUCCION_UIT * DATA.UIT);
        const rentaNetaAnual = safeCalc(Math.max(0, rentaBrutaAnual - deduccion7UIT));

        audit.push(`=== PROYECCIÓN RENTA 5TA - MES ${mesCalculo} ===`);
        audit.push(`Base mensual: ${base} (Sueldo: ${sueldoMensual} + AF: ${asigFamiliar})`);
        audit.push(`Remuneraciones percibidas: ${remuPercibidas}`);
        audit.push(`Gratificaciones percibidas: ${gratPercibidas}`);
        audit.push(`Proyección sueldos (${mesesRestantes} meses): ${proyeccionSueldos}`);
        audit.push(`Gratificaciones pendientes: ${gratPendientes}`);
        audit.push(`Bonif. extraordinarias pendientes: ${bonifPendientes}`);
        audit.push(`Otros ingresos: ${otrosIngresos}`);
        audit.push(`RENTA BRUTA ANUAL: ${rentaBrutaAnual}`);
        audit.push(`Deducción 7 UIT: -${deduccion7UIT}`);
        audit.push(`RENTA NETA ANUAL: ${rentaNetaAnual}`);

        const irResult = calcularIRAnual(rentaNetaAnual);
        const divisor = DATA.DIVISORES_RETENCION[mesCalculo] || 12;
        const retencionMensual = safeCalc(irResult.impuesto / divisor);

        audit.push(`IR Anual: ${irResult.impuesto}`);
        audit.push(`Divisor mes ${mesCalculo}: ${divisor}`);
        audit.push(`RETENCIÓN MENSUAL: ${irResult.impuesto} / ${divisor} = ${retencionMensual}`);

        return {
            rentaBrutaAnual,
            deduccion7UIT,
            rentaNetaAnual,
            irAnual: irResult.impuesto,
            tramos: irResult.tramos,
            divisor,
            retencionMensual,
            desglose: {
                remuPercibidas,
                gratPercibidas,
                proyeccionSueldos,
                gratPendientes,
                bonifPendientes,
                otrosIngresos,
                mesesRestantes
            },
            audit: audit.join('\n') + '\n' + irResult.audit
        };
    }

    // ═══════════════════════════════════════════════
    //  CALCULADORAS PRINCIPALES
    // ═══════════════════════════════════════════════

    // ─── 1. SUELDO NETO ──────────────────────────────
    function sueldoNeto(params) {
        const {
            sueldoBruto, regimen = 'general', tipoPension = 'onp',
            incluyeAsigFamiliar = false, mesCalculo = 6
        } = params;

        const audit = ['=== CÁLCULO SUELDO NETO ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);
        audit.push(`Base: ${base.sueldoBruto} + AF ${base.asigFamiliar} = ${base.total}`);

        const pension = calcularPension(base.total, tipoPension);
        audit.push(`Pensión (${pension.nombre}): ${pension.total}`);

        // IR 5ta (proyección simplificada)
        const irProyeccion = proyectarRenta5ta({
            sueldoMensual: base.sueldoBruto,
            asigFamiliar: base.asigFamiliar,
            mesCalculo,
            remuPercibidas: 0,
            gratPercibidas: 0,
            otrosIngresos: 0
        });
        const irMensual = irProyeccion.retencionMensual;
        audit.push(`IR 5ta mensual: ${irMensual}`);

        const totalDescuentos = safeCalc(pension.total + irMensual);
        const neto = safeCalc(base.total - totalDescuentos);

        audit.push(`Total descuentos: ${totalDescuentos}`);
        audit.push(`SUELDO NETO: ${base.total} - ${totalDescuentos} = ${neto}`);

        return {
            base,
            pension,
            ir: {
                mensual: irMensual,
                anual: irProyeccion.irAnual,
                tramos: irProyeccion.tramos,
                rentaNetaAnual: irProyeccion.rentaNetaAnual
            },
            totalDescuentos,
            sueldoNeto: neto,
            porcentajeDescuento: safeCalc((totalDescuentos / base.total) * 100),
            regimen: DATA.REGIMENES[regimen],
            audit: audit.join('\n')
        };
    }

    // ─── 2. GRATIFICACIÓN ────────────────────────────
    function gratificacion(params) {
        const {
            sueldoBruto, periodo = 'julio', mesesTrabajados = 6,
            incluyeAsigFamiliar = false, incluyeBonif = true
        } = params;

        const audit = ['=== CÁLCULO GRATIFICACIÓN ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);
        const mesesEfectivos = Math.min(Math.max(0, mesesTrabajados), DATA.MESES_SEMESTRE);

        const gratificacionBase = safeCalc((base.total / DATA.MESES_SEMESTRE) * mesesEfectivos);
        const bonifExtraordinaria = incluyeBonif
            ? safeCalc(gratificacionBase * DATA.BONIF_EXTRAORDINARIA)
            : 0;
        const totalRecibir = safeCalc(gratificacionBase + bonifExtraordinaria);

        audit.push(`Base: ${base.total}`);
        audit.push(`Meses: ${mesesEfectivos} / ${DATA.MESES_SEMESTRE}`);
        audit.push(`Gratificación: (${base.total} / 6) × ${mesesEfectivos} = ${gratificacionBase}`);
        audit.push(`Bonif. 9%: ${gratificacionBase} × 0.09 = ${bonifExtraordinaria}`);
        audit.push(`TOTAL: ${totalRecibir}`);

        return {
            base,
            periodo: DATA.PERIODOS_GRATIFICACION[periodo],
            mesesEfectivos,
            gratificacionBase,
            bonifExtraordinaria,
            totalRecibir,
            audit: audit.join('\n')
        };
    }

    // ─── 3. CTS ──────────────────────────────────────
    function cts(params) {
        const {
            sueldoBruto, meses = 6, dias = 0,
            incluyeAsigFamiliar = false, ultimaGratificacion = 0
        } = params;

        const audit = ['=== CÁLCULO CTS ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);
        const sextoGrat = safeCalc(ultimaGratificacion * DATA.CTS_SEXTO_GRATIFICACION);
        const remuComputable = safeCalc(base.total + sextoGrat);

        const totalDias = safeCalc(meses * DATA.DIAS_MES + dias);
        const valorDiario = safeCalc(remuComputable / DATA.DIAS_ANO);
        const ctsTotal = safeCalc(valorDiario * totalDias);

        audit.push(`Base: ${base.total}`);
        audit.push(`1/6 Gratificación: ${ultimaGratificacion} / 6 = ${sextoGrat}`);
        audit.push(`Remu. computable: ${remuComputable}`);
        audit.push(`Días: ${meses}m × 30 + ${dias}d = ${totalDias}`);
        audit.push(`Valor diario: ${remuComputable} / 360 = ${valorDiario}`);
        audit.push(`CTS: ${valorDiario} × ${totalDias} = ${ctsTotal}`);

        return {
            base,
            sextoGratificacion: sextoGrat,
            remuComputable,
            totalDias,
            valorDiario,
            cts: ctsTotal,
            audit: audit.join('\n')
        };
    }

    // ─── 4. HORAS EXTRAS ─────────────────────────────
    function horasExtras(params) {
        const {
            sueldoBruto, horas25 = 0, horas35 = 0,
            incluyeAsigFamiliar = false, esNocturno = false
        } = params;

        const audit = ['=== CÁLCULO HORAS EXTRAS ==='];
        audit.push(`D.S. 007-2002-TR | Divisor legal: ${DATA.HORAS_MES_LEGAL} horas`);

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        // Sobretasa nocturna sobre la remuneración base
        const sobreTasaNocturna = esNocturno
            ? safeCalc(base.total * DATA.SOBRETASA_NOCTURNO)
            : 0;
        const baseParaHE = esNocturno
            ? safeCalc(base.total + sobreTasaNocturna)
            : base.total;

        // Valor hora legal: Remuneración / 240
        const valorHora = safeCalc(baseParaHE / DATA.HORAS_MES_LEGAL);

        // Cálculo sin redondeos intermedios
        const valorHora25 = safeCalc(valorHora * (1 + DATA.SOBRETASA_HE_25));
        const valorHora35 = safeCalc(valorHora * (1 + DATA.SOBRETASA_HE_35));

        const pagoHoras25 = safeCalc(horas25 * valorHora25);
        const pagoHoras35 = safeCalc(horas35 * valorHora35);
        const totalHorasExtras = safeCalc(pagoHoras25 + pagoHoras35);

        audit.push(`Base remunerativa: ${base.total} (Sueldo: ${base.sueldoBruto} + AF: ${base.asigFamiliar})`);
        if (esNocturno) {
            audit.push(`Sobretasa nocturna 35%: ${base.total} × 0.35 = ${sobreTasaNocturna}`);
            audit.push(`Base para HE (con nocturno): ${baseParaHE}`);
        }
        audit.push(`Valor hora: ${baseParaHE} / ${DATA.HORAS_MES_LEGAL} = ${valorHora}`);
        audit.push(`Valor hora +25%: ${valorHora} × 1.25 = ${valorHora25}`);
        audit.push(`Valor hora +35%: ${valorHora} × 1.35 = ${valorHora35}`);
        audit.push(`Pago 25% (${horas25}h): ${horas25} × ${valorHora25} = ${pagoHoras25}`);
        audit.push(`Pago 35% (${horas35}h): ${horas35} × ${valorHora35} = ${pagoHoras35}`);
        audit.push(`TOTAL HORAS EXTRAS: ${totalHorasExtras}`);

        return {
            base,
            esNocturno,
            sobreTasaNocturna,
            baseParaHE,
            valorHora,
            valorHora25,
            valorHora35,
            horas25, horas35,
            pagoHoras25,
            pagoHoras35,
            totalHorasExtras,
            audit: audit.join('\n')
        };
    }

    // ─── 5. VACACIONES ───────────────────────────────
    function vacaciones(params) {
        const {
            sueldoBruto, diasVacaciones = 30, mesesLaborados = 12,
            incluyeAsigFamiliar = false, noGozadas = false
        } = params;

        const audit = ['=== CÁLCULO VACACIONES ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);
        const valorDiario = safeCalc(base.total / DATA.DIAS_MES);
        const proporcion = safeCalc(mesesLaborados / DATA.MESES_ANO);
        const remuVacacional = safeCalc(valorDiario * diasVacaciones * proporcion);

        let indemnizacion = 0;
        if (noGozadas) {
            // Triple: 1 descanso adquirido + 1 por trabajo + 1 indemnización
            indemnizacion = safeCalc(remuVacacional * 2);
        }
        const total = safeCalc(remuVacacional + indemnizacion);

        audit.push(`Base: ${base.total}`);
        audit.push(`Valor diario: ${base.total} / 30 = ${valorDiario}`);
        audit.push(`Proporción: ${mesesLaborados} / 12 = ${proporcion}`);
        audit.push(`Remu. vacacional: ${valorDiario} × ${diasVacaciones} × ${proporcion} = ${remuVacacional}`);
        if (noGozadas) {
            audit.push(`Indemnización no gozadas (×2): ${indemnizacion}`);
        }
        audit.push(`TOTAL: ${total}`);

        return {
            base,
            valorDiario,
            proporcion,
            remuVacacional,
            noGozadas,
            indemnizacion,
            total,
            audit: audit.join('\n')
        };
    }

    // ─── 6. IMPUESTO A LA RENTA ──────────────────────
    function impuestoRenta(params) {
        const {
            sueldoBruto, meses = 12, numGratificaciones = 2,
            incluyeAsigFamiliar = false, otrosIngresos = 0
        } = params;

        const audit = ['=== CÁLCULO IR 5TA CATEGORÍA ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        // Renta bruta incluye gratificaciones + bonif. extraordinaria
        const sueldosAnuales = safeCalc(base.total * meses);
        const gratAnuales = safeCalc(base.total * numGratificaciones);
        const bonifAnuales = safeCalc(gratAnuales * DATA.BONIF_EXTRAORDINARIA);

        const rentaBrutaAnual = safeCalc(sueldosAnuales + gratAnuales + bonifAnuales + otrosIngresos);
        const deduccion = safeCalc(DATA.DEDUCCION_UIT * DATA.UIT);
        const rentaNetaAnual = safeCalc(Math.max(0, rentaBrutaAnual - deduccion));

        audit.push(`Base mensual: ${base.total}`);
        audit.push(`Sueldos (${meses}m): ${sueldosAnuales}`);
        audit.push(`Gratificaciones (${numGratificaciones}): ${gratAnuales}`);
        audit.push(`Bonif. extraordinaria: ${bonifAnuales}`);
        audit.push(`Otros ingresos: ${otrosIngresos}`);
        audit.push(`Renta bruta anual: ${rentaBrutaAnual}`);
        audit.push(`Deducción 7 UIT: -${deduccion}`);
        audit.push(`Renta neta anual: ${rentaNetaAnual}`);

        const irResult = calcularIRAnual(rentaNetaAnual);
        const irMensual = meses > 0 ? safeCalc(irResult.impuesto / meses) : 0;
        const tasaEfectiva = rentaBrutaAnual > 0
            ? safeCalc((irResult.impuesto / rentaBrutaAnual) * 100)
            : 0;

        audit.push(`IR Anual: ${irResult.impuesto}`);
        audit.push(`IR Mensual estimado: ${irResult.impuesto} / ${meses} = ${irMensual}`);
        audit.push(`Tasa efectiva: ${tasaEfectiva}%`);

        return {
            base,
            desglose: {
                sueldosAnuales,
                gratAnuales,
                bonifAnuales,
                otrosIngresos
            },
            rentaBrutaAnual,
            deduccion7UIT: deduccion,
            rentaNetaAnual,
            irAnual: irResult.impuesto,
            irMensual,
            tramos: irResult.tramos,
            tasaEfectiva,
            audit: audit.join('\n') + '\n' + irResult.audit
        };
    }

    // ─── 7. LIQUIDACIÓN ──────────────────────────────
    function liquidacion(params) {
        const {
            sueldoBruto, fechaIngreso, fechaCese,
            motivo = 'renuncia', vacPendientes = 0,
            incluyeAsigFamiliar = false, regimen = 'general'
        } = params;

        const audit = ['=== CÁLCULO LIQUIDACIÓN ==='];
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);

        // Tiempo de servicio
        const diffMs = fechaCese.getTime() - fechaIngreso.getTime();
        const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const anos = Math.floor(totalDias / 365);
        const mesesRest = Math.floor((totalDias % 365) / 30);
        const diasRest = (totalDias % 365) % 30;

        audit.push(`Tiempo: ${anos}a ${mesesRest}m ${diasRest}d (${totalDias} días total)`);
        audit.push(`Régimen: ${reg.nombre}`);
        audit.push(`Base: ${base.total}`);

        // CTS Trunca
        let ctsTrunca = 0;
        if (reg.cts) {
            const factorCTS = reg.cts_dias_ano / 30; // 30/30=1 general, 15/30=0.5 pequeña
            const diasCTSTruncos = safeCalc(mesesRest * 30 + diasRest);
            ctsTrunca = safeCalc((base.total * factorCTS / DATA.DIAS_ANO) * diasCTSTruncos);
            audit.push(`CTS trunca: (${base.total} × ${factorCTS} / 360) × ${diasCTSTruncos} = ${ctsTrunca}`);
        }

        // Gratificación Trunca
        let gratTrunca = 0;
        let bonifGratTrunca = 0;
        if (reg.gratificacion) {
            const mesCese = fechaCese.getMonth() + 1;
            const mesesSemestre = mesCese <= 6 ? mesCese : mesCese - 6;
            gratTrunca = safeCalc((base.total * reg.gratificacion_factor / DATA.MESES_SEMESTRE) * mesesSemestre);
            bonifGratTrunca = safeCalc(gratTrunca * DATA.BONIF_EXTRAORDINARIA);
            audit.push(`Grat. trunca: (${base.total} × ${reg.gratificacion_factor} / 6) × ${mesesSemestre} = ${gratTrunca}`);
            audit.push(`Bonif. 9%: ${gratTrunca} × 0.09 = ${bonifGratTrunca}`);
        }

        // Vacaciones Truncas
        const mesesVacTruncos = Math.floor((totalDias % 365) / 30);
        const diasVacTruncos = (totalDias % 365) % 30;
        const vacDiasProporcion = safeCalc(reg.vacaciones_dias * (mesesVacTruncos * 30 + diasVacTruncos) / DATA.DIAS_ANO);
        const vacTruncas = safeCalc((base.total / DATA.DIAS_MES) * vacDiasProporcion);
        audit.push(`Vac. truncas: (${base.total}/30) × ${vacDiasProporcion} días prop. = ${vacTruncas}`);

        // Vacaciones pendientes
        const pagoVacPendientes = safeCalc((base.total / DATA.DIAS_MES) * vacPendientes);
        if (vacPendientes > 0) {
            audit.push(`Vac. pendientes: (${base.total}/30) × ${vacPendientes} = ${pagoVacPendientes}`);
        }

        // Indemnización por despido arbitrario
        let indemnizacion = 0;
        if (motivo === 'despido-arbitrario') {
            const anosServ = safeCalc(anos + mesesRest / 12 + diasRest / 360);
            const indemnCalc = safeCalc(base.total * reg.indemnizacion_despido * anosServ);
            const tope = safeCalc(base.total * reg.indemnizacion_tope_remu);
            indemnizacion = Math.min(indemnCalc, tope);
            audit.push(`Indemnización: ${base.total} × ${reg.indemnizacion_despido} × ${anosServ} = ${indemnCalc}`);
            audit.push(`Tope: ${base.total} × ${reg.indemnizacion_tope_remu} = ${tope}`);
            audit.push(`Indemnización final: min(${indemnCalc}, ${tope}) = ${indemnizacion}`);
        }

        const totalLiquidacion = safeCalc(
            ctsTrunca + gratTrunca + bonifGratTrunca + vacTruncas + pagoVacPendientes + indemnizacion
        );

        audit.push(`TOTAL LIQUIDACIÓN: ${totalLiquidacion}`);

        return {
            base,
            regimen: reg,
            tiempoServicio: { anos, meses: mesesRest, dias: diasRest, totalDias },
            motivo,
            ctsTrunca,
            gratTrunca,
            bonifGratTrunca,
            vacTruncas,
            pagoVacPendientes,
            vacPendientes,
            indemnizacion,
            totalLiquidacion,
            audit: audit.join('\n')
        };
    }

    // ─── 8. ESSALUD ──────────────────────────────────
    function essalud(params) {
        const { sueldoBruto, regimen = 'general', numTrabajadores = 1, incluyeAsigFamiliar = false } = params;

        const audit = ['=== CÁLCULO ESSALUD ==='];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);
        const tasaInfo = DATA.ESSALUD[regimen] || DATA.ESSALUD.general;

        const aporteUnitario = safeCalc(base.total * tasaInfo.tasa);
        const baseMinima = safeCalc(DATA.RMV * tasaInfo.tasa);
        const aporteReal = Math.max(aporteUnitario, baseMinima);
        const aporteTotal = safeCalc(aporteReal * numTrabajadores);
        const aporteAnual = safeCalc(aporteTotal * DATA.MESES_ANO);

        audit.push(`Base: ${base.total}`);
        audit.push(`Tasa: ${tasaInfo.tasa * 100}%`);
        audit.push(`Aporte unitario: ${base.total} × ${tasaInfo.tasa} = ${aporteUnitario}`);
        audit.push(`Base mínima (sobre RMV): ${baseMinima}`);
        audit.push(`Aporte real: max(${aporteUnitario}, ${baseMinima}) = ${aporteReal}`);
        audit.push(`Total (${numTrabajadores} trab.): ${aporteTotal}`);

        return {
            base,
            tasaInfo,
            aporteUnitario,
            baseMinima,
            aporteReal,
            numTrabajadores,
            aporteTotal,
            aporteAnual,
            audit: audit.join('\n')
        };
    }

    // ─── 9. UTILIDADES ───────────────────────────────
    function utilidades(params) {
        const {
            rentaEmpresa, porcentajeSector, diasTrabajados, totalDiasTodos,
            remuAnual, totalRemuTodos
        } = params;

        const audit = ['=== CÁLCULO UTILIDADES ==='];

        const montoDistribuir = safeCalc(rentaEmpresa * porcentajeSector / 100);
        const mitad = safeCalc(montoDistribuir / 2);

        const porDias = safeCalc((mitad / totalDiasTodos) * diasTrabajados);
        const porRemu = totalRemuTodos > 0 ? safeCalc((mitad / totalRemuTodos) * remuAnual) : 0;
        const totalCalculado = safeCalc(porDias + porRemu);

        const remuMensual = safeCalc(remuAnual / DATA.MESES_ANO);
        const tope = safeCalc(remuMensual * DATA.UTILIDADES_TOPE_REMUNERACIONES);
        const totalFinal = Math.min(totalCalculado, tope);
        const excedente = safeCalc(Math.max(0, totalCalculado - tope));

        audit.push(`Renta empresa: ${rentaEmpresa}`);
        audit.push(`Sector: ${porcentajeSector}%`);
        audit.push(`Monto a distribuir: ${montoDistribuir}`);
        audit.push(`Mitad: ${mitad}`);
        audit.push(`Por días: (${mitad} / ${totalDiasTodos}) × ${diasTrabajados} = ${porDias}`);
        audit.push(`Por remu: (${mitad} / ${totalRemuTodos}) × ${remuAnual} = ${porRemu}`);
        audit.push(`Total calculado: ${totalCalculado}`);
        audit.push(`Tope 18 remu: ${tope}`);
        audit.push(`TOTAL FINAL: ${totalFinal}`);

        return {
            montoDistribuir,
            porDias,
            porRemu,
            totalCalculado,
            remuMensual,
            tope,
            totalFinal,
            excedente,
            audit: audit.join('\n')
        };
    }

    // ─── 10. ASIGNACIÓN FAMILIAR ─────────────────────
    function asignacionFamiliar(params) {
        const { numHijos = 0 } = params;
        const monto = numHijos > 0 ? safeCalc(DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT) : 0;
        const audit = [
            '=== ASIGNACIÓN FAMILIAR ===',
            `RMV: ${DATA.RMV}`,
            `Tasa: ${DATA.ASIGNACION_FAMILIAR_PCT * 100}%`,
            `Hijos: ${numHijos}`,
            `Derecho: ${numHijos > 0 ? 'SÍ' : 'NO'}`,
            `Monto: ${DATA.RMV} × ${DATA.ASIGNACION_FAMILIAR_PCT} = ${monto}`
        ].join('\n');

        return {
            rmv: DATA.RMV,
            porcentaje: DATA.ASIGNACION_FAMILIAR_PCT,
            numHijos,
            tieneDerechoFlag: numHijos > 0,
            montoMensual: monto,
            montoAnual: safeCalc(monto * 12),
            audit
        };
    }

    // ─── 11. RENTA 5TA DETALLADA ─────────────────────
    function rentaQuintaDetallada(params) {
        const {
            sueldoBruto, mesCalculo = 12,
            remuPercibidas = 0, gratPercibidas = 0,
            incluyeAsigFamiliar = false, otrosIngresos = 0
        } = params;

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);
        return proyectarRenta5ta({
            sueldoMensual: base.sueldoBruto,
            asigFamiliar: base.asigFamiliar,
            mesCalculo,
            remuPercibidas,
            gratPercibidas,
            otrosIngresos
        });
    }

    // ─── 12. COSTO TOTAL DEL EMPLEADOR ───────────────
    function costoEmpleador(params) {
        const {
            sueldoBruto, regimen = 'general',
            incluyeAsigFamiliar = false, incluyeSCTR = false,
            anosServicio = 4
        } = params;

        const audit = ['=== COSTO TOTAL DEL EMPLEADOR ==='];
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);

        audit.push(`Régimen: ${reg.nombre}`);
        audit.push(`Base: ${base.total}`);

        // EsSalud
        const essaludMensual = safeCalc(base.total * reg.essalud_tasa);
        audit.push(`EsSalud (${reg.essalud_tasa * 100}%): ${base.total} × ${reg.essalud_tasa} = ${essaludMensual}`);

        // CTS mensualizada
        let ctsMensualizada = 0;
        if (reg.cts) {
            ctsMensualizada = safeCalc((base.total * (reg.cts_dias_ano / DATA.DIAS_MES)) / DATA.MESES_ANO);
            audit.push(`CTS mensualizada (${reg.cts_dias_ano}d/año): ${ctsMensualizada}`);
        }

        // Gratificaciones mensualizadas
        let gratMensualizada = 0;
        let bonifMensualizada = 0;
        if (reg.gratificacion) {
            gratMensualizada = safeCalc((base.total * reg.gratificacion_factor * 2) / DATA.MESES_ANO);
            bonifMensualizada = safeCalc(gratMensualizada * DATA.BONIF_EXTRAORDINARIA);
            audit.push(`Grat. mensualizada (factor ${reg.gratificacion_factor} × 2): ${gratMensualizada}`);
            audit.push(`Bonif. 9% mensualizada: ${bonifMensualizada}`);
        }

        // Vacaciones mensualizadas
        const vacMensualizada = safeCalc((base.total * (reg.vacaciones_dias / DATA.DIAS_MES)) / DATA.MESES_ANO);
        audit.push(`Vacaciones mensualiz. (${reg.vacaciones_dias}d): ${vacMensualizada}`);

        // SCTR
        let sctrMensual = 0;
        if (incluyeSCTR) {
            sctrMensual = safeCalc(base.total * DATA.SCTR.total);
            audit.push(`SCTR (${(DATA.SCTR.total * 100).toFixed(2)}%): ${sctrMensual}`);
        }

        // Vida Ley
        let vidaLeyMensual = 0;
        if (reg.vida_ley && anosServicio >= 4) {
            vidaLeyMensual = safeCalc(base.total * DATA.VIDA_LEY.prima_mensual_estimada);
            audit.push(`Vida Ley (~${(DATA.VIDA_LEY.prima_mensual_estimada * 100).toFixed(2)}%): ${vidaLeyMensual}`);
        }

        const costoAdicional = safeCalc(
            essaludMensual + ctsMensualizada + gratMensualizada +
            bonifMensualizada + vacMensualizada + sctrMensual + vidaLeyMensual
        );
        const costoTotalMensual = safeCalc(base.total + costoAdicional);
        const costoTotalAnual = safeCalc(costoTotalMensual * DATA.MESES_ANO);
        const porcentajeSobrecosto = safeCalc((costoAdicional / base.total) * 100);

        audit.push(`Costo adicional mensual: ${costoAdicional}`);
        audit.push(`COSTO TOTAL MENSUAL: ${base.total} + ${costoAdicional} = ${costoTotalMensual}`);
        audit.push(`Sobrecosto: +${porcentajeSobrecosto}%`);

        return {
            base,
            regimen: reg,
            desglose: {
                essaludMensual,
                ctsMensualizada,
                gratMensualizada,
                bonifMensualizada,
                vacMensualizada,
                sctrMensual,
                vidaLeyMensual
            },
            costoAdicional,
            costoTotalMensual,
            costoTotalAnual,
            porcentajeSobrecosto,
            audit: audit.join('\n')
        };
    }

    // ─── 13. COMPARADOR DE REGÍMENES ─────────────────
    function comparadorRegimenes(params) {
        const { sueldoBruto, incluyeAsigFamiliar = false, incluyeSCTR = false } = params;

        const audit = ['=== COMPARADOR DE REGÍMENES ==='];
        const resultados = {};

        for (const key of ['general', 'pequena', 'micro']) {
            const r = costoEmpleador({
                sueldoBruto,
                regimen: key,
                incluyeAsigFamiliar: key === 'micro' ? false : incluyeAsigFamiliar,
                incluyeSCTR,
                anosServicio: 4
            });
            resultados[key] = r;
            audit.push(`\n--- ${r.regimen.nombre} ---`);
            audit.push(`Costo mensual: ${r.costoTotalMensual}`);
            audit.push(`Sobrecosto: +${r.porcentajeSobrecosto}%`);
        }

        const ahorroMicroVsGeneral = safeCalc(
            resultados.general.costoTotalMensual - resultados.micro.costoTotalMensual
        );
        const ahorroPequenaVsGeneral = safeCalc(
            resultados.general.costoTotalMensual - resultados.pequena.costoTotalMensual
        );

        audit.push(`\nAhorro Micro vs General: ${ahorroMicroVsGeneral}`);
        audit.push(`Ahorro Pequeña vs General: ${ahorroPequenaVsGeneral}`);

        return {
            general: resultados.general,
            pequena: resultados.pequena,
            micro: resultados.micro,
            ahorroMicroVsGeneral,
            ahorroPequenaVsGeneral,
            audit: audit.join('\n')
        };
    }

    // ─── API Pública ─────────────────────────────────
    return Object.freeze({
        safeCalc,
        roundUI,
        formatMoney,
        getBaseRemunerativa,
        calcularPension,
        calcularIRAnual,
        proyectarRenta5ta,
        sueldoNeto,
        gratificacion,
        cts,
        horasExtras,
        vacaciones,
        impuestoRenta,
        liquidacion,
        essalud,
        utilidades,
        asignacionFamiliar,
        rentaQuintaDetallada,
        costoEmpleador,
        comparadorRegimenes
    });
})();
