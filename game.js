// game.js — Versão revisada e mais estável

// =================== ESTADO GLOBAL DO JOGO ===================

let cases = [];              // Lista de casos (do JSON ou fallback)
let currentCaseIndex = 0;    // Índice do caso atual
let selectedSuspectId = null; // ID do suspeito selecionado

// Fallback interno (usado se o cases.json falhar)
const fallbackCases = [
  {
    id: 1,
    title: "O Quadro Desaparecido",
    difficulty: "Fácil",
    location: "Museu Municipal de Arte",
    intro: "Um quadro valioso sumiu poucas horas antes da abertura de uma grande exposição.",
    story:
      "Você é chamado ao Museu do Vale após o desaparecimento de 'Noite sobre o Vale', a obra mais importante da mostra. Apenas três pessoas tiveram acesso à sala do cofre na última hora.",
    clues: [
      "O sistema de segurança registrou três acessos ao cofre na última hora.",
      "A fechadura não foi violada: alguém usou o código correto.",
      "Há marcas de tinta azul no chão, do corredor até o vestiário dos funcionários."
    ],
    suspects: [
      {
        id: "curadora",
        name: "Helena, a Curadora",
        description:
          "Responsável pela exposição. Sabia o valor exato do quadro e tinha o código do cofre.",
        isCulprit: false
      },
      {
        id: "seguranca",
        name: "Roberto, o Segurança",
        description:
          "Estava de plantão na noite do sumiço. Diz que não saiu da portaria.",
        isCulprit: true
      },
      {
        id: "restaurador",
        name: "Luiz, o Restaurador",
        description:
          "Trabalhava na restauração de outras telas. Suas luvas têm manchas de tinta azul.",
        isCulprit: false
      }
    ]
  },
  {
    id: 2,
    title: "O Último Trem",
    difficulty: "Fácil",
    location: "Estação Central do Vale",
    intro:
      "Um passageiro misterioso desapareceu dentro da estação minutos antes do último trem da noite.",
    story:
      "Câmeras mostram o homem recebendo uma mala e, logo depois, sumindo num corredor de acesso restrito. Três funcionários estavam próximos do local.",
    clues: [
      "As câmeras do corredor estavam desligadas naquele horário.",
      "A mala foi encontrada vazia em um depósito de limpeza.",
      "Um crachá de acesso restrito foi usado duas vezes em menos de 5 minutos."
    ],
    suspects: [
      {
        id: "chefe-plataforma",
        name: "Marta, Chefe de Plataforma",
        description:
          "Coordena embarques e desembarques. Tinha acesso ao painel das câmeras.",
        isCulprit: false
      },
      {
        id: "faxineiro",
        name: "Ivan, Faxineiro",
        description:
          "Responsável pelo depósito de limpeza onde a mala foi achada.",
        isCulprit: true
      },
      {
        id: "bilheteiro",
        name: "Paulo, Bilheteiro",
        description:
          "Atende os passageiros no guichê. Diz que não saiu de lá em momento algum.",
        isCulprit: false
      }
    ]
  },
  {
    id: 3,
    title: "Silêncio no Teatro",
    difficulty: "Médio",
    location: "Teatro Municipal do Vale",
    intro:
      "No ensaio geral de uma peça importante, o protagonista some sem deixar rastros.",
    story:
      "O sumiço ocorreu pouco antes da cena final. Apenas a diretora, o contra-regra e o dublê estavam nos bastidores naquele momento.",
    clues: [
      "O camarim está em perfeita ordem, sem sinais de luta.",
      "Um roteiro com anotações do protagonista foi rasgado e jogado no lixo.",
      "Uma porta lateral, normalmente trancada, foi encontrada aberta."
    ],
    suspects: [
      {
        id: "diretora",
        name: "Lígia, Diretora",
        description:
          "Perfeccionista, exigia muito do elenco. Discutiu com o protagonista no ensaio anterior.",
        isCulprit: false
      },
      {
        id: "contra-regra",
        name: "Fábio, Contra-Regra",
        description:
          "Cuida dos objetos de cena. É o único que usa a porta lateral com frequência.",
        isCulprit: true
      },
      {
        id: "duble",
        name: "Renan, Dublê",
        description:
          "Sempre quis o papel principal. Tem acesso ao camarim, mas não ao depósito lateral.",
        isCulprit: false
      }
    ]
  }
];

// =================== FUNÇÕES UTILITÁRIAS ===================

function $(id) {
  return document.getElementById(id);
}

// Mostra a tela do escritório / mensagem do Capitão
function showIntroScreen() {
  const intro = $("intro-screen");
  const game = $("game-screen");

  if (intro) intro.classList.remove("hidden");
  if (game) game.classList.add("hidden");

  selectedSuspectId = null;

  const resultMessage = $("result-message");
  const nextBtn = $("next-case-btn");

  if (resultMessage) {
    resultMessage.textContent =
      "Analise as pistas e escolha um suspeito para acusar.";
  }

  if (nextBtn) {
    nextBtn.disabled = true;
  }
}

// Inicia o jogo (vai para o primeiro caso)
function startGame() {
  if (!cases || cases.length === 0) {
    alert("Nenhum caso disponível no momento.");
    return;
  }

  const intro = $("intro-screen");
  const game = $("game-screen");

  if (intro) intro.classList.add("hidden");
  if (game) game.classList.remove("hidden");

  currentCaseIndex = 0;
  loadCase(currentCaseIndex);
}

// Carrega um caso pela posição do array
function loadCase(index) {
  const caseData = cases[index];
  if (!caseData) {
    console.warn("Caso inexistente no índice:", index);
    return;
  }

  selectedSuspectId = null;

  // Cabeçalho
  const caseCounter = $("case-counter");
  const difficultyLabel = $("difficulty-label");

  if (caseCounter) {
    caseCounter.textContent = `Caso ${index + 1} de ${cases.length}`;
  }
  if (difficultyLabel) {
    difficultyLabel.textContent = `Dificuldade: ${
      caseData.difficulty || "-"
    }`;
  }

  // Informações do caso
  if ($("case-title")) $("case-title").textContent = caseData.title || "Caso sem título";
  if ($("case-location")) $("case-location").textContent = caseData.location || "";
  if ($("case-intro")) $("case-intro").textContent = caseData.intro || "";
  if ($("case-story")) $("case-story").textContent = caseData.story || "";

  // Limpa e renderiza pistas e suspeitos
  renderClues(caseData.clues || []);
  renderSuspects(caseData.suspects || []);

  // Limpa anotações
  if ($("notes")) $("notes").value = "";

  // Reseta mensagem do capitão
  if ($("result-message")) {
    $("result-message").textContent =
      "Analise as pistas e escolha um suspeito para acusar.";
  }

  // Botão próximo caso
  if ($("next-case-btn")) {
    $("next-case-btn").disabled = true;
  }
}

// Renderiza a lista de pistas
function renderClues(clues) {
  const list = $("clues-list");
  if (!list) return;

  list.innerHTML = "";

  clues.forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = clue;
    list.appendChild(li);
  });
}

// Renderiza a lista de suspeitos
function renderSuspects(suspects) {
  const list = $("suspects-list");
  if (!list) return;

  list.innerHTML = "";

  suspects.forEach((suspect) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.className = "suspect-btn";
    btn.dataset.suspectId = suspect.id;
    btn.textContent = `${suspect.name} – ${suspect.description}`;

    btn.addEventListener("click", () => {
      selectSuspect(suspect.id);
    });

    li.appendChild(btn);
    list.appendChild(li);
  });
}

// Seleciona visualmente o suspeito
function selectSuspect(id) {
  selectedSuspectId = id;

  const buttons = document.querySelectorAll(".suspect-btn");
  buttons.forEach((btn) => {
    if (btn.dataset.suspectId === id) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  });
}

// Faz a acusação
function makeAccusation() {
  if (!cases || cases.length === 0) {
    alert("Nenhum caso carregado.");
    return;
  }

  if (!selectedSuspectId) {
    alert("Escolha um suspeito antes de acusar.");
    return;
  }

  const caseData = cases[currentCaseIndex];
  const culprit = caseData.suspects.find((s) => s.isCulprit);
  const chosen = caseData.suspects.find((s) => s.id === selectedSuspectId);

  let message = "";

  if (culprit && culprit.id === selectedSuspectId) {
    message =
      "Parabéns, detetive! Você conectou as pistas corretamente e identificou o verdadeiro culpado.\n\n" +
      "O Capitão elogia sua precisão e manda você se preparar para o próximo caso.";
  } else {
    message =
      "Dessa vez, a acusação não foi a correta.\n\n" +
      `Você acusou ${chosen ? chosen.name : "um suspeito equivocado"}, mas as evidências apontavam para ${
        culprit ? culprit.name : "outro suspeito"
      }.\n` +
      "O Capitão recomenda analisar as pistas com mais calma nas próximas investigações.";
  }

  if ($("result-message")) {
    $("result-message").textContent = message;
  }

  if ($("next-case-btn")) {
    $("next-case-btn").disabled = currentCaseIndex >= cases.length - 1;
  }
}

// Vai para o próximo caso
function nextCase() {
  if (currentCaseIndex < cases.length - 1) {
    currentCaseIndex++;
    loadCase(currentCaseIndex);
  } else {
    if ($("result-message")) {
      $("result-message").textContent =
        "Você concluiu todos os casos disponíveis por enquanto. Volte ao escritório para aguardar novas investigações.";
    }
    if ($("next-case-btn")) {
      $("next-case-btn").disabled = true;
    }
  }
}

// Carrega cases.json com fallback interno
async function loadCases() {
  try {
    const response = await fetch("cases.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Falha ao carregar cases.json");
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("cases.json vazio ou em formato incorreto");
    }

    cases = data;
    console.log("[Valley] Casos carregados de cases.json:", cases.length);
  } catch (error) {
    console.warn(
      "[Valley] Erro ao carregar cases.json. Usando fallback interno:",
      error
    );
    cases = fallbackCases;
  }
}

// =================== INICIALIZAÇÃO ===================

document.addEventListener("DOMContentLoaded", async () => {
  // Garantir que os elementos existem antes de adicionar listeners
  const startBtn = $("start-game-btn");
  const accuseBtn = $("accuse-btn");
  const nextBtn = $("next-case-btn");
  const restartBtn = $("restart-btn");

  if (startBtn) startBtn.addEventListener("click", startGame);
  if (accuseBtn) accuseBtn.addEventListener("click", makeAccusation);
  if (nextBtn) nextBtn.addEventListener("click", nextCase);
  if (restartBtn) restartBtn.addEventListener("click", showIntroScreen);

  // Carrega casos (JSON ou fallback) e mostra o escritório
  await loadCases();
  showIntroScreen();
});
