// GENERADOR DE EMPLEOS (250 ÚNICOS)
const sectors = ["Minería", "Fintech", "IA", "Salud", "Energía", "Construcción", "Legal", "E-commerce", "Agro", "Ciberseguridad", "Gaming", "Logística", "Educación", "Moda", "Turismo", "Banca", "Pharma", "Automotriz", "Media", "Foodtech", "Real Estate", "Bio", "Space", "Crypto", "Venture"];
const levels = ["Director", "Gerente", "Head of", "Lead", "Senior", "Especialista", "Analista", "Consultor", "Arquitecto", "Manager"];

const jobs = Array.from({length: 250}, (_, i) => {
    const s = sectors[i % sectors.length];
    const l = levels[Math.floor(i / sectors.length) % levels.length];
    return {
        n: `${l} en ${s} #${i+1}`,
        min: 4500 + (i * 50),
        max: 9000 + (i * 120),
        i: ["🚀", "💡", "🛡️", "🧬", "🏗️", "⚖️", "💎", "🤖", "🌿", "🛰️"][i % 10],
        d: `Responsable de la estrategia y ejecución operativa en el sector ${s} para el mercado 2026.`,
        l: "https://www.linkedin.com/jobs"
    };
});

// GENERADOR DE DIVISAS (100 ÚNICAS)
const currencies = Array.from({length: 100}, (_, i) => {
    const codes = ["USD", "EUR", "GBP", "JPY", "CNY", "BRL", "MXN", "CAD", "AUD", "CHF"];
    return {
        id: i < 10 ? codes[i] : `CUR-${i}`,
        n: i < 10 ? `Moneda Principal ${codes[i]}` : `Activo Global ${i}`,
        p: (Math.random() * (4.5 - 0.5) + 0.5).toFixed(3),
        h: Array.from({length: 7}, () => (Math.random() * 5))
    };
});

// GENERADOR DE NOTICIAS (50 ÚNICAS)
const news = Array.from({length: 50}, (_, i) => ({
    t: `Impacto Económico 2026: Análisis #${i+1}`,
    d: "Las nuevas normativas de la SUNAT y el ajuste de la UIT a S/ 5,500 cambian el panorama salarial.",
    f: ["Gestión", "Bloomberg", "Forbes", "Reuters"][i % 4],
    l: "https://gestion.pe"
}));