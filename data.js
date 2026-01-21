const jobs = Array.from({length: 50}, (_, i) => {
    const roles = ["Software Architect", "AI Engineer", "Product Manager", "Data Scientist", "Cybersecurity Expert", "Blockchain Lead"];
    const role = roles[i % roles.length];
    return {
        n: `${role} ${i + 1}`,
        min: 6000 + (i * 200),
        max: 15000 + (i * 400),
        i: ["🚀", "🤖", "💼", "📊", "🛡️", "🔗"][i % 6],
        d: "Lidera la transformación digital en el mercado peruano 2026. Beneficios de ley incluidos.",
        l: `https://www.linkedin.com/jobs/search/?keywords=${role.replace(/ /g, '+')}`
    };
});

const currencies = [
    {id:"USD", n:"Dólar Americano", p:3.78, h:[3.7, 3.75, 3.8, 3.78, 3.78, 3.78, 3.78]},
    {id:"EUR", n:"Euro", p:4.15, h:[4.1, 4.12, 4.18, 4.15, 4.15, 4.15, 4.15]},
    {id:"GBP", n:"Libra Esterlina", p:4.90, h:[4.8, 4.85, 4.95, 4.90, 4.90, 4.90, 4.90]},
    {id:"BTC", n:"Bitcoin", p:385000, h:[360000, 375000, 400000, 385000, 385000, 385000, 385000]},
    {id:"MXN", n:"Peso Mexicano", p:0.22, h:[0.2, 0.21, 0.23, 0.22, 0.22, 0.22, 0.22]},
    {id:"BRL", n:"Real Brasileño", p:0.78, h:[0.75, 0.77, 0.8, 0.78, 0.78, 0.78, 0.78]},
    {id:"CLP", n:"Peso Chileno", p:0.0042, h:[0.004, 0.0041, 0.0043, 0.0042, 0.0042, 0.0042, 0.0042]},
    {id:"ARS", n:"Peso Argentino", p:0.004, h:[0.003, 0.0035, 0.0045, 0.004, 0.004, 0.004, 0.004]}
];

const news = [
    {t:"UIT 2026: S/ 5,500 oficial", d:"El Ministerio de Economía confirmó el nuevo valor para el cálculo de impuestos y multas.", f:"Gestión", l:"#"},
    {t:"Nuevo Salario Mínimo en Debate", d:"Sindicatos y empresas negocian ajuste para el segundo semestre del 2026.", f:"Bloomberg", l:"#"},
    {t:"Boom de IA en el Sector Público", d:"Gobierno digital anuncia inversión millonaria para automatización de servicios.", f:"Reuters", l:"#"},
    {t:"Dólar rompe tendencia a la baja", d:"Analistas proyectan estabilidad gracias a los precios internacionales del cobre.", f:"El Comercio", l:"#"}
];