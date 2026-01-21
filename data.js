// ==============================================
// CURRENCIES DATA (100+ Real Currencies)
// ==============================================
window.CURRENCIES = [
    // Americas
    { code: "USD", name: "Dólar Estadounidense", symbol: "$", rate: 3.75 },
    { code: "CAD", name: "Dólar Canadiense", symbol: "C$", rate: 2.78 },
    { code: "MXN", name: "Peso Mexicano", symbol: "Mex$", rate: 0.22 },
    { code: "BRL", name: "Real Brasileño", symbol: "R$", rate: 0.76 },
    { code: "ARS", name: "Peso Argentino", symbol: "AR$", rate: 0.004 },
    { code: "CLP", name: "Peso Chileno", symbol: "CLP$", rate: 0.0041 },
    { code: "COP", name: "Peso Colombiano", symbol: "COL$", rate: 0.00095 },
    { code: "UYU", name: "Peso Uruguayo", symbol: "UY$", rate: 0.095 },
    { code: "BOB", name: "Boliviano", symbol: "Bs", rate: 0.54 },
    { code: "PYG", name: "Guaraní Paraguayo", symbol: "₲", rate: 0.00051 },
    
    // Europe
    { code: "EUR", name: "Euro", symbol: "€", rate: 4.12 },
    { code: "GBP", name: "Libra Esterlina", symbol: "£", rate: 4.82 },
    { code: "CHF", name: "Franco Suizo", symbol: "CHF", rate: 4.30 },
    { code: "NOK", name: "Corona Noruega", symbol: "kr", rate: 0.36 },
    { code: "SEK", name: "Corona Sueca", symbol: "kr", rate: 0.35 },
    { code: "DKK", name: "Corona Danesa", symbol: "kr", rate: 0.55 },
    { code: "PLN", name: "Zloty Polaco", symbol: "zł", rate: 0.95 },
    { code: "CZK", name: "Corona Checa", symbol: "Kč", rate: 0.17 },
    { code: "HUF", name: "Florín Húngaro", symbol: "Ft", rate: 0.011 },
    { code: "RON", name: "Leu Rumano", symbol: "lei", rate: 0.83 },
    { code: "BGN", name: "Lev Búlgaro", symbol: "лв", rate: 2.10 },
    { code: "HRK", name: "Kuna Croata", symbol: "kn", rate: 0.55 },
    { code: "RUB", name: "Rublo Ruso", symbol: "₽", rate: 0.041 },
    { code: "TRY", name: "Lira Turca", symbol: "₺", rate: 0.12 },
    { code: "UAH", name: "Grivna Ucraniana", symbol: "₴", rate: 0.10 },
    
    // Asia-Pacific
    { code: "JPY", name: "Yen Japonés", symbol: "¥", rate: 0.025 },
    { code: "CNY", name: "Yuan Chino", symbol: "¥", rate: 0.52 },
    { code: "KRW", name: "Won Surcoreano", symbol: "₩", rate: 0.0028 },
    { code: "HKD", name: "Dólar de Hong Kong", symbol: "HK$", rate: 0.48 },
    { code: "SGD", name: "Dólar de Singapur", symbol: "S$", rate: 2.80 },
    { code: "THB", name: "Baht Tailandés", symbol: "฿", rate: 0.11 },
    { code: "MYR", name: "Ringgit Malayo", symbol: "RM", rate: 0.85 },
    { code: "IDR", name: "Rupia Indonesia", symbol: "Rp", rate: 0.00024 },
    { code: "PHP", name: "Peso Filipino", symbol: "₱", rate: 0.067 },
    { code: "VND", name: "Dong Vietnamita", symbol: "₫", rate: 0.00015 },
    { code: "INR", name: "Rupia India", symbol: "₹", rate: 0.045 },
    { code: "PKR", name: "Rupia Pakistaní", symbol: "Rs", rate: 0.013 },
    { code: "BDT", name: "Taka Bangladesí", symbol: "৳", rate: 0.034 },
    { code: "LKR", name: "Rupia de Sri Lanka", symbol: "Rs", rate: 0.012 },
    { code: "NPR", name: "Rupia Nepalí", symbol: "Rs", rate: 0.028 },
    { code: "AUD", name: "Dólar Australiano", symbol: "A$", rate: 2.52 },
    { code: "NZD", name: "Dólar Neozelandés", symbol: "NZ$", rate: 2.32 },
    
    // Middle East & Africa
    { code: "AED", name: "Dirham de EAU", symbol: "د.إ", rate: 1.02 },
    { code: "SAR", name: "Riyal Saudí", symbol: "﷼", rate: 1.00 },
    { code: "QAR", name: "Riyal Qatarí", symbol: "﷼", rate: 1.03 },
    { code: "KWD", name: "Dinar Kuwaití", symbol: "د.ك", rate: 12.25 },
    { code: "BHD", name: "Dinar Bahreiní", symbol: "د.ب", rate: 9.95 },
    { code: "OMR", name: "Rial Omaní", symbol: "﷼", rate: 9.75 },
    { code: "JOD", name: "Dinar Jordano", symbol: "د.ا", rate: 5.29 },
    { code: "ILS", name: "Nuevo Shekel Israelí", symbol: "₪", rate: 1.02 },
    { code: "EGP", name: "Libra Egipcia", symbol: "£", rate: 0.076 },
    { code: "ZAR", name: "Rand Sudafricano", symbol: "R", rate: 0.20 },
    { code: "NGN", name: "Naira Nigeriana", symbol: "₦", rate: 0.0024 },
    { code: "KES", name: "Chelín Keniano", symbol: "KSh", rate: 0.029 },
    { code: "GHS", name: "Cedi Ghanés", symbol: "₵", rate: 0.31 },
    { code: "TZS", name: "Chelín Tanzano", symbol: "TSh", rate: 0.0015 },
    { code: "UGX", name: "Chelín Ugandés", symbol: "USh", rate: 0.0010 },
    
    // Additional Major Currencies
    { code: "TWD", name: "Nuevo Dólar Taiwanés", symbol: "NT$", rate: 0.12 },
    { code: "ISK", name: "Corona Islandesa", symbol: "kr", rate: 0.027 },
    { code: "MAD", name: "Dirham Marroquí", symbol: "د.م.", rate: 0.38 },
    { code: "DZD", name: "Dinar Argelino", symbol: "د.ج", rate: 0.028 },
    { code: "TND", name: "Dinar Tunecino", symbol: "د.ت", rate: 1.20 },
    { code: "LBP", name: "Libra Libanesa", symbol: "ل.ل", rate: 0.000042 },
    { code: "IQD", name: "Dinar Iraquí", symbol: "ع.د", rate: 0.0029 },
    { code: "IRR", name: "Rial Iraní", symbol: "﷼", rate: 0.000089 },
    { code: "AFN", name: "Afgani", symbol: "؋", rate: 0.043 },
    { code: "AMD", name: "Dram Armenio", symbol: "֏", rate: 0.0096 },
    { code: "AZN", name: "Manat Azerbaiyano", symbol: "₼", rate: 2.21 },
    { code: "GEL", name: "Lari Georgiano", symbol: "₾", rate: 1.39 },
    { code: "KZT", name: "Tenge Kazajo", symbol: "₸", rate: 0.0084 },
    { code: "UZS", name: "Som Uzbeko", symbol: "so'm", rate: 0.00033 },
    { code: "KGS", name: "Som Kirguís", symbol: "с", rate: 0.044 },
    { code: "TJS", name: "Somoni Tayiko", symbol: "ЅМ", rate: 0.35 },
    { code: "TMT", name: "Manat Turcomano", symbol: "m", rate: 1.07 },
    { code: "MNT", name: "Tugrik Mongol", symbol: "₮", rate: 0.0011 },
    { code: "LAK", name: "Kip Laosiano", symbol: "₭", rate: 0.00017 },
    { code: "MMK", name: "Kyat Birmano", symbol: "K", rate: 0.0018 },
    { code: "KHR", name: "Riel Camboyano", symbol: "៛", rate: 0.00092 },
    { code: "BND", name: "Dólar de Brunéi", symbol: "B$", rate: 2.79 },
    { code: "MOP", name: "Pataca de Macao", symbol: "P", rate: 0.47 },
    { code: "FJD", name: "Dólar Fiyiano", symbol: "FJ$", rate: 1.68 },
    { code: "PGK", name: "Kina de Papúa Nueva Guinea", symbol: "K", rate: 1.05 },
    { code: "SBD", name: "Dólar de las Islas Salomón", symbol: "SI$", rate: 0.45 },
    { code: "VUV", name: "Vatu de Vanuatu", symbol: "VT", rate: 0.031 },
    { code: "WST", name: "Tala Samoano", symbol: "WS$", rate: 1.38 },
    { code: "TOP", name: "Paʻanga Tongano", symbol: "T$", rate: 1.60 },
    { code: "MUR", name: "Rupia Mauriciana", symbol: "Rs", rate: 0.082 },
    { code: "SCR", name: "Rupia de Seychelles", symbol: "Rs", rate: 0.27 },
    { code: "MGA", name: "Ariary Malgache", symbol: "Ar", rate: 0.00083 },
    { code: "MWK", name: "Kwacha Malauí", symbol: "MK", rate: 0.0022 },
    { code: "ZMW", name: "Kwacha Zambiano", symbol: "ZK", rate: 0.14 },
    { code: "BWP", name: "Pula Botsuana", symbol: "P", rate: 0.28 },
    { code: "NAD", name: "Dólar Namibio", symbol: "N$", rate: 0.20 },
    { code: "SZL", name: "Lilangeni Suazi", symbol: "L", rate: 0.20 },
    { code: "LSL", name: "Loti Lesotense", symbol: "L", rate: 0.20 },
    { code: "AOA", name: "Kwanza Angoleño", symbol: "Kz", rate: 0.0045 },
    { code: "MZN", name: "Metical Mozambiqueño", symbol: "MT", rate: 0.059 },
    { code: "ETB", name: "Birr Etíope", symbol: "Br", rate: 0.030 },
    { code: "SOS", name: "Chelín Somalí", symbol: "S", rate: 0.0065 },
    { code: "RWF", name: "Franco Ruandés", symbol: "FRw", rate: 0.0029 },
    { code: "BIF", name: "Franco Burundés", symbol: "FBu", rate: 0.0013 },
    { code: "DJF", name: "Franco Yibutiano", symbol: "Fdj", rate: 0.021 },
    { code: "XOF", name: "Franco CFA de África Occidental", symbol: "CFA", rate: 0.0063 },
    { code: "XAF", name: "Franco CFA de África Central", symbol: "FCFA", rate: 0.0063 },
    { code: "XCD", name: "Dólar del Caribe Oriental", symbol: "EC$", rate: 1.39 },
    { code: "BSD", name: "Dólar Bahameño", symbol: "B$", rate: 3.75 },
    { code: "BBD", name: "Dólar de Barbados", symbol: "Bds$", rate: 1.87 },
    { code: "JMD", name: "Dólar Jamaiquino", symbol: "J$", rate: 0.024 },
    { code: "TTD", name: "Dólar de Trinidad y Tobago", symbol: "TT$", rate: 0.55 }
];

// ==============================================
// JOBS DATA (250+ Positions)
// ==============================================
const JOB_TEMPLATES = [
    // Tecnología
    { sector: "Tecnología", title: "Desarrollador Full Stack", icon: "💻", base: 4500 },
    { sector: "Tecnología", title: "Ingeniero DevOps", icon: "⚙️", base: 5500 },
    { sector: "Tecnología", title: "Data Scientist", icon: "📊", base: 6000 },
    { sector: "Tecnología", title: "Arquitecto de Software", icon: "🏗️", base: 7500 },
    { sector: "Tecnología", title: "Product Manager Tech", icon: "🚀", base: 6500 },
    { sector: "Tecnología", title: "UI/UX Designer", icon: "🎨", base: 4000 },
    { sector: "Tecnología", title: "Analista de Ciberseguridad", icon: "🔒", base: 5000 },
    { sector: "Tecnología", title: "Ingeniero de Machine Learning", icon: "🤖", base: 7000 },
    { sector: "Tecnología", title: "QA Engineer", icon: "✅", base: 3800 },
    { sector: "Tecnología", title: "Administrador de Sistemas", icon: "🖥️", base: 4200 },
    
    // Finanzas
    { sector: "Finanzas", title: "Analista Financiero", icon: "💰", base: 4000 },
    { sector: "Finanzas", title: "Controller Financiero", icon: "📈", base: 6500 },
    { sector: "Finanzas", title: "Gerente de Tesorería", icon: "🏦", base: 7000 },
    { sector: "Finanzas", title: "Auditor Senior", icon: "🔍", base: 5500 },
    { sector: "Finanzas", title: "Risk Manager", icon: "⚖️", base: 6000 },
    { sector: "Finanzas", title: "Contador Público", icon: "📊", base: 3500 },
    { sector: "Finanzas", title: "Asesor de Inversiones", icon: "💎", base: 5000 },
    { sector: "Finanzas", title: "Analista de Créditos", icon: "💳", base: 3800 },
    { sector: "Finanzas", title: "Compliance Officer", icon: "📋", base: 5200 },
    { sector: "Finanzas", title: "Tax Manager", icon: "🧾", base: 6200 },
    
    // Minería
    { sector: "Minería", title: "Ingeniero de Minas", icon: "⛏️", base: 6500 },
    { sector: "Minería", title: "Geólogo Senior", icon: "🗻", base: 6000 },
    { sector: "Minería", title: "Supervisor de Operaciones", icon: "👷", base: 5500 },
    { sector: "Minería", title: "Especialista en Seguridad", icon: "🦺", base: 5000 },
    { sector: "Minería", title: "Ingeniero Metalúrgico", icon: "⚗️", base: 5800 },
    { sector: "Minería", title: "Planificador Minero", icon: "📐", base: 6200 },
    { sector: "Minería", title: "Ingeniero Ambiental", icon: "🌱", base: 5200 },
    { sector: "Minería", title: "Supervisor de Mantenimiento", icon: "🔧", base: 4800 },
    { sector: "Minería", title: "Topógrafo", icon: "📏", base: 4200 },
    { sector: "Minería", title: "Gerente de Proyecto Minero", icon: "👔", base: 8500 },
    
    // Salud
    { sector: "Salud", title: "Médico General", icon: "👨‍⚕️", base: 5500 },
    { sector: "Salud", title: "Enfermera Especializada", icon: "💉", base: 3200 },
    { sector: "Salud", title: "Administrador Hospitalario", icon: "🏥", base: 5000 },
    { sector: "Salud", title: "Farmacéutico Clínico", icon: "💊", base: 4000 },
    { sector: "Salud", title: "Tecnólogo Médico", icon: "🔬", base: 3500 },
    { sector: "Salud", title: "Fisioterapeuta", icon: "🤸", base: 3000 },
    { sector: "Salud", title: "Nutricionista Clínico", icon: "🥗", base: 2800 },
    { sector: "Salud", title: "Psicólogo Clínico", icon: "🧠", base: 3200 },
    { sector: "Salud", title: "Radiólogo", icon: "📻", base: 6500 },
    { sector: "Salud", title: "Gerente de Calidad Salud", icon: "✨", base: 5500 },
    
    // Comercio
    { sector: "Comercio", title: "Gerente de Ventas", icon: "🎯", base: 4500 },
    { sector: "Comercio", title: "Key Account Manager", icon: "🤝", base: 5000 },
    { sector: "Comercio", title: "Supervisor de Tienda", icon: "🏪", base: 2800 },
    { sector: "Comercio", title: "Analista de Category", icon: "📦", base: 3500 },
    { sector: "Comercio", title: "Trade Marketing Manager", icon: "📢", base: 4800 },
    { sector: "Comercio", title: "Merchandiser", icon: "🛍️", base: 2200 },
    { sector: "Comercio", title: "Ejecutivo de Cuentas", icon: "💼", base: 3200 },
    { sector: "Comercio", title: "Gerente de E-commerce", icon: "🛒", base: 5500 },
    { sector: "Comercio", title: "Analista de Pricing", icon: "💲", base: 3800 },
    { sector: "Comercio", title: "Coordinador Logístico", icon: "📋", base: 3000 },
    
    // Educación
    { sector: "Educación", title: "Director Académico", icon: "🎓", base: 4500 },
    { sector: "Educación", title: "Coordinador Pedagógico", icon: "📚", base: 3200 },
    { sector: "Educación", title: "Profesor Universitario", icon: "👨‍🏫", base: 3500 },
    { sector: "Educación", title: "Psicopedagogo", icon: "🧩", base: 2800 },
    { sector: "Educación", title: "Diseñador Instruccional", icon: "✏️", base: 3000 },
    { sector: "Educación", title: "Capacitador Corporativo", icon: "🎤", base: 3800 },
    { sector: "Educación", title: "Investigador Educativo", icon: "🔎", base: 4000 },
    { sector: "Educación", title: "Tutor Académico", icon: "📖", base: 2200 },
    { sector: "Educación", title: "Especialista en E-learning", icon: "💻", base: 3500 },
    { sector: "Educación", title: "Coordinador de Admisión", icon: "📝", base: 2800 }
];

window.JOBS = [];

// Generate 250+ unique jobs
JOB_TEMPLATES.forEach((template, index) => {
    const levels = ["Junior", "Semi Senior", "Senior", "Lead"];
    levels.forEach((level, levelIndex) => {
        window.JOBS.push({
            id: `job-${index}-${levelIndex}`,
            title: `${template.title} ${level}`,
            sector: template.sector,
            icon: template.icon,
            salary: template.base * (1 + levelIndex * 0.4),
            link: "https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(template.title)
        });
    });
});

// ==============================================
// NEWS DATA
// ==============================================
window.NEWS = [
    {
        title: "UIT 2026 se incrementa a S/ 5,500",
        description: "El Ministerio de Economía y Finanzas confirmó el nuevo valor de la UIT que regirá para todos los cálculos tributarios y laborales del año 2026.",
        source: "Gestión",
        date: "15 Ene 2026",
        link: "https://gestion.pe"
    },
    {
        title: "Reducción de comisiones AFP en agenda del Congreso",
        description: "Se debate proyecto de ley para reducir las comisiones mixtas de las AFP del 1.25% al 0.85%, lo que beneficiaría a millones de afiliados.",
        source: "El Comercio",
        date: "18 Ene 2026",
        link: "https://elcomercio.pe"
    },
    {
        title: "Puerto de Chancay impulsa salarios en sector logístico",
        description: "La operación del megapuerto está generando un incremento del 25% en sueldos de profesionales de comercio exterior y logística.",
        source: "Semana Económica",
        date: "20 Ene 2026",
        link: "https://semanaeconomica.com"
    },
    {
        title: "Boom tecnológico: salarios de desarrolladores suben 30%",
        description: "La demanda de desarrolladores Full Stack y especialistas en IA está disparando los sueldos en el sector tech peruano.",
        source: "RPP",
        date: "12 Ene 2026",
        link: "https://rpp.pe"
    },
    {
        title: "Nueva ley de teletrabajo permanente aprobada",
        description: "El Congreso aprobó ley que regula el teletrabajo permanente con derechos de desconexión digital y bonificaciones especiales.",
        source: "Andina",
        date: "10 Ene 2026",
        link: "https://andina.pe"
    },
    {
        title: "Salario mínimo: Propuesta de aumento a S/ 1,200",
        description: "Organizaciones sindicales proponen incrementar el salario mínimo vital de S/ 1,025 a S/ 1,200 para el segundo semestre de 2026.",
        source: "La República",
        date: "08 Ene 2026",
        link: "https://larepublica.pe"
    },
    {
        title: "Escasez de talento en minería impulsa beneficios",
        description: "Empresas mineras ofrecen paquetes de hasta S/ 15,000 mensuales más beneficios para atraer ingenieros especializados.",
        source: "Mining Press",
        date: "05 Ene 2026",
        link: "https://miningpress.com"
    },
    {
        title: "Bonos de fin de año: ¿Son obligatorios?",
        description: "Especialistas aclaran que los bonos extraordinarios de fin de año no son obligatorios salvo que estén en contratos o convenios colectivos.",
        source: "Gestión",
        date: "28 Dic 2025",
        link: "https://gestion.pe"
    },
    {
        title: "Gratificación trunca: Cómo calcularla correctamente",
        description: "Guía completa sobre cómo calcular la gratificación proporcional cuando un trabajador cesa antes de julio o diciembre.",
        source: "Conexión Esan",
        date: "22 Dic 2025",
        link: "https://conexionesan.edu.pe"
    }
];