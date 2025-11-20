// game.js – Versão “estável” (antes de 13:30)
// Lida com carregamento de casos, seleção, veredito e mensagens do capitão.

// =========================
// VARIÁVEIS GLOBAIS
// =========================
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
    intro:
      "Um quadro famoso sumiu poucas horas antes da abertura de uma grande exposição.",
    story:
      "Você é chamado ao Museu Municipal de Arte quando o diretor descobre que 'A Noite Sobre o Vale', a pintura mais valiosa da exposição, desapareceu do cofre. Apenas três pessoas tiveram acesso à sala do cofre na última hora antes do sumiço.",
    clues: [
      "O sistema de segurança registra que o cofre foi aberto apenas uma vez na última hora.",
      "Há marcas de tinta azul no chão, levando até a porta de serviço.",
      "Uma das chaves reserva do cofre está faltando."
    ],
    suspects: [
      {
        id: "suspect1",
        name: "Helena Prado",
        role: "Curadora-chefe",
        description:
          "Responsável pela exposição. Estava nervosa e dizia que o quadro era a 'alma' do evento.",
        isCulprit: false
      },
      {
        id: "suspect2",
        name: "Rogério Mota",
        role: "Segurança",
        description:
          "Trabalhava no turno da noite. Disse que não viu nada de estranho, mas estava com o uniforme manchado de tinta azul.",
        isCulprit: true
      },
      {
        id: "suspect3",
        name: "Marcelo Dias",
        role: "Artista convidado",
        description:
          "Tinha acesso VIP ao cofre para estudar a obra, mas afirma que saiu horas antes do roubo.",
        isCulprit: false
      }
    ],
    captainMessageWin:
      "Excelente trabalho, detetive! Você recuperou o quadro e salvou a exposição.",
    captainMessageLose:
      "Dessa vez o ladrão escapou. Analise melhor as pistas e tente novamente."
  },
  {
    id: 2,
    title: "O Cofre do Banco",
    difficulty: "Médio",
    location: "Banco Central do Vale",
    intro:
      "Um pequeno cofre de segurança pessoal foi violado sem sinais de arrombamento.",
    story:
      "O gerente do banco chama você às pressas: um cliente importante afirma que valores desapareceram do seu cofre pessoal, mas não há nenhum registro de acesso indevido no sistema.",
    clues: [
      "A fechadura é eletrônica e aceita cartão + senha.",
      "Uma funcionária foi vista anotando algo em um papel perto dos caixas.",
      "As câmeras mostram um cliente cobrindo o teclado com o corpo ao digitar a senha."
    ],
    suspects: [
      {
        id: "suspect1",
        name: "Carla Nunes",
        role: "Atendente",
        description:
          "Trabalha há anos no banco, conhece todos os clientes, e foi vista perto dos cofres naquele dia.",
        isCulprit: true
      },
      {
        id: "suspect2",
        name: "Eduardo Lima",
        role: "Cliente",
        description:
          "Diz que sempre toma cuidado com a senha, mas aparece nas imagens tapando o teclado de forma exagerada.",
        isCulprit: false
      },
      {
        id: "suspect3",
        name: "Gerente Roberto",
        role: "Gerente do banco",
        description:
          "Tinha acesso administrativo ao sistema, porém estava em uma reunião externa na hora do incidente.",
        isCulprit: false
      }
    ],
    captainMessageWin:
      "Parabéns, detetive! Você descobriu o esquema interno e salvou a reputação do banco.",
    captainMessageLose:
      "Algo não fechou nas suas conclusões. Reveja as imagens e tente outra vez."
  }
];

// =========================
// INICIALIZAÇÃO
// =========================

document.addEventListener("DOMContentLoaded", () => {
  setupUIEvents();
  loadCases();
});

// =========================
// CARREGAR CASOS
// =========================
function loadCases() {
  fetch("cases.json")
    .then((response) => {
      if (!response.ok) throw new Error("Falha ao carregar cases.json");
      return response.json();
    })
    .then((data) => {
      // Aceita tanto { cases:[...] } quanto [ ... ]
      if (Array.isArray(data)) {
        cases = data;
      } else if (Array.isArray(data.cases)) {
        cases = data.cases;
      } else {
        throw new Error("Formato inválido de cases.json");
      }
      renderCaseList();
      showCaptainWelcome();
    })
    .catch((error) => {
      console.warn("Usando fallbackCases devido a erro:", error);
      cases = fallbackCases;
      renderCaseList();
      showCaptainWelcome();
    });
}

// =========================
// EVENTOS DE INTERFACE
// =========================
function setupUIEvents() {
  const startBtn = document.getElementById("start-game-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      showOfficeScreen();
      showCaptainWelcome();
    });
  }

  const backToOfficeBtn = document.getElementById("back-to-office-btn");
  if (backToOfficeBtn) {
    backToOfficeBtn.addEventListener("click", () => {
      showOfficeScreen();
    });
  }

  const solveCaseBtn = document.getElementById("solve-case-btn");
  if (solveCaseBtn) {
    solveCaseBtn.addEventListener("click", handleSolveCase);
  }

  const nextCaseBtn = document.getElementById("next-case-btn");
  if (nextCaseBtn) {
    nextCaseBtn.addEventListener("click", goToNextCase);
  }

  const tryAgainBtn = document.getElementById("try-again-btn");
  if (tryAgainBtn) {
    tryAgainBtn.addEventListener("click", resetCurrentCase);
  }
}

// =========================
// TELA INICIAL / ESCRITÓRIO
// =========================
function showOfficeScreen() {
  const startScreen = document.getElementById("start-screen");
  const officeScreen = document.getElementById("office-screen");
  const caseScreen = document.getElementById("case-screen");

  if (startScreen) startScreen.classList.add("hidden");
  if (caseScreen) caseScreen.classList.add("hidden");
  if (officeScreen) officeScreen.classList.remove("hidden");
}

function showCaseScreen() {
  const officeScreen = document.getElementById("office-screen");
  const caseScreen = document.getElementById("case-screen");

  if (officeScreen) officeScreen.classList.add("hidden");
  if (caseScreen) caseScreen.classList.remove("hidden");
}

// Mensagem inicial do capitão no escritório
function showCaptainWelcome() {
  const captainMessageBox = document.getElementById("captain-message");
  if (!captainMessageBox) return;

  captainMessageBox.textContent =
    "Bem-vindo à Delegacia do Vale. Temos casos acumulando na sua mesa, detetive. Escolha um e comece a investigar!";
}

// =========================
// LISTA DE CASOS
// =========================
function renderCaseList() {
  const listContainer = document.getElementById("case-list");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  if (!cases || cases.length === 0) {
    listContainer.innerHTML = "<p>Nenhum caso disponível no momento.</p>";
    return;
  }

  cases.forEach((c, index) => {
    const item = document.createElement("div");
    item.className = "case-card";
    item.innerHTML = `
      <div class="case-header">
        <h3>${c.title}</h3>
        <span class="case-difficulty">${c.difficulty || ""}</span>
      </div>
      <p class="case-location">${c.location || ""}</p>
      <p class="case-intro">${c.intro || ""}</p>
      <button class="btn small btn-choose-case" data-index="${index}">
        Investigar caso
      </button>
    `;
    listContainer.appendChild(item);
  });

  // Eventos dos botões de casos
  const buttons = listContainer.querySelectorAll(".btn-choose-case");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
      startCase(idx);
    });
  });
}

// =========================
// INICIAR UM CASO
// =========================
function startCase(index) {
  if (!cases[index]) return;
  currentCaseIndex = index;
  selectedSuspectId = null;
  lastResultWasCorrect = false;

  renderCaseDetails(cases[index]);
  clearResultMessage();
  showCaseScreen();
}

// Preenche a tela do caso
function renderCaseDetails(caseData) {
  const caseTitle = document.getElementById("case-title");
  const caseLocation = document.getElementById("case-location");
  const caseStory = document.getElementById("case-story");
  const cluesList = document.getElementById("clues-list");
  const suspectsList = document.getElementById("suspects-list");

  if (caseTitle) caseTitle.textContent = caseData.title || "";
  if (caseLocation) caseLocation.textContent = caseData.location || "";
  if (caseStory) caseStory.textContent = caseData.story || "";

  if (cluesList) {
    cluesList.innerHTML = "";
    (caseData.clues || []).forEach((clue) => {
      const li = document.createElement("li");
      li.textContent = clue;
      cluesList.appendChild(li);
    });
  }

  if (suspectsList) {
    suspectsList.innerHTML = "";
    (caseData.suspects || []).forEach((sus) => {
      const card = document.createElement("div");
      card.className = "suspect-card";
      card.setAttribute("data-suspect-id", sus.id);

      card.innerHTML = `
        <h4>${sus.name}</h4>
        <span class="suspect-role">${sus.role || ""}</span>
        <p>${sus.description || ""}</p>
      `;

      card.addEventListener("click", () => selectSuspect(sus.id));
      suspectsList.appendChild(card);
    });
  }
}

// =========================
// SELEÇÃO DE SUSPEITO
// =========================
function selectSuspect(suspectId) {
  selectedSuspectId = suspectId;

  const suspectsList = document.getElementById("suspects-list");
  if (!suspectsList) return;

  const cards = suspectsList.querySelectorAll(".suspect-card");
  cards.forEach((card) => {
    const id = card.getAttribute("data-suspect-id");
    if (id === suspectId) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });

  clearResultMessage();
}

// =========================
// RESOLVER CASO
// =========================
function handleSolveCase() {
  if (currentCaseIndex === null || currentCaseIndex === undefined) return;

  const currentCase = cases[currentCaseIndex];
  if (!currentCase) return;

  if (!selectedSuspectId) {
    showResultMessage("Escolha um suspeito antes de solucionar o caso.", "warning");
    return;
  }

  const culprit = (currentCase.suspects || []).find((s) => s.isCulprit);
  const isCorrect = culprit && culprit.id === selectedSuspectId;
  lastResultWasCorrect = isCorrect;

  if (isCorrect) {
    showResultMessage(
      currentCase.captainMessageWin ||
        "Acertou em cheio! Caso resolvido, detetive.",
      "success"
    );
  } else {
    showResultMessage(
      currentCase.captainMessageLose ||
        "Essa não foi a melhor escolha. Tente novamente.",
      "error"
    );
  }

  toggleCaseResultButtons(true);
}

// Mostra mensagem de resultado
function showResultMessage(text, type) {
  const resultBox = document.getElementById("result-message");
  if (!resultBox) return;

  resultBox.textContent = text;
  resultBox.className = ""; // limpa classes antigas
  resultBox.classList.add("result-box");

  if (type === "success") {
    resultBox.classList.add("result-success");
  } else if (type === "error") {
    resultBox.classList.add("result-error");
  } else if (type === "warning") {
    resultBox.classList.add("result-warning");
  }
}

function clearResultMessage() {
  const resultBox = document.getElementById("result-message");
  if (!resultBox) return;
  resultBox.textContent = "";
  resultBox.className = "";
}

// Mostra / esconde botões de Próximo caso / Tentar novamente
function toggleCaseResultButtons(show) {
  const nextCaseBtn = document.getElementById("next-case-btn");
  const tryAgainBtn = document.getElementById("try-again-btn");

  if (nextCaseBtn)
    nextCaseBtn.classList.toggle("hidden", !show || !lastResultWasCorrect);
  if (tryAgainBtn)
    tryAgainBtn.classList.toggle("hidden", !show || lastResultWasCorrect);
}

// =========================
// PRÓXIMO CASO / TENTAR DE NOVO
// =========================
function goToNextCase() {
  if (cases.length === 0) return;

  let nextIndex = currentCaseIndex + 1;
  if (nextIndex >= cases.length) {
    // Se acabou a lista, volta para o escritório
      showOfficeScreen();
      showCaptainSummaryAllCases();
      return;
  }
  startCase(nextIndex);
  toggleCaseResultButtons(false);
}

function resetCurrentCase() {
  if (currentCaseIndex === null || currentCaseIndex === undefined) return;
  startCase(currentCaseIndex);
  toggleCaseResultButtons(false);
}

// Mensagem do capitão quando todos os casos forem concluídos (ou lista acabar)
function showCaptainSummaryAllCases() {
  const captainMessageBox = document.getElementById("captain-message");
  if (!captainMessageBox) return;

  captainMessageBox.textContent =
    "Bom trabalho até aqui, detetive. Você já passou por todos os casos disponíveis hoje. Em breve teremos novas investigações para você.";
}
