// ===============================
// VALLEY DETECTIVE - GAME.JS LIMPO
// ===============================

let cases = [];
let currentCaseIndex = -1;
let accusationMade = false;

// CASOS DE EMERGÊNCIA (se o cases.json der erro)
const fallbackCases = [
  {
    id: 1,
    title: "O Quadro Desaparecido",
    difficulty: "Fácil",
    location: "Museu Municipal de Arte",
    intro: "Um quadro famoso sumiu poucas horas antes da abertura de uma grande exposição.",
    story:
      "Você é chamado ao museu quando o diretor descobre que 'A Noite Sobre o Vale' desapareceu do cofre. Apenas três pessoas tiveram acesso ao local nas últimas horas.",
    clues: [
      "A câmera de segurança do corredor foi desligada por 10 minutos.",
      "O segurança noturno jura que ouviu passos apressados às 02h17.",
      "Um dos funcionários tem dívidas altas de jogo."
    ],
    suspects: [
      {
        id: "seguranca",
        name: "Marcelo, o segurança",
        description:
          "Trabalha há 10 anos no museu, parece nervoso e evita contato visual."
      },
      {
        id: "curadora",
        name: "Dra. Helena, a curadora",
        description:
          "Conhece cada obra de arte em detalhe. Foi a última a sair antes do sumiço."
      },
      {
        id: "estagiario",
        name: "Jonas, o estagiário",
        description:
          "Jovem entusiasmado, mas com pouco acesso às áreas restritas."
      }
    ],
    correctSuspectId: "curadora",
    solutionText:
      "A curadora tinha a senha do cofre, conhecia a rotina de segurança e aproveitou a falha na câmera para agir."
  }
];

// --------------- FUNÇÕES DE APOIO ---------------

// Tenta pegar um botão por ID ou pelo texto escrito nele
function getButton(possibleIds, textSnippet) {
  // 1) tenta pelos IDs
  for (const id of possibleIds) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  // 2) tenta pelo texto
  const buttons = Array.from(document.querySelectorAll("button"));
  return buttons.find((btn) =>
    btn.textContent.toLowerCase().includes(textSnippet.toLowerCase())
  );
}

function updateHeaderMeta() {
  const totalCasesEl = document.getElementById("total-cases");
  const caseNumberEl = document.getElementById("case-number");
  const difficultyEl = document.getElementById("case-difficulty");

  if (totalCasesEl) totalCasesEl.textContent = cases.length || 0;

  if (currentCaseIndex >= 0 && cases[currentCaseIndex]) {
    if (caseNumberEl) caseNumberEl.textContent = currentCaseIndex + 1;
    if (difficultyEl)
      difficultyEl.textContent = cases[currentCaseIndex].difficulty || "-";
  } else {
    if (caseNumberEl) caseNumberEl.textContent = 0;
    if (difficultyEl) difficultyEl.textContent = "-";
  }
}

// Reseta a parte de baixo da tela (caso) para o estado neutro
function resetCaseUI() {
  const caseTitleEl = document.getElementById("case-title");
  const caseLocationEl = document.getElementById("case-location");
  const caseIntroEl = document.getElementById("case-intro");
  const caseStoryEl = document.getElementById("case-story");
  const cluesListEl = document.getElementById("clues-list");
  const suspectsListEl = document.getElementById("suspects-list");
  const notesEl = document.getElementById("notes");
  const captainReportEl = document.getElementById("captain-report");
  const nextCaseBtn = getButton(
    ["btn-next-case", "next-case-button"],
    "Próximo Caso"
  );

  if (caseTitleEl) caseTitleEl.textContent = "Título do Caso";
  if (caseLocationEl) caseLocationEl.textContent = "";
  if (caseIntroEl) caseIntroEl.textContent = "";
  if (caseStoryEl) caseStoryEl.textContent = "";
  if (cluesListEl) cluesListEl.innerHTML = "";
  if (suspectsListEl) suspectsListEl.innerHTML = "";
  if (notesEl) notesEl.value = "";
  if (captainReportEl)
    captainReportEl.textContent =
      "Analise as pistas e escolha um suspeito para acusar.";
  if (nextCaseBtn) nextCaseBtn.disabled = true;

  currentCaseIndex = -1;
  accusationMade = false;
  updateHeaderMeta();
}

// Preenche o caso atual na tela
function showCase(index) {
  const caseData = cases[index];
  if (!caseData) return;

  const caseTitleEl = document.getElementById("case-title");
  const caseLocationEl = document.getElementById("case-location");
  const caseIntroEl = document.getElementById("case-intro");
  const caseStoryEl = document.getElementById("case-story");
  const cluesListEl = document.getElementById("clues-list");
  const suspectsListEl = document.getElementById("suspects-list");
  const notesEl = document.getElementById("notes");
  const captainReportEl = document.getElementById("captain-report");
  const nextCaseBtn = getButton(
    ["btn-next-case", "next-case-button"],
    "Próximo Caso"
  );

  if (caseTitleEl) caseTitleEl.textContent = caseData.title || "Caso sem título";
  if (caseLocationEl)
    caseLocationEl.textContent = caseData.location
      ? "Local: " + caseData.location
      : "";
  if (caseIntroEl) caseIntroEl.textContent = caseData.intro || "";
  if (caseStoryEl) caseStoryEl.textContent = caseData.story || "";

  // pistas
  if (cluesListEl) {
    cluesListEl.innerHTML = "";
    (caseData.clues || []).forEach((clue) => {
      const li = document.createElement("li");
      li.textContent = clue;
      cluesListEl.appendChild(li);
    });
  }

  // suspeitos
  if (suspectsListEl) {
    suspectsListEl.innerHTML = "";
    (caseData.suspects || []).forEach((suspect) => {
      const label = document.createElement("label");
      label.className = "suspect-item";

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "suspect";
      radio.value = suspect.id;

      const textSpan = document.createElement("span");
      textSpan.innerHTML =
        "<strong>" +
        suspect.name +
        "</strong>" +
        (suspect.description ? " — " + suspect.description : "");

      label.appendChild(radio);
      label.appendChild(textSpan);
      suspectsListEl.appendChild(label);
    });
  }

  if (notesEl) notesEl.value = "";

  accusationMade = false;
  if (nextCaseBtn) nextCaseBtn.disabled = true;
  if (captainReportEl)
    captainReportEl.textContent =
      "Analise as pistas, escolha um suspeito e faça sua acusação.";

  updateHeaderMeta();
}

// --------------- LÓGICA PRINCIPAL ---------------

function startInvestigation() {
  if (!cases || cases.length === 0) {
    alert(
      "Nenhum caso disponível. Verifique o arquivo cases.json ou tente novamente."
    );
    return;
  }

  currentCaseIndex = 0;
  showCase(currentCaseIndex);
}

function makeAccusation() {
  if (currentCaseIndex < 0 || !cases[currentCaseIndex]) {
    alert("Comece a investigação antes de fazer uma acusação.");
    return;
  }

  const caseData = cases[currentCaseIndex];
  const captainReportEl = document.getElementById("captain-report");
  const nextCaseBtn = getButton(
    ["btn-next-case", "next-case-button"],
    "Próximo Caso"
  );

  const selected = document.querySelector('input[name="suspect"]:checked');
  if (!selected) {
    alert("Escolha um suspeito antes de fazer a acusação.");
    return;
  }

  const chosenId = selected.value;
  const isCorrect = chosenId === caseData.correctSuspectId;
  accusationMade = true;

  if (nextCaseBtn && currentCaseIndex < cases.length - 1) {
    nextCaseBtn.disabled = false;
  }

  if (!captainReportEl) return;

  if (isCorrect) {
    captainReportEl.textContent =
      "Perfeito, detetive! Você acertou a acusação. " +
      (caseData.solutionText ||
        "O Capitão está satisfeito com a sua linha de raciocínio.");
  } else {
    const correctSuspect = (caseData.suspects || []).find(
      (s) => s.id === caseData.correctSuspectId
    );
    const correctName = correctSuspect ? correctSuspect.name : "o verdadeiro culpado";

    captainReportEl.textContent =
      "Dessa vez não foi o suspeito certo. " +
      correctName +
      " era o verdadeiro responsável. " +
      (caseData.solutionText || "");
  }
}

function goToNextCase() {
  if (!accusationMade) {
    alert("Faça uma acusação antes de ir para o próximo caso.");
    return;
  }
  if (currentCaseIndex >= cases.length - 1) {
    alert("Você já resolveu todos os casos disponíveis.");
    return;
  }

  currentCaseIndex++;
  showCase(currentCaseIndex);
}

function backToOffice() {
  resetCaseUI();
}

// --------------- CARREGAMENTO DOS CASOS ---------------

async function loadCases() {
  try {
    const response = await fetch("cases.json", { cache: "no-store" });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("JSON vazio ou em formato errado");
    }

    cases = data;
  } catch (err) {
    console.warn("Erro ao carregar cases.json, usando fallback:", err);
    cases = fallbackCases;
  } finally {
    updateHeaderMeta();
  }
}

// --------------- INICIALIZAÇÃO ---------------

document.addEventListener("DOMContentLoaded", () => {
  // Carrega casos
  loadCases();

  // Liga os botões (tentando por ID e por texto)
  const startBtn = getButton(
    ["btn-start", "start-button", "startInvestigationBtn"],
    "Começar Investigação"
  );
  const accuseBtn = getButton(
    ["btn-accuse", "accuse-button"],
    "Fazer Acusação"
  );
  const nextCaseBtn = getButton(
    ["btn-next-case", "next-case-button"],
    "Próximo Caso"
  );
  const backOfficeBtn = getButton(
    ["btn-back-office", "back-office-button"],
    "Voltar ao Escritório"
  );

  if (startBtn) startBtn.addEventListener("click", startInvestigation);
  if (accuseBtn) accuseBtn.addEventListener("click", makeAccusation);
  if (nextCaseBtn) nextCaseBtn.addEventListener("click", goToNextCase);
  if (backOfficeBtn) backOfficeBtn.addEventListener("click", backToOffice);

  // Começa com o cabeçalho zerado
  resetCaseUI();
});
