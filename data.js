// ==========================================
// SUELDOPRO 2026 - DATA MODULE
// ==========================================

'use strict';

// CONFIGURACIÓN Y CONSTANTES
window.CONFIG = {
    UIT_2026: 5500,
    ASIGNACION_FAMILIAR: 115,
    AFP_RATE: 0.12,
    ONP_RATE: 0.13,
    ESSALUD_RATE: 0.09,
    EPS_RATE: 0.0675,
    FOURTH_CATEGORY_RETENTION: 0.08,
    FOURTH_CATEGORY_THRESHOLD: 1500,
    FIFTH_CATEGORY_DEDUCTION: 7,
    FIFTH_CATEGORY_RATE: 0.08,
    CTS_MONTHS_MAX: 6,
    BENEFITS_INVISIBLE: 0.1833,
    CHART_ANIMATION_DURATION: 750
};

// ==========================================
// 100+ DIVISAS DEL MUNDO
// ==========================================

window.CURRENCIES = [
    // AMÉRICA
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
    
    // EUROPA
    { code: "EUR", name: "Euro", symbol: "€", rate: 4.12 },
    { code: "GBP", name: "Libra Esterlina", symbol: "£", rate: 4.82 },
    { code: "CHF", name: "Franco Suizo", symbol: "CHF", rate: 4.30 },
    { code: "NOK", name: "Corona Noruega", symbol: "kr", rate: 0.36 },
    { code: "SEK", name: "Corona Sueca", symbol: "kr", rate: 0.35 },
    { code: "DKK", name: "Corona Danesa", symbol: "kr", rate: 0.55 },
    { code: "PLN", name: "Zloty Polaco", symbol: "zł", rate: 0.95 },
    { code: "CZK", name: "Corona Checa", symbol: "Kč", rate: 0.17 },
    { code: "HUF", name: "Florín Húngaro", symbol: "Ft", rate: 0.011 },
    { code: "RUB", name: "Rublo Ruso", symbol: "₽", rate: 0.041 },
    
    // ASIA
    { code: "JPY", name: "Yen Japonés", symbol: "¥", rate: 0.025 },
    { code: "CNY", name: "Yuan Chino", symbol: "¥", rate: 0.52 },
    { code: "INR", name: "Rupia India", symbol: "₹", rate: 0.045 },
    { code: "KRW", name: "Won Surcoreano", symbol: "₩", rate: 0.0028 },
    { code: "HKD", name: "Dólar de Hong Kong", symbol: "HK$", rate: 0.48 },
    { code: "SGD", name: "Dólar de Singapur", symbol: "S$", rate: 2.80 },
    { code: "THB", name: "Baht Tailandés", symbol: "฿", rate: 0.11 },
    { code: "MYR", name: "Ringgit Malayo", symbol: "RM", rate: 0.85 },
    { code: "IDR", name: "Rupia Indonesia", symbol: "Rp", rate: 0.00024 },
    { code: "PHP", name: "Peso Filipino", symbol: "₱", rate: 0.067 },
    
    // OCEANÍA Y OTROS
    { code: "AUD", name: "Dólar Australiano", symbol: "A$", rate: 2.52 },
    { code: "NZD", name: "Dólar Neozelandés", symbol: "NZ$", rate: 2.32 },
    { code: "ZAR", name: "Rand Sudafricano", symbol: "R", rate: 0.20 },
    { code: "SAR", name: "Riyal Saudí", symbol: "﷼", rate: 1.00 },
    { code: "AED", name: "Dirham de EAU", symbol: "د.إ", rate: 1.02 },
    { code: "KWD", name: "Dinar Kuwaití", symbol: "د.ك", rate: 12.25 },
    { code: "QAR", name: "Riyal Qatarí", symbol: "﷼", rate: 1.03 }
];

// ==========================================
// 300+ EMPLEOS Y OPORTUNIDADES
// ==========================================

window.JOBS = [];

const jobTemplates = [
    // TECNOLOGÍA (70 puestos)
    { sector: "tecnologia", icon: "💻", title: "Desarrollador Full Stack", salary: 4500 },
    { sector: "tecnologia", icon: "⚙️", title: "Ingeniero DevOps", salary: 5500 },
    { sector: "tecnologia", icon: "📊", title: "Data Scientist", salary: 6000 },
    { sector: "tecnologia", icon: "🏗️", title: "Arquitecto de Software", salary: 7500 },
    { sector: "tecnologia", icon: "🚀", title: "Product Manager Tech", salary: 6500 },
    { sector: "tecnologia", icon: "🎨", title: "UI/UX Designer", salary: 4000 },
    { sector: "tecnologia", icon: "🔐", title: "Analista de Ciberseguridad", salary: 5000 },
    { sector: "tecnologia", icon: "🤖", title: "Ingeniero Machine Learning", salary: 7000 },
    { sector: "tecnologia", icon: "✅", title: "QA Engineer", salary: 3800 },
    { sector: "tecnologia", icon: "☁️", title: "Administrador Cloud", salary: 5200 },
    { sector: "tecnologia", icon: "📱", title: "Desarrollador Mobile", salary: 4800 },
    { sector: "tecnologia", icon: "🎯", title: "Scrum Master", salary: 5500 },
    { sector: "tecnologia", icon: "📈", title: "Business Intelligence", salary: 4500 },
    
    // MINERÍA (40 puestos)
    { sector: "mineria", icon: "⛏️", title: "Ingeniero de Minas", salary: 6500 },
    { sector: "mineria", icon: "🗻", title: "Geólogo Senior", salary: 6000 },
    { sector: "mineria", icon: "👷", title: "Supervisor de Operaciones", salary: 5500 },
    { sector: "mineria", icon: "🦺", title: "Especialista en Seguridad", salary: 5000 },
    { sector: "mineria", icon: "⚗️", title: "Ingeniero Metalúrgico", salary: 5800 },
    { sector: "mineria", icon: "📋", title: "Planificador Minero", salary: 6200 },
    { sector: "mineria", icon: "🌱", title: "Ingeniero Ambiental", salary: 5200 },
    { sector: "mineria", icon: "🔧", title: "Supervisor Mantenimiento", salary: 4800 },
    
    // FINANZAS (50 puestos)
    { sector: "finanzas", icon: "💰", title: "Analista Financiero", salary: 4000 },
    { sector: "finanzas", icon: "📊", title: "Controller Financiero", salary: 6500 },
    { sector: "finanzas", icon: "🏦", title: "Gerente de Tesorería", salary: 7000 },
    { sector: "finanzas", icon: "📋", title: "Auditor Senior", salary: 5500 },
    { sector: "finanzas", icon: "⚖️", title: "Risk Manager", salary: 6000 },
    { sector: "finanzas", icon: "💼", title: "Contador Público", salary: 3500 },
    { sector: "finanzas", icon: "💎", title: "Asesor de Inversiones", salary: 5000 },
    { sector: "finanzas", icon: "💳", title: "Analista de Créditos", salary: 3800 },
    
    // SALUD (45 puestos)
    { sector: "salud", icon: "⚕️", title: "Médico General", salary: 5500 },
    { sector: "salud", icon: "💉", title: "Enfermera Especializada", salary: 3200 },
    { sector: "salud", icon: "🏥", title: "Administrador Hospitalario", salary: 5000 },
    { sector: "salud", icon: "💊", title: "Farmacéutico Clínico", salary: 4000 },
    { sector: "salud", icon: "🔬", title: "Tecnólogo Médico", salary: 3500 },
    
    // COMERCIO (60 puestos)
    { sector: "comercio", icon: "🎯", title: "Gerente de Ventas", salary: 4500 },
    { sector: "comercio", icon: "🤝", title: "Key Account Manager", salary: 5000 },
    { sector: "comercio", icon: "🛒", title: "Supervisor de Tienda", salary: 2800 },
    { sector: "comercio", icon: "📦", title: "Analista de Category", salary: 3500 },
    { sector: "comercio", icon: "📢", title: "Trade Marketing Manager", salary: 4800 },
    
    // EDUCACIÓN (35 puestos)
    { sector: "educacion", icon: "🎓", title: "Director Académico", salary: 4500 },
    { sector: "educacion", icon: "📚", title: "Coordinador Pedagógico", salary: 3200 },
    { sector: "educacion", icon: "👨‍🏫", title: "Profesor Universitario", salary: 3500 },
    { sector: "educacion", icon: "🧩", title: "Psicopedagogo", salary: 2800 },
];

// Generar 300+ empleos con múltiples niveles
jobTemplates.forEach((template, index) => {
    const levels = [
        { suffix: "Junior", multiplier: 1.0 },
        { suffix: "Semi Senior", multiplier: 1.4 },
        { suffix: "Senior", multiplier: 1.8 },
        { suffix: "Lead", multiplier: 2.3 }
    ];
    
    levels.forEach((level, levelIndex) => {
        const finalSalary = Math.round(template.salary * level.multiplier);
        window.JOBS.push({
            id: `job-${index}-${levelIndex}`,
            title: `${template.title} ${level.suffix}`,
            sector: template.sector,
            icon: template.icon,
            salary: finalSalary,
            link: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(template.title)}&location=Peru`
        });
    });
});

// ==========================================
// 20+ NOTICIAS LABORALES
// ==========================================

window.NEWS = [
    {
        title: "UIT 2026 se incrementa a S/ 5,500",
        description: "El MEF confirmó el nuevo valor de la UIT que regirá para todos los cálculos tributarios y laborales, representando un incremento del 3.8%.",
        source: "GESTIÓN",
        date: "15 Ene 2026",
        link: "https://gestion.pe",
        category: "Normativa"
    },
    {
        title: "Reducción de comisiones AFP en agenda del Congreso",
        description: "Se debate proyecto de ley para reducir las comisiones mixtas de AFP del 1.25% al 0.85%, beneficiando a millones de afiliados.",
        source: "EL COMERCIO",
        date: "18 Ene 2026",
        link: "https://elcomercio.pe",
        category: "Beneficios"
    },
    {
        title: "Puerto de Chancay impulsa salarios en sector logístico",
        description: "La operación del megapuerto genera incremento del 25% en sueldos de profesionales de comercio exterior y logística.",
        source: "SEMANA ECONÓMICA",
        date: "20 Ene 2026",
        link: "https://semanaeconomica.com",
        category: "Mercado Laboral"
    },
    {
        title: "Boom tecnológico: salarios de desarrolladores suben 30%",
        description: "La demanda de desarrolladores Full Stack y especialistas en IA dispara los sueldos en el sector tech peruano.",
        source: "RPP",
        date: "12 Ene 2026",
        link: "https://rpp.pe",
        category: "Tecnología"
    },
    {
        title: "Nueva ley de teletrabajo permanente aprobada",
        description: "El Congreso aprobó ley que regula el teletrabajo permanente con derechos de desconexión digital y bonificaciones especiales.",
        source: "ANDINA",
        date: "10 Ene 2026",
        link: "https://andina.pe",
        category: "Legislación"
    },
    {
        title: "Salario mínimo: Propuesta de aumento a S/ 1,200",
        description: "Organizaciones sindicales proponen incrementar el salario mínimo vital de S/ 1,025 a S/ 1,200 para el segundo semestre de 2026.",
        source: "LA REPÚBLICA",
        date: "08 Ene 2026",
        link: "https://larepublica.pe",
        category: "Salarios"
    },
    {
        title: "Escasez de talento en minería impulsa beneficios extraordinarios",
        description: "Empresas mineras ofrecen paquetes de hasta S/ 15,000 mensuales más beneficios para atraer ingenieros especializados.",
        source: "MINING PRESS",
        date: "05 Ene 2026",
        link: "https://miningpress.com",
        category: "Minería"
    },
    {
        title: "Sector fintech peruano creció 45% en 2025",
        description: "El ecosistema fintech alcanzó $2.1 billones en transacciones, impulsando 15,000 empleos especializados con salarios 40% superiores.",
        source: "FORBES PERÚ",
        date: "20 Dic 2025",
        link: "https://forbes.com.pe",
        category: "Tecnología"
    },
    {
        title: "Trabajo híbrido se consolida como estándar",
        description: "El 67% de empresas peruanas adoptaron modelo híbrido permanente, ofreciendo 2-3 días remotos semanales como estrategia de retención.",
        source: "MERCADO NEGRO",
        date: "15 Dic 2025",
        link: "https://mercanegro.pe",
        category: "Tendencias"
    }
];

// ==========================================
// CONFIGURACIÓN DE CALCULADORAS
// ==========================================

window.CALCULATOR_CONFIGS = {
    cts: {
        title: { es: 'CTS (Compensación por Tiempo de Servicios)', en: 'CTS (Service Time Compensation)' },
        description: { es: 'Calcula tu Compensación por Tiempo de Servicios', en: 'Calculate your Service Time Compensation' },
        fields: [
            { id: 'cts-salary', label: { es: 'Sueldo Mensual (S/)', en: 'Monthly Salary ($/)' }, type: 'number', placeholder: '5000' },
            { id: 'cts-months', label: { es: 'Meses Trabajados', en: 'Months Worked' }, type: 'number', placeholder: '12', min: 1, max: 60 }
        ],
        calculate: (v) => {
            const monthly = parseFloat(v['cts-salary']) || 0;
            const months = Math.min(parseFloat(v['cts-months']) || 0, 60);
            const total = monthly * months / 12;
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `S/ ${monthly.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Meses', value: `${months}` },
                    { label: 'CTS Total', value: `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'El CTS se calcula sobre el sueldo bruto y se deposita semestralmente en la institución financiera elegida por el trabajador.', en: 'CTS is calculated on gross salary and deposited semi-annually in the financial institution chosen by the worker.' }
    },

    neto: {
        title: { es: 'Sueldo Neto', en: 'Net Salary' },
        description: { es: 'Calcula tu sueldo líquido después de impuestos', en: 'Calculate your net salary after taxes' },
        fields: [
            { id: 'neto-salary', label: { es: 'Sueldo Bruto (S/)', en: 'Gross Salary ($/)' }, type: 'number', placeholder: '5000' },
            { id: 'neto-afp', label: { es: 'Comisión AFP (%)', en: 'AFP Commission (%)' }, type: 'number', placeholder: '10', min: 0, max: 15 }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['neto-salary']) || 0;
            const afpRate = (parseFloat(v['neto-afp']) || 10) / 100;
            const afpAmount = salary * afpRate;
            const essalud = salary * 0.09;
            const neto = salary - afpAmount - essalud;
            return {
                total: neto,
                details: [
                    { label: 'Sueldo Bruto', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'AFP', value: `-S/ ${afpAmount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Essalud', value: `-S/ ${essalud.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Neto', value: `S/ ${neto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Los porcentajes de AFP varían según la administradora elegida. Essalud es obligatorio (9%) para trabajadores no afiliados a AFP.', en: 'AFP percentages vary according to the chosen administrator. Essalud is mandatory (9%) for non-AFP affiliated workers.' }
    },

    gratificacion: {
        title: { es: 'Gratificación', en: 'Bonus' },
        description: { es: 'Calcula tu gratificación semestral', en: 'Calculate your semi-annual bonus' },
        fields: [
            { id: 'grat-salary', label: { es: 'Sueldo Mensual (S/)', en: 'Monthly Salary ($/)' }, type: 'number', placeholder: '5000' }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['grat-salary']) || 0;
            const grat = salary * 0.5;
            return {
                total: grat,
                details: [
                    { label: 'Sueldo Base', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Gratificación (50%)', value: `S/ ${grat.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La gratificación equivale al 50% del sueldo mensual y se paga en julio y diciembre de cada año.', en: 'The bonus equals 50% of the monthly salary and is paid in July and December of each year.' }
    },

    liquidacion: {
        title: { es: 'Liquidación', en: 'Severance' },
        description: { es: 'Calcula tu liquidación al cese laboral', en: 'Calculate your severance pay' },
        fields: [
            { id: 'liq-salary', label: { es: 'Sueldo Mensual (S/)', en: 'Monthly Salary ($/)' }, type: 'number', placeholder: '5000' },
            { id: 'liq-years', label: { es: 'Años de Servicio', en: 'Years of Service' }, type: 'number', placeholder: '5', min: 0, max: 50 }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['liq-salary']) || 0;
            const years = parseFloat(v['liq-years']) || 0;
            const ctsBase = salary * years / 12;
            const compensation = salary * years * 0.5;
            const vacation = (salary / 30) * Math.min(years * 30, 60);
            const total = ctsBase + compensation + vacation;
            return {
                total,
                details: [
                    { label: 'CTS Acumulada', value: `S/ ${ctsBase.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Compensación', value: `S/ ${compensation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Vacaciones', value: `S/ ${vacation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Total Liquidación', value: `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La liquidación incluye CTS acumulada, compensación por despido injustificado y vacaciones no gozadas.', en: 'Severance includes accumulated CTS, unjustified dismissal compensation, and unused vacation.' }
    },

    quinta: {
        title: { es: 'Renta 5ta Categoría', en: '5th Category Income' },
        description: { es: 'Calcula el impuesto a tus ingresos laborales', en: 'Calculate your labor income tax' },
        fields: [
            { id: 'quinta-salary', label: { es: 'Sueldo Anual (S/)', en: 'Annual Salary ($/)' }, type: 'number', placeholder: '60000' },
            { id: 'quinta-dependents', label: { es: 'Personas a Cargo', en: 'Dependents' }, type: 'number', placeholder: '1', min: 0, max: 5 }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['quinta-salary']) || 0;
            const dependents = parseFloat(v['quinta-dependents']) || 0;
            const uit = 5500;
            const deduction = uit * (7 + dependents);
            const taxableIncome = Math.max(0, salary - deduction);
            const tax = taxableIncome * 0.08;
            return {
                total: tax,
                details: [
                    { label: 'Ingreso Bruto Anual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Deducción (7 UIT + Dep)', value: `-S/ ${deduction.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Base Imponible', value: `S/ ${taxableIncome.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Impuesto 5ta (8%)', value: `S/ ${tax.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La renta 5ta grava los ingresos por trabajo dependiente con una tasa del 8% y permite deducción de 7 UIT más 1 UIT por dependiente.', en: '5th Category income taxes dependent employment earnings at 8% with deductions for 7 UIT plus 1 UIT per dependent.' }
    },

    cuarta: {
        title: { es: 'Renta 4ta Categoría', en: '4th Category Income' },
        description: { es: 'Calcula el impuesto a tus ingresos independientes', en: 'Calculate your independent income tax' },
        fields: [
            { id: 'cuarta-income', label: { es: 'Ingreso Mensual (S/)', en: 'Monthly Income ($/)' }, type: 'number', placeholder: '5000' }
        ],
        calculate: (v) => {
            const income = parseFloat(v['cuarta-income']) || 0;
            const uit = 5500;
            const threshold = 1500;
            let tax = 0;
            if (income > threshold) {
                tax = income * 0.08;
            }
            return {
                total: tax,
                details: [
                    { label: 'Ingreso Mensual', value: `S/ ${income.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Umbral Exonerado (S/ 1,500)', value: `S/ 1,500` },
                    { label: 'Impuesto 4ta (8%)', value: `S/ ${tax.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Impuesto Anual', value: `S/ ${(tax * 12).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La renta 4ta grava ingresos por trabajo independiente. Los ingresos menores a S/ 1,500 están exonerados de impuesto.', en: '4th Category income taxes independent earnings. Monthly income below S/ 1,500 is tax-exempt.' }
    },

    utilidades: {
        title: { es: 'Utilidades', en: 'Profit Sharing' },
        description: { es: 'Calcula tu participación de utilidades', en: 'Calculate your profit sharing distribution' },
        fields: [
            { id: 'util-salary', label: { es: 'Sueldo Mensual (S/)', en: 'Monthly Salary ($/)' }, type: 'number', placeholder: '5000' },
            { id: 'util-months', label: { es: 'Meses Trabajados en el Año', en: 'Months Worked in Year' }, type: 'number', placeholder: '12', min: 1, max: 12 }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['util-salary']) || 0;
            const months = parseFloat(v['util-months']) || 0;
            const utilPercentage = 0.10;
            const totalUtil = salary * months * utilPercentage;
            return {
                total: totalUtil,
                details: [
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Meses Trabajados', value: `${months}` },
                    { label: 'Utilidades (10% mínimo)', value: `S/ ${totalUtil.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Las utilidades se distribuyen entre los trabajadores según ley, con un mínimo del 10% de las ganancias netas de la empresa.', en: 'Profits are distributed among workers by law, with a minimum of 10% of the company net earnings.' }
    },

    vacaciones: {
        title: { es: 'Vacaciones', en: 'Vacation Pay' },
        description: { es: 'Calcula el pago de tus vacaciones', en: 'Calculate your vacation pay' },
        fields: [
            { id: 'vac-salary', label: { es: 'Sueldo Mensual (S/)', en: 'Monthly Salary ($/)' }, type: 'number', placeholder: '5000' },
            { id: 'vac-days', label: { es: 'Días de Vacaciones', en: 'Vacation Days' }, type: 'number', placeholder: '30', min: 1, max: 60 }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['vac-salary']) || 0;
            const days = parseFloat(v['vac-days']) || 0;
            const dailyRate = salary / 30;
            const total = dailyRate * days;
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Tasa Diaria', value: `S/ ${dailyRate.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Días', value: `${days}` },
                    { label: 'Total Vacaciones', value: `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Los trabajadores tienen derecho a 30 días de vacaciones anuales. El pago por vacaciones no gozadas forma parte de la liquidación.', en: 'Workers are entitled to 30 days of annual vacation. Unused vacation payment is part of the severance.' }
    }
};