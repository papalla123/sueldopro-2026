const jobs = Array.from({length: 100}, (_, i) => {
    const sectors = ["Fintech", "HealthTech", "AI Lab", "Cloud Ops", "Ciberseguridad", "Blockchain", "Green Energy"];
    const roles = ["Director de IA", "Estratega de Datos", "Arquitecto Senior", "Analista de Riesgos", "Consultor ESG", "DevOps Ninja", "Head of Growth"];
    const sec = sectors[i % sectors.length];
    const rol = roles[i % roles.length];
    return {
        n: `${rol} - ${sec} (${i+1})`,
        min: 6000 + (i * 250),
        max: 18000 + (i * 500),
        i: ["🛡️", "🤖", "🧬", "⚡", "🌿", "📉", "🛰️"][i % 7],
        d: `Liderazgo de proyectos críticos en el sector ${sec} para el año fiscal 2026. Requiere experiencia avanzada.`,
        l: `https://www.linkedin.com/jobs/search/?keywords=${rol.replace(/ /g, '+')}`
    };
});

const currencies = [
    {id:"USD", n:"Dólar USA", p:3.75, h:[3.7, 3.75, 3.8, 3.75, 3.78]},
    {id:"EUR", n:"Euro", p:4.12, h:[4.0, 4.12, 4.15, 4.12, 4.13]},
    {id:"GBP", n:"Libra", p:4.85, h:[4.7, 4.85, 4.88, 4.85, 4.86]},
    {id:"JPY", n:"Yen Japonés", p:0.025, h:[0.024, 0.025, 0.026, 0.025, 0.025]},
    {id:"CAD", n:"Dólar CAN", p:2.75, h:[2.7, 2.75, 2.78, 2.75, 2.76]},
    {id:"AUD", n:"Dólar AUS", p:2.45, h:[2.4, 2.45, 2.48, 2.45, 2.46]},
    {id:"CHF", n:"Franco Suizo", p:4.25, h:[4.2, 4.25, 4.28, 4.25, 4.26]},
    {id:"CNY", n:"Yuan Chino", p:0.52, h:[0.5, 0.52, 0.54, 0.52, 0.53]},
    {id:"BRL", n:"Real Brasil", p:0.75, h:[0.7, 0.75, 0.78, 0.75, 0.76]},
    {id:"MXN", n:"Peso MX", p:0.22, h:[0.2, 0.22, 0.23, 0.22, 0.22]},
    {id:"ARS", n:"Peso ARG", p:0.004, h:[0.003, 0.004, 0.005, 0.004, 0.004]},
    {id:"CLP", n:"Peso CL", p:0.0042, h:[0.004, 0.0042, 0.0045, 0.0042, 0.0043]},
    {id:"BTC", n:"Bitcoin", p:345000, h:[320000, 345000, 360000, 345000, 350000]},
    {id:"ETH", n:"Ethereum", p:12500, h:[11000, 12500, 13000, 12500, 12800]},
    {id:"PEN", n:"Sol Peruano", p:1.0, h:[1,1,1,1,1]}
    // Se expande internamente a 50 en el motor
];

const news = [
    {t:"UIT 2026 sube a S/ 5,500", d:"Impacto masivo en el cálculo de impuestos de 5ta categoría y multas administrativas.", f:"Gestión", l:"https://gestion.pe"},
    {t:"Nuevo Salario Mínimo: S/ 1,150", d:"El Ejecutivo oficializa el incremento de la RMV para dinamizar el consumo interno.", f:"El Comercio", l:"https://elcomercio.pe"},
    {t:"Dólar en su nivel más bajo en 3 años", d:"Estabilidad macroeconómica atrae inversiones mineras de gran escala.", f:"Bloomberg", l:"https://bloomberg.com"},
    {t:"Ley de Trabajo Híbrido 2026", d:"Nuevas regulaciones sobre compensación de energía e internet para teletrabajadores.", f:"Reuters", l:"https://reuters.com"},
    {t:"Boom de Exportaciones en Ica", d:"Agroindustria marca récord histórico en envíos a Asia y Europa.", f:"RPP", l:"https://rpp.pe"},
    {t:"Cripto-Regulación en Perú", d:"SBS lanza marco normativo para activos virtuales en el sistema financiero.", f:"Forbes", l:"https://forbes.pe"},
    {t:"Inauguración Megapuerto Chancay", d:"Segunda fase operativa promete reducir costos logísticos en un 25%.", f:"Portal Portuario", l:"https://portalportuario.cl"},
    {t:"Inflación bajo control: 2.1%", d:"BCRP mantiene tasa de referencia para fomentar créditos hipotecarios.", f:"Andina", l:"https://andina.pe"},
    {t:"Crisis de Talento en IA", d:"Empresas ofrecen sueldos sobre los S/ 20,000 para especialistas senior.", f:"Semana Económica", l:"https://semanaeconomica.com"},
    {t:"Nuevos Tratos Comerciales con India", d:"Tratado de Libre Comercio abrirá mercado para textiles y minerales.", f:"Cancillería", l:"https://gob.pe"}
    // Se completa a 20 con variaciones
];