// ==========================================
// SUELDOPRO 2026 - FINTECH ELITE PLATFORM
// ==========================================

'use strict';

// Constants & Configuration
const CONFIG = {
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

// Global State Management
const state = {
    currentCalculator: 'cts',
    currentSection: 'calculators',
    currentLang: 'es',
    theme: 'light',
    charts: {},
    selectedCurrency: 'USD',
    selectedSector: 'all'
};

// ==========================================
// INTERNATIONALIZATION (i18n)
// ==========================================
const translations = {
    es: {
        nav: {
            calculators: 'Calculadoras',
            calculators_sub: '8 herramientas',
            intelligence: 'Inteligencia Salarial',
            comparator: 'Comparador',
            comparator_sub: 'Por industria',
            forex: 'Tipo de Cambio',
            jobs: 'Empleos',
            news: 'Noticias',
            news_sub: 'Actualidad'
        },
        disclaimer: 'Los cálculos son referenciales basados en la normativa peruana 2026. Consulte con un especialista para casos específicos.',
        calc: {
            title: 'Motor',
            title_2: 'Financiero',
            subtitle: 'Normativa Peruana 2026 • UIT S/ 5,500',
            select: 'Selecciona cálculo',
            cts_sub: 'Compensación',
            neto: 'Sueldo Neto',
            neto_sub: 'Líquido mensual',
            grat: 'Gratificación',
            liq: 'Liquidación',
            liq_sub: 'Cese laboral',
            util: 'Utilidades',
            util_sub: 'Reparto anual',
            vac: 'Vacaciones',
            vac_sub: 'Descanso'
        },
        intel: {
            title: 'Inteligencia',
            subtitle: 'Decisiones financieras basadas en data real',
            freelance_title: 'Freelance vs Planilla',
            freelance_sub: 'Equivalencia real',
            salary_planilla: 'Sueldo en Planilla',
            freelance_need: 'Debes facturar',
            market_title: 'Semáforo de Mercado',
            market_sub: 'Posición salarial',
            your_salary: 'Tu sueldo',
            sector: 'Sector',
            escape_title: 'Ruta de Escape',
            escape_sub: 'Autonomía financiera',
            current_cts: 'CTS Actual',
            time_worked: 'Años Lab.',
            monthly_expense: 'Gasto Mensual',
            monthly_salary: 'Sueldo Mensual',
            survive_time: 'Puedes vivir'
        },
        comp: {
            title: 'Comparador',
            subtitle: 'Compara tu sueldo con el mercado peruano',
            your_salary: 'Tu sueldo bruto mensual',
            sector: 'Sector',
            level: 'Nivel'
        },
        forex: {
            title: 'Tipo de'
        },
        jobs: {
            title: 'Radar de'
        },
        news: {
            title: 'Actualidad',
            subtitle: 'Últimas noticias del mercado peruano'
        },
        result: {
            title: 'Resultado',
            share: 'Compartir resultado'
        },
        info: {
            legal: 'Información Legal'
        }
    },
    en: {
        nav: {
            calculators: 'Calculators',
            calculators_sub: '8 tools',
            intelligence: 'Salary Intelligence',
            comparator: 'Comparator',
            comparator_sub: 'By industry',
            forex: 'Exchange Rate',
            jobs: 'Jobs',
            news: 'News',
            news_sub: 'Updates'
        },
        disclaimer: 'Calculations are referential based on Peruvian regulations 2026. Consult with a specialist for specific cases.',
        calc: {
            title: 'Financial',
            title_2: 'Engine',
            subtitle: 'Peruvian Regulations 2026 • UIT S/ 5,500',
            select: 'Select calculation',
            cts_sub: 'Compensation',
            neto: 'Net Salary',
            neto_sub: 'Monthly net',
            grat: 'Bonus',
            liq: 'Severance',
            liq_sub: 'Job termination',
            util: 'Profit Sharing',
            util_sub: 'Annual distribution',
            vac: 'Vacation',
            vac_sub: 'Paid leave'
        },
        intel: {
            title: 'Salary',
            subtitle: 'Data-driven financial decisions',
            freelance_title: 'Freelance vs Payroll',
            freelance_sub: 'Real equivalence',
            salary_planilla: 'Payroll Salary',
            freelance_need: 'You must invoice',
            market_title: 'Market Semaphore',
            market_sub: 'Salary position',
            your_salary: 'Your salary',
            sector: 'Sector',
            escape_title: 'Escape Route',
            escape_sub: 'Financial autonomy',
            current_cts: 'Current CTS',
            time_worked: 'Years Work.',
            monthly_expense: 'Monthly Expense',
            monthly_salary: 'Monthly Salary',
            survive_time: 'You can live for'
        },
        comp: {
            title: 'Salary',
            subtitle: 'Compare your salary with the Peruvian market',
            your_salary: 'Your gross monthly salary',
            sector: 'Sector',
            level: 'Level'
        },
        forex: {
            title: 'Exchange'
        },
        jobs: {
            title: 'Job'
        },
        news: {
            title: 'Labor',
            subtitle: 'Latest news from the Peruvian market'
        },
        result: {
            title: 'Result',
            share: 'Share result'
        },
        info: {
            legal: 'Legal Information'
        }
    }
};

function t(key) {
    const keys = key.split('.');
    let value = translations[state.currentLang];
    for (const k of keys) {
        value = value?.[k];
    }
    return value || key;
}

function updateI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}

// ==========================================
// CORE APPLICATION
// ==========================================
const app = {
    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.classList.toggle('dark');
        state.theme = isDark ? 'dark' : 'light';
        document.getElementById('theme-icon').textContent = isDark ? '☀️' : '🌙';
        
        Object.values(state.charts).forEach(chart => {
            if (chart && chart.options) {
                this.updateChartTheme(chart);
            }
        });
        
        localStorage.setItem('theme', state.theme);
    },

    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.getElementById('theme-icon').textContent = '☀️';
            state.theme = 'dark';
        }
    },

    toggleLanguage() {
        state.currentLang = state.currentLang === 'es' ? 'en' : 'es';
        document.getElementById('lang-text').textContent = state.currentLang.toUpperCase();
        updateI18n();
        localStorage.setItem('language', state.currentLang);
        this.renderCalculatorForm();
    },

    initLanguage() {
        const savedLang = localStorage.getItem('language') || 'es';
        state.currentLang = savedLang;
        document.getElementById('lang-text').textContent = savedLang.toUpperCase();
        updateI18n();
    },

    navigate(sectionId) {
        document.querySelectorAll('.section-content').forEach(s => s.classList.remove('active'));
        document.getElementById(`sec-${sectionId}`).classList.add('active');
        
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`[data-nav="${sectionId}"]`)?.classList.add('active');
        
        state.currentSection = sectionId;
        this.closeMobileMenu();
        
        if (sectionId === 'forex' && !state.charts.forex) {
            this.initForex();
        }
        if (sectionId === 'comparator' && !state.charts.comparison) {
            this.initComparator();
        }
        if (sectionId === 'jobs') {
            this.renderJobs();
        }
        if (sectionId === 'news') {
            this.renderNews();
        }
        if (sectionId === 'intelligence') {
            this.calculateEquivalence();
            this.calculateSemaphore();
            this.calculateEscape();
        }
    },

    setupMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const sidebar = document.getElementById('sidebar');
        
        toggle?.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
            document.body.classList.toggle('sidebar-open');
        });

        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('sidebar-open') &&
                !sidebar.contains(e.target) &&
                !toggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    },

    closeMobileMenu() {
        document.getElementById('sidebar').classList.remove('mobile-open');
        document.body.classList.remove('sidebar-open');
    },

    selectCalculator(calcId) {
        state.currentCalculator = calcId;
        
        document.querySelectorAll('.calc-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-calc="${calcId}"]`)?.classList.add('active');
        
        this.renderCalculatorForm();
    },

    renderCalculatorForm() {
        const container = document.getElementById('calculator-form');
        const calc = CALCULATOR_CONFIGS[state.currentCalculator];
        
        if (!calc) return;
        
        let formHTML = `
            <h3 class="text-xl sm:text-2xl font-black mb-2 dark:text-white">${calc.title[state.currentLang]}</h3>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">${calc.description[state.currentLang]}</p>
        `;
        
        formHTML += calc.fields.map(field => {
            if (field.type === 'number') {
                return `
                    <div class="form-group">
                        <label class="form-label">${field.label[state.currentLang]}</label>
                        <div class="relative">
                            ${field.prefix ? `<span class="absolute left-4 top-1/2 -translate-y-1/2 text-lg sm:text-xl font-black text-slate-400">${field.prefix}</span>` : ''}
                            <input 
                                type="number" 
                                id="${field.id}" 
                                class="form-input ${field.prefix ? 'pl-12 sm:pl-14' : ''}" 
                                placeholder="${field.placeholder || '0.00'}"
                                ${field.value !== undefined ? `value="${field.value}"` : ''}
                                ${field.min !== undefined ? `min="${field.min}"` : ''}
                                ${field.max !== undefined ? `max="${field.max}"` : ''}
                                step="0.01"
                                inputmode="decimal"
                            >
                        </div>
                    </div>
                `;
            } else if (field.type === 'select') {
                return `
                    <div class="form-group">
                        <label class="form-label">${field.label[state.currentLang]}</label>
                        <select id="${field.id}" class="form-select">
                            ${field.options.map(opt => `<option value="${opt.value}">${opt.label[state.currentLang]}</option>`).join('')}
                        </select>
                    </div>
                `;
            }
            return '';
        }).join('');
        
        formHTML += `
            <button id="calc-execute-btn" class="btn-primary mt-4 sm:mt-6">
                ${state.currentLang === 'es' ? 'CALCULAR AHORA' : 'CALCULATE NOW'}
            </button>
        `;
        
        container.innerHTML = formHTML;
        
        document.getElementById('calc-execute-btn')?.addEventListener('click', () => {
            this.executeCalculation();
        });
        
        document.getElementById('legal-info').textContent = calc.legalInfo[state.currentLang];
        
        document.getElementById('main-result').textContent = 'S/ 0.00';
        document.getElementById('result-details').innerHTML = '';
        
        document.querySelectorAll('[data-calc]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const calc = e.currentTarget.getAttribute('data-calc');
                this.selectCalculator(calc);
            });
        });
    },

    executeCalculation() {
        const calc = CALCULATOR_CONFIGS[state.currentCalculator];
        if (!calc || !calc.calculate) return;
        
        const values = {};
        calc.fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (element) {
                values[field.id] = field.type === 'number' 
                    ? parseFloat(element.value) || 0 
                    : element.value;
            }
        });
        
        const result = calc.calculate(values);
        this.displayResult(result);
        
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }
    },

    displayResult(result) {
        const mainResult = document.getElementById('main-result');
        const detailsContainer = document.getElementById('result-details');
        
        mainResult.style.transform = 'scale(0.9)';
        mainResult.style.opacity = '0';
        
        setTimeout(() => {
            mainResult.textContent = this.formatCurrency(result.total);
            mainResult.style.transform = 'scale(1)';
            mainResult.style.opacity = '1';
            mainResult.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }, 150);
        
        if (result.details && result.details.length > 0) {
            detailsContainer.innerHTML = result.details.map(detail => `
                <div class="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span class="text-xs sm:text-sm opacity-90">${detail.label}</span>
                    <span class="font-bold text-sm sm:text-base">${detail.value}</span>
                </div>
            `).join('');
        }
    },

    shareResult() {
        const result = document.getElementById('main-result').textContent;
        const calc = CALCULATOR_CONFIGS[state.currentCalculator];
        const text = `${calc.title[state.currentLang]}: ${result} | SueldoPro 2026`;
        
        if (navigator.share) {
            navigator.share({
                title: 'SueldoPro 2026',
                text: text,
                url: window.location.href
            }).catch(() => {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast(state.currentLang === 'es' ? 'Copiado' : 'Copied');
            });
        }
    },

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-brand-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-sm';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(1rem)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    calculateEquivalence() {
        const planillaSalary = parseFloat(document.getElementById('eq-planilla')?.value) || 0;
        
        if (planillaSalary === 0) {
            document.getElementById('eq-result').textContent = 'S/ 0';
            document.getElementById('eq-breakdown').innerHTML = '';
            return;
        }
        
        const benefitsValue = planillaSalary * CONFIG.BENEFITS_INVISIBLE;
        const freelanceEquivalent = planillaSalary + benefitsValue;
        
        const retentionAmount = freelanceEquivalent > CONFIG.FOURTH_CATEGORY_THRESHOLD 
            ? freelanceEquivalent * CONFIG.FOURTH_CATEGORY_RETENTION 
            : 0;
        const finalFreelance = freelanceEquivalent + retentionAmount;
        
        document.getElementById('eq-result').textContent = this.formatCurrency(finalFreelance);
        document.getElementById('eq-breakdown').innerHTML = `
            <div class="flex justify-between"><span>Sueldo base:</span><span>${this.formatCurrency(planillaSalary)}</span></div>
            <div class="flex justify-between"><span>Beneficios invisibles (18.33%):</span><span>+ ${this.formatCurrency(benefitsValue)}</span></div>
            ${retentionAmount > 0 ? `<div class="flex justify-between"><span>Retención 4ta (8%):</span><span>+ ${this.formatCurrency(retentionAmount)}</span></div>` : ''}
            <div class="flex justify-between font-bold pt-2 border-t border-purple-300"><span>Total mensual:</span><span>${this.formatCurrency(finalFreelance)}</span></div>
        `;
    },

    calculateSemaphore() {
        const salary = parseFloat(document.getElementById('sem-salary')?.value) || 0;
        const sector = document.getElementById('sem-sector')?.value || 'tecnologia';
        
        if (salary === 0) {
            document.getElementById('semaphore-result').innerHTML = '';
            return;
        }
        
        const marketData = this.getMarketRangeForSector(sector);
        const avg = (marketData.min + marketData.max) / 2;
        const lowThreshold = marketData.min + (avg - marketData.min) * 0.5;
        const topThreshold = avg + (marketData.max - avg) * 0.5;
        
        let status, icon, colorClass;
        
        if (salary < lowThreshold) {
            status = state.currentLang === 'es' ? 'BAJO MERCADO' : 'BELOW MARKET';
            icon = '🔴';
            colorClass = 'semaphore-low';
        } else if (salary < topThreshold) {
            status = state.currentLang === 'es' ? 'EN PROMEDIO' : 'AVERAGE';
            icon = '🟡';
            colorClass = 'semaphore-average';
        } else {
            status = state.currentLang === 'es' ? 'TOP MERCADO' : 'TOP MARKET';
            icon = '🟢';
            colorClass = 'semaphore-top';
        }
        
        const percentile = ((salary - marketData.min) / (marketData.max - marketData.min)) * 100;
        
        document.getElementById('semaphore-result').innerHTML = `
            <div class="p-6 rounded-xl ${colorClass}">
                <div class="text-4xl mb-3">${icon}</div>
                <div class="text-xl font-black mb-2">${status}</div>
                <div class="text-sm opacity-80 mb-4">${state.currentLang === 'es' ? 'Percentil' : 'Percentile'}: ${percentile.toFixed(0)}%</div>
                <div class="text-xs pt-3 border-t opacity-70" style="border-color: currentColor;">
                    ${state.currentLang === 'es' ? 'Rango sector' : 'Sector range'}: ${this.formatCurrency(marketData.min)} - ${this.formatCurrency(marketData.max)}
                </div>
            </div>
        `;
    },

    getMarketRangeForSector(sector) {
        const ranges = {
            tecnologia: { min: 2500, max: 12000 },
            mineria: { min: 3500, max: 15000 },
            finanzas: { min: 2800, max: 14000 },
            salud: { min: 2000, max: 10000 },
            comercio: { min: 1800, max: 9000 },
            educacion: { min: 1500, max: 7500 }
        };
        return ranges[sector] || ranges.tecnologia;
    },

    calculateEscape() {
        const ctsAmount = parseFloat(document.getElementById('esc-cts')?.value) || 0;
        const yearsWorked = parseFloat(document.getElementById('esc-years')?.value) || 0;
        const monthlyExpense = parseFloat(document.getElementById('esc-expense')?.value) || 0;
        const monthlySalary = parseFloat(document.getElementById('esc-salary')?.value) || 0;
        
        if (monthlyExpense === 0) {
            document.getElementById('esc-months').textContent = '0 ' + (state.currentLang === 'es' ? 'meses' : 'months');
            document.getElementById('esc-breakdown').innerHTML = '';
            return;
        }
        
        const liquidationEstimate = monthlySalary * yearsWorked * 0.5;
        const vacationDays = Math.min(yearsWorked * 30, 60);
        const vacationAmount = (monthlySalary / 30) * vacationDays;
        
        const totalFund = ctsAmount + liquidationEstimate + vacationAmount;
        const months = totalFund / monthlyExpense;
        
        document.getElementById('esc-months').textContent = `${months.toFixed(1)} ${state.currentLang === 'es' ? 'meses' : 'months'}`;
        document.getElementById('esc-breakdown').innerHTML = `
            <div class="flex justify-between"><span>CTS actual:</span><span>${this.formatCurrency(ctsAmount)}</span></div>
            <div class="flex justify-between"><span>${state.currentLang === 'es' ? 'Liquidación proyectada' : 'Est. severance'}:</span><span>${this.formatCurrency(liquidationEstimate)}</span></div>
            <div class="flex justify-between"><span>${state.currentLang === 'es' ? 'Vacaciones pendientes' : 'Pending vacation'}:</span><span>${this.formatCurrency(vacationAmount)}</span></div>
            <div class="flex justify-between font-bold pt-2 border-t border-orange-300"><span>${state.currentLang === 'es' ? 'Fondo total' : 'Total fund'}:</span><span>${this.formatCurrency(totalFund)}</span></div>
        `;
    },

    initComparator() {
        this.updateComparison();
    },

    updateComparison() {
        const salary = parseFloat(document.getElementById('comp-salary')?.value) || 0;
        const sector = document.getElementById('comp-sector')?.value || 'tecnologia';
        const level = document.getElementById('comp-level')?.value || 'junior';
        
        const ranges = {
            tecnologia: { junior: [2500, 4500], middle: [4500, 7500], senior: [7500, 12000], lead: [12000, 20000] },
            mineria: { junior: [3500, 5500], middle: [5500, 9000], senior: [9000, 15000], lead: [15000, 25000] },
            finanzas: { junior: [2800, 5000], middle: [5000, 8500], senior: [8500, 14000], lead: [14000, 22000] },
            salud: { junior: [2000, 3500], middle: [3500, 6000], senior: [6000, 10000], lead: [10000, 18000] },
            comercio: { junior: [1800, 3000], middle: [3000, 5500], senior: [5500, 9000], lead: [9000, 15000] },
            educacion: { junior: [1500, 2500], middle: [2500, 4500], senior: [4500, 7500], lead: [7500, 12000] }
        };
        
        const range = ranges[sector]?.[level] || [0, 0];
        const [min, max] = range;
        const avg = (min + max) / 2;
        
        const ctx = document.getElementById('comparison-chart');
        
        if (state.charts.comparison) {
            state.charts.comparison.destroy();
        }
        
        const isDark = state.theme === 'dark';
        
        state.charts.comparison = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mínimo', 'Promedio', 'Tu Sueldo', 'Máximo'],
                datasets: [{
                    label: 'Comparación Salarial (S/)',
                    data: [min, avg, salary, max],
                    backgroundColor: [
                        'rgba(59, 130, 246, 0.2)',
                        'rgba(59, 130, 246, 0.5)',
                        salary >= avg ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)',
                        'rgba(59, 130, 246, 0.7)'
                    ],
                    borderColor: [
                        'rgb(59, 130, 246)',
                        'rgb(59, 130, 246)',
                        salary >= avg ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
                        'rgb(59, 130, 246)'
                    ],
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: CONFIG.CHART_ANIMATION_DURATION
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: `${sector.charAt(0).toUpperCase() + sector.slice(1)} - ${level.charAt(0).toUpperCase() + level.slice(1)}`,
                        color: isDark ? '#e2e8f0' : '#1e293b',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: isDark ? '#94a3b8' : '#64748b',
                            callback: value => `S/ ${value.toLocaleString()}`
                        },
                        grid: {
                            color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'
                        }
                    },
                    x: {
                        ticks: {
                            color: isDark ? '#94a3b8' : '#64748b'
                        },
                        grid: { display: false }
                    }
                }
            }
        });
        
        const percentile = min !== max ? ((salary - min) / (max - min)) * 100 : 50;
        const difference = salary - avg;
        
        document.getElementById('comparison-stats').innerHTML = `
            <div class="stat-card">
                <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">${state.currentLang === 'es' ? 'Tu Percentil' : 'Your Percentile'}</div>
                <div class="text-2xl sm:text-3xl font-black text-brand-500">${Math.round(percentile)}%</div>
            </div>
            <div class="stat-card">
                <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">${state.currentLang === 'es' ? 'vs. Promedio' : 'vs. Average'}</div>
                <div class="text-2xl sm:text-3xl font-black ${difference >= 0 ? 'text-success-500' : 'text-danger-500'}">
                    ${difference >= 0 ? '+' : ''}${this.formatCurrency(difference)}
                </div>
            </div>
            <div class="stat-card">
                <div class="text-xs text-slate-500 dark:text-slate-400 font-bold mb-2">${state.currentLang === 'es' ? 'Rango' : 'Range'}</div>
                <div class="text-base sm:text-lg font-black text-slate-700 dark:text-slate-300">
                    ${this.formatCurrency(min)} - ${this.formatCurrency(max)}
                </div>
            </div>
        `;
    },

    initForex() {
        this.renderCurrencyList();
        this.updateForex();
    },

    renderCurrencyList() {
        const list = document.getElementById('forex-list');
        list.innerHTML = window.CURRENCIES.map(currency => `
            <button 
                data-currency="${currency.code}"
                class="currency-card ${currency.code === state.selectedCurrency ? 'active' : ''}"
            >
                <div>
                    <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${currency.name}</div>
                    <div class="text-[10px] text-slate-400">${currency.symbol}</div>
                </div>
                <div class="text-sm font-black text-brand-500">${currency.code}</div>
            </button>
        `).join('');
        
        document.querySelectorAll('[data-currency]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const code = e.currentTarget.getAttribute('data-currency');
                this.selectCurrency(code);
            });
        });
    },

    filterCurrencies() {
        const search = document.getElementById('forex-search')?.value.toLowerCase() || '';
        const buttons = document.querySelectorAll('[data-currency]');
        
        buttons.forEach(btn => {
            const currency = window.CURRENCIES.find(c => c.code === btn.dataset.currency);
            const matches = currency.name.toLowerCase().includes(search) || 
                           currency.code.toLowerCase().includes(search);
            btn.style.display = matches ? 'flex' : 'none';
        });
    },

    selectCurrency(code) {
        state.selectedCurrency = code;
        
        document.querySelectorAll('.currency-card').forEach(card => {
            card.classList.remove('active');
        });
        document.querySelector(`[data-currency="${code}"]`)?.classList.add('active');
        
        this.updateForex();
    },

    updateForex() {
        const amount = parseFloat(document.getElementById('forex-amount')?.value) || 0;
        const currency = window.CURRENCIES.find(c => c.code === state.selectedCurrency);
        
        if (!currency) return;
        
        const converted = amount / currency.rate;
        
        document.getElementById('forex-pair').textContent = `${currency.code}/PEN`;
        document.getElementById('forex-converted').textContent = `${converted.toFixed(2)} ${currency.code}`;
        
        const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
        const baseRate = currency.rate;
        const chartData = labels.map(() => {
            const variance = (Math.random() - 0.5) * 0.04 * baseRate;
            return baseRate + variance;
        });
        
        const ctx = document.getElementById('forex-chart');
        
        if (state.charts.forex) {
            state.charts.forex.destroy();
        }
        
        const isDark = state.theme === 'dark';
        
        state.charts.forex = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: `Tasa ${currency.code}/PEN`,
                    data: chartData,
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(59, 130, 246)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                animation: {
                    duration: CONFIG.CHART_ANIMATION_DURATION
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDark ? 'rgb(30, 41, 59)' : 'white',
                        titleColor: isDark ? 'rgb(226, 232, 240)' : 'rgb(15, 23, 42)',
                        bodyColor: isDark ? 'rgb(148, 163, 184)' : 'rgb(71, 85, 105)',
                        borderColor: isDark ? 'rgb(51, 65, 85)' : 'rgb(226, 232, 240)',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: context => `S/ ${context.parsed.y.toFixed(4)}`
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            color: isDark ? '#94a3b8' : '#64748b',
                            callback: value => `S/ ${value.toFixed(2)}`
                        },
                        grid: {
                            color: isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)'
                        }
                    },
                    x: {
                        ticks: {
                            color: isDark ? '#94a3b8' : '#64748b'
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    },

    updateChartTheme(chart) {
        const isDark = state.theme === 'dark';
        
        if (chart.options.plugins?.title) {
            chart.options.plugins.title.color = isDark ? '#e2e8f0' : '#1e293b';
        }
        
        if (chart.options.scales) {
            ['x', 'y'].forEach(axis => {
                if (chart.options.scales[axis]) {
                    chart.options.scales[axis].ticks.color = isDark ? '#94a3b8' : '#64748b';
                    if (chart.options.scales[axis].grid) {
                        chart.options.scales[axis].grid.color = isDark ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.5)';
                    }
                }
            });
        }
        
        chart.update();
    },

    renderJobs() {
        const search = document.getElementById('job-search')?.value.toLowerCase() || '';
        const filteredJobs = window.JOBS.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(search) ||
                                 job.sector.toLowerCase().includes(search);
            const matchesSector = state.selectedSector === 'all' || 
                                 job.sector.toLowerCase() === state.selectedSector;
            return matchesSearch && matchesSector;
        }).slice(0, 40);
        
        document.getElementById('jobs-grid').innerHTML = filteredJobs.map(job => `
            <div class="job-card">
                <div class="text-3xl sm:text-4xl mb-4">${job.icon}</div>
                <h4 class="text-xs sm:text-sm font-black dark:text-white mb-2 line-clamp-2">${job.title}</h4>
                <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-4">${job.sector}</p>
                <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                        <div class="text-[10px] text-slate-400 font-bold">${state.currentLang === 'es' ? 'Desde' : 'From'}</div>
                        <div class="text-base sm:text-lg font-black text-brand-500">${this.formatCurrency(job.salary)}</div>
                    </div>
                    <a href="${job.link}" target="_blank" rel="noopener" class="px-3 sm:px-4 py-2 bg-brand-500 text-white text-[10px] sm:text-xs font-bold rounded-lg hover:bg-brand-600 transition-colors">
                        ${state.currentLang === 'es' ? 'Ver' : 'View'}
                    </a>
                </div>
            </div>
        `).join('');
    },

    filterJobs() {
        this.renderJobs();
    },

    filterJobsBySector(sector) {
        state.selectedSector = sector;
        
        document.querySelectorAll('.sector-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-sector="${sector}"]`)?.classList.add('active');
        
        this.renderJobs();
    },

    renderNews() {
        document.getElementById('news-grid').innerHTML = window.NEWS.map(article => `
            <div class="news-card">
                <div class="flex items-center gap-2 mb-3 flex-wrap">
                    <span class="px-3 py-1 bg-brand-500 text-white text-[9px] font-black rounded-full uppercase">
                        ${article.source}
                    </span>
                    <span class="text-[10px] text-slate-400">${article.date}</span>
                </div>
                <h4 class="text-sm sm:text-base font-black dark:text-white mb-3 leading-tight">${article.title}</h4>
                <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">${article.description}</p>
                <a href="${article.link}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
                    ${state.currentLang === 'es' ? 'Leer más' : 'Read more'}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
        `).join('');
    },

    formatCurrency(amount) {
        return `S/ ${amount.toLocaleString('es-PE', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        })}`;
    }
};

// Calculator configurations - se cargan desde otro archivo para mantener el código limpio
// Ver continuation en siguiente mensaje por límite de caracteres