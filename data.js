// data.js - Base de Datos SueldoPro 2026
const i18n = {
    es: {
        g_neto_t: "Calculadora de Sueldo Neto 2026",
        g_neto_txt: "Cálculo basado en la UIT 2026 de S/ 5,500. Incluye retenciones de 5ta categoría y aportes de AFP."
    }
};

const jobs = [
    {n:"Ingeniero de Minas", min:9000, max:22000, i:"⛏️", d:"Gestión técnica y operativa de proyectos mineros.", l:"#"},
    {n:"Ingeniero de IA", min:9000, max:28000, i:"🤖", d:"Desarrollo de sistemas inteligentes.", l:"#"},
    {n:"Arquitecto de IA", min:15000, max:35000, i:"🧠", d:"Diseño de arquitecturas avanzadas.", l:"#"},
    {n:"Influencer", min:4000, max:30000, i:"🌟", d:"Monetización de audiencia digital.", l:"#"}
];

// Notificar al script que los datos están listos
if (window.notifyDataReady) {
    window.notifyDataReady();
} else {
    // Si el script aún no carga, guardamos el estado en una variable global
    window.dataIsLoaded = true;
}