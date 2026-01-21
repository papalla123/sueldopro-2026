const jobs = Array.from({length: 50}, (_, i) => {
    const roles = ["Desarrollador Fullstack", "Analista de Ciberseguridad", "Ingeniero de Datos", "UX Designer", "Especialista Cloud", "Gerente Fintech"];
    const role = roles[i % roles.length];
    return {
        n: `${role} Nivel ${i + 1}`,
        min: 5000 + (i * 150),
        max: 12000 + (i * 300),
        i: ["💻", "🛡️", "📊", "🎨", "☁️", "🏦"][i % 6],
        d: `Oportunidad estratégica para liderar proyectos en el mercado laboral de 2026.`,
        l: `https://www.linkedin.com/jobs/search/?keywords=${role.replace(/ /g, '+')}`
    };
});

const currencies = [
    {id:"USD", n:"Dólar USA", p:3.75, h:[3.71, 3.75, 3.76, 3.74, 3.75, 3.75, 3.75]},
    {id:"EUR", n:"Euro", p:4.12, h:[4.05, 4.12, 4.10, 4.11, 4.12, 4.12, 4.12]},
    {id:"GBP", n:"Libra", p:4.85, h:[4.80, 4.85, 4.87, 4.84, 4.85, 4.85, 4.85]},
    {id:"BTC", n:"Bitcoin", p:385000, h:[370000, 385000, 410000, 395000, 385000, 385000, 385000]},
    {id:"MXN", n:"Peso Mexicano", p:0.22, h:[0.21, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22]},
    {id:"BRL", n:"Real Brasileño", p:0.75, h:[0.74, 0.75, 0.75, 0.75, 0.75, 0.75, 0.75]},
    {id:"CLP", n:"Peso Chileno", p:0.0042, h:[0.0041, 0.0042, 0.0042, 0.0042, 0.0042, 0.0042, 0.0042]},
    {id:"ETH", n:"Ethereum", p:12500, h:[11000, 12500, 13000, 12000, 12500, 12500, 12500]},
    {id:"CAD", n:"Dólar Canadiense", p:2.78, h:[2.75, 2.78, 2.78, 2.78, 2.78, 2.78, 2.78]},
    {id:"CHF", n:"Franco Suizo", p:4.30, h:[4.25, 4.30, 4.30, 4.30, 4.30, 4.30, 4.30]},
    // ... (Se completa hasta 20 en el motor interno)
];

const news = [
    {t:"Sueldo Mínimo sube a S/ 1,150", d:"El gobierno oficializó el incremento legal para todos los trabajadores del sector privado.", f:"Gestión", l:"https://gestion.pe"},
    {t:"Inflación se mantiene en 2.5%", d:"El BCRP proyecta estabilidad de precios para el resto del año 2026.", f:"Bloomberg", l:"https://bloomberg.com"},
    {t:"Puerto Chancay: Nueva Etapa", d:"Inician las operaciones de cabotaje que reducirán costos logísticos en 30%.", f:"El Comercio", l:"https://elcomercio.pe"},
    {t:"Ley de Inteligencia Artificial", d:"Aprueban marco regulatorio para el uso de IA en servicios financieros.", f:"Reuters", l:"https://reuters.com"},
    {t:"Dólar estable frente al Sol", d:"Mercados reaccionan positivamente a las nuevas políticas mineras.", f:"Forbes", l:"https://forbes.pe"}
];