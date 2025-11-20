// game.js – versão estável com poucos casos e visual organizado

let cases = [];
let currentCaseIndex = 0;
let selectedSuspectId = null;

// FALLBACK LOCAL (se o fetch do JSON falhar)
const fallbackCases = [
  {
    id: 1,
    title: "O Quadro Desaparecido",
    difficulty: "Fácil",
    location: "Museu Municipal de Arte",
    intro:
      "Um quadro valioso sumiu poucas horas antes da abertura de uma grande exposição.",
    story:
      "Você é chamado ao Museu Municipal de Arte quando o diretor descobre que 'A Noite Sobre o Vale', a pintura mais importante da mostra, desapareceu da sala de segurança.",
    clues: [
      "O sistema registrou que a porta do cofre foi aberta apenas uma vez na última hora.",
      "Uma luva de tecido fino foi encontrada caída perto da porta do cofre.",
      "A câmera da sala do cofre ficou borrada por 10 segundos, exatamente no horário do sumiço."
    ],
    suspects: [
      {
        id: "a",
        name: "Júlio, o Curador",
        description:
          "Trabalha há anos no museu. Foi visto discutindo com o diretor sobre cortes de orçamento.",
        isGuilty: false
      },
      {
        id: "b",
        name: "Carla, a Restauradora",
        description:
          "Teria acesso à chave reserva do cofre. Está sempre usando luvas de tecido para proteger as obras.",
        isGuilty: true
      },
      {
        id: "c",
        name: "Rogério, o Segurança",
        description:
          "Responsável pelo monitoramento das câmeras. Diz que o sistema travou por alguns segundos.",
        isGuilty: false
      }
    ]
  },
  {
    id: 2,
    title: "O Segredo do Café 24h",
    difficulty: "Médio",
    location: "Café Esquina do Vale",
    intro:
      "O dono de um café 24 horas afirma que alguém está roubando dinheiro do caixa durante a madrugada.",
    story:
      "Não há sinais de arrombamento e o dono garante que só três pessoas têm a chave: ele, o atendente da madrugada e a gerente.",
    clues: [
      "Os relatórios de vendas mostram um pico de consumo em um horário em que quase não há clientes.",
      "A gerente vive reclamando do salário baixo, mas apareceu com um celular novo.",
      "O atendente costuma levar amigos para o café depois do turno para 'fechar o dia'."
    ],
    suspects: [
      {
        id: "a",
        name: "Paulo, o Dono",
        description:
          "Controlador, sabe tudo o que acontece no café. Diz que sempre confere o caixa pessoalmente.",
        isGuilty: false
      },
      {
        id: "b",
        name: "Lígia, a Gerente",
        description:
          "Responsável pelos relatórios de vendas. Tem a senha do sistema e a chave do estabelecimento.",
        isGuilty: true
      },
      {
        id: "c",
        name: "Mateus, o Atendente da Madrugada",
        description:
          "Carismático, vive cheio de amigos. Diz que não entende nada de sistema e só ‘marca no caderninho’.",
        isGuilty: false
      }
    ]
  },
  {
    id: 3,
    title: "O Laptop Silencioso",
    difficulty: "Fácil",
    location: "Estação Central do Vale",
    intro:
      "Um laptop com dados sigilosos desapareceu da sala de funcionários da estação.",
    story:
      "A sala fica trancada, mas muitas pessoas entram e saem ao longo do dia. O dono jura que deixou o laptop carregando sobre a mesa.",
    clues: [
      "Um carregador continua conectado à tomada, mas o laptop não está mais ali.",
      "Um bilhete amassado no lixo diz: 'Traga o pendrive hoje, antes do plantão'.",
      "Câmeras mostram um funcionário saindo apressado, segurando uma mochila maior do que o normal."
    ],
    suspects: [
      {
        id: "a",
        name: "Bianca, Analista de Dados",
        description:
          "Tem acesso aos arquivos sigilosos e costuma levar trabalho para casa.",
        isGuilty: false
      },
      {
        id: "b",
        name: "Henrique, Técnico de TI",
        description:
          "Vive reclamando que ninguém faz backup. Sabe todas as senhas da rede.",
        isGuilty: false
      },
      {
        id: "c",
        name: "Douglas, Plantonista da Noite",
        description:
          "Foi visto saindo carregando uma mochila cheia no final do turno.",
        isGuilty: true
      }
    ]
  }
];

// ELEMENTOS DE INTERFACE
const welcomeSection = document.getElementById("welcome-section");
const caseSection = document.getElementById("case-section");
const reportSection = document.getElementById("report-section");

const startBtn = document.getElementById("start-game-btn");
const accuseBtn = document.getElementById("accuse-btn");
const backOfficeBtn = document.getElementById("back-office-btn");
const nextCaseBtn = document.getElementById("next-case-btn");

const caseNumberEl = document.getElementById("case-number");
const totalCasesEl = document.getElementById("total-cases");
const caseDifficultyEl = document.getElementById("case-difficulty");

const caseTitleEl = document.getElementById("case-title");
const caseLocationEl = document.getElementById("case-location");
const caseIntroEl = document.getElementById("case-intro");
const caseStoryEl = document.getElementById("case-story");
const clueListEl = document.getElementById("clue-list");
const suspectListEl = document.getElementById("suspect-list");
const notesEl = document.getElementById("notes");
const captainReportTextEl = document.getElementById("captain-report-text");

// UTIL
function showSection(sectionToShow) {
  [welcomeSection, caseSection, reportSection].forEach((sec) => {
    sec.classList.add("hidden");
  });
  sectionToShow.classList.remove("hidden");
}

function updateHeaderInfo() {
  const total = cases.length;
  totalCasesEl.textContent = total;

  if (total === 0) {
    caseNumberEl.textContent = 0;
    caseDifficultyEl.textContent = "-";
    return;
  }

  caseNumberEl.textContent = currentCaseIndex + 1;
  caseDifficultyEl.textContent = cases[currentCaseIndex].difficulty || "-";
}

// CARREGA UM CASO NA TELA
function loadCurrentCase() {
  if (!cases.length) return;

  const c = cases[currentCaseIndex];

  caseTitleEl.textContent = c.title;
  caseLocationEl.textContent = c.location
    ? `Local: ${c.location}`
    : "";
  caseIntroEl.textContent = c.intro || "";
  caseStoryEl.textContent = c.story || "";

  // pistas
  clueListEl.innerHTML = "";
  (c.clues || []).forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = clue;
    clueListEl.appendChild(li);
  });

  // suspeitos
  suspectListEl.innerHTML = "";
  (c.suspects || []).forEach((s) => {
    const card = document.createElement("label");
    card.className = "suspect-card";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "suspect";
    radio.value = s.id;
    radio.className = "suspect-radio";

    radio.addEventListener("change", () => {
      selectedSuspectId = s.id;
    });

    const info = document.createElement("div");
    info.className = "suspect-info";

    const nameEl = document.createElement("div");
    nameEl.className = "suspect-name";
    nameEl.textContent = s.name;

    const descEl = document.createElement("div");
    descEl.className = "suspect-desc";
    descEl.textContent = s.description || "";

    info.appendChild(nameEl);
    info.appendChild(descEl);

    card.appendChild(radio);
    card.appendChild(info);

    suspectListEl.appendChild(card);
  });

  // limpa seleção e notas
  selectedSuspectId = null;
  notesEl.value = "";
  document
    .querySelectorAll("input[name='suspect']")
    .forEach((r) => (r.checked = false));

  // atualiza cabeçalho
  updateHeaderInfo();

  // reseta relatório
  captainReportTextEl.textContent =
    "Analise as pistas e escolha um suspeito para acusar.";

  nextCaseBtn.textContent =
    currentCaseIndex === cases.length - 1 ? "ENCERRAR CASOS" : "PRÓXIMO CASO";
}

// LÓGICA DE ACUSAÇÃO
function handleAccusation() {
  if (!cases.length) return;

  const current = cases[currentCaseIndex];

  if (!selectedSuspectId) {
    captainReportTextEl.textContent =
      "Você precisa escolher um suspeito antes de acusar.";
    showSection(reportSection);
    return;
  }

  const guilty = current.suspects.find((s) => s.isGuilty);
  const chosen = current.suspects.find((s) => s.id === selectedSuspectId);

  if (!guilty || !chosen) return;

  if (chosen.id === guilty.id) {
    captainReportTextEl.textContent =
      `Boa, detetive! ${chosen.name} era realmente o culpado. ` +
      "Sua análise das pistas foi precisa.";
  } else {
    captainReportTextEl.textContent =
      `Não foi dessa vez. ${chosen.name} era inocente. ` +
      `O verdadeiro culpado era ${guilty.name}. Continue treinando sua intuição.`;
  }

  showSection(reportSection);
}

// PRÓXIMO CASO / ENCERRAR
function handleNextCase() {
  if (!cases.length) return;

  if (currentCaseIndex < cases.length - 1) {
    currentCaseIndex++;
    loadCurrentCase();
    showSection(caseSection);
  } else {
    // acabou os casos, volta para o escritório (boas-vindas)
    currentCaseIndex = 0;
    updateHeaderInfo();
    showSection(welcomeSection);
  }
}

// INICIALIZAÇÃO
function initGame() {
  fetch("cases.json")
    .then((res) => {
      if (!res.ok) throw new Error("Erro no JSON");
      return res.json();
    })
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        cases = data;
      } else {
        cases = fallbackCases;
      }
      updateHeaderInfo();
    })
    .catch(() => {
      cases = fallbackCases;
      updateHeaderInfo();
    });
}

// EVENTOS
startBtn.addEventListener("click", () => {
  if (!cases.length) {
    cases = fallbackCases;
  }
  currentCaseIndex = 0;
  loadCurrentCase();
  showSection(caseSection);
});

accuseBtn.addEventListener("click", handleAccusation);

backOfficeBtn.addEventListener("click", () => {
  showSection(welcomeSection);
  caseNumberEl.textContent = 0;
  caseDifficultyEl.textContent = "-";
});

nextCaseBtn.addEventListener("click", handleNextCase);

// Quando a página carrega
document.addEventListener("DOMContentLoaded", initGame);
