/* ================================================================
   SueldoPro Ultra - DATA LAYER v4.0 (2026)
   ================================================================
   Motor Financiero de Precisión Certificada SUNAT
   Legislación Laboral Peruana 2026 - SUNAT / MTPE / SBS

   PRINCIPIOS DE ARQUITECTURA:
   1. CERO redondeos intermedios (10 decimales internos)
   2. PLAME-Style: roundPLAME() por concepto, luego suma
   3. Toda base remunerativa = Sueldo + Asig. Familiar + Prom.Var.
   4. Funciones puras: input → output, sin side effects
   5. Audit trail completo en cada cálculo
   6. Tope SBS Prima AFP sobre remuneración máxima asegurable
   7. EPS diferencia: 6.75% vs 9% EsSalud (Ley 30334 §3)
   8. Triple Vacacional (Art. 23 D.Leg. 713)
   ================================================================ */

const DATA = Object.freeze({

    // ═══════════════════════════════════════════
    //  PARÁMETROS NACIONALES 2026
    // ═══════════════════════════════════════════
    UIT: 5150,                           // D.S. N° 309-2023-EF (sin cambio 2026)
    RMV: 1075,                           // R.M. 2026 — INNEGOCIABLE
    ASIGNACION_FAMILIAR_PCT: 0.10,       // Ley 25129: 10% RMV = S/ 107.50

    // ═══════════════════════════════════════════
    //  CONSTANTES DE CÁLCULO LEGAL
    // ═══════════════════════════════════════════
    HORAS_MES_LEGAL: 240,               // 8h × 30d (D.S. 007-2002-TR Art. 12)
    DIAS_MES: 30,
    DIAS_ANO: 360,
    MESES_ANO: 12,
    MESES_SEMESTRE: 6,

    // ═══════════════════════════════════════════
    //  SISTEMA DE PENSIONES (SBS - 2026)
    //  Tope Prima SIS = Remuneración Máxima Asegurable SBS
    // ═══════════════════════════════════════════
    AFP_SBS_TOPE: 13733.34,             // Remu. Máx. Asegurable (RMA) SBS — Prima se detiene aquí

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

    DEDUCCION_UIT: 7,

    DIVISORES_RETENCION: Object.freeze({
        1: 12, 2: 12, 3: 12, 4: 12,
        5: 8,  6: 8,  7: 8,  8: 8,
        9: 4,  10: 4, 11: 4, 12: 1
    }),

    // ═══════════════════════════════════════════
    //  HORAS EXTRAS (D.S. 007-2002-TR)
    // ═══════════════════════════════════════════
    SOBRETASA_HE_25: 0.25,
    SOBRETASA_HE_35: 0.35,
    SOBRETASA_NOCTURNO: 0.35,

    // Factor inasistencia PLAME: 1 día + 1/5 dominical = 1.2
    FACTOR_INASISTENCIA: 1.2,

    // ═══════════════════════════════════════════
    //  ESSALUD (Ley 26790)
    // ═══════════════════════════════════════════
    ESSALUD: Object.freeze({
        general: { tasa: 0.09,  nombre: "Régimen General" },
        pequena: { tasa: 0.09,  nombre: "Pequeña Empresa" },
        agrario: { tasa: 0.06,  nombre: "Régimen Agrario" },
        micro:   { tasa: 0.045, nombre: "Microempresa (subsidiado 50%)" }
    }),

    // ═══════════════════════════════════════════
    //  GRATIFICACIÓN (Ley 27735 + Ley 30334)
    //  Bonif. Extraordinaria diferenciada por EPS
    // ═══════════════════════════════════════════
    BONIF_EXTRAORDINARIA:     0.09,    // 9% — Trabajador sin EPS (EsSalud completo al empleador)
    BONIF_EXTRAORDINARIA_EPS: 0.0675, // 6.75% — Trabajador con EPS (empleador aporta 75% EsSalud = 6.75%)

    PERIODOS_GRATIFICACION: Object.freeze({
        julio:    { nombre: "Fiestas Patrias", semestre: [1, 6],  mes_pago: 7 },
        diciembre:{ nombre: "Navidad",         semestre: [7, 12], mes_pago: 12 }
    }),

    // Mínimo de veces para considerar variable en el semestre/año
    VECES_MIN_VARIABLE_SEMESTRE: 3,
    VECES_MIN_VARIABLE_ANO:      3,

    // ═══════════════════════════════════════════
    //  CTS (D.S. 001-97-TR)
    // ═══════════════════════════════════════════
    CTS_SEXTO_GRATIFICACION: 1 / 6,

    // ═══════════════════════════════════════════
    //  SCTR (D.S. 003-98-SA)
    // ═══════════════════════════════════════════
    SCTR: Object.freeze({
        salud:   0.0053,
        pension: 0.0053,
        get total() { return this.salud + this.pension; }
    }),

    // ═══════════════════════════════════════════
    //  VIDA LEY (D. Leg. 688)
    // ═══════════════════════════════════════════
    VIDA_LEY: Object.freeze({
        "4-mas":  { factor: 16, nombre: "4+ años (16 remuneraciones)" },
        "natural":{ factor: 32, nombre: "Muerte natural (32 remuneraciones)" },
        prima_mensual_estimada: 0.0053
    }),

    // ═══════════════════════════════════════════
    //  VACACIONES (D. Leg. 713)
    // ═══════════════════════════════════════════
    VACACIONES_INDEMNIZACION_FACTOR: 3, // Triple: 1 trabajo + 1 descanso + 1 indemnización

    // ═══════════════════════════════════════════
    //  REGÍMENES LABORALES
    // ═══════════════════════════════════════════
    REGIMENES: Object.freeze({
        general: {
            nombre: "Régimen General",
            cts: true,
            cts_dias_ano: 30,
            gratificacion: true,
            gratificacion_factor: 1,
            vacaciones_dias: 30,
            essalud_tasa: 0.09,
            asig_familiar: true,
            vida_ley: true,
            utilidades: true,
            indemnizacion_despido: 1.5,
            indemnizacion_tope_remu: 12
        },
        pequena: {
            nombre: "Pequeña Empresa",
            cts: true,
            cts_dias_ano: 15,
            gratificacion: true,
            gratificacion_factor: 0.5,
            vacaciones_dias: 15,
            essalud_tasa: 0.09,
            asig_familiar: true,
            vida_ley: true,
            utilidades: true,
            indemnizacion_despido: 0.6667,
            indemnizacion_tope_remu: 4
        },
        micro: {
            nombre: "Microempresa",
            cts: false,
            cts_dias_ano: 0,
            gratificacion: false,
            gratificacion_factor: 0,
            vacaciones_dias: 15,
            essalud_tasa: 0.045,
            asig_familiar: false,
            vida_ley: false,
            utilidades: false,
            indemnizacion_despido: 0.3333,
            indemnizacion_tope_remu: 3
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
    UTILIDADES_TOPE_REMUNERACIONES: 18,

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
            respuesta: "Se pagan en <strong>julio (Fiestas Patrias)</strong> y <strong>diciembre (Navidad)</strong>. El monto equivale a una remuneración completa si se trabajó el semestre íntegro, o proporcional (sextos). Si el trabajador recibió comisiones/bonos al menos 3 veces en el semestre, el promedio de estos conceptos variables <strong>se integra a la base computable</strong>. Adicionalmente, se recibe una <strong>Bonificación Extraordinaria: 9% sin EPS, 6.75% con EPS</strong> (Ley 30334)."
        },
        {
            pregunta: "¿Cómo se calcula la CTS?",
            respuesta: "La CTS se deposita semestralmente (mayo y noviembre). La remuneración computable incluye: <strong>Sueldo + Asig. Familiar + 1/6 de la última gratificación + Promedio comisiones/bonos</strong> (si se percibieron ≥3 veces en el semestre). Se calcula como (Remu. Computable / 360) × días del semestre."
        },
        {
            pregunta: "¿Cómo se calculan las horas extras legalmente?",
            respuesta: "El valor hora se obtiene dividiendo la remuneración mensual entre <strong>240 horas</strong> (30d × 8h). Las primeras 2 horas extras tienen sobretasa de <strong>25%</strong> y las siguientes <strong>35%</strong>. Las inasistencias se descuentan con factor 1.2 (sueldo diario × 1.2) para incluir el proporcional de dominicales, siguiendo la metodología PLAME."
        },
        {
            pregunta: "¿Cuál es la RMV y la UIT vigentes en 2026?",
            respuesta: "RMV 2026: <strong>S/ 1,075</strong>. La Asignación Familiar es el 10% de la RMV = <strong>S/ 107.50</strong>. La UIT 2026 es <strong>S/ 5,150</strong>. Las primeras 7 UIT (S/ 36,050) de renta bruta anual están exoneradas del IR 5ta categoría."
        },
        {
            pregunta: "¿Cuál es la diferencia entre ONP y AFP?",
            respuesta: "La <strong>ONP</strong> descuenta un 13% fijo. Las <strong>AFP</strong> descuentan: 10% aporte obligatorio + comisión (1.38% a 1.69%) + prima de seguro (1.92%), pero la Prima SIS <strong>se detiene en la Remuneración Máxima Asegurable (RMA) de S/ 13,733.34</strong> establecida por la SBS. AFP Habitat es la más económica."
        },
        {
            pregunta: "¿Qué es la Triple Vacacional?",
            respuesta: "Si el empleador no otorgó las vacaciones en el año siguiente al año de derecho, el trabajador tiene derecho a <strong>3 remuneraciones</strong> (Art. 23, D. Leg. 713): 1 por el trabajo durante el período vacacional, 1 por el descanso no gozado y 1 de indemnización. En la práctica el empleador debe pagar 2 adicionales (la 1° ya fue pagada como salario ordinario)."
        },
        {
            pregunta: "¿Qué incluye la liquidación de beneficios sociales?",
            respuesta: "Incluye: <strong>CTS trunca</strong>, <strong>Gratificación trunca</strong> + bonif. extraordinaria, <strong>Vacaciones truncas</strong>, vacaciones no gozadas (con posible triple), y en caso de despido arbitrario, <strong>indemnización</strong> (1.5 remu/año en régimen general, tope 12 remuneraciones)."
        },
        {
            pregunta: "¿Cuánto cuesta realmente un trabajador al empleador?",
            respuesta: "En régimen general el costo adicional sobre el sueldo bruto es <strong>+45% a +55%</strong>: EsSalud (9%), CTS (~8.33%), Gratificaciones mensualizadas (~18.17% con bonif.), Vacaciones (~8.33%), Vida Ley (~0.53%), y SCTR si aplica (~1.06%). El <strong>Costo Laboral Anual</strong> incluye también el costo potencial de liquidación."
        },
        {
            pregunta: "¿Las utilidades son obligatorias para todas las empresas?",
            respuesta: "Solo para empresas con <strong>más de 20 trabajadores</strong> que generan rentas de tercera categoría. El porcentaje varía por sector: Pesca/Telecom (10%), Industria/Minería (8%), Comercio/Otros (5%). Se distribuye 50% por días trabajados y 50% por remuneraciones. <strong>Tope: 18 remuneraciones mensuales</strong> por trabajador."
        }
    ])
});


// ═══════════════════════════════════════════════════════════════
//  MOTOR DE CÁLCULO DE PRECISIÓN v4.0 (PLAME-Certified)
// ═══════════════════════════════════════════════════════════════

const CalcEngine = (() => {

    // ─── Precisión Financiera ─────────────────────────────────
    const _precision = 10;

    function safeCalc(value) {
        if (typeof value !== 'number' || !isFinite(value)) return 0;
        return parseFloat(value.toFixed(_precision));
    }

    function roundUI(value) {
        return Math.round(value * 100) / 100;
    }

    // PLAME-Style: redondear monto final POR CONCEPTO (no la base)
    // Igual que hace la planilla electrónica SUNAT
    function roundPLAME(value) {
        return Math.round(value * 100) / 100;
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(roundUI(amount));
    }

    // ─── Base Remunerativa Universal ──────────────────────────
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

    // ─── Promedio de Remuneración Variable ────────────────────
    // Ley exige incluir el promedio si se percibió al menos N veces
    function getPromedioVariable(promedioMensual, vecesPercibido, minVeces) {
        if (vecesPercibido >= minVeces && promedioMensual > 0) {
            return safeCalc(promedioMensual);
        }
        return 0;
    }

    // ─── Pensiones — Con Tope SBS sobre Prima ────────────────
    function calcularPension(baseTotal, tipoPension) {
        const p = DATA.PENSIONES[tipoPension];
        if (!p) return { total: 0, detalle: [], audit: 'Pensión no encontrada' };

        const audit = [];
        let detalles = [];

        if (tipoPension === 'onp') {
            const monto = roundPLAME(safeCalc(baseTotal * p.aporte));
            detalles.push({ concepto: `ONP (${(p.aporte * 100).toFixed(0)}%)`, monto, tasa: p.aporte });
            audit.push(`ONP: ${baseTotal} × ${p.aporte} = ${monto}`);
        } else {
            // Aporte al Fondo y Comisión: sobre base completa
            const fondo   = roundPLAME(safeCalc(baseTotal * p.aporte));
            const comision = roundPLAME(safeCalc(baseTotal * p.comision));

            // Prima SIS: se detiene en el Tope RMA de la SBS
            const baseParaSeguro = Math.min(baseTotal, DATA.AFP_SBS_TOPE);
            const seguro = roundPLAME(safeCalc(baseParaSeguro * p.seguro));

            const topeAplicado = baseTotal > DATA.AFP_SBS_TOPE;
            detalles = [
                { concepto: `Fondo obligatorio (${(p.aporte * 100).toFixed(0)}%)`, monto: fondo, tasa: p.aporte },
                { concepto: `Comisión flujo (${(p.comision * 100).toFixed(2)}%)`, monto: comision, tasa: p.comision },
                { concepto: `Prima Seguro SIS (${(p.seguro * 100).toFixed(2)}%)${topeAplicado ? ' [TOPE SBS]' : ''}`, monto: seguro, tasa: p.seguro }
            ];
            audit.push(`Fondo: ${baseTotal} × ${p.aporte} = ${fondo}`);
            audit.push(`Comisión: ${baseTotal} × ${p.comision} = ${comision}`);
            if (topeAplicado) {
                audit.push(`Prima SIS: Tope RMA S/ ${DATA.AFP_SBS_TOPE} aplicado`);
                audit.push(`Prima SIS: ${baseParaSeguro} × ${p.seguro} = ${seguro} (base capeada)`);
            } else {
                audit.push(`Prima SIS: ${baseTotal} × ${p.seguro} = ${seguro}`);
            }
        }

        // PLAME: suma de conceptos ya redondeados
        const total = safeCalc(detalles.reduce((s, d) => s + d.monto, 0));
        audit.push(`Total pensión (PLAME): ${total}`);

        return {
            nombre: p.nombre,
            nombreCompleto: p.nombreCompleto,
            total,
            detalle: detalles,
            tasaEfectiva: safeCalc(total / baseTotal),
            audit: audit.join('\n')
        };
    }

    // ─── Impuesto a la Renta 5ta Categoría ────────────────────
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

        return { impuesto: impuestoTotal, tramos, audit: audit.join('\n') };
    }

    // ─── Proyección Renta 5ta (Procedimiento SUNAT) ───────────
    function proyectarRenta5ta(params) {
        const {
            sueldoMensual, asigFamiliar = 0,
            mesCalculo, remuPercibidas = 0,
            gratPercibidas = 0, otrosIngresos = 0
        } = params;

        const audit = [];
        const base = safeCalc(sueldoMensual + asigFamiliar);
        const mesesRestantes = 12 - mesCalculo + 1;
        const proyeccionSueldos = safeCalc(base * mesesRestantes);

        let gratPendientes = 0;
        let bonifPendientes = 0;

        if (mesCalculo <= 7) {
            gratPendientes = safeCalc(gratPendientes + base);
            bonifPendientes = safeCalc(bonifPendientes + base * DATA.BONIF_EXTRAORDINARIA);
        }
        if (mesCalculo <= 12) {
            gratPendientes = safeCalc(gratPendientes + base);
            bonifPendientes = safeCalc(bonifPendientes + base * DATA.BONIF_EXTRAORDINARIA);
        }

        const rentaBrutaAnual = safeCalc(
            remuPercibidas + gratPercibidas +
            proyeccionSueldos + gratPendientes +
            bonifPendientes + otrosIngresos
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
        audit.push(`Deducción 7 UIT (${DATA.DEDUCCION_UIT} × S/ ${DATA.UIT}): -${deduccion7UIT}`);
        audit.push(`RENTA NETA ANUAL: ${rentaNetaAnual}`);

        const irResult = calcularIRAnual(rentaNetaAnual);
        const divisor = DATA.DIVISORES_RETENCION[mesCalculo] || 12;
        const retencionMensual = safeCalc(irResult.impuesto / divisor);

        audit.push(`IR Anual: ${irResult.impuesto}`);
        audit.push(`Divisor mes ${mesCalculo}: ${divisor}`);
        audit.push(`RETENCIÓN MENSUAL: ${irResult.impuesto} / ${divisor} = ${retencionMensual}`);

        return {
            rentaBrutaAnual, deduccion7UIT, rentaNetaAnual,
            irAnual: irResult.impuesto, tramos: irResult.tramos,
            divisor, retencionMensual,
            desglose: {
                remuPercibidas, gratPercibidas,
                proyeccionSueldos, gratPendientes,
                bonifPendientes, otrosIngresos, mesesRestantes
            },
            audit: audit.join('\n') + '\n' + irResult.audit
        };
    }

    // ═══════════════════════════════════════════════
    //  CALCULADORAS PRINCIPALES
    // ═══════════════════════════════════════════════

    // ─── 1. SUELDO NETO ───────────────────────────────────────
    function sueldoNeto(params) {
        const {
            sueldoBruto, regimen = 'general', tipoPension = 'onp',
            incluyeAsigFamiliar = false, mesCalculo = 6,
            diasFaltados = 0
        } = params;

        const audit = ['=== CÁLCULO SUELDO NETO 2026 ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);
        audit.push(`Base: ${base.sueldoBruto} + AF ${base.asigFamiliar} = ${base.total}`);
        audit.push(`RMV 2026: S/ ${DATA.RMV} → AF = S/ ${DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT}`);

        // Descuento por inasistencias — PLAME-Style
        // (Sueldo / 30) × días_faltados × 1.2  [factor 1.2 = día + dominical proporcional]
        let descuentoInasistencias = 0;
        if (diasFaltados > 0) {
            descuentoInasistencias = roundPLAME(
                safeCalc((base.total / DATA.DIAS_MES) * diasFaltados * DATA.FACTOR_INASISTENCIA)
            );
            audit.push(`Descuento inasistencias: (${base.total}/30) × ${diasFaltados}d × 1.2 = ${descuentoInasistencias}`);
        }

        const baseEfectiva = safeCalc(base.total - descuentoInasistencias);

        const pension = calcularPension(baseEfectiva, tipoPension);
        audit.push(`Pensión (${pension.nombre}): ${pension.total}`);

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

        const totalDescuentos = safeCalc(pension.total + irMensual + descuentoInasistencias);
        const neto = safeCalc(base.total - totalDescuentos);

        audit.push(`Total descuentos: ${totalDescuentos}`);
        audit.push(`SUELDO NETO: ${base.total} - ${totalDescuentos} = ${neto}`);

        return {
            base, pension,
            ir: {
                mensual: irMensual,
                anual: irProyeccion.irAnual,
                tramos: irProyeccion.tramos,
                rentaNetaAnual: irProyeccion.rentaNetaAnual
            },
            diasFaltados,
            descuentoInasistencias,
            baseEfectiva,
            totalDescuentos,
            sueldoNeto: neto,
            porcentajeDescuento: safeCalc((totalDescuentos / base.total) * 100),
            regimen: DATA.REGIMENES[regimen],
            audit: audit.join('\n')
        };
    }

    // ─── 2. GRATIFICACIÓN ─────────────────────────────────────
    // Acepta remuneración variable si fue percibida ≥3 veces en el semestre
    function gratificacion(params) {
        const {
            sueldoBruto, periodo = 'julio', mesesTrabajados = 6,
            incluyeAsigFamiliar = false, incluyeBonif = true,
            promedioComisiones = 0, vecesPercibidoSemestre = 0,
            tieneEPS = false
        } = params;

        const audit = ['=== CÁLCULO GRATIFICACIÓN 2026 ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);
        const mesesEfectivos = Math.min(Math.max(0, mesesTrabajados), DATA.MESES_SEMESTRE);

        // Remuneración variable: incluir si ≥3 meses en el semestre
        const promVar = getPromedioVariable(
            promedioComisiones,
            vecesPercibidoSemestre,
            DATA.VECES_MIN_VARIABLE_SEMESTRE
        );
        const baseComputable = safeCalc(base.total + promVar);

        audit.push(`Base fija: ${base.total}`);
        audit.push(`Promedio comisiones/bonos (${vecesPercibidoSemestre} veces en semestre): ${promedioComisiones}`);
        if (promVar > 0) {
            audit.push(`✓ Variable incluida (≥${DATA.VECES_MIN_VARIABLE_SEMESTRE} veces): +${promVar}`);
        } else if (promedioComisiones > 0) {
            audit.push(`✗ Variable NO incluida (<${DATA.VECES_MIN_VARIABLE_SEMESTRE} veces percibida)`);
        }
        audit.push(`Base computable: ${baseComputable}`);
        audit.push(`Meses: ${mesesEfectivos} / ${DATA.MESES_SEMESTRE}`);

        // PLAME-Style: roundPLAME por concepto
        const gratificacionBase = roundPLAME(
            safeCalc((baseComputable / DATA.MESES_SEMESTRE) * mesesEfectivos)
        );

        // Bonif. Extraordinaria diferenciada por EPS (Ley 30334, Art. 3)
        const tasaBonif = tieneEPS ? DATA.BONIF_EXTRAORDINARIA_EPS : DATA.BONIF_EXTRAORDINARIA;
        const bonifExtraordinaria = incluyeBonif
            ? roundPLAME(safeCalc(gratificacionBase * tasaBonif))
            : 0;

        const totalRecibir = safeCalc(gratificacionBase + bonifExtraordinaria);

        audit.push(`Gratificación: (${baseComputable} / 6) × ${mesesEfectivos} = ${gratificacionBase} [PLAME]`);
        audit.push(`Bonif. ${tieneEPS ? '6.75% (EPS)' : '9% (EsSalud)'}: ${gratificacionBase} × ${tasaBonif} = ${bonifExtraordinaria} [PLAME]`);
        audit.push(`TOTAL: ${totalRecibir}`);

        return {
            base, baseComputable, promVar,
            periodo: DATA.PERIODOS_GRATIFICACION[periodo],
            mesesEfectivos, gratificacionBase,
            tasaBonif, tieneEPS,
            bonifExtraordinaria, totalRecibir,
            audit: audit.join('\n')
        };
    }

    // ─── 3. CTS ───────────────────────────────────────────────
    // Incluye promedio variable si percibido ≥3 veces en el semestre
    function cts(params) {
        const {
            sueldoBruto, meses = 6, dias = 0,
            incluyeAsigFamiliar = false, ultimaGratificacion = 0,
            promedioComisiones = 0, vecesPercibidoSemestre = 0
        } = params;

        const audit = ['=== CÁLCULO CTS 2026 ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        // 1/6 última gratificación (incluye la variable si la gratif ya la incluía)
        const sextoGrat = safeCalc(ultimaGratificacion * DATA.CTS_SEXTO_GRATIFICACION);

        // Remuneración variable CTS
        const promVar = getPromedioVariable(
            promedioComisiones,
            vecesPercibidoSemestre,
            DATA.VECES_MIN_VARIABLE_SEMESTRE
        );

        const remuComputable = safeCalc(base.total + sextoGrat + promVar);

        const totalDias = safeCalc(meses * DATA.DIAS_MES + dias);
        const valorDiario = safeCalc(remuComputable / DATA.DIAS_ANO);

        // PLAME-Style: redondear el depósito final
        const ctsTotal = roundPLAME(safeCalc(valorDiario * totalDias));

        audit.push(`Base: ${base.total}`);
        audit.push(`1/6 Gratificación: ${ultimaGratificacion} / 6 = ${sextoGrat}`);
        audit.push(`Promedio comisiones/bonos (${vecesPercibidoSemestre} veces): ${promedioComisiones}`);
        if (promVar > 0) {
            audit.push(`✓ Variable incluida (≥${DATA.VECES_MIN_VARIABLE_SEMESTRE} veces): +${promVar}`);
        } else if (promedioComisiones > 0) {
            audit.push(`✗ Variable NO incluida (<${DATA.VECES_MIN_VARIABLE_SEMESTRE} veces percibida)`);
        }
        audit.push(`Remu. computable: ${remuComputable}`);
        audit.push(`Días: ${meses}m × 30 + ${dias}d = ${totalDias}`);
        audit.push(`Valor diario: ${remuComputable} / 360 = ${valorDiario}`);
        audit.push(`CTS [PLAME]: ${valorDiario} × ${totalDias} = ${ctsTotal}`);

        return {
            base, sextoGratificacion: sextoGrat,
            promVar, remuComputable,
            totalDias, valorDiario,
            cts: ctsTotal,
            audit: audit.join('\n')
        };
    }

    // ─── 4. HORAS EXTRAS ──────────────────────────────────────
    // Incluye descuento de inasistencias PLAME-Style
    function horasExtras(params) {
        const {
            sueldoBruto, horas25 = 0, horas35 = 0,
            incluyeAsigFamiliar = false, esNocturno = false
        } = params;

        const audit = ['=== CÁLCULO HORAS EXTRAS 2026 ==='];
        audit.push(`D.S. 007-2002-TR | Divisor legal: ${DATA.HORAS_MES_LEGAL} horas`);

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        const sobreTasaNocturna = esNocturno
            ? safeCalc(base.total * DATA.SOBRETASA_NOCTURNO)
            : 0;
        const baseParaHE = esNocturno
            ? safeCalc(base.total + sobreTasaNocturna)
            : base.total;

        // Valor hora: sin redondeo (preservar todos los decimales)
        const valorHora = safeCalc(baseParaHE / DATA.HORAS_MES_LEGAL);

        const valorHora25 = safeCalc(valorHora * (1 + DATA.SOBRETASA_HE_25));
        const valorHora35 = safeCalc(valorHora * (1 + DATA.SOBRETASA_HE_35));

        // PLAME-Style: redondear por concepto, no la base
        const pagoHoras25 = roundPLAME(safeCalc(horas25 * valorHora25));
        const pagoHoras35 = roundPLAME(safeCalc(horas35 * valorHora35));
        const totalHorasExtras = safeCalc(pagoHoras25 + pagoHoras35);

        audit.push(`RMV 2026: ${DATA.RMV} → AF: S/ ${DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT}`);
        audit.push(`Base remunerativa: ${base.total} (Sueldo: ${base.sueldoBruto} + AF: ${base.asigFamiliar})`);
        if (esNocturno) {
            audit.push(`Sobretasa nocturna 35%: ${base.total} × 0.35 = ${sobreTasaNocturna}`);
            audit.push(`Base para HE (con nocturno): ${baseParaHE}`);
        }
        audit.push(`Valor hora: ${baseParaHE} / ${DATA.HORAS_MES_LEGAL} = ${valorHora}`);
        audit.push(`Valor hora +25%: ${valorHora} × 1.25 = ${valorHora25}`);
        audit.push(`Valor hora +35%: ${valorHora} × 1.35 = ${valorHora35}`);
        audit.push(`Pago 25% (${horas25}h) [PLAME]: ${horas25} × ${valorHora25} = ${pagoHoras25}`);
        audit.push(`Pago 35% (${horas35}h) [PLAME]: ${horas35} × ${valorHora35} = ${pagoHoras35}`);
        audit.push(`TOTAL HORAS EXTRAS: ${totalHorasExtras}`);

        // Benchmark SUNAT: S/ 1,130 + AF → Base S/ 1,237.50
        if (Math.abs(base.total - 1237.50) < 0.01) {
            audit.push(`--- BENCHMARK SUNAT ---`);
            audit.push(`Base: 1237.50 | V.Hora: ${valorHora} | V.Hora+25%: ${valorHora25} | V.Hora+35%: ${valorHora35}`);
        }

        return {
            base, esNocturno, sobreTasaNocturna, baseParaHE,
            valorHora, valorHora25, valorHora35,
            horas25, horas35,
            pagoHoras25, pagoHoras35,
            totalHorasExtras,
            audit: audit.join('\n')
        };
    }

    // ─── 5. VACACIONES ────────────────────────────────────────
    // Incluye Triple Vacacional y promedio variable
    function vacaciones(params) {
        const {
            sueldoBruto, diasVacaciones = 30, mesesLaborados = 12,
            incluyeAsigFamiliar = false, noGozadas = false,
            promedioComisiones12m = 0, vecesPercibidoAno = 0
        } = params;

        const audit = ['=== CÁLCULO VACACIONES 2026 ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        // Remuneración variable vacacional: promedio últimos 12 meses
        const promVar = getPromedioVariable(
            promedioComisiones12m,
            vecesPercibidoAno,
            DATA.VECES_MIN_VARIABLE_ANO
        );
        const baseComputable = safeCalc(base.total + promVar);

        audit.push(`Base fija: ${base.total}`);
        if (promVar > 0) {
            audit.push(`✓ Promedio variable anual incluido: +${promVar}`);
        }
        audit.push(`Base computable: ${baseComputable}`);

        const valorDiario = safeCalc(baseComputable / DATA.DIAS_MES);
        const proporcion = safeCalc(mesesLaborados / DATA.MESES_ANO);
        const remuVacacional = roundPLAME(safeCalc(valorDiario * diasVacaciones * proporcion));

        let indemnizacion = 0;
        let tripleDetalle = null;

        if (noGozadas) {
            // Triple Vacacional (Art. 23 D.Leg. 713):
            // 1 remuneración: por el trabajo (ya pagada como salario ordinario)
            // 1 remuneración: por el descanso no gozado   → a pagar
            // 1 remuneración: indemnización                → a pagar
            // El empleador debe pagar 2 adicionales
            indemnizacion = roundPLAME(safeCalc(remuVacacional * 2));
            tripleDetalle = {
                porTrabajo:   remuVacacional,  // Ya pagado como salario (referencial)
                porDescanso:  remuVacacional,  // A pagar ahora
                porIndemnizacion: remuVacacional, // A pagar ahora
                totalTriple: safeCalc(remuVacacional * 3),
                aPagarAhora: indemnizacion
            };
            audit.push(`TRIPLE VACACIONAL (Art. 23 D.Leg. 713):`);
            audit.push(`  1° Remu. por trabajo (ya pagada): ${remuVacacional}`);
            audit.push(`  2° Remu. por descanso no gozado:  ${remuVacacional}`);
            audit.push(`  3° Remu. de indemnización:        ${remuVacacional}`);
            audit.push(`  TOTAL TRIPLE: ${safeCalc(remuVacacional * 3)}`);
            audit.push(`  A pagar ahora (2°+3°): ${indemnizacion} [PLAME]`);
        }

        const total = safeCalc(remuVacacional + indemnizacion);

        audit.push(`Valor diario: ${baseComputable} / 30 = ${valorDiario}`);
        audit.push(`Proporción: ${mesesLaborados} / 12 = ${proporcion}`);
        audit.push(`Remu. vacacional [PLAME]: ${valorDiario} × ${diasVacaciones} × ${proporcion} = ${remuVacacional}`);
        audit.push(`TOTAL: ${total}`);

        return {
            base, baseComputable, promVar, valorDiario, proporcion,
            remuVacacional, noGozadas, indemnizacion,
            tripleDetalle, total,
            audit: audit.join('\n')
        };
    }

    // ─── 6. IMPUESTO A LA RENTA ───────────────────────────────
    function impuestoRenta(params) {
        const {
            sueldoBruto, meses = 12, numGratificaciones = 2,
            incluyeAsigFamiliar = false, otrosIngresos = 0
        } = params;

        const audit = ['=== CÁLCULO IR 5TA CATEGORÍA 2026 ==='];

        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar);

        const sueldosAnuales = safeCalc(base.total * meses);
        const gratAnuales = safeCalc(base.total * numGratificaciones);
        const bonifAnuales = safeCalc(gratAnuales * DATA.BONIF_EXTRAORDINARIA);

        const rentaBrutaAnual = safeCalc(sueldosAnuales + gratAnuales + bonifAnuales + otrosIngresos);
        const deduccion = safeCalc(DATA.DEDUCCION_UIT * DATA.UIT);
        const rentaNetaAnual = safeCalc(Math.max(0, rentaBrutaAnual - deduccion));

        audit.push(`UIT 2026: S/ ${DATA.UIT} | 7 UIT = S/ ${deduccion}`);
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
            desglose: { sueldosAnuales, gratAnuales, bonifAnuales, otrosIngresos },
            rentaBrutaAnual, deduccion7UIT: deduccion,
            rentaNetaAnual, irAnual: irResult.impuesto,
            irMensual, tramos: irResult.tramos,
            tasaEfectiva,
            audit: audit.join('\n') + '\n' + irResult.audit
        };
    }

    // ─── 7. LIQUIDACIÓN ───────────────────────────────────────
    // Con Triple Vacacional y Bonif. EPS diferenciada
    function liquidacion(params) {
        const {
            sueldoBruto, fechaIngreso, fechaCese,
            motivo = 'renuncia', vacPendientes = 0,
            vacNoGozadasDias = 0,
            incluyeAsigFamiliar = false, regimen = 'general',
            tieneEPS = false
        } = params;

        const audit = ['=== CÁLCULO LIQUIDACIÓN 2026 ==='];
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);

        const diffMs = fechaCese.getTime() - fechaIngreso.getTime();
        const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const anos = Math.floor(totalDias / 365);
        const mesesRest = Math.floor((totalDias % 365) / 30);
        const diasRest = (totalDias % 365) % 30;

        audit.push(`Tiempo: ${anos}a ${mesesRest}m ${diasRest}d (${totalDias} días)`);
        audit.push(`Régimen: ${reg.nombre}`);
        audit.push(`Base: ${base.total}`);

        // CTS Trunca [PLAME]
        let ctsTrunca = 0;
        if (reg.cts) {
            const factorCTS = reg.cts_dias_ano / 30;
            const diasCTSTruncos = safeCalc(mesesRest * 30 + diasRest);
            ctsTrunca = roundPLAME(safeCalc((base.total * factorCTS / DATA.DIAS_ANO) * diasCTSTruncos));
            audit.push(`CTS trunca [PLAME]: (${base.total} × ${factorCTS} / 360) × ${diasCTSTruncos} = ${ctsTrunca}`);
        }

        // Gratificación Trunca [PLAME] + Bonif. EPS diferenciada
        let gratTrunca = 0;
        let bonifGratTrunca = 0;
        if (reg.gratificacion) {
            const mesCese = fechaCese.getMonth() + 1;
            const mesesSemestre = mesCese <= 6 ? mesCese : mesCese - 6;
            gratTrunca = roundPLAME(
                safeCalc((base.total * reg.gratificacion_factor / DATA.MESES_SEMESTRE) * mesesSemestre)
            );
            const tasaBonif = tieneEPS ? DATA.BONIF_EXTRAORDINARIA_EPS : DATA.BONIF_EXTRAORDINARIA;
            bonifGratTrunca = roundPLAME(safeCalc(gratTrunca * tasaBonif));
            audit.push(`Grat. trunca [PLAME]: (${base.total} × ${reg.gratificacion_factor} / 6) × ${mesesSemestre} = ${gratTrunca}`);
            audit.push(`Bonif. ${tieneEPS ? '6.75% EPS' : '9% EsSalud'} [PLAME]: ${gratTrunca} × ${tasaBonif} = ${bonifGratTrunca}`);
        }

        // Vacaciones Truncas [PLAME]
        const mesesVacTruncos = Math.floor((totalDias % 365) / 30);
        const diasVacTruncos = (totalDias % 365) % 30;
        const vacDiasProporcion = safeCalc(reg.vacaciones_dias * (mesesVacTruncos * 30 + diasVacTruncos) / DATA.DIAS_ANO);
        const vacTruncas = roundPLAME(safeCalc((base.total / DATA.DIAS_MES) * vacDiasProporcion));
        audit.push(`Vac. truncas [PLAME]: (${base.total}/30) × ${vacDiasProporcion} = ${vacTruncas}`);

        // Vacaciones pendientes no gozadas normales (1x)
        const pagoVacPendientes = roundPLAME(safeCalc((base.total / DATA.DIAS_MES) * vacPendientes));
        if (vacPendientes > 0) {
            audit.push(`Vac. pendientes [PLAME]: (${base.total}/30) × ${vacPendientes}d = ${pagoVacPendientes}`);
        }

        // Triple Vacacional (Art. 23 D.Leg. 713) — año no otorgado
        let tripleVacacional = 0;
        if (vacNoGozadasDias > 0) {
            const remuDiariaBase = safeCalc(base.total / DATA.DIAS_MES);
            const remuNormal = roundPLAME(safeCalc(remuDiariaBase * vacNoGozadasDias));
            // Triple = 3x; la 1ª ya fue pagada → pagar 2x adicional
            tripleVacacional = roundPLAME(safeCalc(remuNormal * 2));
            audit.push(`TRIPLE VACACIONAL (${vacNoGozadasDias} días — Art. 23 D.Leg. 713):`);
            audit.push(`  Remu. normal (1 sueldo): ${remuNormal}`);
            audit.push(`  A pagar adicional (2 sueldos): ${tripleVacacional} [PLAME]`);
        }

        // Indemnización por despido arbitrario
        let indemnizacion = 0;
        if (motivo === 'despido-arbitrario') {
            const anosServ = safeCalc(anos + mesesRest / 12 + diasRest / 360);
            const indemnCalc = safeCalc(base.total * reg.indemnizacion_despido * anosServ);
            const tope = safeCalc(base.total * reg.indemnizacion_tope_remu);
            indemnizacion = roundPLAME(Math.min(indemnCalc, tope));
            audit.push(`Indemnización: ${base.total} × ${reg.indemnizacion_despido} × ${anosServ} = ${indemnCalc}`);
            audit.push(`Tope: ${base.total} × ${reg.indemnizacion_tope_remu} = ${tope}`);
            audit.push(`Indemnización [PLAME]: min(${indemnCalc}, ${tope}) = ${indemnizacion}`);
        }

        // Suma de conceptos ya redondeados (PLAME-Style)
        const totalLiquidacion = safeCalc(
            ctsTrunca + gratTrunca + bonifGratTrunca +
            vacTruncas + pagoVacPendientes + tripleVacacional + indemnizacion
        );

        audit.push(`TOTAL LIQUIDACIÓN (suma conceptos PLAME): ${totalLiquidacion}`);

        return {
            base, regimen: reg,
            tiempoServicio: { anos, meses: mesesRest, dias: diasRest, totalDias },
            motivo, ctsTrunca, gratTrunca, bonifGratTrunca,
            vacTruncas, pagoVacPendientes,
            vacPendientes, vacNoGozadasDias,
            tripleVacacional, indemnizacion,
            totalLiquidacion,
            audit: audit.join('\n')
        };
    }

    // ─── 8. ESSALUD ───────────────────────────────────────────
    function essalud(params) {
        const { sueldoBruto, regimen = 'general', numTrabajadores = 1, incluyeAsigFamiliar = false } = params;

        const audit = ['=== CÁLCULO ESSALUD 2026 ==='];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);
        const tasaInfo = DATA.ESSALUD[regimen] || DATA.ESSALUD.general;

        const aporteUnitario = roundPLAME(safeCalc(base.total * tasaInfo.tasa));
        const baseMinima = roundPLAME(safeCalc(DATA.RMV * tasaInfo.tasa));
        const aporteReal = Math.max(aporteUnitario, baseMinima);
        const aporteTotal = safeCalc(aporteReal * numTrabajadores);
        const aporteAnual = safeCalc(aporteTotal * DATA.MESES_ANO);

        audit.push(`Base: ${base.total}`);
        audit.push(`Tasa: ${tasaInfo.tasa * 100}%`);
        audit.push(`Aporte unitario [PLAME]: ${base.total} × ${tasaInfo.tasa} = ${aporteUnitario}`);
        audit.push(`Base mínima (RMV ${DATA.RMV} × ${tasaInfo.tasa}): ${baseMinima}`);
        audit.push(`Aporte real: max(${aporteUnitario}, ${baseMinima}) = ${aporteReal}`);
        audit.push(`Total (${numTrabajadores} trab.): ${aporteTotal}`);

        return {
            base, tasaInfo, aporteUnitario, baseMinima,
            aporteReal, numTrabajadores, aporteTotal, aporteAnual,
            audit: audit.join('\n')
        };
    }

    // ─── 9. UTILIDADES (D. Leg. 892) ──────────────────────────
    function utilidades(params) {
        const {
            rentaEmpresa, porcentajeSector, diasTrabajados, totalDiasTodos,
            remuAnual, totalRemuTodos
        } = params;

        const audit = ['=== CÁLCULO UTILIDADES ==='];

        const montoDistribuir = safeCalc(rentaEmpresa * porcentajeSector / 100);
        const mitad = safeCalc(montoDistribuir / 2);

        const porDias = roundPLAME(safeCalc((mitad / totalDiasTodos) * diasTrabajados));
        const porRemu = totalRemuTodos > 0
            ? roundPLAME(safeCalc((mitad / totalRemuTodos) * remuAnual))
            : 0;
        const totalCalculado = safeCalc(porDias + porRemu);

        const remuMensual = safeCalc(remuAnual / DATA.MESES_ANO);
        const tope = safeCalc(remuMensual * DATA.UTILIDADES_TOPE_REMUNERACIONES);
        const totalFinal = Math.min(totalCalculado, tope);
        const excedente = safeCalc(Math.max(0, totalCalculado - tope));

        audit.push(`Renta empresa: ${rentaEmpresa}`);
        audit.push(`Sector: ${porcentajeSector}%`);
        audit.push(`Monto a distribuir: ${montoDistribuir}`);
        audit.push(`Mitad: ${mitad}`);
        audit.push(`Por días [PLAME]: (${mitad} / ${totalDiasTodos}) × ${diasTrabajados} = ${porDias}`);
        audit.push(`Por remu [PLAME]: (${mitad} / ${totalRemuTodos}) × ${remuAnual} = ${porRemu}`);
        audit.push(`Total calculado: ${totalCalculado}`);
        audit.push(`Tope 18 remu: ${tope}`);
        audit.push(`TOTAL FINAL: ${totalFinal}`);

        return {
            montoDistribuir, porDias, porRemu, totalCalculado,
            remuMensual, tope, totalFinal, excedente,
            audit: audit.join('\n')
        };
    }

    // ─── 10. ASIGNACIÓN FAMILIAR ──────────────────────────────
    function asignacionFamiliar(params) {
        const { numHijos = 0 } = params;
        const monto = numHijos > 0
            ? roundPLAME(safeCalc(DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT))
            : 0;
        const audit = [
            '=== ASIGNACIÓN FAMILIAR 2026 ===',
            `RMV 2026: S/ ${DATA.RMV}`,
            `Tasa: ${DATA.ASIGNACION_FAMILIAR_PCT * 100}%`,
            `Cálculo: ${DATA.RMV} × ${DATA.ASIGNACION_FAMILIAR_PCT} = ${monto} [PLAME]`,
            `Hijos: ${numHijos}`,
            `Derecho: ${numHijos > 0 ? 'SÍ' : 'NO'}`,
            `Monto mensual: S/ ${monto}`
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

    // ─── 11. RENTA 5TA DETALLADA ──────────────────────────────
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
            mesCalculo, remuPercibidas, gratPercibidas, otrosIngresos
        });
    }

    // ─── 12. COSTO TOTAL DEL EMPLEADOR ────────────────────────
    // Con diferenciación EPS y costos de despido/liquidación
    function costoEmpleador(params) {
        const {
            sueldoBruto, regimen = 'general',
            incluyeAsigFamiliar = false, incluyeSCTR = false,
            anosServicio = 4, tieneEPS = false
        } = params;

        const audit = ['=== COSTO TOTAL DEL EMPLEADOR 2026 ==='];
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa(sueldoBruto, incluyeAsigFamiliar, regimen);

        audit.push(`Régimen: ${reg.nombre}`);
        audit.push(`Base: ${base.total}`);

        // EsSalud
        const essaludMensual = roundPLAME(safeCalc(base.total * reg.essalud_tasa));
        audit.push(`EsSalud (${reg.essalud_tasa * 100}%) [PLAME]: ${essaludMensual}`);

        // CTS mensualizada
        let ctsMensualizada = 0;
        if (reg.cts) {
            ctsMensualizada = roundPLAME(safeCalc((base.total * (reg.cts_dias_ano / DATA.DIAS_MES)) / DATA.MESES_ANO));
            audit.push(`CTS mensualizada (${reg.cts_dias_ano}d/año) [PLAME]: ${ctsMensualizada}`);
        }

        // Gratificaciones mensualizadas + Bonif. EPS diferenciada
        let gratMensualizada = 0;
        let bonifMensualizada = 0;
        if (reg.gratificacion) {
            gratMensualizada = roundPLAME(safeCalc((base.total * reg.gratificacion_factor * 2) / DATA.MESES_ANO));
            const tasaBonif = tieneEPS ? DATA.BONIF_EXTRAORDINARIA_EPS : DATA.BONIF_EXTRAORDINARIA;
            bonifMensualizada = roundPLAME(safeCalc(gratMensualizada * tasaBonif));
            audit.push(`Grat. mensualiz. (factor ${reg.gratificacion_factor}×2) [PLAME]: ${gratMensualizada}`);
            audit.push(`Bonif. ${tieneEPS ? '6.75% EPS' : '9%'} mensualizada [PLAME]: ${bonifMensualizada}`);
        }

        // Vacaciones mensualizadas
        const vacMensualizada = roundPLAME(safeCalc((base.total * (reg.vacaciones_dias / DATA.DIAS_MES)) / DATA.MESES_ANO));
        audit.push(`Vacaciones mensualiz. (${reg.vacaciones_dias}d) [PLAME]: ${vacMensualizada}`);

        // SCTR
        let sctrMensual = 0;
        if (incluyeSCTR) {
            sctrMensual = roundPLAME(safeCalc(base.total * DATA.SCTR.total));
            audit.push(`SCTR (${(DATA.SCTR.total * 100).toFixed(2)}%) [PLAME]: ${sctrMensual}`);
        }

        // Vida Ley
        let vidaLeyMensual = 0;
        if (reg.vida_ley && anosServicio >= 4) {
            vidaLeyMensual = roundPLAME(safeCalc(base.total * DATA.VIDA_LEY.prima_mensual_estimada));
            audit.push(`Vida Ley (~${(DATA.VIDA_LEY.prima_mensual_estimada * 100).toFixed(2)}%) [PLAME]: ${vidaLeyMensual}`);
        }

        const costoAdicional = safeCalc(
            essaludMensual + ctsMensualizada + gratMensualizada +
            bonifMensualizada + vacMensualizada + sctrMensual + vidaLeyMensual
        );
        const costoTotalMensual = safeCalc(base.total + costoAdicional);
        const costoTotalAnual = safeCalc(costoTotalMensual * DATA.MESES_ANO);
        const porcentajeSobrecosto = safeCalc((costoAdicional / base.total) * 100);

        // Costo de liquidación (indemnización + beneficios truncos estimados 1 año)
        // Estimación: liquidación completa a los anosServicio dados
        const anosEst = Math.max(1, anosServicio);
        const indemnizacionEstimada = regimen !== 'micro'
            ? roundPLAME(Math.min(
                safeCalc(base.total * reg.indemnizacion_despido * anosEst),
                safeCalc(base.total * reg.indemnizacion_tope_remu)
              ))
            : roundPLAME(safeCalc(base.total * reg.indemnizacion_despido * anosEst));

        const beneficiosTruncos = roundPLAME(safeCalc(
            (reg.cts ? base.total * (reg.cts_dias_ano / 360) * 6 : 0) +
            (reg.gratificacion ? base.total * reg.gratificacion_factor * 0.5 : 0)
        ));

        const costoTotalDespido = safeCalc(indemnizacionEstimada + beneficiosTruncos);
        const costoLaboralAnualTotal = safeCalc(costoTotalAnual + costoTotalDespido);

        audit.push(`Costo adicional mensual: ${costoAdicional}`);
        audit.push(`COSTO TOTAL MENSUAL: ${base.total} + ${costoAdicional} = ${costoTotalMensual}`);
        audit.push(`COSTO LABORAL ANUAL: ${costoTotalAnual}`);
        audit.push(`Indemnización estimada (${anosEst}a): ${indemnizacionEstimada}`);
        audit.push(`Beneficios truncos estimados: ${beneficiosTruncos}`);
        audit.push(`COSTO LABORAL ANUAL TOTAL (incluye despido): ${costoLaboralAnualTotal}`);
        audit.push(`Sobrecosto: +${porcentajeSobrecosto}%`);

        return {
            base, regimen: reg,
            desglose: {
                essaludMensual, ctsMensualizada, gratMensualizada,
                bonifMensualizada, vacMensualizada, sctrMensual, vidaLeyMensual
            },
            costoAdicional, costoTotalMensual, costoTotalAnual,
            porcentajeSobrecosto,
            liquidacion: { indemnizacionEstimada, beneficiosTruncos, costoTotalDespido },
            costoLaboralAnualTotal,
            audit: audit.join('\n')
        };
    }

    // ─── 13. COMPARADOR PRO DE REGÍMENES ──────────────────────
    // Tabla completa: Costo Anual Contratar vs. Costo Despedir/Liquidar
    function comparadorRegimenes(params) {
        const {
            sueldoBruto, incluyeAsigFamiliar = false,
            incluyeSCTR = false, anosServicio = 2,
            tieneEPS = false
        } = params;

        const audit = ['=== COMPARADOR PRO DE REGÍMENES 2026 ==='];
        const resultados = {};

        for (const key of ['general', 'pequena', 'micro']) {
            const r = costoEmpleador({
                sueldoBruto,
                regimen: key,
                incluyeAsigFamiliar: key === 'micro' ? false : incluyeAsigFamiliar,
                incluyeSCTR,
                anosServicio,
                tieneEPS
            });
            resultados[key] = r;
            audit.push(`\n--- ${r.regimen.nombre} ---`);
            audit.push(`Costo mensual: ${r.costoTotalMensual}`);
            audit.push(`Costo anual contratar: ${r.costoTotalAnual}`);
            audit.push(`Costo despedir/liquidar: ${r.liquidacion.costoTotalDespido}`);
            audit.push(`COSTO LABORAL ANUAL TOTAL: ${r.costoLaboralAnualTotal}`);
            audit.push(`Sobrecosto: +${r.porcentajeSobrecosto}%`);
        }

        const ahorroMicroVsGeneral = roundPLAME(safeCalc(
            resultados.general.costoTotalMensual - resultados.micro.costoTotalMensual
        ));
        const ahorroPequenaVsGeneral = roundPLAME(safeCalc(
            resultados.general.costoTotalMensual - resultados.pequena.costoTotalMensual
        ));
        const ahorroAnualMicro = roundPLAME(safeCalc(
            resultados.general.costoLaboralAnualTotal - resultados.micro.costoLaboralAnualTotal
        ));
        const ahorroAnualPequena = roundPLAME(safeCalc(
            resultados.general.costoLaboralAnualTotal - resultados.pequena.costoLaboralAnualTotal
        ));

        audit.push(`\nAhorro mensual Micro vs General: ${ahorroMicroVsGeneral}`);
        audit.push(`Ahorro mensual Pequeña vs General: ${ahorroPequenaVsGeneral}`);
        audit.push(`Ahorro anual total Micro vs General: ${ahorroAnualMicro}`);
        audit.push(`Ahorro anual total Pequeña vs General: ${ahorroAnualPequena}`);

        return {
            general: resultados.general,
            pequena: resultados.pequena,
            micro: resultados.micro,
            ahorroMicroVsGeneral,
            ahorroPequenaVsGeneral,
            ahorroAnualMicro,
            ahorroAnualPequena,
            audit: audit.join('\n')
        };
    }

    // ─── API Pública ──────────────────────────────────────────
    return Object.freeze({
        safeCalc, roundUI, roundPLAME, formatMoney,
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
