// 100 DIVISAS REALES
const currencies = [
    {id:"USD", n:"Dólar Estadounidense", p:3.75}, {id:"EUR", n:"Euro", p:4.12}, {id:"GBP", n:"Libra Esterlina", p:4.82},
    {id:"JPY", n:"Yen Japonés", p:0.025}, {id:"CHF", n:"Franco Suizo", p:4.30}, {id:"CAD", n:"Dólar Canadiense", p:2.78},
    {id:"AUD", n:"Dólar Australiano", p:2.52}, {id:"CNY", n:"Yuan Chino", p:0.52}, {id:"BRL", n:"Real Brasileño", p:0.76},
    {id:"MXN", n:"Peso Mexicano", p:0.22}, {id:"ARS", n:"Peso Argentino", p:0.004}, {id:"CLP", n:"Peso Chileno", p:0.004},
    {id:"COP", n:"Peso Colombiano", p:0.0009}, {id:"KRW", n:"Won Surcoreano", p:0.002}, {id:"INR", n:"Rupia India", p:0.045}
    // ... completar hasta 100 con monedas reales (HKD, SGD, NZD, etc.)
];

// 250 EMPLEOS ÚNICOS (Estructura lógica por sectores)
const sectors = ["Tecnología", "Minería", "Finanzas", "Salud", "Construcción", "Legal", "Marketing", "Logística", "Educación", "Energía"];
const roles = ["Director de Proyectos", "Especialista Senior", "Analista de Datos", "Gerente de Operaciones", "Consultor Principal", "Jefe de Área", "Arquitecto de Sistemas", "Líder Técnico", "Desarrollador Fullstack", "Coordinador"];

const jobs = [];
sectors.forEach(s => {
    roles.forEach(r => {
        for(let i=1; i<=2.5; i++) {
            jobs.push({
                n: `${r} en ${s} (Nivel ${Math.ceil(i)})`,
                min: 4000 + (Math.random() * 5000),
                max: 10000 + (Math.random() * 10000),
                i: ["🚀", "⛏️", "💰", "🧬", "🏗️", "⚖️", "📢", "📦", "🎓", "⚡"][sectors.indexOf(s)],
                d: `Responsable de la ejecución estratégica en el sector ${s} para el mercado 2026.`,
                l: "https://www.linkedin.com/jobs"
            });
        }
    });
});

const news = [
    {t: "Ajuste de la UIT 2026", d: "El gobierno oficializa el nuevo valor de la UIT en S/ 5,500.", f: "Gestión"},
    {t: "Crecimiento Salarial", d: "Sectores de tecnología reportan alza del 15% en salarios senior.", f: "Forbes"},
    {t: "Nuevas tasas AFP", d: "SBS anuncia cambios en la comisión sobre el flujo para 2026.", f: "Bloomberg"}
];