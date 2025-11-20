// game.js

let cases = [];
let currentCaseIndex = null;
let selectedSuspectId = null;
let lastResultWasCorrect = false;

// FALLBACK LOCAL CASOS (usado se o fetch do cases.json falhar)
const fallbackCases = [
  {
    id: 1,
    title: "O Quadro Desaparecido",
    difficulty: "Fácil",
    location: "Museu Municipal de Arte",
    intro: "Um quadro famoso sumiu poucas horas antes da abertura de uma grande exposição.",
    story:
      "Você é chamado ao Museu Municipal de Arte quando o diretor descobre que 'A Noite Sobre o Vale', a pintura mais valiosa da exposição, desapareceu do cofre. Apenas três pessoas tiveram acesso à sala do cofre na última hora antes do sumiço.",
    clues: [
      "O sistema de segurança registra que o cofre foi aberto apenas uma vez naquele período.",
      "A câmera próxima ao corredor do cofre ficou com a lente borrada por alguns minutos.",
      "A chave reserva do cofre está intacta e lacrada dentro da sala do diretor."
    ],
    suspects: [
      {
        id: "marina",
        name: "Marina – Curadora",
        description:
          "Responsável pela exposição. Conhece bem o cofre e o sistema, mas afirma que estava em reunião com patrocinadores."
      },
      {
        id: "jorge",
        name: "Jorge – Segurança",
        description:
          "De plantão no turno. Diz que fez rondas normais e não viu nada suspeito, apenas 'um problema técnico' na câmera."
      },
      {
        id: "luisa",
        name: "Luísa – Restauradora",
        description:
          "Trabalhava em outra sala, limpando pinturas menores. Disse que não tem acesso ao cofre principal."
      }
    ],
    question: "Quem roubou o quadro?",
    correctSuspectId: "jorge",
    solution:
      "O quadro foi roubado por Jorge. Apenas o segurança poderia intervir diretamente nas câmeras sem levantar suspeitas. O sistema mostra que o cofre foi aberto apenas uma vez, o que indica uso de credenciais legítimas. Marina estava em reunião com várias testemunhas e a chave reserva nunca foi tocada. Já Jorge tinha acesso ao cofre e foi quem relatou 'problema técnico' na câmera exatamente quando o roubo aconteceu."
  },
  {
    id: 2,
    title: "O Veneno no Café",
    difficulty: "Médio",
    location: "Redação do Jornal Cidade Viva",
    intro:
      "Um editor-chefe desmaia após tomar café durante o fechamento de uma matéria importante.",
    story:
      "Na redação cheia e caótica, o editor-chefe, Augusto, toma seu café habitual e minutos depois passa mal, sendo levado desacordado ao hospital. Os médicos indicam suspeita de envenenamento. Apenas três pessoas estiveram perto da mesa de Augusto naquele intervalo.",
    clues: [
      "A caneca de Augusto estava limpa no início do dia; ele sempre enchia no mesmo bebedouro.",
      "Uma assistente lembra de ver alguém mexendo na mesa dele pouco antes do incidente.",
      "O relatório do laboratório indica traços de um medicamento forte para pressão, que Augusto não toma."
    ],
    suspects: [
      {
        id: "paula",
        name: "Paula – Repórter",
        description:
          "Envolvida em uma matéria polêmica que Augusto quase cancelou. Afirma que estava no telefone com uma fonte."
      },
      {
        id: "ricardo",
        name: "Ricardo – Estagiário",
        description:
          "Faz café para todos. Diz que apenas deixou o copo de Augusto na mesa e depois saiu para buscar impressões."
      },
      {
        id: "helena",
        name: "Helena – Assistente Pessoal",
        description:
          "Organiza a agenda e a mesa de Augusto. Foi contra a publicação da matéria por medo de processos."
      }
    ],
    question: "Quem adulterou o café de Augusto?",
    correctSuspectId: "helena",
    solution:
      "Helena tinha acesso constante à mesa de Augusto sob o pretexto de organização. O estagiário só deixou o café e saiu, e Paula estava ocupada ao telefone em outra sala. O medicamento encontrado é usado por uma pessoa da família de Helena, segundo colegas, o que explica o acesso ao remédio. Ela não queria que a matéria fosse publicada e tentou apenas afastar Augusto temporariamente, sem chegar a uma tentativa de homicídio declarada."
  },
  {
    id: 3,
    title: "O Notebook Sumido",
    difficulty: "Difícil",
    location: "Empresa de Tecnologia ValeSoft",
    intro:
      "Um protótipo de software sigiloso desaparece junto com o notebook onde estava instalado.",
    story:
      "Durante a madrugada que antecede uma grande apresentação para investidores, o notebook contendo o protótipo exclusivo da empresa desaparece da sala de reuniões. A porta não foi arrombada e o sistema registra três acessos com cartão naquele período.",
    clues: [
      "O histórico de acessos mostra três cartões: o do diretor, o da gerente de projetos e o do técnico de TI.",
      "As câmeras do corredor registram entrada e saída da sala, mas não é possível ver o interior.",
      "O log do sistema de rede mostra um acesso remoto ao protótipo pouco antes do notebook ser desligado."
    ],
    suspects: [
      {
        id: "diretor",
        name: "Carlos – Diretor",
        description:
          "Responsável por negociar com os investidores. Tem acesso total à sala, mas afirma que estava em outra reunião externa."
      },
      {
        id: "gerente",
        name: "Fernanda – Gerente de Projetos",
        description:
          "Conhece profundamente o protótipo e está sobrecarregada com prazos. Entrou na sala para revisar slides."
      },
      {
        id: "ti",
        name: "Bruno – Técnico de TI",
        description:
          "Cuida dos servidores e da rede. Foi chamado para resolver um problema de conexão naquela noite."
      }
    ],
    question: "Quem levou o notebook com o protótipo?",
    correctSuspectId: "ti",
    solution:
      "Bruno, o técnico de TI, tinha o conhecimento necessário para acessar o protótipo remotamente e desativar rastros. O log da rede indica um acesso especializado e desligamento remoto, algo que o diretor e a gerente não costumam fazer. Além disso, seu cartão aparece nos registros na mesma faixa de tempo do desaparecimento. Fernanda usou a sala para revisar slides, mas não teria motivo para sumir com o único protótipo antes da apresentação decisiva."
  }
];

// UTILIDADES DE TELA
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

// Carrega casos a partir do arquivo cases.json
function loadCases() {
  fetch("cases.json")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Falha ao carregar cases.json");
      }
      return res.json();
    })
    .then((data) => {
      cases = Array.isArray(data) ? data : [];
      if (!cases.length) {
        cases = fallbackCases;
      }
      renderCaseList();
      updateBuilderJson();
    })
    .catch((err) => {
      console.warn("Usando fallback de casos locais:", err);
      cases = fallbackCases;
      renderCaseList();
      updateBuilderJson();
    });
}

// Renderiza o mural de casos
function renderCaseList() {
  const listEl = document.getElementById("case-list");
  listEl.innerHTML = "";

  cases.forEach((c, index) => {
    const card = document.createElement("article");
    card.className = "case-card";

    const title = document.createElement("h3");
    title.className = "case-card-title";
    title.textContent = c.title;

    const meta = document.createElement("div");
    meta.className = "case-card-meta";
    const locationSpan = document.createElement("span");
    locationSpan.textContent = c.location || "Local confidencial";
    const difficultySpan = document.createElement("span");
    difficultySpan.className = "pill " + difficultyClass(c.difficulty);
    difficultySpan.textContent = c.difficulty || "N/D";
    meta.appendChild(locationSpan);
    meta.appendChild(difficultySpan);

    const intro = document.createElement("p");
    intro.className = "case-card-intro";
    intro.textContent = c.intro || "";

    const footer = document.createElement("div");
    footer.className = "case-card-footer";

    const idTag = document.createElement("span");
    idTag.style.fontSize = "0.8rem";
    idTag.style.color = "#9ca3af";
    idTag.textContent = `Caso #${c.id ?? index + 1}`;

    const btn = document.createElement("button");
    btn.className = "btn primary small";
    btn.textContent = "Investigar";
    btn.addEventListener("click", () => startCase(index));

    footer.appendChild(idTag);
    footer.appendChild(btn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(intro);
    card.appendChild(footer);

    listEl.appendChild(card);
  });
}

function difficultyClass(d) {
  if (!d) return "";
  const text = d.toLowerCase();
  if (text.includes("fácil") || text.includes("facil")) return "easy";
  if (text.includes("médio") || text.includes("medio")) return "medium";
  if (text.includes("difícil") || text.includes("dificil")) return "hard";
  return "";
}

// Inicia um caso específico
function startCase(index) {
  currentCaseIndex = index;
  selectedSuspectId = null;

  const c = cases[index];

  document.getElementById("play-case-title").textContent = c.title;
  document.getElementById(
    "play-case-meta"
  ).textContent = `${c.location || "Local confidencial"} • Caso #${c.id ?? index + 1}`;

  const diffEl = document.getElementById("play-case-difficulty");
  diffEl.textContent = c.difficulty || "N/D";
  diffEl.className = "pill " + difficultyClass(c.difficulty);

  document.getElementById("play-case-intro").textContent = c.intro || "";
  document.getElementById("play-case-story").textContent = c.story || "";
  document.getElementById("play-case-question").textContent = c.question || "";

  // Pistas
  const cluesEl = document.getElementById("play-clues");
  cluesEl.innerHTML = "";
  (c.clues || []).forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = "• " + clue;
    cluesEl.appendChild(li);
  });

  // Suspeitos
  const suspectsEl = document.getElementById("play-suspects");
  suspectsEl.innerHTML = "";
  (c.suspects || []).forEach((s) => {
    const card = document.createElement("div");
    card.className = "suspect-card";
    card.dataset.suspectId = s.id || s.name;

    const name = document.createElement("div");
    name.className = "suspect-name";
    name.textContent = s.name;

    const desc = document.createElement("div");
    desc.className = "suspect-desc";
    desc.textContent = s.description || "";

    card.appendChild(name);
    card.appendChild(desc);

    card.addEventListener("click", () => selectSuspect(card));

    suspectsEl.appendChild(card);
  });

  updateSelectedSuspectBox();
  showScreen("screen-case-play");
}

// Seleciona um suspeito
function selectSuspect(cardEl) {
  const suspectId = cardEl.dataset.suspectId;
  selectedSuspectId = suspectId;

  document.querySelectorAll(".suspect-card").forEach((el) => {
    el.classList.toggle("selected", el === cardEl);
  });

  updateSelectedSuspectBox();
}

function updateSelectedSuspectBox() {
  const box = document.getElementById("selected-suspect-box");
  if (!selectedSuspectId || currentCaseIndex === null) {
    box.textContent = "Nenhum suspeito selecionado.";
    return;
  }
  const c = cases[currentCaseIndex];
  const s = (c.suspects || []).find(
    (sus) => (sus.id || sus.name) === selectedSuspectId
  );
  if (s) {
    box.textContent = `Você selecionou: ${s.name}`;
  } else {
    box.textContent = "Nenhum suspeito selecionado.";
  }
}

// Verifica acusação
function checkAccusation() {
  if (currentCaseIndex === null) return;

  const c = cases[currentCaseIndex];
  if (!selectedSuspectId) {
    alert("Escolha um suspeito antes de acusar.");
    return;
  }

  const correct = c.correctSuspectId || "";
  const isCorrect =
    normalizeId(selectedSuspectId) === normalizeId(correct) ||
    normalizeId(findSuspectNameById(c, selectedSuspectId)) === normalizeId(correct);

  lastResultWasCorrect = isCorrect;

  const resultTitleEl = document.getElementById("result-title");
  const resultSummaryEl = document.getElementById("result-summary");
  const resultSolutionEl = document.getElementById("result-solution");

  if (isCorrect) {
    resultTitleEl.textContent = "Caso resolvido!";
    resultSummaryEl.textContent =
      "Parabéns, detetive! Sua análise foi precisa e o verdadeiro culpado foi identificado.";
  } else {
    resultTitleEl.textContent = "Acusação incorreta...";
    resultSummaryEl.textContent =
      "Dessa vez o verdadeiro culpado escapou. Revise as pistas com atenção e tente novamente.";
  }

  resultSolutionEl.textContent =
    c.solution ||
    "Nenhuma explicação detalhada foi fornecida para este caso. Adicione uma solução no JSON para orientar o jogador.";

  showScreen("screen-result");
}

function normalizeId(str) {
  if (!str) return "";
  return String(str).toLowerCase().trim();
}

function findSuspectNameById(c, suspectId) {
  const s = (c.suspects || []).find(
    (sus) => (sus.id || sus.name) === suspectId
  );
  return s ? s.name : "";
}

// BUILDER / JSON
function updateBuilderJson() {
  const out = document.getElementById("json-output");
  if (out) {
    out.value = JSON.stringify(cases, null, 2);
  }
}

function openBuilder() {
  updateBuilderJson();
  document.getElementById("builder-modal").classList.remove("hidden");
}

function closeBuilder() {
  document.getElementById("builder-modal").classList.add("hidden");
}

// Adiciona um novo caso rápido via formulário
function addCaseFromBuilder() {
  const title = document.getElementById("b-title").value.trim();
  const difficulty = document.getElementById("b-difficulty").value.trim();
  const location = document.getElementById("b-location").value.trim();
  const intro = document.getElementById("b-intro").value.trim();
  const story = document.getElementById("b-story").value.trim();
  const cluesRaw = document.getElementById("b-clues").value.trim();
  const suspectsRaw = document.getElementById("b-suspects").value.trim();
  const answer = document.getElementById("b-answer").value.trim();
  const solution = document.getElementById("b-solution").value.trim();

  if (!title || !answer || !suspectsRaw) {
    alert("Preencha pelo menos título, suspeitos e o culpado.");
    return;
  }

  const clues = cluesRaw
    ? cluesRaw.split(";").map((c) => c.trim()).filter((c) => c)
    : [];

  const suspectNames = suspectsRaw
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s);

  const suspects = suspectNames.map((name) => ({
    id: slugify(name),
    name,
    description: ""
  }));

  const newCase = {
    id: nextCaseId(),
    title,
    difficulty: difficulty || "Médio",
    location: location || "Local confidencial",
    intro,
    story,
    clues,
    suspects,
    question: `Quem é o culpado no caso "${title}"?`,
    correctSuspectId: slugify(answer),
    solution: solution || "Descreva aqui a explicação completa da solução do caso."
  };

  cases.push(newCase);
  renderCaseList();
  updateBuilderJson();

  // Limpa alguns campos
  document.getElementById("b-title").value = "";
  document.getElementById("b-intro").value = "";
  document.getElementById("b-story").value = "";
  document.getElementById("b-clues").value = "";
  document.getElementById("b-suspects").value = "";
  document.getElementById("b-answer").value = "";
  document.getElementById("b-solution").value = "";

  alert("Caso adicionado ao JSON. Não esqueça de baixar o novo cases.json!");
}

function nextCaseId() {
  if (!cases.length) return 1;
  const maxId = cases.reduce(
    (acc, c) => Math.max(acc, typeof c.id === "number" ? c.id : 0),
    0
  );
  return maxId + 1;
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Copiar JSON
function copyJsonToClipboard() {
  const out = document.getElementById("json-output");
  out.select();
  out.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("JSON copiado para a área de transferência.");
}

// Baixar cases.json
function downloadJsonFile() {
  const dataStr = JSON.stringify(cases, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cases.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// EVENTOS / INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  // Carrega casos
  loadCases();

  // Navegação principal
  document.getElementById("btn-start").addEventListener("click", () => {
    showScreen("screen-case-list");
  });

  document
    .getElementById("btn-back-from-list")
    .addEventListener("click", () => showScreen("screen-start"));

  document
    .getElementById("btn-back-to-list")
    .addEventListener("click", () => showScreen("screen-case-list"));

  document
    .getElementById("btn-accuse")
    .addEventListener("click", checkAccusation);

  document
    .getElementById("btn-result-list")
    .addEventListener("click", () => showScreen("screen-case-list"));

  document
    .getElementById("btn-result-retry")
    .addEventListener("click", () => {
      if (currentCaseIndex !== null) {
        startCase(currentCaseIndex);
      } else {
        showScreen("screen-case-list");
      }
    });

  // Builder / JSON
  document
    .getElementById("btn-open-builder")
    .addEventListener("click", openBuilder);
  document
    .getElementById("btn-close-builder")
    .addEventListener("click", closeBuilder);

  document
    .getElementById("btn-add-case")
    .addEventListener("click", addCaseFromBuilder);

  document
    .getElementById("btn-copy-json")
    .addEventListener("click", copyJsonToClipboard);

  document
    .getElementById("btn-download-json")
    .addEventListener("click", downloadJsonFile);
});
