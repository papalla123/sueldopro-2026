'use strict';

window.CONFIG = {
    UIT_2026: 5500,
    ASIGNACION_FAMILIAR: 115,
    AFP_RATE: 0.12,
    ONP_RATE: 0.13,
    ESSALUD_RATE: 0.09,
    FOURTH_CATEGORY_RETENTION: 0.08,
    FOURTH_CATEGORY_THRESHOLD: 1500,
    FIFTH_CATEGORY_RATE: 0.08,
    CTS_MONTHS_MAX: 6,
    BENEFITS_INVISIBLE: 0.1833,
    CHART_ANIMATION_DURATION: 750
};

window.CURRENCIES = [
    { code: "USD", name: "Dolar Estadounidense", symbol: "$", rate: 3.75 },
    { code: "EUR", name: "Euro", symbol: "EUR", rate: 4.12 },
    { code: "GBP", name: "Libra Esterlina", symbol: "GBP", rate: 4.82 },
    { code: "JPY", name: "Yen Japones", symbol: "JPY", rate: 0.025 },
    { code: "CNY", name: "Yuan Chino", symbol: "CNY", rate: 0.52 },
    { code: "CAD", name: "Dolar Canadiense", symbol: "CAD", rate: 2.78 },
    { code: "AUD", name: "Dolar Australiano", symbol: "AUD", rate: 2.52 },
    { code: "CHF", name: "Franco Suizo", symbol: "CHF", rate: 4.30 },
    { code: "MXN", name: "Peso Mexicano", symbol: "MXN", rate: 0.22 },
    { code: "BRL", name: "Real Brasileno", symbol: "BRL", rate: 0.76 },
    { code: "INR", name: "Rupia India", symbol: "INR", rate: 0.045 },
    { code: "KRW", name: "Won Surcoreano", symbol: "KRW", rate: 0.0028 },
    { code: "SGD", name: "Dolar Singapur", symbol: "SGD", rate: 2.80 },
    { code: "HKD", name: "Dolar Hong Kong", symbol: "HKD", rate: 0.48 },
    { code: "NZD", name: "Dolar Neozelandes", symbol: "NZD", rate: 2.32 },
    { code: "SEK", name: "Corona Sueca", symbol: "SEK", rate: 0.35 },
    { code: "NOK", name: "Corona Noruega", symbol: "NOK", rate: 0.36 },
    { code: "DKK", name: "Corona Danesa", symbol: "DKK", rate: 0.55 },
    { code: "PLN", name: "Zloty Polaco", symbol: "PLN", rate: 0.95 },
    { code: "CZK", name: "Corona Checa", symbol: "CZK", rate: 0.17 },
    { code: "HUF", name: "Florin Hungaro", symbol: "HUF", rate: 0.011 },
    { code: "RON", name: "Leu Rumano", symbol: "RON", rate: 0.83 },
    { code: "RUB", name: "Rublo Ruso", symbol: "RUB", rate: 0.041 },
    { code: "TRY", name: "Lira Turca", symbol: "TRY", rate: 0.12 },
    { code: "ZAR", name: "Rand Sudafricano", symbol: "ZAR", rate: 0.20 },
    { code: "SAR", name: "Riyal Saudi", symbol: "SAR", rate: 1.00 },
    { code: "AED", name: "Dirham EAU", symbol: "AED", rate: 1.02 },
    { code: "KWD", name: "Dinar Kuwaiti", symbol: "KWD", rate: 12.25 },
    { code: "QAR", name: "Riyal Qatari", symbol: "QAR", rate: 1.03 },
    { code: "CLP", name: "Peso Chileno", symbol: "CLP", rate: 0.0041 }
];

window.JOBS = [];
const jobTemplates = [
    { sector: "tecnologia", icon: "💻", title: "Desarrollador Full Stack", salary: 4500 },
    { sector: "tecnologia", icon: "⚙️", title: "Ingeniero DevOps", salary: 5500 },
    { sector: "tecnologia", icon: "📊", title: "Data Scientist", salary: 6000 },
    { sector: "tecnologia", icon: "🏗️", title: "Arquitecto Software", salary: 7500 },
    { sector: "tecnologia", icon: "🚀", title: "Product Manager", salary: 6500 },
    { sector: "mineria", icon: "⛏️", title: "Ingeniero Minas", salary: 6500 },
    { sector: "mineria", icon: "🗻", title: "Geologo Senior", salary: 6000 },
    { sector: "mineria", icon: "👷", title: "Supervisor Operaciones", salary: 5500 },
    { sector: "finanzas", icon: "💰", title: "Analista Financiero", salary: 4000 },
    { sector: "finanzas", icon: "📊", title: "Controller Financiero", salary: 6500 },
    { sector: "finanzas", icon: "🏦", title: "Gerente Tesoreria", salary: 7000 },
    { sector: "salud", icon: "⚕️", title: "Medico General", salary: 5500 },
    { sector: "salud", icon: "💉", title: "Enfermera Especializada", salary: 3200 },
    { sector: "salud", icon: "🏥", title: "Admin Hospitalario", salary: 5000 },
    { sector: "comercio", icon: "🎯", title: "Gerente Ventas", salary: 4500 },
    { sector: "comercio", icon: "🤝", title: "Key Account Manager", salary: 5000 },
    { sector: "comercio", icon: "🛒", title: "Supervisor Tienda", salary: 2800 },
    { sector: "educacion", icon: "🎓", title: "Director Academico", salary: 4500 },
    { sector: "educacion", icon: "📚", title: "Coordinador Pedagogico", salary: 3200 },
    { sector: "educacion", icon: "👨‍🏫", title: "Profesor Universitario", salary: 3500 }
];

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
            link: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(template.title)}`
        });
    });
});

window.NEWS = [
    {
        title: "UIT 2026 se incrementa a S/ 5,500",
        description: "El MEF confirmo el nuevo valor de la UIT para todos los calculos tributarios y laborales.",
        source: "GESTION",
        date: "15 Ene 2026",
        link: "https://gestion.pe"
    },
    {
        title: "Reduccion de comisiones AFP en agenda",
        description: "Se debate proyecto de ley para reducir las comisiones mixtas de AFP.",
        source: "EL COMERCIO",
        date: "18 Ene 2026",
        link: "https://elcomercio.pe"
    },
    {
        title: "Puerto Chancay impulsa salarios",
        description: "La operacion del megapuerto genera incremento del 25% en sueldos.",
        source: "SEMANA ECONOMICA",
        date: "20 Ene 2026",
        link: "https://semanaeconomica.com"
    },
    {
        title: "Boom tecnologico: salarios suben 30%",
        description: "La demanda de desarrolladores dispara los sueldos en el sector tech.",
        source: "RPP",
        date: "12 Ene 2026",
        link: "https://rpp.pe"
    },
    {
        title: "Nueva ley de teletrabajo aprobada",
        description: "El Congreso aprobo ley que regula el teletrabajo permanente.",
        source: "ANDINA",
        date: "10 Ene 2026",
        link: "https://andina.pe"
    },
    {
        title: "Salario minimo: propuesta de aumento",
        description: "Se propone incrementar el salario minimo vital a S/ 1,200.",
        source: "LA REPUBLICA",
        date: "08 Ene 2026",
        link: "https://larepublica.pe"
    },
    {
        title: "Escasez talento en mineria",
        description: "Empresas mineras ofrecen paquetes de hasta S/ 15,000.",
        source: "MINING PRESS",
        date: "05 Ene 2026",
        link: "https://miningpress.com"
    },
    {
        title: "Sector fintech peruano creció 45%",
        description: "El ecosistema fintech alcanzo transacciones por $2.1 billones.",
        source: "FORBES PERU",
        date: "20 Dic 2025",
        link: "https://forbes.com.pe"
    },
    {
        title: "Trabajo hibrido se consolida",
        description: "El 67% de empresas adoptaron modelo hibrido permanente.",
        source: "MERCADO NEGRO",
        date: "15 Dic 2025",
        link: "https://mercanegro.pe"
    }
];

window.CALCULATOR_CONFIGS = {
    cts: {
        title: { es: 'CTS', en: 'CTS' },
        description: { es: 'Calcula tu Compensacion por Tiempo', en: 'Calculate your Service Time Compensation' },
        fields: [
            { id: 'cts-salary', label: { es: 'Sueldo Mensual', en: 'Monthly Salary' }, type: 'number', placeholder: '5000' },
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
        legalInfo: { es: 'El CTS se calcula sobre el sueldo bruto y se deposita semestralmente.', en: 'CTS is calculated on gross salary.' }
    },

    neto: {
        title: { es: 'Sueldo Neto', en: 'Net Salary' },
        description: { es: 'Calcula tu sueldo liquido', en: 'Calculate your net salary' },
        fields: [
            { id: 'neto-salary', label: { es: 'Sueldo Bruto', en: 'Gross Salary' }, type: 'number', placeholder: '5000' },
            { id: 'neto-afp', label: { es: 'AFP %', en: 'AFP %' }, type: 'number', placeholder: '10', min: 0, max: 15 }
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
        legalInfo: { es: 'Los porcentajes de AFP varian segun la administradora.', en: 'AFP percentages vary by administrator.' }
    },

    gratificacion: {
        title: { es: 'Gratificacion', en: 'Bonus' },
        description: { es: 'Calcula tu gratificacion semestral', en: 'Calculate your bonus' },
        fields: [
            { id: 'grat-salary', label: { es: 'Sueldo Mensual', en: 'Monthly Salary' }, type: 'number', placeholder: '5000' }
        ],
        calculate: (v) => {
            const salary = parseFloat(v['grat-salary']) || 0;
            const grat = salary * 0.5;
            return {
                total: grat,
                details: [
                    { label: 'Sueldo Base', value: `S/ ${salary.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Gratificacion (50%)', value: `S/ ${grat.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La gratificacion equivale al 50% del sueldo mensual.', en: 'Bonus equals 50% of monthly salary.' }
    },

    liquidacion: {
        title: { es: 'Liquidacion', en: 'Severance' },
        description: { es: 'Calcula tu liquidacion al cese laboral', en: 'Calculate severance' },
        fields: [
            { id: 'liq-salary', label: { es: 'Sueldo Mensual', en: 'Monthly Salary' }, type: 'number', placeholder: '5000' },
            { id: 'liq-years', label: { es: 'Anos de Servicio', en: 'Years of Service' }, type: 'number', placeholder: '5', min: 0, max: 50 }
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
                    { label: 'Compensacion', value: `S/ ${compensation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Vacaciones', value: `S/ ${vacation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Total', value: `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'La liquidacion incluye CTS acumulada, compensacion y vacaciones.', en: 'Severance includes CTS, compensation and vacation.' }
    },

    quinta: {
        title: { es: 'Renta 5ta', en: '5th Category' },
        description: { es: 'Calcula el impuesto a tus ingresos laborales', en: 'Calculate labor income tax' },
        fields: [
            { id: 'quinta-salary', label: { es: 'Sueldo Anual', en: 'Annual Salary' }, type: 'number', placeholder: '60000' },
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
                    { label: 'Deduccion', value: `-S/ ${deduction.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Base Imponible', value: `S/ ${taxableIncome.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Impuesto 5ta (8%)', value: `S/ ${tax.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Renta 5ta grava ingresos por trabajo dependiente con 8%.', en: '5th Category taxes dependent work at 8%.' }
    },

    cuarta: {
        title: { es: 'Renta 4ta', en: '4th Category' },
        description: { es: 'Calcula el impuesto a tus ingresos independientes', en: 'Calculate independent income tax' },
        fields: [
            { id: 'cuarta-income', label: { es: 'Ingreso Mensual', en: 'Monthly Income' }, type: 'number', placeholder: '5000' }
        ],
        calculate: (v) => {
            const income = parseFloat(v['cuarta-income']) || 0;
            const threshold = 1500;
            let tax = 0;
            if (income > threshold) {
                tax = income * 0.08;
            }
            return {
                total: tax,
                details: [
                    { label: 'Ingreso Mensual', value: `S/ ${income.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Umbral Exonerado', value: `S/ 1,500` },
                    { label: 'Impuesto 4ta (8%)', value: `S/ ${tax.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` },
                    { label: 'Impuesto Anual', value: `S/ ${(tax * 12).toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Renta 4ta grava trabajo independiente. Ingresos menores a S/ 1,500 estan exonerados.', en: '4th Category taxes independent work. Monthly income below S/ 1,500 is tax-exempt.' }
    },

    utilidades: {
        title: { es: 'Utilidades', en: 'Profit Sharing' },
        description: { es: 'Calcula tu participacion de utilidades', en: 'Calculate profit sharing' },
        fields: [
            { id: 'util-salary', label: { es: 'Sueldo Mensual', en: 'Monthly Salary' }, type: 'number', placeholder: '5000' },
            { id: 'util-months', label: { es: 'Meses en el Ano', en: 'Months in Year' }, type: 'number', placeholder: '12', min: 1, max: 12 }
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
                    { label: 'Meses', value: `${months}` },
                    { label: 'Utilidades (10%)', value: `S/ ${totalUtil.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Las utilidades se distribuyen segun ley con minimo 10%.', en: 'Profits distributed by law with minimum 10%.' }
    },

    vacaciones: {
        title: { es: 'Vacaciones', en: 'Vacation' },
        description: { es: 'Calcula el pago de tus vacaciones', en: 'Calculate vacation pay' },
        fields: [
            { id: 'vac-salary', label: { es: 'Sueldo Mensual', en: 'Monthly Salary' }, type: 'number', placeholder: '5000' },
            { id: 'vac-days', label: { es: 'Dias de Vacaciones', en: 'Vacation Days' }, type: 'number', placeholder: '30', min: 1, max: 60 }
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
                    { label: 'Dias', value: `${days}` },
                    { label: 'Total', value: `S/ ${total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: { es: 'Trabajadores tienen derecho a 30 dias anuales. Pago por vacaciones no gozadas forma parte de liquidacion.', en: 'Workers entitled to 30 days annually. Unused vacation pay is part of severance.' }
    }
};