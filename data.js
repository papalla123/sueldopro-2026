const i18n = {
    es: {
        g_neto_t: "Calculadora de Sueldo Neto 2026",
        g_neto_txt: "Cálculo actualizado con la UIT de S/ 5,500 y escalas de 5ta Categoría."
    }
};

const jobs = [
    {n:"Ingeniero de Minas",min:9000,max:22000,i:"⛏️",d:"Gestión técnica y operativa de proyectos mineros",l:"#"},
    {n:"Ingeniero de IA",min:9000,max:28000,i:"🤖",d:"Desarrollo de sistemas inteligentes",l:"#"},
    {n:"Arquitecto de IA",min:15000,max:35000,i:"🧠",d:"Diseño de arquitecturas avanzadas",l:"#"},
    {n:"Influencer",min:4000,max:30000,i:"🌟",d:"Monetización de audiencia digital",l:"#"}
    // Puedes pegar los otros 100 aquí después, pero primero probemos que funcione.
];

// ESTA LÍNEA ES EL GATILLO QUE ACTIVA TODO
if (window.notifyDataReady) {
    window.notifyDataReady();
}