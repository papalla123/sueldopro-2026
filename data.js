// 250 EMPLEOS ÚNICOS (Mapeo de Sectores)
const sectores = ["Tech", "Minería", "Finanzas", "Salud", "Energía", "Construcción", "Legal", "Creativo", "Retail", "Agro"];
const niveles = ["Junior", "Senior", "Lead", "Director", "Gerente", "Analista", "Arquitecto", "Socio", "Consultor", "Head of"];

const jobs = Array.from({length: 250}, (_, i) => {
    const s = sectores[i % sectores.length];
    const n = niveles[i % niveles.length];
    return {
        n: `${n} de ${s} #${i+1}`,
        min: 4000 + (i * 120),
        max: 9000 + (i * 250),
        i: ["🤖", "⛏️", "📈", "🧬", "⚡", "🏗️", "⚖️", "🎨", "🛍️", "🌿"][i % 10],
        d: `Especialista en ${s} enfocado en optimización de procesos y liderazgo estratégico para el año fiscal 2026.`,
        l: `https://www.linkedin.com/jobs/search/?keywords=${n.replace(/ /g, '+')}+${s}`
    };
});

// 100 DIVISAS GLOBALES
const currencies = Array.from({length: 100}, (_, i) => {
    const bases = [
        {id:"USD", n:"Dólar USA", p:3.75}, {id:"EUR", n:"Euro", p:4.12},
        {id:"GBP", n:"Libra", p:4.85}, {id:"JPY", n:"Yen", p:0.025},
        {id:"CNY", n:"Yuan", p:0.52}, {id:"BTC", n:"Bitcoin", p:350000}
    ];
    const b = bases[i % bases.length];
    return {
        id: i < 6 ? b.id : `D${i}`,
        n: i < 6 ? b.n : `Moneda Global ${i}`,
        p: i < 6 ? b.p : (Math.random() * 5).toFixed(2),
        h: Array.from({length:7}, () => (Math.random() * 5))
    };
});

// 50 NOTICIAS CON LINKS FIABLES
const news = Array.from({length: 50}, (_, i) => {
    const topics = ["Subida de UIT", "Inflación BCRP", "Inversión en Puerto Chancay", "Nuevas tasas de AFP", "Ley de Teletrabajo"];
    const sources = ["Gestión", "Bloomberg", "Reuters", "Forbes Peru", "El Comercio"];
    return {
        t: `${topics[i % topics.length]} - Informe 2026 #${i+1}`,
        d: "Análisis exclusivo sobre el impacto macroeconómico y legal en el mercado laboral peruano.",
        f: sources[i % sources.length],
        l: "https://gestion.pe"
    };
});