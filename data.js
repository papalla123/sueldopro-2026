const jobs = Array.from({length: 50}, (_, i) => ({
    n: ["Ingeniero de IA", "Especialista ESG", "Arquitecto Cloud", "Analista de Datos", "Growth Hacker", "Médico Digital"][i % 6] + " Lvl " + (i + 1),
    min: 4500 + (i * 150),
    max: 10000 + (i * 300),
    i: ["🤖", "🌱", "☁️", "📊", "🚀", "🩺"][i % 6],
    d: "Rol estratégico para el desarrollo industrial y tecnológico en el ecosistema 2026.",
    l: `https://www.google.com/search?q=trabajo+${["ingeniero+ia", "especialista+esg", "arquitecto+cloud"][i%3]}`
}));

const currencies = [
    {id:"USD", n:"Dólar", p:3.75, h:[3.7,3.75,3.74,3.76,3.75,3.75,3.75]},
    {id:"EUR", n:"Euro", p:4.10, h:[4.0,4.1,4.12,4.08,4.10,4.10,4.10]},
    {id:"GBP", n:"Libra", p:4.80, h:[4.7,4.8,4.85,4.78,4.80,4.80,4.80]},
    {id:"BTC", n:"Bitcoin", p:345000, h:[320000,345000,360000,345000,345000,345000,345000]}
];

const news = [
    {t:"Sueldo Mínimo 2026 sube a S/ 1,150", d:"El Ejecutivo confirmó el incremento para el segundo trimestre del año fiscal.", f:"Gestión", l:"https://gestion.pe"},
    {t:"UIT 2026 se fija en S/ 5,500", d:"Nuevo valor impactará en multas y escala de impuestos de 5ta categoría.", f:"El Peruano", l:"https://elperuano.pe"},
    {t:"Exportaciones marcan récord", d:"La minería y agroindustria lideran el crecimiento del PBI nacional.", f:"RPP", l:"https://rpp.pe"},
    {t:"IA en el trabajo: Nueva Ley", d:"Se reglamenta el uso de herramientas de IA en procesos de selección laboral.", f:"El Comercio", l:"https://elcomercio.pe"}
];