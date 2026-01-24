'use strict';

// PENTÁGONO FINANCIERO - Enlaces Dinámicos
window.PENTAGON_LINKS = {
    sueldopro: {
        name: 'SueldoPro Ultra',
        icon: '💰',
        url: window.location.href,
        description: 'Calculadora Laboral Global',
        color: 'from-indigo-500 to-indigo-700'
    },
    liquidez: {
        name: 'Liquidez Force',
        icon: '💧',
        url: 'https://liquidez-force.vercel.app',
        description: 'Gestión de Flujo de Caja',
        color: 'from-blue-500 to-cyan-500'
    },
    lead: {
        name: 'Lead Target',
        icon: '🎯',
        url: 'https://lead-target-rpvx.vercel.app',
        description: 'CRM de Prospectos',
        color: 'from-purple-500 to-pink-500'
    },
    wealth: {
        name: 'Wealth Armor AI',
        icon: '🛡️',
        url: 'https://wealth-armor-ai.vercel.app',
        description: 'Protección Patrimonial',
        color: 'from-emerald-500 to-green-600'
    },
      margin: {
        name: 'MarginAxis Global', 
        icon: '📊',                
        url: 'https://margin-master-pro-pboy.vercel.app', 
        description: 'Ingeniería de Rentabilidad Enterprise',
        color: 'from-emerald-500 to-teal-600'
    },
};

// BASE DE DATOS GLOBAL - 21 PAÍSES
window.COUNTRIES_DATA = {
    ES: { code: 'ES', name: 'España', flag: '🇪🇸', currency: 'EUR', currencySymbol: '€', employerTax: 0.30, socialSecurity: 0.065, pension: 0.047, unemployment: 0.016, healthInsurance: 0.041, vacation: 30, severance: 1.0, bonusMonths: 2, minWage: 1323, thirteenth: true, fourteenth: false },
    MX: { code: 'MX', name: 'México', flag: '🇲🇽', currency: 'MXN', currencySymbol: '$', employerTax: 0.25, socialSecurity: 0.024, pension: 0.02, unemployment: 0.0, healthInsurance: 0.105, vacation: 12, severance: 0.33, bonusMonths: 1, minWage: 248.93, thirteenth: true, fourteenth: false },
    CO: { code: 'CO', name: 'Colombia', flag: '🇨🇴', currency: 'COP', currencySymbol: '$', employerTax: 0.27, socialSecurity: 0.04, pension: 0.12, unemployment: 0.0, healthInsurance: 0.085, vacation: 15, severance: 1.0, bonusMonths: 1, minWage: 1300000, thirteenth: true, fourteenth: true },
    PE: { code: 'PE', name: 'Perú', flag: '🇵🇪', currency: 'PEN', currencySymbol: 'S/', employerTax: 0.09, socialSecurity: 0.0, pension: 0.13, unemployment: 0.0, healthInsurance: 0.09, vacation: 30, severance: 0.5, bonusMonths: 2, minWage: 1025, thirteenth: true, fourteenth: false },
    CL: { code: 'CL', name: 'Chile', flag: '🇨🇱', currency: 'CLP', currencySymbol: '$', employerTax: 0.028, socialSecurity: 0.0, pension: 0.10, unemployment: 0.03, healthInsurance: 0.07, vacation: 15, severance: 0.33, bonusMonths: 0, minWage: 460000, thirteenth: false, fourteenth: false },
    AR: { code: 'AR', name: 'Argentina', flag: '🇦🇷', currency: 'ARS', currencySymbol: '$', employerTax: 0.23, socialSecurity: 0.17, pension: 0.11, unemployment: 0.0, healthInsurance: 0.06, vacation: 14, severance: 1.0, bonusMonths: 1, minWage: 234315, thirteenth: true, fourteenth: false },
    EC: { code: 'EC', name: 'Ecuador', flag: '🇪🇨', currency: 'USD', currencySymbol: '$', employerTax: 0.1265, socialSecurity: 0.0945, pension: 0.0, unemployment: 0.0, healthInsurance: 0.0, vacation: 15, severance: 1.0, bonusMonths: 2, minWage: 460, thirteenth: true, fourteenth: true },
    BO: { code: 'BO', name: 'Bolivia', flag: '🇧🇴', currency: 'BOB', currencySymbol: 'Bs', employerTax: 0.165, socialSecurity: 0.1271, pension: 0.0, unemployment: 0.0, healthInsurance: 0.10, vacation: 15, severance: 1.0, bonusMonths: 2, minWage: 2362, thirteenth: true, fourteenth: true },
    PY: { code: 'PY', name: 'Paraguay', flag: '🇵🇾', currency: 'PYG', currencySymbol: '₲', employerTax: 0.165, socialSecurity: 0.09, pension: 0.0, unemployment: 0.0, healthInsurance: 0.09, vacation: 12, severance: 0.5, bonusMonths: 1, minWage: 2680373, thirteenth: true, fourteenth: false },
    UY: { code: 'UY', name: 'Uruguay', flag: '🇺🇾', currency: 'UYU', currencySymbol: '$', employerTax: 0.0775, socialSecurity: 0.15, pension: 0.15, unemployment: 0.0, healthInsurance: 0.05, vacation: 20, severance: 0.5, bonusMonths: 1, minWage: 21106, thirteenth: true, fourteenth: false },
    VE: { code: 'VE', name: 'Venezuela', flag: '🇻🇪', currency: 'VES', currencySymbol: 'Bs', employerTax: 0.12, socialSecurity: 0.04, pension: 0.10, unemployment: 0.0, healthInsurance: 0.04, vacation: 15, severance: 1.0, bonusMonths: 2, minWage: 130, thirteenth: true, fourteenth: false },
    CR: { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', currency: 'CRC', currencySymbol: '₡', employerTax: 0.2667, socialSecurity: 0.0917, pension: 0.0, unemployment: 0.0, healthInsurance: 0.0917, vacation: 14, severance: 0.5, bonusMonths: 1, minWage: 351320, thirteenth: true, fourteenth: false },
    PA: { code: 'PA', name: 'Panamá', flag: '🇵🇦', currency: 'USD', currencySymbol: '$', employerTax: 0.125, socialSecurity: 0.0975, pension: 0.0, unemployment: 0.0, healthInsurance: 0.0975, vacation: 30, severance: 1.0, bonusMonths: 1, minWage: 800, thirteenth: true, fourteenth: false },
    GT: { code: 'GT', name: 'Guatemala', flag: '🇬🇹', currency: 'GTQ', currencySymbol: 'Q', employerTax: 0.1267, socialSecurity: 0.0483, pension: 0.0, unemployment: 0.0, healthInsurance: 0.1067, vacation: 15, severance: 1.0, bonusMonths: 1, minWage: 3139.20, thirteenth: true, fourteenth: true },
    HN: { code: 'HN', name: 'Honduras', flag: '🇭🇳', currency: 'HNL', currencySymbol: 'L', employerTax: 0.07, socialSecurity: 0.035, pension: 0.0, unemployment: 0.0, healthInsurance: 0.05, vacation: 20, severance: 1.0, bonusMonths: 1, minWage: 9839.40, thirteenth: true, fourteenth: true },
    SV: { code: 'SV', name: 'El Salvador', flag: '🇸🇻', currency: 'USD', currencySymbol: '$', employerTax: 0.078, socialSecurity: 0.075, pension: 0.075, unemployment: 0.0, healthInsurance: 0.075, vacation: 15, severance: 1.0, bonusMonths: 1, minWage: 365, thirteenth: true, fourteenth: false },
    NI: { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', currency: 'NIO', currencySymbol: 'C$', employerTax: 0.22, socialSecurity: 0.07, pension: 0.0, unemployment: 0.0, healthInsurance: 0.09, vacation: 15, severance: 1.0, bonusMonths: 1, minWage: 6518.40, thirteenth: true, fourteenth: false },
    DO: { code: 'DO', name: 'República Dominicana', flag: '🇩🇴', currency: 'DOP', currencySymbol: 'RD$', employerTax: 0.0710, socialSecurity: 0.0287, pension: 0.071, unemployment: 0.0, healthInsurance: 0.0710, vacation: 14, severance: 0.5, bonusMonths: 1, minWage: 23000, thirteenth: true, fourteenth: false },
    CU: { code: 'CU', name: 'Cuba', flag: '🇨🇺', currency: 'CUP', currencySymbol: '$', employerTax: 0.145, socialSecurity: 0.05, pension: 0.125, unemployment: 0.0, healthInsurance: 0.0, vacation: 30, severance: 1.0, bonusMonths: 0, minWage: 2100, thirteenth: true, fourteenth: false },
    US: { code: 'US', name: 'Estados Unidos', flag: '🇺🇸', currency: 'USD', currencySymbol: '$', employerTax: 0.0765, socialSecurity: 0.062, pension: 0.0, unemployment: 0.006, healthInsurance: 0.0145, vacation: 10, severance: 0.0, bonusMonths: 0, minWage: 7.25, thirteenth: false, fourteenth: false },
    BR: { code: 'BR', name: 'Brasil', flag: '🇧🇷', currency: 'BRL', currencySymbol: 'R$', employerTax: 0.2705, socialSecurity: 0.08, pension: 0.08, unemployment: 0.08, healthInsurance: 0.0, vacation: 30, severance: 0.4, bonusMonths: 1, minWage: 1412, thirteenth: true, fourteenth: false }
};

// CONFIGURACIONES DE CALCULADORAS
window.CALCULATOR_CONFIGS = {
    neto: {
        id: 'neto',
        icon: '💵',
        title: 'Sueldo Neto',
        description: 'Calcula tu sueldo líquido después de impuestos y deducciones',
        fields: [
            { id: 'neto-salary', label: 'Sueldo Bruto Mensual', type: 'number', placeholder: '5000', min: 0 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['neto-salary']) || 0;
            const pension = salary * country.pension;
            const health = salary * country.healthInsurance;
            const social = salary * country.socialSecurity;
            const neto = salary - pension - health - social;
            
            return {
                total: neto,
                details: [
                    { label: 'Sueldo Bruto', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Pensión', value: `-${country.currencySymbol} ${pension.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Salud', value: `-${country.currencySymbol} ${health.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Seguridad Social', value: `-${country.currencySymbol} ${social.toLocaleString('es', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: 'Los descuentos incluyen pensión, salud y seguridad social según normativa del país seleccionado.'
    },
    
    cts: {
        id: 'cts',
        icon: '🏦',
        title: 'CTS / Indemnización',
        description: 'Calcula compensación por tiempo de servicio o indemnización',
        fields: [
            { id: 'cts-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'cts-months', label: 'Meses Trabajados', type: 'number', placeholder: '12', min: 1, max: 240 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['cts-salary']) || 0;
            const months = parseFloat(values['cts-months']) || 0;
            const years = months / 12;
            
            const cts = (salary * months) / 12;
            const severance = salary * years * country.severance;
            const total = cts + severance;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Meses Trabajados', value: `${months}` },
                    { label: 'CTS/Indemnización', value: `${country.currencySymbol} ${cts.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Compensación Adicional', value: `${country.currencySymbol} ${severance.toLocaleString('es', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: 'El cálculo incluye CTS y compensación adicional según el factor de severancia del país.'
    },
    
    liquidacion: {
        id: 'liquidacion',
        icon: '📋',
        title: 'Liquidación Final',
        description: 'Calcula todos los beneficios al terminar contrato',
        fields: [
            { id: 'liq-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'liq-years', label: 'Años de Servicio', type: 'number', placeholder: '5', min: 0, max: 50 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['liq-salary']) || 0;
            const years = parseFloat(values['liq-years']) || 0;
            
            const cts = salary * years;
            const severance = salary * years * country.severance;
            const vacationDays = Math.min(years * country.vacation, country.vacation * 2);
            const vacation = (salary / 30) * vacationDays;
            const bonus = country.thirteenth ? salary : 0;
            
            const total = cts + severance + vacation + bonus;
            
            return {
                total,
                details: [
                    { label: 'CTS Acumulada', value: `${country.currencySymbol} ${cts.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Indemnización', value: `${country.currencySymbol} ${severance.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Vacaciones', value: `${country.currencySymbol} ${vacation.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Aguinaldo', value: `${country.currencySymbol} ${bonus.toLocaleString('es', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: 'Incluye CTS, indemnización, vacaciones pendientes y aguinaldo según corresponda.'
    },
    
    gratificacion: {
        id: 'gratificacion',
        icon: '🎁',
        title: 'Gratificaciones/Aguinaldo',
        description: 'Calcula bonificaciones anuales (13º, 14º sueldo)',
        fields: [
            { id: 'grat-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'grat-months', label: 'Meses Trabajados', type: 'number', placeholder: '12', min: 1, max: 12 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['grat-salary']) || 0;
            const months = parseFloat(values['grat-months']) || 0;
            
            const thirteenth = country.thirteenth ? (salary * months) / 12 : 0;
            const fourteenth = country.fourteenth ? (country.minWage * months) / 12 : 0;
            const total = thirteenth + fourteenth;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Meses Trabajados', value: `${months}` },
                    { label: '13º Sueldo', value: `${country.currencySymbol} ${thirteenth.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: '14º Sueldo', value: `${country.currencySymbol} ${fourteenth.toLocaleString('es', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: 'El 13º sueldo (aguinaldo) se calcula sobre el sueldo. El 14º sueldo sobre el salario mínimo.'
    },
    
    vacaciones: {
        id: 'vacaciones',
        icon: '🏖️',
        title: 'Vacaciones',
        description: 'Calcula el pago de vacaciones',
        fields: [
            { id: 'vac-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'vac-days', label: 'Días de Vacaciones', type: 'number', placeholder: '15', min: 1, max: 60 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['vac-salary']) || 0;
            const days = parseFloat(values['vac-days']) || 0;
            
            const dailyRate = salary / 30;
            const total = dailyRate * days;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Tasa Diaria', value: `${country.currencySymbol} ${dailyRate.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Días', value: `${days}` }
                ]
            };
        },
        legalInfo: 'Las vacaciones se calculan sobre la base del sueldo mensual dividido entre 30 días.'
    },
    
    utilidades: {
        id: 'utilidades',
        icon: '💰',
        title: 'Utilidades/Participación',
        description: 'Calcula participación en utilidades de la empresa',
        fields: [
            { id: 'util-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'util-months', label: 'Meses en el Año', type: 'number', placeholder: '12', min: 1, max: 12 },
            { id: 'util-percent', label: '% Utilidades', type: 'number', placeholder: '10', min: 0, max: 100 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['util-salary']) || 0;
            const months = parseFloat(values['util-months']) || 0;
            const percent = parseFloat(values['util-percent']) || 10;
            
            const annual = salary * months;
            const total = annual * (percent / 100);
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Meses Trabajados', value: `${months}` },
                    { label: 'Porcentaje', value: `${percent}%` }
                ]
            };
        },
        legalInfo: 'Las utilidades se calculan sobre el total de ingresos anuales. El porcentaje varía según país y sector.'
    },
    
    horas_extra: {
        id: 'horas_extra',
        icon: '⏰',
        title: 'Horas Extra',
        description: 'Calcula pago por horas adicionales trabajadas',
        fields: [
            { id: 'he-salary', label: 'Sueldo Mensual', type: 'number', placeholder: '5000', min: 0 },
            { id: 'he-hours', label: 'Horas Extra', type: 'number', placeholder: '10', min: 0, max: 200 },
            { id: 'he-multiplier', label: 'Multiplicador', type: 'number', placeholder: '1.5', min: 1, max: 3, step: 0.5 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['he-salary']) || 0;
            const hours = parseFloat(values['he-hours']) || 0;
            const multiplier = parseFloat(values['he-multiplier']) || 1.5;
            
            const hourlyRate = salary / 240;
            const total = hourlyRate * hours * multiplier;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Mensual', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Tarifa por Hora', value: `${country.currencySymbol} ${hourlyRate.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Horas Extra', value: `${hours}` },
                    { label: 'Multiplicador', value: `${multiplier}x` }
                ]
            };
        },
        legalInfo: 'Las horas extra se calculan sobre la tarifa horaria. Multiplicador común: 1.5x (diurnas), 2x (nocturnas), 2.5x (festivos).'
    },
    
    freelance: {
        id: 'freelance',
        icon: '👨‍💼',
        title: 'Freelance vs Planilla',
        description: 'Compara ingresos freelance equivalentes a sueldo en planilla',
        fields: [
            { id: 'free-salary', label: 'Sueldo en Planilla', type: 'number', placeholder: '5000', min: 0 }
        ],
        calculate: (values, country) => {
            const salary = parseFloat(values['free-salary']) || 0;
            
            const benefits = salary * 0.30;
            const taxes = salary * 0.10;
            const total = salary + benefits + taxes;
            
            return {
                total,
                details: [
                    { label: 'Sueldo Base', value: `${country.currencySymbol} ${salary.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Beneficios (30%)', value: `+${country.currencySymbol} ${benefits.toLocaleString('es', { minimumFractionDigits: 2 })}` },
                    { label: 'Impuestos (10%)', value: `+${country.currencySymbol} ${taxes.toLocaleString('es', { minimumFractionDigits: 2 })}` }
                ]
            };
        },
        legalInfo: 'Como freelance debes compensar beneficios (aguinaldo, vacaciones, CTS) e impuestos que el empleador cubriría.'
    }
};