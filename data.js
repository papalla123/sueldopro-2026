// ===============================
// SUELDOPRO ULTRA – CORE ENGINE 2026
// ===============================

export const UIT = 5150;
export const RMV = 1075;

// Utilidades precisión centavos
const round = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

// ===============================
// AFP TABLA REFERENCIAL 2026
// ===============================
export const AFP = {
    habitat: { comision: 0.0127, sis: 0.0174 },
    integra: { comision: 0.0129, sis: 0.0174 },
    prima: { comision: 0.0135, sis: 0.0174 },
    profuturo: { comision: 0.0132, sis: 0.0174 }
};

// ===============================
// RENTA QUINTA CATEGORÍA 2026
// ===============================
function calcularQuinta(ingresoMensual) {
    const ingresoAnual = ingresoMensual * 14; // incluye gratificaciones
    const rentaNeta = ingresoAnual - (7 * UIT);

    if (rentaNeta <= 0) return 0;

    const tramos = [
        { limite: 5 * UIT, tasa: 0.08 },
        { limite: 20 * UIT, tasa: 0.14 },
        { limite: 35 * UIT, tasa: 0.17 },
        { limite: 45 * UIT, tasa: 0.20 },
        { limite: Infinity, tasa: 0.30 }
    ];

    let restante = rentaNeta;
    let impuesto = 0;

    for (let tramo of tramos) {
        const base = Math.min(restante, tramo.limite);
        impuesto += base * tramo.tasa;
        restante -= base;
        if (restante <= 0) break;
    }

    return round(impuesto / 12);
}

// ===============================
// CALCULADORAS
// ===============================
export const CALCULATORS = {

    horasExtras: {
        title: "Horas Extras",
        calculate: ({ sueldo, asignacionFamiliar, horas }) => {
            const base = (sueldo + asignacionFamiliar) / 240;
            const h1 = Math.min(horas, 2);
            const h2 = Math.max(horas - 2, 0);

            const pago = (h1 * base * 1.25) + (h2 * base * 1.35);

            return {
                total: round(pago),
                details: [
                    ["Valor hora base", round(base)],
                    ["Horas 25%", round(h1 * base * 1.25)],
                    ["Horas 35%", round(h2 * base * 1.35)]
                ]
            };
        },
        legalInfo: `Las horas extras en Perú se regulan por el TUO de la Ley de Jornada de Trabajo...`
    },

    sueldoNeto: {
        title: "Sueldo Neto",
        calculate: ({ sueldo, asignacionFamiliar, sistema, afp }) => {
            const bruto = sueldo + asignacionFamiliar;

            let descuentos = 0;
            let detail = [];

            if (sistema === "AFP") {
                const { comision, sis } = AFP[afp];
                const aporte = bruto * 0.10;
                const com = bruto * comision;
                const seguro = bruto * sis;

                descuentos = aporte + com + seguro;

                detail.push(["Aporte Obligatorio 10%", round(aporte)]);
                detail.push(["Comisión AFP", round(com)]);
                detail.push(["Prima SIS", round(seguro)]);
            } else {
                const onp = bruto * 0.13;
                descuentos = onp;
                detail.push(["Aporte ONP 13%", round(onp)]);
            }

            const quinta = calcularQuinta(bruto);
            descuentos += quinta;

            detail.push(["Renta Quinta Categoría", quinta]);

            return {
                total: round(bruto - descuentos),
                details: detail
            };
        },
        legalInfo: `El cálculo del sueldo neto considera los aportes obligatorios...`
    },

    gratificacion: {
        title: "Gratificación Trunca",
        calculate: ({ sueldo, asignacionFamiliar, meses, dias, eps }) => {
            const base = sueldo + asignacionFamiliar;
            const tiempo = (meses + dias / 30) / 6;

            const grati = base * tiempo;
            const bonif = grati * (eps ? 0.0675 : 0.09);

            return {
                total: round(grati + bonif),
                details: [
                    ["Gratificación proporcional", round(grati)],
                    ["Bonificación Extraordinaria", round(bonif)]
                ]
            };
        },
        legalInfo: `Regulada por Ley 27735 y Ley 29351...`
    },

    cts: {
        title: "CTS",
        calculate: ({ sueldo, asignacionFamiliar, sextoGrati }) => {
            const base = sueldo + asignacionFamiliar + sextoGrati;
            const cts = base / 12;

            return {
                total: round(cts),
                details: [
                    ["Base computable CTS", round(base)],
                    ["CTS del periodo", round(cts)]
                ]
            };
        },
        legalInfo: `La CTS se calcula según el D. Leg. 650...`
    },

    liquidacion: {
        title: "Liquidación",
        calculate: ({ sueldo, asignacionFamiliar, meses, dias, regimen }) => {
            const base = sueldo + asignacionFamiliar;
            const tiempo = meses + dias / 30;

            const grati = (base / 6) * tiempo / 6;
            const cts = (base / 12) * tiempo / 12;

            const diasVac = regimen === "mype" ? 15 : 30;
            const vac = (base / 30) * (diasVac / 12) * tiempo;

            return {
                total: round(grati + cts + vac),
                details: [
                    ["Gratificación trunca", round(grati)],
                    ["CTS trunca", round(cts)],
                    ["Vacaciones truncas", round(vac)]
                ]
            };
        },
        legalInfo: `La liquidación de beneficios sociales integra CTS...`
    }

};
