const tbody = document.querySelector("#steps tbody");
const resultat = document.getElementById("resultat");
let dividendInput = document.getElementById("dividend");
let divisorInput = document.getElementById("divisor");

document.getElementById("add-step").addEventListener("click", addStep);
document.getElementById("help").addEventListener("click", giveHelp);
document.getElementById("nova").addEventListener("click", resetDivision);

function addStep() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type='number' class='multi'></td>
    <td><input type='number' class='prod'></td>
    <td><input type='number' class='resta'></td>
  `;
  tbody.appendChild(tr);
}

function giveHelp() {
  const a = parseInt(dividendInput.value);
  const b = parseInt(divisorInput.value);
  if (isNaN(a) || isNaN(b) || b === 0) return alert("Introdueix valors vàlids.");
  const quocient = Math.floor(a / b);
  alert(`Pista: ${a} ÷ ${b} = ${quocient} (resta ${a % b})`);
}

function resetDivision() {
  tbody.innerHTML = "";
  resultat.classList.add("hidden");
}

document.addEventListener("input", () => {
  const a = parseInt(dividendInput.value);
  const b = parseInt(divisorInput.value);
  if (!a || !b) return;

  let totalProd = 0;
  let totalMulti = 0;
  const rows = tbody.querySelectorAll("tr");
  rows.forEach((r) => {
    const multi = parseInt(r.querySelector(".multi")?.value) || 0;
    const prod = parseInt(r.querySelector(".prod")?.value) || 0;
    totalProd += prod;
    totalMulti += multi;
  });

  if (totalProd === a) {
    resultat.textContent = `✅ Correcte! El quocient és ${totalMulti}.`;
    resultat.classList.remove("hidden");
  } else {
    resultat.textContent = `Encara no: la suma dels productes és ${totalProd}.`;
    resultat.classList.remove("hidden");
  }
});
