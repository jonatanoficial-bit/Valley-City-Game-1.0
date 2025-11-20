// ==========================
// ESTADO DO JOGO
// ==========================

let detectiveName = "";
let detectiveAvatarId = null;
let currentCaseIndex = 0;
let selectedSuspectId = null;
let lastAccusationWasCorrect = false;

// Casos clássicos (alguns exemplos, sem JSON externo)
const cases = [
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
      "O sistema de segurança registra que a porta do cofre foi aberta duas vezes na última hora.",
      "Há um pequeno respingo de tinta azul no chão, próximo ao carrinho de limpeza.",
      "A chave reserva do cofre fica na sala do diretor, que alega não ter saído de lá.",
    ],
    suspects: [
      {
        id: "diretor",
        name: "Sr. Álvaro (Diretor)",
        description:
          "Diretor do museu há mais de 15 anos. Está desesperado com o sumiço.",
        guilty: false,
      },
      {
        id: "seguranca",
        name: "Marta (Segurança)",
        description:
          "Responsável pela ronda. Diz que não viu nada de estranho.",
        guilty: false,
      },
      {
        id: "zelador",
        name: "João (Zelador)",
        description:
          "Faz a limpeza do corredor do cofre. Carrega sempre um carrinho com produtos.",
        guilty: true,
      },
    ],
    solution:
      "O zelador usou o carrinho de limpeza para esconder o quadro. O respingo de tinta no chão e o fato de o cofre ter sido aberto duas vezes indicam que alguém entrou primeiro, saiu com o quadro escondido, e depois voltou para trancar.",
  },
  {
    id: 2,
    title: "O Notebook Silenciado",
    difficulty: "Fácil",
    location: "Escritório Central do Vale",
    intro:
      "Um notebook com informações sigilosas foi substituído por um aparelho falso.",
    story:
      "No início do plantão, o analista de dados percebe que o notebook que ele usa todos os dias foi trocado por um idêntico, porém completamente vazio. Apenas três pessoas ficaram no escritório na noite anterior.",
    clues: [
      "As câmeras do corredor foram desligadas por 10 minutos durante a madrugada.",
      "Um dos funcionários apareceu com uma mochila maior do que costuma usar.",
      "Há marcas de café fresco na mesa, mesmo depois do horário do expediente.",
    ],
    suspects: [
      {
        id: "analista",
        name: "Edu (Analista)",
        description:
          "Dono do notebook. Diz que deixou o equipamento trancado na gaveta.",
        guilty: false,
      },
      {
        id: "estagiaria",
        name: "Lia (Estagiária)",
        description:
          "Ficou no escritório estudando relatórios. É organizada e sempre anota tudo.",
        guilty: false,
      },
      {
        id: "tecnico",
        name: "Rogério (Técnico de TI)",
        description:
          "Responsável pelos computadores. Chegou mais cedo que o normal na manhã seguinte.",
        guilty: true,
      },
    ],
    solution:
      "O técnico de TI desligou as câmeras por alguns minutos e levou o notebook na mochila maior. As marcas de café indicam que alguém ficou depois do expediente e precisava se manter acordado.",
  },
  {
    id: 3,
    title: "O Cofre da Loja de Joias",
    difficulty: "Médio",
    location: "Joalheria Luz do Vale",
    intro:
      "O cofre da joalheria foi encontrado aberto pela manhã, mas sem sinais de arrombamento.",
    story:
      "A proprietária da joalheria afirma ter trancado o cofre antes de ir embora. No dia seguinte, o cofre estava aberto e algumas peças sumiram. Três pessoas têm a combinação.",
    clues: [
      "Não há sinais de arrombamento na porta do cofre ou na vitrine.",
      "Um dos funcionários costuma anotar tudo em um caderninho.",
      "A proprietária recebeu uma ligação estranha minutos antes de fechar a loja.",
    ],
    suspects: [
      {
        id: "proprietaria",
        name: "Helena (Proprietária)",
        description:
          "Dona da loja há mais de 10 anos. Muito preocupada com a reputação da joalheria.",
        guilty: false,
      },
      {
        id: "vendedor",
        name: "Caio (Vendedor)",
        description:
          "Atendente simpático, conhece todos os clientes pelo nome.",
        guilty: true,
      },
      {
        id: "caixa",
        name: "Nina (Caixa)",
        description:
          "Cuida do caixa e da papelada. Odeia confusão e atrasos.",
        guilty: false,
      },
    ],
    solution:
      "O vendedor observava atentamente quando o cofre era aberto e anotou a combinação no seu caderno. Durante a noite, voltou com a sequência memorizada e pegou as joias sem deixar sinais de arrombamento.",
  },
];

// ==========================
// UTILITÁRIOS DE TELA
// ==========================

function showScreen(id) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function updateCaseMeta() {
  const metaEl = document.getElementById("caseMeta");
  if (!cases.length) {
    metaEl.textContent = "Nenhum caso disponível";
    return;
  }

  const current = cases[currentCaseIndex];
  metaEl.textContent = `Caso ${currentCaseIndex + 1} de ${
    cases.length
  } • Dificuldade: ${current.difficulty}`;
}

// ==========================
// CARREGAR CASO NA TELA
// ==========================

function loadCase(index) {
  if (index < 0 || index >= cases.length) return;

  currentCaseIndex = index;
  selectedSuspectId = null;
  lastAccusationWasCorrect = false;

  const current = cases[currentCaseIndex];

  document.getElementById("caseTitle").textContent = current.title;
  document.getElementById(
    "caseLocation"
  ).textContent = `${current.location}`;
  document.getElementById("caseIntro").textContent = current.intro;
  document.getElementById("caseStory").textContent = current.story;

  // Pistas
  const cluesEl = document.getElementById("caseClues");
  cluesEl.innerHTML = "";
  current.clues.forEach((clue) => {
    const li = document.createElement("li");
    li.textContent = clue;
    cluesEl.appendChild(li);
  });

  // Suspeitos
  const suspectsEl = document.getElementById("caseSuspects");
  suspectsEl.innerHTML = "";
  current.suspects.forEach((s) => {
    const btn = document.createElement("button");
    btn.className = "suspect-card";
    btn.dataset.suspectId = s.id;

    const title = document.createElement("div");
    title.className = "suspect-card-title";
    title.textContent = s.name;

    const desc = document.createElement("div");
    desc.className = "suspect-card-desc";
    desc.textContent = s.description;

    btn.appendChild(title);
    btn.appendChild(desc);

    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".suspect-card")
        .forEach((el) => el.classList.remove("selected"));
      btn.classList.add("selected");
      selectedSuspectId = s.id;
    });

    suspectsEl.appendChild(btn);
  });

  // Limpar notas e relatório
  document.getElementById("notesArea").value = "";
  document.getElementById("captainReport").textContent =
    "Analise as pistas e escolha um suspeito para acusar.";
  updateCaseMeta();
}

// ==========================
// AÇÕES DO JOGADOR
// ==========================

function handleAccusation() {
  if (!selectedSuspectId) {
    alert("Escolha um suspeito antes de fazer a acusação.");
    return;
  }

  const current = cases[currentCaseIndex];
  const chosen = current.suspects.find(
    (s) => s.id === selectedSuspectId
  );
  const guilty = current.suspects.find((s) => s.guilty);

  const reportEl = document.getElementById("captainReport");

  if (chosen && chosen.guilty) {
    lastAccusationWasCorrect = true;
    reportEl.innerHTML =
      `<strong>Acerto!</strong> Você acusou <strong>${chosen.name}</strong> e a investigação confirmou sua culpa.<br><br>` +
      current.solution;
  } else {
    lastAccusationWasCorrect = false;
    reportEl.innerHTML =
      `<strong>Acusação equivocada.</strong> O verdadeiro culpado era <strong>${guilty.name}</strong>.<br><br>` +
      current.solution;
  }
}

function goToNextCase() {
  if (currentCaseIndex + 1 < cases.length) {
    loadCase(currentCaseIndex + 1);
  } else {
    document.getElementById("captainReport").innerHTML =
      "<strong>Parabéns!</strong> Você concluiu todos os casos disponíveis por enquanto. Novas investigações serão adicionadas em breve.";
  }
}

// ==========================
// INICIALIZAÇÃO E EVENTOS
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  const screenStart = "screen-start";
  const screenAvatar = "screen-avatar";
  const screenName = "screen-name";
  const screenOffice = "screen-office";
  const screenCase = "screen-case";

  // TELA INICIAL
  document
    .getElementById("btnStartGame")
    .addEventListener("click", () => {
      showScreen(screenAvatar);
    });

  // AVATAR
  const avatarButtons = document.querySelectorAll(".avatar-option");
  const btnAvatarContinue = document.getElementById(
    "btnAvatarContinue"
  );
  const btnAvatarBack = document.getElementById("btnAvatarBack");

  avatarButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      avatarButtons.forEach((b) =>
        b.classList.remove("selected")
      );
      btn.classList.add("selected");
      detectiveAvatarId = btn.dataset.avatarId;
      btnAvatarContinue.disabled = false;
    });
  });

  btnAvatarContinue.addEventListener("click", () => {
    showScreen(screenName);
  });

  btnAvatarBack.addEventListener("click", () => {
    showScreen(screenStart);
  });

  // NOME
  const inputDetectiveName = document.getElementById(
    "inputDetectiveName"
  );
  const btnNameContinue = document.getElementById("btnNameContinue");
  const btnNameBack = document.getElementById("btnNameBack");

  btnNameContinue.addEventListener("click", () => {
    const name = inputDetectiveName.value.trim();
    detectiveName = name || "Detetive do Vale";
    const officeIntro = document.getElementById("officeIntro");
    officeIntro.innerHTML = `Bem-vindo ao seu novo escritório, <strong>${detectiveName}</strong>.`;
    showScreen(screenOffice);
  });

  btnNameBack.addEventListener("click", () => {
    showScreen(screenAvatar);
  });

  // ESCRITÓRIO
  document
    .getElementById("btnGoToCase")
    .addEventListener("click", () => {
      loadCase(0);
      showScreen(screenCase);
    });

  // CASO
  document
    .getElementById("btnAccuse")
    .addEventListener("click", handleAccusation);

  document
    .getElementById("btnBackToOffice")
    .addEventListener("click", () => {
      showScreen(screenOffice);
      document.getElementById("caseMeta").textContent =
        "Nenhum caso em andamento";
    });

  document
    .getElementById("btnNextCase")
    .addEventListener("click", goToNextCase);

  // Meta inicial
  updateCaseMeta();
});
