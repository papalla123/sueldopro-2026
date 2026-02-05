import { CALCULATORS } from './data.js';

const $ = (id) => document.getElementById(id);

function renderResult(res) {
    $("main-result").innerText = "S/ " + res.total.toFixed(2);
    const det = $("details-container");
    det.innerHTML = "";
    res.details.forEach(d => {
        det.innerHTML += `<div class="flex justify-between text-sm">
            <span>${d[0]}</span>
            <span>S/ ${d[1].toFixed(2)}</span>
        </div>`;
    });
}

window.runCalc = function(type, data) {
    const res = CALCULATORS[type].calculate(data);
    renderResult(res);
    $("legal-info").innerText = CALCULATORS[type].legalInfo;
}
