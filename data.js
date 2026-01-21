// BLOQUE #1 – JOBS (1–100)
const jobs = [
{n:"Ingeniero de Minas",min:9000,max:22000,i:"⛏️",d:"Gestión técnica y operativa de proyectos mineros de gran escala",l:"https://www.google.com/search?q=trabajo+de+ingeniero+de+minas"},
{n:"Operador de Maquinaria Minera",min:4500,max:9000,i:"🚜",d:"Manejo especializado de equipos pesados en operaciones mineras seguras",l:"https://www.google.com/search?q=trabajo+de+operador+maquinaria+minera"},
{n:"Geólogo",min:6000,max:14000,i:"🪨",d:"Análisis del suelo para exploración y explotación responsable minera",l:"https://www.google.com/search?q=trabajo+de+geologo"},
{n:"Supervisor de Seguridad Minera",min:7000,max:16000,i:"🦺",d:"Control de riesgos laborales y cumplimiento normativo en minas",l:"https://www.google.com/search?q=trabajo+de+supervisor+seguridad+minera"},
{n:"Ingeniero Metalúrgico",min:6500,max:15000,i:"⚙️",d:"Optimización de procesos metalúrgicos para máxima eficiencia productiva",l:"https://www.google.com/search?q=trabajo+de+ingeniero+metalurgico"},

{n:"Pescador Industrial",min:3500,max:8000,i:"🎣",d:"Extracción marina a gran escala cumpliendo normas pesqueras nacionales",l:"https://www.google.com/search?q=trabajo+de+pescador+industrial"},
{n:"Capitán de Pesca",min:7000,max:15000,i:"🚢",d:"Dirección de embarcaciones pesqueras y gestión de tripulación marítima",l:"https://www.google.com/search?q=trabajo+de+capitan+de+pesca"},
{n:"Técnico en Acuicultura",min:3000,max:6500,i:"🐟",d:"Producción controlada de especies acuáticas para consumo sostenible",l:"https://www.google.com/search?q=trabajo+de+tecnico+en+acuicultura"},
{n:"Inspector Pesquero",min:4500,max:9500,i:"📋",d:"Fiscalización del cumplimiento legal en actividades extractivas marinas",l:"https://www.google.com/search?q=trabajo+de+inspector+pesquero"},
{n:"Biólogo Marino",min:5000,max:12000,i:"🌊",d:"Estudio científico de ecosistemas marinos y conservación ambiental",l:"https://www.google.com/search?q=trabajo+de+biologo+marino"},

{n:"Agrónomo",min:4000,max:10000,i:"🌱",d:"Optimización de cultivos mediante técnicas agrícolas modernas sostenibles",l:"https://www.google.com/search?q=trabajo+de+agronomo"},
{n:"Ingeniero Agroindustrial",min:5500,max:13000,i:"🏭",d:"Transformación eficiente de productos agrícolas con valor agregado",l:"https://www.google.com/search?q=trabajo+de+ingeniero+agroindustrial"},
{n:"Técnico Agrícola",min:2500,max:5500,i:"🚜",d:"Soporte técnico en producción agrícola y manejo de cultivos",l:"https://www.google.com/search?q=trabajo+de+tecnico+agricola"},
{n:"Especialista en Riego Tecnificado",min:4500,max:11000,i:"💧",d:"Diseño de sistemas hídricos eficientes para agricultura intensiva",l:"https://www.google.com/search?q=trabajo+de+especialista+riego+tecnificado"},
{n:"Exportador Agrícola",min:6000,max:18000,i:"📦",d:"Gestión comercial internacional de productos agrícolas peruanos",l:"https://www.google.com/search?q=trabajo+de+exportador+agricola"},

{n:"Ingeniero Civil",min:6000,max:16000,i:"🏗️",d:"Diseño y ejecución de infraestructuras públicas y privadas seguras",l:"https://www.google.com/search?q=trabajo+de+ingeniero+civil"},
{n:"Arquitecto",min:5000,max:14000,i:"📐",d:"Diseño funcional y estético de espacios habitables modernos",l:"https://www.google.com/search?q=trabajo+de+arquitecto"},
{n:"Maestro de Obra",min:3500,max:8000,i:"🧱",d:"Supervisión práctica de construcción cumpliendo planos y cronogramas",l:"https://www.google.com/search?q=trabajo+de+maestro+de+obra"},
{n:"Topógrafo",min:4000,max:9000,i:"📏",d:"Medición precisa de terrenos para proyectos de ingeniería",l:"https://www.google.com/search?q=trabajo+de+topografo"},
{n:"Ingeniero Sanitario",min:5500,max:13000,i:"🚰",d:"Diseño de sistemas de agua potable y saneamiento urbano",l:"https://www.google.com/search?q=trabajo+de+ingeniero+sanitario"},

{n:"Médico General",min:7000,max:16000,i:"🩺",d:"Atención integral de pacientes en consulta clínica general",l:"https://www.google.com/search?q=trabajo+de+medico+general"},
{n:"Enfermero",min:4000,max:9000,i:"💉",d:"Cuidado directo del paciente y apoyo clínico hospitalario",l:"https://www.google.com/search?q=trabajo+de+enfermero"},
{n:"Tecnólogo Médico",min:4500,max:10000,i:"🧪",d:"Diagnóstico clínico mediante análisis especializados de laboratorio",l:"https://www.google.com/search?q=trabajo+de+tecnologo+medico"},
{n:"Psicólogo",min:3500,max:9000,i:"🧠",d:"Evaluación y tratamiento de salud mental en pacientes",l:"https://www.google.com/search?q=trabajo+de+psicologo"},
{n:"Odontólogo",min:5000,max:14000,i:"🦷",d:"Prevención y tratamiento de salud bucal integral",l:"https://www.google.com/search?q=trabajo+de+odontologo"},

{n:"Profesor Escolar",min:2800,max:6000,i:"📚",d:"Formación académica integral de estudiantes en educación básica",l:"https://www.google.com/search?q=trabajo+de+profesor+escolar"},
{n:"Docente Universitario",min:5000,max:15000,i:"🎓",d:"Enseñanza especializada y desarrollo académico de profesionales",l:"https://www.google.com/search?q=trabajo+de+docente+universitario"},
{n:"Director Educativo",min:7000,max:16000,i:"🏫",d:"Gestión estratégica de instituciones educativas públicas o privadas",l:"https://www.google.com/search?q=trabajo+de+director+educativo"},
{n:"Psicopedagogo",min:4000,max:9500,i:"🧩",d:"Apoyo educativo especializado para mejorar procesos de aprendizaje",l:"https://www.google.com/search?q=trabajo+de+psicopedagogo"},
{n:"Tutor Académico",min:3000,max:7000,i:"✏️",d:"Acompañamiento personalizado para mejorar rendimiento estudiantil",l:"https://www.google.com/search?q=trabajo+de+tutor+academico"},

{n:"Contador",min:4500,max:12000,i:"📊",d:"Gestión contable, tributaria y financiera de organizaciones",l:"https://www.google.com/search?q=trabajo+de+contador"},
{n:"Auditor",min:6000,max:15000,i:"🔍",d:"Revisión financiera y control interno para cumplimiento normativo",l:"https://www.google.com/search?q=trabajo+de+auditor"},
{n:"Administrador de Empresas",min:5000,max:14000,i:"🏢",d:"Gestión eficiente de recursos y operaciones empresariales",l:"https://www.google.com/search?q=trabajo+de+administrador+de+empresas"},
{n:"Economista",min:5500,max:15000,i:"📈",d:"Análisis económico para toma de decisiones estratégicas",l:"https://www.google.com/search?q=trabajo+de+economista"},
{n:"Analista Financiero",min:6000,max:16000,i:"💹",d:"Evaluación de inversiones y proyecciones financieras empresariales",l:"https://www.google.com/search?q=trabajo+de+analista+financiero"},

{n:"Desarrollador Web",min:5000,max:15000,i:"💻",d:"Creación de aplicaciones y sitios web funcionales modernos",l:"https://www.google.com/search?q=trabajo+de+desarrollador+web"},
{n:"Ingeniero de Software",min:7000,max:20000,i:"🧑‍💻",d:"Diseño y mantenimiento de sistemas de software escalables",l:"https://www.google.com/search?q=trabajo+de+ingeniero+de+software"},
{n:"Analista de Datos",min:6500,max:18000,i:"📊",d:"Interpretación de datos para generar valor estratégico",l:"https://www.google.com/search?q=trabajo+de+analista+de+datos"},
{n:"Ingeniero de IA",min:9000,max:28000,i:"🤖",d:"Desarrollo de sistemas inteligentes basados en aprendizaje automático",l:"https://www.google.com/search?q=trabajo+de+ingeniero+de+ia"},
{n:"Arquitecto de IA",min:15000,max:35000,i:"🧠",d:"Diseño de arquitecturas avanzadas para soluciones empresariales inteligentes",l:"https://www.google.com/search?q=trabajo+de+arquitecto+de+ia"},

{n:"Community Manager",min:3000,max:8000,i:"📱",d:"Gestión de comunidades digitales y presencia en redes sociales",l:"https://www.google.com/search?q=trabajo+de+community+manager"},
{n:"Creador de Contenido",min:3500,max:12000,i:"🎥",d:"Producción creativa de contenido digital para plataformas online",l:"https://www.google.com/search?q=trabajo+de+creador+de+contenido"},
{n:"Influencer",min:4000,max:30000,i:"🌟",d:"Monetización de audiencia digital mediante marcas y contenido",l:"https://www.google.com/search?q=trabajo+de+influencer"},
{n:"Streamer",min:3000,max:25000,i:"🎮",d:"Transmisiones en vivo generando entretenimiento y comunidad digital",l:"https://www.google.com/search?q=trabajo+de+streamer"},
{n:"Especialista en Marketing Digital",min:5000,max:16000,i:"📣",d:"Estrategias digitales para crecimiento de marcas y ventas",l:"https://www.google.com/search?q=trabajo+de+marketing+digital"}
];
