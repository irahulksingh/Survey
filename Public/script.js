const questions = [
  {
    text: "När du ska köpa leksaker, vart vänder du dig först? Rangordna (1–5):",
    options: ["Fysisk leksaksbutik", "Nätbutik baserad i Sverige", "Åhléns", "Internationell e-handelsplattform", "Varuhus/lågprisbutik"]
  },
  {
    text: "Vilken faktor påverkar mest ditt val av butik vid köp av leksaker? Rangordna (1–5):",
    options: ["Pris", "Leveranstid", "Sortiment/Produktutbud", "Kundservice och rådgivning", "Enkelhet att beställa"]
  },
  {
    text: "Vilken betalningsmetod föredrar du när du handlar leksaker online? Rangordna (1–5):",
    options: ["Klarna", "Kredit-/betalkort", "Swish", "PayPal", "Direkt bankbetalning"]
  },
  {
    text: "Vilket alternativ påverkar mest din nöjdhet vid köp av leksaker online? Rangordna (1–5):",
    options: ["Snabb leverans", "Fri frakt", "Enkel returhantering", "Kundsupportens tillgänglighet", "Produktens kvalitet jämfört med priset"]
  },
  {
    text: "Vilka sociala medier påverkar mest ditt beslut att köpa leksaker? Rangordna (1–5):",
    options: ["Facebook", "Instagram", "TikTok", "YouTube", "Inget socialt media påverkar mig"]
  },
  {
    text: "Vad skulle få dig att handla oftare från Åhléns? Rangordna (1–5):",
    options: ["Lägre priser", "Snabbare leveranser", "Större sortiment", "Fler kampanjer och erbjudanden", "Mer hållbara och miljövänliga produkter"]
  },
  {
    text: "Hur viktig är hållbarhet när du väljer leksaker? Rangordna (1–5):",
    options: ["Viktigast av allt", "Mycket viktigt", "Ganska viktigt", "Mindre viktigt", "Oviktigt"]
  },
  {
    text: "Hur upptäcker du oftast nya leksaksprodukter? Rangordna (1–5):",
    options: ["Rekommendationer från vänner/familj", "Sociala medier och influencers", "Reklam", "Besök i fysiska butiker", "Själv söka online"]
  },
  {
    text: "Vilken åldersgrupp handlar du främst leksaker till? Rangordna (1–5):",
    options: ["0–2 år", "3–5 år", "6–9 år", "10–12 år", "Över 12 år"]
  },
  {
    text: "Vad är viktigast vid köp av presenter (leksaker)? Rangordna (1–5):",
    options: ["Produkten är trendig/populär", "Produkten är unik/originell", "Produkten är pedagogisk", "Produkten är hållbar/miljövänlig", "Produkten är prisvärd"]
  },
  {
    text: "Vilken typ av leksaker köper du oftast? Rangordna (1–5):",
    options: ["Traditionella leksaker", "Elektroniska leksaker", "Pyssel och kreativitet", "Utomhusleksaker", "Samlarprodukter"]
  },
  {
    text: "Om du skulle välja bort en butik eller e-handel, vad skulle vara främsta anledningen? Rangordna (1–5):",
    options: ["Höga priser", "Dålig kundservice", "Lång leveranstid", "Dåligt sortiment", "Komplicerad returprocess"]
  }
];

const form = document.getElementById('surveyForm');

questions.forEach((q, index) => {
  const div = document.createElement('div');
  div.className = 'question';
  div.innerHTML = `<h3>${q.text}</h3>`;
  q.options.forEach(opt => {
    div.innerHTML += `
      <div class="option">
        ${opt}
        <select name="q${index}" class="rankSelect">
          <option value="">Välj</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
    `;
  });
  form.appendChild(div);
});

document.getElementById('submitBtn').addEventListener('click', async () => {
  const allSelects = document.querySelectorAll('.rankSelect');
  const answers = {};
  let valid = true;

  for (let i = 0; i < questions.length; i++) {
    const selects = document.querySelectorAll(`select[name="q${i}"]`);
    const ranks = [...selects].map(s => s.value);
    if (new Set(ranks).size !== 5 || ranks.includes("")) {
      alert(`Var god rangordna unikt från 1 till 5 för fråga ${i + 1}.`);
      valid = false;
      break;
    }
    answers[`q${i}`] = {};
    questions[i].options.forEach((opt, j) => {
      answers[`q${i}`][opt] = ranks[j];
    });
  }

  if (!valid) return;

  await fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers)
  });

  form.style.display = 'none';
  document.getElementById('submitBtn').style.display = 'none';
  showResults();
});

async function showResults() {
  const res = await fetch('/results');
  const data = await res.json();
  document.getElementById('resultChart').style.display = 'block';

  const labels = [];
  const datasets = [];

  Object.keys(data).forEach((qKey, idx) => {
    Object.keys(data[qKey]).forEach((opt, optIdx) => {
      if (!labels.includes(opt)) labels.push(opt);
    });
  });

  Object.keys(data).forEach((qKey, idx) => {
    const dataset = {
      label: `Fråga ${parseInt(qKey.replace('q', '')) + 1}`,
      data: labels.map(opt => data[qKey][opt] || 0),
      backgroundColor: `hsl(${idx * 30}, 70%, 50%)`
    };
    datasets.push(dataset);
  });

  new Chart(document.getElementById('resultChart'), {
    type: 'bar',
    data: {
      labels,
      datasets
    },
    options: {
      responsive: true,
      plugins: { legend: { position: 'top' } },
      title: { display: true, text: 'Ackumulerade Resultat' }
    }
  });
}
