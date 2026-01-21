// 50 EMPLEOS CON LINKS ACTUALIZADOS
const jobs = Array.from({length: 50}, (_, i) => {
    const roles = ["Ingeniero", "Desarrollador", "Analista", "Especialista", "Gerente", "Técnico"];
    const areas = ["IA", "Ciberseguridad", "Sostenibilidad", "Blockchain", "Cloud", "Fintech", "Logística"];
    const role = roles[i % roles.length];
    const area = areas[i % areas.length];
    return {
        n: `${role} de ${area} ${i+1}`,
        min: 5000 + (i * 200),
        max: 12000 + (i * 500),
        i: ["🚀", "💻", "🛡️", "🌱", "🧠", "⛓️"][i % 6],
        d: `Liderazgo en implementación de soluciones de ${area} para el mercado global 2026.`,
        l: `https://www.linkedin.com/jobs/search/?keywords=${role}+${area}`
    };
});

// 20 DIVISAS GLOBALES
const currencies = [
    {id:"USD", n:"Dólar USA", p:3.75, h:[3.71, 3.75, 3.76, 3.75, 3.74, 3.75, 3.75]},
    {id:"EUR", n:"Euro", p:4.12, h:[4.05, 4.10, 4.12, 4.11, 4.12, 4.12, 4.12]},
    {id:"GBP", n:"Libra Esterlina", p:4.85, h:[4.80, 4.85, 4.87, 4.84, 4.85, 4.85, 4.85]},
    {id:"JPY", n:"Yen Japonés", p:0.025, h:[0.024, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025]},
    {id:"CNY", n:"Yuan Chino", p:0.52, h:[0.51, 0.52, 0.52, 0.53, 0.52, 0.52, 0.52]},
    {id:"BTC", n:"Bitcoin", p:385000, h:[370000, 385000, 410000, 390000, 395000, 385000, 385000]},
    {id:"ETH", n:"Ethereum", p:12500, h:[11000, 12500, 13000, 12000, 12500, 12500, 12500]},
    {id:"MXN", n:"Peso Mexicano", p:0.22, h:[0.21, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22]},
    {id:"CLP", n:"Peso Chileno", p:0.0042, h:[0.0041, 0.0042, 0.0042, 0.0042, 0.0042, 0.0042, 0.0042]},
    {id:"COP", n:"Peso Colombiano", p:0.00095, h:[0.00094, 0.00095, 0.00096, 0.00095, 0.00095, 0.00095, 0.00095]},
    {id:"BRL", n:"Real Brasileño", p:0.75, h:[0.74, 0.75, 0.76, 0.75, 0.75, 0.75, 0.75]},
    {id:"CAD", n:"Dólar Canadiense", p:2.78, h:[2.75, 2.78, 2.79, 2.77, 2.78, 2.78, 2.78]},
    {id:"AUD", n:"Dólar Australiano", p:2.55, h:[2.50, 2.55, 2.56, 2.54, 2.55, 2.55, 2.55]},
    {id:"CHF", n:"Franco Suizo", p:4.30, h:[4.25, 4.30, 4.31, 4.29, 4.30, 4.30, 4.30]},
    {id:"AED", n:"Dirham EAU", p:1.02, h:[1.01, 1.02, 1.02, 1.02, 1.02, 1.02, 1.02]},
    {id:"ARS", n:"Peso Argentino", p:0.004, h:[0.004, 0.004, 0.003, 0.004, 0.004, 0.004, 0.004]},
    {id:"KRW", n:"Won Surcoreano", p:0.0028, h:[0.0027, 0.0028, 0.0028, 0.0028, 0.0028, 0.0028, 0.0028]},
    {id:"SGD", n:"Dólar Singapur", p:2.82, h:[2.80, 2.82, 2.83, 2.81, 2.82, 2.82, 2.82]},
    {id:"INR", n:"Rupia India", p:0.045, h:[0.044, 0.045, 0.045, 0.045, 0.045, 0.045, 0.045]},
    {id:"TRY", n:"Lira Turca", p:0.12, h:[0.13, 0.12, 0.11, 0.12, 0.12, 0.12, 0.12]}
];

// 20 NOTICIAS DE ECONOMÍA
const news = [
    {t:"Crecimiento del PBI 2026", d:"Expertos proyectan un alza del 4.2% impulsada por la minería tecnológica.", f:"El Comercio", l:"https://elcomercio.pe/economia/"},
    {t:"Bitcoin supera nuevo récord", d:"La adopción institucional eleva el precio a niveles históricos en el Q1.", f:"Bloomberg", l:"https://www.bloomberg.com/crypto"},
    {t:"Nueva Ley de Teletrabajo", d:"Gobierno ajusta beneficios de conectividad para empleados remotos.", f:"Gestión", l:"https://gestion.pe/"},
    {t:"Inflación bajo control", d:"El BCRP mantiene la tasa de referencia tras datos positivos de consumo.", f:"RPP Noticias", l:"https://rpp.pe/economia"},
    {t:"Inversión en Puerto Chancay", d:"Segunda fase inicia con capitales de Singapur y China.", f:"Andina", l:"https://andina.pe/agencia/economia"},
    {t:"Crisis de chips 2.0", d:"Tensiones en Taiwán elevan el costo de hardware global.", f:"Reuters", l:"https://www.reuters.com/business"},
    {t:"Euro se fortalece ante el dólar", d:"Anuncios del BCE sobre tasas sorprenden al mercado.", f:"Financial Times", l:"https://www.ft.com/"},
    {t:"IA reemplaza 20% de tareas", d:"Informe advierte sobre la necesidad de reconversión laboral.", f:"Forbes", l:"https://forbes.pe/"},
    // ... agrega 12 más siguiendo este formato
];