const jobs = [
    {n:"Ingeniero de Minas", min:9000, max:25000, i:"⛏️", d:"Liderazgo en operaciones extractivas.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Arquitecto de IA", min:15000, max:40000, i:"🧠", d:"Estructuración de redes neuronales.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Ciberseguridad Pro", min:7000, max:20000, i:"🛡️", d:"Protección de infraestructuras críticas.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Growth Hacker", min:5000, max:15000, i:"📈", d:"Estrategias de crecimiento acelerado.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Especialista ESG", min:6000, max:18000, i:"🌱", d:"Consultoría en sostenibilidad ambiental.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Chef de Innovación", min:4000, max:12000, i:"👨‍🍳", d:"Desarrollo de nuevas líneas gastronómicas.", l:"https://www.empleosperu.gob.pe/"},
    {n:"Operador Drone", min:3000, max:8500, i:"🛸", d:"Monitoreo agrícola y topografía aérea.", l:"https://www.empleosperu.gob.pe/"}
];

const currencies = [
    {id:"USD", n:"Dólar USA", p:3.75, h:[3.71, 3.73, 3.75, 3.74, 3.75, 3.76, 3.75]},
    {id:"EUR", n:"Euro", p:4.10, h:[4.05, 4.08, 4.10, 4.12, 4.09, 4.10, 4.10]},
    {id:"BTC", n:"Bitcoin", p:102000, h:[98000, 99500, 101000, 103000, 102500, 102000, 102000]},
    {id:"CLP", n:"Peso Chileno", p:0.0041, h:[0.0040, 0.0042, 0.0041, 0.0041, 0.0041, 0.0041, 0.0041]},
    {id:"MXN", n:"Peso Mexicano", p:0.22, h:[0.21, 0.22, 0.23, 0.22, 0.22, 0.22, 0.22]},
    {id:"GBP", n:"Libra Esterlina", p:4.80, h:[4.75, 4.78, 4.80, 4.82, 4.81, 4.80, 4.80]},
    {id:"BRL", n:"Real Brasil", p:0.75, h:[0.73, 0.74, 0.75, 0.76, 0.75, 0.75, 0.75]},
    {id:"JPY", n:"Yen Japonés", p:0.025, h:[0.024, 0.025, 0.026, 0.025, 0.025, 0.025, 0.025]},
    {id:"CAD", n:"Dólar Canadiense", p:2.80, h:[2.75, 2.78, 2.80, 2.82, 2.81, 2.80, 2.80]},
    {id:"AUD", n:"Dólar Australiano", p:2.50, h:[2.45, 2.48, 2.50, 2.52, 2.51, 2.50, 2.50]}
];