// data.js - Base de Datos Global SueldoPro 2026

const i18n = {
    es: {
        m_neto: "Sueldo Neto", m_cuarta: "4ta Categoría", m_costo: "Costo Empresa", 
        m_vac: "Vacaciones", m_grati: "Gratificación", m_cts: "CTS", 
        m_liq: "Liquidación", m_radar: "Radar 1000", m_news: "Noticias 2026",
        g_neto_t: "📖 Guía Maestra: Cálculo de Sueldo Neto 2026",
        g_neto_txt: "El sueldo neto se obtiene tras descontar los aportes previsionales (AFP 11.8% aprox. o ONP 13%) del sueldo bruto. En 2026, la UIT se sitúa en S/ 5,500, lo que afecta los tramos del Impuesto a la Renta de 5ta categoría. Si ganas más de 7 UIT anuales, aplicamos la retención escalonada del 8%, 14%, 17%, 20% y 30%.",
        // (Añadir aquí el resto de guías detalladas)
    },
    en: {
        m_neto: "Net Salary", m_cuarta: "Freelance", m_costo: "Employer Cost", 
        m_vac: "Vacations", m_grati: "Bonuses", m_cts: "Severance", 
        m_liq: "Settlement", m_radar: "Job Radar", m_news: "2026 News",
        g_neto_t: "📖 Master Guide: Net Salary Calculation 2026",
        g_neto_txt: "Net salary is calculated after deducting pension contributions (AFP ~11.8% or ONP 13%) from the gross salary. In 2026, income tax brackets are adjusted based on the new UIT value...",
    }
};

// MUESTRA DE OFICIOS (Estructura para 1000)
const jobs = [
    {n:"Arquitecto de IA", min:15000, max:35000, i:"🤖", d:"Especialista en despliegue de modelos LLM corporativos.", l:"https://www.linkedin.com/jobs/search/?keywords=AI+Architect"},
    {n:"Ingeniero de Prompts", min:8000, max:20000, i:"✍️", d:"Optimización de comunicación con modelos de lenguaje.", l:"https://www.indeed.com"},
    {n:"Médico de Telemedicina", min:7000, max:15000, i:"🩺", d:"Atención clínica remota con diagnóstico por IA.", l:"https://www.computrabajo.com.pe"},
    {n:"Analista de Ciberseguridad", min:9000, max:22000, i:"🛡️", d:"Protección de activos digitales y respuesta a incidentes.", l:"https://www.glassdoor.com"},
    {n:"Desarrollador Fullstack", min:6000, max:18000, i:"💻", d:"Creador de aplicaciones web de extremo a extremo.", l:"https://github.com/jobs"},
    {n:"Gestor de Sostenibilidad (ESG)", min:5500, max:13000, i:"🌿", d:"Estratega de impacto ambiental y social corporativo.", l:"https://www.bumeran.com.pe"},
    {n:"Ingeniero de Energías Renovables", min:6500, max:16000, i:"☀️", d:"Diseño de sistemas solares y eólicos de gran escala.", l:"https://www.linkedin.com"},
    {n:"Especialista en Ética de IA", min:7500, max:19000, i:"⚖️", d:"Asegura que los algoritmos no tengan sesgos discriminatorios.", l:"https://www.google.com/search?q=jobs+ethics+ai"},
    // ... Agregaremos los 992 restantes en bloques
];

// MUESTRA DE NOTICIAS (Estructura para 60)
const news = [
    {t:"Nueva Ley de Teletrabajo Híbrido", s:"MTPE", c:"Regulación de costos de energía y conectividad para empleados.", f:"https://elperuano.pe"},
    {t:"Aumento de la RMV a S/ 1,150", s:"Gobierno", c:"El sueldo mínimo vital sube tras acuerdo nacional.", f:"https://www.gob.pe"},
    // ... Agregaremos las 58 restantes
];

// DIVISAS REAL-TIME (Simulado para Gráfica)
const exchangeRates = {
    "USD/PEN": 3.75, "EUR/PEN": 4.10, "GBP/PEN": 4.85, "BTC/USD": 95000, "ETH/USD": 4500
};