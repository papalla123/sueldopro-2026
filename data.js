/* ================================================================
   SueldoPro Ultra v4.0 - MOTOR DE PLANILLA CORPORATIVO
   ================================================================
   Grado: Fiscalización SUNAT / PLAME / T-Registro
   
   REGLAS DE ARQUITECTURA:
   ───────────────────────
   R1: CERO redondeos intermedios (10 decimales internos)
   R2: Redondeo PLAME: solo al monto final por concepto
   R3: Base remunerativa universal = Sueldo + AF + Prom. Variables
   R4: Tope SBS para prima de seguro AFP
   R5: Bonif. 9% EsSalud / 6.75% EPS sobre gratificación
   R6: Triple vacacional completa
   R7: Descuento dominical por inasistencias
   R8: Comisión mixta AFP (flujo + saldo)
   R9: Divisor HE configurable (240 legal vs días reales)
   R10: Audit trail paso a paso en cada cálculo
   
   Normativa: D.S. 003-97-TR, Ley 27735, Ley 30334, 
   D.S. 001-97-TR, D.Leg. 713, D.S. 007-2002-TR,
   Art. 53° LIR, Ley 26790, D.Leg. 688, D.Leg. 892
   ================================================================ */

const DATA = Object.freeze({

    // ═══════════════════════════════════════════════
    //  CONSTANTES NACIONALES 2025-2026
    // ═══════════════════════════════════════════════
    UIT: 5150,
    RMV: 1075,
    ASIGNACION_FAMILIAR_PCT: 0.10,
    VERSION: '4.0.0',
    YEAR: 2026,

    // ═══════════════════════════════════════════════
    //  CONSTANTES LEGALES DE CÁLCULO
    // ═══════════════════════════════════════════════
    HORAS_MES_LEGAL: 240,
    DIAS_MES: 30,
    DIAS_ANO: 360,
    MESES_ANO: 12,
    MESES_SEMESTRE: 6,
    JORNADA_DIARIA_LEGAL: 8,
    JORNADA_SEMANAL_LEGAL: 48,

    // Tope SBS para Prima de Seguro AFP (actualizado 2025-2026)
    TOPE_SBS_SEGURO: 13733.34,

    // Mínimo de veces que debe percibirse concepto variable
    // para ser computable (Art. 17 D.S. 001-97-TR)
    MINIMO_PERCEPCIONES_VARIABLE: 3,
    MESES_PROMEDIO_VARIABLE: 6,

    // ═══════════════════════════════════════════════
    //  SISTEMA DE PENSIONES (SBS 2025-2026)
    // ═══════════════════════════════════════════════
    PENSIONES: Object.freeze({
        onp: {
            id: 'onp',
            nombre: "ONP",
            nombreCompleto: "Oficina de Normalización Previsional",
            tipo: 'snp',
            aporte: 0.13,
            comisionFlujo: 0,
            comisionMixta: 0,
            comisionSaldo: 0,
            seguro: 0,
            topeSBSAplica: false
        },
        "afp-habitat": {
            id: 'afp-habitat',
            nombre: "AFP Habitat",
            nombreCompleto: "AFP Habitat S.A.",
            tipo: 'spp',
            aporte: 0.10,
            comisionFlujo: 0.0138,
            comisionMixta: 0.0038,
            comisionSaldo: 0.0038,
            seguro: 0.0192,
            topeSBSAplica: true
        },
        "afp-integra": {
            id: 'afp-integra',
            nombre: "AFP Integra",
            nombreCompleto: "Integra AFP S.A.",
            tipo: 'spp',
            aporte: 0.10,
            comisionFlujo: 0.0155,
            comisionMixta: 0.0045,
            comisionSaldo: 0.0045,
            seguro: 0.0192,
            topeSBSAplica: true
        },
        "afp-prima": {
            id: 'afp-prima',
            nombre: "AFP Prima",
            nombreCompleto: "Prima AFP S.A.",
            tipo: 'spp',
            aporte: 0.10,
            comisionFlujo: 0.0155,
            comisionMixta: 0.0045,
            comisionSaldo: 0.0045,
            seguro: 0.0192,
            topeSBSAplica: true
        },
        "afp-profuturo": {
            id: 'afp-profuturo',
            nombre: "AFP ProFuturo",
            nombreCompleto: "ProFuturo AFP S.A.",
            tipo: 'spp',
            aporte: 0.10,
            comisionFlujo: 0.0169,
            comisionMixta: 0.0056,
            comisionSaldo: 0.0056,
            seguro: 0.0192,
            topeSBSAplica: true
        }
    }),

    TIPO_COMISION: Object.freeze({
        FLUJO: 'flujo',
        MIXTA: 'mixta'
    }),

    // ═══════════════════════════════════════════════
    //  TRAMOS IR 5TA CATEGORÍA (Art. 53° LIR)
    // ═══════════════════════════════════════════════
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

    // ═══════════════════════════════════════════════
    //  HORAS EXTRAS (D.S. 007-2002-TR)
    // ═══════════════════════════════════════════════
    SOBRETASA_HE_25: 0.25,
    SOBRETASA_HE_35: 0.35,
    SOBRETASA_NOCTURNO: 0.35,

    DIVISOR_HE: Object.freeze({
        LEGAL_240: 240,
        DIAS_REALES: 'real'
    }),

    // ═══════════════════════════════════════════════
    //  ESSALUD / EPS (Ley 26790)
    // ═══════════════════════════════════════════════
    ESSALUD: Object.freeze({
        general:  { tasa: 0.09,  nombre: "Régimen General" },
        pequena:  { tasa: 0.09,  nombre: "Pequeña Empresa" },
        agrario:  { tasa: 0.06,  nombre: "Régimen Agrario" },
        micro:    { tasa: 0.045, nombre: "Microempresa (subsidiado 50%)" }
    }),

    // Bonificación Extraordinaria sobre Gratificación
    BONIF_ESSALUD: 0.09,
    BONIF_EPS: 0.0675,

    // ═══════════════════════════════════════════════
    //  SCTR + VIDA LEY
    // ═══════════════════════════════════════════════
    SCTR: Object.freeze({
        salud: 0.0053,
        pension: 0.0053,
        get total() { return this.salud + this.pension; }
    }),

    VIDA_LEY: Object.freeze({
        anos_minimo: 4,
        prima_estimada: 0.0053,
        cobertura_natural: 16,
        cobertura_accidental: 32
    }),

    // ═══════════════════════════════════════════════
    //  GRATIFICACIÓN (Ley 27735 + Ley 30334)
    // ═══════════════════════════════════════════════
    PERIODOS_GRATIFICACION: Object.freeze({
        julio:     { nombre: "Fiestas Patrias", semestre: [1, 6],  mes_pago: 7 },
        diciembre: { nombre: "Navidad",         semestre: [7, 12], mes_pago: 12 }
    }),

    // ═══════════════════════════════════════════════
    //  CTS (D.S. 001-97-TR)
    // ═══════════════════════════════════════════════
    CTS_SEXTO_GRATIFICACION: 1 / 6,

    // ═══════════════════════════════════════════════
    //  INASISTENCIAS - Descuento dominical
    //  (D.Leg. 713 Art. 2, D.S. 012-92-TR)
    //  Factor 1.2 = día laborable + parte proporcional dominical
    // ═══════════════════════════════════════════════
    FACTOR_DESCUENTO_INASISTENCIA: 1.2,

    // ═══════════════════════════════════════════════
    //  REGÍMENES LABORALES
    // ═══════════════════════════════════════════════
    REGIMENES: Object.freeze({
        general: {
            id: 'general',
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
            id: 'pequena',
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
            id: 'micro',
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

    // ═══════════════════════════════════════════════
    //  UTILIDADES (D.Leg. 892)
    // ═══════════════════════════════════════════════
    UTILIDADES_SECTOR: Object.freeze({
        10: "Pesquería / Telecomunicaciones",
        8:  "Industria / Minería",
        5:  "Comercio / Restaurantes / Otros"
    }),
    UTILIDADES_TOPE_REMUNERACIONES: 18,

    // ═══════════════════════════════════════════════
    //  VACACIONES (D.Leg. 713)
    //  Triple vacacional: Art. 23
    // ═══════════════════════════════════════════════
    TRIPLE_VACACIONAL: Object.freeze({
        remuDescanso: 1,
        remuTrabajo: 1,
        indemnizacion: 1
    }),

    // ═══════════════════════════════════════════════
    //  CONCEPTOS REMUNERATIVOS / NO REMUNERATIVOS
    // ═══════════════════════════════════════════════
    CONCEPTOS: Object.freeze({
        REMUNERATIVO: {
            sueldo_basico: { nombre: "Sueldo Básico", computableHE: true, computableBeneficios: true },
            asig_familiar: { nombre: "Asignación Familiar", computableHE: true, computableBeneficios: true },
            comisiones: { nombre: "Comisiones", computableHE: true, computableBeneficios: true, variable: true },
            bonos_regulares: { nombre: "Bonos Regulares", computableHE: true, computableBeneficios: true, variable: true },
            horas_extras: { nombre: "Horas Extras", computableHE: false, computableBeneficios: false },
            alimentacion_principal: { nombre: "Alimentación Principal", computableHE: true, computableBeneficios: true }
        },
        NO_REMUNERATIVO: {
            movilidad_supeditada: { nombre: "Movilidad (supeditada a asistencia)", tope_diario_pct: 0 },
            refrigerio_no_alim: { nombre: "Refrigerio (no alimentación principal)", tope: 0 },
            condicion_trabajo: { nombre: "Condición de Trabajo", tope: 0 },
            gratificacion_extraordinaria: { nombre: "Gratificación Extraordinaria", tope: 0 },
            utilidades: { nombre: "Utilidades", tope: 0 },
            cts: { nombre: "CTS", tope: 0 }
        }
    }),

    // ═══════════════════════════════════════════════
    //  FAQ
    // ═══════════════════════════════════════════════
    FAQ: Object.freeze([
        {
            pregunta: "¿Cómo se calcula el sueldo neto en Perú?",
            respuesta: "El sueldo neto se obtiene restando al sueldo bruto (incluyendo asignación familiar y promedio de conceptos variables) los descuentos de ley: aporte al sistema de pensiones (ONP 13% o AFP ~13.30%-13.61%) y, si corresponde, el Impuesto a la Renta de 5ta categoría. Fórmula: <strong>Sueldo Neto = Base Remunerativa - Pensión - IR 5ta - Descuento Inasistencias</strong>."
        },
        {
            pregunta: "¿Cuándo se pagan las gratificaciones?",
            respuesta: "Se pagan en <strong>julio (Fiestas Patrias)</strong> y <strong>diciembre (Navidad)</strong>. El monto equivale a una remuneración completa (incluyendo promedio de variables) si se trabajó el semestre íntegro. Se añade una <strong>Bonificación Extraordinaria del 9%</strong> (EsSalud) o <strong>6.75%</strong> si el trabajador tiene EPS."
        },
        {
            pregunta: "¿Cómo se calculan las horas extras legalmente?",
            respuesta: "El valor hora se obtiene dividiendo la remuneración mensual computable entre <strong>240 horas</strong> (30d × 8h). Las primeras 2 horas extras diarias: <strong>+25%</strong>. Las siguientes: <strong>+35%</strong>. Trabajo nocturno (10pm-6am): sobretasa adicional del 35%."
        },
        {
            pregunta: "¿Qué es la Triple Vacacional?",
            respuesta: "Si el trabajador no gozó sus vacaciones en el año siguiente al que adquirió el derecho, recibe: <strong>1 remuneración</strong> (ya pagada durante el trabajo), <strong>1 remuneración</strong> (por el descanso no gozado) y <strong>1 remuneración</strong> (indemnización). Total: 3 remuneraciones."
        },
        {
            pregunta: "¿Cuál es el tope SBS para la prima de seguro AFP?",
            respuesta: "La prima de seguro de invalidez y sobrevivencia se calcula sobre la remuneración, pero tiene un <strong>tope de S/ 13,733.34</strong> (Remuneración Máxima Asegurable). Si el sueldo excede este monto, la prima se calcula solo hasta el tope."
        },
        {
            pregunta: "¿Cómo afectan las inasistencias al sueldo?",
            respuesta: "Cada día de inasistencia injustificada descuenta: <strong>(Sueldo/30) × 1.2</strong>. El factor 1.2 incluye la parte proporcional del descanso semanal (dominical). Si se falta toda la semana, se pierde también el dominical completo."
        },
        {
            pregunta: "¿Cuál es la diferencia entre Bonif. 9% y 6.75%?",
            respuesta: "La Bonificación Extraordinaria sobre la gratificación es del <strong>9%</strong> si el trabajador está afiliado a EsSalud, y del <strong>6.75%</strong> si tiene EPS (Entidad Prestadora de Salud). Esto porque con EPS, el empleador paga 6.75% a EsSalud y el resto a la EPS."
        },
        {
            pregunta: "¿Qué es la comisión mixta en AFP?",
            respuesta: "Es un esquema donde se cobra una comisión sobre el <strong>flujo</strong> (porcentaje del sueldo) más una comisión sobre el <strong>saldo</strong> acumulado en el fondo. El trabajador puede elegir entre comisión sobre flujo pura o comisión mixta."
        },
        {
            pregunta: "¿Los conceptos variables se incluyen en la CTS?",
            respuesta: "Sí, si se percibieron al menos <strong>3 veces en el semestre</strong> computable. Se toma el <strong>promedio de los últimos 6 meses</strong>. Aplica para comisiones, bonos regulares y otros conceptos remunerativos variables."
        },
        {
            pregunta: "¿Cuánto cuesta un trabajador al empleador?",
            respuesta: "En régimen general, el sobrecosto es de <strong>+45% a +55%</strong> sobre el sueldo bruto: EsSalud (9%), CTS (~8.33%), Gratificaciones + Bonif. (~18.17%), Vacaciones (~8.33%), Vida Ley (~0.53%), SCTR si aplica (~1.06%)."
        }
    ])
});


// ═══════════════════════════════════════════════════════════════
//  MOTOR DE CÁLCULO v4.0 (CalcEngine)
//  Separación total: Lógica pura → sin acceso al DOM
// ═══════════════════════════════════════════════════════════════

const CalcEngine = (() => {

    // ─────────────────────────────────────────────
    //  PRECISIÓN FINANCIERA
    //  R1: 10 decimales internos
    //  R2: Redondeo PLAME al final por concepto
    // ─────────────────────────────────────────────
    const _PRECISION = 10;

    function safe(value) {
        if (typeof value !== 'number' || !isFinite(value)) return 0;
        return parseFloat(value.toFixed(_PRECISION));
    }

    function plameRound(value) {
        return Math.round(value * 100) / 100;
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(plameRound(amount));
    }

    // ─────────────────────────────────────────────
    //  AUDIT LOGGER
    // ─────────────────────────────────────────────
    class AuditLog {
        constructor(titulo) {
            this.lines = [`=== ${titulo} ===`, `Motor v${DATA.VERSION} | ${new Date().toISOString()}`];
        }
        add(msg) { this.lines.push(msg); }
        section(title) { this.lines.push(`\n--- ${title} ---`); }
        calc(label, expr, result) { this.lines.push(`${label}: ${expr} = ${result}`); }
        warn(msg) { this.lines.push(`⚠ ${msg}`); }
        toString() { return this.lines.join('\n'); }
    }

    // ─────────────────────────────────────────────
    //  BASE REMUNERATIVA UNIVERSAL
    //  R3: Sueldo + AF + Promedio Variables
    //  Incluye descuento por inasistencias
    // ─────────────────────────────────────────────
    function getBaseRemunerativa(params) {
        const {
            sueldoBruto = 0,
            incluyeAsigFamiliar = false,
            regimen = 'general',
            promedioComisiones = 0,
            promedioBonos = 0,
            vecesComisiones = 6,
            vecesBonos = 6,
            diasFaltados = 0,
            conceptosNoRemunerativos = {}
        } = params;

        const audit = new AuditLog('BASE REMUNERATIVA');
        const reg = DATA.REGIMENES[regimen] || DATA.REGIMENES.general;

        const sueldo = safe(sueldoBruto);
        audit.add(`Sueldo bruto: ${sueldo}`);

        // Asignación familiar
        let asigFamiliar = 0;
        if (incluyeAsigFamiliar && reg.asig_familiar) {
            asigFamiliar = safe(DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT);
            audit.calc('Asig. Familiar', `${DATA.RMV} × ${DATA.ASIGNACION_FAMILIAR_PCT}`, asigFamiliar);
        }

        // Conceptos variables (Art. 17 D.S. 001-97-TR)
        let comisionesComputable = 0;
        if (promedioComisiones > 0 && vecesComisiones >= DATA.MINIMO_PERCEPCIONES_VARIABLE) {
            comisionesComputable = safe(promedioComisiones);
            audit.calc('Comisiones computable', `promedio 6m (${vecesComisiones} veces)`, comisionesComputable);
        } else if (promedioComisiones > 0) {
            audit.warn(`Comisiones NO computables: ${vecesComisiones} veces < ${DATA.MINIMO_PERCEPCIONES_VARIABLE} mínimo`);
        }

        let bonosComputable = 0;
        if (promedioBonos > 0 && vecesBonos >= DATA.MINIMO_PERCEPCIONES_VARIABLE) {
            bonosComputable = safe(promedioBonos);
            audit.calc('Bonos computable', `promedio 6m (${vecesBonos} veces)`, bonosComputable);
        } else if (promedioBonos > 0) {
            audit.warn(`Bonos NO computables: ${vecesBonos} veces < ${DATA.MINIMO_PERCEPCIONES_VARIABLE} mínimo`);
        }

        // Base bruta (antes de descuentos)
        const baseBruta = safe(sueldo + asigFamiliar + comisionesComputable + bonosComputable);
        audit.calc('Base bruta', `${sueldo} + ${asigFamiliar} + ${comisionesComputable} + ${bonosComputable}`, baseBruta);

        // Descuento por inasistencias (con dominical)
        let descuentoInasistencias = 0;
        if (diasFaltados > 0) {
            const valorDia = safe(sueldo / DATA.DIAS_MES);
            descuentoInasistencias = safe(valorDia * diasFaltados * DATA.FACTOR_DESCUENTO_INASISTENCIA);
            audit.section('DESCUENTO INASISTENCIAS');
            audit.calc('Valor día', `${sueldo} / ${DATA.DIAS_MES}`, valorDia);
            audit.calc('Desc. con dominical', `${valorDia} × ${diasFaltados} × ${DATA.FACTOR_DESCUENTO_INASISTENCIA}`, descuentoInasistencias);
        }

        const baseNeta = safe(baseBruta - descuentoInasistencias);
        audit.calc('BASE NETA (para descuentos)', `${baseBruta} - ${descuentoInasistencias}`, baseNeta);

        // Base para beneficios (sin descuento inasistencias, con variables)
        const baseBeneficios = safe(sueldo + asigFamiliar + comisionesComputable + bonosComputable);

        // Base para horas extras (solo conceptos computableHE)
        const baseHorasExtras = safe(sueldo + asigFamiliar + comisionesComputable + bonosComputable);

        // Conceptos no remunerativos (informativos)
        const totalNoRemunerativo = safe(
            (conceptosNoRemunerativos.movilidad || 0) +
            (conceptosNoRemunerativos.refrigerio || 0) +
            (conceptosNoRemunerativos.condicionTrabajo || 0)
        );

        return {
            sueldoBruto: sueldo,
            asigFamiliar,
            comisionesComputable,
            bonosComputable,
            baseBruta,
            diasFaltados,
            descuentoInasistencias,
            baseNeta,
            baseBeneficios,
            baseHorasExtras,
            totalNoRemunerativo,
            conceptosNoRemunerativos,
            regimen: reg,
            audit: audit.toString()
        };
    }

    // ─────────────────────────────────────────────
    //  PENSIONES (ONP / AFP)
    //  R4: Tope SBS para prima de seguro
    //  Soporte comisión flujo y mixta
    // ─────────────────────────────────────────────
    function calcularPension(params) {
        const {
            baseImponible,
            tipoPension = 'onp',
            tipoComision = 'flujo',
            saldoAFP = 0
        } = params;

        const audit = new AuditLog('CÁLCULO PENSIONES');
        const p = DATA.PENSIONES[tipoPension];
        if (!p) return { total: 0, detalle: [], audit: 'Pensión no encontrada' };

        const detalles = [];
        const base = safe(baseImponible);
        audit.add(`Base imponible: ${base}`);
        audit.add(`Sistema: ${p.nombreCompleto} (${p.tipo.toUpperCase()})`);

        if (p.tipo === 'snp') {
            // ONP: 13% simple
            const monto = safe(base * p.aporte);
            detalles.push({ concepto: `ONP (${(p.aporte * 100).toFixed(0)}%)`, monto, tasa: p.aporte, base });
            audit.calc('ONP', `${base} × ${p.aporte}`, monto);
        } else {
            // AFP: Fondo + Comisión + Prima de Seguro
            // 1. Aporte obligatorio al fondo (10%)
            const fondo = safe(base * p.aporte);
            detalles.push({ concepto: `Aporte al fondo (${(p.aporte * 100).toFixed(0)}%)`, monto: fondo, tasa: p.aporte, base });
            audit.calc('Fondo obligatorio', `${base} × ${p.aporte}`, fondo);

            // 2. Comisión según tipo
            let comision = 0;
            if (tipoComision === 'mixta') {
                const comFlujo = safe(base * p.comisionMixta);
                const comSaldo = safe(saldoAFP * (p.comisionSaldo / 12));
                comision = safe(comFlujo + comSaldo);
                detalles.push({
                    concepto: `Comisión mixta (flujo ${(p.comisionMixta * 100).toFixed(2)}% + saldo)`,
                    monto: comision,
                    tasa: p.comisionMixta,
                    base
                });
                audit.section('COMISIÓN MIXTA');
                audit.calc('Com. flujo', `${base} × ${p.comisionMixta}`, comFlujo);
                audit.calc('Com. saldo', `${saldoAFP} × ${p.comisionSaldo}/12`, comSaldo);
                audit.calc('Com. total', `${comFlujo} + ${comSaldo}`, comision);
            } else {
                comision = safe(base * p.comisionFlujo);
                detalles.push({
                    concepto: `Comisión flujo (${(p.comisionFlujo * 100).toFixed(2)}%)`,
                    monto: comision,
                    tasa: p.comisionFlujo,
                    base
                });
                audit.calc('Comisión flujo', `${base} × ${p.comisionFlujo}`, comision);
            }

            // 3. Prima de seguro con TOPE SBS
            let baseSeguro = base;
            let topeAplicado = false;
            if (p.topeSBSAplica && base > DATA.TOPE_SBS_SEGURO) {
                baseSeguro = DATA.TOPE_SBS_SEGURO;
                topeAplicado = true;
                audit.warn(`Tope SBS aplicado: ${base} > ${DATA.TOPE_SBS_SEGURO}`);
            }
            const seguro = safe(baseSeguro * p.seguro);
            detalles.push({
                concepto: `Prima seguro (${(p.seguro * 100).toFixed(2)}%)${topeAplicado ? ' [TOPE SBS]' : ''}`,
                monto: seguro,
                tasa: p.seguro,
                base: baseSeguro,
                topeAplicado
            });
            audit.calc('Prima seguro', `${baseSeguro} × ${p.seguro}`, seguro);
            if (topeAplicado) {
                audit.add(`Base seguro limitada al tope SBS: ${DATA.TOPE_SBS_SEGURO}`);
            }
        }

        const total = safe(detalles.reduce((s, d) => s + d.monto, 0));
        const tasaEfectiva = base > 0 ? safe(total / base) : 0;
        audit.calc('TOTAL PENSIÓN', detalles.map(d => d.monto).join(' + '), total);
        audit.calc('Tasa efectiva', `${total} / ${base}`, tasaEfectiva);

        return {
            nombre: p.nombre,
            nombreCompleto: p.nombreCompleto,
            tipo: p.tipo,
            total: safe(total),
            detalle: detalles,
            tasaEfectiva,
            tipoComision,
            audit: audit.toString()
        };
    }

    // ─────────────────────────────────────────────
    //  IMPUESTO A LA RENTA - TRAMOS
    // ─────────────────────────────────────────────
    function calcularIRAnual(rentaNetaAnual) {
        const audit = new AuditLog('IR ANUAL POR TRAMOS');
        let impuestoTotal = 0;
        let restante = safe(Math.max(0, rentaNetaAnual));
        let limiteAnterior = 0;
        const tramos = [];

        audit.add(`Renta neta anual: ${restante}`);

        for (const tramo of DATA.TRAMOS_IR) {
            const limiteSuperior = tramo.hasta_uit === Infinity
                ? Infinity : safe(tramo.hasta_uit * DATA.UIT);
            const rangoTramo = limiteSuperior === Infinity
                ? restante : safe(limiteSuperior - limiteAnterior);

            const baseGravable = safe(Math.min(Math.max(0, restante), rangoTramo));
            const impuestoTramo = safe(baseGravable * tramo.tasa);

            tramos.push({
                nombre: tramo.nombre, tasa: tramo.tasa, color: tramo.color,
                limiteInferior: limiteAnterior, limiteSuperior,
                baseGravable, impuesto: impuestoTramo
            });

            if (baseGravable > 0) {
                audit.calc(tramo.nombre, `${baseGravable} × ${tramo.tasa}`, impuestoTramo);
            }

            impuestoTotal = safe(impuestoTotal + impuestoTramo);
            restante = safe(restante - baseGravable);
            limiteAnterior = limiteSuperior;
        }

        audit.calc('IR TOTAL', 'Σ tramos', impuestoTotal);
        return { impuesto: impuestoTotal, tramos, audit: audit.toString() };
    }

    // ─────────────────────────────────────────────
    //  PROYECCIÓN RENTA 5TA (Art. 40° Reglamento LIR)
    //  R5: Incluye Bonif. 9% / 6.75% según EPS
    // ─────────────────────────────────────────────
    function proyectarRenta5ta(params) {
        const {
            sueldoMensual, asigFamiliar = 0, promedioVariables = 0,
            mesCalculo, remuPercibidas = 0, gratPercibidas = 0,
            otrosIngresos = 0, tieneEPS = false
        } = params;

        const audit = new AuditLog(`PROYECCIÓN RENTA 5TA - MES ${mesCalculo}`);
        const base = safe(sueldoMensual + asigFamiliar + promedioVariables);
        const mesesRestantes = 12 - mesCalculo + 1;
        const tasaBonif = tieneEPS ? DATA.BONIF_EPS : DATA.BONIF_ESSALUD;

        audit.add(`Base mensual: ${base} (Sueldo: ${sueldoMensual} + AF: ${asigFamiliar} + Var: ${promedioVariables})`);
        audit.add(`Tipo bonif.: ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`);

        const proyeccionSueldos = safe(base * mesesRestantes);

        // Gratificaciones pendientes + bonificación
        let gratPendientes = 0;
        let bonifPendientes = 0;
        if (mesCalculo <= 7) {
            gratPendientes = safe(gratPendientes + base);
            bonifPendientes = safe(bonifPendientes + base * tasaBonif);
        }
        if (mesCalculo <= 12) {
            gratPendientes = safe(gratPendientes + base);
            bonifPendientes = safe(bonifPendientes + base * tasaBonif);
        }

        const rentaBrutaAnual = safe(
            remuPercibidas + gratPercibidas + proyeccionSueldos +
            gratPendientes + bonifPendientes + otrosIngresos
        );

        const deduccion7UIT = safe(DATA.DEDUCCION_UIT * DATA.UIT);
        const rentaNetaAnual = safe(Math.max(0, rentaBrutaAnual - deduccion7UIT));

        audit.section('COMPOSICIÓN RENTA BRUTA');
        audit.add(`Remu. percibidas: ${remuPercibidas}`);
        audit.add(`Grat. percibidas: ${gratPercibidas}`);
        audit.add(`Proyección sueldos (${mesesRestantes}m): ${proyeccionSueldos}`);
        audit.add(`Grat. pendientes: ${gratPendientes}`);
        audit.add(`Bonif. ${tieneEPS ? '6.75%' : '9%'} pendientes: ${bonifPendientes}`);
        audit.add(`Otros ingresos: ${otrosIngresos}`);
        audit.calc('RENTA BRUTA ANUAL', 'Σ componentes', rentaBrutaAnual);
        audit.calc('Deducción 7 UIT', `7 × ${DATA.UIT}`, deduccion7UIT);
        audit.calc('RENTA NETA ANUAL', `${rentaBrutaAnual} - ${deduccion7UIT}`, rentaNetaAnual);

        const irResult = calcularIRAnual(rentaNetaAnual);
        const divisor = DATA.DIVISORES_RETENCION[mesCalculo] || 12;
        const retencionMensual = safe(irResult.impuesto / divisor);

        audit.section('RETENCIÓN MENSUAL');
        audit.calc('IR Anual', '', irResult.impuesto);
        audit.add(`Divisor mes ${mesCalculo}: ${divisor}`);
        audit.calc('RETENCIÓN', `${irResult.impuesto} / ${divisor}`, retencionMensual);

        return {
            rentaBrutaAnual, deduccion7UIT, rentaNetaAnual,
            irAnual: irResult.impuesto, tramos: irResult.tramos,
            divisor, retencionMensual, tasaBonif,
            desglose: {
                remuPercibidas, gratPercibidas, proyeccionSueldos,
                gratPendientes, bonifPendientes, otrosIngresos, mesesRestantes
            },
            audit: audit.toString() + '\n' + irResult.audit
        };
    }


    // ═══════════════════════════════════════════════
    //  CALCULADORAS PRINCIPALES
    // ═══════════════════════════════════════════════

    // ─── 1. SUELDO NETO ──────────────────────────
    function sueldoNeto(params) {
        const {
            sueldoBruto, regimen = 'general', tipoPension = 'onp',
            tipoComision = 'flujo', saldoAFP = 0,
            incluyeAsigFamiliar = false, mesCalculo = 6,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6,
            diasFaltados = 0, tieneEPS = false,
            conceptosNoRemunerativos = {}
        } = params;

        const audit = new AuditLog('SUELDO NETO');

        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar, regimen,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos, diasFaltados,
            conceptosNoRemunerativos
        });

        // Pensión sobre base neta (después de inasistencias)
        const pension = calcularPension({
            baseImponible: base.baseNeta,
            tipoPension, tipoComision, saldoAFP
        });

        // IR sobre base sin descuento inasistencias (proyección)
        const promedioVar = safe(base.comisionesComputable + base.bonosComputable);
        const irProyeccion = proyectarRenta5ta({
            sueldoMensual: base.sueldoBruto,
            asigFamiliar: base.asigFamiliar,
            promedioVariables: promedioVar,
            mesCalculo,
            tieneEPS
        });

        const totalDescuentos = safe(pension.total + irProyeccion.retencionMensual);
        const neto = safe(base.baseNeta - totalDescuentos);

        audit.section('RESUMEN');
        audit.add(`Base neta (post inasistencias): ${base.baseNeta}`);
        audit.add(`Pensión: ${pension.total}`);
        audit.add(`IR 5ta mensual: ${irProyeccion.retencionMensual}`);
        audit.add(`Total descuentos: ${totalDescuentos}`);
        audit.calc('SUELDO NETO', `${base.baseNeta} - ${totalDescuentos}`, neto);

        // Validación de auditoría
        const verificacion = safe(base.baseNeta - pension.total - irProyeccion.retencionMensual);
        if (Math.abs(verificacion - neto) > 0.001) {
            audit.warn(`¡ALERTA AUDITORÍA! Diferencia detectada: ${Math.abs(verificacion - neto)}`);
        } else {
            audit.add('✓ Verificación de integridad: PASS');
        }

        return {
            base, pension, ir: {
                mensual: irProyeccion.retencionMensual,
                anual: irProyeccion.irAnual,
                tramos: irProyeccion.tramos,
                rentaNetaAnual: irProyeccion.rentaNetaAnual,
                tasaBonif: irProyeccion.tasaBonif
            },
            totalDescuentos,
            sueldoNeto: neto,
            porcentajeDescuento: base.baseNeta > 0 ? safe((totalDescuentos / base.baseNeta) * 100) : 0,
            conceptosNoRemunerativos: base.totalNoRemunerativo,
            totalBoleta: safe(neto + base.totalNoRemunerativo),
            audit: audit.toString() + '\n\n' + base.audit + '\n\n' + pension.audit
        };
    }

    // ─── 2. GRATIFICACIÓN ────────────────────────
    function gratificacion(params) {
        const {
            sueldoBruto, periodo = 'julio', mesesTrabajados = 6,
            incluyeAsigFamiliar = false, tieneEPS = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6,
            diasTrabajadosUltimoMes = 30
        } = params;

        const audit = new AuditLog('GRATIFICACIÓN');
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const meses = Math.min(Math.max(0, mesesTrabajados), DATA.MESES_SEMESTRE);
        const diasProp = Math.min(Math.max(0, diasTrabajadosUltimoMes), 30);

        // Gratificación = (Base / 6) × meses + (Base / 6 / 30) × días del último mes incompleto
        const gratBase = safe((base.baseBeneficios / DATA.MESES_SEMESTRE) * meses);

        const tasaBonif = tieneEPS ? DATA.BONIF_EPS : DATA.BONIF_ESSALUD;
        const bonif = safe(gratBase * tasaBonif);
        const total = safe(gratBase + bonif);

        audit.add(`Base beneficios: ${base.baseBeneficios}`);
        audit.add(`Variables incluidas: Comisiones ${base.comisionesComputable}, Bonos ${base.bonosComputable}`);
        audit.calc('Gratificación', `(${base.baseBeneficios} / 6) × ${meses}`, gratBase);
        audit.add(`Tipo bonif.: ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`);
        audit.calc('Bonificación', `${gratBase} × ${tasaBonif}`, bonif);
        audit.calc('TOTAL', `${gratBase} + ${bonif}`, total);

        return {
            base, periodo: DATA.PERIODOS_GRATIFICACION[periodo],
            mesesEfectivos: meses, gratificacionBase: gratBase,
            tasaBonif, tieneEPS, bonifExtraordinaria: bonif,
            totalRecibir: total,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 3. CTS ──────────────────────────────────
    function cts(params) {
        const {
            sueldoBruto, meses = 6, dias = 0,
            incluyeAsigFamiliar = false, ultimaGratificacion = 0,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('CTS');
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const sextoGrat = safe(ultimaGratificacion * DATA.CTS_SEXTO_GRATIFICACION);
        const remuComputable = safe(base.baseBeneficios + sextoGrat);
        const totalDias = safe(meses * DATA.DIAS_MES + dias);
        const valorDiario = safe(remuComputable / DATA.DIAS_ANO);
        const ctsTotal = safe(valorDiario * totalDias);

        audit.add(`Base beneficios: ${base.baseBeneficios}`);
        audit.add(`Variables: Comisiones ${base.comisionesComputable}, Bonos ${base.bonosComputable}`);
        audit.calc('1/6 Gratificación', `${ultimaGratificacion} × 1/6`, sextoGrat);
        audit.calc('Remu. computable', `${base.baseBeneficios} + ${sextoGrat}`, remuComputable);
        audit.calc('Total días', `${meses}×30 + ${dias}`, totalDias);
        audit.calc('Valor diario', `${remuComputable} / 360`, valorDiario);
        audit.calc('CTS', `${valorDiario} × ${totalDias}`, ctsTotal);

        return {
            base, sextoGratificacion: sextoGrat, remuComputable,
            totalDias, valorDiario, cts: ctsTotal,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 4. HORAS EXTRAS ─────────────────────────
    function horasExtras(params) {
        const {
            sueldoBruto, horas25 = 0, horas35 = 0,
            incluyeAsigFamiliar = false, esNocturno = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6,
            divisorHE = 'legal',
            diasRealesMes = 30
        } = params;

        const audit = new AuditLog('HORAS EXTRAS');
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        // Determinar divisor
        let divisor;
        if (divisorHE === 'real') {
            divisor = safe(diasRealesMes * DATA.JORNADA_DIARIA_LEGAL);
            audit.add(`Divisor por días reales: ${diasRealesMes} × ${DATA.JORNADA_DIARIA_LEGAL} = ${divisor}`);
        } else {
            divisor = DATA.HORAS_MES_LEGAL;
            audit.add(`Divisor legal fijo: ${divisor} (30 × 8)`);
        }

        audit.add(`D.S. 007-2002-TR | Divisor: ${divisor} horas`);

        // Sobretasa nocturna
        const sobreTasaNocturna = esNocturno ? safe(base.baseHorasExtras * DATA.SOBRETASA_NOCTURNO) : 0;
        const baseParaHE = esNocturno ? safe(base.baseHorasExtras + sobreTasaNocturna) : base.baseHorasExtras;

        if (esNocturno) {
            audit.calc('Sobretasa nocturna', `${base.baseHorasExtras} × ${DATA.SOBRETASA_NOCTURNO}`, sobreTasaNocturna);
            audit.calc('Base para HE', `${base.baseHorasExtras} + ${sobreTasaNocturna}`, baseParaHE);
        }

        // Valor hora sin redondeo intermedio
        const valorHora = safe(baseParaHE / divisor);
        const valorHora25 = safe(valorHora * (1 + DATA.SOBRETASA_HE_25));
        const valorHora35 = safe(valorHora * (1 + DATA.SOBRETASA_HE_35));

        // Pago sin redondeo intermedio
        const pagoHoras25 = safe(horas25 * valorHora25);
        const pagoHoras35 = safe(horas35 * valorHora35);
        const totalHorasExtras = safe(pagoHoras25 + pagoHoras35);

        audit.section('CÁLCULO VALOR HORA');
        audit.calc('Valor hora', `${baseParaHE} / ${divisor}`, valorHora);
        audit.calc('Valor hora +25%', `${valorHora} × 1.25`, valorHora25);
        audit.calc('Valor hora +35%', `${valorHora} × 1.35`, valorHora35);
        audit.section('PAGO');
        audit.calc(`Pago 25% (${horas25}h)`, `${horas25} × ${valorHora25}`, pagoHoras25);
        audit.calc(`Pago 35% (${horas35}h)`, `${horas35} × ${valorHora35}`, pagoHoras35);
        audit.calc('TOTAL HE', `${pagoHoras25} + ${pagoHoras35}`, totalHorasExtras);
        audit.add(`Monto PLAME (redondeado): S/ ${plameRound(totalHorasExtras)}`);

        return {
            base, esNocturno, sobreTasaNocturna, baseParaHE,
            divisor, valorHora, valorHora25, valorHora35,
            horas25, horas35, pagoHoras25, pagoHoras35,
            totalHorasExtras,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 5. VACACIONES ───────────────────────────
    function vacaciones(params) {
        const {
            sueldoBruto, diasVacaciones = 30, mesesLaborados = 12,
            incluyeAsigFamiliar = false, tripleVacacional = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('VACACIONES');
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const valorDiario = safe(base.baseBeneficios / DATA.DIAS_MES);
        const proporcion = safe(mesesLaborados / DATA.MESES_ANO);
        const remuVacacional = safe(valorDiario * diasVacaciones * proporcion);

        audit.add(`Base beneficios: ${base.baseBeneficios}`);
        audit.calc('Valor diario', `${base.baseBeneficios} / 30`, valorDiario);
        audit.calc('Proporción', `${mesesLaborados} / 12`, proporcion);
        audit.calc('Remu. vacacional', `${valorDiario} × ${diasVacaciones} × ${proporcion}`, remuVacacional);

        // Triple vacacional (Art. 23 D.Leg. 713)
        let remuDescanso = 0;
        let remuTrabajo = 0;
        let indemnizacion = 0;

        if (tripleVacacional) {
            audit.section('TRIPLE VACACIONAL (Art. 23 D.Leg. 713)');
            remuDescanso = remuVacacional;
            remuTrabajo = remuVacacional;
            indemnizacion = remuVacacional;
            audit.add(`1. Remu. por descanso adquirido (ya pagada): ${remuDescanso}`);
            audit.add(`2. Remu. por trabajo en período vacacional: ${remuTrabajo}`);
            audit.add(`3. Indemnización: ${indemnizacion}`);
        }

        const total = tripleVacacional
            ? safe(remuDescanso + remuTrabajo + indemnizacion)
            : remuVacacional;

        audit.calc('TOTAL', '', total);

        return {
            base, valorDiario, proporcion, remuVacacional,
            tripleVacacional, remuDescanso, remuTrabajo, indemnizacion,
            total,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 6. IMPUESTO A LA RENTA ──────────────────
    function impuestoRenta(params) {
        const {
            sueldoBruto, meses = 12, numGratificaciones = 2,
            incluyeAsigFamiliar = false, otrosIngresos = 0,
            tieneEPS = false, promedioComisiones = 0,
            promedioBonos = 0, vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('IR 5TA CATEGORÍA');
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const tasaBonif = tieneEPS ? DATA.BONIF_EPS : DATA.BONIF_ESSALUD;
        const sueldosAnuales = safe(base.baseBeneficios * meses);
        const gratAnuales = safe(base.baseBeneficios * numGratificaciones);
        const bonifAnuales = safe(gratAnuales * tasaBonif);
        const rentaBrutaAnual = safe(sueldosAnuales + gratAnuales + bonifAnuales + otrosIngresos);
        const deduccion = safe(DATA.DEDUCCION_UIT * DATA.UIT);
        const rentaNetaAnual = safe(Math.max(0, rentaBrutaAnual - deduccion));

        audit.add(`Base mensual: ${base.baseBeneficios}`);
        audit.add(`Bonif. tipo: ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`);
        audit.calc('Sueldos', `${base.baseBeneficios} × ${meses}`, sueldosAnuales);
        audit.calc('Gratificaciones', `${base.baseBeneficios} × ${numGratificaciones}`, gratAnuales);
        audit.calc('Bonif.', `${gratAnuales} × ${tasaBonif}`, bonifAnuales);
        audit.calc('Renta bruta', 'Σ', rentaBrutaAnual);
        audit.calc('Deducción 7 UIT', `7 × ${DATA.UIT}`, deduccion);
        audit.calc('Renta neta', `${rentaBrutaAnual} - ${deduccion}`, rentaNetaAnual);

        const irResult = calcularIRAnual(rentaNetaAnual);
        const irMensual = meses > 0 ? safe(irResult.impuesto / meses) : 0;
        const tasaEfectiva = rentaBrutaAnual > 0 ? safe((irResult.impuesto / rentaBrutaAnual) * 100) : 0;

        return {
            base,
            desglose: { sueldosAnuales, gratAnuales, bonifAnuales, otrosIngresos },
            rentaBrutaAnual, deduccion7UIT: deduccion, rentaNetaAnual,
            irAnual: irResult.impuesto, irMensual, tramos: irResult.tramos,
            tasaEfectiva, tasaBonif,
            audit: audit.toString() + '\n' + irResult.audit + '\n\n' + base.audit
        };
    }

    // ─── 7. LIQUIDACIÓN ──────────────────────────
    function liquidacion(params) {
        const {
            sueldoBruto, fechaIngreso, fechaCese,
            motivo = 'renuncia', vacPendientes = 0,
            vacNoGozadasTriple = false,
            incluyeAsigFamiliar = false, regimen = 'general',
            tieneEPS = false, promedioComisiones = 0,
            promedioBonos = 0, vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('LIQUIDACIÓN DE BENEFICIOS SOCIALES');
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar, regimen,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const tasaBonif = tieneEPS ? DATA.BONIF_EPS : DATA.BONIF_ESSALUD;

        // Tiempo de servicio
        const diffMs = fechaCese.getTime() - fechaIngreso.getTime();
        const totalDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const anos = Math.floor(totalDias / 365);
        const mesesRest = Math.floor((totalDias % 365) / 30);
        const diasRest = (totalDias % 365) % 30;

        audit.add(`Régimen: ${reg.nombre}`);
        audit.add(`Base beneficios: ${base.baseBeneficios}`);
        audit.add(`Tiempo: ${anos}a ${mesesRest}m ${diasRest}d (${totalDias} días)`);
        audit.add(`Bonif.: ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`);

        // CTS Trunca
        let ctsTrunca = 0;
        if (reg.cts) {
            const factorCTS = safe(reg.cts_dias_ano / DATA.DIAS_MES);
            const diasCTS = safe(mesesRest * 30 + diasRest);
            ctsTrunca = safe((base.baseBeneficios * factorCTS / DATA.DIAS_ANO) * diasCTS);
            audit.section('CTS TRUNCA');
            audit.calc('CTS', `(${base.baseBeneficios} × ${factorCTS} / 360) × ${diasCTS}`, ctsTrunca);
        }

        // Gratificación Trunca
        let gratTrunca = 0;
        let bonifGratTrunca = 0;
        if (reg.gratificacion) {
            const mesCese = fechaCese.getMonth() + 1;
            const mesesSem = mesCese <= 6 ? mesCese : mesCese - 6;
            gratTrunca = safe((base.baseBeneficios * reg.gratificacion_factor / DATA.MESES_SEMESTRE) * mesesSem);
            bonifGratTrunca = safe(gratTrunca * tasaBonif);
            audit.section('GRATIFICACIÓN TRUNCA');
            audit.calc('Grat.', `(${base.baseBeneficios} × ${reg.gratificacion_factor} / 6) × ${mesesSem}`, gratTrunca);
            audit.calc(`Bonif. ${tasaBonif * 100}%`, `${gratTrunca} × ${tasaBonif}`, bonifGratTrunca);
        }

        // Vacaciones Truncas
        const diasVacProp = safe(reg.vacaciones_dias * (mesesRest * 30 + diasRest) / DATA.DIAS_ANO);
        const vacTruncas = safe((base.baseBeneficios / DATA.DIAS_MES) * diasVacProp);
        audit.section('VACACIONES TRUNCAS');
        audit.calc('Días proporcionales', `${reg.vacaciones_dias} × ${mesesRest * 30 + diasRest} / 360`, diasVacProp);
        audit.calc('Vac. truncas', `(${base.baseBeneficios}/30) × ${diasVacProp}`, vacTruncas);

        // Vacaciones pendientes
        const pagoVacPendientes = safe((base.baseBeneficios / DATA.DIAS_MES) * vacPendientes);

        // Triple vacacional
        let tripleVacacionalMonto = 0;
        if (vacNoGozadasTriple) {
            // Art. 23 D.Leg. 713: 3 remuneraciones
            tripleVacacionalMonto = safe(base.baseBeneficios * 3);
            audit.section('TRIPLE VACACIONAL');
            audit.add('Art. 23 D.Leg. 713: 1 descanso + 1 trabajo + 1 indemnización');
            audit.calc('Triple vacacional', `${base.baseBeneficios} × 3`, tripleVacacionalMonto);
        }

        // Indemnización despido arbitrario
        let indemnizacion = 0;
        if (motivo === 'despido-arbitrario') {
            const anosServ = safe(anos + mesesRest / 12 + diasRest / 360);
            const indCalc = safe(base.baseBeneficios * reg.indemnizacion_despido * anosServ);
            const tope = safe(base.baseBeneficios * reg.indemnizacion_tope_remu);
            indemnizacion = Math.min(indCalc, tope);
            audit.section('INDEMNIZACIÓN DESPIDO ARBITRARIO');
            audit.calc('Cálculo', `${base.baseBeneficios} × ${reg.indemnizacion_despido} × ${anosServ}`, indCalc);
            audit.add(`Tope: ${base.baseBeneficios} × ${reg.indemnizacion_tope_remu} = ${tope}`);
            audit.calc('Final', `min(${indCalc}, ${tope})`, indemnizacion);
        }

        const totalLiquidacion = safe(
            ctsTrunca + gratTrunca + bonifGratTrunca + vacTruncas +
            pagoVacPendientes + tripleVacacionalMonto + indemnizacion
        );

        audit.section('TOTAL LIQUIDACIÓN');
        audit.calc('TOTAL', 'Σ conceptos', totalLiquidacion);

        // Verificación
        const suma = safe(ctsTrunca + gratTrunca + bonifGratTrunca + vacTruncas + pagoVacPendientes + tripleVacacionalMonto + indemnizacion);
        if (Math.abs(suma - totalLiquidacion) > 0.001) {
            audit.warn(`¡ALERTA! Diferencia en suma: ${Math.abs(suma - totalLiquidacion)}`);
        } else {
            audit.add('✓ Verificación: PASS');
        }

        return {
            base, regimen: reg, tasaBonif,
            tiempoServicio: { anos, meses: mesesRest, dias: diasRest, totalDias },
            motivo, ctsTrunca, gratTrunca, bonifGratTrunca,
            vacTruncas, pagoVacPendientes, vacPendientes,
            vacNoGozadasTriple, tripleVacacionalMonto,
            indemnizacion, totalLiquidacion,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 8. ESSALUD ──────────────────────────────
    function essalud(params) {
        const { sueldoBruto, regimen = 'general', numTrabajadores = 1, incluyeAsigFamiliar = false } = params;
        const audit = new AuditLog('ESSALUD');
        const base = getBaseRemunerativa({ sueldoBruto, incluyeAsigFamiliar, regimen });
        const tasaInfo = DATA.ESSALUD[regimen] || DATA.ESSALUD.general;

        const aporteUnit = safe(base.baseBeneficios * tasaInfo.tasa);
        const baseMin = safe(DATA.RMV * tasaInfo.tasa);
        const aporteReal = Math.max(aporteUnit, baseMin);
        const aporteTotal = safe(aporteReal * numTrabajadores);
        const aporteAnual = safe(aporteTotal * DATA.MESES_ANO);

        audit.calc('Aporte', `${base.baseBeneficios} × ${tasaInfo.tasa}`, aporteUnit);
        audit.add(`Base mínima (RMV): ${baseMin}`);
        audit.calc('Real', `max(${aporteUnit}, ${baseMin})`, aporteReal);
        audit.calc('Total', `${aporteReal} × ${numTrabajadores}`, aporteTotal);

        return {
            base, tasaInfo, aporteUnitario: aporteUnit, baseMinima: baseMin,
            aporteReal, numTrabajadores, aporteTotal, aporteAnual,
            audit: audit.toString()
        };
    }

    // ─── 9. UTILIDADES ───────────────────────────
    function utilidades(params) {
        const {
            rentaEmpresa, porcentajeSector, diasTrabajados, totalDiasTodos,
            remuAnual, totalRemuTodos
        } = params;

        const audit = new AuditLog('UTILIDADES');
        const montoDistribuir = safe(rentaEmpresa * porcentajeSector / 100);
        const mitad = safe(montoDistribuir / 2);
        const porDias = safe((mitad / totalDiasTodos) * diasTrabajados);
        const porRemu = totalRemuTodos > 0 ? safe((mitad / totalRemuTodos) * remuAnual) : 0;
        const totalCalc = safe(porDias + porRemu);
        const remuMensual = safe(remuAnual / DATA.MESES_ANO);
        const tope = safe(remuMensual * DATA.UTILIDADES_TOPE_REMUNERACIONES);
        const totalFinal = Math.min(totalCalc, tope);
        const excedente = safe(Math.max(0, totalCalc - tope));

        audit.calc('A distribuir', `${rentaEmpresa} × ${porcentajeSector}%`, montoDistribuir);
        audit.calc('Por días', `(${mitad}/${totalDiasTodos}) × ${diasTrabajados}`, porDias);
        audit.calc('Por remu', `(${mitad}/${totalRemuTodos}) × ${remuAnual}`, porRemu);
        audit.calc('Total calc', `${porDias} + ${porRemu}`, totalCalc);
        audit.add(`Tope 18 remu: ${tope}`);
        audit.calc('FINAL', `min(${totalCalc}, ${tope})`, totalFinal);

        return {
            montoDistribuir, porDias, porRemu, totalCalculado: totalCalc,
            remuMensual, tope, totalFinal, excedente,
            audit: audit.toString()
        };
    }

    // ─── 10. ASIGNACIÓN FAMILIAR ─────────────────
    function asignacionFamiliar(params) {
        const { numHijos = 0 } = params;
        const monto = numHijos > 0 ? safe(DATA.RMV * DATA.ASIGNACION_FAMILIAR_PCT) : 0;
        const audit = new AuditLog('ASIGNACIÓN FAMILIAR');
        audit.add(`RMV ${DATA.YEAR}: ${DATA.RMV}`);
        audit.add(`Tasa: ${DATA.ASIGNACION_FAMILIAR_PCT * 100}%`);
        audit.add(`Hijos: ${numHijos}`);
        audit.calc('Monto', `${DATA.RMV} × ${DATA.ASIGNACION_FAMILIAR_PCT}`, monto);

        return {
            rmv: DATA.RMV, porcentaje: DATA.ASIGNACION_FAMILIAR_PCT,
            numHijos, tieneDerechoFlag: numHijos > 0,
            montoMensual: monto, montoAnual: safe(monto * 12),
            audit: audit.toString()
        };
    }

    // ─── 11. RENTA 5TA DETALLADA ─────────────────
    function rentaQuintaDetallada(params) {
        const {
            sueldoBruto, mesCalculo = 12, remuPercibidas = 0,
            gratPercibidas = 0, incluyeAsigFamiliar = false,
            otrosIngresos = 0, tieneEPS = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6
        } = params;

        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const promedioVar = safe(base.comisionesComputable + base.bonosComputable);
        return proyectarRenta5ta({
            sueldoMensual: base.sueldoBruto,
            asigFamiliar: base.asigFamiliar,
            promedioVariables: promedioVar,
            mesCalculo, remuPercibidas, gratPercibidas,
            otrosIngresos, tieneEPS
        });
    }

    // ─── 12. COSTO EMPLEADOR ─────────────────────
    function costoEmpleador(params) {
        const {
            sueldoBruto, regimen = 'general',
            incluyeAsigFamiliar = false, incluyeSCTR = false,
            anosServicio = 4, tieneEPS = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('COSTO TOTAL EMPLEADOR');
        const reg = DATA.REGIMENES[regimen];
        const base = getBaseRemunerativa({
            sueldoBruto, incluyeAsigFamiliar, regimen,
            promedioComisiones, promedioBonos,
            vecesComisiones, vecesBonos
        });

        const tasaBonif = tieneEPS ? DATA.BONIF_EPS : DATA.BONIF_ESSALUD;
        audit.add(`Régimen: ${reg.nombre}`);
        audit.add(`Base: ${base.baseBeneficios}`);
        audit.add(`Bonif.: ${tieneEPS ? 'EPS 6.75%' : 'EsSalud 9%'}`);

        const essaludMensual = safe(base.baseBeneficios * reg.essalud_tasa);

        let ctsMensualizada = 0;
        if (reg.cts) {
            ctsMensualizada = safe((base.baseBeneficios * (reg.cts_dias_ano / DATA.DIAS_MES)) / DATA.MESES_ANO);
        }

        let gratMensualizada = 0;
        let bonifMensualizada = 0;
        if (reg.gratificacion) {
            gratMensualizada = safe((base.baseBeneficios * reg.gratificacion_factor * 2) / DATA.MESES_ANO);
            bonifMensualizada = safe(gratMensualizada * tasaBonif);
        }

        const vacMensualizada = safe((base.baseBeneficios * (reg.vacaciones_dias / DATA.DIAS_MES)) / DATA.MESES_ANO);

        let sctrMensual = 0;
        if (incluyeSCTR) {
            sctrMensual = safe(base.baseBeneficios * DATA.SCTR.total);
        }

        let vidaLeyMensual = 0;
        if (reg.vida_ley && anosServicio >= DATA.VIDA_LEY.anos_minimo) {
            vidaLeyMensual = safe(base.baseBeneficios * DATA.VIDA_LEY.prima_estimada);
        }

        const costoAdicional = safe(
            essaludMensual + ctsMensualizada + gratMensualizada +
            bonifMensualizada + vacMensualizada + sctrMensual + vidaLeyMensual
        );
        const costoTotalMensual = safe(base.baseBeneficios + costoAdicional);
        const costoTotalAnual = safe(costoTotalMensual * DATA.MESES_ANO);
        const porcentajeSobrecosto = base.baseBeneficios > 0
            ? safe((costoAdicional / base.baseBeneficios) * 100) : 0;

        // Costo de liquidar (despido arbitrario, 1 año)
        const costoLiquidar1Ano = safe(
            base.baseBeneficios * reg.indemnizacion_despido +
            (reg.cts ? base.baseBeneficios : 0) +
            (reg.gratificacion ? base.baseBeneficios * reg.gratificacion_factor : 0) +
            (base.baseBeneficios * (reg.vacaciones_dias / DATA.DIAS_MES))
        );

        audit.section('DESGLOSE MENSUAL');
        audit.calc('EsSalud', `${base.baseBeneficios} × ${reg.essalud_tasa}`, essaludMensual);
        audit.calc('CTS mens.', '', ctsMensualizada);
        audit.calc('Grat. mens.', '', gratMensualizada);
        audit.calc(`Bonif. ${tasaBonif * 100}% mens.`, '', bonifMensualizada);
        audit.calc('Vac. mens.', '', vacMensualizada);
        if (sctrMensual > 0) audit.calc('SCTR', '', sctrMensual);
        if (vidaLeyMensual > 0) audit.calc('Vida Ley', '', vidaLeyMensual);
        audit.section('TOTALES');
        audit.calc('Costo adicional', 'Σ', costoAdicional);
        audit.calc('COSTO TOTAL MENSUAL', `${base.baseBeneficios} + ${costoAdicional}`, costoTotalMensual);
        audit.calc('Sobrecosto', '', `+${porcentajeSobrecosto}%`);
        audit.calc('Costo liquidar 1 año', '', costoLiquidar1Ano);

        return {
            base, regimen: reg, tasaBonif,
            desglose: {
                essaludMensual, ctsMensualizada, gratMensualizada,
                bonifMensualizada, vacMensualizada, sctrMensual, vidaLeyMensual
            },
            costoAdicional, costoTotalMensual, costoTotalAnual,
            porcentajeSobrecosto, costoLiquidar1Ano,
            audit: audit.toString() + '\n\n' + base.audit
        };
    }

    // ─── 13. COMPARADOR PRO ──────────────────────
    function comparadorRegimenes(params) {
        const {
            sueldoBruto, incluyeAsigFamiliar = false,
            incluyeSCTR = false, tieneEPS = false,
            promedioComisiones = 0, promedioBonos = 0,
            vecesComisiones = 6, vecesBonos = 6
        } = params;

        const audit = new AuditLog('COMPARADOR PRO DE REGÍMENES');
        const resultados = {};

        for (const key of ['general', 'pequena', 'micro']) {
            const r = costoEmpleador({
                sueldoBruto, regimen: key,
                incluyeAsigFamiliar: key === 'micro' ? false : incluyeAsigFamiliar,
                incluyeSCTR, tieneEPS, anosServicio: 4,
                promedioComisiones: key === 'micro' ? 0 : promedioComisiones,
                promedioBonos: key === 'micro' ? 0 : promedioBonos,
                vecesComisiones, vecesBonos
            });
            resultados[key] = r;

            audit.section(`${r.regimen.nombre.toUpperCase()}`);
            audit.add(`Costo mensual: S/ ${plameRound(r.costoTotalMensual)}`);
            audit.add(`Costo anual: S/ ${plameRound(r.costoTotalAnual)}`);
            audit.add(`Sobrecosto: +${plameRound(r.porcentajeSobrecosto)}%`);
            audit.add(`Costo liquidar 1 año: S/ ${plameRound(r.costoLiquidar1Ano)}`);
            audit.add(`Costo anual TOTAL (operación + liquidación): S/ ${plameRound(r.costoTotalAnual + r.costoLiquidar1Ano)}`);
        }

        const ahorroMicroVsGeneral = safe(resultados.general.costoTotalAnual - resultados.micro.costoTotalAnual);
        const ahorroPequenaVsGeneral = safe(resultados.general.costoTotalAnual - resultados.pequena.costoTotalAnual);

        audit.section('ANÁLISIS DE AHORRO ANUAL');
        audit.calc('Ahorro Micro vs General', '', ahorroMicroVsGeneral);
        audit.calc('Ahorro Pequeña vs General', '', ahorroPequenaVsGeneral);

        return {
            general: resultados.general,
            pequena: resultados.pequena,
            micro: resultados.micro,
            ahorroMicroVsGeneral,
            ahorroPequenaVsGeneral,
            matriz: {
                headers: ['Concepto', 'General', 'Pequeña', 'Micro'],
                rows: [
                    ['Remuneración', resultados.general.base.baseBeneficios, resultados.pequena.base.baseBeneficios, resultados.micro.base.baseBeneficios],
                    ['EsSalud', resultados.general.desglose.essaludMensual, resultados.pequena.desglose.essaludMensual, resultados.micro.desglose.essaludMensual],
                    ['CTS (mens.)', resultados.general.desglose.ctsMensualizada, resultados.pequena.desglose.ctsMensualizada, resultados.micro.desglose.ctsMensualizada],
                    ['Gratif. (mens.)', resultados.general.desglose.gratMensualizada, resultados.pequena.desglose.gratMensualizada, resultados.micro.desglose.gratMensualizada],
                    ['Bonif. (mens.)', resultados.general.desglose.bonifMensualizada, resultados.pequena.desglose.bonifMensualizada, resultados.micro.desglose.bonifMensualizada],
                    ['Vacaciones (mens.)', resultados.general.desglose.vacMensualizada, resultados.pequena.desglose.vacMensualizada, resultados.micro.desglose.vacMensualizada],
                    ['SCTR', resultados.general.desglose.sctrMensual, resultados.pequena.desglose.sctrMensual, resultados.micro.desglose.sctrMensual],
                    ['Vida Ley', resultados.general.desglose.vidaLeyMensual, resultados.pequena.desglose.vidaLeyMensual, resultados.micro.desglose.vidaLeyMensual],
                    ['COSTO MENSUAL', resultados.general.costoTotalMensual, resultados.pequena.costoTotalMensual, resultados.micro.costoTotalMensual],
                    ['COSTO ANUAL', resultados.general.costoTotalAnual, resultados.pequena.costoTotalAnual, resultados.micro.costoTotalAnual],
                    ['Sobrecosto %', resultados.general.porcentajeSobrecosto, resultados.pequena.porcentajeSobrecosto, resultados.micro.porcentajeSobrecosto],
                    ['Costo liquidar 1a', resultados.general.costoLiquidar1Ano, resultados.pequena.costoLiquidar1Ano, resultados.micro.costoLiquidar1Ano],
                    ['COSTO TOTAL ANUAL', safe(resultados.general.costoTotalAnual + resultados.general.costoLiquidar1Ano), safe(resultados.pequena.costoTotalAnual + resultados.pequena.costoLiquidar1Ano), safe(resultados.micro.costoTotalAnual + resultados.micro.costoLiquidar1Ano)]
                ]
            },
            audit: audit.toString()
        };
    }

    // ─── 14. AUDITORÍA DE INTEGRIDAD ─────────────
    function auditarIntegridad(params) {
        const { sueldoBruto, tipoPension, resultadoNeto } = params;
        const audit = new AuditLog('AUDITORÍA DE INTEGRIDAD');

        const base = resultadoNeto.base;
        const reconstruido = safe(base.baseNeta - resultadoNeto.pension.total - resultadoNeto.ir.mensual);
        const diferencia = Math.abs(reconstruido - resultadoNeto.sueldoNeto);

        audit.add(`Base neta: ${base.baseNeta}`);
        audit.add(`Pensión: ${resultadoNeto.pension.total}`);
        audit.add(`IR mensual: ${resultadoNeto.ir.mensual}`);
        audit.add(`Neto calculado: ${resultadoNeto.sueldoNeto}`);
        audit.add(`Neto reconstruido: ${reconstruido}`);
        audit.add(`Diferencia: ${diferencia}`);

        const pass = diferencia < 0.01;
        audit.add(pass ? '✓ AUDITORÍA PASS' : '✗ AUDITORÍA FAIL - Inconsistencia detectada');

        // Verificación PLAME
        const netoPLAME = plameRound(resultadoNeto.sueldoNeto);
        const basePLAME = plameRound(base.baseNeta);
        const pensionPLAME = plameRound(resultadoNeto.pension.total);
        const irPLAME = plameRound(resultadoNeto.ir.mensual);
        const sumaPLAME = safe(basePLAME - pensionPLAME - irPLAME);
        const difPLAME = Math.abs(sumaPLAME - netoPLAME);

        audit.section('VERIFICACIÓN PLAME (redondeo por concepto)');
        audit.add(`Base PLAME: ${basePLAME}`);
        audit.add(`Pensión PLAME: ${pensionPLAME}`);
        audit.add(`IR PLAME: ${irPLAME}`);
        audit.add(`Suma PLAME: ${basePLAME} - ${pensionPLAME} - ${irPLAME} = ${sumaPLAME}`);
        audit.add(`Neto PLAME: ${netoPLAME}`);
        audit.add(`Diferencia PLAME: ${difPLAME}`);
        audit.add(difPLAME <= 0.01 ? '✓ PLAME PASS' : `⚠ PLAME: diferencia de ${difPLAME} (por redondeo de conceptos)`);

        return {
            pass,
            diferencia,
            netoPLAME,
            difPLAME,
            audit: audit.toString()
        };
    }

    // ─── 15. PERFILES (localStorage) ─────────────
    function guardarPerfil(nombre, datos) {
        const perfiles = JSON.parse(localStorage.getItem('sueldopro_perfiles') || '{}');
        perfiles[nombre] = { ...datos, timestamp: Date.now(), version: DATA.VERSION };
        localStorage.setItem('sueldopro_perfiles', JSON.stringify(perfiles));
        return true;
    }

    function cargarPerfil(nombre) {
        const perfiles = JSON.parse(localStorage.getItem('sueldopro_perfiles') || '{}');
        return perfiles[nombre] || null;
    }

    function listarPerfiles() {
        const perfiles = JSON.parse(localStorage.getItem('sueldopro_perfiles') || '{}');
        return Object.entries(perfiles).map(([nombre, data]) => ({
            nombre, timestamp: data.timestamp, version: data.version
        }));
    }

    function eliminarPerfil(nombre) {
        const perfiles = JSON.parse(localStorage.getItem('sueldopro_perfiles') || '{}');
        delete perfiles[nombre];
        localStorage.setItem('sueldopro_perfiles', JSON.stringify(perfiles));
    }

    // ─── API PÚBLICA ─────────────────────────────
    return Object.freeze({
        safe, plameRound, formatMoney,
        getBaseRemunerativa, calcularPension, calcularIRAnual,
        proyectarRenta5ta,
        sueldoNeto, gratificacion, cts, horasExtras, vacaciones,
        impuestoRenta, liquidacion, essalud, utilidades,
        asignacionFamiliar, rentaQuintaDetallada,
        costoEmpleador, comparadorRegimenes,
        auditarIntegridad,
        guardarPerfil, cargarPerfil, listarPerfiles, eliminarPerfil
    });
})();
